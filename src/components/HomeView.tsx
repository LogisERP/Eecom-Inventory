import React, { useState } from 'react';
import type { UserItem } from '../types/people';
import { TOP_RECOMMENDATIONS, type ProductItem } from '../data/mockData';
import {
  ArrowRight,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp,
  Package,
  Zap,
} from 'lucide-react';

interface HomeViewProps {
  currentUser?: UserItem | null;
  onNavigate?: (tab: string) => void;
  onSelectProduct?: (product: ProductItem) => void;
}

const REGION_CATEGORIES = [
  { id: 'All',         label: 'All Catalog'      },
  { id: 'Trending',    label: 'Trending Deals'   },
  { id: 'Fashion',     label: 'Fashion & Apparel' },
  { id: 'Jewelry',     label: 'Jewelry & Luxury'  },
  { id: 'Furniture',   label: 'Home & Living'     },
  { id: 'Electronics', label: 'Electronics'       },
];

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser, onNavigate, onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 pb-28 pt-2 animate-fade-in"
      style={{ fontFamily: 'var(--font-game)' }}
    >

      {/* ─── 1. HERO GREETING ─── */}
      <div
        className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7"
        style={{
          background: 'linear-gradient(135deg, #1A1033 0%, #231547 60%, #2D1A5A 100%)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-60"
          style={{ background: 'rgba(108,60,225,0.30)' }} />
        <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ background: 'rgba(244,63,94,0.25)' }} />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <div
              className="flex items-center justify-center px-4 py-2.5 rounded-2xl shadow-lg"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(255,255,255,0.7)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              }}
            >
              <img
                src="/logo.png"
                alt="App Logo"
                className="h-9 w-auto max-w-[140px] object-contain"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.50)' }}>Welcome Back</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full"
                style={{ background: 'var(--grad-accent)', color: '#fff' }}>
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hello, {currentUser?.userName?.split(' ')[0] || 'Vanessa'} 👋
            </h1>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Your inventory is looking great today.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.30)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--clr-success)' }} />
            <span className="text-xs font-bold text-white">495 Units Active</span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('orders')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black text-white transition-all"
            style={{ background: 'var(--grad-accent)', boxShadow: 'var(--shadow-btn-accent)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Orders Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 2. CATEGORY PILLS ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: 'var(--txt-primary)' }}>
            Explore your inventory
          </h2>
          <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--clr-success)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--clr-success)' }} />
            Real-time sync
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {REGION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all shrink-0"
                style={isSelected ? {
                  background: 'var(--grad-primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-btn)',
                } : {
                  background: '#fff',
                  color: 'var(--txt-secondary)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-base)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. FEATURED HERO CARD ─── */}
      <div
        className="relative w-full overflow-hidden text-white flex flex-col justify-between group"
        style={{
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          minHeight: '340px',
        }}
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
          alt="Featured Showcase"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(26,16,51,0.92) 0%, rgba(26,16,51,0.55) 50%, rgba(26,16,51,0.20) 100%)' }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--clr-success)' }} />
            FEATURED SHOWCASE
          </div>
          <button
            onClick={(e) => toggleLike('featured', e)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Heart className={`w-5 h-5 transition-colors ${likedItems['featured'] ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5 p-6 sm:p-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: '#FCD34D' }}>
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>5.0 (342 reviews · High Demand)</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Rio de Janeiro Signature Edition
            </h3>
            <p className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-2"
              style={{ color: 'rgba(255,255,255,0.70)' }}>
              Curated luxury catalog with automated channel dispatch, real-time demand forecasting, and prime logistics integration.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('inventory')}
            className="self-start sm:self-auto flex items-center gap-3 font-black text-sm px-6 py-3.5 transition-all hover:scale-105 active:scale-95 shrink-0 text-slate-950"
            style={{ background: '#fff', borderRadius: 'var(--radius-pill)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
          >
            <span>See more catalog</span>
            <div className="w-7 h-7 rounded-full text-white flex items-center justify-center"
              style={{ background: 'var(--grad-primary)' }}>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* ─── 4. TWO-COLUMN GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* LEFT: Top Trending Items */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--txt-primary)' }}>
              Top Trending Items
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('inventory')}
              className="text-xs font-black transition-colors"
              style={{ color: 'var(--clr-primary)' }}
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOP_RECOMMENDATIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="cursor-pointer group flex flex-col justify-between transition-all hover:-translate-y-0.5"
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-base)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '14px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--clr-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-base)'; }}
              >
                {/* Image */}
                <div className="relative w-full h-40 overflow-hidden flex items-center justify-center p-2 mb-3"
                  style={{ borderRadius: 'var(--radius-md)', background: 'var(--clr-primary-lt)' }}>
                  <img src={item.image} alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-base)' }}
                  >
                    <Heart className={`w-4 h-4 ${likedItems[item.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                      style={!likedItems[item.id] ? { color: 'var(--txt-muted)' } : {}} />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-black px-2.5 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-dark-card)', color: '#fff' }}>
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-black truncate transition-colors"
                    style={{ color: 'var(--txt-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--clr-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--txt-primary)'; }}
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-1"
                    style={{ color: 'var(--txt-muted)' }}>
                    <span>SKU: {item.sku}</span>
                    <span className="font-extrabold flex items-center gap-0.5" style={{ color: 'var(--clr-success)' }}>
                      <TrendingUp className="w-3 h-3" /> {item.demandTrend}
                    </span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: '1.5px solid var(--border-base)' }}>
                  <div>
                    <span className="text-[10px] font-bold block" style={{ color: 'var(--txt-muted)' }}>PRICE</span>
                    <span className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                    style={{ background: 'var(--grad-primary)', boxShadow: 'var(--shadow-btn)' }}>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Operational Schedule */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--txt-primary)' }}>
              Operational Schedule
            </h3>
            <span className="text-xs font-bold" style={{ color: 'var(--txt-muted)' }}>8-Stage Flow</span>
          </div>

          <div className="flex flex-col gap-4"
            style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)', padding: '20px 20px' }}>

            {/* Segmented tabs */}
            <div className="flex items-center p-1 rounded-full" style={{ background: 'var(--clr-primary-lt)' }}>
              {['Schedule', 'Logistics', 'Audits'].map((tab, i) => (
                <button key={tab}
                  className="flex-1 py-1.5 text-xs font-extrabold rounded-full text-center transition-all"
                  style={i === 0 ? {
                    background: 'var(--grad-primary)', color: '#fff', boxShadow: 'var(--shadow-btn)'
                  } : { color: 'var(--txt-muted)' }}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <h4 className="text-sm font-black" style={{ color: 'var(--txt-primary)' }}>
                8-Days Fulfillment Cycle
              </h4>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--clr-success-lt)', color: 'var(--clr-success)', border: '1px solid rgba(16,185,129,0.20)' }}>
                On Schedule
              </span>
            </div>

            {/* Day cards */}
            <div className="space-y-2.5">
              {/* D1 expanded */}
              <div className="p-4" style={{ background: 'var(--clr-primary-lt)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-base)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center"
                      style={{ background: 'var(--grad-primary)' }}>D1</div>
                    <span className="text-xs font-black" style={{ color: 'var(--txt-primary)' }}>
                      Inbound Shipment & UOM Verification
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 rotate-90" style={{ color: 'var(--txt-muted)' }} />
                </div>
                <div className="text-[11px] font-medium space-y-1 pl-9" style={{ color: 'var(--txt-secondary)' }}>
                  <p><strong style={{ color: 'var(--txt-primary)' }}>Morning:</strong> Supplier site dispatch and barcode intake.</p>
                  <p><strong style={{ color: 'var(--txt-primary)' }}>Afternoon:</strong> Quality inspection & dead stock checks.</p>
                </div>
              </div>

              {[{ d: 'D2', label: 'Warehouse Bin Allocation & Sorting' }, { d: 'D3', label: 'Multi-Channel Marketplace Sync' }].map(({ d, label }) => (
                <div key={d}
                  className="p-3.5 flex items-center justify-between cursor-pointer transition-all hover:-translate-y-px"
                  style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-base)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center"
                      style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>{d}</div>
                    <span className="text-xs font-extrabold" style={{ color: 'var(--txt-primary)' }}>{label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--txt-muted)' }} />
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate && onNavigate('orders')}
              className="mt-1 w-full py-3.5 font-black text-xs text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: 'var(--grad-primary)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-btn)' }}
            >
              <Package className="w-4 h-4" />
              <span>Manage Active Cycle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
