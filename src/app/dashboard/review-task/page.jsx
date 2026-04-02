"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  Search,
  Loader2,
  X,
  FileText,
  Layers,
  Clock,
  AlertCircle,
  MessageSquare,
  RotateCcw,
  CheckCheck,
  User,
  Users,
} from "lucide-react";

const ReviewTaskPage = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Review state: which tasks/subtasks are checked for reopening
  const [checkedItems, setCheckedItems] = useState({}); // { "0-1": true, "0-1-0": true }
  const [reviewNotes, setReviewNotes] = useState({}); // { "0-1": "Please redo this", ... }
  const [workers, setWorkers] = useState([]);
  const [reassignedWorkers, setReassignedWorkers] = useState({}); // { "0-1": [{id, name}], ... }

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const data = JSON.parse(userData);
      setCompanyData(data);
    }
  }, []);

  const fetchAssignments = useCallback(async (isInitial = true) => {
    if (!companyData?.companyId) return;
    try {
      if (isInitial) setLoading(true);
      const res = await fetch(
        `/api/assignment/fetch-for-review/${companyData.companyId}`
      );
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch assignments for review:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [companyData]);

  useEffect(() => {
    if (companyData) {
      fetchAssignments();
      fetchWorkers();
      const interval = setInterval(() => fetchAssignments(false), 5000);
      return () => clearInterval(interval);
    }
  }, [companyData, fetchAssignments]);

  const fetchWorkers = async () => {
    if (!companyData?.companyId) return;
    try {
      const res = await fetch(`/api/task-execution/${companyData.companyId}`);
      const data = await res.json();
      if (data.users) {
        setWorkers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
  };


  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setCheckedItems({});
    setReviewNotes({});
    setReassignedWorkers({});
    // Expand all stages by default
    const expanded = {};
    assignment.prototypeData?.stages?.forEach((_, idx) => {
      expanded[`stage-${idx}`] = true;
    });
    setExpandedStages(expanded);
    setExpandedTasks({});
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setCheckedItems({});
    setReviewNotes({});
    setReassignedWorkers({});
  };

  const toggleStage = (stageKey) => {
    setExpandedStages((prev) => ({ ...prev, [stageKey]: !prev[stageKey] }));
  };

  const toggleTask = (taskKey) => {
    setExpandedTasks((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  // Toggle checkbox for a task or subtask
  const toggleCheck = (key) => {
    setCheckedItems((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
        // Also remove the note and reassigned worker
        setReviewNotes((prevNotes) => {
          const nn = { ...prevNotes };
          delete nn[key];
          return nn;
        });
        setReassignedWorkers((prevWorkers) => {
          const nw = { ...prevWorkers };
          delete nw[key];
          return nw;
        });
      } else {
        next[key] = true;
      }
      return next;
    });
  };

  // Update note for a specific item
  const updateNote = (key, note) => {
    setReviewNotes((prev) => ({ ...prev, [key]: note }));
  };

  const updateReassignedWorker = (key, workerId) => {
    if (!workerId) {
      setReassignedWorkers(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }
    const worker = workers.find(w => (w._id || w.id) === workerId);
    if (worker) {
      setReassignedWorkers(prev => ({
        ...prev,
        [key]: [{ id: worker._id || worker.id, name: worker.name }]
      }));
    }
  };

  const checkedCount = Object.keys(checkedItems).length;

  // Handle Approve All
  const handleApproveAll = async () => {
    if (!selectedAssignment) return;
    try {
      setSubmitting(true);
      const res = await fetch("/api/assignment/submit-review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          reviewerId: companyData?.id || companyData?._id,
          reviewerName: companyData?.name,
          action: "approve",
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to approve assignment");

      alert("Assignment approved successfully!");
      closeModal();
      fetchAssignments();
    } catch (err) {
      console.error("Error approving:", err);
      alert(err.message || "Failed to approve assignment");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Reopen Selected
  const handleReopenSelected = async () => {
    if (!selectedAssignment || checkedCount === 0) return;

    // Build reviewItems from checked items
    const reviewItems = [];
    const stages = selectedAssignment.prototypeData?.stages || [];

    Object.keys(checkedItems).forEach((key) => {
      const parts = key.split("-");
      const stageIndex = parseInt(parts[0]);
      const taskIndex = parseInt(parts[1]);
      const subtaskIndex = parts[2] !== undefined ? parseInt(parts[2]) : null;

      const stage = stages[stageIndex];
      const task = stage?.tasks?.[taskIndex];
      let taskTitle = task?.title || "Unknown Task";
      let taskPath = `stages.${stageIndex}.tasks.${taskIndex}`;

      if (subtaskIndex !== null) {
        const subtask = task?.subtasks?.[subtaskIndex];
        taskTitle = subtask?.title || "Unknown Subtask";
        taskPath += `.subtasks.${subtaskIndex}`;
      }

      reviewItems.push({
        stageIndex,
        taskIndex,
        subtaskIndex,
        taskTitle,
        taskPath,
        note: reviewNotes[key] || "",
        assignedWorker: reassignedWorkers[key] || null,
      });
    });

    try {
      setSubmitting(true);
      const res = await fetch("/api/assignment/submit-review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          reviewerId: companyData?.id || companyData?._id,
          reviewerName: companyData?.name,
          action: "reopen",
          reviewItems,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to reopen tasks");

      alert(`${reviewItems.length} task(s) reopened for rework!`);
      closeModal();
      fetchAssignments();
    } catch (err) {
      console.error("Error reopening tasks:", err);
      alert(err.message || "Failed to reopen tasks");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending Review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case "Rework Required":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <RotateCcw className="w-3 h-3" /> Rework Required
          </span>
        );
      case "Completed":
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((a) => {
        const name = a.prototypeData?.name || "";
        const equipment = a.prototypeData?.equipment?.name || "";
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equipment.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [assignments, searchTerm]);

  // Skeleton loader
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-gray-200 rounded-lg w-10 ml-auto"></div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-3xl shadow">
              <CheckCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Tasks</h1>
              <p className="text-gray-600 mt-1 text-md">
                Review completed assignments and approve or reopen tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => {
                  const totalTasks = assignment.prototypeData?.stages?.reduce(
                    (sum, s) => sum + (s.tasks?.length || 0), 0
                  ) || 0;
                  const status = assignment.reviewStatus || assignment.status;
                  return (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {assignment.prototypeData?.name || "Untitled"}
                            </div>
                            {assignment.prototypeData?.equipment?.name && (
                              <div className="text-xs text-gray-500 capitalize">
                                Equipment: {assignment.prototypeData.equipment.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{totalTasks}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(assignment.assignedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewAssignment(assignment)}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title="Review"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                <CheckCheck className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No assignments pending review
              </h3>
              <p className="text-gray-600">
                When workers send completed assignments for review, they will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedAssignment && (
        <div
          onClick={closeModal}
          className="fixed pl-64 inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-10"
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 pb-4 z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 capitalize">
                    {selectedAssignment.prototypeData?.name || "Untitled Assignment"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                    {selectedAssignment.prototypeData?.equipment?.name && (
                      <span className="flex items-center gap-1">
                        <Layers className="w-4 h-4" />
                        {selectedAssignment.prototypeData.equipment.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Assigned: {formatDate(selectedAssignment.assignedAt)}
                    </span>
                    {getStatusBadge(selectedAssignment.reviewStatus || selectedAssignment.status)}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Info Banner */}
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  <strong>Instructions:</strong> Review each task below. If you are not satisfied with any task or subtask,
                  check its checkbox and add a note explaining what needs to be redone. Then click "Reopen Selected" to send
                  those tasks back to the worker. Or click "Approve All" if everything looks good.
                </p>
              </div>

              {/* Selected count */}
              {checkedCount > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-rose-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{checkedCount} task(s) selected for reopening</span>
                </div>
              )}
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedAssignment.prototypeData?.stages?.map(
                (stage, stageIndex) => {
                  const stageKey = `stage-${stageIndex}`;
                  const isExpanded = expandedStages[stageKey];
                  const stageName =
                    stage.name || stage.title || `Stage ${stageIndex + 1}`;

                  return (
                    <div key={stageKey} className="mb-4">
                      {/* Stage Header */}
                      <div
                        className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-150 transition-colors"
                        onClick={() => toggleStage(stageKey)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800">
                            {stageName}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({stage.tasks?.length || 0} tasks)
                          </span>
                        </div>
                      </div>

                      {/* Tasks */}
                      {isExpanded && stage.tasks && (
                        <div className="mt-2 ml-4 space-y-3">
                          {stage.tasks.map((task, taskIndex) => {
                            const taskKey = `${stageIndex}-${taskIndex}`;
                            const taskId = task._id || task.taskId;
                            const hasSubtasks =
                              task.subtasks && task.subtasks.length > 0;
                            const isTaskExpanded = expandedTasks[taskKey];
                            const isChecked = !!checkedItems[taskKey];
                            const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;

                            return (
                              <div
                                key={taskKey}
                                className={`border-2 rounded-xl overflow-hidden transition-all ${isChecked
                                    ? "border-rose-300 bg-rose-50"
                                    : "border-gray-200 bg-white"
                                  }`}
                              >
                                {/* Task Header */}
                                <div className="p-4">
                                  <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <div className="pt-0.5">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleCheck(taskKey)}
                                        className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                                      />
                                    </div>

                                    {/* Task Info */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                          {taskNumber}
                                        </span>
                                        <span className={`font-medium ${isChecked ? 'text-rose-800' : 'text-gray-900'}`}>
                                          {task.title || "Untitled Task"}
                                        </span>
                                        {task.status === "completed" && (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                      </div>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                          {task.description}
                                        </p>
                                      )}
                                      {/* Completion info */}
                                      {task.completedBy && (
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                          <User className="w-3 h-3" />
                                          <span>
                                            Completed by{" "}
                                            <strong>{task.completedBy.name}</strong>{" "}
                                            at {formatDate(task.completedAt)}
                                          </span>
                                        </div>
                                      )}
                                      {/* Elapsed time */}
                                      {task.elapsedTime && (
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                          <Clock className="w-3 h-3" />
                                          <span>
                                            Duration: {Math.floor(task.elapsedTime / 60)}m {task.elapsedTime % 60}s
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Expand subtasks */}
                                    {hasSubtasks && (
                                      <button
                                        onClick={() => toggleTask(taskKey)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                      >
                                        {isTaskExpanded ? (
                                          <ChevronDown className="w-5 h-5" />
                                        ) : (
                                          <ChevronRight className="w-5 h-5" />
                                        )}
                                      </button>
                                    )}
                                  </div>

                                  {/* Note field when checked */}
                                  {isChecked && (
                                    <div className="mt-3 ml-7 space-y-3">
                                      <div className="flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 text-rose-500 mt-2 shrink-0" />
                                        <textarea
                                          value={reviewNotes[taskKey] || ""}
                                          onChange={(e) =>
                                            updateNote(taskKey, e.target.value)
                                          }
                                          placeholder="Add a note explaining what needs to be redone..."
                                          rows={2}
                                          className="flex-1 text-sm border border-rose-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white placeholder-rose-300"
                                        />
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-rose-500 shrink-0" />
                                        <select
                                          value={reassignedWorkers[taskKey]?.[0]?.id || ""}
                                          onChange={(e) => updateReassignedWorker(taskKey, e.target.value)}
                                          className="flex-1 text-sm border border-rose-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white text-rose-900"
                                        >
                                          <option value="">Select a worker to reassign (Optional)</option>
                                          {workers.map(worker => (
                                            <option key={worker._id || worker.id} value={worker._id || worker.id}>
                                              {worker.name} ({worker.role || 'Worker'})
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Subtasks */}
                                {hasSubtasks && isTaskExpanded && (
                                  <div className="border-t border-gray-100 bg-gray-50 p-4 ml-7 space-y-3">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                      Subtasks ({task.subtasks.length})
                                    </div>
                                    {task.subtasks.map(
                                      (subtask, subtaskIndex) => {
                                        const subKey = `${stageIndex}-${taskIndex}-${subtaskIndex}`;
                                        const isSubChecked = !!checkedItems[subKey];
                                        const subtaskNumber = `${taskNumber}.${subtaskIndex + 1}`;

                                        return (
                                          <div
                                            key={subKey}
                                            className={`p-3 rounded-lg border transition-all ${isSubChecked
                                                ? "border-rose-300 bg-rose-50"
                                                : "border-gray-200 bg-white"
                                              }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className="pt-0.5">
                                                <input
                                                  type="checkbox"
                                                  checked={isSubChecked}
                                                  onChange={() => toggleCheck(subKey)}
                                                  className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs text-gray-500">
                                                    {subtaskNumber}
                                                  </span>
                                                  <span className={`text-sm font-medium ${isSubChecked ? 'text-rose-800' : 'text-gray-800'}`}>
                                                    {subtask.title || "Untitled Subtask"}
                                                  </span>
                                                  {subtask.status === "completed" && (
                                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                                  )}
                                                </div>
                                                {subtask.description && (
                                                  <p className="text-xs text-gray-600 mt-1">
                                                    {subtask.description}
                                                  </p>
                                                )}
                                                {subtask.completedBy && (
                                                  <div className="text-xs text-gray-500 mt-1">
                                                    By: {subtask.completedBy.name}
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Subtask note */}
                                            {isSubChecked && (
                                              <div className="mt-2 ml-7 space-y-2">
                                                <textarea
                                                  value={reviewNotes[subKey] || ""}
                                                  onChange={(e) =>
                                                    updateNote(subKey, e.target.value)
                                                  }
                                                  placeholder="Note for this subtask..."
                                                  rows={1}
                                                  className="w-full text-sm border border-rose-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white placeholder-rose-300"
                                                />
                                                <div className="flex items-center gap-2">
                                                  <Users className="w-3 h-3 text-rose-500 shrink-0" />
                                                  <select
                                                    value={reassignedWorkers[subKey]?.[0]?.id || ""}
                                                    onChange={(e) => updateReassignedWorker(subKey, e.target.value)}
                                                    className="w-full text-[11px] border border-rose-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white text-rose-900"
                                                  >
                                                    <option value="">Reassign worker (Optional)</option>
                                                    {workers.map(worker => (
                                                      <option key={worker._id || worker.id} value={worker._id || worker.id}>
                                                        {worker.name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                {checkedCount > 0 ? (
                  <button
                    onClick={handleReopenSelected}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Reopening...</>
                    ) : (
                      <><RotateCcw className="w-4 h-4" /> Reopen {checkedCount} Task(s)</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleApproveAll}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Approving...</>
                    ) : (
                      <><CheckCheck className="w-4 h-4" /> Reviewed All</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTaskPage;
