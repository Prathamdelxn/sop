// "use client";
// import { useState, useEffect, useRef } from 'react';
// import { FileText, Play, Square, Clock, AlertTriangle, CheckCircle2, Timer, Target, Calendar, Microscope, ChevronRight } from 'lucide-react';

// // Mock data - replace with your actual data
// const selectedTask = {
//   id: "1",
//   name: 'Cell Analysis Procedure',
//   description: 'Standard procedure for analyzing cell samples using the microscope',
//   equipment: {
//     name: 'Microscope X200',
//     barcode: 'MBX200-001'
//   },
//   stages: [
//     {
//       id: 's1',
   
//       tasks: [
//         {
//           id: 't1',
//           title: 'Clean microscope slides',
//           description: 'Thoroughly clean all slides to be used in the analysis',
//           minTime: { hours: 0, minutes: 5, seconds: 0 },
//           maxTime: { hours: 0, minutes: 10, seconds: 0 },
//           subtasks: [
//             {
//               id: 'st1',
//               title: 'Wipe with alcohol',
//               description: 'Clean slides with 70% alcohol solution',
//               minTime: { hours: 0, minutes: 2, seconds: 0 },
//               maxTime: { hours: 0, minutes: 3, seconds: 0 }
//             },
//             {
//               id: 'st2',
//               title: 'Dry with lint-free cloth',
//               description: 'Ensure no streaks or fibers remain',
//               minTime: { hours: 0, minutes: 1, seconds: 0 },
//               maxTime: { hours: 0, minutes: 2, seconds: 0 },
//               hasImage: true,
//               imageDescription: 'Proper technique for drying microscope slides'
//             }
//           ]
//         },
//         {
//           id: 't2',
//           title: 'Prepare samples',
//           description: 'Prepare the cell samples for analysis',
//           minTime: { hours: 0, minutes: 15, seconds: 0 },
//           maxTime: { hours: 0, minutes: 30, seconds: 0 },
//           hasImage: true,
//           imageDescription: 'Sample preparation workstation setup'
//         }
//       ]
//     },
//     {
//       id: 's2',
   
//       tasks: [
//         {
//           id: 't3',
//           title: 'Focus microscope',
//           description: 'Adjust the microscope to get clear images',
//           minTime: { hours: 0, minutes: 2, seconds: 0 },
//           maxTime: { hours: 0, minutes: 5, seconds: 0 },
//           subtasks: [
//             {
//               id: 'st3',
//               title: 'Coarse focus',
//               description: 'Adjust with the coarse focus knob',
//               minTime: { hours: 0, minutes: 1, seconds: 0 },
//               maxTime: { hours: 0, minutes: 2, seconds: 0 }
//             },
//             {
//               id: 'st4',
//               title: 'Fine focus',
//               description: 'Adjust with the fine focus knob',
//               minTime: { hours: 0, minutes: 1, seconds: 0 },
//               maxTime: { hours: 0, minutes: 3, seconds: 0 }
//             }
//           ]
//         },
//         {
//           id: 't4',
//           title: 'Record observations',
//           description: 'Record all observations from the analysis',
//           minTime: { hours: 0, minutes: 10, seconds: 0 },
//           maxTime: { hours: 0, minutes: 20, seconds: 0 }
//         }
//       ]
//     }
//   ]
// };

// const TaskExecutionDetailPage = () => {
//   const [taskTimers, setTaskTimers] = useState({});
//   const [showAlert, setShowAlert] = useState({ 
//     visible: false, 
//     message: '', 
//     type: '', 
//     taskId: null,
//     requiresReason: false 
//   });
//   const [reason, setReason] = useState('');
//   const timerRefs = useRef({});

//   useEffect(() => {
//     return () => {
//       Object.values(timerRefs.current).forEach(interval => {
//         if (interval) clearInterval(interval);
//       });
//     };
//   }, []);

//   const formatTime = (timeObj) => {
//     if (!timeObj) return 'Not set';
//     const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
//     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
//     if (minutes > 0) return `${minutes}m ${seconds}s`;
//     return `${seconds}s`;
//   };

//   const formatSecondsToTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const startTimer = (taskId, minTime, maxTime) => {
//     if (timerRefs.current[taskId]) {
//       clearInterval(timerRefs.current[taskId]);
//     }

//     const startTime = Date.now();
   
//     setTaskTimers(prev => ({
//       ...prev,
//       [taskId]: {
//         ...prev[taskId],
//         isRunning: true,
//         isSubmitted: false,
//         startTime,
//         elapsed: 0,
//         minTime: minTime ? (minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds) : 0,
//         maxTime: maxTime ? (maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds) : Infinity
//       }
//     }));

//     timerRefs.current[taskId] = setInterval(() => {
//       setTaskTimers(prev => {
//         if (!prev[taskId]?.isRunning) return prev;
       
//         const elapsedSeconds = Math.floor((Date.now() - prev[taskId].startTime) / 1000);
//         return {
//           ...prev,
//           [taskId]: {
//             ...prev[taskId],
//             elapsed: elapsedSeconds
//           }
//         };
//       });
//     }, 1000);
//   };

//   const handleSubmitWithReason = () => {
//     const { taskId } = showAlert;
//     if (!taskId) return;

//     const timer = taskTimers[taskId];
//     if (!timer) return;

//     if (timerRefs.current[taskId]) {
//       clearInterval(timerRefs.current[taskId]);
//       timerRefs.current[taskId] = null;
//     }

//     const finalElapsed = timer.isRunning
//       ? Math.floor((Date.now() - timer.startTime) / 1000)
//       : timer.elapsed || 0;

//     setTaskTimers(prev => ({
//       ...prev,
//       [taskId]: {
//         ...prev[taskId],
//         isRunning: false,
//         isSubmitted: true,
//         elapsed: finalElapsed,
//         reason: reason
//       }
//     }));

//     setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false });
//     setReason('');

//     setShowAlert({
//       visible: true,
//       message: 'Task submitted successfully!',
//       type: 'success',
//       taskId: null,
//       requiresReason: false
//     });
//     setTimeout(() => setShowAlert(prev => ({ ...prev, visible: false })), 3000);
//   };

//   const stopTimer = (taskId) => {
//     const timer = taskTimers[taskId];
//     if (!timer) return;

//     const finalElapsed = timer.isRunning
//       ? Math.floor((Date.now() - timer.startTime) / 1000)
//       : timer.elapsed || 0;

//     let message = '';
//     let type = 'success';
//     let requiresReason = false;
   
//     if (timer.minTime && finalElapsed < timer.minTime) {
//       message = `You're submitting early! Please provide a reason. Minimum time is ${formatTime({
//         hours: Math.floor(timer.minTime / 3600),
//         minutes: Math.floor((timer.minTime % 3600) / 60),
//         seconds: timer.minTime % 60
//       })}`;
//       type = 'warning';
//       requiresReason = true;
//     } else if (timer.maxTime && finalElapsed > timer.maxTime) {
//       message = `You're submitting late! Please provide a reason. Maximum time is ${formatTime({
//         hours: Math.floor(timer.maxTime / 3600),
//         minutes: Math.floor((timer.maxTime % 3600) / 60),
//         seconds: timer.maxTime % 60
//       })}`;
//       type = 'error';
//       requiresReason = true;
//     } else {
//       message = 'Task submitted successfully!';
//       type = 'success';
//     }

//     setShowAlert({ 
//       visible: true, 
//       message, 
//       type, 
//       taskId: requiresReason ? taskId : null,
//       requiresReason 
//     });

//     if (!requiresReason) {
//       if (timerRefs.current[taskId]) {
//         clearInterval(timerRefs.current[taskId]);
//         timerRefs.current[taskId] = null;
//       }

//       setTaskTimers(prev => ({
//         ...prev,
//         [taskId]: {
//           ...prev[taskId],
//           isRunning: false,
//           isSubmitted: true,
//           elapsed: finalElapsed
//         }
//       }));

//       setTimeout(() => setShowAlert(prev => ({ ...prev, visible: false })), 3000);
//     }
//   };

//   const getTimerProgress = (timer, task) => {
//     if (!timer || !task.maxTime) return 0;
//     const maxTimeSeconds = task.maxTime.hours * 3600 + task.maxTime.minutes * 60 + task.maxTime.seconds;
//     return Math.min((timer.elapsed / maxTimeSeconds) * 100, 100);
//   };

//   const getTimerStatus = (timer, task) => {
//     if (!timer || !timer.isRunning) return 'idle';
//     if (task.minTime) {
//       const minTimeSeconds = task.minTime.hours * 3600 + task.minTime.minutes * 60 + task.minTime.seconds;
//       if (timer.elapsed < minTimeSeconds) return 'early';
//     }
//     if (task.maxTime) {
//       const maxTimeSeconds = task.maxTime.hours * 3600 + task.maxTime.minutes * 60 + task.maxTime.seconds;
//       if (timer.elapsed > maxTimeSeconds) return 'late';
//     }
//     return 'ontime';
//   };

//   const renderTask = (task, level = 0, taskNumber = '1') => {
//     const timer = taskTimers[task.id] || {};
//     const isRunning = timer.isRunning || false;
//     const isSubmitted = timer.isSubmitted || false;
//     const elapsedTime = timer.elapsed || 0;
//     const progress = getTimerProgress(timer, task);
//     const status = getTimerStatus(timer, task);

//     const statusColors = {
//       idle: 'from-gray-50 to-gray-100 border-gray-200',
//       early: 'from-blue-50 to-blue-100 border-blue-200',
//       ontime: 'from-green-50 to-green-100 border-green-200',
//       late: 'from-red-50 to-red-100 border-red-200'
//     };

//     const buttonStyles = {
//       start: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
//       stop: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
//       submitted: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-75'
//     };

//     return (
//       <div 
//         key={task.id} 
//         className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md ${
//           level === 0 
//             ? `bg-gradient-to-br ${statusColors[status]} backdrop-blur-sm border-2 shadow-md` 
//             : 'bg-white/70 backdrop-blur-sm border border-indigo-200 ml-6'
//         }`}
//       >
//         <div className="p-6">
//           <div className="flex flex-col lg:flex-row lg:items-start gap-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
//                   level === 0 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//                 }`}>
//                   {level === 0 ? taskNumber.split('.')[1] : taskNumber.split('.').slice(-1)[0]}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-1">
//                     {level === 0 ? `Task ${taskNumber}` : `Subtask ${taskNumber}`}: {task.title}
//                   </h3>
//                   {task.description && (
//                     <p className="text-gray-600 leading-relaxed">{task.description}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Time constraints */}
//              <div className="flex flex-wrap gap-2 mb-3">
//                  {task.minTime && (
//                   <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-sm">
//                   <Target size={14} />
//                   <span className="font-medium">Min: {formatTime(task.minTime)}</span>
//              </div>
//                 )}
//                {task.maxTime && (
//                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 text-sm">
//                 <AlertTriangle size={14} />
//                    <span className="font-medium">Max: {formatTime(task.maxTime)}</span>
//             </div>
//                 )}
//              </div>
      
//            {/* Progress bar */}
//               {isRunning && task.maxTime && (
//                 <div className="mb-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-700">Progress</span>
//                     <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                     <div 
//                       className={`h-full transition-all duration-300 rounded-full ${
//                         status === 'late' ? 'bg-gradient-to-r from-red-500 to-red-600' :
//                         status === 'ontime' ? 'bg-gradient-to-r from-green-500 to-green-600' :
//                         'bg-gradient-to-r from-blue-500 to-blue-600'
//                       }`}
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Timer and controls */}
//             <div className="flex flex-col items-center gap-3">
//               {(isRunning || elapsedTime > 0) && (
//                 <div className="text-center">
//                   <div className={`text-xl font-mono font-bold px-4 py-2 rounded-xl ${
//                     status === 'late' ? 'bg-red-100 text-red-700 border-2 border-red-200' :
//                     status === 'ontime' ? 'bg-green-100 text-green-700 border-2 border-green-200' :
//                     'bg-blue-100 text-blue-700 border-2 border-blue-200'
//                   }`}>
//                     {formatSecondsToTime(elapsedTime)}
//                   </div>
                  
//                 </div>
//               )}

//              <button
//   onClick={() =>
//     isRunning ? stopTimer(task.id) : startTimer(task.id, task.minTime, task.maxTime)
//   }
//   disabled={isSubmitted}
//   className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
//     isSubmitted ? buttonStyles.submitted :
//     isRunning ? buttonStyles.stop : buttonStyles.start
//   }`}
// >
//   {isSubmitted ? (
//     <>
//       <CheckCircle2 size={16} />
//       Submitted
//     </>
//   ) : isRunning ? (
//     <>
//       <Square size={16} />
//       Submit
//     </>
//   ) : (
//     <>
//       <Play size={16} />
//       Start Task
//     </>
//   )}
// </button>

//             </div>
//           </div>

//           {/* Image section */}
//           {task.hasImage && (
//             <div className="mt-6 grid md:grid-cols-2 gap-6">
//               <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-300">
//                 <div className="text-center text-indigo-600">
//                   <FileText size={48} className="mx-auto mb-2 opacity-50" />
//                   <p className="font-medium">Task Image</p>
//                 </div>
//               </div>
//               <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
//                 <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
//                   <FileText size={18} />
//                   Image Description
//                 </h4>
//                 <p className="text-gray-600 leading-relaxed">{task.imageDescription}</p>
//               </div>
//             </div>
//           )}

//           {/* Subtasks */}
//           {task.subtasks && task.subtasks.length > 0 && (
//             <div className="mt-6 space-y-3">
//               <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 mb-3">
//                 <ChevronRight size={16} />
//                 <span>Subtasks ({task.subtasks.length})</span>
//               </div>
//               {task.subtasks.map((subtask, subtaskIndex) => 
//                 renderTask(subtask, level + 1, `${taskNumber}.${subtaskIndex + 1}`)
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Alert Modal */}
//         {showAlert.visible && (
//           <>
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
            
//             <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl shadow-2xl z-50 w-96 bg-white border-2 transition-all duration-300 scale-100 ${
//               showAlert.type === 'warning' ? 'border-yellow-300' :
//               showAlert.type === 'error' ? 'border-red-300' : 
//               'border-green-300'
//             }`}>
//               <div className="text-center">
//                 <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
//                   showAlert.type === 'warning' ? 'bg-yellow-100' :
//                   showAlert.type === 'error' ? 'bg-red-100' : 'bg-green-100'
//                 }`}>
//                   {showAlert.type === 'warning' ? (
//                     <AlertTriangle className="text-yellow-600" size={32} />
//                   ) : showAlert.type === 'error' ? (
//                     <AlertTriangle className="text-red-600" size={32} />
//                   ) : (
//                     <CheckCircle2 className="text-green-600" size={32} />
//                   )}
//                 </div>
                
//                 <h3 className={`text-xl font-bold mb-4 ${
//                   showAlert.type === 'warning' ? 'text-yellow-800' :
//                   showAlert.type === 'error' ? 'text-red-800' : 'text-green-800'
//                 }`}>
//                   {showAlert.message}
//                 </h3>
                
//                 {showAlert.requiresReason && (
//                   <div className="mb-6 text-left">
//                     <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
//                       Please provide a reason:
//                     </label>
//                     <textarea
//                       id="reason"
//                       rows={3}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                       placeholder="Enter your reason here..."
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex justify-center gap-4">
//                   {showAlert.requiresReason ? (
//                     <>
//                       <button
//                         onClick={() => {
//                           setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false });
//                           setReason('');
//                         }}
//                         className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-200"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSubmitWithReason}
//                         disabled={!reason.trim()}
//                         className={`px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 ${
//                           !reason.trim() ? 'bg-gray-400 cursor-not-allowed' :
//                           showAlert.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
//                           'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
//                         }`}
//                       >
//                         Submit Anyway
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false })}
//                       className={`px-8 py-3 text-white rounded-xl font-medium transition-all duration-200 ${
//                         showAlert.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
//                         showAlert.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
//                         'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
//                       }`}
//                     >
//                       Got it!
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Header */}
//         <div className="mb-8">
//           <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-4 px-6 border border-white/50 shadow-sm">
//             <div className="flex items-center gap-4 ">
//               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <Microscope className="text-white" size={16} />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {selectedTask.name}
//                 </h1>
//                 <h2 className="text-md font-medium text-gray-600 flex items-center gap-2">
//                   <span>{selectedTask.equipment.name}</span>
//                   <span className="text-sm bg-gray-100 px-2 py-1 rounded-lg">{selectedTask.equipment.barcode}</span>
//                 </h2>
                
//               </div>
//             </div>
//             {/* <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p> */}
//           </div>
//         </div>

//         {/* Stages */}
//         <div className="space-y-8">
//           {selectedTask.stages.map((stage, stageIndex) => (
//             <div key={stage.id} className="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-sm">
//               <div className="bg-gradient-to-r from-indigo-400  to-blue-400 px-6 py-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-4">
//                      <h3 className="text-xl font-bold text-white">
//                       Stage
//                     </h3>
//                     <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//                       <span className="text-white font-bold text-md">{stageIndex + 1}</span>
//                     </div>
                   
//                   </div>
//                   <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
//                   <Timer className="text-white" size={14} />
//                   <span className="text-white text-sm font-medium">
//                   {stage.tasks?.length || 0} tasks
//                   </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {stage.tasks?.length > 0 ? (
//                   <div className="space-y-4">
//                     {stage.tasks.map((task, taskIndex) => (
//                       renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 text-gray-500">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FileText className="text-gray-400" size={32} />
//                     </div>
//                     <p className="text-lg font-medium">No tasks in this stage</p>
//                     <p className="text-sm">Tasks will appear here when added</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskExecutionDetailPage;



'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle } from "lucide-react";

const TaskPage = () => {
  const [expandedStages, setExpandedStages] = useState({});
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prototypeData, setPrototypeData] = useState(null);
  const [taskTimer, setTaskTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsedTime: 0
  });

  const [reasonModal, setReasonModal] = useState({
  open: false,
  reason: '',
  context: null,   // 'early' | 'late'
  minSec: null,
  maxSec: null,
});
const [pendingElapsed, setPendingElapsed] = useState(0);
const [submitModal, setSubmitModal] = useState({
  open: false,
  timeText: '',
  reason: '',
});

  // Generate dummy data based on your schema
  useEffect(() => {
     const dummyData = {
      _id: "prototype_123",
      name: "Paracetamol Production",
      companyId: "company_456",
      departmentName: "Pharmaceutical Manufacturing",
      documentNo: "DOC-789",
      effectiveDate: "2023-10-15",
      version: "1.2",
      userId: "user_101",
      status: "Ongoing",
      rejectionReason: null,
      reviews: [
        {
          reviewerId: "reviewer_201",
          reviewerName: "Dr. Smith",
          reviewerRole: "Quality Assurance",
          status: "Approved",
          comments: "All procedures look correct",
          reviewDate: "2023-10-10"
        }
      ],
      approvers: [
        {
          approverId: "approver_301",
          approverName: "Jane Doe",
          approverRole: "Production Manager",
          status: "Pending",
          comments: "",
          approvalDate: ""
        }
      ],
      stages: [
        {
          _id: "stage_1",
          name: "Preparation",
          order: 1,
          tasks: [
            {
              _id: "task_1_1",
              title: "Gather Materials",
              description: "Collect all raw materials needed for paracetamol production",
              minDuration: 30,
              maxDuration: 45,
              minTime: { hours: 0, minutes: 30, seconds: 0 },
              maxTime: { hours: 0, minutes: 45, seconds: 0 },
              attachedImages: [
                {
                  name: "material_list",
                  description: "List of required materials",
                  url: "/images/material_list.jpg",
                  public_id: "img_1",
                  size: 1024,
                  isUploading: false
                }
              ],
              imageTitle: "Materials Setup",
              imageDescription: "Proper arrangement of materials",
              imagePublicId: "main_img_1",
              subtasks: [
                {
                  _id: "subtask_1_1_1",
                  title: "Check inventory",
                  description: "Verify all materials are in stock",
                  minDuration: 10,
                  maxDuration: 15,
                  minTime: { hours: 0, minutes: 10, seconds: 0 },
                  maxTime: { hours: 0, minutes: 15, seconds: 0 },
                  attachedImages: [],
                  level: 1,
                  order: 1
                },
                {
                  _id: "subtask_1_1_2",
                  title: "Quality check",
                  description: "Inspect material quality",
                  minDuration: 20,
                  maxDuration: 30,
                  minTime: { hours: 0, minutes: 20, seconds: 0 },
                  maxTime: { hours: 0, minutes: 30, seconds: 0 },
                  attachedImages: [],
                  level: 1,
                  order: 2
                }
              ],
              level: 0,
              order: 1
            },
            {
              _id: "task_1_2",
              title: "Setup Equipment",
              description: "Prepare and calibrate all manufacturing equipment",
              minDuration: 45,
              maxDuration: 60,
              minTime: { hours: 0, minutes: 45, seconds: 0 },
              maxTime: { hours: 1, minutes: 0, seconds: 0 },
              attachedImages: [],
              subtasks: [],
              level: 0,
              order: 2
            }
          ]
        },
        {
          _id: "stage_2",
          name: "Mixing",
          order: 2,
          tasks: [
            {
              _id: "task_2_1",
              title: "Measure Ingredients",
              description: "Precisely measure all chemical components",
              minDuration: 20,
              maxDuration: 30,
              minTime: { hours: 0, minutes: 20, seconds: 0 },
              maxTime: { hours: 0, minutes: 30, seconds: 0 },
              attachedImages: [],
              subtasks: [],
              level: 0,
              order: 1
            }
          ]
        },
        {
          _id: "stage_3",
          name: "Processing",
          order: 3,
          tasks: [
            {
              _id: "task_3_1",
              title: "Heating Process",
              description: "Apply controlled heat to mixture",
              minDuration: 120,
              maxDuration: 150,
              minTime: { hours: 2, minutes: 0, seconds: 0 },
              maxTime: { hours: 2, minutes: 30, seconds: 0 },
              attachedImages: [],
              subtasks: [],
              level: 0,
              order: 1
            }
          ]
        },
        {
          _id: "stage_4",
          name: "Packaging",
          order: 4,
          tasks: [
            {
              _id: "task_4_1",
              title: "Primary Packaging",
              description: "Package product into primary containers",
              minDuration: 60,
              maxDuration: 90,
              minTime: { hours: 1, minutes: 0, seconds: 0 },
              maxTime: { hours: 1, minutes: 30, seconds: 0 },
              attachedImages: [],
              subtasks: [],
              level: 0,
              order: 1
            }
          ]
        }
      ]
    };
    
    setPrototypeData(dummyData);
    // Expand first stage by default
    setExpandedStages({ [dummyData.stages[0]._id]: true });
  }, []);

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

  const handleTaskClick = (stage, task) => {
    setSelectedTask({ ...task, stageName: stage.name });
    // Reset timer when selecting a new task
    setTaskTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    
    const { hours, minutes, seconds } = duration;
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
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const durationToSeconds = (d) => {
  if (!d) return null;
  const { hours = 0, minutes = 0, seconds = 0 } = d;
  return hours * 3600 + minutes * 60 + seconds;
};

  const handleStartTimer = () => {
    setTaskTimer({
      isRunning: true,
      startTime: Date.now() - (taskTimer.elapsedTime * 1000),
      elapsedTime: taskTimer.elapsedTime
    });
  };

    const handleStopTimer = () => {
    const finalElapsed = taskTimer.isRunning
      ? Math.floor((Date.now() - taskTimer.startTime) / 1000)
      : taskTimer.elapsedTime;

    // Stop the ticking
    setTaskTimer(prev => ({
      ...prev,
      isRunning: false,
      elapsedTime: finalElapsed
    }));

    // Compute min/max in seconds from selectedTask
    const minSec = durationToSeconds(selectedTask?.minTime);
    const maxSec = durationToSeconds(selectedTask?.maxTime);

    const needsReason =
  (minSec !== null && finalElapsed < minSec) ||
  (maxSec !== null && finalElapsed > maxSec);

if (needsReason) {
  setPendingElapsed(finalElapsed);
  setReasonModal({
    open: true,
    reason: '',
    context: finalElapsed < (minSec ?? Infinity) ? 'early' : 'late',
    minSec,
    maxSec,
  });
  return;
}

// Auto-submit when within the allowed window
handleSubmitTask();
  };

   const handleSubmitTask = (reason) => {
  const timeText = formatSeconds(taskTimer.elapsedTime);

  // Open the submit result modal
  setSubmitModal({
    open: true,
    timeText,
    reason: reason || '',
  });

  setTaskTimer({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
  });

  // Close modal and reset modal state
  setReasonModal({ open: false, reason: '', context: null, minSec: null, maxSec: null });
  setPendingElapsed(0);
};

  if (!prototypeData) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full h-full p-2">
      <div className="h-full w-full rounded-b-2xl border border-gray-300 overflow-hidden relative">
        {/* Header */}
        <div className="h-[7%] w-full flex items-center border-b border-gray-300 justify-between px-4">
          {/* Title + Status */}
          <div className="gap-4 flex items-center">
            <h1 className="text-lg font-semibold">{prototypeData.name}</h1>
            <span className="py-1 px-2 bg-blue-400 text-white flex items-center justify-center text-sm capitalize rounded-2xl">
              {prototypeData.status}
            </span>
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
                  <h2 className="font-bold text-lg mb-4">Production Stages</h2>
                  <div className="space-y-2">
                    {prototypeData.stages.map((stage,index) => (
                      <div key={stage._id} className="rounded-md overflow-hidden">
                        <div 
                          className="flex gap-4 items-center p-3 bg-gray-100 cursor-pointer"
                          onClick={() => toggleStage(stage._id)}
                        >
                          {expandedStages[stage._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          <span className="font-medium">{stage.name}</span>
                        </div>
                        {expandedStages[stage._id] && (
                          <div className="bg-white p-2">
                            {stage.tasks.map((task, taskIndex) => {
                              const taskId = `${stage.order}.${taskIndex + 1}`;
                              return (
                                <div 
                                  key={task._id} 
                                  className={`p-2 text-sm flex items-center gap-2  font-semibold hover:bg-blue-50 cursor-pointer ${selectedTask?._id === task._id ? 'text-blue-500 ' : ''}`}
                                  onClick={() => handleTaskClick(stage, task)}
                                >
                                    <div className={`w-2 h-6 rounded-sm   ${selectedTask?._id === task._id ? 'bg-blue-500 ' : 'bg-gray-300'}`}></div>
                                  {taskId}: {task.title}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center pt-4">
                  {prototypeData.stages.map(stage => (
                    <div key={stage._id} className="mb-4 flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1 cursor-pointer"
                        onClick={() => toggleStage(stage._id)}
                        title={stage.name}
                      >
                        {stage.order}
                      </div>
                      {expandedStages[stage._id] && (
                        <div className="mt-2 bg-white rounded-md p-2 shadow-md">
                          {stage.tasks.map((task, taskIndex) => {
                            const taskId = `${stage.order}.${taskIndex + 1}`;
                            return (
                              <div 
                                key={task._id} 
                                className="p-1 text-xs text-center hover:bg-blue-50 cursor-pointer mb-1 last:mb-0"
                                onClick={() => handleTaskClick(stage, task)}
                              >
                                {taskId}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
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
          <div className="h-full w-3/4 flex flex-col">
            <div className="h-11/12 w-full bg-gray-50 p-4 overflow-y-auto">
              {selectedTask ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{prototypeData.stages.findIndex(s => s.name === selectedTask.stageName) + 1}.{selectedTask.order} {selectedTask.title}</h2>
                      <p className="text-gray-600 mt-1">{selectedTask.stageName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {taskTimer.elapsedTime > 0 && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                          <Clock size={16} className="text-gray-600" />
                          <span className="font-mono font-medium">{formatSeconds(taskTimer.elapsedTime)}</span>
                        </div>
                      )}
                      {!taskTimer.isRunning ? (
  <button 
    onClick={handleStartTimer}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
  >
    <CheckCircle size={16} />
    Start
  </button>
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
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedTask.description}</p>
                  </div>
                  
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
                  
                  {selectedTask.attachedImages && selectedTask.attachedImages.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Image size={20} /> Attached Images
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedTask.attachedImages.map((image, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="h-32 bg-gray-200 flex items-center justify-center">
                              <Image size={32} className="text-gray-400" />
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium truncate">{image.name}</p>
                              <p className="text-xs text-gray-500 truncate">{image.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Subtasks</h3>
                      <div className="space-y-3">
                        {selectedTask.subtasks.map((subtask, index) => (
                          <div key={subtask._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                            <h4 className="font-medium">{subtask.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
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
        {reasonModal.open && (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/40" />
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">
          {reasonModal.context === 'early' ? 'Submit Early' : 'Submit Late'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Allowed window: {formatSeconds(reasonModal.minSec ?? 0)} – {formatSeconds(reasonModal.maxSec ?? 0)}.<br />
          Your time: {formatSeconds(pendingElapsed)}.<br />
          Please provide a reason:
        </p>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your reason..."
          value={reasonModal.reason}
          onChange={(e) => setReasonModal((prev) => ({ ...prev, reason: e.target.value }))}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setReasonModal({ open: false, reason: '', context: null, minSec: null, maxSec: null })}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!reasonModal.reason.trim()}
            onClick={() => handleSubmitTask(reasonModal.reason.trim())}
            className={`px-4 py-2 rounded-md text-white ${reasonModal.reason.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{submitModal.open && (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/40" />
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Task Submitted</h3>
        <p className="text-sm text-gray-700 mb-3">
          Time taken: <span className="font-medium">{submitModal.timeText}</span>
        </p>
        {submitModal.reason ? (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Reason provided:</p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
              {submitModal.reason}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Submitted within allowed time window.</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => setSubmitModal({ open: false, timeText: '', reason: '' })}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default TaskPage;