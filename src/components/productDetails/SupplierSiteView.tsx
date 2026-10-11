import React, { useState, useEffect } from 'react';
import {
  MapPin,
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
  Building2,
  Star
} from 'lucide-react';
import type {
  SupplierSiteItem,
  SupplierMasterItem,
  StatusOption,
  SiteTypeOption
} from '../../types/productDetails';
import {
  subscribeSupplierSites,
  addSupplierSiteToDb,
  updateSupplierSiteInDb,
  deleteSupplierSiteFromDb,
  subscribeSupplierMasters,
  generateCode
} from '../../services/productDetailsService';

export const SupplierSiteView: React.FC = () => {
  const [sites, setSites] = useState<SupplierSiteItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierMasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [siteTypeFilter, setSiteTypeFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSite, setEditingSite] = useState<SupplierSiteItem | null>(null);
  const [viewingSite, setViewingSite] = useState<SupplierSiteItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    siteCode: string;
    siteName: string;
    supplierId: string;
    siteType: SiteTypeOption;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    contactPerson: string;
    email: string;
    phone: string;
    isPrimarySite: boolean;
    status: StatusOption;
  }>({
    siteCode: '',
    siteName: '',
    supplierId: '',
    siteType: 'Head Office',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    postalCode: '',
    contactPerson: '',
    email: '',
    phone: '',
    isPrimarySite: false,
    status: 'Active'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsubSites = subscribeSupplierSites((data) => {
      setSites(data);
      setLoading(false);
    });
    const unsubSuppliers = subscribeSupplierMasters((data) => {
      setSuppliers(data);
    });
    return () => {
      unsubSites();
      unsubSuppliers();
    };
  }, []);

  const openAddModal = () => {
    const autoCode = generateCode('STE', sites.map((s) => s.siteCode));
    setFormData({
      siteCode: autoCode,
      siteName: '',
      supplierId: suppliers.length > 0 ? suppliers[0].id || '' : '',
      siteType: 'Head Office',
      address: '',
      city: '',
      state: '',
      country: 'USA',
      postalCode: '',
      contactPerson: '',
      email: '',
      phone: '',
      isPrimarySite: false,
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (site: SupplierSiteItem) => {
    setEditingSite(site);
    setFormData({
      siteCode: site.siteCode,
      siteName: site.siteName,
      supplierId: site.supplierId || '',
      siteType: site.siteType,
      address: site.address,
      city: site.city,
      state: site.state,
      country: site.country,
      postalCode: site.postalCode,
      contactPerson: site.contactPerson,
      email: site.email,
      phone: site.phone,
      isPrimarySite: site.isPrimarySite,
      status: site.status
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siteName.trim()) {
      setErrorMsg('Site Name is required');
      return;
    }
    if (!formData.supplierId) {
      setErrorMsg('Please select a Supplier from the Lookup');
      return;
    }

    const matchedSupplier = suppliers.find((s) => s.id === formData.supplierId);
    const supplierName = matchedSupplier ? matchedSupplier.supplierName : '';

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (editingSite && editingSite.id) {
        await updateSupplierSiteInDb(editingSite.id, {
          siteCode: formData.siteCode.trim(),
          siteName: formData.siteName.trim(),
          supplierId: formData.supplierId,
          supplierName: supplierName,
          siteType: formData.siteType,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          postalCode: formData.postalCode.trim(),
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          isPrimarySite: formData.isPrimarySite,
          status: formData.status
        });
        setEditingSite(null);
      } else {
        await addSupplierSiteToDb({
          siteCode: formData.siteCode.trim(),
          siteName: formData.siteName.trim(),
          supplierId: formData.supplierId,
          supplierName: supplierName,
          siteType: formData.siteType,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          postalCode: formData.postalCode.trim(),
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          isPrimarySite: formData.isPrimarySite,
          status: formData.status
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save supplier site');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplierSiteFromDb(id);
      setDeletingId(null);
    } catch (err: any) {
      alert('Error deleting site: ' + err.message);
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.siteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.supplierName && site.supplierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || site.status === statusFilter;
    const matchesType = siteTypeFilter === 'All' || site.siteType === siteTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 animate-fade-in">

      {/* Hero Header & Quick Metrics Banner */}
      <div className="bg-gradient-to-r from-[#141c25] via-[#1e293b] to-[#0f172a] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Supplier Site Locations
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  1:N Relationship
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Register supplier head offices, warehouses, branches, and fulfillment sites.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier Site</span>
          </button>
        </div>

        {/* Stats Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Supplier Sites</span>
              <p className="text-xl font-black text-white mt-0.5">{sites.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Sites</span>
              <p className="text-xl font-black text-amber-400 mt-0.5">{sites.filter((s) => s.isPrimarySite).length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Warehouses & Hubs</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">{sites.filter((s) => s.siteType === 'Warehouse').length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
            <input
              type="text"
              placeholder="Search site name, code, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-300/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-all placeholder:text-slate-500 placeholder:font-medium"
            />
          </div>

          <select
            value={siteTypeFilter}
            onChange={(e) => setSiteTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Site Types</option>
            <option value="Head Office">Head Office</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Branch">Branch</option>
            <option value="Delivery">Delivery</option>
          </select>

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
          Showing <strong className="text-slate-800">{filteredSites.length}</strong> sites
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading Supplier Site Locations...
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-600" />
            <p className="text-xs font-bold text-slate-600">No supplier sites found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Site Name</th>
                  <th className="py-3.5 px-4">Site Code</th>
                  <th className="py-3.5 px-4">Supplier (Lookup 1:N)</th>
                  <th className="py-3.5 px-4">Site Type</th>
                  <th className="py-3.5 px-4">City / Country</th>
                  <th className="py-3.5 px-4">Is Primary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                          {site.siteName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {site.siteName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
                        {site.siteCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 text-[11px] font-bold">
                        {site.supplierName || 'Unlinked'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {site.siteType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {site.city}, {site.country}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {site.isPrimarySite ? (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase">
                          ★ Primary
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          site.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {site.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {site.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSite(site)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(site)}
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Edit Site"
                        >
                          <Edit2 className="w-4 h-4 text-amber-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(site.id!)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          title="Delete Site"
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
      {(isAddModalOpen || editingSite) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingSite ? 'Edit Supplier Site' : 'Add Supplier Site'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSite(null);
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
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Site Code</label>
                  <input
                    type="text"
                    value={formData.siteCode}
                    onChange={(e) => setFormData({ ...formData, siteCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Site Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Central Plant"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Supplier (Lookup - 1:N) *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="">Select Supplier...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.supplierName} ({s.supplierCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Site Type</label>
                  <select
                    value={formData.siteType}
                    onChange={(e) => setFormData({ ...formData, siteType: e.target.value as SiteTypeOption })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Head Office">Head Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Branch">Branch</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter site street address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPrimarySite"
                    checked={formData.isPrimarySite}
                    onChange={(e) => setFormData({ ...formData, isPrimarySite: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="isPrimarySite" className="text-xs font-extrabold text-slate-700">
                    Is Primary Site (Yes / No)
                  </label>
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
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSite(null);
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
                  {isSubmitting ? 'Saving...' : editingSite ? 'Update Site' : 'Save Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingSite && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-800">Supplier Site Overview</h3>
              <button
                onClick={() => setViewingSite(null)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Site Code</p>
                  <p className="text-sm font-mono font-bold text-emerald-900 mt-0.5">{viewingSite.siteCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Site Type</p>
                  <p className="text-xs font-bold text-emerald-900 mt-0.5">{viewingSite.siteType}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Site Name</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{viewingSite.siteName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Supplier Master (1:N)</p>
                <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 font-extrabold text-xs">
                  {viewingSite.supplierName || 'Unlinked'}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Full Address</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {viewingSite.address}, {viewingSite.city}, {viewingSite.state}, {viewingSite.country} - {viewingSite.postalCode}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSite.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone
                  </p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{viewingSite.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Is Primary Site</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">{viewingSite.isPrimarySite ? 'Yes ★' : 'No'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      viewingSite.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {viewingSite.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingSite(null)}
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
            <h3 className="text-base font-extrabold text-slate-900">Delete Supplier Site?</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Are you sure you want to delete this site location?
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
