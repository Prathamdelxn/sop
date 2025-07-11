"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Users, X, Search, Check } from 'lucide-react';

const TaskDashboard = () => {
  const [expandedStages, setExpandedStages] = useState({
    stage1: true,
    stage2: true,
    stage3: true
  });

  const [tasks, setTasks] = useState([
    {
      id: 'task-1-1',
      stage: 'stage1',
      name: 'Task 1.1 : Disassemble part 1',
      assigned: false
    },
    {
      id: 'task-1-2',
      stage: 'stage1',
      name: 'Task 1.1 : Disassemble part 2',
      assigned: false
    },
    {
      id: 'task-1-3',
      stage: 'stage1',
      name: 'Task 1.1 : Disassemble part 3',
      assigned: false
    },
    {
      id: 'task-2-1',
      stage: 'stage2',
      name: 'Task 2.1 : Clean part 1.',
      assigned: false
    },
    {
      id: 'task-2-2',
      stage: 'stage2',
      name: 'Task 2.1 : Clean part 2.',
      assigned: false
    },
    {
      id: 'task-2-3',
      stage: 'stage2',
      name: 'Task 2.1 : Clean part 3.',
      assigned: false
    },
    {
      id: 'task-3-1',
      stage: 'stage3',
      name: 'Task 2.1 : Assemble part 1.',
      assigned: false
    },
    {
      id: 'task-3-2',
      stage: 'stage3',
      name: 'Task 2.1 : Assemble part 2.',
      assigned: false
    },
    {
      id: 'task-3-3',
      stage: 'stage3',
      name: 'Task 2.1 : Assemble part 3.',
      assigned: false
    }
  ]);

  const [selectAllStages, setSelectAllStages] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Operator');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sendNotification, setSendNotification] = useState(false);
  
  // Track assigned operators for each stage
  const [stageAssignments, setStageAssignments] = useState({});
  const [assignedOperators, setAssignedOperators] = useState(new Set());

  const teamMembers = [
    { id: 1, name: 'Dilipbhai Tarsangbhai Rathod', empId: '0123456', initials: 'DR', color: 'bg-orange-400' },
    { id: 2, name: 'Jayeshkumar Kantibhai Patel', empId: '0123456', initials: 'JP', color: 'bg-pink-400' },
    { id: 3, name: 'Kailash Bajirao Patil', empId: '0123456', initials: 'KP', color: 'bg-red-400' },
    { id: 4, name: 'Prajapati Maulikumar Madhavlal', empId: '0123456', initials: 'PM', color: 'bg-green-400' },
    { id: 5, name: 'Dilipbhai Tarsangbhai Rathod', empId: '0123456', initials: 'DR', color: 'bg-blue-400' },
    { id: 6, name: 'Jayeshkumar Kantibhai Patel', empId: '0123456', initials: 'JP', color: 'bg-orange-400' },
    { id: 7, name: 'Kailash Bajirao Patil', empId: '0123456', initials: 'KP', color: 'bg-blue-400' }
  ];

  const stageInfo = {
    stage1: {
      title: 'Stage 1 : Disassembly of the Machine.',
      color: 'bg-blue-50 border-blue-200'
    },
    stage2: {
      title: 'Stage 2 : Cleaning the machine & Parts',
      color: 'bg-blue-50 border-blue-200'
    },
    stage3: {
      title: 'Stage 3 : Assemble the machine.',
      color: 'bg-blue-50 border-blue-200'
    }
  };

  const toggleStage = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, assigned: !task.assigned }
        : task
    ));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAllStages;
    setSelectAllStages(newSelectAll);
    
    setTasks(prev => prev.map(task => ({
      ...task,
      assigned: newSelectAll
    })));
  };

  const getStageStatus = (stageId) => {
    const stageTasks = tasks.filter(task => task.stage === stageId);
    const assignedTasks = stageTasks.filter(task => task.assigned);
    return assignedTasks.length === stageTasks.length && stageTasks.length > 0;
  };

  const toggleStageSelection = (stageId) => {
    const stageAssigned = getStageStatus(stageId);
    setTasks(prev => prev.map(task => 
      task.stage === stageId 
        ? { ...task, assigned: !stageAssigned }
        : task
    ));
  };

  const getAssignedCount = () => {
    return tasks.filter(task => task.assigned).length;
  };

  // Filter out already assigned operators
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !assignedOperators.has(member.id)
  );

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAssignTasks = () => {
    setShowAssignPopup(true);
  };

  const handleAssignToTeam = () => {
    // Add selected members to assigned operators
    const newAssignedOperators = new Set(assignedOperators);
    selectedMembers.forEach(memberId => {
      newAssignedOperators.add(memberId);
    });
    setAssignedOperators(newAssignedOperators);
    
    // Store stage assignments
    const assignedStages = Object.keys(stageInfo).filter(stageId => getStageStatus(stageId));
    const newStageAssignments = { ...stageAssignments };
    
    assignedStages.forEach(stageId => {
      if (!newStageAssignments[stageId]) {
        newStageAssignments[stageId] = [];
      }
      selectedMembers.forEach(memberId => {
        const member = teamMembers.find(m => m.id === memberId);
        if (member && !newStageAssignments[stageId].some(m => m.id === memberId)) {
          newStageAssignments[stageId].push(member);
        }
      });
    });
    
    setStageAssignments(newStageAssignments);
    
    console.log('Assigning tasks to:', selectedMembers);
    console.log('Role:', selectedRole);
    console.log('Send notification:', sendNotification);
    setShowAssignPopup(false);
    setSelectedMembers([]);
    setSendNotification(false);
  };

  const handleCancel = () => {
    setShowAssignPopup(false);
    setSelectedMembers([]);
    setSendNotification(false);
  };

  const handleAssignedButtonClick = (stageId) => {
    if (getStageStatus(stageId)) {
      setShowAssignPopup(true);
    }
  };

  const getStageOperators = (stageId) => {
    return stageAssignments[stageId] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAllStages}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Select all stages & associated tasks</span>
            </div>
          </div>
          
          <button 
            onClick={handleAssignTasks}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            <Users size={20} />
            <span>Assign {getAssignedCount()} Tasks</span>
          </button>
        </div>

        {/* Task Stages */}
        <div className="space-y-4">
          {Object.entries(stageInfo).map(([stageId, info]) => {
            const stageTasks = tasks.filter(task => task.stage === stageId);
            const isExpanded = expandedStages[stageId];
            const isStageAssigned = getStageStatus(stageId);
            const stageOperators = getStageOperators(stageId);

            return (
              <div key={stageId} className={`border rounded-lg ${info.color} shadow-sm hover:shadow-md transition-shadow`}>
                {/* Stage Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStage(stageId)}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    <input
                      type="checkbox"
                      checked={isStageAssigned}
                      onChange={() => toggleStageSelection(stageId)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    
                    <span className="font-medium text-gray-800">{info.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Operator indicator removed - no longer showing assigned operators */}
                    
                    {/* Status Badge */}
                    <button
                      onClick={() => handleAssignedButtonClick(stageId)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        isStageAssigned 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md cursor-pointer transform hover:scale-105' 
                          : 'bg-orange-100 text-orange-800 cursor-default'
                      }`}
                      disabled={!isStageAssigned}
                    >
                      {isStageAssigned ? 'Assigned' : 'Unassigned'}
                    </button>
                  </div>
                </div>

                {/* Stage Tasks */}
                {isExpanded && (
                  <div className="border-t border-blue-200 bg-white">
                    {stageTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.assigned}
                            onChange={() => toggleTask(task.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{task.name}</span>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          task.assigned 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {task.assigned ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Tasks: {tasks.length}</span>
            <div className="flex gap-4">
              <span className="text-green-600 font-medium">Assigned: {getAssignedCount()}</span>
              <span className="text-orange-600 font-medium">Unassigned: {tasks.length - getAssignedCount()}</span>
            </div>
          </div>
        </div>
      </div>

     
    {/* Assignment Popup */}
{showAssignPopup && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Assign Tasks to Roles</h2>
        <button 
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
      </div>

      {/* Role Selection */}
      <div className="p-2 border-b border-gray-100 ml-40">
        <div className="flex flex-wrap gap-2">
          {['Operator'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedRole === role
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedMembers.includes(member.id) ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
              onClick={() => toggleMemberSelection(member.id)}
            >
              <div className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center text-white font-medium text-sm shadow-sm`}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{member.empId}</p>
                <p className="font-medium text-gray-800 truncate">{member.name}</p>
              </div>
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                selectedMembers.includes(member.id) 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                {selectedMembers.includes(member.id) && (
                  <Check size={12} className="text-white" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            {assignedOperators.size > 0 && teamMembers.length === assignedOperators.size ? 
              'All operators have been assigned' : 
              'No team members found'
            }
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="notification"
            checked={sendNotification}
            onChange={(e) => setSendNotification(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="notification" className="text-sm text-gray-600">
            Send notification to selected members
          </label>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleAssignToTeam}
            disabled={selectedMembers.length === 0}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              selectedMembers.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Assign to {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ''}Team Member{selectedMembers.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TaskDashboard;