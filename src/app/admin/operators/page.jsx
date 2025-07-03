'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Users, Activity } from 'lucide-react';

const SupervisorsPage = () => {
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

  // Fetch all operators
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await fetch('/api/operator/fetchAll');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const operatorsWithId = data.operators.map(op => ({
          id: op._id,
          name: op.name,
          email: op.email,
          phone: op.phone,
          location: op.location,
          status: op.status,
        }));
        setSupervisors(operatorsWithId);
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch operators');
      }
    };

    fetchOperators();
  }, []);

  const handleAddSupervisor = () => {
    setEditingSupervisor(null);
    setFormData({ name: '', email: '', phone: '', location: '', password: '' });
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
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/operator/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const newOperator = data.operator;
      setSupervisors(prev => [...prev, {
        id: newOperator.id,
        name: newOperator.name,
        email: newOperator.email,
        phone: newOperator.phone,
        location: newOperator.location,
        status: newOperator.status,
      }]);

      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', location: '', password: '' });
      alert('Operator registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operator?')) return;

    try {
      const res = await fetch(`/api/operator/delete-by-id/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSupervisors(prev => prev.filter(s => s.id !== id));
      alert('Deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'Something went wrong.');
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
          <h1 className="text-3xl font-bold text-gray-900">Facility Admin</h1>
          <p className="text-gray-600 mt-2">Manage your operators and their info</p>
        </div>
        <button
          onClick={handleAddSupervisor}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add Operator</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Operators</p>
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
              <p className="text-green-600 text-sm font-medium">Active Operators</p>
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
              placeholder="Search operators..."
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

      {/* Operators List */}
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
              {editingSupervisor ? 'Edit Operator' : 'Add Operator'}
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
    </div>
  );
};

export default SupervisorsPage;
