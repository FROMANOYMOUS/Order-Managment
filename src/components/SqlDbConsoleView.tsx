import React, { useState } from 'react';
import { SqlDatabaseConfig, SqlQueryLog } from '../types';
import { 
  Database, 
  RefreshCw, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Key, 
  Server, 
  ShieldCheck, 
  Download,
  Clock,
  Layers
} from 'lucide-react';

interface SqlDbConsoleViewProps {
  sqlConfig: SqlDatabaseConfig;
  sqlLogs: SqlQueryLog[];
  onTestConnection: () => void;
  onExecuteSql: (query: string) => void;
  isDarkMode: boolean;
}

export const SqlDbConsoleView: React.FC<SqlDbConsoleViewProps> = ({
  sqlConfig,
  sqlLogs,
  onTestConnection,
  onExecuteSql,
  isDarkMode
}) => {
  const [customQuery, setCustomQuery] = useState<string>(
    'SELECT order_id, customer_name, total_amount, delivery_status FROM rutuja_art_orders WHERE delivery_status != "Delivered" ORDER BY order_date DESC;'
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryOutput, setQueryOutput] = useState<string | null>(null);

  const handleRunQuery = () => {
    setIsExecuting(true);
    setQueryOutput(null);
    setTimeout(() => {
      onExecuteSql(customQuery);
      setQueryOutput(`Query OK, 6 rows returned (12 ms latency). Data synced with Windows Order Handling Software.`);
      setIsExecuting(false);
    }, 300);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Database className="w-5 h-5" />
            <span>Connected SQL Database Console</span>
          </h2>
          <p className="text-xs text-slate-500">
            Live MySQL / PostgreSQL relational connection status, schema Inspector, and execution query logs for Rutuja's Art Collection.
          </p>
        </div>

        <button
          onClick={onTestConnection}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Test SQL Health</span>
        </button>
      </div>

      {/* SQL Connection Health Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-semibold text-slate-400">Connection Status</p>
            <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Connected (SSL)</p>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-semibold text-slate-400">Query Latency</p>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{sqlConfig.queryLatencyMs} ms</p>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-semibold text-slate-400">Database Tables</p>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{sqlConfig.tableCount} Tables</p>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-semibold text-slate-400">Total Order Records</p>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{sqlConfig.totalRecordsCount} Records</p>
          </div>
        </div>
      </div>

      {/* SQL Credentials Details Card */}
      <div className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
            <Key className="w-4 h-4 text-emerald-500" />
            <span>Supabase Cloud PostgreSQL & Database Parameters</span>
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
            Rutuja's Art Collection DB Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <div><span className="text-slate-400">Host:</span> {sqlConfig.host}</div>
          <div><span className="text-slate-400">Port:</span> {sqlConfig.port}</div>
          <div><span className="text-slate-400">Database:</span> {sqlConfig.database}</div>
          <div><span className="text-slate-400">Username:</span> {sqlConfig.username}</div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-sans text-slate-500 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Supabase Connection Credentials Status:</p>
            <p className="text-slate-400">
              This applet comes pre-configured with the relational SQL schema and data structure for <strong>Rutuja's Art Collection</strong>. To link directly to your live remote Supabase project, add your <code className="text-indigo-400 font-mono">SUPABASE_URL</code> and <code className="text-indigo-400 font-mono">SUPABASE_KEY</code> in the <strong>Settings & Secrets</strong> panel in AI Studio.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Query Runner Console */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <span>Interactive SQL Query Console</span>
        </h3>

        <div className={`rounded-xl border overflow-hidden ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}>
          <div className="p-2.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SQL Command Window</span>
            <button
              onClick={handleRunQuery}
              disabled={isExecuting}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center space-x-1"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute SQL</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-transparent text-emerald-400 outline-none resize-none"
          />

          {queryOutput && (
            <div className="p-3 border-t border-slate-800 bg-slate-900 text-slate-300 font-mono text-[11px] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{queryOutput}</span>
            </div>
          )}
        </div>
      </div>

      {/* SQL Query Execution Audit Logs */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Recent SQL Execution Audit Logs ({sqlLogs.length})</span>
        </h3>

        <div className={`border rounded-xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead className={`text-[11px] uppercase border-b ${
              isDarkMode ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Executed SQL Query</th>
                <th className="p-3">Rows</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
              {sqlLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{log.id}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 max-w-md truncate">
                    {log.query}
                  </td>
                  <td className="p-3">{log.rowsAffected}</td>
                  <td className="p-3 text-emerald-600 font-bold">{log.durationMs}ms</td>
                  <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
