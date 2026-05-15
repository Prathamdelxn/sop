"use client";

import React, { use, useEffect, useState } from 'react';
import { Plus, Search, Filter, MonitorCheck, Edit, Trash2, User, X, Factory, Shield } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UsersManagementPage() {
  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [Id, setId] = useState();
  const [companyId, setCompanyId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);

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

  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    task: [],
    email: '',
    username: '',
    password: '',
    phone: '',
    role: '',
    status: 'Active',
    location: '',
    plantId: ''
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
    str?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const userdata = JSON.parse(data);
      setId(userdata?.id);
      setCompanyId(userdata?.companyId || userdata?.id);
      setLoggedInEmail(userdata?.email?.toLowerCase() || '');
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (Id) {
        await fetchPeople();
        await fetchRoles();
        await fetchPlants();
      }
    };
    fetchAllData();
  }, [Id]);

  const fetchPeople = async () => {
    setIsLoading(true);
    try {
      const targetContext = companyId || Id;
      const res = await fetch(`/api/superAdmin/users/fetchAll?companyId=${targetContext}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setPeople(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
      if (!res.ok) throw new Error('Failed to fetch roles');
      const data = await res.json();
      setAvailableRoles(data.superAdmin?.workerRole || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchPlants = async () => {
    try {
      const targetContext = companyId || Id;
      const res = await fetch(`/api/elogbook/plants?companyId=${targetContext}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setPlants(data.data || []);
    } catch (err) {
      console.error('Error fetching plants:', err);
    }
  };

  const isValidEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmail = async (email) => {
    if (!email) {
      setValidationStatus(prev => ({
        ...prev,
        email: { checking: false, available: true, error: '' }
      }));
      return;
    }
    if (email.toLowerCase() === loggedInEmail) {
      setValidationStatus(prev => ({
        ...prev,
        email: { checking: false, available: true, error: '' }
      }));
      return;
    }
    if (!isValidEmail(email)) {
      setValidationStatus(prev => ({
        ...prev,
        email: { checking: false, available: false, error: 'Please enter a valid email address' }
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
          companyId: companyId || Id
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
        email: { checking: false, available: false, error: 'Error checking email availability' }
      }));
    }
  };

  const validateUsername = async (username) => {
    if (!username || (editingUser && username === editingUser.username)) return;
    
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
          companyId: companyId || Id
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
        username: { checking: false, available: false, error: 'Error checking username availability' }
      }));
    }
  };

  const validatePhone = async (phone) => {
    if (!phone) {
      setValidationStatus(prev => ({
        ...prev,
        phone: { checking: false, available: true, error: '' }
      }));
      return;
    }
    if (phone.length !== 10) {
      setValidationStatus(prev => ({
        ...prev,
        phone: { checking: false, available: false, error: 'Please enter a valid 10-digit phone number' }
      }));
      return;
    }
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
          companyId: companyId || Id
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
        phone: { checking: false, available: false, error: 'Error checking phone availability' }
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
      companyId: companyId || Id,
      task: [],
      username: '',
      password: '',
      phone: '',
      role: '',
      status: 'Active',
      location: '',
      plantId: ''
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
      name: user.name || '',
      email: user.email || '',
      companyId: companyId || Id,
      task: user.task || [],
      username: user.username || '',
      password: '',
      phone: user.phone || '',
      role: user.role || '',
      status: user.status || 'Active',
      location: user.location || '',
      plantId: user.plantId || ''
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (roleTitle) => {
    const selectedRole = availableRoles.find(r => r.title === roleTitle);
    setFormData({
      ...formData,
      role: roleTitle,
      task: selectedRole ? selectedRole.task : []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      showAlert("Error", "Please select a role for the user");
      return;
    }

    const hasEmail = formData.email.trim() !== '';
    const emailValid = !hasEmail || validationStatus.email.available;
    const hasPhone = formData.phone.trim() !== '';
    const phoneValid = !hasPhone || validationStatus.phone.available;
    const usernameValid = validationStatus.username.available;

    if (!emailValid || !usernameValid || !phoneValid) {
      showAlert("Validation Error", "Please fix the validation errors before submitting");
      return;
    }

    const userData = {
      ...formData,
      companyId: companyId || Id
    };

    try {
      setIsLoading(true);
      let response;
      
      if (editingUser) {
        response = await fetch(`/api/superAdmin/users/update/${editingUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
      } else {
        response = await fetch('/api/superAdmin/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (editingUser ? 'Failed to update user' : 'Failed to create user'));
      }

      await fetchPeople();
      setIsModalOpen(false);
      setEditingUser(null);
      toast.success(editingUser ? 'User updated successfully!' : 'User created successfully!');
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
        ? "Are you sure you want to activate this user?"
        : "Are you sure you want to deactivate this user?",
      async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/superAdmin/users/update-status/${user._id}`, {
            method: 'PUT',
          });

          if (!response.ok) throw new Error('Failed to update status');
          await fetchPeople();
          toast.success(`User ${isActivating ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
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

  const getStatusColor = (status) => 
    status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className="space-y-8 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
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
                Cancel
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all system users and their roles</p>
        </div>
        
        <button
          onClick={handleAddPerson}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all"
              >
                <option value="all">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role._id} value={role.title}>{role.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Plant</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPeople.map((person) => (
                <tr key={person._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {person.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.email || person.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {person.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const plant = plants.find(p => p._id === person.plantId);
                      return plant ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Factory className="h-3.5 w-3.5 text-blue-500" />
                          {plant.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not assigned</span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(person)}
                        className={`${person.status === 'InActive' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} p-2 rounded-lg transition-colors`}
                        title={person.status === 'InActive' ? 'Activate' : 'Deactivate'}
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
            <div className="text-center py-20">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUser ? 'Edit User Profile' : 'Create New User'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={async (e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/[^a-zA-Z0-9@]/g, '');
                      if (value && !/^[a-zA-Z]/.test(value)) return;
                      setFormData({ ...formData, username: value });
                      await validateUsername(value);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      editingUser ? 'bg-gray-50 cursor-not-allowed' : 
                      validationStatus.username.error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. johndoe"
                    required
                    disabled={!!editingUser}
                  />
                  {validationStatus.username.error && <p className="text-xs text-red-500 mt-1">{validationStatus.username.error}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={async (e) => {
                      setFormData({ ...formData, email: e.target.value });
                      await validateEmail(e.target.value);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      validationStatus.email.error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {validationStatus.email.error && <p className="text-xs text-red-500 mt-1">{validationStatus.email.error}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    maxLength={10}
                    onChange={async (e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, phone: value });
                      await validatePhone(value);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      validationStatus.phone.error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10 digit number"
                  />
                  {validationStatus.phone.error && <p className="text-xs text-red-500 mt-1">{validationStatus.phone.error}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Role <span className="text-red-500">*</span></label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  >
                    <option value="">-- Choose Role --</option>
                    {availableRoles.map((role) => (
                      <option key={role._id} value={role.title}>{role.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Plant <span className="text-red-500">*</span></label>
                  <select
                    value={formData.plantId}
                    onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  >
                    <option value="">-- Choose Plant --</option>
                    {plants.map((plant) => (
                      <option key={plant._id} value={plant._id}>{plant.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter location"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {editingUser ? 'Reset Password (Leave blank to keep current)' : 'Account Password *'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={editingUser ? "••••••••" : "Min 8 characters"}
                    required={!editingUser}
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
