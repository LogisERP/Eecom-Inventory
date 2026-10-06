import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Sliders,
  LogOut,
  Bot,
  Sparkles,
  X,
  Store,
  Shield,
  Users
} from 'lucide-react';
import type { UserItem } from '../types/people';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal: () => void;
  onCloseMobile?: () => void;
  currentUser?: UserItem | null;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
] as const;

const PEOPLE_ITEMS = [
  { id: 'role', label: 'Role', icon: Shield },
  { id: 'user', label: 'User', icon: Users },
] as const;

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiModal,
  onCloseMobile,
  currentUser,
  onLogout
}) => {
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const roleName = (currentUser?.roleName || '').trim().toLowerCase();
  // Check if role is Admin/Administrator. If no role defined, default to true.
  const isAdmin = !currentUser?.roleName || roleName.includes('admin');

  return (
    <aside className="flex flex-col justify-between bg-[#141c25] text-slate-300 w-full md:w-[240px] md:min-w-[240px] h-full overflow-y-auto shrink-0">
      {/* Top section */}
      <div className="flex flex-col gap-5 px-4 pt-6">

        {/* Logo */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Ecom ERP Logo" className="w-8 h-8 rounded-lg object-cover shadow-md border border-white/10" />
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-white">Ecom </span>
              <span className="text-blue-400">ERP</span>
            </span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role-based Menu Items: If Admin show alls, if others show Tools only */}
        {isAdmin ? (
          <>
            {/* Admin Menu Section */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">
                Admin
              </span>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-3 transition-all ${
                      active
                        ? 'bg-[#1e3a5f] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* People Menu Group */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">
                People
              </span>

              {PEOPLE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-3 transition-all ${
                      active
                        ? 'bg-[#1e3a5f] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {/* Tools Section (Visible to Everyone) */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">
            Tools
          </span>

          <button
            onClick={() => handleSelectTab('settings')}
            className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-3 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#1e3a5f] text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-[18px] h-[18px]" />
            Settings
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </div>

      {/* AI Promo Card */}
      <div className="px-4 pb-5 mt-6">
        <div className="bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-lg" />

          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Bot className="w-5 h-5 text-white" />
          </div>

          <h4 className="text-[13px] font-bold text-white leading-snug mb-3">
            Empowering<br />Decision with AI
          </h4>

          <button
            onClick={() => {
              onOpenAiModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 rounded-lg bg-white/90 hover:bg-white text-[#1d4ed8] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Unlock AI Magic
          </button>
        </div>
      </div>
    </aside>
  );
};

