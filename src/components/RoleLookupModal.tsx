import React, { useState } from 'react';
import { X, Search, Shield, Check } from 'lucide-react';
import type { RoleItem } from '../types/people';

interface RoleLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: RoleItem[];
  selectedRoleId: string;
  onSelectRole: (role: RoleItem) => void;
}

export const RoleLookupModal: React.FC<RoleLookupModalProps> = ({
  isOpen,
  onClose,
  roles,
  selectedRoleId,
  onSelectRole,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const activeRoles = roles.filter(r => r.isActive);
  const filtered = activeRoles.filter(r => 
    r.roleName.toLowerCase().includes(search.toLowerCase().trim()) ||
    r.roleId.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between shrink-0"
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
              <h3 className="text-sm font-black text-purple-950">Select User Role (Lookup)</h3>
              <p className="text-[11px] text-purple-700 font-semibold">Choose from available active system roles</p>
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

        {/* Search */}
        <div className="p-4 border-b border-purple-50 shrink-0" style={{ background: 'var(--surface-base)' }}>
          <div className="relative">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 bg-white border-2 border-slate-200 focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-bold">
              No active roles match your search.
            </div>
          ) : (
            filtered.map((role) => {
              const isSelected = role.roleId === selectedRoleId || role.id === selectedRoleId;
              return (
                <div
                  key={role.id || role.roleId}
                  onClick={() => {
                    onSelectRole(role);
                    onClose();
                  }}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
                    isSelected
                      ? 'shadow-xs'
                      : 'hover:bg-purple-50/50'
                  }`}
                  style={{
                    background: isSelected ? 'var(--clr-primary-lt)' : '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    border: isSelected ? '2px solid var(--clr-primary)' : '1.5px solid var(--border-base)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center font-black text-xs shrink-0"
                      style={{
                        background: isSelected ? 'var(--grad-primary)' : 'var(--clr-primary-lt)',
                        color: isSelected ? '#FFFFFF' : 'var(--clr-primary)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{role.roleName}</h4>
                      <span className="text-[10px] font-mono text-purple-700 font-bold">ID: {role.roleId}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-6 h-6 flex items-center justify-center text-white"
                      style={{
                        background: 'var(--grad-primary)',
                        borderRadius: 'var(--radius-pill)',
                        boxShadow: 'var(--shadow-btn-primary)',
                      }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
