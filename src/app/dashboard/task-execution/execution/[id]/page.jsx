'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle, Users, Loader2 } from "lucide-react";

const TaskPage = () => {
  const params = useParams();
  const { id } = params;

  const [expandedStages, setExpandedStages] = useState({});
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskTimer, setTaskTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsedTime: 0
  });

  // Fetch assignment data using existing execution API and filter by ID
  useEffect(() => {
    if (!id) return;

    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("User not found. Please log in again.");
        }
        const userData = JSON.parse(storedUser);

        const res = await fetch(`/api/assignment/execution/${userData.companyId}/${userData.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const assignments = await res.json();
        console.log("All assignments:", assignments);

        // Find the specific assignment by ID
        const data = assignments.find(a => a._id === id);
        if (!data) {
          throw new Error("Assignment not found");
        }

        console.log("Matched assignment:", data);
        setAssignmentData(data);

        // Expand first stage by default
        if (data?.prototypeData?.stages?.length > 0) {
          setExpandedStages({ [data.prototypeData.stages[0]._id || data.prototypeData.stages[0].stageId]: true });
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (taskTimer.isRunning) {
      interval = setInterval(() => {
        setTaskTimer(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [taskTimer.isRunning]);

  const toggleStage = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleTaskClick = (stage, task, stageIndex) => {
    setSelectedTask({ ...task, stageName: stage.name || `Stage ${stageIndex + 1}`, stageIndex });
    // Reset timer when selecting a new task
    setTaskTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0
    });
  };

  const formatDuration = (duration) => {
    // Handle empty strings or falsy values from real API data
    if (!duration || duration === "") return "N/A";

    // If it's an object like { hours, minutes, seconds }
    if (typeof duration === 'object') {
      const { hours = 0, minutes = 0, seconds = 0 } = duration;
      let parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
      return parts.join(" ");
    }

    // If it's a number (minutes)
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      let parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (parts.length === 0) parts.push('0s');
      return parts.join(" ");
    }

    return "N/A";
  };

  const formatSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setTaskTimer({
      isRunning: true,
      startTime: Date.now() - (taskTimer.elapsedTime * 1000),
      elapsedTime: taskTimer.elapsedTime
    });
  };

  const handleStopTimer = () => {
    setTaskTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const handleSubmitTask = () => {
    alert(`Task completed in ${formatSeconds(taskTimer.elapsedTime)}`);
    setTaskTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress':
      case 'under execution':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assigned':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-gray-500">Loading task execution...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <XCircle className="w-8 h-8" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-500">No assignment data found.</span>
      </div>
    );
  }

  const { prototypeData, equipment } = assignmentData;
  const stages = prototypeData?.stages || [];

  return (
    <div className="w-full h-full p-2">
      <div className="h-full w-full rounded-b-2xl border border-gray-300 overflow-hidden relative">
        {/* Header */}
        <div className="h-[7%] w-full flex items-center border-b border-gray-300 justify-between px-4">
          {/* Title + Status + Equipment */}
          <div className="gap-4 flex items-center">
            <h1 className="text-lg font-semibold">{prototypeData?.name || 'Untitled SOP'}</h1>
            <span className={`py-1 px-2 text-sm capitalize rounded-2xl border ${getStatusColor(assignmentData.status)}`}>
              {assignmentData.status || 'Unknown'}
            </span>
            {equipment?.name && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                | <span className="font-medium text-gray-700">{equipment.name}</span>
                {equipment.model && <span className="text-gray-400">({equipment.model})</span>}
              </span>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="language" className="text-sm font-medium">
              Language:
            </label>
            <select
              id="language"
              className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="h-[93%] w-full flex">
          {/* Left Sidebar - Stages and Tasks */}
          <div className={`h-full ${sidebarExpanded ? 'w-1/4' : 'w-16'} border-r border-gray-300 transition-all duration-300 overflow-hidden relative`}>
            <div className="p-4 h-full overflow-y-auto">
              {sidebarExpanded ? (
                <>
                  <h2 className="font-bold text-lg mb-4">Stages</h2>
                  <div className="space-y-2">
                    {stages.map((stage, stageIndex) => {
                      const stageKey = stage._id || stage.stageId || `stage-${stageIndex}`;
                      const stageName = stage.name || `Stage ${stageIndex + 1}`;
                      return (
                        <div key={stageKey} className="rounded-md overflow-hidden">
                          <div
                            className="flex gap-4 items-center p-3 bg-gray-100 cursor-pointer"
                            onClick={() => toggleStage(stageKey)}
                          >
                            {expandedStages[stageKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            <span className="font-medium">{stageName}</span>
                            {stage.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${getStatusColor(stage.status)}`}>
                                {stage.status}
                              </span>
                            )}
                          </div>
                          {expandedStages[stageKey] && (
                            <div className="bg-white p-2">
                              {stage.tasks && stage.tasks.map((task, taskIndex) => {
                                const taskKey = task._id || task.taskId || `task-${stageIndex}-${taskIndex}`;
                                const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;
                                return (
                                  <div
                                    key={taskKey}
                                    className={`p-2 text-sm flex items-center gap-2 font-semibold hover:bg-blue-50 cursor-pointer ${selectedTask?._id === task._id || selectedTask?.taskId === task.taskId ? 'text-blue-500' : ''}`}
                                    onClick={() => handleTaskClick(stage, task, stageIndex)}
                                  >
                                    <div className={`w-2 h-6 rounded-sm ${selectedTask?._id === task._id || selectedTask?.taskId === task.taskId ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                    {taskNumber}: {task.title}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center pt-4">
                  {stages.map((stage, stageIndex) => {
                    const stageKey = stage._id || stage.stageId || `stage-${stageIndex}`;
                    return (
                      <div key={stageKey} className="mb-4 flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1 cursor-pointer"
                          onClick={() => toggleStage(stageKey)}
                          title={stage.name || `Stage ${stageIndex + 1}`}
                        >
                          {stageIndex + 1}
                        </div>
                        {expandedStages[stageKey] && (
                          <div className="mt-2 bg-white rounded-md p-2 shadow-md">
                            {stage.tasks && stage.tasks.map((task, taskIndex) => {
                              const taskKey = task._id || task.taskId || `task-${stageIndex}-${taskIndex}`;
                              const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;
                              return (
                                <div
                                  key={taskKey}
                                  className="p-1 text-xs text-center hover:bg-blue-50 cursor-pointer mb-1 last:mb-0"
                                  onClick={() => handleTaskClick(stage, task, stageIndex)}
                                >
                                  {taskNumber}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className="absolute bottom-4 left-4 bg-gray-200 p-1 rounded-md cursor-pointer"
              onClick={toggleSidebar}
            >
              {sidebarExpanded ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="h-full flex-1 flex flex-col">
            <div className="flex-1 w-full bg-gray-50 p-4 overflow-y-auto">
              {selectedTask ? (
                <div className="bg-white rounded-lg shadow p-6">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedTask.stageIndex + 1}.{(stages[selectedTask.stageIndex]?.tasks?.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)) || 0) + 1} {selectedTask.title}
                      </h2>
                      <p className="text-gray-600 mt-1">{selectedTask.stageName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Task Status Badge */}
                      {selectedTask.status && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(selectedTask.status)}`}>
                          {selectedTask.status}
                        </span>
                      )}
                      {/* Timer display */}
                      {taskTimer.elapsedTime > 0 && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                          <Clock size={16} className="text-gray-600" />
                          <span className="font-mono font-medium">{formatSeconds(taskTimer.elapsedTime)}</span>
                        </div>
                      )}
                      {/* Timer controls */}
                      {!taskTimer.isRunning ? (
                        taskTimer.elapsedTime === 0 ? (
                          <button
                            onClick={handleStartTimer}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Start
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleStartTimer}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                            >
                              Resume
                            </button>
                            <button
                              onClick={handleSubmitTask}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Submit
                            </button>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={handleStopTimer}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Stop
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedTask.description || 'No description provided.'}</p>
                  </div>

                  {/* Assigned Workers */}
                  {selectedTask.assignedWorker && selectedTask.assignedWorker.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={20} /> Assigned Workers
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.assignedWorker.map((worker, index) => (
                          <span
                            key={worker.id || index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                              {worker.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            {worker.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Min/Max Duration */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Clock size={16} /> Minimum Duration
                      </h4>
                      <p className="text-lg font-semibold">{formatDuration(selectedTask.minTime)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Clock size={16} /> Maximum Duration
                      </h4>
                      <p className="text-lg font-semibold">{formatDuration(selectedTask.maxTime)}</p>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  {selectedTask.galleryTitle && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{selectedTask.galleryTitle}</h3>
                      {selectedTask.galleryDescription && (
                        <p className="text-gray-600 mb-3">{selectedTask.galleryDescription}</p>
                      )}
                    </div>
                  )}

                  {/* Attached Images */}
                  {selectedTask.images && selectedTask.images.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Image size={20} /> Attached Images
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedTask.images.map((image, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            {image.url ? (
                              <img src={image.url} alt={image.name || `Image ${index + 1}`} className="h-32 w-full object-cover" />
                            ) : (
                              <div className="h-32 bg-gray-200 flex items-center justify-center">
                                <Image size={32} className="text-gray-400" />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm font-medium truncate">{image.name || `Image ${index + 1}`}</p>
                              {image.description && (
                                <p className="text-xs text-gray-500 truncate">{image.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtasks */}
                  {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Subtasks</h3>
                      <div className="space-y-3">
                        {selectedTask.subtasks.map((subtask, index) => (
                          <div key={subtask._id || index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                            <h4 className="font-medium">{subtask.title}</h4>
                            {subtask.description && (
                              <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                            )}
                            <div className="flex gap-4 mt-2">
                              <div className="text-xs">
                                <span className="text-gray-500">Min: </span>
                                {formatDuration(subtask.minTime)}
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Max: </span>
                                {formatDuration(subtask.maxTime)}
                              </div>
                            </div>
                            {/* Subtask assigned workers */}
                            {subtask.assignedWorker && subtask.assignedWorker.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {subtask.assignedWorker.map((worker, wIndex) => (
                                  <span key={worker.id || wIndex} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                    {worker.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Image size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Task Selected</h3>
                    <p>Select a task from the sidebar to view its details</p>
                  </div>
                </div>
              )}
            </div>
            <div className="h-1/12 w-full border-t border-gray-300 flex justify-between items-center px-4">
              <span className='h-full w-24 border-r border-gray-300 flex items-center justify-center text-gray-800 cursor-pointer'>
                <ArrowLeft className="text-gray-500" />
              </span>
              <span className="text-sm font-medium">Complete task</span>
              <span className='h-full w-24 border-l border-gray-300 flex items-center justify-center text-gray-800 cursor-pointer'>
                <ArrowRight className="text-gray-500" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;