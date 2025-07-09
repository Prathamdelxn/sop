"use client";
 
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle, Filter, Calendar, Users, TrendingUp, Bell, Settings, Download, RefreshCw } from 'lucide-react';
 
// Utility function for animations
const useAnimation = (dependency) => {
  const [animate, setAnimate] = useState(false);
 
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [dependency]);
 
  return animate;
};
 
// Enhanced SearchBar Component
const SearchBar = ({ searchQuery, onSearchChange, onFilter }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Quick search any Prototype by name or task number..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
 
// Enhanced Status Badge Component
const StatusBadge = ({ status, type }) => {
  const badges = {
    completed: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
    pending: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200',
    rejected: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200',
    ongoing: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
  };
 
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${badges[type]} transition-all duration-200`}>
      {status}
    </span>
  );
};
 
// Enhanced Assignee Avatar Component
const AssigneeAvatar = ({ initials, color, index }) => {
  const colors = {
    'DR': 'bg-gradient-to-br from-orange-400 to-orange-600',
    'JP': 'bg-gradient-to-br from-purple-400 to-purple-600',
    'KP': 'bg-gradient-to-br from-pink-400 to-pink-600',
    'PM': 'bg-gradient-to-br from-blue-400 to-blue-600',
    'BN': 'bg-gradient-to-br from-green-400 to-green-600',
    'CR': 'bg-gradient-to-br from-red-400 to-red-600'
  };
 
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${colors[initials] || 'bg-gradient-to-br from-gray-400 to-gray-600'}
        transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer ring-2 ring-white shadow-sm`}
      style={{ zIndex: 10 - index, marginLeft: index > 0 ? '-8px' : '0' }}
      title={initials}
    >
      {initials}
    </div>
  );
};
 
// Enhanced Action Buttons Component
const ActionButtons = ({ task, onAction }) => {
  if (task.type === 'pending' || task.type === 'ongoing') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onAction(task.id, 'approve')}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </button>
        <button
          onClick={() => onAction(task.id, 'reject')}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </button>
      </div>
    );
  }
 
  return (
    <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
      <Eye className="w-4 h-4 mr-2" />
      View Details
    </button>
  );
};
 
// Enhanced Statistics Card Component
const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colorClasses = {
    orange: 'from-orange-500 to-amber-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-rose-500',
    yellow: 'from-yellow-500 to-amber-500',
    blue: 'from-blue-500 to-indigo-500'
  };
 
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
};
 
// Main Dashboard Component
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      taskNo: '1.1',
      PrototypeName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['DR', 'JP', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      type: 'completed',
      priority: 'high'
    },
    {
      id: 2,
      taskNo: '2.1',
      PrototypeName: 'Machine Cleaning : Model No. MACH001432',
      assignedTo: ['PM', 'BN', 'CR', 'KP'],
      status: 'Pending',
      dueDate: '03-07-2025',
      type: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      taskNo: '1.3',
      PrototypeName: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Rejected',
      dueDate: '30-06-2025',
      type: 'rejected',
      priority: 'low'
    },
    {
      id: 4,
      taskNo: '2.3',
      PrototypeName: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Ongoing',
      dueDate: '01-07-2025',
      type: 'ongoing',
      priority: 'high'
    }
  ]);
 
  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 12,
    approvedThisWeek: 24,
    rejectedThisWeek: 12,
    deviationRaised: 2
  });
 
  const animateStats = useAnimation(workSummary);
 
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.PrototypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.taskNo.includes(searchQuery);
      const matchesFilter = selectedFilter === 'all' || task.type === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, selectedFilter]);
 
  const handleTaskAction = (taskId, action) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (action === 'approve') {
            return { ...task, status: 'Completed', type: 'completed' };
          } else if (action === 'reject') {
            return { ...task, status: 'Rejected', type: 'rejected' };
          }
        }
        return task;
      })
    );
 
    if (action === 'approve') {
      setWorkSummary(prev => ({
        ...prev,
        approvedThisWeek: prev.approvedThisWeek + 1,
        pendingReviews: Math.max(0, prev.pendingReviews - 1)
      }));
    } else if (action === 'reject') {
      setWorkSummary(prev => ({
        ...prev,
        rejectedThisWeek: prev.rejectedThisWeek + 1,
        pendingReviews: Math.max(0, prev.pendingReviews - 1)
      }));
    }
  };
 
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilter={() => setFilterOpen(!filterOpen)}
        />
 
        {/* Filter Bar */}
        {filterOpen && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'ongoing', 'completed', 'rejected'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
 
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={AlertCircle}
            label="Pending Reviews"
            value={workSummary.pendingReviews}
            color="orange"
            trend="+2.5%"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved This Week"
            value={workSummary.approvedThisWeek}
            color="green"
            trend="+12.3%"
          />
          <StatCard
            icon={XCircle}
            label="Rejected This Week"
            value={workSummary.rejectedThisWeek}
            color="red"
            trend="-5.2%"
          />
          <StatCard
            icon={AlertCircle}
            label="Deviation Raised"
            value={workSummary.deviationRaised}
            color="yellow"
            trend="+1.1%"
          />
        </div>
 
        {/* Priority Tasks Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-white">Priority Tasks Review</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-blue-200 hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="text-blue-200 hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
         
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Task No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prototype Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900">{task.taskNo}</span>
                        {task.priority === 'high' && (
                          <div className="ml-2 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                        {task.PrototypeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {task.assignedTo.map((initials, idx) => (
                          <AssigneeAvatar
                            key={idx}
                            initials={initials}
                            index={idx}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={task.status} type={task.type} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActionButtons task={task} onAction={handleTaskAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
 
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task History */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-white">Task History & Traceability</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Recent Activity</p>
                      <p className="text-sm text-gray-600">Track all task changes and updates</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium">
                    View History
                  </button>
                </div>
               
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Performance Analytics</p>
                      <p className="text-sm text-gray-600">View detailed performance metrics</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
             
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-left">
                <Download className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Export Reports</span>
              </button>
             
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-left">
                <Settings className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;