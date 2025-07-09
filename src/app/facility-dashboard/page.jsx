// // 'use client';
// //  import React, { useState } from 'react';
// // import { Search, Plus, ChevronDown, Eye } from 'lucide-react';
// // import { useRouter } from 'next/navigation';
// // const SOPDashboard = () => {
// //   const router=useRouter();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [expandedSection, setExpandedSection] = useState(true);
// // const handleCreate=()=>{
// //   router.push("/facility-dashboard/create-sop")
// // }
// //   const sopData = [
// //     {
// //       id: 'PRO-CLN-001',
// //       name: 'Machine Cleaning : Model No. MACH001234',
// //       assignedTo: null,
// //       status: 'Drafting',
// //       dateCreated: '01-07-2025',
// //       statusColor: 'bg-blue-100 text-blue-800'
// //     },
// //     {
// //       id: 'PRO-CLN-002',
// //       name: 'Machine Cleaning : Model No. MACH001432',
// //       assignedTo: null,
// //       status: 'Under Internal Review',
// //       dateCreated: '03-07-2025',
// //       statusColor: 'bg-orange-100 text-orange-800'
// //     },
// //     {
// //       id: 'PRO-CLN-003',
// //       name: 'Machine Cleaning : Model No. MACH001342',
// //       assignedTo: null,
// //       status: 'Approved',
// //       dateCreated: '30-06-2025',
// //       statusColor: 'bg-green-100 text-green-800'
// //     },
// //     {
// //       id: 'PRO-CLN-004',
// //       name: 'Machine Cleaning : Model No. MACH001342',
// //       assignedTo: ['PM', 'BN', 'DR'],
// //       status: 'Activation/Distribution',
// //       dateCreated: '01-07-2025',
// //       statusColor: 'bg-purple-100 text-purple-800'
// //     }
// //   ];

// //   const filteredSOPs = sopData.filter(sop =>
// //     sop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     sop.id.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const AssignedUsers = ({ users }) => {
// //     if (!users || users.length === 0) {
// //       return <span className="text-gray-500">—</span>;
// //     }

// //     const colors = ['bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
    
// //     return (
// //       <div className="flex space-x-1">
// //         {users.map((user, index) => (
// //           <div
// //             key={index}
// //             className={`w-8 h-8 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-medium`}
// //           >
// //             {user}
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
        
// //           {/* Search Bar */}
// //           <div className="relative mb-6">
// //             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //             <input
// //               type="text"
// //               placeholder="Quick search any Prototype by it's name..."
// //               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>

// //           {/* Create New SOP Button */}
// //           <button onClick={handleCreate} className="w-150 ml-45 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
// //             <Plus className="w-5 h-5" />
// //             <span>Create New Prototype</span>
// //           </button>
// //         </div>

// //         {/* Created SOPs Section */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //           <div
// //             className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
// //             onClick={() => setExpandedSection(!expandedSection)}
// //           >
// //             <h2 className="text-lg font-semibold text-gray-900">Created Prototype's</h2>
// //             <ChevronDown
// //               className={`w-5 h-5 text-gray-500 transition-transform ${
// //                 expandedSection ? 'rotate-180' : ''
// //               }`}
// //             />
// //           </div>

// //           {expandedSection && (
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Prototype No.
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Prototype Name
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Assigned To
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Status
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Date Created
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Action
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {filteredSOPs.map((sop) => (
// //                     <tr key={sop.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                         {sop.id}
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         {sop.name}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <AssignedUsers users={sop.assignedTo} />
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span
// //                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sop.statusColor}`}
// //                         >
// //                           {sop.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                         {sop.dateCreated}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <button className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors">
// //                           <Eye className="w-4 h-4 mr-2" />
// //                           View Details
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>

// //         {/* Empty State */}
// //         {filteredSOPs.length === 0 && (
// //           <div className="text-center py-12">
// //             <div className="text-gray-500">
// //               <Search className="w-12 h-12 mx-auto mb-4" />
// //               <p>No SOPs found matching your search criteria.</p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SOPDashboard;



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Search, Plus, ChevronDown, Eye, Filter, Calendar, Users, FileText, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

// const SOPDashboard = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedSection, setExpandedSection] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleCreate = () => {
//     // router.push("/facility-dashboard/create-sop")
//     console.log('Navigate to create SOP');
//   };

//   const sopData = [
//     {
//       id: 'PRO-CLN-001',
//       name: 'Machine Cleaning : Model No. MACH001234',
//       assignedTo: null,
//       status: 'Drafting',
//       dateCreated: '01-07-2025',
//       statusColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
//       priority: 'medium',
//       progress: 25
//     },
//     {
//       id: 'PRO-CLN-002',
//       name: 'Machine Cleaning : Model No. MACH001432',
//       assignedTo: null,
//       status: 'Under Internal Review',
//       dateCreated: '03-07-2025',
//       statusColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
//       priority: 'high',
//       progress: 60
//     },
//     {
//       id: 'PRO-CLN-003',
//       name: 'Machine Cleaning : Model No. MACH001342',
//       assignedTo: null,
//       status: 'Approved',
//       dateCreated: '30-06-2025',
//       statusColor: 'bg-gradient-to-r from-green-500 to-green-600',
//       priority: 'low',
//       progress: 100
//     },
//     {
//       id: 'PRO-CLN-004',
//       name: 'Machine Cleaning : Model No. MACH001342',
//       assignedTo: ['PM', 'BN', 'DR'],
//       status: 'Activation/Distribution',
//       dateCreated: '01-07-2025',
//       statusColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
//       priority: 'high',
//       progress: 85
//     }
//   ];

//   const filteredSOPs = sopData.filter(sop => {
//     const matchesSearch = sop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          sop.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = selectedFilter === 'all' || sop.status.toLowerCase().includes(selectedFilter.toLowerCase());
//     return matchesSearch && matchesFilter;
//   });

//   const statusIcons = {
//     'Drafting': Clock,
//     'Under Internal Review': AlertCircle,
//     'Approved': CheckCircle,
//     'Activation/Distribution': Users
//   };

//   const AssignedUsers = ({ users }) => {
//     if (!users || users.length === 0) {
//       return (
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//             <Users className="w-4 h-4 text-gray-400" />
//           </div>
//           <span className="text-sm text-gray-500">Unassigned</span>
//         </div>
//       );
//     }

//     const colors = ['bg-gradient-to-r from-orange-400 to-orange-500', 'bg-gradient-to-r from-green-400 to-green-500', 'bg-gradient-to-r from-blue-400 to-blue-500', 'bg-gradient-to-r from-purple-400 to-purple-500'];
    
//     return (
//       <div className="flex items-center space-x-2">
//         <div className="flex -space-x-2">
//           {users.slice(0, 3).map((user, index) => (
//             <div
//               key={index}
//               className={`w-8 h-8 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm transition-transform hover:scale-110`}
//             >
//               {user}
//             </div>
//           ))}
//           {users.length > 3 && (
//             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-white">
//               +{users.length - 3}
//             </div>
//           )}
//         </div>
//         <span className="text-sm text-gray-600">{users.length} assigned</span>
//       </div>
//     );
//   };

//   const ProgressBar = ({ progress, status }) => (
//     <div className="w-full bg-gray-200 rounded-full h-2">
//       <div 
//         className={`h-2 rounded-full transition-all duration-1000 ease-out ${
//           status === 'Approved' ? 'bg-green-500' : 
//           status === 'Under Internal Review' ? 'bg-orange-500' : 
//           status === 'Activation/Distribution' ? 'bg-purple-500' : 'bg-blue-500'
//         }`}
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   );

//   const stats = [
//     { label: 'Total Prototypes', value: sopData.length, icon: FileText, color: 'bg-blue-500' },
//     { label: 'Approved', value: sopData.filter(s => s.status === 'Approved').length, icon: CheckCircle, color: 'bg-green-500' },
//     { label: 'In Review', value: sopData.filter(s => s.status === 'Under Internal Review').length, icon: AlertCircle, color: 'bg-orange-500' },
//     { label: 'Drafting', value: sopData.filter(s => s.status === 'Drafting').length, icon: Clock, color: 'bg-gray-500' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header with Animation */}
//         <div className={`mb-8 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
//           <div className="flex items-center space-x-3 mb-6">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//               Prototype Dashboard
//             </h1>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             {stats.map((stat, index) => (
//               <div 
//                 key={stat.label}
//                 className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
//                 style={{ transitionDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
//                     <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                   </div>
//                   <div className={`p-3 rounded-lg ${stat.color}`}>
//                     <stat.icon className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Search and Filter Bar */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search prototypes by name or ID..."
//                 className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <div className="flex gap-3">
//               <div className="relative">
//                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <select
//                   className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[140px]"
//                   value={selectedFilter}
//                   onChange={(e) => setSelectedFilter(e.target.value)}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="drafting">Drafting</option>
//                   <option value="review">Under Review</option>
//                   <option value="approved">Approved</option>
//                 </select>
//               </div>
              
//               <button 
//                 onClick={handleCreate}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 <Plus className="w-5 h-5" />
//                 <span>Create New Prototype</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
//           <div
//             className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
//             onClick={() => setExpandedSection(!expandedSection)}
//           >
//             <div className="flex items-center space-x-3">
//               <h2 className="text-xl font-semibold text-gray-900">Created Prototypes</h2>
//               <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
//                 {filteredSOPs.length}
//               </span>
//             </div>
//             <ChevronDown
//               className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
//                 expandedSection ? 'rotate-180' : ''
//               }`}
//             />
//           </div>

//           {expandedSection && (
//             <div className="overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Prototype Details
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Assigned Team
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Status & Progress
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Created
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {filteredSOPs.map((sop, index) => {
//                       const StatusIcon = statusIcons[sop.status] || FileText;
//                       return (
//                         <tr 
//                           key={sop.id} 
//                           className={`hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
//                           style={{ transitionDelay: `${(index + 1) * 100}ms` }}
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center space-x-3">
//                               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                                 <FileText className="w-5 h-5 text-white" />
//                               </div>
//                               <div>
//                                 <p className="text-sm font-semibold text-gray-900">{sop.id}</p>
//                                 <p className="text-sm text-gray-600">{sop.name}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <AssignedUsers users={sop.assignedTo} />
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-2">
//                               <div className="flex items-center space-x-2">
//                                 <StatusIcon className="w-4 h-4 text-gray-500" />
//                                 <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${sop.statusColor}`}>
//                                   {sop.status}
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <ProgressBar progress={sop.progress} status={sop.status} />
//                                 <span className="text-xs text-gray-500 min-w-[40px]">{sop.progress}%</span>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center space-x-2">
//                               <Calendar className="w-4 h-4 text-gray-400" />
//                               <span className="text-sm text-gray-900">{sop.dateCreated}</span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
//                               <Eye className="w-4 h-4 mr-2" />
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Empty State */}
//         {filteredSOPs.length === 0 && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No prototypes found</h3>
//               <p className="text-gray-600 mb-6">No prototypes match your search criteria. Try adjusting your filters.</p>
//               <button 
//                 onClick={handleCreate}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
//               >
//                 Create First Prototype
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SOPDashboard;



'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, Users, FileText, CheckCircle, Clock, AlertCircle, Sparkles, MoreVertical, Download, Share2, Edit3, Zap, TrendingUp, Activity, ArrowRight, Target, Layers, Workflow } from 'lucide-react';
import { useRouter } from 'next/navigation';
const SOPDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [mounted, setMounted] = useState(false);
const router=useRouter()
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreate = () => {
    router.push("/facility-dashboard/create-sop")
  };

  const sopData = [
    {
      id: 'PRO-CLN-001',
      name: 'Machine Cleaning Protocol',
      description: 'Advanced cleaning procedures for Model MACH001234',
      assignedTo: ['PM', 'BN'],
      status: 'Drafting',
      dateCreated: '01-07-2025',
      priority: 'medium',
      progress: 25,
      category: 'Maintenance',
      estimatedCompletion: '15-07-2025',
      lastActivity: '2 hours ago',
      steps: 12,
      completedSteps: 3
    },
    {
      id: 'PRO-CLN-002',
      name: 'Quality Control System',
      description: 'Comprehensive QC for Model MACH001432',
      assignedTo: ['DR', 'SM'],
      status: 'Under Internal Review',
      dateCreated: '03-07-2025',
      priority: 'high',
      progress: 60,
      category: 'Quality',
      estimatedCompletion: '10-07-2025',
      lastActivity: '1 day ago',
      steps: 8,
      completedSteps: 5
    },
    {
      id: 'PRO-CLN-003',
      name: 'Safety Protocol Enhancement',
      description: 'Updated safety measures for Model MACH001342',
      assignedTo: ['JS', 'KL', 'MN'],
      status: 'Approved',
      dateCreated: '30-06-2025',
      priority: 'critical',
      progress: 100,
      category: 'Safety',
      estimatedCompletion: '05-07-2025',
      lastActivity: '3 days ago',
      steps: 15,
      completedSteps: 15
    },
    {
      id: 'PRO-CLN-004',
      name: 'Distribution Framework',
      description: 'Automated distribution system setup',
      assignedTo: ['PM', 'BN', 'DR', 'TY'],
      status: 'Activation/Distribution',
      dateCreated: '01-07-2025',
      priority: 'high',
      progress: 85,
      category: 'Operations',
      estimatedCompletion: '08-07-2025',
      lastActivity: '4 hours ago',
      steps: 10,
      completedSteps: 8
    },
    {
      id: 'PRO-CLN-005',
      name: 'Performance Optimization',
      description: 'System performance enhancement protocols',
      assignedTo: ['XY', 'ZA'],
      status: 'Planning',
      dateCreated: '04-07-2025',
      priority: 'low',
      progress: 10,
      category: 'Performance',
      estimatedCompletion: '20-07-2025',
      lastActivity: '6 hours ago',
      steps: 20,
      completedSteps: 2
    },
    {
      id: 'PRO-CLN-006',
      name: 'Data Migration Protocol',
      description: 'Secure data transfer and backup procedures',
      assignedTo: ['AB', 'CD', 'EF'],
      status: 'Testing',
      dateCreated: '02-07-2025',
      priority: 'medium',
      progress: 75,
      category: 'Data',
      estimatedCompletion: '12-07-2025',
      lastActivity: '1 hour ago',
      steps: 6,
      completedSteps: 4
    }
  ];

  const statusConfig = {
    'Drafting': { color: '#3B82F6', icon: Edit3, gradient: 'from-blue-500 to-cyan-500' },
    'Under Internal Review': { color: '#F59E0B', icon: AlertCircle, gradient: 'from-orange-500 to-red-500' },
    'Approved': { color: '#10B981', icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
    'Activation/Distribution': { color: '#8B5CF6', icon: Zap, gradient: 'from-purple-500 to-pink-500' },
    'Planning': { color: '#6B7280', icon: Clock, gradient: 'from-gray-500 to-slate-500' },
    'Testing': { color: '#6366F1', icon: Activity, gradient: 'from-indigo-500 to-blue-500' }
  };

  const categoryIcons = {
    'Maintenance': Workflow,
    'Quality': Target,
    'Safety': AlertCircle,
    'Operations': Layers,
    'Performance': TrendingUp,
    'Data': FileText
  };

  const filteredSOPs = sopData.filter(sop => {
    const matchesSearch = sop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || sop.status.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const TeamAvatars = ({ users, size = 'sm' }) => {
    const colors = ['from-pink-400 to-pink-600', 'from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600'];
    const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
    
    return (
      <div className="flex -space-x-1">
        {users.slice(0, 4).map((user, index) => (
          <div
            key={index}
            className={`${sizeClasses} rounded-full bg-gradient-to-r ${colors[index % colors.length]} flex items-center justify-center text-white font-bold border-2 border-white shadow-sm`}
          >
            {user}
          </div>
        ))}
        {users.length > 4 && (
          <div className={`${sizeClasses} rounded-full bg-gray-400 flex items-center justify-center text-white font-bold border-2 border-white text-xs`}>
            +{users.length - 4}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className={`bg-white border-b border-gray-100 shadow-sm transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Prototype Workspace
                  </h1>
                  <p className="text-gray-600 mt-1">Manage and track your development processes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-6 bg-gray-50 rounded-2xl px-6 py-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{filteredSOPs.length}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{filteredSOPs.filter(s => s.status === 'Approved').length}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{filteredSOPs.filter(s => s.status === 'Under Internal Review').length}</div>
                    <div className="text-xs text-gray-500">Review</div>
                  </div>
                </div>
                
                <button 
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Prototype</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className={`bg-white border-b border-gray-100 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search prototypes..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-sm"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="drafting">Drafting</option>
                  <option value="review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Timeline/List View */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredSOPs.length > 0 ? (
            <div className="space-y-4">
              {filteredSOPs.map((sop, index) => {
                const status = statusConfig[sop.status];
                const StatusIcon = status.icon;
                const CategoryIcon = categoryIcons[sop.category];

                

                return (
                   <div 
      key={sop.id}
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-gray-200 cursor-pointer ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => setSelectedPrototype(selectedPrototype === sop.id ? null : sop.id)}
    >
      {/* Completed Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className={`h-full bg-gradient-to-r ${status.gradient} transition-all duration-1000 ease-out`}
          style={{ width: `100%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          {/* Left side: Icon + Info */}
          <div className="flex items-center space-x-4">
            {/* Status Icon */}
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${status.color}15` }}
            >
              <StatusIcon className="w-6 h-6" style={{ color: status.color }} />
            </div>

            {/* Description and ID */}
            <div>
              <p className="text-gray-800 font-medium">{sop.description}</p>
              <p className="text-gray-500 text-sm mt-1">{sop.id}</p>
            </div>
          </div>

          {/* Right side: Date Created */}
          <div className="text-sm text-gray-500">
            Created on: <span className="font-medium text-gray-700">{sop.dateCreated}</span>
          </div>
        </div>
      </div>
    </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No prototypes found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new prototype.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedFilter('all');}}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button 
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Create New Prototype
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOPDashboard;