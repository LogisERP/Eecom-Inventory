import React from 'react';
import { Home, Compass, Package, ShoppingBag, Sparkles } from 'lucide-react';

interface FloatingPillNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal?: () => void;
  isAdmin?: boolean;
}

const items = [
  { id: 'home',      icon: Home,      title: 'Home'      },
  { id: 'dashboard', icon: Compass,   title: 'Dashboard' },
  { id: 'inventory', icon: Package,   title: 'Inventory' },
  { id: 'orders',    icon: ShoppingBag, title: 'Orders'  },
];

export const FloatingPillNav: React.FC<FloatingPillNavProps> = ({
  activeTab, setActiveTab, onOpenAiModal, isAdmin = true,
}) => {
  return (
    <div className="md:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 pointer-events-none w-full max-w-sm flex justify-center">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto flex items-center justify-between gap-1.5 px-3 py-2.5 transition-all w-full"
        style={{
          background: 'rgba(26,16,51,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: '1.5px solid rgba(167,139,250,0.20)',
          boxShadow: '0 18px 48px rgba(26,16,51,0.45), 0 4px 12px rgba(108,60,225,0.20)',
        }}
      >
        {items.map(({ id, icon: Icon, title }) => {
          const isActive = activeTab === id ||
            (id === 'inventory' && (activeTab === 'inventory' || activeTab.startsWith('product-')));

          const canNavigate = isAdmin || id === 'home';

          return (
            <button
              key={id}
              onClick={() => setActiveTab(canNavigate ? id : 'home')}
              title={title}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all"
              style={isActive ? {
                background: 'linear-gradient(135deg,#7C50F0 0%,#5B21B6 100%)',
                boxShadow: '0 4px 14px rgba(108,60,225,0.45)',
                color: '#fff',
              } : {
                background: 'transparent',
                color: 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </button>
          );
        })}

        {/* AI Button */}
        {onOpenAiModal ? (
          <button
            onClick={onOpenAiModal}
            title="AI Assistant"
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all"
            style={{
              background: 'linear-gradient(135deg,#F43F5E 0%,#FB923C 100%)',
              boxShadow: '0 4px 14px rgba(244,63,94,0.45)',
              color: '#fff',
            }}
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('settings')}
            title="Settings"
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all"
            style={activeTab === 'settings' ? {
              background: 'linear-gradient(135deg,#7C50F0 0%,#5B21B6 100%)',
              boxShadow: '0 4px 14px rgba(108,60,225,0.45)',
              color: '#fff',
            } : {
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
      </nav>
    </div>
  );
};
