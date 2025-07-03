"use client";

import { useState } from "react";
import { Plus, Minus, X, Trash2, Clock, Save } from "lucide-react";

// Time Setting Modal Component
function TimeSettingModal({ isOpen, onClose, onSave, initialMinTime, initialMaxTime }) {
  const [minTime, setMinTime] = useState(initialMinTime || { hours: 0, minutes: 10, seconds: 0 });
  const [maxTime, setMaxTime] = useState(initialMaxTime || { hours: 0, minutes: 30, seconds: 0 });

  const adjustTime = (type, field, increment) => {
    const setter = type === 'min' ? setMinTime : setMaxTime;
    const current = type === 'min' ? minTime : maxTime;
    
    setter(prev => {
      let newValue = prev[field] + increment;
      
      // Handle overflow/underflow for minutes and seconds
      if (field === 'minutes' || field === 'seconds') {
        if (newValue >= 60) {
          newValue = 0;
        } else if (newValue < 0) {
          newValue = 59;
        }
      } else if (field === 'hours' && newValue < 0) {
        newValue = 0;
      }
      
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleSave = () => {
    onSave({ minTime, maxTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[380px] shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Set Task Duration</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Minimum Time */}
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Minimum Duration
            </h3>
            <div className="flex gap-2 justify-center">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="flex items-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-2 shadow-sm">
                    <button 
                      onClick={() => adjustTime('min', field, -1)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="mx-2 text-md font-bold min-w-[40px] text-center text-gray-800">
                      {String(minTime[field]).padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => adjustTime('min', field, 1)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                    {field.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Maximum Time */}
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Maximum Duration
            </h3>
            <div className="flex gap-2 justify-center">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="flex items-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-2 shadow-sm">
                    <button 
                      onClick={() => adjustTime('max', field, -1)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="mx-2 text-md font-bold min-w-[40px] text-center text-gray-800">
                      {String(maxTime[field]).padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => adjustTime('max', field, 1)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                    {field.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Supervisor Page Component
export default function SupervisorPage() {
  const [stages, setStages] = useState([
    { id: 1, name: "Machine Disassembly" }
  ]);
  const [tasks, setTasks] = useState({
    1: [
      {
        id: "1.1",
        title: "Machine Disassembly",
        description: "Wipe each part with lint-free cloth to remove loose debris. Use mild detergent and brushes to clean surfaces and corners.",
        minTime: { hours: 0, minutes: 10, seconds: 0 },
        maxTime: { hours: 0, minutes: 30, seconds: 0 },
        subtasks: [
          {
            id: "1.1.1",
            title: "Machine Disassembly Part 1",
            description: "Wipe each part with lint-free cloth to remove loose debris. Use mild detergent and brushes to clean surfaces and corners.",
            minTime: { hours: 0, minutes: 5, seconds: 0 },
            maxTime: { hours: 0, minutes: 15, seconds: 0 }
          }
        ]
      }
    ]
  });
  const [selectedStage, setSelectedStage] = useState(1);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const addNewStage = () => {
    const newStageId = stages.length > 0 ? Math.max(...stages.map(s => s.id)) + 1 : 1;
    const newStage = {
      id: newStageId,
      name: `Stage ${newStageId}`
    };
    setStages([...stages, newStage]);
    
    // Add empty task array for new stage
    setTasks(prev => ({
      ...prev,
      [newStageId]: []
    }));
  };

  const deleteStage = (stageId) => {
    if (stages.length <= 1) return; // Don't delete the last stage
    
    setStages(stages.filter(stage => stage.id !== stageId));
    
    // Remove tasks for deleted stage
    const newTasks = {...tasks};
    delete newTasks[stageId];
    setTasks(newTasks);
    
    // If deleted stage was selected, select another stage
    if (selectedStage === stageId) {
      setSelectedStage(stages.find(stage => stage.id !== stageId).id);
    }
  };

  const updateStageName = (stageId, newName) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, name: newName } : stage
    ));
  };

  const addTask = (stageId) => {
    const stageTasks = tasks[stageId] || [];
    const newTaskId = `${stageId}.${stageTasks.length + 1}`;
    const newTask = {
      id: newTaskId,
      title: `Task ${stageTasks.length + 1}`,
      description: "Describe the task details here...",
      minTime: { hours: 0, minutes: 10, seconds: 0 },
      maxTime: { hours: 0, minutes: 30, seconds: 0 },
      subtasks: []
    };
    
    setTasks(prev => ({
      ...prev,
      [stageId]: [...stageTasks, newTask]
    }));
  };

  const addSubTask = (stageId, taskId) => {
    setTasks(prev => {
      const stageTasks = prev[stageId];
      const updatedTasks = stageTasks.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: `${taskId}.${task.subtasks.length + 1}`,
            title: `${task.title} Part ${task.subtasks.length + 1}`,
            description: task.description,
            minTime: { hours: 0, minutes: 5, seconds: 0 },
            maxTime: { hours: 0, minutes: 15, seconds: 0 }
          };
          return {
            ...task,
            subtasks: [...task.subtasks, newSubtask]
          };
        }
        return task;
      });
      
      return {
        ...prev,
        [stageId]: updatedTasks
      };
    });
  };

  const handleSetTimeForTask = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTimeModalOpen(true);
  };

  const handleSaveTime = (timeData) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      // Search through all stages and tasks to find the matching task ID
      for (const stageId in updatedTasks) {
        const stageTasks = updatedTasks[stageId];
        
        // Check main tasks
        const taskIndex = stageTasks.findIndex(task => task.id === selectedTaskId);
        if (taskIndex !== -1) {
          updatedTasks[stageId][taskIndex] = {
            ...updatedTasks[stageId][taskIndex],
            minTime: timeData.minTime,
            maxTime: timeData.maxTime
          };
          return updatedTasks;
        }
        
        // Check subtasks
        for (let i = 0; i < stageTasks.length; i++) {
          const subtaskIndex = stageTasks[i].subtasks.findIndex(subtask => subtask.id === selectedTaskId);
          if (subtaskIndex !== -1) {
            updatedTasks[stageId][i].subtasks[subtaskIndex] = {
              ...updatedTasks[stageId][i].subtasks[subtaskIndex],
              minTime: timeData.minTime,
              maxTime: timeData.maxTime
            };
            return updatedTasks;
          }
        }
      }
      
      return updatedTasks;
    });
    
    setIsTimeModalOpen(false);
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "Not set";
    const { hours, minutes, seconds } = time;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  const confirmDeleteTask = (stageId, taskId) => {
    setDeletingTaskId(taskId);
  };

  const cancelDeleteTask = () => {
    setDeletingTaskId(null);
  };

  const deleteTask = (stageId, taskId) => {
    setTasks(prev => {
      const stageTasks = prev[stageId];
      
      // Check if it's a subtask (contains two dots in ID)
      if (taskId.split('.').length > 2) {
        const parentTaskId = taskId.split('.').slice(0, 2).join('.');
        const updatedTasks = stageTasks.map(task => {
          if (task.id === parentTaskId) {
            return {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== taskId)
            };
          }
          return task;
        });
        return {
          ...prev,
          [stageId]: updatedTasks
        };
      } else {
        // It's a main task
        return {
          ...prev,
          [stageId]: stageTasks.filter(task => task.id !== taskId)
        };
      }
    });
    setDeletingTaskId(null);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Machine Cleaning</h1>
              <p className="text-gray-600 font-medium">Model No. MACH001234</p>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full text-sm font-semibold border border-red-200">
              Unassigned
            </span>
          </div>
          <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Tasks Created
          </button>
        </div>

        <div className="flex gap-8">
          {/* Left Panel - Stages */}
          <div className="w-80 space-y-4">
            {stages.map((stage) => (
              <div 
                key={stage.id} 
                className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 ${selectedStage === stage.id ? 'border-blue-500' : 'border-blue-200'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                onClick={() => setSelectedStage(stage.id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-blue-800 text-lg">Stage {stage.id}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteTask(stage.id, `stage-${stage.id}`);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100 active:bg-red-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">Stage Name</label>
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateStageName(stage.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full p-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all font-medium"
                    placeholder="Enter stage name..."
                  />
                </div>

                {/* Delete confirmation for stage */}
                {deletingTaskId === `stage-${stage.id}` && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-2">Delete this stage and all its tasks?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStage(stage.id);
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700 active:scale-95"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelDeleteTask();
                        }}
                        className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button 
              onClick={addNewStage}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-3 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
            >
              <Plus className="w-6 h-6" />
              Add New Stage
            </button>
          </div>

          {/* Right Panel - Tasks */}
          <div className="flex-1 space-y-6">
            {tasks[selectedStage]?.length > 0 ? (
              tasks[selectedStage].map((task) => (
                <div key={task.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Task {task.id}: {task.title}</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleSetTimeForTask(task.id)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <Clock className="w-5 h-5" />
                        Set Duration
                      </button>
                      <button 
                        onClick={() => confirmDeleteTask(selectedStage, task.id)}
                        className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete confirmation for main task */}
                  {deletingTaskId === task.id && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 mb-2">Delete this task and all its subtasks?</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => deleteTask(selectedStage, task.id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700 active:scale-95"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={cancelDeleteTask}
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-semibold text-gray-700">Task Description</label>
                      <div className="text-sm font-medium text-gray-600">
                        <span className="text-green-600">Min: {formatTimeDisplay(task.minTime)}</span>
                        <span className="mx-2">|</span>
                        <span className="text-blue-600">Max: {formatTimeDisplay(task.maxTime)}</span>
                      </div>
                    </div>
                    <textarea
                      value={task.description}
                      readOnly
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 resize-none font-medium text-gray-700 shadow-sm"
                      rows="3"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Break Down Task into Sub-Tasks</p>
                    <div className="flex gap-3 mb-6">
                      <button 
                        onClick={() => addSubTask(selectedStage, task.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Sub-Task
                      </button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-800 text-lg">Task {subtask.id}: {subtask.title}</h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSetTimeForTask(subtask.id)}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-md hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1"
                          >
                            <Clock className="w-4 h-4" />
                            Time
                          </button>
                          <button 
                            onClick={() => confirmDeleteTask(selectedStage, subtask.id)}
                            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Delete confirmation for subtask */}
                      {deletingTaskId === subtask.id && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-700 mb-2">Delete this subtask?</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => deleteTask(selectedStage, subtask.id)}
                              className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 active:scale-95"
                            >
                              Delete
                            </button>
                            <button 
                              onClick={cancelDeleteTask}
                              className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100 active:scale-95"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-semibold text-gray-700">Task Description</label>
                          <div className="text-xs font-medium text-gray-600">
                            <span className="text-green-600">Min: {formatTimeDisplay(subtask.minTime)}</span>
                            <span className="mx-1">|</span>
                            <span className="text-blue-600">Max: {formatTimeDisplay(subtask.maxTime)}</span>
                          </div>
                        </div>
                        <textarea
                          value={subtask.description}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white resize-none font-medium text-gray-700 shadow-sm text-sm"
                          rows="2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 mb-6">No tasks created for this stage yet</p>
                <button 
                  onClick={() => addTask(selectedStage)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Task
                </button>
              </div>
            )}

            {tasks[selectedStage]?.length > 0 && (
              <button 
                onClick={() => addTask(selectedStage)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-3 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
              >
                <Plus className="w-6 h-6" />
                Add New Task to Stage {selectedStage}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Time Setting Modal */}
      {isTimeModalOpen && (
        <TimeSettingModal 
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          onSave={handleSaveTime}
          initialMinTime={
            selectedTaskId?.split('.').length > 2 
              ? tasks[selectedTaskId.split('.')[0]][parseInt(selectedTaskId.split('.')[1]) - 1]?.subtasks
                  .find(sub => sub.id === selectedTaskId)?.minTime
              : tasks[selectedTaskId?.split('.')[0]]?.[parseInt(selectedTaskId?.split('.')[1]) - 1]?.minTime
          }
          initialMaxTime={
            selectedTaskId?.split('.').length > 2 
              ? tasks[selectedTaskId.split('.')[0]][parseInt(selectedTaskId.split('.')[1]) - 1]?.subtasks
                  .find(sub => sub.id === selectedTaskId)?.maxTime
              : tasks[selectedTaskId?.split('.')[0]]?.[parseInt(selectedTaskId?.split('.')[1]) - 1]?.maxTime
          }
        />
      )}
    </>
  );
}