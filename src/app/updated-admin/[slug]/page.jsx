
// "use client";

// import React, { use, useEffect, useState } from 'react';
// import { Plus, Search, Filter, MonitorCheck, Edit, Trash2, User, X } from 'lucide-react';

// export default function DynamicDashboardPage({ params }) {
//   const { slug } = use(params);
//   const [people, setPeople] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');
//   const [task, setTask] = useState([]);
//   const [Id, setId] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingUser, setEditingUser] = useState(null);
//   const [validationStatus, setValidationStatus] = useState({
//     email: { checking: false, available: true, error: '' },
//     username: { checking: false, available: true, error: '' },
//     phone: { checking: false, available: true, error: '' }
//   });
//   const [alertModal, setAlertModal] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     onConfirm: null,
//     confirmText: 'Confirm'
//   });

//   console.log("asdf",slug);

//   const [formData, setFormData] = useState({
//     name: '',
//     companyId: Id,
//     task: task,
//     email: '',
//     username: '',
//     password: '',
//     phone: '',
//     role: slug,
//     status: 'Active',
//     location: '' 
//   });

//   const showAlert = (title, message, onConfirm = null, confirmText = 'Confirm') => {
//     setAlertModal({
//       isOpen: true,
//       title,
//       message,
//       onConfirm,
//       confirmText
//     });
//   };

//   const closeAlert = () => {
//     setAlertModal({
//       isOpen: false,
//       title: '',
//       message: '',
//       onConfirm: null,
//       confirmText: 'Confirm'
//     });
//   };

//   const slugify = (str) =>
//     str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

//   useEffect(() => {
//     const data = localStorage.getItem('user');
//     if (data) {
//       const userdata = JSON.parse(data);
//       setId(userdata?.id);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       if (Id) {
//         await fetchPeople();
//         await fetchRoleData();
//       }
//     };
//     fetchAllData();
//   }, [Id, slug]);

//   const fetchPeople = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/superAdmin/users/fetchAll');
//       if (!res.ok) throw new Error('Failed to fetch users');
//       const data = await res.json();
//       const filteredUsers = (data.users || []).filter(user => user.role === slug && user.companyId === Id);
//       setPeople(filteredUsers);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   console.log("sss", slug)
//   const fetchRoleData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
//       if (!res.ok) throw new Error('Failed to fetch role data');
//       const newdata = await res.json();
      
//       const dd = newdata.superAdmin?.workerRole;
//       const matchedRole = dd?.find((role) => slugify(role.title) === slug);

//       if (!matchedRole) {
//         throw new Error('Role not found');
//       }

//       if (!matchedRole.task || matchedRole.task.length === 0) {
//         throw new Error('No tasks defined for this role');
//       }

//       setTask(matchedRole.task);
//     } catch (err) {
//       console.error("Error fetching role data:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validateEmail = async (email) => {
//   if (!email) return;
  
//   // Check email format first
//   if (!isValidEmail(email)) {
//     setValidationStatus(prev => ({
//       ...prev,
//       email: { 
//         checking: false, 
//         available: false,
//         error: 'Please enter a valid email address'
//       }
//     }));
//     return;
//   }
  
//   setValidationStatus(prev => ({
//     ...prev,
//     email: { ...prev.email, checking: true, available: false, error: '' }
//   }));

//   try {
//     const response = await fetch('/api/check-username', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         email,
//         idToExclude: editingUser?._id,
//         role: slug
//       })
//     });

//     const data = await response.json();
    
//     setValidationStatus(prev => ({
//       ...prev,
//       email: { 
//         checking: false, 
//         available: !data.emailExists,
//         error: data.emailExists ? 'Email already in use' : ''
//       }
//     }));
//   } catch (error) {
//     setValidationStatus(prev => ({
//       ...prev,
//       email: { 
//         checking: false, 
//         available: false,
//         error: 'Error checking email availability'
//       }
//     }));
//   }
// };
//   // const validateEmail = async (email) => {
//   //   if (!email) return;
//   //     if (!isValidEmail(email)) {
//   //   setValidationStatus(prev => ({
//   //     ...prev,
//   //     email: { 
//   //       checking: false, 
//   //       available: false,
//   //       error: 'Please enter a valid email address'
//   //     }
//   //   }));
//   //   return;
//   // }
//   //   setValidationStatus(prev => ({
//   //     ...prev,
//   //     email: { ...prev.email, checking: true, available: false, error: '' }
//   //   }));

//   //   try {
//   //     const response = await fetch('/api/check-username', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ 
//   //         email,
//   //         idToExclude: editingUser?._id,
//   //         role: slug
//   //       })
//   //     });

//   //     const data = await response.json();
      
//   //     setValidationStatus(prev => ({
//   //       ...prev,
//   //       email: { 
//   //         checking: false, 
//   //         available: !data.emailExists,
//   //         error: data.emailExists ? 'Email already in use' : ''
//   //       }
//   //     }));
//   //   } catch (error) {
//   //     setValidationStatus(prev => ({
//   //       ...prev,
//   //       email: { 
//   //         checking: false, 
//   //         available: false,
//   //         error: 'Error checking email availability'
//   //       }
//   //     }));
//   //   }
//   // };

//   const validateUsername = async (username) => {
//     if (!username || editingUser) return;
    
//     setValidationStatus(prev => ({
//       ...prev,
//       username: { ...prev.username, checking: true, available: false, error: '' }
//     }));

//     try {
//       const response = await fetch('/api/check-username', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           username,
//           idToExclude: editingUser?._id,
//           role: slug
//         })
//       });

//       const data = await response.json();
      
//       setValidationStatus(prev => ({
//         ...prev,
//         username: { 
//           checking: false, 
//           available: !data.usernameExists,
//           error: data.usernameExists ? 'Username already taken' : ''
//         }
//       }));
//     } catch (error) {
//       setValidationStatus(prev => ({
//         ...prev,
//         username: { 
//           checking: false, 
//           available: false,
//           error: 'Error checking username availability'
//         }
//       }));
//     }
//   };

//   const validatePhone = async (phone) => {
//     if (!phone) return;
    
//     setValidationStatus(prev => ({
//       ...prev,
//       phone: { ...prev.phone, checking: true, available: false, error: '' }
//     }));

//     try {
//       const response = await fetch('/api/check-username', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           phone,
//           idToExclude: editingUser?._id,
//           role: slug
//         })
//       });

//       const data = await response.json();
      
//       setValidationStatus(prev => ({
//         ...prev,
//         phone: { 
//           checking: false, 
//           available: !data.phoneExists,
//           error: data.phoneExists ? 'Phone already registered' : ''
//         }
//       }));
//     } catch (error) {
//       setValidationStatus(prev => ({
//         ...prev,
//         phone: { 
//           checking: false, 
//           available: false,
//           error: 'Error checking phone availability'
//         }
//       }));
//     }
//   };

//   const handleAddPerson = () => {
//     setEditingUser(null);
//     setValidationStatus({
//       email: { checking: false, available: true, error: '' },
//       username: { checking: false, available: true, error: '' },
//       phone: { checking: false, available: true, error: '' }
//     });
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'Active',
//       location: '' 
//     });
//     setIsModalOpen(true);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setValidationStatus({
//       email: { checking: false, available: true, error: '' },
//       username: { checking: false, available: true, error: '' },
//       phone: { checking: false, available: true, error: '' }
//     });
//     setFormData({
//       name: user.name,
//       email: user.email,
//       companyId: Id,
//       task: task,
//       username: user.username,
//       password: '', // Don't pre-fill password for security
//       phone: user.phone,
//       role: slug,
//       status: user.status,
//       location: user.location
//     });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!task || task.length === 0) {
//       showAlert("Error", "Cannot submit: No tasks available for this role");
//       return;
//     }

//     // Check all fields are available
//     if (!validationStatus.email.available || 
//         !validationStatus.username.available || 
//         !validationStatus.phone.available) {
//       showAlert("Validation Error", "Please fix the validation errors before submitting");
//       return;
//     }

//     const userData = {
//       ...formData,
//       companyId: Id,
//       task: task
//     };

//     try {
//       setIsLoading(true);
//       let response;
      
//       if (editingUser) {
//         // Update existing user
//         response = await fetch(`/api/superAdmin/users/update/${editingUser._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         });
//       } else {
//         console.log("new data is",userData);
//         // Create new user
//         response = await fetch('/api/superAdmin/users/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         });
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || (editingUser ? 'Failed to update user' : 'Failed to create user'));
//       }

//       // Refresh the user list
//       await fetchPeople();
      
//       setIsModalOpen(false);
//       setEditingUser(null);
//       showAlert("Success", editingUser ? 'User updated successfully!' : 'User created successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       showAlert("Error", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//  const handleStatusChange = async (user) => {
//   const isActivating = user.status === 'InActive';
  
//   showAlert(
//     isActivating ? "Confirm Activation" : "Confirm Deactivation",
//     isActivating 
//       ? "Are you sure you want to activate this client? They will regain access to the system."
//       : "Are you sure you want to deactivate this client? They will no longer have access to the system.",
//     async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/superAdmin/users/update-status/${user._id}`, {
//           method: 'PUT',
//         });

//         if (!response.ok) {
//           throw new Error(isActivating ? 'Failed to activate user' : 'Failed to deactivate user');
//         }

//         // Refresh the user list
//         await fetchPeople();
//       } catch (error) {
//         console.error('Error changing user status:', error);
//         showAlert("Error", error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     isActivating ? "Confirm Activate" : "Confirm Deactivate"
//   );
// };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingUser(null);
//     setValidationStatus({
//       email: { checking: false, available: true, error: '' },
//       username: { checking: false, available: true, error: '' },
//       phone: { checking: false, available: true, error: '' }
//     });
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'Active',
//       location: ''
//     });
//   };

//   const filteredPeople = people.filter(person => {
//     const matchesSearch = 
//       person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.phone?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = filterRole === 'all' || person.role === filterRole;
//     return matchesSearch && matchesRole;
//   });

//   const getRoleColor = (role) => {
//     switch(role) {
//       case 'admin': return 'bg-purple-100 text-purple-800';
//       case 'manager': return 'bg-blue-100 text-blue-800';
//       case 'member': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status) => 
//     status === 'Active' 
//       ? 'bg-green-100 text-green-800 border-green-200' 
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8 p-6">
//       {/* Alert Modal */}
//       {alertModal.isOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900">{alertModal.title}</h3>
//               <p className="mt-2 text-gray-600">{alertModal.message}</p>
//             </div>
//             <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
//               <button
//                 onClick={closeAlert}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Ok
//               </button>
//               {alertModal.onConfirm && (
//                 <button
//                   onClick={() => {
//                     alertModal.onConfirm();
//                     closeAlert();
//                   }}
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
//                 >
//                   {alertModal.confirmText}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900 capitalize">Management of {slug.replace('-', ' ')}</h1>
//         </div>
//         <button
//           onClick={handleAddPerson}
//           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//           disabled={isLoading}
//         >
//           <Plus className="h-5 w-5" />
//           <span>{isLoading ? 'Loading...' : 'Add Person'}</span>
//         </button>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search people..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* People Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Username</th>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
//                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
//                 <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredPeople.map((person) => (
//                 <tr key={person._id} className="hover:bg-gray-50">
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-3">
//                       <span className="font-medium text-gray-900 truncate max-w-[180px]">{person.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-600 truncate max-w-[180px]">{person.email}</td>
//                   <td className="py-4 px-6 text-gray-600 truncate max-w-[180px]">{person.username}</td>
//                   <td className="py-4 px-6 text-gray-600 ">{person.phone}</td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 truncate max-w-[180px] rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
//                       {person.role}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(person.status)}`}>
//                       {person.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//   <div className="flex justify-end space-x-2">
//     <button
//       onClick={() => handleEdit(person)}
//       className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
//       title="Edit"
//       disabled={isLoading}
//     >
//       <Edit className="h-4 w-4" />
//     </button>
//     <button
//       onClick={() => handleStatusChange(person)}
//       className={`${person.status === 'InActive' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} p-2 rounded-lg transition-colors`}
//       title={person.status === 'InActive' ? 'Activate' : 'Deactivate'}
//       disabled={isLoading}
//     >
//       {person.status === 'InActive' ? (
//         <MonitorCheck className="h-4 w-4" />
//       ) : (
//         <Trash2 className="h-4 w-4" />
//       )}
//     </button>
//   </div>
// </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredPeople.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-500">No people found</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Person Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center z-10">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {editingUser ? 'Edit Person' : 'Add New Person'}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {editingUser ? 'Update user information' : 'Fill in the details to add a new person'}
//                 </p>
//               </div>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
//                 disabled={isLoading}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6">
//               {isLoading && (
//                 <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//                 </div>
//               )}

//               {error && (
//                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-medium">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {!isLoading && task.length === 0 && !error && (
//                 <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-medium">No tasks available for this role</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Personal Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-base font-medium text-gray-900 flex items-center">
//                     <User className="h-5 w-5 mr-2 text-blue-500" />
//                     Personal Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className='text-red-500'>*</span></label>
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           const onlyLettersAndSpaces = value.replace(/[^a-zA-Z\s]/g, ''); // remove numbers & special chars
//                           setFormData({ ...formData, name: onlyLettersAndSpaces });
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter full name"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Location<span className='text-red-500'>*</span></label>
//                       <input
//                         type="text"
//                         value={formData.location}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           const onlyLettersAndSpaces = value.replace(/[^a-zA-Z\s]/g, ''); // remove numbers & special characters
//                           setFormData({ ...formData, location: onlyLettersAndSpaces });
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter location"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-base font-medium text-gray-900">Contact Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={async (e) => {
//                           const value = e.target.value;
//                           setFormData({...formData, email: value});
//                           await validateEmail(value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
//                           validationStatus.email.error ? 'border-red-500' : 
//                           validationStatus.email.available && formData.email ? 'border-green-500' : 
//                           'border-gray-300'
//                         }`}
//                         placeholder="Enter email address"
                        
//                         disabled={isLoading}
//                       />
//                       <div className="mt-1 h-5">
//                         {validationStatus.email.checking && (
//                           <p className="text-xs text-blue-600 flex items-center">
//                             <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Checking availability...
//                           </p>
//                         )}
//                         {validationStatus.email.error && (
//                           <p className="text-xs text-red-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                             {validationStatus.email.error}
//                           </p>
//                         )}
//                         {!validationStatus.email.checking && !validationStatus.email.error && formData.email && (
//                           <p className="text-xs text-green-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             Email available
//                           </p>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className='text-red-500'>*</span></label>
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         maxLength={10}
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         onChange={async (e) => {
//                           const value = e.target.value.replace(/\D/g, ''); 
//                           setFormData({...formData, phone: value});
//                           await validatePhone(value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
//                           validationStatus.phone.error ? 'border-red-500' : 
//                           validationStatus.phone.available && formData.phone ? 'border-green-500' : 
//                           'border-gray-300'
//                         }`}
//                         placeholder="Enter phone number"
//                         required
//                         disabled={isLoading}
//                       />
//                       <div className="mt-1 h-5">
//                         {validationStatus.phone.checking && (
//                           <p className="text-xs text-blue-600 flex items-center">
//                             <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Checking availability...
//                           </p>
//                         )}
//                         {validationStatus.phone.error && (
//                           <p className="text-xs text-red-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                             {validationStatus.phone.error}
//                           </p>
//                         )}
//                         {!validationStatus.phone.checking && !validationStatus.phone.error && formData.phone && (
//                           <p className="text-xs text-green-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             Phone available
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Account Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-base font-medium text-gray-900">Account Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Username<span className='text-red-500'>*</span> <span className='text-xs font-medium text-gray-400'>(Start with Aplabet)</span> </label>
//                       <input
//                         type="text"
//                         value={formData.username}
//                         onChange={async (e) => {
//                           let value = e.target.value;
//                           value = value.replace(/\s/g, '');

//                           // Remove any character that is not letter, number, or @
//                           value = value.replace(/[^a-zA-Z0-9@]/g, '');

//                           // Prevent typing if it doesn't start with a letter
//                           if (value && !/^[a-zA-Z]/.test(value)) return;

//                           // Allow only one @
//                           const atMatches = value.match(/@/g);
//                           if (atMatches && atMatches.length > 1) return;
//                           setFormData({...formData, username: value});
//                           await validateUsername(value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
//                           editingUser ? 'bg-gray-100 cursor-not-allowed' : ''
//                         } ${
//                           validationStatus.username.error ? 'border-red-500' : 
//                           validationStatus.username.available && formData.username ? 'border-green-500' : 
//                           'border-gray-300'
//                         }`}
//                         placeholder="Enter username"
//                         required
//                         disabled={isLoading || editingUser}
//                       />
//                       <div className="mt-1 h-5">
//                         {!editingUser && validationStatus.username.checking && (
//                           <p className="text-xs text-blue-600 flex items-center">
//                             <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Checking availability...
//                           </p>
//                         )}
//                         {validationStatus.username.error && (
//                           <p className="text-xs text-red-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                             {validationStatus.username.error}
//                           </p>
//                         )}
//                         {!editingUser && !validationStatus.username.checking && !validationStatus.username.error && formData.username && (
//                           <p className="text-xs text-green-600 flex items-center">
//                             <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             Username available
//                           </p>
//                         )}
//                         {editingUser && (
//                           <p className="text-xs text-gray-500">
//                             Username cannot be changed after creation
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         {editingUser ? 'New Password' : 'Password'}
//                         {!editingUser && <span className='text-red-500'>*</span>}
//                       </label>
//                       <input
//                         type="password"
//                         value={formData.password}
//                         onChange={(e) => setFormData({...formData, password: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
//                         required={!editingUser}
//                         disabled={isLoading}
//                         minLength={8}
//                       />
//                       {!editingUser && (
//                         <p className="mt-1 text-xs text-gray-500">
//                           Minimum 8 characters
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Status */}
               
//                 {/* <div className="space-y-4">
//                   <h3 className="text-base font-medium text-gray-900">Status</h3>
//                   <div className="flex items-center space-x-4">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         className="form-radio h-4 w-4 text-blue-600"
//                         name="status"
//                         value="Active"
//                         checked={formData.status === 'Active'}
//                         onChange={() => setFormData({...formData, status: 'Active'})}
//                         disabled={isLoading}
//                       />
//                       <span className="ml-2 text-gray-700">Active</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         className="form-radio h-4 w-4 text-blue-600"
//                         name="status"
//                         value="InActive"
//                         checked={formData.status === 'InActive'}
//                         onChange={() => setFormData({...formData, status: 'InActive'})}
//                         disabled={isLoading}
//                       />
//                       <span className="ml-2 text-gray-700">InActive</span>
//                     </label>
//                   </div>
//                 </div> */}

//                 {/* Status - Only show when editing */}
// {editingUser && (
//   <div className="space-y-4">
//     <h3 className="text-base font-medium text-gray-900">Status</h3>
//     <div className="flex items-center space-x-4">
//       <label className="inline-flex items-center">
//         <input
//           type="radio"
//           className="form-radio h-4 w-4 text-blue-600"
//           name="status"
//           value="Active"
//           checked={formData.status === 'Active'}
//           onChange={() => setFormData({...formData, status: 'Active'})}
//           disabled={isLoading}
//         />
//         <span className="ml-2 text-gray-700">Active</span>
//       </label>
//       <label className="inline-flex items-center">
//         <input
//           type="radio"
//           className="form-radio h-4 w-4 text-blue-600"
//           name="status"
//           value="InActive"
//           checked={formData.status === 'InActive'}
//           onChange={() => setFormData({...formData, status: 'InActive'})}
//           disabled={isLoading}
//         />
//         <span className="ml-2 text-gray-700">InActive</span>
//       </label>
//     </div>
//   </div>
// )}

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={
//                       isLoading || 
//                       !formData.name || 
//                       !formData.email || 
//                       !formData.phone || 
//                       !formData.username || 
//                       (!editingUser && !formData.password) ||
//                       !validationStatus.email.available ||
//                       !validationStatus.username.available ||
//                       !validationStatus.phone.available ||
//                       task.length === 0
//                     }
//                   >
//                     {isLoading ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {editingUser ? 'Updating...' : 'Creating...'}
//                       </span>
//                     ) : editingUser ? 'Update Person' : 'Add Person'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { use, useEffect, useState } from 'react';
import { Plus, Search, Filter, MonitorCheck, Edit, Trash2, User, X } from 'lucide-react';

export default function DynamicDashboardPage({ params }) {
  const { slug } = use(params);
  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [task, setTask] = useState([]);
  const [Id, setId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [validationStatus, setValidationStatus] = useState({
    email: { checking: false, available: true, error: '' },
    username: { checking: false, available: true, error: '' },
    phone: { checking: false, available: true, error: '' }
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm'
  });

  console.log("asdf",slug);

  const [formData, setFormData] = useState({
    name: '',
    companyId: Id,
    task: task,
    email: '',
    username: '',
    password: '',
    phone: '',
    role: slug,
    status: 'Active',
    location: '' 
  });

  const showAlert = (title, message, onConfirm = null, confirmText = 'Confirm') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText
    });
  };

  const closeAlert = () => {
    setAlertModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      confirmText: 'Confirm'
    });
  };

  const slugify = (str) =>
    str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const userdata = JSON.parse(data);
      setId(userdata?.id);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (Id) {
        await fetchPeople();
        await fetchRoleData();
      }
    };
    fetchAllData();
  }, [Id, slug]);

  const fetchPeople = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/superAdmin/users/fetchAll');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      const filteredUsers = (data.users || []).filter(user => user.role === slug && user.companyId === Id);
      setPeople(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("sss", slug)
  const fetchRoleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
      if (!res.ok) throw new Error('Failed to fetch role data');
      const newdata = await res.json();
      
      const dd = newdata.superAdmin?.workerRole;
      const matchedRole = dd?.find((role) => slugify(role.title) === slug);

      if (!matchedRole) {
        throw new Error('Role not found');
      }

      if (!matchedRole.task || matchedRole.task.length === 0) {
        throw new Error('No tasks defined for this role');
      }

      setTask(matchedRole.task);
    } catch (err) {
      console.error("Error fetching role data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    if (!email) return true; // Empty email is valid (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmail = async (email) => {
    // If email is empty, mark as available and clear any errors
    if (!email) {
      setValidationStatus(prev => ({
        ...prev,
        email: { 
          checking: false, 
          available: true, 
          error: '' 
        }
      }));
      return;
    }
    
    // Check email format first
    if (!isValidEmail(email)) {
      setValidationStatus(prev => ({
        ...prev,
        email: { 
          checking: false, 
          available: false,
          error: 'Please enter a valid email address'
        }
      }));
      return;
    }
    
    setValidationStatus(prev => ({
      ...prev,
      email: { ...prev.email, checking: true, available: false, error: '' }
    }));

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          idToExclude: editingUser?._id,
          role: slug
        })
      });

      const data = await response.json();
      
      setValidationStatus(prev => ({
        ...prev,
        email: { 
          checking: false, 
          available: !data.emailExists,
          error: data.emailExists ? 'Email already in use' : ''
        }
      }));
    } catch (error) {
      setValidationStatus(prev => ({
        ...prev,
        email: { 
          checking: false, 
          available: false,
          error: 'Error checking email availability'
        }
      }));
    }
  };

  const validateUsername = async (username) => {
    if (!username || editingUser) return;
    
    setValidationStatus(prev => ({
      ...prev,
      username: { ...prev.username, checking: true, available: false, error: '' }
    }));

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username,
          idToExclude: editingUser?._id,
          role: slug
        })
      });

      const data = await response.json();
      
      setValidationStatus(prev => ({
        ...prev,
        username: { 
          checking: false, 
          available: !data.usernameExists,
          error: data.usernameExists ? 'Username already taken' : ''
        }
      }));
    } catch (error) {
      setValidationStatus(prev => ({
        ...prev,
        username: { 
          checking: false, 
          available: false,
          error: 'Error checking username availability'
        }
      }));
    }
  };

  const validatePhone = async (phone) => {
    if (!phone) return;
    
    setValidationStatus(prev => ({
      ...prev,
      phone: { ...prev.phone, checking: true, available: false, error: '' }
    }));

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone,
          idToExclude: editingUser?._id,
          role: slug
        })
      });

      const data = await response.json();
      
      setValidationStatus(prev => ({
        ...prev,
        phone: { 
          checking: false, 
          available: !data.phoneExists,
          error: data.phoneExists ? 'Phone already registered' : ''
        }
      }));
    } catch (error) {
      setValidationStatus(prev => ({
        ...prev,
        phone: { 
          checking: false, 
          available: false,
          error: 'Error checking phone availability'
        }
      }));
    }
  };

  const handleAddPerson = () => {
    setEditingUser(null);
    setValidationStatus({
      email: { checking: false, available: true, error: '' },
      username: { checking: false, available: true, error: '' },
      phone: { checking: false, available: true, error: '' }
    });
    setFormData({
      name: '',
      email: '',
      companyId: Id,
      task: task,
      username: '',
      password: '',
      phone: '',
      role: slug,
      status: 'Active',
      location: '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setValidationStatus({
      email: { checking: false, available: true, error: '' },
      username: { checking: false, available: true, error: '' },
      phone: { checking: false, available: true, error: '' }
    });
    setFormData({
      name: user.name,
      email: user.email,
      companyId: Id,
      task: task,
      username: user.username,
      password: '', // Don't pre-fill password for security
      phone: user.phone,
      role: slug,
      status: user.status,
      location: user.location
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task || task.length === 0) {
      showAlert("Error", "Cannot submit: No tasks available for this role");
      return;
    }

    // Check validation status - only validate fields that have values
    const hasEmail = formData.email.trim() !== '';
    const emailValid = !hasEmail || validationStatus.email.available;
    const usernameValid = validationStatus.username.available;
    const phoneValid = validationStatus.phone.available;

    if (!emailValid || !usernameValid || !phoneValid) {
      showAlert("Validation Error", "Please fix the validation errors before submitting");
      return;
    }

    const userData = {
      ...formData,
      companyId: Id,
      task: task
    };

    try {
      setIsLoading(true);
      let response;
      
      if (editingUser) {
        // Update existing user
        response = await fetch(`/api/superAdmin/users/update/${editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      } else {
        console.log("new data is",userData);
        // Create new user
        response = await fetch('/api/superAdmin/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (editingUser ? 'Failed to update user' : 'Failed to create user'));
      }

      // Refresh the user list
      await fetchPeople();
      
      setIsModalOpen(false);
      setEditingUser(null);
      showAlert("Success", editingUser ? 'User updated successfully!' : 'User created successfully!');
    } catch (error) {
      console.error('Error:', error);
      showAlert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (user) => {
    const isActivating = user.status === 'InActive';
    
    showAlert(
      isActivating ? "Confirm Activation" : "Confirm Deactivation",
      isActivating 
        ? "Are you sure you want to activate this client? They will regain access to the system."
        : "Are you sure you want to deactivate this client? They will no longer have access to the system.",
      async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/superAdmin/users/update-status/${user._id}`, {
            method: 'PUT',
          });

          if (!response.ok) {
            throw new Error(isActivating ? 'Failed to activate user' : 'Failed to deactivate user');
          }

          // Refresh the user list
          await fetchPeople();
        } catch (error) {
          console.error('Error changing user status:', error);
          showAlert("Error", error.message);
        } finally {
          setIsLoading(false);
        }
      },
      isActivating ? "Confirm Activate" : "Confirm Deactivate"
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setValidationStatus({
      email: { checking: false, available: true, error: '' },
      username: { checking: false, available: true, error: '' },
      phone: { checking: false, available: true, error: '' }
    });
    setFormData({
      name: '',
      email: '',
      companyId: Id,
      task: task,
      username: '',
      password: '',
      phone: '',
      role: slug,
      status: 'Active',
      location: ''
    });
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = 
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || person.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => 
    status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className="space-y-8 p-6">
      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{alertModal.title}</h3>
              <p className="mt-2 text-gray-600">{alertModal.message}</p>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={closeAlert}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Ok
              </button>
              {alertModal.onConfirm && (
                <button
                  onClick={() => {
                    alertModal.onConfirm();
                    closeAlert();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  {alertModal.confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">Management of {slug.replace('-', ' ')}</h1>
        </div>
        <button
          onClick={handleAddPerson}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={isLoading}
        >
          <Plus className="h-5 w-5" />
          <span>{isLoading ? 'Loading...' : 'Add Person'}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Username</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPeople.map((person) => (
                <tr key={person._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">{person.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[180px]">{person.email}</td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[180px]">{person.username}</td>
                  <td className="py-4 px-6 text-gray-600 ">{person.phone}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 truncate max-w-[180px] rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
                      {person.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(person.status)}`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(person)}
                        className={`${person.status === 'InActive' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} p-2 rounded-lg transition-colors`}
                        title={person.status === 'InActive' ? 'Activate' : 'Deactivate'}
                        disabled={isLoading}
                      >
                        {person.status === 'InActive' ? (
                          <MonitorCheck className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPeople.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No people found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Person Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Edit Person' : 'Add New Person'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingUser ? 'Update user information' : 'Fill in the details to add a new person'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && task.length === 0 && !error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">No tasks available for this role</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className='text-red-500'>*</span></label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          const onlyLettersAndSpaces = value.replace(/[^a-zA-Z\s]/g, ''); // remove numbers & special chars
                          setFormData({ ...formData, name: onlyLettersAndSpaces });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location<span className='text-red-500'>*</span></label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => {
                          const value = e.target.value;
                          const onlyLettersAndSpaces = value.replace(/[^a-zA-Z\s]/g, ''); // remove numbers & special characters
                          setFormData({ ...formData, location: onlyLettersAndSpaces });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter location"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={async (e) => {
                          const value = e.target.value;
                          setFormData({...formData, email: value});
                          await validateEmail(value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          validationStatus.email.error ? 'border-red-500' : 
                          validationStatus.email.available && formData.email ? 'border-green-500' : 
                          'border-gray-300'
                        }`}
                        placeholder="Enter email address (optional)"
                        disabled={isLoading}
                      />
                      <div className="mt-1 h-5">
                        {validationStatus.email.checking && (
                          <p className="text-xs text-blue-600 flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking availability...
                          </p>
                        )}
                        {validationStatus.email.error && (
                          <p className="text-xs text-red-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validationStatus.email.error}
                          </p>
                        )}
                        {!validationStatus.email.checking && !validationStatus.email.error && formData.email && (
                          <p className="text-xs text-green-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Email available
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className='text-red-500'>*</span></label>
                      <input
                        type="tel"
                        value={formData.phone}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={async (e) => {
                          const value = e.target.value.replace(/\D/g, ''); 
                          setFormData({...formData, phone: value});
                          await validatePhone(value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          validationStatus.phone.error ? 'border-red-500' : 
                          validationStatus.phone.available && formData.phone ? 'border-green-500' : 
                          'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                        required
                        disabled={isLoading}
                      />
                      <div className="mt-1 h-5">
                        {validationStatus.phone.checking && (
                          <p className="text-xs text-blue-600 flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking availability...
                          </p>
                        )}
                        {validationStatus.phone.error && (
                          <p className="text-xs text-red-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validationStatus.phone.error}
                          </p>
                        )}
                        {!validationStatus.phone.checking && !validationStatus.phone.error && formData.phone && (
                          <p className="text-xs text-green-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Phone available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username<span className='text-red-500'>*</span> <span className='text-xs font-medium text-gray-400'>(Start with Aplabet)</span> </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={async (e) => {
                          let value = e.target.value;
                          value = value.replace(/\s/g, '');

                          // Remove any character that is not letter, number, or @
                          value = value.replace(/[^a-zA-Z0-9@]/g, '');

                          // Prevent typing if it doesn't start with a letter
                          if (value && !/^[a-zA-Z]/.test(value)) return;

                          // Allow only one @
                          const atMatches = value.match(/@/g);
                          if (atMatches && atMatches.length > 1) return;
                          setFormData({...formData, username: value});
                          await validateUsername(value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          editingUser ? 'bg-gray-100 cursor-not-allowed' : ''
                        } ${
                          validationStatus.username.error ? 'border-red-500' : 
                          validationStatus.username.available && formData.username ? 'border-green-500' : 
                          'border-gray-300'
                        }`}
                        placeholder="Enter username"
                        required
                        disabled={isLoading || editingUser}
                      />
                      <div className="mt-1 h-5">
                        {!editingUser && validationStatus.username.checking && (
                          <p className="text-xs text-blue-600 flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking availability...
                          </p>
                        )}
                        {validationStatus.username.error && (
                          <p className="text-xs text-red-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validationStatus.username.error}
                          </p>
                        )}
                        {!editingUser && !validationStatus.username.checking && !validationStatus.username.error && formData.username && (
                          <p className="text-xs text-green-600 flex items-center">
                            <svg className="h-3 w-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Username available
                          </p>
                        )}
                        {editingUser && (
                          <p className="text-xs text-gray-500">
                            Username cannot be changed after creation
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editingUser ? 'New Password' : 'Password'}
                        {!editingUser && <span className='text-red-500'>*</span>}
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                        required={!editingUser}
                        disabled={isLoading}
                        minLength={8}
                      />
                      {!editingUser && (
                        <p className="mt-1 text-xs text-gray-500">
                          Minimum 8 characters
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status - Only show when editing */}
                {editingUser && (
                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-gray-900">Status</h3>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="status"
                          value="Active"
                          checked={formData.status === 'Active'}
                          onChange={() => setFormData({...formData, status: 'Active'})}
                          disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700">Active</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          name="status"
                          value="InActive"
                          checked={formData.status === 'InActive'}
                          onChange={() => setFormData({...formData, status: 'InActive'})}
                          disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700">InActive</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      isLoading || 
                      !formData.name || 
                      !formData.phone || 
                      !formData.username || 
                      (!editingUser && !formData.password) ||
                      !validationStatus.username.available ||
                      !validationStatus.phone.available ||
                      (formData.email && !validationStatus.email.available) || // Only validate email if provided
                      task.length === 0
                    }
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingUser ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : editingUser ? 'Update Person' : 'Add Person'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}