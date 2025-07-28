// // "use client";

// // import React, { use, useEffect, useState } from 'react';
// // import { Plus, Search, Filter, Edit, Trash2, User, X } from 'lucide-react';

// // export default function DynamicDashboardPage({ params }) {
// //   const { slug } = use(params);
// //   const [people, setPeople] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterRole, setFilterRole] = useState('all');
// //   const [task,setTask]=useState([]);
// //     const [Id, setId] = useState();
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     companyId:Id,
// //     task:task,
// //     email: '',
// //     username: '',
// //     password: '',
// //     phone: '',
// //     role: slug,
// //     status: 'active'
// //   });
// // const slugify = (str) =>
// //   str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

// //   const handleAddPerson = () => {
// //     setIsModalOpen(true);
// //     setFormData({
// //       name: '',
// //       email: '',
// //       companyId:Id,
// //     task:task,
// //       username: '',
// //       password: '',
// //       phone: '',
// //       role: slug,
// //       status: 'active'
// //     });
// //   };
// //   useEffect(() => {
// //     const data = localStorage.getItem('user');
// //     const userdata = JSON.parse(data);
// //     console.log("asdf", userdata)
// //     setId(userdata.id);
// //   }, [])


// //  useEffect(() => {
// //     const fetchData = async () => {
// //       const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
// //       const newdata = await res.json();
// //       console.log(newdata.superAdmin);
     
// //       console.log(newdata.superAdmin?.workerRole);
// //       const dd = newdata.superAdmin?.workerRole;
      
      
     
      
// //      const matchedRole = dd?.find((role) => slugify(role.title) === slug);

// // console.log("Matched Role:", matchedRole);
// // setTask(matchedRole?.task);
// //     }
// //     fetchData();
// //   }, [Id])


// //  const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   const newPerson = {
// //     ...formData,
// //     companyId: Id,  // latest company ID
// //     task: task      // latest task from role
// //   };

// //   console.log("Submitted Person Data:", newPerson);

// //   try {
// //     const response = await fetch('/api/superAdmin/users/create', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(newPerson),
// //     });

// //     const result = await response.json();

// //     if (response.ok) {
// //       // Optional: show success toast or notification
// //       console.log('User created successfully:', result);

// //       // Add to UI
// //       setPeople([...people, { ...newPerson, id: Date.now().toString() }]);

// //       // Close modal
// //       setIsModalOpen(false);
// //     } else {
// //       // Handle errors (e.g., email already exists)
// //       console.error('Error creating user:', result.error);
// //       alert(result.error || "Something went wrong!");
// //     }
// //   } catch (error) {
// //     console.error('Network error:', error);
// //     alert("Failed to create user. Please try again later.");
// //   }
// // };


// //   const handleDelete = (id) => {
// //     if (window.confirm('Are you sure you want to delete this person?')) {
// //       setPeople(people.filter(person => person.id !== id));
// //     }
// //   };

// //   const filteredPeople = people.filter(person => {
// //     const matchesSearch = 
// //       person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       person.phone.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesRole = filterRole === 'all' || person.role === filterRole;
// //     return matchesSearch && matchesRole;
// //   });

// //   const getRoleColor = (role) => {
// //     switch(role) {
// //       case 'admin': return 'bg-purple-100 text-purple-800';
// //       case 'manager': return 'bg-blue-100 text-blue-800';
// //       case 'member': return 'bg-green-100 text-green-800';
// //       default: return 'bg-gray-100 text-gray-800';
// //     }
// //   };

// //   const getStatusColor = (status) => 
// //     status === 'active' 
// //       ? 'bg-green-100 text-green-800 border-green-200' 
// //       : 'bg-red-100 text-red-800 border-red-200';

// //   return (
// //     <div className="space-y-8 p-6">
// //       {/* Header */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-900">Welcome to {slug} Dashboard</h1>
// //           <p className="text-gray-600 mt-2">Manage people and their roles in this space</p>
// //         </div>
// //         <button
// //           onClick={handleAddPerson}
// //           className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
// //         >
// //           <Plus className="h-5 w-5" />
// //           <span>Add Person</span>
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// //         <div className="flex flex-col sm:flex-row gap-4">
// //           <div className="flex-1 relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
// //             <input
// //               type="text"
// //               placeholder="Search people..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* People Table */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Username</th>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
// //                 <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
// //                 <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {filteredPeople.map((person) => (
// //                 <tr key={person.id} className="hover:bg-gray-50">
// //                   <td className="py-4 px-6">
// //                     <div className="flex items-center space-x-3">
// //                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
// //                         {person.name.split(' ').map(n => n[0]).join('')}
// //                       </div>
// //                       <span className="font-medium text-gray-900">{person.name}</span>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-6 text-gray-600">{person.email}</td>
// //                   <td className="py-4 px-6 text-gray-600">{person.username}</td>
// //                   <td className="py-4 px-6 text-gray-600">{person.phone}</td>
// //                   <td className="py-4 px-6">
// //                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
// //                       {person.role}
// //                     </span>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
// //                       {person.status}
// //                     </span>
// //                   </td>
// //                   <td className="py-4 px-6">
// //                     <div className="flex justify-end space-x-2">
// //                       <button
// //                         onClick={() => handleDelete(person.id)}
// //                         className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
// //                         title="Delete"
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //           {filteredPeople.length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-gray-500">No people found</div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Add Person Modal */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-xl font-semibold">Add New Person</h2>
// //               <button
// //                 onClick={() => setIsModalOpen(false)}
// //                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>
            
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// //                 <input
// //                   type="text"
// //                   value={formData.name}
// //                   onChange={(e) => setFormData({...formData, name: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //                 <input
// //                   type="email"
// //                   value={formData.email}
// //                   onChange={(e) => setFormData({...formData, email: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
// //                 <input
// //                   type="text"
// //                   value={formData.username}
// //                   onChange={(e) => setFormData({...formData, username: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// //                 <input
// //                   type="password"
// //                   value={formData.password}
// //                   onChange={(e) => setFormData({...formData, password: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
// //                 <input
// //                   type="tel"
// //                   value={formData.phone}
// //                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                   required
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// //                 <select
// //                   value={formData.status}
// //                   onChange={(e) => setFormData({...formData, status: e.target.value})}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                 >
// //                   <option value="active">Active</option>
// //                   <option value="inactive">Inactive</option>
// //                 </select>
// //               </div>
              
// //               <div className="flex space-x-3 pt-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsModalOpen(false)}
// //                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //                 >
// //                   Add Person
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import React, { use, useEffect, useState } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, User, X } from 'lucide-react';

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

//   const [formData, setFormData] = useState({
//     name: '',
//     companyId: Id,
//     task: task,
//     email: '',
//     username: '',
//     password: '',
//     phone: '',
//     role: slug,
//     status: 'active'
//   });

//   const slugify = (str) =>
//     str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

//   useEffect(() => {
//     const data = localStorage.getItem('user');
//     const userdata = JSON.parse(data);
//     setId(userdata?.id);
//   }, []);

//   useEffect(() => {
//     if (Id) {
//       fetchRoleData();
//     }
//   }, [Id, slug]);

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

//   const handleAddPerson = () => {
//     setIsModalOpen(true);
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'active'
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate tasks
//     if (!task || task.length === 0) {
//       alert("Cannot submit: No tasks available for this role");
//       return;
//     }

//     const newPerson = {
//       ...formData,
//       companyId: Id,
//       task: task
//     };

//     try {
//       setIsLoading(true);
//       const response = await fetch('/api/superAdmin/users/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newPerson),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create user');
//       }

//       const result = await response.json();
//       setPeople([...people, { ...newPerson, id: Date.now().toString() }]);
//       setIsModalOpen(false);
//       alert('User created successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this person?')) {
//       setPeople(people.filter(person => person.id !== id));
//     }
//   };

//   const filteredPeople = people.filter(person => {
//     const matchesSearch = 
//       person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.phone.toLowerCase().includes(searchTerm.toLowerCase());
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
//     status === 'active' 
//       ? 'bg-green-100 text-green-800 border-green-200' 
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Welcome to {slug} Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage people and their roles in this space</p>
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
//                 <tr key={person.id} className="hover:bg-gray-50">
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                         {person.name.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <span className="font-medium text-gray-900">{person.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-600">{person.email}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.username}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.phone}</td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
//                       {person.role}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
//                       {person.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleDelete(person.id)}
//                         className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
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

//       {/* Add Person Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Add New Person</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
//                 disabled={isLoading}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             {isLoading && (
//               <div className="text-center py-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-blue-600">Loading role data...</p>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 <strong className="font-bold">Error: </strong>
//                 <span>{error}</span>
//               </div>
//             )}

//             {!isLoading && task.length === 0 && !error && (
//               <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//                 <strong>Note: </strong>
//                 <span>No tasks available for this role</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                 <input
//                   type="text"
//                   value={formData.username}
//                   onChange={(e) => setFormData({...formData, username: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({...formData, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   disabled={isLoading}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
              
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//                   disabled={isLoading || task.length === 0}
//                 >
//                   {isLoading ? 'Submitting...' : 'Add Person'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import React, { use, useEffect, useState } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, User, X } from 'lucide-react';

// export default function DynamicDashboardPage({ params }) {
//   const { slug } = use(params);
//   const [people, setPeople] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');
//   const [task, setTask] = useState([]);
//   const [Id, setId] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     companyId: Id,
//     task: task,
//     email: '',
//     username: '',
//     password: '',
//     phone: '',
//     role: slug,
//     status: 'active'
//   });

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
//       const filteredUsers = (data.users || []).filter(user => user.role === slug  && user.companyId === Id);

//     setPeople(filteredUsers);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
// const handleEdit = (user) => {
//   setEditingUser(user);
//   setFormData({
//     name: user.name,
//     email: user.email,
//     companyId: Id,
//     task: task,
//     username: user.username,
//     password: '', // Don't pre-fill password for security
//     phone: user.phone,
//     role: slug,
//     status: user.status
//   });
//   setIsModalOpen(true);
// };
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

//   const handleAddPerson = () => {
//     setIsModalOpen(true);
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'active'
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!task || task.length === 0) {
//       alert("Cannot submit: No tasks available for this role");
//       return;
//     }

//     const newPerson = {
//       ...formData,
//       companyId: Id,
//       task: task
//     };

//     try {
//       setIsLoading(true);
//       const response = await fetch('/api/superAdmin/users/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newPerson),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create user');
//       }

//       const result = await response.json();
//       setPeople([...people, { ...newPerson, id: Date.now().toString() }]);
//       setIsModalOpen(false);
//       alert('User created successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this person?')) {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/superAdmin/users/update-status/${id}`, {
//           method: 'PUT',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete user');
//         }

       
//       } catch (error) {
//         console.error('Error deleting user:', error);
//         alert(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
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
//     status === 'active' 
//       ? 'bg-green-100 text-green-800 border-green-200' 
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 capitalize">Welcome to {slug.replace('-', ' ')} Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage people and their roles in this space</p>
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
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                         {person.name?.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <span className="font-medium text-gray-900">{person.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-600">{person.email}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.username}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.phone}</td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
//                       {person.role}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
//                       {person.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleDelete(person._id)}
//                         className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
//                         title="Delete"
//                         disabled={isLoading}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
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

//       {/* Add Person Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Add New Person</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
//                 disabled={isLoading}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             {isLoading && (
//               <div className="text-center py-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-blue-600">Loading role data...</p>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 <strong className="font-bold">Error: </strong>
//                 <span>{error}</span>
//               </div>
//             )}

//             {!isLoading && task.length === 0 && !error && (
//               <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//                 <strong>Note: </strong>
//                 <span>No tasks available for this role</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                 <input
//                   type="text"
//                   value={formData.username}
//                   onChange={(e) => setFormData({...formData, username: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({...formData, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   disabled={isLoading}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
              
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//                   disabled={isLoading || task.length === 0}
//                 >
//                   {isLoading ? 'Submitting...' : 'Add Person'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import React, { use, useEffect, useState } from 'react';
// import { Plus, Search, Filter,MonitorCheck, Edit, Trash2, User, X } from 'lucide-react';

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

//   const [formData, setFormData] = useState({
//     name: '',
//     companyId: Id,
//     task: task,
//     email: '',
//     username: '',
//     password: '',
//     phone: '',
//     role: slug,
//     status: 'active',
//     location: '' 
//   });

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

//   const handleAddPerson = () => {
//     setEditingUser(null);
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'active',
//       location: '' 
//     });
//     setIsModalOpen(true);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
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
//       alert("Cannot submit: No tasks available for this role");
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
//       alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this person?')) {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/superAdmin/users/update-status/${id}`, {
//           method: 'PUT',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete user');
//         }

//         // Refresh the user list
//         await fetchPeople();
//       } catch (error) {
//         console.error('Error deleting user:', error);
//         alert(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingUser(null);
//     setFormData({
//       name: '',
//       email: '',
//       companyId: Id,
//       task: task,
//       username: '',
//       password: '',
//       phone: '',
//       role: slug,
//       status: 'active'
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
//     status === 'active' 
//       ? 'bg-green-100 text-green-800 border-green-200' 
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <div className="space-y-8 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 capitalize">Welcome to {slug.replace('-', ' ')} Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage people and their roles in this space</p>
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
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                         {person.name?.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <span className="font-medium text-gray-900">{person.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-600">{person.email}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.username}</td>
//                   <td className="py-4 px-6 text-gray-600">{person.phone}</td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
//                       {person.role}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
//                       {person.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleEdit(person)}
//                         className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
//                         title="Edit"
//                         disabled={isLoading}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       {person.status=="deactive"?<><button
//                         onClick={() => handleDelete(person._id)}
//                         className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
//                         title="Delete"
//                         disabled={isLoading}
//                       >
//                         <MonitorCheck  className="h-4 w-4"  />
//                       </button></>: <button
//                         onClick={() => handleDelete(person._id)}
//                         className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
//                         title="Delete"
//                         disabled={isLoading}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>}
                     
//                     </div>
//                   </td>
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
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">
//                 {editingUser ? 'Edit Person' : 'Add New Person'}
//               </h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
//                 disabled={isLoading}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             {isLoading && (
//               <div className="text-center py-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-blue-600">Loading role data...</p>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 <strong className="font-bold">Error: </strong>
//                 <span>{error}</span>
//               </div>
//             )}

//             {!isLoading && task.length === 0 && !error && (
//               <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//                 <strong>Note: </strong>
//                 <span>No tasks available for this role</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
              
//              <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//   <input
//     type="text"
//     value={formData.username}
//     onChange={(e) => setFormData({...formData, username: e.target.value})}
//     className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
//       editingUser ? 'bg-gray-100 cursor-not-allowed' : ''
//     }`}
//     required
//     disabled={isLoading || editingUser} // Disabled when editing or loading
//   />
// </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password {editingUser && '(leave blank to keep current)'}
//                 </label>
//                 <input
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required={!editingUser}
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//               <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//   <input
//     type="text"
//     value={formData.location}
//     onChange={(e) => setFormData({...formData, location: e.target.value})}
//     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//     required
//     disabled={isLoading}
//   />
// </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({...formData, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   disabled={isLoading}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
              
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//                   disabled={isLoading || task.length === 0}
//                 >
//                   {isLoading 
//                     ? (editingUser ? 'Updating...' : 'Submitting...')
//                     : (editingUser ? 'Update Person' : 'Add Person')}
//                 </button>
//               </div>
//             </form>
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

  const [formData, setFormData] = useState({
    name: '',
    companyId: Id,
    task: task,
    email: '',
    username: '',
    password: '',
    phone: '',
    role: slug,
    status: 'active',
    location: '' 
  });

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

  const validateEmail = async (email) => {
    if (!email) return;
    
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
      status: 'active',
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
      alert("Cannot submit: No tasks available for this role");
      return;
    }

    // Check all fields are available
    if (!validationStatus.email.available || 
        !validationStatus.username.available || 
        !validationStatus.phone.available) {
      alert('Please fix the validation errors before submitting');
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
      alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/superAdmin/users/update-status/${id}`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Refresh the user list
        await fetchPeople();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
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
      status: 'active',
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
    status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">Welcome to {slug.replace('-', ' ')} Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage people and their roles in this space</p>
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
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {person.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{person.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{person.email}</td>
                  <td className="py-4 px-6 text-gray-600">{person.username}</td>
                  <td className="py-4 px-6 text-gray-600">{person.phone}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
                      {person.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
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
                      {person.status=="deactive"?<><button
                        onClick={() => handleDelete(person._id)}
                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                        disabled={isLoading}
                      >
                        <MonitorCheck className="h-4 w-4" />
                      </button></>: <button
                        onClick={() => handleDelete(person._id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingUser ? 'Edit Person' : 'Add New Person'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-blue-600">Loading role data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}

            {!isLoading && task.length === 0 && !error && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <strong>Note: </strong>
                <span>No tasks available for this role</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setFormData({...formData, email: value});
                    await validateEmail(value);
                  }}
                  className={`w-full px-3 py-2 border ${
                    validationStatus.email.error ? 'border-red-500' : 
                    validationStatus.email.available ? 'border-green-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                  required
                  disabled={isLoading}
                />
                <div className="h-6 mt-1">
                  {validationStatus.email.checking && (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm text-gray-500">Checking...</span>
                    </div>
                  )}
                  {validationStatus.email.error && (
                    <p className="text-red-500 text-sm">{validationStatus.email.error}</p>
                  )}
                  {!validationStatus.email.checking && !validationStatus.email.error && formData.email && (
                    <p className="text-green-500 text-sm">✓ Email available</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setFormData({...formData, username: value});
                    await validateUsername(value);
                  }}
                  className={`w-full px-3 py-2 border ${
                    validationStatus.username.error ? 'border-red-500' : 
                    validationStatus.username.available ? 'border-green-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    editingUser ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
                  disabled={isLoading || editingUser}
                />
                <div className="h-6 mt-1">
                  {!editingUser && validationStatus.username.checking && (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm text-gray-500">Checking...</span>
                    </div>
                  )}
                  {validationStatus.username.error && (
                    <p className="text-red-500 text-sm">{validationStatus.username.error}</p>
                  )}
                  {!editingUser && !validationStatus.username.checking && !validationStatus.username.error && formData.username && (
                    <p className="text-green-500 text-sm">✓ Username available</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setFormData({...formData, phone: value});
                    await validatePhone(value);
                  }}
                  className={`w-full px-3 py-2 border ${
                    validationStatus.phone.error ? 'border-red-500' : 
                    validationStatus.phone.available ? 'border-green-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                  required
                  disabled={isLoading}
                />
                <div className="h-6 mt-1">
                  {validationStatus.phone.checking && (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm text-gray-500">Checking...</span>
                    </div>
                  )}
                  {validationStatus.phone.error && (
                    <p className="text-red-500 text-sm">{validationStatus.phone.error}</p>
                  )}
                  {!validationStatus.phone.checking && !validationStatus.phone.error && formData.phone && (
                    <p className="text-green-500 text-sm">✓ Phone available</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={
                    isLoading || 
                    task.length === 0 ||
                    !validationStatus.email.available ||
                    !validationStatus.username.available ||
                    !validationStatus.phone.available
                  }
                >
                  {isLoading 
                    ? (editingUser ? 'Updating...' : 'Submitting...')
                    : (editingUser ? 'Update Person' : 'Add Person')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}