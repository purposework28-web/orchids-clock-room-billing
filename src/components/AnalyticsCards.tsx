'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Package, Wallet } from 'lucide-react';

export function AnalyticsCards({ analytics }: { analytics: any }) {
  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${analytics.todayRevenue}`,
      description: "Collection from today",
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue}`,
      description: "Lifetime earnings",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Total Bills",
      value: analytics.totalBills,
      description: "Total customers served",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="glass-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
