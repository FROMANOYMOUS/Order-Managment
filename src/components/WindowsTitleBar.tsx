import React from 'react';
import { 
  Palette, 
  Database, 
  RefreshCw, 
  Search, 
  Plus, 
  Minus, 
  Square, 
  X, 
  Bell, 
  Sparkles,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { SqlDatabaseConfig } from '../types';

interface WindowsTitleBarProps {
  sqlConfig: SqlDatabaseConfig;
  onRefresh: () => void;
  onOpenNewOrder: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSyncing: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  activeTabTitle: string;
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  sqlConfig,
  onRefresh,
  onOpenNewOrder,
  searchQuery,
  setSearchQuery,
  isSyncing,
  isDarkMode,
  setIsDarkMode,
  activeTabTitle
}) => {
  return (
    <div className={`select-none border-b flex flex-col sm:flex-row items-center justify-between px-3 py-1.5 transition-colors ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-slate-100 border-slate-300 text-slate-800'
    }`}>
      {/* Left: Window Icon, App Name & Title */}
      <div className="flex items-center space-x-2.5 w-full sm:w-auto mb-1 sm:mb-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 text-white shadow-sm font-semibold">
          <Palette className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Rutuja's Art Collection
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium border border-indigo-500/20">
              Windows Order Console v2.4
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <span>{activeTabTitle}</span>
            <span>•</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
              <ShieldCheck className="w-3 h-3 inline mr-0.5" />
              SQL Connected
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Quick Search & Sync */}
      <div className="flex items-center space-x-2 w-full sm:w-auto my-1 sm:my-0 max-w-md">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Painting, Courier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1 rounded-md text-xs font-medium border outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-indigo-500' 
                : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 shadow-inner'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              ×
            </button>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isSyncing}
          title="Manual SQL Database Sync"
          className={`p-1.5 rounded-md border text-xs font-medium flex items-center space-x-1 transition-all ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' 
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-500' : 'text-slate-500'}`} />
          <span className="hidden md:inline text-[11px]">Sync SQL</span>
        </button>

        <button
          onClick={onOpenNewOrder}
          className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white rounded-md text-xs font-medium flex items-center space-x-1 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-[11px]">New Order</span>
        </button>
      </div>

      {/* Right: Theme Toggle & Simulated Windows Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Windows Dark/Light Theme"
          className={`p-1.5 rounded-md border transition-colors ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-300 text-indigo-600'
          }`}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Windows Window Controls */}
        <div className="flex items-center pl-2 border-l border-slate-300 dark:border-slate-800 space-x-1">
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500" title="Minimize">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500" title="Maximize">
            <Square className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-rose-500 hover:text-white rounded text-slate-500 transition-colors" title="Close Application">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
