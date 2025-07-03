"use client";

import React, { useState } from 'react';
import { Search, Plus, Check, Eye, X, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Dashboard Component
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      taskNo: '1.1',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['DR', 'JP', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      type: 'completed'
    },
    {
      id: 2,
      taskNo: '2.1',
      sopName: 'Machine Cleaning : Model No. MACH001432',
      assignedTo: ['PM', 'BN', 'CR', 'KP'],
      status: 'Pending',
      dueDate: '03-07-2025',
      type: 'pending'
    },
    {
      id: 3,
      taskNo: '1.3',
      sopName: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Rejected',
      dueDate: '30-06-2025',
      type: 'rejected'
    },
    {
      id: 4,
      taskNo: '2.3',
      sopName: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Ongoing',
      dueDate: '01-07-2025',
      type: 'ongoing'
    }
  ]);

  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 12,
    approvedThisWeek: 24,
    rejectedThisWeek: 12,
    deviationRaised: 2
  });

  const getStatusBadge = (status, type) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
      ongoing: 'bg-blue-100 text-blue-800'
    };
    
    return `px-3 py-1 rounded-full text-sm font-medium ${badges[type]}`;
  };

  const getAssigneeColor = (initials) => {
    const colors = {
      'DR': 'bg-orange-500',
      'JP': 'bg-purple-500',
      'KP': 'bg-pink-500',
      'PM': 'bg-blue-500',
      'BN': 'bg-green-500',
      'CR': 'bg-red-500'
    };
    return colors[initials] || 'bg-gray-500';
  };

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

  const filteredTasks = tasks.filter(task =>
    task.sopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.taskNo.includes(searchQuery)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Quick search any SOP by it's name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Priority Tasks Review */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-blue-100 px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Priority Tasks Review</h2>
          <button className="text-blue-600 hover:text-blue-800">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOP Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.taskNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {task.sopName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {task.assignedTo.map((initials, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAssigneeColor(initials)} transition-transform hover:scale-110`}
                          title={initials}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(task.status, task.type)}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {task.type === 'pending' || task.type === 'ongoing' ? (
                      <>
                        <button
                          onClick={() => handleTaskAction(task.id, 'approve')}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleTaskAction(task.id, 'reject')}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Summary */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="bg-blue-100 px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800">Your Work Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Pending Reviews</span>
              </div>
              <span className="font-semibold text-lg text-orange-600">{workSummary.pendingReviews}</span>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Approved This Week</span>
              </div>
              <span className="font-semibold text-lg text-green-600">{workSummary.approvedThisWeek}</span>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700">Rejected This Week</span>
              </div>
              <span className="font-semibold text-lg text-red-600">{workSummary.rejectedThisWeek}</span>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Deviation Raised</span>
              </div>
              <span className="font-semibold text-lg text-yellow-600">{workSummary.deviationRaised}</span>
            </div>
          </div>
        </div>

        {/* Task History & Traceability */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="bg-blue-100 px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800">Task History & Traceability</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Track Review History</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;