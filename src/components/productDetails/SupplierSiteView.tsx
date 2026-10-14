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
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Supplier Site Locations
                </h1>
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  1:N Relationship
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium mt-1">
                Register supplier head offices, warehouses, branches, and fulfillment sites.
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
            <span>Add Supplier Site</span>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total Supplier Sites</span>
              <p className="text-2xl font-black text-white mt-0.5">{sites.length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
              }}
            >
              <Building2 className="w-5 h-5" />
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Primary Sites</span>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{sites.filter((s) => s.isPrimarySite).length}</p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: 'rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#F59E0B',
              }}
            >
              <Star className="w-5 h-5" />
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Warehouses & Hubs</span>
              <p className="text-2xl font-black text-blue-300 mt-0.5">{sites.filter((s) => s.siteType === 'Warehouse').length}</p>
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

      {/* Toolbar & Filter Bar */}
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
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold" />
            <input
              type="text"
              placeholder="Search site name, code, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          <select
            value={siteTypeFilter}
            onChange={(e) => setSiteTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-black text-purple-900 focus:outline-none focus:border-purple-500"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <option value="All">All Site Types</option>
            <option value="Head Office">Head Office</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Branch">Branch</option>
            <option value="Delivery">Delivery</option>
          </select>

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
          Showing <strong className="text-purple-700 font-black">{filteredSites.length}</strong> sites
        </div>
      </div>

      {/* Data Table */}
      <div
        className="overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-purple-400 text-xs font-bold animate-pulse">
            Loading Supplier Site Locations...
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-purple-600" />
            <p className="text-xs font-bold text-slate-600">No supplier sites found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-black uppercase tracking-wider text-purple-900"
                  style={{
                    background: 'var(--clr-primary-lt)',
                    borderColor: 'var(--border-base)',
                  }}
                >
                  <th className="py-4 px-5">Site Name</th>
                  <th className="py-4 px-4">Site Code</th>
                  <th className="py-4 px-4">Supplier (Lookup 1:N)</th>
                  <th className="py-4 px-4">Site Type</th>
                  <th className="py-4 px-4">City / Country</th>
                  <th className="py-4 px-4">Is Primary</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-xs">
                {filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-purple-50/50 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 flex items-center justify-center font-black text-sm shrink-0"
                          style={{
                            background: 'var(--clr-secondary-lt)',
                            color: 'var(--clr-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(37,99,235,0.2)',
                          }}
                        >
                          {site.siteName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors text-sm">
                          {site.siteName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="font-mono font-bold text-purple-900 px-2.5 py-1 text-xs"
                        style={{
                          background: 'var(--clr-primary-lt)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(108,60,225,0.15)',
                        }}
                      >
                        {site.siteCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 text-[11px] font-black"
                        style={{
                          background: 'rgba(244,63,94,0.1)',
                          color: 'var(--clr-accent)',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        {site.supplierName || 'Unlinked'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700"
                        style={{
                          background: 'var(--surface-base)',
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--border-base)',
                        }}
                      >
                        {site.siteType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                      {site.city}, {site.country}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {site.isPrimarySite ? (
                        <span
                          className="px-2.5 py-1 text-[10px] font-black uppercase"
                          style={{
                            background: 'var(--clr-warning-lt)',
                            color: 'var(--clr-warning)',
                            borderRadius: 'var(--radius-pill)',
                          }}
                        >
                          ★ Primary
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black"
                        style={{
                          borderRadius: 'var(--radius-pill)',
                          background: site.status === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-danger-lt)',
                          color: site.status === 'Active' ? 'var(--clr-success)' : 'var(--clr-danger)',
                        }}
                      >
                        {site.status === 'Active' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {site.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSite(site)}
                          className="p-2 text-blue-700 hover:bg-blue-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid rgba(37,99,235,0.2)',
                          }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(site)}
                          className="p-2 text-purple-700 hover:bg-purple-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid rgba(108,60,225,0.2)',
                          }}
                          title="Edit Site"
                        >
                          <Edit2 className="w-4 h-4 text-purple-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(site.id!)}
                          className="p-2 text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          style={{
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid rgba(239,68,68,0.2)',
                          }}
                          title="Delete Site"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          <span className="hidden sm:inline">Delete</span>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid rgba(255,255,255,0.8)',
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
                  className="w-9 h-9 flex items-center justify-center font-bold text-white shadow-xs"
                  style={{
                    background: 'var(--grad-primary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-purple-950">
                  {editingSite ? 'Edit Supplier Site' : 'Add Supplier Site'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSite(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-purple-700 hover:bg-purple-200/50 transition-colors cursor-pointer"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMsg && (
                <div
                  className="p-3 text-xs font-black flex items-center gap-2"
                  style={{
                    background: 'var(--clr-danger-lt)',
                    color: 'var(--clr-danger)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Site Code</label>
                  <input
                    type="text"
                    value={formData.siteCode}
                    onChange={(e) => setFormData({ ...formData, siteCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Site Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Central Plant"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">
                    Supplier (Lookup - 1:N) *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-purple-950 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
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
                  <label className="block text-xs font-black text-purple-950 mb-1">Site Type</label>
                  <select
                    value={formData.siteType}
                    onChange={(e) => setFormData({ ...formData, siteType: e.target.value as SiteTypeOption })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-purple-950 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Head Office">Head Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Branch">Branch</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-purple-950 mb-1">Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter site street address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 resize-none transition-all"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="isPrimarySite"
                    checked={formData.isPrimarySite}
                    onChange={(e) => setFormData({ ...formData, isPrimarySite: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-slate-300"
                  />
                  <label htmlFor="isPrimarySite" className="text-xs font-black text-purple-950 cursor-pointer">
                    Is Primary Site (Yes / No)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-black text-purple-950 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOption })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 text-xs font-bold text-purple-950 focus:bg-white focus:outline-none focus:border-purple-500 transition-all"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSite(null);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100/60 transition-all cursor-pointer"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--border-base)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-white text-xs font-black transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                  style={{
                    background: 'var(--grad-primary)',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-btn-primary)',
                  }}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-lg overflow-hidden animate-scale-in"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid rgba(255,255,255,0.8)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: 'var(--clr-primary-lt)',
                borderBottom: '1px solid var(--border-base)',
              }}
            >
              <h3 className="text-base font-black text-purple-950">Supplier Site Overview</h3>
              <button
                onClick={() => setViewingSite(null)}
                className="w-8 h-8 flex items-center justify-center text-purple-700 hover:bg-purple-200/50 transition-colors cursor-pointer"
                style={{ borderRadius: 'var(--radius-pill)' }}
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
                  border: '1px solid rgba(108,60,225,0.15)',
                }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">Site Code</p>
                  <p className="text-sm font-mono font-bold text-purple-950 mt-0.5">{viewingSite.siteCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">Site Type</p>
                  <p className="text-xs font-black text-purple-950 mt-0.5">{viewingSite.siteType}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Site Name</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{viewingSite.siteName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Supplier Master (1:N)</p>
                <span
                  className="inline-block mt-1 px-3 py-1 font-black text-xs"
                  style={{
                    background: 'rgba(244,63,94,0.1)',
                    color: 'var(--clr-accent)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {viewingSite.supplierName || 'Unlinked'}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Full Address</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-relaxed">
                  {viewingSite.address}, {viewingSite.city}, {viewingSite.state}, {viewingSite.country} - {viewingSite.postalCode}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-purple-500" /> Email
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{viewingSite.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-purple-500" /> Phone
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{viewingSite.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Is Primary Site</p>
                  <p className="text-xs font-black text-purple-900 mt-0.5">{viewingSite.isPrimarySite ? 'Yes ★' : 'No'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <span
                    className="inline-block mt-1 px-3 py-1 text-xs font-black"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      background: viewingSite.status === 'Active' ? 'var(--clr-success-lt)' : 'var(--clr-danger-lt)',
                      color: viewingSite.status === 'Active' ? 'var(--clr-success)' : 'var(--clr-danger)',
                    }}
                  >
                    {viewingSite.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-purple-50 text-right" style={{ background: 'var(--surface-base)' }}>
              <button
                onClick={() => setViewingSite(null)}
                className="px-5 py-2.5 text-xs font-black text-purple-800 hover:bg-purple-100 transition-colors cursor-pointer active:scale-95"
                style={{
                  background: 'var(--clr-primary-lt)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-base)',
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
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid rgba(255,255,255,0.8)',
            }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
              style={{
                borderRadius: 'var(--radius-pill)',
                background: 'var(--clr-danger-lt)',
                color: 'var(--clr-danger)',
              }}
            >
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Delete Supplier Site?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Are you sure you want to delete this site location?
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 text-slate-700 text-xs font-black transition-colors cursor-pointer"
                style={{
                  background: 'var(--surface-base)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-base)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 text-white text-xs font-black transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'var(--grad-accent)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-btn-accent)',
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
