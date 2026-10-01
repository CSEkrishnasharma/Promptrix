import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Copy, Check, AlertCircle, Wand2, ShieldCheck, Search, Activity, ShieldAlert, Shield } from "lucide-react";
import { Button } from "./ui/button";

const MAX_WORDS = 1000;

export function HumaniserPanel() {
  const [mode, setMode] = useState<"humaniser" | "checker">("humaniser");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [checkResult, setCheckResult] = useState<{ score: number, signals: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Calculate word count
    const words = inputText.trim().split(/\s+/);
    setWordCount(inputText.trim() === "" ? 0 : words.length);
  }, [inputText]);

  const handleHumanise = () => {
    if (wordCount > MAX_WORDS || wordCount === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      let processed = inputText;

      processed = processed.replace(/[\u200B-\u200D\uFEFF]/g, "");
      processed = processed.replace(/[^\S\r\n]+/g, " ");
      
      const replacements: Record<string, string> = {
        "delve": "explore",
        "tapestry": "collection",
        "testament": "proof",
        "crucial": "important",
        "moreover": "additionally",
        "furthermore": "also"
      };

      Object.keys(replacements).forEach((key) => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        processed = processed.replace(regex, (match) => {
          if (match === match.toUpperCase()) return replacements[key].toUpperCase();
          if (match[0] === match[0].toUpperCase()) return replacements[key].charAt(0).toUpperCase() + replacements[key].slice(1);
          return replacements[key];
        });
      });

      setOutputText(processed);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCheck = () => {
    if (wordCount > MAX_WORDS || wordCount === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const signals: string[] = [];
      let score = 10; // Baseline assumption

      // 1. Watermark check
      if (/[\u200B-\u200D\uFEFF]/.test(inputText)) {
        signals.push("Hidden zero-width characters detected (Watermark)");
        score += 55;
      }

      // 2. Vocabulary density
      const buzzwords = [
        "delve", "tapestry", "testament", "crucial", "moreover", 
        "furthermore", "realm", "bustling", "vibrant", "intricate", 
        "meticulous", "seamless", "underscore", "pivotal"
      ];
      let buzzwordCount = 0;
      buzzwords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = inputText.match(regex);
        if (matches) buzzwordCount += matches.length;
      });

      if (buzzwordCount > 0) {
        signals.push(`Found ${buzzwordCount} common AI buzzwords`);
        score += Math.min(buzzwordCount * 7, 35);
      } else {
        signals.push("Natural vocabulary distribution");
      }

      score = Math.min(Math.max(score, 0), 100);

      setCheckResult({ score, signals });
      setIsProcessing(false);
    }, 1500);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isOverLimit = wordCount > MAX_WORDS;
  const isInputEmpty = wordCount === 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center gap-3 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <Feather className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium text-zinc-300">Premium Tools</span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white pb-2">
          AI Text Studio
        </h2>
        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-lg">
          Detect AI-generated content or strip away invisible watermarks to bypass detection and sound perfectly natural.
        </p>

        {/* Mode Switcher */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-1.5">
            <button
              onClick={() => setMode("humaniser")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                mode === "humaniser" 
                  ? "bg-indigo-500/20 text-indigo-300 shadow-inner" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Feather className="w-4 h-4" />
              Humaniser
            </button>
            <button
              onClick={() => setMode("checker")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                mode === "checker" 
                  ? "bg-purple-500/20 text-purple-300 shadow-inner" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Search className="w-4 h-4" />
              AI Checker
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/5 dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex justify-between items-center mb-6 relative">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Wand2 className="w-5 h-5 text-indigo-400" />
              </div>
              Input Text
            </h3>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              isOverLimit 
                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                : 'bg-white/5 text-zinc-400 border-white/10'
            }`}>
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>
          
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your paragraph here (up to 1000 words)..."
              className="w-full h-full min-h-[18rem] bg-black/40 border border-white/5 rounded-2xl p-5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all shadow-inner"
            />
          </div>

          <AnimatePresence>
            {isOverLimit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center gap-2 text-sm text-red-500 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                Input exceeds maximum word limit.
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={mode === "humaniser" ? handleHumanise : handleCheck}
            disabled={isInputEmpty || isOverLimit || isProcessing}
            className={`w-full mt-8 text-white font-bold py-7 rounded-2xl transition-all disabled:opacity-50 disabled:shadow-none border border-white/10 relative overflow-hidden group ${
              mode === "humaniser" 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            }`}
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            
            {isProcessing ? (
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === "humaniser" ? "Processing Magic..." : "Analyzing Content..."}
              </div>
            ) : (
              <div className="flex items-center gap-3 relative z-10 text-lg">
                {mode === "humaniser" ? (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    Humanise & Clean Text
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Run AI Detection
                  </>
                )}
              </div>
            )}
          </Button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          key={`output-${mode}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="bg-white/5 dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {isProcessing && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-3xl">
                <div className="relative w-16 h-16 mb-6">
                  <div className={`absolute inset-0 border-4 rounded-full ${mode === "humaniser" ? 'border-purple-500/30' : 'border-pink-500/30'}`} />
                  <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${mode === "humaniser" ? 'border-purple-500' : 'border-pink-500'}`} />
                  {mode === "humaniser" 
                    ? <Wand2 className="absolute inset-0 m-auto w-6 h-6 text-purple-400 animate-pulse" />
                    : <Search className="absolute inset-0 m-auto w-6 h-6 text-pink-400 animate-pulse" />
                  }
                </div>
                <p className="text-white font-medium animate-pulse text-lg">
                  {mode === "humaniser" ? "Refining text structure..." : "Scanning for AI patterns..."}
                </p>
             </div>
          )}

          {mode === "humaniser" ? (
            // Humaniser Output
            <>
              <div className="flex justify-between items-center mb-6 relative">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  Humanised Result
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!outputText || isProcessing}
                  className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white rounded-full px-4 h-9"
                >
                  {isCopied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                  {isCopied ? "Copied!" : "Copy Text"}
                </Button>
              </div>
              
              <div className="relative flex-1">
                <div className={`w-full h-full min-h-[18rem] bg-black/40 border border-white/5 rounded-2xl p-5 overflow-y-auto text-zinc-200 leading-relaxed shadow-inner ${!outputText ? 'flex flex-col items-center justify-center text-zinc-500' : ''}`}>
                  {!outputText ? (
                    <>
                      <Feather className="w-12 h-12 mb-4 opacity-20" />
                      <p className="italic">Your natural, watermark-free text will appear here.</p>
                    </>
                  ) : (
                    outputText
                  )}
                </div>
              </div>
            </>
          ) : (
            // AI Checker Output
            <>
              <div className="flex justify-between items-center mb-6 relative">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-pink-400" />
                  </div>
                  Detection Result
                </h3>
              </div>
              
              <div className="relative flex-1">
                <div className={`w-full h-full min-h-[18rem] bg-black/40 border border-white/5 rounded-2xl p-6 text-zinc-200 shadow-inner flex flex-col ${!checkResult ? 'items-center justify-center text-zinc-500' : ''}`}>
                  {!checkResult ? (
                    <>
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p className="italic">Analysis results will appear here.</p>
                    </>
                  ) : (
                    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
                      <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" className="stroke-white/10 stroke-[8] fill-none" />
                            <circle 
                              cx="50" cy="50" r="40" 
                              className={`stroke-[8] fill-none stroke-current transition-all duration-1000 ease-out ${
                                checkResult.score > 75 ? "text-red-500" : checkResult.score > 40 ? "text-yellow-500" : "text-emerald-500"
                              }`}
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - checkResult.score / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black">{checkResult.score}%</span>
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest mt-1">AI Prob</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                          <p className={`text-xl font-bold ${
                            checkResult.score > 75 ? "text-red-400" : checkResult.score > 40 ? "text-yellow-400" : "text-emerald-400"
                          }`}>
                            {checkResult.score > 75 ? "Highly likely AI-generated" : checkResult.score > 40 ? "Possibly AI-generated" : "Likely Human-written"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex-1">
                        <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> Detected Signals
                        </h4>
                        <ul className="space-y-2">
                          {checkResult.signals.map((signal, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                              {signal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
