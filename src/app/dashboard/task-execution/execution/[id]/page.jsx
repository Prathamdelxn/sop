

'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle, Users, Loader2, AlertCircle, Play } from "lucide-react";

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
  const [userdata, setUserData] = useState();
  const [subtaskTimers, setSubtaskTimers] = useState({}); // { subtaskId: { isRunning, startTime, elapsedTime } }
  const [activeValidationItem, setActiveValidationItem] = useState(null); // { type: 'main'|'sub', item: selectedTask|subtask }

  // Modal states
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState(null); // 'min' or 'max'
  const [reasonText, setReasonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Warning modal for addStop dependency
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [dependencyMessage, setDependencyMessage] = useState('');

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
        setUserData(userData);
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
          setExpandedStages(prev => {
            if (Object.keys(prev).length === 0) {
              return { [data.prototypeData.stages[0]._id || data.prototypeData.stages[0].stageId]: true };
            }
            return prev;
          });
        }

        // Sync selected task if it exists
        if (selectedTask) {
          let found = false;
          data.prototypeData.stages.forEach((stage, stageIdx) => {
            const task = stage.tasks.find(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
            if (task) {
              setSelectedTask({ ...task, stageName: stage.name || `Stage ${stageIdx + 1}`, stageIndex: stageIdx });
              found = true;
            }
          });
          if (!found) setSelectedTask(null);
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
    const runningSubtaskIds = Object.keys(subtaskTimers).filter(id => subtaskTimers[id]?.isRunning);

    if (taskTimer.isRunning || runningSubtaskIds.length > 0) {
      interval = setInterval(() => {
        // Update main task timer
        if (taskTimer.isRunning) {
          setTaskTimer(prev => ({
            ...prev,
            elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
          }));
        }

        // Update subtask timers
        if (runningSubtaskIds.length > 0) {
          setSubtaskTimers(prev => {
            const next = { ...prev };
            runningSubtaskIds.forEach(id => {
              if (next[id]?.isRunning) {
                next[id] = {
                  ...next[id],
                  elapsedTime: Math.floor((Date.now() - next[id].startTime) / 1000)
                };
              }
            });
            return next;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [taskTimer.isRunning, JSON.stringify(Object.keys(subtaskTimers).filter(id => subtaskTimers[id]?.isRunning))]);

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
    // Check if task is under execution by current user to resume timer
    const currentUserId = userdata?.id || userdata?._id || JSON.parse(localStorage.getItem("user"))?.id || JSON.parse(localStorage.getItem("user"))?._id;

    if (task.status === 'Under Execution' && (task.startedBy?.id || task.startedBy?._id) === currentUserId) {
      const startTime = new Date(task.startedAt).getTime();
      setTaskTimer({
        isRunning: true,
        startTime: startTime,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
      });
    } else {
      // Reset timer when selecting a new task
      setTaskTimer({
        isRunning: false,
        startTime: null,
        elapsedTime: 0
      });
    }

    // Initialize subtask timers if they are under execution by current user
    const newSubtaskTimers = {};
    if (task.subtasks) {
      task.subtasks.forEach(st => {
        if (st.status === 'Under Execution' && (st.startedBy?.id || st.startedBy?._id) === currentUserId) {
          const startTime = new Date(st.startedAt).getTime();
          newSubtaskTimers[st._id || st.taskId] = {
            isRunning: true,
            startTime: startTime,
            elapsedTime: Math.floor((Date.now() - startTime) / 1000)
          };
        }
      });
    }
    setSubtaskTimers(newSubtaskTimers);

    setSelectedTask({ ...task, stageName: stage.name || `Stage ${stageIndex + 1}`, stageIndex });
  };

  const checkPreviousTaskStatus = (currentStage, currentTask, stageIndex) => {
    if (!currentStage || !currentStage.tasks) return true;

    // Find the current task index in the stage
    const taskIndex = currentStage.tasks.findIndex(t =>
      (t._id || t.taskId) === (currentTask._id || currentTask.taskId)
    );

    console.log("Current task index:", taskIndex);
    console.log("Current stage tasks:", currentStage.tasks);

    // If it's the first task in the stage or task not found, no previous task to check
    if (taskIndex <= 0) return true;

    // Get the previous task
    const previousTask = currentStage.tasks[taskIndex - 1];
    console.log("Previous task:", previousTask);
    console.log("Previous task status:", previousTask?.status);

    // Check if previous task status is completed
    return previousTask?.status === 'completed';
  };

  const handleStartTimerClick = async () => {
    if (!selectedTask) return;

    console.log("Selected task:", selectedTask);
    console.log("AddStop value:", selectedTask.addStop);

    // Find the current stage
    const currentStage = stages[selectedTask.stageIndex];
    console.log("Current stage:", currentStage);

    // Check if task has addStop: true
    if (selectedTask.addStop === true) {
      // Check if previous task is completed
      const isPreviousCompleted = checkPreviousTaskStatus(currentStage, selectedTask, selectedTask.stageIndex);
      console.log("Is previous completed:", isPreviousCompleted);

      if (!isPreviousCompleted) {
        // Find the previous task name for the message
        const taskIndex = currentStage.tasks.findIndex(t =>
          (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)
        );
        const previousTask = taskIndex > 0 ? currentStage.tasks[taskIndex - 1] : null;

        setDependencyMessage(
          previousTask
            ? `Cannot start "${selectedTask.title}" until "${previousTask.title}" is completed.`
            : `Cannot start this task until the previous task is completed.`
        );
        setShowDependencyModal(true);
        return;
      }
    }

    // Call backend to mark task as started
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/assignment/task-execution/start', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: id,
          stageId: currentStage._id || currentStage.stageId,
          taskId: selectedTask._id || selectedTask.taskId,
          startedBy: { id: userdata.id || userdata._id, name: userdata.name }
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to start task");
      }

      // Update local state to reflect "Under Execution"
      const updatedStages = [...stages];
      const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t =>
        (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)
      );

      if (taskIndex !== -1) {
        updatedStages[selectedTask.stageIndex].tasks[taskIndex] = {
          ...updatedStages[selectedTask.stageIndex].tasks[taskIndex],
          status: 'Under Execution',
          startedBy: { id: userdata.id || userdata._id, name: userdata.name },
          startedAt: new Date().toISOString()
        };

        setAssignmentData({
          ...assignmentData,
          prototypeData: {
            ...assignmentData.prototypeData,
            stages: updatedStages
          }
        });

        setSelectedTask(prev => ({
          ...prev,
          status: 'Under Execution',
          startedBy: { id: userdata.id, name: userdata.name },
          startedAt: new Date().toISOString()
        }));
      }

      // If no dependency issue, start the timer
      startTimer();
    } catch (err) {
      console.error("Error starting task:", err);
      alert(err.message || "Failed to start task. It might be already in progress.");

      // Optionally refresh data if out of sync
      // window.location.reload(); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTimer = () => {
    setTaskTimer({
      isRunning: true,
      startTime: Date.now(),
      elapsedTime: 0
    });
  };

  const formatDuration = (duration) => {
    if (!duration || duration === "") return "N/A";

    // Handle HH:MM:SS string format
    if (typeof duration === "string" && duration.includes(":")) {
      const parts = duration.split(":").map(Number);
      const [hours = 0, minutes = 0, seconds = 0] = parts;

      let result = [];
      if (hours > 0) result.push(`${hours}h`);
      if (minutes > 0) result.push(`${minutes}m`);
      if (seconds > 0 || result.length === 0) result.push(`${seconds}s`);

      return result.join(" ");
    }

    // Handle object format
    if (typeof duration === "object") {
      const { hours = 0, minutes = 0, seconds = 0 } = duration;
      let parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
      return parts.join(" ");
    }

    // Handle number (minutes)
    if (typeof duration === "number") {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      let parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (parts.length === 0) parts.push("0s");
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

  const convertToSeconds = (duration) => {
    if (!duration || duration === "N/A" || duration === "") return null;

    if (typeof duration === "string" && duration.includes(":")) {
      const parts = duration.split(":").map(Number);
      const [hours = 0, minutes = 0, seconds = 0] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }

    if (typeof duration === "object") {
      const { hours = 0, minutes = 0, seconds = 0 } = duration;
      return hours * 3600 + minutes * 60 + seconds;
    }

    if (typeof duration === "number") {
      return duration * 60; // Assuming number is in minutes
    }

    return null;
  };

  const handleStopTimer = () => {
    setTaskTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const handleStartSubtaskTimer = async (subtask) => {
    const subtaskId = subtask._id || subtask.taskId;
    const currentStage = stages[selectedTask.stageIndex];

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/assignment/task-execution/start', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: id,
          stageId: currentStage._id || currentStage.stageId,
          taskId: selectedTask._id || selectedTask.taskId,
          subtaskId: subtaskId,
          startedBy: { id: userdata.id || userdata._id, name: userdata.name }
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to start subtask");
      }

      // Update local state
      const updatedStages = [...stages];
      const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t =>
        (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)
      );

      if (taskIndex !== -1) {
        const subtaskIndex = updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks.findIndex(st =>
          (st._id || st.taskId) === subtaskId
        );

        if (subtaskIndex !== -1) {
          const startInfo = {
            status: 'Under Execution',
            startedBy: { id: userdata.id || userdata._id, name: userdata.name },
            startedAt: new Date().toISOString()
          };

          updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex] = {
            ...updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex],
            ...startInfo
          };

          setAssignmentData({
            ...assignmentData,
            prototypeData: {
              ...assignmentData.prototypeData,
              stages: updatedStages
            }
          });

          // Also update selected task's subtask list
          const updatedSubtasks = [...selectedTask.subtasks];
          updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            ...startInfo
          };
          setSelectedTask({
            ...selectedTask,
            subtasks: updatedSubtasks
          });
        }
      }

      setSubtaskTimers(prev => ({
        ...prev,
        [subtaskId]: {
          isRunning: true,
          startTime: Date.now(),
          elapsedTime: 0
        }
      }));
    } catch (err) {
      console.error("Error starting subtask:", err);
      alert(err.message || "Failed to start subtask.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopSubtaskTimer = (subtask) => {
    const subtaskId = subtask._id || subtask.taskId;
    setSubtaskTimers(prev => ({
      ...prev,
      [subtaskId]: {
        ...prev[subtaskId],
        isRunning: false
      }
    }));
  };

  const handleSubmitSubtask = (subtask) => {
    const subtaskId = subtask._id || subtask.taskId;
    const timer = subtaskTimers[subtaskId];
    if (!timer) return;

    const minSeconds = convertToSeconds(subtask?.minTime);
    const maxSeconds = convertToSeconds(subtask?.maxTime);

    setActiveValidationItem({ type: 'sub', item: subtask, timer });

    if (minSeconds !== null && timer.elapsedTime < minSeconds) {
      setReasonType('min');
      setShowReasonModal(true);
    } else if (maxSeconds !== null && timer.elapsedTime > maxSeconds) {
      setReasonType('max');
      setShowReasonModal(true);
    } else {
      completeTaskSubmission(subtask);
    }
  };

  const handleSubmitTask = () => {
    // Check if task has min/max time constraints
    const minSeconds = convertToSeconds(selectedTask?.minTime);
    const maxSeconds = convertToSeconds(selectedTask?.maxTime);

    setActiveValidationItem({ type: 'main', item: selectedTask, timer: taskTimer });

    // If both min and max are N/A or not provided, submit directly
    if (minSeconds === null && maxSeconds === null) {
      completeTaskSubmission();
      return;
    }

    // Check time violations only if values exist
    if (minSeconds !== null && taskTimer.elapsedTime < minSeconds) {
      // Time is less than minimum - show reason modal
      setReasonType('min');
      setShowReasonModal(true);
    } else if (maxSeconds !== null && taskTimer.elapsedTime > maxSeconds) {
      // Time exceeds maximum - show reason modal
      setReasonType('max');
      setShowReasonModal(true);
    } else {
      // Time is within range or only one constraint exists and is satisfied
      completeTaskSubmission();
    }
  };

  const completeTaskSubmission = async (subtask = null) => {
    // Determine which item we are submitting
    const isSubtask = !!subtask;
    const item = isSubtask ? subtask : selectedTask;
    const subtaskId = isSubtask ? (subtask._id || subtask.taskId) : null;
    const timer = isSubtask ? subtaskTimers[subtaskId] : taskTimer;

    if (showReasonModal && !reasonText.trim()) {
      alert("Please provide a reason before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        completedBy: { id: userdata.id || userdata._id, name: userdata.name },
        completedAt: new Date().toISOString(),
        actualDuration: formatSeconds(timer.elapsedTime),
        elapsedTime: timer.elapsedTime,
        reason: reasonType ? { type: reasonType, text: reasonText } : null,
        status: 'completed',
        minTime: item.minTime,
        maxTime: item.maxTime
      };

      const stage = stages[selectedTask.stageIndex];
      const stageId = stage?._id || stage?.stageId;
      const taskId = selectedTask._id || selectedTask.taskId;

      const res = await fetch('/api/assignment/task-execution/complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: id,
          stageId,
          taskId,
          subtaskId,
          executionData: submissionData
        })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to submit task");
      }

      alert(`${isSubtask ? 'Subtask' : 'Task'} completed successfully!`);

      // Update the local state
      if (assignmentData && assignmentData.prototypeData && selectedTask) {
        const updatedStages = [...stages];
        const stageIndex = selectedTask.stageIndex;
        const taskIndex = updatedStages[stageIndex].tasks.findIndex(t =>
          (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)
        );

        if (taskIndex !== -1) {
          if (isSubtask) {
            // Update subtask in local state
            const subtaskIndex = updatedStages[stageIndex].tasks[taskIndex].subtasks.findIndex(st =>
              (st._id || st.taskId) === subtaskId
            );
            if (subtaskIndex !== -1) {
              updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex] = {
                ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex],
                status: 'completed',
                ...submissionData
              };
            }
          } else {
            // Update main task in local state
            updatedStages[stageIndex].tasks[taskIndex] = {
              ...updatedStages[stageIndex].tasks[taskIndex],
              status: 'completed',
              ...submissionData
            };
          }

          setAssignmentData({
            ...assignmentData,
            prototypeData: {
              ...assignmentData.prototypeData,
              stages: updatedStages
            }
          });

          // Also update selectedTask if it's the one we're viewing
          if (isSubtask) {
            const updatedSubtasks = [...selectedTask.subtasks];
            const subIndex = updatedSubtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
            if (subIndex !== -1) {
              updatedSubtasks[subIndex] = {
                ...updatedSubtasks[subIndex],
                status: 'completed',
                ...submissionData
              };
              setSelectedTask({
                ...selectedTask,
                subtasks: updatedSubtasks
              });
            }
          } else {
            setSelectedTask({
              ...selectedTask,
              status: 'completed',
              ...submissionData
            });
          }
        }
      }

      // Reset states
      if (isSubtask) {
        setSubtaskTimers(prev => {
          const next = { ...prev };
          delete next[subtaskId];
          return next;
        });
      } else {
        setTaskTimer({
          isRunning: false,
          startTime: null,
          elapsedTime: 0
        });
      }
      setShowReasonModal(false);
      setReasonText('');
      setReasonType(null);
      setActiveValidationItem(null);

    } catch (error) {
      console.error(`Error submitting ${isSubtask ? 'subtask' : 'task'}:`, error);
      alert(error.message || `Failed to submit ${isSubtask ? 'subtask' : 'task'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReasonSubmit = () => {
    if (!reasonText.trim()) {
      alert("Please provide a reason. A reason is mandatory for early or late completions.");
      return;
    }
    completeTaskSubmission(activeValidationItem?.type === 'sub' ? activeValidationItem.item : null);
  };

  const handleReasonCancel = () => {
    setShowReasonModal(false);
    setReasonText('');
    setReasonType(null);
    setActiveValidationItem(null);
  };

  const handleDependencyConfirm = () => {
    setShowDependencyModal(false);
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
            {equipment?.name && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                | <span className="font-medium text-gray-700 capitalize">{equipment.name}</span>
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
                          </div>
                          {expandedStages[stageKey] && (
                            <div className="bg-white p-2">
                              {stage.tasks && stage.tasks.map((task, taskIndex) => {
                                const taskKey = task._id || task.taskId || `task-${stageIndex}-${taskIndex}`;
                                const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;
                                const isCompleted = task.status === 'completed';
                                const isSelected = selectedTask?._id === task._id || selectedTask?.taskId === task.taskId;

                                return (
                                  <div
                                    key={taskKey}
                                    className={`p-2 text-sm flex items-center gap-2 font-semibold hover:bg-blue-50 cursor-pointer ${isSelected ? 'text-blue-500' : ''
                                      } ${isCompleted ? (task.reason ? 'text-red-600' : 'text-green-600') : ''}`}
                                    onClick={() => handleTaskClick(stage, task, stageIndex)}
                                  >
                                    <div className={`w-2 h-6 rounded-sm ${isSelected
                                      ? 'bg-blue-500'
                                      : isCompleted
                                        ? (task.reason ? 'bg-red-500' : 'bg-green-500')
                                        : 'bg-gray-300'
                                      }`}></div>
                                    <span className="flex-1">{taskNumber}: {task.title}</span>
                                    {isCompleted && (
                                      task.reason ? <AlertCircle size={14} className="text-red-500" /> : <CheckCircle size={14} className="text-green-500" />
                                    )}
                                    {task.addStop && !isCompleted && (
                                      <AlertCircle size={14} className="text-amber-500" />
                                    )}
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
                              const isCompleted = task.status === 'completed';
                              return (
                                <div
                                  key={taskKey}
                                  className={`p-1 text-xs text-center hover:bg-blue-50 cursor-pointer mb-1 last:mb-0 ${isCompleted ? 'text-green-600' : ''}`}
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
                      {selectedTask.status === 'completed' && (
                        <span className={`inline-flex items-center gap-1 mt-2 text-xs ${selectedTask.reason ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-md`}>
                          {selectedTask.reason ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                          {selectedTask.reason ? 'Completed with Exception' : 'Completed'}
                        </span>
                      )}
                      {selectedTask.addStop && selectedTask.status !== 'completed' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
                          <AlertCircle size={12} />
                          Requires previous task completion
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">

                      {/* Timer controls - UPDATED with locking logic */}
                      {userdata && selectedTask.assignedWorker &&
                        selectedTask.assignedWorker.some(worker => (worker.id || worker._id) === (userdata.id || userdata._id)) ? (
                        // User is assigned
                        selectedTask.status === 'completed' ? (
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                            <CheckCircle size={16} className="text-green-600" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-green-600 font-medium">Completed in</span>
                              <span className="font-mono font-semibold text-green-700">
                                {selectedTask.actualDuration || formatSeconds(selectedTask.elapsedTime) || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ) : selectedTask.status === 'Under Execution' && (selectedTask.startedBy?.id || selectedTask.startedBy?._id) !== (userdata.id || userdata._id) ? (
                          // Task is being executed by someone else
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                              <Loader2 size={16} className="text-blue-600 animate-spin" />
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-blue-600 font-medium">Under Execution by</span>
                                <span className="font-semibold text-blue-700">{selectedTask.startedBy?.name}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-500 italic">Self-start disabled</span>
                          </div>
                        ) : !taskTimer.isRunning ? (
                          taskTimer.elapsedTime === 0 ? (
                            <button
                              onClick={handleStartTimerClick}
                              disabled={isSubmitting}
                              className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                              Start
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitTask}
                              disabled={isSubmitting}
                              className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                              Submit
                            </button>
                          )
                        ) : (
                          <button
                            onClick={handleStopTimer}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <XCircle size={16} />
                            Stop
                          </button>
                        )
                      ) : (
                        // User is not assigned
                        selectedTask.status === 'completed' ? (
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                            <CheckCircle size={16} className="text-green-600" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-green-600 font-medium">Completed in</span>
                              <span className="font-mono font-semibold text-green-700">
                                {selectedTask.actualDuration || formatSeconds(selectedTask.elapsedTime) || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ) : selectedTask.status === 'Under Execution' ? (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                            <Loader2 size={16} className="text-blue-600 animate-spin" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-blue-600 font-medium">Under Execution by</span>
                              <span className="font-semibold text-blue-700">{selectedTask.startedBy?.name || 'Worker'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic px-3 py-2 bg-gray-100 rounded-md">
                            View Only
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedTask.description || 'No description provided.'}</p>
                  </div>

                  {/* COMPLETION INFO - Ultra compact */}
                  {selectedTask.status === 'completed' && selectedTask.completedBy && (
                    <div className="mb-4 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                      <CheckCircle size={14} className="inline mr-1" />
                      Completed by <span className="font-semibold">{selectedTask.completedBy.name || selectedTask.completedBy.id}</span> • {new Date(selectedTask.completedAt).toLocaleString()}
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
                        {selectedTask.subtasks.map((subtask, index) => {
                          const subtaskId = subtask._id || subtask.taskId;
                          const timer = subtaskTimers[subtaskId];
                          const isCompleted = subtask.status === 'completed';
                          const isAssigned = userdata && subtask.assignedWorker &&
                            subtask.assignedWorker.some(worker => (worker.id || worker._id) === (userdata.id || userdata._id));

                          return (
                            <div key={subtaskId || index} className={`border-l-4 ${isCompleted ? 'border-green-500 bg-green-50/30' : 'border-blue-500 bg-gray-50'} pl-4 py-3 rounded-r relative shadow-sm`}>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-800">{subtask.title}</h4>
                                    {isCompleted && (
                                      <span className={`text-[10px] ${subtask.reason ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5`}>
                                        {subtask.reason ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                                        {subtask.reason ? 'Done (Reason)' : 'Done'}
                                      </span>
                                    )}
                                  </div>
                                  {subtask.description && (
                                    <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                                  )}

                                  {isCompleted && subtask.completedBy && (
                                    <div className="mt-2 text-[10px] text-green-700 font-medium flex items-center gap-1">
                                      <CheckCircle size={10} />
                                      <span>
                                        Completed by <span className="font-bold">{subtask.completedBy.name || subtask.completedBy.id}</span>
                                        {subtask.completedAt && ` • ${new Date(subtask.completedAt).toLocaleString()}`}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>Min: {formatDuration(subtask.minTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>Max: {formatDuration(subtask.maxTime)}</span>
                                    </div>
                                  </div>

                                  {/* Subtask assigned workers */}
                                  {subtask.assignedWorker && subtask.assignedWorker.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {subtask.assignedWorker.map((worker, wIndex) => (
                                        <span key={(worker.id || worker._id) || wIndex} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-red-600 border border-blue-100 shadow-sm flex items-center gap-1">
                                          <Users size={10} /> {worker.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Subtask Controls */}
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  {isCompleted ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-[10px] text-green-600 font-medium">Completed in</span>
                                      <span className="font-mono font-bold text-green-700 text-sm">
                                        {subtask.actualDuration || formatSeconds(subtask.elapsedTime) || 'N/A'}
                                      </span>
                                    </div>
                                  ) : subtask.status === 'Under Execution' && (subtask.startedBy?.id || subtask.startedBy?._id) !== (userdata.id || userdata._id) ? (
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                        <Loader2 size={12} className="text-blue-600 animate-spin" />
                                        <div className="flex flex-col items-start">
                                          <span className="text-[8px] text-blue-600 font-medium">Executing by</span>
                                          <span className="text-[10px] font-bold text-blue-700">{subtask.startedBy?.name || 'Other'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (userdata && subtask.assignedWorker && subtask.assignedWorker.some(worker => (worker.id || worker._id) === (userdata.id || userdata._id))) ? (
                                    <div className="flex flex-col items-end gap-2">
                                      {timer?.isRunning ? (
                                        <div className="flex flex-col items-end gap-1">
                                          <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono font-bold animate-pulse text-sm">
                                            <Loader2 size={12} className="animate-spin" />
                                            {formatSeconds(timer.elapsedTime)}
                                          </div>
                                          <button
                                            onClick={() => handleStopSubtaskTimer(subtask)}
                                            className="text-[11px] bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition-colors"
                                          >
                                            Stop
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-end gap-1">
                                          {(timer?.elapsedTime || 0) > 0 && (
                                            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                                              {formatSeconds(timer.elapsedTime)}
                                            </span>
                                          )}
                                          <button
                                            onClick={() => (timer?.elapsedTime || 0) === 0 ? handleStartSubtaskTimer(subtask) : handleSubmitSubtask(subtask)}
                                            disabled={isSubmitting}
                                            className={`text-[11px] ${(timer?.elapsedTime || 0) === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1.5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          >
                                            {(timer?.elapsedTime || 0) === 0 ? (
                                              isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <><Clock size={12} /> Start</>
                                            ) : (
                                              isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <><CheckCircle size={12} /> Submit</>
                                            )}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ) : subtask.status === 'Under Execution' ? (
                                    <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                      <Loader2 size={12} className="text-blue-600 animate-spin" />
                                      <div className="flex flex-col items-start">
                                        <span className="text-[8px] text-blue-600 font-medium">Executing by</span>
                                        <span className="text-[10px] font-bold text-blue-700">{subtask.startedBy?.name || 'Other'}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 italic bg-gray-100 px-2 py-1 rounded">
                                      View Only
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
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

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm shadow-xl pl-64 border-2 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className={`w-6 h-6 ${reasonType === 'min' ? 'text-yellow-500' : 'text-red-500'}`} />
              <h3 className="text-lg font-semibold">
                {reasonType === 'min' ? 'Task Completed Too Quickly' : 'Task Exceeded Time Limit'}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              {reasonType === 'min'
                ? `The ${activeValidationItem?.type === 'sub' ? 'subtask' : 'task'} "${activeValidationItem?.item?.title}" was completed in ${formatSeconds(activeValidationItem?.timer?.elapsedTime)} which is less than the minimum required time of ${formatDuration(activeValidationItem?.item?.minTime)}. Please provide a reason.`
                : `The ${activeValidationItem?.type === 'sub' ? 'subtask' : 'task'} "${activeValidationItem?.item?.title}" took ${formatSeconds(activeValidationItem?.timer?.elapsedTime)} which exceeds the maximum allowed time of ${formatDuration(activeValidationItem?.item?.maxTime)}. Please provide a reason.`
              }
            </p>

            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              placeholder="Enter your reason here..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleReasonCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting || !reasonText.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dependency Warning Modal */}
      {showDependencyModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm shadow-xl pl-64 border-2 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-semibold">Cannot Start Task</h3>
            </div>

            <p className="text-gray-600 mb-4">
              {dependencyMessage}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDependencyConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;