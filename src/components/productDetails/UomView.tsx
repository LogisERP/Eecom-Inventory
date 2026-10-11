import React, { useState, useEffect } from 'react';
import {
  Ruler,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Scale
} from 'lucide-react';
import type { UomItem, StatusOption, UomTypeOption } from '../../types/productDetails';
import {
  subscribeUoms,
  addUomToDb,
  updateUomInDb,
  deleteUomFromDb,
  generateCode
} from '../../services/productDetailsService';

export const UomView: React.FC = () => {
  const [uoms, setUoms] = useState<UomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingUom, setEditingUom] = useState<UomItem | null>(null);
  const [viewingUom, setViewingUom] = useState<UomItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    uomCode: string;
    uomName: string;
    uomType: UomTypeOption;
    conversionFactor: number;
    description: string;
    status: StatusOption;
  }>({
    uomCode: '',
    uomName: '',
    uomType: 'Quantity',
    conversionFactor: 1.0,
    description: '',
    status: 'Active'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeUoms((data) => {
      setUoms(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('UOM', uoms.map((u) => u.uomCode));
    setFormData({
      uomCode: autoCode,
      uomName: '',
      uomType: 'Quantity',
      conversionFactor: 1.0,
      description: '',
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (uom: UomItem) => {
    setEditingUom(uom);
    setFormData({
      uomCode: uom.uomCode,
      uomName: uom.uomName,
      uomType: uom.uomType,
      conversionFactor: uom.conversionFactor,
      description: uom.description,
      status: uom.status
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uomName.trim()) {
      setErrorMsg('UOM Name is required');
      return;
    }
    if (isNaN(formData.conversionFactor) || formData.conversionFactor <= 0) {
      setErrorMsg('Conversion Factor must be a positive number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingUom && editingUom.id) {
        await updateUomInDb(editingUom.id, {
          uomCode: formData.uomCode.trim(),
          uomName: formData.uomName.trim(),
          uomType: formData.uomType,
          conversionFactor: Number(formData.conversionFactor),
          description: formData.description.trim(),
          status: formData.status
        });
        setEditingUom(null);
      } else {
        await addUomToDb({
          uomCode: formData.uomCode.trim(),
          uomName: formData.uomName.trim(),
          uomType: formData.uomType,
          conversionFactor: Number(formData.conversionFactor),
          description: formData.description.trim(),
          status: formData.status
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save UOM');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUomFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting UOM: ' + err.message);
    }
  };

  const filteredUoms = uoms.filter((u) => {
    const matchesSearch =
      u.uomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uomType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesType = typeFilter === 'All' || u.uomType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 pb-32 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div className="bg-[#121316] rounded-[32px] p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Unit of Measure (UOM) Registry
                <span className="text-[10px] font-black uppercase bg-white/15 text-white px-3 py-1 rounded-full border border-white/20">
                  Quantity Master
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Define measurement units, conversion factors, and quantity specifications.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add UOM</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Units (UOM)</span>
              <p className="text-xl font-black text-white mt-0.5">{uoms.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Units</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{uoms.filter((u) => u.status === 'Active').length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quantity Types</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">{new Set(uoms.map((u) => u.uomType)).size}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search UOM name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black text-slate-700 focus:outline-none focus:border-slate-900 shadow-2xs"
          >
            <option value="All">All UOM Types</option>
            <option value="Quantity">Quantity</option>
            <option value="Weight">Weight</option>
            <option value="Volume">Volume</option>
            <option value="Length">Length</option>
          </select>

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
          Showing <strong className="text-slate-900">{filteredUoms.length}</strong> units
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Unit of Measure Registry...
          </div>
        ) : filteredUoms.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Ruler className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-600" />
            <p className="text-xs font-bold text-slate-600">No UOM units found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">UOM Name</th>
                  <th className="py-3.5 px-4">UOM Code</th>
                  <th className="py-3.5 px-4">UOM Type</th>
                  <th className="py-3.5 px-4">Conversion Factor</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUoms.map((uom) => (
                  <tr key={uom.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-black text-xs shrink-0">
                          {uom.uomCode.replace('UOM-', '')}
                        </div>
                        <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {uom.uomName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs">
                        {uom.uomCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black">
                        {uom.uomType}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-black text-slate-900 text-sm">
                      {uom.conversionFactor}
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-slate-500 font-medium">
                      {uom.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                          uom.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {uom.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {uom.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingUom(uom)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(uom)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#121316] text-slate-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Edit UOM"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(uom.id!)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Delete UOM"
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
      {(isAddModalOpen || editingUom) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingUom ? 'Edit UOM Entry' : 'Create Unit of Measure'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUom(null);
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
                <label className="block text-xs font-extrabold text-slate-700 mb-1">UOM Code</label>
                <input
                  type="text"
                  value={formData.uomCode}
                  onChange={(e) => setFormData({ ...formData, uomCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">UOM Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pieces, Kilograms, Liters"
                  value={formData.uomName}
                  onChange={(e) => setFormData({ ...formData, uomName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">UOM Type</label>
                  <select
                    value={formData.uomType}
                    onChange={(e) => setFormData({ ...formData, uomType: e.target.value as UomTypeOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Quantity">Quantity</option>
                    <option value="Weight">Weight</option>
                    <option value="Volume">Volume</option>
                    <option value="Length">Length</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Conversion Factor *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.conversionFactor}
                    onChange={(e) => setFormData({ ...formData, conversionFactor: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter unit description..."
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
                    setEditingUom(null);
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
                  {isSubmitting ? 'Saving...' : editingUom ? 'Update UOM' : 'Save UOM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingUom && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">UOM Overview</h3>
              <button
                onClick={() => setViewingUom(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">UOM Code</p>
                  <p className="text-sm font-mono font-bold text-indigo-900 mt-0.5">{viewingUom.uomCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Conversion Factor</p>
                  <p className="text-sm font-mono font-bold text-indigo-900 mt-0.5">{viewingUom.conversionFactor}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">UOM Name</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{viewingUom.uomName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">UOM Type</p>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">{viewingUom.uomType}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Description</p>
                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{viewingUom.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingUom.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {viewingUom.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingUom(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete UOM Entry?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this Unit of Measure?
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
