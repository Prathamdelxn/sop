
// 'use client';

// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Search, Check, Eye, X, AlertCircle, CheckCircle, XCircle, Users, User, Calendar, Package,Barcode ,
//   Clock, Award, Zap, Sparkles, ChevronDown
// } from 'lucide-react';
// import BarcodeGenerator from '@/app/components/BarcodeGenerator';
// import PasswordModal from '@/app/components/PasswordModal';

// const useAnimation = (dependency) => {
//   const [animate, setAnimate] = useState(false);
//   useEffect(() => {
//     setAnimate(true);
//     const timer = setTimeout(() => setAnimate(false), 300);
//     return () => clearTimeout(timer);
//   }, [dependency]);
//   return animate;
// };

// const SearchBar = ({ searchQuery, onSearchChange, onStatusFilterChange, statusFilter }) => {
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);

//   const statusOptions = ['All Statuses', 'Pending', 'Approved', 'Rejected', 'Ongoing'];

//   return (
//     <div className="mb-5">
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center w-full">
//         {/* Search Input */}
//         <div className="relative flex-1">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search equipment by name, type, or serial..."
//             className="w-full pl-12 pr-4 py-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all duration-300 hover:shadow-md text-slate-700 placeholder-slate-400"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//           />
//         </div>

//         {/* Status Filter Dropdown */}
//         <div className="relative shrink-0">
//           <button
//             onClick={() => setShowStatusDropdown(!showStatusDropdown)}
//             className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 whitespace-nowrap"
//           >
//             <span className="font-medium">{statusFilter || 'All Statuses'}</span>
//             <ChevronDown className={`w-5 h-5 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
//           </button>
//           {showStatusDropdown && (
//             <div className="absolute right-0 z-10 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//               {statusOptions.map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => {
//                     onStatusFilterChange(status === 'All Statuses' ? '' : status.toLowerCase());
//                     setShowStatusDropdown(false);
//                   }}
//                   className={`block w-full text-left px-4 py-3 text-sm ${
//                     statusFilter === (status === 'All Statuses' ? '' : status.toLowerCase())
//                       ? 'bg-blue-50 text-blue-600 font-medium'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatusBadge = ({ status, type }) => {
//   const badges = {
//     Approved: 'bg-green-200 text-green-700 ',
//     'Pending Approval': 'bg-orange-200 text-orange-700 ',
//     Rejected: 'bg-red-200 text-red-700 ',
//     ongoing: 'bg-blue-200 text-blue-700 ',
//   };
//   return (
//     <span className={`px-4 py-1 rounded-full text-xs font-medium ${badges[type]} border-0`}>
//       {status}
//     </span>
//   );
// };

// const ActionButtons = ({ task, onAction, onView, setShowRejectModal, setTaskToReject, setShowApproveModal, setTaskToApprove }) => (
//   <div className="flex flex-col items-center justify-center sm:flex-row gap-2">
//     <button
//       onClick={() => onView(task)}
//       className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//       aria-label="View"
//     >
//       <Eye className="w-4 h-4 text-blue-500" />
//     </button>
//     {task.status != "Pending Approval" ? null : (
//       <>
      
//       </>
//     )}
//   </div>
// );

// const StatCard = ({ icon: Icon, label, value, color }) => {
//   const colorClasses = {
//     orange: 'bg-orange-100 text-orange-600',
//     green: 'bg-green-100 text-green-600',
//     red: 'bg-red-100 text-red-600',
//     yellow: 'bg-yellow-100 text-yellow-600',
//     blue: 'bg-blue-100 text-blue-600',
//   };

//   return (
//     <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
//       <div className="flex items-center gap-4">
//         <div className={`w-8 h-8 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
//           <Icon className="w-4 h-4" />
//         </div>
//         <div>
//           <p className="text-xl font-bold text-gray-800">{value}</p>
//           <p className="text-sm text-gray-600">{label}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ApprovalModal = ({ onClose, onConfirm, task, loading }) => {
//   return (
//     <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
//       <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
//         <div className="text-center">
//           <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Approve Equipment
//           </h3>
//           <p className="text-gray-600 mb-6">
//             Are you sure you want to approve{" "}
//             <strong className="text-gray-900">{task?.name}</strong>?
//           </p>

//           <div className="flex justify-center gap-4">
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={onConfirm}
//               disabled={loading}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
//                     ></path>
//                   </svg>
//                   Approving...
//                 </>
//               ) : (
//                 "Confirm Approval"
//               )}
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// };

// const RejectionModal = ({ onClose, onConfirm, reason, setReason }) => {
//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
//         <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-t-3xl relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
//           >
//             <X className="w-5 h-5" />
//           </button>
//           <div className="flex items-center mb-2">
//             <AlertCircle className="w-8 h-8 mr-3" />
//             <h3 className="text-2xl font-bold">Reject Equipment</h3>
//           </div>
//           <p className="text-red-100">Please provide a reason for rejection</p>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <div>
//             <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
//               Reason for Rejection *
//             </label>
//             <textarea
//               id="rejectionReason"
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
//               placeholder="Enter the reason for rejecting this equipment..."
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={!reason.trim()}
//               className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
//                 !reason.trim()
//                   ? 'bg-red-300 cursor-not-allowed'
//                   : 'bg-red-600 hover:bg-red-700'
//               }`}
//             >
//               Confirm Rejection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TaskDetailsModal = ({ task, onClose, onBarcodeUpload, companyData, onApprove, onReject, loading }) => {
//   if (!task) return null;

//   const isApproved = task.status.toLowerCase() === 'approved';
//   const isPending = task.status.toLowerCase() === 'pending approval';
//   const [name, setName] = useState('');

//   useEffect(() => {
//     if (task?.userId) {
//       fetchUseredById(task.userId);
//     }
//   }, [task]);

//   const fetchUseredById = async (id) => {
//     try {
//       const res = await fetch(`/api/users/fetch-by-id/${id}`);
//       const data = await res.json();
//       setName(data?.user?.name || 'Unknown User');
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       setName('Unknown User');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
//     switch (status) {
//       case 'Approved':
//         return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
//       case 'Pending Approval':
//         return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
//       case 'InProgress':
//         return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
//       case 'Rejected':
//         return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
//       case 'Expired':
//         return <span className={`${base} bg-red-100 text-red-800`}>Expired</span>;
//       default:
//         return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '—';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const formatFullDate = (dateString) => {
//     if (!dateString) return '—';
//     return new Date(dateString).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   const isOverdue = (dateString) => {
//     if (!dateString) return false;
//     return new Date(dateString) < new Date();
//   };

//   return (
//     <div className="fixed inset-0 pl-64 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4">
//       {/* ── Modal Card ── */}
//       <div
//         className="relative rounded-xl bg-white shadow-xl w-full max-w-5xl h-[85vh] flex flex-col mx-4"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ── Sticky Header ── */}
//         <div className="sticky top-0 bg-white rounded-t-xl p-4 pb-4 border-b flex items-start justify-between z-20">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 capitalize">
//               {task.name}
//             </h2>

//             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
//               {/* Equipment ID */}
//               <span className="font-mono">{task.equipmentId}</span>

//               {/* Status Badge */}
//               <span>{getStatusBadge(task.status)}</span>

//               {/* Rejection reason */}
//               {task.rejectionReason && (
//                 <div className="font-semibold capitalize">
//                   reason: {task.rejectionReason}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* ── Scrollable Body ── */}
//         <div className="p-6 space-y-8 overflow-y-auto flex-1 hide-scrollbar">
//           {/* ── 1. Equipment Details Card ── */}
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <Package className="w-4 h-4 text-blue-600" />
//                 Equipment Information
//               </h3>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.name}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Equipment ID</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm font-mono text-gray-900">{task.equipmentId}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.type || '—'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">QMS Number</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.qmsNumber || '—'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.manufacturer || '—'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.supplier || '—'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm text-gray-900 font-medium">{task.model || '—'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-sm font-mono text-gray-900">{task.serial || '—'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── BARCODE SECTION (Approved Only) ── */}
//           {/* {isApproved && (
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-blue-200">
//                 <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
//                   <Barcode className="w-4 h-4" />
//                   Barcode
//                 </h3>
//               </div>
//               <div className="p-6 bg-gray-50">
//                 <div className="flex flex-col lg:flex-row items-center gap-6">
//                   <div className="flex-1 max-w-md mx-auto">
//                     {!task.barcodeUrl ? (
//                       <div className="flex flex-col items-center py-8">
//                         <BarcodeGenerator text={task._id} onGenerated={onBarcodeUpload} />
//                         <p className="mt-4 text-sm text-blue-700 text-center">
//                           Generate barcode for quick identification
//                         </p>
//                       </div>
//                     ) : (
//                       <img
//                         src={task.barcodeUrl}
//                         alt="Equipment Barcode"
//                         className="w-full h-auto max-h-48 object-contain rounded-lg shadow-md border border-gray-200 bg-white p-4"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )} */}
// {/* ── BARCODE SECTION (Approved Only with proper conditional) ── */}
// {isApproved && (
//   <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//     <div className="bg-gray-50 px-6 py-4 border-b border-blue-200">
//       <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
//         <Barcode className="w-4 h-4" />
//         Barcode
//       </h3>
//     </div>
//     <div className="p-6 bg-gray-50">
//       <div className="flex flex-col lg:flex-row items-center gap-6">
//         <div className="flex-1 max-w-md mx-auto">
//           {task.barcodeUrl ? (
//             // Show existing barcode
//             <img
//               src={task.barcodeUrl}
//               alt="Equipment Barcode"
//               className="w-full h-auto max-h-48 object-contain rounded-lg shadow-md border border-gray-200 bg-white p-4"
//             />
//           ) : (
//             // Only show barcode generator if no barcode exists AND equipment is approved
//             <div className="flex flex-col items-center py-8">
//               <BarcodeGenerator 
//                 text={task._id} 
//                 onGenerated={onBarcodeUpload} 
//               />
//               <p className="mt-4 text-sm text-blue-700 text-center">
//                 Generate barcode for quick identification
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//           {/* ── 2. Qualification & Maintenance ── */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Qualification */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <Clock className="w-4 h-4 text-blue-600" />
//                   Qualification Dates
//                 </h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Qualification Done On</span>
//                   <span className="text-sm font-medium text-gray-900">
//                     {task.qualificationDoneDate ? formatDate(task.qualificationDoneDate) : '—'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Qualification Due On</span>
//                   <span className={`text-sm font-medium ${isOverdue(task.qualificationDueDate) ? 'text-red-600' : 'text-gray-900'}`}>
//                     {task.qualificationDueDate ? formatDate(task.qualificationDueDate) : '—'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Maintenance */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <Zap className="w-4 h-4 text-blue-600" />
//                   Preventive Dates
//                 </h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Preventive Maintenance Done Date</span>
//                   <span className="text-sm font-medium text-gray-900">
//                     {task.preventiveMaintenaceDoneDate ? formatDate(task.preventiveMaintenaceDoneDate) : '—'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Preventive Due Date</span>
//                   <span className={`text-sm font-medium ${isOverdue(task.preventiveDueDate) ? 'text-red-600' : 'text-gray-900'}`}>
//                     {task.preventiveDueDate ? formatDate(task.preventiveDueDate) : '—'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── 3. Remark (if any) ── */}
//           {task.remark && (
//             <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex gap-3">
//               <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
//               <div>
//                 <p className="font-semibold text-orange-800">Expiration Remark</p>
//                 <p className="text-sm text-orange-700 mt-1">{task.remark}</p>
//               </div>
//             </div>
//           )}

//           {/* ── 4. History & Approval ── */}
//           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <Users className="w-6 h-6 text-blue-600" />
//               History & Approval
//             </h3>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Created By */}
//               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <User className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-900">Created By</h4>
//                     <p className="text-sm text-gray-500">
//                       {task.createdAt ? formatFullDate(task.createdAt) : '—'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                     {name?.charAt(0)?.toUpperCase() || 'U'}
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">{name || 'Unknown'}</span>
//                 </div>
//               </div>

//               {/* Approval Status */}
//               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm col-span-2">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       task.status === 'Approved' ? 'bg-green-100' :
//                       task.status === 'Rejected' ? 'bg-red-100' : 'bg-yellow-100'
//                     }`}>
//                       {task.status === 'Approved' ? (
//                         <CheckCircle className="w-5 h-5 text-green-600" />
//                       ) : task.status === 'Rejected' ? (
//                         <XCircle className="w-5 h-5 text-red-600" />
//                       ) : (
//                         <Clock className="w-5 h-5 text-yellow-600" />
//                       )}
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         {task.status === 'Approved' ? 'Approved By' :
//                          task.status === 'Rejected' ? 'Rejected By' : 'Approval Pending'}
//                       </h4>
//                       <p className="text-sm text-gray-500">
//                         {task.approver?.approverDate ? formatFullDate(task.approver.approverDate) : '—'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
//                     task.status === 'Approved' ? 'bg-green-600' :
//                     task.status === 'Rejected' ? 'bg-red-600' : 'bg-yellow-600'
//                   }`}>
//                     {task.approver?.approverName?.charAt(0) || '?'}
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">
//                     {task.approver?.approverName || '—'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Sticky Footer with Approve/Reject (only for Pending) ── */}
//         {isPending && (
//           <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
//             <button
//               onClick={() => onReject(task)}
//               disabled={loading}
//               className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
//             >
//               <X className="w-4 h-4" />
//               Reject
//             </button>
//             <button
//               onClick={() => onApprove(task)}
//               disabled={loading}
//               className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
//             >
//               <Check className="w-4 h-4" />
//               Approve
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// const Dashboard = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [passwordActionType, setPasswordActionType] = useState('approve'); // 'approve' or 'reject'
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [taskToReject, setTaskToReject] = useState(null);
//   const [taskToApprove, setTaskToApprove] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [companyData, setCompanyData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [workSummary, setWorkSummary] = useState({
//     pendingReviews: 0,
//     approvedThisWeek: 0,
//     rejectedThisWeek: 0,
//     totalEquipment: 0,
//   });

//   // Load company data from localStorage
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const data = JSON.parse(userData);
//         setCompanyData(data);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         setError('Failed to load user data');
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const fetchData = async () => {
//     if (!companyData) return;
    
//     try {
//       setLoading(true);
//       const res = await fetch('/api/equipment/fetchAll');
//       if (!res.ok) {
//         throw new Error('Failed to fetch equipment data');
//       }
//       const data = await res.json();
//       console.log("this is fetchall", data.data);
      
//       const pendingTasks = data.data.filter(
//         (t) => t.companyId === companyData?.companyId && t.status != "InProgress" && t.userId != companyData.id
//       );
//       setTasks(pendingTasks);
     
//       // Calculate summary stats
//       const Pending = pendingTasks.filter(t => t.status === 'Pending Approval').length;
//       const approved = pendingTasks.filter(t => t.status.toLowerCase() === 'approved').length;
//       const rejected = pendingTasks.filter(t => t.status.toLowerCase() === 'rejected').length;
     
//       setWorkSummary({
//         pendingReviews: Pending,
//         approvedThisWeek: approved,
//         rejectedThisWeek: rejected,
//         totalEquipment: pendingTasks.length,
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   useEffect(() => {
//     if (companyData) {
//       fetchData();
//     }
//   }, [companyData]);

//   const filteredTasks = useMemo(() => {
//     return tasks.filter(task => {
//       const matchesSearch =
//         task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         task.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (task.serial && task.serial.toLowerCase().includes(searchQuery.toLowerCase()));
     
//       const matchesType = !typeFilter || task.type.toLowerCase() === typeFilter.toLowerCase();
//       const matchesStatus = !statusFilter || task.status.toLowerCase() === statusFilter.toLowerCase();
     
//       return matchesSearch && matchesType && matchesStatus;
//     });
//   }, [tasks, searchQuery, typeFilter, statusFilter]);

//   const uploadImageToCloudinary = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
     
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });
     
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
     
//       return await response.json();
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const updateEquipmentStatus = async (equipmentId, status, reason = '') => {
//     try {
//       const response = await fetch('/api/equipment/updateStatus', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           equipmentId,
//           status,
//           approver: {
//             approverId: companyData?.id,
//             approverName: companyData?.name
//           },
//           rejectionReason: status === 'Rejected' ? reason : undefined
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update equipment status');
//       }

//       return await response.json();
      
//     } catch (error) {
//       console.error('Error updating equipment status:', error);
//       throw error;
//     }
//   };

//   const updateEquipmentWithBarcode = async (equipmentId, barcodeUrl) => {
//     try {
//       const response = await fetch('/api/equipment/updateBarcode', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           equipmentId,
//           barcodeUrl
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update equipment with barcode');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error updating equipment:', error);
//       throw error;
//     }
//   };

//   const verifyPassword = async (password) => {
//     try {
//       const response = await fetch('/api/verify-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: companyData?.id,
//           password: password
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Password verification failed');
//       }

//       const result = await response.json();
//       return result.success;
//     } catch (error) {
//       console.error('Password verification error:', error);
//       return false;
//     }
//   };

//   const handleBarcodeUpload = async (file) => {
//     try {
//       if (!selectedTask) return;
     
//       const uploadResult = await uploadImageToCloudinary(file);
//       console.log('Uploaded barcode image URL:', uploadResult.url);

//       await updateEquipmentWithBarcode(selectedTask._id, uploadResult.url);

//       setTasks(prevTasks =>
//         prevTasks.map(task =>
//           task._id === selectedTask._id
//             ? { ...task, barcodeUrl: uploadResult.url }
//             : task
//         )
//       );

//     } catch (err) {
//       console.error('Barcode upload/update failed:', err);
//       setError('Failed to upload barcode. Please try again.');
//     }
//   };

//   const handlePasswordConfirm = async (password) => {
//     try {
//       setLoading(true);
      
//       const isPasswordValid = await verifyPassword(password);
      
//       if (!isPasswordValid) {
//         setError('Invalid password. Please try again.');
//         setLoading(false);
//         return;
//       }

//       // If password is valid, proceed with the action
//       if (passwordActionType === 'approve') {
//         await handleTaskAction(taskToApprove._id, 'Approved');
//       } else if (passwordActionType === 'reject') {
//         await handleTaskAction(taskToReject._id, 'Rejected', rejectionReason);
//       }
      
//       setShowPasswordModal(false);
      
//     } catch (error) {
//       console.error('Password confirmation error:', error);
//       setError('Failed to verify password. Please try again.');
//       setLoading(false);
//     }
//   };

//   const handleTaskAction = async (taskId, action, reason = '') => {
//     try {
//       setLoading(true);
//       const newStatus = action === 'Approved' ? 'Approved' : 'Rejected';
     
//       const updatedEquipment = await updateEquipmentStatus(taskId, newStatus, reason);
//       await fetchData();
      
//       setTasks(prevTasks =>
//         prevTasks.map(task =>
//           task._id === taskId
//             ? { ...task, status: newStatus, rejectionReason: action === 'Rejected' ? reason : undefined }
//             : task
//         )
//       );

//       setWorkSummary(prev => ({
//         ...prev,
//         approvedThisWeek: action === 'Approved' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
//         rejectedThisWeek: action === 'Rejected' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
//         pendingReviews: action === 'Approved' || action === 'Rejected' ? Math.max(0, prev.pendingReviews - 1) : prev.pendingReviews,
//       }));

//       if (action === 'Approved') {
//         const approvedTask = tasks.find(task => task._id === taskId);
//         setSelectedTask({ ...approvedTask, status: newStatus });
//       }
//     } catch (error) {
//       console.error('Error updating equipment status:', error);
//       setError(`Failed to ${action} equipment. Please try again.`);
//     } finally {
//       setLoading(false);
//       setShowRejectModal(false);
//       setShowApproveModal(false);
//       setShowPasswordModal(false);
//       setRejectionReason('');
//     }
//   };

//   const animateStats = useAnimation(workSummary);

//   // Show loading until companyData is available
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-slate-700">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !companyData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md">
//           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
//           <p className="text-slate-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading && tasks.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-slate-700">Loading equipment data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-7xl mx-auto p-4">
//         <div className="bg-white border-b border-gray-200 rounded-xl my-2 shadow-sm">
//           <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Approve/Reject Equipment Workspace</h1>
//                 <p className="text-gray-600 mt-2 text-md">Manage and monitor your equipment</p>
//               </div>
//             </div>
//           </div>
//         </div>
        

//         <SearchBar
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           onStatusFilterChange={setStatusFilter}
//           statusFilter={statusFilter}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
//           <StatCard icon={AlertCircle} label="Pending Equipment" value={workSummary.pendingReviews} color="orange" />
//           <StatCard icon={CheckCircle} label="Approved Equipment" value={workSummary.approvedThisWeek} color="green" />
//           <StatCard icon={XCircle} label="Rejected Equipment" value={workSummary.rejectedThisWeek} color="red" />
//           <StatCard icon={Package} label="Total Equipment" value={workSummary.totalEquipment} color="blue" />
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-900">Sr.</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-900">Created At</th>
//                   <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredTasks.length > 0 ? (
//                   filteredTasks.map((task, index) => (
//                     <tr key={task._id} className="hover:bg-gray-50">
//                       <td className="py-4 px-6 font-medium text-gray-600">{index + 1}</td>
//                       <td className="py-4 px-6 font-medium text-gray-900">{task.name}</td>
//                       <td className="py-4 px-6 text-gray-600">{task.type}</td>
//                       <td className="py-4 px-6">
//                         <StatusBadge status={task.status} type={task.status} />
//                       </td>
//                       <td className="py-4 px-6 flex items-center text-gray-600">
//                         <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                         {new Date(task.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="py-4 px-6">
//                         <ActionButtons
//                           task={task}
//                           onAction={handleTaskAction}
//                           onView={(task) => {
//                             setSelectedTask(task);
//                             setShowModal(true);
//                           }}
//                           setShowRejectModal={setShowRejectModal}
//                           setTaskToReject={setTaskToReject}
//                           setShowApproveModal={setShowApproveModal}
//                           setTaskToApprove={setTaskToApprove}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-12">
//                       <div className="text-gray-500">No equipment found matching your criteria</div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {showApproveModal && (
//           <ApprovalModal
//             onClose={() => {
//               setShowApproveModal(false);
//               setTaskToApprove(null);
//             }}
//             onConfirm={() => {
//               setShowApproveModal(false);
//               setPasswordActionType('approve');
//               setShowPasswordModal(true);
//             }}
//             task={taskToApprove}
//             loading={loading}
//           />
//         )}

//         {showRejectModal && (
//           <RejectionModal
//             onClose={() => {
//               setShowRejectModal(false);
//               setRejectionReason('');
//             }}
//             onConfirm={() => {
//               setShowRejectModal(false);
//               setPasswordActionType('reject');
//               setShowPasswordModal(true);
//             }}
//             reason={rejectionReason}
//             setReason={setRejectionReason}
//           />
//         )}

//         {showPasswordModal && (
//           <PasswordModal
//             onClose={() => {
//               setShowPasswordModal(false);
//               setTaskToApprove(null);
//               setTaskToReject(null);
//             }}
//             onConfirm={handlePasswordConfirm}
//             loading={loading}
//             actionType={passwordActionType}
//           />
//         )}

//         {showModal && (
//           <TaskDetailsModal
//             task={selectedTask}
//             companyData={companyData}
//             onClose={() => setShowModal(false)}
//             onBarcodeUpload={handleBarcodeUpload}
//             onApprove={(task) => {
//               setShowModal(false);
//               setTaskToApprove(task);
//               setShowApproveModal(true);
//             }}
//             onReject={(task) => {
//               setShowModal(false);
//               setTaskToReject(task);
//               setShowRejectModal(true);
//             }}
//             loading={loading}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Check, Eye, X, AlertCircle, CheckCircle, XCircle, Users, User, Calendar, Package, Barcode,
  Clock, Award, Zap, Sparkles, ChevronDown
} from 'lucide-react';
import BarcodeGenerator from '@/app/components/BarcodeGenerator';
import PasswordModal from '@/app/components/PasswordModal';

const useAnimation = (dependency) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [dependency]);
  return animate;
};

const SearchBar = ({ searchQuery, onSearchChange, onStatusFilterChange, statusFilter }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions = ['All Statuses', 'Pending', 'Approved', 'Rejected', 'Ongoing'];

  return (
    <div className="mb-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center w-full">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search equipment by name, type, or serial..."
            className="w-full pl-12 pr-4 py-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all duration-300 hover:shadow-md text-slate-700 placeholder-slate-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 whitespace-nowrap"
          >
            <span className="font-medium">{statusFilter || 'All Statuses'}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 z-10 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusFilterChange(status === 'All Statuses' ? '' : status.toLowerCase());
                    setShowStatusDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm ${
                    statusFilter === (status === 'All Statuses' ? '' : status.toLowerCase())
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, type }) => {
  const badges = {
    Approved: 'bg-green-200 text-green-700 ',
    'Pending Approval': 'bg-orange-200 text-orange-700 ',
    Rejected: 'bg-red-200 text-red-700 ',
    ongoing: 'bg-blue-200 text-blue-700 ',
  };
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-medium ${badges[type]} border-0`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ task, onView }) => (
  <div className="flex flex-col items-center justify-center sm:flex-row gap-2">
    <button
      onClick={() => onView(task)}
      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
      aria-label="View"
    >
      <Eye className="w-4 h-4 text-blue-500" />
    </button>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

const ApprovalModal = ({ onClose, onConfirm, task, loading }) => {
  return (
    <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Approve Equipment
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to approve <strong className="text-gray-900">{task?.name}</strong>?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"></path>
                  </svg>
                  Approving...
                </>
              ) : (
                "Confirm Approval"
              )}
            </button>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const RejectionModal = ({ onClose, onConfirm, reason, setReason }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-t-3xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center mb-2">
            <AlertCircle className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Reject Equipment</h3>
          </div>
          <p className="text-red-100">Please provide a reason for rejection</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Rejection *
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Enter the reason for rejecting this equipment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!reason.trim()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                !reason.trim() ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskDetailsModal = ({ task, onClose, onBarcodeUpload, companyData, onApprove, onReject, loading }) => {
  if (!task) return null;

  const isApproved = task.status.toLowerCase() === 'approved';
  const isPending = task.status.toLowerCase() === 'pending approval';
  const [name, setName] = useState('');

  useEffect(() => {
    if (task?.userId) {
      fetchUseredById(task.userId);
    }
  }, [task]);

  const fetchUseredById = async (id) => {
    try {
      const res = await fetch(`/api/users/fetch-by-id/${id}`);
      const data = await res.json();
      setName(data?.user?.name || 'Unknown User');
    } catch (error) {
      console.error('Error fetching user:', error);
      setName('Unknown User');
    }
  };

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Approved': return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
      case 'Pending Approval': return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'InProgress': return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'Rejected': return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
      case 'Expired': return <span className={`${base} bg-red-100 text-red-800`}>Expired</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="fixed inset-0 pl-64 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative rounded-xl bg-white shadow-xl w-full max-w-5xl h-[85vh] flex flex-col mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white rounded-t-xl p-4 pb-4 border-b flex items-start justify-between z-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{task.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
              <span className="font-mono">{task.equipmentId}</span>
              <span>{getStatusBadge(task.status)}</span>
              {task.rejectionReason && <div className="font-semibold capitalize">reason: {task.rejectionReason}</div>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1 hide-scrollbar">
          {/* Equipment Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Equipment Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['name', 'equipmentId', 'type', 'qmsNumber', 'manufacturer', 'supplier', 'model', 'serial'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900 font-medium">{task[field] || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BARCODE SECTION (Only if Approved & No Barcode) */}
          {isApproved && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Barcode
                </h3>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-1 max-w-md mx-auto">
                    {task.barcodeUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={task.barcodeUrl} alt="Equipment Barcode" className="w-full h-auto max-h-48 object-contain rounded-lg shadow-md border border-gray-200 bg-white p-4" />
                        <p className="mt-2 text-xs text-gray-500">Barcode already generated</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <BarcodeGenerator key={`generator-${task._id}`} text={task._id} onGenerated={onBarcodeUpload} />
                        <p className="mt-4 text-sm text-blue-700 text-center">Click "Generate Barcode" to create one</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Qualification & Maintenance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Qualification Dates
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Qualification Done On</span>
                  <span className="text-sm font-medium text-gray-900">{task.qualificationDoneDate ? formatDate(task.qualificationDoneDate) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Qualification Due On</span>
                  <span className={`text-sm font-medium ${isOverdue(task.qualificationDueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {task.qualificationDueDate ? formatDate(task.qualificationDueDate) : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Preventive Dates
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Preventive Done Date</span>
                  <span className="text-sm font-medium text-gray-900">{task.preventiveMaintenaceDoneDate ? formatDate(task.preventiveMaintenaceDoneDate) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Preventive Due Date</span>
                  <span className={`text-sm font-medium ${isOverdue(task.preventiveDueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {task.preventiveDueDate ? formatDate(task.preventiveDueDate) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {task.remark && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-800">Expiration Remark</p>
                <p className="text-sm text-orange-700 mt-1">{task.remark}</p>
              </div>
            </div>
          )}

          {/* History & Approval */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              History & Approval
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Created By</h4>
                    <p className="text-sm text-gray-500">{task.createdAt ? formatFullDate(task.createdAt) : '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{name || 'Unknown'}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.status === 'Approved' ? 'bg-green-100' :
                      task.status === 'Rejected' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {task.status === 'Approved' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                       task.status === 'Rejected' ? <XCircle className="w-5 h-5 text-red-600" /> :
                       <Clock className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {task.status === 'Approved' ? 'Approved By' : task.status === 'Rejected' ? 'Rejected By' : 'Approval Pending'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {task.approver?.approverDate ? formatFullDate(task.approver.approverDate) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    task.status === 'Approved' ? 'bg-green-600' :
                    task.status === 'Rejected' ? 'bg-red-600' : 'bg-yellow-600'
                  }`}>
                    {task.approver?.approverName?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{task.approver?.approverName || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approve/Reject Buttons (Pending Only) */}
        {isPending && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button onClick={() => onReject(task)} disabled={loading} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
              <X className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => onApprove(task)} disabled={loading} className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
              <Check className="w-4 h-4" /> Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordActionType, setPasswordActionType] = useState('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [taskToReject, setTaskToReject] = useState(null);
  const [taskToApprove, setTaskToApprove] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingBarcode, setUploadingBarcode] = useState(false);
  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    totalEquipment: 0,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const data = JSON.parse(userData);
        setCompanyData(data);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to load user data');
      }
    }
    setIsLoading(false);
  }, []);

  const fetchData = async () => {
    if (!companyData) return;
    try {
      setLoading(true);
      const res = await fetch('/api/equipment/fetchAll');
      if (!res.ok) throw new Error('Failed to fetch equipment data');
      const data = await res.json();

      const pendingTasks = data.data.filter(
        (t) => t.companyId === companyData?.companyId && t.status !== "InProgress" && t.userId !== companyData.id
      );
      setTasks(pendingTasks);

      const Pending = pendingTasks.filter(t => t.status === 'Pending Approval').length;
      const approved = pendingTasks.filter(t => t.status.toLowerCase() === 'approved').length;
      const rejected = pendingTasks.filter(t => t.status.toLowerCase() === 'rejected').length;

      setWorkSummary({
        pendingReviews: Pending,
        approvedThisWeek: approved,
        rejectedThisWeek: rejected,
        totalEquipment: pendingTasks.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyData) fetchData();
  }, [companyData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.serial && task.serial.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = !statusFilter || task.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  };

  const updateEquipmentStatus = async (equipmentId, status, reason = '') => {
    const response = await fetch('/api/equipment/updateStatus', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipmentId,
        status,
        approver: { approverId: companyData?.id, approverName: companyData?.name },
        rejectionReason: status === 'Rejected' ? reason : undefined
      })
    });
    if (!response.ok) throw new Error('Failed to update equipment status');
    return await response.json();
  };

  const updateEquipmentWithBarcode = async (equipmentId, barcodeUrl) => {
    const response = await fetch('/api/equipment/updateBarcode', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipmentId, barcodeUrl })
    });
    if (!response.ok) throw new Error('Failed to update equipment with barcode');
    return await response.json();
  };

  const verifyPassword = async (password) => {
    const response = await fetch('/api/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: companyData?.id, password })
    });
    if (!response.ok) throw new Error('Password verification failed');
    const result = await response.json();
    return result.success;
  };

  const handleBarcodeUpload = useCallback(async (file) => {
    if (!selectedTask || uploadingBarcode || selectedTask.barcodeUrl) {
      console.log('Upload blocked: already exists or in progress');
      return;
    }

    try {
      setUploadingBarcode(true);
      const uploadResult = await uploadImageToCloudinary(file);
      await updateEquipmentWithBarcode(selectedTask._id, uploadResult.url);

      setTasks(prev => prev.map(t => t._id === selectedTask._id ? { ...t, barcodeUrl: uploadResult.url } : t));
      setSelectedTask(prev => ({ ...prev, barcodeUrl: uploadResult.url }));
    } catch (err) {
      setError('Failed to upload barcode. Please try again.');
    } finally {
      setUploadingBarcode(false);
    }
  }, [selectedTask, uploadingBarcode]);

  const handlePasswordConfirm = async (password) => {
    try {
      setLoading(true);
      const isValid = await verifyPassword(password);
      if (!isValid) { setError('Invalid password.'); setLoading(false); return; }

      if (passwordActionType === 'approve') {
        await handleTaskAction(taskToApprove._id, 'Approved');
      } else {
        await handleTaskAction(taskToReject._id, 'Rejected', rejectionReason);
      }
      setShowPasswordModal(false);
    } catch (error) {
      setError('Failed to verify password.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (taskId, action, reason = '') => {
    try {
      setLoading(true);
      const newStatus = action === 'Approved' ? 'Approved' : 'Rejected';
      await updateEquipmentStatus(taskId, newStatus, reason);
      await fetchData();

      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus, rejectionReason: action === 'Rejected' ? reason : undefined } : t));
      setWorkSummary(prev => ({
        ...prev,
        approvedThisWeek: action === 'Approved' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
        rejectedThisWeek: action === 'Rejected' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
        pendingReviews: Math.max(0, prev.pendingReviews - 1),
      }));
    } catch (error) {
      setError(`Failed to ${action} equipment.`);
    } finally {
      setLoading(false);
      setShowRejectModal(false);
      setShowApproveModal(false);
      setShowPasswordModal(false);
      setRejectionReason('');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-4 text-slate-700">Loading user data...</p></div></div>;

  if (error && !companyData) return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"><div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md"><XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2><p className="text-slate-600 mb-4">{error}</p><button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">Try Again</button></div></div>;

  if (loading && tasks.length === 0) return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-4 text-slate-700">Loading equipment data...</p></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white border-b border-gray-200 rounded-xl my-2 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approve/Reject Equipment Workspace</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and monitor your equipment</p>
              </div>
            </div>
          </div>
        </div>

        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onStatusFilterChange={setStatusFilter} statusFilter={statusFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
          <StatCard icon={AlertCircle} label="Pending Equipment" value={workSummary.pendingReviews} color="orange" />
          <StatCard icon={CheckCircle} label="Approved Equipment" value={workSummary.approvedThisWeek} color="green" />
          <StatCard icon={XCircle} label="Rejected Equipment" value={workSummary.rejectedThisWeek} color="red" />
          <StatCard icon={Package} label="Total Equipment" value={workSummary.totalEquipment} color="blue" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Sr.</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Created At</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-600">{index + 1}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{task.name}</td>
                      <td className="py-4 px-6 text-gray-600">{task.type}</td>
                      <td className="py-4 px-6"><StatusBadge status={task.status} type={task.status} /></td>
                      <td className="py-4 px-6 flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <ActionButtons task={task} onView={(task) => { setSelectedTask(task); setShowModal(true); }} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-12"><div className="text-gray-500">No equipment found matching your criteria</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showApproveModal && (
          <ApprovalModal onClose={() => { setShowApproveModal(false); setTaskToApprove(null); }}
            onConfirm={() => { setShowApproveModal(false); setPasswordActionType('approve'); setShowPasswordModal(true); }}
            task={taskToApprove} loading={loading} />
        )}

        {showRejectModal && (
          <RejectionModal onClose={() => { setShowRejectModal(false); setRejectionReason(''); }}
            onConfirm={() => { setShowRejectModal(false); setPasswordActionType('reject'); setShowPasswordModal(true); }}
            reason={rejectionReason} setReason={setRejectionReason} />
        )}

        {showPasswordModal && (
          <PasswordModal onClose={() => { setShowPasswordModal(false); setTaskToApprove(null); setTaskToReject(null); }}
            onConfirm={handlePasswordConfirm} loading={loading} actionType={passwordActionType} />
        )}

        {showModal && (
          <TaskDetailsModal
            task={selectedTask}
            companyData={companyData}
            onClose={() => setShowModal(false)}
            onBarcodeUpload={handleBarcodeUpload}
            onApprove={(task) => { setShowModal(false); setTaskToApprove(task); setShowApproveModal(true); }}
            onReject={(task) => { setShowModal(false); setTaskToReject(task); setShowRejectModal(true); }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;