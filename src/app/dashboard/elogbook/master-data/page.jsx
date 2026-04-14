'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Save, Database,
  Thermometer, Zap, Timer, Package, Search, Loader2
} from 'lucide-react';

export default function MasterDataPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);

  const emptyForm = {
    customerName: '', subCompany: '', partName: '',
    coatingRequirements: '', standardCycleTime: '',
    standardVoltage: '', standardTemperature: '',
    partsPerBasket: '', basketCount: '3',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) {
      const data = JSON.parse(userdata);
      setUserData(data);
    }
  }, []);

  useEffect(() => {
    if (userData?.companyId) fetchRecords();
  }, [userData]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elogbook/master-data?companyId=${userData.companyId}`);
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `/api/elogbook/master-data/${editingId}`
        : '/api/elogbook/master-data';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...form,
        companyId: userData.companyId,
        standardCycleTime: Number(form.standardCycleTime),
        standardVoltage: Number(form.standardVoltage),
        standardTemperature: Number(form.standardTemperature),
        partsPerBasket: Number(form.partsPerBasket),
        basketCount: Number(form.basketCount),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchRecords();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  const handleEdit = (record) => {
    setForm({
      customerName: record.customerName || '',
      subCompany: record.subCompany || '',
      partName: record.partName || '',
      coatingRequirements: record.coatingRequirements || '',
      standardCycleTime: String(record.standardCycleTime || ''),
      standardVoltage: String(record.standardVoltage || ''),
      standardTemperature: String(record.standardTemperature || ''),
      partsPerBasket: String(record.partsPerBasket || ''),
      basketCount: String(record.basketCount || '3'),
    });
    setEditingId(record._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/elogbook/master-data/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchRecords();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = records.filter(r =>
    r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.partName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subCompany?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/elogbook')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Master Data</h1>
            <p className="text-sm text-gray-500">Configure parts, standards & capacity</p>
          </div>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Record
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer, part, or sub-company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No Records Found</h3>
          <p className="text-sm text-gray-400">Add your first master data record to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Part</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Timer className="w-3 h-3" /> Cycle Time</div>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Voltage</div>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Thermometer className="w-3 h-3" /> Temp</div>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Parts/Basket</div>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Baskets</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((record) => (
                  <tr key={record._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{record.customerName}</div>
                      {record.subCompany && <div className="text-xs text-gray-400">{record.subCompany}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-700">{record.partName}</div>
                      {record.coatingRequirements && <div className="text-xs text-gray-400 truncate max-w-[150px]">{record.coatingRequirements}</div>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                        {record.standardCycleTime} min
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-700 font-medium">{record.standardVoltage}V</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-700 font-medium">{record.standardTemperature}°C</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-gray-800">{record.partsPerBasket}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium text-xs">{record.basketCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          id={`edit-master-${record._id}`}
                          onClick={() => handleEdit(record)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-master-${record._id}`}
                          onClick={() => handleDelete(record._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
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
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Name *</label>
                  <input type="text" required value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Tata Motors" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sub Company</label>
                  <input type="text" value={form.subCompany} onChange={e => setForm({...form, subCompany: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Division A" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Part Name *</label>
                <input type="text" required value={form.partName} onChange={e => setForm({...form, partName: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Door Handle" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coating Requirements</label>
                <textarea value={form.coatingRequirements} onChange={e => setForm({...form, coatingRequirements: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" rows={2} placeholder="Describe coating specs..." />
              </div>

              {/* Standards */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Operational Standards</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cycle Time (min) *</label>
                    <input type="number" step="0.01" required value={form.standardCycleTime} onChange={e => setForm({...form, standardCycleTime: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="7.45" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Voltage (V)</label>
                    <input type="number" value={form.standardVoltage} onChange={e => setForm({...form, standardVoltage: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="150" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Temp (°C)</label>
                    <input type="number" value={form.standardTemperature} onChange={e => setForm({...form, standardTemperature: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="48" />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Capacity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parts per Basket *</label>
                    <input type="number" required value={form.partsPerBasket} onChange={e => setForm({...form, partsPerBasket: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Total Baskets</label>
                    <input type="number" value={form.basketCount} onChange={e => setForm({...form, basketCount: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="3" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 active:scale-95">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
