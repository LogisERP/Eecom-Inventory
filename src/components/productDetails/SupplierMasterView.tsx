import React, { useState, useEffect } from 'react';
import {
  Factory,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Tag
} from 'lucide-react';
import type {
  SupplierMasterItem,
  StatusOption,
  SupplierTypeOption,
  PaymentTermsOption,
  ProductMasterItem
} from '../../types/productDetails';
import {
  subscribeSupplierMasters,
  addSupplierMasterToDb,
  updateSupplierMasterInDb,
  deleteSupplierMasterFromDb,
  subscribeProductMasters,
  generateCode
} from '../../services/productDetailsService';

export const SupplierMasterView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierMasterItem[]>([]);
  const [products, setProducts] = useState<ProductMasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierMasterItem | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<SupplierMasterItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    supplierCode: string;
    supplierName: string;
    supplierType: SupplierTypeOption;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    taxRegistrationNo: string;
    paymentTerms: PaymentTermsOption;
    supplierStatus: StatusOption;
    productId: string;
  }>({
    supplierCode: '',
    supplierName: '',
    supplierType: 'Manufacturer',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    taxRegistrationNo: '',
    paymentTerms: 'Net 30',
    supplierStatus: 'Active',
    productId: ''
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsubSuppliers = subscribeSupplierMasters((data) => {
      setSuppliers(data);
      setLoading(false);
    });
    const unsubProducts = subscribeProductMasters((data) => {
      setProducts(data);
    });
    return () => {
      unsubSuppliers();
      unsubProducts();
    };
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('SUP', suppliers.map((s) => s.supplierCode));
    setFormData({
      supplierCode: autoCode,
      supplierName: '',
      supplierType: 'Manufacturer',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'USA',
      taxRegistrationNo: '',
      paymentTerms: 'Net 30',
      supplierStatus: 'Active',
      productId: ''
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (sup: SupplierMasterItem) => {
    setEditingSupplier(sup);
    setFormData({
      supplierCode: sup.supplierCode,
      supplierName: sup.supplierName,
      supplierType: sup.supplierType,
      contactPerson: sup.contactPerson,
      email: sup.email,
      phone: sup.phone,
      address: sup.address,
      city: sup.city,
      state: sup.state,
      country: sup.country,
      taxRegistrationNo: sup.taxRegistrationNo,
      paymentTerms: sup.paymentTerms,
      supplierStatus: sup.supplierStatus,
      productId: sup.productId || ''
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName.trim()) {
      setErrorMsg('Supplier Name is required');
      return;
    }

    const matchedProd = products.find((p) => p.id === formData.productId);
    const productName = matchedProd ? matchedProd.productName : '';

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingSupplier && editingSupplier.id) {
        await updateSupplierMasterInDb(editingSupplier.id, {
          supplierCode: formData.supplierCode.trim(),
          supplierName: formData.supplierName.trim(),
          supplierType: formData.supplierType,
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          taxRegistrationNo: formData.taxRegistrationNo.trim(),
          paymentTerms: formData.paymentTerms,
          supplierStatus: formData.supplierStatus,
          productId: formData.productId,
          productName: productName
        });
        setEditingSupplier(null);
      } else {
        await addSupplierMasterToDb({
          supplierCode: formData.supplierCode.trim(),
          supplierName: formData.supplierName.trim(),
          supplierType: formData.supplierType,
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          taxRegistrationNo: formData.taxRegistrationNo.trim(),
          paymentTerms: formData.paymentTerms,
          supplierStatus: formData.supplierStatus,
          productId: formData.productId,
          productName: productName
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplierMasterFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting supplier: ' + err.message);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.supplierStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Hero Header & Quick Metrics Banner */}
      <div
        className="p-6 md:p-8 text-white relative overflow-hidden"
        style={{
          background: 'var(--grad-hero)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 flex items-center justify-center shrink-0 shadow-inner"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
              }}
            >
              <Factory className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Supplier Master Directory
                </h1>
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  Vendor Directory
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium mt-1">
                Manage manufacturers, distributors, wholesalers, and payment terms.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 font-black text-sm transition-all transform active:scale-95 cursor-pointer shrink-0"
            style={{
              background: 'var(--grad-accent)',
              color: '#fff',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 24px',
              boxShadow: 'var(--shadow-btn-accent)',
            }}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add Supplier</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-white/10">
          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total Suppliers</span>
              <p className="text-2xl font-black text-white mt-0.5">{suppliers.length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
              }}
            >
              <Factory className="w-5 h-5" />
            </div>
          </div>

          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Active Suppliers</span>
              <p className="text-2xl font-black text-emerald-300 mt-0.5">
                {suppliers.filter((s) => s.supplierStatus === 'Active').length}
              </p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#10B981',
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Supplier Types</span>
              <p className="text-2xl font-black text-blue-300 mt-0.5">
                {new Set(suppliers.map((s) => s.supplierType)).size}
              </p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(37,99,235,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#60A5FA',
              }}
            >
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div
        className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
            <input
              type="text"
              placeholder="Search supplier name, contact, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          <div
            className="flex items-center gap-1 p-1 w-full sm:w-auto"
            style={{
              background: 'var(--clr-primary-lt)',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-xs font-black transition-all flex-1 sm:flex-initial cursor-pointer active:scale-95 ${
                  statusFilter === status
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-extrabold text-slate-500 text-right">
          Showing <strong className="text-purple-700 font-black">{filteredSuppliers.length}</strong> suppliers
        </div>
      </div>

      {/* Data Table */}
      <div
        className="overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-purple-600 text-xs font-black animate-pulse">
            Loading Supplier Master Directory...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Factory className="w-12 h-12 mx-auto mb-2 opacity-30 text-purple-600" />
            <p className="text-xs font-bold text-slate-600">No suppliers found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-purple-800"
                  style={{ background: 'var(--clr-primary-lt)' }}
                >
                  <th className="py-4 px-5">Supplier Name</th>
                  <th className="py-4 px-4">Supplier Code</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Contact Details</th>
                  <th className="py-4 px-4">Payment Terms</th>
                  <th className="py-4 px-4">Product (Lookup)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-purple-50/40 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center font-black text-sm shrink-0"
                          style={{
                            background: 'var(--clr-primary-lt)',
                            color: 'var(--clr-primary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(108,60,225,0.2)',
                          }}
                        >
                          {sup.supplierName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors block text-sm">
                            {sup.supplierName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{sup.city}, {sup.country}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="font-mono font-bold text-slate-700 px-2.5 py-1 text-xs"
                        style={{
                          background: 'var(--clr-primary-lt)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {sup.supplierCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="px-3 py-1 text-[11px] font-black"
                        style={{
                          background: 'rgba(244,63,94,0.1)',
                          color: 'var(--clr-accent)',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        {sup.supplierType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{sup.contactPerson || '—'}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{sup.email}</p>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {sup.paymentTerms}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {sup.productName ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 font-black text-[11px]"
                          style={{
                            background: 'var(--clr-primary-lt)',
                            color: 'var(--clr-primary)',
                            borderRadius: 'var(--radius-pill)',
                          }}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          {sup.productName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic font-medium">None</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black"
                        style={{
                          borderRadius: 'var(--radius-pill)',
                          background: sup.supplierStatus === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-error-lt)',
                          color: sup.supplierStatus === 'Active' ? 'var(--clr-success)' : 'var(--clr-error)',
                        }}
                      >
                        {sup.supplierStatus === 'Active' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {sup.supplierStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSupplier(sup)}
                          className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                          title="Edit Supplier"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(sup.id!)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                          title="Delete Supplier"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          <span className="hidden sm:inline text-rose-600">Delete</span>
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
      {(isAddModalOpen || editingSupplier) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid var(--border-base)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between shrink-0"
              style={{
                background: 'var(--clr-primary-lt)',
                borderBottom: '1px solid var(--border-base)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 flex items-center justify-center font-bold"
                  style={{
                    background: 'var(--grad-primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <Factory className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingSupplier ? 'Edit Supplier Master' : 'Add Supplier Master'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSupplier(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMsg && (
                <div
                  className="p-3 text-xs font-bold flex items-center gap-2"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--clr-error-lt)',
                    color: 'var(--clr-error)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Supplier Code</label>
                  <input
                    type="text"
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Supplier Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Logistics Co."
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Supplier Type</label>
                  <select
                    value={formData.supplierType}
                    onChange={(e) => setFormData({ ...formData, supplierType: e.target.value as SupplierTypeOption })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 bg-white"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Chen"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. robert@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter street address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 resize-none"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Tax Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. US-9938102"
                    value={formData.taxRegistrationNo}
                    onChange={(e) => setFormData({ ...formData, taxRegistrationNo: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as PaymentTermsOption })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 bg-white"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Status</label>
                  <select
                    value={formData.supplierStatus}
                    onChange={(e) => setFormData({ ...formData, supplierStatus: e.target.value as StatusOption })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 bg-white"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Product Lookup (Optional)</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 bg-white"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <option value="">Select Supplied Product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName} ({p.productCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-100 transition-colors"
                  style={{ borderRadius: 'var(--radius-pill)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-white text-xs font-black transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: 'var(--grad-primary)',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-btn-primary)',
                  }}
                >
                  {isSubmitting ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-lg overflow-hidden animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid var(--border-base)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: 'var(--clr-primary-lt)',
                borderBottom: '1px solid var(--border-base)',
              }}
            >
              <h3 className="text-base font-black text-slate-900">Supplier Overview</h3>
              <button
                onClick={() => setViewingSupplier(null)}
                className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div>
                  <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Supplier Code</p>
                  <p className="text-base font-mono font-black text-slate-900 mt-0.5">{viewingSupplier.supplierCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Payment Terms</p>
                  <p className="text-base font-mono font-black text-slate-900 mt-0.5">{viewingSupplier.paymentTerms}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Supplier Name</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{viewingSupplier.supplierName}</p>
                <span
                  className="inline-block mt-1 px-3 py-0.5 font-black text-[10px]"
                  style={{
                    background: 'rgba(244,63,94,0.1)',
                    color: 'var(--clr-accent)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {viewingSupplier.supplierType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Contact Person</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{viewingSupplier.contactPerson || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Tax Registration No</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{viewingSupplier.taxRegistrationNo || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-600" /> Email
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSupplier.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-600" /> Phone
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSupplier.phone || '—'}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Address Location</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {viewingSupplier.address} {viewingSupplier.city} {viewingSupplier.state} {viewingSupplier.country}
                </p>
              </div>

              {viewingSupplier.productName && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Linked Product Lookup</p>
                  <p className="text-xs font-black text-purple-700 mt-0.5">{viewingSupplier.productName}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                <span
                  className="inline-block mt-1 px-3 py-1 text-xs font-black"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    background: viewingSupplier.supplierStatus === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-error-lt)',
                    color: viewingSupplier.supplierStatus === 'Active' ? 'var(--clr-success)' : 'var(--clr-error)',
                  }}
                >
                  {viewingSupplier.supplierStatus}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingSupplier(null)}
                className="px-5 py-2 text-slate-700 text-xs font-black transition-colors cursor-pointer"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-pill)',
                }}
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
            className="w-full max-w-sm p-6 text-center animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid var(--border-base)',
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'var(--clr-error-lt)',
                color: 'var(--clr-error)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-slate-900">Delete Supplier Entry?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Are you sure you want to delete this supplier master entry?
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--clr-error)',
                  borderRadius: 'var(--radius-pill)',
                }}
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
