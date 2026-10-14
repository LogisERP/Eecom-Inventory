import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  GitBranch
} from 'lucide-react';
import type { ProductCategoryItem, StatusOption } from '../../types/productDetails';
import {
  subscribeProductCategories,
  addProductCategoryToDb,
  updateProductCategoryInDb,
  deleteProductCategoryFromDb,
  generateCode
} from '../../services/productDetailsService';

export const ProductCategoryView: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingCat, setEditingCat] = useState<ProductCategoryItem | null>(null);
  const [viewingCat, setViewingCat] = useState<ProductCategoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    categoryCode: string;
    categoryName: string;
    description: string;
    parentCategoryId: string;
    status: StatusOption;
  }>({
    categoryCode: '',
    categoryName: '',
    description: '',
    parentCategoryId: '',
    status: 'Active'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeProductCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('CAT', categories.map((c) => c.categoryCode));
    setFormData({
      categoryCode: autoCode,
      categoryName: '',
      description: '',
      parentCategoryId: '',
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat: ProductCategoryItem) => {
    setEditingCat(cat);
    setFormData({
      categoryCode: cat.categoryCode,
      categoryName: cat.categoryName,
      description: cat.description,
      parentCategoryId: cat.parentCategoryId || '',
      status: cat.status
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) {
      setErrorMsg('Category Name is required');
      return;
    }

    const parentObj = categories.find((c) => c.id === formData.parentCategoryId);
    const parentCategoryName = parentObj ? parentObj.categoryName : '';

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingCat && editingCat.id) {
        await updateProductCategoryInDb(editingCat.id, {
          categoryCode: formData.categoryCode.trim(),
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim(),
          parentCategoryId: formData.parentCategoryId,
          parentCategoryName: parentCategoryName,
          status: formData.status
        });
        setEditingCat(null);
      } else {
        await addProductCategoryToDb({
          categoryCode: formData.categoryCode.trim(),
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim(),
          parentCategoryId: formData.parentCategoryId,
          parentCategoryName: parentCategoryName,
          status: formData.status
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductCategoryFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.parentCategoryName && c.parentCategoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
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
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  Taxonomy
                </span>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full" style={{ background: 'var(--grad-accent)', color: '#fff' }}>
                  Category Master
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Product Category Hierarchy
              </h1>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Structure parent-child product categories and catalog navigation paths.
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
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Total Categories</span>
              <p className="text-xl font-black text-white mt-0.5">{categories.length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,60,225,0.25)', color: '#C4B5FD' }}>
              <FolderTree className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Active Categories</span>
              <p className="text-xl font-black mt-0.5" style={{ color: 'var(--clr-success)' }}>{categories.filter((c) => c.status === 'Active').length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.20)', color: '#34D399' }}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Sub-Categories</span>
              <p className="text-xl font-black mt-0.5" style={{ color: '#93C5FD' }}>{categories.filter((c) => c.parentCategoryName).length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.20)', color: '#60A5FA' }}>
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
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
              placeholder="Search category name, code, or parent..."
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
          Showing <strong style={{ color: 'var(--clr-primary)' }}>{filteredCategories.length}</strong> categories
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
            Loading Product Category Hierarchy...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: 'var(--clr-primary)' }} />
            <p className="text-xs font-bold" style={{ color: 'var(--txt-secondary)' }}>No categories found matching your filters.</p>
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
                  <th className="py-3.5 px-5">Category Name</th>
                  <th className="py-3.5 px-4">Category Code</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filteredCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
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
                          {cat.categoryName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-sm" style={{ color: 'var(--txt-primary)' }}>
                          {cat.categoryName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}
                      >
                        {cat.categoryCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {cat.parentCategoryName ? (
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-black"
                          style={{ background: 'rgba(108,60,225,0.08)', color: 'var(--clr-primary)' }}
                        >
                          {cat.parentCategoryName}
                        </span>
                      ) : (
                        <span className="font-medium italic text-xs" style={{ color: 'var(--txt-muted)' }}>Root Level</span>
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate font-medium" style={{ color: 'var(--txt-secondary)' }}>
                      {cat.description || <span className="italic" style={{ color: 'var(--txt-muted)' }}>No description</span>}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black"
                        style={cat.status === 'Active' ? {
                          background: 'var(--clr-success-lt)',
                          color: 'var(--clr-success)',
                        } : {
                          background: 'var(--clr-error-lt)',
                          color: 'var(--clr-error)',
                        }}
                      >
                        {cat.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {cat.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingCat(cat)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = 'var(--txt-secondary)'; }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = 'var(--txt-secondary)'; }}
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(cat.id!)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--clr-error)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-error-lt)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                          title="Delete Category"
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
      {(isAddModalOpen || editingCat) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md overflow-hidden animate-scale-in"
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
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--grad-primary)', boxShadow: '0 2px 8px rgba(108,60,225,0.35)' }}
                >
                  <FolderTree className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>
                  {editingCat ? 'Edit Product Category' : 'Create Product Category'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCat(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(108,60,225,0.10)', color: 'var(--clr-primary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div
                  className="p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2"
                  style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Category Code</label>
                <input
                  type="text"
                  value={formData.categoryCode}
                  onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none"
                  style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)', color: 'var(--clr-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Wearables, Fine Jewelry"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none"
                  style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>
                  Parent Category (Lookup)
                </label>
                <select
                  value={formData.parentCategoryId}
                  onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                  style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                >
                  <option value="">None (Top Level Root Category)</option>
                  {categories
                    .filter((c) => !editingCat || c.id !== editingCat.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName} ({c.categoryCode})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none resize-none"
                  style={{ background: '#FFFFFF', border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: 'var(--txt-primary)' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOption })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none bg-white"
                  style={{ border: '1.5px solid var(--border-base)', color: 'var(--txt-primary)' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--border-base)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCat(null);
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
                  {isSubmitting ? 'Saving...' : editingCat ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingCat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md overflow-hidden animate-scale-in"
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
              <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>Category Overview</h3>
              <button
                onClick={() => setViewingCat(null)}
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
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--clr-primary)' }}>Category Code</p>
                  <p className="text-sm font-mono font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingCat.categoryCode}</p>
                </div>
                {viewingCat.parentCategoryName && (
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--clr-primary)' }}>Parent Category</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--txt-secondary)' }}>{viewingCat.parentCategoryName}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase" style={{ color: 'var(--txt-muted)' }}>Category Name</p>
                <p className="text-lg font-black mt-0.5" style={{ color: 'var(--txt-primary)' }}>{viewingCat.categoryName}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase" style={{ color: 'var(--txt-muted)' }}>Description</p>
                <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{viewingCat.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase" style={{ color: 'var(--txt-muted)' }}>Status</p>
                <span
                  className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-black"
                  style={viewingCat.status === 'Active' ? {
                    background: 'var(--clr-success-lt)',
                    color: 'var(--clr-success)',
                  } : {
                    background: 'var(--clr-error-lt)',
                    color: 'var(--clr-error)',
                  }}
                >
                  {viewingCat.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 text-right" style={{ borderTop: '1px solid var(--border-base)' }}>
              <button
                onClick={() => setViewingCat(null)}
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
            <h3 className="text-base font-black" style={{ color: 'var(--txt-primary)' }}>Delete Category?</h3>
            <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>
              Are you sure you want to delete this category record?
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
