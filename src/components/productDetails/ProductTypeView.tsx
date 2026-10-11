import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Layers
} from 'lucide-react';
import type { ProductTypeItem, StatusOption } from '../../types/productDetails';
import {
  subscribeProductTypes,
  addProductTypeToDb,
  updateProductTypeInDb,
  deleteProductTypeFromDb,
  generateCode
} from '../../services/productDetailsService';

export const ProductTypeView: React.FC = () => {
  const [types, setTypes] = useState<ProductTypeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<ProductTypeItem | null>(null);
  const [viewingType, setViewingType] = useState<ProductTypeItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    productTypeCode: string;
    productTypeName: string;
    description: string;
    status: StatusOption;
  }>({
    productTypeCode: '',
    productTypeName: '',
    description: '',
    status: 'Active'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeProductTypes((data) => {
      setTypes(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('TYP', types.map((t) => t.productTypeCode));
    setFormData({
      productTypeCode: autoCode,
      productTypeName: '',
      description: '',
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: ProductTypeItem) => {
    setEditingType(item);
    setFormData({
      productTypeCode: item.productTypeCode,
      productTypeName: item.productTypeName,
      description: item.description,
      status: item.status
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productTypeName.trim()) {
      setErrorMsg('Product Type Name is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingType && editingType.id) {
        await updateProductTypeInDb(editingType.id, {
          productTypeCode: formData.productTypeCode.trim(),
          productTypeName: formData.productTypeName.trim(),
          description: formData.description.trim(),
          status: formData.status
        });
        setEditingType(null);
      } else {
        await addProductTypeToDb({
          productTypeCode: formData.productTypeCode.trim(),
          productTypeName: formData.productTypeName.trim(),
          description: formData.description.trim(),
          status: formData.status
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save Product Type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductTypeFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting product type: ' + err.message);
    }
  };

  const filteredTypes = types.filter((t) => {
    const matchesSearch =
      t.productTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productTypeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Product Type Specifications
                <span className="text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                  Type Master
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Classify inventory by hardware, electronics, jewelry, and apparel types.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product Type</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Product Types</span>
              <p className="text-xl font-black text-white mt-0.5">{types.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Types</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{types.filter((t) => t.status === 'Active').length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inactive Types</span>
              <p className="text-xl font-black text-amber-400 mt-0.5">{types.filter((t) => t.status === 'Inactive').length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
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
              placeholder="Search product type name or code..."
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
          Showing <strong className="text-slate-800">{filteredTypes.length}</strong> types
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Product Types...
          </div>
        ) : filteredTypes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Boxes className="w-10 h-10 mx-auto mb-2 opacity-30 text-teal-600" />
            <p className="text-xs font-bold text-slate-600">No product types found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Product Type Name</th>
                  <th className="py-3.5 px-4">Type Code</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTypes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                          {t.productTypeName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {t.productTypeName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
                        {t.productTypeCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-medium">
                      {t.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          t.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {t.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingType(t)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Edit Type"
                        >
                          <Edit2 className="w-4 h-4 text-amber-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id!)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Delete Type"
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
      {(isAddModalOpen || editingType) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingType ? 'Edit Product Type' : 'Create Product Type'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingType(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Type Code</label>
                <input
                  type="text"
                  value={formData.productTypeCode}
                  onChange={(e) => setFormData({ ...formData, productTypeCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Product Type Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Consumer Electronics, Luxury Jewelry"
                  value={formData.productTypeName}
                  onChange={(e) => setFormData({ ...formData, productTypeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter product type specification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOption })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingType(null);
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
                  {isSubmitting ? 'Saving...' : editingType ? 'Update Type' : 'Save Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingType && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Product Type Overview</h3>
              <button
                onClick={() => setViewingType(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-wider">Type Code</p>
                  <p className="text-sm font-mono font-bold text-teal-900 mt-0.5">{viewingType.productTypeCode}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-lg">
                  {viewingType.productTypeName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Product Type Name</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{viewingType.productTypeName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Description</p>
                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{viewingType.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingType.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {viewingType.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingType(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete Product Type?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this product type?
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
