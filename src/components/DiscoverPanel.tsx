import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, TrendingUp, Clock, Star, Copy, CheckCircle2, ThumbsUp, MessageSquare } from "lucide-react";

const MOCK_PROMPTS = [
  {
    id: 1,
    title: "Ultimate SaaS Landing Page Copy",
    author: "@growth_hacker",
    category: "Marketing",
    upvotes: 1240,
    time: "2h ago",
    content: "[ROLE] Act as a world-class SaaS copywriter...\n[OBJECTIVE] Write a high-converting landing page...",
  },
  {
    id: 2,
    title: "React Performance Audit Expert",
    author: "@frontend_ninja",
    category: "Coding",
    upvotes: 892,
    time: "5h ago",
    content: "[ROLE] Senior Frontend Architect...\n[OBJECTIVE] Analyze the following React code for performance bottlenecks...",
  },
  {
    id: 3,
    title: "Cinematic Midjourney Prompt Generator",
    author: "@ai_artist",
    category: "Image Generation",
    upvotes: 2105,
    time: "1d ago",
    content: "Create a highly detailed, cinematic prompt for Midjourney v6 focusing on lighting, camera angle, and mood...",
  },
  {
    id: 4,
    title: "Cold Email Sequence that Converts",
    author: "@sales_pro",
    category: "Sales",
    upvotes: 560,
    time: "3d ago",
    content: "[ROLE] B2B Sales Expert...\n[OBJECTIVE] Write a 3-part cold email sequence targeting CTOs...",
  },
];

export function DiscoverPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("trending");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Community Library</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Discover and remix the best prompts from top AI engineers.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search prompts, categories, or authors..." 
            className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant={activeFilter === "trending" ? "default" : "outline"} 
          className={`rounded-full ${activeFilter === "trending" ? "bg-indigo-600 text-white" : ""}`}
          onClick={() => setActiveFilter("trending")}
        >
          <TrendingUp className="w-4 h-4 mr-2" /> Trending
        </Button>
        <Button 
          variant={activeFilter === "new" ? "default" : "outline"} 
          className={`rounded-full ${activeFilter === "new" ? "bg-indigo-600 text-white" : ""}`}
          onClick={() => setActiveFilter("new")}
        >
          <Clock className="w-4 h-4 mr-2" /> Newest
        </Button>
        <Button 
          variant={activeFilter === "top" ? "default" : "outline"} 
          className={`rounded-full ${activeFilter === "top" ? "bg-indigo-600 text-white" : ""}`}
          onClick={() => setActiveFilter("top")}
        >
          <Star className="w-4 h-4 mr-2" /> Top Rated
        </Button>
        <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
        {["Marketing", "Coding", "Sales", "Image Generation"].map(cat => (
          <Button 
            key={cat}
            variant={activeFilter === cat ? "default" : "outline"} 
            className={`rounded-full ${activeFilter === cat ? "bg-indigo-600 text-white" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROMPTS.map((prompt) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#0a0a0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{prompt.title}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="font-medium text-indigo-500">{prompt.author}</span>
                  <span>•</span>
                  <span>{prompt.time}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium rounded-full text-zinc-600 dark:text-zinc-300">
                {prompt.category}
              </span>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 mb-4 font-mono text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3 relative">
              {prompt.content}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-50 dark:from-zinc-900/50 to-transparent"></div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-4 text-zinc-500">
                <button className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{prompt.upvotes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Reply</span>
                </button>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleCopy(prompt.content, prompt.id)}
                className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
              >
                {copiedId === prompt.id ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> Copied</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy Prompt</>
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
