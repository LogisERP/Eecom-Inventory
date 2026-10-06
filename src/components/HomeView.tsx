import React from 'react';
import type { UserItem } from '../types/people';

interface HomeViewProps {
  currentUser?: UserItem | null;
  onNavigate?: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-fade-in py-10 px-4">
      
      {/* Pure White Background Hero Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-xl p-10 sm:p-16 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Soft Ambient Radial Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Centered Logo Card */}
        <div className="relative group mb-6">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-25 group-hover:opacity-40 blur-md transition-opacity" />
          <img
            src="/logo.png"
            alt="Ecom ERP Logo"
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-2xl border-4 border-white bg-slate-900 p-1.5"
          />
        </div>

        {/* Dual-Color App Name Under Logo */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <span className="text-slate-900">Ecom</span>
          <span className="text-[#2563eb]">ERP</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mt-3.5 leading-relaxed">
          Enterprise E-Commerce Inventory, Orders & Multi-Channel Operations Management Platform
        </p>

      </div>

    </div>
  );
};
