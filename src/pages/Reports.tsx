import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card } from '../components/ui/Card';
import { Helmet } from 'react-helmet-async';
import { formatCurrency, cn } from '../lib/utils';
import { BarChart, PieChart, Calendar, Download, TrendingUp, DollarSign, Package, ShoppingCart, Printer } from 'lucide-react';

export const Reports = () => {
  const { sales, inventory, selectedBranchId, branches } = useStore();

  const filteredSales = sales.filter(s => (s.branchId || 'main') === selectedBranchId);
  const currentBranchName = branches.find(b => b.id === selectedBranchId)?.name || 'Main Branch';

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const avgOrderValue = filteredSales.length === 0 ? 0 : totalRevenue / filteredSales.length;
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const summaryHtml = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
        <div style="padding: 15px; background: #f8fafc; border-radius: 10px;">
          <small style="text-transform: uppercase; font-weight: 900; color: #64748b; font-size: 10px;">Total Revenue</small>
          <div style="font-size: 20px; font-weight: 900;">${formatCurrency(totalRevenue)}</div>
        </div>
        <div style="padding: 15px; background: #f8fafc; border-radius: 10px;">
          <small style="text-transform: uppercase; font-weight: 900; color: #64748b; font-size: 10px;">Orders Completed</small>
          <div style="font-size: 20px; font-weight: 900;">${filteredSales.length}</div>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>SteadiStock - Analytics Report</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; line-height: 1.5; }
            .header-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 4px solid #FF8C00; padding-bottom: 20px; }
            .header h1 { margin: 0; font-weight: 900; font-size: 28px; letter-spacing: -1px; color: #0f172a; }
            .header-right { text-align: right; }
            .header-right p { margin: 0; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f1f5f9; padding: 12px; font-size: 11px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="header">
              <h1>STEADISTOCK ANALYTICS</h1>
              <p style="margin: 5px 0; font-weight: bold; font-size: 14px; color: #FF8C00;">${currentBranchName.toUpperCase()} DATA</p>
            </div>
            <div class="header-right">
              <p>Generated On</p>
              <p style="font-size: 12px; color: #0f172a; margin-top: 4px;">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          ${summaryHtml}
          <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Method</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSales.map(s => `
                <tr>
                  <td>${s.id}</td>
                  <td>${new Date(s.timestamp).toLocaleDateString()}</td>
                  <td>${s.paymentMethod}</td>
                  <td style="text-align: right; font-weight: bold;">${formatCurrency(s.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrintInvoice = (sale: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = sale.items.map((item: any) => `
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <span style="flex: 1; font-weight: 500;">${item.name} <small style="color: #64748b;">(x${item.quantity})</small></span>
        <span style="font-weight: 900;">${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${sale.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; line-height: 1.4; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-weight: 900; color: #FF8C00; font-size: 40px; italic; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; font-size: 12px; }
            .total-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 40px; text-align: right; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SteadiStock</h1>
            <p style="text-transform: uppercase; font-weight: 900; letter-spacing: 2px; font-size: 10px; margin-top: 5px;">Commercial Invoice</p>
          </div>
          <div class="info-grid">
            <div>
              <p style="font-weight: 900; color: #64748b; text-transform: uppercase; font-size: 10px; margin: 0;">Transaction ID</p>
              <p style="font-weight: bold; margin: 0;">${sale.id}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 900; color: #64748b; text-transform: uppercase; font-size: 10px; margin: 0;">Date/Time</p>
              <p style="font-weight: bold; margin: 0;">${new Date(sale.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <p style="font-weight: 900; color: #64748b; text-transform: uppercase; font-size: 10px; margin-bottom: 15px;">Order Details</p>
            ${itemsHtml}
          </div>
          <div class="total-box">
            <span style="font-weight: 900; color: #64748b; text-transform: uppercase; font-size: 12px; margin-right: 15px;">Final Amount</span>
            <span style="font-weight: 900; font-size: 24px; color: #0f172a;">${formatCurrency(sale.total)}</span>
            <p style="font-size: 10px; font-weight: bold; color: #10B981; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Paid via ${sale.paymentMethod}</p>
          </div>
          <p style="text-align: center; font-size: 10px; font-weight: bold; color: #94a3b8; margin-top: 60px; text-transform: uppercase; letter-spacing: 1px;">Thank you for your business</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Categorized sales calculation
  const salesByCategory: Record<string, number> = {};
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      salesByCategory[item.category] = (salesByCategory[item.category] || 0) + (item.price * item.quantity);
    });
  });

  const topCategories = Object.entries(salesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Helmet>
        <title>Business Reports | SteadiStock</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-text">Analytics & Reports</h1>
          <p className="text-neutral-secondary font-medium mt-1">Detailed breakdown of your financial and stock performance.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-neutral-text font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
        >
          <Printer size={16} />
          <span>PRINT REPORT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-primary' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Total Invoices', value: filteredSales.length, icon: Calendar, color: 'text-blue-500' },
          { label: 'Inventory Value', value: formatCurrency(inventory.filter(p => (p.branchId || 'main') === selectedBranchId).reduce((sum, p) => sum + (p.price * p.stock), 0)), icon: Package, color: 'text-orange-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
             <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl bg-gray-50', stat.color)}>
                   <stat.icon size={22} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em]">{stat.label}</p>
                   <h3 className="text-xl font-black text-neutral-text leading-none mt-1">{stat.value}</h3>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card title="Sales by Category" subtitle="Revenue distribution across product lines">
            <div className="mt-6 space-y-6">
               {topCategories.length === 0 ? (
                 <div className="py-12 text-center text-gray-400 font-medium">No sales data available yet.</div>
               ) : (
                 topCategories.map(([category, amount]) => (
                   <div key={category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                         <span className="text-neutral-secondary">{category}</span>
                         <span className="text-neutral-text">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary rounded-full transition-all duration-1000" 
                           style={{ width: `${(amount / totalRevenue) * 100}%` }} 
                         />
                      </div>
                   </div>
                 ))
               )}
            </div>
         </Card>

         <Card title="Payment Method Mix" subtitle="Customer preference breakdown">
            <div className="mt-6 flex flex-col items-center justify-center py-6">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-sm">
          {['Cash on Delivery', 'Card'].map(method => {
                    const count = filteredSales.filter(s => s.paymentMethod === method).length;
                    const percentage = filteredSales.length === 0 ? 0 : (count / filteredSales.length) * 100;
                    return (
                      <div key={method} className="text-center space-y-3">
                         <div className="relative inline-flex items-center justify-center">
                            <svg className="w-16 h-16 transform -rotate-90">
                               <circle 
                                 cx="32" cy="32" r="28" 
                                 stroke="currentColor" 
                                 strokeWidth="6" 
                                 fill="transparent" 
                                 className="text-gray-100"
                               />
                               <circle 
                                 cx="32" cy="32" r="28" 
                                 stroke="currentColor" 
                                 strokeWidth="6" 
                                 fill="transparent" 
                                 strokeDasharray={175.9}
                                 strokeDashoffset={175.9 - (175.9 * percentage) / 100}
                                 strokeLinecap="round"
                                 className="text-primary transition-all duration-1000"
                               />
                            </svg>
                            <span className="absolute text-[10px] font-black">{Math.round(percentage)}%</span>
                         </div>
                         <p className="text-[10px] font-black text-neutral-secondary uppercase tracking-widest leading-tight">{method}</p>
                      </div>
                    );
                  })}
               </div>
            </div>
         </Card>
      </div>

      <Card title="Complete Transaction Audit" subtitle="All-time chronological sales logs">
         <div className="overflow-x-auto mt-4">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em]">
                     <th className="px-6 py-4 min-w-[140px]">Transaction ID</th>
                     <th className="px-6 py-4 min-w-[100px]">Status</th>
                     <th className="px-6 py-4 min-w-[160px]">Customer</th>
                     <th className="px-6 py-4 min-w-[120px]">Payment</th>
                     <th className="px-6 py-4 text-right min-w-[120px]">Total Amount</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4">
                          <p className="text-xs font-black text-neutral-text">{sale.id}</p>
                          <p className="text-[9px] text-neutral-secondary font-bold uppercase">{new Date(sale.timestamp).toLocaleString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest">PAID</span>
                       </td>
                       <td className="px-6 py-4 text-xs font-bold text-neutral-text">
                          {sale.customerName || 'Anonymous Guest'}
                       </td>
                       <td className="px-6 py-4 text-xs font-bold text-neutral-secondary">
                          {sale.paymentMethod}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-neutral-text">{formatCurrency(sale.total)}</p>
                          <p className="text-[9px] text-neutral-secondary font-bold uppercase tracking-widest">{sale.items.length} items</p>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handlePrintInvoice(sale)}
                            className="p-2 text-neutral-secondary hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
                            title="Print Invoice"
                          >
                             <Printer size={16} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};
