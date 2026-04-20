'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Play, Square, RotateCcw, CheckCircle2, Timer,
  Loader2, Package, AlertTriangle, Clock, Pause, ScanBarcode,
  Plus, ChevronDown, Users, X, Zap, Thermometer, Building2, Calendar,
  BarChart3, TrendingUp, CheckCircle, AlertCircle, ClipboardCheck, Save, XCircle
} from 'lucide-react';

const DEFECT_TYPES = [
  { key: 'watermark1', label: 'Watermark 1', color: 'blue' },
  { key: 'watermark2', label: 'Watermark 2', color: 'cyan' },
  { key: 'maskingProblem', label: 'Masking Problem', color: 'amber' },
  { key: 'scratchMark', label: 'Scratch Mark', color: 'red' },
  { key: 'pvcPeelOff', label: 'PVC Peel Off', color: 'purple' },
];

// Helper function to format seconds to MM:SS
const formatTimeToMMSS = (minutes) => {
  const totalSeconds = minutes * 60;
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

export default function ProductionPage() {
  const router = useRouter();
  const barcodeRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [masterDataList, setMasterDataList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedMasterData, setSelectedMasterData] = useState(null);
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const [stoppingBasketId, setStoppingBasketId] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startBasketNumber, setStartBasketNumber] = useState('');
  const [additionalUsers, setAdditionalUsers] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({
    totalBaskets: 0,
    completedBaskets: 0,
    inProgressBaskets: 0,
    stoppedBaskets: 0,
    avgCycleTime: 0,
    totalLostTime: 0
  });

  // QC State
  const [showQCModal, setShowQCModal] = useState(false);
  const [selectedQC, setSelectedQC] = useState(null);
  const [qcFormData, setQCFormData] = useState({
    goodQuantity: '',
    defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
  });

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) setUserData(JSON.parse(userdata));
  }, []);

  useEffect(() => {
    if (userData?.companyId) {
      fetchMasterData();
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.companyId) fetchBaskets();
  }, [userData, selectedMasterData, startDate, endDate]);

  useEffect(() => {
    // Extract unique customers from master data
    const uniqueCustomers = [...new Map(masterDataList.map(md => [md.customerName, {
      customerName: md.customerName,
      subCompany: md.subCompany
    }])).values()];
    setCustomers(uniqueCustomers);

    // Reset selections when master data changes
    if (masterDataList.length > 0 && !selectedCustomer && !selectedPart) {
      // Don't auto-select, let user choose
      setSelectedMasterData(null);
    }
  }, [masterDataList]);

  // Calculate summary statistics whenever baskets change
  useEffect(() => {
    calculateSummary();
  }, [baskets]);

  const fetchMasterData = async () => {
    try {
      const res = await fetch(`/api/elogbook/master-data?companyId=${userData.companyId}`);
      const data = await res.json();
      if (data.success) {
        setMasterDataList(data.data);
      }
    } catch (err) {
      console.error('Fetch master data error:', err);
    }
  };

  const fetchBaskets = async () => {
    if (!userData?.companyId) return;
    setLoading(true);
    try {
      let url = `/api/elogbook/baskets?companyId=${userData.companyId}`;
      if (selectedMasterData) url += `&masterDataId=${selectedMasterData._id}`;
      if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setBaskets(data.data);
    } catch (err) {
      console.error('Fetch baskets error:', err);
    }
    setLoading(false);
  };

  const calculateSummary = () => {
    const completed = baskets.filter(b => b.status === 'completed' || b.status === 'qc-done' || b.status === 'pending-qc');
    const inProgress = baskets.filter(b => b.status === 'in-progress');
    const stopped = baskets.filter(b => b.status === 'stopped');

    const totalCycleTime = completed.reduce((sum, basket) => sum + (basket.actualCycleTime || 0), 0);
    const avgTime = completed.length > 0 ? totalCycleTime / completed.length : 0;

    const totalLost = baskets.reduce((sum, basket) => sum + (basket.totalLostTime || 0), 0);

    setSummary({
      totalBaskets: baskets.length,
      completedBaskets: completed.length,
      inProgressBaskets: inProgress.length,
      stoppedBaskets: stopped.length,
      avgCycleTime: avgTime,
      totalLostTime: totalLost
    });
  };

  // Get parts for selected customer
  const getPartsForCustomer = () => {
    if (!selectedCustomer) return [];
    return masterDataList.filter(md => md.customerName === selectedCustomer);
  };

  // Handle customer selection
  const handleCustomerChange = (customerName) => {
    setSelectedCustomer(customerName);
    setSelectedPart('');
    setSelectedMasterData(null);
  };

  // Handle part selection
  const handlePartChange = (partId) => {
    const part = masterDataList.find(md => md._id === partId);
    setSelectedPart(partId);
    setSelectedMasterData(part);
  };

  // Barcode scan handler
  const handleBarcodeScan = useCallback((e) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const num = parseInt(barcodeInput.replace(/\D/g, '')) || (baskets.length + 1);
      setStartBasketNumber(String(num));
      setBarcodeInput('');
      setShowStartModal(true);
    }
  }, [barcodeInput, baskets.length]);

  const handleStartBasket = async () => {
    if (!selectedMasterData || !startBasketNumber) return;
    setActionLoading('start');
    try {
      const res = await fetch('/api/elogbook/baskets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: userData.companyId,
          masterDataId: selectedMasterData._id,
          basketNumber: Number(startBasketNumber),
          barcode: barcodeInput || `BASKET-${startBasketNumber}`,
          startUser: userData.name || userData.username,
          additionalUsers: additionalUsers ? additionalUsers.split(',').map(u => u.trim()) : [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowStartModal(false);
        setStartBasketNumber('');
        setAdditionalUsers('');
        fetchBaskets();
      }
    } catch (err) {
      console.error('Start basket error:', err);
    }
    setActionLoading(null);
  };

  const handleStopBasket = async () => {
    if (!stoppingBasketId) return;
    setActionLoading(stoppingBasketId);
    try {
      await fetch(`/api/elogbook/baskets/${stoppingBasketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop', reason: stopReason }),
      });
      setShowStopModal(false);
      setStopReason('');
      setStoppingBasketId(null);
      fetchBaskets();
    } catch (err) {
      console.error('Stop error:', err);
    }
    setActionLoading(null);
  };

  const handleRestartBasket = async (basketId) => {
    setActionLoading(basketId);
    try {
      await fetch(`/api/elogbook/baskets/${basketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restart' }),
      });
      fetchBaskets();
    } catch (err) {
      console.error('Restart error:', err);
    }
    setActionLoading(null);
  };

  const handleEndBasket = async (basketId) => {
    if (!confirm('Are you sure you want to end this cycle?')) return;
    setActionLoading(basketId);
    try {
      const response = await fetch(`/api/elogbook/baskets/${basketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', endUser: userData.name || userData.username }),
      });
      const result = await response.json();

      // Show calculation details if available
      if (result.calculation) {
        console.log('Calculation details:', result.calculation);
      }

      fetchBaskets();
    } catch (err) {
      console.error('End error:', err);
    }
    setActionLoading(null);
  };

  const handleOpenQCModal = (basket) => {
    setSelectedQC(basket);
    setQCFormData({
      goodQuantity: basket.masterDataId?.partsPerBasket || '',
      defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
    });
    setShowQCModal(true);
  };

  const handleQCDefectChange = (defectKey, value) => {
    setQCFormData(prev => ({
      ...prev,
      defects: { ...prev.defects, [defectKey]: Number(value) || 0 }
    }));
  };

  const handleSubmitQC = async () => {
    if (!selectedQC || !userData) return;
    const basketId = selectedQC._id;
    const inspectedQty = selectedQC.masterDataId?.partsPerBasket;

    if (!inspectedQty) return alert('Inspected quantity is missing from master data');

    setActionLoading(basketId);
    try {
      const res = await fetch('/api/elogbook/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basketId,
          companyId: userData.companyId,
          inspectorName: userData.name || userData.username,
          inspectedQuantity: Number(inspectedQty),
          goodQuantity: Number(qcFormData.goodQuantity) || 0,
          defects: qcFormData.defects,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowQCModal(false);
        fetchBaskets();
      } else {
        alert(data.message || 'Failed to submit QC');
      }
    } catch (err) {
      console.error('QC Submit error:', err);
      alert('Error submitting QC');
    }
    setActionLoading(null);
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

  const partsForSelectedCustomer = getPartsForCustomer();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/elogbook')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Production Cycle</h1>
            <p className="text-sm text-gray-500">Basket lifecycle tracking with barcode scanning</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {selectedMasterData && baskets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-6 h-6 opacity-80" />
              <BarChart3 className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{summary.totalBaskets}</div>
            <div className="text-xs opacity-90 mt-1">Total Baskets</div>
            <div className="text-xs opacity-75 mt-2">
              {summary.completedBaskets} completed
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{summary.completedBaskets}</div>
            <div className="text-xs opacity-90 mt-1">Completed Baskets</div>
            <div className="text-xs opacity-75 mt-2">
              {summary.totalBaskets > 0 ? Math.round((summary.completedBaskets / summary.totalBaskets) * 100) : 0}% completion rate
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 opacity-80" />
              <Timer className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-xl font-bold">{formatTimeToMMSS(summary.avgCycleTime)}</div>
            <div className="text-xs opacity-90 mt-1">Avg Cycle Time</div>
            <div className="text-xs opacity-75 mt-2">
              {selectedMasterData?.standardCycleTime && summary.avgCycleTime > selectedMasterData.standardCycleTime ? (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> +{formatTimeToMMSS(summary.avgCycleTime - selectedMasterData.standardCycleTime)} vs standard
                </span>
              ) : selectedMasterData?.standardCycleTime ? (
                <span>-{formatTimeToMMSS(selectedMasterData.standardCycleTime - summary.avgCycleTime)} vs standard</span>
              ) : null}
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

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Company and Part Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Select Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                <option value="">-- Select Customer --</option>
                {customers.map(customer => (
                  <option key={customer.customerName} value={customer.customerName}>
                    {customer.customerName} {customer.subCompany ? `(${customer.subCompany})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Part Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-3.5 h-3.5" /> Select Part
              </label>
              <select
                value={selectedPart}
                onChange={(e) => handlePartChange(e.target.value)}
                disabled={!selectedCustomer}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Part --</option>
                {partsForSelectedCustomer.map(part => (
                  <option key={part._id} value={part._id}>
                    {part.partName} ({part.standardCycleTime}min, {part.partsPerBasket} parts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Barcode and Start Button Row */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Barcode Scan Input */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Barcode Scan</label>
              <div className="relative">
                <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={barcodeRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeScan}
                  placeholder="Scan barcode or type basket number + Enter"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Manual Start */}
            <div>
              <button
                onClick={() => {
                  if (!selectedMasterData) {
                    alert('Please select a customer and part first');
                    return;
                  }
                  setStartBasketNumber(String(baskets.length + 1));
                  setShowStartModal(true);
                }}
                disabled={!selectedMasterData}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Start Basket
              </button>
            </div>
          </div>
        </div>

        {/* Active Config Stats */}
        {selectedMasterData && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg text-xs font-medium text-indigo-700">
              <Building2 className="w-3.5 h-3.5" /> {selectedMasterData.customerName}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg text-xs font-medium text-indigo-700">
              <Package className="w-3.5 h-3.5" /> {selectedMasterData.partName}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-700">
              <Timer className="w-3.5 h-3.5" /> Standard: {selectedMasterData.standardCycleTime} min
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-xs font-medium text-amber-700">
              <Zap className="w-3.5 h-3.5" /> {selectedMasterData.standardVoltage}V
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-medium text-red-600">
              <Thermometer className="w-3.5 h-3.5" /> {selectedMasterData.standardTemperature}°C
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg text-xs font-medium text-purple-700">
              <Package className="w-3.5 h-3.5" /> {selectedMasterData.partsPerBasket} parts/basket
            </div>
          </div>
        )}

        {/* No selection message */}
        {!selectedMasterData && masterDataList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
            ⚠️ Please select a customer and part to start production
          </div>
        )}
      </div>

      {/* Basket Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : baskets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No Baskets Found</h3>
          <p className="text-sm text-gray-400">
            No baskets found from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}.
            Select a customer and part, then scan a barcode or click "Start Basket" to begin a new cycle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {baskets.map((basket) => {
            const standard = basket.masterDataId?.standardCycleTime || 0;
            const isOver = basket.actualCycleTime > standard && basket.status !== 'in-progress' && basket.status !== 'stopped';
            const isActive = basket.status === 'in-progress' || basket.status === 'stopped';

            return (
              <div key={basket._id}
                className={`bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${basket.status === 'in-progress' ? 'border-emerald-200 shadow-md shadow-emerald-50' :
                  basket.status === 'stopped' ? 'border-amber-200 shadow-md shadow-amber-50' :
                    isOver ? 'border-red-200' : 'border-gray-100'
                  }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${basket.status === 'in-progress' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                      basket.status === 'stopped' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                        'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                      {basket.basketNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Basket {basket.basketNumber}</h3>
                      <p className="text-xs text-gray-400">{basket.masterDataId?.customerName} - {basket.masterDataId?.partName}</p>
                    </div>
                  </div>
                  {basket.status === 'pending-qc' ? (
                    <button
                      onClick={() => handleOpenQCModal(basket)}
                      disabled={actionLoading === basket._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95 shadow-sm"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" /> Perform QC
                    </button>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(basket.status)}`}>
                      {getStatusLabel(basket.status)}
                    </span>
                  )}
                </div>

                {/* Timer for active baskets */}
                {isActive && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1 font-medium">Effective Cycle Time</div>
                    <LiveTimer
                      startTime={basket.startTime}
                      stoppages={basket.stoppages}
                      isPaused={basket.status === 'stopped'}
                    />
                  </div>
                )}

                {/* Completed stats with minutes and seconds */}
                {!isActive && basket.actualCycleTime > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500">Actual Time</div>
                        <div className={`text-lg font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                          {formatTimeToMMSS(basket.actualCycleTime)}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ({basket.actualCycleTime.toFixed(2)} min)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Standard</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatTimeToMMSS(standard)}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ({standard.toFixed(2)} min)
                        </div>
                      </div>
                      {basket.totalLostTime > 0 && (
                        <div className="col-span-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Total Lost Time</div>
                            <div className="text-sm font-bold text-red-500">
                              {formatTimeToMMSS(basket.totalLostTime)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {basket.stoppages?.length || 0} stoppage{basket.stoppages?.length !== 1 ? 's' : ''}
                          </div>
                          {/* Detailed stoppages list */}
                          {basket.stoppages?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {basket.stoppages.map((s, idx) => (
                                <div key={idx} className="text-xs text-gray-500 flex justify-between items-center">
                                  <span>• {s.reason || 'No reason'}</span>
                                  <span className="font-medium text-red-500">
                                    {s.lostMinutes ? formatTimeToMMSS(s.lostMinutes) : 'Active'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started</span>
                    <span className="font-medium text-gray-600">
                      {basket.startTime ? new Date(basket.startTime).toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operator</span>
                    <span className="font-medium text-gray-600">{basket.startUser || '—'}</span>
                  </div>
                  {basket.endTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ended</span>
                      <span className="font-medium text-gray-600">{new Date(basket.endTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isActive && (
                  <div className="flex gap-2">
                    {basket.status === 'in-progress' ? (
                      <>
                        <button
                          onClick={() => { setStoppingBasketId(basket._id); setShowStopModal(true); }}
                          disabled={actionLoading === basket._id}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all active:scale-95"
                        >
                          <Pause className="w-3.5 h-3.5" /> Stop
                        </button>
                        <button
                          onClick={() => handleEndBasket(basket._id)}
                          disabled={actionLoading === basket._id}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> End
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestartBasket(basket._id)}
                        disabled={actionLoading === basket._id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-all active:scale-95"
                      >
                        {actionLoading === basket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        Restart
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Start Basket Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStartModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Start New Basket</h2>
              <button onClick={() => setShowStartModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Basket Number *</label>
                <input type="number" value={startBasketNumber} onChange={e => setStartBasketNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Operator</label>
                <input type="text" value={userData?.name || userData?.username || ''} disabled
                  className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Operators (comma-separated)</label>
                <input type="text" value={additionalUsers} onChange={e => setAdditionalUsers(e.target.value)}
                  placeholder="e.g., Ravi, Amit, Priya"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div className="pt-2 p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500 mb-1">Selected Configuration:</div>
                <div className="text-sm font-semibold text-gray-800">{selectedMasterData?.customerName} — {selectedMasterData?.partName}</div>
                <div className="text-xs text-gray-400 mt-2">Start Time: <span className="font-semibold text-gray-600">{new Date().toLocaleString()}</span></div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowStartModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleStartBasket} disabled={actionLoading === 'start'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50">
                {actionLoading === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Start Cycle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Reason Modal */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStopModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Log Stoppage Reason</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason for Stoppage</label>
              <select value={stopReason} onChange={e => setStopReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400">
                <option value="">Select a reason...</option>
                <option value="Temperature drop below 40°C">Temperature drop below 40°C</option>
                <option value="Power failure">Power failure</option>
                <option value="Equipment malfunction">Equipment malfunction</option>
                <option value="Material shortage">Material shortage</option>
                <option value="Quality issue detected">Quality issue detected</option>
                <option value="Operator break">Operator break</option>
                <option value="Other">Other</option>
              </select>
              {stopReason === 'Other' && (
                <input type="text" placeholder="Describe reason..."
                  onChange={e => setStopReason(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400" />
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowStopModal(false); setStopReason(''); }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleStopBasket}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-200 hover:shadow-xl transition-all active:scale-95">
                <Pause className="w-4 h-4" /> Log Stoppage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC Modal */}
      {showQCModal && selectedQC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQCModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Quality Control Inspection</h2>
                  <p className="text-xs text-gray-500">Basket {selectedQC.basketNumber} • {selectedQC.masterDataId?.partName}</p>
                </div>
              </div>
              <button onClick={() => setShowQCModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Stats Card */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Inspected</div>
                  <div className="text-lg font-bold text-blue-600">{selectedQC.masterDataId?.partsPerBasket || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Good</div>
                  <div className="text-lg font-bold text-emerald-600">{qcFormData.goodQuantity || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Rework</div>
                  <div className="text-lg font-bold text-amber-600">
                    {(selectedQC.masterDataId?.partsPerBasket || 0) - (Number(qcFormData.goodQuantity) || 0)}
                  </div>
                </div>
              </div>

              {/* Main Inputs */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Good Quantity</label>
                <input
                  type="number"
                  value={qcFormData.goodQuantity}
                  onChange={(e) => setQCFormData(prev => ({ ...prev, goodQuantity: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  placeholder="Enter number of good parts..."
                />
              </div>

              {/* Defects Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400" /> Defect Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {DEFECT_TYPES.map(defect => (
                    <div key={defect.key}>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">{defect.label}</label>
                      <input
                        type="number"
                        min="0"
                        value={qcFormData.defects[defect.key]}
                        onChange={(e) => handleQCDefectChange(defect.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowQCModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmitQC}
                disabled={actionLoading === selectedQC._id}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {actionLoading === selectedQC._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Submit QC Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}