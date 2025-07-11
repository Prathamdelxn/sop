'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity, Eye, X,UserX, User } from 'lucide-react';
import { useEffect } from 'react';

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
  });

  const handleAddSupervisor = () => {
    setEditingSupervisor(null);
    setFormData({ name: '', email: '', phone: '', location: '', password: '' });
    setIsModalOpen(true);
  };

  const handleViewSupervisor = (supervisor) => {
    setViewingSupervisor(supervisor);
    setIsViewModalOpen(true);
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
      // Add supervisor logic
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium">Deactive Supervisors</p>
              <p className="text-2xl font-bold text-red-900">{supervisors.filter(s => s.status === 'inactive').length}</p>
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

      {/* Supervisors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSupervisors.map((supervisor) => (
                <tr key={supervisor.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {supervisor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{supervisor.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{supervisor.email}</td>
                  <td className="py-4 px-6 text-gray-600">{supervisor.phone}</td>
                  <td className="py-4 px-6 text-gray-600">{supervisor.location}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(supervisor.status)}`}>
                      {supervisor.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewSupervisor(supervisor)}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditSupervisor(supervisor)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supervisor.id)}
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
          {filteredSupervisors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No supervisors found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
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

      {/* View Details Modal */}
      {isViewModalOpen && viewingSupervisor && (
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
                  {viewingSupervisor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{viewingSupervisor.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingSupervisor.status)}`}>
                    {viewingSupervisor.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{viewingSupervisor.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{viewingSupervisor.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{viewingSupervisor.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Admin ID</p>
                    <p className="text-sm font-medium text-gray-900">{viewingSupervisor.id}</p>
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

export default SupervisorsPage;