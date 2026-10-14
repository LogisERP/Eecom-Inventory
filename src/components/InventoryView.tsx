import React, { useState } from 'react';
import type { ProductItem } from '../data/mockData';
import { Plus, Search, ArrowUpRight } from 'lucide-react';

interface InventoryViewProps {
  products: ProductItem[];
  activeStatusFilter: string;
  setActiveStatusFilter: (status: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpenAddModal: () => void;
}

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  'In Stock':     { bg: 'var(--clr-success-lt)',  color: 'var(--clr-success)'  },
  'Low Stock':    { bg: 'var(--clr-primary-lt)',  color: 'var(--clr-primary)'  },
  'Out of Stock': { bg: 'var(--clr-error-lt)',    color: 'var(--clr-error)'    },
  'Dead Stock':   { bg: '#F1F5F9',               color: '#64748B'             },
};

export const InventoryView: React.FC<InventoryViewProps> = ({
  products, activeStatusFilter, setActiveStatusFilter, onSelectProduct, onOpenAddModal,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchesStatus   = activeStatusFilter === 'All' || p.status.toLowerCase() === activeStatusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const statusCards = [
    { id: 'All',          label: 'All Items',     count: products.length,  gradient: 'linear-gradient(135deg,#7C50F0,#5B21B6)', dot: 'var(--clr-primary)' },
    { id: 'In Stock',     label: 'In Stock',      count: 495,              gradient: 'linear-gradient(135deg,#34D399,#10B981)', dot: 'var(--clr-success)' },
    { id: 'Low Stock',    label: 'Low Stock',     count: 120,              gradient: 'linear-gradient(135deg,#A78BFA,#6C3CE1)', dot: 'var(--clr-primary)' },
    { id: 'Out of Stock', label: 'Out of Stock',  count: 89,               gradient: 'linear-gradient(135deg,#F87171,#EF4444)', dot: 'var(--clr-error)'   },
    { id: 'Dead Stock',   label: 'Dead Stock',    count: 20,               gradient: 'linear-gradient(135deg,#94A3B8,#64748B)', dot: '#94A3B8'            },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 animate-fade-in pb-32 pt-2"
      style={{ fontFamily: 'var(--font-game)' }}>

      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7"
        style={{
          background: 'linear-gradient(135deg,#1A1033 0%,#231547 60%,#2D1A5A 100%)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(108,60,225,0.25)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black mb-2"
            style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--clr-success)' }} />
            CATALOG REPOSITORY
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Inventory Catalog</h2>
          <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Manage stock levels, SKUs, and pricing across categories
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="relative z-10 flex items-center justify-center gap-2 font-black text-xs transition-all self-start sm:self-auto"
          style={{
            background: 'var(--grad-accent)',
            color: '#fff',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 24px',
            boxShadow: 'var(--shadow-btn-accent)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusCards.map((item) => {
          const active = activeStatusFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStatusFilter(item.id)}
              className="p-4 sm:p-5 text-left transition-all"
              style={active ? {
                background: item.gradient,
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 20px rgba(108,60,225,0.30)',
                border: 'none',
                transform: 'translateY(-2px)',
              } : {
                background: '#fff',
                color: 'var(--txt-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-base)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = item.dot; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
            >
              <span className="text-xs font-bold block" style={{ color: active ? 'rgba(255,255,255,0.80)' : 'var(--txt-muted)' }}>
                {item.label}
              </span>
              <span className="text-xl sm:text-2xl font-black mt-1 block"
                style={{ color: active ? '#fff' : 'var(--txt-primary)' }}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4"
          style={{ borderBottom: '1.5px solid var(--border-base)', background: '#FAFAFA' }}>
          <div className="flex items-center gap-2.5 px-4 py-2.5 flex-1 sm:max-w-sm transition-all"
            style={{ background: '#fff', border: '1.5px solid var(--border-base)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)' }}>
            <Search className="w-4 h-4 shrink-0 stroke-[2.5]" style={{ color: 'var(--clr-primary)' }} />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold w-full"
              style={{ color: 'var(--txt-primary)' }}
              onFocus={(e) => { const p = e.target.parentElement!; p.style.borderColor = 'var(--clr-primary)'; p.style.boxShadow = '0 0 0 3px var(--clr-primary-glow)'; }}
              onBlur={(e) => { const p = e.target.parentElement!; p.style.borderColor = 'var(--border-base)'; p.style.boxShadow = 'var(--shadow-sm)'; }}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold" style={{ color: 'var(--txt-muted)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-black outline-none cursor-pointer"
              style={{
                background: '#fff',
                border: '1.5px solid var(--border-base)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
                color: 'var(--txt-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <option value="All">All Categories</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Furniture">Furniture</option>
              <option value="Shoes">Shoes</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider"
                style={{ background: 'var(--clr-primary-lt)', borderBottom: '2px solid var(--border-strong)', color: 'var(--clr-primary)' }}>
                <th className="py-3.5 px-4 sm:px-5">Product Name</th>
                <th className="py-3.5 px-4 sm:px-5">SKU ID</th>
                <th className="py-3.5 px-4 sm:px-5">Category</th>
                <th className="py-3.5 px-4 sm:px-5">Price</th>
                <th className="py-3.5 px-4 sm:px-5">Stock Level</th>
                <th className="py-3.5 px-4 sm:px-5">Demand Trend</th>
                <th className="py-3.5 px-4 sm:px-5">Status</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => {
                const badge = STATUS_BADGE[p.status] || { bg: '#F1F5F9', color: '#64748B' };
                return (
                  <tr key={p.id}
                    className="transition-colors group"
                    style={{ borderBottom: '1px solid var(--border-base)', background: idx % 2 === 0 ? '#fff' : '#FAFBFF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFBFF'; }}
                  >
                    <td className="py-4 px-4 sm:px-5">
                      <div onClick={() => onSelectProduct(p)}
                        className="flex items-center gap-3.5 cursor-pointer min-w-[140px]">
                        <img src={p.image} alt={p.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-contain p-1.5 shrink-0 group-hover:scale-105 transition-transform"
                          style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }} />
                        <span className="font-black text-sm transition-colors" style={{ color: 'var(--txt-primary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--clr-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--txt-primary)'; }}>
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-5">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>
                        {p.sku}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-5 font-bold text-xs whitespace-nowrap" style={{ color: 'var(--txt-secondary)' }}>{p.category}</td>
                    <td className="py-4 px-4 sm:px-5 font-black text-sm whitespace-nowrap" style={{ color: 'var(--txt-primary)' }}>${p.price.toFixed(2)}</td>
                    <td className="py-4 px-4 sm:px-5 font-bold text-xs whitespace-nowrap" style={{ color: 'var(--txt-secondary)' }}>{p.stockCount} units</td>
                    <td className="py-4 px-4 sm:px-5 font-extrabold text-xs whitespace-nowrap" style={{ color: 'var(--clr-success)' }}>{p.demandTrend}</td>
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black"
                        style={{ background: badge.bg, color: badge.color }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all ml-auto"
                        style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--grad-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = 'var(--shadow-btn)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-3xl flex items-center justify-center"
                style={{ background: 'var(--clr-primary-lt)' }}>
                <Search className="w-6 h-6" style={{ color: 'var(--clr-primary)' }} />
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--txt-secondary)' }}>No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
