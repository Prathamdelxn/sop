'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ClipboardCheck, Loader2, Package, AlertTriangle,
  CheckCircle2, XCircle, RotateCcw, Save, ChevronDown, ChevronUp,
  Search, Eye, Users, Building2, ChevronRight, Info, Plus,
  Play, Square, Timer, Clock, Pause, Zap, Thermometer,
  CheckCircle, AlertCircle, BarChart3, TrendingUp
} from 'lucide-react';
import { migrateLegacyPermissions } from '@/utils/featurePermissions';

// Helper function to format minutes to MM:SS
const formatTimeToMMSS = (minutes) => {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}m ${secs}s`;
};

// Helper function to format seconds to HH:MM:SS
const formatSecondsToHMS = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

// Live timer component
function LiveTimer({ startTime, stoppages, isPaused }) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lostSeconds, setLostSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      let totalLostMs = 0;

      (stoppages || []).forEach(s => {
        if (s.restartTime) {
          totalLostMs += (new Date(s.restartTime) - new Date(s.stopTime));
        } else {
          // Currently stopped
          totalLostMs += (now - new Date(s.stopTime));
        }
      });

      const lostSecs = Math.floor(totalLostMs / 1000);
      const totalElapsedSecs = Math.floor((now - start) / 1000);
      const effectiveSecs = Math.max(0, totalElapsedSecs - lostSecs);

      setLostSeconds(lostSecs);
      setElapsedSeconds(effectiveSecs);
      setElapsed(formatSecondsToHMS(effectiveSecs));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, stoppages]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div className={`font-mono text-2xl font-black ${isPaused ? 'text-amber-600' : 'text-emerald-600'}`}>
          {elapsed}
        </div>
        {lostSeconds > 0 && (
          <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-md">
            -{Math.floor(lostSeconds / 60)}m {lostSeconds % 60}s lost
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400">
        Running: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
        {lostSeconds > 0 && ` • Stopped: ${Math.floor(lostSeconds / 60)}m ${lostSeconds % 60}s`}
      </div>
    </div>
  );
}
const DEFECT_TYPES = [
  { key: 'watermark1', label: 'Watermark 1', color: 'blue' },
  { key: 'watermark2', label: 'Watermark 2', color: 'cyan' },
  { key: 'maskingProblem', label: 'Masking Problem', color: 'amber' },
  { key: 'scratchMark', label: 'Scratch Mark', color: 'red' },
  { key: 'pvcPeelOff', label: 'PVC Peel Off', color: 'purple' },
];

function QCPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directBasketId = searchParams.get('basketId');

  const [userData, setUserData] = useState(null);
  const [pendingBaskets, setPendingBaskets] = useState([]);
  const [qcRecords, setQCRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'rework' | 'completed'
  const [saving, setSaving] = useState(null);
  const [expandedQC, setExpandedQC] = useState(null);
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [activeQCForm, setActiveQCForm] = useState(null); // Track which basket's QC form is open
  const [summary, setSummary] = useState({
    totalBaskets: 0,
    completedBaskets: 0,
    inProgressBaskets: 0,
    stoppedBaskets: 0,
    avgCycleTime: 0,
    totalLostTime: 0
  });
  const [customerSearch, setCustomerSearch] = useState('');

  // QC form state per basket (stores the DELTA being entered)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) {
      const parsedUser = JSON.parse(userdata);
      setUserData(parsedUser);
      
      // Permission Check
      if (parsedUser.role !== 'company-admin' && parsedUser.role !== 'super-manager') {
        const tasks = migrateLegacyPermissions(parsedUser.task || []);
        if (!tasks.includes('Quality Check')) {
          router.replace('/dashboard/elogbook');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (userData?.companyId) {
      const init = async () => {
        setLoading(true);
        const baskets = await fetchPendingBaskets();
        await fetchQCRecords();
        
        // If directBasketId is provided, expand that customer
        if (directBasketId && baskets) {
          const targetBasket = baskets.find(b => b._id === directBasketId);
          if (targetBasket) {
            const customer = targetBasket.masterDataId?.customerName;
            if (customer) setExpandedCustomers(new Set([customer]));
          }
        }
        setLoading(false);
      };
      init();
    }
  }, [userData, directBasketId]);

  useEffect(() => {
    calculateSummary();
  }, [pendingBaskets]);

  const calculateSummary = () => {
    const all = pendingBaskets;
    const completed = all.filter(b => b.status === 'completed' || b.status === 'qc-done' || b.status === 'pending-qc');
    const inProgress = all.filter(b => b.status === 'in-progress');
    const stopped = all.filter(b => b.status === 'stopped');

    const totalCycleTime = completed.reduce((sum, basket) => sum + (basket.actualCycleTime || 0), 0);
    const avgTime = completed.length > 0 ? totalCycleTime / completed.length : 0;

    const totalLost = all.reduce((sum, basket) => sum + (basket.totalLostTime || 0), 0);

    setSummary({
      totalBaskets: all.length,
      completedBaskets: completed.length,
      inProgressBaskets: inProgress.length,
      stoppedBaskets: stopped.length,
      avgCycleTime: avgTime,
      totalLostTime: totalLost
    });
  };

  const fetchPendingBaskets = async () => {
    try {
      const res = await fetch(`/api/elogbook/baskets?companyId=${userData.companyId}&status=pending-qc,in-progress`);
      const data = await res.json();
      if (data.success) {
        setPendingBaskets(data.data);
        return data.data;
      }
    } catch (err) { console.error(err); }
    return null;
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

    // Validation: check if anything entered
    const totalNew = Number(form.goodQuantity || 0) + Object.values(form.defects).reduce((s, v) => s + (Number(v) || 0), 0);
    if (totalNew <= 0) return alert('Please enter at least one Good or Defective part.');

    // Check if exceeding capacity
    const existing = qcRecords.find(r => r.basketId?._id === basketId);
    const checkedSoFar = existing ? (existing.goodQuantity + existing.reworkQuantity) : 0;
    if (checkedSoFar + totalNew > inspectedQty) {
      return alert(`Cannot save: Entering ${totalNew} parts would exceed basket capacity (${inspectedQty}). Only ${inspectedQty - checkedSoFar} parts remaining.`);
    }

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
        await fetchPendingBaskets();
        await fetchQCRecords();
        setFormData(prev => { const copy = { ...prev }; delete copy[basketId]; return copy; });
      } else {
        alert(data.message || 'Failed to save QC data');
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

  const getQCGroupStats = (records) => {
    const groups = {};
    records.forEach(qc => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'stopped': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': case 'pending-qc': case 'qc-done': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in-progress': return 'Running';
      case 'stopped': return 'Stopped';
      case 'pending-qc': return 'Pending QC';
      case 'qc-done': return 'QC Done';
      case 'completed': return 'Completed';
      default: return 'Pending';
    }
  };

  const reworkRecords = qcRecords.filter(qc => qc.reworkStatus === 'pending');
  const completedRecords = qcRecords.filter(qc => qc.reworkStatus !== 'pending');

  const renderQCRecord = (qc) => {
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
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-lg">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          Pending ({pendingBaskets.length})
        </button>
        <button
          onClick={() => setActiveTab('rework')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'rework' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <RotateCcw className="w-4 h-4" />
          Rework ({reworkRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed ({completedRecords.length})
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

      {/* Summary Cards (Mirror Production) */}
      {activeTab === 'pending' && pendingBaskets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-6 h-6 opacity-80" />
              <BarChart3 className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{summary.totalBaskets}</div>
            <div className="text-xs opacity-90 mt-1">Total Pending Baskets</div>
            <div className="text-xs opacity-75 mt-2">
              {summary.inProgressBaskets} currently executing
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{summary.completedBaskets}</div>
            <div className="text-xs opacity-90 mt-1">Ready for QC</div>
            <div className="text-xs opacity-75 mt-2">
              Baskets that have finished execution
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 opacity-80" />
              <Timer className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-xl font-bold">{formatTimeToMMSS(summary.avgCycleTime)}</div>
            <div className="text-xs opacity-90 mt-1">Avg Execution Time</div>
            <div className="text-xs opacity-75 mt-2">
              Average across finished baskets
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-6 h-6 opacity-80" />
              <Timer className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-xl font-bold">{formatTimeToMMSS(summary.totalLostTime)}</div>
            <div className="text-xs opacity-90 mt-1">Total Lost Time</div>
            <div className="text-xs opacity-75 mt-2">
              {summary.stoppedBaskets} stopped baskets
            </div>
          </div>
        </div>
      )}

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

                  {/* Baskets for this customer - Enhanced Execution View */}
                  {expandedCustomers.has(customerName) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                      {group.baskets.map(basket => {
                        const form = getFormForBasket(basket._id);
                        const existingQC = qcRecords.find(r => r.basketId?._id === basket._id);

                        const checkedSoFar = existingQC ? (existingQC.goodQuantity + existingQC.reworkQuantity) : 0;
                        const inspectedQty = basket.masterDataId?.partsPerBasket || 0;
                        const remaining = inspectedQty - checkedSoFar;

                        const incomingGood = Number(form.goodQuantity) || 0;
                        const incomingDefects = Object.values(form.defects).reduce((sum, v) => sum + v, 0);
                        const incomingTotal = incomingGood + incomingDefects;

                        const standard = basket.masterDataId?.standardCycleTime || 0;
                        const isActive = basket.status === 'in-progress' || basket.status === 'stopped';
                        const isOver = basket.actualCycleTime > standard && !isActive;

                        const isFormOpen = activeQCForm === basket._id;

                        return (
                          <div key={basket._id}
                            id={`basket-${basket._id}`}
                            className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col ${directBasketId === basket._id ? 'ring-2 ring-indigo-500 border-transparent shadow-lg scale-[1.01]' :
                              basket.status === 'in-progress' ? 'border-emerald-200 shadow-md shadow-emerald-50' :
                                basket.status === 'stopped' ? 'border-amber-200 shadow-md shadow-amber-50' :
                                  isOver ? 'border-red-200' : 'border-gray-100'
                              }`}
                          >
                            {/* Execution Style Header */}
                            <div className="p-5 border-b border-gray-50">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${basket.status === 'in-progress' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                                    basket.status === 'stopped' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                      'bg-gradient-to-br from-indigo-500 to-blue-500'
                                    }`}>
                                    {basket.basketNumber}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900">Basket {basket.basketNumber}</h3>
                                    <p className="text-xs text-gray-400">{basket.masterDataId?.partName}</p>
                                  </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(basket.status)}`}>
                                  {getStatusLabel(basket.status)}
                                </span>
                              </div>

                              {/* Timer/Cycle Info */}
                              {isActive ? (
                                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                  <div className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Live Cycle Time</div>
                                  <LiveTimer
                                    startTime={basket.startTime}
                                    stoppages={basket.stoppages}
                                    isPaused={basket.status === 'stopped'}
                                  />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Actual</div>
                                    <div className={`text-sm font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                                      {formatTimeToMMSS(basket.actualCycleTime)}
                                    </div>
                                  </div>
                                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Standard</div>
                                    <div className="text-sm font-bold text-blue-600">
                                      {formatTimeToMMSS(standard)}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Timestamps & Operator */}
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Started</span>
                                  <span className="font-medium text-gray-600">
                                    {basket.startTime ? new Date(basket.startTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Operator</span>
                                  <span className="font-medium text-gray-600">{basket.startUser || '—'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Perform QC Action Area */}
                            <div className="flex-1 p-5 flex flex-col">
                              <button
                                onClick={() => setActiveQCForm(isFormOpen ? null : basket._id)}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-sm mb-4 ${isFormOpen
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                                  }`}
                              >
                                {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                                {isFormOpen ? 'Hide Inspection Form' : 'Perform QC'}
                              </button>

                              {/* Inspection Form (Collapsible) */}
                              {isFormOpen && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  {/* Progress Stats */}
                                  {checkedSoFar > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="text-[9px] text-indigo-600 font-bold uppercase mb-0.5">Checked</div>
                                        <div className="text-sm font-bold text-indigo-700">{checkedSoFar}/{inspectedQty}</div>
                                      </div>
                                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="text-[9px] text-emerald-600 font-bold uppercase mb-0.5">Remaining</div>
                                        <div className="text-sm font-bold text-emerald-700">{remaining}</div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Inputs */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Good Qty
                                      </label>
                                      <input type="number" value={form.goodQuantity} placeholder="0"
                                        onChange={e => updateForm(basket._id, 'goodQuantity', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold" />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Defect Qty
                                      </label>
                                      <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-500">
                                        {incomingDefects}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Defect Types Breakdown */}
                                  <div className="grid grid-cols-2 gap-2">
                                    {DEFECT_TYPES.map(defect => (
                                      <div key={defect.key} className="bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-between gap-2">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase truncate">{defect.label}</label>
                                        <input type="number" min="0" value={form.defects[defect.key]}
                                          onChange={e => updateDefect(basket._id, defect.key, e.target.value)}
                                          className="w-12 px-1 py-1 border border-gray-100 bg-gray-50 rounded text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10" />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Submit */}
                                  <button onClick={() => handleSubmitQC(basket)}
                                    disabled={saving === basket._id || incomingTotal === 0}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                    {saving === basket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {checkedSoFar + incomingTotal >= inspectedQty ? 'Finalize QC' : 'Save Progress'}
                                  </button>
                                </div>
                              )}

                              {!isFormOpen && (
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <Info className="w-3 h-3" />
                                    <span>Total parts to inspect: <strong>{inspectedQty}</strong></span>
                                  </div>
                                  {checkedSoFar > 0 && (
                                    <div className="text-indigo-600 font-bold">
                                      {Math.round((checkedSoFar / inspectedQty) * 100)}% Checked
                                    </div>
                                  )}
                                </div>
                              )}
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
      ) : activeTab === 'rework' ? (
        /* Rework Pending Records */
        reworkRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <RotateCcw className="w-12 h-12 text-amber-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Rework Pending</h3>
            <p className="text-sm text-gray-400">Records needing rework will appear here.</p>
          </div>
        ) : (
          (() => {
            const groups = getQCGroupStats(reworkRecords);
            return Object.entries(groups)
              .filter(([customerName]) => filterByCustomer(customerName))
              .map(([customerName, group]) => (
                <div key={customerName} className="mb-6">
                  {/* Customer Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl border border-amber-100 cursor-pointer hover:bg-amber-100/50 transition-colors"
                    onClick={() => toggleCustomer(customerName)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCustomers.has(customerName) ?
                        <ChevronDown className="w-5 h-5 text-amber-600" /> :
                        <ChevronRight className="w-5 h-5 text-amber-600" />
                      }
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{customerName}</h3>
                        <p className="text-xs text-gray-500">{group.records.length} record{group.records.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                      Pending Rework: {group.records.length}
                    </div>
                  </div>
                  {expandedCustomers.has(customerName) && (
                    <div className="space-y-3 mt-4">
                      {group.records.map(qc => renderQCRecord(qc))}
                    </div>
                  )}
                </div>
              ));
          })()
        )
      ) : (
        /* Completed QC Records */
        completedRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Completed Records</h3>
            <p className="text-sm text-gray-400">Fully processed records will appear here.</p>
          </div>
        ) : (
          (() => {
            const groups = getQCGroupStats(completedRecords);
            return Object.entries(groups)
              .filter(([customerName]) => filterByCustomer(customerName))
              .map(([customerName, group]) => (
                <div key={customerName} className="mb-6">
                  {/* Customer Header */}
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
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{customerName}</h3>
                        <p className="text-xs text-gray-500">{group.records.length} record{group.records.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                      Completed: {group.records.length}
                    </div>
                  </div>
                  {expandedCustomers.has(customerName) && (
                    <div className="space-y-3 mt-4">
                      {group.records.map(qc => renderQCRecord(qc))}
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

export default function QCPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <QCPageContent />
    </React.Suspense>
  );
}