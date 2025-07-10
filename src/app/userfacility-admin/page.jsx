'use client';
import { useState, useEffect } from 'react';
import { Package, Plus, X, Edit, Trash2, Search, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function FacilityAdminDashboard() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const [formData, setFormData] = useState({
    name: '',
    id: '',
    type: '',
    manufacturer: '',
    supplier: '',
    model: '',
    serial: '',
    assetTag: '',
  
  });

  const [errors, setErrors] = useState({});

  const equipmentTypes = [
    'Granulator',
    'Tablet Press',
    'Blister Pack Machine',
    'Autoclave',
    'FBD',
    'Compression Machine'
  ];

  const statusOptions = ['Approved', 'Pending', 'Unassigned'];

  const generateId = () => `EQP-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Equipment name is required.';
    if (!formData.type.trim()) newErrors.type = 'Equipment type is required.';
    
    return newErrors;
  };

  const openPopup = (equipment = null) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData({ ...equipment });
    } else {
      setEditingEquipment(null);
      const newId = generateId();
      setFormData({
        name: '',
        id: newId,
        type: '',
        manufacturer: '',
        supplier: '',
        model: '',
        serial: '',
        assetTag: '',
        status: 'Pending'
      });
    }
    setErrors({});
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingEquipment(null);
    setFormData({
      name: '',
      id: '',
      type: '',
      manufacturer: '',
      supplier: '',
      model: '',
      serial: '',
      assetTag: '',
      status: 'Pending'
    });
    setErrors({});
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newEquipment = {
      ...formData,
      name: formData.name.trim(),
      id: editingEquipment ? editingEquipment.id : generateId(),
      type: formData.type.trim(),
      dateAdded: editingEquipment ? editingEquipment.dateAdded : new Date().toISOString().split('T')[0]
    };

    if (editingEquipment) {
      setEquipmentList(prev => 
        prev.map(eq => eq.id === editingEquipment.id ? newEquipment : eq)
      );
    } else {
      setEquipmentList(prev => [...prev, newEquipment]);
    }

    closePopup();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      id: editingEquipment ? editingEquipment.id : generateId(),
      type: '',
      manufacturer: '',
      supplier: '',
      model: '',
      serial: '',
      assetTag: '',
      status: 'Pending'
    });
    setErrors({});
  };

  const deleteEquipment = (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipmentList(prev => prev.filter(eq => eq.id !== id));
    }
  };

  const filteredEquipment = equipmentList.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (equipment.manufacturer && equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === '' || equipment.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unassigned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-600" size={32} />;
      case 'Pending':
        return <Clock className="text-yellow-600" size={32} />;
      case 'Unassigned':
        return <XCircle className="text-gray-600" size={32} />;
      default:
        return <Package className="text-blue-600" size={32} />;
    }
  };

  const approvedCount = equipmentList.filter(eq => eq.status === 'Approved').length;
  const pendingCount = equipmentList.filter(eq => eq.status === 'Pending').length;
  const unassignedCount = equipmentList.filter(eq => eq.status === 'Unassigned').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Facility Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your equipment inventory and information</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openPopup()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                <Plus size={20} />
                Add Equipment
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Equipment</p>
                <p className="text-2xl font-bold text-blue-600">{equipmentList.length}</p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              {getStatusIcon('Approved')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              {getStatusIcon('Pending')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unassigned</p>
                <p className="text-2xl font-bold text-gray-600">{unassignedCount}</p>
              </div>
              {getStatusIcon('Unassigned')}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              {/* <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select> */}
              
            </div>
          </div>
        </div>

        {/* Equipment Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Equipment Inventory</h2>
          
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No equipment found</p>
              <p className="text-gray-400">Add your first equipment to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Package className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{equipment.name}</h3>
                        <p className="text-sm text-gray-600">{equipment.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.status)}`}>
                      {equipment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{equipment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manufacturer:</span>
                      <span className="font-medium">{equipment.manufacturer || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{equipment.model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Added:</span>
                      <span className="font-medium">{equipment.dateAdded}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPopup(equipment)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEquipment(equipment.id)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Manufacturer</th>
                    <th className="text-left py-3 px-4 font-semibold">Model</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((equipment) => (
                    <tr key={equipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{equipment.name}</td>
                      <td className="py-3 px-4 text-gray-600">{equipment.id}</td>
                      <td className="py-3 px-4">{equipment.type}</td>
                      <td className="py-3 px-4">{equipment.manufacturer || 'N/A'}</td>
                      <td className="py-3 px-4">{equipment.model || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.status)}`}>
                          {equipment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openPopup(equipment)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEquipment(equipment.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
          )}
        </div>

        {/* Popup Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  <Package className="text-blue-600" />
                  {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
                </h2>
                <button
                  onClick={closePopup}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Equipment Name */}
                  <div>
                    <label className="block font-semibold mb-1">Equipment Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Granulator #1"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Equipment Type */}
                  <div>
                    <label className="block font-semibold mb-1">Equipment Type *</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="e.g., Granulator, Tablet Press, Blister Pack Machine"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                  </div>

                  {/* Status */}
                 
                  {/* Manufacturer */}
                  <div>
                    <label className="block font-semibold mb-1">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      placeholder="ACME Pharma Systems"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Supplier / OEM */}
                  <div>
                    <label className="block font-semibold mb-1">Supplier / OEM</label>
                    <input
                      type="text"
                      name="supplier"
                      placeholder="XYZ Engineering Ltd."
                      value={formData.supplier}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Model Number */}
                  <div>
                    <label className="block font-semibold mb-1">Model Number</label>
                    <input
                      type="text"
                      name="model"
                      placeholder="Model XG-320"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block font-semibold mb-1">Serial Number</label>
                    <input
                      type="text"
                      name="serial"
                      placeholder="SN-100293842"
                      value={formData.serial}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Asset Tag Number */}
                  <div>
                    <label className="block font-semibold mb-1">Asset Tag Number</label>
                    <input
                      type="text"
                      name="assetTag"
                      placeholder="AST-9876"
                      value={formData.assetTag}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    {editingEquipment ? 'Update' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}