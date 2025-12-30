'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2, Receipt as ReceiptIcon, User, Phone, Package } from 'lucide-react';
import { createBill } from '@/lib/actions';
import { toast } from 'sonner';

export function BillForm({ luggageTypes }: { luggageTypes: any[] }) {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [items, setItems] = useState<{ id: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = (id: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customerName,
        customerMobile,
        items: items.map((item) => {
          const type = luggageTypes.find((t) => t.id === item.id);
          return {
            luggageTypeId: item.id,
            quantity: item.quantity,
            priceAtTime: type.base_price,
          };
        }),
      };
      await createBill(payload);
      toast.success('Bill generated successfully!');
      setCustomerName('');
      setCustomerMobile('');
      setItems([]);
    } catch (error) {
      toast.error('Failed to create bill');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptIcon className="w-5 h-5 text-primary" />
          New Deposit Entry
        </CardTitle>
        <CardDescription>Enter customer and luggage details for storage</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Name
              </Label>
              <Input
                required
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Mobile Number
              </Label>
              <Input
                required
                type="tel"
                placeholder="9876543210"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Select Luggage Types
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {luggageTypes.map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant="outline"
                  className="h-auto py-3 px-2 flex flex-col items-center text-xs gap-1 hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => addItem(type.id)}
                >
                  <span className="font-semibold text-sm">{type.name}</span>
                  <span className="text-muted-foreground">₹{type.base_price}/day</span>
                </Button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <Label>Selected Items</Label>
              <div className="space-y-2">
                {items.map((item) => {
                  const type = luggageTypes.find((t) => t.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border"
                    >
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-xs text-muted-foreground">₹{type.base_price} per unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-md bg-background">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
            {loading ? 'Generating Bill...' : 'Confirm Deposit & Generate Slip'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
