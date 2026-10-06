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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {product.sku}
            </span>
            <span className="text-xs font-bold text-slate-500">{product.category}</span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Photo */}
        <div className="w-full h-48 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-200/60 relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-md"
          />
          <span className="absolute top-3 right-3 bg-white text-slate-800 font-extrabold text-xs px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            {product.stockCount} in stock
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">{product.name}</h3>
          <span className="text-xs text-slate-400 font-medium mt-0.5 block">
            Category: {product.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs flex flex-col">
            <span className="text-slate-400 font-medium">Unit Price</span>
            <strong className="text-base font-black text-slate-900 mt-0.5">
              ${product.price.toFixed(2)}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs flex flex-col">
            <span className="text-slate-400 font-medium">Demand Trend</span>
            <strong className="text-base font-black text-emerald-600 mt-0.5">
              {product.demandTrend}
            </strong>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
        >
          Close Detail View
        </button>
      </div>
    </div>
  );
};
