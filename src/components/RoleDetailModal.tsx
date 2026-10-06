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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-[#141c25] via-[#1e1b4b] to-[#0f172a] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {role.roleName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {role.roleId}
                </span>
                {role.isActive ? (
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

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Role Name</span>
              <p className="text-xs font-extrabold text-slate-800">{role.roleName}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Role ID Code</span>
              <p className="text-xs font-mono font-extrabold text-slate-800">{role.roleId}</p>
            </div>
          </div>

          {role.createdAt && (
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created: {new Date(role.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                    Are you sure you want to delete <strong className="font-bold">"{role.roleName}"</strong> ({role.roleId})?
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
                      onEdit(role);
                    }}
                    className="px-3.5 py-2 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-purple-600" />
                    Edit Role
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
