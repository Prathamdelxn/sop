'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const predefinedTasks = [
  'Create Checklist',
  'Create Equipment',
  'Assign Checklist to Equipment',
  'Assign Task',
  'Task Execution',
  'Approve Equipment',
  'Approve Task',
  'Approve Checklist',
  'Approve Tagged Chechlist with Equipment'
];

export default function UpdateWorkerRoles() {
  const [superadminId, setSuperadminId] = useState(null);
  const [roleTitle, setRoleTitle] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert'); // 'alert' or 'confirm'
  const [popupCallback, setPopupCallback] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = localStorage.getItem('user');
        if (data) {
          const userData = JSON.parse(data);
          setSuperadminId(userData.id);
          await fetchRoles(userData.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showAlert('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const showAlert = (message) => {
    setPopupMessage(message);
    setPopupType('alert');
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
            await fetchRoles(superadminId);
            if (editingRole && editingRole.title === roleTitle) {
              resetForm();
            }
            window.location.reload();
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
    setSelectedTasks(role.task || []);
    setActiveTab('create');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!superadminId || !roleTitle) return;

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

      toast.success(`Role ${editingRole ? 'updated' : 'created'} successfully`);
      resetForm();
      await fetchRoles(superadminId);
      setActiveTab('manage');
      window.location.reload();
    } catch (error) {
      console.error(`Error ${editingRole ? 'updating' : 'creating'} role:`, error);
      showAlert(error.message || `Error ${editingRole ? 'updating' : 'creating'} role`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Worker Role Management</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Define and manage permissions for different worker roles
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
          
            <button
              onClick={() => {
                resetForm();
                setActiveTab('manage');
              }}
              className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm ${
                activeTab === 'manage' 
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
              className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm ${
                activeTab === 'create' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {editingRole ? 'Edit Role' : 'Create Role'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Permissions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {predefinedTasks.map((task, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          type="button"
                          onClick={() => handleTaskToggle(task)}
                          className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-all flex items-center ${
                            selectedTasks.includes(task)
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                          }`}
                        >
                          <span className={`w-5 h-5 flex items-center justify-center mr-2 sm:mr-3 rounded border ${
                            selectedTasks.includes(task)
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-gray-300'
                          }`}>
                            {selectedTasks.includes(task) && <FiCheck size={14} />}
                          </span>
                          <span className="text-sm sm:text-base">{task}</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !roleTitle}
                    className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium text-white transition flex justify-center items-center ${
                      isSubmitting || !roleTitle
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

      {/* Popup Dialog */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-300/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full"
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {popupType === 'confirm' ? 'Confirm Action' : 'Notice'}
                </h3>
                <p className="mt-2 text-gray-600">{popupMessage}</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                {popupType === 'confirm' ? (
                  <>
                    <button
                      onClick={() => {
                        setShowPopup(false);
                        popupCallback && popupCallback(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowPopup(false);
                        popupCallback && popupCallback(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    OK
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}