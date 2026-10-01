import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Github, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SignUpProps {
  onNavigate: (view: "landing" | "studio" | "history" | "login" | "signup") => void;
}

export function SignUp({ onNavigate }: SignUpProps) {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signup(name, email, password);
      onNavigate("studio");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Neural Link Protocol: External connection (Google) is currently offline. Please use the core credentials (Email/Password) to request access.");
  };

  const handleGithubLogin = () => {
    setError("Neural Link Protocol: External connection (GitHub) is currently offline. Please use the core credentials (Email/Password) to request access.");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0a0a0f] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
      >
        {/* Left Side - Branding */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-950/40 to-black overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          {/* Abstract Particle/Neural Effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
            <div className="w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent blur-2xl"></div>
            {/* Simulated neural network lines using CSS borders and rotation */}
            <div className="absolute w-64 h-64 border border-indigo-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-96 h-96 border border-purple-500/20 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
            <div className="absolute w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(99,102,241,0.05)_10px,rgba(99,102,241,0.05)_20px)]"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">System Phase: Initialize</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
              Forge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">Neural</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">Signature</span>
            </h2>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
              Enter the elite ecosystem of AI engineering. Where precision meets the void.
            </p>
          </div>

          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-end border-t border-white/10 pt-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">Latency</div>
              <div className="text-xs font-mono text-zinc-400">0.004 MS</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">Status</div>
              <div className="text-xs font-mono text-zinc-400">ENCRYPTED</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">Core</div>
              <div className="text-xs font-mono text-zinc-400">VOID_V.09</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <div className="hidden md:flex absolute top-8 right-8 text-xs font-mono text-zinc-600 items-center gap-2">
            SUPPORT <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">?</div>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">INITIALIZE ACCESS</h3>
            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-500 text-xs font-mono">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleEmailSignUp} autoComplete="on" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Nominal Designation</Label>
              <div className="relative">
                <Input 
                  type="text" 
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/30 border-black/10 dark:border-white/5 text-zinc-900 dark:text-white focus-visible:ring-indigo-500/50 pl-10 font-mono text-sm h-11"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Neural Frequency (Email)</Label>
              <div className="relative">
                <Input 
                  type="email" 
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/30 border-black/10 dark:border-white/5 text-zinc-900 dark:text-white focus-visible:ring-indigo-500/50 pl-10 font-mono text-sm h-11"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Cryptographic Key</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/30 border-black/10 dark:border-white/5 text-zinc-900 dark:text-white focus-visible:ring-indigo-500/50 pl-10 pr-10 font-mono text-sm h-11"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Confirm Cryptographic Key</Label>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirm-password"
                  id="confirm-password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="" 
                  className="bg-white dark:bg-black/30 border-black/10 dark:border-white/5 text-zinc-900 dark:text-white focus-visible:ring-indigo-500/50 pl-10 pr-10 font-mono text-sm h-11"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-black/10 dark:border-white/10 bg-white dark:bg-black/50 text-indigo-500 focus:ring-indigo-500/50" 
                />
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 uppercase">I agree to the Terms of Service & Privacy Policy</span>
              </label>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-auto py-3 bg-transparent border border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-mono text-sm tracking-wider uppercase mt-4 whitespace-normal"
            >
              {isLoading ? "Establishing..." : "Establish Neural Connection"}
              <Zap className="w-4 h-4 ml-2 shrink-0" />
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-white/5"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-[#0a0a0f] px-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Alternative Uplinks</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-3 bg-white dark:bg-black/30 border-black/10 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white font-mono text-xs tracking-wider whitespace-normal"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github className="w-4 h-4 mr-2 shrink-0 text-zinc-600 dark:text-zinc-400" />
                GITHUB
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 bg-white dark:bg-black/30 border-black/10 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white font-mono text-xs tracking-wider whitespace-normal"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <div className="w-2 h-2 rounded-full shrink-0 bg-green-500 mr-2"></div>
                GOOGLE
              </Button>
            </div>

            <div className="pt-6 text-center">
              <button 
                onClick={() => onNavigate("login")}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 uppercase transition-colors flex items-center justify-center w-full gap-2"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
