"use client";

import React, { useState } from 'react';
import { Plus, Eye, ArrowLeft, Clock, FileText, Image, Send } from 'lucide-react';

const TaskDetailsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Scheduled To Reviews');
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeviationForm, setShowDeviationForm] = useState(false);

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
      category: 'scheduled',
      details: {
        sopName: 'Machine Cleaning',
        stageNo: 1,
        taskNo: 1.1,
        operators: ['DR', 'JR', 'KP'],
        supervisor: 'BN',
        startDate: '01-06-2025',
        endDate: '01-06-2025',
        assignedEquipment: 'Mixer Unit 2',
        taskInstructions: 'Wipe each part with lint-free cloth to remove loose debris. Use mild detergent and brushes to clean surfaces and corners.',
        supervisorRemarks: 'Re-clean the parts and follow each SOP step carefully before marking the task as done.',
        qaRemarks: 'Re-clean the parts and follow each SOP step carefully before marking the task as done.',
        attachedImages: ['cleaning_process.jpg', 'before_after.jpg'],
        attachedDocuments: ['sop_cleaning_v2.pdf', 'safety_checklist.pdf']
      }
    },
    {
      id: 2,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.2',
      sopName: 'Machine Disassembly : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled',
      details: {
        sopName: 'Machine Disassembly',
        stageNo: 1,
        taskNo: 1.2,
        operators: ['PM', 'BN', 'DR', 'KP'],
        supervisor: 'BN',
        startDate: '01-06-2025',
        endDate: '01-06-2025',
        assignedEquipment: 'Assembly Line 3',
        taskInstructions: 'Carefully disassemble the machine components following the specified sequence. Label each part for easy reassembly.',
        supervisorRemarks: 'Ensure all safety protocols are followed during disassembly process.',
        qaRemarks: 'All components properly labeled and stored according to specifications.',
        attachedImages: ['disassembly_step1.jpg', 'components_labeled.jpg'],
        attachedDocuments: ['disassembly_guide.pdf', 'component_list.xlsx']
      }
    },
    {
      id: 3,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.3',
      sopName: 'Machine Disassembly : Model No. MACH001234',
      assignedTo: ['BN', 'JP', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled',
      details: {
        sopName: 'Machine Disassembly',
        stageNo: 1,
        taskNo: 1.3,
        operators: ['BN', 'JP', 'DR'],
        supervisor: 'PM',
        startDate: '01-06-2025',
        endDate: '01-06-2025',
        assignedEquipment: 'Mixer Unit 1',
        taskInstructions: 'Complete final inspection of disassembled components and prepare for cleaning stage.',
        supervisorRemarks: 'All components properly disassembled and ready for next stage.',
        qaRemarks: 'Quality check passed. Components ready for cleaning process.',
        attachedImages: ['final_inspection.jpg'],
        attachedDocuments: ['inspection_report.pdf']
      }
    },
    {
      id: 4,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.1',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled',
      details: {
        sopName: 'Machine Cleaning',
        stageNo: 2,
        taskNo: 2.1,
        operators: ['PM', 'BN', 'DR'],
        supervisor: 'JP',
        startDate: '02-06-2025',
        endDate: '02-06-2025',
        assignedEquipment: 'Cleaning Station A',
        taskInstructions: 'Deep clean all machine components using approved cleaning solutions and procedures.',
        supervisorRemarks: 'Cleaning completed to required standards.',
        qaRemarks: 'All components meet cleanliness specifications.',
        attachedImages: ['cleaning_process.jpg', 'clean_components.jpg'],
        attachedDocuments: ['cleaning_checklist.pdf']
      }
    },
    {
      id: 5,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.2',
      sopName: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: ['DR', 'JP', 'KP'],
      status: 'Completed',
      dueDate: '01-07-2025',
      category: 'scheduled',
      details: {
        sopName: 'Machine Cleaning',
        stageNo: 2,
        taskNo: 2.2,
        operators: ['DR', 'JP', 'KP'],
        supervisor: 'PM',
        startDate: '02-06-2025',
        endDate: '02-06-2025',
        assignedEquipment: 'Cleaning Station B',
        taskInstructions: 'Perform detailed cleaning of precision components with specialized tools.',
        supervisorRemarks: 'Precision cleaning completed successfully.',
        qaRemarks: 'Components meet precision cleaning standards.',
        attachedImages: ['precision_cleaning.jpg'],
        attachedDocuments: ['precision_cleaning_sop.pdf']
      }
    },
    {
      id: 11,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.4',
      sopName: 'Machine Testing : Model No. MACH001234',
      assignedTo: ['PM', 'BN'],
      status: 'In Progress',
      dueDate: '02-07-2025',
      category: 'ongoing',
      details: {
        sopName: 'Machine Testing',
        stageNo: 1,
        taskNo: 1.4,
        operators: ['PM', 'BN'],
        supervisor: 'DR',
        startDate: '01-07-2025',
        endDate: '02-07-2025',
        assignedEquipment: 'Test Bench 1',
        taskInstructions: 'Perform comprehensive testing of machine functionality and performance parameters.',
        supervisorRemarks: 'Testing in progress, preliminary results look good.',
        qaRemarks: 'Awaiting completion of testing phase.',
        attachedImages: ['test_setup.jpg'],
        attachedDocuments: ['test_protocol.pdf']
      }
    },
    {
      id: 12,
      stage: 'Stage - 2',
      taskNo: 'Task - 2.4',
      sopName: 'Quality Check : Model No. MACH001234',
      assignedTo: ['DR', 'KP'],
      status: 'Approved',
      dueDate: '28-06-2025',
      category: 'approved',
      details: {
        sopName: 'Quality Check',
        stageNo: 2,
        taskNo: 2.4,
        operators: ['DR', 'KP'],
        supervisor: 'JP',
        startDate: '27-06-2025',
        endDate: '28-06-2025',
        assignedEquipment: 'QC Station 1',
        taskInstructions: 'Conduct thorough quality inspection of all processed components.',
        supervisorRemarks: 'Quality check completed successfully, all parameters within specification.',
        qaRemarks: 'Approved for next stage. All quality standards met.',
        attachedImages: ['qc_results.jpg'],
        attachedDocuments: ['qc_report.pdf']
      }
    },
    {
      id: 13,
      stage: 'Stage - 1',
      taskNo: 'Task - 1.5',
      sopName: 'Machine Calibration : Model No. MACH001234',
      assignedTo: ['JP', 'BN'],
      status: 'Rejected',
      dueDate: '29-06-2025',
      category: 'rejected',
      details: {
        sopName: 'Machine Calibration',
        stageNo: 1,
        taskNo: 1.5,
        operators: ['JP', 'BN'],
        supervisor: 'PM',
        startDate: '28-06-2025',
        endDate: '29-06-2025',
        assignedEquipment: 'Calibration Unit 1',
        taskInstructions: 'Calibrate machine sensors and control systems according to specifications.',
        supervisorRemarks: 'Calibration parameters not within acceptable range, requires rework.',
        qaRemarks: 'Rejected due to calibration drift beyond tolerance limits. Requires recalibration.',
        attachedImages: ['calibration_results.jpg'],
        attachedDocuments: ['calibration_report.pdf']
      }
    }
  ];

  // Color mapping for assignee avatars
  const avatarColors = {
    'DR': 'bg-orange-400 text-white',
    'JP': 'bg-pink-400 text-white',
    'KP': 'bg-red-400 text-white',
    'PM': 'bg-blue-400 text-white',
    'BN': 'bg-green-400 text-white',
    'JR': 'bg-purple-400 text-white'
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

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleBackToList = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  const handleAddNew = () => {
    alert('Adding new task...');
  };

  const handleTaskAction = (action) => {
    if (action === 'Raise Deviation') {
      setShowDeviationForm(true);
    } else {
      alert(`${action} action performed for task ${selectedTask?.taskNo}`);
    }
  };

  const handleSubmitDeviation = (deviationData) => {
    // Here you would typically send the data to your backend
    console.log('Deviation submitted:', deviationData);
    alert('Deviation submitted successfully!');
    setShowDeviationForm(false);
  };

  const handleCloseDeviationForm = () => {
    setShowDeviationForm(false);
  };

  // Deviation Form Component
  const DeviationForm = ({ task, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      deviationName: '',
      description: '',
      qualityRisk: false,
      safetyRisk: false,
      minorRisk: false,
      majorRisk: false,
      correctiveActions: ''
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const deviationData = {
        ...formData,
        taskId: task.id,
        taskNo: task.taskNo,
        sopNo: task.details.sopName,
        detectedBy: 'Current User', // You might want to get this from auth context
        detectedDate: new Date().toLocaleString()
      };
      onSubmit(deviationData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Raise Deviation</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deviation Name</label>
                  <input
                    type="text"
                    name="deviationName"
                    value={formData.deviationName}
                    onChange={handleChange}
                    placeholder="Enter deviation name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SOP No.</label>
                    <input
                      type="text"
                      value={task.details.sopName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task No.</label>
                    <input
                      type="text"
                      value={task.taskNo}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detected By</label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-blue-400 text-white`}>
                      QA
                    </div>
                    <span>Quality Assurance</span>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time Detected</label>
                    <input
                      type="text"
                      value={new Date().toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description Of Deviation</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter detailed explanation of what went wrong"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact Assessment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="qualityRisk"
                        checked={formData.qualityRisk}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>Quality Risk</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="safetyRisk"
                        checked={formData.safetyRisk}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>Safety Risk</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="minorRisk"
                        checked={formData.minorRisk}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>Minor Risk</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="majorRisk"
                        checked={formData.majorRisk}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>Major Risk</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Corrective Actions</label>
                  <textarea
                    name="correctiveActions"
                    value={formData.correctiveActions}
                    onChange={handleChange}
                    placeholder="Enter what needs to be done to fix it"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Task Details Component
  const TaskDetailsView = ({ task }) => {
    const [timer, setTimer] = useState('01:00:00');
    
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                <span>Back to List</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-800">
                {task.details.sopName} : Model No. MACH001234
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock size={16} />
                <span className="font-mono text-sm">{timer}</span>
              </div>
              <div className="text-gray-400">•••</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Completed Tasks</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">SOP Name :</span>
                  <span className="font-medium">{task.details.sopName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stage No. :</span>
                  <span className="font-medium">{task.details.stageNo}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Task No. :</span>
                  <span className="font-medium">{task.details.taskNo}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Operator :</span>
                  <div className="flex space-x-1">
                    {task.details.operators.map((operator, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          avatarColors[operator] || 'bg-gray-400 text-white'
                        }`}
                      >
                        {operator}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Supervisor :</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    avatarColors[task.details.supervisor] || 'bg-gray-400 text-white'
                  }`}>
                    {task.details.supervisor}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Start Date :</span>
                  <span className="font-medium">{task.details.startDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">End Date :</span>
                  <span className="font-medium">{task.details.endDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status :</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Assigned Equipment :</span>
                  <span className="font-medium">{task.details.assignedEquipment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Task Instructions and Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Instructions Given To Supervisor & Operator</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700">{task.details.taskInstructions}</p>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Image size={16} />
                  <span>View Attached Image</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <FileText size={16} />
                  <span>View Attached Documents</span>
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Supervisor's Remarks</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{task.details.supervisorRemarks}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Quality Assurance Review Panel</h4>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Quality Assurance- QA's Remarks</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{task.details.qaRemarks}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleTaskAction('Approve')}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>✓</span>
                  <span>Approve Task</span>
                </button>
                <button
                  onClick={() => handleTaskAction('Reject')}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>✗</span>
                  <span>Reject Task</span>
                </button>
                <button
                  onClick={() => handleTaskAction('Raise Deviation')}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>⚠</span>
                  <span>Raise Deviation</span>
                </button>
                <button
                  onClick={() => handleTaskAction('Send Back To Rework')}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                  <span>Send Back To Rework</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Dashboard View
  const DashboardView = () => (
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
                      onClick={() => handleViewDetails(task)}
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

  return (
    <div>
      {showDeviationForm && selectedTask && (
        <DeviationForm
          task={selectedTask}
          onClose={handleCloseDeviationForm}
          onSubmit={handleSubmitDeviation}
        />
      )}
      {showTaskDetails && selectedTask ? (
        <TaskDetailsView task={selectedTask} />
      ) : (
        <DashboardView />
      )}
    </div>
  );
};

export default TaskDetailsDashboard;