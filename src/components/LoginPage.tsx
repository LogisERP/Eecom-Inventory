import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  CheckCircle2
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
      setErrorMsg('Please enter a 10-digit Phone Number after +91.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await authenticateUser(phoneDigits, password);
      setSuccessMsg(`Welcome, ${user.userName}!`);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid Phone Number or Password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 font-sans">
      
      {/* Compact Simple Card */}
      <div className="w-full max-w-sm bg-[#1e293b] border border-slate-700/70 rounded-2xl p-6 sm:p-7 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl mb-3 shadow-md">
            E
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Ecom </span>
            <span className="text-blue-400">ERP</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Sign in with phone number & password</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Phone Number Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Phone Number <span className="text-rose-400">*</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 select-none shrink-0">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phoneDigits}
                onChange={handlePhoneChange}
                placeholder="10 digit number"
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Password <span className="text-rose-400">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-3.5 pr-10 py-2.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};
