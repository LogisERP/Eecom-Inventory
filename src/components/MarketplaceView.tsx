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
      mkt.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 pt-4 pb-8">

      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Marketplace Management
                <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  Firebase Sync
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Manage sales channels, auto-generated marketplace IDs, and platform configurations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Marketplace</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Marketplaces</span>
              <p className="text-xl font-black text-white mt-0.5">{marketplaces.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Sales Channels</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{marketplaces.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Firebase DB Status</span>
              <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
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
            placeholder="Search by Sales Channel or Marketplace ID..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-slate-500">
          <span>Showing <strong className="text-slate-800">{filteredMarketplaces.length}</strong> entries</span>
        </div>
      </div>

      {/* Main Table / Data View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold text-slate-600">Syncing Marketplace data from Firebase DB...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <p className="text-xs font-bold text-rose-700">{error}</p>
          </div>
        ) : filteredMarketplaces.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">No Marketplaces Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery ? `No entries match "${searchQuery}".` : 'Click "Add Marketplace" to create your first sales channel entry.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
              >
                + Create Entry
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Sales Channel (Primary Column)</th>
                  <th className="py-3.5 px-4">Marketplace ID</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMarketplaces.map((mkt) => {
                  const isDeletingThis = deletingId === mkt.id;

                  return (
                    <tr
                      key={mkt.id || mkt.marketplaceId}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Primary Column: Sales Channel */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                            {mkt.salesChannel.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span
                              onClick={() => setSelectedMarketplace(mkt)}
                              className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors block text-sm"
                            >
                              {mkt.salesChannel}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mt-0.5">
                              <Tag className="w-3 h-3 text-blue-500" />
                              Primary Channel
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Marketplace ID (Auto Generated Code) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs tracking-wide">
                          {mkt.marketplaceId}
                        </span>
                      </td>

                      {/* Notes (Text Area Preview) */}
                      <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                        <p className="text-slate-600 font-medium line-clamp-2 leading-relaxed">
                          {mkt.notes ? mkt.notes : <span className="text-slate-400 italic">No notes</span>}
                        </p>
                      </td>

                      {/* Actions: View, Edit & List-level Delete */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedMarketplace(mkt)}
                            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1"
                            title="View Marketplace Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {/* List Level Edit Button */}
                          <button
                            onClick={() => setEditingMarketplace(mkt)}
                            className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1"
                            title="Edit Marketplace"
                          >
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* List Level Delete Button */}
                          <button
                            onClick={() => setItemToDeleteConfirm(mkt)}
                            disabled={isDeletingThis}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Marketplace</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Are you sure you want to delete <strong className="text-slate-800">"{itemToDeleteConfirm.salesChannel}"</strong> ({itemToDeleteConfirm.marketplaceId})?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-[11px] font-semibold text-rose-700">
              ⚠️ This will remove the Marketplace record permanently from Firebase Firestore DB.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setItemToDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleListDeleteConfirm}
                disabled={deletingId !== null}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
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
