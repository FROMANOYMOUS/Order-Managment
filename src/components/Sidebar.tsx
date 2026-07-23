import React from 'react';
import { 
  Package, 
  Truck, 
  XCircle, 
  Users, 
  Database, 
  BarChart3, 
  Printer, 
  Palette,
  ShieldCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export type TabType = 'orders' | 'whatsapp' | 'delivery' | 'cancellations' | 'customers' | 'sql_db' | 'analytics' | 'print';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingCancellationsCount: number;
  pendingDeliveriesCount: number;
  unconfirmedWhatsAppCount?: number;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCancellationsCount,
  pendingDeliveriesCount,
  unconfirmedWhatsAppCount = 0,
  isDarkMode
}) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'orders',
      label: 'Orders Master',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Orders',
      icon: <MessageSquare className="w-4 h-4 text-emerald-500" />,
      badge: unconfirmedWhatsAppCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold animate-pulse'
    },
    {
      id: 'delivery',
      label: 'Delivery Status Engine',
      icon: <Truck className="w-4 h-4" />,
      badge: pendingDeliveriesCount,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
    },
    {
      id: 'cancellations',
      label: 'Cancellation Desk',
      icon: <XCircle className="w-4 h-4" />,
      badge: pendingCancellationsCount,
      badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold animate-pulse'
    },
    {
      id: 'customers',
      label: 'Customer Directory',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'sql_db',
      label: 'Connected SQL DB',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analytics & Revenue',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'print',
      label: 'Invoice & Tags',
      icon: <Printer className="w-4 h-4" />
    }
  ];

  return (
    <aside className={`w-16 md:w-60 shrink-0 border-r flex flex-col justify-between transition-colors select-none ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-300'
    }`}>
      {/* Navigation menu list */}
      <div className="p-2 space-y-1">
        <div className="hidden md:block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Order Management Console
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {item.icon}
                </span>
                <span className="hidden md:inline truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono border ${item.badgeColor || 'bg-slate-500/20 text-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="hidden md:inline w-3.5 h-3.5 opacity-70" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer info box in navigation bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 hidden md:block">
        <div className={`p-2.5 rounded-lg text-[11px] border ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/60 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center space-x-1.5 font-medium text-slate-900 dark:text-slate-100 mb-1">
            <Palette className="w-3.5 h-3.5 text-rose-500" />
            <span>Rutuja's Art Studio</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Connected to MySQL server for order delivery status & cancellation approvals.
          </p>
        </div>
      </div>
    </aside>
  );
};
