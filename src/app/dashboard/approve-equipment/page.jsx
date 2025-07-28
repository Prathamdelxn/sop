
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle,
  Filter, Calendar, Download, TrendingUp, BarChart3, Package, 
  Clock, Award, Zap, Sparkles, ArrowRight, QrCode
} from 'lucide-react';
import BarcodeGenerator from '@/app/components/BarcodeGenerator';

const useAnimation = (dependency) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [dependency]);
  return animate;
};

const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => (
  <div className="mb-8">
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search equipment by name or type..."
          className="w-full pl-12 pr-4 py-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all duration-300 hover:shadow-xl text-slate-700 placeholder-slate-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl text-slate-700 hover:scale-105"
      >
        <Filter className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Filter</span>
      </button>
    </div>
  </div>
);

const StatusBadge = ({ status, type }) => {
  const badges = {
    approved: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm shadow-green-500/30',
    pending: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30',
    rejected: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/30',
    ongoing: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/30',
  };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium ${badges[type]} border-0`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ task, onAction, onView }) => (
  <div className="flex flex-col sm:flex-row gap-2">
    <button 
      onClick={() => onView(task)} 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-sm shadow-blue-500/30"
    >
      <Eye className="w-4 h-4 mr-2" /> View
    </button>
    {task.status=="approved"?<></>:<> <button 
      onClick={() => onAction(task._id, 'approve')} 
      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-sm shadow-green-500/30"
    >
      <Check className="w-4 h-4 mr-2" /> Approve
    </button>
    <button 
      onClick={() => onAction(task._id, 'reject')} 
      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm flex items-center transition-all duration-300 hover:scale-105 shadow-sm shadow-red-500/30"
    >
      <X className="w-4 h-4 mr-2" /> Reject
    </button></>}
   
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colorClasses = {
    orange: 'from-orange-500 via-amber-500 to-yellow-500',
    green: 'from-green-500 via-emerald-500 to-teal-500',
    red: 'from-red-500 via-rose-500 to-pink-500',
    yellow: 'from-yellow-500 via-amber-500 to-orange-500',
    blue: 'from-blue-500 via-indigo-500 to-purple-500',
  };
  const shadowClasses = {
    orange: 'shadow-orange-500/30',
    green: 'shadow-green-500/30',
    red: 'shadow-red-500/30',
    yellow: 'shadow-yellow-500/30',
    blue: 'shadow-blue-500/30',
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center shadow-sm ${shadowClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
       <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      </div>
      
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </div>
  );
};

const TaskDetailsModal = ({ task, onClose, onBarcodeUpload }) => {
  if (!task) return null;

  const isApproved = task.status.toLowerCase() === 'approved';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center mb-2">
            <Package className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Equipment Details</h3>
          </div>
          <p className="text-blue-100">Asset Information & Barcode</p>
        </div>
        
        <div className="p-6 space-y-6">
          {isApproved && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200">
              {!task.barcodeUrl ? (
                <>
                  <BarcodeGenerator 
                    text={task._id}
                    onGenerated={onBarcodeUpload}
                  />
                  <p className="mt-3 text-sm text-slate-600 text-center">
                    Scan this barcode to quickly identify this equipment
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">Barcode already generated</p>
                  <img src={task.barcodeUrl} alt="Equipment barcode" className="mx-auto max-w-full h-auto" />
                  <p className="mt-2 text-sm text-slate-600">Scan this barcode to identify the equipment</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Name:</span>
                    <span className="text-slate-800 font-semibold">{task.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Type:</span>
                    <span className="text-slate-800 font-semibold">{task.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Status:</span>
                    <StatusBadge status={task.status} type={task.status.toLowerCase()} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Manufacturer Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Manufacturer:</span>
                    <span className="text-slate-800 font-semibold">{task.manufacturer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Supplier:</span>
                    <span className="text-slate-800 font-semibold">{task.supplier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Model:</span>
                    <span className="text-slate-800 font-semibold">{task.model}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Asset Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Serial Number:</span>
                    <span className="text-slate-800 font-semibold font-mono">{task.serial}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Asset Tag:</span>
                    <span className="text-slate-800 font-semibold font-mono">{task.assetTag}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Created:</span>
                    <span className="text-slate-800 font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-500" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const[companyData,setCompanyData]=useState();
  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    deviationRaised: 0,
  });
useEffect(()=>{
    const userData=localStorage.getItem('user');
    const data=JSON.parse(userData);
    console.log(data);
    setCompanyData(data)

},[]);
console.log("setdata",companyData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/equipment/fetchAll');
        if (!res.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await res.json();

       const pendingTasks = data.data.filter(
        (t) => t.companyId === companyData?.companyId
      );

      console.log("filetedata",pendingTasks)
      setTasks(pendingTasks);
        
        // Calculate summary stats
        const pending = data.data.filter(t => t.status.toLowerCase() === 'pending').length;
        const approved = data.data.filter(t => t.status.toLowerCase() === 'approved').length;
        const rejected = data.data.filter(t => t.status.toLowerCase() === 'rejected').length;
        
        setWorkSummary({
          pendingReviews: pending,
          approvedThisWeek: approved,
          rejectedThisWeek: rejected,
          deviationRaised: 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || task.status.toLowerCase() === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, selectedFilter]);

  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const updateEquipmentStatus = async (equipmentId, status) => {
    try {
      const response = await fetch('/api/equipment/updateStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId,
          status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating equipment status:', error);
      throw error;
    }
  };

  const updateEquipmentWithBarcode = async (equipmentId, barcodeUrl) => {
    try {
      const response = await fetch('/api/equipment/updateBarcode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId,
          barcodeUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment with barcode');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  };

  const handleBarcodeUpload = async (file) => {
    try {
      if (!selectedTask) return;
      
      // Upload barcode image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file);
      console.log('Uploaded barcode image URL:', uploadResult.url);

      // Update equipment record with barcode URL
      await updateEquipmentWithBarcode(selectedTask._id, uploadResult.url);

      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === selectedTask._id 
            ? { ...task, barcodeUrl: uploadResult.url } 
            : task
        )
      );

    } catch (err) {
      console.error('Barcode upload/update failed:', err);
      setError('Failed to upload barcode. Please try again.');
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      setLoading(true);
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // First update the status in the database
      const updatedEquipment = await updateEquipmentStatus(taskId, newStatus);

      // Then update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus } 
            : task
        )
      );

      setWorkSummary(prev => ({
        ...prev,
        approvedThisWeek: action === 'approve' ? prev.approvedThisWeek + 1 : prev.approvedThisWeek,
        rejectedThisWeek: action === 'reject' ? prev.rejectedThisWeek + 1 : prev.rejectedThisWeek,
        pendingReviews: action === 'approve' || action === 'reject' ? Math.max(0, prev.pendingReviews - 1) : prev.pendingReviews,
      }));

      if (action === 'approve') {
        const approvedTask = tasks.find(task => task._id === taskId);
        setSelectedTask({ ...approvedTask, status: newStatus });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating equipment status:', error);
      setError(`Failed to ${action} equipment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = useAnimation(workSummary);

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-700">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Equipment Dashboard</h1>
          <p className="text-slate-600">Manage and monitor your equipment assets</p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilter={() => setFilterOpen(!filterOpen)}
        />

        {filterOpen && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-white/20">
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'ongoing', 'approved', 'rejected'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={AlertCircle} label="Pending Reviews" value={workSummary.pendingReviews} color="orange" trend="+2%" />
          <StatCard icon={CheckCircle} label="Approved This Week" value={workSummary.approvedThisWeek} color="green" trend="+12%" />
          <StatCard icon={XCircle} label="Rejected This Week" value={workSummary.rejectedThisWeek} color="red" trend="+5%" />
          <StatCard icon={AlertCircle} label="Deviation Raised" value={workSummary.deviationRaised} color="yellow" trend="+0%" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Equipment Tasks</h2>
              <p className="text-blue-100">Monitor and manage equipment lifecycle</p>
            </div>
           
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr key={task._id} className="border-t border-slate-200 hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-6 py-4 font-medium text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{task.name}</td>
                      <td className="px-6 py-4 text-slate-600">{task.type}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} type={task.status.toLowerCase()} />
                      </td>
                      <td className="px-6 py-4 flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <ActionButtons
                          task={task}
                          onAction={handleTaskAction}
                          onView={(task) => {
                            setSelectedTask(task);
                            setShowModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No equipment found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <TaskDetailsModal 
            task={selectedTask} 
            onClose={() => setShowModal(false)}
            onBarcodeUpload={handleBarcodeUpload}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;