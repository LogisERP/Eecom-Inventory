import { useState, useEffect } from 'react';
import { FULL_INVENTORY, type ProductItem } from './data/mockData';
import type { UserItem } from './types/people';
import { getStoredAuthUser, setStoredAuthUser, logoutUser } from './services/authService';
import { subscribeUsers } from './services/usersService';
import { LoginPage } from './components/LoginPage';
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
import { EditProfileModal } from './components/EditProfileModal';
import { HomeView } from './components/HomeView';
import { FloatingPillNav } from './components/FloatingPillNav';

// Product Details Submenu Views
import { ProductMasterView } from './components/productDetails/ProductMasterView';
import { ProductCategoryView } from './components/productDetails/ProductCategoryView';
import { ProductTypeView } from './components/productDetails/ProductTypeView';
import { UomView } from './components/productDetails/UomView';
import { BrandView } from './components/productDetails/BrandView';
import { SupplierMasterView } from './components/productDetails/SupplierMasterView';
import { SupplierSiteView } from './components/productDetails/SupplierSiteView';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserItem | null>(() => getStoredAuthUser());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<ProductItem[]>(FULL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>('All');

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Real-time sync of logged-in user details (including User ID) with Firestore DB
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeUsers((users) => {
      let matched: UserItem | undefined;
      if (currentUser.id) {
        matched = users.find((u) => u.id === currentUser.id);
      }
      if (!matched && currentUser.phoneNumber) {
        const cleanPhone = currentUser.phoneNumber.replace(/\D/g, '');
        matched = users.find((u) => u.phoneNumber.replace(/\D/g, '').endsWith(cleanPhone));
      }

      if (matched) {
        const fresh = matched;
        setCurrentUser((prev) => {
          if (!prev) return fresh;
          if (
            prev.id !== fresh.id ||
            prev.userId !== fresh.userId ||
            prev.userName !== fresh.userName ||
            prev.email !== fresh.email ||
            prev.roleName !== fresh.roleName ||
            prev.profilePic !== fresh.profilePic
          ) {
            setStoredAuthUser(fresh);
            return fresh;
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser?.id, currentUser?.phoneNumber]);

  // Role check: Admin vs non-admin (others)
  const roleName = (currentUser?.roleName || '').trim().toLowerCase();
  const isAdmin = !currentUser?.roleName || roleName.includes('admin');

  // Allow non-admin users to access Home and Settings
  useEffect(() => {
    if (currentUser && !isAdmin && activeTab !== 'settings' && activeTab !== 'home') {
      setActiveTab('home');
    }
  }, [currentUser, isAdmin, activeTab]);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => {
      setCurrentUser(user);
      setActiveTab('home');
    }} />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Welcome to Ecom ERP';
      case 'dashboard': return 'My Dashboard';
      case 'inventory': return 'Inventory Catalog';
      case 'orders': return 'Customer Orders';
      case 'product-master': return 'Product Master Directory';
      case 'product-category': return 'Product Category Hierarchy';
      case 'product-type': return 'Product Type Specifications';
      case 'uom': return 'Unit of Measure (UOM) Registry';
      case 'brand': return 'Brand Management';
      case 'supplier-master': return 'Supplier Master Directory';
      case 'supplier-site': return 'Supplier Site Locations';
      case 'marketplace': return 'Marketplace Channels';
      case 'role': return 'Role Management';
      case 'user': return 'User Management';
      case 'reports': return 'Financial Reports';
      case 'settings': return 'Account & Store Settings';
      default: return 'Welcome to Ecom ERP';
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
      style={{ fontFamily: "var(--font-game)", background: 'var(--grad-app-bg)' }}
      className="h-screen w-screen flex overflow-hidden relative"
    >
      {/* ─── Desktop Sidebar ─── */}
      <div className="hidden md:flex shrink-0">
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* ─── Mobile Sidebar Drawer ─── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 animate-fade-in"
            style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(6px)' }}
          />
          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl flex animate-sheet-up"
            style={{ background: 'var(--grad-sidebar)' }}>
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              currentUser={currentUser}
              onLogout={handleLogout}
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
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        </div>

        {/* Scrollable content with iOS native screen transition */}
        <div key={activeTab} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-7 pb-24 md:pb-6 animate-fade-in">
          {activeTab === 'home' && (
            <HomeView
              currentUser={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
          )}

          {isAdmin && activeTab === 'dashboard' && (
            <DashboardView
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onFilterStatus={handleFilterStatus}
            />
          )}

          {isAdmin && activeTab === 'inventory' && (
            <InventoryView
              products={products}
              activeStatusFilter={inventoryStatusFilter}
              setActiveStatusFilter={setInventoryStatusFilter}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {isAdmin && activeTab === 'orders' && <OrdersView />}

          {/* Product Details Submenus */}
          {isAdmin && activeTab === 'product-master' && <ProductMasterView />}
          {isAdmin && activeTab === 'product-category' && <ProductCategoryView />}
          {isAdmin && activeTab === 'product-type' && <ProductTypeView />}
          {isAdmin && activeTab === 'uom' && <UomView />}
          {isAdmin && activeTab === 'brand' && <BrandView />}
          {isAdmin && activeTab === 'supplier-master' && <SupplierMasterView />}
          {isAdmin && activeTab === 'supplier-site' && <SupplierSiteView />}

          {isAdmin && activeTab === 'marketplace' && <MarketplaceView />}
          {isAdmin && activeTab === 'role' && <RoleView />}
          {isAdmin && activeTab === 'user' && <UserView />}
          {isAdmin && activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && (
            <div className="mt-2 sm:mt-4 p-5 sm:p-6 animate-fade-in"
              style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="text-base sm:text-lg font-black" style={{ color: 'var(--txt-primary)' }}>Store Settings & Automation</h3>
              <p className="text-xs font-semibold mt-1" style={{ color: 'var(--txt-secondary)' }}>Manage API keys, automated reorder thresholds, and staff access permissions.</p>
              <div className="mt-4 p-4 text-xs font-bold flex items-center gap-2"
                style={{ background: 'var(--clr-primary-lt)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-base)', color: 'var(--clr-primary)' }}>
                ⚡ Automatic AI Reordering Enabled for Low Stock (Threshold: &lt; 50 units)
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating Pill Navigation Dock (Matched from iOS Travel UI reference) */}
      <FloatingPillNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddProduct={handleAddProduct} />
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      {currentUser && (
        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
        />
      )}
    </div>
  );
}

export default App;
