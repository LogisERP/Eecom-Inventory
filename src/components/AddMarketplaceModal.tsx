import React, { useState, useEffect } from 'react';
import { X, Store, AlertCircle, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import type { MarketplaceItem } from '../types/marketplace';
import { generateMarketplaceId, isSalesChannelUnique, addMarketplaceToDb } from '../services/marketplaceService';
import { getStoredAuthUser } from '../services/authService';

interface AddMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMarketplaces: MarketplaceItem[];
  onSuccess?: () => void;
}

export const AddMarketplaceModal: React.FC<AddMarketplaceModalProps> = ({
  isOpen,
  onClose,
  existingMarketplaces,
  onSuccess
}) => {
  const [salesChannel, setSalesChannel] = useState('');
  const [marketplaceId, setMarketplaceId] = useState('');
  const [notes, setNotes] = useState('');
  const [createdBy, setCreatedBy] = useState('USR-1001');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-generate marketplace ID and fetch current user ID when modal opens
  useEffect(() => {
    if (isOpen) {
      const generatedCode = generateMarketplaceId(existingMarketplaces);
      const activeUser = getStoredAuthUser();
      setCreatedBy(activeUser?.userId || 'USR-1001');
      setMarketplaceId(generatedCode);
      setSalesChannel('');
      setNotes('');
      setErrorMsg(null);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, existingMarketplaces]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    const newCode = generateMarketplaceId(existingMarketplaces);
    setMarketplaceId(newCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedChannel = salesChannel.trim();
    if (!trimmedChannel) {
      setErrorMsg('Sales Channel is mandatory.');
      return;
    }

    if (!isSalesChannelUnique(trimmedChannel, existingMarketplaces)) {
      setErrorMsg(`A marketplace with Sales Channel "${trimmedChannel}" already exists. Sales Channel must be unique.`);
      return;
    }

    if (!marketplaceId.trim()) {
      setErrorMsg('Marketplace ID is mandatory.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Save to Firebase DB
      await addMarketplaceToDb({
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
      console.error("Failed to add marketplace to DB:", err);
      setErrorMsg(err.message || 'Failed to save marketplace to Firebase database. Please check your internet connection.');
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
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Add New Marketplace</h3>
              <p className="text-xs text-slate-400 font-medium">Create and register a sales channel entry in DB</p>
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
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Marketplace added and synced to Firebase DB successfully!</span>
            </div>
          )}

          {/* Grid 2 Columns: Marketplace ID & Created By User ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Marketplace ID Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Marketplace ID <span className="text-rose-500">*</span></span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Auto Generated</span>
              </label>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={marketplaceId}
                    readOnly
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none cursor-not-allowed select-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  title="Regenerate code"
                  className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Created By Field (User ID) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Created By (User ID)</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Active User</span>
              </label>
              <input
                type="text"
                value={createdBy}
                readOnly
                className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-xl cursor-not-allowed select-all"
              />
            </div>

          </div>

          {/* Sales Channel Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Sales Channel <span className="text-rose-500">*</span> <span className="text-[10px] font-normal text-slate-400">(Primary Column)</span></span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Unique & Mandatory</span>
            </label>
            <input
              type="text"
              value={salesChannel}
              onChange={(e) => {
                setSalesChannel(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g., Amazon US, Shopify Direct, Walmart, eBay..."
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              Notes <span className="text-[10px] font-normal text-slate-400">(Optional details)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add operation notes, fulfillment method, webhooks, seller ID, or channel configurations..."
              className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] hover:from-[#142944] hover:to-[#1d4ed8] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving to DB...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  Save Marketplace
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
