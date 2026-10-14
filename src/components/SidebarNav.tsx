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
  { id: 'product-master',   label: 'Product Master',   icon: Package   },
  { id: 'product-category', label: 'Product Category', icon: FolderTree },
  { id: 'product-type',     label: 'Product Type',     icon: Boxes      },
  { id: 'uom',              label: 'UOM',              icon: Ruler      },
  { id: 'brand',            label: 'Brand',            icon: Tag        },
  { id: 'supplier-master',  label: 'Supplier Master',  icon: Factory    },
  { id: 'supplier-site',    label: 'Supplier Site',    icon: Building2  },
] as const;

const PEOPLE_ITEMS = [
  { id: 'role', label: 'Role', icon: Shield },
  { id: 'user', label: 'User', icon: Users  },
] as const;

/* ─── tiny helpers ─────────────────────────────────────────────── */
const NavItem: React.FC<{
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  sub?: boolean;
}> = ({ label, icon: Icon, active, onClick, sub }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 font-extrabold transition-all text-left ${
      sub ? 'px-3 py-2 text-[12px] rounded-xl' : 'px-4 py-3 text-[13px] rounded-2xl'
    }`}
    style={active ? {
      background: 'linear-gradient(135deg,#7C50F0 0%,#5B21B6 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(108,60,225,0.35)',
    } : {
      color: 'rgba(255,255,255,0.55)',
      background: 'transparent',
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    <Icon className={`${sub ? 'w-4 h-4' : 'w-5 h-5'} shrink-0`}
      style={{ color: active ? '#fff' : (sub ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.5)') }} />
    <span className="truncate">{label}</span>
  </button>
);

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-3.5 text-[9px] font-black uppercase tracking-[0.18em]"
    style={{ color: 'rgba(255,255,255,0.30)' }}>
    {label}
  </span>
);

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab, setActiveTab, onOpenAiModal, onCloseMobile, currentUser, onLogout
}) => {
  const isProductDetailsTab = PRODUCT_DETAILS_ITEMS.some(i => i.id === activeTab);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState<boolean>(true);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const roleName = (currentUser?.roleName || '').trim().toLowerCase();
  const isAdmin = !currentUser?.roleName || roleName.includes('admin');

  return (
    <aside
      className="flex flex-col justify-between w-full md:w-[264px] md:min-w-[264px] h-full overflow-y-auto shrink-0 select-none"
      style={{
        background: 'var(--grad-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'var(--font-game)',
      }}
    >
      {/* ── Top content ─────────────────────────────────── */}
      <div className="flex flex-col gap-5 px-4 pt-6 pb-4">

        {/* Logo row */}
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-3">
            {/* Logo pill */}
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 p-1.5 shadow-md"
              style={{ background: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
              <img src="/logo-mark.png" alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
            </div>
            <div>
              <span className="text-[17px] font-black tracking-tight text-white leading-none block">
                Ecom <span style={{ color: '#A78BFA' }}>ERP</span>
              </span>
              <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Inventory Suite
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Home */}
        <div className="flex flex-col gap-1">
          <NavItem id="home" label="Home" icon={Home}
            active={activeTab === 'home'} onClick={() => handleSelectTab('home')} />
        </div>

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="flex flex-col gap-1">
              <SectionLabel label="Admin Console" />
              <div className="mt-1.5 flex flex-col gap-0.5">
                <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard}
                  active={activeTab === 'dashboard'} onClick={() => handleSelectTab('dashboard')} />
                <NavItem id="inventory" label="Inventory" icon={Package}
                  active={activeTab === 'inventory'} onClick={() => handleSelectTab('inventory')} />
                <NavItem id="orders" label="Orders" icon={ShoppingBag}
                  active={activeTab === 'orders'} onClick={() => handleSelectTab('orders')} />

                {/* Product Details group */}
                <div>
                  <button
                    onClick={() => setIsProductDetailsOpen(!isProductDetailsOpen)}
                    className="w-full px-4 py-3 rounded-2xl text-[13px] font-extrabold flex items-center justify-between transition-all"
                    style={{
                      background: isProductDetailsTab ? 'rgba(108,60,225,0.20)' : 'transparent',
                      color: isProductDetailsTab ? '#C4B5FD' : 'rgba(255,255,255,0.55)',
                    }}
                    onMouseEnter={(e) => { if (!isProductDetailsTab) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={(e) => { if (!isProductDetailsTab) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 shrink-0" style={{ color: '#A78BFA' }} />
                      <span>Product Details</span>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200 shrink-0"
                      style={{
                        transform: isProductDetailsOpen ? 'rotate(180deg)' : 'rotate(0)',
                        color: isProductDetailsOpen ? '#A78BFA' : 'rgba(255,255,255,0.35)',
                      }}
                    />
                  </button>

                  {isProductDetailsOpen && (
                    <div className="ml-5 pl-3 py-1 mt-1 mb-1 flex flex-col gap-0.5"
                      style={{ borderLeft: '2px solid rgba(108,60,225,0.35)' }}>
                      {PRODUCT_DETAILS_ITEMS.map((item) => {
                        const SubIcon = item.icon;
                        const active = activeTab === item.id;
                        return (
                          <NavItem key={item.id} id={item.id} label={item.label} icon={SubIcon}
                            active={active} onClick={() => handleSelectTab(item.id)} sub />
                        );
                      })}
                    </div>
                  )}
                </div>

                <NavItem id="marketplace" label="Marketplace" icon={Store}
                  active={activeTab === 'marketplace'} onClick={() => handleSelectTab('marketplace')} />
                <NavItem id="reports" label="Reports" icon={BarChart3}
                  active={activeTab === 'reports'} onClick={() => handleSelectTab('reports')} />
              </div>
            </div>

            {/* Access & Team */}
            <div className="flex flex-col gap-1">
              <SectionLabel label="Access & Team" />
              <div className="mt-1.5 flex flex-col gap-0.5">
                {PEOPLE_ITEMS.map((item) => (
                  <NavItem key={item.id} id={item.id} label={item.label} icon={item.icon}
                    active={activeTab === item.id} onClick={() => handleSelectTab(item.id)} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* System */}
        <div className="flex flex-col gap-1">
          <SectionLabel label="System" />
          <div className="mt-1.5 flex flex-col gap-0.5">
            <NavItem id="settings" label="Settings" icon={Sliders}
              active={activeTab === 'settings'} onClick={() => handleSelectTab('settings')} />
            <button
              onClick={() => { if (onLogout) onLogout(); }}
              className="w-full px-4 py-3 rounded-2xl text-[13px] font-extrabold flex items-center gap-3 transition-all"
              style={{ color: 'rgba(255,255,255,0.50)', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; e.currentTarget.style.color = '#FB7185'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── AI Promo Card ─────────────────────────────────── */}
      <div className="px-4 pb-6 mt-2">
        <div className="relative overflow-hidden p-4 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(108,60,225,0.35) 0%, rgba(91,33,182,0.50) 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(167,139,250,0.25)',
          }}>
          {/* Glow blob */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl pointer-events-none"
            style={{ background: 'rgba(167,139,250,0.30)' }} />

          <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.20)' }}>
            <Bot className="w-5 h-5 text-white" />
          </div>

          <div>
            <h4 className="text-[13px] font-black text-white leading-snug">
              Empowering Decisions<br />with AI Intelligence
            </h4>
            <p className="text-[10px] mt-0.5 font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Real-time insights & automation
            </p>
          </div>

          <button
            onClick={() => { onOpenAiModal(); if (onCloseMobile) onCloseMobile(); }}
            className="w-full py-2.5 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: 'linear-gradient(135deg,#F43F5E 0%,#FB923C 100%)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(244,63,94,0.40)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Unlock AI Magic
          </button>
        </div>
      </div>
    </aside>
  );
};
