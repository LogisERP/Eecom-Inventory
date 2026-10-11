import React, { useState } from 'react';
import type { UserItem } from '../types/people';
import { TOP_RECOMMENDATIONS, type ProductItem } from '../data/mockData';
import {
  ArrowRight,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface HomeViewProps {
  currentUser?: UserItem | null;
  onNavigate?: (tab: string) => void;
  onSelectProduct?: (product: ProductItem) => void;
}

const REGION_CATEGORIES = [
  { id: 'All', label: 'All Catalog' },
  { id: 'Trending', label: 'Trending Deals' },
  { id: 'Fashion', label: 'Fashion & Apparel' },
  { id: 'Jewelry', label: 'Jewelry & Luxury' },
  { id: 'Furniture', label: 'Home & Living' },
  { id: 'Electronics', label: 'Electronics' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onNavigate,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 pb-28 pt-2 animate-fade-in">
      
      {/* ─── 1. TOP HERO GREETING & LOGO ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/logo.png"
              alt="App Logo"
              className="h-12 w-auto max-w-[120px] rounded-2xl object-contain bg-white px-2 py-1 shadow-md border border-slate-200/80"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Welcome Back</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Hello, {currentUser?.userName?.split(' ')[0] || 'Vanessa'} 👋
            </h1>
          </div>
        </div>

        {/* Quick pill stats */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-slate-100/90 px-3.5 py-1.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>495 Units Active</span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('orders')}
            className="bg-[#121316] hover:bg-black text-white px-4 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Orders Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 2. SEARCH & FILTER PILLS ("Select your next destination / category") ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Explore your inventory
          </h2>
          <span className="text-xs font-bold text-slate-400">Real-time sync</span>
        </div>

        {/* Category Pills Slider (Just like South America, Europe, Asia in the screenshot) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {REGION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#121316] text-white shadow-md shadow-slate-900/20 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200/90'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. FEATURED SPOTLIGHT CARD (Like the Rio de Janeiro Hero Card) ─── */}
      <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-950 text-white shadow-xl min-h-[340px] sm:min-h-[400px] flex flex-col justify-between p-6 sm:p-9 group border border-slate-800">
        
        {/* Ambient background glow & image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
            alt="Scenic Background"
            className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-transparent" />
        </div>

        {/* Top Badges / Floating Favorite Button */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>FEATURED SHOWCASE</span>
          </div>

          <button
            onClick={(e) => toggleLike('featured', e)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all text-white"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                likedItems['featured'] ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom Spotlight Content */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>5.0 (342 reviews • High Demand)</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Rio de Janeiro Signature Edition
            </h3>
            <p className="text-xs sm:text-sm text-slate-300/90 font-medium line-clamp-2 leading-relaxed">
              Curated luxury catalog with automated channel dispatch, real-time demand forecasting, and prime logistics integration.
            </p>
          </div>

          {/* Action Button Pill */}
          <button
            onClick={() => onNavigate && onNavigate('inventory')}
            className="self-start sm:self-auto flex items-center gap-3 bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>See more catalog</span>
            <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* ─── 4. TWO-COLUMN ADAPTATION (Tour Schedule & Upcoming Tours Style) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: UPCOMING TOURS / TOP RECOMMENDATIONS (Screen 2) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Top Trending Items
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('inventory')}
              className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOP_RECOMMENDATIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="bg-white rounded-[26px] p-3.5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* Image card with favorite badge */}
                <div className="relative w-full h-40 rounded-[20px] bg-slate-50 overflow-hidden mb-3 border border-slate-100 flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedItems[item.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                      }`}
                    />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-1">
                    <span>SKU: {item.sku}</span>
                    <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {item.demandTrend}
                    </span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">PRICE</span>
                    <span className="text-base font-black text-slate-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button className="w-8 h-8 rounded-full bg-[#121316] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: TOUR SCHEDULE TIMELINE (Screen 3 Reference Adapted) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Operational Schedule
            </h3>
            <span className="text-xs font-bold text-slate-400">8-Stage Flow</span>
          </div>

          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            
            {/* Segmented control tabs (Tour schedule, Accommodation, Booking details) */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200">
              <button className="flex-1 py-1.5 text-xs font-extrabold rounded-full bg-[#121316] text-white shadow-xs text-center">
                Schedule
              </button>
              <button className="flex-1 py-1.5 text-xs font-extrabold rounded-full text-slate-500 hover:text-slate-900 text-center">
                Logistics
              </button>
              <button className="flex-1 py-1.5 text-xs font-extrabold rounded-full text-slate-500 hover:text-slate-900 text-center">
                Audits
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h4 className="text-sm font-black text-slate-800">
                8-Days Fulfillment Cycle
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                On Schedule
              </span>
            </div>

            {/* Accordion list items */}
            <div className="space-y-3">
              {/* Day 1 Card Expanded */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      D1
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      Inbound Shipment & UOM Verification
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium space-y-1 pl-9">
                  <p><strong className="text-slate-700">Morning:</strong> Supplier site dispatch and barcode intake.</p>
                  <p><strong className="text-slate-700">Afternoon:</strong> Quality inspection & dead stock checks.</p>
                </div>
              </div>

              {/* Day 2 Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                    D2
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    Warehouse Bin Allocation & Sorting
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Day 3 Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                    D3
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    Multi-Channel Marketplace Sync
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Bottom Book / Order CTA Button */}
            <button
              onClick={() => onNavigate && onNavigate('orders')}
              className="mt-2 w-full py-3.5 rounded-full bg-[#121316] hover:bg-black text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Manage Active Cycle</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
