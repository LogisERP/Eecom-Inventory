import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Shield,
  Sparkles,
  UserCheck
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

  const handleQuickFill = (phone: string, pass: string) => {
    setPhoneDigits(phone);
    setPassword(pass);
    setErrorMsg(null);
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
    <div className="min-h-screen w-screen bg-[#090d16] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-[#131926]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 my-auto">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center mb-1">
            <div className="w-full h-full bg-[#0d131f] rounded-[14px] flex items-center justify-center text-white">
              <span className="text-2xl font-black tracking-wider">R</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Retail <span className="text-blue-400">- X</span></h1>
            <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
              ERP v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Sign in to your account with Phone Number & Password</p>
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
          
          {/* Phone Number Field (+91 default readonly) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Phone Number <span className="text-rose-400">*</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 select-none shrink-0 shadow-inner">
                +91
              </span>
              <div className="relative flex-1">
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneDigits}
                  onChange={handlePhoneChange}
                  placeholder="10 digit number"
                  required
                  className="w-full pl-3.5 pr-4 py-2.5 text-xs font-bold font-mono text-white bg-slate-900/80 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
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
                placeholder="Enter password"
                required
                className="w-full pl-3.5 pr-10 py-2.5 text-xs font-semibold text-white bg-slate-900/80 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/30"
              />
              <span className="font-semibold text-slate-300">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating User...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Workspace</span>
              </>
            )}
          </button>

        </form>

        {/* Demo Quick-Fill Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Quick Fill:
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Click to auto-fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('9876543210', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-white block truncate group-hover:text-blue-300">
                  Admin User
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">9876543210</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('9123456789', 'ManagerSecret#99')}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-white block truncate group-hover:text-purple-300">
                  Store Manager
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">9123456789</span>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-[11px] text-slate-600 font-medium">
        Retail - X Inventory Management System &bull; Secured with Firestore DB Auth
      </div>
    </div>
  );
};
