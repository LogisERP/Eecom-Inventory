import React, { useState } from 'react';
import {
  Home,
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
  Users,
  ChevronDown,
  Layers,
  Tag,
  Ruler,
  Boxes,
  FolderTree,
  Factory,
  Building2
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

const PRODUCT_DETAILS_ITEMS = [
  { id: 'product-master', label: 'Product Master', icon: Package },
  { id: 'product-category', label: 'Product Category', icon: FolderTree },
  { id: 'product-type', label: 'Product Type', icon: Boxes },
  { id: 'uom', label: 'UOM', icon: Ruler },
  { id: 'brand', label: 'Brand', icon: Tag },
  { id: 'supplier-master', label: 'Supplier Master', icon: Factory },
  { id: 'supplier-site', label: 'Supplier Site', icon: Building2 },
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
  const isProductDetailsTab = PRODUCT_DETAILS_ITEMS.some(item => item.id === activeTab);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState<boolean>(true);

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
    <aside className="flex flex-col justify-between bg-[#121316] text-slate-300 w-full md:w-[260px] md:min-w-[260px] h-full overflow-y-auto shrink-0 border-r border-slate-800/60 select-none">
      {/* Top section */}
      <div className="flex flex-col gap-6 px-5 pt-7 pb-4">

        {/* Logo */}
        <div className="flex items-center justify-between px-1 pb-1">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="App Logo" className="h-9 w-auto max-w-[90px] rounded-xl object-contain bg-white px-1.5 py-1 shadow-md border border-white/20" />
            <span className="text-lg font-black tracking-tight">
              <span className="text-white">Ecom </span>
              <span className="text-amber-500">ERP</span>
            </span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Direct Standalone Home Menu Item (Pill style matching reference) */}
        <button
          onClick={() => handleSelectTab('home')}
          className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
            activeTab === 'home'
              ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-slate-950' : 'text-slate-400'}`} />
          <span>Home</span>
        </button>

        {/* Role-based Menu Items */}
        {isAdmin ? (
          <>
            {/* Admin Menu Section */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3.5 mb-1">
                Admin Console
              </span>

              {/* Dashboard */}
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              {/* Inventory */}
              <button
                onClick={() => handleSelectTab('inventory')}
                className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </button>

              {/* Orders */}
              <button
                onClick={() => handleSelectTab('orders')}
                className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </button>

              {/* Product Details Menu Group (Placed directly under Orders) */}
              <div className="flex flex-col my-1">
                <button
                  onClick={() => setIsProductDetailsOpen(!isProductDetailsOpen)}
                  className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center justify-between transition-all ${
                    isProductDetailsTab
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Layers className="w-5 h-5 text-amber-500" />
                    <span>Product Details</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProductDetailsOpen ? 'rotate-180 text-white' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* Submenus under Product Details */}
                {isProductDetailsOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-1 border-l border-white/10 ml-5 my-1.5">
                    {PRODUCT_DETAILS_ITEMS.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const active = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSelectTab(subItem.id)}
                          className={`w-full px-3 py-2 rounded-xl text-[12px] font-bold flex items-center gap-3 transition-all ${
                            active
                              ? 'bg-white text-slate-950 font-black shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Marketplace */}
              <button
                onClick={() => handleSelectTab('marketplace')}
                className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>Marketplace</span>
              </button>

              {/* Reports */}
              <button
                onClick={() => handleSelectTab('reports')}
                className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                  activeTab === 'reports'
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Reports</span>
              </button>
            </div>

            {/* People Menu Group */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3.5 mb-1">
                Access & Team
              </span>

              {PEOPLE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
                      active
                        ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {/* Tools Section (Visible to Everyone) */}
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3.5 mb-1">
            System
          </span>

          <button
            onClick={() => handleSelectTab('settings')}
            className={`w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="w-full px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-3.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* AI Promo Card */}
      <div className="px-5 pb-6 mt-6">
        <div className="bg-gradient-to-b from-slate-800/90 to-[#1e293b] p-4 rounded-[24px] border border-white/10 relative overflow-hidden shadow-lg">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-full blur-lg" />

          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-3 text-amber-400">
            <Bot className="w-5 h-5" />
          </div>

          <h4 className="text-[13px] font-black text-white leading-snug mb-3">
            Empowering<br />Decision with AI
          </h4>

          <button
            onClick={() => {
              onOpenAiModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Unlock AI Magic</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
