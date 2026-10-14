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
        
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background: 'var(--clr-primary-lt)',
            borderBottom: '1px solid var(--border-base)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center font-bold text-white shadow-xs"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-purple-950">Edit Marketplace</h3>
              <p className="text-xs text-purple-700 font-semibold">Update sales channel & marketplace details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-purple-700 hover:bg-purple-200/50 transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {errorMsg && (
            <div
              className="p-3.5 text-xs font-black flex items-start gap-2.5 animate-shake"
              style={{
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div
              className="p-3.5 text-xs font-black flex items-center gap-2.5"
              style={{
                background: 'var(--clr-success-lt)',
                color: 'var(--clr-success)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Marketplace updated in Firebase DB successfully!</span>
            </div>
          )}

          {/* Grid 2 Columns: Marketplace ID & Created By (User ID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                <span>Marketplace ID <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={marketplaceId}
                onChange={(e) => setMarketplaceId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                <span>Created By (User ID)</span>
                <span
                  className="text-[10px] font-black px-2 py-0.5"
                  style={{
                    background: 'rgba(244,63,94,0.1)',
                    color: 'var(--clr-accent)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  User ID
                </span>
              </label>
              <input
                type="text"
                value={createdBy}
                readOnly
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-purple-950 bg-slate-100 border-2 border-slate-200 cursor-not-allowed select-all"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          {/* Sales Channel Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-purple-950 flex items-center justify-between">
              <span>Sales Channel <span className="text-rose-500">*</span></span>
              <span
                className="text-[10px] font-black px-2 py-0.5"
                style={{
                  background: 'var(--clr-secondary-lt)',
                  color: 'var(--clr-secondary)',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Unique & Mandatory
              </span>
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
              className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:font-medium placeholder:text-slate-400"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-purple-950">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Edit notes, webhooks, seller ID..."
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:font-medium placeholder:text-slate-400 resize-none"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-50 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-base)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-6 py-2.5 text-white font-black text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-btn-primary)',
              }}
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
