import React, { useState } from 'react';
import { TOP_RECOMMENDATIONS, type ProductItem } from '../data/mockData';
import {
  Download,
  ChevronDown,
  TrendingUp,
  Wallet,
  Calendar,
  Shirt,
  Footprints,
  Headphones
} from 'lucide-react';

interface DashboardViewProps {
  onSelectProduct: (product: ProductItem) => void;
  onFilterStatus: (status: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectProduct,
  onFilterStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Fashion' | 'Shoes' | 'Electronics'>('Fashion');

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 animate-fade-in pt-1 pb-6">

      {/* ───── ROW 1: Sales Revenue + Valuation / Status ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">

        {/* Sales Revenue Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">

          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            <span className="w-1 h-4 bg-[#2563eb] rounded-full" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Sales Revenue</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-center">
            {/* Left stat */}
            <div className="flex sm:flex-col items-baseline justify-between sm:justify-start gap-2">
              <div>
                <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight block">55k</span>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 sm:mt-1 leading-tight">
                  This Is Sales Revenue Overview
                </p>
              </div>
            </div>

            {/* Dark floating card */}
            <div className="bg-[#19232d] text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium text-right">Order Received</span>
              </div>
              <span className="text-lg sm:text-xl font-black block">1,254K</span>
              <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  25% <TrendingUp className="w-3 h-3" />
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            {/* Right: Total Sales mini chart */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="w-0.5 h-3 bg-[#2563eb] rounded-full" />
                  <span className="text-[11px] font-extrabold text-slate-800">Total Sales</span>
                </div>
                <button className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  View all
                </button>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium mb-1.5">1,254K Total Sales in Week</p>

              {/* Bar mini graph */}
              <div className="h-12 sm:h-14 flex items-end gap-[3px]">
                {[40,65,30,85,45,95,55,100,70,50,90,38,60,80,42].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs sm:rounded-sm transition-all ${i % 2 === 0 ? 'bg-[#2563eb]' : 'bg-slate-200'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 font-semibold mt-1">
                <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Valuation & Status */}
        <div className="lg:col-span-5 flex flex-col gap-3">

          {/* Blue valuation card */}
          <div className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white p-3.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-md flex items-center justify-between relative overflow-hidden">
            <div className="z-10">
              <span className="text-xl sm:text-2xl font-black tracking-tight block">$ 357.495</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-100 mt-0.5 block">Inventory Valuation</span>
            </div>
            <svg viewBox="0 0 100 40" className="w-16 sm:w-20 h-8 sm:h-10 stroke-white/80 fill-none" style={{ strokeWidth: 3 }}>
              <path d="M0 30 Q20 5, 40 25 T80 10 T100 20" />
            </svg>
          </div>

          {/* 4 status cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([
              { count: 495, label: 'In Stock', from: '#10b981', to: '#34d399', filter: 'In Stock' },
              { count: 120, label: 'Low Stock', from: '#7c3aed', to: '#a78bfa', filter: 'Low Stock' },
              { count: 89, label: 'Out of Stock', from: '#ef4444', to: '#f87171', filter: 'Out of Stock' },
              { count: 20, label: 'Dead Stock', from: '#94a3b8', to: '#cbd5e1', filter: 'Dead Stock' },
            ] as const).map((card) => (
              <div
                key={card.label}
                onClick={() => onFilterStatus(card.filter)}
                className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between min-h-[95px] sm:min-h-[110px]"
              >
                <div>
                  <span className="text-sm sm:text-base font-black text-slate-800 block">{card.count}</span>
                  <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{card.label}</span>
                </div>
                <div
                  className="w-full rounded-md sm:rounded-lg mt-2"
                  style={{
                    height: 32,
                    background: `linear-gradient(to top, ${card.from}, ${card.to})`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── ROW 2: Cost Breakdown + Market Demand ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">

        {/* Cost Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Cost Breakdown</h3>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">December 15, 2025</span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200">
              Day <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Progress bars */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {([
              { label: 'Earned', value: '$ 456.68', pct: 78, from: '#34d399', to: '#10b981' },
              { label: 'Spent', value: '$ 39.462', pct: 45, from: '#a78bfa', to: '#7c3aed' },
              { label: 'Spent', value: '$ 39.462', pct: 30, from: '#fb7185', to: '#ef4444' },
            ] as const).map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] sm:text-xs mb-1">
                  <span className="text-slate-500 font-medium">{bar.label}</span>
                  <span className="font-extrabold text-slate-800">{bar.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${bar.pct}%`,
                      background: `linear-gradient(to right, ${bar.from}, ${bar.to})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Market Demand */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-4 bg-[#2563eb] rounded-full" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Top Market Demand</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200">
                <Calendar className="w-3 h-3 text-slate-400" /> 24 Feb, 2025
              </button>
              <button className="text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200">
                View all
              </button>
            </div>
          </div>

          {/* User + Category pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3.5">
            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/80 w-max">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Gilbert Smith"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
              />
              <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800">Gilbert Smith</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200/80 overflow-x-auto max-w-full">
              {([
                { id: 'Fashion' as const, icon: Shirt },
                { id: 'Shoes' as const, icon: Footprints },
                { id: 'Electronics' as const, icon: Headphones },
              ]).map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#2563eb] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CatIcon className="w-3 h-3" /> {cat.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly bar chart */}
          <div className="flex-1 min-h-[120px] sm:min-h-[140px] flex items-end justify-between gap-1.5 sm:gap-2 px-1 pb-1 border-b border-slate-100">
            {([
              { month: 'Jan', h: 35, active: false },
              { month: 'Feb', h: 80, active: true },
              { month: 'Mar', h: 52, active: false },
              { month: 'Apr', h: 60, active: false },
              { month: 'May', h: 85, active: false },
            ]).map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-[9px] sm:text-[10px] font-bold ${bar.active ? 'text-slate-800' : 'text-slate-400'}`}>
                  {bar.month} ↗
                </span>
                <div
                  className={`w-full max-w-[36px] sm:max-w-[40px] rounded-t-md sm:rounded-t-lg transition-all ${
                    bar.active ? 'bg-[#2563eb] shadow-xs' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{ height: `${bar.h}%`, minHeight: 18 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── ROW 3: Top Product Recommendation ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
        <div className="lg:col-span-6 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-4 bg-[#2563eb] rounded-full" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Top Product Recommendation</h3>
            </div>
            <button className="text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200">
              View all
            </button>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {TOP_RECOMMENDATIONS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="py-2 sm:py-2.5 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50 rounded-xl px-1.5 -mx-1.5 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#2563eb] transition-colors">{prod.name}</h4>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 block truncate">ID: {prod.sku}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-slate-900 block">${prod.price.toFixed(2)}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">{prod.ordersCount} Orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
