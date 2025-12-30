import { BillForm } from '@/components/BillForm';
import { BillList } from '@/components/BillList';
import { AnalyticsCards } from '@/components/AnalyticsCards';
import { getLuggageTypes, getRecentBills, getAnalytics } from '@/lib/actions';
import { Package, Receipt, LayoutDashboard, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Page() {
  const [luggageTypes, recentBills, analytics] = await Promise.all([
    getLuggageTypes(),
    getRecentBills(),
    getAnalytics(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">ClockRoom.io</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Bus Stand Digital Billing</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-green-600">₹{analytics.todayRevenue}</span>
                <span className="text-[10px] text-muted-foreground uppercase">Today&apos;s Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Analytics Section */}
          <AnalyticsCards analytics={analytics} />

          {/* Main Content Tabs */}
          <Tabs defaultValue="new-bill" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="new-bill" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" /> New Bill
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new-bill" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <BillForm luggageTypes={luggageTypes} />
                </div>
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <h3 className="font-bold flex items-center gap-2 text-primary mb-2">
                      <LayoutDashboard className="w-4 h-4" /> Quick Info
                    </h3>
                    <ul className="text-sm space-y-3 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Base Pricing Slab</span>
                        <span className="font-semibold text-foreground">24 Hours</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Grace Period</span>
                        <span className="font-semibold text-foreground">15 Mins</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Late Fee</span>
                        <span className="font-semibold text-foreground">Next Day Rate</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Package className="w-24 h-24" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest opacity-60 mb-1">System Status</h4>
                    <p className="text-lg font-bold mb-4">Operational</p>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Connected to Cloud Storage
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <BillList bills={recentBills} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
