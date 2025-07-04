"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, ChevronDown } from 'lucide-react';

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentData, setEquipmentData] = useState([
    {
      id: 'EQU-001',
      name: 'High-Speed Mixer (HSM-01)',
      type: 'Blending Equipment',
      location: 'Granulation Room',
      frequency: 'After every batch',
      status: 'Active'
    },
    {
      id: 'EQU-002',
      name: 'Fluid Bed Dryer (FBD-02)',
      type: 'Size Reduction',
      location: 'Drying Area',
      frequency: 'Daily',
      status: 'Under Maintenance'
    },
    {
      id: 'EQU-003',
      name: 'Vibro Sifter (VS-03)',
      type: 'Sieving Machine',
      location: 'Sieving Area',
      frequency: 'After product change',
      status: 'Out of Service'
    },
    {
      id: 'EQU-004',
      name: 'Coating Pan (CP-01)',
      type: 'Tablet Coating Equipment',
      location: 'Coating Room',
      frequency: 'Daily',
      status: 'Active'
    },
    {
      id: 'EQU-005',
      name: 'Compression Machine (CM-04)',
      type: 'Tablet Press',
      location: 'Compression Room',
      frequency: 'After every shift',
      status: 'Active'
    },
    {
      id: 'EQU-006',
      name: 'Rapid Mixer Granulator (RG-02)',
      type: 'Wet Granulation',
      location: 'Granulation Room',
      frequency: 'After every batch',
      status: 'Active'
    },
    {
      id: 'EQU-007',
      name: 'Capsule Filling Machine (M-03)',
      type: 'Encapsulation',
      location: 'Encapsulation Area',
      frequency: 'Daily',
      status: 'Active'
    },
    {
      id: 'EQU-008',
      name: 'Dust Extractor (DE-01)',
      type: 'Air Handling / Utility',
      location: 'General Production',
      frequency: 'Weekly',
      status: 'Active'
    },
    {
      id: 'EQU-009',
      name: 'Liquid Filling Machine (LFM-01)',
      type: 'Filling Line',
      location: 'Liquid Manufacturing',
      frequency: 'After product change',
      status: 'Active'
    }
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    location: '',
    frequency: '',
    status: 'Active'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipmentData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.type && newEquipment.location) {
      const newId = `EQU-${String(equipmentData.length + 1).padStart(3, '0')}`;
      setEquipmentData([...equipmentData, { ...newEquipment, id: newId }]);
      setNewEquipment({ name: '', type: '', location: '', frequency: '', status: 'Active' });
      setShowAddForm(false);
    }
  };

  const handleDeleteEquipment = (id) => {
    setEquipmentData(equipmentData.filter(item => item.id !== id));
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setNewEquipment(equipment);
    setShowAddForm(true);
  };

  const handleUpdateEquipment = () => {
    setEquipmentData(equipmentData.map(item => 
      item.id === selectedEquipment.id ? { ...newEquipment, id: selectedEquipment.id } : item
    ));
    setSelectedEquipment(null);
    setNewEquipment({ name: '', type: '', location: '', frequency: '', status: 'Active' });
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Equipment List</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add New Equipment</span>
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Equipment ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Equipment Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cleaning Frequency</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((equipment, index) => (
                  <tr key={equipment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 text-sm text-gray-900">{equipment.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{equipment.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{equipment.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{equipment.location}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{equipment.frequency}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEquipment(equipment)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(equipment.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Equipment Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                  <input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter equipment name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={newEquipment.type}
                    onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter equipment type"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Frequency</label>
                  <select
                    value={newEquipment.frequency}
                    onChange={(e) => setNewEquipment({...newEquipment, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="After every batch">After every batch</option>
                    <option value="After every shift">After every shift</option>
                    <option value="Weekly">Weekly</option>
                    <option value="After product change">After product change</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedEquipment(null);
                    setNewEquipment({ name: '', type: '', location: '', frequency: '', status: 'Active' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedEquipment ? handleUpdateEquipment : handleAddEquipment}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {selectedEquipment ? 'Update' : 'Add'} Equipment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDashboard;