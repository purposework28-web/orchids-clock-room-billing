'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, CheckCircle2, MoreVertical, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { collectLuggage } from '@/lib/actions';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function BillList({ bills }: { bills: any[] }) {
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const filteredBills = bills.filter(
    (bill) =>
      bill.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      bill.customer_mobile.includes(search) ||
      bill.bill_number.toString().includes(search)
  );

  const handleCollect = async (billId: string) => {
    setProcessing(billId);
    try {
      await collectLuggage(billId);
      toast.success('Luggage collected and payment processed');
    } catch (error) {
      toast.error('Collection failed');
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Storage History & Active Bills
            </CardTitle>
            <CardDescription>Track and manage luggage collections</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bills..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Deposit Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-bold">#{bill.bill_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{bill.customer_name}</span>
                      <span className="text-xs text-muted-foreground">{bill.customer_mobile}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span>{format(new Date(bill.deposit_at), 'dd MMM yyyy')}</span>
                      <span className="text-muted-foreground">{format(new Date(bill.deposit_at), 'HH:mm')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bill.bill_items.map((item: any, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                          {item.quantity}x {item.luggage_types.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {bill.status === 'paid' ? (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">
                        <Clock className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {bill.status === 'unpaid' ? (
                      <Button
                        size="sm"
                        onClick={() => handleCollect(bill.id)}
                        disabled={processing === bill.id}
                      >
                        {processing === bill.id ? '...' : 'Collect'}
                      </Button>
                    ) : (
                      <div className="flex justify-end items-center gap-2">
                         <span className="text-sm font-bold">₹{bill.total_amount}</span>
                         <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Receipt className="w-4 h-4" />
                         </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No bills found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
