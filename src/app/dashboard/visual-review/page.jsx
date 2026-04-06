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
  ShieldCheck,
} from "lucide-react";

const VisualReviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Visual review state
  const [checkedItems, setCheckedItems] = useState({});
  const [sharedNote, setSharedNote] = useState("");
  const [workers, setWorkers] = useState([]);

  // Visual representation checkpoint statuses
  const [checkpointStatuses, setCheckpointStatuses] = useState({});

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
        `/api/assignment/fetch-for-visual-review/${companyData.companyId}`
      );
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch assignments for visual review:", err);
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
    setSharedNote("");
    setCheckpointStatuses({});

    // Initialize checkpoint statuses from visual representation data
    const visualData = assignment.prototypeData?.visualRepresntation || [];
    const initStatuses = {};
    visualData.forEach((_, idx) => {
      initStatuses[idx] = ""; // Start as empty/pending
    });
    setCheckpointStatuses(initStatuses);

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
    setSharedNote("");
    setCheckpointStatuses({});
  };

  const toggleStage = (stageKey) => {
    setExpandedStages((prev) => ({ ...prev, [stageKey]: !prev[stageKey] }));
  };

  const toggleTask = (taskKey) => {
    setExpandedTasks((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  // Toggle checkbox for a task or subtask
  const toggleCheck = (key) => {
    const parts = key.split("-");
    const isMainTask = parts.length === 2;

    setCheckedItems((prev) => {
      const next = { ...prev };
      const newValue = !next[key];

      if (newValue) {
        next[key] = true;
      } else {
        delete next[key];
      }

      // If it's a main task, also toggle all of its subtasks
      if (isMainTask && selectedAssignment) {
        const stageIndex = parseInt(parts[0]);
        const taskIndex = parseInt(parts[1]);
        const subtasks = selectedAssignment.prototypeData?.stages?.[stageIndex]?.tasks?.[taskIndex]?.subtasks || [];

        subtasks.forEach((_, subIndex) => {
          const subKey = `${stageIndex}-${taskIndex}-${subIndex}`;
          if (newValue) {
            next[subKey] = true;
          } else {
            delete next[subKey];
          }
        });
      }

      return next;
    });
  };

  const checkedCount = Object.keys(checkedItems).length;

  const hasNotClean = Object.values(checkpointStatuses).some(s => s === "Not Clean");

  // Handle Approve All
  const handleApproveAll = async () => {
    if (!selectedAssignment) return;

    // Check if any checkpoint is "Not Clean"
    if (hasNotClean) {
      alert("Cannot approve — some checkpoints are marked as 'Not Clean'. Please reopen the related tasks first.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/assignment/submit-production-review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          reviewerId: companyData?.id || companyData?._id,
          reviewerName: companyData?.name,
          action: "approve",
          note: "All visual checkpoints approved as Clean",
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to approve assignment");

      alert("Visual review approved — assignment completed!");
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

    if (!sharedNote.trim()) {
      alert("Please add a note explaining what needs to be redone.");
      return;
    }

    // Build reopenItems from checked items
    const reopenItems = [];
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

      reopenItems.push({
        stageIndex,
        taskIndex,
        subtaskIndex,
        taskTitle,
        taskPath,
      });
    });

    try {
      setSubmitting(true);
      const res = await fetch("/api/assignment/submit-production-review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          reviewerId: companyData?.id || companyData?._id,
          reviewerName: companyData?.name,
          action: "reopen",
          note: sharedNote,
          reopenItems,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to reopen tasks");

      alert(`${reopenItems.length} task(s) reopened for rework!`);
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
      case "Pending Visual Review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ShieldCheck className="w-3 h-3" /> Pending Visual Review
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
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded-lg w-10 ml-auto"></div></td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl shadow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visual Review</h1>
              <p className="text-gray-600 mt-1 text-md">
                Inspect visual checkpoints and approve or reopen tasks
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
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
                  const status = assignment.visualReviewStatus || assignment.status;
                  return (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-600" />
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
                      <td className="px-6 py-4">{getStatusBadge(status)}</td>
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
                          className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                          title="Visual Review"
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No assignments pending visual review
              </h3>
              <p className="text-gray-600">
                When reviewers approve assignments with visual representation enabled, they will appear here for visual inspection.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Visual Review Modal */}
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
                    {getStatusBadge(selectedAssignment.visualReviewStatus || selectedAssignment.status)}
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
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Visual Inspection:</strong> Review the visual checkpoints below and mark each as Clean or Not Clean.
                  If any checkpoint is Not Clean, select the related tasks to reopen and add a single note for all.
                  Then click "Reopen Selected" to send them back for rework.
                </p>
              </div>

              {checkedCount > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-rose-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{checkedCount} task(s) selected for reopening</span>
                </div>
              )}
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Visual Representation Table */}
              {selectedAssignment.prototypeData?.visualRepresntation?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    Visual Representation Checkpoints
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">#</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Check Point</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Images</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAssignment.prototypeData.visualRepresntation.map((checkpoint, idx) => (
                          <tr key={idx} className={`border-b border-gray-200 ${checkpointStatuses[idx] === "Not Clean" ? "bg-rose-50" : "hover:bg-gray-50"}`}>
                            <td className="py-3 px-4 text-sm text-gray-500 font-medium">{idx + 1}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                              {checkpoint.checkPoint?.title || "Untitled"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-2">
                                {checkpoint.checkPoint?.images?.map((img, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={img.url}
                                    alt={img.title || `Image ${imgIdx + 1}`}
                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                                    onClick={() => window.open(img.url, '_blank')}
                                  />
                                ))}
                                {(!checkpoint.checkPoint?.images || checkpoint.checkPoint.images.length === 0) && (
                                  <span className="text-xs text-gray-400">No images</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                disabled={idx > 0 && checkpointStatuses[idx - 1] !== "Clean"}
                                value={checkpointStatuses[idx] || ""}
                                onChange={(e) => setCheckpointStatuses(prev => ({ ...prev, [idx]: e.target.value }))}
                                className={`text-sm border rounded-lg px-3 py-1.5 focus:ring-2 transition-colors ${idx > 0 && checkpointStatuses[idx - 1] !== "Clean" ? "opacity-40 cursor-not-allowed bg-gray-100" : ""} ${
                                  checkpointStatuses[idx] === "Not Clean"
                                    ? "border-rose-300 bg-rose-50 text-rose-800 focus:ring-rose-500"
                                    : checkpointStatuses[idx] === "Clean"
                                    ? "border-green-300 bg-green-50 text-green-800 focus:ring-green-500"
                                    : "border-gray-300 bg-white text-gray-500 focus:ring-amber-500"
                                }`}
                              >
                                <option value="" disabled>Select Status</option>
                                <option value="Clean">✓ Clean</option>
                                <option value="Not Clean">✗ Not Clean</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tasks Section — for reopening */}
              {hasNotClean && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-rose-600" />
                    Select Tasks to Reopen
                  </h3>

                  {/* Shared note for all reopened tasks */}
                  <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                    <label className="block text-sm font-semibold text-rose-800 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Shared Note for All Reopened Tasks *
                    </label>
                    <textarea
                      value={sharedNote}
                      onChange={(e) => setSharedNote(e.target.value)}
                      placeholder="Describe what needs to be redone — this note applies to all selected tasks..."
                      rows={3}
                      className="w-full text-sm border border-rose-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white placeholder-rose-300"
                    />
                  </div>

                  {selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
                    const stageKey = `stage-${stageIndex}`;
                    const isExpanded = expandedStages[stageKey];
                    const stageName = stage.name || stage.title || `Stage ${stageIndex + 1}`;

                    return (
                      <div key={stageKey} className="mb-4">
                        <div
                          className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-150 transition-colors"
                          onClick={() => toggleStage(stageKey)}
                        >
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">{stageName}</span>
                            <span className="text-xs text-gray-500 ml-2">({stage.tasks?.length || 0} tasks)</span>
                          </div>
                        </div>

                        {isExpanded && stage.tasks && (
                          <div className="mt-2 ml-4 space-y-3">
                            {stage.tasks.map((task, taskIndex) => {
                              const taskKey = `${stageIndex}-${taskIndex}`;
                              const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                              const isTaskExpanded = expandedTasks[taskKey];
                              const isChecked = !!checkedItems[taskKey];
                              const taskNumber = `${stageIndex + 1}.${taskIndex + 1}`;

                              return (
                                <div
                                  key={taskKey}
                                  className={`border-2 rounded-xl overflow-hidden transition-all ${
                                    isChecked ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <div className="p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="pt-0.5">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => toggleCheck(taskKey)}
                                          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{taskNumber}</span>
                                          <span className={`font-medium ${isChecked ? 'text-rose-800' : 'text-gray-900'}`}>
                                            {task.title || "Untitled Task"}
                                          </span>
                                          {task.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </div>
                                        {task.description && (
                                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        {task.completedBy && (
                                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <User className="w-3 h-3" />
                                            <span>Completed by <strong>{task.completedBy.name}</strong> at {formatDate(task.completedAt)}</span>
                                          </div>
                                        )}
                                      </div>
                                      {hasSubtasks && (
                                        <button onClick={() => toggleTask(taskKey)} className="p-1 text-gray-500 hover:text-gray-700">
                                          {isTaskExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {hasSubtasks && isTaskExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4 ml-7 space-y-3">
                                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Subtasks ({task.subtasks.length})
                                      </div>
                                      {task.subtasks.map((subtask, subtaskIndex) => {
                                        const subKey = `${stageIndex}-${taskIndex}-${subtaskIndex}`;
                                        const isSubChecked = !!checkedItems[subKey];

                                        return (
                                          <div
                                            key={subKey}
                                            className={`p-3 rounded-lg border transition-all ${
                                              isSubChecked ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"
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
                                                  <span className="text-xs text-gray-500">{taskNumber}.{subtaskIndex + 1}</span>
                                                  <span className={`text-sm font-medium ${isSubChecked ? 'text-rose-800' : 'text-gray-800'}`}>
                                                    {subtask.title || "Untitled Subtask"}
                                                  </span>
                                                  {subtask.status === "completed" && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                </div>
                                                {subtask.completedBy && (
                                                  <div className="text-xs text-gray-500 mt-1">By: {subtask.completedBy.name}</div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pt-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {checkedCount > 0 && (
                    <button
                      onClick={handleReopenSelected}
                      disabled={submitting}
                      className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500 rounded-lg hover:from-rose-600 hover:to-red-600 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Reopen {checkedCount} Task(s)
                    </button>
                  )}
                  <button
                    onClick={handleApproveAll}
                    disabled={submitting || hasNotClean}
                    className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
                    title={hasNotClean ? "Cannot approve while checkpoints are marked Not Clean" : "Approve all checkpoints"}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    Approve All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualReviewPage;
