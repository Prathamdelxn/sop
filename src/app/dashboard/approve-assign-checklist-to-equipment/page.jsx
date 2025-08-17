

 
// 'use client';
 
// import React, { useEffect, useState } from 'react';
// import { Plus, Package, Users, X, Trash2, Eye, Check } from 'lucide-react';
 
// export default function ApproveAssignEquipmentPage() {
//   const [assigndata, setAssignData] = useState([]);
//   const [companyData, setCompanyData] = useState();
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
 
//   const fetchAssignment = async () => {
//     const res = await fetch('/api/assignment/fetchAll');
//     const data = await res.json();
//     const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId && t.status == "Pending Approval");
//     setAssignData(filteredData);
//   };
 
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const data = JSON.parse(userData);
//     console.log(data);
//     setCompanyData(data);
//   }, [])
 
//   useEffect(() => {
//     fetchAssignment();
//   }, [companyData]);
 
//   const handleApprove = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowApproveModal(true);
//   };
 
//   const handleReject = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowRejectModal(true);
//   };
 
//   const handleView = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowViewModal(true);
//   };
 
//   const confirmApprove = async () => {
//     try {
//       const res = await fetch(`/api/assignment/update/${selectedAssignment._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'approved' }),
//       });
 
//       if (res.ok) {
//         fetchAssignment();
//         setShowApproveModal(false);
//       } else {
//         console.error('Failed to approve assignment');
//       }
//     } catch (error) {
//       console.error('Error approving assignment:', error);
//     }
//   };
 
//   const confirmReject = async () => {
//     try {
//       const res = await fetch(`/api/assignment/update/${selectedAssignment._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'rejected' }),
//       });
 
//       if (res.ok) {
//         fetchAssignment();
//         setShowRejectModal(false);
//       } else {
//         console.error('Failed to reject assignment');
//       }
//     } catch (error) {
//       console.error('Error rejecting assignment:', error);
//     }
//   };
 
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Approve Equipment & Checklist Assignment
//             </h1>
//             <p className="text-gray-600">Assign and track your equipment efficiently</p>
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
//                 {assigndata.map((item, index) => (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {index + 1}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.prototypeData?.name || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.equipment?.name || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         item.status === 'assigned'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {item.generatedId}
//                       </span>
//                     </td>
                   
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         item.status === 'approved'
//                           ? 'bg-green-100 text-green-800'
//                           : item.status === 'rejected'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>{item.status}</span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
//                       <button
//                         onClick={() => handleApprove(item)}
//                         className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
//                         title="Approve"
//                       >
//                         <Check className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleReject(item)}
//                         className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
//                         title="Reject"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleView(item)}
//  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                         title="View"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
 
//       {/* Approve Confirmation Modal */}
//       {showApproveModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Approval</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to approve this assignment?</p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowApproveModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmApprove}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* Reject Confirmation Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Rejection</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to reject this assignment?</p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowRejectModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmReject}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* View Details Modal */}
//       {showViewModal && selectedAssignment && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Assignment Details</h3>
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
           
//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Checklist Information</h4>
//                 <div className="mt-1 grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Name</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedAssignment.prototypeData?.name || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Description</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedAssignment.prototypeData?.description || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
 
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Equipment Information</h4>
//                 <div className="mt-1 grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Name</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedAssignment.equipment?.name || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Type</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedAssignment.equipment?.type || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
 
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500">Assignment Details</h4>
//                 <div className="mt-1 grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Generated ID</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedAssignment.generatedId || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Status</p>
//                     <p className={`text-sm font-medium ${
//                       selectedAssignment.status === 'approved'
//                         ? 'text-green-600'
//                         : selectedAssignment.status === 'rejected'
//                         ? 'text-red-600'
//                         : 'text-yellow-600'
//                     }`}>
//                       {selectedAssignment.status}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
 
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
 


'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Package, Users, X, Trash2, Eye, Check, Search, Filter, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ApproveAssignEquipmentPage() {
  const [assigndata, setAssignData] = useState([]);
  const [companyData, setCompanyData] = useState();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assignment/fetchAll');
      const data = await res.json();
      const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId && t.status != "InProgress");
      setAssignData(filteredData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const data = JSON.parse(userData);
    setCompanyData(data);
  }, [])

  useEffect(() => {
    fetchAssignment();
  }, [companyData]);

  const handleApprove = (assignment) => {
    setSelectedAssignment(assignment);
    setShowApproveModal(true);
  };

  const handleReject = (assignment) => {
    setSelectedAssignment(assignment);
    setShowRejectModal(true);
  };

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const confirmApprove = async () => {
    try {
      const res = await fetch(`/api/assignment/update/${selectedAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' }),
      });

      if (res.ok) {
        fetchAssignment();
        setShowApproveModal(false);
      } else {
        console.error('Failed to approve assignment');
      }
    } catch (error) {
      console.error('Error approving assignment:', error);
    }
  };

  const confirmReject = async () => {
    try {
      const res = await fetch(`/api/assignment/update/${selectedAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' , rejectionReason: rejectionReason.trim() }),
      });

      if (res.ok) {
        fetchAssignment();
        setShowRejectModal(false);
      } else {
        console.error('Failed to reject assignment');
      }
    } catch (error) {
      console.error('Error rejecting assignment:', error);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronDown className="w-4 h-4 ml-1 opacity-0" />;
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="w-4 h-4 ml-1" /> 
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const sortedData = [...assigndata].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = sortConfig.key === 'prototypeData.name' 
      ? a.prototypeData?.name 
      : sortConfig.key === 'equipment.name' 
      ? a.equipment?.name 
      : a[sortConfig.key];

    const bValue = sortConfig.key === 'prototypeData.name' 
      ? b.prototypeData?.name 
      : sortConfig.key === 'equipment.name' 
      ? b.equipment?.name 
      : b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(item => {
    // Search filter
    const matchesSearch = 
      item.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generatedId?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Equipment Assignment Approvals
            </h1>
            <p className="text-gray-600 mt-1">Review and approve pending equipment assignments</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assignments..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Loading assignments...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No assignments found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? "No results match your search criteria. Try adjusting your filters."
                  : "There are currently no assignments pending approval."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('index')}
                    >
                      <div className="flex items-center">
                        #
                        {getSortIcon('index')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('prototypeData.name')}
                    >
                      <div className="flex items-center">
                        Checklist
                        {getSortIcon('prototypeData.name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('equipment.name')}
                    >
                      <div className="flex items-center">
                        Equipment
                        {getSortIcon('equipment.name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('generatedId')}
                    >
                      <div className="flex items-center">
                        ID
                        {getSortIcon('generatedId')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{item.prototypeData?.name || 'N/A'}</div>
                        {item.prototypeData?.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {item.prototypeData.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{item.equipment?.name || 'N/A'}</div>
                        {item.equipment?.type && (
                          <div className="text-xs text-gray-500">{item.equipment.type}</div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700">
                          {item.generatedId}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Approved'
                            ? 'bg-green-50 text-green-700'
                            : item.status === 'Rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex justify-center space-x-1">
                          {item.status=="Pending Approval" ?<> <button
                            onClick={() => handleApprove(item)}
                            className="p-2 text-green-600 hover:text-white hover:bg-green-600 bg-green-100 rounded-lg hover:shadow-sm transition-all duration-200"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(item)}
                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 bg-red-100 rounded-lg hover:shadow-sm transition-all duration-200"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button></> :<></>}
                         

                          <button
                            onClick={() => handleView(item)}
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-100 rounded-lg hover:shadow-sm transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="absolute inset-0 backdrop-blur-sm  bg-opacity-30 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Approval</h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">You are about to approve this assignment:</p>
              <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-800">{selectedAssignment?.prototypeData?.name || 'N/A'}</p>
                <p className="text-sm text-blue-600">Assigned to: {selectedAssignment?.equipment?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-md transition-all duration-200"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {/* Reject Confirmation Modal */}
{showRejectModal && (
  <div className="absolute inset-0 backdrop-blur-sm  bg-opacity-30 flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl transform transition-all duration-300 scale-95 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Confirm Rejection</h3>
        <button
          onClick={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="mb-6">
        <p className="text-gray-600">You are about to reject this assignment:</p>
        <div className="mt-3 bg-red-50 p-3 rounded-lg">
          <p className="font-medium text-red-800">{selectedAssignment?.prototypeData?.name || 'N/A'}</p>
          <p className="text-sm text-red-600">Assigned to: {selectedAssignment?.equipment?.name || 'N/A'}</p>
        </div>
        <div className="mt-4">
          <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for rejection (required)
          </label>
          <textarea
            id="rejectionReason"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejecting this assignment..."
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={confirmReject}
          disabled={!rejectionReason.trim()}
          className={`px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-md transition-all duration-200 ${
            !rejectionReason.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Confirm Rejection
        </button>
      </div>
    </div>
  </div>
)}

      {/* View Details Modal */}
      {showViewModal && selectedAssignment && (
        <div className="absolute inset-0 backdrop-blur-sm  bg-opacity-30 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-4 max-w-3xl w-full shadow-xl transform transition-all duration-300 scale-95 animate-scale-in overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Assignment Details</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedAssignment.generatedId}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Checklist Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedAssignment.prototypeData?.name || 'N/A'}
                    </p>
                  </div>
                  {selectedAssignment.prototypeData?.description && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Description</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedAssignment.prototypeData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Equipment Information
                </h4>
                <div className="flex  gap-4">
                  <div className='w-28 '>
                    <p className="text-xs font-medium text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedAssignment.equipment?.name || 'N/A'}
                    </p>
                  </div>
                  {selectedAssignment.equipment?.type && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Type</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedAssignment.equipment.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Assignment Details
                </h4>
                <div className="flex  gap-28">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Status</p>
                    <p className={`text-sm font-medium mt-1 ${
                      selectedAssignment.status === 'Approved'
                        ? 'text-green-600'
                        : selectedAssignment.status === 'Rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      {selectedAssignment.status}
                    </p>
                  </div>
                  {rejectionReason? <div>
                    <p className="text-xs font-medium text-gray-500">Rejection Reason</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {selectedAssignment.rejectionReason}
                    </p>
                  </div> :<></>}
                  
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-md transition-all duration-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}