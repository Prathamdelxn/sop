'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Save, Database,
  Thermometer, Zap, Timer, Package, Search, Loader2, ChevronDown, ChevronRight,
  Factory, GitBranch,
} from 'lucide-react';

import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { useMasterData } from '@/features/elogbook/hooks/useMasterData';
import { usePlants } from '@/features/elogbook/hooks/usePlants';
import { useLines } from '@/features/elogbook/hooks/useLines';
import { EMPTY_MASTER_DATA_FORM, EMPTY_PLANT_FORM, EMPTY_LINE_FORM } from '@/features/elogbook/utils/constants';

export default function MasterDataPage() {
  const router = useRouter();
  const { userData } = useElogbookPermission('Master Data Management');
  const { masterDataList, loading, refetch, handleCreate, handleUpdate, handleDelete } = useMasterData(userData?.companyId);
  const { plants, refetch: fetchPlants, handleCreate: createPlant, handleUpdate: updatePlant, handleDelete: deletePlant } = usePlants(userData?.companyId);
  const [selectedPlantForLines, setSelectedPlantForLines] = useState('');
  const { lines, refetch: fetchLines, handleCreate: createLine, handleDelete: deleteLine } = useLines(userData?.companyId, selectedPlantForLines || undefined);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState(EMPTY_MASTER_DATA_FORM);

  // Plant & Line management state
  const [showPlantSection, setShowPlantSection] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [plantForm, setPlantForm] = useState(EMPTY_PLANT_FORM);
  const [editingPlantId, setEditingPlantId] = useState(null);
  const [lineForm, setLineForm] = useState(EMPTY_LINE_FORM);
  const [savingPlant, setSavingPlant] = useState(false);
  const [savingLine, setSavingLine] = useState(false);

  useEffect(() => { if (userData?.companyId) { refetch(); fetchPlants(); } }, [userData]);
  useEffect(() => { if (selectedPlantForLines) fetchLines(); }, [selectedPlantForLines, fetchLines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      standardCycleTime: Number(form.standardCycleTime), standardVoltage: Number(form.standardVoltage),
      standardTemperature: Number(form.standardTemperature), maxCurrent: Number(form.maxCurrent),
      surfaceAreaPerBasket: Number(form.surfaceAreaPerBasket), partsPerBasket: Number(form.partsPerBasket),
      basketCount: Number(form.basketCount),
    };
    try {
      const result = editingId ? await handleUpdate(editingId, payload) : await handleCreate(payload);
      if (result.success) { setShowModal(false); setEditingId(null); setForm(EMPTY_MASTER_DATA_FORM); setSelectedCustomer(null); }
      else alert(result.message);
    } catch (err) { console.error('Save error:', err); alert('Error saving record'); }
    setSaving(false);
  };

  const handleAddPart = (customerName) => {
    const existing = masterDataList.find(r => r.customerName === customerName);
    setForm({
      ...EMPTY_MASTER_DATA_FORM,
      customerName,
      country: existing?.country || 'India',
      state: existing?.state || '',
      city: existing?.city || '',
      subCompany: existing?.subCompany || '',
    });
    setSelectedCustomer(customerName);
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setForm({
      customerName: record.customerName || '',
      country: record.country || 'India',
      state: record.state || '',
      city: record.city || '',
      subCompany: record.subCompany || '',
      partName: record.partName || '',
      coatingRequirements: record.coatingRequirements || '',
      standardCycleTime: String(record.standardCycleTime || ''),
      standardVoltage: String(record.standardVoltage || ''),
      standardTemperature: String(record.standardTemperature || ''),
      maxCurrent: String(record.maxCurrent || ''),
      surfaceAreaPerBasket: String(record.surfaceAreaPerBasket || ''),
      partsPerBasket: String(record.partsPerBasket || ''),
      basketCount: String(record.basketCount || '3'),
    });
    setSelectedCustomer(record.customerName); setEditingId(record._id); setShowModal(true);
  };

  const onDelete = async (id) => { if (!confirm('Are you sure you want to delete this part?')) return; await handleDelete(id); };

  const toggleCustomer = (name) => { const n = new Set(expandedCustomers); n.has(name) ? n.delete(name) : n.add(name); setExpandedCustomers(n); };

  const groupedRecords = masterDataList.reduce((acc, r) => {
    if (!acc[r.customerName]) {
      acc[r.customerName] = {
        subCompany: r.subCompany,
        country: r.country,
        state: r.state,
        city: r.city,
        parts: []
      };
    }
    acc[r.customerName].parts.push(r);
    return acc;
  }, {});

  const filteredGrouped = searchQuery
    ? Object.entries(groupedRecords).reduce((acc, [name, data]) => {
      const matching = data.parts.filter(p => p.partName?.toLowerCase().includes(searchQuery.toLowerCase()) || name.toLowerCase().includes(searchQuery.toLowerCase()) || p.subCompany?.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matching.length > 0) acc[name] = { ...data, parts: matching };
      return acc;
    }, {}) : groupedRecords;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/elogbook')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
          <div><h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Master Data</h1><p className="text-sm text-gray-500">Configure parts, standards & capacity</p></div>
        </div>
        <button onClick={() => { setForm(EMPTY_MASTER_DATA_FORM); setEditingId(null); setSelectedCustomer(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 active:scale-95">
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Plant & Line Management Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 cursor-pointer hover:bg-emerald-100/50 transition-colors" onClick={() => setShowPlantSection(!showPlantSection)}>
          <div className="flex items-center gap-3">
            {showPlantSection ? <ChevronDown className="w-5 h-5 text-emerald-600" /> : <ChevronRight className="w-5 h-5 text-emerald-600" />}
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center"><Factory className="w-5 h-5 text-white" /></div>
            <div><h3 className="font-bold text-gray-900">Plants & Production Lines</h3><p className="text-xs text-gray-500">Manage plant locations and production lines</p></div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">{plants.length} Plants</span>
        </div>
        {showPlantSection && (
          <div className="p-4 space-y-4">
            {/* Add Plant Button + Form */}
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => { setPlantForm(EMPTY_PLANT_FORM); setEditingPlantId(null); setShowPlantModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-xs shadow-md hover:shadow-lg transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" /> Add Plant
              </button>
            </div>
            {/* Plants List */}
            {plants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No plants configured yet. Add your first plant to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {plants.map(plant => (
                  <div key={plant._id} className={`border rounded-xl p-3 transition-all ${selectedPlantForLines === plant._id ? 'border-emerald-300 bg-emerald-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => setSelectedPlantForLines(selectedPlantForLines === plant._id ? '' : plant._id)}>
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Factory className="w-4 h-4 text-emerald-600" /></div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">{plant.name}</h4>
                          <p className="text-xs text-gray-400">{plant.code}{plant.city ? ` — ${plant.city}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setPlantForm({ name: plant.name, code: plant.code, address: plant.address || '', city: plant.city || '', state: plant.state || '', country: plant.country || 'India' }); setEditingPlantId(plant._id); setShowPlantModal(true); }} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { if (confirm(`Delete plant "${plant.name}"?`)) await deletePlant(plant._id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    {/* Lines for this plant */}
                    {selectedPlantForLines === plant._id && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Production Lines</span>
                        </div>
                        {lines.length === 0 ? <p className="text-xs text-gray-400 py-1">No lines yet</p> : (
                          <div className="space-y-1 mb-2">
                            {lines.map(line => (
                              <div key={line._id} className="flex items-center justify-between px-2 py-1.5 bg-white rounded-lg border border-gray-50">
                                <span className="text-xs font-medium text-gray-700"><GitBranch className="w-3 h-3 inline mr-1 text-cyan-500" />Line {line.lineNumber}{line.name ? ` — ${line.name}` : ''}</span>
                                <button onClick={async () => { if (confirm(`Delete Line ${line.lineNumber}?`)) await deleteLine(line._id); }} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Quick add line */}
                        <div className="flex gap-2 items-end">
                          <input type="number" min="1" placeholder="Line #" value={lineForm.lineNumber} onChange={e => setLineForm({ ...lineForm, lineNumber: e.target.value })}
                            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                          <input type="text" placeholder="Name (optional)" value={lineForm.name} onChange={e => setLineForm({ ...lineForm, name: e.target.value })}
                            className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                          <button disabled={!lineForm.lineNumber || savingLine} onClick={async () => {
                            setSavingLine(true);
                            const res = await createLine({ plantId: plant._id, lineNumber: Number(lineForm.lineNumber), name: lineForm.name });
                            if (!res.success) alert(res.message);
                            else setLineForm(EMPTY_LINE_FORM);
                            setSavingLine(false);
                          }} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-emerald-600 transition-all">
                            {savingLine ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plant Modal */}
      {showPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPlantModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingPlantId ? 'Edit Plant' : 'Add New Plant'}</h2>
              <button onClick={() => setShowPlantModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault(); setSavingPlant(true);
              const res = editingPlantId ? await updatePlant(editingPlantId, plantForm) : await createPlant(plantForm);
              if (res.success) { setShowPlantModal(false); setPlantForm(EMPTY_PLANT_FORM); setEditingPlantId(null); }
              else alert(res.message);
              setSavingPlant(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Plant Name *</label>
                  <input type="text" required value={plantForm.name} onChange={e => setPlantForm({ ...plantForm, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="e.g., Mumbai Plant" /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Code *</label>
                  <input type="text" required value={plantForm.code} onChange={e => setPlantForm({ ...plantForm, code: e.target.value.toUpperCase() })} maxLength={5} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 uppercase" placeholder="e.g., MUM" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label><input type="text" value={plantForm.city} onChange={e => setPlantForm({ ...plantForm, city: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="Mumbai" /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label><input type="text" value={plantForm.state} onChange={e => setPlantForm({ ...plantForm, state: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="Maharashtra" /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Country</label><input type="text" value={plantForm.country} onChange={e => setPlantForm({ ...plantForm, country: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="India" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label><input type="text" value={plantForm.address} onChange={e => setPlantForm({ ...plantForm, address: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="Full address" /></div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowPlantModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={savingPlant} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 active:scale-95">
                  {savingPlant ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editingPlantId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by customer, part, or sub-company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : Object.keys(filteredGrouped).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Database className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-700 mb-1">No Records Found</h3><p className="text-sm text-gray-400">Add your first master data record to get started.</p></div>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredGrouped).map(([customerName, customerData]) => (
            <div key={customerName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleCustomer(customerName)}>
                <div className="flex items-center gap-3">
                  {expandedCustomers.has(customerName) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <div>
                    <h3 className="font-bold text-gray-900">{customerName}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
                      {customerData.subCompany && <span>{customerData.subCompany}</span>}
                      {(customerData.city || customerData.state || customerData.country) && (
                        <span className="flex items-center gap-1">
                          • {[customerData.city, customerData.state, customerData.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{customerData.parts.length} {customerData.parts.length === 1 ? 'Part' : 'Parts'}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleAddPart(customerName); }} className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Plus className="w-3 h-3 inline mr-1" />Add Part</button>
              </div>
              {expandedCustomers.has(customerName) && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Part Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Description</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Timer className="w-3 h-3" /> Cycle Time</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Voltage</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Max Current</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Thermometer className="w-3 h-3" /> Temp</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Surface Area</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Parts/Basket</div></th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Baskets</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {customerData.parts.map((record) => (
                        <tr key={record._id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-700">{record.partName}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[200px]">{record.coatingRequirements || '-'}</td>
                          <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">{record.standardCycleTime} min</span></td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">{record.standardVoltage}V</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">{record.maxCurrent ? `${record.maxCurrent}A` : '-'}</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">{record.standardTemperature}°C</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">{record.surfaceAreaPerBasket ? `${record.surfaceAreaPerBasket} dm²` : '-'}</td>
                          <td className="px-4 py-3 text-center font-bold text-gray-800">{record.partsPerBasket}</td>
                          <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium text-xs">{record.basketCount}</span></td>
                          <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEdit(record)} className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(record._id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Part' : (selectedCustomer ? `Add Part for ${selectedCustomer}` : 'Add New Customer')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Name *</label>
                  <input type="text" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} disabled={!!selectedCustomer && !editingId}
                    className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 ${(selectedCustomer && !editingId) ? 'bg-gray-50 text-gray-500' : ''}`} placeholder="e.g., Tata Motors" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country *</label>
                  <input type="text" required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., India" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
                  <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Maharashtra" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Pune" />
                </div>
              </div>
              {/* <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sub Company</label>
                <input type="text" value={form.subCompany} onChange={e => setForm({ ...form, subCompany: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Division A" />
              </div> */}
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Part Name *</label>
                <input type="text" required value={form.partName} onChange={e => setForm({ ...form, partName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Door Handle" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea value={form.coatingRequirements} onChange={e => setForm({ ...form, coatingRequirements: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" rows={2} placeholder="Describe coating specs..." /></div>
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Operational Standards</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'Cycle Time (min) *', key: 'standardCycleTime', required: true, step: '0.01', placeholder: '7.45' },
                  { label: 'Voltage (V)', key: 'standardVoltage', placeholder: '150', step: '0.1' },
                  { label: 'Max Current (A)', key: 'maxCurrent', step: '0.1', placeholder: '500' },
                  { label: 'Bath Temp (°C)', key: 'standardTemperature', placeholder: '48', step: '0.1' },
                  ].map(f => (
                    <div key={f.key}><label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                      <input type="number" step={f.step} min="0" required={f.required} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder={f.placeholder} /></div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Capacity & Surface Area</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Surface Area per Part (dm²)</label>
                    <input type="number" step="0.01" min="0" value={form.surfaceAreaPerBasket} onChange={e => setForm({ ...form, surfaceAreaPerBasket: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="25.5" /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Parts per Basket *</label>
                    <input type="number" step="1" min="0" required value={form.partsPerBasket} onChange={e => setForm({ ...form, partsPerBasket: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="400" /></div>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 active:scale-95">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}