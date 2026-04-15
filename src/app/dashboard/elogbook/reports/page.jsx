'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Download, Loader2,
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Package
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#6366f1',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

// Helper function to convert minutes to "Xh Xm Xs" format
const formatMinutesToTime = (minutes) => {
  if (!minutes && minutes !== 0) return '0m 0s';
  const totalSeconds = minutes * 60;
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Helper to format seconds for tooltips
const formatSecondsToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {
            entry.dataKey === 'actual' || entry.dataKey === 'standard' || entry.dataKey === 'lost'
              ? formatSecondsToTime(entry.value * 60)
              : typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value
          }
        </p>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const router = useRouter();
  const reportRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [masterDataList, setMasterDataList] = useState([]);
  const [selectedMasterData, setSelectedMasterData] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) setUserData(JSON.parse(userdata));
  }, []);

  useEffect(() => {
    if (userData?.companyId) {
      fetchMasterData();
      // Default to today
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.companyId && startDate) {
      fetchReportData();
    }
  }, [userData, startDate, endDate, selectedMasterData]);

  const fetchMasterData = async () => {
    try {
      const res = await fetch(`/api/elogbook/master-data?companyId=${userData.companyId}`);
      const data = await res.json();
      if (data.success) setMasterDataList(data.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let url = `/api/elogbook/reports?companyId=${userData.companyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (selectedMasterData) url += `&masterDataId=${selectedMasterData}`;

      console.log('Fetching report from URL:', url);

      const res = await fetch(url);
      console.log('Response status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        console.log('Report data received:', data.data);
        setReportData(data.data);
      } else {
        console.error('Error fetching report data:', data.message);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Title
      pdf.setFontSize(18);
      pdf.setTextColor(55, 48, 163);
      pdf.text('ELogBook Report', 14, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      if (startDate) pdf.text(`Date Range: ${startDate} to ${endDate || startDate}`, 14, 28);

      // Content
      if (pdfHeight > pdf.internal.pageSize.getHeight() - 35) {
        let y = 35;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = pdfHeight;
        let remainingHeight = imgHeight;
        let currentY = 0;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(remainingHeight, pageHeight - y);
          pdf.addImage(imgData, 'PNG', 0, y - currentY, pdfWidth, pdfHeight);
          remainingHeight -= sliceHeight;
          currentY += sliceHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            y = 10;
          }
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, pdfHeight);
      }

      pdf.save(`elogbook-report-${startDate || 'all'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setExporting(false);
  };

  const summary = reportData?.summary || {
    totalBaskets: 0,
    totalGood: 0,
    totalInspected: 0,
    defectRate: 0,
    avgCycleTime: 0,
    totalLostTime: 0
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Reports & Dashboard</h1>
            <p className="text-sm text-gray-500">Basket performance analysis & quality metrics</p>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting || !reportData}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Configuration</label>
            <select
              value={selectedMasterData}
              onChange={e => setSelectedMasterData(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option value="">All Configurations</option>
              {masterDataList.map(md => (
                <option key={md._id} value={md._id}>{md.customerName} — {md.partName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : !reportData ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No Data Available</h3>
          <p className="text-sm text-gray-400">Select a date range to view reports.</p>
        </div>
      ) : (
        <div ref={reportRef}>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Package className="w-3.5 h-3.5" /> Total Baskets
              </div>
              <div className="text-2xl font-black text-gray-900">{summary.totalBaskets || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Clock className="w-3.5 h-3.5" /> Avg Cycle Time
              </div>
              <div className="text-2xl font-black text-indigo-600">
                {formatMinutesToTime(summary.avgCycleTime || 0)}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Total Lost Time
              </div>
              <div className="text-2xl font-black text-amber-600">
                {formatMinutesToTime(summary.totalLostTime || 0)}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Total Good Parts
              </div>
              <div className="text-2xl font-black text-emerald-600">{summary.totalGood || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <BarChart3 className="w-3.5 h-3.5" /> Total Inspected
              </div>
              <div className="text-2xl font-black text-blue-600">{summary.totalInspected || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Defect Rate
              </div>
              <div className={`text-2xl font-black ${(summary.defectRate || 0) > 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                {(summary.defectRate || 0).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Graph 1: Cycle Time per Basket */}
          {reportData.cycleTimeData && reportData.cycleTimeData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Basket Cycle Time Comparison</h3>
              <p className="text-xs text-gray-400 mb-4">Actual cycle time for each basket (green = on target, red = over standard)</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.cycleTimeData} barGap={8} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Time', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                    tickFormatter={(value) => formatMinutesToTime(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="actual" name="Actual Time" radius={[6, 6, 0, 0]}>
                    {reportData.cycleTimeData.map((entry, i) => (
                      <Cell key={i} fill={entry.exceeds ? COLORS.red : COLORS.green} />
                    ))}
                  </Bar>
                  {/* <Bar dataKey="standard" name="Standard Time" fill={COLORS.blue} radius={[6, 6, 0, 0]} opacity={0.5} /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graph 2: Parts Distribution per Basket */}
          {reportData.quantityData && reportData.quantityData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Parts Distribution per Basket</h3>
              <p className="text-xs text-gray-400 mb-4">Good vs Defective vs Rejected parts for each basket</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.quantityData} barGap={8} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Quantity', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="good" name="Good Parts" fill={COLORS.green} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="defective" name="Rework" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill={COLORS.red} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graph 3: Defect Type Frequency */}
          {reportData.defectTrendData && reportData.defectTrendData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Defect Type Frequency</h3>
              <p className="text-xs text-gray-400 mb-4">Breakdown of defect types across all baskets</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.defectTrendData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" name="Defect Count" fill={COLORS.purple} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Detailed Data Table */}
          {reportData.cycleTimeData && reportData.cycleTimeData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">Basket Performance Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Basket</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actual Time</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Standard</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lost Time</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Good</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rework</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rejected</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.cycleTimeData.map((ct, i) => {
                      const qty = reportData.quantityData?.[i] || { good: 0, defective: 0, rejected: 0 };
                      return (
                        <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{ct.name}</td>
                          <td className={`px-4 py-3 text-center font-bold ${ct.exceeds ? 'text-red-600' : 'text-emerald-600'}`}>
                            {formatMinutesToTime(ct.actual)}
                          </td>
                          <td className="px-4 py-3 text-center text-blue-600 font-medium">
                            {formatMinutesToTime(ct.standard)}
                          </td>
                          <td className="px-4 py-3 text-center text-amber-600 font-medium">
                            {formatMinutesToTime(ct.lost)}
                          </td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-medium">
                            {qty.good || 0}
                          </td>
                          <td className="px-4 py-3 text-center text-amber-600 font-medium">
                            {qty.defective || 0}
                          </td>
                          <td className="px-4 py-3 text-center text-red-600 font-medium">
                            {qty.rejected || 0}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${ct.exceeds ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {ct.exceeds ? 'Over Target' : 'On Target'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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