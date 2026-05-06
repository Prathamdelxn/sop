'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ClipboardCheck, Loader2, RotateCcw, CheckCircle2,
  Search, Building2, ChevronDown, ChevronRight, Factory, GitBranch,
} from 'lucide-react';

import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { useQCRecords } from '@/features/elogbook/hooks/useQCRecords';
import { usePlants } from '@/features/elogbook/hooks/usePlants';
import { useLines } from '@/features/elogbook/hooks/useLines';
import { fetchBaskets } from '@/features/elogbook/services/basketService';
import SummaryCards from '@/features/elogbook/components/SummaryCards';
import QCBasketCard from '@/features/elogbook/components/QCBasketCard';
import QCRecordCard from '@/features/elogbook/components/QCRecordCard';

function QCPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directBasketId = searchParams.get('basketId');

  const { userData } = useElogbookPermission('Quality Check');

  const { plants, refetch: fetchPlants } = usePlants(userData?.companyId);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const { lines, refetch: fetchLines } = useLines(userData?.companyId, selectedPlantId || undefined);
  const [selectedLineId, setSelectedLineId] = useState('');

  const [pendingBaskets, setPendingBaskets] = useState([]);
  const [allBaskets, setAllBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [activeQCForm, setActiveQCForm] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [summary, setSummary] = useState({ totalBaskets: 0, completedBaskets: 0, inProgressBaskets: 0, stoppedBaskets: 0, avgCycleTime: 0, totalLostTime: 0 });

  // Plant-wise isolation
  const isPlantLocked = userData && userData.plantId && userData.role !== 'company-admin' && userData.role !== 'super-manager';

  const {
    qcRecords, reworkRecords, completedRecords, saving,
    refetch: fetchQC, getFormForBasket, updateForm, updateDefect,
    handleSubmitQC, handleReworkUpdate,
  } = useQCRecords(userData?.companyId, selectedPlantId || undefined, selectedLineId || undefined);

  useEffect(() => { if (userData?.companyId) fetchPlants(); }, [userData]);
  useEffect(() => { if (selectedPlantId) fetchLines(); }, [selectedPlantId, fetchLines]);

  // Auto-select locked plant
  useEffect(() => {
    if (isPlantLocked && userData.plantId && !selectedPlantId) {
      setSelectedPlantId(userData.plantId);
    }
  }, [isPlantLocked, userData, selectedPlantId]);

  useEffect(() => {
    if (!userData?.companyId) return;
    const init = async () => {
      setLoading(true);
      const params = { companyId: userData.companyId, status: 'pending-qc,in-progress,qc-done' };
      if (selectedPlantId) params.plantId = selectedPlantId;
      if (selectedLineId) params.lineId = selectedLineId;
      
      const bData = await fetchBaskets(params);
      if (bData.success) {
        setAllBaskets(bData.data);
        setPendingBaskets(bData.data.filter(b => b.status !== 'qc-done'));
        if (directBasketId) {
          const target = bData.data.find(b => b._id === directBasketId);
          if (target?.masterDataId?.customerName) setExpandedCustomers(new Set([target.masterDataId.customerName]));
        }
      }
      await fetchQC();
      setLoading(false);
    };
    init();
  }, [userData, directBasketId, selectedPlantId, selectedLineId]);

  useEffect(() => {
    const all = pendingBaskets;
    const completed = all.filter(b => ['completed', 'qc-done', 'pending-qc'].includes(b.status));
    const inProgress = all.filter(b => b.status === 'in-progress');
    const stopped = all.filter(b => b.status === 'stopped');
    const totalCycleTime = completed.reduce((s, b) => s + (b.actualCycleTime || 0), 0);
    setSummary({
      totalBaskets: all.length, completedBaskets: completed.length,
      inProgressBaskets: inProgress.length, stoppedBaskets: stopped.length,
      avgCycleTime: completed.length > 0 ? totalCycleTime / completed.length : 0,
      totalLostTime: all.reduce((s, b) => s + (b.totalLostTime || 0), 0),
    });
  }, [pendingBaskets]);

  const onSubmitQC = async (basket) => {
    const success = await handleSubmitQC(basket, userData?.name || userData?.username);
    if (success) {
      const params = { companyId: userData.companyId, status: 'pending-qc,in-progress,qc-done' };
      if (selectedPlantId) params.plantId = selectedPlantId;
      if (selectedLineId) params.lineId = selectedLineId;
      const bData = await fetchBaskets(params);
      if (bData.success) {
        setAllBaskets(bData.data);
        setPendingBaskets(bData.data.filter(b => b.status !== 'qc-done'));
      }
      await fetchQC();
    }
  };

  const onReworkUpdate = async (qcId, passed, rejected) => {
    await handleReworkUpdate(qcId, passed, rejected);
  };

  const toggleCustomer = (name) => {
    const n = new Set(expandedCustomers);
    n.has(name) ? n.delete(name) : n.add(name);
    setExpandedCustomers(n);
  };

  const filterByCustomer = (name) => !customerSearch || name.toLowerCase().includes(customerSearch.toLowerCase());

  // Group baskets by customer
  const getCustomerStats = (baskets) => {
    const stats = {};
    baskets.forEach(b => {
      const c = b.masterDataId?.customerName || 'Unknown';
      if (!stats[c]) stats[c] = { baskets: [], totalParts: 0 };
      stats[c].baskets.push(b);
      stats[c].totalParts += b.masterDataId?.partsPerBasket || 0;
    });
    return stats;
  };

  const getQCGroupStats = (records) => {
    const groups = {};
    records.forEach(qc => {
      const c = qc.basketId?.masterDataId?.customerName || 'Unknown';
      if (!groups[c]) groups[c] = { records: [] };
      groups[c].records.push(qc);
    });
    return groups;
  };

  const renderCustomerHeader = (name, count, variant) => {
    const colors = { pending: { bg: 'from-indigo-50 to-purple-50', border: 'border-indigo-100', icon: 'from-indigo-500 to-purple-500', chevron: 'text-indigo-600', badge: 'bg-amber-100 text-amber-700' },
      rework: { bg: 'from-amber-50 to-orange-50', border: 'border-amber-100', icon: 'from-amber-500 to-orange-500', chevron: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
      completed: { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', icon: 'from-emerald-500 to-teal-500', chevron: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    }[variant];
    const Icon = variant === 'rework' ? RotateCcw : variant === 'completed' ? CheckCircle2 : Building2;
    const label = variant === 'rework' ? 'Pending Rework' : variant === 'completed' ? 'Completed' : 'Pending';

    return (
      <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${colors.bg} rounded-t-2xl border ${colors.border} cursor-pointer hover:opacity-90 transition-colors`}
        onClick={() => toggleCustomer(name)}>
        <div className="flex items-center gap-3">
          {expandedCustomers.has(name) ? <ChevronDown className={`w-5 h-5 ${colors.chevron}`} /> : <ChevronRight className={`w-5 h-5 ${colors.chevron}`} />}
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
            <p className="text-xs text-gray-500">{count} {count !== 1 ? 'records' : 'record'}</p>
          </div>
        </div>
        <div className={`px-3 py-1 ${colors.badge} rounded-lg text-xs font-semibold`}>{label}: {count}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/dashboard/elogbook')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
        <div><h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Quality Control</h1><p className="text-sm text-gray-500">Inspect, record defects & manage rework</p></div>
      </div>

      {/* Hierarchy Selectors */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 ml-1">
              <Factory className="w-3 h-3 text-indigo-500" /> Select Plant
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => { setSelectedPlantId(e.target.value); setSelectedLineId(''); }}
              disabled={isPlantLocked}
              className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all cursor-pointer ${isPlantLocked ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <option value="">All Plants</option>
              {plants.map(p => (<option key={p._id} value={p._id}>{p.name}</option>))}
            </select>
            {isPlantLocked && (
              <p className="text-[10px] text-amber-600 mt-1">🔒 Plant locked to your assigned location</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 ml-1">
              <GitBranch className="w-3 h-3 text-indigo-500" /> Select Production Line
            </label>
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              disabled={!selectedPlantId}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Lines</option>
              {lines.map(l => (<option key={l._id} value={l._id}>Line {l.lineNumber}{l.name ? ` — ${l.name}` : ''}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-lg">
        {[
          { key: 'pending', label: 'Pending', icon: ClipboardCheck, count: pendingBaskets.length, color: 'indigo' },
          { key: 'rework', label: 'Rework', icon: RotateCcw, count: reworkRecords.length, color: 'amber' },
          { key: 'completed', label: 'Completed', icon: CheckCircle2, count: completedRecords.length, color: 'emerald' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? `bg-white text-${tab.color}-700 shadow-sm` : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by customer name..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
      </div>

      {activeTab === 'pending' && pendingBaskets.length > 0 && <SummaryCards summary={summary} variant="qc" />}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : activeTab === 'pending' ? (
        pendingBaskets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-700 mb-1">All Caught Up!</h3><p className="text-sm text-gray-400">No baskets pending quality inspection.</p></div>
        ) : (
          Object.entries(getCustomerStats(pendingBaskets)).filter(([n]) => filterByCustomer(n)).map(([name, group]) => (
            <div key={name} className="mb-6">
              {renderCustomerHeader(name, group.baskets.length, 'pending')}
              {expandedCustomers.has(name) && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {group.baskets.map(basket => {
                    const isLocked = basket.basketNumber > 1 && !allBaskets.some(b => 
                      b.batchId?._id === basket.batchId?._id && 
                      b.basketNumber === basket.basketNumber - 1 && 
                      b.status === 'qc-done'
                    );
                    return (
                      <QCBasketCard key={basket._id} basket={basket} form={getFormForBasket(basket._id)} qcRecords={qcRecords} saving={saving}
                        activeQCForm={activeQCForm} directBasketId={directBasketId} isLocked={isLocked}
                        onToggleForm={(id) => setActiveQCForm(activeQCForm === id ? null : id)}
                        onUpdateForm={updateForm} onUpdateDefect={updateDefect} onSubmitQC={onSubmitQC} />
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )
      ) : activeTab === 'rework' ? (
        reworkRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><RotateCcw className="w-12 h-12 text-amber-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-700 mb-1">No Rework Pending</h3><p className="text-sm text-gray-400">Records needing rework will appear here.</p></div>
        ) : (
          Object.entries(getQCGroupStats(reworkRecords)).filter(([n]) => filterByCustomer(n)).map(([name, group]) => (
            <div key={name} className="mb-6">
              {renderCustomerHeader(name, group.records.length, 'rework')}
              {expandedCustomers.has(name) && <div className="space-y-3 mt-4">{group.records.map(qc => <QCRecordCard key={qc._id} qc={qc} saving={saving} onReworkUpdate={onReworkUpdate} />)}</div>}
            </div>
          ))
        )
      ) : (
        completedRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-700 mb-1">No Completed Records</h3><p className="text-sm text-gray-400">Fully processed records will appear here.</p></div>
        ) : (
          Object.entries(getQCGroupStats(completedRecords)).filter(([n]) => filterByCustomer(n)).map(([name, group]) => (
            <div key={name} className="mb-6">
              {renderCustomerHeader(name, group.records.length, 'completed')}
              {expandedCustomers.has(name) && <div className="space-y-3 mt-4">{group.records.map(qc => <QCRecordCard key={qc._id} qc={qc} saving={saving} onReworkUpdate={onReworkUpdate} />)}</div>}
            </div>
          ))
        )
      )}
    </div>
  );
}

export default function QCPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>}>
      <QCPageContent />
    </React.Suspense>
  );
}