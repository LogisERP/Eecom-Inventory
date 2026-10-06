import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff
} from 'lucide-react';
import type { UserItem, RoleItem } from '../types/people';
import {
  validateEmail,
  validatePhone10Digits,
  isEmailUnique,
  addUserToDb
} from '../services/usersService';
import { DEFAULT_AVATAR } from '../utils/avatars';
import { RoleLookupModal } from './RoleLookupModal';
import { AvatarPicker } from './AvatarPicker';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUsers: UserItem[];
  availableRoles: RoleItem[];
}

const TIME_FORMAT_OPTIONS = [
  '12-hour (hh:mm A)',
  '24-hour (HH:mm)'
];

const TIME_ZONE_OPTIONS = [
  'IST (Asia/Kolkata - UTC+05:30)',
  'EST (America/New_York - UTC-05:00)',
  'PST (America/Los_Angeles - UTC-08:00)',
  'GMT/UTC (Coordinated Universal Time)'
];

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  existingUsers,
  availableRoles
}) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [timeFormat, setTimeFormat] = useState(TIME_FORMAT_OPTIONS[0]);
  const [timeZone, setTimeZone] = useState(TIME_ZONE_OPTIONS[0]);

  // Profile Avatar selection (Male 5 & Female 5 options)
  const [profilePic, setProfilePic] = useState(DEFAULT_AVATAR);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserName('');
      setEmail('');
      setPhoneDigits('');
      setPassword('');
      setShowPassword(false);
      
      // Default to first active role if available
      const firstActive = availableRoles.find(r => r.isActive) || availableRoles[0] || null;
      setSelectedRole(firstActive);

      setIsActive(true);
      setTimeFormat(TIME_FORMAT_OPTIONS[0]);
      setTimeZone(TIME_ZONE_OPTIONS[0]);
      setProfilePic(DEFAULT_AVATAR);
      setErrorMsg(null);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, availableRoles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation 1: User Name
    if (!userName.trim()) {
      setErrorMsg('User Name is mandatory.');
      return;
    }

    // Validation 2: Email format & uniqueness
    if (!email.trim()) {
      setErrorMsg('Email is mandatory.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g., user@example.com).');
      return;
    }
    if (!isEmailUnique(email, existingUsers)) {
      setErrorMsg(`A user with email "${email}" already exists. Email must be unique.`);
      return;
    }

    // Validation 3: 10 digit Phone number
    if (!phoneDigits.trim()) {
      setErrorMsg('Phone Number is mandatory.');
      return;
    }
    if (!validatePhone10Digits(phoneDigits)) {
      setErrorMsg('Phone Number must contain exactly 10 digits after +91.');
      return;
    }

    // Validation 4: Password
    if (!password) {
      setErrorMsg('Password is mandatory.');
      return;
    }

    // Validation 5: Role lookup
    if (!selectedRole) {
      setErrorMsg('Please select a Role for the user using the Lookup button.');
      return;
    }

    // Validation 6: Profile Avatar
    if (!profilePic) {
      setErrorMsg('Profile avatar is mandatory. Please select an avatar.');
      return;
    }

    const formattedPhone = `+91 ${phoneDigits.trim()}`;

    try {
      setIsSubmitting(true);
      await addUserToDb({
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: formattedPhone,
        password: password,
        roleId: selectedRole.roleId || selectedRole.id || '',
        roleName: selectedRole.roleName,
        isActive: isActive,
        timeFormat: timeFormat,
        timeZone: timeZone,
        profilePic: profilePic
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Failed to add user:", err);
      setErrorMsg(err.message || 'Failed to save user to database.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white">Create New User</h3>
                <p className="text-xs text-slate-400 font-medium">Add user profile, role lookup, and avatar selection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
            
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>User account created and saved to Firebase DB successfully!</span>
              </div>
            )}

            {/* Avatar Selector (Male 5 & Female 5) */}
            <AvatarPicker
              selectedUrl={profilePic}
              onSelectAvatar={(url) => setProfilePic(url)}
            />

            {/* Grid 2 Columns: User Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* User Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  User Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g., Alex Johnson"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email (Unique & Mandatory) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Email Address <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Unique & Mandatory</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@retailx.io"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

            </div>

            {/* Grid 2 Columns: Phone Number (+91 default) & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone Number: +91 default readonly prefix + 10 digits */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-200 border border-slate-300 rounded-xl select-none shrink-0">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phoneDigits}
                      maxLength={10}
                      onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 digit number"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set secure password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Role Lookup Popup trigger */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Role <span className="text-rose-500">*</span></span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Lookup Popup</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  {selectedRole ? (
                    <span>{selectedRole.roleName} <span className="font-mono text-[11px] text-slate-500">({selectedRole.roleId})</span></span>
                  ) : (
                    <span className="text-slate-400 italic">No Role Selected</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLookupOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Lookup Role
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: Time Format & Time Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Time Format Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Time Format <span className="text-rose-500">*</span>
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {TIME_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Time Zone Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Time Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {TIME_ZONE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Is Active Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Is Active</span>
                <span className="text-[11px] text-slate-500">Allow this user to sign in and access the system</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="text-blue-600 hover:opacity-80 transition-opacity"
              >
                {isActive ? (
                  <ToggleRight className="w-8 h-8 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving User...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Save User
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Role Lookup Popup */}
      <RoleLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        roles={availableRoles}
        selectedRoleId={selectedRole?.roleId || ''}
        onSelectRole={(r) => setSelectedRole(r)}
      />
    </>
  );
};
