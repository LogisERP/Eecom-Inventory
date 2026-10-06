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
  Loader2,
  Users
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
    <div className="flex flex-col gap-6 pt-4 pb-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e1b4b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Roles & Permissions
                <span className="text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                  People Group
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Define user access roles and auto-numbered role identifiers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total System Roles</span>
              <p className="text-xl font-black text-white mt-0.5">{roles.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Roles</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Role name or Role ID..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{filteredRoles.length}</strong> roles
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-xs font-bold text-slate-600">Loading Roles from DB...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <p className="text-xs font-bold text-rose-700">{error}</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No roles found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Role Name</th>
                  <th className="py-3.5 px-4">Role ID</th>
                  <th className="py-3.5 px-4">Is Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoles.map((role) => {
                  const isDeletingThis = deletingId === role.id;

                  return (
                    <tr key={role.id || role.roleId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-sm">
                            <Shield className="w-4 h-4" />
                          </div>
                          <span
                            onClick={() => setSelectedRole(role)}
                            className="font-extrabold text-slate-900 hover:text-purple-600 cursor-pointer transition-colors text-sm"
                          >
                            {role.roleName}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                          {role.roleId}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {role.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRole(role)}
                            className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="View Role Details"
                          >
                            <Eye className="w-4 h-4 text-purple-600" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          <button
                            onClick={() => setEditingRole(role)}
                            className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="Edit Role"
                          >
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => setItemToDeleteConfirm(role)}
                            disabled={isDeletingThis}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="Delete Role"
                          >
                            {isDeletingThis ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 text-rose-500" />
                                <span className="hidden sm:inline text-rose-600">Delete</span>
                              </>
                            )}
                          </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Role</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Are you sure you want to delete role <strong className="text-slate-800">"{itemToDeleteConfirm.roleName}"</strong> ({itemToDeleteConfirm.roleId})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setItemToDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleListDeleteConfirm}
                disabled={deletingId !== null}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
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
