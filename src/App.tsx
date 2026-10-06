import { useState } from 'react';
import { FULL_INVENTORY, type ProductItem } from './data/mockData';
import { SidebarNav } from './components/SidebarNav';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { OrdersView } from './components/OrdersView';
import { ReportsView } from './components/ReportsView';
import { MarketplaceView } from './components/MarketplaceView';
import { RoleView } from './components/RoleView';
import { UserView } from './components/UserView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddProductModal } from './components/AddProductModal';
import { AiAssistantModal } from './components/AiAssistantModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [products, setProducts] = useState<ProductItem[]>(FULL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>('All');

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'My Dashboard';
      case 'inventory': return 'Inventory Catalog';
      case 'orders': return 'Customer Orders';
      case 'marketplace': return 'Marketplace Channels';
      case 'role': return 'Role Management';
      case 'user': return 'User Management';
      case 'reports': return 'Financial Reports';
      case 'settings': return 'Account & Store Settings';
      default: return 'My Dashboard';
    }
  };

  const handleFilterStatus = (status: string) => {
    setInventoryStatusFilter(status);
    setActiveTab('inventory');
  };

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  return (
    <div
      style={{ fontFamily: "var(--font-sans)" }}
      className="h-screen w-screen bg-[#f1f5f9] flex overflow-hidden relative"
    >
      {/* ─── Desktop Sidebar ─── */}
      <div className="hidden md:flex shrink-0">
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiModal={() => setIsAiModalOpen(true)}
        />
      </div>

      {/* ─── Mobile Sidebar Drawer ─── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#141c25] h-full z-10 shadow-2xl flex">
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Fixed top header */}
        <div className="shrink-0 px-4 sm:px-7 pt-4 sm:pt-6 pb-0">
          <TopHeader
            title={getPageTitle()}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-7 pb-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onFilterStatus={handleFilterStatus}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              activeStatusFilter={inventoryStatusFilter}
              setActiveStatusFilter={setInventoryStatusFilter}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'marketplace' && <MarketplaceView />}
          {activeTab === 'role' && <RoleView />}
          {activeTab === 'user' && <UserView />}
          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm mt-2 sm:mt-4">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800">Store Settings & Automation</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Manage API keys, automated reorder thresholds, and staff access permissions.</p>
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                ⚡ Automatic AI Reordering Enabled for Low Stock (Threshold: &lt; 50 units)
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddProduct={handleAddProduct} />
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
}

export default App;
