import React from 'react';
import {
  Package,
  ShoppingBag,
  Store,
  BarChart3,
  Users,
  Shield,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import type { UserItem } from '../types/people';

interface HomeViewProps {
  currentUser: UserItem | null;
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ currentUser, onNavigate }) => {
  const roleName = (currentUser?.roleName || '').trim().toLowerCase();
  const isAdmin = !currentUser?.roleName || roleName.includes('admin');

  return (
    <div className="w-full flex flex-col items-center justify-center pt-2 pb-10 animate-fade-in space-y-6">

      {/* Main Hero Card with White Theme Background */}
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-14 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Decorative Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Centered Logo */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-25 group-hover:opacity-40 blur-md transition-opacity" />
          <img
            src="/logo.png"
            alt="Ecom ERP Logo"
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-2xl border-4 border-white bg-slate-900 p-1"
          />
        </div>

        {/* Dual Color App Name Under Logo */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-6 text-slate-900">
          <span className="text-slate-900">Ecom </span>
          <span className="text-[#2563eb]">ERP</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-lg mt-2 leading-relaxed">
          Enterprise E-Commerce Inventory, Orders & Multi-Channel Operations Management Platform
        </p>

        {/* User Welcome Badge */}
        <div className="mt-6 inline-flex items-center gap-3 bg-slate-100/90 border border-slate-200/90 px-4 py-2 rounded-full shadow-xs">
          <img
            src={currentUser?.profilePic}
            alt={currentUser?.userName || 'User'}
            className="w-7 h-7 rounded-full object-cover border border-slate-300"
          />
          <div className="text-left">
            <span className="text-xs font-extrabold text-slate-800 block leading-tight">
              Welcome, {currentUser?.userName || 'User'}!
            </span>
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-blue-500" />
              {currentUser?.roleName || 'Administrator'} • {currentUser?.userId || 'USR-1001'}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Status Pill */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Status: Firebase Live Cloud Synchronization Active</span>
        </div>

      </div>

      {/* Quick Access Module Launchers */}
      <div className="w-full">
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Quick Module Launcher
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {isAdmin ? 'All Admin Modules Available' : 'Tools Access Granted'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {isAdmin && (
            <>
              {/* Inventory */}
              <div
                onClick={() => onNavigate('inventory')}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Inventory Catalog
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Manage product stock levels, SKUs, and pricing across categories.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>

              {/* Orders */}
              <div
                onClick={() => onNavigate('orders')}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Customer Orders
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Track customer fulfillment, order processing, and shipment statuses.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>

              {/* Marketplace */}
              <div
                onClick={() => onNavigate('marketplace')}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0 border border-purple-100 group-hover:scale-110 transition-transform">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Marketplace Channels
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Configure sales channels, marketplace IDs, and auto created-by tracing.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>

              {/* User Management */}
              <div
                onClick={() => onNavigate('user')}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      User Management
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Manage staff accounts, auto-generated User IDs, and system access.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>

              {/* Reports */}
              <div
                onClick={() => onNavigate('reports')}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 border border-amber-100 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Financial Reports
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Analyze sales metrics, gross revenue, and multi-channel performance.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </>
          )}

          {/* Settings (Everyone) */}
          <div
            onClick={() => onNavigate('settings')}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0 border border-rose-100 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Account & Settings
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Manage store parameters, AI reordering thresholds, and account preferences.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

        </div>
      </div>

    </div>
  );
};
