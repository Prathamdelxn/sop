'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, History, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle, Users, Loader2, AlertCircle, Play, Pause, PlayCircle, ShieldCheck, Zap, Lock } from "lucide-react";

/**
 * DRY RUN ENVIRONMENT
 * This page mimics the production execution UI exactly but without backend persistence.
 * It fetches the raw checklist (SOP) data and allows the user to simulate the workflow.
 */
const DryRunPage = () => {
    const params = useParams();
    const router = useRouter();
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
        elapsedTime: 0,
        totalTrackedSeconds: 0
    });
    const [userdata, setUserData] = useState();
    const [subtaskTimers, setSubtaskTimers] = useState({});
    const [activeValidationItem, setActiveValidationItem] = useState(null);

    // Modal states
    const [showVisualStandards, setShowVisualStandards] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reasonType, setReasonType] = useState(null);
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
    const [pausingItem, setPausingItem] = useState(null);

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

    const isReworkRequired = false;
    const isPendingReview = assignmentData?.status === 'Pending Review';
    const isAssignmentCompleted = assignmentData?.status === 'Completed';

    // Mock Send for Review
    const handleSendForReview = async (auto = false) => {
        if (!allTasksCompleted) {
            if (!auto) alert('Please complete all tasks before sending for review.');
            return;
        }
        if (auto) return;

        alert("Dry Run Complete! In a real assignment, this would send the checklist for review.");
        setAssignmentData(prev => ({
            ...prev,
            status: 'Pending Review'
        }));
    };

    // Auto-scroll logic
    useEffect(() => {
        if (focusedSubtaskId) {
            setTimeout(() => {
                const element = document.getElementById(`subtask-detail-${focusedSubtaskId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
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

    // Sync selectedTask
    useEffect(() => {
        if (assignmentData && selectedTask) {
            const stage = assignmentData.prototypeData.stages[selectedTask.stageIndex];
            if (stage) {
                const task = stage.tasks.find(t =>
                    String(t._id || t.taskId) === String(selectedTask._id || selectedTask.taskId)
                );
                if (task) {
                    setSelectedTask(prev => ({
                        ...task,
                        stageName: prev.stageName,
                        stageIndex: prev.stageIndex
                    }));
                }
            }
        }
    }, [assignmentData]);

    const [showDependencyModal, setShowDependencyModal] = useState(false);
    const [dependencyMessage, setDependencyMessage] = useState('');

    // Fetch checklist data
    useEffect(() => {
        if (!id) return;

        // In your DryRunPage component, update the fetchSOP function:

        const fetchSOP = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem("user");
                const userData = storedUser ? JSON.parse(storedUser) : { name: "Demo User", id: "demo-id", companyId: "demo-company-id" };
                setUserData(userData);

                // Get companyId from user data or use a demo value
                const companyId = userData?.companyId || userData?.company?._id || "demo-company-id";

                // Add companyId as a query parameter
                const res = await fetch(`/api/checklistapi/fetch-by-id/${id}?companyId=${companyId}`);

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || `Failed to fetch checklist configuration (${res.status})`);
                }

                const sopData = await res.json();
                if (!sopData) throw new Error("Checklist not found");

                // Initialize task statuses for visualization
                const initializedStages = (sopData.stages || []).map(stage => ({
                    ...stage,
                    tasks: (stage.tasks || []).map(task => ({
                        ...task,
                        status: 'pending',
                        subtasks: (task.subtasks || []).map(st => ({
                            ...st,
                            status: 'pending',
                            sessions: []
                        })),
                        sessions: [],
                        assignedWorker: [{ id: userData.id || userData._id, name: userData.name }]
                    }))
                }));

                const mockAssignment = {
                    _id: `dry-run-${id}`,
                    status: 'Assigned',
                    prototypeData: {
                        ...sopData,
                        stages: initializedStages
                    },
                    equipment: { name: sopData.equipment?.name || "Demo Equipment", model: "Preview Mode" },
                    assignedWorker: [{ id: userData.id || userData._id, name: userData.name }]
                };

                setAssignmentData(mockAssignment);

                if (initializedStages.length > 0) {
                    setExpandedStages({ [initializedStages[0]._id || initializedStages[0].stageId]: true });
                }
            } catch (err) {
                console.error("Error fetching SOP:", err);
                setError(err.message);
                // Optional: Set fallback demo data here if you want the page to still work
                setFallbackDemoData(id, userData);
            } finally {
                setLoading(false);
            }
        };

        // Optional fallback function if API fails
        const setFallbackDemoData = (id, userData) => {
            const fallbackData = {
                _id: id,
                name: "Demo Checklist (API Unavailable)",
                visualRepresentationEnabled: false,
                stages: [
                    {
                        _id: "stage1",
                        name: "Demo Stage",
                        tasks: [
                            {
                                _id: "task1",
                                taskId: "task1",
                                title: "Demo Task",
                                description: "This is a fallback task since the API couldn't be reached.",
                                status: 'pending',
                                addStop: false,
                                minTime: { hours: 0, minutes: 0, seconds: 30 },
                                maxTime: { hours: 0, minutes: 5, seconds: 0 },
                                subtasks: []
                            }
                        ]
                    }
                ]
            };

            const initializedStages = (fallbackData.stages || []).map(stage => ({
                ...stage,
                tasks: (stage.tasks || []).map(task => ({
                    ...task,
                    status: 'pending',
                    subtasks: (task.subtasks || []).map(st => ({
                        ...st,
                        status: 'pending',
                        sessions: []
                    })),
                    sessions: [],
                    assignedWorker: [{ id: userData?.id || "demo-id", name: userData?.name || "Demo User" }]
                }))
            }));

            setAssignmentData({
                _id: `dry-run-${id}`,
                status: 'Assigned',
                prototypeData: {
                    ...fallbackData,
                    stages: initializedStages
                },
                equipment: { name: "Demo Equipment", model: "Preview Mode" },
                assignedWorker: [{ id: userData?.id || "demo-id", name: userData?.name || "Demo User" }]
            });
        };

        fetchSOP();
    }, [id]);

    // Timer effect
    useEffect(() => {
        let interval;
        const runningSubtaskIds = Object.keys(subtaskTimers).filter(id => subtaskTimers[id]?.isRunning);

        if (taskTimer.isRunning || runningSubtaskIds.length > 0) {
            interval = setInterval(() => {
                if (taskTimer.isRunning) {
                    setTaskTimer(prev => ({
                        ...prev,
                        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
                    }));
                }

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

    const handleTaskClick = (stage, task, stageIndex) => {
        const taskIdxInStage = stage.tasks.findIndex(t => (t._id || t.taskId) === (task._id || task.taskId));
        if (isTaskBlockedByStop(stageIndex, taskIdxInStage)) {
            alert(`🔒 This task is locked! You must first complete the preceding task marked as a Stop Point.`);
            return;
        }

        const currentUserId = userdata?.id || userdata?._id;
        setSelectedTask({ ...task, stageName: stage.name || `Stage ${stageIndex + 1}`, stageIndex });
        setFocusedSubtaskId(null);

        if (task.status === 'Under Execution' && (task.lockedBy?.id || task.startedBy?.id) === currentUserId) {
            // Already running
        } else {
            setTaskTimer({
                isRunning: false,
                startTime: null,
                elapsedTime: 0,
                totalTrackedSeconds: task.totalActiveSeconds || 0
            });
        }

        const newSubtaskTimers = {};
        if (task.subtasks) {
            task.subtasks.forEach(st => {
                if (st.status === 'Under Execution' || st.status === 'Paused') {
                    const isRunning = st.status === 'Under Execution';
                    newSubtaskTimers[st._id || st.taskId] = {
                        isRunning: isRunning,
                        startTime: isRunning ? (st.startedAt ? new Date(st.startedAt).getTime() : Date.now()) : null,
                        elapsedTime: 0,
                        totalTrackedSeconds: st.totalActiveSeconds || 0
                    };
                }
            });
        }
        setSubtaskTimers(newSubtaskTimers);
    };

    const checkPreviousTaskStatus = (currentStage, currentTask) => {
        if (!currentStage || !currentStage.tasks) return true;
        const taskIndex = currentStage.tasks.findIndex(t => (t._id || t.taskId) === (currentTask._id || currentTask.taskId));
        if (taskIndex <= 0) return true;
        return currentStage.tasks[taskIndex - 1]?.status === 'completed';
    };

    const handleStartTimerClick = async () => {
        if (!selectedTask) return;
        const currentStage = stages[selectedTask.stageIndex];

        if (selectedTask.addStop === true) {
            if (!checkPreviousTaskStatus(currentStage, selectedTask)) {
                const taskIndex = currentStage.tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));
                const previousTask = taskIndex > 0 ? currentStage.tasks[taskIndex - 1] : null;
                setDependencyMessage(previousTask ? `Cannot start "${selectedTask.title}" until "${previousTask.title}" is completed.` : `Cannot start this task until the previous task is completed.`);
                setShowDependencyModal(true);
                return;
            }
        }

        // SIMULATED START
        const now = new Date().toISOString();
        const updatedStages = [...stages];
        const taskIndex = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIndex !== -1) {
            updatedStages[selectedTask.stageIndex].tasks[taskIndex] = {
                ...updatedStages[selectedTask.stageIndex].tasks[taskIndex],
                status: 'Under Execution',
                startedBy: { id: userdata.id, name: userdata.name },
                startedAt: now,
                lockedBy: { id: userdata.id, name: userdata.name }
            };

            setAssignmentData({
                ...assignmentData,
                prototypeData: { ...assignmentData.prototypeData, stages: updatedStages }
            });

            setSelectedTask(prev => ({
                ...prev,
                status: 'Under Execution',
                startedBy: { id: userdata.id, name: userdata.name },
                startedAt: now,
                lockedBy: { id: userdata.id, name: userdata.name }
            }));
        }

        setTaskTimer({
            isRunning: true,
            startTime: Date.now(),
            elapsedTime: 0,
            totalTrackedSeconds: selectedTask.totalActiveSeconds || 0
        });
    };

    const handlePauseTask = async (reason = null) => {
        if (!selectedTask) return;
        if (reason === null) {
            setPausingItem({ type: 'main', item: selectedTask });
            setShowPauseModal(true);
            return;
        }

        const totalActive = getAccurateTotalSeconds(selectedTask, taskTimer);
        const now = new Date().toISOString();

        const updatedStages = [...stages];
        const taskIdx = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            const currentTask = updatedStages[selectedTask.stageIndex].tasks[taskIdx];
            const newSession = {
                workerId: userdata.id,
                workerName: userdata.name,
                startedAt: currentTask.startedAt,
                endedAt: now,
                durationSeconds: Math.floor((Date.now() - new Date(currentTask.startedAt).getTime()) / 1000),
                pauseReason: reason
            };

            updatedStages[selectedTask.stageIndex].tasks[taskIdx] = {
                ...currentTask,
                status: 'Paused',
                lockedBy: null,
                totalActiveSeconds: totalActive,
                sessions: [...(currentTask.sessions || []), newSession]
            };

            setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
            setSelectedTask(prev => ({ ...prev, ...updatedStages[selectedTask.stageIndex].tasks[taskIdx] }));
        }
        setTaskTimer(prev => ({ ...prev, isRunning: false, totalTrackedSeconds: totalActive, elapsedTime: 0 }));
    };

    const handleResumeTask = async () => {
        if (!selectedTask) return;
        const now = new Date().toISOString();
        const updatedStages = [...stages];
        const taskIdx = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            updatedStages[selectedTask.stageIndex].tasks[taskIdx] = {
                ...updatedStages[selectedTask.stageIndex].tasks[taskIdx],
                status: 'Under Execution',
                lockedBy: { id: userdata.id, name: userdata.name },
                startedAt: now
            };
            setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
            setSelectedTask(prev => ({ ...prev, ...updatedStages[selectedTask.stageIndex].tasks[taskIdx] }));
        }
        setTaskTimer({
            isRunning: true,
            startTime: Date.now(),
            elapsedTime: 0,
            totalTrackedSeconds: selectedTask.totalActiveSeconds || 0
        });
    };

    const handleStartSubtaskTimer = async (subtask) => {
        const subtaskId = subtask._id || subtask.taskId;
        const now = new Date().toISOString();

        const updatedStages = [...stages];
        const taskIdx = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            const subtaskIdx = updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
            if (subtaskIdx !== -1) {
                const info = {
                    status: 'Under Execution',
                    startedBy: { id: userdata.id, name: userdata.name },
                    startedAt: now,
                    lockedBy: { id: userdata.id, name: userdata.name }
                };
                updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx] = {
                    ...updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx],
                    ...info
                };
                setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
            }
        }

        setSubtaskTimers(prev => ({
            ...prev,
            [subtaskId]: { isRunning: true, startTime: Date.now(), elapsedTime: 0, totalTrackedSeconds: subtask.totalActiveSeconds || 0 }
        }));
    };

    const handlePauseSubtask = async (subtask, reason = null) => {
        const subtaskId = subtask._id || subtask.taskId;
        if (reason === null) {
            setPausingItem({ type: 'sub', item: subtask });
            setShowPauseModal(true);
            return;
        }

        const timer = subtaskTimers[subtaskId];
        const totalActive = getAccurateTotalSeconds(subtask, timer);
        const now = new Date().toISOString();

        const updatedStages = [...stages];
        const taskIdx = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            const subtaskIdx = updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
            if (subtaskIdx !== -1) {
                const currentSub = updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx];
                const newSession = {
                    workerId: userdata.id,
                    workerName: userdata.name,
                    startedAt: currentSub.startedAt,
                    endedAt: now,
                    durationSeconds: Math.floor((Date.now() - new Date(currentSub.startedAt).getTime()) / 1000),
                    pauseReason: reason
                };
                updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx] = {
                    ...currentSub,
                    status: 'Paused',
                    lockedBy: null,
                    totalActiveSeconds: totalActive,
                    sessions: [...(currentSub.sessions || []), newSession]
                };
                setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
            }
        }
        setSubtaskTimers(prev => ({ ...prev, [subtaskId]: { isRunning: false, totalTrackedSeconds: totalActive, elapsedTime: 0 } }));
    };

    const handleResumeSubtask = async (subtask) => {
        const subtaskId = subtask._id || subtask.taskId;
        const now = new Date().toISOString();
        const updatedStages = [...stages];
        const taskIdx = updatedStages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            const subtaskIdx = updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
            if (subtaskIdx !== -1) {
                updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx] = {
                    ...updatedStages[selectedTask.stageIndex].tasks[taskIdx].subtasks[subtaskIdx],
                    status: 'Under Execution',
                    lockedBy: { id: userdata.id, name: userdata.name },
                    startedAt: now
                };
                setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
            }
        }
        setSubtaskTimers(prev => ({
            ...prev,
            [subtaskId]: { isRunning: true, startTime: Date.now(), elapsedTime: 0, totalTrackedSeconds: subtask.totalActiveSeconds || 0 }
        }));
    };

    const formatDuration = (duration) => {
        if (!duration) return "N/A";
        const { hours = 0, minutes = 0, seconds = 0 } = duration;
        let parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
        return parts.join(" ");
    };

    const formatSeconds = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const convertToSeconds = (duration) => {
        if (!duration) return null;
        const { hours = 0, minutes = 0, seconds = 0 } = duration;
        return hours * 3600 + minutes * 60 + seconds;
    };

    const getAccurateTotalSeconds = (item, localTimer = null) => {
        if (!item) return 0;
        let total = Number(item.totalActiveSeconds || 0);
        if (item.status === 'Under Execution' && localTimer?.isRunning) {
            total += Number(localTimer.elapsedTime || 0);
        } else if (item.status === 'Under Execution' && item.startedAt) {
            const live = Math.floor((Date.now() - new Date(item.startedAt).getTime()) / 1000);
            if (live > 0) total += live;
        }
        return Math.max(0, total);
    };

    const getCompletedDisplayTime = (item) => {
        if (item.actualDuration && item.actualDuration !== "N/A") return item.actualDuration;
        return formatSeconds(item.totalActiveSeconds || 0);
    };

    const getAllWorkerTimes = (item) => {
        if (!item || !item.sessions) return [];
        const workerMap = {};
        item.sessions.forEach((s) => {
            const id = s.workerId || 'demo';
            if (!workerMap[id]) workerMap[id] = { id, name: s.workerName || 'Demo User', totalSeconds: 0 };
            workerMap[id].totalSeconds += (s.durationSeconds || 0);
        });
        return Object.values(workerMap);
    };

    const renderActivityHistory = (item) => {
        if (!item || !item.sessions || item.sessions.length === 0) return null;
        const events = [];
        item.sessions.forEach((s, idx) => {
            events.push({ type: idx === 0 ? 'Started' : 'Resumed', worker: s.workerName, time: s.startedAt });
            events.push({ type: 'Paused', worker: s.workerName, time: s.endedAt, duration: s.durationSeconds, pauseReason: s.pauseReason });
        });
        if (item.status === 'completed') {
            events[events.length - 1].type = 'Completed';
            events[events.length - 1].time = item.completedAt;
            events[events.length - 1].duration = item.totalActiveSeconds;
        }
        return (
            <div className="mt-4 border-t border-gray-100 pt-4">
                <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-300" /> Activity History (Simulated)
                </h5>
                <div className="space-y-2.5">
                    {events.map((event, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[11px]">
                            <div className="min-w-[110px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-center">
                                {new Date(event.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex-1 flex flex-wrap items-center">
                                <span className={`font-bold px-1.5 py-0.5 rounded ${event.type === 'Started' ? 'bg-blue-50 text-blue-600' : event.type === 'Resumed' ? 'bg-blue-50 text-blue-500' : event.type === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{event.type}</span>
                                <span className="text-gray-500 ml-1.5">by <span className="text-gray-700 font-medium">{event.worker}</span></span>
                                {event.duration > 0 && <span className="text-[10px] text-gray-400 ml-auto font-medium">({formatSeconds(event.duration)})</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleSubmitSubtask = async (subtask) => {
        const subtaskId = subtask._id || subtask.taskId;
        const timer = subtaskTimers[subtaskId];
        const totalTime = getAccurateTotalSeconds(subtask, timer);
        const minSeconds = convertToSeconds(subtask?.minTime);
        const maxSeconds = convertToSeconds(subtask?.maxTime);

        setActiveValidationItem({ type: 'sub', item: subtask, timer, totalTime });
        const needsModal = (minSeconds !== null && totalTime < minSeconds) || (maxSeconds !== null && totalTime > maxSeconds);

        if (needsModal) {
            if (timer?.isRunning) await handlePauseSubtask(subtask, "System: Pause for submission reason");
            setReasonType(totalTime < minSeconds ? 'min' : 'max');
            setShowReasonModal(true);
        } else {
            completeTaskSubmission(subtask);
        }
    };

    const handleSubmitTask = async () => {
        if (selectedTask?.subtasks?.some(st => st.status !== 'completed')) {
            alert("You cannot submit this task until all subtasks are completed.");
            return;
        }

        const totalTime = getAccurateTotalSeconds(selectedTask, taskTimer);
        const minSeconds = convertToSeconds(selectedTask?.minTime);
        const maxSeconds = convertToSeconds(selectedTask?.maxTime);

        setActiveValidationItem({ type: 'main', item: selectedTask, timer: taskTimer, totalTime });

        const needsModal = (minSeconds !== null && totalTime < minSeconds) || (maxSeconds !== null && totalTime > maxSeconds);

        if (needsModal) {
            if (taskTimer.isRunning) await handlePauseTask("System: Pause for submission reason");
            setReasonType(totalTime < minSeconds ? 'min' : 'max');
            setShowReasonModal(true);
        } else {
            completeTaskSubmission();
        }
    };

    const completeTaskSubmission = async (subtask = null) => {
        const isSubtask = !!subtask;
        const item = isSubtask ? subtask : selectedTask;
        const subtaskId = isSubtask ? (subtask._id || subtask.taskId) : null;

        let totalTime = activeValidationItem?.totalTime ?? getAccurateTotalSeconds(item, isSubtask ? subtaskTimers[subtaskId] : taskTimer);

        const submissionData = {
            completedBy: { id: userdata.id, name: userdata.name },
            completedAt: new Date().toISOString(),
            actualDuration: formatSeconds(totalTime),
            totalActiveSeconds: totalTime,
            status: 'completed',
            reason: reasonType ? { type: reasonType, text: reasonText } : null
        };

        const updatedStages = [...stages];
        const stageIdx = selectedTask.stageIndex;
        const taskIdx = updatedStages[stageIdx].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId));

        if (taskIdx !== -1) {
            if (isSubtask) {
                const subIdx = updatedStages[stageIdx].tasks[taskIdx].subtasks.findIndex(st => (st._id || st.taskId) === subtaskId);
                if (subIdx !== -1) {
                    updatedStages[stageIdx].tasks[taskIdx].subtasks[subIdx] = { ...updatedStages[stageIdx].tasks[taskIdx].subtasks[subIdx], ...submissionData };
                }
            } else {
                updatedStages[stageIdx].tasks[taskIdx] = { ...updatedStages[stageIdx].tasks[taskIdx], ...submissionData };
            }

            setAssignmentData({ ...assignmentData, prototypeData: { ...assignmentData.prototypeData, stages: updatedStages } });
        }

        if (isSubtask) {
            setSubtaskTimers(prev => { const next = { ...prev }; delete next[subtaskId]; return next; });
        } else {
            setTaskTimer({ isRunning: false, startTime: null, elapsedTime: 0, totalTrackedSeconds: 0 });
        }

        setShowReasonModal(false);
        setReasonText('');
        setReasonType(null);
        setActiveValidationItem(null);
        alert(`${isSubtask ? 'Subtask' : 'Task'} completed successfully (Dry Run)!`);
    };

    const handleReasonSubmit = () => { if (!reasonText.trim()) return; completeTaskSubmission(activeValidationItem?.type === 'sub' ? activeValidationItem.item : null); };
    const handleReasonCancel = () => { setShowReasonModal(false); setReasonText(''); setReasonType(null); setActiveValidationItem(null); };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'under execution': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500"><XCircle className="w-8 h-8 mb-2" />{error}</div>;

    return (
        <div className="w-full h-full p-2 bg-gray-100">
            <div className="h-full w-full bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden relative flex flex-col">

                {/* DRY RUN BANNER */}
                <div className="w-full bg-emerald-600 text-white px-4 py-2 flex items-center justify-between z-30 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Zap size={18} className="text-white fill-white" />
                        </div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-tighter">Dry Run Mode</span>
                            <p className="text-[10px] leading-none opacity-80 font-medium">Simulated environment • No data will be saved</p>
                        </div>
                    </div>
                    <button onClick={() => router.back()} className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors uppercase border border-white/20 backdrop-blur-sm">Exit Preview</button>
                </div>

                {/* Header */}
                <div className="h-16 w-full flex items-center border-b border-gray-300 justify-between px-4 bg-white shrink-0">
                    <div className="gap-4 flex items-center">
                        <h1 className="text-lg font-semibold">{prototypeData?.name || 'Untitled SOP'}</h1>
                        <span className="text-sm text-gray-500 flex items-center gap-1">| <span className="font-medium text-gray-700">Preview Mode</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSendForReview(false)}
                            disabled={!allTasksCompleted}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-all rounded-lg ${!allTasksCompleted ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md'}`}
                        >
                            {allTasksCompleted ? <><CheckCircle className="h-4 w-4" /> Finish Dry Run</> : <><Clock className="h-4 w-4" /> Tasks Pending</>}
                        </button>
                        <select className="px-2 py-1 text-sm rounded-md border border-gray-300"><option>English</option></select>
                    </div>
                </div>

                {/* Visual Standards Tab */}
                {prototypeData?.visualRepresentationEnabled && (
                    <div className="w-full bg-white border-b border-gray-200 px-4 py-2">
                        <button onClick={() => setShowVisualStandards(!showVisualStandards)} className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> {showVisualStandards ? 'Hide Visual Standards' : 'View Visual Standards'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showVisualStandards ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 w-full flex overflow-hidden">
                    {/* Left Sidebar */}
                    <div className={`h-full ${sidebarExpanded ? 'w-1/4' : 'w-16'} border-r border-gray-300 transition-all overflow-y-auto p-4`}>
                        <h2 className="font-bold text-lg mb-4">{sidebarExpanded ? 'Stages' : ''}</h2>
                        <div className="space-y-2">
                            {stages.map((stage, sIdx) => (
                                <div key={sIdx} className="rounded-md overflow-hidden">
                                    <div className="flex gap-4 items-center p-3 bg-gray-100 cursor-pointer" onClick={() => toggleStage(stage._id || stage.stageId)}>
                                        {expandedStages[stage._id || stage.stageId] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        {sidebarExpanded && <span className="font-medium">{stage.name}</span>}
                                    </div>
                                    {expandedStages[stage._id || stage.stageId] && sidebarExpanded && (
                                        <div className="bg-white p-2">
                                            {stage.tasks.map((task, tIdx) => {
                                                const isBlocked = isTaskBlockedByStop(sIdx, tIdx);
                                                return (
                                                    <div key={tIdx} onClick={() => handleTaskClick(stage, task, sIdx)}
                                                        className={`p-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 relative ${selectedTask?._id === task._id ? 'text-blue-500 font-bold bg-blue-50/50' : ''} ${isBlocked ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                                                        <div className={`w-2 h-6 rounded-sm shrink-0 ${task.status === 'completed' ? 'bg-green-500' : task.status === 'Under Execution' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                                        <span className="truncate flex-1">{sIdx + 1}.{tIdx + 1} {task.title}</span>
                                                        {isBlocked && <div className="absolute right-2 text-gray-400 bg-gray-100 p-0.5 rounded-md border border-gray-200 shadow-sm"><Lock size={10} /></div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-gray-200 p-1 rounded-md cursor-pointer" onClick={toggleSidebar}>
                            {sidebarExpanded ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4 overflow-y-auto">
                        {selectedTask ? (
                            <div className="bg-white rounded-lg shadow p-6 max-w-5xl mx-auto w-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            {selectedTask.stageIndex + 1}.{stages[selectedTask.stageIndex].tasks.findIndex(t => (t._id || t.taskId) === (selectedTask._id || selectedTask.taskId)) + 1} {selectedTask.title}
                                            {selectedTask.addStop && (
                                                <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Lock size={10} fill="currentColor" /> Stop Point
                                                </span>
                                            )}
                                        </h2>
                                        <p className="text-gray-600">{selectedTask.stageName}</p>
                                    </div>

                                    {/* SIMULATED CONTROLS */}
                                    <div className="flex items-center gap-4">
                                        {selectedTask.status === 'completed' ? (
                                            <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200 flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <span className="text-xs text-green-600 font-bold">Completed in {getCompletedDisplayTime(selectedTask)}</span>
                                            </div>
                                        ) : selectedTask.status === 'Under Execution' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="text-right mr-2"><span className="text-[10px] text-blue-600 uppercase font-black">Live Timer</span><div className="font-mono font-bold text-blue-700 animate-pulse text-lg">{formatSeconds(getAccurateTotalSeconds(selectedTask, taskTimer))}</div></div>
                                                <button onClick={() => handlePauseTask()} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Pause size={16} /> Pause</button>
                                                <button onClick={handleSubmitTask} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><CheckCircle size={16} /> Submit</button>
                                            </div>
                                        ) : selectedTask.status === 'Paused' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="text-right mr-2"><span className="text-[10px] text-orange-600 uppercase">Paused at</span><div className="font-mono font-bold text-orange-700">{formatSeconds(selectedTask.totalActiveSeconds)}</div></div>
                                                <button onClick={handleResumeTask} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlayCircle size={16} /> Resume</button>
                                                <button onClick={handleSubmitTask} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><CheckCircle size={16} /> Submit</button>
                                            </div>
                                        ) : (
                                            <button onClick={handleStartTimerClick} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Play size={16} /> Start Task</button>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6"><h3 className="text-lg font-medium mb-2">Description</h3><p className="text-gray-700">{selectedTask.description}</p></div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Min Duration</h4><p className="text-lg font-black">{formatDuration(selectedTask.minTime)}</p></div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Max Duration</h4><p className="text-lg font-black">{formatDuration(selectedTask.maxTime)}</p></div>
                                </div>

                                {selectedTask.subtasks?.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowDown size={18} /> Subtasks</h3>
                                        <div className="space-y-4">
                                            {selectedTask.subtasks.map((st, idx) => {
                                                const timer = subtaskTimers[st._id || st.taskId];
                                                return (
                                                    <div key={idx} className={`p-4 rounded-xl border-l-4 shadow-sm ${st.status === 'completed' ? 'border-green-500 bg-green-50/30' : 'border-blue-500 bg-white'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-bold text-gray-800">{st.title}</h4>
                                                                <p className="text-sm text-gray-500">{st.description}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {st.status === 'completed' ? (
                                                                    <span className="text-green-600 font-bold text-xs">Done ({getCompletedDisplayTime(st)})</span>
                                                                ) : st.status === 'Under Execution' ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-mono text-blue-600 font-bold animate-pulse">{formatSeconds(getAccurateTotalSeconds(st, timer))}</span>
                                                                        <button onClick={() => handlePauseSubtask(st)} className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">Pause</button>
                                                                        <button onClick={() => handleSubmitSubtask(st)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold">Submit</button>
                                                                    </div>
                                                                ) : st.status === 'Paused' ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-mono text-orange-600 font-bold">{formatSeconds(st.totalActiveSeconds)}</span>
                                                                        <button onClick={() => handleResumeSubtask(st)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Resume</button>
                                                                        <button onClick={() => handleSubmitSubtask(st)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold">Submit</button>
                                                                    </div>
                                                                ) : (
                                                                    <button onClick={() => handleStartSubtaskTimer(st)} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold shadow-sm">Start</button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {renderActivityHistory(selectedTask)}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Select a task to preview</div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {showPauseModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Pause Dry Run Task</h3>
                        <textarea className="w-full p-4 bg-gray-50 border rounded-xl mb-4" rows="3" placeholder="Reason..." value={pauseReason} onChange={e => setPauseReason(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPauseModal(false)} className="px-4 py-2 font-bold text-gray-500">Cancel</button>
                            <button onClick={() => { if (!pauseReason.trim()) return; if (pausingItem.type === 'sub') handlePauseSubtask(pausingItem.item, pauseReason); else handlePauseTask(pauseReason); setShowPauseModal(false); setPauseReason(""); }} className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {showReasonModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4 text-orange-600"><AlertCircle size={24} /><h3 className="text-lg font-bold">Timing Out of Bounds</h3></div>
                        <p className="text-sm text-gray-600 mb-4">{reasonType === 'min' ? 'Completed too fast.' : 'Took too long.'} Please explain why.</p>
                        <textarea className="w-full p-4 bg-gray-50 border rounded-xl mb-4" rows="3" value={reasonText} onChange={e => setReasonText(e.target.value)} />
                        <div className="flex justify-end gap-3"><button onClick={handleReasonCancel} className="px-4 py-2 font-bold text-gray-500">Cancel</button><button onClick={handleReasonSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Submit Reason</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ArrowDown = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

export default DryRunPage;
