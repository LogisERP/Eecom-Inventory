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

/* ── shared card wrapper ── */
const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={className}
    style={{
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1.5px solid var(--border-base)',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectProduct, onFilterStatus }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Fashion' | 'Shoes' | 'Electronics'>('Fashion');

  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 animate-fade-in pt-2 pb-32"
      style={{ fontFamily: 'var(--font-game)' }}
    >

      {/* ── ROW 1: Sales Revenue + Status Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* Sales Revenue Card */}
        <Card className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--clr-primary)' }} />
            <h3 className="text-sm font-black" style={{ color: 'var(--txt-primary)' }}>Sales Revenue</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            {/* Big number */}
            <div className="flex sm:flex-col items-baseline justify-between sm:justify-start gap-2">
              <div>
                <span className="text-4xl sm:text-5xl font-black tracking-tight block" style={{ color: 'var(--txt-primary)' }}>55k</span>
                <p className="text-xs font-medium mt-1 leading-tight" style={{ color: 'var(--txt-muted)' }}>
                  Total Sales Revenue Overview
                </p>
              </div>
            </div>

            {/* Dark metric card */}
            <div className="p-4 sm:p-5 flex flex-col gap-2" style={{
              background: 'linear-gradient(135deg,#1A1033 0%,#231547 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(108,60,225,0.25)',
            }}>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(108,60,225,0.25)' }}>
                  <Download className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
                </div>
                <span className="text-xs font-bold text-right" style={{ color: 'rgba(255,255,255,0.50)' }}>Order Received</span>
              </div>
              <span className="text-2xl font-black text-white">1,254K</span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold flex items-center gap-1" style={{ color: 'var(--clr-success)' }}>
                  25% <TrendingUp className="w-3.5 h-3.5" />
                </span>
                <ChevronDown className="w-4 h-4 cursor-pointer" style={{ color: 'rgba(255,255,255,0.35)' }} />
              </div>
            </div>

            {/* Mini bar chart */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="w-0.5 h-3 rounded-full" style={{ background: 'var(--clr-primary)' }} />
                  <span className="text-[11px] font-extrabold" style={{ color: 'var(--txt-primary)' }}>Total Sales</span>
                </div>
                <button className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>
                  View all
                </button>
              </div>
              <p className="text-[9px] font-medium mb-1.5" style={{ color: 'var(--txt-muted)' }}>1,254K Total Sales in Week</p>
              <div className="h-12 sm:h-14 flex items-end gap-[3px]">
                {[40,65,30,85,45,95,55,100,70,50,90,38,60,80,42].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm transition-all"
                    style={{ height: `${h}%`, background: i % 2 === 0 ? 'var(--clr-primary)' : 'var(--clr-primary-lt)' }} />
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-semibold mt-1" style={{ color: 'var(--txt-muted)' }}>
                <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Status panel */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Inventory valuation */}
          <div className="p-4 sm:p-5 flex items-center justify-between relative overflow-hidden"
            style={{
              background: 'var(--grad-primary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-btn)',
            }}>
            <div className="z-10">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight block">$ 357,495</span>
              <span className="text-[11px] font-semibold block mt-0.5" style={{ color: 'rgba(255,255,255,0.70)' }}>Inventory Valuation</span>
            </div>
            <svg viewBox="0 0 100 40" className="w-16 sm:w-20 h-8 sm:h-10 opacity-60" style={{ stroke: 'rgba(255,255,255,0.80)', fill: 'none', strokeWidth: 3 }}>
              <path d="M0 30 Q20 5, 40 25 T80 10 T100 20" />
            </svg>
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl pointer-events-none" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* 4 status cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([
              { count: 495, label: 'In Stock',     from: '#34D399', to: '#10B981', filter: 'In Stock',     tagColor: 'var(--clr-success)', tagBg: 'var(--clr-success-lt)'  },
              { count: 120, label: 'Low Stock',    from: '#A78BFA', to: '#6C3CE1', filter: 'Low Stock',    tagColor: 'var(--clr-primary)', tagBg: 'var(--clr-primary-lt)' },
              { count: 89,  label: 'Out of Stock', from: '#F87171', to: '#EF4444', filter: 'Out of Stock', tagColor: 'var(--clr-error)',   tagBg: 'var(--clr-error-lt)'   },
              { count: 20,  label: 'Dead Stock',   from: '#94A3B8', to: '#64748B', filter: 'Dead Stock',   tagColor: '#64748B',           tagBg: '#F1F5F9'               },
            ] as const).map((card) => (
              <div key={card.label}
                onClick={() => onFilterStatus(card.filter)}
                className="cursor-pointer hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[100px] sm:min-h-[110px] p-3"
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-base)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = card.tagColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-base)'; }}
              >
                <div>
                  <span className="text-sm sm:text-base font-black block" style={{ color: 'var(--txt-primary)' }}>{card.count}</span>
                  <span className="text-[9px] font-bold block mt-0.5" style={{ color: 'var(--txt-muted)' }}>{card.label}</span>
                </div>
                <div className="w-full rounded-lg mt-2" style={{ height: 32, background: `linear-gradient(to top, ${card.from}, ${card.to})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Cost Breakdown + Market Demand ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* Cost Breakdown */}
        <Card className="lg:col-span-5 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--clr-primary-lt)' }}>
                <Wallet className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold" style={{ color: 'var(--txt-primary)' }}>Cost Breakdown</h3>
                <span className="text-[9px] font-medium" style={{ color: 'var(--txt-muted)' }}>December 15, 2025</span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)', border: '1px solid var(--border-base)' }}>
              Day <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {([
              { label: 'Earned', value: '$ 456.68', pct: 78, from: '#34D399', to: '#10B981' },
              { label: 'Spent',  value: '$ 39.462', pct: 45, from: '#A78BFA', to: '#6C3CE1' },
              { label: 'Tax',    value: '$ 12.300', pct: 30, from: '#FB923C', to: '#F43F5E' },
            ] as const).map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] sm:text-xs mb-1.5">
                  <span className="font-medium" style={{ color: 'var(--txt-secondary)' }}>{bar.label}</span>
                  <span className="font-extrabold" style={{ color: 'var(--txt-primary)' }}>{bar.value}</span>
                </div>
                <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'var(--clr-primary-lt)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${bar.pct}%`, background: `linear-gradient(to right, ${bar.from}, ${bar.to})` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Market Demand */}
        <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: 'var(--grad-primary)' }} />
              <h3 className="text-xs sm:text-sm font-extrabold" style={{ color: 'var(--txt-primary)' }}>Top Market Demand</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)', border: '1px solid var(--border-base)' }}>
                <Calendar className="w-3 h-3" /> 24 Feb, 2025
              </button>
              <button className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)', border: '1px solid var(--border-base)' }}>
                View all
              </button>
            </div>
          </div>

          {/* Category toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full mb-4" style={{ background: 'var(--clr-primary-lt)' }}>
            {([
              { id: 'Fashion' as const, icon: Shirt },
              { id: 'Shoes' as const, icon: Footprints },
              { id: 'Electronics' as const, icon: Headphones },
            ]).map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all flex-1 justify-center"
                  style={selectedCategory === cat.id ? {
                    background: 'var(--grad-primary)', color: '#fff', boxShadow: 'var(--shadow-btn)',
                  } : { color: 'var(--txt-muted)' }}
                >
                  <CatIcon className="w-3 h-3" /> {cat.id}
                </button>
              );
            })}
          </div>

          {/* Bar chart */}
          <div className="flex-1 min-h-[120px] sm:min-h-[140px] flex items-end justify-between gap-2 px-1 pb-1"
            style={{ borderBottom: '1.5px solid var(--border-base)' }}>
            {([
              { month: 'Jan', h: 35, active: false },
              { month: 'Feb', h: 80, active: true  },
              { month: 'Mar', h: 52, active: false },
              { month: 'Apr', h: 60, active: false },
              { month: 'May', h: 85, active: false },
            ]).map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: bar.active ? 'var(--clr-primary)' : 'var(--txt-muted)' }}>
                  {bar.month} ↗
                </span>
                <div className="w-full max-w-[40px] rounded-t-lg transition-all"
                  style={{
                    height: `${bar.h}%`,
                    minHeight: 18,
                    background: bar.active ? 'var(--grad-primary)' : 'var(--clr-primary-lt)',
                    boxShadow: bar.active ? 'var(--shadow-btn)' : 'none',
                  }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── ROW 3: Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <Card className="lg:col-span-6 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: 'var(--grad-primary)' }} />
              <h3 className="text-xs sm:text-sm font-extrabold" style={{ color: 'var(--txt-primary)' }}>Top Product Recommendation</h3>
            </div>
            <button className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)', border: '1px solid var(--border-base)' }}>
              View all
            </button>
          </div>

          <div className="flex flex-col" style={{ borderTop: '1px solid var(--border-base)' }}>
            {TOP_RECOMMENDATIONS.map((prod) => (
              <div key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="py-2.5 flex items-center justify-between gap-2.5 cursor-pointer px-1.5 -mx-1.5 transition-all rounded-xl group"
                style={{ borderBottom: '1px solid var(--border-base)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={prod.image} alt={prod.name}
                    className="w-10 h-10 rounded-xl object-contain p-1 shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate transition-colors" style={{ color: 'var(--txt-primary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--clr-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--txt-primary)'; }}>
                      {prod.name}
                    </h4>
                    <span className="text-[10px] font-mono block truncate" style={{ color: 'var(--txt-muted)' }}>ID: {prod.sku}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black block" style={{ color: 'var(--txt-primary)' }}>${prod.price.toFixed(2)}</span>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--txt-muted)' }}>{prod.ordersCount} Orders</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
