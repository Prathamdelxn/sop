// 'use client';

// import React, { useState,useEffect } from 'react';
// import {
//   Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity
// } from 'lucide-react';

// const FacilityAdminsPage = () => {
//   const [facilityAdmins, setFacilityAdmins] = useState([
//     {
//       id: 1,
//       name: 'John Smith',
//       email: 'john.smith@company.com',
//       phone: '+1 (555) 123-4567',
//       status: 'active',
//       location: 'New York, NY',
//     },
//     {
//       id: 2,
//       name: 'Sarah Johnson',
//       email: 'sarah.johnson@company.com',
//       phone: '+1 (555) 234-5678',
//       status: 'active',
//       location: 'Los Angeles, CA',
//     }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     password: '',
//   });

//   const handleAddAdmin = () => {
//     setEditingAdmin(null);
//     setFormData({ name: '', email: '', phone: '', location: '', password: '' });
//     setIsModalOpen(true);
//   };
// useEffect(() => {
//   const fetchAdmins = async () => {
//     try {
//       const res = await fetch('/api/facility-admin/fetchAll');
//       const data = await res.json();

//       if (!res.ok) {
//         console.error('Failed to fetch admins:', data.message);
//         return;
//       }

//       const formattedAdmins = data.facilityAdmins.map((admin) => ({
//         id: admin.id || admin._id,
//         name: admin.name,
//         email: admin.email,
//         phone: admin.phone,
//         location: admin.location,
//         status: admin.status,
//       }));

//       setFacilityAdmins(formattedAdmins);
//     } catch (error) {
//       console.error('Error fetching facility admins:', error);
//     }
//   };

//   fetchAdmins();
// }, []);

//   const handleSubmit = async () => {
//     try {
//       const res = await fetch('/api/facility-admin/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to register Facility Admin');
//         return;
//       }

//       setFacilityAdmins(prev => [
//         ...prev,
//         {
//           id: data.facilityAdmin.id,
//           name: data.facilityAdmin.name,
//           email: data.facilityAdmin.email,
//           phone: data.facilityAdmin.phone,
//           location: data.facilityAdmin.location,
//           status: data.facilityAdmin.status,
//         }
//       ]);

//       setIsModalOpen(false);
//       setFormData({ name: '', email: '', phone: '', location: '', password: '' });
//       alert('Facility Admin registered successfully!');
//     } catch (error) {
//       console.error('Error registering facility admin:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this facility admin?')) return;

//     try {
//       const res = await fetch(`/api/facility-admin/delete-by-id/${id}`, {
//         method: 'DELETE',
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to delete');
//         return;
//       }

//       setFacilityAdmins((prev) => prev.filter((admin) => admin.id !== id));
//     } catch (error) {
//       console.error('Error deleting:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const filteredAdmins = facilityAdmins.filter((admin) => {
//     const matchesSearch =
//       admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       admin.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || admin.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status) =>
//     status === 'active'
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Facility Admin</h1>
//           <p className="text-gray-600 mt-2">Manage your Facility Admins</p>
//         </div>
//         <button
//           onClick={handleAddAdmin}
//           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           <Plus className="h-5 w-5" />
//           <span>Add Facility Admin</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-blue-100 p-6 rounded-xl border border-blue-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-blue-600 text-sm font-medium">Total Admins</p>
//               <p className="text-2xl font-bold text-blue-900">{facilityAdmins.length}</p>
//             </div>
//             <div className="bg-blue-500 p-3 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-green-100 p-6 rounded-xl border border-green-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-green-600 text-sm font-medium">Active Admins</p>
//               <p className="text-2xl font-bold text-green-900">
//                 {facilityAdmins.filter(a => a.status === 'active').length}
//               </p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-lg">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search admins..."
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

//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredAdmins.map((admin) => (
//           <div key={admin.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                   {admin.name.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{admin.name}</h3>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(admin.status)}`}>
//                 {admin.status}
//               </span>
//             </div>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{admin.email}</div>
//               <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{admin.phone}</div>
//               <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{admin.location}</div>
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
//               <button onClick={() => alert('Edit not implemented')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
//                 <Edit className="h-4 w-4" />
//               </button>
//               <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
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
//               {editingAdmin ? 'Edit Facility Admin' : 'Add Facility Admin'}
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

//               {!editingAdmin && (
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
//                   {editingAdmin ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FacilityAdminsPage;
// "use client";

// import React, { useState, useEffect } from 'react';
// import {
//   Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity
// } from 'lucide-react';

// const FacilityAdminsPage = () => {
//   const [facilityAdmins, setFacilityAdmins] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     password: '',
//   });

//   const fetchAdmins = async () => {
//     try {
//       const res = await fetch('/api/facility-admin/fetchAll');
//       const data = await res.json();

//       if (!res.ok) {
//         console.error('Failed to fetch admins:', data.message);
//         return;
//       }

//       const formattedAdmins = data.facilityAdmins.map((admin) => ({
//         id: admin.id || admin._id,
//         name: admin.name,
//         email: admin.email,
//         phone: admin.phone,
//         location: admin.location,
//         status: admin.status,
//       }));

//       setFacilityAdmins(formattedAdmins);
//     } catch (error) {
//       console.error('Error fetching facility admins:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const handleAddAdmin = () => {
//     setEditingAdmin(null);
//     setFormData({ name: '', email: '', phone: '', location: '', password: '' });
//     setIsModalOpen(true);
//   };

//   const handleEditAdmin = (admin) => {
//     setEditingAdmin(admin);
//     setFormData({
//       name: admin.name,
//       email: admin.email,
//       phone: admin.phone,
//       location: admin.location,
//       password: '',
//     });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async () => {
//     try {
//       const url = editingAdmin
//         ? `/api/facility-admin/update-by-id/${editingAdmin.id}`
//         : '/api/facility-admin/auth/register';

//       const method = editingAdmin ? 'PUT' : 'POST';

//       const body = editingAdmin
//         ? JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, location: formData.location })
//         : JSON.stringify(formData);

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to save Facility Admin');
//         return;
//       }

//       fetchAdmins();
//       setIsModalOpen(false);
//       setFormData({ name: '', email: '', phone: '', location: '', password: '' });
//       alert(editingAdmin ? 'Facility Admin updated successfully!' : 'Facility Admin registered successfully!');
//     } catch (error) {
//       console.error('Error saving facility admin:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this facility admin?')) return;

//     try {
//       const res = await fetch(`/api/facility-admin/delete-by-id/${id}`, {
//         method: 'DELETE',
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to delete');
//         return;
//       }

//       setFacilityAdmins((prev) => prev.filter((admin) => admin.id !== id));
//     } catch (error) {
//       console.error('Error deleting:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const filteredAdmins = facilityAdmins.filter((admin) => {
//     const matchesSearch =
//       admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       admin.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || admin.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status) =>
//     status === 'active'
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Facility Admin</h1>
//           <p className="text-gray-600 mt-2">Manage your Facility Admins</p>
//         </div>
//         <button
//           onClick={handleAddAdmin}
//           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           <Plus className="h-5 w-5" />
//           <span>Add Facility Admin</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-blue-100 p-6 rounded-xl border border-blue-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-blue-600 text-sm font-medium">Total Admins</p>
//               <p className="text-2xl font-bold text-blue-900">{facilityAdmins.length}</p>
//             </div>
//             <div className="bg-blue-500 p-3 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-green-100 p-6 rounded-xl border border-green-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-green-600 text-sm font-medium">Active Admins</p>
//               <p className="text-2xl font-bold text-green-900">
//                 {facilityAdmins.filter(a => a.status === 'active').length}
//               </p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-lg">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search admins..."
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

//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredAdmins.map((admin) => (
//           <div key={admin.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                   {admin.name.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{admin.name}</h3>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(admin.status)}`}>
//                 {admin.status}
//               </span>
//             </div>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{admin.email}</div>
//               <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{admin.phone}</div>
//               <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{admin.location}</div>
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
//               <button onClick={() => handleEditAdmin(admin)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
//                 <Edit className="h-4 w-4" />
//               </button>
//               <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">
//               {editingAdmin ? 'Edit Facility Admin' : 'Add Facility Admin'}
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

//               {!editingAdmin && (
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
//                   {editingAdmin ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FacilityAdminsPage;



"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, User, X, UserX
} from 'lucide-react';

const FacilityAdminsPage = () => {
  const [facilityAdmins, setFacilityAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
  });

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/facility-admin/fetchAll');
      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to fetch admins:', data.message);
        return;
      }

      const formattedAdmins = data.facilityAdmins.map((admin) => ({
        id: admin.id || admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        status: admin.status,
      }));

      setFacilityAdmins(formattedAdmins);
    } catch (error) {
      console.error('Error fetching facility admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', phone: '', location: '', password: '' });
    setIsModalOpen(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      location: admin.location,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleViewAdmin = (admin) => {
    setViewingAdmin(admin);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = editingAdmin
        ? `/api/facility-admin/update-by-id/${editingAdmin.id}`
        : '/api/facility-admin/auth/register';

      const method = editingAdmin ? 'PUT' : 'POST';

      const body = editingAdmin
        ? JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, location: formData.location })
        : JSON.stringify(formData);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to save Facility Admin');
        return;
      }

      fetchAdmins();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', location: '', password: '' });
      alert(editingAdmin ? 'Facility Admin updated successfully!' : 'Facility Admin registered successfully!');
    } catch (error) {
      console.error('Error saving facility admin:', error);
      alert('Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility admin?')) return;

    try {
      const res = await fetch(`/api/facility-admin/delete-by-id/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to delete');
        return;
      }

      setFacilityAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Something went wrong.');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedAdmins.length} selected admins?`)) return;

    try {
      const deletePromises = selectedAdmins.map(id => 
        fetch(`/api/facility-admin/delete-by-id/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      setFacilityAdmins(prev => prev.filter(admin => !selectedAdmins.includes(admin.id)));
      setSelectedAdmins([]);
      alert('Selected admins deleted successfully!');
    } catch (error) {
      console.error('Error deleting admins:', error);
      alert('Something went wrong.');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAdmins(paginatedAdmins.map(admin => admin.id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const handleSelectAdmin = (adminId, checked) => {
    if (checked) {
      setSelectedAdmins(prev => [...prev, adminId]);
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId));
    }
  };

  const filteredAdmins = facilityAdmins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || admin.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdmins = sortedAdmins.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) =>
    status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facility Admin</h1>
          <p className="text-gray-600 mt-2">Manage your Facility Admins</p>
        </div>
        <div className="flex space-x-3">
          {selectedAdmins.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedAdmins.length})</span>
            </button>
          )}
          <button
            onClick={handleAddAdmin}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add Facility Admin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Admins</p>
              <p className="text-2xl font-bold text-blue-900">{facilityAdmins.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Admins</p>
              <p className="text-2xl font-bold text-green-900">
                {facilityAdmins.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium">Deactive Admins</p>
              <p className="text-2xl font-bold text-red-900">
                {facilityAdmins.filter(a => a.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Name</span>
                    <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Email</span>
                    <SortIcon column="email" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('phone')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Phone</span>
                    <SortIcon column="phone" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Location</span>
                    <SortIcon column="location" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Status</span>
                    <SortIcon column="status" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {admin.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {admin.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(admin.status)}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewAdmin(admin)}
                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
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

        {/* Pagination
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAdmins.length)} of {sortedAdmins.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-gray-500">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div> */}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingAdmin ? 'Edit Facility Admin' : 'Add Facility Admin'}
            </h2>
            <div className="space-y-4">
              {['name', 'email', 'phone', 'location'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAdmin ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Admin Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {viewingAdmin.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{viewingAdmin.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingAdmin.status)}`}>
                    {viewingAdmin.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{viewingAdmin.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{viewingAdmin.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{viewingAdmin.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Admin ID</p>
                    <p className="text-sm font-medium text-gray-900">{viewingAdmin.id}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditAdmin(viewingAdmin);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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

export default FacilityAdminsPage;