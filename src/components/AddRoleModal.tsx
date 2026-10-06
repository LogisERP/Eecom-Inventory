import React, { useState, useEffect } from 'react';
import { X, Shield, AlertCircle, RefreshCw, Sparkles, CheckCircle2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { RoleItem } from '../types/people';
import { generateRoleId, isRoleNameUnique, addRoleToDb } from '../services/rolesService';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoles: RoleItem[];
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  existingRoles,
}) => {
  const [roleName, setRoleName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const generatedCode = generateRoleId(existingRoles);
      setRoleId(generatedCode);
      setRoleName('');
      setIsActive(true);
      setErrorMsg(null);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, existingRoles]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setRoleId(generateRoleId(existingRoles));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = roleName.trim();
    if (!trimmedName) {
      setErrorMsg('Role name is mandatory.');
      return;
    }

    if (!isRoleNameUnique(trimmedName, existingRoles)) {
      setErrorMsg(`A role with name "${trimmedName}" already exists. Role name must be unique.`);
      return;
    }

    if (!roleId.trim()) {
      setErrorMsg('Role ID is mandatory.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addRoleToDb({
        roleName: trimmedName,
        roleId: roleId.trim(),
        isActive: isActive
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Failed to add role:", err);
      setErrorMsg(err.message || 'Failed to save role to database.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#141c25] to-[#1e293b] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Create New Role</h3>
              <p className="text-xs text-slate-400 font-medium">Define user access levels & system permissions</p>
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
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role created and saved to Firebase DB successfully!</span>
            </div>
          )}

          {/* Role Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Role Name <span className="text-rose-500">*</span></span>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Mandatory & Unique</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g., Administrator, Inventory Manager, Auditor..."
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {/* Role ID Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Role ID <span className="text-rose-500">*</span></span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Autonumber Unique</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={roleId}
                  readOnly
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-xl cursor-not-allowed"
                />
                <Sparkles className="w-4 h-4 text-amber-500 absolute right-3 top-3 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Is Active Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Is Active</span>
              <span className="text-[11px] text-slate-500">Enable or disable this role for active users</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="text-purple-600 hover:opacity-80 transition-opacity"
            >
              {isActive ? (
                <ToggleRight className="w-8 h-8 text-purple-600" />
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Save Role
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
