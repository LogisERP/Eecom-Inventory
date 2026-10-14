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
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    try {
      setIsLoading(true);
      const user = await authenticateUser(phoneDigits, password);
      setSuccessMsg(`Welcome back, ${user.userName}! 🎉`);
      setTimeout(() => { setIsLoading(false); onLoginSuccess(user); }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--grad-app-bg)', fontFamily: 'var(--font-game)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(108,60,225,0.18)' }} />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(244,63,94,0.12)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(108,60,225,0.07)' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-sm animate-scale-in"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid rgba(108,60,225,0.15)',
          boxShadow: '0 24px 64px rgba(108,60,225,0.18), 0 2px 8px rgba(108,60,225,0.08)',
          padding: '36px 32px 32px',
        }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          {/* Logo badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 p-2.5 shadow-xl"
            style={{
              background: '#FFFFFF',
              border: '2px solid var(--border-base)',
              boxShadow: '0 8px 24px rgba(112,67,245,0.18)',
            }}>
            <img src="/logo-mark.png" alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-primary)' }}>
            Ecom <span style={{ color: 'var(--clr-primary)' }}>ERP</span>
          </h1>
          <p className="text-xs font-semibold mt-1" style={{ color: 'var(--txt-muted)' }}>
            Sign in to your workspace
          </p>

          {/* PRO badge */}
          <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-black"
            style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>
            <Sparkles className="w-2.5 h-2.5" /> PRO SUITE
          </div>
        </div>

        {/* Alert messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in"
            style={{ background: 'var(--clr-error-lt)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--clr-error)' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in"
            style={{ background: 'var(--clr-success-lt)', border: '1px solid rgba(16,185,129,0.25)', color: 'var(--clr-success)' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold flex items-center gap-1.5"
              style={{ color: 'var(--txt-primary)' }}>
              <Phone className="w-3.5 h-3.5" style={{ color: 'var(--clr-primary)' }} />
              Phone Number <span style={{ color: 'var(--clr-accent)' }}>*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2.5 text-xs font-black rounded-xl shrink-0 select-none"
                style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)', border: '1.5px solid var(--border-base)' }}>
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phoneDigits}
                onChange={handlePhoneChange}
                placeholder="10-digit number"
                required
                className="w-full px-4 py-2.5 text-xs font-bold outline-none transition-all"
                style={{
                  background: '#F8F6FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--txt-primary)',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--clr-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--clr-primary-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold flex items-center gap-1.5"
              style={{ color: 'var(--txt-primary)' }}>
              <Lock className="w-3.5 h-3.5" style={{ color: 'var(--clr-primary)' }} />
              Password <span style={{ color: 'var(--clr-accent)' }}>*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-4 pr-10 py-2.5 text-xs font-semibold outline-none transition-all"
                style={{
                  background: '#F8F6FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--txt-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--clr-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--clr-primary-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                style={{ color: 'var(--txt-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--clr-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--txt-muted)')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 text-white font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{
              background: isLoading ? 'var(--clr-primary)' : 'var(--grad-primary)',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-btn)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing In...</span></>
            ) : (
              <><LogIn className="w-4 h-4" /><span>Sign In</span></>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-[10px] font-semibold mt-5" style={{ color: 'var(--txt-muted)' }}>
          Powered by <span className="font-black" style={{ color: 'var(--clr-primary)' }}>Ecom ERP</span> · Secured via Firebase Auth
        </p>
      </div>
    </div>
  );
};
