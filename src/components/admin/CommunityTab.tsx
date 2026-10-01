import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Trash2, Star, Flag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useAuth } from "../AuthContext";

export function CommunityTab() {
  const { token } = useAuth();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState<any>(null);

  useEffect(() => {
    fetchPrompts();
  }, [token]);

  const fetchPrompts = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/community', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const promptsData = await response.json();
      setPrompts(promptsData);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/community/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error();
      setPrompts(prompts.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) {
      console.error("Error updating prompt status:", error);
    }
  };

  const handleToggleFeature = async (prompt: any) => {
    if (!token) return;
    const newFeatured = !prompt.featured;
    try {
      const response = await fetch(`/api/admin/community/${prompt.id}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: newFeatured })
      });
      if (!response.ok) throw new Error();
      setPrompts(prompts.map(p => p.id === prompt.id ? { ...p, featured: newFeatured } : p));
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  const confirmDeletePrompt = (prompt: any) => {
    setPromptToDelete(prompt);
  };

  const handleDeletePrompt = async () => {
    if (!promptToDelete || !token) return;
    try {
      const response = await fetch(`/api/admin/community/${promptToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      setPrompts(prompts.filter(p => p.id !== promptToDelete.id));
      setPromptToDelete(null);
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Community Moderation</h3>
          <p className="text-sm text-zinc-500">Review and moderate public prompts.</p>
        </div>
      </div>

      <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-base">Public Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-zinc-500">Loading prompts...</div>
          ) : prompts.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">No prompts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-black/5 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Prompt Title</th>
                    <th className="px-4 py-3">Author ID</th>
                    <th className="px-4 py-3">Upvotes</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prompts.map((prompt) => (
                    <tr key={prompt.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white flex items-center gap-2 max-w-[200px] truncate">
                        {prompt.flagged && <Flag className="w-3 h-3 text-red-500 shrink-0" />}
                        {prompt.featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />}
                        <span className="truncate">{prompt.title}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-mono text-xs truncate max-w-[150px]">{prompt.author}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{prompt.upvotes}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prompt.status === 'approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          prompt.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {prompt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {prompt.status !== 'approved' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-green-500" title="Approve" onClick={() => handleUpdateStatus(prompt.id, 'approved')}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {prompt.status !== 'rejected' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" title="Reject" onClick={() => handleUpdateStatus(prompt.id, 'rejected')}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className={`h-8 w-8 ${prompt.featured ? 'text-yellow-500' : 'text-zinc-500 hover:text-yellow-500'}`} title="Feature" onClick={() => handleToggleFeature(prompt)}>
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" title="Delete" onClick={() => confirmDeletePrompt(prompt)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!promptToDelete} onOpenChange={(open) => !open && setPromptToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setPromptToDelete(null)} className="border-black/10 dark:border-white/10">Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePrompt} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
