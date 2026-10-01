import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Reply, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../AuthContext";

export function FeedbackTab() {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackToReply, setFeedbackToReply] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "resolved">("all");

  useEffect(() => {
    fetchFeedbacks();
  }, [token]);

  const fetchFeedbacks = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/feedback', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const feedbackData = await response.json();
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/feedback/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolved: true, read: true })
      });
      if (!response.ok) throw new Error();
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, resolved: true, read: true } : f));
    } catch (error) {
      console.error("Error resolving feedback:", error);
    }
  };

  const toggleReadStatus = async (feedback: any) => {
    if (!token) return;
    const newReadStatus = !feedback.read;
    try {
      const response = await fetch(`/api/admin/feedback/${feedback.id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: newReadStatus })
      });
      if (!response.ok) throw new Error();
      setFeedbacks(feedbacks.map(f => f.id === feedback.id ? { ...f, read: newReadStatus } : f));
    } catch (error) {
      console.error("Error updating read status:", error);
    }
  };

  const handleReply = (feedback: any) => {
    setFeedbackToReply(feedback);
    setReplyMessage("");
    if (!feedback.read) {
      toggleReadStatus(feedback);
    }
  };

  const sendReply = async () => {
    if (!feedbackToReply || !replyMessage.trim() || !token) return;
    
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackToReply.id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolved: true, read: true })
      });
      if (!response.ok) throw new Error();
      setFeedbacks(feedbacks.map(f => f.id === feedbackToReply.id ? { ...f, resolved: true, read: true } : f));
      setFeedbackToReply(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === "all") return true;
    if (filter === "resolved") return f.resolved;
    if (filter === "read") return f.read && !f.resolved;
    if (filter === "unread") return !f.read && !f.resolved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Feedback & Support</h3>
          <p className="text-sm text-zinc-500">Manage user feedback, bug reports, and feature requests.</p>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "unread" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "read" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "resolved" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-zinc-500">Loading feedback...</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="py-8 text-center text-zinc-500">No feedback found for this filter.</div>
      ) : (
        <div className="grid gap-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className={`bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 transition-all ${feedback.resolved ? 'opacity-60' : ''} ${!feedback.read && !feedback.resolved ? 'border-l-4 border-l-indigo-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                        feedback.type === 'Bug Report' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                        feedback.type === 'Feature Request' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {feedback.type}
                      </span>
                      <span className="text-xs text-zinc-500">{feedback.date}</span>
                      {!feedback.read && !feedback.resolved && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-900 dark:text-white font-medium">{feedback.user}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{feedback.message}</p>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    {!feedback.resolved && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-500" onClick={() => toggleReadStatus(feedback)} title={feedback.read ? "Mark as unread" : "Mark as read"}>
                          {feedback.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="border-black/10 dark:border-white/10" onClick={() => handleReply(feedback)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm" className="border-black/10 dark:border-white/10 text-green-600 dark:text-green-400 hover:bg-green-500/10" onClick={() => markResolved(feedback.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </>
                    )}
                    {feedback.resolved && (
                      <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!feedbackToReply} onOpenChange={(open) => !open && setFeedbackToReply(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Reply to Feedback</DialogTitle>
            <DialogDescription>
              Send a response to {feedbackToReply?.user}. This will also mark the feedback as resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <p className="text-xs text-zinc-500 mb-1">Original Message:</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"{feedbackToReply?.message}"</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900 dark:text-white">Your Reply</label>
              <Textarea 
                value={replyMessage} 
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response here..."
                className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackToReply(null)} className="border-black/10 dark:border-white/10">Cancel</Button>
            <Button onClick={sendReply} className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!replyMessage.trim()}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
