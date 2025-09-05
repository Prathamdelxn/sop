
'use client';
import { useState, useEffect } from 'react';
import { Package, Plus, X, Edit, Trash2, Search, CheckCircle, Clock, AlertCircle, Sparkles, XCircle, Eye } from 'lucide-react';

export default function FacilityAdminDashboard() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewingEquipment, setViewingEquipment] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [equipmentToApprove, setEquipmentToApprove] = useState(null);
  const [companyData, setCompanyData] = useState();
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEquipmentToDelete(null);
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/equipment/fetchAll');
        const result = await res.json();

        if (res.ok && result.success) {
          const filtered = result.data.filter(item => item.companyId === companyData?.companyId);
          setEquipmentList(filtered);

        } else {

          console.error('Failed to fetch equipment:', result.message);
        }
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setIsLoading(false);
      }
      finally {
        // Always set loading to false in finally block
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, [companyData]);

  const viewEquipmentDetails = (equipment) => {
    setViewingEquipment(equipment);
    setIsInfoModalOpen(true);
  };

  const handleSendForApproval = (equipment) => {
    setEquipmentToApprove(equipment);
    setIsConfirmationOpen(true);
  };

  const confirmApproval = async () => {
    try {
      setApprovalLoading(true);
      const res = await fetch('/api/equipment/updateStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipmentId: equipmentToApprove._id,
          status: 'Pending Approval'
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setEquipmentList(prev =>
          prev.map(eq =>
            eq._id === equipmentToApprove._id ? { ...eq, status: 'Pending Approval' } : eq
          )
        );
        setIsConfirmationOpen(false);
        setEquipmentToApprove(null);
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setApprovalLoading(false);
    }
  };

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
      status: 'InProgress'
    });
    setErrors({});
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    setCompanyData(user);
  }, []);



  const handleSubmit = async () => {
    console.log(editingEquipment);
    if (editingEquipment) {
      console.log("ggo")
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let result;

      if (editingEquipment) {
        console.log("ggo")
        setUpdateLoading(true);
        // Update existing equipment
        const res = await fetch('/api/equipment/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            equipmentId: editingEquipment._id,
            name: formData.name,
            type: formData.type,
            manufacturer: formData.manufacturer,
            supplier: formData.supplier,
            model: formData.model,
            serial: formData.serial,
            assetTag: formData.assetTag,
            status: "InProgress"
          })
        });

        result = await res.json();
        setUpdateLoading(false);

        if (res.ok) {
          setEquipmentList(prev =>
            prev.map(eq =>
              eq._id === editingEquipment._id ? result.data : eq
            )
          );
        }
      } else {
        setCreateLoading(true);
        // Create new equipment
        const newData = {
          name: formData.name,
          type: formData.type,
          manufacturer: formData.manufacturer,
          supplier: formData.supplier,
          model: formData.model,
          serial: formData.serial,
          assetTag: formData.assetTag,
          companyId: companyData.companyId,
          userId: companyData.id
        };

        const res = await fetch('/api/equipment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        });

        result = await res.json();
        setCreateLoading(false);
        if (res.ok) {
          setEquipmentList(prev => [...prev, result.data]);
        }
      }

      if (result.success) {
        closePopup();
      } else {
        console.error('API error:', result.message);
      }
    } catch (err) {
      console.error('Internal Server Error', err);
    }
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
      status: 'InProgress'
    });
    setErrors({});
  };

  const confirmDelete = async () => {
    if (!equipmentToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/equipment/delete/${equipmentToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEquipmentList(prev => prev.filter(eq => eq._id !== equipmentToDelete._id));
        setShowDeleteConfirm(false);
        setEquipmentToDelete(null);
      } else {
        console.error('Failed to delete equipment:', data.message);
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setDeleteLoading(false);
    }
  };


  // const deleteEquipment = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this equipment?')) {
  //     try {
  //       const res = await fetch(`/api/equipment/delete/${id}`, {
  //         method: 'DELETE',
  //       });

  //       const data = await res.json();

  //       if (res.ok && data.success) {
  //         // Remove equipment from the list in UI
  //         setEquipmentList(prev => prev.filter(eq => eq._id !== id)); // Use _id if from MongoDB
  //         alert('Equipment deleted successfully');
  //       } else {
  //         alert(data.message || 'Failed to delete equipment');
  //       }
  //     } catch (error) {
  //       console.error('Error deleting equipment:', error);
  //       alert('Something went wrong while deleting equipment');
  //     }
  //   }
  // };

  const DetailItem = ({ label, value }) => (
    <div className='bg-red-500 p-2 rounded-xl bg-slate-200'>
      <p className={`text-sm font-medium  ${label == "Rejection Reason" ? "text-red-500" : "text-gray-500"}  `}>{label}</p>
      <p className="text-gray-900 mt-1">
        {value || <span className="text-gray-400">N/A</span>}
      </p>
    </div>
  );

  const filteredEquipment = equipmentList.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipment.manufacturer && equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === '' || equipment.type === filterType;
    const matchesStatus = statusFilter === 'All Statuses' || equipment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
      case 'InProgress':
        return <CheckCircle className="text-blue-600" size={32} />;
      case 'Pending Approval':
        return <Clock className="text-yellow-600" size={32} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={32} />;
      case 'Unassigned':
        return <XCircle className="text-gray-600" size={32} />;
      default:
        return <Package className="text-blue-600" size={32} />;
    }
  };

  const getApprovalStatus = (status) => {
    switch (status) {
      case 'Approved':
        return 'Approved';
      case 'InProgress':
        return 'Send for Approval';
      case 'Pending Approval':
        return 'Pending Approval';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const approvedCount = equipmentList.filter(eq => eq.status === 'Approved').length;
  const pendingCount = equipmentList.filter(eq => eq.status === 'Pending Approval').length;
  const createdCount = equipmentList.filter(eq => eq.status === 'InProgress').length;
  const rejectedCount = equipmentList.filter(eq => eq.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-xl mx-2 mt-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Equipment Workspace</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and track your equipment processes</p>
              </div>
            </div>
            <button
              onClick={() => openPopup()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add Equipment
            </button>

          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 mx-2 gap-4 mt-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Equipment</p>
                <p className="text-2xl font-bold text-blue-600">{equipmentList.length}</p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              {getStatusIcon('Approved')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              {getStatusIcon('Pending Approval')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Created</p>
                <p className="text-2xl font-bold text-blue-600">{createdCount}</p>
              </div>
              {getStatusIcon('InProgress')}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
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
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="InProgress">InProgress</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Equipment Inventory</h2>
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold">{filteredEquipment.length}</span> of <span className="font-semibold">{equipmentList.length}</span> equipment
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading equipment...</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No equipment found</p>
              <p className="text-gray-400">Add your first equipment to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.map((equipment) => (
                    <tr
                      key={equipment._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={equipment.name}>{equipment.name}</div>
                            <div className="text-sm text-gray-500">{equipment.model || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{equipment._id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 truncate max-w-[180px] text-blue-800">
                          {equipment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(equipment.status)}`}>
                          {equipment.status}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(equipment.status)}`}>
                          {getApprovalStatus(equipment.status)}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">

                          {equipment.status === 'InProgress' && (
                            <>

                              {/* <button
                                onClick={() => handleSendForApproval(equipment)}
                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                title="Send for Approval"
                              >
                                <CheckCircle size={18} />
                              </button> */}
                              <button
                                onClick={() => handleSendForApproval(equipment)}
                                className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
                                title="Send for Approval"
                              >
                                Send for Approval
                              </button>
                            </>
                          )}
                          {equipment.status == 'InProgress' || equipment.status == 'Rejected' ? <button
                            onClick={() => openPopup(equipment)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button> : <></>}
                          <button
                            onClick={() => viewEquipmentDetails(equipment)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(equipment)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Equipment Details Modal */}
        {isInfoModalOpen && viewingEquipment && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 scale-[0.98] hover:scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Equipment Details</h2>
                  <p className="text-blue-100 text-sm">{viewingEquipment.type} • ID: {viewingEquipment._id}</p>


                </div>
                <button
                  onClick={() => {
                    setViewingEquipment(null);
                    setIsInfoModalOpen(false);
                  }}
                  className="p-1 rounded-full hover:bg-blue-700/30 transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <DetailItem label="Name" value={viewingEquipment.name} />
                    <DetailItem label="Manufacturer" value={viewingEquipment.manufacturer} />
                    <DetailItem label="Model" value={viewingEquipment.model} />
                    <DetailItem label="Status" value={
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${viewingEquipment.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {viewingEquipment.status}
                      </span>
                    } />
                  </div>
                  <div className="space-y-3">
                    <DetailItem label="Supplier" value={viewingEquipment.supplier} />
                    <DetailItem label="Serial" value={viewingEquipment.serial} />
                    <DetailItem label="Asset Tag" value={viewingEquipment.assetTag} />
                    {viewingEquipment.rejectionReason ? <DetailItem label="Rejection Reason" value={viewingEquipment.rejectionReason} /> : <></>}

                  </div>
                </div>

                {/* Barcode Section */}
                {viewingEquipment.status === "Approved" && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-700 mb-3">Barcode</h3>
                    <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                      <img
                        src={viewingEquipment.barcode}
                        alt="Equipment barcode"
                        className="h-20 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => {
                    setViewingEquipment(null);
                    setIsInfoModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Equipment Popup */}
        {isPopupOpen && (
          <div className="absolute inset-0 -top-10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  {/* <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    {editingEquipment ? 'Update' : 'Submit'}
                  </button> */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px]"
                    disabled={createLoading || updateLoading}
                  >
                    {createLoading || updateLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {updateLoading ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingEquipment ? 'Update' : 'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Popup */}
        {isConfirmationOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <CheckCircle className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Send for Approval</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to send <span className="font-semibold">{equipmentToApprove?.name}</span> for approval?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmationOpen(false)}
                    disabled={approvalLoading}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApproval}
                    disabled={approvalLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
                  >
                    {approvalLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Checklist</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this checklist? This action cannot be undone.</p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                  >
                    {deleteLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete'
                    )}
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