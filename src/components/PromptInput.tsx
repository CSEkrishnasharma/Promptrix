import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Wand2, Loader2, Sparkles } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const STARTER_TEMPLATES = [
  "Write a marketing email for a new SaaS product",
  "Design a landing page concept for a fitness app",
  "Create a YouTube script about AI trends",
  "Draft a startup idea for sustainable fashion",
];

export function PromptInput({ value, onChange, onGenerate, isGenerating }: PromptInputProps) {
  return (
    <Card className="border-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)] bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
      <CardHeader className="pb-4 border-b border-black/5 dark:border-white/5">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Wand2 className="w-4 h-4 text-indigo-500" />
          Input Prompt
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <Textarea 
          placeholder="E.g., Write a blog post about AI in healthcare..."
          className="min-h-[200px] resize-none text-base bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={5000}
        />
        <div className="flex justify-end">
          <span className={`text-xs ${value.length > 4500 ? 'text-red-500' : 'text-zinc-400'}`}>
            {value.length}/5000
          </span>
        </div>
        
        {value.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Starter Templates
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_TEMPLATES.map((template, i) => (
                <button
                  key={i}
                  onClick={() => onChange(template)}
                  className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 rounded-full transition-colors text-left"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/25 h-12 text-base font-medium transition-all hover:scale-[1.02]"
          onClick={onGenerate}
          disabled={value.trim().length < 10 || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Engineering Prompt...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Master Prompt
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
