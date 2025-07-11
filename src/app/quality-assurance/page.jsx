// // "use client";
 
// // import React, { useState, useMemo, useEffect } from 'react';
// // import { Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle, Filter, Calendar, Users, TrendingUp, Bell, Settings, Download, RefreshCw } from 'lucide-react';
 
// // // Utility function for animations
// // const useAnimation = (dependency) => {
// //   const [animate, setAnimate] = useState(false);
 
// //   useEffect(() => {
// //     setAnimate(true);
// //     const timer = setTimeout(() => setAnimate(false), 300);
// //     return () => clearTimeout(timer);
// //   }, [dependency]);
 
// //   return animate;
// // };
 
// // // Enhanced SearchBar Component
// // const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => {
// //   return (
// //     <div className="mb-8">
// //       <div className="flex flex-col sm:flex-row gap-4 items-center">
// //         <div className="relative flex-1 max-w-2xl">
// //           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //           <input
// //             type="text"
// //             placeholder="Quick search any Prototype by name or task number..."
// //             className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
// //             value={searchQuery}
// //             onChange={(e) => onSearchChange(e.target.value)}
// //           />
// //         </div>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={onFilter}
// //             className="flex items-center gap-2 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
// //           >
// //             <Filter className="w-5 h-5" />
// //             <span className="hidden sm:inline">Filter</span>
// //           </button>
// //           <button className="flex items-center gap-2 px-4 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
// //             <Plus className="w-5 h-5" />
// //             <span className="hidden sm:inline">New Task</span>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
 
// // // Enhanced Status Badge Component
// // const StatusBadge = ({ status, type }) => {
// //   const badges = {
// //     completed: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
// //     pending: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200',
// //     rejected: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200',
// //     ongoing: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
// //   };
 
// //   return (
// //     <span className={`px-4 py-2 rounded-full text-sm font-medium border ${badges[type]} transition-all duration-200`}>
// //       {status}
// //     </span>
// //   );
// // };
 
// // // Enhanced Assignee Avatar Component
// // const AssigneeAvatar = ({ initials, color, index }) => {
// //   const colors = {
// //     'DR': 'bg-gradient-to-br from-orange-400 to-orange-600',
// //     'JP': 'bg-gradient-to-br from-purple-400 to-purple-600',
// //     'KP': 'bg-gradient-to-br from-pink-400 to-pink-600',
// //     'PM': 'bg-gradient-to-br from-blue-400 to-blue-600',
// //     'BN': 'bg-gradient-to-br from-green-400 to-green-600',
// //     'CR': 'bg-gradient-to-br from-red-400 to-red-600'
// //   };
 
// //   return (
// //     <div
// //       className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${colors[initials] || 'bg-gradient-to-br from-gray-400 to-gray-600'}
// //         transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer ring-2 ring-white shadow-sm`}
// //       style={{ zIndex: 10 - index, marginLeft: index > 0 ? '-8px' : '0' }}
// //       title={initials}
// //     >
// //       {initials}
// //     </div>
// //   );
// // };
 
// // // Enhanced Action Buttons Component
// // const ActionButtons = ({ task, onAction }) => {
// //   if (task.type === 'pending' || task.type === 'ongoing') {
// //     return (
// //       <div className="flex gap-2">
// //         <button
// //           onClick={() => onAction(task.id, 'approve')}
// //           className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
// //         >
// //           <Check className="w-4 h-4 mr-2" />
// //           Approve
// //         </button>
// //         <button
// //           onClick={() => onAction(task.id, 'reject')}
// //           className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
// //         >
// //           <X className="w-4 h-4 mr-2" />
// //           Reject
// //         </button>
// //       </div>
// //     );
// //   }
 
// //   return (
// //     <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
// //       <Eye className="w-4 h-4 mr-2" />
// //       View Details
// //     </button>
// //   );
// // };
 
// // // Enhanced Statistics Card Component
// // const StatCard = ({ icon: Icon, label, value, color, trend }) => {
// //   const colorClasses = {
// //     orange: 'from-orange-500 to-amber-500',
// //     green: 'from-green-500 to-emerald-500',
// //     red: 'from-red-500 to-rose-500',
// //     yellow: 'from-yellow-500 to-amber-500',
// //     blue: 'from-blue-500 to-indigo-500'
// //   };
 
// //   return (
// //     <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
// //       <div className="flex items-center justify-between mb-4">
// //         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
// //           <Icon className="w-6 h-6" />
// //         </div>
// //         {trend && (
// //           <div className="flex items-center text-sm text-gray-500">
// //             <TrendingUp className="w-4 h-4 mr-1" />
// //             {trend}
// //           </div>
// //         )}
// //       </div>
// //       <div className="space-y-1">
// //         <p className="text-2xl font-bold text-gray-900">{value}</p>
// //         <p className="text-sm text-gray-600">{label}</p>
// //       </div>
// //     </div>
// //   );
// // };
 
// // // Main Dashboard Component
// // const Dashboard = () => {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [filterOpen, setFilterOpen] = useState(false);
// //   const [selectedFilter, setSelectedFilter] = useState('all');
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [tasks, setTasks] = useState([
// //     {
// //       id: 1,
     
// //       PrototypeName: 'Machine Cleaning : Model No. MACH001234',
// //       equipmentName:'CNC-01',
// //       status: 'Completed',
// //       dueDate: '01-07-2025',
// //       type: 'completed',
// //       priority: 'high'
// //     },
// //     {
// //       id: 2,
     
// //       PrototypeName: 'Machine Cleaning : Model No. MACH001432',
// //       equipmentName:'CNC-01',
// //       status: 'Pending',
// //       dueDate: '03-07-2025',
// //       type: 'pending',
// //       priority: 'medium'
// //     },
// //     {
// //       id: 3,
      
// //       PrototypeName: 'Machine Cleaning : Model No. MACH001342',
// //        equipmentName:'CNC-01',
// //       status: 'Rejected',
// //       dueDate: '30-06-2025',
// //       type: 'rejected',
// //       priority: 'low'
// //     },
// //     {
// //       id: 4,
    
// //       PrototypeName: 'Machine Cleaning : Model No. MACH001342',
// //        equipmentName:'CNC-01',
// //       status: 'Ongoing',
// //       dueDate: '01-07-2025',
// //       type: 'ongoing',
// //       priority: 'high'
// //     }
// //   ]);
 
// //   const [workSummary, setWorkSummary] = useState({
// //     pendingReviews: 12,
// //     approvedThisWeek: 24,
// //     rejectedThisWeek: 12,
// //     deviationRaised: 2
// //   });
 
// //   const animateStats = useAnimation(workSummary);
 
// //   const filteredTasks = useMemo(() => {
// //     return tasks.filter(task => {
// //       const matchesSearch = task.PrototypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                            task.taskNo.includes(searchQuery);
// //       const matchesFilter = selectedFilter === 'all' || task.type === selectedFilter;
// //       return matchesSearch && matchesFilter;
// //     });
// //   }, [tasks, searchQuery, selectedFilter]);
 
// //   const handleTaskAction = (taskId, action) => {
// //     setTasks(prevTasks =>
// //       prevTasks.map(task => {
// //         if (task.id === taskId) {
// //           if (action === 'approve') {
// //             return { ...task, status: 'Completed', type: 'completed' };
// //           } else if (action === 'reject') {
// //             return { ...task, status: 'Rejected', type: 'rejected' };
// //           }
// //         }
// //         return task;
// //       })
// //     );
 
// //     if (action === 'approve') {
// //       setWorkSummary(prev => ({
// //         ...prev,
// //         approvedThisWeek: prev.approvedThisWeek + 1,
// //         pendingReviews: Math.max(0, prev.pendingReviews - 1)
// //       }));
// //     } else if (action === 'reject') {
// //       setWorkSummary(prev => ({
// //         ...prev,
// //         rejectedThisWeek: prev.rejectedThisWeek + 1,
// //         pendingReviews: Math.max(0, prev.pendingReviews - 1)
// //       }));
// //     }
// //   };
 
// //   const handleRefresh = () => {
// //     setRefreshing(true);
// //     setTimeout(() => setRefreshing(false), 1000);
// //   };
 
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
// //       <div className="max-w-7xl mx-auto p-6">
// //         {/* Search Bar */}
// //         <SearchBar
// //           searchQuery={searchQuery}
// //           onSearchChange={setSearchQuery}
// //           onFilter={() => setFilterOpen(!filterOpen)}
// //         />
 
// //         {/* Filter Bar */}
// //         {filterOpen && (
// //           <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
// //             <div className="flex flex-wrap gap-2">
// //               {['all', 'pending', 'ongoing', 'completed', 'rejected'].map(filter => (
// //                 <button
// //                   key={filter}
// //                   onClick={() => setSelectedFilter(filter)}
// //                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
// //                     selectedFilter === filter
// //                       ? 'bg-blue-600 text-white shadow-md'
// //                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                   }`}
// //                 >
// //                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}
 
// //         {/* Statistics Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <StatCard
// //             icon={AlertCircle}
// //             label="Pending Reviews"
// //             value={workSummary.pendingReviews}
// //             color="orange"
// //             trend="+2.5%"
// //           />
// //           <StatCard
// //             icon={CheckCircle}
// //             label="Approved This Week"
// //             value={workSummary.approvedThisWeek}
// //             color="green"
// //             trend="+12.3%"
// //           />
// //           <StatCard
// //             icon={XCircle}
// //             label="Rejected This Week"
// //             value={workSummary.rejectedThisWeek}
// //             color="red"
// //             trend="-5.2%"
// //           />
// //           <StatCard
// //             icon={AlertCircle}
// //             label="Deviation Raised"
// //             value={workSummary.deviationRaised}
// //             color="yellow"
// //             trend="+1.1%"
// //           />
// //         </div>
 
// //         {/* Priority Tasks Table */}
// //         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
// //           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
// //             <div className="flex items-center gap-3">
// //               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
// //               <h2 className="text-lg font-semibold text-white">Priority Tasks Review</h2>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <button className="text-blue-200 hover:text-white transition-colors">
// //                 <Download className="w-5 h-5" />
// //               </button>
// //               <button className="text-blue-200 hover:text-white transition-colors">
// //                 <Plus className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
         
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Task No.</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prototype Name</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment Name To</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {filteredTasks.map((task, index) => (
// //                   <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150 group">
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center justify-center">
// //                         <span className="text-sm font-bold text-gray-900">{index+1}</span>
                       
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <div className="text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
// //                         {task.PrototypeName}
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <StatusBadge status={task.status} type={task.type} />
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center text-sm text-gray-900">
// //                         <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                         {task.dueDate}
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <ActionButtons task={task} onAction={handleTaskAction} />
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
 
// //         {/* Bottom Section */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Task History */}
// //           <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
// //             <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
// //               <h3 className="text-lg font-semibold text-white">Task History & Traceability</h3>
// //             </div>
// //             <div className="p-6">
// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
// //                       <Users className="w-5 h-5 text-white" />
// //                     </div>
// //                     <div>
// //                       <p className="font-medium text-gray-900">Recent Activity</p>
// //                       <p className="text-sm text-gray-600">Track all task changes and updates</p>
// //                     </div>
// //                   </div>
// //                   <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium">
// //                     View History
// //                   </button>
// //                 </div>
               
// //                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
// //                       <TrendingUp className="w-5 h-5 text-white" />
// //                     </div>
// //                     <div>
// //                       <p className="font-medium text-gray-900">Performance Analytics</p>
// //                       <p className="text-sm text-gray-600">View detailed performance metrics</p>
// //                     </div>
// //                   </div>
// //                   <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium">
// //                     View Analytics
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
 
// //           {/* Quick Actions */}
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
// //             <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl">
// //               <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
// //             </div>
// //             <div className="p-6 space-y-4">
             
// //               <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-left">
// //                 <Download className="w-5 h-5 text-green-600" />
// //                 <span className="font-medium text-gray-900">Export Reports</span>
// //               </button>
             
// //               <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-left">
// //                 <Settings className="w-5 h-5 text-purple-600" />
// //                 <span className="font-medium text-gray-900">Settings</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
 
// // export default Dashboard;
// // 'use client';

// // import React, { useState, useMemo, useEffect } from 'react';
// // import {
// //   Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle,
// //   Filter, Calendar, Download, TrendingUp
// // } from 'lucide-react';

// // const useAnimation = (dependency) => {
// //   const [animate, setAnimate] = useState(false);
// //   useEffect(() => {
// //     setAnimate(true);
// //     const timer = setTimeout(() => setAnimate(false), 300);
// //     return () => clearTimeout(timer);
// //   }, [dependency]);
// //   return animate;
// // };

// // const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => (
// //   <div className="mb-8">
// //     <div className="flex flex-col sm:flex-row gap-4 items-center">
// //       <div className="relative flex-1 max-w-2xl">
// //         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //         <input
// //           type="text"
// //           placeholder="Search equipment by name or type..."
// //           className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
// //           value={searchQuery}
// //           onChange={(e) => onSearchChange(e.target.value)}
// //         />
// //       </div>
// //       <button
// //         onClick={onFilter}
// //         className="flex items-center gap-2 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
// //       >
// //         <Filter className="w-5 h-5" />
// //         <span className="hidden sm:inline">Filter</span>
// //       </button>
// //     </div>
// //   </div>
// // );

// // const StatusBadge = ({ status, type }) => {
// //   const badges = {
// //     completed: 'bg-green-100 text-green-800 border-green-200',
// //     pending: 'bg-orange-100 text-orange-800 border-orange-200',
// //     rejected: 'bg-red-100 text-red-800 border-red-200',
// //     ongoing: 'bg-blue-100 text-blue-800 border-blue-200',
// //   };
// //   return (
// //     <span className={`px-4 py-2 rounded-full text-sm font-medium border ${badges[type]}`}>
// //       {status}
// //     </span>
// //   );
// // };

// // const ActionButtons = ({ task, onAction, onView }) => (
// //   <div className="flex flex-col sm:flex-row gap-2">
// //     <button onClick={() => onView(task)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
// //       <Eye className="w-4 h-4 mr-2" /> View
// //     </button>
// //     <button onClick={() => onAction(task._id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
// //       <Check className="w-4 h-4 mr-2" /> Approve
// //     </button>
// //     <button onClick={() => onAction(task._id, 'reject')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
// //       <X className="w-4 h-4 mr-2" /> Reject
// //     </button>
// //   </div>
// // );

// // const StatCard = ({ icon: Icon, label, value, color, trend }) => {
// //   const colorClasses = {
// //     orange: 'from-orange-500 to-amber-500',
// //     green: 'from-green-500 to-emerald-500',
// //     red: 'from-red-500 to-rose-500',
// //     yellow: 'from-yellow-500 to-amber-500',
// //     blue: 'from-blue-500 to-indigo-500',
// //   };
// //   return (
// //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
// //       <div className="flex items-center justify-between mb-4">
// //         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center`}>
// //           <Icon className="w-6 h-6" />
// //         </div>
// //         {trend && (
// //           <div className="flex items-center text-sm text-gray-500">
// //             <TrendingUp className="w-4 h-4 mr-1" />
// //             {trend}
// //           </div>
// //         )}
// //       </div>
// //       <p className="text-2xl font-bold">{value}</p>
// //       <p className="text-sm text-gray-600">{label}</p>
// //     </div>
// //   );
// // };

// // const TaskDetailsModal = ({ task, onClose }) => {
// //   if (!task) return null;
// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
// //       <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
// //         <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
// //           <X className="w-5 h-5" />
// //         </button>
// //         <h3 className="text-xl font-semibold mb-4 text-blue-700">Equipment Details</h3>
// //         <div className="space-y-2 text-sm text-gray-700">
// //           <p><strong>Name:</strong> {task.name}</p>
// //           <p><strong>Type:</strong> {task.type}</p>
// //           <p><strong>Manufacturer:</strong> {task.manufacturer}</p>
// //           <p><strong>Supplier:</strong> {task.supplier}</p>
// //           <p><strong>Model:</strong> {task.model}</p>
// //           <p><strong>Serial:</strong> {task.serial}</p>
// //           <p><strong>Asset Tag:</strong> {task.assetTag}</p>
// //           <p><strong>Status:</strong> {task.status}</p>
// //           <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Dashboard = () => {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [filterOpen, setFilterOpen] = useState(false);
// //   const [selectedFilter, setSelectedFilter] = useState('all');
// //   const [selectedTask, setSelectedTask] = useState(null);
// //   const [showModal, setShowModal] = useState(false);

// //   const [tasks, setTasks] = useState([
// //     {
// //       _id: '686f403b45f55cdf28fdbac8',
// //       name: 'asdf',
// //       type: 'asdf',
// //       manufacturer: 'asdfasdfe',
// //       supplier: 'asdfe23',
// //       model: 'adfasdf',
// //       serial: 'asd234234',
// //       assetTag: 'asdfaef',
// //       status: 'pending',
// //       createdAt: '2025-07-10T04:23:23.040+00:00',
// //     },
// //   ]);

// //   const [workSummary, setWorkSummary] = useState({
// //     pendingReviews: 1,
// //     approvedThisWeek: 0,
// //     rejectedThisWeek: 0,
// //     deviationRaised: 0,
// //   });

// //   const animateStats = useAnimation(workSummary);

// //   const filteredTasks = useMemo(() => {
// //     return tasks.filter(task => {
// //       const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                             task.type.toLowerCase().includes(searchQuery.toLowerCase());
// //       const matchesFilter = selectedFilter === 'all' || task.status.toLowerCase() === selectedFilter;
// //       return matchesSearch && matchesFilter;
// //     });
// //   }, [tasks, searchQuery, selectedFilter]);

// //   const handleTaskAction = (taskId, action) => {
// //     setTasks(prev =>
// //       prev.map(task => {
// //         if (task._id === taskId) {
// //           const updatedStatus = action === 'approve' ? 'Completed' : 'Rejected';
// //           return { ...task, status: updatedStatus };
// //         }
// //         return task;
// //       })
// //     );

// //     setWorkSummary(prev => ({
// //       ...prev,
// //       approvedThisWeek: action === 'approve' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
// //       rejectedThisWeek: action === 'reject' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
// //       pendingReviews: Math.max(0, prev.pendingReviews - 1),
// //     }));
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
// //       <div className="max-w-7xl mx-auto p-6">
// //         <SearchBar
// //           searchQuery={searchQuery}
// //           onSearchChange={setSearchQuery}
// //           onFilter={() => setFilterOpen(!filterOpen)}
// //         />

// //         {filterOpen && (
// //           <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
// //             <div className="flex gap-2 flex-wrap">
// //               {['all', 'pending', 'ongoing', 'completed', 'rejected'].map(filter => (
// //                 <button
// //                   key={filter}
// //                   onClick={() => setSelectedFilter(filter)}
// //                   className={`px-4 py-2 rounded-lg text-sm ${selectedFilter === filter
// //                     ? 'bg-blue-600 text-white'
// //                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                     }`}
// //                 >
// //                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <StatCard icon={AlertCircle} label="Pending Reviews" value={workSummary.pendingReviews} color="orange" trend="+1" />
// //           <StatCard icon={CheckCircle} label="Approved This Week" value={workSummary.approvedThisWeek} color="green" trend="+1" />
// //           <StatCard icon={XCircle} label="Rejected This Week" value={workSummary.rejectedThisWeek} color="red" trend="+1" />
// //           <StatCard icon={AlertCircle} label="Deviation Raised" value={workSummary.deviationRaised} color="yellow" trend="+0" />
// //         </div>

// //         <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
// //           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
// //             <h2 className="text-lg font-semibold">Equipment Tasks</h2>
// //             <div className="flex gap-2">
// //               <Download className="w-5 h-5 cursor-pointer text-white hover:text-gray-200" />
// //               <Plus className="w-5 h-5 cursor-pointer text-white hover:text-gray-200" />
// //             </div>
// //           </div>

// //           <table className="w-full text-sm">
// //             <thead className="bg-gray-100 text-gray-600 uppercase">
// //               <tr>
// //                 <th className="px-6 py-4 text-left">#</th>
// //                 <th className="px-6 py-4 text-left">Name</th>
// //                 <th className="px-6 py-4 text-left">Type</th>
// //                 <th className="px-6 py-4 text-left">Status</th>
// //                 <th className="px-6 py-4 text-left">Created At</th>
// //                 <th className="px-6 py-4 text-left">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredTasks.map((task, index) => (
// //                 <tr key={task._id} className="border-t hover:bg-gray-50">
// //                   <td className="px-6 py-4">{index + 1}</td>
// //                   <td className="px-6 py-4">{task.name}</td>
// //                   <td className="px-6 py-4">{task.type}</td>
// //                   <td className="px-6 py-4">
// //                     <StatusBadge status={task.status} type={task.status.toLowerCase()} />
// //                   </td>
// //                   <td className="px-6 py-4 flex items-center">
// //                     <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                     {new Date(task.createdAt).toLocaleDateString()}
// //                   </td>
// //                   <td className="px-6 py-4">
// //                     <ActionButtons
// //                       task={task}
// //                       onAction={handleTaskAction}
// //                       onView={(task) => {
// //                         setSelectedTask(task);
// //                         setShowModal(true);
// //                       }}
// //                     />
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {showModal && (
// //           <TaskDetailsModal task={selectedTask} onClose={() => setShowModal(false)} />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// 'use client';

// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle,
//   Filter, Calendar, Download, TrendingUp, BarChart3, Package, 
//   Clock, Award, Zap, Sparkles, ArrowRight, QrCode
// } from 'lucide-react';
// import BarcodeGenerator from '@/app/components/BarcodeGenerator';

// const useAnimation = (dependency) => {
//   const [animate, setAnimate] = useState(false);
//   useEffect(() => {
//     setAnimate(true);
//     const timer = setTimeout(() => setAnimate(false), 300);
//     return () => clearTimeout(timer);
//   }, [dependency]);
//   return animate;
// };

// const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => (
//   <div className="mb-8">
//     <div className="flex flex-col sm:flex-row gap-4 items-center">
//       <div className="relative flex-1 max-w-2xl">
//         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search equipment by name or type..."
//           className="w-full pl-12 pr-4 py-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-300 hover:shadow-xl text-slate-700 placeholder-slate-400"
//           value={searchQuery}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>
//       <button
//         onClick={onFilter}
//         className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl text-slate-700 hover:scale-105"
//       >
//         <Filter className="w-5 h-5" />
//         <span className="hidden sm:inline font-medium">Filter</span>
//       </button>
//     </div>
//   </div>
// );

// const StatusBadge = ({ status, type }) => {
//   const badges = {
//     completed: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
//     pending: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30',
//     rejected: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30',
//     ongoing: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30',
//   };
//   return (
//     <span className={`px-4 py-2 rounded-full text-sm font-medium ${badges[type]} border-0`}>
//       {status}
//     </span>
//   );
// };

// const ActionButtons = ({ task, onAction, onView }) => (
//   <div className="flex flex-col sm:flex-row gap-2">
//     <button 
//       onClick={() => onView(task)} 
//       className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
//     >
//       <Eye className="w-4 h-4 mr-2" /> View
//     </button>
//     <button 
//       onClick={() => onAction(task._id, 'approve')} 
//       className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
//     >
//       <Check className="w-4 h-4 mr-2" /> Approve
//     </button>
//     <button 
//       onClick={() => onAction(task._id, 'reject')} 
//       className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
//     >
//       <X className="w-4 h-4 mr-2" /> Reject
//     </button>
//   </div>
// );

// const StatCard = ({ icon: Icon, label, value, color, trend }) => {
//   const colorClasses = {
//     orange: 'from-orange-500 via-amber-500 to-yellow-500',
//     green: 'from-green-500 via-emerald-500 to-teal-500',
//     red: 'from-red-500 via-rose-500 to-pink-500',
//     yellow: 'from-yellow-500 via-amber-500 to-orange-500',
//     blue: 'from-blue-500 via-indigo-500 to-purple-500',
//   };
//   const shadowClasses = {
//     orange: 'shadow-orange-500/30',
//     green: 'shadow-green-500/30',
//     red: 'shadow-red-500/30',
//     yellow: 'shadow-yellow-500/30',
//     blue: 'shadow-blue-500/30',
//   };
  
//   return (
//     <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center shadow-lg ${shadowClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
//           <Icon className="w-7 h-7" />
//         </div>
//         {trend && (
//           <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//             <TrendingUp className="w-4 h-4 mr-1" />
//             {trend}
//           </div>
//         )}
//       </div>
//       <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
//       <p className="text-sm text-slate-600 font-medium">{label}</p>
//     </div>
//   );
// };

// const TaskDetailsModal = ({ task, onClose }) => {
//   if (!task) return null;

//   const isApproved = task.status.toLowerCase() === 'completed';

//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
//           <button 
//             onClick={onClose} 
//             className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
//           >
//             <X className="w-5 h-5" />
//           </button>
//           <div className="flex items-center mb-2">
//             <Package className="w-8 h-8 mr-3" />
//             <h3 className="text-2xl font-bold">Equipment Details</h3>
//           </div>
//           <p className="text-blue-100">Asset Information & Barcode</p>
//         </div>
        
//         <div className="p-6 space-y-6">
//           {isApproved && (
//                   <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200">
//                     <BarcodeGenerator 
//                       text={task._id}
//                       onGenerated={async (file) => {
//                         try {
//                           const result = await uploadImageToCloudinary(file);
//                           console.log('Uploaded barcode image URL:', result.url);
//                         } catch (err) {
//                           console.error('Barcode upload failed:', err);
//                         }
//                       }}
//                     />
//                     <p className="mt-3 text-sm text-slate-600 text-center">
//                       Scan this barcode to quickly identify this equipment
//                     </p>
//                   </div>
//                 )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
//                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
//                   <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
//                   Basic Information
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Name:</span>
//                     <span className="text-slate-800 font-semibold">{task.name}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Type:</span>
//                     <span className="text-slate-800 font-semibold">{task.type}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Status:</span>
//                     <StatusBadge status={task.status} type={task.status.toLowerCase()} />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
//                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
//                   <Award className="w-5 h-5 mr-2 text-green-600" />
//                   Manufacturer Details
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Manufacturer:</span>
//                     <span className="text-slate-800 font-semibold">{task.manufacturer}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Supplier:</span>
//                     <span className="text-slate-800 font-semibold">{task.supplier}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Model:</span>
//                     <span className="text-slate-800 font-semibold">{task.model}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
//                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
//                   <Zap className="w-5 h-5 mr-2 text-purple-600" />
//                   Asset Information
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Serial Number:</span>
//                     <span className="text-slate-800 font-semibold font-mono">{task.serial}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Asset Tag:</span>
//                     <span className="text-slate-800 font-semibold font-mono">{task.assetTag}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-medium">Created:</span>
//                     <span className="text-slate-800 font-semibold flex items-center">
//                       <Clock className="w-4 h-4 mr-1 text-slate-500" />
//                       {new Date(task.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
             
              
//               <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
//                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
//                   <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
//                   Quick Actions
//                 </h4>
//                 <div className="space-y-2">
//                   <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
//                     <Download className="w-4 h-4 mr-2" />
//                     Download Details
//                   </button>
//                   <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center">
//                     <Check className="w-4 h-4 mr-2" />
//                     Mark as Verified
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // const TaskDetailsModal = ({ task, onClose }) => {
// //   if (!task) return null;

// //   const isApproved = task.status.toLowerCase() === 'completed';

// //   return (
// //     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
// //       <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
// //         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
// //           <button 
// //             onClick={onClose} 
// //             className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
// //           >
// //             <X className="w-5 h-5" />
// //           </button>
// //           <div className="flex items-center mb-2">
// //             <Package className="w-8 h-8 mr-3" />
// //             <h3 className="text-2xl font-bold">Equipment Details</h3>
// //           </div>
// //           <p className="text-blue-100">Asset Information & Barcode</p>
// //         </div>
        
// //         <div className="p-6 space-y-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="space-y-4">
// //               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
// //                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
// //                   <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
// //                   Basic Information
// //                 </h4>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Name:</span>
// //                     <span className="text-slate-800 font-semibold">{task.name}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Type:</span>
// //                     <span className="text-slate-800 font-semibold">{task.type}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Status:</span>
// //                     <StatusBadge status={task.status} type={task.status.toLowerCase()} />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
// //                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
// //                   <Award className="w-5 h-5 mr-2 text-green-600" />
// //                   Manufacturer Details
// //                 </h4>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Manufacturer:</span>
// //                     <span className="text-slate-800 font-semibold">{task.manufacturer}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Supplier:</span>
// //                     <span className="text-slate-800 font-semibold">{task.supplier}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Model:</span>
// //                     <span className="text-slate-800 font-semibold">{task.model}</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
// //                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
// //                   <Zap className="w-5 h-5 mr-2 text-purple-600" />
// //                   Asset Information
// //                 </h4>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Serial Number:</span>
// //                     <span className="text-slate-800 font-semibold font-mono">{task.serial}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Asset Tag:</span>
// //                     <span className="text-slate-800 font-semibold font-mono">{task.assetTag}</span>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-slate-600 font-medium">Created:</span>
// //                     <span className="text-slate-800 font-semibold flex items-center">
// //                       <Clock className="w-4 h-4 mr-1 text-slate-500" />
// //                       {new Date(task.createdAt).toLocaleDateString()}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="space-y-4">
// //             {/* {isApproved && (
// //   <BarcodeGenerator text={task._id} />
// // )} */}




              
// //               <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
// //                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
// //                   <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
// //                   Quick Actions
// //                 </h4>
// //                 {isApproved && (
// //   <BarcodeGenerator
// //     text={task._id}
// //     onGenerated={async (file) => {
// //       try {
// //         const result = await uploadImageToCloudinary(file);
// //         console.log('Uploaded barcode image URL:', result.url);

     
// //       } catch (err) {
// //         console.error('Barcode upload failed:', err);
// //       }
// //     }}
// //   />
// // )}
// //                 <div className="space-y-2">
// //                   <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
// //                     <Download className="w-4 h-4 mr-2" />
// //                     Download Details
// //                   </button>
// //                   <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center">
// //                     <Check className="w-4 h-4 mr-2" />
// //                     Mark as Verified
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// const uploadImageToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     try {
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

// const Dashboard = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [tasks, setTasks] = useState([]);
 

//   useEffect(()=>{

//     const fetchData=async()=>{
//       const res=await fetch('/api/equipment/fetchAll')
//       const data =await res.json();
//       console.log("d",data.data)
//       setTasks(data.data)
//     }

//     fetchData();

//   },[])
//   const [workSummary, setWorkSummary] = useState({
//     pendingReviews: 1,
//     approvedThisWeek: 5,
//     rejectedThisWeek: 2,
//     deviationRaised: 1,
//   });

//   const animateStats = useAnimation(workSummary);

//   const filteredTasks = useMemo(() => {
//     return tasks.filter(task => {
//       const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             task.type.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesFilter = selectedFilter === 'all' || task.status.toLowerCase() === selectedFilter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [tasks, searchQuery, selectedFilter]);

  
//   const handleTaskAction = (taskId, action) => {
//   const updatedTasks = tasks.map(task => {
//     if (task._id === taskId) {
//       const updatedStatus = action === 'approve' ? 'completed' : 'rejected';
//       return { ...task, status: updatedStatus };
//     }
//     return task;
//   });

//   setTasks(updatedTasks);

//   setWorkSummary(prev => ({
//     ...prev,
//     approvedThisWeek: action === 'approve' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
//     rejectedThisWeek: action === 'reject' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
//     pendingReviews: Math.max(0, prev.pendingReviews - 1),
//   }));

//   if (action === 'approve') {
//     const approvedTask = updatedTasks.find(task => task._id === taskId);
//     setSelectedTask(approvedTask); // updated task with 'completed' status
//     setShowModal(true);
//   }
// };

  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-slate-800 mb-2">Equipment Dashboard</h1>
//           <p className="text-slate-600">Manage and monitor your equipment assets</p>
//         </div>

//         <SearchBar
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           onFilter={() => setFilterOpen(!filterOpen)}
//         />

//         {filterOpen && (
//           <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
//             <div className="flex gap-2 flex-wrap">
//               {['all', 'pending', 'ongoing', 'completed', 'rejected'].map(filter => (
//                 <button
//                   key={filter}
//                   onClick={() => setSelectedFilter(filter)}
//                   className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
//                     selectedFilter === filter
//                       ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
//                       : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
//                   }`}
//                 >
//                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard icon={AlertCircle} label="Pending Reviews" value={workSummary.pendingReviews} color="orange" trend="+2%" />
//           <StatCard icon={CheckCircle} label="Approved This Week" value={workSummary.approvedThisWeek} color="green" trend="+12%" />
//           <StatCard icon={XCircle} label="Rejected This Week" value={workSummary.rejectedThisWeek} color="red" trend="+5%" />
//           <StatCard icon={AlertCircle} label="Deviation Raised" value={workSummary.deviationRaised} color="yellow" trend="+0%" />
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-6 flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold mb-1">Equipment Tasks</h2>
//               <p className="text-blue-100">Monitor and manage equipment lifecycle</p>
//             </div>
//             <div className="flex gap-3">
//               <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 hover:scale-105">
//                 <Download className="w-5 h-5" />
//               </button>
//               <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 hover:scale-105">
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700">
//                 <tr>
//                   <th className="px-6 py-4 text-left font-semibold">#</th>
//                   <th className="px-6 py-4 text-left font-semibold">Name</th>
//                   <th className="px-6 py-4 text-left font-semibold">Type</th>
//                   <th className="px-6 py-4 text-left font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left font-semibold">Created At</th>
//                   <th className="px-6 py-4 text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTasks.map((task, index) => (
//                   <tr key={task._id} className="border-t border-slate-200 hover:bg-slate-50/80 transition-all duration-200">
//                     <td className="px-6 py-4 font-medium text-slate-600">{index + 1}</td>
//                     <td className="px-6 py-4 font-semibold text-slate-800">{task.name}</td>
//                     <td className="px-6 py-4 text-slate-600">{task.type}</td>
//                     <td className="px-6 py-4">
//                       <StatusBadge status={task.status} type={task.status.toLowerCase()} />
//                     </td>
//                     <td className="px-6 py-4 flex items-center text-slate-600">
//                       <Calendar className="w-4 h-4 mr-2 text-slate-400" />
//                       {new Date(task.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <ActionButtons
//                         task={task}
//                         onAction={handleTaskAction}
//                         onView={(task) => {
//                           setSelectedTask(task);
//                           setShowModal(true);
//                         }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {showModal && (
//           <TaskDetailsModal task={selectedTask} onClose={() => setShowModal(false)} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle,
  Filter, Calendar, Download, TrendingUp, BarChart3, Package, 
  Clock, Award, Zap, Sparkles, ArrowRight, QrCode
} from 'lucide-react';
import BarcodeGenerator from '@/app/components/BarcodeGenerator';

const useAnimation = (dependency) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [dependency]);
  return animate;
};

const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => (
  <div className="mb-8">
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search equipment by name or type..."
          className="w-full pl-12 pr-4 py-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-lg transition-all duration-300 hover:shadow-xl text-slate-700 placeholder-slate-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl text-slate-700 hover:scale-105"
      >
        <Filter className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Filter</span>
      </button>
    </div>
  </div>
);

const StatusBadge = ({ status, type }) => {
  const badges = {
    approved: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
    pending: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30',
    rejected: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30',
    ongoing: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30',
  };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium ${badges[type]} border-0`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ task, onAction, onView }) => (
  <div className="flex flex-col sm:flex-row gap-2">
    <button 
      onClick={() => onView(task)} 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
    >
      <Eye className="w-4 h-4 mr-2" /> View
    </button>
    <button 
      onClick={() => onAction(task._id, 'approve')} 
      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
    >
      <Check className="w-4 h-4 mr-2" /> Approve
    </button>
    <button 
      onClick={() => onAction(task._id, 'reject')} 
      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
    >
      <X className="w-4 h-4 mr-2" /> Reject
    </button>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colorClasses = {
    orange: 'from-orange-500 via-amber-500 to-yellow-500',
    green: 'from-green-500 via-emerald-500 to-teal-500',
    red: 'from-red-500 via-rose-500 to-pink-500',
    yellow: 'from-yellow-500 via-amber-500 to-orange-500',
    blue: 'from-blue-500 via-indigo-500 to-purple-500',
  };
  const shadowClasses = {
    orange: 'shadow-orange-500/30',
    green: 'shadow-green-500/30',
    red: 'shadow-red-500/30',
    yellow: 'shadow-yellow-500/30',
    blue: 'shadow-blue-500/30',
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center shadow-lg ${shadowClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </div>
  );
};

const TaskDetailsModal = ({ task, onClose, onBarcodeUpload }) => {
  if (!task) return null;

  const isApproved = task.status.toLowerCase() === 'approved';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center mb-2">
            <Package className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Equipment Details</h3>
          </div>
          <p className="text-blue-100">Asset Information & Barcode</p>
        </div>
        
        <div className="p-6 space-y-6">
          {isApproved && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200">
              {!task.barcodeUrl ? (
                <>
                  <BarcodeGenerator 
                    text={task._id}
                    onGenerated={onBarcodeUpload}
                  />
                  <p className="mt-3 text-sm text-slate-600 text-center">
                    Scan this barcode to quickly identify this equipment
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">Barcode already generated</p>
                  <img src={task.barcodeUrl} alt="Equipment barcode" className="mx-auto max-w-full h-auto" />
                  <p className="mt-2 text-sm text-slate-600">Scan this barcode to identify the equipment</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Name:</span>
                    <span className="text-slate-800 font-semibold">{task.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Type:</span>
                    <span className="text-slate-800 font-semibold">{task.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Status:</span>
                    <StatusBadge status={task.status} type={task.status.toLowerCase()} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Manufacturer Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Manufacturer:</span>
                    <span className="text-slate-800 font-semibold">{task.manufacturer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Supplier:</span>
                    <span className="text-slate-800 font-semibold">{task.supplier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Model:</span>
                    <span className="text-slate-800 font-semibold">{task.model}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Asset Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Serial Number:</span>
                    <span className="text-slate-800 font-semibold font-mono">{task.serial}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Asset Tag:</span>
                    <span className="text-slate-800 font-semibold font-mono">{task.assetTag}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Created:</span>
                    <span className="text-slate-800 font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-500" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Details
                  </button>
                  {isApproved && !task.barcodeUrl && (
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate Barcode
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    deviationRaised: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/equipment/fetchAll');
        if (!res.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await res.json();

       const pendingTasks = data.data.filter(
        (t) => t.status?.toLowerCase() === 'pending'
      );

      setTasks(pendingTasks);
        
        // Calculate summary stats
        const pending = data.data.filter(t => t.status.toLowerCase() === 'pending').length;
        const approved = data.data.filter(t => t.status.toLowerCase() === 'approved').length;
        const rejected = data.data.filter(t => t.status.toLowerCase() === 'rejected').length;
        
        setWorkSummary({
          pendingReviews: pending,
          approvedThisWeek: approved,
          rejectedThisWeek: rejected,
          deviationRaised: 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || task.status.toLowerCase() === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, selectedFilter]);

  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const updateEquipmentStatus = async (equipmentId, status) => {
    try {
      const response = await fetch('/api/equipment/updateStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId,
          status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating equipment status:', error);
      throw error;
    }
  };

  const updateEquipmentWithBarcode = async (equipmentId, barcodeUrl) => {
    try {
      const response = await fetch('/api/equipment/updateBarcode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId,
          barcodeUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment with barcode');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  };

  const handleBarcodeUpload = async (file) => {
    try {
      if (!selectedTask) return;
      
      // Upload barcode image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file);
      console.log('Uploaded barcode image URL:', uploadResult.url);

      // Update equipment record with barcode URL
      await updateEquipmentWithBarcode(selectedTask._id, uploadResult.url);

      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === selectedTask._id 
            ? { ...task, barcodeUrl: uploadResult.url } 
            : task
        )
      );

    } catch (err) {
      console.error('Barcode upload/update failed:', err);
      setError('Failed to upload barcode. Please try again.');
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      setLoading(true);
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // First update the status in the database
      const updatedEquipment = await updateEquipmentStatus(taskId, newStatus);

      // Then update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus } 
            : task
        )
      );

      setWorkSummary(prev => ({
        ...prev,
        approvedThisWeek: action === 'approve' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
        rejectedThisWeek: action === 'reject' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
        pendingReviews: action === 'approve' || action === 'reject' ? Math.max(0, prev.pendingReviews - 1) : prev.pendingReviews,
      }));

      if (action === 'approve') {
        const approvedTask = tasks.find(task => task._id === taskId);
        setSelectedTask({ ...approvedTask, status: newStatus });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating equipment status:', error);
      setError(`Failed to ${action} equipment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = useAnimation(workSummary);

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-700">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Equipment Dashboard</h1>
          <p className="text-slate-600">Manage and monitor your equipment assets</p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilter={() => setFilterOpen(!filterOpen)}
        />

        {filterOpen && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'ongoing', 'approved', 'rejected'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={AlertCircle} label="Pending Reviews" value={workSummary.pendingReviews} color="orange" trend="+2%" />
          <StatCard icon={CheckCircle} label="Approved This Week" value={workSummary.approvedThisWeek} color="green" trend="+12%" />
          <StatCard icon={XCircle} label="Rejected This Week" value={workSummary.rejectedThisWeek} color="red" trend="+5%" />
          <StatCard icon={AlertCircle} label="Deviation Raised" value={workSummary.deviationRaised} color="yellow" trend="+0%" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Equipment Tasks</h2>
              <p className="text-blue-100">Monitor and manage equipment lifecycle</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                <Download className="w-5 h-5" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr key={task._id} className="border-t border-slate-200 hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-6 py-4 font-medium text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{task.name}</td>
                      <td className="px-6 py-4 text-slate-600">{task.type}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} type={task.status.toLowerCase()} />
                      </td>
                      <td className="px-6 py-4 flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <ActionButtons
                          task={task}
                          onAction={handleTaskAction}
                          onView={(task) => {
                            setSelectedTask(task);
                            setShowModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No equipment found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <TaskDetailsModal 
            task={selectedTask} 
            onClose={() => setShowModal(false)}
            onBarcodeUpload={handleBarcodeUpload}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;