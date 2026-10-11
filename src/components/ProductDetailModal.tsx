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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[36px] max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh] animate-sheet-up">
        
        {/* Top Image Banner with Floating Pill Controls */}
        <div className="relative w-full h-56 bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-lg"
          />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="pointer-events-auto font-mono text-[11px] font-black text-slate-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-slate-200">
              {product.sku}
            </span>
            <button
              onClick={onClose}
              className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-black hover:bg-white flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="absolute bottom-3 left-4">
            <span className="bg-[#121316] text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-xs">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ● {product.status}
              </span>
              <span className="text-xs font-bold text-slate-400">
                342 verified reviews
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Premium grade SKU with active automated channel sync, quality inspection tracking, and optimal stock distribution.
            </p>
          </div>

          {/* Key Metric Pills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">UNIT PRICE</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">AVAILABLE UNITS</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {product.stockCount} in Stock
              </span>
            </div>
          </div>

          {/* Action CTA Pill matching 'Book a tour' */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-[#121316] hover:bg-black text-white font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Confirm & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
