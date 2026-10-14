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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg overflow-hidden transform transition-all my-8 animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        
        {/* Banner Header */}
        <div
          className="p-6 text-white relative"
          style={{ background: 'var(--grad-hero)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              className="w-16 h-16 object-cover shadow-lg shrink-0"
              style={{
                borderRadius: 'var(--radius-xl)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-white tracking-tight break-words">
                {user.userName}
              </h2>
              <p className="text-xs text-purple-200 font-semibold truncate">{user.email}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {user.userId || 'USR-1001'}
                </span>
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5"
                  style={{
                    background: 'rgba(244,63,94,0.2)',
                    color: '#FFA1B5',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(244,63,94,0.4)',
                  }}
                >
                  {user.roleName}
                </span>
                {user.isActive ? (
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 flex items-center gap-1"
                    style={{
                      background: 'rgba(16,185,129,0.2)',
                      color: '#6EE7B7',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid rgba(16,185,129,0.4)',
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 flex items-center gap-1"
                    style={{
                      background: 'rgba(244,63,94,0.2)',
                      color: '#FDA4AF',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid rgba(244,63,94,0.4)',
                    }}
                  >
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
            <div
              className="p-3.5 text-xs font-black flex items-center gap-2"
              style={{
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                Email
              </span>
              <p className="text-xs font-black text-purple-950 truncate">{user.email}</p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Phone (+91)
              </span>
              <p className="text-xs font-mono font-bold text-purple-950">{user.phoneNumber}</p>
            </div>

            {/* Password (Masked after save) */}
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-500" /> Password</span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-purple-600 hover:text-purple-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </span>
              <p className="text-xs font-mono font-bold text-purple-950">
                {showPassword ? user.password : '••••••••••••'}
              </p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Role
              </span>
              <p className="text-xs font-black text-purple-950">{user.roleName}</p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Time Format
              </span>
              <p className="text-xs font-semibold text-purple-950">{user.timeFormat}</p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                Time Zone
              </span>
              <p className="text-xs font-semibold text-purple-950 truncate">{user.timeZone}</p>
            </div>

          </div>

          <div
            className="p-3 text-[11px] font-mono text-purple-700 truncate"
            style={{
              background: 'var(--clr-primary-lt)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-base)',
            }}
          >
            Profile Pic Path: <span className="text-purple-950 font-bold">{user.profilePic}</span>
          </div>

          {user.createdAt && (
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Registered: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}

          {/* Confirm Delete Box */}
          {showConfirmDelete ? (
            <div
              className="p-4 flex flex-col gap-3 animate-fade-in"
              style={{
                background: 'var(--clr-danger-lt)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-rose-950">Confirm Deletion</h4>
                  <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    Are you sure you want to delete user <strong className="font-bold">"{user.userName}"</strong> ({user.email})?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{
                    background: 'var(--grad-accent)',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-btn-accent)',
                  }}
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-purple-50">
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(user);
                    }}
                    className="px-4 py-2 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid rgba(37,99,235,0.25)',
                    }}
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Edit User
                  </button>
                )}

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid rgba(239,68,68,0.25)',
                  }}
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  Delete
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 text-purple-900 text-xs font-black transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-base)',
                }}
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
