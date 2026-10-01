import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Copy, RefreshCw, CheckCircle2, Sparkles, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PromptOutputProps {
  outputs: {
    master: string;
    gemini: string;
    chatgpt: string;
    claude: string;
  } | null;
  isGenerating: boolean;
}

export function PromptOutput({ outputs, isGenerating }: PromptOutputProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleShare = () => {
    if (outputs) {
      navigator.clipboard.writeText(outputs.master);
    }
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 2000);
  };

  if (isGenerating) {
    return (
      <Card className="h-full min-h-[500px] flex items-center justify-center border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
        <div className="flex flex-col items-center gap-4 text-zinc-500 dark:text-zinc-400">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="animate-pulse">Synthesizing optimal prompt structures...</p>
        </div>
      </Card>
    );
  }

  if (!outputs) {
    return (
      <Card className="h-full min-h-[500px] flex items-center justify-center border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 border-dashed">
        <div className="flex flex-col items-center gap-4 text-zinc-400 dark:text-zinc-500 text-center max-w-sm">
          <Sparkles className="w-12 h-12 opacity-20" />
          <p>Enter a basic prompt and configure your settings to generate optimized master prompts.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] bg-white/60 dark:bg-[#0a0a0f]/60 backdrop-blur-xl overflow-hidden flex flex-col">
      {/* Quality Score Header */}
      <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-200 dark:text-zinc-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeWidth="3"
                strokeDasharray="92, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold text-zinc-900 dark:text-white">92</span>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              Prompt Quality <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">Estimated</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Clarity</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Structure</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Model Fit</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 border-zinc-200 dark:border-zinc-800" onClick={handleShare}>
            {isSharing ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Share2 className="w-4 h-4 mr-2" />}
            {isSharing ? "Link Copied!" : "Share Prompt"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="master" className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="bg-transparent border-0 flex-wrap h-auto gap-2">
            <TabsTrigger value="master" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-full px-4">Master</TabsTrigger>
            <TabsTrigger value="gemini" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-full px-4">Gemini</TabsTrigger>
            <TabsTrigger value="chatgpt" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-full px-4">ChatGPT</TabsTrigger>
            <TabsTrigger value="claude" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full px-4">Claude</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-0 relative min-h-[300px]">
          {Object.entries(outputs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="m-0 h-full absolute inset-0 outline-none flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 p-6 overflow-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {value}
                    </pre>
                  </div>
                  <div className="p-4 border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-blue-500" onClick={() => handleCopy(`Check out this prompt I generated with Promptrix:\n\n${value}`, key)}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-blue-700" onClick={() => handleCopy(`Check out this prompt I generated with Promptrix:\n\n${value}`, key)}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => alert("Test Run feature coming soon! This will execute the prompt directly against the selected model's API.")}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Run
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => handleCopy(value, key)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                      >
                        {copiedTab === key ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied to Clipboard
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </Card>
  );
}
