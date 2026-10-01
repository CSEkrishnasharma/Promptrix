import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Zap, Target, Layers, CheckCircle2, Play, ChevronRight, Copy, Share2, ThumbsUp, MessageSquare, Wand2, SlidersHorizontal, Code, AlignLeft, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";

export function LandingPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState("chatgpt");
  const [templates, setTemplates] = useState<any[]>([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates/public');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const templatesData = await response.json();
        
        if (templatesData.length > 0) {
          setTemplates(templatesData);
        } else {
          // Fallback if no public templates exist yet
          setTemplates([
            { title: "YouTube Script Prompt", category: "Content Creation", description: "Generates a highly engaging YouTube script with hook, intro, body, and CTA." },
            { title: "Startup Idea Generator", category: "Brainstorming", description: "Brainstorms 5 unique startup ideas based on a given industry and target audience." },
            { title: "Landing Page Copy", category: "Marketing", description: "Creates high-converting copy for a SaaS landing page." },
            { title: "Cold Email Sequence", category: "Sales", description: "Writes a 3-part cold email sequence for B2B sales." }
          ]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Fallback
        setTemplates([
          { title: "YouTube Script Prompt", category: "Content Creation", description: "Generates a highly engaging YouTube script with hook, intro, body, and CTA." },
          { title: "Startup Idea Generator", category: "Brainstorming", description: "Brainstorms 5 unique startup ideas based on a given industry and target audience." },
          { title: "Landing Page Copy", category: "Marketing", description: "Creates high-converting copy for a SaaS landing page." },
          { title: "Cold Email Sequence", category: "Sales", description: "Writes a 3-part cold email sequence for B2B sales." }
        ]);
      }
    };
    
    fetchTemplates();
  }, []);

  const displayedTemplates = showAllTemplates ? templates : templates.slice(0, 4);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center space-y-8 w-full max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-600 dark:text-indigo-400 backdrop-blur-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>A Block Web product</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 leading-tight"
        >
          Refine Your Prompts. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Redefine Your Results.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl"
        >
          Get 3 optimized, structured, and highly effective prompts for ChatGPT, Gemini & Claude — instantly. Stop guessing and start generating masterpieces.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
        >
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full px-8 font-medium shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            onClick={() => onNavigate("studio")}
          >
            Generate My First Prompt
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto rounded-full px-8 font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            onClick={() => onNavigate("demo")}
          >
            <Play className="w-4 h-4 mr-2" />
            Try Demo Prompt
          </Button>
        </motion.div>
      </section>

      {/* Micro Visual Proof */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-[#0a0a0f]/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto text-xs font-medium text-zinc-500 flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Promptrix Studio
            </div>
          </div>
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Input</div>
              <div className="font-mono text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 relative">
                <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-indigo-500 animate-[typing_3s_steps(40,end)_infinite,blink_1s_step-end_infinite] w-[0%]">
                  write a blog post about AI
                </span>
              </div>
            </div>
            <div className="space-y-4 relative">
              <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-500 z-10">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Master Prompt
              </div>
              <div className="font-mono text-sm text-zinc-800 dark:text-zinc-200 bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-lg border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
                <div className="animate-[fade-in_3s_ease-in-out_infinite]">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">[ROLE]</span> Expert Tech Blogger<br/>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">[TASK]</span> Write a 1500-word SEO-optimized article on AI trends.<br/>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">[FORMAT]</span> Markdown with H2/H3 tags.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show, Don't Tell Section */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">See the Difference</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Watch how a weak prompt transforms into a structured powerhouse.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-bl-lg">BEFORE</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">✕</span>
              Weak Prompt
            </h3>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-700 dark:text-zinc-300 font-mono text-sm flex-1">
              "write a marketing email for my new saas product"
            </div>
            <div className="mt-6 pt-6 border-t border-red-200 dark:border-red-900/30">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">Resulting Output:</p>
              <div className="text-sm text-zinc-500 dark:text-zinc-500 italic blur-[1px]">
                Subject: New SaaS Product!<br/><br/>
                Hi everyone,<br/>
                We just launched our new SaaS product. It's really cool and helps you do things faster. You should buy it.<br/><br/>
                Thanks,<br/>
                The Team
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-xl shadow-indigo-500/5">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">AFTER</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><CheckCircle2 className="w-5 h-5" /></span>
              Promptrix Enhanced
            </h3>
            <div className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-4 text-zinc-700 dark:text-zinc-300 font-mono text-sm flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/5 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">[ROLE]</span> Act as a world-class SaaS copywriter.<br/><br/>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">[OBJECTIVE]</span> Write a high-converting launch email for a new B2B SaaS product.<br/><br/>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">[CONSTRAINTS]</span><br/>
              - Tone: Persuasive, professional, yet approachable.<br/>
              - Structure: Hook, Value Prop, Social Proof, Clear CTA.<br/>
              - Length: Under 200 words.<br/><br/>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">[FORMAT]</span> Provide 3 subject line options, followed by the email body.
            </div>
            <div className="mt-6 pt-6 border-t border-indigo-200 dark:border-indigo-900/30">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">Resulting Output:</p>
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white">Subject 1:</strong> The old way of doing [Task] is dead.<br/>
                <strong className="text-zinc-900 dark:text-white">Subject 2:</strong> 10x your team's productivity starting today.<br/><br/>
                Hi [Name],<br/>
                If you're still doing [Pain Point] manually, you're losing [Metric] every week...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Precision Engineering</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Everything you need to craft the perfect prompt.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tone Adjustment Card */}
          <div className="md:col-span-7 bg-[#111315] border border-white/5 rounded-sm p-8 md:p-12 relative overflow-hidden flex flex-col shadow-2xl">
            <div className="absolute top-8 right-8 text-right font-mono text-[10px] text-zinc-600 leading-relaxed">
              COORD // 40.7128° N<br/>
              RANGE // 001 - 100
            </div>
            
            <div className="mb-8">
              <SlidersHorizontal className="w-8 h-8 text-cyan-400 mb-8" />
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">Tone Adjustment</h3>
              <p className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">Voice Resonance Engine</p>
            </div>

            <div className="mt-auto pt-16">
              <div className="flex justify-between items-end mb-4">
                <span className="font-mono text-[10px] text-zinc-400 tracking-widest">PROFESSIONAL RESONANCE</span>
                <span className="font-mono text-[10px] text-cyan-400">88%</span>
              </div>
              <div className="relative h-[2px] bg-zinc-800 w-full mb-16">
                <div className="absolute top-0 left-0 h-full bg-cyan-400 w-[88%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <div className="absolute top-1/2 left-[88%] -translate-y-1/2 w-2 h-2 border border-cyan-400 bg-[#111315] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 flex flex-col justify-center h-36">
                  <h4 className="font-serif italic text-2xl text-white mb-6">Creative</h4>
                  <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase leading-relaxed">ETHEREAL /<br/>FLUID</p>
                </div>
                <div className="border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 flex flex-col justify-center h-36">
                  <h4 className="font-serif italic text-2xl text-white mb-6">Technical</h4>
                  <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase leading-relaxed">DENSE / EXACT</p>
                </div>
                <div className="border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 flex flex-col justify-center h-36">
                  <h4 className="font-serif italic text-2xl text-white mb-6">Authority</h4>
                  <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase leading-relaxed">DIRECT / BOLD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complexity Scaling Card */}
          <div className="md:col-span-5 bg-[#111315] border border-white/5 rounded-sm p-8 md:p-12 flex flex-col shadow-2xl">
            <Layers className="w-8 h-8 text-fuchsia-400 mb-8" />
            <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Complexity<br/>Scaling</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-12">
              Control the entropy of generation. From crystalline summaries to expansive technical blueprints.
            </p>

            <div className="space-y-3 mt-auto">
              {[
                { label: "MACRO SUMMARY", active: false },
                { label: "STANDARD ITERATION", active: true },
                { label: "MICRO DETAIL", active: false },
                { label: "ATOMIC ANALYSIS", active: false },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-5 bg-white/5 border ${item.active ? 'border-l-2 border-l-fuchsia-400 border-y-white/5 border-r-white/5 bg-white/10' : 'border-white/5'} cursor-pointer hover:bg-white/10 transition-colors`}
                >
                  <span className="font-mono text-[10px] text-zinc-300 tracking-widest">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Use Case Optimization Card */}
          <div className="md:col-span-12 bg-[#111315] border border-white/5 rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 shadow-2xl">
            <div className="max-w-xl">
              <Wand2 className="w-8 h-8 text-white mb-8" />
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">Use Case Optimization</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Domain-specific prompt refraction. Tailored mathematical models for diverse output vectors.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex items-center gap-4 px-6 py-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer min-w-[220px]">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span className="font-mono text-[10px] text-zinc-300 tracking-widest">LOGIC & CODE</span>
                </div>
                <div className="flex items-center gap-4 px-6 py-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer min-w-[220px]">
                  <AlignLeft className="w-5 h-5 text-fuchsia-400" />
                  <span className="font-mono text-[10px] text-zinc-300 tracking-widest">EDITORIAL</span>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer min-w-[220px] w-full sm:w-auto">
                <Database className="w-5 h-5 text-white" />
                <span className="font-mono text-[10px] text-zinc-300 tracking-widest">DATA SYNTHESIS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Promptrix */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="bg-zinc-900 dark:bg-black border border-zinc-800 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Promptrix?</h2>
              <p className="text-lg text-zinc-400 mb-8">We don't just rewrite your text. We apply proven prompt engineering frameworks to unlock the true reasoning capabilities of modern LLMs.</p>
              
              <ul className="space-y-6">
                {[
                  { title: "Multi-Model Optimization", desc: "Get variations specifically tuned for ChatGPT, Gemini, and Claude's unique quirks." },
                  { title: "True Engineering Intelligence", desc: "Applies frameworks like Chain-of-Thought, Few-Shot, and Role-Prompting automatically." },
                  { title: "Structured Outputs", desc: "Forces the AI to return data exactly how you need it, every single time." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="text-zinc-500">{"// Generating optimal structure..."}</div>
                <div className="text-indigo-400">{"{"}</div>
                <div className="pl-4 text-zinc-300">
                  <span className="text-violet-400">"role"</span>: "Expert Data Analyst",<br/>
                  <span className="text-violet-400">"task"</span>: "Analyze Q3 churn metrics",<br/>
                  <span className="text-violet-400">"constraints"</span>: [<br/>
                  <span className="pl-4 text-emerald-400">"Use bullet points"</span>,<br/>
                  <span className="pl-4 text-emerald-400">"Highlight anomalies"</span><br/>
                  ],<br/>
                  <span className="text-violet-400">"format"</span>: "Markdown Table"<br/>
                </div>
                <div className="text-indigo-400">{"}"}</div>
                <div className="text-zinc-500 animate-pulse">{"// Ready for deployment"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section - Modern Editorial List */}
      <section className="w-full max-w-6xl mx-auto py-32 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 tracking-tighter">
              Start with a Template.
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-4 max-w-md font-light">
              Jumpstart your workflow with proven, high-converting prompt architectures.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full" onClick={() => setShowAllTemplates(!showAllTemplates)}>
            {showAllTemplates ? "Show Less" : "View All Templates"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col">
          {displayedTemplates.map((template, i) => (
            <div 
              key={i}
              onClick={() => setSelectedTemplate(template)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-black/5 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-white/20 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className="text-zinc-400 dark:text-zinc-700 font-mono text-sm hidden md:block">{(i + 1).toString().padStart(2, '0')}</span>
                <h3 className="text-3xl md:text-5xl font-bold text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-500 tracking-tight">
                  {template.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{template.category}</span>
                <div className="w-12 h-12 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="rounded-full" onClick={() => setShowAllTemplates(!showAllTemplates)}>
            {showAllTemplates ? "Show Less" : "View All Templates"}
          </Button>
        </div>
      </section>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {selectedTemplate?.category}
              </span>
            </div>
            <DialogTitle className="text-2xl">{selectedTemplate?.title}</DialogTitle>
            <DialogDescription className="text-base mt-4 text-zinc-600 dark:text-zinc-400">
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Would you like to use this template in the Studio to generate your prompt?
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="border-black/10 dark:border-white/10">
              Cancel
            </Button>
            <Button onClick={() => {
              setSelectedTemplate(null);
              onNavigate("studio");
            }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Use in Studio <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Community Teaser - Asymmetric Glassmorphism */}
      <section className="w-full max-w-6xl mx-auto py-32 px-4 relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tighter">
            Join the Collective.
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
            Discover, share, and remix the best prompts created by top-tier AI engineers and creatives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Large Featured Card */}
          <div className="md:col-span-8 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 hover:border-indigo-500/50 transition-all duration-500 group cursor-pointer overflow-hidden relative shadow-xl shadow-black/5 dark:shadow-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-black rounded-full border-2 border-white dark:border-black"></div>
                </div>
                <div>
                  <div className="text-zinc-900 dark:text-white font-medium">@sarah_prompts</div>
                  <div className="text-xs text-zinc-500 font-mono">Top Contributor</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-full px-3 py-1 border border-black/5 dark:border-white/10">
                <ThumbsUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs text-zinc-900 dark:text-white font-mono">4.2k</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-cyan-600 dark:group-hover:from-indigo-400 dark:group-hover:to-cyan-400 transition-all">
                The Ultimate SaaS Landing Page Architect
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl text-lg font-light leading-relaxed">
                A comprehensive, multi-step prompt that generates high-converting hero sections, feature blocks, and irresistible CTAs tailored to your specific audience.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Copywriting", "Marketing", "SaaS"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full text-xs text-zinc-700 dark:text-zinc-300 font-mono tracking-wider hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stacked Smaller Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {[
              { user: "@dev_ninja", title: "React Component Generator", likes: "2.1k", color: "from-cyan-400 to-blue-500" },
              { user: "@creative_ai", title: "Midjourney Cinematic Portraits", likes: "1.8k", color: "from-purple-500 to-pink-500" }
            ].map((item, i) => (
              <div key={i} className="flex-1 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:border-black/20 dark:hover:border-white/30 transition-all duration-500 group cursor-pointer relative overflow-hidden shadow-xl shadow-black/5 dark:shadow-none">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color}`}></div>
                    <span className="text-sm text-zinc-900 dark:text-white font-medium">{item.user}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                    <ThumbsUp className="w-3 h-3" /> {item.likes}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      View Prompt <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center relative z-10">
          <Button 
            className="bg-transparent border border-zinc-300 dark:border-white/20 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full px-10 py-6 text-lg font-medium transition-all duration-300"
            onClick={() => onNavigate("discover")}
          >
            Explore the Collective
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-8">Ready to 10x your AI outputs?</h2>
        <Button 
          className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-full px-8 font-bold shadow-2xl transition-transform hover:scale-105"
          onClick={() => onNavigate("studio")}
        >
          Start Generating Now
        </Button>
      </section>
    </div>
  );
}
