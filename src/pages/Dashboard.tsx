import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card } from '../components/ui/Card';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Users, Package, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, Filter, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { TimeFilter } from '../types';

export const Dashboard = () => {
  const { sales, inventory, branches, selectedBranchId, selectBranch } = useStore();
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('all');

  // Filtering Logic
  const filteredSalesByBranch = sales.filter(s => {
    const bId = s.branchId || 'main'; // Default legacy sales to main
    return bId === selectedBranchId;
  });
  
  const filteredSales = filteredSalesByBranch.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const now = new Date();
    
    if (timeFilter === 'today') {
      return saleDate.toDateString() === now.toDateString();
    }
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return saleDate >= weekAgo;
    }
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return saleDate >= monthAgo;
    }
    if (timeFilter === 'year') {
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return saleDate >= yearAgo;
    }
    return true; // 'all'
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItemsSold = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);
  const filteredInventory = inventory.filter(p => (p.branchId || 'main') === selectedBranchId);
  const lowStockCount = filteredInventory.filter(p => p.stock < 10).length;

  const getTimeLabel = () => {
    switch (timeFilter) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Last Year';
      default: return 'All Time';
    }
  };

  const stats = [
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', trend: '0.0%', isUp: true, subtext: getTimeLabel() },
    { label: 'Orders', value: filteredSales.length.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '0.0%', isUp: true, subtext: getTimeLabel() },
    { label: 'Units Sold', value: totalItemsSold.toString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '0.0%', isUp: true, subtext: getTimeLabel() },
    { label: 'Low Stock', value: lowStockCount.toString(), icon: Package, color: 'text-red-500', bg: 'bg-red-500/10', trend: '0.0%', isUp: false, subtext: 'Requiring Attention' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Helmet>
        <title>Dashboard | SteadiStock</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-text flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Building2 size={24} />
             </div>
             SteadiStock
          </h1>
          <p className="text-neutral-secondary font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Full Visibility for Every Branch</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" />
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none"
              >
                 <option value="all">ALL TIME</option>
                 <option value="today">TODAY</option>
                 <option value="week">LAST 7 DAYS</option>
                 <option value="month">LAST 30 DAYS</option>
                 <option value="year">LAST YEAR</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer border-0 shadow-xl shadow-black/5 ring-1 ring-black/5">
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] mb-1 truncate">{stat.label}</p>
                   <h3 className="text-2xl font-black text-neutral-text truncate">{stat.value}</h3>
                </div>
                <div className={cn('p-3 rounded-xl shrink-0', stat.bg, stat.color)}>
                   <stat.icon size={22} />
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <span className={cn('flex items-center text-xs font-bold px-2 py-0.5 rounded-full', stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                   {stat.isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                   {stat.trend}
                </span>
                <span className="text-[10px] font-medium text-neutral-secondary">{stat.subtext}</span>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Recent Sales" subtitle="Filtered transaction history" className="lg:col-span-2">
          <div className="mt-4 space-y-4">
            {filteredSales.length === 0 ? (
              <div className="text-center py-12">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                   <Clock size={32} />
                 </div>
                 <p className="text-neutral-secondary font-medium">No transactions found for this filter.</p>
              </div>
            ) : (
              filteredSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="p-4 rounded-xl hover:bg-gray-50 flex items-center justify-between gap-4 border border-transparent hover:border-gray-100 transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 italic">
                          {sale.items[0]?.image ? (
                             <img src={sale.items[0].image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                <Package size={16} />
                             </div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-neutral-text truncate uppercase tracking-tight">
                             {sale.items.map(item => item.name).join(', ')}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] text-neutral-secondary font-black uppercase tracking-widest mt-0.5">
                             <span>{new Date(sale.timestamp).toLocaleDateString()}</span>
                             <span className="opacity-20 text-[6px]">●</span>
                             <span className="text-primary/80">{sale.paymentMethod}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-sm font-black text-neutral-text tracking-tighter">{formatCurrency(sale.total)}</p>
                       <p className="text-[9px] text-neutral-secondary font-bold uppercase tracking-widest leading-none mt-1">{sale.items.length} units</p>
                    </div>
                 </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Inventory Overview" subtitle="Quick stock status check">
           <div className="mt-4 space-y-6">
              <div className="space-y-1">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                    <span className="text-neutral-secondary">In Stock Items</span>
                    <span className="text-neutral-text">{filteredInventory.length}</span>
                 </div>
                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: inventory.length > 0 ? `${(filteredInventory.length / inventory.length) * 100}%` : '0%' }} />
                 </div>
              </div>
              
              <div className="pt-2 border-t border-gray-50">
                <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest mb-3">Top Products</p>
                <div className="space-y-4">
                   {filteredInventory.slice(0, 3).map((product) => (
                     <div key={product.id} className="flex items-center gap-3">
                        <img src={product.image} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-neutral-text truncate">{product.name}</p>
                           <p className="text-[10px] text-neutral-secondary">{product.stock} units left</p>
                        </div>
                        <div className="h-1.5 w-12 bg-gray-100 rounded-full">
                           <div className={cn('h-full rounded-full', product.stock < 10 ? 'bg-red-500' : 'bg-success')} style={{ width: `${Math.min(product.stock * 2, 100)}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};
