'use client'
import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, User, Plus,
  UserPlus, X, ArrowRight, Search, Check,
  FileText, Calendar, Tag, Users, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SinglePrototypeManagement = () => {
  // Available operators list
  const [operators] = useState([
    { id: 1, name: "Dilipbhai Tarsangbhai Rathod", role: "Operator", avatar: "DR", color: "bg-gradient-to-r from-orange-500 to-amber-500", empId: "0123456" },
    { id: 2, name: "Jayeshkumar Kantibhai Patel", role: "Operator", avatar: "JP", color: "bg-gradient-to-r from-pink-500 to-rose-500", empId: "0123456" },
    { id: 3, name: "Kailash Bajirao Patil", role: "Operator", avatar: "KP", color: "bg-gradient-to-r from-red-500 to-pink-500", empId: "0123456" },
    { id: 4, name: "Prajapati Maulikumar Madhavlal", role: "Operator", avatar: "PM", color: "bg-gradient-to-r from-green-500 to-emerald-500", empId: "0123456" },
    { id: 5, name: "Dilipbhai Tarsangbhai Rathod", role: "Operator", avatar: "DR", color: "bg-gradient-to-r from-blue-500 to-cyan-500", empId: "0123456" },
    { id: 6, name: "Jayeshkumar Kantibhai Patel", role: "Operator", avatar: "JP", color: "bg-gradient-to-r from-orange-500 to-amber-500", empId: "0123456" },
    { id: 7, name: "Kailash Bajirao Patil", role: "Operator", avatar: "KP", color: "bg-gradient-to-r from-blue-500 to-cyan-500", empId: "0123456" }
  ]);

  // Single prototype with stages similar to the second code
  const [prototype] = useState({
    id: 1,
    name: "Machine Maintenance Prototype",
    description: "Complete machine disassembly, cleaning, and reassembly process",
    priority: "High",
    deadline: "2024-01-15",
    stages: [
      {
        id: 1,
        name: "Stage 1: Disassembly of the Machine",
        color: "bg-blue-50 border-blue-200",
        tasks: [
          { id: 1, title: "Task 1.1: Disassemble part 1", selected: false, assignedTo: null },
          { id: 2, title: "Task 1.2: Disassemble part 2", selected: false, assignedTo: null },
          { id: 3, title: "Task 1.3: Disassemble part 3", selected: false, assignedTo: null }
        ]
      },
      {
        id: 2,
        name: "Stage 2: Cleaning the machine & Parts",
        color: "bg-green-50 border-green-200",
        tasks: [
          { id: 4, title: "Task 2.1: Clean part 1", selected: false, assignedTo: null },
          { id: 5, title: "Task 2.2: Clean part 2", selected: false, assignedTo: null },
          { id: 6, title: "Task 2.3: Clean part 3", selected: false, assignedTo: null }
        ]
      },
      {
        id: 3,
        name: "Stage 3: Assemble the machine",
        color: "bg-purple-50 border-purple-200",
        tasks: [
          { id: 7, title: "Task 3.1: Assemble part 1", selected: false, assignedTo: null },
          { id: 8, title: "Task 3.2: Assemble part 2", selected: false, assignedTo: null },
          { id: 9, title: "Task 3.3: Assemble part 3", selected: false, assignedTo: null }
        ]
      }
    ]
  });

  const [stages, setStages] = useState(prototype.stages);
  const [expandedStages, setExpandedStages] = useState({ 1: false, 2: false, 3: false });
  const [showStages, setShowStages] = useState(false);
  const [selectAllStages, setSelectAllStages] = useState(false);
  const [newTaskInputs, setNewTaskInputs] = useState({});
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sendNotification, setSendNotification] = useState(false);
  const [stageAssignments, setStageAssignments] = useState({});
  const [assignedOperators, setAssignedOperators] = useState(new Set());

  const handlePrototypeToggle = () => {
    setShowStages(!showStages);
    if (!showStages) {
      // Expand all stages when showing stages
      setExpandedStages({ 1: true, 2: true, 3: true });
    }
  };

  const toggleStage = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const toggleTask = (stageId, taskId) => {
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? {
          ...stage,
          tasks: stage.tasks.map(task =>
            task.id === taskId
              ? { ...task, selected: !task.selected }
              : task
          )
        }
        : stage
    ));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAllStages;
    setSelectAllStages(newSelectAll);

    setStages(prev => prev.map(stage => ({
      ...stage,
      tasks: stage.tasks.map(task => ({
        ...task,
        selected: newSelectAll
      }))
    })));
  };

  const getStageSelectionStatus = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return false;
    const selectedTasks = stage.tasks.filter(task => task.selected);
    return selectedTasks.length === stage.tasks.length && stage.tasks.length > 0;
  };

  const toggleStageSelection = (stageId) => {
    const stageSelected = getStageSelectionStatus(stageId);
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? {
          ...stage,
          tasks: stage.tasks.map(task => ({
            ...task,
            selected: !stageSelected
          }))
        }
        : stage
    ));
  };

  const getSelectedCount = () => {
    return stages.reduce((count, stage) =>
      count + stage.tasks.filter(task => task.selected).length, 0
    );
  };

  const getAssignedCount = () => {
    return stages.reduce((count, stage) =>
      count + stage.tasks.filter(task => task.assignedTo !== null).length, 0
    );
  };

  const getTotalTasks = () => {
    return stages.reduce((count, stage) => count + stage.tasks.length, 0);
  };

  const addTask = (stageId) => {
    const taskTitle = newTaskInputs[stageId];
    if (!taskTitle?.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      selected: false,
      assignedTo: null
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: [...stage.tasks, newTask] }
        : stage
    ));

    setNewTaskInputs(prev => ({
      ...prev,
      [stageId]: ''
    }));
  };

  const openAssignModal = () => {
    setAssignModalOpen(true);
  };

  const getOperatorById = (operatorId) => {
    return operators.find(op => op.id === operatorId);
  };

  const filteredMembers = operators.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !assignedOperators.has(member.id)
  );

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAssignToTeam = () => {
    if (selectedMembers.length === 0) return;

    // Get all selected tasks
    const selectedTasks = [];
    stages.forEach(stage => {
      stage.tasks.forEach(task => {
        if (task.selected) {
          selectedTasks.push({ stageId: stage.id, taskId: task.id });
        }
      });
    });

    // Assign selected operators to selected tasks
    setStages(prev => prev.map(stage => ({
      ...stage,
      tasks: stage.tasks.map(task => {
        if (task.selected) {
          // Assign the first selected operator to this task
          const assignedOperator = operators.find(op => op.id === selectedMembers[0]);
          return {
            ...task,
            assignedTo: assignedOperator,
            selected: false // Unselect after assignment
          };
        }
        return task;
      })
    })));

    // Add selected members to assigned operators
    const newAssignedOperators = new Set(assignedOperators);
    selectedMembers.forEach(memberId => {
      newAssignedOperators.add(memberId);
    });
    setAssignedOperators(newAssignedOperators);

    // Store stage assignments
    const assignedStages = stages.filter(stage => getStageSelectionStatus(stage.id));
    const newStageAssignments = { ...stageAssignments };

    assignedStages.forEach(stage => {
      if (!newStageAssignments[stage.id]) {
        newStageAssignments[stage.id] = [];
      }
      selectedMembers.forEach(memberId => {
        const member = operators.find(m => m.id === memberId);
        if (member && !newStageAssignments[stage.id].some(m => m.id === memberId)) {
          newStageAssignments[stage.id].push(member);
        }
      });
    });

    setStageAssignments(newStageAssignments);
    setAssignModalOpen(false);
    setSelectedMembers([]);
    setSendNotification(false);
    setSelectAllStages(false);
  };

  const handleCancel = () => {
    setAssignModalOpen(false);
    setSelectedMembers([]);
    setSendNotification(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2"
                  >
                    Prototype Management
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-slate-600 text-sm"
                  >
                    Track and manage your development progress with real-time insights
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative w-full lg:w-64"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg">
                    <input
                      type="text"
                      placeholder="Search prototypes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 placeholder-slate-500 text-sm"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs font-medium">Total Tasks</p>
                  <p className="text-xl font-bold text-slate-900">{getTotalTasks()}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs font-medium">Assigned Tasks</p>
                  <p className="text-xl font-bold text-green-600">{getAssignedCount()}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs font-medium">Unassigned Tasks</p>
                  <p className="text-xl font-bold text-orange-600">{getTotalTasks() - getAssignedCount()}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prototype Card - Now with ChevronDown/ChevronUp */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300/50 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrototypeToggle}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-all duration-300"
                    >
                      {showStages ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.button>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                    >
                      {prototype.name}
                    </motion.h1>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-slate-600 text-sm mb-3 group-hover:text-slate-700 transition-colors duration-300 ml-13"
                  >
                    {prototype.description}
                  </motion.p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                      <Calendar className="h-3 w-3 ml-11" />
                      <span className="text-xs font-medium">Due: {prototype.deadline}</span>
                    </div>
                    <div className="flex items-center text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                      <Tag className="h-3 w-3 mr-2" />
                      <span className="text-xs font-medium">Priority: {prototype.priority}</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>

          {/* Stages Section - Only show when prototype is clicked */}
          <AnimatePresence>
            {showStages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Control Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2  ml-10">
                      <input
                        type="checkbox"
                        checked={selectAllStages}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 text-sm">Select all stages & associated tasks</span>
                    </div>
                  </div>

                  <button
                    onClick={openAssignModal}
                    disabled={getSelectedCount() === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 text-sm ${
                      getSelectedCount() > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Users size={16} />
                    <span>Assign {getSelectedCount()} Tasks</span>
                  </button>
                </motion.div>

                {/* Stages List */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {stages.map((stage, index) => {
                    const isExpanded = expandedStages[stage.id];
                    const isStageSelected = getStageSelectionStatus(stage.id);

                    return (
                      <motion.div
                        key={stage.id}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        className="group"
                      >
                        <div className={`border rounded-lg ${stage.color} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                          {/* Stage Header */}
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleStage(stage.id)}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-white/50"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>

                              <input
                                type="checkbox"
                                checked={isStageSelected}
                                onChange={() => toggleStageSelection(stage.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />

                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                                  <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900">{stage.name}</h3>
                                  <p className="text-slate-600 text-sm">
                                    {stage.tasks.filter(t => t.assignedTo !== null).length}/{stage.tasks.length} tasks assigned
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  stage.tasks.filter(t => t.assignedTo !== null).length === stage.tasks.length && stage.tasks.length > 0
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md cursor-pointer transform hover:scale-105'
                                    : 'bg-orange-100 text-orange-800 cursor-default'
                                }`}
                              >
                                {stage.tasks.filter(t => t.assignedTo !== null).length === stage.tasks.length && stage.tasks.length > 0 ? 'Assigned' : 'Unassigned'}
                              </button>
                            </div>
                          </div>

                          {/* Stage Tasks */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="border-t border-white/30 bg-white/50"
                              >
                                <div className="p-4">
                                  <div className="space-y-2">
                                    {stage.tasks.map((task, taskIndex) => (
                                      <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                                        whileHover={{ x: 3 }}
                                        className="flex items-center justify-between p-3 border border-white/30 rounded-lg hover:bg-white/80 transition-all duration-300"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <input
                                            type="checkbox"
                                            checked={task.selected}
                                            onChange={() => toggleTask(stage.id, task.id)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                          />
                                          <div className="flex-1">
                                            <span className="text-gray-700 font-medium text-sm">{task.title}</span>
                                            {task.assignedTo && (
                                              <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-6 h-6 ${task.assignedTo.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                                  {task.assignedTo.avatar}
                                                </div>
                                                {/* <span className="text-xs text-gray-600">{task.assignedTo.name}</span> */}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                          task.assignedTo
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }`}>
                                          {task.assignedTo ? 'Assigned' : 'Unassigned'}
                                        </span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {assignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/20 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="text-lg font-bold text-slate-900">Assign Tasks to Operators</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-white/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search operators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-white/70 backdrop-blur-xl"
                  />
                </div>
              </div>

              {/* Operators List */}
              <div className="flex-1 overflow-y-auto">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 hover:bg-white/60 cursor-pointer transition-all duration-300 ${selectedMembers.includes(member.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <div className={`w-12 h-12 ${member.color} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 truncate">{member.empId}</p>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{member.name}</h4>
                        <p className="text-slate-600 text-xs">{member.role}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedMembers.includes(member.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}>
                        {selectedMembers.includes(member.id) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {assignedOperators.size > 0 && operators.length === assignedOperators.size ?
                      'All operators have been assigned' :
                      'No operators found'
                    }
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="notification"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="notification" className="text-sm text-gray-600">
                    Send notification to selected operators
                  </label>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-white/60 transition-all duration-300 font-medium text-sm bg-white/40 backdrop-blur-xl shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAssignToTeam}
                    disabled={selectedMembers.length === 0}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${selectedMembers.length > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Assign to {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ''}Operator{selectedMembers.length !== 1 ? 's' : ''}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SinglePrototypeManagement;