"use client";

import React, { useState } from 'react';
import { Search, Plus, Eye, Check, X, Calendar, Users, FileText, TrendingUp, ChevronDown, ChevronRight, Play } from 'lucide-react';

const SupervisorDashboard = () => {
  const [prototypes, setPrototypes] = useState([
    {
      id: 1,
      name: 'Mobile App Prototype',
      description: 'iOS/Android mobile application with AI-powered features',
      date: '2023-12-15',
      expanded: false,
      stages: [
        {
          id: 1,
          stageNo: '1',
          stageName: 'Design Phase',
          assignedTo: ['JS'],
          assignedToFull: [{ initials: 'JS', name: 'John Smith', color: 'bg-gradient-to-r from-purple-500 to-purple-600' }],
          status: 'Completed',
          dueDate: '01-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 2,
          stageNo: '2',
          stageName: 'Development Phase',
          assignedTo: ['SJ'],
          assignedToFull: [{ initials: 'SJ', name: 'Sarah Johnson', color: 'bg-gradient-to-r from-blue-500 to-blue-600' }],
          status: 'Completed',
          dueDate: '15-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 3,
          stageNo: '3',
          stageName: 'Testing Phase',
          assignedTo: ['MK'],
          assignedToFull: [{ initials: 'MK', name: 'Mike Kumar', color: 'bg-gradient-to-r from-orange-500 to-orange-600' }],
          status: 'Completed',
          dueDate: '25-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 4,
          stageNo: '4',
          stageName: 'QA Review',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-pink-500 to-pink-600' }],
          status: 'Pending',
          dueDate: '30-07-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        },
        {
          id: 5,
          stageNo: '5',
          stageName: 'Deployment',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' }],
          status: 'Pending',
          dueDate: '05-08-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        }
      ]
    },
    {
      id: 2,
      name: 'Web Dashboard Prototype',
      description: 'React-based administrative dashboard with real-time analytics',
      date: '2024-01-20',
      expanded: false,
      stages: [
        {
          id: 6,
          stageNo: '1',
          stageName: 'UI/UX Design',
          assignedTo: ['DM'],
          assignedToFull: [{ initials: 'DM', name: 'David Martinez', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' }],
          status: 'Completed',
          dueDate: '10-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 7,
          stageNo: '2',
          stageName: 'Frontend Development',
          assignedTo: ['EP'],
          assignedToFull: [{ initials: 'EP', name: 'Emma Parker', color: 'bg-gradient-to-r from-cyan-500 to-cyan-600' }],
          status: 'Completed',
          dueDate: '20-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 8,
          stageNo: '3',
          stageName: 'Backend Integration',
          assignedTo: ['TC'],
          assignedToFull: [{ initials: 'TC', name: 'Tom Chen', color: 'bg-gradient-to-r from-red-500 to-red-600' }],
          status: 'Completed',
          dueDate: '28-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 9,
          stageNo: '4',
          stageName: 'Performance Testing',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' }],
          status: 'Pending',
          dueDate: '02-08-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        },
        {
          id: 10,
          stageNo: '5',
          stageName: 'Security Audit',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-gray-500 to-gray-600' }],
          status: 'Pending',
          dueDate: '08-08-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        }
      ]
    },
    {
      id: 3,
      name: 'AI Chatbot Prototype',
      description: 'Intelligent customer service chatbot with NLP capabilities',
      date: '2024-02-05',
      expanded: false,
      stages: [
        {
          id: 11,
          stageNo: '1',
          stageName: 'Model Training',
          assignedTo: ['LB'],
          assignedToFull: [{ initials: 'LB', name: 'Lisa Brown', color: 'bg-gradient-to-r from-violet-500 to-violet-600' }],
          status: 'Completed',
          dueDate: '15-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 12,
          stageNo: '2',
          stageName: 'API Development',
          assignedTo: ['JG'],
          assignedToFull: [{ initials: 'JG', name: 'James Garcia', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' }],
          status: 'Completed',
          dueDate: '18-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 13,
          stageNo: '3',
          stageName: 'Frontend Integration',
          assignedTo: ['MW'],
          assignedToFull: [{ initials: 'MW', name: 'Maria Wilson', color: 'bg-gradient-to-r from-teal-500 to-teal-600' }],
          status: 'Completed',
          dueDate: '22-07-2025',
          statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
        },
        {
          id: 14,
          stageNo: '4',
          stageName: 'Conversation Testing',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-lime-500 to-lime-600' }],
          status: 'Pending',
          dueDate: '25-07-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        },
        {
          id: 15,
          stageNo: '5',
          stageName: 'Performance Optimization',
          assignedTo: ['DS'],
          assignedToFull: [{ initials: 'DS', name: 'Deepa Sharma', color: 'bg-gradient-to-r from-amber-500 to-amber-600' }],
          status: 'Pending',
          dueDate: '30-07-2025',
          statusColor: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState(null);
  const [workSummary, setWorkSummary] = useState({
    pendingReviews: 12,
    approvedThisWeek: 24,
    rejectedThisWeek: 3,
    deviationRaised: 2
  });

  const togglePrototype = (prototypeId) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId
        ? { ...prototype, expanded: !prototype.expanded }
        : prototype
    ));
  };

  const handleStart = (stageId) => {
    setPrototypes(prototypes.map(prototype => ({
      ...prototype,
      stages: prototype.stages.map(stage =>
        stage.id === stageId
          ? { ...stage, status: 'In Progress', statusColor: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' }
          : stage
      )
    })));
  };

  const handleApprove = (stageId) => {
    setPrototypes(prototypes.map(prototype => ({
      ...prototype,
      stages: prototype.stages.map(stage =>
        stage.id === stageId
          ? { ...stage, status: 'Approved', statusColor: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' }
          : stage
      )
    })));
    setWorkSummary(prev => ({
      ...prev,
      approvedThisWeek: prev.approvedThisWeek + 1,
      pendingReviews: prev.pendingReviews - 1
    }));
  };

  const handleReject = (stageId) => {
    setPrototypes(prototypes.map(prototype => ({
      ...prototype,
      stages: prototype.stages.map(stage =>
        stage.id === stageId
          ? { ...stage, status: 'Rejected', statusColor: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300' }
          : stage
      )
    })));
    setWorkSummary(prev => ({
      ...prev,
      rejectedThisWeek: prev.rejectedThisWeek + 1,
      pendingReviews: prev.pendingReviews - 1
    }));
  };

  const getAllStages = () => {
    return prototypes.flatMap(prototype => prototype.stages);
  };

  const filteredStages = getAllStages().filter(stage =>
    stage.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.stageNo.includes(searchTerm)
  );

  const StageDetailsModal = ({ stage, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stage Details
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span className="text-xs font-medium text-gray-700">Stage</span>
            <span className="text-md font-bold text-blue-600">{stage.stageNo}</span>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <span className="text-xs font-medium text-gray-700 block mb-1">Name</span>
            <span className="text-sm font-semibold text-purple-700">{stage.stageName}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <span className="text-xs font-medium text-gray-700 block mb-2">Assigned To</span>
            <div className="flex gap-2">
              {stage.assignedToFull.map(assignee => (
                <div key={assignee.initials} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                  <div className={`w-7 h-7 rounded-full ${assignee.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {assignee.initials}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{assignee.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3">
            <span className="text-xs font-medium text-gray-700">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${stage.statusColor}`}>
              {stage.status}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-xs font-medium text-gray-700">Due Date</span>
            <span className="text-xs font-semibold text-gray-700">{stage.dueDate}</span>
          </div>
          {stage.status === 'Pending' && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleApprove(stage.id);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-xs"
              >
                <Check size={14} />
                Approve
              </button>
              <button
                onClick={() => {
                  handleReject(stage.id);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-xs"
              >
                <X size={14} />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Supervisor Dashboard
          </h1>
          <p className="text-gray-600 text-sm">Manage and monitor your project prototypes</p>
        </div> */}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Quick search any stage by name or number..."
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Prototypes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Prototypes</h2>
          </div>

          <div className="space-y-4">
            {prototypes.map((prototype) => (
              <div key={prototype.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Prototype Header */}
                <div
                  className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 transition-all duration-300 border-b border-gray-100"
                  onClick={() => togglePrototype(prototype.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-gray-800 mb-1">{prototype.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">{prototype.description}</p>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{prototype.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-md font-bold text-gray-800">{prototype.stages.length} Stages</p>
                      <p className="text-xs text-gray-500">
                        {prototype.stages.filter(s => s.status === 'Completed').length} Completed
                      </p>
                    </div>
                    <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-all duration-200 group">
                      {prototype.expanded ? 
                        <ChevronDown size={20} className="text-gray-600 group-hover:text-gray-800" /> : 
                        <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-800" />
                      }
                    </button>
                  </div>
                </div>

                {/* Prototype Stages */}
                {prototype.expanded && (
                  <div className="border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stage</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {prototype.stages.map((stage, index) => (
                            <tr key={stage.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-gray-900">
                                {stage.stageNo}
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                                {stage.stageName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  {stage.assignedToFull.map(assignee => (
                                    <div key={assignee.initials} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-200">
                                      <div className={`w-8 h-8 rounded-full ${assignee.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                        {assignee.initials}
                                      </div>
                                      <span className="text-xs font-semibold text-gray-700 hidden md:block">{assignee.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${stage.statusColor} shadow-sm`}>
                                  {stage.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-600">
                                {stage.dueDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                                <div className="flex gap-1">
                                  {stage.status === 'Completed' && (
                                    <>
                                      <button
                                        onClick={() => handleApprove(stage.id)}
                                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-md text-xs hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1 font-semibold shadow-sm hover:shadow-md"
                                      >
                                        <Check size={12} />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleReject(stage.id)}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-md text-xs hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-1 font-semibold shadow-sm hover:shadow-md"
                                      >
                                        <X size={12} />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setSelectedStage(stage)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-md text-xs hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1 font-semibold shadow-sm hover:shadow-md"
                                  >
                                    <Eye size={12} />
                                    View
                                  </button>
                                  {stage.status === "Pending" && (
                                    <button
                                      onClick={() => handleStart(stage.id)}
                                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-md text-xs hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-1 font-semibold shadow-sm hover:shadow-md"
                                    >
                                      <Play size={12} />
                                      Start
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stage Details Modal */}
      {selectedStage && (
        <StageDetailsModal
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </div>
  );
};

export default SupervisorDashboard;