import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';
import { Sidebar } from '../components/layout/Sidebar';
import { Menu, Building2, ShieldCheck } from 'lucide-react';

// Pages
import { Dashboard } from '../pages/Dashboard';
import { Inventory } from '../pages/Inventory';
import { POS } from '../pages/POS';
import { Reports } from '../pages/Reports';
import { Login } from '../pages/Login';
import { Settings } from '../pages/Settings';
import { Help } from '../pages/Help';
import { Policy } from '../pages/Policy';

export const AppRoutes = () => {
  const { user, selectedBranchId } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Theme Sync Effect
  React.useEffect(() => {
    if (user?.preferences?.theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [user?.preferences?.theme]);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-soft overflow-x-hidden">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className="flex-1 min-w-0 transition-all duration-300">
        {/* Top Header with Hamburger */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-xl text-neutral-secondary transition-colors"
                title="Toggle Sidebar"
              >
                 <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105 duration-300">
                    <ShieldCheck size={18} />
                 </div>
                 <span className="text-sm font-black text-neutral-text uppercase tracking-tight hidden sm:block">SteadiStock</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-0.5 rounded-lg border border-gray-100 flex items-center">
                 <Building2 className="ml-2 text-neutral-secondary" size={14} />
                 <select 
                   value={selectedBranchId || 'main'}
                   onChange={(e) => useStore().selectBranch(e.target.value)}
                   className="bg-transparent text-[10px] font-black uppercase tracking-widest py-1.5 px-2 focus:outline-none"
                 >
                    {useStore().branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                 </select>
              </div>
           </div>
        </header>

        <div className="py-4 px-4 lg:py-8 lg:px-8 pb-10 lg:pb-10">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/policies/:type" element={<Policy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </main>
  </div>
);
};
