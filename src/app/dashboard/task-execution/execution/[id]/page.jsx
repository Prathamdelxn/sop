

'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, History, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle, Users, Loader2, AlertCircle, Play, Pause, PlayCircle, ShieldCheck } from "lucide-react";

const TaskPage = () => {
    const params = useParams();
    const { id } = params;
    const { t, language, changeLanguage } = useTranslation();


    const [pauseType, setPauseType] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [expandedStages, setExpandedStages] = useState({});
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignmentData, setAssignmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [taskTimer, setTaskTimer] = useState({
        isRunning: false,
        startTime: null,
        elapsedTime: 0,
        totalTrackedSeconds: 0 // New field for cumulative time
    });

    const [userdata, setUserData] = useState();
    const [subtaskTimers, setSubtaskTimers] = useState({}); // { subtaskId: { isRunning, startTime, elapsedTime } }
    const [activeValidationItem, setActiveValidationItem] = useState(null); // { type: 'main'|'sub', item: selectedTask|subtask }

    // Modal states
    // const [showVisualStandards, setShowVisualStandards] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reasonType, setReasonType] = useState(null); // 'min' or 'max'
    const [reasonText, setReasonText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingActionId, setLoadingActionId] = useState(null);
    const [focusedSubtaskId, setFocusedSubtaskId] = useState(null);
    const [showTaskHistory, setShowTaskHistory] = useState(false);
    const [showSubtaskHistory, setShowSubtaskHistory] = useState(false);
    const [sendingForReview, setSendingForReview] = useState(false);

    // Modal states for Pause
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [pauseReason, setPauseReason] = useState("");
    const [pausingItem, setPausingItem] = useState(null); // { type: 'main'|'sub', item: ... }

    // --- CHECKPOINT LOGIC ---
    const { prototypeData, equipment } = assignmentData || {};
    const stages = prototypeData?.stages || [];

    // Check if all tasks and subtasks are completed
    const allTasksCompleted = stages.length > 0 && stages.every(stage =>
        stage.tasks && stage.tasks.length > 0 && stage.tasks.every(task => {
            if (task.status !== 'completed') return false;
            if (task.subtasks && task.subtasks.length > 0) {
                return task.subtasks.every(st => st.status === 'completed');
            }
            return true;
        })
    );

    const isReworkRequired = assignmentData?.status === 'Rework Required' || assignmentData?.reviewStatus === 'Rework Required';
    const isPendingReview = assignmentData?.status === 'Pending Review' || assignmentData?.reviewStatus === 'Pending Review';
    const isAssignmentCompleted = assignmentData?.status === 'Completed' || assignmentData?.reviewStatus === 'Approved';

    // Send for Review handler
    const handleSendForReview = async (auto = false) => {
        if (!allTasksCompleted) {
            if (!auto) alert('Please complete all tasks before sending for review.');
            return;
        }
        try {
            setSendingForReview(true);
            const res = await fetch('/api/assignment/send-for-review', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    sentBy: { id: userdata?.id || userdata?._id, name: userdata?.name }
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send for review');

            // Update local state
            setAssignmentData(prev => ({
                ...prev,
                status: 'Pending Review',
                reviewStatus: 'Pending Review'
            }));

            if (!auto) {
                alert('Assignment sent for review successfully!');
            } else {
                console.log('Assignment automatically sent for review.');
            }
        } catch (err) {
            console.error('Error sending for review:', err);
            // Only alert if manual or it's a real failure they need to know about
            if (!auto) alert(err.message || 'Failed to send for review');
        } finally {
            setSendingForReview(false);
        }
    };

    // Auto-send for review when all tasks are completed
    useEffect(() => {
        if (allTasksCompleted && !isPendingReview && !isAssignmentCompleted && !sendingForReview && userdata && assignmentData) {
            // Check if it's actually eligible to be sent (not already approved or pending in background)
            handleSendForReview(true);
        }
    }, [allTasksCompleted, isPendingReview, isAssignmentCompleted, sendingForReview, userdata, assignmentData]);

    // --- CHECKPOINT LOGIC ---
    const getFirstUncompletedStop = () => {
        if (!stages) return null;
        for (let sIdx = 0; sIdx < stages.length; sIdx++) {
            const stage = stages[sIdx];
            if (!stage.tasks) continue;
            for (let tIdx = 0; tIdx < stage.tasks.length; tIdx++) {
                const task = stage.tasks[tIdx];
                if (task.addStop && task.status !== 'completed') {
                    return { stageIndex: sIdx, taskIndex: tIdx };
                }
            }
        }
        return null;
    };
    const firstStopPoint = getFirstUncompletedStop();
    const isTaskBlockedByStop = (sIdx, tIdx) => {
        if (!firstStopPoint) return false;
        if (sIdx > firstStopPoint.stageIndex) return true;
        if (sIdx === firstStopPoint.stageIndex && tIdx > firstStopPoint.taskIndex) return true;
        return false;
    };
    // ------------------------

    // Auto-scroll logic for UI triggers
    useEffect(() => {
        if (focusedSubtaskId) {
            setTimeout(() => {
                const element = document.getElementById(`subtask-detail-${focusedSubtaskId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            setShowSubtaskHistory(false);
        }
    }, [focusedSubtaskId]);

    useEffect(() => {
        if (showTaskHistory) {
            setTimeout(() => {
                const element = document.getElementById('main-task-activity-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [showTaskHistory]);

    useEffect(() => {
        if (showSubtaskHistory) {
            setTimeout(() => {
                const element = document.getElementById('subtask-activity-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [showSubtaskHistory]);

    // Sync selectedTask when assignmentData refreshes to ensure we have latest status/timers
    useEffect(() => {
        if (assignmentData && selectedTask) {
            const stage = assignmentData.prototypeData.stages[selectedTask.stageIndex];
            if (stage) {
                const task = stage.tasks.find(t =>
                    String(t._id || t.taskId) === String(selectedTask._id || selectedTask.taskId)
                );
                if (task) {
                    // Update selectedTask state with fresh data while preserving UI-only fields
                    setSelectedTask(prev => ({
                        ...task,
                        stageName: prev.stageName,
                        stageIndex: prev.stageIndex
                    }));
                }
            }
        }
    }, [assignmentData]);

    // Warning modal for addStop dependency
    const [showDependencyModal, setShowDependencyModal] = useState(false);
    const [dependencyMessage, setDependencyMessage] = useState('');

    // Fetch assignment data using existing execution API and filter by ID
    useEffect(() => {
        if (!id) return;

        const fetchAssignment = async (isPoll = false) => {
            try {
                if (!isPoll) setLoading(true);
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

                // Find the specific assignment by ID
                const data = assignments.find(a => String(a._id) === String(id));
                if (!data) {
                    throw new Error("Assignment not found");
                }

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
            } catch (err) {
                console.error("Error fetching assignment:", err);
                if (!isPoll) setError(err.message);
            } finally {
                if (!isPoll) setLoading(false);
            }
        };

        fetchAssignment();
        const pollInterval = setInterval(() => fetchAssignment(true), 5000);
        return () => clearInterval(pollInterval);
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

        setSelectedTask({ ...task, stageName: stage.name || `Stage ${stageIndex + 1}`, stageIndex });
        setFocusedSubtaskId(null); // Reset focus when switching tasks
        if (task.status === 'Under Execution' && (task.lockedBy?.id || task.startedBy?.id) === currentUserId) {
            const startTime = new Date(task.startedAt).getTime();
            setTaskTimer({
                isRunning: true,
                startTime: startTime,
                elapsedTime: Math.floor((Date.now() - startTime) / 1000),
                totalTrackedSeconds: task.totalActiveSeconds || 0
            });
        } else {
            // Reset timer when selecting a new task, but keep cumulative time if it exists
            setTaskTimer({
                isRunning: false,
                startTime: null,
                elapsedTime: 0,
                totalTrackedSeconds: task.totalActiveSeconds || 0
            });
        }

        // Initialize subtask timers if they are under execution by current user
        const newSubtaskTimers = {};
        if (task.subtasks) {
            task.subtasks.forEach(st => {
                if ((st.status === 'Under Execution' && (st.lockedBy?.id || st.startedBy?.id) === currentUserId) || st.status === 'Paused') {
                    const isRunning = st.status === 'Under Execution' && (st.lockedBy?.id || st.startedBy?.id) === currentUserId;
                    const startTime = isRunning ? new Date(st.startedAt).getTime() : null;
                    newSubtaskTimers[st._id || st.taskId] = {
                        isRunning: isRunning,
                        startTime: startTime,
                        elapsedTime: isRunning ? Math.floor((Date.now() - startTime) / 1000) : 0,
                        totalTrackedSeconds: st.totalActiveSeconds || 0
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
            setLoadingActionId(selectedTask._id || selectedTask.taskId);
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
            setLoadingActionId(null);
        }
    };

    const startTimer = (totalSeconds = 0) => {
        setTaskTimer(prev => ({
            ...prev,
            isRunning: true,
            startTime: Date.now(),
            elapsedTime: 0,
            totalTrackedSeconds: totalSeconds !== undefined ? totalSeconds : prev.totalTrackedSeconds
        }));
    };

    const handlePauseTask = async (reason = null) => {
        if (!selectedTask || !userdata) return;

        // If no reason provided, show modal and return
        if (reason === null) {
            setPausingItem({ type: 'main', item: selectedTask });
            setShowPauseModal(true);
            return;
        }

        try {
            setIsSubmitting(true);
            setLoadingActionId(selectedTask._id || selectedTask.taskId);
            const res = await fetch('/api/assignment/task-execution/pause', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    stageId: stages[selectedTask.stageIndex]._id || stages[selectedTask.stageIndex].stageId,
                    taskId: selectedTask._id || selectedTask.taskId,
                    pausedBy: { id: userdata.id || userdata._id, name: userdata.name },
                    pauseReason: reason
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to pause task");

            // Update local state
            const updatedStages = [...stages];
            const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
            if (taskIndex !== -1) {
                updatedStages[selectedTask.stageIndex].tasks[taskIndex] = {
                    ...updatedStages[selectedTask.stageIndex].tasks[taskIndex],
                    status: 'Paused',
                    lockedBy: null,
                    totalActiveSeconds: result.data.totalActiveSeconds,
                    sessions: result.data.sessions
                };
                setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
                setSelectedTask(prev => ({ ...prev, ...updatedStages[selectedTask.stageIndex].tasks[taskIndex] }));
            }
            setTaskTimer(prev => ({ ...prev, isRunning: false, totalTrackedSeconds: result.data.totalActiveSeconds, elapsedTime: 0 }));
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
            setLoadingActionId(null);
        }
    };

    const handleResumeTask = async () => {
        if (!selectedTask || !userdata) return;
        try {
            setIsSubmitting(true);
            setLoadingActionId(selectedTask._id || selectedTask.taskId);
            const res = await fetch('/api/assignment/task-execution/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    stageId: stages[selectedTask.stageIndex]._id || stages[selectedTask.stageIndex].stageId,
                    taskId: selectedTask._id || selectedTask.taskId,
                    resumedBy: { id: userdata.id || userdata._id, name: userdata.name }
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to resume task");

            // Update local state
            const updatedStages = [...stages];
            const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
            if (taskIndex !== -1) {
                updatedStages[selectedTask.stageIndex].tasks[taskIndex] = {
                    ...updatedStages[selectedTask.stageIndex].tasks[taskIndex],
                    status: 'Under Execution',
                    lockedBy: { id: userdata.id || userdata._id, name: userdata.name },
                    startedAt: result.data.startedAt
                };
                setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
                setSelectedTask(prev => ({ ...prev, ...updatedStages[selectedTask.stageIndex].tasks[taskIndex] }));
            }
            startTimer(selectedTask.totalActiveSeconds || 0);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
            setLoadingActionId(null);
        }
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
        console.log("seconds", seconds);
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


    const getAccurateTotalSeconds = (item, localTimer = null) => {
        if (!item) return 0;

        // Base time from backend (prioritize totalActiveSeconds, then fallback to other fields)
        let total = Number(item.totalActiveSeconds || convertToSeconds(item.actualDuration) || 0);

        // Add live elapsed time
        const currentUserId = String(userdata?.id || userdata?._id || '');
        const activeWorkerId = String(item.lockedBy?.id || item.startedBy?.id || '');

        if (item.status === 'Under Execution' && activeWorkerId) {
            if (activeWorkerId === currentUserId && localTimer && localTimer.isRunning) {
                // Precision for current user using local timer
                total += Number(localTimer.elapsedTime || 0);
            } else if (item.startedAt) {
                // Estimate live time from startedAt (robust for other workers OR current user after page refresh)
                const startTimeOffset = new Date(item.startedAt).getTime();
                if (!isNaN(startTimeOffset)) {
                    const live = Math.floor((Date.now() - startTimeOffset) / 1000);
                    if (live > 0) total += live;
                }
            }
        }

        return Math.max(0, total);
    };

    // NEW HELPER - Use actualDuration for completed items (Clean & Simple)
    const getCompletedDisplayTime = (item) => {
        if (!item) return "0:00";

        // Priority 1: Use actualDuration sent by backend (already formatted)
        if (item.actualDuration && item.actualDuration !== "N/A" && item.actualDuration !== "") {
            return item.actualDuration;
        }

        // Priority 2: Fallback to totalActiveSeconds
        if (item.totalActiveSeconds !== undefined && item.totalActiveSeconds !== null) {
            return formatSeconds(item.totalActiveSeconds);
        }

        return "0:00";
    };


    // const getWorkerTotalTime = (sessions, workerId) => {
    //     if (!sessions || !Array.isArray(sessions)) return 0;
    //     return sessions
    //         .filter(s => (s.workerId || s.worker_id) === workerId)
    //         .reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    // };

    // const getAllWorkerTimes = (item) => {
    //     if (!item) return [];
    //     const sessions = item.sessions || [];

    //     // Use String() for ID comparisons to avoid ObjectID vs String issues
    //     const currentUserId = String(userdata?.id || userdata?._id || '');

    //     const workerMap = sessions.reduce((acc, s) => {
    //         // Skip the current active session if it's in the array, as we'll add its live time separately below
    //         if (item.status === 'Under Execution' && s.startedAt === item.startedAt) return acc;

    //         const id = String(s.workerId || s.worker_id || '');
    //         if (!id) return acc;
    //         if (!acc[id]) {
    //             acc[id] = {
    //                 id,
    //                 name: s.workerName || s.worker_name || 'Unknown',
    //                 totalSeconds: 0
    //             };
    //         }
    //         acc[id].totalSeconds += (s.durationSeconds || 0);
    //         return acc;
    //     }, {});

    //     // Add live time if the item is currently running
    //     if (item.status === 'Under Execution' && item.startedAt) {
    //         const activeWorkerId = String(item.lockedBy?.id || item.startedBy?.id || '');
    //         const activeWorkerName = item.lockedBy?.name || item.startedBy?.name || 'Worker';

    //         if (activeWorkerId) {
    //             let liveSeconds = 0;
    //             if (activeWorkerId === currentUserId) {
    //                 // Precision for current user using local timer
    //                 const subtaskId = item._id || item.taskId;
    //                 const timer = subtaskId && subtaskTimers[subtaskId] ? subtaskTimers[subtaskId] : taskTimer;
    //                 liveSeconds = timer?.elapsedTime || Math.floor((Date.now() - new Date(item.startedAt).getTime()) / 1000);
    //             } else {
    //                 // Estimated for other workers
    //                 liveSeconds = Math.floor((Date.now() - new Date(item.startedAt).getTime()) / 1000);
    //             }

    //             if (liveSeconds < 0) liveSeconds = 0;

    //             if (workerMap[activeWorkerId]) {
    //                 workerMap[activeWorkerId].totalSeconds += liveSeconds;
    //             } else {
    //                 workerMap[activeWorkerId] = {
    //                     id: activeWorkerId,
    //                     name: activeWorkerName,
    //                     totalSeconds: liveSeconds
    //                 };
    //             }
    //         }
    //     }

    //     return Object.values(workerMap);
    // };
    // CLEAN & CORRECT - Only past sessions, no live time for completed items
    const getAllWorkerTimes = (item) => {
        if (!item || !item.sessions || !Array.isArray(item.sessions)) return [];

        const workerMap = {};

        // Only use completed sessions (ignore any active session)
        item.sessions.forEach((session) => {
            const id = String(session.workerId || session.worker_id || '');
            if (!id) return;

            if (!workerMap[id]) {
                workerMap[id] = {
                    id,
                    name: session.workerName || session.worker_name || 'Unknown',
                    totalSeconds: 0
                };
            }

            // Add only the saved durationSeconds from past sessions
            workerMap[id].totalSeconds += Number(session.durationSeconds || 0);
        });

        return Object.values(workerMap);
    };


    const renderActivityHistory = (item) => {
        if (!item) return null;
        const events = [];
        const sessions = item.sessions || [];

        sessions.forEach((session, index) => {
            // Start/Resume
            events.push({
                type: index === 0 ? 'Started' : 'Resumed',
                worker: session.workerName,
                time: session.startedAt,
                duration: null
            });
            // Stop/Pause/Complete
            // If it's the last session and the item is completed, mark it as Completed
            const isLast = index === sessions.length - 1;
            events.push({
                type: (isLast && item.status === 'completed') ? 'Completed' : 'Paused',
                worker: session.workerName,
                time: (isLast && item.status === 'completed') ? (item.completedAt || session.endedAt) : session.endedAt,
                duration: (isLast && item.status === 'completed') ? (item.totalActiveSeconds || item.elapsedTime) : session.durationSeconds,
                pauseReason: session.pauseReason
            });
        });

        // If currently running, add the "In Progress" event (only if not already listed in sessions)
        const isAlreadyInSessions = sessions.some(s => s.startedAt === item.startedAt);
        if (item.status === 'Under Execution' && item.startedAt && !isAlreadyInSessions) {
            events.push({
                type: sessions.length === 0 ? 'Started' : 'Resumed',
                worker: item.lockedBy?.name || item.startedBy?.name || 'Worker',
                time: item.startedAt,
                duration: null
            });
        }

        if (events.length === 0) return null;

        // Sort by time
        const sortedEvents = [...events].sort((a, b) => new Date(a.time) - new Date(b.time));

        return (
            <div className="mt-4 border-t border-gray-100 pt-4">
                <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-300" /> Activity History
                </h5>
                <div className="space-y-2.5">
                    {sortedEvents.map((event, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[11px]">
                            <div className="min-w-[110px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-center whitespace-nowrap">
                                {new Date(event.time).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex-1 flex flex-wrap items-center">
                                <span className={`font-bold px-1.5 py-0.5 rounded ${event.type === 'Started' ? 'bg-blue-50 text-blue-600' :
                                    event.type === 'Resumed' ? 'bg-blue-50 text-blue-500' :
                                        event.type === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {event.type}
                                </span>
                                <span className="text-gray-500 ml-1.5">by <span className="text-gray-700 font-medium">{event.worker}</span></span>
                                {event.duration > 0 && (
                                    <span className="text-[10px] text-gray-400 ml-auto font-medium">({formatSeconds(event.duration)})</span>
                                )}
                            </div>
                            {event.pauseReason && (
                                <div className="ml-[123px] mt-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 italic">
                                    "{event.pauseReason}"
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
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
            setLoadingActionId(subtaskId);
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
                    elapsedTime: 0,
                    totalTrackedSeconds: subtask.totalActiveSeconds || 0
                }
            }));
        } catch (err) {
            console.error("Error starting subtask:", err);
            alert(err.message || "Failed to start subtask.");
        } finally {
            setIsSubmitting(false);
            setLoadingActionId(null);
        }
    };

    const handleStopSubtaskTimer = (subtask) => {
        handlePauseSubtask(subtask);
    };

    const handlePauseSubtask = async (subtask, reason = null) => {
        const subtaskId = subtask._id || subtask.taskId;

        // If no reason provided, show modal and return
        if (reason === null) {
            setPausingItem({ type: 'sub', item: subtask });
            setShowPauseModal(true);
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await fetch('/api/assignment/task-execution/pause', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    stageId: stages[selectedTask.stageIndex]._id || stages[selectedTask.stageIndex].stageId,
                    taskId: selectedTask._id || selectedTask.taskId,
                    subtaskId: subtaskId,
                    pausedBy: { id: userdata.id || userdata._id, name: userdata.name },
                    pauseReason: reason
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to pause subtask");

            // Update local state
            const updatedStages = [...stages];
            const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
            if (taskIndex !== -1) {
                const subtaskIndex = updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
                if (subtaskIndex !== -1) {
                    const updateInfo = {
                        status: 'Paused',
                        lockedBy: null,
                        totalActiveSeconds: result.data.totalActiveSeconds,
                        sessions: result.data.sessions
                    };
                    updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex] = {
                        ...updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex],
                        ...updateInfo
                    };
                    setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
                    const updatedSubtasks = [...selectedTask.subtasks];
                    updatedSubtasks[subtaskIndex] = { ...updatedSubtasks[subtaskIndex], ...updateInfo };
                    setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
                }
            }
            setSubtaskTimers(prev => ({
                ...prev,
                [subtaskId]: { isRunning: false, totalTrackedSeconds: result.data.totalActiveSeconds, elapsedTime: 0 }
            }));
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
            setLoadingActionId(null);
        }
    };

    const handleResumeSubtask = async (subtask) => {
        const subtaskId = subtask._id || subtask.taskId;
        try {
            setIsSubmitting(true);
            setLoadingActionId(subtaskId);
            const res = await fetch('/api/assignment/task-execution/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    stageId: stages[selectedTask.stageIndex]._id || stages[selectedTask.stageIndex].stageId,
                    taskId: selectedTask._id || selectedTask.taskId,
                    subtaskId: subtaskId,
                    resumedBy: { id: userdata.id || userdata._id, name: userdata.name }
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to resume subtask");

            // Update local state
            const updatedStages = [...stages];
            const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
            if (taskIndex !== -1) {
                const subtaskIndex = updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
                if (subtaskIndex !== -1) {
                    const updateInfo = {
                        status: 'Under Execution',
                        lockedBy: { id: userdata.id || userdata._id, name: userdata.name },
                        startedAt: result.data.startedAt
                    };
                    updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex] = {
                        ...updatedStages[selectedTask.stageIndex].tasks[taskIndex].subtasks[subtaskIndex],
                        ...updateInfo
                    };
                    setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
                    const updatedSubtasks = [...selectedTask.subtasks];
                    updatedSubtasks[subtaskIndex] = { ...updatedSubtasks[subtaskIndex], ...updateInfo };
                    setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
                }
            }
            setSubtaskTimers(prev => ({
                ...prev,
                [subtaskId]: {
                    isRunning: true,
                    startTime: Date.now(),
                    elapsedTime: 0,
                    totalTrackedSeconds: subtask.totalActiveSeconds || 0
                }
            }));
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
            setLoadingActionId(null);
        }
    };

    const handleSubmitSubtask = async (subtask) => {
        const subtaskId = subtask._id || subtask.taskId;
        const timer = subtaskTimers[subtaskId];

        const minSeconds = convertToSeconds(subtask?.minTime);
        const maxSeconds = convertToSeconds(subtask?.maxTime);

        // Calculate overall total time: Sum of all completed sessions + current active session time
        const totalTime = getAccurateTotalSeconds(subtask, timer);

        setActiveValidationItem({ type: 'sub', item: subtask, timer, totalTime });

        const needsModal = (minSeconds !== null && totalTime < minSeconds) || (maxSeconds !== null && totalTime > maxSeconds);

        if (needsModal) {
            // First pause the subtask to stop the timer while user writes the reason
            if (timer?.isRunning) {
                await handlePauseSubtask(subtask, "System: Pause for submission reason");
            }
            if (minSeconds !== null && totalTime < minSeconds) {
                setReasonType('min');
                setShowReasonModal(true);
            } else if (maxSeconds !== null && totalTime > maxSeconds) {
                setReasonType('max');
                setShowReasonModal(true);
            }
        } else {
            completeTaskSubmission(subtask);
        }
    };

    const handleSubmitTask = async () => {
        // Enforce all subtasks must be completed before the main task can be submitted
        // if (selectedTask?.subtasks && selectedTask.subtasks.length > 0) {
        //     const hasIncompleteSubtasks = selectedTask.subtasks.some(st => st.status !== 'completed');
        //     if (hasIncompleteSubtasks) {
        //         alert("You cannot submit this task until all of its subtasks are fully completed.");
        //         return;
        //     }
        // }

        // Check if task has min/max time constraints
        const minSeconds = convertToSeconds(selectedTask?.minTime);
        const maxSeconds = convertToSeconds(selectedTask?.maxTime);

        // Calculate overall total time
        const totalTime = getAccurateTotalSeconds(selectedTask, taskTimer);

        setActiveValidationItem({ type: 'main', item: selectedTask, timer: taskTimer, totalTime });

        // If both min and max are N/A or not provided, submit directly
        if (minSeconds === null && maxSeconds === null) {
            completeTaskSubmission();
            return;
        }

        const needsModal = (minSeconds !== null && totalTime < minSeconds) || (maxSeconds !== null && totalTime > maxSeconds);

        if (needsModal) {
            // First pause the main task to stop the timer while user writes the reason
            if (taskTimer.isRunning) {
                await handlePauseTask("System: Pause for submission reason");
            }
            if (minSeconds !== null && totalTime < minSeconds) {
                setReasonType('min');
                setShowReasonModal(true);
            } else if (maxSeconds !== null && totalTime > maxSeconds) {
                setReasonType('max');
                setShowReasonModal(true);
            }
        } else {
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
        if (item) setLoadingActionId(item._id || item.taskId);

        try {
            // Calculate overall total time
            // If we came from a reason modal, we MUST use the pre-calculated time that triggered the modal
            // to avoid double-counting or shifting time while the user is typing the reason.
            let totalTime = 0;
            if (activeValidationItem && activeValidationItem.totalTime !== undefined) {
                totalTime = activeValidationItem.totalTime;
                console.log(`[DEBUG] Using pre-calculated time from modal: ${totalTime}s`);
            } else {
                totalTime = getAccurateTotalSeconds(item, timer);
                console.log(`[DEBUG] Calculated total time via helper: ${totalTime}s`);
            }

            // Safety cap: Max 24 hours (86400 seconds)
            if (totalTime > 86400) {
                console.warn(`[DEBUG] Time capped at 24h: ${totalTime}s -> 86400s`);
                totalTime = 86400;
            }

            const submissionData = {
                completedBy: { id: userdata.id || userdata._id, name: userdata.name },
                completedAt: new Date().toISOString(),
                actualDuration: formatSeconds(totalTime),
                elapsedTime: totalTime,
                totalActiveSeconds: totalTime,
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
            setLoadingActionId(null);
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

    return (
        <div className="w-full h-full p-2">
            <div className="h-full w-full rounded-b-2xl border border-gray-300 overflow-hidden relative flex flex-col">
                {/* Rework Required Banner */}
                {isReworkRequired && assignmentData?.reviewNotes?.length > 0 && (
                    <div className="w-full bg-rose-50 border-b border-rose-200 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-rose-800">Rework Required — Reviewer has reopened the following tasks:</p>
                                <div className="mt-2 space-y-1">
                                    {assignmentData.reviewNotes.filter(n => n.reopened).map((note, idx) => (
                                        <div key={idx} className="text-sm text-rose-700 flex items-start gap-2">
                                            <span className="font-medium">• {note.taskTitle}</span>
                                            {note.note && <span className="text-rose-500 italic">— "{note.note}"</span>}
                                        </div>
                                    ))}
                                </div>
                                {assignmentData.reviewedBy?.name && (
                                    <p className="text-xs text-rose-400 mt-2">Reviewed by: {assignmentData.reviewedBy.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Review Banner */}
                {isPendingReview && (
                    <div className="w-full bg-purple-50 border-b border-purple-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                            <p className="text-sm font-semibold text-purple-800">This assignment is currently under review. Please wait for the reviewer's feedback.</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="h-16 w-full flex items-center border-b border-gray-300 justify-between px-4 bg-white shrink-0">
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

                    {/* Right side: Send for Review + Language */}
                    <div className="flex items-center gap-3">
                        {/* Send for Review Button - ALWAYS PRESENT */}
                        <button
                            onClick={() => handleSendForReview(false)}
                            disabled={sendingForReview || isPendingReview || isAssignmentCompleted || !allTasksCompleted}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed rounded-lg ${isPendingReview ? 'bg-purple-600' : isAssignmentCompleted ? 'bg-emerald-600' : !allTasksCompleted ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                }`}
                        >
                            {isPendingReview ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> {t('underReview')}</>
                            ) : isAssignmentCompleted ? (
                                <><CheckCircle className="h-4 w-4" /> {t('approved')}</>
                            ) : !allTasksCompleted ? (
                                <><Clock className="h-4 w-4" /> {t('tasksPending')}</>
                            ) : (
                                <><CheckCircle className="h-4 w-4" /> {t('sendForReview')}</>
                            )}
                        </button>

                        {/* // NEW */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="language" className="text-sm font-medium">
                                {t('language')}:
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="gu">ગુજરાતી</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Visual Standards Tab (Global) */}
                {/* {prototypeData?.visualRepresentationEnabled && prototypeData?.visualRepresntation?.length > 0 && (
                    <div className="w-full bg-white border-b border-gray-200 px-4 py-2">
                        <button
                            onClick={() => setShowVisualStandards(!showVisualStandards)}
                            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            {showVisualStandards ? t('hideVisualStandards') : t('visualStandards')}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showVisualStandards ? 'rotate-180' : ''}`} />
                        </button>

                        {showVisualStandards && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                {prototypeData.visualRepresntation.map((cp, idx) => (
                                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                                            <h4 className="text-sm font-semibold text-gray-800 truncate">{cp.checkPoint?.title || 'Checkpoint'}</h4>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                            {cp.checkPoint?.images?.map((img, imgIdx) => (
                                                <img
                                                    key={imgIdx}
                                                    src={img.url}
                                                    alt={img.title || 'Reference'}
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all"
                                                    onClick={() => window.open(img.url, '_blank')}
                                                />
                                            ))}
                                            {(!cp.checkPoint?.images || cp.checkPoint.images.length === 0) && (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Image size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )} */}

                {/* Body */}
                <div className="flex-1 w-full flex overflow-hidden">
                    {/* Left Sidebar - Stages and Tasks */}
                    <div className={`h-full ${sidebarExpanded ? 'w-1/4' : 'w-16'} border-r border-gray-300 transition-all duration-300 overflow-hidden relative`}>
                        <div className="p-4 h-full overflow-y-auto">
                            {sidebarExpanded ? (
                                <>
                                    <h2 className="font-bold text-lg mb-4">{t('stages')}</h2>
                                    <div className="space-y-2">
                                        {stages.map((stage, stageIndex) => {
                                            const stageKey = stage._id || stage.stageId || `stage-${stageIndex}`;
                                            const stageName = stage.title || stage.name || `Stage ${stageIndex + 1}`;
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
                                                                const isBlocked = isTaskBlockedByStop(stageIndex, taskIndex);

                                                                return (
                                                                    <div
                                                                        key={taskKey}
                                                                        className={`p-2 text-sm flex items-center gap-2 font-semibold ${isBlocked ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'} ${isSelected && !isBlocked ? 'text-blue-500' : ''
                                                                            } ${isBlocked ? 'text-gray-400' : isCompleted ? (task.reason ? 'text-red-600' : 'text-green-600') : (task.status === 'Paused' ? 'text-orange-600' : 'text-gray-700')}`}
                                                                        onClick={() => {
                                                                            if (isBlocked) {
                                                                                alert(`🔒 This task is locked! You must first complete the preceding task marked as a Stop Point.`);
                                                                                return;
                                                                            }
                                                                            handleTaskClick(stage, task, stageIndex);
                                                                        }}
                                                                    >
                                                                        <div className={`w-2 h-6 rounded-sm shrink-0 ${isSelected && !isBlocked
                                                                            ? 'bg-blue-500'
                                                                            : isBlocked
                                                                                ? 'bg-gray-200'
                                                                                : isCompleted
                                                                                    ? (task.reason ? 'bg-red-500' : 'bg-green-500')
                                                                                    : task.status === 'Paused'
                                                                                        ? 'bg-orange-400'
                                                                                        : 'bg-gray-300'
                                                                            }`}></div>
                                                                        <span className="flex-1 truncate">{taskNumber}: {task.title}</span>
                                                                        {isBlocked && <AlertCircle size={14} className="text-gray-400 shrink-0" />}
                                                                        {task.status === 'Under Execution' && !isBlocked && (
                                                                            <div className="flex items-center gap-1 shrink-0">
                                                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded font-bold uppercase">
                                                                                    {(task.lockedBy?.name || task.startedBy?.name || '??').split(' ').map(n => n[0]).join('')}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {isCompleted && !isBlocked && (
                                                                            task.reason ? <AlertCircle size={14} className="text-red-500 shrink-0" /> : <CheckCircle size={14} className="text-green-500 shrink-0" />
                                                                        )}
                                                                        {task.addStop && !isCompleted && !isBlocked && (
                                                                            <AlertCircle size={14} className="text-amber-500 shrink-0" title="Stop Point" />
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
                                                    title={stage.title || stage.name || `Stage ${stageIndex + 1}`}
                                                >
                                                    {stageIndex + 1}
                                                </div>
                                                {expandedStages[stageKey] && (
                                                    <div className="mt-2 bg-white rounded-md p-2 shadow-md">
                                                        {stage.tasks && stage.tasks.map((task, taskIndex) => {
                                                            const taskKey = task._id || task.taskId || `task-${stageIndex}-${taskIndex}`;
                                                            const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;
                                                            const isCompleted = task.status === 'completed';
                                                            const isBlocked = isTaskBlockedByStop(stageIndex, taskIndex);
                                                            return (
                                                                <div
                                                                    key={taskKey}
                                                                    className={`p-1 text-xs text-center mb-1 last:mb-0 ${isBlocked ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-blue-50 cursor-pointer'} ${!isBlocked && isCompleted ? 'text-green-600' : ''}`}
                                                                    onClick={() => {
                                                                        if (isBlocked) {
                                                                            alert(`🔒 This task is locked! You must first complete the preceding task marked as a Stop Point.`);
                                                                            return;
                                                                        }
                                                                        handleTaskClick(stage, task, stageIndex);
                                                                    }}
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
                            {selectedTask && isTaskBlockedByStop(selectedTask.stageIndex, stages[selectedTask.stageIndex]?.tasks?.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId))) ? (
                                <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center h-full">
                                    <div className="bg-gray-100 p-6 rounded-full mb-6 relative">
                                        <AlertCircle size={64} className="text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('taskLocked')}</h2>
                                    <p className="text-gray-500 max-w-md">{t('taskLockedMessage')}</p>
                                </div>
                            ) : selectedTask ? (
                                <div className="bg-white rounded-lg shadow p-6">
                                    {/* Task Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h2 className={`${focusedSubtaskId ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 transition-all flex items-center gap-2`}>
                                                {focusedSubtaskId && <button onClick={() => setFocusedSubtaskId(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={18} className="text-blue-600" /></button>}
                                                {/* <span className="text-gray-400 font-medium">[{stages[selectedTask.stageIndex]?.title || stages[selectedTask.stageIndex]?.name || `Stage ${selectedTask.stageIndex + 1}`}]</span> {selectedTask.title} */}
                                            </h2>
                                            {selectedTask && selectedTask.status === 'Under Execution' && selectedTask.startedAt && (
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit border border-blue-100 animate-pulse">
                                                    <Play size={10} fill="currentColor" />
                                                    <span className="uppercase tracking-wider">Live: Working by {selectedTask.lockedBy?.name || selectedTask.startedBy?.name}</span>
                                                </div>
                                            )}
                                            {selectedTask && selectedTask.status === 'Paused' && selectedTask.sessions?.length > 0 && (
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit border border-orange-100">
                                                    <Pause size={10} fill="currentColor" />
                                                    <span className="uppercase tracking-wider">Paused by {selectedTask.sessions[selectedTask.sessions.length - 1].workerName}</span>
                                                </div>
                                            )}
                                            {!focusedSubtaskId && <p className="text-gray-600 mt-1">{selectedTask.stageName}</p>}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {selectedTask.status === 'completed' && (
                                                    <span className={`inline-flex items-center gap-1 text-xs ${selectedTask.reason ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-md`}>
                                                        {selectedTask.reason ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                                                        {selectedTask.reason ? 'Completed with Exception' : 'Completed'}
                                                    </span>
                                                )}
                                                {selectedTask.addStop && selectedTask.status !== 'completed' && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
                                                        <AlertCircle size={12} />
                                                        Requires previous task completion
                                                    </span>
                                                )}
                                                {focusedSubtaskId && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse shadow-sm">
                                                        Focus Mode
                                                    </span>
                                                )}
                                            </div>
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
                                                            <span className="text-xs text-green-600 font-medium">Completed in: {getCompletedDisplayTime(selectedTask)}</span>
                                                            {/* <span className="font-mono font-semibold text-green-700">
                                {selectedTask.actualDuration || formatSeconds(selectedTask.elapsedTime) || 'N/A'}
                              </span> */}
                                                        </div>
                                                    </div>
                                                ) : selectedTask.status === 'Under Execution' && (selectedTask.lockedBy?.id || selectedTask.startedBy?.id) !== (userdata.id || userdata._id) ? (
                                                    // Task is being executed by someone else
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                                                            <Loader2 size={16} className="text-blue-600 animate-spin" />
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-xs text-blue-600 font-medium">Under Execution by</span>
                                                                <span className="font-semibold text-blue-700">{selectedTask.lockedBy?.name || selectedTask.startedBy?.name}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 italic">Locked</span>
                                                    </div>
                                                ) : selectedTask.status === 'Paused' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col items-end mr-2">
                                                            <span className="text-[10px] text-orange-600 font-medium whitespace-nowrap">Paused at</span>
                                                            <span className="font-mono font-bold text-orange-700">
                                                                {formatSeconds(getAccurateTotalSeconds(selectedTask))}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={handleResumeTask}
                                                            disabled={isSubmitting}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                                                        >
                                                            <PlayCircle size={16} />
                                                            {t('Resume')}
                                                        </button>
                                                        {(selectedTask.lastWorker?.id === (userdata.id || userdata._id)) &&
                                                            selectedTask.status === 'Under Execution' && (
                                                                <button
                                                                    onClick={handleSubmitTask}
                                                                    disabled={isSubmitting}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Submit
                                                                </button>
                                                            )}
                                                    </div>
                                                ) : !taskTimer.isRunning ? (
                                                    ((taskTimer.totalTrackedSeconds || 0) === 0 && taskTimer.elapsedTime === 0) || selectedTask.status === 'pending' ? (
                                                        <button
                                                            onClick={handleStartTimerClick}
                                                            disabled={isSubmitting}
                                                            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                                            Start
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col items-end mr-2">
                                                                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">Total Time</span>
                                                                <span className="font-mono font-bold text-gray-700">
                                                                    {/* {formatSeconds(taskTimer.totalTrackedSeconds + taskTimer.elapsedTime)} */}
                                                                    {formatSeconds(getAccurateTotalSeconds(selectedTask, taskTimer))}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={handleResumeTask}
                                                                disabled={isSubmitting}
                                                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting && loadingActionId !== (selectedTask?._id || selectedTask?.taskId) ? 'opacity-50 cursor-not-allowed hidden' : isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
                                                                {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? 'Resuming...' : 'Resume'}
                                                            </button>
                                                            <button
                                                                onClick={handleSubmitTask}
                                                                disabled={isSubmitting}
                                                                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting && loadingActionId !== (selectedTask?._id || selectedTask?.taskId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                                {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? 'Submitting...' : 'Submit'}
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col items-end mr-2">
                                                            <span className="text-[10px] text-blue-600 font-medium whitespace-nowrap">Active Session</span>
                                                            <span className="font-mono font-bold text-blue-700 animate-pulse text-lg">
                                                                {formatSeconds(getAccurateTotalSeconds(selectedTask, taskTimer))}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handlePauseTask()}
                                                            disabled={isSubmitting}
                                                            className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting && loadingActionId !== (selectedTask?._id || selectedTask?.taskId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? <Loader2 size={16} className="animate-spin" /> : <Pause size={16} />}
                                                            {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? 'Pausing...' : 'Pause'}
                                                        </button>
                                                        <button
                                                            onClick={handleSubmitTask}
                                                            disabled={isSubmitting}
                                                            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 ${isSubmitting && loadingActionId !== (selectedTask?._id || selectedTask?.taskId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                            {isSubmitting && loadingActionId === (selectedTask?._id || selectedTask?.taskId) ? 'Submitting...' : 'Submit'}
                                                        </button>
                                                    </div>
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

                                    {/* Description & Gallery - Collapsible in focus mode */}
                                    {!focusedSubtaskId ? (
                                        <>
                                            {/* Description */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('description')}</h3>
                                                <p className="text-gray-700">{selectedTask.description || 'No description provided.'}</p>
                                            </div>

                                            {/* COMPLETION INFO - Simple Row Breakdown */}
                                            {selectedTask.status === 'completed' && selectedTask.completedAt && (
                                                <div className="mb-4 text-sm bg-green-50 px-4 py-3 rounded-lg border border-green-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Play size={16} className="text-blue-600" />
                                                        <span className="font-bold text-gray-800">{t('Started:')}</span>
                                                        <span className="font-medium text-gray-700">
                                                            {((selectedTask.sessions && selectedTask.sessions.length > 0) ? selectedTask.sessions[0].startedAt : selectedTask.startedAt) ? new Date((selectedTask.sessions && selectedTask.sessions.length > 0) ? selectedTask.sessions[0].startedAt : selectedTask.startedAt).toLocaleString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-green-600" />
                                                        <span className="font-bold text-gray-800">Ended:</span>
                                                        <span className="font-medium text-gray-700">
                                                            {new Date(selectedTask.completedAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Min/Max Duration */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                                        <Clock size={16} /> {t('minimumDuration')}
                                                    </h4>
                                                    <p className="text-lg font-semibold">{formatDuration(selectedTask.minTime)}</p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                                        <Clock size={16} /> {t('maximumDuration')}
                                                    </h4>
                                                    <p className="text-lg font-semibold">{formatDuration(selectedTask.maxTime)}</p>
                                                </div>
                                            </div>

                                            {/* Gallery Section */}
                                            {selectedTask.galleryTitle && (
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{selectedTask.galleryTitle}</h3>
                                                    {selectedTask.galleryDescription && (
                                                        <p className="text-gray-600 mb-4">{selectedTask.galleryDescription}</p>
                                                    )}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        {selectedTask.galleryImages && selectedTask.galleryImages.map((image, idx) => (
                                                            <div key={image.id || idx} className="group relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                                <img src={image.url} alt={image.title || `Gallery image ${idx + 1}`} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                                                {image.title && (
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {image.title}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Interactive Activity History Toggle for Main Task */}
                                            <div className="mt-8 mb-4 border-t pt-6">
                                                <button
                                                    onClick={() => setShowTaskHistory(!showTaskHistory)}
                                                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                                                >
                                                    <History size={16} />
                                                    {showTaskHistory ? 'Hide' : 'View'} {t('activityHistory')}
                                                    <ChevronDown size={14} className={`transition-transform duration-300 ${showTaskHistory ? 'rotate-180' : ''}`} />
                                                </button>

                                                {showTaskHistory && (
                                                    <div id="main-task-activity-section" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {renderActivityHistory(selectedTask)}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mb-6 flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-300 group cursor-pointer hover:bg-white hover:border-blue-300 transition-all" onClick={() => setFocusedSubtaskId(null)}>
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ArrowLeft size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Parent Task Details Hidden</p>
                                                <p className="text-sm text-gray-600 font-medium">Currently focused on subtask. Click here or the back arrow to restore full view.</p>
                                            </div>
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
                                        <div className="mt-4">
                                            {/* Focused Subtask Detail View (Prominent) */}                   {focusedSubtaskId && selectedTask.subtasks.find(st => String(st._id || st.taskId) === String(focusedSubtaskId)) && (
                                                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    {/* Simple Card */}
                                                    {(() => {
                                                        const subtask = selectedTask.subtasks.find(st => String(st._id || st.taskId) === String(focusedSubtaskId));
                                                        const subtaskId = subtask._id || subtask.taskId;
                                                        const timer = subtaskTimers[subtaskId];
                                                        const isCompleted = subtask.status === 'completed';
                                                        const isAssigned = userdata && subtask.assignedWorker &&
                                                            subtask.assignedWorker.some(worker => (worker.id || worker._id) === (userdata.id || userdata._id));

                                                        return (
                                                            <div id={`subtask-detail-${subtaskId}`} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">                                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                                                                <h4 className="text-lg font-bold text-gray-800">{subtask.title}</h4>
                                                                <button onClick={() => setFocusedSubtaskId(null)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Back to list">
                                                                    <ArrowLeft size={20} />
                                                                </button>
                                                            </div>
                                                                <div className="p-5">
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                        <div className="md:col-span-2">
                                                                            <p className="text-gray-600 mb-4">
                                                                                {subtask.description || 'No description provided.'}
                                                                            </p>

                                                                            <div className="flex gap-4 text-xs text-gray-500 mb-4">
                                                                                <div className="flex items-center gap-1">
                                                                                    <Clock size={14} />
                                                                                    <span>Min: <span className="font-semibold">{formatDuration(subtask.minTime)}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <Clock size={14} />
                                                                                    <span>Max: <span className="font-semibold">{formatDuration(subtask.maxTime)}</span></span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Activity Log */}
                                                                            <div className="mt-4 border-t pt-4">
                                                                                <button
                                                                                    onClick={() => setShowSubtaskHistory(!showSubtaskHistory)}
                                                                                    className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest pb-3"
                                                                                >
                                                                                    <History size={14} />
                                                                                    {showSubtaskHistory ? 'Hide Subtask Activity' : 'View Subtask Activity'}
                                                                                    <ChevronDown size={12} className={`transition-transform duration-300 ${showSubtaskHistory ? 'rotate-180' : ''}`} />
                                                                                </button>

                                                                                {showSubtaskHistory && (
                                                                                    <div id="subtask-activity-section" className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                                        {renderActivityHistory(subtask)}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {subtask.assignedWorker && subtask.assignedWorker.length > 0 && (
                                                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                                                    {subtask.assignedWorker.map((worker, wIndex) => (
                                                                                        <span key={(worker.id || worker._id) || wIndex} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium flex items-center gap-1">
                                                                                            <Users size={12} /> {worker.name}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Subtask Controls - Simple */}
                                                                        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 h-fit">
                                                                            {isCompleted ? (
                                                                                <div className="flex flex-col items-center py-2 gap-2 w-full mt-2">
                                                                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md border border-blue-100 w-full justify-center">
                                                                                        <Play size={14} className="text-blue-600" />
                                                                                        <span className="font-bold text-gray-700 text-[11px]">Started:</span>
                                                                                        <span className="font-medium text-gray-600 text-[11px]">
                                                                                            {((subtask.sessions && subtask.sessions.length > 0) ? subtask.sessions[0].startedAt : subtask.startedAt) ? new Date((subtask.sessions && subtask.sessions.length > 0) ? subtask.sessions[0].startedAt : subtask.startedAt).toLocaleString() : 'N/A'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md border border-green-100 w-full justify-center">
                                                                                        <CheckCircle size={14} className="text-green-600" />
                                                                                        <span className="font-bold text-gray-700 text-[11px]">Ended:</span>
                                                                                        <span className="font-medium text-gray-600 text-[11px]">
                                                                                            {subtask.completedAt ? new Date(subtask.completedAt).toLocaleString() : 'N/A'}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            ) : subtask.status === 'Under Execution' && (subtask.lockedBy?.id || subtask.startedBy?.id) !== (userdata.id || userdata._id) ? (
                                                                                <div className="flex flex-col items-center gap-2 py-2 text-center">
                                                                                    <Loader2 size={24} className="text-blue-500 animate-spin" />
                                                                                    <span className="text-xs font-medium text-blue-600 uppercase">Under Execution by</span>
                                                                                    <span className="text-sm font-bold text-blue-700">{subtask.lockedBy?.name || subtask.startedBy?.name || 'Other'}</span>
                                                                                </div>
                                                                            ) : subtask.status === 'Paused' ? (
                                                                                <div className="flex flex-col gap-3">
                                                                                    <div className="text-center">
                                                                                        <span className="text-[10px] text-orange-600 font-medium uppercase">Paused at</span>
                                                                                        <div className="text-3xl font-mono font-bold text-orange-700">{formatSeconds(subtask.totalActiveSeconds || 0)}</div>
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <button onClick={(e) => { e.stopPropagation(); handleResumeSubtask(subtask); }} disabled={isSubmitting} className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}>{isSubmitting && loadingActionId === subtaskId ? 'Resuming...' : 'Resume'}</button>
                                                                                        {(subtask.lastWorker?.id === (userdata.id || userdata._id)) &&
                                                                                            subtask.status === 'Under Execution' && (
                                                                                                <button onClick={(e) => { e.stopPropagation(); handleSubmitSubtask(subtask); }} disabled={isSubmitting} className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}>{isSubmitting && loadingActionId === subtaskId ? 'Submitting...' : 'Submit'}</button>
                                                                                            )}
                                                                                    </div>
                                                                                </div>
                                                                            ) : isAssigned ? (
                                                                                <div className="flex flex-col gap-3">
                                                                                    {timer?.isRunning ? (
                                                                                        <>
                                                                                            <div className="text-center bg-blue-600 text-white py-4 rounded font-mono font-bold text-3xl shadow-sm">
                                                                                                {/* {formatSeconds((timer.totalTrackedSeconds || 0) + timer.elapsedTime)} */}
                                                                                                {formatSeconds(getAccurateTotalSeconds(subtask, timer))}
                                                                                            </div>
                                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                                <button onClick={(e) => { e.stopPropagation(); handlePauseSubtask(subtask); }} disabled={isSubmitting} className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}>{isSubmitting && loadingActionId === subtaskId ? 'Pausing...' : 'Pause'}</button>
                                                                                                <button onClick={(e) => { e.stopPropagation(); handleSubmitSubtask(subtask); }} disabled={isSubmitting} className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}>{isSubmitting && loadingActionId === subtaskId ? 'Submitting...' : 'Submit'}</button>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="flex flex-col gap-3">
                                                                                            {((timer?.totalTrackedSeconds || 0) + (timer?.elapsedTime || 0)) > 0 && (
                                                                                                <div className="text-center">
                                                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Stored Time</span>
                                                                                                    <div className="text-3xl font-mono font-bold text-gray-700">
                                                                                                        {/* {formatSeconds(timer.totalTrackedSeconds + timer.elapsedTime)} */}
                                                                                                        {formatSeconds(getAccurateTotalSeconds(subtask, timer))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {((timer?.totalTrackedSeconds || 0) + (timer?.elapsedTime || 0)) === 0 || subtask.status === 'pending' ? (
                                                                                                <button
                                                                                                    onClick={(e) => { e.stopPropagation(); handleStartSubtaskTimer(subtask); }}
                                                                                                    disabled={isSubmitting}
                                                                                                    className={`bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50 cursor-not-allowed' : isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                                >
                                                                                                    {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                                                                                    {t('Start Execution')}
                                                                                                </button>
                                                                                            ) : (
                                                                                                <div className="flex gap-2">
                                                                                                    <button
                                                                                                        onClick={(e) => { e.stopPropagation(); handleResumeSubtask(subtask); }}
                                                                                                        disabled={isSubmitting}
                                                                                                        className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-2 ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50' : ''}`}
                                                                                                    >
                                                                                                        {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
                                                                                                        {t('Resume')}
                                                                                                    </button>
                                                                                                    <button
                                                                                                        onClick={(e) => { e.stopPropagation(); handleSubmitSubtask(subtask); }}
                                                                                                        disabled={isSubmitting}
                                                                                                        className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-2 ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50' : ''}`}
                                                                                                    >
                                                                                                        {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                                                                        Submit
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="bg-gray-100 text-gray-500 px-4 py-8 rounded-lg font-bold text-center text-xs">
                                                                                    VIEW ONLY
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}


                                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                                {focusedSubtaskId ? t('remainingSubtasks') : t('subtasks')}
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedTask.subtasks
                                                    .filter(st => !focusedSubtaskId || String(st._id || st.taskId) !== String(focusedSubtaskId))
                                                    .map((subtask, index) => {
                                                        const subtaskId = subtask._id || subtask.taskId;
                                                        const timer = subtaskTimers[subtaskId];
                                                        const isCompleted = subtask.status === 'completed';
                                                        const isAssigned = userdata && subtask.assignedWorker &&
                                                            subtask.assignedWorker.some(worker => (worker.id || worker._id) === (userdata.id || userdata._id));

                                                        return (
                                                            <div
                                                                key={subtaskId || index}
                                                                onClick={() => {
                                                                    console.log("Subtask focus request:", subtaskId);
                                                                    setFocusedSubtaskId(subtaskId);
                                                                }}
                                                                className={`border-l-4 ${isCompleted ? 'border-green-500 bg-green-50/30' : 'border-blue-500 bg-gray-50'} transition-all duration-300 cursor-pointer hover:bg-gray-100 hover:border-blue-600 pl-4 py-3 rounded-r relative shadow-sm`}
                                                            >
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

                                                                        {/* Latest Activity Summary */}
                                                                        {subtask.status === 'Under Execution' && subtask.startedAt && (
                                                                            <div className="text-[9px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                                                                                <Play size={10} fill="currentColor" />
                                                                                <span>Started by {subtask.lockedBy?.name || subtask.startedBy?.name || 'Worker'} at {new Date(subtask.startedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                            </div>
                                                                        )}
                                                                        {!isCompleted && subtask.status === 'Paused' && subtask.sessions && subtask.sessions.length > 0 && (
                                                                            <div className="text-[9px] text-orange-600 font-medium mt-0.5 flex items-center gap-1">
                                                                                <Pause size={10} fill="currentColor" />
                                                                                <span>Paused by {subtask.sessions[subtask.sessions.length - 1].workerName} at {new Date(subtask.sessions[subtask.sessions.length - 1].endedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                            </div>
                                                                        )}
                                                                        {isCompleted && subtask.sessions && subtask.sessions.length > 0 && (
                                                                            <div className="text-[9px] text-green-600 font-medium mt-0.5 flex items-center gap-1">
                                                                                <CheckCircle size={10} />
                                                                                <span>Finished at {new Date(subtask.sessions[subtask.sessions.length - 1].endedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                            </div>
                                                                        )}
                                                                        {subtask.description && (
                                                                            <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                                                                        )}

                                                                        {isCompleted && subtask.completedBy && (
                                                                            <div className="mt-2 text-[10px] bg-green-50/50 p-2 rounded border border-green-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                                                                                <div className="flex items-center gap-1">
                                                                                    <Play size={10} className="text-blue-600" />
                                                                                    <span className="font-bold text-gray-700">Started:</span>
                                                                                    <span className="text-gray-600">
                                                                                        {((subtask.sessions && subtask.sessions.length > 0) ? subtask.sessions[0].startedAt : subtask.startedAt) ? new Date((subtask.sessions && subtask.sessions.length > 0) ? subtask.sessions[0].startedAt : subtask.startedAt).toLocaleString() : 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <CheckCircle size={10} className="text-green-600" />
                                                                                    <span className="font-bold text-gray-700">Ended:</span>
                                                                                    <span className="text-gray-600">
                                                                                        {subtask.completedAt ? new Date(subtask.completedAt).toLocaleString() : 'N/A'}
                                                                                    </span>
                                                                                </div>
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
                                                                                <span className="text-[10px] text-green-600 font-medium whitespace-nowrap">Completed in:</span>
                                                                                <span className="font-mono font-bold text-green-700 text-sm">
                                                                                    {getCompletedDisplayTime(subtask)}
                                                                                </span>
                                                                            </div>
                                                                        ) : subtask.status === 'Under Execution' && (subtask.lockedBy?.id || subtask.startedBy?.id) !== (userdata.id || userdata._id) ? (
                                                                            <div className="flex flex-col items-end gap-1">
                                                                                <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                                                    <Loader2 size={12} className="text-blue-600 animate-spin" />
                                                                                    <div className="flex flex-col items-start leading-tight">
                                                                                        <span className="text-[10px] text-blue-600 font-medium">Under Execution by</span>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="text-[10px] font-bold text-blue-700">{subtask.lockedBy?.name || subtask.startedBy?.name || 'Other'}</span>
                                                                                            <span className="text-[10px] font-mono font-bold text-blue-600">({formatSeconds(Math.floor((Date.now() - new Date(subtask.startedAt).getTime()) / 1000))})</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-[8px] text-gray-500 italic">Locked</span>
                                                                            </div>
                                                                        ) : subtask.status === 'Paused' ? (
                                                                            <div className="flex flex-col items-end gap-1">
                                                                                <div className="flex flex-col items-end">
                                                                                    <span className="text-[10px] text-orange-600 font-medium whitespace-nowrap">Paused at</span>
                                                                                    <span className="font-mono font-bold text-orange-700 text-xs">
                                                                                        {formatSeconds(subtask.totalActiveSeconds || 0)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex gap-1">
                                                                                    <button
                                                                                        onClick={() => handleResumeSubtask(subtask)}
                                                                                        disabled={isSubmitting}
                                                                                        className={`text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}
                                                                                    >
                                                                                        {isSubmitting && loadingActionId === subtaskId ? 'Resuming...' : 'Resume'}
                                                                                    </button>
                                                                                    {(subtask.lastWorker?.id === (userdata.id || userdata._id)) &&
                                                                                        subtask.status === 'Under Execution' && (
                                                                                            <button
                                                                                                onClick={() => handleSubmitSubtask(subtask)}
                                                                                                disabled={isSubmitting}
                                                                                                className={`text-[10px] bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}
                                                                                            >
                                                                                                {isSubmitting && loadingActionId === subtaskId ? 'Submitting...' : 'Submit'}
                                                                                            </button>
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        ) : isAssigned ? (
                                                                            <div className="flex flex-col items-end gap-2">
                                                                                {timer?.isRunning ? (
                                                                                    <div className="flex flex-col items-end gap-1">
                                                                                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono font-bold animate-pulse text-sm">
                                                                                            <Loader2 size={12} className="animate-spin" />
                                                                                            {/* {formatSeconds((timer.totalTrackedSeconds || 0) + timer.elapsedTime)} */}
                                                                                            {formatSeconds(getAccurateTotalSeconds(subtask, timer))}
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handlePauseSubtask(subtask); }}
                                                                                            disabled={isSubmitting}
                                                                                            className={`text-[11px] bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded shadow-sm transition-colors ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}
                                                                                        >
                                                                                            {isSubmitting && loadingActionId === subtaskId ? 'Pausing' : 'Pause'}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handleSubmitSubtask(subtask); }}
                                                                                            disabled={isSubmitting}
                                                                                            className={`text-[11px] bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm ${isSubmitting && loadingActionId !== subtaskId ? 'opacity-50' : ''}`}
                                                                                        >
                                                                                            {isSubmitting && loadingActionId === subtaskId ? 'Submitting' : 'Submit'}
                                                                                        </button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex flex-col items-end gap-1">
                                                                                        {((timer?.totalTrackedSeconds || 0) + (timer?.elapsedTime || 0)) > 0 && (
                                                                                            <div className="flex flex-col items-end mb-1">
                                                                                                <span className="text-[8px] text-gray-400 uppercase">Total Time</span>
                                                                                                <span className="font-mono text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                                                                                                    {/* {formatSeconds(timer.totalTrackedSeconds + timer.elapsedTime)} */}
                                                                                                    {formatSeconds(getAccurateTotalSeconds(subtask, timer))}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                        {((timer?.totalTrackedSeconds || 0) + (timer?.elapsedTime || 0)) === 0 ? (
                                                                                            <button
                                                                                                onClick={(e) => { e.stopPropagation(); handleStartSubtaskTimer(subtask); }}
                                                                                                disabled={isSubmitting}
                                                                                                className={`bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2 text-[11px] ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50 cursor-not-allowed' : isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                            >
                                                                                                {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                                                                                                {t('Start Execution')}
                                                                                            </button>
                                                                                        ) : (
                                                                                            <div className="flex gap-2">
                                                                                                <button
                                                                                                    onClick={(e) => { e.stopPropagation(); handleResumeSubtask(subtask); }}
                                                                                                    disabled={isSubmitting}
                                                                                                    className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1 text-[11px] font-medium ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50' : ''}`}
                                                                                                >
                                                                                                    {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={12} className="animate-spin" /> : <PlayCircle size={12} />}
                                                                                                    {t('Resume')}
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={(e) => { e.stopPropagation(); handleSubmitSubtask(subtask); }}
                                                                                                    disabled={isSubmitting}
                                                                                                    className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1 text-[11px] font-medium ${isSubmitting && loadingActionId !== subtaskId ? 'hidden opacity-50' : ''}`}
                                                                                                >
                                                                                                    {isSubmitting && loadingActionId === subtaskId ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                                                                                    {t('Submit')}
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
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

                                            {/* Show other subtasks summary if in focus mode */}
                                            {focusedSubtaskId && selectedTask.subtasks.length > 1 && (
                                                <div className="mt-8 border-t pt-4">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Other Subtasks</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTask.subtasks
                                                            .filter(st => (st._id || st.taskId) !== focusedSubtaskId)
                                                            .map((st, idx) => (
                                                                <div
                                                                    key={st._id || st.taskId || idx}
                                                                    onClick={() => setFocusedSubtaskId(st._id || st.taskId)}
                                                                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 cursor-pointer hover:bg-white hover:border-blue-300 transition-all flex items-center gap-2"
                                                                >
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${st.status === 'completed' ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                                                                    {st.title}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <Image size={48} className="mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">{t('noTaskSelected')}</h3>
                                        <p>{t('selectTask')}</p>
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

            {/* Pause Reason Modal */}
            {showPauseModal && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-sm shadow-xl pl-64 border-2 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Pause className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{t('pauseReasonTitle')}</h3>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for pausing the {pausingItem?.type === 'sub' ? 'subtask' : 'task'}
                            <span className="font-semibold text-gray-900 ml-1">"{pausingItem?.item?.title}"</span>.
                        </p>

                        {/* Dropdown */}
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3 text-sm bg-gray-50 hover:bg-white transition-colors"
                            value={pauseType}
                            onChange={(e) => setPauseType(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="">Select reason</option>
                            <option value="Break">Break</option>
                            <option value="Tea Break">Tea Break</option>
                            <option value="Shift Change">Shift Change</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Input only if Other */}
                        {pauseType === "Other" && (
                            <input
                                type="text"
                                placeholder="Enter custom reason..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 text-sm bg-gray-50 hover:bg-white transition-colors"
                                onChange={(e) => setCustomReason(e.target.value)}
                                disabled={isSubmitting}
                                autoFocus
                            />
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowPauseModal(false);
                                    setPauseReason("");
                                    setPausingItem(null);
                                }}
                                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                                disabled={
                                    isSubmitting ||
                                    (!pauseType || (pauseType === "Other" && !customReason.trim()))
                                }
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const reason = pauseType === "Other"
                                        ? customReason.trim()
                                        : pauseType;
                                    if (!reason) return;
                                    setShowPauseModal(false);
                                    setPauseReason("");
                                    if (pausingItem?.type === 'sub') {
                                        handlePauseSubtask(pausingItem.item, reason);
                                    } else {
                                        handlePauseTask(reason);
                                    }
                                    setPausingItem(null);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-md shadow-orange-200 flex items-center gap-2 transform active:scale-95 transition-all"
                                disabled={
                                    isSubmitting ||
                                    !pauseType ||
                                    (pauseType === "Other" && !customReason.trim())
                                }
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm Pause"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reason Modal */}
            {showReasonModal && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-sm shadow-xl pl-64 border-2 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className={`w-6 h-6 ${reasonType === 'min' ? 'text-yellow-500' : 'text-red-500'}`} />
                            <h3 className="text-lg font-semibold">
                                {reasonType === 'min' ? t('tooQuick') : t('tooLong')}
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            {reasonType === 'min'
                                ? `The ${activeValidationItem?.type === 'sub' ? 'subtask' : 'task'} "${activeValidationItem?.item?.title}" was completed in ${formatSeconds(activeValidationItem?.totalTime || 0)} which is less than the minimum required time of ${formatDuration(activeValidationItem?.item?.minTime)}. Please provide a reason.`
                                : `The ${activeValidationItem?.type === 'sub' ? 'subtask' : 'task'} "${activeValidationItem?.item?.title}" took ${formatSeconds(activeValidationItem?.totalTime || 0)} which exceeds the maximum allowed time of ${formatDuration(activeValidationItem?.item?.maxTime)}. Please provide a reason.`
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
                            <h3 className="text-lg font-semibold">{t('Cannot Start Task')}</h3>
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