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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#141c25] to-[#1e293b] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Select User Role (Lookup)</h3>
              <p className="text-[11px] text-slate-400">Choose from available active system roles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
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
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50 border-purple-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-xs">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{role.roleName}</h4>
                      <span className="text-[10px] font-mono text-slate-500">ID: {role.roleId}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
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
