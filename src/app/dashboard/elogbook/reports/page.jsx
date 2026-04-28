'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Download, Loader2, Clock, AlertTriangle, CheckCircle2, TrendingUp, Package, User, Shield, Factory, GitBranch, Hash } from 'lucide-react';

import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { useMasterData } from '@/features/elogbook/hooks/useMasterData';
import { usePlants } from '@/features/elogbook/hooks/usePlants';
import { useLines } from '@/features/elogbook/hooks/useLines';
import * as reportService from '@/features/elogbook/services/reportService';
import { formatMinutesToTime } from '@/features/elogbook/utils/formatters';
import { CHART_COLORS, PIE_COLORS } from '@/features/elogbook/utils/constants';
import { CustomTooltip, CustomPieTooltip, CustomTimeLabel, CustomPieLegend } from '@/features/elogbook/components/reports/chart-components';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from 'recharts';

export default function ReportsPage() {
  const router = useRouter();
  const reportRef = useRef(null);
  const { userData } = useElogbookPermission('Graphical Representation');
  const { masterDataList, customers, refetch: fetchMD } = useMasterData(userData?.companyId);
  const { plants, refetch: fetchPlants } = usePlants(userData?.companyId);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const { lines, refetch: fetchLines } = useLines(userData?.companyId, selectedPlantId || undefined);
  const [selectedLineId, setSelectedLineId] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMasterData, setSelectedMasterData] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [defectPieData, setDefectPieData] = useState([]);

  useEffect(() => { if (userData?.companyId) { fetchMD(); fetchPlants(); const today = new Date().toISOString().split('T')[0]; setStartDate(today); setEndDate(today); } }, [userData]);
  useEffect(() => { if (selectedPlantId) fetchLines(); }, [selectedPlantId, fetchLines]);

  useEffect(() => {
    if (!userData?.companyId || !startDate) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await reportService.fetchReportData({ 
          companyId: userData.companyId, 
          startDate, 
          endDate, 
          masterDataId: selectedMasterData, 
          customerName: selectedCustomer,
          plantId: selectedPlantId, 
          lineId: selectedLineId 
        });
        if (data.success) {
          setReportData(data.data);
          if (data.data.defectTrendData?.length > 0) {
            setDefectPieData(data.data.defectTrendData.map((d, i) => ({
              name: d.name,
              value: d.count,
              buckets: d.buckets || [],
              color: PIE_COLORS[i % PIE_COLORS.length]
            })));
          } else {
            setDefectPieData([{ name: 'Scratch Mark', value: 10, color: '#ef4444' }, { name: 'Masking Problem', value: 7, color: '#f59e0b' }, { name: 'Watermark 2', value: 5, color: '#3b82f6' }, { name: 'PVC Peel Off', value: 1, color: '#8b5cf6' }, { name: 'Watermark 1', value: 1, color: '#10b981' }]);
          }
        }
      } catch (err) { console.error('Error fetching report:', err); }
      finally { setLoading(false); }
    };
    load();
  }, [userData, startDate, endDate, selectedMasterData, selectedCustomer, selectedPlantId, selectedLineId]);

  const batchWiseData = React.useMemo(() => {
    if (!reportData || !reportData.cycleTimeData) return [];
    const batches = {};
    reportData.cycleTimeData.forEach((ct, i) => {
      const qty = reportData.quantityData?.[i] || {};
      const bd = reportData.basketDetails?.[i] || {};
      const batchNum = bd.batchNumber || ct.batchNumber || 'N/A';
      if (!batches[batchNum]) {
        batches[batchNum] = {
          batchNumber: batchNum, plantName: bd.plantName || ct.plantName, lineNumber: bd.lineNumber || ct.lineNumber,
          actual: 0, standard: 0, lost: 0, totalParts: 0, good: 0, defective: 0, rejected: 0,
          doneBy: new Set(), qualityCheckedBy: new Set(), reasons: new Set(), basketCount: 0,
        };
      }
      const b = batches[batchNum];
      b.actual += ct.actual || 0; b.standard += ct.standard || 0; b.lost += ct.lost || 0;
      b.totalParts += bd.totalParts || 0; b.good += qty.good || 0; b.defective += qty.defective || 0; b.rejected += qty.rejected || 0;
      if (bd.doneBy && bd.doneBy !== '-') b.doneBy.add(bd.doneBy);
      if (bd.qualityCheckedBy && bd.qualityCheckedBy !== '-') b.qualityCheckedBy.add(bd.qualityCheckedBy);
      if (ct.stoppages) ct.stoppages.forEach(s => { if (s.reason) b.reasons.add(s.reason); });
      b.basketCount++;
    });
    return Object.values(batches).map(b => ({
      ...b,
      doneBy: b.doneBy.size > 0 ? Array.from(b.doneBy).join(', ') : '-',
      qualityCheckedBy: b.qualityCheckedBy.size > 0 ? Array.from(b.qualityCheckedBy).join(', ') : '-',
      reasons: b.reasons.size > 0 ? Array.from(b.reasons).join(', ') : '-',
      exceeds: b.actual > b.standard
    }));
  }, [reportData]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const jsPDF = (await import('jspdf')).default;
      const element = reportRef.current;
      if (!element) return;
      await new Promise(r => setTimeout(r, 500));
      const selectedMD = masterDataList.find(md => md._id === selectedMasterData);
      const reportTitle = selectedMD 
        ? `${selectedMD.customerName} - ${selectedMD.partName} Report` 
        : selectedCustomer 
          ? `${selectedCustomer} - Company Report`
          : 'ELogBook Overall Report';
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const usableWidth = pdfWidth - (margin * 2);
      pdf.setFontSize(18); pdf.setTextColor(55, 48, 163); pdf.text(reportTitle, margin, 15);
      pdf.setFontSize(10); pdf.setTextColor(107, 114, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 22);
      if (selectedMD) pdf.text(`Part: ${selectedMD.partName}`, margin, 28);
      const selectedPlantObj = plants.find(p => p._id === selectedPlantId);
      const selectedLineObj = lines.find(l => l._id === selectedLineId);
      let infoY = 34;
      if (selectedPlantObj) { pdf.text(`Plant: ${selectedPlantObj.name} (${selectedPlantObj.code})`, margin, infoY); infoY += 6; }
      if (selectedLineObj) { pdf.text(`Line: ${selectedLineObj.lineNumber}${selectedLineObj.name ? ` — ${selectedLineObj.name}` : ''}`, margin, infoY); infoY += 6; }
      if (startDate) { pdf.text(`Date Range: ${startDate} to ${endDate || startDate}`, margin, infoY); infoY += 6; }
      let currentY = infoY + 4;
      const children = Array.from(element.children);
      for (let i = 0; i < children.length; i++) {
        const canvas = await html2canvas(children[i], { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * usableWidth) / canvas.width;
        if (currentY + imgHeight > pdfHeight - margin) { pdf.addPage(); currentY = 14; }
        pdf.addImage(imgData, 'PNG', margin, currentY, usableWidth, imgHeight);
        currentY += imgHeight + 8;
      }
      const filename = selectedMD ? `elogbook-${selectedMD.customerName.replace(/\s+/g, '-').toLowerCase()}-${startDate || 'all'}.pdf` : `elogbook-report-${startDate || 'all'}.pdf`;
      pdf.save(filename);
    } catch (err) { console.error('PDF export error:', err); }
    setExporting(false);
  };

  const summary = reportData?.summary || { totalBaskets: 0, totalGood: 0, totalInspected: 0, defectRate: 0, avgCycleTime: 0, totalLostTime: 0 };
  const totalDefects = defectPieData.reduce((s, i) => s + i.value, 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/elogbook')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
          <div><h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Reports & Dashboard</h1><p className="text-sm text-gray-500">Basket performance analysis & quality metrics</p></div>
        </div>
        <button onClick={handleExportPDF} disabled={exporting || !reportData} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50">
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" /></div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Company
            </label>
            <select 
              value={selectedCustomer} 
              onChange={e => { setSelectedCustomer(e.target.value); setSelectedMasterData(''); }} 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option value="">All Companies</option>
              {customers?.map(c => (<option key={c.customerName} value={c.customerName}>{c.customerName}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> Part / Configuration
            </label>
            <select 
              value={selectedMasterData} 
              onChange={e => setSelectedMasterData(e.target.value)} 
              disabled={!selectedCustomer}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">All {selectedCustomer ? `${selectedCustomer} Parts` : 'Parts'}</option>
              {masterDataList
                .filter(md => !selectedCustomer || md.customerName === selectedCustomer)
                .map(md => (<option key={md._id} value={md._id}>{md.partName}</option>))
              }
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1"><Factory className="w-3.5 h-3.5" /> Plant</label>
            <select value={selectedPlantId} onChange={e => { setSelectedPlantId(e.target.value); setSelectedLineId(''); }} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
              <option value="">All Plants</option>
              {plants.map(p => (<option key={p._id} value={p._id}>{p.name} ({p.code})</option>))}
            </select>
          </div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> Line</label>
            <select value={selectedLineId} onChange={e => setSelectedLineId(e.target.value)} disabled={!selectedPlantId} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-gray-50 disabled:cursor-not-allowed">
              <option value="">All Lines</option>
              {lines.map(l => (<option key={l._id} value={l._id}>Line {l.lineNumber}{l.name ? ` — ${l.name}` : ''}</option>))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : !reportData ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-700 mb-1">No Data Available</h3><p className="text-sm text-gray-400">Select a date range to view reports.</p></div>
      ) : (
        <div ref={reportRef}>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            {[
              { icon: Package, label: 'Total Baskets', value: summary.totalBaskets || 0 },
              { icon: Clock, label: 'Avg Cycle Time', value: formatMinutesToTime(summary.avgCycleTime || 0), color: 'text-indigo-600' },
              { icon: AlertTriangle, label: 'Total Lost Time', value: formatMinutesToTime(summary.totalLostTime || 0), color: 'text-amber-600' },
              { icon: CheckCircle2, label: 'Total Good Parts', value: summary.totalGood || 0, color: 'text-emerald-600' },
              { icon: BarChart3, label: 'Total Inspected', value: summary.totalInspected || 0, color: 'text-blue-600' },
              { icon: TrendingUp, label: 'Defect Rate', value: `${(summary.defectRate || 0).toFixed(1)}%`, color: (summary.defectRate || 0) > 5 ? 'text-red-500' : 'text-emerald-600' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><card.icon className="w-3.5 h-3.5" /> {card.label}</div>
                <div className={`text-2xl font-black ${card.color || 'text-gray-900'}`}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Cycle Time Chart */}
          {reportData.cycleTimeData?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Basket Cycle Time Comparison</h3>
              <p className="text-xs text-gray-400 mb-4">Actual cycle time for each basket (green = on target, red = over standard)</p>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={reportData.cycleTimeData} barGap={8} margin={{ top: 50, right: 30, left: 60, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }} tickFormatter={v => `${v}m`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} content={() => (
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.green }}></div><span className="text-xs text-gray-600">On Target</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.red }}></div><span className="text-xs text-gray-600">Time Exceed</span></div>
                    </div>
                  )} />
                  <Bar dataKey="actual" name="Actual Time" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {reportData.cycleTimeData.map((entry, i) => (<Cell key={i} fill={entry.exceeds ? CHART_COLORS.red : CHART_COLORS.green} />))}
                    <LabelList dataKey="actual" content={CustomTimeLabel} position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Good vs Rejected Chart */}
          {reportData.quantityData?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Good vs Rejected Parts by Basket</h3>
              <p className="text-xs text-gray-400 mb-4">Actual count of good (green) vs rejected (red)</p>
              <div className="overflow-x-auto">
                <div style={{ minWidth: reportData.quantityData.length * 60 }}>
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart data={[...reportData.quantityData].sort((a, b) => b.good - a.good)} margin={{ top: 30, right: 20, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                      <YAxis label={{ value: 'Parts Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={v => v} />
                      <Legend />
                      <Bar dataKey="good" stackId="a" name="Good Parts" fill="#10b981">
                        <LabelList dataKey="good" position="inside" content={(props) => { const { x, y, width, height, value } = props; return (<text x={x + width / 2} y={y + height / 2} fill="#ffffff" textAnchor="middle" fontSize={12} fontWeight="700">{value}</text>); }} />
                      </Bar>
                      <Bar dataKey="rejected" stackId="a" name="Rejected Parts" fill="#ef4444">
                        <LabelList dataKey="rejected" position="top" content={(props) => { const { x, y, width, value } = props; return (<text x={x + width / 2} y={y - 5} fill="#ef4444" textAnchor="middle" fontSize={13} fontWeight="800">{value}</text>); }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">Baskets sorted by Good Parts (high → low). 🟢 Green = Good Parts, 🔴 Red = Rejected Parts</div>
            </div>
          )}

          {/* Defect Pie Chart */}
          {defectPieData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-1">Defect Type Frequency - Pie Chart</h3>
                <p className="text-xs text-gray-400 mb-2">Breakdown of defect types across all baskets</p>
                <p className="text-gray-500 text-sm">Total Defects Identified: <span className="font-semibold text-gray-900">{totalDefects}</span></p>
              </div>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={450}>
                  <PieChart>
                    <Pie data={defectPieData} cx="50%" cy="50%" innerRadius={95} outerRadius={160} dataKey="value" animationDuration={800} animationBegin={200}
                      label={(entry) => `${entry.name}: ${entry.value} (${((entry.value / totalDefects) * 100).toFixed(1)}%)`} labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}>
                      {defectPieData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} stroke="#ffffff" strokeWidth={4} />))}
                    </Pie>
                    <Tooltip content={(props) => <CustomPieTooltip {...props} totalDefects={totalDefects} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CustomPieLegend payload={defectPieData.map(d => ({ value: d.name, color: d.color, payload: d }))} />

              {/* Bucket-wise breakdown grid */}
              <div className="mt-10 pt-8 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Detailed Bucket-wise Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {defectPieData.map((defect, idx) => (
                    <div key={idx} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200/50">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: defect.color }}></div>
                        <span className="font-bold text-gray-800 text-[13px] truncate" title={defect.name}>{defect.name}</span>
                        <span className="ml-auto text-[11px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-50 shadow-sm">{defect.value}</span>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {defect.buckets?.length > 0 ? defect.buckets.map((b, bIdx) => (
                          <div key={bIdx} className="flex justify-between items-center text-[11px] py-1 px-2 bg-white/60 rounded-lg border border-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <span className="text-gray-500 font-medium">Basket {b.basketNumber}</span>
                            <span className="font-bold text-gray-900">{b.count}</span>
                          </div>
                        )) : (
                          <p className="text-[10px] text-gray-400 text-center py-2 italic">No bucket data</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Performance Table */}
          {reportData.cycleTimeData?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-800">Basket Performance Details</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Basket', 'Batch #', 'Plant', 'Line', 'Actual Time', 'Standard', 'Lost Time', 'Total Parts', 'Good', 'Rework', 'Rejected', 'Done By', 'QC By', 'Status'].map(h => (
                      <th key={h} className={`${h === 'Basket' ? 'text-left' : 'text-center'} px-4 py-3 text-xs font-semibold text-gray-500 uppercase`}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.cycleTimeData.map((ct, i) => {
                      const qty = reportData.quantityData?.[i] || { good: 0, defective: 0, rejected: 0 };
                      const bd = reportData.basketDetails?.[i] || {};
                      return (
                        <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{ct.name}</td>
                          <td className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">{bd.batchNumber || '-'}</span></td>
                          <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">{bd.plantName || '-'}</td>
                          <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">{bd.lineNumber ? `Line ${bd.lineNumber}` : '-'}</td>
                          <td className={`px-4 py-3 text-center font-bold ${ct.exceeds ? 'text-red-600' : 'text-emerald-600'}`}>{formatMinutesToTime(ct.actual)}</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-medium">{formatMinutesToTime(ct.standard)}</td>
                          <td className="px-4 py-3 text-center text-amber-600 font-medium">{formatMinutesToTime(ct.lost)}</td>
                          <td className="px-4 py-3 text-center font-bold text-gray-700">{bd.totalParts || 0}</td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-medium">{qty.good || 0}</td>
                          <td className="px-4 py-3 text-center text-amber-600 font-medium">{qty.defective || 0}</td>
                          <td className="px-4 py-3 text-center text-red-600 font-medium">{qty.rejected || 0}</td>
                          <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-1"><User className="w-3 h-3 text-gray-400" /><span className="text-gray-700 text-xs">{bd.doneBy || '-'}</span></div></td>
                          <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-1"><Shield className="w-3 h-3 text-gray-400" /><span className="text-gray-700 text-xs">{bd.qualityCheckedBy || '-'}</span></div></td>
                          <td className="px-4 py-3 text-center"><span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${ct.exceeds ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{ct.exceeds ? 'Over Target' : 'On Target'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Batch-wise Execution Table */}
          {batchWiseData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Batch-wise Execution Details</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Aggregated View</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Batch #', 'Plant', 'Line', 'Total Baskets', 'Total Parts', 'Good', 'Rework', 'Rejected'].map(h => (
                      <th key={h} className={`${h === 'Batch #' ? 'text-left' : 'text-center'} px-4 py-3 text-xs font-semibold text-gray-500 uppercase`}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {batchWiseData.map((b, i) => (
                      <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-4 py-3 text-left"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">{b.batchNumber}</span></td>
                        <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">{b.plantName || '-'}</td>
                        <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">{b.lineNumber ? `Line ${b.lineNumber}` : '-'}</td>
                        <td className="px-4 py-3 text-center font-bold text-indigo-600">{b.basketCount}</td>
                        <td className="px-4 py-3 text-center font-bold text-gray-700">{b.totalParts || 0}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-medium">{b.good || 0}</td>
                        <td className="px-4 py-3 text-center text-amber-600 font-medium">{b.defective || 0}</td>
                        <td className="px-4 py-3 text-center text-red-600 font-medium">{b.rejected || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}