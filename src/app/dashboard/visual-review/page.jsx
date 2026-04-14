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
  const [qaStatuses, setQaStatuses] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const data = JSON.parse(userData);
      setCompanyData(data);
    }
  }, []);

  const isVR = 
    companyData?.role === "SuperAdmin" || 
    companyData?.role?.toLowerCase()?.includes("production") || 
    companyData?.role?.toLowerCase()?.includes("visual") ||
    companyData?.task?.includes("Visual Review") ||
    companyData?.task?.includes("Visual Reviewer");

  const isQA = 
    companyData?.role === "SuperAdmin" || 
    companyData?.role?.toLowerCase()?.includes("qa") ||
    companyData?.task?.includes("QA");

  useEffect(() => {
    if (companyData) {
        console.log("VisualReview Debug - Role:", companyData.role);
        console.log("VisualReview Debug - Tasks:", companyData.task);
        console.log("VisualReview Debug - isVR:", isVR, "isQA:", isQA);
    }
  }, [companyData, isVR, isQA]);

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
        
        // If an assignment is selected, update its local data
        if (selectedAssignment) {
          const updated = data.data.find(a => a._id === selectedAssignment._id);
          if (updated) {
               // Update checkpoint statuses from the assignment's prototypeData
               const visualData = updated.prototypeData?.visualRepresntation || [];
               const vStatuses = {};
               const qStatuses = {};
               visualData.forEach((row, idx) => {
                 vStatuses[idx] = row.production || "";
                 qStatuses[idx] = row.qa || "";
               });
               setCheckpointStatuses(vStatuses);
               setQaStatuses(qStatuses);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch assignments for visual review:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [companyData, selectedAssignment]);

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
    
    // Initialize checkpoint statuses from visual representation data
    const visualData = assignment.prototypeData?.visualRepresntation || [];
    const vStatuses = {};
    const qStatuses = {};
    visualData.forEach((row, idx) => {
      vStatuses[idx] = row.production || "";
      qStatuses[idx] = row.qa || "";
    });
    setCheckpointStatuses(vStatuses);
    setQaStatuses(qStatuses);

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
    setQaStatuses({});
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

  const hasNotClean = Object.values(checkpointStatuses).some(s => s === "Not Clean") || Object.values(qaStatuses).some(s => s === "Not Clean");

  // Check if all checkpoints are filled and Clean/NA
  const isEverythingClean = useMemo(() => {
    if (!selectedAssignment) return false;
    const visualData = selectedAssignment.prototypeData?.visualRepresntation || [];
    if (visualData.length === 0) return true;
    return visualData.every((_, idx) => 
      (checkpointStatuses[idx] === "Clean" || checkpointStatuses[idx] === "NA") &&
      (qaStatuses[idx] === "Clean" || qaStatuses[idx] === "NA")
    );
  }, [selectedAssignment, checkpointStatuses, qaStatuses]);

  // Handle Approve All
  const handleApproveAll = async () => {
    if (!selectedAssignment) return;

    if (!isEverythingClean) {
      alert("Cannot approve — some checkpoints are not marked as 'Clean' or 'NA' by both Production and QA.");
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
          note: "All visual checkpoints approved by Production and QA.",
          companyId: companyData.companyId
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to approve assignment");

      alert("Visual & QA review approved — assignment completed!");
      closeModal();
      fetchAssignments();
    } catch (err) {
      console.error("Error approving:", err);
      alert(err.message || "Failed to approve assignment");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle individual status update
  const updateCheckpointStatus = async (idx, field, value) => {
    try {
      const res = await fetch("/api/assignment/update-visual-checkpoint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          recordId: idx,
          field: field,
          value: value,
          reviewerId: companyData?.id || companyData?._id,
          reviewerName: companyData?.name,
          companyId: companyData.companyId
        })
      });
      const data = await res.json();
      if (data.success) {
        if (field === "production") {
            setCheckpointStatuses(prev => ({ ...prev, [idx]: value }));
        } else {
            setQaStatuses(prev => ({ ...prev, [idx]: value }));
        }
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (err) {
      console.error("Update failed:", err);
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
          companyId: companyData.companyId
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
              <h1 className="text-2xl font-bold text-gray-900">Visual & QA Review</h1>
              <p className="text-gray-600 mt-1 text-md">
                Inspect visual checkpoints and provide production & QA remarks
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col"
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
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      User Role: {companyData?.role || "Unknown"}
                    </span>
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
                  <strong>Workflow:</strong> {isVR ? "You are a Visual Reviewer. " : isQA ? "You are a QA Reviewer. " : ""}
                  QA can only remark after Visual Reviewer marks a record as Clean or NA. 
                  Records must be completed sequentially.
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
              {/* Visual Representation Cards */}
              {selectedAssignment.prototypeData?.visualRepresntation?.length > 0 ? (
                <div className="mb-8 bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-amber-600" />
                    </div>
                    Visual & QA Checkpoints
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {selectedAssignment.prototypeData.visualRepresntation.map((checkpoint, idx) => {
                          const isVREnabled = isVR && (idx === 0 || (checkpointStatuses[idx-1] === "Clean" || checkpointStatuses[idx-1] === "NA"));
                          const isQAEnabled = isQA && (checkpointStatuses[idx] === "Clean" || checkpointStatuses[idx] === "NA") && (idx === 0 || (qaStatuses[idx-1] === "Clean" || qaStatuses[idx-1] === "NA"));
                          
                          const renderSegmentedControl = (currentVal, disabled, onChange, type="production") => {
                             const options = [
                                { label: "Clean", value: "Clean", color: "green" },
                                { label: "Not Clean", value: "Not Clean", color: "rose" },
                                { label: "NA", value: "NA", color: "blue" }
                             ];
                             return (
                                <div className={`flex rounded-lg overflow-hidden border ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''} ${type === 'production' ? 'border-orange-200' : 'border-blue-200'}`}>
                                    {options.map(opt => {
                                        const isSelected = currentVal === opt.value;
                                        const activeBg = opt.color === 'green' ? 'bg-green-500 text-white' : opt.color === 'rose' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white';
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => onChange(opt.value)}
                                                className={`flex-1 py-2 text-xs font-bold transition-colors border-r last:border-r-0 ${type === 'production' ? 'border-orange-100' : 'border-blue-100'} ${isSelected ? activeBg : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        )
                                    })}
                                </div>
                             )
                          };

                          return (
                            <div key={idx} className={`flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${
                                (checkpointStatuses[idx] === "Not Clean" || qaStatuses[idx] === "Not Clean") ? "border-rose-300 ring-1 ring-rose-200" : "border-gray-200"
                            }`}>
                              {/* Header */}
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-start gap-3">
                                 <div className="flex-shrink-0 w-7 h-7 bg-amber-100 text-amber-700 font-bold text-sm rounded-full flex items-center justify-center mt-0.5">
                                    {idx + 1}
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-semibold text-gray-900 text-sm leading-tight">{checkpoint.checkPoint?.title || "Untitled"}</h4>
                                     <div className="flex flex-col gap-1.5 mt-3">
                                        {checkpoint.completedBy?.production && (
                                            <div className="text-[10px] bg-orange-50 text-orange-800 px-2.5 py-1 rounded-md border border-orange-100 flex justify-between items-center">
                                                <span><strong className="font-bold">VR:</strong> {checkpoint.completedBy.production.name}</span>
                                                <span className="text-orange-600/70">{formatDate(checkpoint.completedBy.production.at)}</span>
                                            </div>
                                        )}
                                        {checkpoint.completedBy?.qa && (
                                            <div className="text-[10px] bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-100 flex justify-between items-center">
                                                <span><strong className="font-bold">QA:</strong> {checkpoint.completedBy.qa.name}</span>
                                                <span className="text-blue-600/70">{formatDate(checkpoint.completedBy.qa.at)}</span>
                                            </div>
                                        )}
                                     </div>
                                 </div>
                              </div>
                              
                              {/* Body (Images) */}
                              <div className="p-4 flex-1">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Reference Images</div>
                                 <div className="flex flex-wrap gap-3">
                                     {checkpoint.checkPoint?.images?.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative group overflow-hidden rounded-lg border border-gray-200 w-[72px] h-[72px] shadow-sm">
                                            <img
                                              src={img.url}
                                              alt={img.title}
                                              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                                              onClick={() => window.open(img.url, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                        </div>
                                      ))}
                                      {(!checkpoint.checkPoint?.images || checkpoint.checkPoint.images.length === 0) && (
                                        <div className="text-xs text-gray-400 italic bg-gray-50 rounded-lg p-4 w-full text-center border border-gray-100 border-dashed">No images available</div>
                                      )}
                                 </div>
                              </div>
                              
                              {/* Footer (Controls) */}
                              <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-4">
                                  <div>
                                      <div className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mb-2 flex items-center justify-between pl-1">
                                        <span>Visual Reviewer</span>
                                        {checkpointStatuses[idx] && <span className={`capitalize ${checkpointStatuses[idx] === 'Clean' ? 'text-green-600' : checkpointStatuses[idx] === 'Not Clean' ? 'text-rose-600' : 'text-blue-600'}`}>{checkpointStatuses[idx]}</span>}
                                      </div>
                                      {renderSegmentedControl(checkpointStatuses[idx], !isVREnabled, (val) => updateCheckpointStatus(idx, "production", val), "production")}
                                  </div>
                                  <div className="h-px bg-gray-200/60 w-full relative">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-gray-50 px-2 text-[8px] text-gray-400 font-bold uppercase tracking-widest">AND</div>
                                      </div>
                                  </div>
                                  <div>
                                      <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-2 flex items-center justify-between pl-1">
                                        <span>QA Remark</span>
                                        {qaStatuses[idx] && <span className={`capitalize ${qaStatuses[idx] === 'Clean' ? 'text-green-600' : qaStatuses[idx] === 'Not Clean' ? 'text-rose-600' : 'text-blue-600'}`}>{qaStatuses[idx]}</span>}
                                      </div>
                                      {renderSegmentedControl(qaStatuses[idx], !isQAEnabled, (val) => updateCheckpointStatus(idx, "qa", val), "qa")}
                                  </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-2xl border border-gray-200 border-dashed">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                    <ShieldCheck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Visual Checkpoints</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    This assignment does not contain any visual representation checkpoints to review. You can proceed to final approval.
                  </p>
                </div>
              )}

              {/* Tasks Section — for reopening */}
              {hasNotClean && (
                <div className="mb-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-rose-600" />
                    Select Tasks to Reopen (Rework Required)
                  </h3>

                  {/* Shared note for all reopened tasks */}
                  <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                    <label className="block text-sm font-semibold text-rose-800 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Rework Note (Applied to all selected tasks) *
                    </label>
                    <textarea
                      value={sharedNote}
                      onChange={(e) => setSharedNote(e.target.value)}
                      placeholder="Explain what needs to be fixed..."
                      rows={2}
                      className="w-full text-sm border border-rose-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white placeholder-rose-300 shadow-inner"
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
                                    isChecked ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white shadow-sm"
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
                                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ring-1 ring-gray-200">{taskNumber}</span>
                                          <span className={`font-semibold ${isChecked ? 'text-rose-800' : 'text-gray-900'}`}>
                                            {task.title || "Untitled Task"}
                                          </span>
                                          {task.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </div>
                                        {task.description && (
                                          <p className="text-sm text-gray-600 mt-1 italic line-clamp-2">{task.description}</p>
                                        )}
                                        {task.completedBy && (
                                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <User className="w-3 h-3" />
                                            <span>Done by <strong>{task.completedBy.name}</strong> @ {formatDate(task.completedAt)}</span>
                                          </div>
                                        )}
                                      </div>
                                      {hasSubtasks && (
                                        <button onClick={() => toggleTask(taskKey)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                                          {isTaskExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {hasSubtasks && isTaskExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4 ml-7 space-y-3">
                                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                          <Layers className="w-3 h-3" /> Subtasks ({task.subtasks.length})
                                      </div>
                                      {task.subtasks.map((subtask, subtaskIndex) => {
                                        const subKey = `${stageIndex}-${taskIndex}-${subtaskIndex}`;
                                        const isSubChecked = !!checkedItems[subKey];

                                        return (
                                          <div
                                            key={subKey}
                                            className={`p-3 rounded-lg border transition-all ${
                                              isSubChecked ? "border-rose-300 bg-rose-50 shadow-inner" : "border-gray-200 bg-white"
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
                                                  <span className="text-[10px] font-bold text-gray-400">{taskNumber}.{subtaskIndex + 1}</span>
                                                  <span className={`text-sm font-medium ${isSubChecked ? 'text-rose-800' : 'text-gray-800'}`}>
                                                    {subtask.title || "Untitled Subtask"}
                                                  </span>
                                                  {subtask.status === "completed" && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                </div>
                                                {subtask.completedBy && (
                                                  <div className="text-[10px] text-gray-500 mt-1">By: {subtask.completedBy.name}</div>
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
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pt-4 z-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-all"
                >
                  Close
                </button>
                <div className="flex items-center gap-4">
                  {checkedCount > 0 && (
                    <button
                      onClick={handleReopenSelected}
                      disabled={submitting}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-xl hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-200 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Reopen {checkedCount} Items
                    </button>
                  )}
                  <button
                    onClick={handleApproveAll}
                    disabled={submitting || !isEverythingClean}
                    className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 disabled:opacity-50 disabled:grayscale flex items-center gap-2 transition-all active:scale-95"
                    title={!isEverythingClean ? "All Production & QA remarks must be Clean or NA to Approve All" : "Approve and Complete Assignment"}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    Final Approve All
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
