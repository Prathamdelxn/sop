// 'use client';

// import React, { useState } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity } from 'lucide-react';
// import { useEffect } from 'react';
// const SupervisorsPage = () => {
//   const [supervisors, setSupervisors] = useState([
   
    
//   ]);

//   useEffect(()=>{
//   const fetchAllQA=async()=>{
//     const res= await fetch("/api/qa/fetch-all")
//     const data= await res.json();
//    setSupervisors // console.log("data",data.data);
//     setSupervisors(data.data)
  
//   }
//   fetchAllQA();
//   },[])

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSupervisor, setEditingSupervisor] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     password: '',
//   });

//   const handleAddSupervisor = () => {
//     setEditingSupervisor(null);
//     setFormData({ name: '', email: '', phone: '', location: '', password: '' });
//     setIsModalOpen(true);
//   };



//   const handleEditSupervisor = (supervisor) => {
//     setEditingSupervisor(supervisor);
//     setFormData({
//       name: supervisor.name,
//       email: supervisor.email,
//       phone: supervisor.phone,
//       location: supervisor.location,
//       password: '', // Don't show/edit password on update
//     });
//     setIsModalOpen(true);
//   };



// const handleSubmit = async () => {
//   console.log("hello world", formData);

//   try {
//     const response = await fetch('/api/qa/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       console.log('Data submitted successfully:', result);
//       // Optionally reset the form or show success message
//     } else {
//       console.error('Error submitting data:', result.message || result);
//     }
//   } catch (error) {
//     console.error('Request failed:', error);
//   }
// };


// const handleDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this supervisor?')) return;

//   try {
//     const res = await fetch(`/api/supervisor/delete-by-id/${id}`, {
//       method: 'DELETE',
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.message || 'Failed to delete supervisor');
//       return;
//     }

//     setSupervisors((prev) => prev.filter((s) => s.id !== id));
//   } catch (error) {
//     console.error('Error deleting supervisor:', error);
//     alert('Something went wrong.');
//   }
// };


//   const filteredSupervisors = supervisors.filter(supervisor => {
//     const matchesSearch =
//       supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || supervisor.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status) =>
//     status === 'active'
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">QA Staff</h1>
//           <p className="text-gray-600 mt-2">Manage your QA Staff and their info</p>
//         </div>
//         <button
//           onClick={handleAddSupervisor}
//           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           <Plus className="h-5 w-5" />
//           <span>Add QA Staff</span>
//         </button>

//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-blue-600 text-sm font-medium">Total QA Staff</p>
//               <p className="text-2xl font-bold text-blue-900">{supervisors.length}</p>
//             </div>
//             <div className="bg-blue-500 p-3 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-green-600 text-sm font-medium">Active QA Staff</p>
//               <p className="text-2xl font-bold text-green-900">{supervisors.filter(s => s.status === 'active').length}</p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-lg">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search QA Staff..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Filter className="h-5 w-5 text-gray-400" />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Supervisors List */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredSupervisors.map((supervisor) => (
//           <div key={supervisor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                   {supervisor.name.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{supervisor.name}</h3>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(supervisor.status)}`}>
//                 {supervisor.status}
//               </span>
//             </div>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{supervisor.email}</div>
//               <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{supervisor.phone}</div>
//               <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{supervisor.location}</div>
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
//               <button onClick={() => handleEditSupervisor(supervisor)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
//                 <Edit className="h-4 w-4" />
//               </button>
//               <button onClick={() => handleDelete(supervisor.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">
//               {editingSupervisor ? 'Edit Supervisor' : 'Add Supervisor'}
//             </h2>
//             <div className="space-y-4">
//               {['name', 'email', 'phone', 'location'].map((field) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
//                   <input
//                     type={field === 'email' ? 'email' : 'text'}
//                     value={formData[field]}
//                     onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}

//               {/* Password only in Add Mode */}
//               {!editingSupervisor && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                   <input
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               )}

//               <div className="flex space-x-3 pt-4">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   {editingSupervisor ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupervisorsPage;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity
// } from 'lucide-react';

// const SupervisorsPage = () => {
//   const [supervisors, setSupervisors] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSupervisor, setEditingSupervisor] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     password: '',
//     status: 'active', // optional default
//   });

//   // Fetch all QAs
//   const fetchAllQA = async () => {
//     try {
//       const res = await fetch("/api/qa/fetch-all");
//       const data = await res.json();
//       setSupervisors(data.data || []);
//     } catch (error) {
//       console.error("Fetch QA error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllQA();
//   }, []);

//   const handleAddSupervisor = () => {
//     setEditingSupervisor(null);
//     setFormData({ name: '', email: '', phone: '', location: '', password: '', status: 'active' });
//     setIsModalOpen(true);
//   };

//   const handleEditSupervisor = (supervisor) => {
//     setEditingSupervisor(supervisor);
//     setFormData({
//       name: supervisor.name,
//       email: supervisor.email,
//       phone: supervisor.phone,
//       location: supervisor.location,
//       password: '',
//       status: supervisor.status || 'active',
//     });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('/api/qa/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log('Submitted:', result);
//         setIsModalOpen(false);
//         setEditingSupervisor(null);
//         setFormData({ name: '', email: '', phone: '', location: '', password: '', status: 'active' });
//         fetchAllQA(); // Refresh
//       } else {
//         alert(result.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Request failed:', error);
//     }
//   };

//   const handleDelete = async (_id) => {
//     if (!window.confirm('Are you sure you want to delete this supervisor?')) return;
//     try {
//       const res = await fetch(`/api/supervisor/delete-by-id/${_id}`, { method: 'DELETE' });
//       const data = await res.json();

//       if (res.ok) {
//         setSupervisors(prev => prev.filter(s => s._id !== _id));
//       } else {
//         alert(data.message || 'Failed to delete supervisor');
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const filteredSupervisors = supervisors.filter(supervisor => {
//     const matchesSearch =
//       supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || supervisor.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status) =>
//     status === 'active'
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">QA Staff</h1>
//           <p className="text-gray-600 mt-2">Manage your QA Staff and their info</p>
//         </div>
//         <button
//           onClick={handleAddSupervisor}
//           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105"
//         >
//           <Plus className="h-5 w-5" />
//           <span>Add QA Staff</span>
//         </button>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-blue-600 text-sm font-medium">Total QA Staff</p>
//               <p className="text-2xl font-bold text-blue-900">{supervisors.length}</p>
//             </div>
//             <div className="bg-blue-500 p-3 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-green-50 p-6 rounded-xl border border-green-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-green-600 text-sm font-medium">Active QA Staff</p>
//               <p className="text-2xl font-bold text-green-900">
//                 {supervisors.filter(s => s.status === 'active').length}
//               </p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-lg">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search QA Staff..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Filter className="h-5 w-5 text-gray-400" />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* QA Cards List */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredSupervisors.map((supervisor) => (
//           <div key={supervisor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                   {supervisor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{supervisor.name}</h3>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(supervisor.status)}`}>
//                 {supervisor.status}
//               </span>
//             </div>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{supervisor.email}</div>
//               <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{supervisor.phone}</div>
//               <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{supervisor.location}</div>
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
//               <button onClick={() => handleEditSupervisor(supervisor)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
//                 <Edit className="h-4 w-4" />
//               </button>
//               <button onClick={() => handleDelete(supervisor._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">
//               {editingSupervisor ? 'Edit Supervisor' : 'Add Supervisor'}
//             </h2>
//             <div className="space-y-4">
//               {['name', 'email', 'phone', 'location'].map((field) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
//                   <input
//                     type={field === 'email' ? 'email' : 'text'}
//                     value={formData[field]}
//                     onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}

//               {!editingSupervisor && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                   <input
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               )}

//               <div className="flex space-x-3 pt-4">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   {editingSupervisor ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupervisorsPage;




'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity, Eye, UserX
} from 'lucide-react';

const SupervisorsPage = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [viewingSupervisor, setViewingSupervisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    status: 'active',
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleData = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        location: 'New York',
        status: 'active',
        department: 'Quality Assurance',
        joinDate: '2023-01-15',
        experience: '5 years'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        location: 'Los Angeles',
        status: 'inactive',
        department: 'Quality Assurance',
        joinDate: '2022-08-20',
        experience: '3 years'
      },
      {
        _id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1234567892',
        location: 'Chicago',
        status: 'active',
        department: 'Quality Assurance',
        joinDate: '2023-03-10',
        experience: '7 years'
      }
    ];
    setSupervisors(sampleData);
  }, []);

  // Fetch all supervisors
  const fetchAllQA = async () => {
    try {
      const res = await fetch("/api/qa/fetch-all");
      const data = await res.json();
      setSupervisors(data.data || []);
    } catch (error) {
      console.error("Fetch QA error:", error);
    }
  };

  const handleAddSupervisor = () => {
    setEditingSupervisor(null);
    setFormData({ name: '', email: '', phone: '', location: '', password: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEditSupervisor = (supervisor) => {
    setEditingSupervisor(supervisor);
    setFormData({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      location: supervisor.location,
      password: '',
      status: supervisor.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleViewSupervisor = (supervisor) => {
    setViewingSupervisor(supervisor);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/qa/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Submitted:', result);
        setIsModalOpen(false);
        setEditingSupervisor(null);
        setFormData({ name: '', email: '', phone: '', location: '', password: '', status: 'active' });
        fetchAllQA(); // Refresh
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this supervisor?')) return;
    try {
      const res = await fetch(`/api/supervisor/delete-by-id/${_id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setSupervisors(prev => prev.filter(s => s._id !== _id));
      } else {
        alert(data.message || 'Failed to delete supervisor');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong.');
    }
  };

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch =
      supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || supervisor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) =>
    status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';

  const getStatusBadge = (status) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QA Staff</h1>
          <p className="text-gray-600 mt-2">Manage your QA Staff and their info</p>
        </div>
        <button
          onClick={handleAddSupervisor}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add QA Staff</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total QA Staff</p>
              <p className="text-2xl font-bold text-blue-900">{supervisors.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 text-sm font-medium">Active QA Staff</p>
              <p className="text-2xl font-bold text-green-900">
                {supervisors.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium">Deactive QA Staff</p>
              <p className="text-2xl font-bold text-red-900">
                {supervisors.filter(s => s.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search QA Staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QA Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupervisors.map((supervisor) => (
                <tr key={supervisor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {supervisor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{supervisor.name}</div>
                        <div className="text-sm text-gray-500">{supervisor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{supervisor.phone}</div>
                    <div className="text-sm text-gray-500">{supervisor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{supervisor.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(supervisor.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSupervisor(supervisor)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditSupervisor(supervisor)}
                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supervisor._id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSupervisors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No QA Staff found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingSupervisor ? 'Edit QA Staff' : 'Add QA Staff'}
            </h2>
            <div className="space-y-4">
              {['name', 'email', 'phone', 'location'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {!editingSupervisor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSupervisor ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingSupervisor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">QA Staff Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {viewingSupervisor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{viewingSupervisor.name}</h3>
                  <p className="text-sm text-gray-500">{viewingSupervisor.department || 'Quality Assurance'}</p>
                  {getStatusBadge(viewingSupervisor.status)}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{viewingSupervisor.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{viewingSupervisor.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 text-gray-900">{viewingSupervisor.location}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="text-gray-900">{viewingSupervisor.joinDate || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="text-gray-900">{viewingSupervisor.experience || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="text-gray-900">{viewingSupervisor.department || 'Quality Assurance'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditSupervisor(viewingSupervisor);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorsPage;