
// // // 'use client';

// // // import React, { useEffect, useState } from 'react';
// // // import { Plus, Package, Users, X, Trash2, Eye, Search, CheckCircle, Sparkles } from 'lucide-react';

// // // export default function AssignEquipmentPage() {
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(true); // Changed to true initially
// // //   const [equipment, setEquipment] = useState(null);
// // //   const [assignee, setAssignee] = useState(null);
// // //   const [equipmentList, setEquipmentList] = useState([]);
// // //   const [prototypeList, setPrototypeList] = useState([]);
// // //   const [assigndata, setAssignData] = useState([]);
// // //   const [companyData, setCompanyData] = useState();
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('All Statuses');
// // //   const [deleteModal, setDeleteModal] = useState({
// // //     isOpen: false,
// // //     assignmentId: null,
// // //   });
// // //   const [approvalModal, setApprovalModal] = useState({
// // //     isOpen: false,
// // //     assignment: null,
// // //   });
// // //   const [approvalLoading, setApprovalLoading] = useState(false);
// // //   // Filter assignments based on search term and status filter
// // //   const filteredAssignments = isLoading ? [] : assigndata.filter(assignment => {
// // //     const matchesSearch =
// // //       assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase());

// // //     const matchesStatus =
// // //       statusFilter === 'All Statuses' ||
// // //       assignment.status?.toLowerCase() === statusFilter.toLowerCase();

// // //     return matchesSearch && matchesStatus;
// // //   });
// // //   const handleDeleteClick = (assignmentId) => {
// // //     setDeleteModal({
// // //       isOpen: true,
// // //       assignmentId,
// // //     });
// // //   };

// // //   const confirmDeleteAssignment = async () => {
// // //     if (!deleteModal.assignmentId) return;

// // //     try {
// // //       setIsLoading(true);
// // //       const res = await fetch(`/api/assignment/delete/${deleteModal.assignmentId}`, {
// // //         method: 'DELETE',
// // //       });

// // //       if (res.ok) {
// // //         await fetchAssignment(); // Refresh the list
// // //       }
// // //     } catch (error) {
// // //       console.error('Error deleting assignment:', error);
// // //     } finally {
// // //       setIsLoading(false);
// // //       setDeleteModal({ isOpen: false, assignmentId: null });
// // //     }
// // //   };
// // //   const handleAssign = async () => {
// // //     const generatedId = `A-${Date.now()}`;
// // //     const payload = {
// // //       generatedId,
// // //       equipment: equipment,
// // //       prototype: assignee,
// // //       companyId: companyData.companyId,
// // //       userId: companyData.id,
// // //     };

// // //     try {
// // //       setIsLoading(true);
// // //       const res = await fetch('/api/assignment/create', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(payload),
// // //       });

// // //       const result = await res.json();

// // //       if (!res.ok || !result.success) {
// // //         throw new Error(result.message || 'Failed to assign equipment');
// // //       }

// // //       setIsModalOpen(false);
// // //       setEquipment(null);
// // //       setAssignee(null);
// // //       await fetchAssignment(); // Refresh the assignment data
// // //     } catch (error) {
// // //       console.error('Error while assigning equipment:', error);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleSendForApproval = (assignment) => {
// // //     setApprovalModal({
// // //       isOpen: true,
// // //       assignment,
// // //     });
// // //   };
// // //   const confirmApproval = async () => {
// // //     if (!approvalModal.assignment) return;

// // //     try {
// // //       setApprovalLoading(true);
// // //       const res = await fetch(`/api/assignment/update/${approvalModal.assignment._id}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ status: 'Pending Approval' }),
// // //       });

// // //       const result = await res.json();

// // //       if (!res.ok || !result.success) {
// // //         throw new Error(result.message || 'Failed to update status');
// // //       }

// // //       await fetchAssignment(); // Refresh the assignment data
// // //       setApprovalModal({ isOpen: false, assignment: null });
// // //     } catch (error) {
// // //       console.error('Error while updating assignment status:', error);
// // //     } finally {
// // //       setApprovalLoading(false);
// // //     }
// // //   };

// // //   const fetchAssignment = async () => {
// // //     try {
// // //       const res = await fetch('/api/assignment/fetchAll');
// // //       const data = await res.json();
// // //       const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId);
// // //       setAssignData(filteredData);
// // //     } catch (error) {
// // //       console.error('Error fetching assignments:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const userData = localStorage.getItem('user');
// // //     const data = JSON.parse(userData);
// // //     console.log(data);
// // //     setCompanyData(data);
// // //   }, []);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setIsLoading(true);
// // //         const [equipmentRes, prototypesRes] = await Promise.all([
// // //           fetch('/api/equipment/fetchAll'),
// // //           fetch('/api/checklistapi/fetchAll')
// // //         ]);

// // //         const [equipmentData, prototypesData] = await Promise.all([
// // //           equipmentRes.json(),
// // //           prototypesRes.json()
// // //         ]);

// // //         const approvedEquipments = equipmentData.data.filter(e => e.status === 'Approved' && e.companyId === companyData?.companyId);
// // //         setEquipmentList(approvedEquipments);

// // //         const filteredPrototypes = prototypesData.data.filter((t) => t.status === 'Approved' && t.companyId === companyData?.companyId);
// // //         setPrototypeList(filteredPrototypes);

// // //         await fetchAssignment();
// // //       } catch (error) {
// // //         console.error('Error fetching data:', error);
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     if (companyData) {
// // //       fetchData();
// // //     }
// // //   }, [companyData]);

// // //   const handleDeleteAssignment = async (assignmentId) => {
// // //     if (window.confirm('Are you sure you want to delete this assignment?')) {
// // //       try {
// // //         setIsLoading(true);
// // //         const res = await fetch(`/api/assignment/delete/${assignmentId}`, {
// // //           method: 'DELETE',
// // //         });

// // //         if (res.ok) {
// // //           await fetchAssignment(); // Refresh the list
// // //         }
// // //       } catch (error) {
// // //         console.error('Error deleting assignment:', error);
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     }
// // //   };

// // //   // Skeleton loader component
// // //   const SkeletonRow = () => (
// // //     <tr className="animate-pulse">
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// // //       </td>
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="h-4 bg-gray-200 rounded w-4/5"></div>
// // //       </td>
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// // //       </td>
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
// // //       </td>
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
// // //       </td>
// // //       <td className="px-6 py-4 whitespace-nowrap">
// // //         <div className="flex gap-2">
// // //           <div className="h-6 w-6 bg-gray-200 rounded"></div>
// // //           <div className="h-6 w-6 bg-gray-200 rounded"></div>
// // //         </div>
// // //       </td>
// // //     </tr>
// // //   );

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
// // //       <div className="max-w-7xl mx-auto">
// // //         <div className="bg-white border-b border-gray-200 rounded-xl my-4 shadow-sm">
// // //           <div className="max-w-7xl mx-auto px-6  py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// // //             <div className="flex items-center space-x-4">
// // //               <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
// // //                 <Sparkles className="w-6 h-6 text-white" />
// // //               </div>
// // //               <div>
// // //                 <h1 className="text-2xl font-bold text-gray-900">Assign Checklist to Equipment</h1>
// // //                 <p className="text-gray-600 mt-2 text-md">Manage and tagged equipment with checklist</p>
// // //               </div>

// // //             </div>
// // //             <button
// // //               onClick={() => setIsModalOpen(true)}
// // //               className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
// // //             >
// // //               <Plus className="w-5 h-5" />
// // //               <span>Assign Checklist to Equipment</span>
// // //             </button>
// // //           </div>
// // //         </div>


// // //         {/* Search and Filter Section */}
// // //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
// // //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //             {/* Search Input */}
// // //             <div className="relative flex-1 min-w-0">
// // //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                 <Search className="h-5 w-5 text-gray-400" />
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search checklists..."
// // //                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //               />
// // //             </div>

// // //             {/* Status Filter */}
// // //             <div className="flex items-center gap-2 w-full sm:w-auto">
// // //               <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
// // //                 Filter by:
// // //               </span>
// // //               <div className="relative">
// // //                 <select
// // //                   className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
// // //                   value={statusFilter}
// // //                   onChange={(e) => setStatusFilter(e.target.value)}
// // //                 >
// // //                   <option>All Statuses</option>
// // //                   <option>InProgress</option>
// // //                   <option>Pending Approval</option>
// // //                   <option>Approved</option>
// // //                   <option>rejected</option>
// // //                 </select>
// // //                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
// // //                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// // //                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
// // //                   </svg>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Table Section */}
// // //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Sr.No.
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Checklist Name
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Equipment Name
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Generated Id
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Status
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="bg-white divide-y divide-gray-200">
// // //                 {isLoading ? (
// // //                   // Show skeleton loaders while loading
// // //                   Array(5).fill(0).map((_, index) => (
// // //                     <SkeletonRow key={`skeleton-${index}`} />
// // //                   ))
// // //                 ) : filteredAssignments.length > 0 ? (
// // //                   // Show actual data when loaded
// // //                   filteredAssignments.map((item, index) => (
// // //                     <tr key={item._id} className="hover:bg-gray-50">
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// // //                         {index + 1}
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                         {item.prototypeData?.name || 'N/A'}
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                         {item.equipment?.name || 'N/A'}
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'assigned'
// // //                           ? 'bg-green-100 text-green-800'
// // //                           : 'bg-yellow-100 text-yellow-800'
// // //                           }`}>
// // //                           {item.generatedId}
// // //                         </span>
// // //                       </td>

// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// // //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved'
// // //                           ? 'bg-green-100 text-green-800'
// // //                           : item.status === 'pending'
// // //                             ? 'bg-blue-100 text-blue-800'
// // //                             : item.status === 'rejected'
// // //                               ? 'bg-red-100 text-red-800'
// // //                               : 'bg-yellow-100 text-yellow-800'
// // //                           }`}>
// // //                           {item.status}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
// // //                         {item.status === 'InProgress' && (

// // //                           <button
// // //                             onClick={() => handleSendForApproval(item)}
// // //                             className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
// // //                             title="Send for Approval"
// // //                           >
// // //                             Send for Approval
// // //                           </button>
// // //                         )}

// // //                         <button
// // //                           onClick={() => handleDeleteClick(item._id)}
// // //                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
// // //                           title="Delete"
// // //                         >
// // //                           <Trash2 className="w-4 h-4" />
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 ) : (
// // //                   // Show empty state when no results
// // //                   <tr>
// // //                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
// // //                       {searchTerm || statusFilter !== 'All Statuses' ?
// // //                         'No matching assignments found' :
// // //                         'No assignments available'}
// // //                     </td>
// // //                   </tr>
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Assignment Modal */}
// // //       {isModalOpen && (
// // //         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
// // //           <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
// // //             <div className="p-6 border-b border-gray-200 flex justify-between items-center">
// // //               <h2 className="text-xl font-semibold text-gray-800">Assign Equipment</h2>
// // //               <button
// // //                 onClick={() => setIsModalOpen(false)}
// // //                 className="text-gray-400 hover:text-gray-500"
// // //               >
// // //                 <X className="w-5 h-5" />
// // //               </button>
// // //             </div>

// // //             <div className="p-6 space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
// // //                 <select
// // //                   value={equipment?._id || ''}
// // //                   onChange={(e) => setEquipment(equipmentList.find(eq => eq._id === e.target.value))}
// // //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// // //                 >
// // //                   <option value="">Select equipment</option>
// // //                   {equipmentList.map((item) => (
// // //                     <option key={item._id} value={item._id}>
// // //                       {item.name} ({item.type || 'No type'})
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Checklist</label>
// // //                 <select
// // //                   value={assignee?._id || ''}
// // //                   onChange={(e) => setAssignee(prototypeList.find(proto => proto._id === e.target.value))}
// // //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// // //                 >
// // //                   <option value="">Select checklist</option>
// // //                   {prototypeList.map((item) => (
// // //                     <option key={item._id} value={item._id}>
// // //                       {item.name || item.title || `Checklist ${item._id.slice(-4)}`}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>
// // //             </div>

// // //             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
// // //               <button
// // //                 onClick={() => setIsModalOpen(false)}
// // //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleAssign}
// // //                 disabled={!equipment || !assignee || isLoading}
// // //                 className={`px-4 py-2 rounded-md text-white ${!equipment || !assignee || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
// // //                   }`}
// // //               >
// // //                 {isLoading ? 'Assigning...' : 'Assign Equipment'}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {/* Confirmation Modal */}

// // //       {/* Approval Confirmation Modal */}
// // //       {approvalModal.isOpen && (
// // //         <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
// // //             <div className="p-6">
// // //               <div className="flex items-center gap-3 mb-4">
// // //                 <div className="p-2 rounded-full bg-blue-100">
// // //                   <CheckCircle className="text-blue-600" size={24} />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
// // //               </div>
// // //               <p className="text-gray-600 mb-6">
// // //                 Are you sure you want to send <span className="font-semibold">{approvalModal.assignment?.prototypeData?.name}</span> assigned to <span className="font-semibold">{approvalModal.assignment?.equipment?.name}</span> for approval?
// // //                 This action cannot be undone.
// // //               </p>
// // //               <div className="flex justify-end gap-3">
// // //                 <button
// // //                   onClick={() => setApprovalModal({ isOpen: false, assignment: null })}
// // //                   disabled={approvalLoading}
// // //                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   onClick={confirmApproval}
// // //                   disabled={approvalLoading}
// // //                   className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
// // //                 >
// // //                   {approvalLoading ? (
// // //                     <div className="flex items-center gap-2">
// // //                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                       </svg>
// // //                       Processing...
// // //                     </div>
// // //                   ) : 'Confirm'}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {/* Delete Confirmation Modal */}
// // //       {deleteModal.isOpen && (
// // //         <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
// // //             <div className="p-6">
// // //               <div className="flex items-center gap-3 mb-4">
// // //                 <div className="p-2 rounded-full bg-red-100">
// // //                   <Trash2 className="text-red-600" size={24} />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
// // //               </div>
// // //               <p className="text-gray-600 mb-6">
// // //                 Are you sure you want to delete this assignment? This action cannot be undone.
// // //               </p>
// // //               <div className="flex justify-end gap-3">
// // //                 <button
// // //                   onClick={() => setDeleteModal({ isOpen: false, assignmentId: null })}
// // //                   disabled={isLoading}
// // //                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   onClick={confirmDeleteAssignment}
// // //                   disabled={isLoading}
// // //                   className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
// // //                 >
// // //                   {isLoading ? (
// // //                     <div className="flex items-center gap-2">
// // //                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                       </svg>
// // //                       Deleting...
// // //                     </div>
// // //                   ) : 'Delete'}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { Plus, Package, Users, X, Trash2, Eye, Search, CheckCircle, Sparkles } from 'lucide-react';
// // import toast from 'react-hot-toast';
// // import { Toaster } from 'react-hot-toast';
// // export default function AssignEquipmentPage() {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [equipment, setEquipment] = useState(null);
// //   const [assignee, setAssignee] = useState(null);
// //   const [equipmentList, setEquipmentList] = useState([]);
// //   const [prototypeList, setPrototypeList] = useState([]);
// //   const [assigndata, setAssignData] = useState([]);
// //   const [companyData, setCompanyData] = useState();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All Statuses');
// //   const [deleteModal, setDeleteModal] = useState({
// //     isOpen: false,
// //     assignmentId: null,
// //   });
// //   const [approvalModal, setApprovalModal] = useState({
// //     isOpen: false,
// //     assignment: null,
// //   });
// //   const [approvalLoading, setApprovalLoading] = useState(false);

// //   // Filter assignments based on search term and status filter
// //   const filteredAssignments = isLoading ? [] : assigndata.filter(assignment => {
// //     const matchesSearch =
// //       assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesStatus =
// //       statusFilter === 'All Statuses' ||
// //       assignment.status?.toLowerCase() === statusFilter.toLowerCase();

// //     return matchesSearch && matchesStatus;
// //   });

// //   // Function to check if assignment already exists
// //   const checkExistingAssignment = (equipmentId, prototypeId) => {
// //     return assigndata.some(assignment => 
// //       assignment.equipment?._id === equipmentId && 
// //       assignment.prototypeData?._id === prototypeId
// //     );
// //   };

// //   const handleDeleteClick = (assignmentId) => {
// //     setDeleteModal({
// //       isOpen: true,
// //       assignmentId,
// //     });
// //   };

// //   const confirmDeleteAssignment = async () => {
// //     if (!deleteModal.assignmentId) return;

// //     try {
// //       setIsLoading(true);
// //       const res = await fetch(`/api/assignment/delete/${deleteModal.assignmentId}`, {
// //         method: 'DELETE',
// //       });

// //       if (res.ok) {
// //         toast.success('Assignment deleted successfully!');
// //         await fetchAssignment(); // Refresh the list
// //       } else {
// //         toast.error('Failed to delete assignment');
// //       }
// //     } catch (error) {
// //       console.error('Error deleting assignment:', error);
// //       toast.error('Error deleting assignment');
// //     } finally {
// //       setIsLoading(false);
// //       setDeleteModal({ isOpen: false, assignmentId: null });
// //     }
// //   };

// //   const handleAssign = async () => {
// //     // Check if assignment already exists
// //     if (checkExistingAssignment(equipment._id, assignee._id)) {
// //       toast.error('This checklist is already assigned to the selected equipment. Please choose a different combination.');
// //       return;
// //     }

// //     const generatedId = `A-${Date.now()}`;
// //     const payload = {
// //       generatedId,
// //       equipment: equipment,
// //       prototype: assignee,
// //       companyId: companyData.companyId,
// //       userId: companyData.id,
// //     };

// //     try {
// //       setIsLoading(true);
// //       const res = await fetch('/api/assignment/create', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       const result = await res.json();

// //       if (!res.ok || !result.success) {
// //         throw new Error(result.message || 'Failed to assign equipment');
// //       }

// //       toast.success('Equipment assigned successfully!');
// //       setIsModalOpen(false);
// //       setEquipment(null);
// //       setAssignee(null);
// //       await fetchAssignment(); // Refresh the assignment data
// //     } catch (error) {
// //       console.error('Error while assigning equipment:', error);
// //       toast.error(error.message || 'Failed to assign equipment');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleSendForApproval = (assignment) => {
// //     setApprovalModal({
// //       isOpen: true,
// //       assignment,
// //     });
// //   };

// //   const confirmApproval = async () => {
// //     if (!approvalModal.assignment) return;

// //     try {
// //       setApprovalLoading(true);
// //       const res = await fetch(`/api/assignment/update/${approvalModal.assignment._id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ status: 'Pending Approval' }),
// //       });

// //       const result = await res.json();

// //       if (!res.ok || !result.success) {
// //         throw new Error(result.message || 'Failed to update status');
// //       }

// //       toast.success('Assignment sent for approval successfully!');
// //       await fetchAssignment(); // Refresh the assignment data
// //       setApprovalModal({ isOpen: false, assignment: null });
// //     } catch (error) {
// //       console.error('Error while updating assignment status:', error);
// //       toast.error(error.message || 'Failed to send for approval');
// //     } finally {
// //       setApprovalLoading(false);
// //     }
// //   };

// //   const fetchAssignment = async () => {
// //     try {
// //       const res = await fetch('/api/assignment/fetchAll');
// //       const data = await res.json();
// //       const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId);
// //       setAssignData(filteredData);
// //     } catch (error) {
// //       console.error('Error fetching assignments:', error);
// //       toast.error('Error fetching assignments');
// //     }
// //   };

// //   useEffect(() => {
// //     const userData = localStorage.getItem('user');
// //     const data = JSON.parse(userData);
// //     console.log(data);
// //     setCompanyData(data);
// //   }, []);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setIsLoading(true);
// //         const [equipmentRes, prototypesRes] = await Promise.all([
// //           fetch('/api/equipment/fetchAll'),
// //           fetch('/api/checklistapi/fetchAll')
// //         ]);

// //         const [equipmentData, prototypesData] = await Promise.all([
// //           equipmentRes.json(),
// //           prototypesRes.json()
// //         ]);

// //         const approvedEquipments = equipmentData.data.filter(e => e.status === 'Approved' && e.companyId === companyData?.companyId);
// //         setEquipmentList(approvedEquipments);

// //         const filteredPrototypes = prototypesData.data.filter((t) => t.status === 'Approved' && t.companyId === companyData?.companyId);
// //         setPrototypeList(filteredPrototypes);

// //         await fetchAssignment();
// //         toast.success('Data loaded successfully!');
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         toast.error('Error loading data');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (companyData) {
// //       fetchData();
// //     }
// //   }, [companyData]);

// //   const handleDeleteAssignment = async (assignmentId) => {
// //     // Since we have a confirmation modal, we don't need the window.confirm anymore
// //     // This function can be removed or kept for reference
// //   };

// //   // Skeleton loader component
// //   const SkeletonRow = () => (
// //     <tr className="animate-pulse">
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-4/5"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="flex gap-2">
// //           <div className="h-6 w-6 bg-gray-200 rounded"></div>
// //           <div className="h-6 w-6 bg-gray-200 rounded"></div>
// //         </div>
// //       </td>
// //     </tr>
// //   );

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="bg-white border-b border-gray-200 rounded-xl my-4 shadow-sm">
// //           <div className="max-w-7xl mx-auto px-6  py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //             <div className="flex items-center space-x-4">
// //               <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
// //                 <Sparkles className="w-6 h-6 text-white" />
// //               </div>
// //               <div>
// //                 <h1 className="text-2xl font-bold text-gray-900">Assign Checklist to Equipment</h1>
// //                 <p className="text-gray-600 mt-2 text-md">Manage and tagged equipment with checklist</p>
// //               </div>
// //             </div>
// //             <button
// //               onClick={() => setIsModalOpen(true)}
// //               className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
// //             >
// //               <Plus className="w-5 h-5" />
// //               <span>Assign Checklist to Equipment</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Search and Filter Section */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
// //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //             {/* Search Input */}
// //             <div className="relative flex-1 min-w-0">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search className="h-5 w-5 text-gray-400" />
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Search checklists..."
// //                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>

// //             {/* Status Filter */}
// //             <div className="flex items-center gap-2 w-full sm:w-auto">
// //               <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
// //                 Filter by:
// //               </span>
// //               <div className="relative">
// //                 <select
// //                   className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
// //                   value={statusFilter}
// //                   onChange={(e) => setStatusFilter(e.target.value)}
// //                 >
// //                   <option>All Statuses</option>
// //                   <option>InProgress</option>
// //                   <option>Pending Approval</option>
// //                   <option>Approved</option>
// //                   <option>rejected</option>
// //                 </select>
// //                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
// //                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table Section */}
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Sr.No.
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Checklist Name
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Equipment Name
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Generated Id
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {isLoading ? (
// //                   // Show skeleton loaders while loading
// //                   Array(5).fill(0).map((_, index) => (
// //                     <SkeletonRow key={`skeleton-${index}`} />
// //                   ))
// //                 ) : filteredAssignments.length > 0 ? (
// //                   // Show actual data when loaded
// //                   filteredAssignments.map((item, index) => (
// //                     <tr key={item._id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                         {index + 1}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         {item.prototypeData?.name || 'N/A'}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         {item.equipment?.name || 'N/A'}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'assigned'
// //                           ? 'bg-green-100 text-green-800'
// //                           : 'bg-yellow-100 text-yellow-800'
// //                           }`}>
// //                           {item.generatedId}
// //                         </span>
// //                       </td>

// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved'
// //                           ? 'bg-green-100 text-green-800'
// //                           : item.status === 'pending'
// //                             ? 'bg-blue-100 text-blue-800'
// //                             : item.status === 'rejected'
// //                               ? 'bg-red-100 text-red-800'
// //                               : 'bg-yellow-100 text-yellow-800'
// //                           }`}>
// //                           {item.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
// //                         {item.status === 'InProgress' && (
// //                           <button
// //                             onClick={() => handleSendForApproval(item)}
// //                             className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
// //                             title="Send for Approval"
// //                           >
// //                             Send for Approval
// //                           </button>
// //                         )}

// //                         <button
// //                           onClick={() => handleDeleteClick(item._id)}
// //                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
// //                           title="Delete"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   // Show empty state when no results
// //                   <tr>
// //                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
// //                       {searchTerm || statusFilter !== 'All Statuses' ?
// //                         'No matching assignments found' :
// //                         'No assignments available'}
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Assignment Modal */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
// //           <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
// //             <div className="p-6 border-b border-gray-200 flex justify-between items-center">
// //               <h2 className="text-xl font-semibold text-gray-800">Assign Equipment</h2>
// //               <button
// //                 onClick={() => setIsModalOpen(false)}
// //                 className="text-gray-400 hover:text-gray-500"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             <div className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
// //                 <select
// //                   value={equipment?._id || ''}
// //                   onChange={(e) => setEquipment(equipmentList.find(eq => eq._id === e.target.value))}
// //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                 >
// //                   <option value="">Select equipment</option>
// //                   {equipmentList.map((item) => (
// //                     <option key={item._id} value={item._id}>
// //                       {item.name} ({item.type || 'No type'})
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Checklist</label>
// //                 <select
// //                   value={assignee?._id || ''}
// //                   onChange={(e) => setAssignee(prototypeList.find(proto => proto._id === e.target.value))}
// //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                 >
// //                   <option value="">Select checklist</option>
// //                   {prototypeList.map((item) => (
// //                     <option key={item._id} value={item._id}>
// //                       {item.name || item.title || `Checklist ${item._id.slice(-4)}`}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
// //               <button
// //                 onClick={() => setIsModalOpen(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleAssign}
// //                 disabled={!equipment || !assignee || isLoading}
// //                 className={`px-4 py-2 rounded-md text-white ${!equipment || !assignee || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
// //                   }`}
// //               >
// //                 {isLoading ? 'Assigning...' : 'Assign Equipment'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Approval Confirmation Modal */}
// //       {approvalModal.isOpen && (
// //         <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
// //             <div className="p-6">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <div className="p-2 rounded-full bg-blue-100">
// //                   <CheckCircle className="text-blue-600" size={24} />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
// //               </div>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to send <span className="font-semibold">{approvalModal.assignment?.prototypeData?.name}</span> assigned to <span className="font-semibold">{approvalModal.assignment?.equipment?.name}</span> for approval?
// //                 This action cannot be undone.
// //               </p>
// //               <div className="flex justify-end gap-3">
// //                 <button
// //                   onClick={() => setApprovalModal({ isOpen: false, assignment: null })}
// //                   disabled={approvalLoading}
// //                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={confirmApproval}
// //                   disabled={approvalLoading}
// //                   className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
// //                 >
// //                   {approvalLoading ? (
// //                     <div className="flex items-center gap-2">
// //                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                       </svg>
// //                       Processing...
// //                     </div>
// //                   ) : 'Confirm'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       {deleteModal.isOpen && (
// //         <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
// //             <div className="p-6">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <div className="p-2 rounded-full bg-red-100">
// //                   <Trash2 className="text-red-600" size={24} />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
// //               </div>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete this assignment? This action cannot be undone.
// //               </p>
// //               <div className="flex justify-end gap-3">
// //                 <button
// //                   onClick={() => setDeleteModal({ isOpen: false, assignmentId: null })}
// //                   disabled={isLoading}
// //                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={confirmDeleteAssignment}
// //                   disabled={isLoading}
// //                   className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
// //                 >
// //                   {isLoading ? (
// //                     <div className="flex items-center gap-2">
// //                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                       </svg>
// //                       Deleting...
// //                     </div>
// //                   ) : 'Delete'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       <Toaster 
// //         position="top-center"
// //         toastOptions={{
// //           duration: 4000,
// //           style: {
// //             background: '#363636',
// //             color: '#fff',
// //           },
// //         }}
// //       />
// //     </div>
// //   );
// // }



// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Plus, Package, Users, X, Trash2, Eye, Search, CheckCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';

// export default function AssignEquipmentPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedEquipments, setSelectedEquipments] = useState([]);
//   const [assignee, setAssignee] = useState(null);
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [prototypeList, setPrototypeList] = useState([]);
//   const [assigndata, setAssignData] = useState([]);
//   const [companyData, setCompanyData] = useState();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All Statuses');
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     assignmentId: null,
//   });
//   const [approvalModal, setApprovalModal] = useState({
//     isOpen: false,
//     assignment: null,
//   });
//   const [approvalLoading, setApprovalLoading] = useState(false);
//   const [checklistSearch, setChecklistSearch] = useState('');
//   const [equipmentSearch, setEquipmentSearch] = useState('');

//   // Filter assignments based on search term and status filter
//   const filteredAssignments = isLoading ? [] : assigndata.filter(assignment => {
//     const matchesSearch =
//       assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === 'All Statuses' ||
//       assignment.status?.toLowerCase() === statusFilter.toLowerCase();

//     return matchesSearch && matchesStatus;
//   });

//   // Filtered checklists based on search
//   const filteredPrototypes = prototypeList.filter(item =>
//     item.name?.toLowerCase().includes(checklistSearch.toLowerCase())
//   );

//   // Filtered equipments based on search
//   const filteredEquipments = equipmentList.filter(item =>
//     item.name?.toLowerCase().includes(equipmentSearch.toLowerCase())
//   );

//   // Function to check if assignment already exists
//   const checkExistingAssignment = (equipmentId, prototypeId) => {
//     return assigndata.some(assignment =>
//       assignment.equipment?._id === equipmentId &&
//       assignment.prototypeData?._id === prototypeId
//     );
//   };

//   const handleDeleteClick = (assignmentId) => {
//     setDeleteModal({
//       isOpen: true,
//       assignmentId,
//     });
//   };

//   const confirmDeleteAssignment = async () => {
//     if (!deleteModal.assignmentId) return;

//     try {
//       setIsLoading(true);
//       const res = await fetch(`/api/assignment/delete/${deleteModal.assignmentId}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         toast.success('Assignment deleted successfully!');
//         await fetchAssignment();
//       } else {
//         toast.error('Failed to delete assignment');
//       }
//     } catch (error) {
//       console.error('Error deleting assignment:', error);
//       toast.error('Error deleting assignment');
//     } finally {
//       setIsLoading(false);
//       setDeleteModal({ isOpen: false, assignmentId: null });
//     }
//   };

//   const handleAssign = async () => {
//     if (!assignee || selectedEquipments.length === 0) return;

//     const existing = selectedEquipments.some(eq => checkExistingAssignment(eq._id, assignee._id));
//     if (existing) {
//       toast.error('One or more selected equipments already have this checklist assigned.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const promises = selectedEquipments.map(async (eq) => {
//         const generatedId = `A-${Date.now()}`;
//         const payload = {
//           generatedId,
//           equipment: eq,
//           prototype: assignee,
//           companyId: companyData.companyId,
//           userId: companyData.id,
//         };

//         const res = await fetch('/api/assignment/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });

//         const result = await res.json();
//         if (!res.ok || !result.success) {
//           throw new Error(result.message || 'Failed to assign equipment');
//         }
//         return result;
//       });

//       await Promise.all(promises);
//       toast.success('Equipments assigned successfully!');
//       setIsModalOpen(false);
//       setSelectedEquipments([]);
//       setAssignee(null);
//       setChecklistSearch('');
//       setEquipmentSearch('');
//       await fetchAssignment();
//     } catch (error) {
//       console.error('Error while assigning equipments:', error);
//       toast.error(error.message || 'Failed to assign equipments');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleEquipmentSelection = (eq) => {
//     if (selectedEquipments.some(selected => selected._id === eq._id)) {
//       setSelectedEquipments(selectedEquipments.filter(selected => selected._id !== eq._id));
//     } else {
//       setSelectedEquipments([...selectedEquipments, eq]);
//     }
//   };

//   const handleSendForApproval = (assignment) => {
//     setApprovalModal({
//       isOpen: true,
//       assignment,
//     });
//   };

//   const confirmApproval = async () => {
//     if (!approvalModal.assignment) return;

//     try {
//       setApprovalLoading(true);
//       const res = await fetch(`/api/assignment/update/${approvalModal.assignment._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'Pending Approval' }),
//       });

//       const result = await res.json();

//       if (!res.ok || !result.success) {
//         throw new Error(result.message || 'Failed to update status');
//       }

//       toast.success('Assignment sent for approval successfully!');
//       await fetchAssignment();
//       setApprovalModal({ isOpen: false, assignment: null });
//     } catch (error) {
//       console.error('Error while updating assignment status:', error);
//       toast.error(error.message || 'Failed to send for approval');
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const fetchAssignment = async () => {
//     try {
//       const res = await fetch('/api/assignment/fetchAll');
//       const data = await res.json();
//       const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId);
//       setAssignData(filteredData);
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//       toast.error('Error fetching assignments');
//     }
//   };

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const data = JSON.parse(userData);
//     setCompanyData(data);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [equipmentRes, prototypesRes] = await Promise.all([
//           fetch('/api/equipment/fetchAll'),
//           fetch('/api/checklistapi/fetchAll')
//         ]);

//         const [equipmentData, prototypesData] = await Promise.all([
//           equipmentRes.json(),
//           prototypesRes.json()
//         ]);

//         const approvedEquipments = equipmentData.data.filter(e => e.status === 'Approved' && e.companyId === companyData?.companyId);
//         setEquipmentList(approvedEquipments);

//         const filteredPrototypes = prototypesData.data.filter((t) => t.status === 'Approved' && t.companyId === companyData?.companyId);
//         setPrototypeList(filteredPrototypes);

//         await fetchAssignment();
//         toast.success('Data loaded successfully!');
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Error loading data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (companyData) {
//       fetchData();
//     }
//   }, [companyData]);

//   const SkeletonRow = () => (
//     <tr className="animate-pulse">
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-4/5"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex gap-2">
//           <div className="h-6 w-6 bg-gray-200 rounded"></div>
//           <div className="h-6 w-6 bg-gray-200 rounded"></div>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white border-b border-gray-200 rounded-xl my-4 shadow-sm">
//           <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Assign Checklist to Equipment</h1>
//                 <p className="text-gray-600 mt-2 text-md">Manage and tag equipment with checklists</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Assign Checklist to Equipment</span>
//             </button>
//           </div>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div className="relative flex-1 min-w-0">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search checklists..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                 Filter by:
//               </span>
//               <div className="relative">
//                 <select
//                   className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option>All Statuses</option>
//                   <option>InProgress</option>
//                   <option>Pending Approval</option>
//                   <option>Approved</option>
//                   <option>rejected</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Sr.No.
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Checklist Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Equipment Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Generated Id
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   Array(5).fill(0).map((_, index) => (
//                     <SkeletonRow key={`skeleton-${index}`} />
//                   ))
//                 ) : filteredAssignments.length > 0 ? (
//                   filteredAssignments.map((item, index) => (
//                     <tr key={item._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.prototypeData?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.equipment?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'assigned'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                           {item.generatedId}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved'
//                           ? 'bg-green-100 text-green-800'
//                           : item.status === 'pending'
//                             ? 'bg-blue-100 text-blue-800'
//                             : item.status === 'rejected'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
//                         {item.status === 'InProgress' && (
//                           <button
//                             onClick={() => handleSendForApproval(item)}
//                             className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600"
//                             title="Send for Approval"
//                           >
//                             Send for Approval
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDeleteClick(item._id)}
//                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                       {searchTerm || statusFilter !== 'All Statuses' ?
//                         'No matching assignments found' :
//                         'No assignments available'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modern Horizontal Assignment Modal */}
//       {/* Minimal Assignment Modal */}
// {isModalOpen && (
//   <div className="fixed pl-64 inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
      
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">Assign Checklist</h2>
//           <p className="text-sm text-gray-600">Select equipment and checklist to assign</p>
//         </div>
//         <button
//           onClick={() => {
//             setIsModalOpen(false);
//             setSelectedEquipments([]);
//             setAssignee(null);
//           }}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <X className="w-5 h-5 text-gray-500" />
//         </button>
//       </div>

     

//       {/* Main Content - Two Column Layout */}
//       <div className="flex flex-col md:flex-row h-[400px]">
//         {/* Left Column - Equipment Selection */}
//         <div className="flex-1 border-r border-gray-200 p-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Package className="w-5 h-5 text-gray-600" />
//             <h3 className="font-medium text-gray-900">Equipment</h3>
//             {selectedEquipments.length > 0 && (
//               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                 {selectedEquipments.length} selected
//               </span>
//             )}
//           </div>
//  {/* Selected Equipment Pills */}
//       {selectedEquipments.length > 0 && (
//         <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm text-gray-600 font-medium">Selected:</span>
//             {selectedEquipments.map((equipment) => (
//               <div
//                 key={equipment._id}
//                 className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//               >
//                 <span>{equipment.name}</span>
//                 <button
//                   onClick={() => toggleEquipmentSelection(equipment)}
//                   className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//             ))}
//             <button
//               onClick={() => setSelectedEquipments([])}
//               className="text-sm text-red-600 hover:text-red-700 ml-2 font-medium"
//             >
//               Clear all
//             </button>
//           </div>
//         </div>
//       )}
//           {/* Equipment Search */}
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search equipment..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={equipmentSearch}
//               onChange={(e) => setEquipmentSearch(e.target.value)}
//             />
//           </div>

//           {/* Equipment List */}
//           <div className="h-[280px] overflow-y-auto space-y-2">
//             {filteredEquipments.map((item) => (
//               <label
//                 key={item._id}
//                 className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedEquipments.some(eq => eq._id === item._id)}
//                   onChange={() => toggleEquipmentSelection(item)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 truncate">{item.name}</p>
//                   <p className="text-sm text-gray-500 truncate">{item.type}</p>
//                 </div>
//               </label>
//             ))}
//             {filteredEquipments.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                 <p>No equipment found</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Checklist Selection */}
//         <div className="flex-1 p-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Users className="w-5 h-5 text-gray-600" />
//             <h3 className="font-medium text-gray-900">Checklist</h3>
//             {assignee && (
//               <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                 Selected
//               </span>
//             )}
//           </div>

//           {/* Checklist Search */}
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search checklists..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={checklistSearch}
//               onChange={(e) => setChecklistSearch(e.target.value)}
//             />
//           </div>

//           {/* Checklist Selection */}
//           <div className="mb-4">
//             <select
//               value={assignee?._id || ''}
//               onChange={(e) => setAssignee(filteredPrototypes.find(proto => proto._id === e.target.value))}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             >
//               <option value="">Select a checklist...</option>
//               {filteredPrototypes.map((item) => (
//                 <option key={item._id} value={item._id}>
//                   {item.name || item.title || `Checklist ${item._id.slice(-4)}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Selected Checklist Display */}
//           {assignee && (
//             <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-600" />
//                 <div>
//                   <p className="font-medium text-green-800">Selected Checklist</p>
//                   <p className="text-sm text-green-600">{assignee.name}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Assignment Summary */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Equipment selected:</span>
//                 <span className="font-medium">{selectedEquipments.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Checklist:</span>
//                 <span className="font-medium">{assignee ? assignee.name : 'Not selected'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
//         <div className="text-sm text-gray-600">
//           {assignee && selectedEquipments.length > 0 && (
//             <span>
//               Ready to assign <strong>{assignee.name}</strong> to <strong>{selectedEquipments.length}</strong> equipment{selectedEquipments.length > 1 ? 's' : ''}
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => {
//               setIsModalOpen(false);
//               setSelectedEquipments([]);
//               setAssignee(null);
//             }}
//             className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAssign}
//             disabled={!assignee || selectedEquipments.length === 0 || isLoading}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//               !assignee || selectedEquipments.length === 0 || isLoading
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Assigning...
//               </>
//             ) : (
//               <>
//                 <CheckCircle2 className="w-4 h-4" />
//                 Assign Checklist
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//       {/* Approval Confirmation Modal */}
//       {approvalModal.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 rounded-full bg-blue-100">
//                   <CheckCircle className="text-blue-600" size={24} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to send <span className="font-semibold">{approvalModal.assignment?.prototypeData?.name}</span> assigned to <span className="font-semibold">{approvalModal.assignment?.equipment?.name}</span> for approval? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setApprovalModal({ isOpen: false, assignment: null })}
//                   disabled={approvalLoading}
//                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmApproval}
//                   disabled={approvalLoading}
//                   className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
//                 >
//                   {approvalLoading ? (
//                     <div className="flex items-center gap-2">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing...
//                     </div>
//                   ) : 'Confirm'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModal.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 rounded-full bg-red-100">
//                   <Trash2 className="text-red-600" size={24} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this assignment? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteModal({ isOpen: false, assignmentId: null })}
//                   disabled={isLoading}
//                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDeleteAssignment}
//                   disabled={isLoading}
//                   className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center gap-2">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Deleting...
//                     </div>
//                   ) : 'Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//             borderRadius: '8px',
//             padding: '12px',
//           },
//         }}
//       />
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Package, Users, X, Trash2, Eye, Search, CheckCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function AssignEquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [assignee, setAssignee] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [prototypeList, setPrototypeList] = useState([]);
  const [assigndata, setAssignData] = useState([]);
  const [companyData, setCompanyData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assignmentId: null,
  });
  const [approvalModal, setApprovalModal] = useState({
    isOpen: false,
    assignment: null,
  });
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [checklistSearch, setChecklistSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');

  // Filter assignments based on search term and status filter
  const filteredAssignments = isLoading ? [] : assigndata.filter(assignment => {
    const matchesSearch =
      assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Statuses' ||
      assignment.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Get equipment IDs that are already assigned (to any checklist)
  const assignedEquipmentIds = assigndata.map(assignment => assignment.equipment?._id).filter(Boolean);

  // Filter available equipments - exclude already assigned ones and apply search filter
  const filteredEquipments = equipmentList.filter(item =>
    item.name?.toLowerCase().includes(equipmentSearch.toLowerCase()) &&
    !assignedEquipmentIds.includes(item._id)
  );

  // Filtered checklists based on search
  const filteredPrototypes = prototypeList.filter(item =>
    item.name?.toLowerCase().includes(checklistSearch.toLowerCase())
  );

  // Function to check if assignment already exists for specific equipment and prototype
  const checkExistingAssignment = (equipmentId, prototypeId) => {
    return assigndata.some(assignment =>
      assignment.equipment?._id === equipmentId &&
      assignment.prototypeData?._id === prototypeId
    );
  };

  const handleDeleteClick = (assignmentId) => {
    setDeleteModal({
      isOpen: true,
      assignmentId,
    });
  };

  const confirmDeleteAssignment = async () => {
    if (!deleteModal.assignmentId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/assignment/delete/${deleteModal.assignmentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Assignment deleted successfully!');
        await fetchAssignment();
      } else {
        toast.error('Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Error deleting assignment');
    } finally {
      setIsLoading(false);
      setDeleteModal({ isOpen: false, assignmentId: null });
    }
  };

  const handleAssign = async () => {
    if (!assignee || selectedEquipments.length === 0) return;

    // Double-check if any selected equipment is already assigned (shouldn't happen with the filter above, but good to have)
    const existing = selectedEquipments.some(eq => checkExistingAssignment(eq._id, assignee._id));
    if (existing) {
      toast.error('One or more selected equipments already have this checklist assigned.');
      return;
    }

    try {
      setIsLoading(true);
      const promises = selectedEquipments.map(async (eq) => {
        const generatedId = `A-${Date.now()}`;
        const payload = {
          generatedId,
          equipment: eq,
          prototype: assignee,
          companyId: companyData.companyId,
          userId: companyData.id,
        };

        const res = await fetch('/api/assignment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to assign equipment');
        }
        return result;
      });

      await Promise.all(promises);
      toast.success('Equipments assigned successfully!');
      setIsModalOpen(false);
      setSelectedEquipments([]);
      setAssignee(null);
      setChecklistSearch('');
      setEquipmentSearch('');
      await fetchAssignment();
    } catch (error) {
      console.error('Error while assigning equipments:', error);
      toast.error(error.message || 'Failed to assign equipments');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEquipmentSelection = (eq) => {
    if (selectedEquipments.some(selected => selected._id === eq._id)) {
      setSelectedEquipments(selectedEquipments.filter(selected => selected._id !== eq._id));
    } else {
      setSelectedEquipments([...selectedEquipments, eq]);
    }
  };

  const handleSendForApproval = (assignment) => {
    setApprovalModal({
      isOpen: true,
      assignment,
    });
  };

  const confirmApproval = async () => {
    if (!approvalModal.assignment) return;

    try {
      setApprovalLoading(true);
      const res = await fetch(`/api/assignment/update/${approvalModal.assignment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Pending Approval' }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update status');
      }

      toast.success('Assignment sent for approval successfully!');
      await fetchAssignment();
      setApprovalModal({ isOpen: false, assignment: null });
    } catch (error) {
      console.error('Error while updating assignment status:', error);
      toast.error(error.message || 'Failed to send for approval');
    } finally {
      setApprovalLoading(false);
    }
  };

  const fetchAssignment = async () => {
    try {
      const res = await fetch('/api/assignment/fetchAll');
      const data = await res.json();
      const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId);
      setAssignData(filteredData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Error fetching assignments');
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const data = JSON.parse(userData);
    setCompanyData(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [equipmentRes, prototypesRes] = await Promise.all([
          fetch('/api/equipment/fetchAll'),
          fetch('/api/checklistapi/fetchAll')
        ]);

        const [equipmentData, prototypesData] = await Promise.all([
          equipmentRes.json(),
          prototypesRes.json()
        ]);

        const approvedEquipments = equipmentData.data.filter(e => e.status === 'Approved' && e.companyId === companyData?.companyId);
        setEquipmentList(approvedEquipments);

        const filteredPrototypes = prototypesData.data.filter((t) => t.status === 'Approved' && t.companyId === companyData?.companyId);
        setPrototypeList(filteredPrototypes);

        await fetchAssignment();
        toast.success('Data loaded successfully!');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    if (companyData) {
      fetchData();
    }
  }, [companyData]);

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-b border-gray-200 rounded-xl my-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assign Checklist to Equipment</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and tag equipment with checklists</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Assign Checklist to Equipment</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search checklists..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by:
              </span>
              <div className="relative">
                <select
                  className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>InProgress</option>
                  <option>Pending Approval</option>
                  <option>Approved</option>
                  <option>rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr.No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Checklist Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Id
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : filteredAssignments.length > 0 ? (
                  filteredAssignments.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.prototypeData?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.equipment?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'assigned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.generatedId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pending'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                       {item.status === 'InProgress' && (
                          <button
                            onClick={() => handleSendForApproval(item)}
                            className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600"
                            title="Send for Approval"
                          >
                            Send for Approval
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        {/* {item.status === 'InProgress' && (
                          <button
                            onClick={() => handleSendForApproval(item)}
                            className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600"
                            title="Send for Approval"
                          >
                            Send for Approval
                          </button>
                        )} */}
                        <button
                          onClick={() => handleDeleteClick(item._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'All Statuses' ?
                        'No matching assignments found' :
                        'No assignments available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed pl-64 inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Assign Checklist</h2>
                <p className="text-sm text-gray-600">Select equipment and checklist to assign</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedEquipments([]);
                  setAssignee(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Selected Equipment Pills */}
            {selectedEquipments.length > 0 && (
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Selected:</span>
                  {selectedEquipments.map((equipment) => (
                    <div
                      key={equipment._id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{equipment.name}</span>
                      <button
                        onClick={() => toggleEquipmentSelection(equipment)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setSelectedEquipments([])}
                    className="text-sm text-red-600 hover:text-red-700 ml-2 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Main Content - Two Column Layout */}
            <div className="flex flex-col md:flex-row h-[400px]">
              {/* Left Column - Equipment Selection */}
              <div className="flex-1 border-r border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Available Equipment</h3>
                  {selectedEquipments.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedEquipments.length} selected
                    </span>
                  )}
                </div>

                {/* Equipment Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                  />
                </div>

                {/* Equipment List */}
                <div className="h-[280px] overflow-y-auto space-y-2">
                  {filteredEquipments.map((item) => (
                    <label
                      key={item._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEquipments.some(eq => eq._id === item._id)}
                        onChange={() => toggleEquipmentSelection(item)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 truncate">{item.type}</p>
                      </div>
                    </label>
                  ))}
                  {filteredEquipments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No available equipment found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {equipmentSearch ? 'Try a different search term' : 'All equipment are already assigned'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Checklist Selection */}
              {/* Right Column - Checklist Selection */}
<div className="flex-1 p-4">
  <div className="flex items-center gap-2 mb-4">
    <Users className="w-5 h-5 text-gray-600" />
    <h3 className="font-medium text-gray-900">Checklist</h3>
    {assignee && (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
        Selected
      </span>
    )}
  </div>

  {/* Checklist Search */}
  <div className="relative mb-4">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search checklists..."
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={checklistSearch}
      onChange={(e) => {
        setChecklistSearch(e.target.value);
        // Clear selection if search doesn't match current assignee
        if (assignee && !e.target.value) {
          const searchTerm = e.target.value.toLowerCase();
          const assigneeName = assignee.name?.toLowerCase() || '';
          if (!assigneeName.includes(searchTerm)) {
            setAssignee(null);
          }
        }
      }}
    />
  </div>

  {/* Searchable Checklist Dropdown */}
  <div className="relative mb-4">
    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white">
      {filteredPrototypes.length > 0 ? (
        filteredPrototypes.map((item) => (
          <div
            key={item._id}
            onClick={() => setAssignee(item)}
            className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              assignee?._id === item._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            } ${
              item === filteredPrototypes[0] ? 'rounded-t-lg' : ''
            } ${
              item === filteredPrototypes[filteredPrototypes.length - 1] ? 'rounded-b-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.name || item.title || `Checklist ${item._id.slice(-4)}`}</p>
                
              </div>
              {assignee?._id === item._id && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No checklists found</p>
          <p className="text-sm text-gray-400 mt-1">
            {checklistSearch ? 'Try a different search term' : 'No approved checklists available'}
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Selected Checklist Display */}
  {assignee && (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Selected Checklist</p>
            <p className="text-sm text-green-600">{assignee.name}</p>
          </div>
        </div>
        <button
          onClick={() => setAssignee(null)}
          className="p-1 hover:bg-green-200 rounded-full transition-colors"
          title="Clear selection"
        >
          <X className="w-3 h-3 text-green-600" />
        </button>
      </div>
    </div>
  )}

  
</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {assignee && selectedEquipments.length > 0 && (
                  <span>
                    Ready to assign <strong>{assignee.name}</strong> to <strong>{selectedEquipments.length}</strong> equipment{selectedEquipments.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEquipments([]);
                    setAssignee(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!assignee || selectedEquipments.length === 0 || isLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    !assignee || selectedEquipments.length === 0 || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Assign Checklist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {approvalModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <CheckCircle className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to send <span className="font-semibold">{approvalModal.assignment?.prototypeData?.name}</span> assigned to <span className="font-semibold">{approvalModal.assignment?.equipment?.name}</span> for approval? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApprovalModal({ isOpen: false, assignment: null })}
                  disabled={approvalLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  disabled={approvalLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
                >
                  {approvalLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-100">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this assignment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, assignmentId: null })}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAssignment}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </div>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px',
          },
        }}
      />
    </div>
  );
}