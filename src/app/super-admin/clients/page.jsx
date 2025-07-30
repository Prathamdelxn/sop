// // 'use client'

// // import { useEffect, useState } from 'react';

// // export default function ClientManagement() {
// //   const [clients, setClients] = useState([]);
// // const [errors, setErrors] = useState({});

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editingClientId, setEditingClientId] = useState(null);
// //   const [isUploading, setIsUploading] = useState(false);
// // useEffect(()=>{
// //     const fetchdata=async()=>{
// //         const res = await fetch('/api/superAdmin/fetchAll')
// //         const data = await res.json();
// //         console.log(data.superadmins);
// //         setClients(data.superadmins);
// //     }
// // fetchdata();
// // },[])
// //   const [newClient, setNewClient] = useState({
// //     name: '',
// //     email: '',
// //     phone: '',
// //     address: '',
// //     username: '',
// //     password: '',
// //     status: 'Active',
// //     logo: null,
// //     logoPreview: ''
// //   });


// // const handleInputChange = async (e) => {
// //   const { name, value } = e.target;

// //   if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) return;
// //   if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;

// //   setNewClient((prev) => ({ ...prev, [name]: value }));

// //   if (['username', 'email', 'phone'].includes(name)) {
// //     const payload = {
// //       idToExclude: isEditing ? editingClientId : null,
// //       username: name === 'username' ? value : newClient.username,
// //       email: name === 'email' ? value : newClient.email,
// //       phone: name === 'phone' ? value : newClient.phone,
// //     };

// //     try {
// //       const res = await fetch('/api/check-username', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await res.json();

// //       setErrors((prev) => ({
// //         ...prev,
// //         username: data.usernameExists ? 'Username already exists' : '',
// //         email: data.emailExists ? 'Email already exists' : '',
// //         phone: data.phoneExists ? 'Phone number already exists' : '',
// //       }));
// //     } catch (err) {
// //       console.error('Validation error:', err);
// //     }
// //   }
// // };


// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setNewClient(prev => ({
// //           ...prev,
// //           logo: file,
// //           logoPreview: reader.result
// //         }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const uploadImageToCloudinary = async (file) => {
// //     const formData = new FormData();
// //     formData.append('file', file);
    
// //     try {
// //       const response = await fetch('/api/upload', {
// //         method: 'POST',
// //         body: formData
// //       });
      
// //       if (!response.ok) {
// //         throw new Error('Upload failed');
// //       }
      
// //       const data = await response.json();
// //       return data.url; // Return the secure URL from Cloudinary
// //     } catch (error) {
// //       console.error('Upload error:', error);
// //       throw error;
// //     }
// //   };
// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setIsUploading(true);
// //   setErrors({}); // reset errors before submit

// //   try {
// //     let logoUrl = newClient.logoPreview;

// //     const alreadyExists = clients.some(client =>
// //       (!isEditing || client._id !== editingClientId) &&
// //       (
// //         client.email === newClient.email ||
// //         client.phone === newClient.phone ||
// //         client.username === newClient.username
// //       )
// //     );

// //     if (alreadyExists) {
// //       const error = {};
// //       if (clients.some(c => c.email === newClient.email && (!isEditing || c._id !== editingClientId))) {
// //         error.email = 'Email already exists';
// //       }
// //       if (clients.some(c => c.phone === newClient.phone && (!isEditing || c._id !== editingClientId))) {
// //         error.phone = 'Phone number already exists';
// //       }
// //       if (clients.some(c => c.username === newClient.username && (!isEditing || c._id !== editingClientId))) {
// //         error.username = 'Username already exists';
// //       }

// //       setErrors(error);
// //       setIsUploading(false);
// //       return;
// //     }

// //     // Upload logo if a new file is selected
// //     if (newClient.logo instanceof File) {
// //       logoUrl = await uploadImageToCloudinary(newClient.logo);
// //     }

// //     const payload = {
// //       ...newClient,
// //       logo: logoUrl,
// //       joined: isEditing 
// //         ? clients.find(client => client._id === editingClientId)?.joined 
// //         : new Date().toISOString().split('T')[0]
// //     };

// //     if (isEditing) {
// //       const response = await fetch(`/api/superAdmin/update`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ id: editingClientId, ...payload })
// //       });

// //       if (!response.ok) throw new Error('Update failed');

// //       const updatedClients = clients.map(client =>
// //         client._id === editingClientId
// //           ? { ...client, ...payload }
// //           : client
// //       );
// //       setClients(updatedClients);
// //     } else {
// //       const response = await fetch('/api/superAdmin/create', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload)
// //       });

// //       if (!response.ok) throw new Error('Creation failed');

// //       const result = await response.json();
// //       const newClientWithId = {
// //         ...payload,
// //         id: result.id || clients.length + 1
// //       };

// //       setClients([...clients, newClientWithId]);
// //     }

// //     resetFormAndCloseModal();
// //   } catch (error) {
// //     console.error('Error submitting client:', error);
// //     alert('Error occurred. Please try again.');
// //   } finally {
// //     setIsUploading(false);
// //   }
// // };


// //  const handleDelete = async (id) => {
// //   try {
// //     const response = await fetch(`/api/superAdmin/updateStatus`, {
// //       method: 'PUT',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ id, status: 'Inactive' })
// //     });

// //     if (!response.ok) {
// //       throw new Error('Failed to update status');
// //     }

// //     // Update local state
// //     const updatedClients = clients.map(client =>
// //       client._id === id ? { ...client, status: 'Inactive' } : client
// //     );
// //     setClients(updatedClients);
// //   } catch (error) {
// //     console.error('Error updating status:', error);
// //     alert('Error deactivating client');
// //   }
// // };


// //   const handleEdit = (client) => {
// //     setIsModalOpen(true);
// //     setIsEditing(true);
// //     setEditingClientId(client._id);
// //     setNewClient({
// //       name: client.name,
// //       email: client.email,
// //       phone: client.phone,
// //       address: client.address,
// //       username: client.username || '',
// //       status: client.status,
// //         password: '',
// //       logo: null, // Reset the file object
// //       logoPreview: client.logo || '' // Set preview to existing URL
// //     });
// //   };

// //   const resetFormAndCloseModal = () => {
// //     setNewClient({
// //       name: '',
// //       email: '',
// //       phone: '',
// //       address: '',
// //       username: '',
// //       status: 'Active',
// //       logo: null,
// //       logoPreview: ''
// //     });
// //     setIsModalOpen(false);
// //     setIsEditing(false);
// //     setEditingClientId(null);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex justify-between items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
// //             <p className="text-gray-600 mt-1">Manage all your client relationships in one place</p>
// //           </div>
// //           <button
// //             onClick={() => setIsModalOpen(true)}
// //             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
// //             </svg>
// //             Add New Client
// //           </button>
// //         </div>

// //         {/* Client Table */}
// //         <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {clients.map((client) => (
// //                   <tr key={client._id} className="hover:bg-gray-50 transition-colors">
// //                     <td className="px-8 py-4 whitespace-nowrap">
// //                       <div className="flex items-center">
// //                         {client.logo ? (
// //                           <img className="h-10 w-10 rounded-full object-cover mr-3" src={client.logo} alt={client.name} />
// //                         ) : (
// //                           <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
// //                             <span className="text-indigo-600 font-medium">{client.name.charAt(0)}</span>
// //                           </div>
// //                         )}
// //                         <div>
// //                           <div className="text-sm font-semibold text-gray-900">{client.name}</div>
// //                           <div className="text-xs text-gray-500">{client.username}</div>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="text-sm text-gray-900">{client.email}</div>
// //                       <div className="text-xs text-gray-500">{client.phone}</div>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                           client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
// //                         }`}>
// //                         {client.status}
// //                       </span>
// //                     </td>
// //                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //   {new Date(client.createdAt).toLocaleDateString('en-US', {
// //     year: 'numeric',
// //     month: 'short',
// //     day: 'numeric'
// //   })}
// // </td>

// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
// //                       <button
// //                         onClick={() => handleEdit(client)}
// //                         className="text-indigo-600 hover:text-indigo-900 flex items-center"
// //                       >
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
// //                           <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
// //                         </svg>
// //                         Edit
// //                       </button>
// // {client.status=="Inactive"? <></>: <button
// //                         onClick={() => handleDelete(client._id)}
// //                         className="text-red-600 hover:text-red-900 flex items-center"
// //                       >
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
// //                         </svg>
// //                         Delete
// //                       </button>}
                     
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-6">
// //                 <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Client" : "Add New Client"}</h2>
// //                 <button onClick={resetFormAndCloseModal} className="text-gray-400 hover:text-gray-500">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                   </svg>
// //                 </button>
// //               </div>

// //               <form onSubmit={handleSubmit}>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   {/* Logo */}
// //                   <div className="col-span-2">
// //                     <div className="flex items-center justify-center">
// //                       <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-indigo-500 transition-colors">
// //                         {newClient.logoPreview ? (
// //                           <img src={newClient.logoPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
// //                         ) : (
// //                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
// //                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12" />
// //                             </svg>
// //                             <p className="text-xs text-gray-500 mt-2">Upload Logo</p>
// //                           </div>
// //                         )}
// //                         <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
// //                       </label>
// //                     </div>
// //                   </div>

// //                   {/* Inputs */}
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
// //                     <input type="text" name="name" value={newClient.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //                     <input type="email" name="email" value={newClient.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
// //                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
// //                     <input type="tel" name="phone" value={newClient.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
// //                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
// //                   </div>

               
// // <div>
// //   <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
// //   <input 
// //     type="text" 
// //     name="username" 
// //     value={newClient.username} 
// //     onChange={handleInputChange} 
// //     className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
// //     readOnly={isEditing}
// //   />
// //   {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
// // </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// //                     <select name="status" value={newClient.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
// //                       <option value="Active">Active</option>
// //                       <option value="Inactive">Inactive</option>
// //                     </select>
// //                   </div>
// // <div>
// //   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// //   <input
// //     type="password"
// //     name="password"
// //     value={newClient.password}
// //     onChange={handleInputChange}
// //     className="w-full px-4 py-2 border rounded-lg"
// //     required={!isEditing} // Optional: make password required only on create
// //   />
// // </div>

// //                   <div className="col-span-2">
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
// //                     <textarea name="address" value={newClient.address} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg" required />
// //                   </div>
// //                 </div>

// //                 <div className="mt-8 flex justify-end space-x-3">
// //                   <button 
// //                     type="button" 
// //                     onClick={resetFormAndCloseModal} 
// //                     className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
// //                     disabled={isUploading}
// //                   >
// //                     Cancel
// //                   </button>
// //                   {/* <button 
// //                     type="submit" 
// //                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
// //                     disabled={isUploading}
// //                   > */}
// //                  <button
// //   type="submit"
// //   disabled={
// //     isUploading || !!errors.username || !!errors.email || !!errors.phone
// //   }
// //   className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
// // >
// //                     {isUploading ? (
// //                       <>
// //                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                         </svg>
// //                         {isEditing ? 'Updating...' : 'Uploading...'}
// //                       </>
// //                     ) : (
// //                       isEditing ? 'Update Client' : 'Add Client'
// //                     )}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// 'use client'

// import { useEffect, useState } from 'react';

// export default function ClientManagement() {
//   const [clients, setClients] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingClientId, setEditingClientId] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [clientToDelete, setClientToDelete] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
//   const [successMessage, setSuccessMessage] = useState(''); // New state for success message

//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch('/api/superAdmin/fetchAll');
//         const data = await res.json();
//         console.log(data.superadmins);
//         setClients(data.superadmins);
//       } catch (error) {
//         console.error('Error fetching clients:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchdata();
//   }, [])

//   const [newClient, setNewClient] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     username: '',
//     password: '',
//     status: 'active',
//     logo: null,
//     logoPreview: ''
//   });

//   const handleInputChange = async (e) => {
//     const { name, value } = e.target;

//     if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) return;
//     if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;

//     setNewClient((prev) => ({ ...prev, [name]: value }));

//     if (['username', 'email', 'phone'].includes(name)) {
//       const payload = {
//         idToExclude: isEditing ? editingClientId : null,
//         username: name === 'username' ? value : newClient.username,
//         email: name === 'email' ? value : newClient.email,
//         phone: name === 'phone' ? value : newClient.phone,
//       };

//       try {
//         const res = await fetch('/api/check-username', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         const data = await res.json();

//         setErrors((prev) => ({
//           ...prev,
//           username: data.usernameExists ? 'Username already exists' : '',
//           email: data.emailExists ? 'Email already exists' : '',
//           phone: data.phoneExists ? 'Phone number already exists' : '',
//         }));
//       } catch (err) {
//         console.error('Validation error:', err);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewClient(prev => ({
//           ...prev,
//           logo: file,
//           logoPreview: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImageToCloudinary = async (file) => {
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
      
//       const data = await response.json();
//       return data.url;
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsUploading(true);
//     setErrors({});

//     try {
//       let logoUrl = newClient.logoPreview;

//       const alreadyExists = clients.some(client =>
//         (!isEditing || client._id !== editingClientId) &&
//         (
//           client.email === newClient.email ||
//           client.phone === newClient.phone ||
//           client.username === newClient.username
//         )
//       );

//       if (alreadyExists) {
//         const error = {};
//         if (clients.some(c => c.email === newClient.email && (!isEditing || c._id !== editingClientId))) {
//           error.email = 'Email already exists';
//         }
//         if (clients.some(c => c.phone === newClient.phone && (!isEditing || c._id !== editingClientId))) {
//           error.phone = 'Phone number already exists';
//         }
//         if (clients.some(c => c.username === newClient.username && (!isEditing || c._id !== editingClientId))) {
//           error.username = 'Username already exists';
//         }

//         setErrors(error);
//         setIsUploading(false);
//         return;
//       }

//       if (newClient.logo instanceof File) {
//         logoUrl = await uploadImageToCloudinary(newClient.logo);
//       }

//       const payload = {
//         ...newClient,
//         logo: logoUrl,
//         joined: isEditing 
//           ? clients.find(client => client._id === editingClientId)?.joined 
//           : new Date().toISOString().split('T')[0]
//       };

//       if (isEditing) {
//         const response = await fetch(`/api/superAdmin/update`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: editingClientId, ...payload })
//         });

//         if (!response.ok) throw new Error('Update failed');

//         const updatedClients = clients.map(client =>
//           client._id === editingClientId
//             ? { ...client, ...payload }
//             : client
//         );
//         setClients(updatedClients);
        
//         // Show success message for update
//         setSuccessMessage('Client updated successfully!');
//         setShowSuccessModal(true);
//       } else {
//         const response = await fetch('/api/superAdmin/create', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });

//         if (!response.ok) throw new Error('Creation failed');

//         const result = await response.json();
//         const newClientWithId = {
//           ...payload,
//           id: result.id || clients.length + 1
//         };

//         setClients([...clients, newClientWithId]);
        
//         // Show success message for creation
//         setSuccessMessage('Client added successfully!');
//         setShowSuccessModal(true);
//       }

//       resetFormAndCloseModal();
//     } catch (error) {
//       console.error('Error submitting client:', error);
//       alert('Error occurred. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDelete = (id) => {
//     setClientToDelete(id);
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!clientToDelete) return;
    
//     try {
//       const response = await fetch(`/api/superAdmin/updateStatus`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: clientToDelete, status: 'Inactive' })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update status');
//       }

//       const updatedClients = clients.map(client =>
//         client._id === clientToDelete ? { ...client, status: 'Inactive' } : client
//       );
//       setClients(updatedClients);
      
//       // Show success message for deletion
//       setSuccessMessage('Client deactivated successfully!');
//       setShowSuccessModal(true);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       alert('Error deactivating client');
//     } finally {
//       setShowDeleteConfirm(false);
//       setClientToDelete(null);
//     }
//   };

//   const handleEdit = (client) => {
//     setIsModalOpen(true);
//     setIsEditing(true);
//     setEditingClientId(client._id);
//     setNewClient({
//       name: client.name,
//       email: client.email,
//       phone: client.phone,
//       address: client.address,
//       username: client.username || '',
//       status: client.status,
//       password: '',
//       logo: null,
//       logoPreview: client.logo || ''
//     });
//   };

//   const resetFormAndCloseModal = () => {
//     setNewClient({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       username: '',
//       status: 'active',
//       logo: null,
//       logoPreview: ''
//     });
//     setIsModalOpen(false);
//     setIsEditing(false);
//     setEditingClientId(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
//             <p className="text-gray-600 mt-1">Manage all your client relationships in one place</p>
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Add New Client
//           </button>
//         </div>

//         {/* Client Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {isLoading ? (
//             <div className="flex justify-center items-center p-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {clients.length > 0 ? (
//                     clients.map((client) => (
//                       <tr key={client._id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-8 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {client.logo ? (
//                               <img className="h-10 w-10 rounded-full object-cover mr-3" src={client.logo} alt={client.name} />
//                             ) : (
//                               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
//                                 <span className="text-indigo-600 font-medium">{client.name.charAt(0)}</span>
//                               </div>
//                             )}
//                             <div>
//                               <div className="text-sm font-semibold text-gray-900">{client.name}</div>
//                               <div className="text-xs text-gray-500">{client.username}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{client.email}</div>
//                           <div className="text-xs text-gray-500">{client.phone}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                             {client.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(client.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
//                           <button
//                             onClick={() => handleEdit(client)}
//                             className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                             </svg>
//                             Edit
//                           </button>
//                           {client.status === "Inactive" ? <></> : 
//                             <button
//                               onClick={() => handleDelete(client._id)}
//                               className="text-red-600 hover:text-red-900 flex items-center"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                               </svg>
//                               Delete
//                             </button>
//                           }
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
//                         No clients found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Client Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Client" : "Add New Client"}</h2>
//                 <button onClick={resetFormAndCloseModal} className="text-gray-400 hover:text-gray-500">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Logo */}
//                   <div className="col-span-2">
//                     <div className="flex items-center justify-center">
//                       <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-indigo-500 transition-colors">
//                         {newClient.logoPreview ? (
//                           <img src={newClient.logoPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
//                         ) : (
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12" />
//                             </svg>
//                             <p className="text-xs text-gray-500 mt-2">Upload Logo</p>
//                           </div>
//                         )}
//                         <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
//                       </label>
//                     </div>
//                   </div>

//                   {/* Inputs */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                     <input type="text" name="name" value={newClient.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                     <input type="email" name="email" value={newClient.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
//                     {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                     <input type="tel" name="phone" value={newClient.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
//                     {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                     <input 
//                       type="text" 
//                       name="username" 
//                       value={newClient.username} 
//                       onChange={handleInputChange} 
//                       className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                       readOnly={isEditing}
//                     />
//                     {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                     <select name="status" value={newClient.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
//                       <option value="active">active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={newClient.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required={!isEditing}
//                     />
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                     <textarea name="address" value={newClient.address} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg" required />
//                   </div>
//                 </div>

//                 <div className="mt-8 flex justify-end space-x-3">
//                   <button 
//                     type="button" 
//                     onClick={resetFormAndCloseModal} 
//                     className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
//                     disabled={isUploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={
//                       isUploading || !!errors.username || !!errors.email || !!errors.phone
//                     }
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
//                   >
//                     {isUploading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {isEditing ? 'Updating...' : 'Uploading...'}
//                       </>
//                     ) : (
//                       isEditing ? 'Update Client' : 'Add Client'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-bold text-gray-800">Confirm Deactivation</h3>
//                 <button 
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
              
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to deactivate this client? They will no longer have access to the system.
//               </p>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirmDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Confirm Deactivate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-bold text-gray-800">Success!</h3>
//                 <button 
//                   onClick={() => setShowSuccessModal(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
              
//               <div className="flex items-center justify-center mb-6">
//                 <div className="bg-green-100 p-3 rounded-full">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               </div>
              
//               <p className="text-center text-gray-600 mb-6">
//                 {successMessage}
//               </p>
              
//               <div className="flex justify-center">
//                 <button
//                   onClick={() => setShowSuccessModal(false)}
//                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client'

import { useEffect, useState } from 'react';

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/superAdmin/fetchAll');
        const data = await res.json();
        setClients(data.superadmins);
        setFilteredClients(data.superadmins);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchdata();
  }, [])

  useEffect(() => {
    let result = clients;
    
    if (statusFilter !== 'all') {
      result = result.filter(client => client.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.includes(term) ||
        client.username.toLowerCase().includes(term)
      );
    }
    
    setFilteredClients(result);
  }, [searchTerm, statusFilter, clients]);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    status: 'active',
    logo: null,
    logoPreview: ''
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === 'phone' && !/^\d{0,10}$/.test(value)) return;

    setNewClient((prev) => ({ ...prev, [name]: value }));

    if (['username', 'email', 'phone'].includes(name)) {
      const payload = {
        idToExclude: isEditing ? editingClientId : null,
        username: name === 'username' ? value : newClient.username,
        email: name === 'email' ? value : newClient.email,
        phone: name === 'phone' ? value : newClient.phone,
      };

      try {
        const res = await fetch('/api/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        setErrors((prev) => ({
          ...prev,
          username: data.usernameExists ? 'Username already exists' : '',
          email: data.emailExists ? 'Email already exists' : '',
          phone: data.phoneExists ? 'Phone number already exists' : '',
        }));
      } catch (err) {
        console.error('Validation error:', err);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewClient(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setErrors({});

    try {
      let logoUrl = newClient.logoPreview;

      const alreadyExists = clients.some(client =>
        (!isEditing || client._id !== editingClientId) &&
        (
          client.email === newClient.email ||
          client.phone === newClient.phone ||
          client.username === newClient.username
        )
      );

      if (alreadyExists) {
        const error = {};
        if (clients.some(c => c.email === newClient.email && (!isEditing || c._id !== editingClientId))) {
          error.email = 'Email already exists';
        }
        if (clients.some(c => c.phone === newClient.phone && (!isEditing || c._id !== editingClientId))) {
          error.phone = 'Phone number already exists';
        }
        if (clients.some(c => c.username === newClient.username && (!isEditing || c._id !== editingClientId))) {
          error.username = 'Username already exists';
        }

        setErrors(error);
        setIsUploading(false);
        return;
      }

      if (newClient.logo instanceof File) {
        logoUrl = await uploadImageToCloudinary(newClient.logo);
      }

      const payload = {
        ...newClient,
        logo: logoUrl,
        joined: isEditing 
          ? clients.find(client => client._id === editingClientId)?.joined 
          : new Date().toISOString().split('T')[0]
      };

      if (isEditing) {
        const response = await fetch(`/api/superAdmin/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingClientId, ...payload })
        });

        if (!response.ok) throw new Error('Update failed');

        const updatedClients = clients.map(client =>
          client._id === editingClientId
            ? { ...client, ...payload }
            : client
        );
        setClients(updatedClients);
        setSuccessMessage('Client updated successfully!');
      } else {
        const response = await fetch('/api/superAdmin/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Creation failed');

        const result = await response.json();
        const newClientWithId = {
          ...payload,
          id: result.id || clients.length + 1
        };

        setClients([...clients, newClientWithId]);
        setSuccessMessage('Client added successfully!');
      }

      setShowSuccessModal(true);
      resetFormAndCloseModal();
    } catch (error) {
      console.error('Error submitting client:', error);
      alert('Error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    setClientToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const response = await fetch(`/api/superAdmin/updateStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientToDelete, status: 'Inactive' })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedClients = clients.map(client =>
        client._id === clientToDelete ? { ...client, status: 'Inactive' } : client
      );
      setClients(updatedClients);
      setSuccessMessage('Client deactivated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error deactivating client');
    } finally {
      setShowDeleteConfirm(false);
      setClientToDelete(null);
    }
  };

  const handleEdit = (client) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingClientId(client._id);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      username: client.username || '',
      status: client.status,
      password: '',
      logo: null,
      logoPreview: client.logo || ''
    });
  };

  const resetFormAndCloseModal = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      status: 'active',
      logo: null,
      logoPreview: ''
    });
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingClientId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">Manage all your client relationships in one place</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Client
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                id="status"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {client.logo ? (
                              <img className="h-10 w-10 rounded-full object-cover mr-3" src={client.logo} alt={client.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <span className="text-indigo-600 font-medium">{client.name.charAt(0)}</span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{client.name}</div>
                              <div className="text-xs text-gray-500">{client.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-xs text-gray-500">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(client.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                          {client.status === "Inactive" ? <></> : 
                            <button
                              onClick={() => handleDelete(client._id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        {clients.length === 0 ? 'No clients found' : 'No clients match your search criteria'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Client" : "Add New Client"}</h2>
                <button onClick={resetFormAndCloseModal} className="text-gray-400 hover:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center">
                      <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-indigo-500 transition-colors">
                        {newClient.logoPreview ? (
                          <img src={newClient.logoPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12" />
                            </svg>
                            <p className="text-xs text-gray-500 mt-2">Upload Logo</p>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" name="name" value={newClient.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={newClient.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" value={newClient.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={newClient.username} 
                      onChange={handleInputChange} 
                      className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      readOnly={isEditing}
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={newClient.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
                      <option value="active">active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={newClient.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required={!isEditing}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" value={newClient.address} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg" required />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={resetFormAndCloseModal} 
                    className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isUploading || !!errors.username || !!errors.email || !!errors.phone
                    }
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditing ? 'Updating...' : 'Uploading...'}
                      </>
                    ) : (
                      isEditing ? 'Update Client' : 'Add Client'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Confirm Deactivation</h3>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to deactivate this client? They will no longer have access to the system.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Success!</h3>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <p className="text-center text-gray-600 mb-6">
                {successMessage}
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}