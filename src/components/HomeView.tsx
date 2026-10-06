import React from 'react';

interface HomeViewProps {
  currentUser?: any;
  onNavigate?: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-6 sm:p-12 animate-fade-in">
      
      {/* Soft Ambient Radial Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Logo */}
      <div className="relative group mb-8">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 group-hover:opacity-35 blur-xl transition-opacity" />
        <img
          src="/logo.png"
          alt="Ecom ERP Logo"
          className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-2xl border-4 border-white bg-slate-900 p-2"
        />
      </div>

      {/* Dual-Color App Name Under Logo */}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 flex items-center gap-3">
        <span className="text-slate-900">Ecom</span>
        <span className="text-[#2563eb]">ERP</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-base text-slate-500 font-semibold max-w-xl mt-4 leading-relaxed text-center">
        Enterprise E-Commerce Inventory, Orders & Multi-Channel Operations Management Platform
      </p>

    </div>
  );
};
