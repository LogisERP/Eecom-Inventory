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
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-purple-950">Create New Role</h3>
              <p className="text-xs text-purple-700 font-semibold">Define user access levels & system permissions</p>
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
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
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
              <span>Role created and saved to Firebase DB successfully!</span>
            </div>
          )}

          {/* Role Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-purple-950 flex items-center justify-between">
              <span>Role Name <span className="text-rose-500">*</span></span>
              <span
                className="text-[10px] font-black px-2 py-0.5"
                style={{
                  background: 'var(--clr-secondary-lt)',
                  color: 'var(--clr-secondary)',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Mandatory & Unique
              </span>
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
              className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:font-medium placeholder:text-slate-400"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {/* Role ID Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-purple-950 flex items-center justify-between">
              <span>Role ID <span className="text-rose-500">*</span></span>
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
                  value={roleId}
                  readOnly
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-purple-950 bg-slate-100 border-2 border-slate-200 cursor-not-allowed"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                <Sparkles className="w-4 h-4 text-amber-500 absolute right-3 top-3 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="px-3.5 py-2.5 text-purple-800 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-base)',
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                <span>Refresh</span>
              </button>
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
              <span className="text-[11px] text-slate-500 font-medium">Enable or disable this role for active users</span>
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
