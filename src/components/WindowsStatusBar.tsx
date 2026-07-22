import React from 'react';
import { Database, ShieldCheck, Cpu, Clock, User, AlertCircle, HardDrive } from 'lucide-react';
import { SqlDatabaseConfig } from '../types';

interface WindowsStatusBarProps {
  sqlConfig: SqlDatabaseConfig;
  totalOrders: number;
  pendingCancellations: number;
  isDarkMode: boolean;
}

export const WindowsStatusBar: React.FC<WindowsStatusBarProps> = ({
  sqlConfig,
  totalOrders,
  pendingCancellations,
  isDarkMode
}) => {
  return (
    <div className={`select-none border-t px-3 py-1 text-[11px] font-mono flex flex-wrap items-center justify-between transition-colors ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800 text-slate-400' 
        : 'bg-slate-200 border-slate-300 text-slate-600'
    }`}>
      {/* Left side: Database Connection status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Database className="w-3.5 h-3.5" />
          <span className="font-semibold">{sqlConfig.host}</span>
        </div>

        <div className="hidden md:flex items-center space-x-1 text-slate-500">
          <Cpu className="w-3 h-3" />
          <span>Latency: {sqlConfig.queryLatencyMs}ms</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1 text-slate-500">
          <HardDrive className="w-3 h-3" />
          <span>Tables: {sqlConfig.tableCount}</span>
        </div>
      </div>

      {/* Center: Cancellation alerts */}
      {pendingCancellations > 0 ? (
        <div className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-medium border border-rose-500/20">
          <AlertCircle className="w-3 h-3 animate-bounce" />
          <span>{pendingCancellations} Pending Cancellation Confirmation Request{pendingCancellations > 1 ? 's' : ''}</span>
        </div>
      ) : (
        <div className="hidden sm:flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>All SQL Order Sync Pipelines Active</span>
        </div>
      )}

      {/* Right side: App info & user */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Last Sync: {new Date(sqlConfig.lastSyncTime).toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
          <User className="w-3 h-3 text-indigo-500" />
          <span>Admin: Rutuja V.</span>
        </div>
      </div>
    </div>
  );
};
