"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Play, Eye, Clock, User, Package, Hash, Zap, Sparkles, Loader2, MoreVertical, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const TaskExecutionPage = () => {
  const router = useRouter();
  // Dummy data for task executions
  const [tasks, setTasks] = useState([
    // {
    //   _id: '1',
    //   generatedId: 'TE-001',
    //   equipment: {
    //     name: 'Microscope X200',
    //     barcode: 'MBX200-001',
    //   },
    //   prototypeData: {
    //     name: 'Cell Analysis',
    //     status: 'pending'
    //   },
    //   assignedTo: 'John Doe',
    //   deadline: '2023-12-31'
    // },
    // {
    //   _id: '2',
    //   generatedId: 'TE-002',
    //   equipment: {
    //     name: 'Centrifuge C100',
    //     barcode: 'CFC100-001',
    //   },
    //   prototypeData: {
    //     name: 'Sample Processing',
    //     status: 'in-progress'
    //   },
    //   assignedTo: 'Jane Smith',
    //   deadline: '2023-12-15'
    // },
    // {
    //   _id: '3',
    //   generatedId: 'TE-003',
    //   equipment: {
    //     name: 'Spectrometer S500',
    //     barcode: 'SPS500-001',
    //   },
    //   prototypeData: {
    //     name: 'Chemical Analysis',
    //     status: 'completed'
    //   },
    //   assignedTo: 'Mike Johnson',
    //   deadline: '2023-12-10'
    // }
  ]);

  const handleExecuteTask = (taskId) => {
    console.log('Executing task:', taskId);
    // router.push('/dashboard/task-execution/demo');
    router.push(`/dashboard/task-execution/execution/${taskId}`);
    // Router navigation would go here
  };
  const [userData, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleDownloadPDF = (task) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // --- PAGE 1: SUMMARY ---
    // Header
    doc.setFontSize(24);
    doc.setTextColor(33, 150, 243); // Blue theme
    doc.text('Task Execution Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(1);
    doc.line(20, 25, pageWidth - 20, 25);
    
    // Summary Section
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Assignment ID: ${task.generatedId}`, 20, 32);
    doc.text(`Status: ${task.status}`, 20, 37);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 32, { align: 'right' });
    
    autoTable(doc, {
      startY: 45,
      head: [['General Information', 'Details']],
      body: [
        ['Prototype/SOP Name', task.prototypeData.name],
        ['Equipment Name', task.equipment.name],
        ['Equipment Barcode', task.equipment.barcode || task.equipment.assetTag || task.equipment.equipmentId || 'N/A'],
        ['Assigned Worker', task.assignedTo?.name || userData?.name || 'N/A'],
        ['Total Stages', task.prototypeData.stages?.length || 0],
        ['Completed By', task.completedBy?.name || (task.status === 'Completed' ? userData?.name : 'N/A')],
        ['Overall Review Status', task.reviewStatus || 'Approved'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
    });

    // --- TASK PROGRESS TABLE ---
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Individual Task Status', 20, doc.lastAutoTable.finalY + 15);

    const taskDataTable = [];
    const stages = task.prototypeData.stages || [];
    stages.forEach((stage, sIdx) => {
      if (stage.tasks) {
        stage.tasks.forEach((t, tIdx) => {
          const taskNum = `${sIdx + 1}.${tIdx + 1}`;
          taskDataTable.push([
            taskNum,
            t.title,
            t.status.toUpperCase(),
            t.totalActiveSeconds ? `${Math.floor(t.totalActiveSeconds / 60)}m ${t.totalActiveSeconds % 60}s` : '0s',
            t.completedAt ? new Date(t.completedAt).toLocaleString() : '-'
          ]);
          
          if (t.subtasks && t.subtasks.length > 0) {
            t.subtasks.forEach((st, stIdx) => {
              taskDataTable.push([
                `   ${taskNum}.${stIdx + 1}`,
                `   - ${st.title}`,
                st.status.toLowerCase(),
                st.totalActiveSeconds ? `${Math.floor(st.totalActiveSeconds / 60)}m ${st.totalActiveSeconds % 60}s` : '0s',
                st.completedAt ? new Date(st.completedAt).toLocaleString() : '-'
              ]);
            });
          }
        });
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Ref', 'Task / Subtask Title', 'Status', 'Duration', 'Finished At']],
      body: taskDataTable,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 15 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
      },
    });

    // --- PAGE 2: ACTIVITY TIMELINE ---
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text('Detailed Activity Timeline', 20, 20);
    doc.line(20, 23, pageWidth - 20, 23);

    const timelineData = [];
    stages.forEach((stage, sIdx) => {
      stage.tasks?.forEach((t, tIdx) => {
        const taskRef = `${sIdx + 1}.${tIdx + 1} ${t.title}`;
        // Main Task Sessions
        t.sessions?.forEach((sess, sI) => {
          timelineData.push([new Date(sess.startedAt), taskRef, sI === 0 ? 'STARTED' : 'RESUMED', sess.workerName, '-']);
          timelineData.push([new Date(sess.endedAt || t.completedAt), taskRef, (sI === t.sessions.length - 1 && t.status === 'completed') ? 'COMPLETED' : 'PAUSED', sess.workerName, sess.pauseReason || (sI === t.sessions.length - 1 ? t.reason?.text : '') || '-']);
        });
        // Subtask Sessions
        t.subtasks?.forEach((st, stI) => {
          const subRef = `${sIdx + 1}.${tIdx + 1}.${stI + 1} ${st.title}`;
          st.sessions?.forEach((sess, sI) => {
            timelineData.push([new Date(sess.startedAt), subRef, sI === 0 ? 'STARTED' : 'RESUMED', sess.workerName, '-']);
            timelineData.push([new Date(sess.endedAt || st.completedAt), subRef, (sI === st.sessions.length - 1 && st.status === 'completed') ? 'COMPLETED' : 'PAUSED', sess.workerName, sess.pauseReason || (sI === st.sessions.length - 1 ? st.reason?.text : '') || '-']);
          });
        });
      });
    });

    // Filter out invalid dates and sort
    const sortedTimeline = timelineData
      .filter(item => !isNaN(item[0].getTime()))
      .sort((a, b) => a[0] - b[0])
      .map(item => [item[0].toLocaleString(), item[1], item[2], item[3], item[4]]);

    autoTable(doc, {
      startY: 30,
      head: [['Timestamp', 'Item', 'Action', 'Worker', 'Reason / Note']],
      body: sortedTimeline,
      theme: 'striped',
      headStyles: { fillColor: [46, 125, 50] }, // Green for history
      styles: { fontSize: 7 },
    });

    // --- PAGE 3: REVIEW & EXCEPTIONS (If applicable) ---
    const exceptions = [];
    stages.forEach(s => s.tasks?.forEach(t => {
      if (t.reason) exceptions.push([t.title, t.reason.type === 'min' ? 'Early Completion' : 'Late Completion', t.reason.text]);
      t.subtasks?.forEach(st => {
        if (st.reason) exceptions.push([st.title, st.reason.type === 'min' ? 'Early Completion' : 'Late Completion', st.reason.text]);
      });
    }));

    if (exceptions.length > 0 || (task.reviewNotes && task.reviewNotes.length > 0)) {
      doc.addPage();
      let currentY = 20;

      if (exceptions.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(211, 47, 47); // Red for exceptions
        doc.text('Execution Exceptions', 20, currentY);
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Item Name', 'Constraint Violation', 'Worker Explanation']],
          body: exceptions,
          theme: 'grid',
          headStyles: { fillColor: [211, 47, 47] },
          styles: { fontSize: 8 },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      }

      if (task.reviewNotes && task.reviewNotes.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(156, 39, 176); // Purple for review
        doc.text('Review Feedback History', 20, currentY);
        const reviewRows = task.reviewNotes.map(rn => [
          new Date(rn.reviewedAt).toLocaleString(),
          rn.taskTitle || 'Entire SOP',
          rn.note || 'No notes',
          rn.reopened ? 'REWORK REQ.' : 'APPROVED',
          rn.reviewedBy?.name || 'Admin'
        ]);
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Date', 'Target', 'Comment', 'Decision', 'Reviewer']],
          body: reviewRows,
          theme: 'striped',
          headStyles: { fillColor: [156, 39, 176] },
          styles: { fontSize: 8 },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      }

      if (task.visualReviewNotes && task.visualReviewNotes.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(255, 152, 0); // Amber for visual review
        doc.text('Visual Review Feedback History', 20, currentY);
        const visualReviewRows = task.visualReviewNotes.map(vrn => [
          new Date(vrn.reviewedAt).toLocaleString(),
          vrn.taskTitle || 'Visual Inspection',
          vrn.note || 'No notes',
          'NOT CLEAN',
          vrn.reviewedBy?.name || 'Production Manager'
        ]);
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Date', 'Target', 'Comment', 'Decision', 'Reviewer']],
          body: visualReviewRows,
          theme: 'striped',
          headStyles: { fillColor: [255, 152, 0] },
          styles: { fontSize: 8 },
        });
      }
    }

    // --- FOOTER ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Digital Record: ${task.generatedId} | Page ${i} of ${totalPages} | Authenticated by SOP Management System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    doc.save(`Detailed_SOP_Report_${task.generatedId}.pdf`);
    setOpenMenuId(null);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setUser(data);

      setLoading(true);

      // ✅ call fetch here after setting
      fetch(`/api/assignment/execution/${data.companyId}/${data.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Assignments:", data);
          setTasks(data);
        })
        .catch((err) => console.error("Error:", err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);


  //  const fetchAssignment = async () => {
  //   try {
  //     const res = await fetch(`/api/assignments/${userData?.companyId}/${userData?.id}`);
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch assignments");
  //     }
  //     const data = await res.json();
  //     console.log("Assignments:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  //   useEffect(()=>{
  //     fetchAssignment();
  //   },[userData])



  const handleViewTask = (taskId) => {
    console.log('Viewing task:', taskId);
    // Router navigation would go here
  };

  const getStatusConfig = (task) => {
    const status = task.status;
    const hasReason = !!task.reason;

    switch (status) {
      case 'Completed':
        if (hasReason) {
          return {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            icon: 'ℹ️',
            label: 'Completed with Exception'
          };
        }
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: '✅',
          label: 'Completed'
        };
      case 'Under Execution':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: '🔄',
          label: 'In Progress'
        };
      case 'Paused':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          icon: '⏸️',
          label: 'Paused'
        };
      case 'Pending Review':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: '🔍',
          label: 'Pending Review'
        };
      case 'Rework Required':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: '🔄',
          label: 'Rework Required'
        };
      default:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-200',
          icon: '⏳',
          label: 'Pending'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-2 py-2">
        <div className="bg-white border-b border-gray-200 rounded-xl  mt-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Execution Workspace</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and Execute your assigned task </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Card Container */}
        <div className="bg-white mt-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Active Tasks</h2>
              </div>
              <div className="text-sm text-gray-500">
                {!loading && `${tasks.length} tasks total`}
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Loader vs Table vs Empty State */}
          <div className="overflow-x-auto">
            {loading ? (
              /* --- LOADER STATE --- */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Fetching your tasks...</p>
              </div>
            ) : tasks.length > 0 ? (
              /* --- TABLE STATE --- */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Equipment
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Prototype
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => {
                    const statusConfig = getStatusConfig(task);
                    return (
                      <tr
                        key={task._id}
                        className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                          }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {task.equipment.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-gray-900">
                            {task.prototypeData.name}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {task.generatedId}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-medium w-fit ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                            {task.status === 'Completed' && task.completedBy && (
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="font-medium text-gray-700">By:</span> {task.completedBy.name}<br />
                                <span className="font-medium text-gray-700">At:</span> {new Date(task.completedAt).toLocaleString()}
                                {task.reason && (
                                  <div className="mt-1 text-amber-600 italic">
                                    Reason: {task.reason.text}
                                  </div>
                                )}
                              </div>
                            )}
                            {task.status === 'Under Execution' && task.startedBy && (
                              <div className="text-xs text-blue-500 mt-1">
                                <span className="font-medium">Started by:</span> {task.startedBy.name}<br />
                                <span className="font-medium">At:</span> {new Date(task.startedAt).toLocaleString()}
                              </div>
                            )}
                            {task.status === 'Paused' && (
                              <div className="text-xs text-orange-500 mt-1">
                                <span className="font-medium">Paused at:</span> {new Date(task.pausedAt).toLocaleString()}<br />
                                {task.totalActiveSeconds && <span>🕒 Total: {Math.floor(task.totalActiveSeconds / 60)}m {task.totalActiveSeconds % 60}s</span>}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExecuteTask(task._id)}
                              disabled={task.status === 'Pending Review'}
                              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow ${task.status === 'Completed'
                                ? 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                : task.status === 'Pending Review'
                                  ? 'text-purple-600 bg-purple-50 border border-purple-200 cursor-not-allowed opacity-70'
                                  : task.status === 'Rework Required'
                                    ? 'text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 border border-transparent'
                                    : task.status === 'Under Execution' && (task.lockedBy?.id || task.startedBy?.id) !== (userData?.id || userData?._id)
                                      ? 'text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100'
                                      : task.status === 'Paused'
                                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border border-transparent'
                                        : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent'
                                }`}
                            >
                              {task.status === 'Under Execution' ? (
                                (task.lockedBy?.id || task.startedBy?.id) === (userData?.id || userData?._id) ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Resume
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    View
                                  </>
                                )
                              ) : task.status === 'Paused' ? (
                                <>
                                  <Play className="h-4 w-4" />
                                  Resume
                                </>
                              ) : task.status === 'Completed' ? (
                                <>
                                  <Eye className="h-4 w-4" />
                                  View
                                </>
                              ) : task.status === 'Pending Review' ? (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Under Review
                                </>
                              ) : task.status === 'Rework Required' ? (
                                <>
                                  <Play className="h-4 w-4" />
                                  Rework
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Execute
                                </>
                              )}
                            </button>
                            
                            {/* Action Menu (Three Dots) */}
                            <div className="relative action-menu-container">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {openMenuId === task._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                  {task.status === 'Completed' ? (
                                    <button
                                      onClick={() => handleDownloadPDF(task)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                    >
                                      <Download className="h-4 w-4" />
                                      Download PDF
                                    </button>
                                  ) : (
                                    <div className="px-4 py-2 text-xs text-gray-400 italic">
                                      Download available on completion
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* --- EMPTY STATE --- */
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">There are no tasks assigned to you at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskExecutionPage;