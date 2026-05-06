'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Pencil, Trash2, X, Save, Factory, GitBranch, 
  ChevronDown, ChevronRight, Loader2, Building2, MapPin, Layers
} from 'lucide-react';
import { FiCheck, FiPlus, FiTrash2, FiEdit2, FiX, FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiLock } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSidebar } from '@/context/SidebarContext';
import {
  FEATURE_PERMISSIONS,
  FEATURE_LABELS,
  FEATURE_ORDER,
  FEATURE_ICONS,
  migrateLegacyPermissions,
} from '@/utils/featurePermissions';
import { EMPTY_PLANT_FORM, EMPTY_LINE_FORM } from '@/features/elogbook/utils/constants';

// Permissions are now fetched dynamically from featurePermissions.js
// based on the company's enabled features.

export default function UpdateWorkerRoles() {
  const [superadminId, setSuperadminId] = useState(null);
  const [companyId, setCompanyId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // --- Plant & Line Management State ---
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [allLines, setAllLines] = useState([]);
  const [plantForm, setPlantForm] = useState(EMPTY_PLANT_FORM);
  const [lineForm, setLineForm] = useState(EMPTY_LINE_FORM);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [editingPlantId, setEditingPlantId] = useState(null);
  const [editingLineId, setEditingLineId] = useState(null);
  const [savingPlant, setSavingPlant] = useState(false);
  const [savingLine, setSavingLine] = useState(false);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [isLoadingLines, setIsLoadingLines] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert'); // 'alert', 'success', or 'confirm'
  const [popupCallback, setPopupCallback] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);
  const { addSidebarItem, removeSidebarItem, updateSidebarItem, getRandomIcon } = useSidebar();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = localStorage.getItem('user');
        if (data) {
          const userData = JSON.parse(data);
          setSuperadminId(userData.id);
          setCompanyId(userData.companyId || userData.id);
          // Load enabled features from the login-cached user data
          setEnabledFeatures(userData.features || []);
          await fetchRoles(userData.id);
          await fetchPeople(userData.id, userData.companyId || userData.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showAlert('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  // --- Plant & Line Fetchers ---
  const fetchAllPlants = async (targetCompanyId) => {
    setIsLoadingPlants(true);
    try {
      const res = await fetch(`/api/elogbook/plants?companyId=${targetCompanyId}`);
      const data = await res.json();
      if (data.success) setAllPlants(data.data);
    } catch (err) {
      console.error('Fetch plants error:', err);
    } finally {
      setIsLoadingPlants(false);
    }
  };

  const fetchLinesForPlant = async (targetCompanyId, plantId) => {
    if (!plantId) {
      setAllLines([]);
      return;
    }
    setIsLoadingLines(true);
    try {
      const res = await fetch(`/api/elogbook/lines?companyId=${targetCompanyId}&plantId=${plantId}`);
      const data = await res.json();
      if (data.success) setAllLines(data.data);
    } catch (err) {
      console.error('Fetch lines error:', err);
    } finally {
      setIsLoadingLines(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAllPlants(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId && selectedPlantId) {
      fetchLinesForPlant(companyId, selectedPlantId);
    }
  }, [companyId, selectedPlantId]);

  const showAlert = (message) => {
    setPopupMessage(message);
    setPopupType('alert');
    setShowPopup(true);
  };

  const showSuccess = (message) => {
    setPopupMessage(message);
    setPopupType('success');
    setShowPopup(true);
  };

  const showConfirm = (message, callback) => {
    setPopupMessage(message);
    setPopupType('confirm');
    setPopupCallback(() => callback);
    setShowPopup(true);
  };

  const fetchRoles = async (adminId) => {
    try {
      const res = await fetch(`/api/superAdmin/fetchById/${adminId}`);
      const data = await res.json();
      if (data.success) {
        setRoles(data.superAdmin?.workerRole || []);
      } else {
        showAlert(data.message || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      showAlert('Error fetching roles');
    }
  };

  const fetchPeople = async (adminId, slug) => {
    try {
      const targetContext = slug || adminId;
      const res = await fetch(`/api/superAdmin/users/fetchAll?companyId=${targetContext}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setAllUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users for count:", err);
    }
  };

  const getUserCountForRole = (roleTitle) => {
    if (!allUsers) return 0;
    const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const targetSlug = slugify(roleTitle);
    
    return allUsers.filter(user => 
      slugify(user.role || '') === targetSlug && 
      (user.companyId === superadminId || user.companyId === companyId)
    ).length;
  };

  const handleTaskToggle = (task) => {
    setSelectedTasks(prev =>
      prev.includes(task)
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleDeleteRole = async (roleTitle) => {
    if (!superadminId) return;

    setDeletingRole(roleTitle);
    showConfirm(
      `Are you sure you want to delete the role "${roleTitle}"? This will also delete users with this role.`,
      async (confirmed) => {
        if (!confirmed) {
          setDeletingRole(null);
          return;
        }

        setIsDeleting(true);
        try {
          const res = await fetch('/api/superAdmin/delete-roles', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              superadminId,
              roleTitle,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            toast.success(`Deleted role "${roleTitle}" and ${data.deletedUsersCount || 0} associated user(s)`);
            removeSidebarItem(roleTitle);
            await fetchRoles(superadminId);
            if (editingRole && editingRole.title === roleTitle) {
              resetForm();
            }
          } else {
            throw new Error(data.error || 'Failed to delete role');
          }
        } catch (err) {
          console.error('Error deleting role:', err);
          showAlert(err.message || 'An error occurred while deleting the role');
        } finally {
          setIsDeleting(false);
          setDeletingRole(null);
        }
      }
    );
  };

  const resetForm = () => {
    setRoleTitle('');
    setSelectedTasks([]);
    setEditingRole(null);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleTitle(role.title);
    // Migrate any legacy permissions (e.g. old "ElogBook" → granular)
    setSelectedTasks(migrateLegacyPermissions(role.task || []));
    setActiveTab('create');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!superadminId || !roleTitle) return;

    if (allPlants.length === 0) {
      showAlert("Action Required: Please add at least one plant before creating roles and permissions.");
      return;
    }

    const newRoleTitle = roleTitle.trim().toLowerCase();

    // Duplicate check only on create
    if (!editingRole) {
      const roleExists = roles.some(
        (r) => r.title?.trim().toLowerCase() === newRoleTitle
      );
      
      if (roleExists) {
        showAlert(`Role "${roleTitle}" already exists. Please choose another name.`);
        return;
      }
    }
    
    setIsSubmitting(true);

    try {
      const endpoint = editingRole
        ? '/api/superAdmin/update-worker-roles'
        : '/api/superAdmin/add-worker-roles';
      const method = editingRole ? 'PUT' : 'PUT';

      const body = editingRole
        ? {
          superadminId,
          oldRoleTitle: editingRole.title,
          workerRole: {
            title: roleTitle,
            task: selectedTasks
          }
        }
        : {
          superadminId,
          workerRole: {
            title: roleTitle,
            task: selectedTasks
          }
        };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${editingRole ? 'update' : 'create'} role`);
      }

      showSuccess(`Role "${roleTitle}" ${editingRole ? 'updated' : 'created'} successfully.`);

      const newItem = {
        title: roleTitle,
        task: selectedTasks,
        icon: getRandomIcon(roles.length)
      };

      if (editingRole) {
        updateSidebarItem(editingRole.title, newItem);
      } else {
        addSidebarItem(newItem);
      }
      resetForm();
      await fetchRoles(superadminId);
      setActiveTab('manage');
    } catch (error) {
      console.error(`Error ${editingRole ? 'updating' : 'creating'} role:`, error);
      showAlert(error.message || `Error ${editingRole ? 'updating' : 'creating'} role`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlantSubmit = async (e) => {
    e.preventDefault();
    setSavingPlant(true);
    try {
      const method = editingPlantId ? 'PUT' : 'POST';
      const url = editingPlantId ? `/api/elogbook/plants/${editingPlantId}` : '/api/elogbook/plants';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plantForm, companyId: companyId }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Plant ${editingPlantId ? 'updated' : 'created'} successfully`);
        setShowPlantModal(false);
        fetchAllPlants(superadminId);
        setPlantForm(EMPTY_PLANT_FORM);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Save plant error:', err);
    } finally {
      setSavingPlant(false);
    }
  };

  // Get popup styling based on type
  const getPopupStyles = () => {
    switch (popupType) {
      case 'success':
        return {
          icon: <FiCheckCircle className="w-12 h-12 text-green-600" />,
          title: 'Success',
          titleColor: 'text-gray-900',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          buttonFocus: 'focus:ring-green-600'
        };
      case 'confirm':
        return {
          icon: <FiAlertTriangle className="w-12 h-12 text-amber-600" />,
          title: 'Confirm Action',
          titleColor: 'text-gray-900',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          buttonFocus: 'focus:ring-red-600'
        };
      default: // alert
        return {
          icon: <FiAlertCircle className="w-12 h-12 text-red-600" />,
          title: 'Alert',
          titleColor: 'text-gray-900',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
          buttonFocus: 'focus:ring-indigo-600'
        };
    }
  };

  const popupStyles = getPopupStyles();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Worker Role Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Define permissions and manage staff per role
            </p>
          </motion.div>

          {/* New Company ID Badge for convenience */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-indigo-100 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Company ID</p>
              <div className="flex items-center space-x-2">
                <code className="text-lg font-bold text-indigo-700 bg-indigo-50/50 px-2 rounded">{companyId || superadminId}</code>
                <button 
                   onClick={() => {
                     navigator.clipboard.writeText(companyId || superadminId);
                     toast.info("Company ID copied to clipboard!");
                   }}
                   className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-indigo-600"
                   title="Copy ID"
                >
                  <FiPlus className="rotate-45" size={16} /> {/* Simple icon as placeholder for copy if FiCopy isn't available, but let's just use what's imported */}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic italic">Staff need this ID to login</p>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                resetForm();
                setActiveTab('manage');
              }}
              className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm ${activeTab === 'manage'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Manage Roles
            </button>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('create');
              }}
              className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm ${activeTab === 'create'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {editingRole ? 'Edit Role' : 'Create Role'}
            </button>
            <button
              onClick={() => {
                setActiveTab('plants');
              }}
              className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm ${activeTab === 'plants'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Facility Setup (Plants & Lines)
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'create' ? (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingRole ? 'Edit Role' : 'Create New Role'}
                  </h3>
                  {editingRole && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                    >
                      <FiX className="mr-1" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Project Manager"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                    disabled={!!editingRole}
                  />
                  {editingRole && (
                    <p className="mt-1 text-xs text-gray-500">
                      Note: Role title cannot be changed. Create a new role if you need a different title.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Assign Permissions
                  </label>
                  <div className="space-y-6">
                    {FEATURE_ORDER.map((featureKey) => {
                      const isEnabled = enabledFeatures.includes(featureKey);
                      const permissions = FEATURE_PERMISSIONS[featureKey] || [];
                      const label = FEATURE_LABELS[featureKey] || featureKey;
                      const icon = FEATURE_ICONS[featureKey] || '📦';
                      const isComingSoon = isEnabled && permissions.length === 0;

                      // Skip features the company doesn't have access to
                      if (!isEnabled) return null;

                      return (
                        <div key={featureKey} className="rounded-xl border border-gray-200 overflow-hidden">
                          {/* Feature Section Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{icon}</span>
                              <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
                            </div>
                            {isComingSoon && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                <FiLock className="mr-1" size={10} />
                                Coming Soon
                              </span>
                            )}
                            {!isComingSoon && permissions.length > 0 && (
                              <span className="text-xs text-gray-400">
                                {permissions.filter(p => selectedTasks.includes(p)).length}/{permissions.length} selected
                              </span>
                            )}
                          </div>

                          {/* Permissions Grid */}
                          {isComingSoon ? (
                            <div className="px-4 py-6 text-center text-gray-400">
                              <FiLock className="mx-auto mb-2" size={24} />
                              <p className="text-sm">This phase is under development</p>
                            </div>
                          ) : (
                            <div className="p-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {permissions.map((task, index) => (
                                  <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <button
                                      type="button"
                                      disabled={allPlants.length === 0}
                                      onClick={() => handleTaskToggle(task)}
                                      className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-all flex items-center ${
                                        allPlants.length === 0 ? 'bg-gray-100 cursor-not-allowed opacity-50' :
                                        selectedTasks.includes(task)
                                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 flex items-center justify-center mr-2 sm:mr-3 rounded border ${selectedTasks.includes(task)
                                          ? 'bg-indigo-600 border-indigo-600 text-white'
                                          : 'bg-white border-gray-300'
                                        }`}>
                                        {selectedTasks.includes(task) && <FiCheck size={14} />}
                                      </span>
                                      <span className="text-sm">{task}</span>
                                    </button>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {allPlants.length === 0 && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg flex items-start space-x-3">
                    <FiAlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-amber-800">Plants Required</h4>
                      <p className="text-sm text-amber-700">You must add at least one plant before you can create roles and assign permissions. Go to the "Facility Setup" tab to add a plant.</p>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('plants')}
                        className="mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Go to Facility Setup →
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !roleTitle || allPlants.length === 0}
                    className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium text-white transition flex justify-center items-center ${isSubmitting || !roleTitle || allPlants.length === 0
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingRole ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingRole ? 'Update Role' : 'Create Role'
                    )}
                  </button>
                </div>
              </motion.form>
            ) : activeTab === 'plants' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Plants List & Management */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                        Manage Plants
                      </h3>
                      <p className="text-sm text-gray-500">Add and configure your manufacturing plants</p>
                    </div>
                    <button
                      onClick={() => {
                        setPlantForm(EMPTY_PLANT_FORM);
                        setEditingPlantId(null);
                        setShowPlantModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add Plant
                    </button>
                  </div>

                  {isLoadingPlants ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
                  ) : allPlants.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">No plants configured. Add your first plant above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allPlants.map(plant => (
                        <div 
                          key={plant._id} 
                          className={`relative group bg-white border rounded-2xl p-4 transition-all hover:shadow-md cursor-pointer ${selectedPlantId === plant._id ? 'ring-2 ring-indigo-500 border-transparent shadow-md' : 'border-gray-100 hover:border-indigo-200'}`}
                          onClick={() => setSelectedPlantId(plant._id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                              <Factory className="w-5 h-5" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlantForm({ ...plant });
                                  setEditingPlantId(plant._id);
                                  setShowPlantModal(true);
                                }} 
                                className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete plant "${plant.name}"? This will also affect associated lines.`)) {
                                    const res = await fetch(`/api/elogbook/plants/${plant._id}`, { method: 'DELETE' });
                                    const data = await res.json();
                                    if (data.success) {
                                      toast.success("Plant deleted successfully");
                                      fetchAllPlants(superadminId);
                                      if (selectedPlantId === plant._id) setSelectedPlantId('');
                                    } else {
                                      alert(data.message);
                                    }
                                  }
                                }} 
                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{plant.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold tracking-wider">{plant.code}</span>
                              {plant.city && (
                                <span className="text-xs text-gray-400 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" /> {plant.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lines & Sublines Management (Conditional on Plant Selection) */}
                {selectedPlantId ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                          <GitBranch className="w-5 h-5 mr-2 text-cyan-600" />
                          Production Lines for {allPlants.find(p => p._id === selectedPlantId)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">Configure lines and their sublines for this plant</p>
                      </div>
                    </div>

                    {isLoadingLines ? (
                      <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
                    ) : (
                      <div className="space-y-6">
                        {/* Lines Grid */}
                        {allLines.length === 0 ? (
                          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm">No production lines found for this plant. Add one below.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {allLines.map(line => (
                              <div key={line._id} className="border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-cyan-600 shadow-sm">
                                      <span className="text-xs font-bold">{line.lineNumber}</span>
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-gray-800 text-sm">
                                        {line.name || `Line ${line.lineNumber}`}
                                      </h5>
                                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Line Number {line.lineNumber}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => {
                                        setLineForm({ 
                                          lineNumber: line.lineNumber, 
                                          name: line.name || '',
                                          sublines: line.sublines ? line.sublines.map(s => typeof s === 'string' ? { name: s, order: 0 } : { ...s }) : [] 
                                        });
                                        setEditingLineId(line._id);
                                      }}
                                      className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-all"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={async () => {
                                        if (confirm(`Delete Line ${line.lineNumber}? This cannot be undone.`)) {
                                          const res = await fetch(`/api/elogbook/lines/${line._id}`, { method: 'DELETE' });
                                          if ((await res.json()).success) {
                                            toast.success("Line deleted");
                                            fetchLinesForPlant(superadminId, selectedPlantId);
                                          }
                                        }
                                      }}
                                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="p-4 flex-1">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                      <Layers className="w-3 h-3 mr-1" /> Sublines ({line.sublines?.length || 0})
                                    </span>
                                  </div>
                                  {line.sublines && line.sublines.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {line.sublines.map((sub, i) => (
                                        <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium border border-cyan-100 flex items-center">
                                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                                          {typeof sub === 'string' ? sub : sub.name}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">No sub-processes defined for this line</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add/Edit Line Form */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                              {editingLineId ? <Pencil className="w-4 h-4 mr-2 text-indigo-600" /> : <Plus className="w-4 h-4 mr-2 text-indigo-600" />}
                              {editingLineId ? 'Edit Production Line' : 'Add New Production Line'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Line Number *</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={lineForm.lineNumber}
                                  onChange={e => setLineForm({ ...lineForm, lineNumber: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                                  placeholder="e.g., 1"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Line Name</label>
                                <input 
                                  type="text" 
                                  value={lineForm.name}
                                  onChange={e => setLineForm({ ...lineForm, name: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                                  placeholder="e.g., CED Line 1"
                                />
                              </div>
                            </div>

                            {/* Sublines Management */}
                            <div className="mb-6">
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Sub-processes / Sublines</label>
                              <div className="space-y-3">
                                {lineForm.sublines.map((sub, i) => (
                                  <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-200">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-xs font-bold">S{i+1}</div>
                                    <input 
                                      type="text"
                                      value={sub.name}
                                      onChange={(e) => {
                                        const newSub = [...lineForm.sublines];
                                        newSub[i] = { ...newSub[i], name: e.target.value };
                                        setLineForm({ ...lineForm, sublines: newSub });
                                      }}
                                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
                                      placeholder="e.g., Degreasing Tank"
                                    />
                                    <button 
                                      onClick={() => {
                                        const newSub = lineForm.sublines.filter((_, idx) => idx !== i);
                                        setLineForm({ ...lineForm, sublines: newSub });
                                      }}
                                      className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                                    >
                                      <FiTrash2 size={16} />
                                    </button>
                                  </div>
                                ))}
                                <button 
                                  onClick={() => setLineForm({ ...lineForm, sublines: [...lineForm.sublines, { name: '', order: lineForm.sublines.length + 1 }] })}
                                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all border border-dashed border-indigo-200 w-full justify-center"
                                >
                                  <Plus className="w-3 h-3" /> Add Sub-process
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button 
                                disabled={!lineForm.lineNumber || savingLine}
                                onClick={async () => {
                                  setSavingLine(true);
                                  const payload = { 
                                    plantId: selectedPlantId, 
                                    companyId: companyId,
                                    lineNumber: Number(lineForm.lineNumber), 
                                    name: lineForm.name || `Line ${lineForm.lineNumber}`,
                                    sublines: lineForm.sublines
                                      .filter(s => s.name.trim() !== '')
                                      .map((s, idx) => ({ ...s, order: idx + 1 }))
                                  };
                                  
                                  try {
                                    const res = editingLineId 
                                      ? await fetch(`/api/elogbook/lines/${editingLineId}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(payload),
                                        })
                                      : await fetch('/api/elogbook/lines', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(payload),
                                        });
                                    
                                    const data = await res.json();
                                    if (data.success) {
                                      toast.success(`Line ${editingLineId ? 'updated' : 'created'} successfully`);
                                      setLineForm(EMPTY_LINE_FORM);
                                      setEditingLineId(null);
                                      fetchLinesForPlant(superadminId, selectedPlantId);
                                    } else {
                                      alert(data.message);
                                    }
                                  } catch (err) {
                                    console.error('Save line error:', err);
                                  } finally {
                                    setSavingLine(false);
                                  }
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                              >
                                {savingLine ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {editingLineId ? 'Update Production Line' : 'Save Production Line'}
                              </button>
                              {editingLineId && (
                                <button 
                                  onClick={() => {
                                    setLineForm(EMPTY_LINE_FORM);
                                    setEditingLineId(null);
                                  }}
                                  className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <Factory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-700 mb-2">No Plant Selected</h4>
                    <p className="text-gray-400 max-w-xs mx-auto">Please select a plant from the list above to manage its production lines and sub-processes.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900">Existing Roles</h3>
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm sm:text-base"
                  >
                    <FiPlus size={16} />
                    <span>Add New Role</span>
                  </button>
                </div>

                <AnimatePresence>
                  {roles.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg"
                    >
                      <p className="text-gray-500">No roles created yet</p>
                    </motion.div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Staff
                                </th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Permissions
                                </th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <AnimatePresence>
                                {roles.map((role, idx) => (
                                  <motion.tr
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                      {role.title}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getUserCountForRole(role.title) > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
                                          {getUserCountForRole(role.title)}
                                        </div>
                                        <span className="text-sm text-gray-500">People</span>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                      <div className="flex flex-wrap gap-1 sm:gap-2">
                                        {role.task && role.task.length > 0 ? (
                                          role.task.map((task, i) => (
                                            <span
                                              key={i}
                                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                            >
                                              {task}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-gray-400 text-sm">No permissions</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                      <button
                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                        onClick={() => handleEditRole(role)}
                                      >
                                        <FiEdit2 size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRole(role.title)}
                                        disabled={isDeleting && deletingRole === role.title}
                                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                      >
                                        {isDeleting && deletingRole === role.title ? (
                                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        ) : (
                                          <FiTrash2 size={16} />
                                        )}
                                      </button>
                                    </td>
                                  </motion.tr>
                                ))}
                              </AnimatePresence>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

<AnimatePresence>
  {showPopup && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
      onClick={() => setShowPopup(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden bg-white rounded-2xl shadow-2xl">
          {/* Popup Header with Gradient Background */}
          <div className={`px-6 py-5 ${popupType === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 
            popupType === 'confirm' ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 
            'bg-gradient-to-r from-red-50 to-rose-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-full ${popupType === 'success' ? 'bg-green-100 text-green-600' : 
                  popupType === 'confirm' ? 'bg-amber-100 text-amber-600' : 
                  'bg-red-100 text-red-600'}`}>
                  {popupType === 'success' ? <FiCheckCircle className="w-6 h-6" /> : 
                   popupType === 'confirm' ? <FiAlertTriangle className="w-6 h-6" /> : 
                   <FiAlertCircle className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {popupType === 'success' ? 'Success!' : 
                   popupType === 'confirm' ? 'Confirm Action' : 
                   'Attention Required'}
                </h3>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Popup Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <p className="text-gray-700 text-base leading-relaxed">
                {popupMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${popupType === 'confirm' ? 'justify-between' : 'justify-center'} gap-3`}>
              {popupType === 'confirm' ? (
                <>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      popupCallback && popupCallback(false);
                    }}
                    className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 
                             shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      popupCallback && popupCallback(true);
                    }}
                    className={`flex-1 px-5 py-3 border border-transparent rounded-xl text-sm font-medium text-white 
                             ${popupType === 'confirm' ? 
                               'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700' :
                               'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                             } focus:outline-none focus:ring-2 focus:ring-offset-2 
                             ${popupType === 'confirm' ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}
                             transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowPopup(false)}
                  className={`px-8 py-3 border border-transparent rounded-xl text-sm font-medium text-white 
                           ${popupType === 'success' ? 
                             'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' :
                             'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                           } focus:outline-none focus:ring-2 focus:ring-offset-2 
                           ${popupType === 'success' ? 'focus:ring-green-500' : 'focus:ring-indigo-500'}
                           transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  {popupType === 'success' ? 'Continue' : 'Got it'}
                </button>
              )}
            </div>

            {/* Additional Info for Confirm Popup */}
            {popupType === 'confirm' && (
              <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-2">
                  <FiAlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    This action cannot be undone. All users with this role will be permanently deleted.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          {popupType === 'success' && (
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-green-200 rounded-full opacity-10"></div>
          )}
          {popupType === 'confirm' && (
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-amber-200 rounded-full opacity-10"></div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Plant Modal */}
<AnimatePresence>
  {showPlantModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Factory className="w-6 h-6 mr-3 text-indigo-600" />
            {editingPlantId ? 'Edit Plant Details' : 'Register New Plant'}
          </h3>
          <button onClick={() => setShowPlantModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handlePlantSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plant Name *</label>
              <input 
                required
                type="text"
                value={plantForm.name}
                onChange={e => setPlantForm({ ...plantForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g., Main Assembly"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plant Code *</label>
              <input 
                required
                type="text"
                value={plantForm.code}
                onChange={e => setPlantForm({ ...plantForm, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                placeholder="e.g., PLT-01"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
              <input 
                type="text"
                value={plantForm.city}
                onChange={e => setPlantForm({ ...plantForm, city: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                placeholder="e.g., Pune"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State</label>
              <input 
                type="text"
                value={plantForm.state}
                onChange={e => setPlantForm({ ...plantForm, state: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                placeholder="e.g., Maharashtra"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={savingPlant}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {savingPlant ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {editingPlantId ? 'Update Plant' : 'Save Plant'}
            </button>
            <button 
              type="button"
              onClick={() => setShowPlantModal(false)}
              className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
}