import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  DollarSign,
  Boxes,
  Tag
} from 'lucide-react';
import type {
  ProductMasterItem,
  BrandItem,
  UomItem,
  ProductTypeItem,
  ProductCategoryItem,
  SupplierMasterItem,
  StatusOption
} from '../../types/productDetails';
import {
  subscribeProductMasters,
  addProductMasterToDb,
  updateProductMasterInDb,
  deleteProductMasterFromDb,
  subscribeBrands,
  subscribeUoms,
  subscribeProductTypes,
  subscribeProductCategories,
  subscribeSupplierMasters,
  generateCode
} from '../../services/productDetailsService';

export const ProductMasterView: React.FC = () => {
  const [products, setProducts] = useState<ProductMasterItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [uoms, setUoms] = useState<UomItem[]>([]);
  const [types, setTypes] = useState<ProductTypeItem[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierMasterItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductMasterItem | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductMasterItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    productCode: string;
    productName: string;
    productDescription: string;
    brandId: string;
    uomId: string;
    productTypeId: string;
    productCategoryId: string;
    supplierId: string;
    sku: string;
    barcode: string;
    productStatus: StatusOption;
    productWeight: number;
    productCost: number;
    sellingPrice: number;
    taxRate: number;
    isStockItem: boolean;
    createdDate: string;
  }>({
    productCode: '',
    productName: '',
    productDescription: '',
    brandId: '',
    uomId: '',
    productTypeId: '',
    productCategoryId: '',
    supplierId: '',
    sku: '',
    barcode: '',
    productStatus: 'Active',
    productWeight: 0,
    productCost: 0,
    sellingPrice: 0,
    taxRate: 0,
    isStockItem: true,
    createdDate: new Date().toISOString().split('T')[0]
  });

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsubProd = subscribeProductMasters((data) => {
      setProducts(data);
      setLoading(false);
    });
    const unsubBrand = subscribeBrands((data) => setBrands(data));
    const unsubUom = subscribeUoms((data) => setUoms(data));
    const unsubType = subscribeProductTypes((data) => setTypes(data));
    const unsubCat = subscribeProductCategories((data) => setCategories(data));
    const unsubSup = subscribeSupplierMasters((data) => setSuppliers(data));

    return () => {
      unsubProd();
      unsubBrand();
      unsubUom();
      unsubType();
      unsubCat();
      unsubSup();
    };
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('PRD', products.map((p) => p.productCode));
    const defaultBrand = brands.length > 0 ? brands[0].id || '' : '';
    const defaultUom = uoms.length > 0 ? uoms[0].id || '' : '';
    const defaultType = types.length > 0 ? types[0].id || '' : '';
    const defaultCat = categories.length > 0 ? categories[0].id || '' : '';
    const defaultSup = suppliers.length > 0 ? suppliers[0].id || '' : '';

    setFormData({
      productCode: autoCode,
      productName: '',
      productDescription: '',
      brandId: defaultBrand,
      uomId: defaultUom,
      productTypeId: defaultType,
      productCategoryId: defaultCat,
      supplierId: defaultSup,
      sku: '',
      barcode: '',
      productStatus: 'Active',
      productWeight: 0,
      productCost: 0,
      sellingPrice: 0,
      taxRate: 0,
      isStockItem: true,
      createdDate: new Date().toISOString().split('T')[0]
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: ProductMasterItem) => {
    setEditingProduct(p);

    const bId = brands.find((b) => b.brandName === p.brandName)?.id || p.brandId || '';
    const uId = uoms.find((u) => u.uomName === p.uomName)?.id || p.uomId || '';
    const tId = types.find((t) => t.productTypeName === p.productTypeName)?.id || p.productTypeId || '';
    const cId = categories.find((c) => c.categoryName === p.productCategoryName)?.id || p.productCategoryId || '';
    const sId = suppliers.find((s) => s.supplierName === p.supplierName)?.id || p.supplierId || '';

    setFormData({
      productCode: p.productCode,
      productName: p.productName,
      productDescription: p.productDescription,
      brandId: bId,
      uomId: uId,
      productTypeId: tId,
      productCategoryId: cId,
      supplierId: sId,
      sku: p.sku,
      barcode: p.barcode,
      productStatus: p.productStatus,
      productWeight: p.productWeight,
      productCost: p.productCost,
      sellingPrice: p.sellingPrice,
      taxRate: p.taxRate,
      isStockItem: p.isStockItem,
      createdDate: p.createdDate || new Date().toISOString().split('T')[0]
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim()) {
      setErrorMsg('Product Name is required');
      return;
    }

    const matchedBrand = brands.find((b) => b.id === formData.brandId);
    const matchedUom = uoms.find((u) => u.id === formData.uomId);
    const matchedType = types.find((t) => t.id === formData.productTypeId);
    const matchedCat = categories.find((c) => c.id === formData.productCategoryId);
    const matchedSup = suppliers.find((s) => s.id === formData.supplierId);

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingProduct && editingProduct.id) {
        await updateProductMasterInDb(editingProduct.id, {
          productCode: formData.productCode.trim(),
          productName: formData.productName.trim(),
          productDescription: formData.productDescription.trim(),
          brandId: formData.brandId,
          brandName: matchedBrand ? matchedBrand.brandName : editingProduct.brandName,
          uomId: formData.uomId,
          uomName: matchedUom ? matchedUom.uomName : editingProduct.uomName,
          productTypeId: formData.productTypeId,
          productTypeName: matchedType ? matchedType.productTypeName : editingProduct.productTypeName,
          productCategoryId: formData.productCategoryId,
          productCategoryName: matchedCat ? matchedCat.categoryName : editingProduct.productCategoryName,
          supplierId: formData.supplierId,
          supplierName: matchedSup ? matchedSup.supplierName : editingProduct.supplierName,
          sku: formData.sku.trim(),
          barcode: formData.barcode.trim(),
          productStatus: formData.productStatus,
          productWeight: Number(formData.productWeight),
          productCost: Number(formData.productCost),
          sellingPrice: Number(formData.sellingPrice),
          taxRate: Number(formData.taxRate),
          isStockItem: formData.isStockItem,
          createdDate: formData.createdDate
        });
        setEditingProduct(null);
      } else {
        await addProductMasterToDb({
          productCode: formData.productCode.trim(),
          productName: formData.productName.trim(),
          productDescription: formData.productDescription.trim(),
          brandId: formData.brandId,
          brandName: matchedBrand ? matchedBrand.brandName : 'N/A',
          uomId: formData.uomId,
          uomName: matchedUom ? matchedUom.uomName : 'PCS',
          productTypeId: formData.productTypeId,
          productTypeName: matchedType ? matchedType.productTypeName : 'General',
          productCategoryId: formData.productCategoryId,
          productCategoryName: matchedCat ? matchedCat.categoryName : 'Uncategorized',
          supplierId: formData.supplierId,
          supplierName: matchedSup ? matchedSup.supplierName : 'N/A',
          sku: formData.sku.trim(),
          barcode: formData.barcode.trim(),
          productStatus: formData.productStatus,
          productWeight: Number(formData.productWeight),
          productCost: Number(formData.productCost),
          sellingPrice: Number(formData.sellingPrice),
          taxRate: Number(formData.taxRate),
          isStockItem: formData.isStockItem,
          createdDate: formData.createdDate
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product master');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductMasterFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting product master: ' + err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brandName && p.brandName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.supplierName && p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.productStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 pb-32 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div
        className="relative overflow-hidden flex flex-col justify-between gap-5 p-6 sm:p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #1A1033 0%, #231547 60%, #2D1A5A 100%)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(108,60,225,0.28)' }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(244,63,94,0.15)' }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
              style={{ background: 'var(--grad-primary)', boxShadow: 'var(--shadow-btn)' }}
            >
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  Product Registry
                </span>
                <span
                  className="text-[9px] font-black px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--grad-accent)', color: '#fff' }}
                >
                  Core Catalog
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Product Master Directory
              </h1>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Central ERP repository for product items, linked lookups, prices, and barcodes.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 font-black text-xs transition-all self-start sm:self-auto cursor-pointer"
            style={{
              background: 'var(--grad-accent)',
              color: '#fff',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 24px',
              boxShadow: 'var(--shadow-btn-accent)',
              border: 'none',
            }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product Master</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Total Products</span>
              <p className="text-xl font-black text-white mt-0.5">{products.length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,60,225,0.25)', color: '#C4B5FD' }}>
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Active Catalog</span>
              <p className="text-xl font-black mt-0.5" style={{ color: 'var(--clr-success)' }}>
                {products.filter((p) => p.productStatus === 'Active').length}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.20)', color: '#34D399' }}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Stock Tracked</span>
              <p className="text-xl font-black mt-0.5" style={{ color: '#93C5FD' }}>{products.filter((p) => p.isStockItem).length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.20)', color: '#60A5FA' }}>
              <Boxes className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Avg Selling Price</span>
              <p className="text-lg font-black mt-0.5" style={{ color: '#FCD34D' }}>
                $
                {products.length > 0
                  ? (products.reduce((acc, p) => acc + p.sellingPrice, 0) / products.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.20)', color: '#FBBF24' }}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Search Bar */}
      <div
        className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div
            className="flex items-center gap-2.5 w-full sm:w-80 px-4 py-2 transition-all"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border-base)',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Search className="w-4 h-4 text-purple-600 stroke-[2.5] shrink-0" />
            <input
              type="text"
              placeholder="Search product code, name, SKU, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold w-full"
              style={{ color: 'var(--txt-primary)' }}
            />
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-full w-full sm:w-auto"
            style={{ background: 'var(--clr-primary-lt)', border: '1px solid var(--border-base)' }}
          >
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex-1 sm:flex-initial cursor-pointer"
                style={statusFilter === status ? {
                  background: 'var(--grad-primary)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(108,60,225,0.35)',
                } : {
                  background: 'transparent',
                  color: 'var(--clr-primary)',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 text-right">
          Showing <strong style={{ color: 'var(--clr-primary)' }}>{filteredProducts.length}</strong> products
        </div>
      </div>

      {/* Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-xs font-bold animate-pulse" style={{ color: 'var(--txt-muted)' }}>
            Loading Product Master Registry...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: 'var(--clr-primary)' }} />
            <p className="text-xs font-bold" style={{ color: 'var(--txt-secondary)' }}>No product master records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    borderBottom: '2px solid var(--border-strong)',
                    color: 'var(--clr-primary)',
                  }}
                >
                  <th className="py-3.5 px-5">Product Name</th>
                  <th className="py-3.5 px-4">Code / SKU</th>
                  <th className="py-3.5 px-4">Brand (Lookup)</th>
                  <th className="py-3.5 px-4">Category & Type</th>
                  <th className="py-3.5 px-4">UOM</th>
                  <th className="py-3.5 px-4">Cost / Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filteredProducts.map((prod, idx) => (
                  <tr
                    key={prod.id}
                    className="transition-colors group"
                    style={{
                      borderBottom: '1px solid var(--border-base)',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAFBFF',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#FFFFFF' : '#FAFBFF'; }}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
                          style={{
                            background: 'var(--clr-primary-lt)',
                            color: 'var(--clr-primary)',
                            border: '1.5px solid var(--border-base)',
                          }}
                        >
                          {prod.productName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-black text-sm block" style={{ color: 'var(--txt-primary)' }}>
                            {prod.productName}
                          </span>
                          <span className="text-[11px] font-medium truncate max-w-xs block mt-0.5" style={{ color: 'var(--txt-muted)' }}>
                            {prod.productDescription || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block"
                        style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}
                      >
                        {prod.productCode}
                      </span>
                      <p className="text-[10px] font-mono mt-1 pl-1" style={{ color: 'var(--txt-muted)' }}>{prod.sku || 'No SKU'}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-black"
                        style={{ background: 'rgba(108,60,225,0.08)', color: 'var(--clr-primary)' }}
                      >
                        {prod.brandName || '—'}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold" style={{ color: 'var(--txt-primary)' }}>{prod.productCategoryName || '—'}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--txt-muted)' }}>{prod.productTypeName || '—'}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-bold" style={{ color: 'var(--txt-secondary)' }}>
                      {prod.uomName || 'PCS'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono">
                      <p className="font-black text-sm" style={{ color: 'var(--clr-success)' }}>${prod.sellingPrice?.toFixed(2)}</p>
                      <p className="text-[10px] font-medium" style={{ color: 'var(--txt-muted)' }}>Cost: ${prod.productCost?.toFixed(2)}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black"
                        style={prod.productStatus === 'Active' ? {
                          background: 'var(--clr-success-lt)',
                          color: 'var(--clr-success)',
                        } : {
                          background: 'var(--clr-error-lt)',
                          color: 'var(--clr-error)',
                        }}
                      >
                        {prod.productStatus === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {prod.productStatus}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingProduct(prod)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = 'var(--txt-secondary)'; }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = 'var(--txt-secondary)'; }}
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(prod.id!)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--clr-error)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-error-lt)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-base)',
              boxShadow: '0 24px 60px rgba(26,16,51,0.25)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between shrink-0"
              style={{ background: 'var(--clr-primary-lt)', borderBottom: '1.5px solid var(--border-base)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--grad-primary)', boxShadow: '0 2px 8px rgba(108,60,225,0.35)' }}
                >
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>
                  {editingProduct ? 'Edit Product Master' : 'Add Product Master'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(108,60,225,0.10)', color: 'var(--clr-primary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMsg && (
                <div
                  className="p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2"
                  style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Product Code</label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none transition-all"
                    style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)', color: 'var(--clr-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter detailed product description..."
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all resize-none"
                  style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                />
              </div>

              {/* Lookups Grid */}
              <div
                className="p-4 rounded-2xl space-y-3"
                style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }}
              >
                <p className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--clr-primary)' }}>
                  <Tag className="w-3.5 h-3.5" /> Entity Lookups
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Brand (Lookup)</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                      style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    >
                      <option value="">Select Brand...</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.brandName} ({b.brandCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>UOM (Lookup)</label>
                    <select
                      value={formData.uomId}
                      onChange={(e) => setFormData({ ...formData, uomId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                      style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    >
                      <option value="">Select UOM...</option>
                      {uoms.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.uomName} ({u.uomType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Product Type (Lookup)</label>
                    <select
                      value={formData.productTypeId}
                      onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                      style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    >
                      <option value="">Select Product Type...</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.productTypeName} ({t.productTypeCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Product Category (Lookup)</label>
                    <select
                      value={formData.productCategoryId}
                      onChange={(e) => setFormData({ ...formData, productCategoryId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                      style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.categoryName} ({c.categoryCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Supplier Master (Lookup)</label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                      style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                    >
                      <option value="">Select Supplier...</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.supplierName} ({s.supplierCode} - {s.supplierType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SKU & Barcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. APL-IP15PM-256"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Barcode</label>
                  <input
                    type="text"
                    placeholder="e.g. 194253091234"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>
              </div>

              {/* Financials & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.productWeight}
                    onChange={(e) => setFormData({ ...formData, productWeight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Product Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.productCost}
                    onChange={(e) => setFormData({ ...formData, productCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isStockItem"
                    checked={formData.isStockItem}
                    onChange={(e) => setFormData({ ...formData, isStockItem: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <label htmlFor="isStockItem" className="text-xs font-black cursor-pointer" style={{ color: 'var(--txt-primary)' }}>
                    Track Stock Inventory
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Created Date</label>
                  <input
                    type="date"
                    value={formData.createdDate}
                    onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold outline-none"
                    style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--txt-primary)' }}>Status</label>
                  <select
                    value={formData.productStatus}
                    onChange={(e) => setFormData({ ...formData, productStatus: e.target.value as StatusOption })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold outline-none bg-white"
                    style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3 shrink-0" style={{ borderColor: 'var(--border-base)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer"
                  style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-white rounded-full text-xs font-black transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  style={{ background: 'var(--grad-primary)', boxShadow: 'var(--shadow-btn)' }}
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-xl overflow-hidden animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-base)',
              boxShadow: '0 24px 60px rgba(26,16,51,0.25)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--clr-primary-lt)', borderBottom: '1.5px solid var(--border-base)' }}
            >
              <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>Product Master Overview</h3>
              <button
                onClick={() => setViewingProduct(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(108,60,225,0.10)', color: 'var(--clr-primary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div
                className="p-4 rounded-2xl flex items-center justify-between"
                style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--clr-primary)' }}>Product Code</p>
                  <p className="text-sm font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.productCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--clr-primary)' }}>SKU / Barcode</p>
                  <p className="text-xs font-mono font-bold mt-0.5" style={{ color: 'var(--txt-secondary)' }}>
                    {viewingProduct.sku || 'N/A'} • {viewingProduct.barcode || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase" style={{ color: 'var(--txt-muted)' }}>Product Name</p>
                <p className="text-xl font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.productName}</p>
                <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>
                  {viewingProduct.productDescription || 'No description available'}
                </p>
              </div>

              {/* Lookups summary */}
              <div
                className="p-4 rounded-2xl grid grid-cols-2 gap-3 text-xs"
                style={{ background: 'var(--bg-app)', border: '1px solid var(--border-base)' }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase" style={{ color: 'var(--clr-primary)' }}>Brand</p>
                  <p className="font-extrabold mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.brandName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase" style={{ color: 'var(--clr-primary)' }}>UOM</p>
                  <p className="font-extrabold mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.uomName || 'PCS'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase" style={{ color: 'var(--clr-primary)' }}>Product Type</p>
                  <p className="font-extrabold mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.productTypeName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase" style={{ color: 'var(--clr-primary)' }}>Product Category</p>
                  <p className="font-extrabold mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.productCategoryName || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black uppercase" style={{ color: 'var(--clr-primary)' }}>Supplier Master</p>
                  <p className="font-extrabold mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.supplierName || '—'}</p>
                </div>
              </div>

              <div
                className="grid grid-cols-4 gap-3 text-center p-3 rounded-2xl"
                style={{ background: 'var(--bg-app)', border: '1px solid var(--border-base)' }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Weight</p>
                  <p className="text-xs font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.productWeight} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Cost</p>
                  <p className="text-xs font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>${viewingProduct.productCost?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Price</p>
                  <p className="text-xs font-mono font-black mt-0.5" style={{ color: 'var(--clr-success)' }}>${viewingProduct.sellingPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Tax Rate</p>
                  <p className="text-xs font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.taxRate}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Is Stock Item</p>
                  <p className="font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.isStockItem ? 'Yes (Tracked)' : 'No'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Created Date</p>
                  <p className="font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingProduct.createdDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-muted)' }}>Status</p>
                  <span
                    className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-black"
                    style={viewingProduct.productStatus === 'Active' ? {
                      background: 'var(--clr-success-lt)',
                      color: 'var(--clr-success)',
                    } : {
                      background: 'var(--clr-error-lt)',
                      color: 'var(--clr-error)',
                    }}
                  >
                    {viewingProduct.productStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 text-right" style={{ borderTop: '1px solid var(--border-base)' }}>
              <button
                onClick={() => setViewingProduct(null)}
                className="px-5 py-2 text-xs font-black rounded-full transition-all cursor-pointer"
                style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 text-center animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-base)',
              boxShadow: '0 24px 60px rgba(26,16,51,0.25)',
            }}
          >
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)' }}
            >
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>Delete Product Master?</h3>
            <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>
              Are you sure you want to delete this product master record? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer"
                style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 text-white rounded-full text-xs font-black shadow-md transition-all cursor-pointer"
                style={{ background: 'var(--clr-error)', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
