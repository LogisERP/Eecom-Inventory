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
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Brand Directory
                </h1>
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  Lookup Master
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium mt-1">
                Manage product brand portfolios, lookup keys, and status configurations.
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
            <span>Add Brand</span>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total Brands</span>
              <p className="text-2xl font-black text-white mt-0.5">{brands.length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
              }}
            >
              <Tag className="w-5 h-5" />
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Active Brands</span>
              <p className="text-2xl font-black text-emerald-300 mt-0.5">{activeCount}</p>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Inactive Brands</span>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{brands.length - activeCount}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#F59E0B',
              }}
            >
              <Layers className="w-5 h-5" />
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
              placeholder="Search by brand name or code..."
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
          Showing <strong className="text-purple-700 font-black">{filteredBrands.length}</strong> brands
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
            Loading Brand Master Data...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="w-12 h-12 mx-auto mb-2 opacity-30 text-purple-600" />
            <p className="text-xs font-bold text-slate-600">No brands found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-purple-800"
                  style={{ background: 'var(--clr-primary-lt)' }}
                >
                  <th className="py-4 px-5">Brand Name</th>
                  <th className="py-4 px-4">Brand Code</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-purple-50/40 transition-colors group">
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
                          {brand.brandName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors text-sm">
                          {brand.brandName}
                        </span>
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
                        {brand.brandCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-slate-600 font-medium">
                      {brand.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black"
                        style={{
                          borderRadius: 'var(--radius-pill)',
                          background: brand.status === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-error-lt)',
                          color: brand.status === 'Active' ? 'var(--clr-success)' : 'var(--clr-error)',
                        }}
                      >
                        {brand.status === 'Active' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {brand.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBrand(brand)}
                          className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                          title="Edit Brand"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(brand.id!)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{ borderRadius: 'var(--radius-sm)' }}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md overflow-hidden animate-scale-in"
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
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 flex items-center justify-center font-bold"
                  style={{
                    background: 'var(--grad-primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingBrand ? 'Edit Brand Entry' : 'Create New Brand'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingBrand(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Brand Code</label>
                <input
                  type="text"
                  value={formData.brandCode}
                  onChange={(e) => setFormData({ ...formData, brandCode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  style={{ borderRadius: 'var(--radius-md)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Nike, Apple, Aura Luxe"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                  style={{ borderRadius: 'var(--radius-md)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter brand description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 resize-none"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOption })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 bg-white"
                  style={{ borderRadius: 'var(--radius-md)' }}
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
                  {isSubmitting ? 'Saving...' : editingBrand ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingBrand && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md overflow-hidden animate-scale-in"
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
              <h3 className="text-base font-black text-slate-900">Brand Overview</h3>
              <button
                onClick={() => setViewingBrand(null)}
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
                  <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Brand Code</p>
                  <p className="text-base font-mono font-black text-slate-900 mt-0.5">{viewingBrand.brandCode}</p>
                </div>
                <div
                  className="w-12 h-12 flex items-center justify-center font-black text-xl"
                  style={{
                    background: 'var(--grad-primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {viewingBrand.brandName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Brand Name</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{viewingBrand.brandName}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Description</p>
                <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">{viewingBrand.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                <span
                  className="inline-block mt-1 px-3 py-1 text-xs font-black"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    background: viewingBrand.status === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-error-lt)',
                    color: viewingBrand.status === 'Active' ? 'var(--clr-success)' : 'var(--clr-error)',
                  }}
                >
                  {viewingBrand.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingBrand(null)}
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
            <h3 className="text-base font-black text-slate-900">Delete Brand Entry?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Are you sure you want to delete this brand record?
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
