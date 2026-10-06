import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  Shield,
  Clock,
  Globe,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit3
} from 'lucide-react';
import type { UserItem } from '../types/people';
import { deleteUserFromDb } from '../services/usersService';
import { DEFAULT_AVATAR } from '../utils/avatars';

interface UserDetailModalProps {
  user: UserItem | null;
  onClose: () => void;
  onDeleteSuccess?: () => void;
  onEdit?: (user: UserItem) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
  onDeleteSuccess,
  onEdit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) return null;

  const handleDelete = async () => {
    if (!user.id) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteUserFromDb(user.id);
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setDeleteError(err.message || 'Failed to delete user');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8">
        
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-[#141c25] via-[#1e293b] to-[#0f172a] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.profilePic || DEFAULT_AVATAR}
              alt={user.userName}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = DEFAULT_AVATAR;
              }}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/40 shadow-lg bg-slate-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-white tracking-tight break-words">
                {user.userName}
              </h2>
              <p className="text-xs text-slate-300 font-medium truncate">{user.email}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-mono font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  {user.userId || 'USR-1001'}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                  {user.roleName}
                </span>
                {user.isActive ? (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5">

          {deleteError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                Email
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                Phone (+91)
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">{user.phoneNumber}</p>
            </div>

            {/* Password (Masked after save) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-500" /> Password</span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">
                {showPassword ? user.password : '••••••••••••'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                Role
              </span>
              <p className="text-xs font-extrabold text-slate-800">{user.roleName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Time Format
              </span>
              <p className="text-xs font-semibold text-slate-800">{user.timeFormat}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Time Zone
              </span>
              <p className="text-xs font-semibold text-slate-800 truncate">{user.timeZone}</p>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 truncate">
            Profile Pic Path: <span className="text-slate-700 font-semibold">{user.profilePic}</span>
          </div>

          {user.createdAt && (
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Registered: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}

          {/* Confirm Delete Box */}
          {showConfirmDelete ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-rose-900">Confirm Deletion</h4>
                  <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                    Are you sure you want to delete user <strong className="font-bold">"{user.userName}"</strong> ({user.email})?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(user);
                    }}
                    className="px-3.5 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Edit User
                  </button>
                )}

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  Delete
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs"
              >
                Close
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
