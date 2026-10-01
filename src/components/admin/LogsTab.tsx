import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Terminal, ChevronDown, ChevronRight } from "lucide-react";

const initialLogs = [
  { id: 1, timestamp: "2026-04-10T11:45:22Z", level: "INFO", source: "API", message: "Successfully processed prompt generation request.", details: "Request ID: req_98765, Model: universal, Duration: 1.2s" },
  { id: 2, timestamp: "2026-04-10T11:42:10Z", level: "ERROR", source: "Database", message: "Connection timeout while fetching user profile.", details: "Error code: DB_TIMEOUT, Retries: 3" },
  { id: 3, timestamp: "2026-04-10T11:30:05Z", level: "WARN", source: "Auth", message: "Invalid token format received.", details: "Token signature verification failed." },
  { id: 4, timestamp: "2026-04-10T11:15:00Z", level: "INFO", source: "System", message: "Scheduled backup completed successfully.", details: "Size: 1.4GB, Duration: 45s" },
];

export function LogsTab() {
  const [logs, setLogs] = useState(initialLogs);
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);

  const toggleLog = (id: number) => {
    setExpandedLogs(prev => 
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">System Logs</h3>
          <p className="text-sm text-zinc-500">View detailed system events and errors.</p>
        </div>
      </div>

      <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
        <CardHeader className="border-b border-black/5 dark:border-white/5 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Live Log Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="divide-y divide-black/5 dark:divide-white/5 min-w-[600px]">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col">
                <div 
                  className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => toggleLog(log.id)}
                >
                  <div className="text-zinc-400">
                    {expandedLogs.includes(log.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 w-40 shrink-0">{log.timestamp}</div>
                  <div className="w-20 shrink-0">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                      log.level === 'ERROR' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                      log.level === 'WARN' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}>
                      {log.level}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 w-24 shrink-0">[{log.source}]</div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{log.message}</div>
                </div>
                {expandedLogs.includes(log.id) && (
                  <div className="p-4 pl-12 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
                    <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {log.details}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
