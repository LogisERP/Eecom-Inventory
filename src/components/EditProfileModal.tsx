import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Globe,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { UserItem } from '../types/people';
import { AvatarPicker } from './AvatarPicker';
import { DEFAULT_AVATAR } from '../utils/avatars';
import { updateUserInDb, validateEmail, validatePhone10Digits } from '../services/usersService';
import { setStoredAuthUser } from '../services/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserItem;
  onProfileUpdated: (updatedUser: UserItem) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated
}) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [password, setPassword] = useState('');
  const [timeFormat, setTimeFormat] = useState('12-hour (hh:mm A)');
  const [timeZone, setTimeZone] = useState('IST (Asia/Kolkata - UTC+05:30)');
  const [profilePic, setProfilePic] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.userName || '');
      setEmail(currentUser.email || '');
      
      // Extract 10 digits from existing phone number
      const rawDigits = (currentUser.phoneNumber || '').replace(/\D/g, '');
      const last10 = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
      setPhoneDigits(last10);

      setPassword(currentUser.password || '');
      setTimeFormat(currentUser.timeFormat || '12-hour (hh:mm A)');
      setTimeZone(currentUser.timeZone || 'IST (Asia/Kolkata - UTC+05:30)');
      setProfilePic(currentUser.profilePic || '');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation checks
    if (!userName.trim()) {
      setErrorMsg("Full Name is mandatory.");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }
    if (!phoneDigits.trim() || !validatePhone10Digits(phoneDigits)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!password) {
      setErrorMsg("Password cannot be blank.");
      return;
    }

    try {
      setSubmitting(true);

      // Standardize phone format as +91 XXXXXXXXXX
      const formattedPhone = `+91 ${phoneDigits.trim()}`;

      const updatedUser: UserItem = {
        ...currentUser,
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: formattedPhone,
        password: password,
        timeFormat: timeFormat,
        timeZone: timeZone,
        profilePic: profilePic
      };

      if (!currentUser.id) {
        throw new Error("User document ID missing. Cannot save profile to database.");
      }

      // Save to Firebase Firestore
      await updateUserInDb(currentUser.id, updatedUser);

      // Save to Local Auth Session
      setStoredAuthUser(updatedUser);

      // Trigger parent callback
      onProfileUpdated(updatedUser);

      setSuccessMsg("Profile updated successfully!");
      setSubmitting(false);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setErrorMsg(err.message || "Failed to update profile in Firebase database.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      style={{ background: 'rgba(26, 16, 51, 0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        }}
      >

        {/* Modal Top Header Banner */}
        <div
          className="p-5 sm:p-6 text-white relative shrink-0"
          style={{ background: 'var(--grad-hero)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profilePic || currentUser.profilePic || DEFAULT_AVATAR}
                alt={userName}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-white/40 shadow-lg"
                style={{ borderRadius: 'var(--radius-xl)' }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--clr-success)', border: '2px solid #FFFFFF' }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  My Profile Settings
                </h2>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                  }}
                >
                  {currentUser.userId || 'USR-1001'}
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium mt-0.5">
                Update your account details, preferences, and avatar.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">

          {/* Alert Messages */}
          {errorMsg && (
            <div
              className="p-3.5 text-xs font-bold flex items-center gap-2.5"
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
                border: '1px solid rgba(255, 71, 87, 0.3)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              className="p-3.5 text-xs font-bold flex items-center gap-2.5 animate-fade-in"
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--clr-success-lt)',
                color: 'var(--clr-success)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* READ-ONLY Badges Section (User ID & Role) */}
          <div
            className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              background: '#FAF9FF',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-base)',
            }}
          >
            {/* User ID (Read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-500" />
                User ID (System Autonumber)
              </label>
              <div
                className="flex items-center justify-between px-3.5 py-2 font-mono text-xs font-bold"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--clr-primary)',
                }}
              >
                <span>{currentUser.userId || 'USR-1001'}</span>
                <span
                  className="text-[10px] font-black uppercase px-2 py-0.5"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--clr-primary)',
                  }}
                >
                  Read Only
                </span>
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Assigned System Role
              </label>
              <div
                className="flex items-center justify-between px-3.5 py-2 text-xs font-bold"
                style={{
                  background: 'var(--clr-secondary-lt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(34, 166, 241, 0.3)',
                  color: 'var(--clr-secondary)',
                }}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {currentUser.roleName || 'Administrator'}
                </span>
                <span
                  className="text-[10px] font-black uppercase px-2 py-0.5"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--clr-secondary)',
                  }}
                >
                  Read Only
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Picker Component */}
          <AvatarPicker selectedUrl={profilePic} onSelectAvatar={(url) => setProfilePic(url)} />

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Varatharajan R"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all focus:outline-none"
                style={{
                  background: '#FAF9FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-md)',
                }}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-600" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-2.5 text-xs font-extrabold text-slate-700 select-none shrink-0 font-mono"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    border: '1.5px solid var(--border-base)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--clr-primary)',
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneDigits}
                  maxLength={10}
                  onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 text-xs font-bold font-mono text-slate-800 transition-all focus:outline-none"
                  style={{
                    background: '#FAF9FF',
                    border: '1.5px solid var(--border-base)',
                    borderRadius: 'var(--radius-md)',
                  }}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. varathan@retailx.io"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all focus:outline-none"
                style={{
                  background: '#FAF9FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-md)',
                }}
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password..."
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all focus:outline-none"
                  style={{
                    background: '#FAF9FF',
                    border: '1.5px solid var(--border-base)',
                    borderRadius: 'var(--radius-md)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Time Format
              </label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all focus:outline-none cursor-pointer"
                style={{
                  background: '#FAF9FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <option value="12-hour (hh:mm A)">12-hour (hh:mm A)</option>
                <option value="24-hour (HH:mm)">24-hour (HH:mm)</option>
              </select>
            </div>

            {/* Time Zone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                Time Zone
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all focus:outline-none cursor-pointer"
                style={{
                  background: '#FAF9FF',
                  border: '1.5px solid var(--border-base)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <option value="IST (Asia/Kolkata - UTC+05:30)">IST (Asia/Kolkata - UTC+05:30)</option>
                <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                <option value="EST (US & Canada - UTC-05:00)">EST (US & Canada - UTC-05:00)</option>
                <option value="PST (US & Canada - UTC-08:00)">PST (US & Canada - UTC-08:00)</option>
                <option value="GMT (London - UTC+00:00)">GMT (London - UTC+00:00)</option>
              </select>
            </div>

          </div>

          {/* Footer Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t shrink-0"
            style={{ borderColor: 'var(--border-base)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:text-slate-800 transition-all cursor-pointer active:scale-95"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-base)',
                background: '#FFFFFF',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              style={{
                background: 'var(--grad-accent)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-btn-accent)',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
