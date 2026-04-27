'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, ScanBarcode, Loader2, Package,
  Building2, Timer, Zap, Thermometer, Play, Square,
} from 'lucide-react';

// Feature modules
import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { useBaskets } from '@/features/elogbook/hooks/useBaskets';
import { useBatches } from '@/features/elogbook/hooks/useBatches';
import { useMasterData } from '@/features/elogbook/hooks/useMasterData';

// Feature components
import SummaryCards from '@/features/elogbook/components/SummaryCards';
import BasketCard from '@/features/elogbook/components/BasketCard';
import StartBasketModal from '@/features/elogbook/components/StartBasketModal';
import StopReasonModal from '@/features/elogbook/components/StopReasonModal';

export default function ProductionPage() {
  const router = useRouter();
  const barcodeRef = useRef(null);

  // --- Auth & Permissions ---
  const { userData, hasPermission } = useElogbookPermission('Bucket Execution');
  const canDoQC = hasPermission('Quality Check');

  // --- Master Data ---
  const { masterDataList, customers, refetch: fetchMD } = useMasterData(userData?.companyId);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedMasterData, setSelectedMasterData] = useState(null);

  useEffect(() => {
    if (userData?.companyId) fetchMD();
  }, [userData, fetchMD]);

  // --- Batches ---
  const {
    activeBatch, setActiveBatch, batchActionLoading,
    fetchActiveBatch, handleStartBatch, handleEndBatch,
  } = useBatches({ companyId: userData?.companyId });

  // --- Baskets ---
  const {
    baskets, loading, actionLoading, summary,
    refetch: fetchBaskets,
    handleStartBasket, handleStopBasket, handleRestartBasket, handleEndBasket,
  } = useBaskets({
    companyId: userData?.companyId,
    masterDataId: selectedMasterData,
    batchId: activeBatch,
  });

  // --- Modal State ---
  const [showStartModal, setShowStartModal] = useState(false);
  const [startBasketNumber, setStartBasketNumber] = useState('');
  const [additionalUsers, setAdditionalUsers] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const [stoppingBasketId, setStoppingBasketId] = useState(null);

  // --- Customer / Part Selection ---
  const partsForSelectedCustomer = selectedCustomer
    ? masterDataList.filter((md) => md.customerName === selectedCustomer)
    : [];

  const handleCustomerChange = (customerName) => {
    setSelectedCustomer(customerName);
    setSelectedPart('');
    setSelectedMasterData(null);
  };

  const handlePartChange = (partId) => {
    const part = masterDataList.find((md) => md._id === partId);
    setSelectedPart(partId);
    setSelectedMasterData(part);
    if (part) fetchActiveBatch(partId);
    else setActiveBatch(null);
  };

  // --- Barcode handler ---
  const handleBarcodeScan = useCallback(
    (e) => {
      if (e.key === 'Enter' && barcodeInput.trim()) {
        const num = parseInt(barcodeInput.replace(/\D/g, '')) || baskets.length + 1;
        setStartBasketNumber(String(num));
        setBarcodeInput('');
        setShowStartModal(true);
      }
    },
    [barcodeInput, baskets.length]
  );

  // --- Action handlers (delegate to hooks + close modals) ---
  const onStartBasket = async () => {
    const success = await handleStartBasket({
      startBasketNumber,
      barcode: barcodeInput || `BASKET-${startBasketNumber}`,
      startUser: userData?.name || userData?.username,
      additionalUsers,
    });
    if (success) {
      setShowStartModal(false);
      setStartBasketNumber('');
      setAdditionalUsers('');
    }
  };

  const onStopBasket = async () => {
    await handleStopBasket(stoppingBasketId, stopReason);
    setShowStopModal(false);
    setStopReason('');
    setStoppingBasketId(null);
  };

  const onEndBasket = async (basketId) => {
    if (!confirm('Are you sure you want to end this cycle?')) return;
    await handleEndBasket(basketId, userData?.name || userData?.username);
  };

  const onStartBatch = async () => {
    await handleStartBatch({
      masterDataId: selectedMasterData._id,
      startUser: userData?.name || userData?.username,
    });
  };

  const onEndBatch = async () => {
    if (!confirm('Are you sure you want to end the production batch for this part?')) return;
    const hasActive = baskets.some((b) => b.status === 'in-progress' || b.status === 'stopped');
    const success = await handleEndBatch(userData?.name || userData?.username, hasActive);
    if (success) {
      // baskets will refetch via hook dependency change
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/elogbook')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Production Cycle
            </h1>
            <p className="text-sm text-gray-500">
              Basket lifecycle tracking with barcode scanning
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {selectedMasterData && baskets.length > 0 && (
        <SummaryCards
          summary={summary}
          variant="production"
          selectedMasterData={selectedMasterData}
        />
      )}

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Customer and Part Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {customers.map((customer) => (
                  <option key={customer.customerName} value={customer.customerName}>
                    {customer.customerName}{' '}
                    {customer.subCompany ? `(${customer.subCompany})` : ''}
                  </option>
                ))}
              </select>
            </div>
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
                {partsForSelectedCustomer.map((part) => (
                  <option key={part._id} value={part._id}>
                    {part.partName} ({part.standardCycleTime}min, {part.partsPerBasket} parts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Batch Control */}
          {selectedMasterData && (
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      activeBatch
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Zap className={`w-6 h-6 ${activeBatch ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {activeBatch ? 'Production Batch Active' : 'No Active Batch'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {activeBatch
                        ? `Started: ${new Date(activeBatch.startTime).toLocaleString()}`
                        : 'Start a batch to begin production sequence'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!activeBatch ? (
                    <button
                      onClick={onStartBatch}
                      disabled={batchActionLoading === 'batch'}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {batchActionLoading === 'batch' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Start Production Batch
                    </button>
                  ) : (
                    <button
                      onClick={onEndBatch}
                      disabled={batchActionLoading === 'batch'}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-red-600 border-2 border-red-100 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {batchActionLoading === 'batch' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      End Production Batch
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Barcode and Start Button */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Barcode Scan
              </label>
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
            <div>
              <button
                onClick={() => {
                  if (!activeBatch) {
                    alert('Please start a production batch first');
                    return;
                  }
                  setStartBasketNumber(String(baskets.length + 1));
                  setShowStartModal(true);
                }}
                disabled={!activeBatch}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Start Basket
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

        {!selectedMasterData && masterDataList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
            ⚠️ Please select a customer and part to start production
          </div>
        )}
      </div>

      {/* Basket Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : baskets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No Baskets Found</h3>
          <p className="text-sm text-gray-400">
            {activeBatch
              ? 'No baskets have been started in this batch yet.'
              : 'Select a customer and part, then start a production batch to begin.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {baskets.map((basket) => (
            <BasketCard
              key={basket._id}
              basket={basket}
              actionLoading={actionLoading}
              canDoQC={canDoQC}
              onStop={(id) => {
                setStoppingBasketId(id);
                setShowStopModal(true);
              }}
              onRestart={(id) => handleRestartBasket(id)}
              onEnd={(id) => onEndBasket(id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <StartBasketModal
        show={showStartModal}
        onClose={() => setShowStartModal(false)}
        basketNumber={startBasketNumber}
        setBasketNumber={setStartBasketNumber}
        additionalUsers={additionalUsers}
        setAdditionalUsers={setAdditionalUsers}
        userData={userData}
        selectedMasterData={selectedMasterData}
        onStart={onStartBasket}
        loading={actionLoading === 'start'}
      />

      <StopReasonModal
        show={showStopModal}
        onClose={() => {
          setShowStopModal(false);
          setStopReason('');
        }}
        stopReason={stopReason}
        setStopReason={setStopReason}
        onSubmit={onStopBasket}
      />
    </div>
  );
}