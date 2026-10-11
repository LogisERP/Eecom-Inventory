import React from 'react';
import { Home, Compass, LayoutGrid, Package, ShoppingBag, Sparkles } from 'lucide-react';

interface FloatingPillNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal?: () => void;
  isAdmin?: boolean;
}

export const FloatingPillNav: React.FC<FloatingPillNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiModal,
  isAdmin = true,
}) => {
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 pointer-events-none w-full max-w-sm flex justify-center">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 bg-[#121316]/95 backdrop-blur-xl border border-white/10 px-2.5 sm:px-3 py-2 rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.35)] text-white w-full transition-all"
      >
        {/* Home Item */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all ${
            activeTab === 'home'
              ? 'bg-white text-slate-950 shadow-md scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Explore / Dashboard */}
        <button
          onClick={() => setActiveTab(isAdmin ? 'dashboard' : 'home')}
          className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all ${
            activeTab === 'dashboard'
              ? 'bg-white text-slate-950 shadow-md scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Overview & Dashboard"
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Catalog / Inventory */}
        <button
          onClick={() => setActiveTab(isAdmin ? 'inventory' : 'home')}
          className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all ${
            activeTab === 'inventory' || activeTab.startsWith('product-')
              ? 'bg-white text-slate-950 shadow-md scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Inventory Catalog"
        >
          <Package className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Orders */}
        <button
          onClick={() => setActiveTab(isAdmin ? 'orders' : 'home')}
          className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all ${
            activeTab === 'orders'
              ? 'bg-white text-slate-950 shadow-md scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Orders"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* AI Magic or Settings / Grid menu */}
        {onOpenAiModal ? (
          <button
            onClick={onOpenAiModal}
            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            title="AI Assistant"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-slate-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Settings"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
      </nav>
    </div>
  );
};
