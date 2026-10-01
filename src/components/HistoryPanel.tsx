import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Clock, Star, ArrowRight, Wand2, Compass, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

interface HistoryPanelProps {
  onSelectPrompt: (prompt: any) => void;
  onNavigate: (view: "landing" | "studio" | "history" | "login" | "signup" | "admin" | "demo" | "discover" | "humaniser") => void;
}

export function HistoryPanel({ onSelectPrompt, onNavigate }: HistoryPanelProps) {
  const { user, token } = useAuth();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/prompts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prompt history.');
        }

        const data = await response.json();
        setHistoryItems(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching history from MongoDB:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, token]);

  const handleToggleFavorite = async (e: React.MouseEvent, itemId: string, currentFav: boolean) => {
    e.stopPropagation();
    if (!token) return;
    const newFav = !currentFav;
    try {
      const response = await fetch(`/api/prompts/${itemId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isFavorite: newFav })
      });
      if (response.ok) {
        setHistoryItems(prev => prev.map(item => item.id === itemId ? { ...item, isFavorite: newFav } : item));
      } else {
        throw new Error('Failed to update favorite status.');
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error toggling favorite:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (!token) return;
    if (confirm("Are you sure you want to delete this prompt from your history?")) {
      try {
        const response = await fetch(`/api/prompts/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setHistoryItems(prev => prev.filter(item => item.id !== itemId));
        } else {
          throw new Error('Failed to delete prompt.');
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error("Error deleting prompt:", error);
        alert("Failed to delete the prompt. Please try again.");
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredItems = historyItems.filter((item) => {
    const inputMatch = item.input?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const masterMatch = item.masterPrompt?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const useCaseMatch = item.controls?.useCase?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const toneMatch = item.controls?.tone?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return inputMatch || masterMatch || useCaseMatch || toneMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Prompt History</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Access, reuse, and manage your previously generated prompts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">Retrieving neural archives...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-zinc-200 dark:border-zinc-800/50 rounded-3xl bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Wand2 className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {searchQuery ? "No matching records found" : "Your history is a blank canvas"}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
            {searchQuery 
              ? "We couldn't find any prompts matching your query. Try broadening your terms." 
              : "You haven't generated any master prompts yet. Head over to the Studio to start crafting high-converting AI outputs."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => onNavigate("studio")} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12">
              <Wand2 className="w-4 h-4 mr-2" />
              Go to Studio
            </Button>
            <Button onClick={() => onNavigate("discover")} variant="outline" className="rounded-full px-8 h-12 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Compass className="w-4 h-4 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              onClick={() => onSelectPrompt(item)}
              className="group hover:border-indigo-500/50 transition-all cursor-pointer bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] flex flex-col justify-between"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => handleToggleFavorite(e, item.id, !!item.isFavorite)}
                        className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${item.isFavorite ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-600 hover:text-amber-500'}`}
                      >
                        <Star className="w-4 h-4" fill={item.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1.5 rounded-full text-zinc-400 dark:text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.input}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Prompt Config Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.controls?.useCase && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 uppercase tracking-wider font-mono">
                        {item.controls.useCase}
                      </span>
                    )}
                    {item.controls?.tone && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10 uppercase tracking-wider font-mono">
                        {item.controls.tone}
                      </span>
                    )}
                    {item.controls?.complexity && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/10 uppercase tracking-wider font-mono">
                        {item.controls.complexity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-[10px] uppercase font-mono text-zinc-500">
                      {item.controls?.targetModel || "universal"}
                    </span>
                    <span className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      Use in Studio
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
