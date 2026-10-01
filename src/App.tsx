import { useState, useEffect } from "react";
import { GLSLHills } from "./components/ui/glsl-hills";
import { Button } from "./components/ui/button";
import { PromptInput } from "./components/PromptInput";
import { PromptOutput } from "./components/PromptOutput";
import { ControlsPanel } from "./components/ControlsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { AdminPanel } from "./components/AdminPanel";
import { AccountSettings } from "./components/AccountSettings";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { LandingPage } from "./components/LandingPage";
import { DiscoverPanel } from "./components/DiscoverPanel";
import { HumaniserPanel } from "./components/HumaniserPanel";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Sparkles, History, Wand2, ArrowRight, LogOut, User as UserIcon, Info, Settings, Moon, Sun, Twitter, Github, Facebook, Instagram, Linkedin, Bug, Shield, Compass, Feather } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./components/ui/dialog";
import { Footer } from "./components/ui/footer";
import { trackEvent, trackPageView } from "./lib/analytics";

const MAX_PROMPT_LENGTH = 5000;
const GENERATE_COOLDOWN_MS = 3000;

function AppContent() {
  const { user, isAdmin, token, logout } = useAuth();
  const [lastGenerateTime, setLastGenerateTime] = useState(0);
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<"landing" | "studio" | "history" | "login" | "signup" | "admin" | "demo" | "discover" | "humaniser">("landing");
  const [inputPrompt, setInputPrompt] = useState("");
  const [controls, setControls] = useState({
    targetModel: "universal",
    useCase: "general",
    tone: "professional",
    complexity: "standard",
    promptStructure: "structure1"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<{
    master: string;
    gemini: string;
    chatgpt: string;
    claude: string;
  } | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [privacyEnabled, setPrivacyEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("promptrix-privacy");
      return saved === "true" || saved === "false" ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("promptrix-privacy", String(Boolean(privacyEnabled)));
    } catch {
      // Storage unavailable or blocked by browser settings
    }
  }, [privacyEnabled]);

  useEffect(() => {
    trackPageView(currentView);
    if (currentView === "demo") {
      setInputPrompt("Write a marketing email for a new AI SaaS product that helps users generate better prompts.");
      setControls({
        targetModel: "universal",
        useCase: "marketing",
        tone: "bold",
        complexity: "advanced",
        promptStructure: "structure1"
      });
      // Auto-generate after a short delay to let state settle
      setTimeout(() => {
        handleGenerate();
      }, 500);
    }
  }, [currentView]);

  const handleGenerate = async () => {
    const trimmed = inputPrompt.trim();
    if (!trimmed) return;

    // Input length validation (HIGH-3)
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      alert(`Prompt is too long (${trimmed.length} chars). Maximum is ${MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    // Client-side rate limiting (HIGH-2)
    const now = Date.now();
    if (now - lastGenerateTime < GENERATE_COOLDOWN_MS) {
      return;
    }
    setLastGenerateTime(now);
    
    trackEvent("generate_prompt", { useCase: controls.useCase, tone: controls.tone, complexity: controls.complexity, structure: controls.promptStructure });
    setIsGenerating(true);
    
    setTimeout(async () => {
      let masterPrompt = "";
      
      if (controls.promptStructure === "structure1") {
        masterPrompt = `# **Role:**\nYou are an expert ${controls.useCase} assistant with a ${controls.tone} tone.\n\n# **Objective:**\n${inputPrompt}\n\n# **Context:**\nThe user requires a high-quality, structured response tailored to their specific needs. The complexity level is set to ${controls.complexity}.\n\n# **Instructions:**\n## **Instruction 1:**\nAnalyze the request thoroughly.\n## **Instruction 2:**\nProvide actionable insights.\n## **Instruction 3:**\nEnsure the output is highly readable.\n\n# **Notes:**\n- Ensure clarity and precision.\n- Follow the specified tone strictly.\n- Provide structured markdown.`;
      } else if (controls.promptStructure === "structure2") {
        masterPrompt = `Role/Persona: You are an expert ${controls.useCase} assistant.\nGoal: ${inputPrompt}\nContext: The user requires a high-quality, structured response tailored to their specific needs. The complexity level is set to ${controls.complexity}.\nConstraints: Ensure clarity and precision. Follow the specified tone strictly. Provide actionable insights.\nOutput Format: Structured markdown with clear headings and bullet points where applicable.\nTone/Style: ${controls.tone}\nExamples (if needed): (Provide examples based on the specific request if applicable)`;
      } else if (controls.promptStructure === "structure3") {
        masterPrompt = `Role/Context: Expert ${controls.useCase} assistant providing a ${controls.tone} response.\nExamples:\n- **Input:** Request example 1 -> **Output:** Desired response style 1\n- **Input:** Request example 2 -> **Output:** Desired response style 2\nTask: ${inputPrompt}\nResponse: Provide a comprehensive, well-structured response using markdown. Focus on accuracy and depth suitable for the complexity level of ${controls.complexity}.`;
      } else if (controls.promptStructure === "structure4") {
        masterPrompt = `Subject: ${inputPrompt}\nAction/Activity: Providing a high-quality, structured response tailored to the user's specific needs.\nLocation/Setting: ${controls.useCase} context.\nComposition/Cam: ${controls.complexity} complexity level.\nStyle/Lighting: ${controls.tone} tone.\nModifiers: Ensure clarity and precision, follow the specified tone strictly, provide actionable insights, output in structured markdown.`;
      }

      const generatedOutputs = {
        master: masterPrompt,
        gemini: `You are an expert ${controls.useCase} assistant. Your tone should be ${controls.tone}. \n\nTask: ${inputPrompt}\n\nComplexity: ${controls.complexity}\n\nPlease provide a comprehensive, well-structured response using markdown. Focus on accuracy and depth suitable for Gemini's reasoning capabilities.`,
        chatgpt: `Act as a world-class ${controls.useCase} specialist. \n\nGoal: ${inputPrompt}\nTone: ${controls.tone}\nLevel: ${controls.complexity}\n\nInstructions:\n1. Analyze the request thoroughly.\n2. Provide a step-by-step breakdown if necessary.\n3. Ensure the output is highly readable and formatted with markdown.`,
        claude: `Human: I need you to act as an expert ${controls.useCase} consultant. \n\nHere is my request: ${inputPrompt}\n\nPlease maintain a ${controls.tone} tone and aim for a ${controls.complexity} level of detail.\n\nAssistant: I understand. I will provide a detailed, structured response following your constraints.`
      };

      setOutputs(generatedOutputs);

      if (user && token) {
        try {
          await fetch('/api/prompts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              input: inputPrompt,
              masterPrompt,
              outputs: generatedOutputs,
              controls
            })
          });
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error saving prompt to MongoDB:", error);
        }
      }

      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectPrompt = (prompt: any) => {
    setInputPrompt(prompt.input || "");
    setControls({
      targetModel: prompt.controls?.targetModel || "universal",
      useCase: prompt.controls?.useCase || "general",
      tone: prompt.controls?.tone || "professional",
      complexity: prompt.controls?.complexity || "standard",
      promptStructure: prompt.controls?.promptStructure || "structure1"
    });
    setOutputs(prompt.outputs || {
      master: prompt.masterPrompt || "",
      gemini: prompt.outputs?.gemini || "",
      chatgpt: prompt.outputs?.chatgpt || "",
      claude: prompt.outputs?.claude || ""
    });
    setCurrentView("studio");
  };

  const handleProtectedNavigation = (view: "studio" | "history") => {
    if (!user) {
      setCurrentView("login");
    } else {
      setCurrentView(view);
    }
  };

  const pageVariants: any = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.4, ease: "easeIn" } }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden bg-black transition-colors duration-300 pt-24">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GLSLHills />
      </div>

      {/* Fixed Header Wrapper */}
      <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
        {/* Navigation */}
        <nav className="w-full border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView("landing")}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="currentColor" fillRule="evenodd" clipRule="evenodd" className="w-8 h-8 text-zinc-900 dark:text-white">
                <path d="M 15 18.5 L 43 4.5 L 85 25.5 L 85 39.5 L 43 60.5 L 29 53.5 L 29 88.5 L 15 95.5 Z M 29 25.5 L 43 18.5 L 64 29 L 64 36 L 43 46.5 L 29 39.5 Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Promptrix</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2 sm:px-3 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10">
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>Manage your preferences and privacy.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="space-y-0.5 flex-1 pr-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Report a Bug</span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Help us improve by reporting issues.</p>
                      </div>
                      <Button variant="outline" size="sm" className="self-start sm:self-auto shrink-0" asChild>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=blockwebsupport@gmail.com&su=Bug+Report" target="_blank" rel="noopener noreferrer">
                          <Bug className="w-4 h-4 mr-2" /> Report
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="space-y-0.5 flex-1 pr-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Privacy & Safety</span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Can we use your prompts in the future to train our models?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto shrink-0">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={privacyEnabled}
                          onChange={(e) => setPrivacyEnabled(e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="space-y-0.5 flex-1 pr-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Terms & Conditions</span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Review our terms of service and usage policies.</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="self-start sm:self-auto shrink-0">
                            View Terms
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
                          <DialogHeader>
                            <DialogTitle>Terms and Conditions</DialogTitle>
                            <DialogDescription>Last updated: April 2026</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                            <p><strong>1. Acceptance of Terms</strong><br/>By accessing and using Promptrix, you accept and agree to be bound by the terms and provision of this agreement.</p>
                            <p><strong>2. Use License</strong><br/>Permission is granted to temporarily use the materials (information or software) on Promptrix's website for personal, non-commercial transitory viewing only.</p>
                            <p><strong>3. Disclaimer</strong><br/>The materials on Promptrix's website are provided on an 'as is' basis. Promptrix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                            <p><strong>4. Limitations</strong><br/>In no event shall Promptrix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Promptrix's website.</p>
                            
                            <div className="my-6 border-t border-black/10 dark:border-white/10"></div>
                            
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Privacy Policy</h3>
                            <p><strong>1. Information Collection</strong><br/>We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form.</p>
                            <p><strong>2. Information Usage</strong><br/>Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, to process transactions.</p>
                            <p><strong>3. Information Protection</strong><br/>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
                            <p><strong>4. Cookies</strong><br/>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {isAdmin && (
              <Button 
                variant={currentView === "admin" ? "secondary" : "ghost"} 
                size="sm" 
                className={`px-2 sm:px-3 ${currentView === "admin" ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
                onClick={() => setCurrentView("admin")}
              >
                <Shield className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
            <Button 
              variant={currentView === "discover" ? "secondary" : "ghost"} 
              size="sm" 
              className={`px-2 sm:px-3 ${currentView === "discover" ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
              onClick={() => setCurrentView("discover")}
            >
              <Compass className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Discover</span>
            </Button>
            <Button 
              variant={currentView === "humaniser" ? "secondary" : "ghost"} 
              size="sm" 
              className={`px-2 sm:px-3 ${currentView === "humaniser" ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
              onClick={() => setCurrentView("humaniser")}
            >
              <Feather className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Humaniser</span>
            </Button>
            <Button 
              variant={currentView === "history" ? "secondary" : "ghost"} 
              size="sm" 
              className={`px-2 sm:px-3 ${currentView === "history" ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
              onClick={() => handleProtectedNavigation("history")}
            >
              <History className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button 
              variant={currentView === "studio" ? "secondary" : "ghost"} 
              size="sm" 
              className={`px-2 sm:px-3 ${currentView === "studio" ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
              onClick={() => setCurrentView("studio")}
            >
              <Wand2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Studio</span>
            </Button>
            
            <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-1 sm:mx-2"></div>
            
            {user ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
                      {user.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-1 hidden sm:block" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Account</DialogTitle>
                    <DialogDescription>Manage your account settings and profile.</DialogDescription>
                  </DialogHeader>
                  <AccountSettings onLogout={() => { logout(); setCurrentView("landing"); }} />
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setCurrentView("login")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex-1 flex flex-col mt-10">
        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center flex-1"
            >
              <LandingPage onNavigate={(view) => setCurrentView(view as any)} />
            </motion.div>
          )}

          {currentView === "demo" && (
            <motion.div
              key="demo"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 pt-8"
            >
              <div className="lg:col-span-12 mb-4">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> Demo Mode
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">You are trying out the studio. Sign up to save your prompts and access all features.</p>
                  </div>
                  <Button onClick={() => setCurrentView("signup")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Sign Up Now
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <ControlsPanel controls={controls} setControls={setControls} />
                <PromptInput 
                  value={inputPrompt} 
                  onChange={setInputPrompt} 
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>
              <div className="lg:col-span-8">
                <PromptOutput outputs={outputs} isGenerating={isGenerating} />
              </div>
            </motion.div>
          )}

          {currentView === "login" && (
            <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Login onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === "signup" && (
            <motion.div key="signup" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SignUp onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === "studio" && (
            <motion.div
              key="studio"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 pt-4"
            >
              {!user && (
                <div className="lg:col-span-12 mb-2">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Guest Mode Studio</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Generate and test prompts freely. Sign in to save history across sessions!</p>
                      </div>
                    </div>
                    <Button onClick={() => setCurrentView("login")} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                      Log In / Sign Up
                    </Button>
                  </div>
                </div>
              )}

              {/* Left Column: Input & Controls */}
              <div className="lg:col-span-4 space-y-6">
                <ControlsPanel controls={controls} setControls={setControls} />
                <PromptInput 
                  value={inputPrompt} 
                  onChange={setInputPrompt} 
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Right Column: Outputs */}
              <div className="lg:col-span-8">
                <PromptOutput outputs={outputs} isGenerating={isGenerating} />
              </div>
            </motion.div>
          )}

          {currentView === "discover" && (
            <motion.div
              key="discover"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pb-12 pt-8"
            >
              <DiscoverPanel />
            </motion.div>
          )}

          {currentView === "humaniser" && (
            <motion.div
              key="humaniser"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pb-12 pt-8"
            >
              <HumaniserPanel />
            </motion.div>
          )}

          {currentView === "history" && user && (
            <motion.div
              key="history"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pb-12"
            >
              <HistoryPanel onSelectPrompt={handleSelectPrompt} onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === "admin" && isAdmin && (
            <motion.div
              key="admin"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pb-12"
            >
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="w-full mt-auto z-20 relative">
        <Footer
          logo={
            <svg viewBox="0 0 100 100" fill="currentColor" fillRule="evenodd" clipRule="evenodd" className="w-6 h-6 text-zinc-900 dark:text-white">
              <path d="M 15 18.5 L 43 4.5 L 85 25.5 L 85 39.5 L 43 60.5 L 29 53.5 L 29 88.5 L 15 95.5 Z M 29 25.5 L 43 18.5 L 64 29 L 64 36 L 43 46.5 L 29 39.5 Z" />
            </svg>
          }
          brandName="Promptrix"
          socialLinks={[
            {
              icon: <Twitter className="h-4 w-4" />,
              href: "https://twitter.com",
              label: "Twitter",
            },
            {
              icon: <Github className="h-4 w-4" />,
              href: "https://github.com",
              label: "GitHub",
            },
            {
              icon: <Facebook className="h-4 w-4" />,
              href: "https://facebook.com",
              label: "Facebook",
            },
            {
              icon: <Instagram className="h-4 w-4" />,
              href: "https://instagram.com",
              label: "Instagram",
            },
            {
              icon: <Linkedin className="h-4 w-4" />,
              href: "https://linkedin.com",
              label: "LinkedIn",
            },
          ]}
          mainLinks={[
            { href: "#", label: "Products" },
            { label: "About", onClick: () => setIsAboutOpen(true) },
            { href: "#", label: "Blog" },
          ]}
          copyright={{
            text: "© 2026 Promptrix",
            license: "Block Web.",
          }}
        />

        <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">About Promptrix</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                The ultimate prompt engineering studio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                Promptrix is a cutting-edge platform designed to help you craft, refine, and optimize prompts for various AI models like ChatGPT, Gemini, and Claude.
              </p>
              <p>
                Our mission is to empower creators, developers, and businesses to harness the full potential of generative AI through structured and highly effective prompt architectures.
              </p>
              <div className="pt-4 border-t border-black/10 dark:border-white/10">
                <p className="font-medium text-zinc-900 dark:text-white mb-2">Key Features:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Advanced prompt generation and refinement</li>
                  <li>Multi-model optimization (ChatGPT, Gemini, Claude)</li>
                  <li>Community-driven prompt discovery</li>
                  <li>Comprehensive prompt history and management</li>
                </ul>
              </div>
              <div className="pt-6 mt-2 flex justify-center">
                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                  A product of Block Web
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
