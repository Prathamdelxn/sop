'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity } from 'lucide-react';
import { useEffect } from 'react';
const SupervisorsPage = () => {
//   const [supervisors, setSupervisors] = useState([
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
const [supervisors, setSupervisors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
  });

  const handleAddSupervisor = () => {
    setEditingSupervisor(null);
    setFormData({ name: '', email: '', phone: '', location: '', password: '' });
    setIsModalOpen(true);
  };
useEffect(() => {
  const fetchSupervisors = async () => {
    try {
      const res = await fetch('/api/supervisor/fetchAll');
      const data = await res.json();

      if (res.ok) {
        
        const formatted = data.supervisors.map((s) => ({
          id: s._id,
          name: s.name,
          email: s.email,
          phone: s.phone,
          location: s.location,
          status: s.status || 'active',
        }));
        setSupervisors(formatted);
      } else {
        console.error('Failed to fetch:', data.message);
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  fetchSupervisors();
}, []);
  const handleEditSupervisor = (supervisor) => {
    setEditingSupervisor(supervisor);
    setFormData({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      location: supervisor.location,
      password: '', // Don't show/edit password on update
    });
    setIsModalOpen(true);
  };

//   const handleSubmit = () => {
//     if (editingSupervisor) {
//       setSupervisors(supervisors.map(s =>
//         s.id === editingSupervisor.id
//           ? { ...s, ...formData }
//           : s
//       ));
//     } else {
//       const newSupervisor = {
//         id: Date.now(),
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         location: formData.location,
//         password: formData.password,
//         status: 'active',
//       };
//       console.log('New Supervisor Added:', newSupervisor);
//       setSupervisors([...supervisors, newSupervisor]);
//     }
//     setIsModalOpen(false);
//   };


// const handleSubmit = async () => {
//   if (editingSupervisor) {
//     // Update locally (or later connect to an update API)
//     setSupervisors(supervisors.map(s =>
//       s.id === editingSupervisor.id
//         ? { ...s, ...formData }
//         : s
//     ));
//     setIsModalOpen(false);
//   } else {
//     try {
//       const res = await fetch('/api/supervisor/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           phone: formData.phone,
//           location: formData.location,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to add supervisor');
//         return;
//       }

//       // Add the new supervisor to the UI
//       setSupervisors([...supervisors, {
//         id: data.supervisor.id, // from DB _id
//         name: data.supervisor.name,
//         email: data.supervisor.email,
//         phone: data.supervisor.phone,
//         location: data.supervisor.location,
//         status: data.supervisor.status,
//       }]);

//       console.log('New Supervisor Added:', data.supervisor);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error('Error registering supervisor:', error);
//       alert('Something went wrong.');
//     }
//   }
// };



const handleSubmit = async () => {
  if (editingSupervisor) {
    try {
      const res = await fetch(`/api/supervisor/update-by-id/${editingSupervisor.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          status: editingSupervisor.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to update supervisor');
        return;
      }

      // Update in state
      setSupervisors((prev) =>
        prev.map((s) => (s.id === editingSupervisor.id ? { ...s, ...data.supervisor } : s))
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating supervisor:', error);
      alert('Something went wrong.');
    }
  } else {
    // Add supervisor logic (already correct)
    try {
      const res = await fetch('/api/supervisor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to add supervisor');
        return;
      }

      setSupervisors([...supervisors, {
        id: data.supervisor._id,
        name: data.supervisor.name,
        email: data.supervisor.email,
        phone: data.supervisor.phone,
        location: data.supervisor.location,
        status: data.supervisor.status,
      }]);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error registering supervisor:', error);
      alert('Something went wrong.');
    }
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this supervisor?')) return;

  try {
    const res = await fetch(`/api/supervisor/delete-by-id/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to delete supervisor');
      return;
    }

    setSupervisors((prev) => prev.filter((s) => s.id !== id));
  } catch (error) {
    console.error('Error deleting supervisor:', error);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervisors Management</h1>
          <p className="text-gray-600 mt-2">Manage your supervisors and their info</p>
        </div>
        <button
          onClick={handleAddSupervisor}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add Supervisor</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Supervisors</p>
              <p className="text-2xl font-bold text-blue-900">{supervisors.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Supervisors</p>
              <p className="text-2xl font-bold text-green-900">{supervisors.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
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
              placeholder="Search supervisors..."
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

      {/* Supervisors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSupervisors.map((supervisor) => (
          <div key={supervisor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {supervisor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{supervisor.name}</h3>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(supervisor.status)}`}>
                {supervisor.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{supervisor.email}</div>
              <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{supervisor.phone}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{supervisor.location}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
              <button onClick={() => handleEditSupervisor(supervisor)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(supervisor.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingSupervisor ? 'Edit Supervisor' : 'Add Supervisor'}
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

              {/* Password only in Add Mode */}
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
    </div>
  );
};

export default SupervisorsPage;
