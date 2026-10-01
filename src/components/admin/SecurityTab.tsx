import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

const initialLogs = [
  { id: 1, type: "Prompt Injection", user: "anonymous", date: "2026-04-10 10:23:45", severity: "critical", details: "Attempted to bypass system prompt instructions." },
  { id: 2, type: "Rate Limit", user: "user_8923", date: "2026-04-10 09:15:12", severity: "warning", details: "Exceeded 50 requests per minute." },
  { id: 3, type: "Failed Login", user: "admin_attempt", date: "2026-04-09 23:45:01", severity: "warning", details: "5 failed login attempts from IP 192.168.1.100." },
  { id: 4, type: "Suspicious Activity", user: "user_112", date: "2026-04-09 18:30:00", severity: "critical", details: "Multiple account creations from same IP." },
];

export function SecurityTab() {
  const [logs, setLogs] = useState(initialLogs);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Security & Abuse</h3>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">Demo Logs</span>
          </div>
          <p className="text-sm text-zinc-500">Monitor suspicious activities and violations (Simulated Environment).</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Warnings</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">14</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">System Status</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">Secure</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-base">Security Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Severity</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">User/IP</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 rounded-tr-lg">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${
                        log.severity === 'critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {log.severity === 'critical' ? <ShieldAlert className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{log.type}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-mono text-xs">{log.user}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{log.date}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
