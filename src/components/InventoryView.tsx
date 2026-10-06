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
    <div className="w-full flex flex-col gap-3.5 sm:gap-5 animate-fade-in pb-10">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-[24px] border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-slate-800">Inventory Catalog</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Manage stock levels, SKUs, and pricing across categories</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {([
          { id: 'All', label: 'All Items', count: products.length, activeClass: 'bg-[#19232d] text-white border-slate-800', textClass: 'text-slate-300' },
          { id: 'In Stock', label: 'In Stock', count: 495, activeClass: 'bg-emerald-600 text-white border-emerald-700', textClass: 'text-emerald-600' },
          { id: 'Low Stock', label: 'Low Stock', count: 120, activeClass: 'bg-purple-600 text-white border-purple-700', textClass: 'text-purple-600' },
          { id: 'Out of Stock', label: 'Out of Stock', count: 89, activeClass: 'bg-rose-600 text-white border-rose-700', textClass: 'text-rose-600' },
          { id: 'Dead Stock', label: 'Dead Stock', count: 20, activeClass: 'bg-slate-700 text-white border-slate-800', textClass: 'text-slate-500' },
        ]).map((item) => {
          const active = activeStatusFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStatusFilter(item.id)}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
                active
                  ? `${item.activeClass} shadow-md`
                  : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] sm:text-xs font-semibold block ${active ? 'text-white' : item.textClass}`}>
                {item.label}
              </span>
              <span className="text-base sm:text-lg font-black mt-0.5 block">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60 w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-800 font-medium w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-800 outline-none"
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
                  <td className="py-3 px-4 sm:px-5">
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-[140px]"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                      />
                      <span className="font-extrabold text-slate-800 group-hover:text-[#2563eb] transition-colors truncate">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-5 font-mono text-slate-500 font-bold whitespace-nowrap">{p.sku}</td>
                  <td className="py-3 px-4 sm:px-5 font-semibold text-slate-700 whitespace-nowrap">{p.category}</td>
                  <td className="py-3 px-4 sm:px-5 font-black text-slate-900 whitespace-nowrap">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-4 sm:px-5 font-bold text-slate-800 whitespace-nowrap">{p.stockCount} units</td>
                  <td className="py-3 px-4 sm:px-5 font-extrabold text-emerald-600 whitespace-nowrap">{p.demandTrend}</td>
                  <td className="py-3 px-4 sm:px-5 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
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
                  <td className="py-3 px-4 sm:px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
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
