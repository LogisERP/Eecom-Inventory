import React, { useState } from 'react';
import type { ProductItem } from '../data/mockData';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (prod: ProductItem) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductItem['category']>('Fashion');
  const [price, setPrice] = useState('99.00');
  const [stockCount, setStockCount] = useState('100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      sku: `RT${Math.floor(10000000 + Math.random() * 90000000)}`,
      name,
      category,
      price: parseFloat(price) || 99.00,
      ordersCount: 1,
      stockCount: parseInt(stockCount) || 100,
      status: 'In Stock',
      image: category === 'Jewelry' ? '/gold_bracelet.png' : category === 'Furniture' ? '/blue_plush.png' : category === 'Shoes' ? '/woman_heels.png' : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
      demandTrend: '+15%',
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="max-w-md w-full overflow-hidden flex flex-col gap-4 animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: 'var(--clr-primary-lt)',
            borderBottom: '1px solid var(--border-base)',
          }}
        >
          <h3 className="text-base font-black text-purple-950">Add Product to Catalog</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-purple-700 hover:bg-purple-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-purple-950 mb-1 block">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Leather Designer Watch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-purple-950 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-500 transition-all"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <option value="Fashion">Fashion</option>
                <option value="Shoes">Shoes</option>
                <option value="Electronics">Electronics</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-purple-950 mb-1 block">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-500 transition-all"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-950 mb-1 block">Initial Stock Units</label>
            <input
              type="number"
              value={stockCount}
              onChange={(e) => setStockCount(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-500 transition-all"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-purple-50 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
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
              className="px-6 py-2.5 text-white text-xs font-black transition-all cursor-pointer active:scale-95"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-btn-primary)',
              }}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
