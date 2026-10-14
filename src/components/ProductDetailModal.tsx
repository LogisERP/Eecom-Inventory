import React from 'react';
import type { ProductItem } from '../data/mockData';
import { X } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md overflow-hidden flex flex-col relative max-h-[90vh] animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        
        {/* Top Image Banner with Floating Pill Controls */}
        <div
          className="relative w-full h-56 flex items-center justify-center p-6"
          style={{ background: 'var(--clr-primary-lt)' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-lg"
          />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span
              className="pointer-events-auto font-mono text-[11px] font-black text-purple-950 px-3 py-1 shadow-xs"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-base)',
              }}
            >
              {product.sku}
            </span>
            <button
              onClick={onClose}
              className="pointer-events-auto w-9 h-9 text-purple-700 hover:text-purple-900 flex items-center justify-center shadow-md transition-all cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="absolute bottom-3 left-4">
            <span
              className="text-white font-black text-[11px] px-3.5 py-1 shadow-xs"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-black px-2.5 py-0.5"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--clr-success-lt)',
                  color: 'var(--clr-success)',
                }}
              >
                ● {product.status}
              </span>
              <span className="text-xs font-bold text-slate-400">
                342 verified reviews
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
              Premium grade SKU with active automated channel sync, quality inspection tracking, and optimal stock distribution.
            </p>
          </div>

          {/* Key Metric Pills */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">UNIT PRICE</span>
              <span className="text-xl font-black text-purple-950 block mt-0.5">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div
              className="p-3.5"
              style={{
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-base)',
              }}
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">AVAILABLE UNITS</span>
              <span className="text-xl font-black text-purple-950 block mt-0.5">
                {product.stockCount} in Stock
              </span>
            </div>
          </div>

          {/* Action CTA Pill */}
          <button
            onClick={onClose}
            className="w-full py-3 text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
            style={{
              background: 'var(--grad-primary)',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-btn-primary)',
            }}
          >
            <span>Confirm & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
