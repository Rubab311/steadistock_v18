import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, ShieldCheck, HelpCircle, ChevronLeft, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../context/StoreContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingCart, label: 'POS System', path: '/pos' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

const QUICK_LINKS = [
  { icon: HelpCircle, label: 'Help Center', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useStore();

  return (
    <>
      {/* Overlay for mobile/sidebar open state */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-40 flex flex-col shrink-0 overflow-hidden",
        isCollapsed
          ? "w-0 -translate-x-full lg:translate-x-0 lg:w-0 border-none"
          : "w-64 translate-x-0 bg-white border-r border-gray-200"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-50 h-[100px] shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-text tracking-tight">SteadiStock</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">POS Systems</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-[11px] font-black text-neutral-secondary uppercase tracking-widest mb-2">Main Menu</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-neutral-secondary hover:bg-primary/5 hover:text-primary'
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-8 space-y-1">
             <p className="px-4 text-[11px] font-black text-neutral-secondary uppercase tracking-widest mb-2">Support</p>
             {QUICK_LINKS.map((item) => (
               <NavLink
                 key={item.path}
                 to={item.path}
                 className={({ isActive }) => cn(
                   'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                   isActive ? 'bg-primary/10 text-primary' : 'text-neutral-secondary hover:bg-gray-50'
                 )}
               >
                 <item.icon size={20} className="shrink-0" />
                 <span className="font-bold text-sm tracking-tight">{item.label}</span>
               </NavLink>
             ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-neutral-text truncate">{user?.name}</p>
                <p className="text-[10px] text-neutral-secondary uppercase font-bold tracking-wider">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 font-bold"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
