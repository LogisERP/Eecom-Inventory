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
  const [phoneNumber, setPhoneNumber] = useState('');
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
      setPhoneNumber(currentUser.phoneNumber || '');
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
    if (!phoneNumber.trim() || !validatePhone10Digits(phoneNumber)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!password) {
      setErrorMsg("Password cannot be blank.");
      return;
    }

    try {
      setSubmitting(true);

      // Format phone number with standard +91 prefix
      const digits = phoneNumber.replace(/\D/g, '');
      const cleanDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
      const formattedPhone = `+91 ${cleanDigits}`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">

        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profilePic || currentUser.profilePic || DEFAULT_AVATAR}
                alt={userName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-400/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#141c25] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  My Profile Settings
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 border border-blue-400/30 text-blue-300 px-2.5 py-0.5 rounded-full">
                  {currentUser.userId || 'USR-1001'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Update your account information, authentication settings, and avatar preference.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* READ-ONLY Badges Section (User ID & Role) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User ID (Read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                User ID (System Autonumber)
              </label>
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-200/60 border border-slate-300/70 text-slate-700 font-mono text-xs font-bold">
                <span>{currentUser.userId || 'USR-1001'}</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 bg-slate-300/70 px-2 py-0.5 rounded-md">
                  Read Only
                </span>
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Assigned System Role
              </label>
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-800 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  {currentUser.roleName || 'Administrator'}
                </span>
                <span className="text-[10px] font-extrabold uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
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
                <User className="w-3.5 h-3.5 text-slate-500" />
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Varatharajan R"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. varathan@retailx.io"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password..."
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Time Format
              </label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="12-hour (hh:mm A)">12-hour (hh:mm A)</option>
                <option value="24-hour (HH:mm)">24-hour (HH:mm)</option>
              </select>
            </div>

            {/* Time Zone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Time Zone
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
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
