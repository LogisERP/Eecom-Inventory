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
      <div className="bg-[#121316] rounded-[32px] p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400 shadow-inner">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Product Master Directory
                <span className="text-[10px] font-black uppercase bg-white/15 text-white px-3 py-1 rounded-full border border-white/20">
                  Core Catalog
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Central ERP repository for product items, linked lookups, prices, and barcodes.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product Master</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
              <p className="text-xl font-black text-white mt-0.5">{products.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Catalog</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">
                {products.filter((p) => p.productStatus === 'Active').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Tracked</span>
              <p className="text-xl font-black text-indigo-300 mt-0.5">{products.filter((p) => p.isStockItem).length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Selling Price</span>
              <p className="text-lg font-black text-amber-300 mt-0.5">
                $
                {products.length > 0
                  ? (products.reduce((acc, p) => acc + p.sellingPrice, 0) / products.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search product code, name, SKU, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full w-full sm:w-auto">
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex-1 sm:flex-initial cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#121316] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400 text-right">
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Product Master Registry...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-blue-600" />
            <p className="text-xs font-bold text-slate-600">No product master records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Product Name</th>
                  <th className="py-3.5 px-4">Code / SKU</th>
                  <th className="py-3.5 px-4">Brand (Lookup)</th>
                  <th className="py-3.5 px-4">Category & Type (Lookup)</th>
                  <th className="py-3.5 px-4">UOM</th>
                  <th className="py-3.5 px-4">Cost / Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-black text-sm shrink-0">
                          {prod.productName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors block text-sm">
                            {prod.productName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-xs block mt-0.5">
                            {prod.productDescription || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full inline-block text-xs">
                        {prod.productCode}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 pl-1">{prod.sku || 'No SKU'}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black">
                        {prod.brandName || '—'}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{prod.productCategoryName || '—'}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{prod.productTypeName || '—'}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-700">
                      {prod.uomName || 'PCS'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono">
                      <p className="font-black text-emerald-600 text-sm">${prod.sellingPrice?.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Cost: ${prod.productCost?.toFixed(2)}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                          prod.productStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.productStatus === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {prod.productStatus}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingProduct(prod)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(prod.id!)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingProduct ? 'Edit Product Master' : 'Add Product Master'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Code</label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter detailed product description..."
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Lookups Grid */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Entity Lookups
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Brand (Lookup)</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">UOM (Lookup)</label>
                    <select
                      value={formData.uomId}
                      onChange={(e) => setFormData({ ...formData, uomId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Type (Lookup)</label>
                    <select
                      value={formData.productTypeId}
                      onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Category (Lookup)</label>
                    <select
                      value={formData.productCategoryId}
                      onChange={(e) => setFormData({ ...formData, productCategoryId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">Supplier Master (Lookup)</label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. APL-IP15PM-256"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    placeholder="e.g. 194253091234"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Financials & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.productWeight}
                    onChange={(e) => setFormData({ ...formData, productWeight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.productCost}
                    onChange={(e) => setFormData({ ...formData, productCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
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
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="isStockItem" className="text-xs font-extrabold text-slate-700">
                    Is Stock Item (Yes / No)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Created Date</label>
                  <input
                    type="date"
                    value={formData.createdDate}
                    onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.productStatus}
                    onChange={(e) => setFormData({ ...formData, productStatus: e.target.value as StatusOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Product Master Overview</h3>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Product Code</p>
                  <p className="text-sm font-mono font-bold text-blue-900 mt-0.5">{viewingProduct.productCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">SKU / Barcode</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {viewingProduct.sku || 'N/A'} • {viewingProduct.barcode || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Product Name</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{viewingProduct.productName}</p>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {viewingProduct.productDescription || 'No description available'}
                </p>
              </div>

              {/* Lookups summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Brand</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.brandName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">UOM</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.uomName || 'PCS'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Product Type</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.productTypeName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Product Category</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.productCategoryName || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Supplier Master</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.supplierName || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{viewingProduct.productWeight} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cost</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">${viewingProduct.productCost?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                  <p className="text-xs font-mono font-bold text-emerald-600 mt-0.5">${viewingProduct.sellingPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tax Rate</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{viewingProduct.taxRate}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Is Stock Item</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{viewingProduct.isStockItem ? 'Yes (Tracked)' : 'No'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Created Date</p>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{viewingProduct.createdDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      viewingProduct.productStatus === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {viewingProduct.productStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Delete Product Master?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this product master record?
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
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
