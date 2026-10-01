import { Shield, AlertOctagon } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UsersTab } from "./admin/UsersTab";
import { AnalyticsTab } from "./admin/AnalyticsTab";
import { TemplatesTab } from "./admin/TemplatesTab";
import { CommunityTab } from "./admin/CommunityTab";
import { SecurityTab } from "./admin/SecurityTab";
import { LogsTab } from "./admin/LogsTab";
import { ModelsTab } from "./admin/ModelsTab";
import { FeedbackTab } from "./admin/FeedbackTab";
import { NotificationsTab } from "./admin/NotificationsTab";

export function AdminPanel() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
        <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-500 mb-2">403 Access Denied</h2>
        <p className="text-sm text-zinc-400">
          You do not have administrative privileges to view or manage this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            Admin Dashboard
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your platform, users, and settings.</p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <div className="overflow-x-auto pb-2 mb-4">
          <TabsList className="w-full justify-start inline-flex min-w-max">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analytics" className="mt-0">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <UsersTab />
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="community" className="mt-0">
          <CommunityTab />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <LogsTab />
        </TabsContent>

        <TabsContent value="models" className="mt-0">
          <ModelsTab />
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <FeedbackTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
