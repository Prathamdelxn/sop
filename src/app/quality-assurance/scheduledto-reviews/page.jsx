"use client";

import React, { useState } from 'react';
import { Plus, Eye } from 'lucide-react';

const ScheduledDashboard = () => {
  const [activeTab, setActiveTab] = useState('Scheduled To Reviews');

  // Sample data for tasks
  const tasks = [
    {
      id: 1,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.1',
      sopName: 'Machine Disassembly : Model No. MACH001234',
      assignedTo: ['DR', 'JR', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 2,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.2',
      sopName: 'Machine Disassembly : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 3,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.3',
      sopName: 'Machine Disassembly : Model No. MACH001234',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 4,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.1',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 5,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.2',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['DR', 'JP', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 6,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.3',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 7,
      stage: 'Stage - 3',
      taskNo: 'Task - 3.1',
      sopName: 'Machine Assembly : Model No. MACH001234',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 8,
      stage: 'Stage - 3',
      taskNo: 'Task - 3.2',
      sopName: 'Machine Assembly : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 9,
      stage: 'Stage - 3',
      taskNo: 'Task - 3.3',
      sopName: 'Machine Assembly : Model No. MACH001234',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    {
      id: 10,
      stage: 'Stage - 4',
      taskNo: 'Task - 4.1',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['DR', 'JP', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled'
    },
    // Sample data for other tabs
    {
      id: 11,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.4',
      sopName: 'Machine Testing : Model No. MACH001234',
      assignedTo: ['PM', 'BN'],
      status: 'In Progress',
      dueDate: '02-07-2025',
      category: 'ongoing'
    },
    {
      id: 12,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.4',
      sopName: 'Quality Check : Model No. MACH001234',
      assignedTo: ['DR', 'KP'],
      status: 'Approved',
      dueDate: '28-06-2025',
      category: 'approved'
    },
    {
      id: 13,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.5',
      sopName: 'Machine Calibration : Model No. MACH001234',
      assignedTo: ['JP', 'BN'],
      status: 'Rejected',
      dueDate: '29-06-2025',
      category: 'rejected'
    }
  ];

  // Color mapping for assignee avatars
  const avatarColors = {
    'DR': 'bg-orange-400 text-white',
    'JP': 'bg-pink-400 text-white',
    'KP': 'bg-red-400 text-white',
    'PM': 'bg-blue-400 text-white',
    'BN': 'bg-green-400 text-white'
  };

  const statusColors = {
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800'
  };

  const tabs = [
    { id: 'Scheduled To Reviews', label: 'Scheduled To Reviews', category: 'scheduled' },
    { id: 'Ongoing Tasks', label: 'Ongoing Tasks', category: 'ongoing' },
    { id: 'Approved Tasks', label: 'Approved Tasks', category: 'approved' },
    { id: 'Rejected Tasks', label: 'Rejected Tasks', category: 'rejected' }
  ];

  const getFilteredTasks = () => {
    const activeCategory = tabs.find(tab => tab.id === activeTab)?.category;
    return tasks.filter(task => task.category === activeCategory);
  };

  const handleViewDetails = (taskId) => {
    alert(`Viewing details for task ID: ${taskId}`);
  };

  const handleAddNew = () => {
    alert('Adding new task...');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Scheduled For You To Review
          </h2>
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  Stage & Task No.
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  SOP Name
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  Assigned To
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  Due Date
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredTasks().map((task, index) => (
                <tr
                  key={task.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-6 border-b border-gray-100">
                    <div className="text-sm text-gray-900">
                      {task.stage} | {task.taskNo}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {task.sopName}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    <div className="flex space-x-1">
                      {task.assignedTo.map((person, idx) => (
                        <div
                          key={idx}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            avatarColors[person] || 'bg-gray-400 text-white'
                          }`}
                        >
                          {person}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[task.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    <div className="text-sm text-gray-900">{task.dueDate}</div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    <button
                      onClick={() => handleViewDetails(task.id)}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {getFilteredTasks().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tasks found</div>
            <div className="text-gray-400 text-sm mt-2">
              There are no tasks in this category yet.
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const count = tasks.filter(task => task.category === tab.category).length;
          return (
            <div
              key={tab.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{tab.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduledDashboard;