// // "use client";

// // import { useEffect, useState } from 'react';

// // export default function ProfilePage() {
// //   const [formData, setFormData] = useState({
// //     username: 'Super Admin',
// //     email: 'superadmin@example.com',
   
// //     newPassword: '',
  
// //   });
// // const [Id,setId]=useState('6880dc94c4513e649852595d')
// //   useEffect(()=>{
// //     const fetchSuperManagerById = async (id) => {
// //   const res = await fetch(`/api/superManager/fetchbyid/${Id}`);
// //   const data = await res.json();
// //   console.log(data.manager);
// //   setFormData(data.manager)
// // };
// // fetchSuperManagerById()
// //   },[])
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Handle form submission
// //     console.log('Form submitted:', formData);
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
      
// //       <div className="bg-white rounded-lg shadow p-6">
      

// //         <form onSubmit={handleSubmit}>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //             <div>
// //               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
// //             Username
// //               </label>
// //               <input
// //                 type="text"
// //                 id="name"
// //                 name="name"
// //                 value={formData.username}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //               />
// //             </div>
// //             <div>
// //               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
// //                 Email Address
// //               </label>
// //               <input
// //                 type="email"
// //                 id="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //               />
// //             </div>
// //           </div>

// //           <h2 className="text-lg font-medium text-gray-800 mb-4">Change Password</h2>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           
            
// //             <div>
// //               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
// //                 New Password
// //               </label>
// //               <input
// //                 type="password"
// //                 id="newPassword"
// //                 name="newPassword"
// //                 value={formData.newPassword}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //               />
// //             </div>
           
// //           </div>

// //           <div className="flex justify-end">
// //             <button
// //               type="submit"
// //               className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
// //             >
// //               Save Changes
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";

// export default function ProfilePage() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     newPassword: "",
//   });

//   const [id, setId] = useState("6880dc94c4513e649852595d");

//   useEffect(() => {
//     const fetchSuperManagerById = async () => {
//       try {
//         const res = await fetch(`/api/superManager/fetchbyid/${id}`);
//         const data = await res.json();
//         if (data.manager) {
//           setFormData({
//             username: data.manager.username,
//             email: data.manager.email,
//             newPassword: "",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching manager:", err);
//       }
//     };
//     fetchSuperManagerById();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedData = {
//       username: formData.username,
//       email: formData.email,
//     };

//     if (formData.newPassword.trim() !== "") {
//       updatedData.password = formData.newPassword;
//     }

//     try {
//       const res = await fetch(`/api/superManager/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       });

//       const result = await res.json();
//       console.log("Updated:", result);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating profile:", err);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

//       <div className="bg-white rounded-lg shadow p-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <h2 className="text-lg font-medium text-gray-800 mb-4">Change Password</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 id="newPassword"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
  });
  const [id] = useState("6880dc94c4513e649852595d");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSuperManagerById = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/superManager/fetchbyid/${id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        
        if (data.manager) {
          setFormData({
            username: data.manager.username || "",
            email: data.manager.email || "",
            newPassword: "",
          });
        }
      } catch (err) {
        console.error("Error fetching manager:", err);
        setErrors({ fetch: "Failed to load profile data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuperManagerById();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validateForm()) return;

    const updatedData = {
      username: formData.username,
      email: formData.email,
    };

    if (formData.newPassword.trim() !== "") {
      updatedData.password = formData.newPassword;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/superManager/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();
      console.log("Updated:", result);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, newPassword: "" }));
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{errors.fetch}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-800 mb-4">Change Password</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Leave blank to keep current password"
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}