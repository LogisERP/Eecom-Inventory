import React, { useState } from 'react';
import { X, Shield, Trash2, Calendar, AlertTriangle, Loader2, CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import type { RoleItem } from '../types/people';
import { deleteRoleFromDb } from '../services/rolesService';

interface RoleDetailModalProps {
  role: RoleItem | null;
  onClose: () => void;
  onDeleteSuccess?: () => void;
  onEdit?: (role: RoleItem) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  onClose,
  onDeleteSuccess,
  onEdit
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!role) return null;

  const handleDelete = async () => {
    if (!role.id) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteRoleFromDb(role.id);
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error deleting role:", err);
      setDeleteError(err.message || 'Failed to delete role');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md overflow-hidden transform transition-all animate-scale-in"
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
            <div
              className="w-12 h-12 flex items-center justify-center text-white shadow-md shrink-0"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {role.roleName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-mono font-bold text-purple-200 px-2.5 py-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {role.roleId}
                </span>
                {role.isActive ? (
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

          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Role Name</span>
              <p className="text-xs font-black text-purple-950">{role.roleName}</p>
            </div>
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Role ID Code</span>
              <p className="text-xs font-mono font-bold text-purple-950">{role.roleId}</p>
            </div>
          </div>

          {role.createdAt && (
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Created: {new Date(role.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                    Are you sure you want to delete <strong className="font-bold">"{role.roleName}"</strong> ({role.roleId})?
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
                      onEdit(role);
                    }}
                    className="px-4 py-2 text-purple-700 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid rgba(108,60,225,0.25)',
                    }}
                  >
                    <Edit3 className="w-4 h-4 text-purple-600" />
                    Edit Role
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
