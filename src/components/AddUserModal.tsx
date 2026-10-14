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
  EyeOff,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import type { UserItem, RoleItem } from '../types/people';
import {
  validateEmail,
  validatePhone10Digits,
  isEmailUnique,
  addUserToDb,
  generateUserId
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
  const [userId, setUserId] = useState('');
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
      const generated = generateUserId(existingUsers);
      setUserId(generated);
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
  }, [isOpen, availableRoles, existingUsers]);

  if (!isOpen) return null;

  const handleRegenerateUserId = () => {
    setUserId(generateUserId(existingUsers));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation 1: User ID
    if (!userId.trim()) {
      setErrorMsg('User ID is mandatory.');
      return;
    }

    // Validation 2: User Name
    if (!userName.trim()) {
      setErrorMsg('User Name is mandatory.');
      return;
    }

    // Validation 3: Email format & uniqueness
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

    // Validation 4: 10 digit Phone number
    if (!phoneDigits.trim()) {
      setErrorMsg('Phone Number is mandatory.');
      return;
    }
    if (!validatePhone10Digits(phoneDigits)) {
      setErrorMsg('Phone Number must contain exactly 10 digits after +91.');
      return;
    }

    // Validation 5: Password
    if (!password) {
      setErrorMsg('Password is mandatory.');
      return;
    }

    // Validation 6: Role lookup
    if (!selectedRole) {
      setErrorMsg('Please select a Role for the user using the Lookup button.');
      return;
    }

    // Validation 7: Profile Avatar
    if (!profilePic) {
      setErrorMsg('Profile avatar is mandatory. Please select an avatar.');
      return;
    }

    const formattedPhone = `+91 ${phoneDigits.trim()}`;

    try {
      setIsSubmitting(true);
      await addUserToDb({
        userId: userId.trim(),
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
      >
        <div
          className="w-full max-w-2xl overflow-hidden transform transition-all my-8 animate-scale-in"
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid rgba(255,255,255,0.8)',
          }}
        >
          
          {/* Header */}
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{
              background: 'var(--clr-primary-lt)',
              borderBottom: '1px solid var(--border-base)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-white shadow-xs"
                style={{
                  background: 'var(--grad-primary)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight text-purple-950">Create New User</h3>
                <p className="text-xs text-purple-700 font-semibold">Add user profile, autonumber user ID, role lookup, and avatar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-purple-700 hover:bg-purple-200/50 transition-colors cursor-pointer"
              style={{ borderRadius: 'var(--radius-pill)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
            
            {errorMsg && (
              <div
                className="p-3.5 text-xs font-black flex items-start gap-2.5 animate-shake"
                style={{
                  background: 'var(--clr-danger-lt)',
                  color: 'var(--clr-danger)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess && (
              <div
                className="p-3.5 text-xs font-black flex items-center gap-2.5"
                style={{
                  background: 'var(--clr-success-lt)',
                  color: 'var(--clr-success)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>User account created and saved to Firebase DB successfully!</span>
              </div>
            )}

            {/* Avatar Selector (Male 5 & Female 5) */}
            <AvatarPicker
              selectedUrl={profilePic}
              onSelectAvatar={(url) => setProfilePic(url)}
            />

            {/* User ID (Autonumber Unique) Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                <span>User ID <span className="text-rose-500">*</span></span>
                <span
                  className="text-[10px] font-black px-2 py-0.5"
                  style={{
                    background: 'var(--clr-success-lt)',
                    color: 'var(--clr-success)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  Autonumber Unique
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userId}
                    readOnly
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-extrabold text-purple-950 bg-slate-100 border-2 border-slate-200 cursor-not-allowed select-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                  <Sparkles className="w-4 h-4 text-amber-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateUserId}
                  title="Regenerate User ID"
                  className="px-3.5 py-2.5 text-purple-800 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-base)',
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: User Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* User Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-purple-950">
                  User Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g., Alex Johnson"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              {/* Email (Unique & Mandatory) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                  <span>Email Address <span className="text-rose-500">*</span></span>
                  <span
                    className="text-[10px] font-black px-2 py-0.5"
                    style={{
                      background: 'var(--clr-secondary-lt)',
                      color: 'var(--clr-secondary)',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    Unique & Mandatory
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@retailx.io"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

            </div>

            {/* Grid 2 Columns: Phone Number (+91 default) & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone Number: +91 default readonly prefix + 10 digits */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-purple-950">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-3 py-2.5 text-xs font-black text-purple-900 border-2 border-slate-200 select-none shrink-0"
                    style={{
                      background: 'var(--clr-primary-lt)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phoneDigits}
                      maxLength={10}
                      onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 digit number"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-purple-950">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set secure password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Role Lookup Popup trigger */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                <span>Role <span className="text-rose-500">*</span></span>
                <span
                  className="text-[10px] font-black px-2 py-0.5"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    color: 'var(--clr-primary)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  Lookup Popup
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3.5 py-2.5 text-xs font-bold text-purple-950 flex items-center gap-2"
                  style={{
                    background: 'var(--surface-base)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-base)',
                  }}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  {selectedRole ? (
                    <span>{selectedRole.roleName} <span className="font-mono text-[11px] text-purple-700">({selectedRole.roleId})</span></span>
                  ) : (
                    <span className="text-slate-400 italic">No Role Selected</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLookupOpen(true)}
                  className="px-4 py-2.5 text-white font-black text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95"
                  style={{
                    background: 'var(--grad-primary)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-btn-primary)',
                  }}
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
                <label className="text-xs font-black text-purple-950 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Time Format <span className="text-rose-500">*</span>
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  {TIME_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Time Zone Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-purple-950 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  Time Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  {TIME_ZONE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Is Active Toggle */}
            <div
              className="p-3.5 flex items-center justify-between"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-base)',
              }}
            >
              <div>
                <span className="text-xs font-black text-purple-950 block">Is Active</span>
                <span className="text-[11px] text-slate-500 font-medium">Allow this user to sign in and access the system</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                {isActive ? (
                  <ToggleRight className="w-8 h-8 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-50 mt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                style={{
                  background: 'var(--surface-base)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-base)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="px-6 py-2.5 text-white font-black text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                style={{
                  background: 'var(--grad-primary)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-btn-primary)',
                }}
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
