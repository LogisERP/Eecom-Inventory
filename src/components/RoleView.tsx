import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Search,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import type { RoleItem } from '../types/people';
import { subscribeRoles, deleteRoleFromDb } from '../services/rolesService';
import { AddRoleModal } from './AddRoleModal';
import { EditRoleModal } from './EditRoleModal';
import { RoleDetailModal } from './RoleDetailModal';

export const RoleView: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDeleteConfirm, setItemToDeleteConfirm] = useState<RoleItem | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeRoles(
      (data) => {
        setRoles(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore roles error:", err);
        setError("Failed to load roles from Firebase DB.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleListDeleteConfirm = async () => {
    if (!itemToDeleteConfirm || !itemToDeleteConfirm.id) return;
    try {
      setDeletingId(itemToDeleteConfirm.id);
      await deleteRoleFromDb(itemToDeleteConfirm.id);
      setItemToDeleteConfirm(null);
      setDeletingId(null);
    } catch (err: any) {
      console.error("Failed to delete role:", err);
      alert(err.message || "Failed to delete role from DB.");
      setDeletingId(null);
    }
  };

  const filteredRoles = roles.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return r.roleName.toLowerCase().includes(q) || r.roleId.toLowerCase().includes(q);
  });

  const activeCount = roles.filter(r => r.isActive).length;

  return (
    <div className="flex flex-col gap-5 pt-4 pb-8" style={{ fontFamily: 'var(--font-game)' }}>

      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7"
        style={{ background: 'linear-gradient(135deg,#1A1033 0%,#231547 60%,#2D1A5A 100%)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(108,60,225,0.25)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black mb-2" style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--clr-primary)' }} />
            PEOPLE GROUP
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Roles & Permissions
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(108,60,225,0.25)', color: '#C4B5FD', border: '1px solid rgba(167,139,250,0.30)' }}>Access Control</span>
          </h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Define user access roles and auto-numbered role identifiers.</p>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            {[{ label: 'Total System Roles', val: roles.length, color: '#fff' }, { label: 'Active Roles', val: activeCount, color: '#34D399' }].map(s => (
              <div key={s.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                <p className="text-xl font-black mt-0.5" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)}
          className="relative z-10 flex items-center justify-center gap-2 font-black text-xs transition-all self-start sm:self-auto"
          style={{ background: 'var(--grad-accent)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '12px 24px', boxShadow: 'var(--shadow-btn-accent)', border: 'none', cursor: 'pointer' }}>
          <Plus className="w-4 h-4" /><span>Add Role</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-2.5 px-4 py-2.5 flex-1 sm:max-w-sm" style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)', borderRadius: 'var(--radius-pill)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--clr-primary)' }} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Role name or Role ID..." className="bg-transparent border-none outline-none text-xs font-bold w-full" style={{ color: 'var(--txt-primary)' }} />
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--txt-muted)' }}>Showing <strong style={{ color: 'var(--txt-primary)' }}>{filteredRoles.length}</strong> roles</div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--clr-primary)' }} />
            <p className="text-xs font-bold" style={{ color: 'var(--txt-secondary)' }}>Loading Roles from DB...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8" style={{ color: 'var(--clr-error)' }} />
            <p className="text-xs font-bold" style={{ color: 'var(--clr-error)' }}>{error}</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center" style={{ background: 'var(--clr-primary-lt)' }}>
              <Shield className="w-6 h-6" style={{ color: 'var(--clr-primary)' }} />
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--txt-secondary)' }}>No roles found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-extrabold uppercase tracking-wider" style={{ background: 'var(--clr-primary-lt)', borderBottom: '2px solid var(--border-strong)', color: 'var(--clr-primary)' }}>
                  <th className="py-3.5 px-5">Role Name</th>
                  <th className="py-3.5 px-4">Role ID</th>
                  <th className="py-3.5 px-4">Is Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, idx) => {
                  const isDeletingThis = deletingId === role.id;
                  return (
                    <tr key={role.id || role.roleId} className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border-base)', background: idx % 2 === 0 ? '#fff' : '#FAFBFF' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFBFF'; }}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }}>
                            <Shield className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />
                          </div>
                          <span onClick={() => setSelectedRole(role)} className="font-extrabold text-sm cursor-pointer transition-colors" style={{ color: 'var(--txt-primary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--clr-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--txt-primary)'; }}>{role.roleName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>{role.roleId}</span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {role.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold" style={{ background: 'var(--clr-success-lt)', color: 'var(--clr-success)' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold" style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)' }}>
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {[{ fn: () => setSelectedRole(role), icon: <Eye className="w-4 h-4" />, label: 'View', hoverBg: 'var(--clr-primary-lt)', hoverColor: 'var(--clr-primary)' },
                            { fn: () => setEditingRole(role), icon: <Edit3 className="w-4 h-4" />, label: 'Edit', hoverBg: 'var(--clr-warning-lt)', hoverColor: 'var(--clr-warning)' },
                          ].map((btn) => (
                            <button key={btn.label} onClick={btn.fn}
                              className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                              style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = btn.hoverBg; e.currentTarget.style.color = btn.hoverColor; e.currentTarget.style.borderColor = btn.hoverColor; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-base)'; }}
                            >{btn.icon}<span className="hidden sm:inline">{btn.label}</span></button>
                          ))}
                          <button onClick={() => setItemToDeleteConfirm(role)} disabled={isDeletingThis}
                            className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                            style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-error-lt)'; e.currentTarget.style.color = 'var(--clr-error)'; e.currentTarget.style.borderColor = 'var(--clr-error)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-secondary)'; e.currentTarget.style.borderColor = 'var(--border-base)'; }}
                          >{isDeletingThis ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--clr-error)' }} /> : <><Trash2 className="w-4 h-4" /><span className="hidden sm:inline">Delete</span></>}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {itemToDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.60)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md p-6 flex flex-col gap-4 animate-scale-in"
            style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)' }}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>Delete Role</h3>
                <p className="text-xs font-medium mt-1" style={{ color: 'var(--txt-secondary)' }}>
                  Are you sure you want to delete role <strong style={{ color: 'var(--txt-primary)' }}>"{itemToDeleteConfirm.roleName}"</strong> ({itemToDeleteConfirm.roleId})?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button onClick={() => setItemToDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold transition-all"
                style={{ background: 'transparent', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >Cancel</button>
              <button onClick={handleListDeleteConfirm} disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-black text-white flex items-center gap-1.5 transition-all"
                style={{ background: 'var(--clr-error)', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.35)' }}>
                {deletingId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingRoles={roles}
      />

      <EditRoleModal
        role={editingRole}
        isOpen={editingRole !== null}
        onClose={() => setEditingRole(null)}
        existingRoles={roles}
      />

      <RoleDetailModal
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
        onDeleteSuccess={() => setSelectedRole(null)}
        onEdit={(r) => {
          setSelectedRole(null);
          setEditingRole(r);
        }}
      />

    </div>
  );
};
