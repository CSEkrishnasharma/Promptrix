import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Send, Bell, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";

export function NotificationsTab() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = () => {
    if (!title || !message) return;
    // In a real app, this would call an API
    console.log("Sending notification:", { title, message, audience });
    setTitle("");
    setMessage("");
    setShowSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Notification System</h3>
          <p className="text-sm text-zinc-500">Send announcements and updates to users.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-base">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Target Audience</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="active">Active Users (Last 30 days)</option>
                <option value="premium">Premium Users</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
              <Input 
                placeholder="Announcement Title" 
                className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
              <Textarea 
                placeholder="Type your message here..." 
                className="min-h-[150px] bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSend} disabled={!title || !message}>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>How it will appear to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0a0a0f] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-500 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                    {title || "Notification Title"}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {message || "The notification message will appear here. It supports multiple lines of text to convey your announcement."}
                  </p>
                  <span className="text-[10px] text-zinc-400 mt-2 block">Just now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10 text-center">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl">Notification Sent</DialogTitle>
            <DialogDescription className="text-center">
              Your notification has been successfully sent to the selected audience.
            </DialogDescription>
            <Button onClick={() => setShowSuccess(false)} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
