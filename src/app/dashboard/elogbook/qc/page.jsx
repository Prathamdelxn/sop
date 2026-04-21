'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ClipboardCheck, Loader2, Package, AlertTriangle,
  CheckCircle2, XCircle, RotateCcw, Save, ChevronDown, ChevronUp,
  Search, Eye, Users, Building2, ChevronRight
} from 'lucide-react';
const DEFECT_TYPES = [
  { key: 'watermark1', label: 'Watermark 1', color: 'blue' },
  { key: 'watermark2', label: 'Watermark 2', color: 'cyan' },
  { key: 'maskingProblem', label: 'Masking Problem', color: 'amber' },
  { key: 'scratchMark', label: 'Scratch Mark', color: 'red' },
  { key: 'pvcPeelOff', label: 'PVC Peel Off', color: 'purple' },
];

export default function QCPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [pendingBaskets, setPendingBaskets] = useState([]);
  const [qcRecords, setQCRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed'
  const [saving, setSaving] = useState(null);
  const [expandedQC, setExpandedQC] = useState(null);
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [customerSearch, setCustomerSearch] = useState('');

  // QC form state per basket
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) setUserData(JSON.parse(userdata));
  }, []);

  useEffect(() => {
    if (userData?.companyId) {
      fetchPendingBaskets();
      fetchQCRecords();
    }
  }, [userData]);

  const fetchPendingBaskets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elogbook/baskets?companyId=${userData.companyId}&status=pending-qc`);
      const data = await res.json();
      if (data.success) setPendingBaskets(data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchQCRecords = async () => {
    try {
      const res = await fetch(`/api/elogbook/qc?companyId=${userData.companyId}`);
      const data = await res.json();
      if (data.success) setQCRecords(data.data);
    } catch (err) { console.error(err); }
  };

  const getFormForBasket = (basketId) => {
    return formData[basketId] || {
      inspectedQuantity: '',
      goodQuantity: '',
      defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
    };
  };

  const updateForm = (basketId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [basketId]: {
        ...getFormForBasket(basketId),
        [field]: value,
      }
    }));
  };

  const updateDefect = (basketId, defectKey, value) => {
    const current = getFormForBasket(basketId);
    setFormData(prev => ({
      ...prev,
      [basketId]: {
        ...current,
        defects: { ...current.defects, [defectKey]: Number(value) || 0 }
      }
    }));
  };

  const handleSubmitQC = async (basket) => {
    const basketId = basket._id;
    const form = getFormForBasket(basketId);
    const inspectedQty = basket.masterDataId?.partsPerBasket;

    if (!inspectedQty) return alert('Inspected quantity is missing from master data');

    setSaving(basketId);
    try {
      const res = await fetch('/api/elogbook/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basketId,
          companyId: userData.companyId,
          inspectorName: userData.name || userData.username,
          inspectedQuantity: Number(inspectedQty),
          goodQuantity: Number(form.goodQuantity) || 0,
          defects: form.defects,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPendingBaskets();
        fetchQCRecords();
        setFormData(prev => { const copy = { ...prev }; delete copy[basketId]; return copy; });
      }
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const handleReworkUpdate = async (qcId, reworkPassedQty, permanentRej) => {
    setSaving(qcId);
    try {
      const res = await fetch(`/api/elogbook/qc/${qcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reworkPassedQuantity: Number(reworkPassedQty) || 0,
          permanentRejections: Number(permanentRej) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) fetchQCRecords();
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const toggleCustomer = (customerName) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerName)) {
      newExpanded.delete(customerName);
    } else {
      newExpanded.add(customerName);
    }
    setExpandedCustomers(newExpanded);
  };

  const getCustomerStats = (baskets) => {
    const stats = {};
    baskets.forEach(basket => {
      const customer = basket.masterDataId?.customerName || 'Unknown Customer';
      if (!stats[customer]) {
        stats[customer] = {
          baskets: [],
          totalParts: 0,
          customers: new Set()
        };
      }
      stats[customer].baskets.push(basket);
      stats[customer].totalParts += basket.masterDataId?.partsPerBasket || 0;
      if (basket.masterDataId?.subCompany) {
        stats[customer].customers.add(basket.masterDataId.subCompany);
      }
    });
    return stats;
  };

  const getCompletedQCGroups = () => {
    const groups = {};
    qcRecords.forEach(qc => {
      const customer = qc.basketId?.masterDataId?.customerName || 'Unknown Customer';
      if (!groups[customer]) {
        groups[customer] = {
          records: [],
          stats: {
            totalInspected: 0,
            totalGood: 0,
            totalRework: 0,
            totalFinalGood: 0,
            pendingRework: 0,
            completedRework: 0
          }
        };
      }
      groups[customer].records.push(qc);
      groups[customer].stats.totalInspected += qc.inspectedQuantity;
      groups[customer].stats.totalGood += qc.goodQuantity;
      groups[customer].stats.totalRework += qc.reworkQuantity;
      groups[customer].stats.totalFinalGood += qc.finalGoodQuantity;
      if (qc.reworkStatus === 'pending') {
        groups[customer].stats.pendingRework++;
      } else {
        groups[customer].stats.completedRework++;
      }
    });
    return groups;
  };

  // Filter customers based on search
  const filterByCustomer = (customerName) => {
    if (!customerSearch) return true;
    return customerName.toLowerCase().includes(customerSearch.toLowerCase());
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/dashboard/elogbook')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Quality Control</h1>
          <p className="text-sm text-gray-500">Inspect, record defects & manage rework</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          Pending ({pendingBaskets.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'completed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Eye className="w-4 h-4" />
          Completed ({qcRecords.length})
        </button>
      </div>

      {/* Customer Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : activeTab === 'pending' ? (
        /* Pending QC Inspection - Grouped by Customer */
        pendingBaskets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">All Caught Up!</h3>
            <p className="text-sm text-gray-400">No baskets pending quality inspection.</p>
          </div>
        ) : (
          (() => {
            const customerGroups = getCustomerStats(pendingBaskets);
            return Object.entries(customerGroups)
              .filter(([customerName]) => filterByCustomer(customerName))
              .map(([customerName, group]) => (
                <div key={customerName} className="mb-6">
                  {/* Customer Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl border border-indigo-100 cursor-pointer hover:bg-indigo-100/50 transition-colors"
                    onClick={() => toggleCustomer(customerName)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCustomers.has(customerName) ?
                        <ChevronDown className="w-5 h-5 text-indigo-600" /> :
                        <ChevronRight className="w-5 h-5 text-indigo-600" />
                      }
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{customerName}</h3>
                        <p className="text-xs text-gray-500">
                          {group.baskets.length} basket{group.baskets.length !== 1 ? 's' : ''} |
                          {group.totalParts} total parts
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                      Pending: {group.baskets.length}
                    </div>
                  </div>

                  {/* Baskets for this customer */}
                  {expandedCustomers.has(customerName) && (
                    <div className="space-y-4 mt-4">
                      {group.baskets.map(basket => {
                        const form = getFormForBasket(basket._id);
                        const totalDefects = Object.values(form.defects).reduce((sum, v) => sum + v, 0);
                        const inspectedQty = basket.masterDataId?.partsPerBasket || 0;
                        const reworkQty = inspectedQty - (Number(form.goodQuantity) || 0);

                        return (
                          <div key={basket._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Basket info header */}
                            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                                    {basket.basketNumber}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900">Basket {basket.basketNumber}</h3>
                                    <p className="text-xs text-gray-500">
                                      {basket.masterDataId?.partName}
                                      {' | '}Cycle: {basket.actualCycleTime?.toFixed(2)}min
                                    </p>
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                                  Pending Inspection
                                </span>
                              </div>
                            </div>

                            {/* QC Form */}
                            <div className="p-6 space-y-5">
                              {/* Quantities */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Inspected Qty *</label>
                                  <input type="number" value={inspectedQty}
                                    readOnly
                                    className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 cursor-not-allowed focus:outline-none" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Good Qty</label>
                                  <input type="number" value={form.goodQuantity}
                                    onChange={e => updateForm(basket._id, 'goodQuantity', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rework Qty</label>
                                  <div className="px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 font-medium text-gray-700">
                                    {reworkQty > 0 ? reworkQty : 0}
                                  </div>
                                </div>
                              </div>

                              {/* Defect Types */}
                              <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                  Defect Types {totalDefects > 0 && <span className="text-red-500 normal-case">({totalDefects} total)</span>}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                  {DEFECT_TYPES.map(defect => (
                                    <div key={defect.key}>
                                      <label className="block text-xs font-medium text-gray-500 mb-1">{defect.label}</label>
                                      <input type="number" min="0" value={form.defects[defect.key]}
                                        onChange={e => updateDefect(basket._id, defect.key, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Submit */}
                              <div className="flex justify-end pt-2">
                                <button onClick={() => handleSubmitQC(basket)}
                                  disabled={saving === basket._id}
                                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50">
                                  {saving === basket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                  Submit Inspection
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ));
          })()
        )
      ) : (
        /* Completed QC Records - Grouped by Customer */
        qcRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No QC Records</h3>
            <p className="text-sm text-gray-400">Completed inspections will appear here.</p>
          </div>
        ) : (
          (() => {
            const completedGroups = getCompletedQCGroups();
            return Object.entries(completedGroups)
              .filter(([customerName]) => filterByCustomer(customerName))
              .map(([customerName, group]) => (
                <div key={customerName} className="mb-6">
                  {/* Customer Header with Stats */}
                  <div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-colors"
                    onClick={() => toggleCustomer(customerName)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCustomers.has(customerName) ?
                        <ChevronDown className="w-5 h-5 text-emerald-600" /> :
                        <ChevronRight className="w-5 h-5 text-emerald-600" />
                      }
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{customerName}</h3>
                        <p className="text-xs text-gray-500">
                          {group.records.length} inspection{group.records.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                        Good: {group.stats.totalGood}
                      </div>
                      {group.stats.pendingRework > 0 && (
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                          Rework: {group.stats.pendingRework}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QC Records for this customer */}
                  {expandedCustomers.has(customerName) && (
                    <div className="space-y-3 mt-4">
                      {group.records.map(qc => {
                        const isExpanded = expandedQC === qc._id;
                        const basketInfo = qc.basketId;
                        const needsRework = qc.reworkStatus === 'pending';

                        return (
                          <div key={qc._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${needsRework ? 'border-amber-200' : 'border-gray-100'
                            }`}>
                            {/* Summary Row */}
                            <button onClick={() => setExpandedQC(isExpanded ? null : qc._id)}
                              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${needsRework ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                  }`}>
                                  {basketInfo?.basketNumber || '?'}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">
                                    Basket {basketInfo?.basketNumber}
                                    {needsRework && <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Rework Pending</span>}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Part: {basketInfo?.masterDataId?.partName} |
                                    Inspector: {qc.inspectorName} |
                                    {new Date(qc.inspectionDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                  <div className="text-sm font-bold text-emerald-600">{qc.finalGoodQuantity} good</div>
                                  <div className="text-xs text-gray-400">of {qc.inspectedQuantity} inspected</div>
                                </div>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                              </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="px-6 pb-6 border-t border-gray-100">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mb-4">
                                  <div className="p-3 bg-blue-50 rounded-xl">
                                    <div className="text-xs text-blue-600 font-medium">Inspected</div>
                                    <div className="text-lg font-bold text-blue-800">{qc.inspectedQuantity}</div>
                                  </div>
                                  <div className="p-3 bg-emerald-50 rounded-xl">
                                    <div className="text-xs text-emerald-600 font-medium">Initial Good</div>
                                    <div className="text-lg font-bold text-emerald-800">{qc.goodQuantity}</div>
                                  </div>
                                  <div className="p-3 bg-amber-50 rounded-xl">
                                    <div className="text-xs text-amber-600 font-medium">Rework</div>
                                    <div className="text-lg font-bold text-amber-800">{qc.reworkQuantity}</div>
                                  </div>
                                  <div className="p-3 bg-purple-50 rounded-xl">
                                    <div className="text-xs text-purple-600 font-medium">Final Good (Invoice)</div>
                                    <div className="text-lg font-bold text-purple-800">{qc.finalGoodQuantity}</div>
                                  </div>
                                </div>

                                {/* Defects breakdown */}
                                <div className="mb-4">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Defects</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {DEFECT_TYPES.map(d => (
                                      <div key={d.key} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
                                        <span className="text-gray-500">{d.label}: </span>
                                        <span className="font-bold text-gray-800">{qc.defects?.[d.key] || 0}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Rework section */}
                                {needsRework && (
                                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                                      <RotateCcw className="w-4 h-4" /> Rework Result
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-amber-700 mb-1">Passed after rework (Max {qc.reworkQuantity})</label>
                                        <input type="number" id={`rework-passed-${qc._id}`} defaultValue={0} min="0" max={qc.reworkQuantity}
                                          onChange={(e) => {
                                            let passed = parseInt(e.target.value) || 0;
                                            if (passed > qc.reworkQuantity) {
                                              passed = qc.reworkQuantity;
                                              e.target.value = passed;
                                            } else if (passed < 0) {
                                              passed = 0;
                                              e.target.value = passed;
                                            }
                                            const rejectedEl = document.getElementById(`rework-rejected-${qc._id}`);
                                            if (rejectedEl) {
                                              rejectedEl.value = qc.reworkQuantity - passed;
                                            }
                                          }}
                                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-amber-700 mb-1">Permanent Rejections</label>
                                        <input type="number" id={`rework-rejected-${qc._id}`} defaultValue={qc.reworkQuantity} readOnly
                                          className="w-full px-3 py-2 border border-amber-200 bg-amber-100/50 rounded-lg text-sm font-bold text-amber-900 cursor-not-allowed focus:outline-none" />
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const passed = parseInt(document.getElementById(`rework-passed-${qc._id}`)?.value) || 0;
                                        const rejected = parseInt(document.getElementById(`rework-rejected-${qc._id}`)?.value) || 0;

                                        if (passed < 0 || rejected < 0) {
                                          alert("Quantities cannot be negative.");
                                          return;
                                        }
                                        if (passed + rejected !== qc.reworkQuantity) {
                                          alert(`Invalid Rework Quantities!\n\nPassed (${passed}) + Rejected (${rejected}) = ${passed + rejected}\nMust equal total rework quantity: ${qc.reworkQuantity}`);
                                          return;
                                        }

                                        handleReworkUpdate(qc._id, passed, rejected);
                                      }}
                                      disabled={saving === qc._id}
                                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-all active:scale-95 disabled:opacity-50">
                                      {saving === qc._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                      Complete Rework
                                    </button>
                                  </div>
                                )}

                                {/* Completed rework result */}
                                {qc.reworkStatus === 'completed' && (
                                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                    <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                      <CheckCircle2 className="w-4 h-4" /> Rework Completed
                                    </h4>
                                    <div className="flex gap-4 text-sm">
                                      <span className="text-emerald-700">Passed: <strong>{qc.reworkPassedQuantity}</strong></span>
                                      <span className="text-red-600">Rejected: <strong>{qc.permanentRejections}</strong></span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ));
          })()
        )
      )}
    </div>
  );
}