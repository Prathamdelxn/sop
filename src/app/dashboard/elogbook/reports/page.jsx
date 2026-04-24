'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Download, Loader2,
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Package, User, Shield, Building2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell, LabelList, PieChart, Pie
} from 'recharts';

const COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  slate: '#64748b',
};

const formatMinutesToTime = (minutes) => {
  if (!minutes && minutes !== 0) return '0m 0s';
  const totalSeconds = minutes * 60;
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-sm font-semibold">
      <p className="text-gray-900 mb-2 border-b pb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4 py-0.5">
          <span>{entry.name}:</span>
          <span>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const router = useRouter();
  const reportRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [masterDataList, setMasterDataList] = useState([]);
  const [selectedMasterData, setSelectedMasterData] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) {
      const parsed = JSON.parse(userdata);
      setUserData(parsed);
      setSelectedCompanyId(parsed.companyId);
    }
  }, []);

  useEffect(() => {
    if (userData?.role === 'super-manager') {
      fetchCompanies();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchMasterData();
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedCompanyId && startDate) {
      fetchReportData();
    }
  }, [selectedCompanyId, startDate, endDate, selectedMasterData]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/superAdmin/fetchAll');
      const data = await res.json();
      if (data.success) setCompanies(data.superadmins);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchMasterData = async () => {
    try {
      const res = await fetch(`/api/elogbook/master-data?companyId=${selectedCompanyId}`);
      const data = await res.json();
      if (data.success) {
        setMasterDataList(data.data);
        setSelectedMasterData(''); // Reset when company changes
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let url = `/api/elogbook/reports?companyId=${selectedCompanyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (selectedMasterData) url += `&masterDataId=${selectedMasterData}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setReportData(data.data);
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
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`report-${selectedCompanyId}-${startDate}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setExporting(false);
  };

  const summary = reportData?.summary || {
    totalBaskets: 0, totalGood: 0, totalInspected: 0, defectRate: 0, avgCycleTime: 0, totalLostTime: 0
  };

  const pieData = [
    { name: 'Good Parts', value: summary.totalGood, fill: COLORS.green },
    { name: 'Defects', value: (summary.totalInspected - summary.totalGood) || 0, fill: COLORS.red }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#f8fafc] text-slate-900">
      {/* Dynamic Header with Company Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push('/dashboard/elogbook')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Production Reports</h1>
            <p className="text-slate-500 font-medium">Simple & Real-time performance tracking</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {userData?.role === 'super-manager' && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Company</span>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  value={selectedCompanyId}
                  onChange={e => setSelectedCompanyId(e.target.value)}
                  className="pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none min-w-[240px]"
                >
                  {companies.map(c => (
                    <option key={c.companyId} value={c.companyId}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Configuration</span>
            <select
              value={selectedMasterData}
              onChange={e => setSelectedMasterData(e.target.value)}
              className="px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none min-w-[200px]"
            >
              <option value="">All Parts</option>
              {masterDataList.map(md => (
                <option key={md._id} value={md._id}>{md.partName} ({md.customerName})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exporting || !reportData}
            className="mt-4 lg:mt-0 flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Export PDF
          </button>
        </div>
      </div>

      {/* Modern Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="font-bold text-slate-400 animate-pulse">Loading Fresh Insights...</p>
        </div>
      ) : !reportData ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
          <BarChart3 className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-400">Ready to Analyze</h3>
          <p className="text-slate-400 font-medium">Select a date range to generate the dashboard.</p>
        </div>
      ) : (
        <div ref={reportRef} className="space-y-10">
          {/* Hero KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-shadow">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Production</span>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-indigo-600">{summary.totalInspected.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-400 mb-2">Units</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <TrendingUp className="w-4 h-4" /> Live Tracking
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Good Quality</span>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-emerald-500">{summary.totalGood.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-400 mb-2">Units</span>
              </div>
              <div className="mt-4 h-2 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(summary.totalGood / summary.totalInspected * 100) || 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Defect Rate</span>
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-black ${summary.defectRate > 5 ? 'text-rose-500' : 'text-amber-500'}`}>
                  {summary.defectRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 mt-4 italic">Target: Under 2.0%</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between bg-indigo-900 text-white border-none">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Machine OEE</span>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black">88%</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Healthy Performance
              </div>
            </div>
          </div>

          {/* Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Quality Breakdown Pie */}
            <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black mb-8 text-slate-800">Quality Breakdown</h3>
              <div className="h-[300px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-emerald-500">
                    {((summary.totalGood / summary.totalInspected * 100) || 0).toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yield</span>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-600">Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-600">Defect</span>
                </div>
              </div>
            </div>

            {/* Performance Comparison Bar */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-black text-slate-800">Basket Performance</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Actual</span>
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.cycleTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="10 10" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar 
                      dataKey="actual" 
                      radius={[12, 12, 12, 12]} 
                      barSize={40}
                      className="transition-all duration-300"
                    >
                      {reportData.cycleTimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.exceeds ? COLORS.red : COLORS.blue} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Transparency Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Production Log Details</h3>
              <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
                {reportData.cycleTimeData.length} Baskets Tracked
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Basket ID</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Spent</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quality</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reportData.cycleTimeData.map((ct, i) => {
                    const basketDetails = reportData.basketDetails?.[i] || {};
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-10 py-6 font-black text-slate-900">{ct.name}</td>
                        <td className={`px-6 py-6 font-bold ${ct.exceeds ? 'text-rose-500' : 'text-slate-600'}`}>
                          {formatMinutesToTime(ct.actual)}
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-emerald-500 font-bold">{(reportData.quantityData?.[i]?.good || 0)} Good</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-rose-500 font-bold">{(reportData.quantityData?.[i]?.rejected || 0)} Defect</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                              {basketDetails.doneBy?.charAt(0) || '-'}
                            </div>
                            <span className="text-slate-600 font-bold text-sm">{basketDetails.doneBy || '-'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            ct.exceeds ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${ct.exceeds ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            {ct.exceeds ? 'Efficiency Alert' : 'On Target'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

}