import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import type { UserItem, RoleItem } from '../types/people';
import { subscribeUsers, deleteUserFromDb, FALLBACK_AVATARS } from '../services/usersService';
import { subscribeRoles } from '../services/rolesService';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { UserDetailModal } from './UserDetailModal';

export const UserView: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDeleteConfirm, setItemToDeleteConfirm] = useState<UserItem | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribeUsers = subscribeUsers(
      (data) => {
        setUsers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore users error:", err);
        setError("Failed to load users from Firebase DB.");
        setLoading(false);
      }
    );

    const unsubscribeRoles = subscribeRoles((data) => {
      setRoles(data);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeRoles();
    };
  }, []);

  const handleListDeleteConfirm = async () => {
    if (!itemToDeleteConfirm || !itemToDeleteConfirm.id) return;
    try {
      setDeletingId(itemToDeleteConfirm.id);
      await deleteUserFromDb(itemToDeleteConfirm.id);
      setItemToDeleteConfirm(null);
      setDeletingId(null);
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      alert(err.message || "Failed to delete user from DB.");
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.userName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phoneNumber.toLowerCase().includes(q) ||
      u.roleName.toLowerCase().includes(q)
    );
  });

  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="flex flex-col gap-6 pt-4 pb-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                User Management
                <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  People Group
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Manage accounts, role assignments, phone numbers (+91), and profile avatars.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
              <p className="text-xl font-black text-white mt-0.5">{users.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Accounts</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
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
            placeholder="Search by User name, email, phone, or role..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{filteredUsers.length}</strong> users
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold text-slate-600">Loading Users from Firebase DB...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <p className="text-xs font-bold text-rose-700">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <Users className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">User Profile</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Is Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => {
                  const isDeletingThis = deletingId === u.id;

                  return (
                    <tr key={u.id || u.email} className="hover:bg-slate-50/70 transition-colors">
                      {/* User Profile */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.profilePic}
                            alt={u.userName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_AVATARS[0];
                            }}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <span
                              onClick={() => setSelectedUser(u)}
                              className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors block text-sm"
                            >
                              {u.userName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">{u.timeZone.split(' ')[0]}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-800 font-semibold flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {u.phoneNumber}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Shield className="w-3 h-3 text-purple-600" />
                          {u.roleName}
                        </span>
                      </td>

                      {/* Is Active */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => setItemToDeleteConfirm(u)}
                            disabled={isDeletingThis}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 font-semibold text-xs flex items-center gap-1"
                            title="Delete User"
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
                <h3 className="text-base font-extrabold text-slate-900">Delete User</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Are you sure you want to delete user <strong className="text-slate-800">"{itemToDeleteConfirm.userName}"</strong> ({itemToDeleteConfirm.email})?
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
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingUsers={users}
        availableRoles={roles}
      />

      <EditUserModal
        user={editingUser}
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        existingUsers={users}
        availableRoles={roles}
      />

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onDeleteSuccess={() => setSelectedUser(null)}
        onEdit={(u) => {
          setSelectedUser(null);
          setEditingUser(u);
        }}
      />

    </div>
  );
};
