import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Github, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginProps {
  onNavigate: (view: "landing" | "studio" | "history" | "login" | "signup") => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      onNavigate("studio");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Neural Link Protocol: External connection (Google) is currently offline. Please use the Access Keyphrase interface below.");
  };

  const handleGithubLogin = () => {
    setError("Neural Link Protocol: External connection (GitHub) is currently offline. Please use the Access Keyphrase interface below.");
  };

  const handleResetPassword = () => {
    alert("Key Recovery is currently unavailable. Please contact the administrator at the5sfounder@gmail.com.");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0a0a0f] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
      >
        {/* Left Side - Branding */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-950/40 to-black overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          {/* Glowing AI Chip Graphic */}
          <div className="relative z-10 flex flex-col items-center justify-center mb-12">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
              <div className="absolute inset-4 border border-cyan-500/30 rounded-xl transform rotate-45"></div>
              <div className="absolute inset-8 border border-cyan-400/40 rounded-lg transform -rotate-12"></div>
              <div className="relative w-24 h-24 bg-black border border-cyan-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Cpu className="w-10 h-10 text-cyan-400" />
                <span className="absolute font-mono text-cyan-400 font-bold text-xl">AI</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              SYNTHETIC<br />VOID
            </h2>
            <p className="text-cyan-500/60 font-mono text-sm tracking-widest uppercase">
              Accessing Core Neural Matrix
            </p>
            <div className="pt-8 flex justify-between items-center border-t border-white/10 mt-8">
              <span className="text-xs text-zinc-600 font-mono">VER_0.4.1B</span>
              <span className="text-xs text-zinc-600 font-mono">SECURED_BY_VOID_ENCRYPTION</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <div className="hidden md:block absolute top-8 right-8 text-xs font-mono text-zinc-600">
            ENGINEER_AUTH_REQUIRED
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">System Initialization</span>
            </div>
            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white">Neural Interface</h3>
            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-500 text-xs font-mono">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleEmailLogin} autoComplete="on" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Credential Identifier</Label>
              <div className="relative">
                <Input 
                  type="email" 
                  name="email"
                  id="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/50 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white focus-visible:ring-cyan-500/50 pl-4 pr-10 font-mono text-sm h-12"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Access Keyphrase</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/50 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white focus-visible:ring-cyan-500/50 pl-4 pr-10 font-mono text-sm h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-black/10 dark:border-white/10 bg-white dark:bg-black/50 text-cyan-500 focus:ring-cyan-500/50" />
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase">Maintain Link</span>
              </label>
              <button 
                onClick={handleResetPassword}
                className="text-xs font-mono text-cyan-500 hover:text-cyan-400 uppercase transition-colors"
              >
                Key Recovery
              </button>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-auto py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-sm tracking-wider uppercase border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-normal"
            >
              {isLoading ? "Authenticating..." : "Initialize Neural Link"}
              <Zap className="w-4 h-4 ml-2 shrink-0" />
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-[#0a0a0f] px-4 text-xs font-mono text-zinc-400 dark:text-zinc-600 uppercase">External Protocols</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-3 bg-white dark:bg-black/50 border-black/10 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white font-mono text-xs tracking-wider whitespace-normal"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github className="w-4 h-4 mr-2 shrink-0 text-zinc-600 dark:text-zinc-400" />
                GITHUB
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 bg-white dark:bg-black/50 border-black/10 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white font-mono text-xs tracking-wider whitespace-normal"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <div className="w-2 h-2 rounded-full shrink-0 bg-green-500 mr-2"></div>
                GOOGLE
              </Button>
            </div>

            <div className="pt-6 text-center">
              <span className="text-xs font-mono text-zinc-500 uppercase">New Entity? </span>
              <button 
                onClick={() => onNavigate("signup")}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 uppercase transition-colors ml-1"
              >
                Request Access
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
