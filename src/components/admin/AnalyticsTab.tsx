import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Activity, Zap, Server } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "../AuthContext";

export function AnalyticsTab() {
  const { token } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [activeUsersToday, setActiveUsersToday] = useState<number | null>(null);
  const [promptsGenerated, setPromptsGenerated] = useState<number | null>(null);
  const [apiUsage, setApiUsage] = useState<number | null>(null);
  
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [promptUsageData, setPromptUsageData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error();
        const data = await response.json();

        setTotalUsers(data.totalUsers);
        setActiveUsersToday(data.activeUsersToday);
        setPromptsGenerated(data.promptsGenerated);
        setApiUsage(data.apiUsage);

        const users = data.users || [];
        const prompts = data.prompts || [];

        // Process Chart Data (Last 7 Days)
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          d.setHours(0, 0, 0, 0);
          return d;
        });

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const growthData = last7Days.map(day => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const usersOnDay = users.filter((user: any) => {
            if (!user.createdAt) return false;
            const createdAt = new Date(user.createdAt);
            return createdAt >= day && createdAt < nextDay;
          }).length;

          return {
            name: dayNames[day.getDay()],
            users: usersOnDay
          };
        });
        
        // Make user growth cumulative for better visualization
        let cumulativeUsers = 0;
        const cumulativeGrowthData = growthData.map(data => {
          cumulativeUsers += data.users;
          return { ...data, users: cumulativeUsers };
        });
        setUserGrowthData(cumulativeGrowthData);

        const usageData = last7Days.map(day => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const promptsOnDay = prompts.filter((prompt: any) => {
            if (!prompt.createdAt) return false;
            const createdAt = new Date(prompt.createdAt);
            return createdAt >= day && createdAt < nextDay;
          }).length;

          return {
            name: dayNames[day.getDay()],
            prompts: promptsOnDay
          };
        });
        setPromptUsageData(usageData);

      } catch (error) {
        console.error("Error fetching analytics stats:", error);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Users</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {totalUsers !== null ? totalUsers.toLocaleString() : "..."}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Registered accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Active Users (Today)</CardTitle>
            <Activity className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {activeUsersToday !== null ? activeUsersToday.toLocaleString() : "..."}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Logged in today</p>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Prompts Generated</CardTitle>
            <Zap className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {promptsGenerated !== null ? promptsGenerated.toLocaleString() : "..."}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total lifetime prompts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">API Usage</CardTitle>
            <Server className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {apiUsage !== null ? apiUsage.toLocaleString() : "..."}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total model requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#333', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">Prompt Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promptUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#333', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="prompts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
