
'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Package, Users, X, Trash2, Eye, Search, CheckCircle } from 'lucide-react';

export default function AssignEquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Changed to true initially
  const [equipment, setEquipment] = useState(null);
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
      await fetchAssignment(); // Refresh the list
    }
  } catch (error) {
    console.error('Error deleting assignment:', error);
  } finally {
    setIsLoading(false);
    setDeleteModal({ isOpen: false, assignmentId: null });
  }
};
  const handleAssign = async () => {
    const generatedId = `A-${Date.now()}`;
    const payload = {
      generatedId,
      equipment: equipment,
      prototype: assignee,
      companyId: companyData.companyId,
      userId: companyData.id,
    };

    try {
      setIsLoading(true);
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

      setIsModalOpen(false);
      setEquipment(null);
      setAssignee(null);
      await fetchAssignment(); // Refresh the assignment data
    } catch (error) {
      console.error('Error while assigning equipment:', error);
    } finally {
      setIsLoading(false);
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

      await fetchAssignment(); // Refresh the assignment data
      setApprovalModal({ isOpen: false, assignment: null });
    } catch (error) {
      console.error('Error while updating assignment status:', error);
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
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const data = JSON.parse(userData);
    console.log(data);
    setCompanyData(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [equipmentRes, prototypesRes] = await Promise.all([
          fetch('/api/equipment/fetchAll'),
          fetch('/api/task/fetchAll')
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyData) {
      fetchData();
    }
  }, [companyData]);

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/assignment/delete/${assignmentId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          await fetchAssignment(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Skeleton loader component
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Assign Checklist to Equipment
            </h1>
            <p className="text-gray-600">Assign and track your equipment with checklist efficiently</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>Assign Checklist to Equipment</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
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

            {/* Status Filter */}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  // Show skeleton loaders while loading
                  Array(5).fill(0).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : filteredAssignments.length > 0 ? (
                  // Show actual data when loaded
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        {item.status === 'InProgress' && (

                          <button
                            onClick={() => handleSendForApproval(item)}
                            className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
                            title="Send for Approval"
                          >
                            Send for Approval
                          </button>
                        )}

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
                  // Show empty state when no results
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Assign Equipment</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                <select
                  value={equipment?._id || ''}
                  onChange={(e) => setEquipment(equipmentList.find(eq => eq._id === e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select equipment</option>
                  {equipmentList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({item.type || 'No type'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checklist</label>
                <select
                  value={assignee?._id || ''}
                  onChange={(e) => setAssignee(prototypeList.find(proto => proto._id === e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select checklist</option>
                  {prototypeList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name || item.title || `Checklist ${item._id.slice(-4)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!equipment || !assignee || isLoading}
                className={`px-4 py-2 rounded-md text-white ${!equipment || !assignee || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isLoading ? 'Assigning...' : 'Assign Equipment'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
     
      {/* Approval Confirmation Modal */}
      {approvalModal.isOpen && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <CheckCircle className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to send <span className="font-semibold">{approvalModal.assignment?.prototypeData?.name}</span> assigned to <span className="font-semibold">{approvalModal.assignment?.equipment?.name}</span> for approval?
                This action cannot be undone.
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
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
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
    </div>
  );
}