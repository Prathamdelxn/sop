// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   ArrowLeft, BarChart3, Download, Loader2,
//   Clock, AlertTriangle, CheckCircle2, TrendingUp, Package, User, Shield, Building2
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//   Legend, ResponsiveContainer, Cell, LabelList, PieChart, Pie
// } from 'recharts';

// const COLORS = {
//   green: '#10b981',
//   red: '#ef4444',
//   blue: '#3b82f6',
//   amber: '#f59e0b',
//   purple: '#8b5cf6',
//   slate: '#64748b',
// };

// const formatMinutesToTime = (minutes) => {
//   if (!minutes && minutes !== 0) return '0m 0s';
//   const totalSeconds = minutes * 60;
//   const hrs = Math.floor(totalSeconds / 3600);
//   const mins = Math.floor((totalSeconds % 3600) / 60);
//   const secs = Math.floor(totalSeconds % 60);
//   if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
//   if (mins > 0) return `${mins}m ${secs}s`;
//   return `${secs}s`;
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-sm font-semibold">
//       <p className="text-gray-900 mb-2 border-b pb-1">{label}</p>
//       {payload.map((entry, i) => (
//         <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4 py-0.5">
//           <span>{entry.name}:</span>
//           <span>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
//         </p>
//       ))}
//     </div>
//   );
// };

// export default function ReportsPage() {
//   const router = useRouter();
//   const reportRef = useRef(null);
//   const [userData, setUserData] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyId, setSelectedCompanyId] = useState('');
//   const [masterDataList, setMasterDataList] = useState([]);
//   const [selectedMasterData, setSelectedMasterData] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   useEffect(() => {
//     const userdata = localStorage.getItem('user');
//     if (userdata) {
//       const parsed = JSON.parse(userdata);
//       setUserData(parsed);
//       setSelectedCompanyId(parsed.companyId);
//     }
//   }, []);

//   useEffect(() => {
//     if (userData?.role === 'super-manager') {
//       fetchCompanies();
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (selectedCompanyId) {
//       fetchMasterData();
//       const today = new Date().toISOString().split('T')[0];
//       setStartDate(today);
//       setEndDate(today);
//     }
//   }, [selectedCompanyId]);

//   useEffect(() => {
//     if (selectedCompanyId && startDate) {
//       fetchReportData();
//     }
//   }, [selectedCompanyId, startDate, endDate, selectedMasterData]);

//   const fetchCompanies = async () => {
//     try {
//       const res = await fetch('/api/superAdmin/fetchAll');
//       const data = await res.json();
//       if (data.success) setCompanies(data.superadmins);
//     } catch (err) {
//       console.error('Error fetching companies:', err);
//     }
//   };

//   const fetchMasterData = async () => {
//     try {
//       const res = await fetch(`/api/elogbook/master-data?companyId=${selectedCompanyId}`);
//       const data = await res.json();
//       if (data.success) {
//         setMasterDataList(data.data);
//         setSelectedMasterData(''); // Reset when company changes
//       }
//     } catch (err) {
//       console.error('Error fetching master data:', err);
//     }
//   };

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       let url = `/api/elogbook/reports?companyId=${selectedCompanyId}`;
//       if (startDate) url += `&startDate=${startDate}`;
//       if (endDate) url += `&endDate=${endDate}`;
//       if (selectedMasterData) url += `&masterDataId=${selectedMasterData}`;
//       const res = await fetch(url);
//       const data = await res.json();
//       if (data.success) setReportData(data.data);
//     } catch (err) {
//       console.error('Error fetching report data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportPDF = async () => {
//     setExporting(true);
//     try {
//       const html2canvas = (await import('html2canvas-pro')).default;
//       const jsPDF = (await import('jspdf')).default;
//       const element = reportRef.current;
//       if (!element) return;
//       const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const imgHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
//       pdf.save(`report-${selectedCompanyId}-${startDate}.pdf`);
//     } catch (err) {
//       console.error('PDF export error:', err);
//     }
//     setExporting(false);
//   };

//   const summary = reportData?.summary || {
//     totalBaskets: 0, totalGood: 0, totalInspected: 0, defectRate: 0, avgCycleTime: 0, totalLostTime: 0
//   };

//   const pieData = [
//     { name: 'Good Parts', value: summary.totalGood, fill: COLORS.green },
//     { name: 'Defects', value: (summary.totalInspected - summary.totalGood) || 0, fill: COLORS.red }
//   ];

//   return (
//     <div className="min-h-screen p-4 sm:p-8 bg-[#f8fafc] text-slate-900">
//       {/* Dynamic Header with Company Switcher */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => router.push('/dashboard/elogbook')}
//             className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
//           >
//             <ArrowLeft className="w-5 h-5 text-slate-600" />
//           </button>
//           <div>
//             <h1 className="text-3xl font-black tracking-tight text-slate-900">Production Reports</h1>
//             <p className="text-slate-500 font-medium">Simple & Real-time performance tracking</p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-4">
//           {userData?.role === 'super-manager' && (
//             <div className="flex flex-col gap-1">
//               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Company</span>
//               <div className="relative group">
//                 <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//                 <select
//                   value={selectedCompanyId}
//                   onChange={e => setSelectedCompanyId(e.target.value)}
//                   className="pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none min-w-[240px]"
//                 >
//                   {companies.map(c => (
//                     <option key={c.companyId} value={c.companyId}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col gap-1">
//             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Configuration</span>
//             <select
//               value={selectedMasterData}
//               onChange={e => setSelectedMasterData(e.target.value)}
//               className="px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none min-w-[200px]"
//             >
//               <option value="">All Parts</option>
//               {masterDataList.map(md => (
//                 <option key={md._id} value={md._id}>{md.partName} ({md.customerName})</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={handleExportPDF}
//             disabled={exporting || !reportData}
//             className="mt-4 lg:mt-0 flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
//           >
//             {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
//             Export PDF
//           </button>
//         </div>
//       </div>

//       {/* Modern Date Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//         <div className="flex flex-col gap-2">
//           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//             <Clock className="w-3 h-3" /> Start Date
//           </label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={e => setStartDate(e.target.value)}
//             className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all"
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//             <Clock className="w-3 h-3" /> End Date
//           </label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={e => setEndDate(e.target.value)}
//             className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-32 gap-4">
//           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
//           <p className="font-bold text-slate-400 animate-pulse">Loading Fresh Insights...</p>
//         </div>
//       ) : !reportData ? (
//         <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
//           <BarChart3 className="w-20 h-20 text-slate-200 mx-auto mb-6" />
//           <h3 className="text-2xl font-black text-slate-400">Ready to Analyze</h3>
//           <p className="text-slate-400 font-medium">Select a date range to generate the dashboard.</p>
//         </div>
//       ) : (
//         <div ref={reportRef} className="space-y-10">
//           {/* Hero KPI Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-shadow">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Production</span>
//               <div className="flex items-end gap-3">
//                 <span className="text-5xl font-black text-indigo-600">{summary.totalInspected.toLocaleString()}</span>
//                 <span className="text-sm font-bold text-slate-400 mb-2">Units</span>
//               </div>
//               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-500 font-bold text-sm">
//                 <TrendingUp className="w-4 h-4" /> Live Tracking
//               </div>
//             </div>

//             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Good Quality</span>
//               <div className="flex items-end gap-3">
//                 <span className="text-5xl font-black text-emerald-500">{summary.totalGood.toLocaleString()}</span>
//                 <span className="text-sm font-bold text-slate-400 mb-2">Units</span>
//               </div>
//               <div className="mt-4 h-2 bg-slate-50 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-emerald-500 rounded-full" 
//                   style={{ width: `${(summary.totalGood / summary.totalInspected * 100) || 0}%` }}
//                 />
//               </div>
//             </div>

//             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Defect Rate</span>
//               <div className="flex items-end gap-3">
//                 <span className={`text-5xl font-black ${summary.defectRate > 5 ? 'text-rose-500' : 'text-amber-500'}`}>
//                   {summary.defectRate.toFixed(1)}%
//                 </span>
//               </div>
//               <p className="text-sm font-bold text-slate-400 mt-4 italic">Target: Under 2.0%</p>
//             </div>

//             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between bg-indigo-900 text-white border-none">
//               <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Machine OEE</span>
//               <div className="flex items-end gap-3">
//                 <span className="text-6xl font-black">88%</span>
//               </div>
//               <div className="mt-4 flex items-center gap-2 text-indigo-300 font-bold text-xs">
//                 <CheckCircle2 className="w-4 h-4" /> Healthy Performance
//               </div>
//             </div>
//           </div>

//           {/* Visualization Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//             {/* Quality Breakdown Pie */}
//             <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
//               <h3 className="text-lg font-black mb-8 text-slate-800">Quality Breakdown</h3>
//               <div className="h-[300px] w-full flex items-center justify-center relative">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       innerRadius={80}
//                       outerRadius={110}
//                       paddingAngle={8}
//                       dataKey="value"
//                       stroke="none"
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                   <span className="text-4xl font-black text-emerald-500">
//                     {((summary.totalGood / summary.totalInspected * 100) || 0).toFixed(0)}%
//                   </span>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yield</span>
//                 </div>
//               </div>
//               <div className="flex justify-center gap-8 mt-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
//                   <span className="text-xs font-bold text-slate-600">Good</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-rose-500" />
//                   <span className="text-xs font-bold text-slate-600">Defect</span>
//                 </div>
//               </div>
//             </div>

//             {/* Performance Comparison Bar */}
//             <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
//               <div className="flex items-center justify-between mb-10">
//                 <h3 className="text-lg font-black text-slate-800">Basket Performance</h3>
//                 <div className="flex gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-sm bg-indigo-500" />
//                     <span className="text-[10px] font-black text-slate-400 uppercase">Actual</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="h-[350px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={reportData.cycleTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//                     <CartesianGrid strokeDasharray="10 10" stroke="#f1f5f9" vertical={false} />
//                     <XAxis 
//                       dataKey="name" 
//                       axisLine={false} 
//                       tickLine={false} 
//                       tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
//                       dy={10}
//                     />
//                     <YAxis 
//                       axisLine={false} 
//                       tickLine={false} 
//                       tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
//                     />
//                     <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
//                     <Bar 
//                       dataKey="actual" 
//                       radius={[12, 12, 12, 12]} 
//                       barSize={40}
//                       className="transition-all duration-300"
//                     >
//                       {reportData.cycleTimeData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.exceeds ? COLORS.red : COLORS.blue} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Data Transparency Table */}
//           <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//             <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
//               <h3 className="text-lg font-black text-slate-800">Production Log Details</h3>
//               <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
//                 {reportData.cycleTimeData.length} Baskets Tracked
//               </span>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-white">
//                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Basket ID</th>
//                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Spent</th>
//                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quality</th>
//                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
//                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {reportData.cycleTimeData.map((ct, i) => {
//                     const basketDetails = reportData.basketDetails?.[i] || {};
//                     return (
//                       <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
//                         <td className="px-10 py-6 font-black text-slate-900">{ct.name}</td>
//                         <td className={`px-6 py-6 font-bold ${ct.exceeds ? 'text-rose-500' : 'text-slate-600'}`}>
//                           {formatMinutesToTime(ct.actual)}
//                         </td>
//                         <td className="px-6 py-6 text-center">
//                           <div className="flex items-center justify-center gap-3">
//                             <span className="text-emerald-500 font-bold">{(reportData.quantityData?.[i]?.good || 0)} Good</span>
//                             <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                             <span className="text-rose-500 font-bold">{(reportData.quantityData?.[i]?.rejected || 0)} Defect</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-6">
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
//                               {basketDetails.doneBy?.charAt(0) || '-'}
//                             </div>
//                             <span className="text-slate-600 font-bold text-sm">{basketDetails.doneBy || '-'}</span>
//                           </div>
//                         </td>
//                         <td className="px-10 py-6 text-right">
//                           <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
//                             ct.exceeds ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
//                           }`}>
//                             <div className={`w-1.5 h-1.5 rounded-full ${ct.exceeds ? 'bg-rose-500' : 'bg-emerald-500'}`} />
//                             {ct.exceeds ? 'Efficiency Alert' : 'On Target'}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BarChart3, Download, Loader2,
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Package, User, Shield, PackageCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell, LabelList, PieChart, Pie, ReferenceLine
} from 'recharts';

const COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#6366f1',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e', '#14b8a6', '#f97316', '#84cc16'];

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
  const rawData = payload[0].payload;
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
      {rawData.totalParts !== undefined && (
        <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between gap-4">
          <span className="font-bold text-gray-500">Total Parts:</span>
          <span className="font-extrabold text-gray-900">{rawData.totalParts}</span>
        </div>
      )}
    </div>
  );
};

// Custom Label Component for Time Values
const CustomTimeLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value && value !== 0) return null;
  const formattedTime = formatMinutesToTime(value);
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#475569"
      textAnchor="middle"
      fontSize={11}
      fontWeight="600"
      className="font-semibold"
    >
      {formattedTime}
    </text>
  );
};

// Custom Label Component for Quantity Values
const CustomQuantityLabel = (props) => {
  const { x, y, width, value, color } = props;
  if (!value && value !== 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill={color || '#475569'}
      textAnchor="middle"
      fontSize={11}
      fontWeight="600"
      className="font-semibold"
    >
      {value}
    </text>
  );
};

// Custom Label for Defect Count
const CustomDefectLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value && value !== 0) return null;
  return (
    <text
      x={x + width + 8}
      y={y + 4}
      fill="#475569"
      textAnchor="start"
      fontSize={11}
      fontWeight="600"
      className="font-semibold"
    >
      {value}
    </text>
  );
};

// Custom Label for Total Capacity (visible directly on chart)
const CustomCapacityLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value && value !== 0) return null;
  return (
    <g>
      <rect
        x={x - 10}
        y={y - 35}
        width={width + 20}
        height={18}
        rx={4}
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth={1}
      />
      <text
        x={x + width / 2}
        y={y - 23}
        fill="#64748b"
        textAnchor="middle"
        fontSize={10}
        fontWeight="700"
        className="font-bold"
      >
        CAP: {value}
      </text>
    </g>
  );
};

export default function ReportsPage() {
  const router = useRouter();
  const reportRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [masterDataList, setMasterDataList] = useState([]);
  const [selectedMasterData, setSelectedMasterData] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedBasket, setSelectedBasket] = useState('all');

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
    if (selectedMasterData && startDate) {
      fetchReportData();
    }
  }, [selectedMasterData, startDate, endDate]);

  const fetchMasterData = async () => {
    if (!userData?.companyId) return;
    try {
      const res = await fetch(`/api/elogbook/master-data?companyId=${userData.companyId}`);
      const data = await res.json();
      if (data.success) {
        setMasterDataList(data.data);
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchReportData = async () => {
    if (!selectedMasterData || !userData?.companyId) return;
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

      const selectedMD = masterDataList.find(md => md._id === selectedMasterData);
      const reportTitle = selectedMD ? `${selectedMD.customerName} - Production Report` : 'ELogBook Performance Report';

      // 1. Prepare for export: Temporarily remove scroll/max-height constraints
      // This ensures the Parts Distribution chart is captured in its entirety
      const scrollableElements = element.querySelectorAll('.overflow-y-auto');
      const originalStyles = [];
      scrollableElements.forEach(el => {
        originalStyles.push({ el, maxHeight: el.style.maxHeight, overflow: el.style.overflow });
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const usableWidth = pdfWidth - (margin * 2);

      // Add Header Metadata to the first page
      pdf.setFontSize(18);
      pdf.setTextColor(55, 48, 163);
      pdf.text(reportTitle, margin, 15);
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 22);
      if (selectedMD) pdf.text(`Configuration: ${selectedMD.customerName} - ${selectedMD.partName}`, margin, 27);
      if (startDate) pdf.text(`Period: ${startDate} to ${endDate || startDate}`, margin, 32);

      let currentY = 38;
      const children = Array.from(element.children);

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        // Wait briefly for layout adjustments
        await new Promise(r => setTimeout(r, 100));

        const canvas = await html2canvas(child, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * usableWidth) / canvas.width;

        // Move to new page if section exceeds remaining space
        if (currentY + imgHeight > pdfHeight - margin) {
          pdf.addPage();
          currentY = 14;
        }

        pdf.addImage(imgData, 'PNG', margin, currentY, usableWidth, imgHeight, undefined, 'FAST');
        currentY += imgHeight + 8; // Gap between sections
      }

      // Restore original styles
      originalStyles.forEach(({ el, maxHeight, overflow }) => {
        el.style.maxHeight = maxHeight;
        el.style.overflow = overflow;
      });

      const filename = selectedMD
        ? `Report_${selectedMD.customerName.replace(/\s+/g, '_')}_${startDate}.pdf`
        : `Production_Report_${startDate}.pdf`;
      
      pdf.save(filename);
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

  const cycleTimeChartData = useMemo(() => {
    if (!reportData?.cycleTimeData) return [];
    return reportData.cycleTimeData.map(item => ({
      ...item,
      base: Math.min(item.actual, item.standard),
      excess: Math.max(0, item.actual - item.standard)
    }));
  }, [reportData]);

  const defectPieData = useMemo(() => {
    if (!reportData) return [];
    if (selectedBasket === 'all') return reportData.defectTrendData || [];
    const basketIndex = reportData.cycleTimeData.findIndex(ct => ct.name === selectedBasket);
    if (basketIndex === -1) return [];
    return reportData.basketDetails?.[basketIndex]?.defects || [];
  }, [reportData, selectedBasket]);

  const partsDistributionData = useMemo(() => {
    if (!reportData?.quantityData) return [];
    // Sort descending by good parts to match the visual pattern in the reference image
    return [...reportData.quantityData].sort((a, b) => (b.good || 0) - (a.good || 0));
  }, [reportData]);

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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Configuration (Customer)</label>
            <select
              value={selectedMasterData}
              onChange={e => setSelectedMasterData(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-bold"
            >
              <option value="">Select Customer / Configuration</option>
              {masterDataList.map(md => (
                <option key={md._id} value={md._id}>{md.customerName} — {md.partName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedMasterData ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Configuration Selected</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">Please select a customer configuration from the dropdown above to view the graphical representation of performance data.</p>
        </div>
      ) : loading ? (
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
          {cycleTimeChartData && cycleTimeChartData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Basket Cycle Time Comparison</h3>
              <p className="text-xs text-gray-400 mb-4">Actual cycle time for each basket vs Standard (dotted line)</p>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={cycleTimeChartData} barGap={0} margin={{ top: 60, right: 30, left: 60, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine 
                    y={cycleTimeChartData[0]?.standard} 
                    stroke="#94a3b8" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                    label={{ 
                      value: `Standard: ${cycleTimeChartData[0]?.standard}m`, 
                      position: 'top', 
                      fill: '#64748b', 
                      fontSize: 10, 
                      fontWeight: 'bold',
                      offset: 10
                    }} 
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    content={() => (
                      <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.green }}></div>
                          <span className="text-xs font-bold text-gray-600">Within Limit</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.red }}></div>
                          <span className="text-xs font-bold text-gray-600">Exceeded</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                          <div className="w-4 h-0 border-t-2 border-dashed border-gray-400"></div>
                          <span className="text-xs font-bold text-gray-600">Standard Line</span>
                        </div>
                      </div>
                    )}
                  />
                  <Bar dataKey="base" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} isAnimationActive={false}>
                    <LabelList dataKey="base" content={(props) => {
                      const { payload } = props;
                      return payload?.excess === 0 ? <CustomTimeLabel {...props} /> : null;
                    }} position="top" />
                  </Bar>
                  <Bar dataKey="excess" stackId="a" fill={COLORS.red} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    <LabelList dataKey="excess" content={(props) => {
                      const { value, x, y, width } = props;
                      if (!value) return null;
                      return (
                        <g>
                          <text x={x + width / 2} y={y - 20} fill={COLORS.red} textAnchor="middle" fontSize={11} fontWeight="bold">
                            +{formatMinutesToTime(value)}
                          </text>
                          <text x={x + width / 2} y={y - 8} fill={COLORS.red} textAnchor="middle" fontSize={9} fontWeight="black" textTransform="uppercase">
                            Excess
                          </text>
                        </g>
                      );
                    }} position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graph 2: Parts Distribution per Basket */}
          {/* Graph 2: Parts Distribution per Basket */}
          {reportData.quantityData && reportData.quantityData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Parts Distribution per Basket</h3>
              <p className="text-xs text-gray-400 mb-6">Performance ranking (Good vs Rejected) for each basket</p>
              <div className="overflow-y-auto max-h-[800px] pr-2">
                <ResponsiveContainer width="100%" height={Math.max(400, partsDistributionData.length * 45)}>
                  <BarChart 
                    layout="vertical" 
                    data={partsDistributionData} 
                    margin={{ top: 5, right: 60, left: 40, bottom: 20 }}
                    barSize={28}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f8fafc" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      content={() => (
                        <div className="flex items-center justify-center gap-8 mt-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Good Parts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Rejected Parts</span>
                          </div>
                        </div>
                      )}
                    />
                    <Bar dataKey="good" name="Good Parts" stackId="a" fill={COLORS.green} isAnimationActive={false}>
                      <LabelList dataKey="good" content={(props) => {
                        const { x, y, width, height, value } = props;
                        if (!value || value < 15) return null;
                        return (
                          <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="900">
                            {value}
                          </text>
                        );
                      }} />
                    </Bar>
                    <Bar dataKey="rejected" name="Rejected Parts" stackId="a" fill={COLORS.red} isAnimationActive={false}>
                      <LabelList dataKey="rejected" content={(props) => {
                        const { x, y, width, height, value } = props;
                        if (!value) return null;
                        return (
                          <text x={x + width + 8} y={y + height / 2} fill={COLORS.red} textAnchor="start" dominantBaseline="middle" fontSize={10} fontWeight="900">
                            {value}
                          </text>
                        );
                      }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Graph 3: Defect Type Frequency */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Defect Type Frequency</h3>
                <p className="text-xs text-gray-400">Breakdown of defect types {selectedBasket === 'all' ? 'across all baskets' : `for ${selectedBasket}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Basket Filter:</span>
                <select
                  value={selectedBasket}
                  onChange={(e) => setSelectedBasket(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Baskets</option>
                  {reportData.cycleTimeData.map((ct, idx) => (
                    <option key={idx} value={ct.name}>{ct.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-[400px] w-full flex items-center justify-center">
              {defectPieData && defectPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={defectPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={true}
                    >
                      {defectPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-xs">
                              <p className="font-bold text-gray-800 mb-1">{payload[0].name}</p>
                              <p className="text-indigo-600 font-bold">Count: {payload[0].value}</p>
                              <p className="text-gray-400 font-medium">
                                Percentage: {((payload[0].value / defectPieData.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100/50 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-black text-emerald-600 uppercase tracking-tight mb-2">0 Defects Detected</h4>
                  <p className="text-sm font-bold text-gray-400 max-w-[200px] text-center leading-relaxed">
                    All parts in this selection meet 100% quality standards.
                  </p>
                </div>
              )}
            </div>
          </div>

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
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Parts</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Good</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rework</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rejected</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Done By</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quality Checked By</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.cycleTimeData.map((ct, i) => {
                      const qty = reportData.quantityData?.[i] || { good: 0, defective: 0, rejected: 0 };
                      const basketDetails = reportData.basketDetails?.[i] || {};
                      const totalParts = basketDetails.totalParts || 0;
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
                          <td className="px-4 py-3 text-center font-bold text-gray-700">
                            {totalParts}
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
                            <div className="flex items-center justify-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700 text-xs">{basketDetails.doneBy || '-'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Shield className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700 text-xs">{basketDetails.qualityCheckedBy || '-'}</span>
                            </div>
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