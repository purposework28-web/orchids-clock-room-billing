'use server';

import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';

export type LuggageItem = {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
};

export async function getLuggageTypes() {
  const { data, error } = await supabase
    .from('luggage_types')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createBill(formData: {
  customerName: string;
  customerMobile: string;
  items: { luggageTypeId: string; quantity: number; priceAtTime: number }[];
}) {
  const { data: bill, error: billError } = await supabase
    .from('bills')
    .insert({
      customer_name: formData.customerName,
      customer_mobile: formData.customerMobile,
      status: 'unpaid',
    })
    .select()
    .single();

  if (billError) throw billError;

  const itemsToInsert = formData.items.map((item) => ({
    bill_id: bill.id,
    luggage_type_id: item.luggageTypeId,
    quantity: item.quantity,
    price_at_time: item.priceAtTime,
  }));

  const { error: itemsError } = await supabase.from('bill_items').insert(itemsToInsert);

  if (itemsError) throw itemsError;

  revalidatePath('/');
  return bill;
}

export async function collectLuggage(billId: string) {
  const { data: bill, error: fetchError } = await supabase
    .from('bills')
    .select('*, bill_items(*, luggage_types(*))')
    .eq('id', billId)
    .single();

  if (fetchError) throw fetchError;

  const collectionAt = new Date();
  const depositAt = new Date(bill.deposit_at);
  const diffInMs = collectionAt.getTime() - depositAt.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const billableDays = Math.max(1, Math.ceil(diffInHours / 24));

  let totalAmount = 0;
  bill.bill_items.forEach((item: any) => {
    totalAmount += billableDays * item.quantity * item.price_at_time;
  });

  const { error: updateError } = await supabase
    .from('bills')
    .update({
      collection_at: collectionAt.toISOString(),
      total_amount: totalAmount,
      status: 'paid',
    })
    .eq('id', billId);

  if (updateError) throw updateError;

  revalidatePath('/');
  return { ...bill, total_amount: totalAmount, collection_at: collectionAt };
}

export async function getRecentBills() {
  const { data, error } = await supabase
    .from('bills')
    .select('*, bill_items(*, luggage_types(*))')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function getAnalytics() {
  const { data: bills, error } = await supabase
    .from('bills')
    .select('total_amount, status, created_at')
    .eq('status', 'paid');

  if (error) throw error;

  const totalRevenue = bills.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = bills
    .filter(b => b.created_at.split('T')[0] === today)
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  return {
    totalRevenue,
    todayRevenue,
    totalBills: bills.length
  };
}
