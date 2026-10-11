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

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  activeStatusFilter,
  setActiveStatusFilter,
  onSelectProduct,
  onOpenAddModal,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchesStatus =
      activeStatusFilter === 'All' || p.status.toLowerCase() === activeStatusFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 animate-fade-in pb-32 pt-2">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-black text-slate-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            CATALOG REPOSITORY
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Inventory Catalog</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Manage stock levels, SKUs, and pricing across categories</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="py-3 px-6 rounded-full bg-[#121316] hover:bg-black text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 self-start sm:self-auto w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {([
          { id: 'All', label: 'All Items', count: products.length, activeClass: 'bg-[#121316] text-white border-black', textClass: 'text-slate-500' },
          { id: 'In Stock', label: 'In Stock', count: 495, activeClass: 'bg-emerald-600 text-white border-emerald-700', textClass: 'text-emerald-600' },
          { id: 'Low Stock', label: 'Low Stock', count: 120, activeClass: 'bg-purple-600 text-white border-purple-700', textClass: 'text-purple-600' },
          { id: 'Out of Stock', label: 'Out of Stock', count: 89, activeClass: 'bg-rose-600 text-white border-rose-700', textClass: 'text-rose-600' },
          { id: 'Dead Stock', label: 'Dead Stock', count: 20, activeClass: 'bg-slate-800 text-white border-slate-900', textClass: 'text-slate-500' },
        ]).map((item) => {
          const active = activeStatusFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStatusFilter(item.id)}
              className={`p-4 sm:p-5 rounded-[24px] border text-left transition-all ${
                active
                  ? `${item.activeClass} shadow-md scale-[1.02]`
                  : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className={`text-xs font-bold block ${active ? 'text-white' : item.textClass}`}>
                {item.label}
              </span>
              <span className="text-xl sm:text-2xl font-black mt-1 block">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 focus-within:border-slate-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-900/10 shadow-2xs w-full sm:max-w-sm transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-900 font-bold placeholder:text-slate-400 w-full"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-black text-slate-800 outline-none shadow-2xs"
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] sm:text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4 sm:px-5">Product Name</th>
                <th className="py-3 px-4 sm:px-5">SKU ID</th>
                <th className="py-3 px-4 sm:px-5">Category</th>
                <th className="py-3 px-4 sm:px-5">Price</th>
                <th className="py-3 px-4 sm:px-5">Stock Level</th>
                <th className="py-3 px-4 sm:px-5">Demand Trend</th>
                <th className="py-3 px-4 sm:px-5">Status</th>
                <th className="py-3 px-4 sm:px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((p) => (
                <tr 
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-4 sm:px-6">
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="flex items-center gap-3.5 cursor-pointer min-w-[140px]"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-contain bg-slate-50 p-1.5 border border-slate-200/80 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-mono text-slate-500 font-bold whitespace-nowrap">{p.sku}</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-700 whitespace-nowrap">{p.category}</td>
                  <td className="py-4 px-4 sm:px-6 font-black text-slate-900 whitespace-nowrap">${p.price.toFixed(2)}</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-800 whitespace-nowrap">{p.stockCount} units</td>
                  <td className="py-4 px-4 sm:px-6 font-extrabold text-emerald-600 whitespace-nowrap">{p.demandTrend}</td>
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      p.status === 'In Stock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Low Stock'
                        ? 'bg-purple-100 text-purple-800'
                        : p.status === 'Out of Stock'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white flex items-center justify-center transition-all ml-auto"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
