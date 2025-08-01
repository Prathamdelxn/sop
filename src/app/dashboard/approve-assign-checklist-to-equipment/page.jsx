
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Plus, Package, Users, X, Trash2, Eye } from 'lucide-react';

// export default function ApproveAssignEquipmentPage() {


//   const [assigndata, setAssignData] = useState([]);
//  const[companyData,setCompanyData]=useState();
 
//   const fetchAssignment = async () => {
//     const res = await fetch('/api/assignment/fetchAll');
//     const data = await res.json();
//      const filteredData=data.data.filter((t)=>t.companyId===companyData?.companyId && t.status=="pending");
//     setAssignData(filteredData);
//   };
 
// useEffect(()=>{
//     const userData=localStorage.getItem('user');
//     const data=JSON.parse(userData);
//     console.log(data);
//     setCompanyData(data);
// },[])
//   useEffect(() => {
//     fetchAssignment();
//   }, [companyData]);

 

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//              Approve Equipment & Checklist Assignment
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
//                     Prototype Name
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
                    
//                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         item.status === 'approved' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>{item.status}</span>
//                     </td>
//                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
//   {item.status === 'created' && (
//     <button 
//       onClick={() => handleSendForApproval(item._id)}
//       className="text-green-600 hover:text-yellow-900"
//       title="Send for Approval"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
//       </svg>
//     </button>
//   )}
//   <button 
 
//     className="text-blue-600 hover:text-red-900"
//     title="View"
//   >
//     <Eye className="w-5 h-5" />
//   </button>
// </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

   
   
//     </div>
//   );
// }


 
'use client';
 
import React, { useEffect, useState } from 'react';
import { Plus, Package, Users, X, Trash2, Eye, Check } from 'lucide-react';
 
export default function ApproveAssignEquipmentPage() {
  const [assigndata, setAssignData] = useState([]);
  const [companyData, setCompanyData] = useState();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
 
  const fetchAssignment = async () => {
    const res = await fetch('/api/assignment/fetchAll');
    const data = await res.json();
    const filteredData = data.data.filter((t) => t.companyId === companyData?.companyId && t.status == "pending");
    setAssignData(filteredData);
  };
 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const data = JSON.parse(userData);
    console.log(data);
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
        body: JSON.stringify({ status: 'approved' }),
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
        body: JSON.stringify({ status: 'rejected' }),
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
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Approve Equipment & Checklist Assignment
            </h1>
            <p className="text-gray-600">Assign and track your equipment efficiently</p>
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
                {assigndata.map((item, index) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'assigned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.generatedId}
                      </span>
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleApprove(item)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleView(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 
      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Approval</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to approve this assignment?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to reject this assignment?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* View Details Modal */}
      {showViewModal && selectedAssignment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Assignment Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
           
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Checklist Information</h4>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAssignment.prototypeData?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAssignment.prototypeData?.description || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
 
              <div>
                <h4 className="text-sm font-medium text-gray-500">Equipment Information</h4>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAssignment.equipment?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAssignment.equipment?.type || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
 
              <div>
                <h4 className="text-sm font-medium text-gray-500">Assignment Details</h4>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Generated ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAssignment.generatedId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`text-sm font-medium ${
                      selectedAssignment.status === 'approved'
                        ? 'text-green-600'
                        : selectedAssignment.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      {selectedAssignment.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 