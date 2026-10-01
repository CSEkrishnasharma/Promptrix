import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Settings2, Cpu } from "lucide-react";

interface ControlsPanelProps {
  controls: {
    targetModel: string;
    useCase: string;
    tone: string;
    complexity: string;
    promptStructure?: string;
  };
  setControls: (controls: any) => void;
}

export function ControlsPanel({ controls, setControls }: ControlsPanelProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl shadow-lg">
      <CardHeader className="pb-4 border-b border-black/5 dark:border-white/5">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Settings2 className="w-4 h-4 text-indigo-500" />
          Prompt Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Target AI
          </Label>
          <Select 
            value={controls.targetModel} 
            onValueChange={(val) => setControls({ ...controls, targetModel: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Select target AI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="universal">Universal (All Models)</SelectItem>
              <SelectItem value="chatgpt">ChatGPT (OpenAI)</SelectItem>
              <SelectItem value="gemini">Gemini (Google)</SelectItem>
              <SelectItem value="claude">Claude (Anthropic)</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
              <SelectItem value="midjourney">Midjourney</SelectItem>
              <SelectItem value="kling">Kling</SelectItem>
              <SelectItem value="nanobanana">Nano Banana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Prompt Structure</Label>
          <Select 
            value={controls.promptStructure || "structure1"} 
            onValueChange={(val) => setControls({ ...controls, promptStructure: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Select structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="structure1">Structure 1</SelectItem>
              <SelectItem value="structure2">Structure 2</SelectItem>
              <SelectItem value="structure3">Structure 3</SelectItem>
              <SelectItem value="structure4">Structure 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Use Case</Label>
          <Select 
            value={controls.useCase} 
            onValueChange={(val) => setControls({ ...controls, useCase: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Assistant</SelectItem>
              <SelectItem value="writing">Content Writing</SelectItem>
              <SelectItem value="coding">Software Engineering</SelectItem>
              <SelectItem value="design">UI/UX Design</SelectItem>
              <SelectItem value="marketing">Marketing & SEO</SelectItem>
              <SelectItem value="image_generation">Image Generation</SelectItem>
              <SelectItem value="video_generation">Video Generation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tone</Label>
          <Select 
            value={controls.tone} 
            onValueChange={(val) => setControls({ ...controls, tone: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual & Friendly</SelectItem>
              <SelectItem value="cinematic">Cinematic & Epic</SelectItem>
              <SelectItem value="bold">Bold & Direct</SelectItem>
              <SelectItem value="academic">Academic & Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Complexity</Label>
          <Select 
            value={controls.complexity} 
            onValueChange={(val) => setControls({ ...controls, complexity: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Select complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic (Simple & Clear)</SelectItem>
              <SelectItem value="standard">Standard (Balanced)</SelectItem>
              <SelectItem value="advanced">Advanced (Detailed)</SelectItem>
              <SelectItem value="expert">Expert (Highly Technical)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
