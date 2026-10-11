import React, { useState, useEffect } from 'react';
import {
  Tag,
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
import type { BrandItem, StatusOption } from '../../types/productDetails';
import {
  subscribeBrands,
  addBrandToDb,
  updateBrandInDb,
  deleteBrandFromDb,
  generateCode
} from '../../services/productDetailsService';

export const BrandView: React.FC = () => {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [viewingBrand, setViewingBrand] = useState<BrandItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    brandCode: string;
    brandName: string;
    description: string;
    status: StatusOption;
  }>({
    brandCode: '',
    brandName: '',
    description: '',
    status: 'Active'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeBrands((data) => {
      setBrands(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('BRD', brands.map((b) => b.brandCode));
    setFormData({
      brandCode: autoCode,
      brandName: '',
      description: '',
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormData({
      brandCode: brand.brandCode,
      brandName: brand.brandName,
      description: brand.description,
      status: brand.status
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName.trim()) {
      setErrorMsg('Brand Name is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingBrand && editingBrand.id) {
        await updateBrandInDb(editingBrand.id, {
          brandCode: formData.brandCode.trim(),
          brandName: formData.brandName.trim(),
          description: formData.description.trim(),
          status: formData.status
        });
        setEditingBrand(null);
      } else {
        await addBrandToDb({
          brandCode: formData.brandCode.trim(),
          brandName: formData.brandName.trim(),
          description: formData.description.trim(),
          status: formData.status
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBrandFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting brand: ' + err.message);
    }
  };

  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.brandCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = brands.filter((b) => b.status === 'Active').length;

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-inner">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Brand Directory
                <span className="text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                  Lookup Master
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Manage product brand portfolios, lookup keys, and status configurations.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Brands</span>
              <p className="text-xl font-black text-white mt-0.5">{brands.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Brands</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inactive Brands</span>
              <p className="text-xl font-black text-slate-300 mt-0.5">{brands.length - activeCount}</p>
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
              placeholder="Search by brand name or code..."
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
          Showing <strong className="text-slate-800">{filteredBrands.length}</strong> brands
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Brand Master Data...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="w-10 h-10 mx-auto mb-2 opacity-30 text-purple-600" />
            <p className="text-xs font-bold text-slate-600">No brands found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Brand Name</th>
                  <th className="py-3.5 px-4">Brand Code</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                          {brand.brandName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {brand.brandName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
                        {brand.brandCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-medium">
                      {brand.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          brand.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {brand.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {brand.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBrand(brand)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-4 h-4 text-amber-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(brand.id!)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Delete Brand"
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
      {(isAddModalOpen || editingBrand) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingBrand ? 'Edit Brand Entry' : 'Create New Brand'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingBrand(null);
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
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Brand Code</label>
                <input
                  type="text"
                  value={formData.brandCode}
                  onChange={(e) => setFormData({ ...formData, brandCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Nike, Apple, Aura Luxe"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter brand description..."
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
                    setEditingBrand(null);
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
                  {isSubmitting ? 'Saving...' : editingBrand ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingBrand && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Brand Overview</h3>
              <button
                onClick={() => setViewingBrand(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Brand Code</p>
                  <p className="text-sm font-mono font-bold text-purple-900 mt-0.5">{viewingBrand.brandCode}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg">
                  {viewingBrand.brandName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Brand Name</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{viewingBrand.brandName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Description</p>
                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{viewingBrand.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingBrand.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {viewingBrand.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingBrand(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete Brand Entry?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this brand record?
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
