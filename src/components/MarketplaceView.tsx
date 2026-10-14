import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  Trash2,
  Eye,
  Edit3,
  Building2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Tag
} from 'lucide-react';
import type { MarketplaceItem } from '../types/marketplace';
import { subscribeMarketplaces, deleteMarketplaceFromDb } from '../services/marketplaceService';
import { AddMarketplaceModal } from './AddMarketplaceModal';
import { EditMarketplaceModal } from './EditMarketplaceModal';
import { MarketplaceDetailModal } from './MarketplaceDetailModal';

export const MarketplaceView: React.FC = () => {
  const [marketplaces, setMarketplaces] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceItem | null>(null);
  const [editingMarketplace, setEditingMarketplace] = useState<MarketplaceItem | null>(null);

  // Deleting item state for list-level delete action
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDeleteConfirm, setItemToDeleteConfirm] = useState<MarketplaceItem | null>(null);

  // Real-time Firebase listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeMarketplaces(
      (data) => {
        setMarketplaces(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to load marketplace data from Firebase. Check connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // List level delete action
  const handleListDeleteConfirm = async () => {
    if (!itemToDeleteConfirm || !itemToDeleteConfirm.id) return;
    try {
      setDeletingId(itemToDeleteConfirm.id);
      await deleteMarketplaceFromDb(itemToDeleteConfirm.id);
      setItemToDeleteConfirm(null);
      setDeletingId(null);
    } catch (err: any) {
      console.error("Failed to delete marketplace from list:", err);
      alert(err.message || "Failed to delete marketplace from Firebase database.");
      setDeletingId(null);
    }
  };

  // Filtered marketplaces based on search
  const filteredMarketplaces = marketplaces.filter((mkt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      mkt.salesChannel.toLowerCase().includes(q) ||
      mkt.marketplaceId.toLowerCase().includes(q) ||
      (mkt.createdBy && mkt.createdBy.toLowerCase().includes(q)) ||
      mkt.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 pt-4 pb-8">

      {/* Top Banner & Stats */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          background: 'var(--grad-hero)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '24px',
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 flex items-center justify-center font-bold text-white shadow-md"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Marketplace Management
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5"
                  style={{
                    background: 'rgba(244,63,94,0.25)',
                    color: '#FFA1B5',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(244,63,94,0.4)',
                  }}
                >
                  Firebase Sync
                </span>
              </h1>
              <p className="text-xs text-purple-200 font-semibold mt-0.5">
                Manage sales channels, auto-generated marketplace IDs, and platform configurations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 text-white font-black text-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            style={{
              background: 'var(--grad-accent)',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 24px',
              boxShadow: 'var(--shadow-btn-accent)',
            }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Marketplace</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-white/10">
          <div
            className="p-3.5 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Total Marketplaces</span>
              <p className="text-2xl font-black text-white mt-0.5">{marketplaces.length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(108,60,225,0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#C4B5FD',
              }}
            >
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div
            className="p-3.5 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Primary Channels</span>
              <p className="text-2xl font-black text-emerald-300 mt-0.5">{marketplaces.length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#6EE7B7',
              }}
            >
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div
            className="p-3.5 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Firebase DB Status</span>
              <p className="text-xs font-black text-amber-300 flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#FCD34D',
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Toolbar & Search */}
      <div
        className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Sales Channel or Marketplace ID..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
            style={{ borderRadius: 'var(--radius-pill)' }}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-bold text-slate-500">
          <span>Showing <strong className="text-purple-700 font-black">{filteredMarketplaces.length}</strong> entries</span>
        </div>
      </div>

      {/* Main Table / Data View */}
      <div
        className="overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-md)',
        }}
      >

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-purple-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-xs font-bold text-purple-800">Syncing Marketplace data from Firebase DB...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <p className="text-xs font-black text-rose-700">{error}</p>
          </div>
        ) : filteredMarketplaces.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 flex items-center justify-center text-purple-600"
              style={{
                background: 'var(--clr-primary-lt)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-black text-purple-950">No Marketplaces Found</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {searchQuery ? `No entries match "${searchQuery}".` : 'Click "Add Marketplace" to create your first sales channel entry.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 text-white font-black text-xs transition-all active:scale-95 cursor-pointer"
                style={{
                  background: 'var(--grad-primary)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '10px 20px',
                  boxShadow: 'var(--shadow-btn-primary)',
                }}
              >
                + Create Entry
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-black uppercase tracking-wider text-purple-900"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    borderColor: 'var(--border-base)',
                  }}
                >
                  <th className="py-4 px-5">Sales Channel (Primary Column)</th>
                  <th className="py-4 px-4">Marketplace ID</th>
                  <th className="py-4 px-4">Created By</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-xs">
                {filteredMarketplaces.map((mkt) => {
                  const isDeletingThis = deletingId === mkt.id;

                  return (
                    <tr
                      key={mkt.id || mkt.marketplaceId}
                      className="hover:bg-purple-50/50 transition-colors group"
                    >
                      {/* Primary Column: Sales Channel */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 flex items-center justify-center font-black text-sm shrink-0"
                            style={{
                              background: 'var(--clr-primary-lt)',
                              color: 'var(--clr-primary)',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid rgba(108,60,225,0.15)',
                            }}
                          >
                            {mkt.salesChannel.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span
                              onClick={() => setSelectedMarketplace(mkt)}
                              className="font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer transition-colors block text-sm"
                            >
                              {mkt.salesChannel}
                            </span>
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 mt-0.5"
                              style={{
                                background: 'rgba(37,99,235,0.1)',
                                color: 'var(--clr-secondary)',
                                borderRadius: 'var(--radius-pill)',
                              }}
                            >
                              <Tag className="w-3 h-3 text-blue-600" />
                              Primary Channel
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Marketplace ID (Auto Generated Code) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="font-mono font-bold text-purple-900 px-2.5 py-1 text-xs tracking-wide"
                          style={{
                            background: 'var(--clr-primary-lt)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(108,60,225,0.15)',
                          }}
                        >
                          {mkt.marketplaceId}
                        </span>
                      </td>

                      {/* Created By (User ID) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 text-xs"
                          style={{
                            background: 'rgba(244,63,94,0.1)',
                            color: 'var(--clr-accent)',
                            borderRadius: 'var(--radius-pill)',
                          }}
                        >
                          {mkt.createdBy || 'USR-1001'}
                        </span>
                      </td>

                      {/* Notes (Text Area Preview) */}
                      <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                        <p className="text-slate-600 font-semibold line-clamp-2 leading-relaxed">
                          {mkt.notes ? mkt.notes : <span className="text-slate-400 italic font-normal">No notes</span>}
                        </p>
                      </td>

                      {/* Actions: View, Edit & List-level Delete */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedMarketplace(mkt)}
                            className="p-2 text-blue-700 hover:bg-blue-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                            style={{
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid rgba(37,99,235,0.2)',
                            }}
                            title="View Marketplace Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {/* List Level Edit Button */}
                          <button
                            onClick={() => setEditingMarketplace(mkt)}
                            className="p-2 text-purple-700 hover:bg-purple-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                            style={{
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid rgba(108,60,225,0.2)',
                            }}
                            title="Edit Marketplace"
                          >
                            <Edit3 className="w-4 h-4 text-purple-600" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* List Level Delete Button */}
                          <button
                            onClick={() => setItemToDeleteConfirm(mkt)}
                            disabled={isDeletingThis}
                            className="p-2 text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                            style={{
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid rgba(239,68,68,0.2)',
                            }}
                            title="Delete Marketplace (List Level)"
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

      {/* Delete Confirmation Modal (List Level Delete) */}
      {itemToDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md p-6 flex flex-col gap-4 animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid rgba(255,255,255,0.8)',
            }}
          >
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 flex items-center justify-center shrink-0"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--clr-danger-lt)',
                  color: 'var(--clr-danger)',
                }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-purple-950">Delete Marketplace</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Are you sure you want to delete <strong className="text-slate-800">"{itemToDeleteConfirm.salesChannel}"</strong> ({itemToDeleteConfirm.marketplaceId})?
                </p>
              </div>
            </div>

            <div
              className="p-3 text-[11px] font-black"
              style={{
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              ⚠️ This will remove the Marketplace record permanently from Firebase Firestore DB.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setItemToDeleteConfirm(null)}
                className="px-5 py-2.5 text-slate-700 text-xs font-black transition-colors cursor-pointer"
                style={{
                  background: 'var(--surface-base)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-base)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleListDeleteConfirm}
                disabled={deletingId !== null}
                className="px-5 py-2.5 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--grad-accent)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-btn-accent)',
                }}
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Marketplace Entry Modal */}
      <AddMarketplaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingMarketplaces={marketplaces}
      />

      {/* Edit Marketplace Modal */}
      <EditMarketplaceModal
        marketplace={editingMarketplace}
        isOpen={editingMarketplace !== null}
        onClose={() => setEditingMarketplace(null)}
        existingMarketplaces={marketplaces}
      />

      {/* Marketplace Detail / View Modal */}
      <MarketplaceDetailModal
        marketplace={selectedMarketplace}
        onClose={() => setSelectedMarketplace(null)}
        onDeleteSuccess={() => {
          setSelectedMarketplace(null);
        }}
        onEdit={(mkt) => {
          setSelectedMarketplace(null);
          setEditingMarketplace(mkt);
        }}
      />

    </div>
  );
};
