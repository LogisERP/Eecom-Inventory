import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import type { UserItem } from '../types/people';
import { authenticateUser } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: UserItem) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phoneDigits, setPhoneDigits] = useState('9876543210');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '');
    setPhoneDigits(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!phoneDigits || phoneDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number after +91.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await authenticateUser(phoneDigits, password);
      setSuccessMsg(`Welcome back, ${user.userName}! Authenticating workspace...`);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
      }, 600);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid Phone Number or Password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      
      {/* Dynamic Ambient Mesh Glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Split Container Card */}
      <div className="w-full max-w-5xl bg-[#0e1422]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto">
        
        {/* Left Side Feature Hero Banner (Visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#121929] via-[#0d1320] to-[#080d17] p-8 lg:p-10 flex-col justify-between border-r border-slate-800/70 relative">
          
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d131f] rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                R
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                Retail <span className="text-blue-400">- X</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Enterprise ERP</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="my-8 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold w-fit">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Inventory Control</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
              Streamline Operations,<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Empower Growth.
              </span>
            </h2>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Unified multi-channel stock management, role-based governance, and real-time sales reporting in one secure portal.
            </p>

            {/* Highlights Grid */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Firestore Live Synchronization</h4>
                  <p className="text-[11px] text-slate-400">Instant database state updates across devices</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Marketplace Channels</h4>
                  <p className="text-[11px] text-slate-400">Track Amazon, Flipkart, Shopify & offline sales</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">People & Role Lookup Controls</h4>
                  <p className="text-[11px] text-slate-400">Granular permissions with user avatars</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 pt-4 border-t border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Security Session</span>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#0e1422]">
          
          <div>
            {/* Top Brand Logo (Mobile only) */}
            <div className="flex lg:hidden items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d131f] rounded-[10px] flex items-center justify-center text-white font-black text-lg">
                    R
                  </div>
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">Retail <span className="text-blue-400">- X</span></h1>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                ERP v1.0
              </span>
            </div>

            {/* Header Title */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Sign In to Workspace
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Enter your registered 10-digit Phone Number and Password to access your portal.
              </p>
            </div>

            {/* Error Alert Banner */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert Banner */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Phone Number Input (+91 readonly badge) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    Phone Number <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">10-Digit Mobile</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-3 bg-[#161d2d] border border-slate-700/80 rounded-2xl text-xs font-extrabold text-slate-300 select-none shrink-0 shadow-inner">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      placeholder="Enter 10-digit number"
                      required
                      className="w-full px-4 py-3 text-xs font-mono font-bold text-white bg-[#161d2d] border border-slate-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Password <span className="text-rose-400">*</span>
                  </span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                    className="w-full pl-4 pr-11 py-3 text-xs font-semibold text-white bg-[#161d2d] border border-slate-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-700 bg-[#161d2d] text-blue-600 focus:ring-blue-500/30 transition-colors cursor-pointer"
                  />
                  <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                    Keep me signed in
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs tracking-wide shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Bottom Card Footer */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Powered by LogisERP</span>
            <span className="font-mono text-[10px] text-slate-400">DB: Firestore Online</span>
          </div>

        </div>

      </div>

    </div>
  );
};
