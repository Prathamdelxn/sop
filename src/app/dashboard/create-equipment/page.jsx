
'use client';
import { useState, useEffect } from 'react';
import {
  Award,
  Package,
  Sparkles,
  Zap,
  Plus,
  Edit, Users, User,
  Trash2, Barcode,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";

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
        console.log(result);
        if (res.ok && result.success) {
          const filtered = result.data.filter(item => item.companyId === companyData?.companyId && item.userId === companyData?.id);
          setEquipmentList(filtered);
        } else {
          console.error('Failed to fetch equipment:', result.message);
        }
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setIsLoading(false);
      } finally {
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
    const today = new Date();
    const dueDate = new Date(equipment.qualificationDueDate);
    if (dueDate < today) {
      alert('This equipment has already expired and cannot be sent for approval.');
      return;
    }
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
    qmsNumber: '',
    poNumber: '',
    qualificationDoneDate: '',
    qualificationDueDate: '',
    equipmentId: '',
    preventiveMaintenaceDoneDate: '',
    preventiveDueDate: '',
    remark: '' // Added remark field
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
    if (!formData.equipmentId.trim()) newErrors.equipmentId = 'Equipment ID is required.';
    if (!formData.qualificationDueDate) newErrors.qualificationDueDate = 'Qualification Due Date is required.';

    // Validate remark for expired equipment
    const today = new Date();
    const dueDate = new Date(formData.qualificationDueDate);
    if (dueDate < today && !formData.remark.trim()) {
      newErrors.remark = 'Remark is required for expired equipment.';
    }

    return newErrors;
  };

  const openPopup = (equipment = null) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData({
        ...equipment,
        qmsNumber: equipment.qmsNumber || '',
        poNumber: equipment.poNumber || '',
        qualificationDoneDate: equipment.qualificationDoneDate ? equipment.qualificationDoneDate.split('T')[0] : '',
        qualificationDueDate: equipment.qualificationDueDate ? equipment.qualificationDueDate.split('T')[0] : '',
        equipmentId: equipment.equipmentId || '',
        preventiveMaintenaceDoneDate: equipment.preventiveMaintenaceDoneDate ? equipment.preventiveMaintenaceDoneDate.split('T')[0] : '',
        preventiveDueDate: equipment.preventiveDueDate ? equipment.preventiveDueDate.split('T')[0] : '',
        remark: equipment.remark || '' // Initialize remark
      });
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
        status: 'Pending',
        qmsNumber: '',
        poNumber: '',
        qualificationDoneDate: '',
        qualificationDueDate: '',
        equipmentId: '',
        preventiveMaintenaceDoneDate: '',
        preventiveDueDate: '',
        remark: '' // Initialize remark for new equipment
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
      status: 'InProgress',
      qmsNumber: '',
      poNumber: '',
      qualificationDoneDate: '',
      qualificationDueDate: '',
      equipmentId: '',
      preventiveMaintenaceDoneDate: '',
      preventiveDueDate: '',
      remark: '' // Reset remark
    });
    setErrors({});
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    setCompanyData(user);
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      let result;
      if (editingEquipment) {
        setUpdateLoading(true);
        const res = await fetch('/api/equipment/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            equipmentIds: editingEquipment._id,
            name: formData.name,
            type: formData.type,
            manufacturer: formData.manufacturer,
            supplier: formData.supplier,
            model: formData.model,
            serial: formData.serial,
            assetTag: formData.assetTag,
            status: "InProgress",
            qmsNumber: formData.qmsNumber,
            poNumber: formData.poNumber,
            qualificationDoneDate: formData.qualificationDoneDate,
            qualificationDueDate: formData.qualificationDueDate,
            equipmentId: formData.equipmentId,
            preventiveMaintenaceDoneDate: formData.preventiveMaintenaceDoneDate,
            preventiveDueDate: formData.preventiveDueDate,
            remark: formData.remark // Include remark in update
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
        const newData = {
          name: formData.name,
          type: formData.type,
          manufacturer: formData.manufacturer,
          supplier: formData.supplier,
          model: formData.model,
          serial: formData.serial,
          companyId: companyData.companyId,
          userId: companyData.id,
          qmsNumber: formData.qmsNumber,
          qualificationDoneDate: formData.qualificationDoneDate,
          qualificationDueDate: formData.qualificationDueDate,
          equipmentId: formData.equipmentId,
          preventiveMaintenaceDoneDate: formData.preventiveMaintenaceDoneDate,
          preventiveDueDate: formData.preventiveDueDate,
          remark: formData.remark // Include remark in create
        };
        console.log("de", newData)
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
      status: 'InProgress',
      qmsNumber: '',
      poNumber: '',
      qualificationDoneDate: '',
      qualificationDueDate: '',
      equipmentId: '',
      preventiveMaintenaceDoneDate: '',
      preventiveDueDate: '',
      remark: '' // Reset remark
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

  const DetailItem = ({ label, value }) => (
    <div className='bg-red-500 p-2 rounded-xl bg-slate-200'>
      <p className={`text-sm font-medium ${label == "Rejection Reason" ? "text-red-500" : "text-gray-500"} `}>{label}</p>
      <p className="text-gray-900 mt-1">
        {value || <span className="text-gray-400">N/A</span>}
      </p>
    </div>
  );

  // Check if equipment is expired
  const isEquipmentExpired = (equipment) => {
    const today = new Date();
    const dueDate = new Date(equipment.qualificationDueDate);
    return dueDate < today;
  };

  const filteredEquipment = equipmentList.map((equipment) => {
    const today = new Date();
    const dueDate = new Date(equipment.qualificationDueDate);
    const status = dueDate < today && equipment.status === 'InProgress' ? 'Expired' : equipment.status;
    return { ...equipment, status };
  }).filter((equipment) => {
    const matchesSearch =
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipment.id?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (equipment.manufacturer && equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "" || equipment.type === filterType;
    const matchesStatus =
      statusFilter === "All Statuses" ||
      (equipment.status?.toLowerCase() ?? "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter && matchesStatus;
  });
  // ---- NEW HELPER -------------------------------------------------
  const getDisplayStatus = (equipment) => {
    const today = new Date();
    const due = new Date(equipment.qualificationDueDate);
    // Show Expired only for items that are still InProgress
    if (due < today) return 'Expired';
    return equipment.status;
  };
  // -----------------------------------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Unassigned':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
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
      case 'Rejected':
        return <XCircle className="text-red-600" size={32} />;
      case 'Unassigned':
        return <XCircle className="text-gray-600" size={32} />;
      case 'Expired':
        return <AlertCircle className="text-red-600" size={32} />;
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
      case 'Rejected':
        return 'Rejected';
      case 'Expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const approvedCount = equipmentList.filter(eq => eq.status === 'Approved').length;
  const pendingCount = equipmentList.filter(eq => eq.status === 'Pending Approval').length;
  const createdCount = equipmentList.filter(eq => eq.status === 'InProgress').length;
  const rejectedCount = equipmentList.filter(eq => eq.status === 'Rejected').length;
  const expiredCount = equipmentList.filter(eq => {
    const dueDate = new Date(eq.qualificationDueDate);
    return dueDate < new Date() && eq.status === 'InProgress';
  }).length;
  // Helper that returns the same badge you use for SOP
  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Approved':
        return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
      case 'Pending Approval':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'InProgress':
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'Rejected':
        return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };
  useEffect(() => {
    fetchUseredById(viewingEquipment?.userId);
  }, [viewingEquipment]);

  const [name, setName] = useState();
  const fetchUseredById = async (id) => {
    const res = await fetch(`/api/users/fetch-by-id/${id}`);
    const data = await res.json();
    console.log("asdfasdf", data?.user?.name);
    setName(data?.user?.name);
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
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
        <div className="grid grid-cols-5 md:grid-cols-5 mx-2 gap-4 mt-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex  items-center justify-between">
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
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
              </div>
              {getStatusIcon('Expired')}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="InProgress">InProgress</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
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
                      Equipment ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval / Rejection
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="text-sm text-gray-900 font-mono">{equipment.equipmentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 truncate max-w-[180px] text-blue-800">
                          {equipment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getDisplayStatus(equipment))}`}>
                          {getDisplayStatus(equipment)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                        {getDisplayStatus(equipment) === 'InProgress' && (
                          <>
                            {new Date(equipment.qualificationDueDate) >= new Date() && (
                              <button
                                onClick={() => handleSendForApproval(equipment)}
                                className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
                                title="Send for Approval"
                              >
                                Send for Approval
                              </button>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Show edit button for InProgress, Rejected, AND Expired equipment */}
                          {(getDisplayStatus(equipment) === 'InProgress' ||
                            getDisplayStatus(equipment) === 'Rejected' ||
                            getDisplayStatus(equipment) === 'Expired') && (
                              <button
                                onClick={() => openPopup(equipment)}
                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
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

        {isInfoModalOpen && viewingEquipment && (
          <div className="fixed inset-0 pl-64 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4">
            {/* ── Modal Card ── */}
            <div
              className="relative rounded-xl bg-white shadow-xl w-full max-w-5xl h-[85vh] flex flex-col mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Sticky Header ── */}
              <div className="sticky top-0 bg-white rounded-t-xl p-4 pb-4 border-b flex items-start justify-between z-20">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {viewingEquipment.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    {/* Equipment ID */}
                    <span className="font-mono">{viewingEquipment.equipmentId}</span>

                    {/* Status Badge – same helper you already have for SOP */}
                    <span>{getStatusBadge(viewingEquipment.status)}</span>

                    {/* Rejection reason (if any) */}
                    {viewingEquipment.rejectionReason && (
                      <div className="font-semibold capitalize">
                        reason: {viewingEquipment.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    setViewingEquipment(null);
                    setIsInfoModalOpen(false);
                  }}
                  className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div className="p-6 space-y-8 overflow-y-auto flex-1 hide-scrollbar">
                {/* ── 1. Equipment Details Card ── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      Equipment Information
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equipment Name
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.name}
                          </p>
                        </div>
                      </div>

                      {/* ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equipment ID
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-mono text-gray-900">
                            {viewingEquipment.equipmentId}
                          </p>
                        </div>
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.type || '—'}
                          </p>
                        </div>
                      </div>

                      {/* QMS Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          QMS Number
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.qmsNumber || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Manufacturer */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manufacturer
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.manufacturer || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Supplier */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supplier
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.supplier || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Model */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Model
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {viewingEquipment.model || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Serial */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Serial Number
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-mono text-gray-900">
                            {viewingEquipment.serial || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ── BARCODE SECTION (Approved Only) ── */}
                {viewingEquipment.status === "Approved" && viewingEquipment.barcode && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        <Barcode className="w-4 h-4" />
                        Barcode
                      </h3>
                    </div>
                    <div className="p-6 bg-gray-50">
                      <div className="flex flex-col lg:flex-row items-center gap-6">
                        {/* Barcode Image */}
                        <div className="flex-1 max-w-md mx-auto">
                          <img
                            src={viewingEquipment.barcode}
                            alt="Equipment Barcode"
                            className="w-full h-auto max-h-48 object-contain rounded-lg shadow-md border border-gray-200 bg-white p-4"
                          />
                        </div>


                      </div>
                    </div>
                  </div>
                )}

                {/* ── 2. Qualification & Maintenance ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Qualification */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Qualification Dates
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Qualification Done On</span>
                        <span className="text-sm font-medium text-gray-900">
                          {viewingEquipment.qualificationDoneDate
                            ? new Date(viewingEquipment.qualificationDoneDate).toLocaleDateString('en-IN')
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Qualification Due On</span>
                        <span
                          className={`text-sm font-medium ${new Date(viewingEquipment.qualificationDueDate) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-900'
                            }`}
                        >
                          {viewingEquipment.qualificationDueDate
                            ? new Date(viewingEquipment.qualificationDueDate).toLocaleDateString('en-IN')
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        Preventive Dates
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preventive Maintenance Done Date</span>
                        <span className="text-sm font-medium text-gray-900">
                          {viewingEquipment.preventiveMaintenaceDoneDate
                            ? new Date(viewingEquipment.preventiveMaintenaceDoneDate).toLocaleDateString('en-IN')
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preventive Due Date</span>
                        <span
                          className={`text-sm font-medium ${new Date(viewingEquipment.preventiveDueDate) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-900'
                            }`}
                        >
                          {viewingEquipment.preventiveDueDate
                            ? new Date(viewingEquipment.preventiveDueDate).toLocaleDateString('en-IN')
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 3. Remark (if any) ── */}
                {viewingEquipment.remark && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-800">Expiration Remark</p>
                      <p className="text-sm text-orange-700 mt-1">{viewingEquipment.remark}</p>
                    </div>
                  </div>
                )}

                {/* ── 4. History & Approval ── */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    History & Approval
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Created By */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Created By</h4>
                          <p className="text-sm text-gray-500">
                            {viewingEquipment.createdAt
                              ? new Date(viewingEquipment.createdAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                              : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {companyData?.name?.charAt(0) || name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{name || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Approval Status */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm col-span-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${viewingEquipment.status === 'Approved'
                              ? 'bg-green-100'
                              : viewingEquipment.status === 'Rejected'
                                ? 'bg-red-100'
                                : 'bg-yellow-100'
                              }`}
                          >
                            {viewingEquipment.status === 'Approved' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : viewingEquipment.status === 'Rejected' ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {viewingEquipment.status === 'Approved'
                                ? 'Approved By'
                                : viewingEquipment.status === 'Rejected'
                                  ? 'Rejected By'
                                  : 'Approval Pending'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {viewingEquipment.approver?.approverDate
                                ? new Date(viewingEquipment.approver.approverDate).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${viewingEquipment.status === 'Approved'
                            ? 'bg-green-600'
                            : viewingEquipment.status === 'Rejected'
                              ? 'bg-red-600'
                              : 'bg-yellow-600'
                            }`}
                        >
                          {viewingEquipment.approver?.approverName?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {viewingEquipment.approver?.approverName || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add/Edit Equipment Popup */}
        {isPopupOpen && (
          <div className="fixed pl-64 inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
              <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
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
              <div className="px-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block font-semibold mb-1">Equipment ID *</label>
                    <input
                      type="text"
                      name="equipmentId"
                      placeholder="EQP-001"
                      value={formData.equipmentId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.equipmentId && <p className="text-red-500 text-sm mt-1">{errors.equipmentId}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Qualification Done Date</label>
                    <input
                      type="date"
                      name="qualificationDoneDate"
                      value={formData.qualificationDoneDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Qualification Due Date *</label>
                    <input
                      type="date"
                      name="qualificationDueDate"
                      value={formData.qualificationDueDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.qualificationDueDate && <p className="text-red-500 text-sm mt-1">{errors.qualificationDueDate}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Preventive Maintenance Done Date</label>
                    <input
                      type="date"
                      name="preventiveMaintenaceDoneDate"
                      value={formData.preventiveMaintenaceDoneDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Preventive Due Date</label>
                    <input
                      type="date"
                      name="preventiveDueDate"
                      value={formData.preventiveDueDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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

                  <div>
                    <label className="block font-semibold mb-1">QMS Number</label>
                    <input
                      type="text"
                      name="qmsNumber"
                      placeholder="QMS-12345"
                      value={formData.qmsNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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

                  {/* Remark field - Show for expired equipment or when editing expired equipment */}
                  {(editingEquipment && isEquipmentExpired(editingEquipment)) && (
                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-1">Remark *</label>
                      <textarea
                        name="remark"
                        placeholder="Enter remarks for expired equipment..."
                        value={formData.remark}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.remark && <p className="text-red-500 text-sm mt-1">{errors.remark}</p>}
                      <p className="text-sm text-gray-500 mt-1">
                        Remarks are required for expired equipment to document the reason or next steps.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex gap-4 justify-end mb-4">
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
          <div className="fixed inset-0 pl-64 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
          <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
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