import React, { useState, useEffect } from 'react';
import { X, Store, AlertCircle, CheckCircle2, Loader2, Edit3 } from 'lucide-react';
import type { MarketplaceItem } from '../types/marketplace';
import { isSalesChannelUnique, updateMarketplaceInDb } from '../services/marketplaceService';

interface EditMarketplaceModalProps {
  marketplace: MarketplaceItem | null;
  isOpen: boolean;
  onClose: () => void;
  existingMarketplaces: MarketplaceItem[];
  onSuccess?: () => void;
}

export const EditMarketplaceModal: React.FC<EditMarketplaceModalProps> = ({
  marketplace,
  isOpen,
  onClose,
  existingMarketplaces,
  onSuccess
}) => {
  const [salesChannel, setSalesChannel] = useState('');
  const [marketplaceId, setMarketplaceId] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [createdBy, setCreatedBy] = useState('USR-1001');

  useEffect(() => {
    if (isOpen && marketplace) {
      setSalesChannel(marketplace.salesChannel || '');
      setMarketplaceId(marketplace.marketplaceId || '');
      setNotes(marketplace.notes || '');
      setCreatedBy(marketplace.createdBy || 'USR-1001');
      setErrorMsg(null);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, marketplace]);

  if (!isOpen || !marketplace) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedChannel = salesChannel.trim();
    if (!trimmedChannel) {
      setErrorMsg('Sales Channel is mandatory.');
      return;
    }

    if (!isSalesChannelUnique(trimmedChannel, existingMarketplaces, marketplace.id)) {
      setErrorMsg(`A marketplace with Sales Channel "${trimmedChannel}" already exists. Sales Channel must be unique.`);
      return;
    }

    if (!marketplaceId.trim()) {
      setErrorMsg('Marketplace ID is mandatory.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (!marketplace.id) throw new Error("Missing document ID for update");

      await updateMarketplaceInDb(marketplace.id, {
        salesChannel: trimmedChannel,
        marketplaceId: marketplaceId.trim(),
        notes: notes.trim(),
        createdBy: createdBy || 'USR-1001'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Failed to update marketplace in DB:", err);
      setErrorMsg(err.message || 'Failed to update marketplace in database.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#141c25] to-[#1e293b] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Edit Marketplace</h3>
              <p className="text-xs text-slate-400 font-medium">Update sales channel & marketplace details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Marketplace updated in Firebase DB successfully!</span>
            </div>
          )}

          {/* Grid 2 Columns: Marketplace ID & Created By (User ID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Marketplace ID <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={marketplaceId}
                onChange={(e) => setMarketplaceId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Created By (User ID)</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">User ID</span>
              </label>
              <input
                type="text"
                value={createdBy}
                readOnly
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-xl cursor-not-allowed select-all"
              />
            </div>
          </div>

          {/* Sales Channel Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Sales Channel <span className="text-rose-500">*</span></span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Unique & Mandatory</span>
            </label>
            <input
              type="text"
              value={salesChannel}
              onChange={(e) => {
                setSalesChannel(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g., Amazon US, Shopify Direct..."
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Edit notes, webhooks, seller ID..."
              className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  Update Marketplace
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
