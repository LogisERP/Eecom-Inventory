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
    <div className="flex flex-col gap-6 pt-2 pb-8 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Supplier Master Directory
                <span className="text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-400/30">
                  Vendor Directory
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Manage manufacturers, distributors, wholesalers, and payment terms.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Suppliers</span>
              <p className="text-xl font-black text-white mt-0.5">{suppliers.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Suppliers</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">
                {suppliers.filter((s) => s.supplierStatus === 'Active').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Supplier Types</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">
                {new Set(suppliers.map((s) => s.supplierType)).size}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
            <input
              type="text"
              placeholder="Search supplier name, contact, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-300/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all placeholder:text-slate-500 placeholder:font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 text-right">
          Showing <strong className="text-slate-800">{filteredSuppliers.length}</strong> suppliers
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Supplier Master Directory...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Factory className="w-10 h-10 mx-auto mb-2 opacity-30 text-orange-600" />
            <p className="text-xs font-bold text-slate-600">No suppliers found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Supplier Name</th>
                  <th className="py-3.5 px-4">Supplier Code</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Payment Terms</th>
                  <th className="py-3.5 px-4">Product (Lookup)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                          {sup.supplierName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors block text-sm">
                            {sup.supplierName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{sup.city}, {sup.country}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
                        {sup.supplierCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 text-[11px] font-bold">
                        {sup.supplierType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{sup.contactPerson || '—'}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{sup.email}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {sup.paymentTerms}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {sup.productName ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[11px]">
                          <Tag className="w-3 h-3 text-blue-500" />
                          {sup.productName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic font-medium">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          sup.supplierStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sup.supplierStatus === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {sup.supplierStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSupplier(sup)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Edit Supplier"
                        >
                          <Edit2 className="w-4 h-4 text-amber-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(sup.id!)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingSupplier ? 'Edit Supplier Master' : 'Add Supplier Master'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSupplier(null);
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
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Supplier Code</label>
                  <input
                    type="text"
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Logistics Co."
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Supplier Type</label>
                  <select
                    value={formData.supplierType}
                    onChange={(e) => setFormData({ ...formData, supplierType: e.target.value as SupplierTypeOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Chen"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. robert@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter street address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Tax Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. US-9938102"
                    value={formData.taxRegistrationNo}
                    onChange={(e) => setFormData({ ...formData, taxRegistrationNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as PaymentTermsOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.supplierStatus}
                    onChange={(e) => setFormData({ ...formData, supplierStatus: e.target.value as StatusOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Lookup (Optional)</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Supplier Overview</h3>
              <button
                onClick={() => setViewingSupplier(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">Supplier Code</p>
                  <p className="text-sm font-mono font-bold text-orange-900 mt-0.5">{viewingSupplier.supplierCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">Payment Terms</p>
                  <p className="text-sm font-mono font-bold text-orange-900 mt-0.5">{viewingSupplier.paymentTerms}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Supplier Name</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{viewingSupplier.supplierName}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px]">
                  {viewingSupplier.supplierType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Person</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{viewingSupplier.contactPerson || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tax Registration No</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{viewingSupplier.taxRegistrationNo || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSupplier.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSupplier.phone || '—'}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Address Location</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {viewingSupplier.address} {viewingSupplier.city} {viewingSupplier.state} {viewingSupplier.country}
                </p>
              </div>

              {viewingSupplier.productName && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Product Lookup</p>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{viewingSupplier.productName}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingSupplier.supplierStatus === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {viewingSupplier.supplierStatus}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingSupplier(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete Supplier Entry?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this supplier master entry?
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
