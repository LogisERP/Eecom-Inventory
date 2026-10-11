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
      <div className="bg-[#121316] rounded-[32px] p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-400 shadow-inner">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Product Category Hierarchy
                <span className="text-[10px] font-black uppercase bg-white/15 text-white px-3 py-1 rounded-full border border-white/20">
                  Category Master
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Structure parent-child product categories and catalog navigation paths.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Categories</span>
              <p className="text-xl font-black text-white mt-0.5">{categories.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Categories</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{categories.filter((c) => c.status === 'Active').length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sub-Categories</span>
              <p className="text-xl font-black text-indigo-300 mt-0.5">{categories.filter((c) => c.parentCategoryName).length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search category name, code, or parent..."
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
          Showing <strong className="text-slate-900">{filteredCategories.length}</strong> categories
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Product Category Hierarchy...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FolderTree className="w-10 h-10 mx-auto mb-2 opacity-30 text-cyan-600" />
            <p className="text-xs font-bold text-slate-600">No categories found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Category Name</th>
                  <th className="py-3.5 px-4">Category Code</th>
                  <th className="py-3.5 px-4">Parent Category (Lookup)</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-black text-sm shrink-0">
                          {cat.categoryName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {cat.categoryName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs">
                        {cat.categoryCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {cat.parentCategoryName ? (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black">
                          {cat.parentCategoryName}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Root Level</span>
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-slate-500 font-medium">
                      {cat.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                          cat.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cat.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {cat.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingCat(cat)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(cat.id!)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingCat ? 'Edit Product Category' : 'Create Product Category'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCat(null);
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
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Category Code</label>
                <input
                  type="text"
                  value={formData.categoryCode}
                  onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Wearables, Fine Jewelry"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Parent Category (Lookup)
                </label>
                <select
                  value={formData.parentCategoryId}
                  onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
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
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter category description..."
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
                    setEditingCat(null);
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
                  {isSubmitting ? 'Saving...' : editingCat ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Category Overview</h3>
              <button
                onClick={() => setViewingCat(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider">Category Code</p>
                  <p className="text-sm font-mono font-bold text-cyan-900 mt-0.5">{viewingCat.categoryCode}</p>
                </div>
                {viewingCat.parentCategoryName && (
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Parent Category</p>
                    <p className="text-xs font-bold text-indigo-800 mt-0.5">{viewingCat.parentCategoryName}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Category Name</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{viewingCat.categoryName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Description</p>
                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{viewingCat.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingCat.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {viewingCat.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingCat(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this category record?
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
