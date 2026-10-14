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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg overflow-hidden transform transition-all animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        
        {/* Banner Header */}
        <div
          className="p-6 text-white relative"
          style={{ background: 'var(--grad-hero)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-3 py-0.5 text-[10px] font-black uppercase tracking-wider"
              style={{
                background: 'rgba(244,63,94,0.2)',
                color: '#FFA1B5',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(244,63,94,0.4)',
              }}
            >
              Primary Sales Channel
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center text-white shadow-md shrink-0"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <Store className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-white tracking-tight leading-snug break-words">
                {marketplace.salesChannel}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-xs font-mono font-bold text-purple-200 px-3 py-1 flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  ID: {marketplace.marketplaceId}
                  <button
                    onClick={handleCopyCode}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Copy Marketplace ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-300" />}
                  </button>
                </span>
                {copied && <span className="text-[10px] font-black text-emerald-400">Copied!</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6">

          {deleteError && (
            <div
              className="p-3.5 text-xs font-black flex items-center gap-2"
              style={{
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Details list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Sales Channel
              </span>
              <p className="text-xs font-black text-purple-950 break-words">
                {marketplace.salesChannel}
              </p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                Marketplace ID
              </span>
              <p className="text-xs font-mono font-bold text-purple-950">
                {marketplace.marketplaceId}
              </p>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                Created By
              </span>
              <p className="text-xs font-mono font-black text-purple-700">
                {marketplace.createdBy || 'USR-1001'}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              Notes & Configurations
            </span>
            <div
              className="p-4 text-xs font-medium text-slate-700 leading-relaxed min-h-[90px] max-h-[200px] overflow-y-auto whitespace-pre-wrap"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-base)',
              }}
            >
              {marketplace.notes ? marketplace.notes : <span className="italic text-slate-400">No notes attached to this marketplace entry.</span>}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            {marketplace.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                Created: {new Date(marketplace.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span
              className="font-mono px-2.5 py-0.5 font-bold"
              style={{
                background: 'var(--clr-primary-lt)',
                color: 'var(--clr-primary)',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(108,60,225,0.2)',
              }}
            >
              By {marketplace.createdBy || 'USR-1001'}
            </span>
          </div>

          {/* Delete Confirmation Box if triggered */}
          {showConfirmDelete ? (
            <div
              className="p-4 flex flex-col gap-3 animate-fade-in"
              style={{
                background: 'var(--clr-danger-lt)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-rose-950">Are you sure you want to delete this Marketplace?</h4>
                  <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    This action will permanently delete <span className="font-bold">"{marketplace.salesChannel}"</span> ({marketplace.marketplaceId}) from your database.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{
                    background: 'var(--grad-accent)',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-btn-accent)',
                  }}
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
            <div className="flex items-center justify-between pt-4 border-t border-purple-50">
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(marketplace);
                    }}
                    className="px-4 py-2 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid rgba(37,99,235,0.25)',
                    }}
                    title="Edit this marketplace"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Edit Marketplace
                  </button>
                )}

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid rgba(239,68,68,0.25)',
                  }}
                  title="Delete this marketplace from Database"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 text-purple-900 text-xs font-black transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-base)',
                }}
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
