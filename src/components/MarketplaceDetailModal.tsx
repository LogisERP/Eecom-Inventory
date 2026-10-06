import React, { useState } from 'react';
import { X, Trash2, Calendar, FileText, Globe, Store, Copy, Check, AlertTriangle, Loader2, Edit3 } from 'lucide-react';
import type { MarketplaceItem } from '../types/marketplace';
import { deleteMarketplaceFromDb } from '../services/marketplaceService';

interface MarketplaceDetailModalProps {
  marketplace: MarketplaceItem | null;
  onClose: () => void;
  onDeleteSuccess?: (id: string) => void;
  onEdit?: (marketplace: MarketplaceItem) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  marketplace,
  onClose,
  onDeleteSuccess,
  onEdit
}) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!marketplace) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(marketplace.marketplaceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDelete = async () => {
    if (!marketplace.id) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteMarketplaceFromDb(marketplace.id);
      if (onDeleteSuccess) {
        onDeleteSuccess(marketplace.id);
      }
      onClose();
    } catch (err: any) {
      console.error("Error deleting marketplace from DB:", err);
      setDeleteError(err.message || 'Failed to delete from Firebase database');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-[#141c25] via-[#1e293b] to-[#0f172a] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Primary Sales Channel
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-white tracking-tight leading-snug break-words">
                {marketplace.salesChannel}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1.5">
                  ID: {marketplace.marketplaceId}
                  <button
                    onClick={handleCopyCode}
                    className="hover:text-white transition-colors"
                    title="Copy Marketplace ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </span>
                {copied && <span className="text-[10px] font-bold text-emerald-400">Copied!</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6">

          {deleteError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Details list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Sales Channel
              </span>
              <p className="text-xs font-extrabold text-slate-800 break-words">
                {marketplace.salesChannel}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                Marketplace ID
              </span>
              <p className="text-xs font-mono font-extrabold text-slate-800">
                {marketplace.marketplaceId}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                Created By
              </span>
              <p className="text-xs font-mono font-extrabold text-purple-700">
                {marketplace.createdBy || 'USR-1001'}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Notes & Configurations
            </span>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed min-h-[90px] max-h-[200px] overflow-y-auto whitespace-pre-wrap">
              {marketplace.notes ? marketplace.notes : <span className="italic text-slate-400">No notes attached to this marketplace entry.</span>}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            {marketplace.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Created: {new Date(marketplace.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
              By {marketplace.createdBy || 'USR-1001'}
            </span>
          </div>

          {/* Delete Confirmation Box if triggered */}
          {showConfirmDelete ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-rose-900">Are you sure you want to delete this Marketplace?</h4>
                  <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                    This action will permanently delete <span className="font-bold">"{marketplace.salesChannel}"</span> ({marketplace.marketplaceId}) from your database.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Action Footer */
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(marketplace);
                    }}
                    className="px-3.5 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Edit this marketplace"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Edit Marketplace
                  </button>
                )}

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Delete this marketplace from Database"
                >
                  <Trash2 className="w-4 h-4" />
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
