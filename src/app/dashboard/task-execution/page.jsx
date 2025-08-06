//  'use client'
 
// import { useState, useEffect, useRef } from 'react'
// import {
//   Calendar,
//   Layers,
//   FileText,
//   Timer,
//   Image as ImageIcon
// } from 'lucide-react'
// import Image from 'next/image'
 
// const ViewSopPage = () => {
//   const selectedSop = {
//     id: '1',
//     name: 'Website Development Prototype',
//     description: 'Standard procedure for developing company websites with React and Next.js',
//     createdAt: '2023-05-15T10:30:00Z',
//     stages: [
//       {
//         id: 's1',
//         name: 'Planning Phase',
//         description: 'Initial planning and requirement gathering',
//         tasks: [
//           {
//             id: 't1',
//             title: 'Requirement Analysis',
//             description: 'Gather all client requirements and create documentation',
//             minTime: { hours: 0, minutes: 0, seconds: 10 },
//             maxTime: { hours: 0, minutes: 0, seconds: 15 },
//             attachedImages: [{ url: '/placeholder.svg', name: 'Requirements Doc' }]
//           }
//         ]
//       },
//       {
//         id: 's2',
//         name: 'Development Phase',
//         tasks: [
//           {
//             id: 't2',
//             title: 'Frontend Implementation',
//             description: 'Develop UI components using Tailwind CSS',
//             minTime: { hours: 8, minutes: 0, seconds: 0 },
//             maxTime: { hours: 16, minutes: 0, seconds: 0 }
//           }
//         ]
//       }
//     ]
//   }
 
//   const [expandedTasks, setExpandedTasks] = useState({})
//   const [taskTimers, setTaskTimers] = useState({})
//   const [showAlert, setShowAlert] = useState({ visible: false, message: '', type: '' })
//   const timerRefs = useRef({})
 
//   useEffect(() => {
//     return () => {
//       // Cleanup all intervals on unmount
//       Object.values(timerRefs.current).forEach(interval => {
//         if (interval) clearInterval(interval)
//       })
//     }
//   }, [])
 
//   const toggleTask = (taskId) => {
//     setExpandedTasks(prev => ({
//       ...prev,
//       [taskId]: !prev[taskId]
//     }))
//   }
 
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     })
//   }
 
//   const formatTime = (timeObj) => {
//     if (!timeObj) return 'Not set'
//     const { hours = 0, minutes = 0, seconds = 0 } = timeObj
//     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
//     if (minutes > 0) return `${minutes}m ${seconds}s`
//     return `${seconds}s`
//   }
 
//   const formatSecondsToTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
//   }
 
//   const startTimer = (taskId, minTime, maxTime) => {
//     // Clear any existing interval for this task
//     if (timerRefs.current[taskId]) {
//       clearInterval(timerRefs.current[taskId])
//     }
 
//     const startTime = Date.now()
   
//     // Update state immediately to show timer has started
//     setTaskTimers(prev => ({
//       ...prev,
//       [taskId]: {
//         ...prev[taskId],
//         isRunning: true,
//         startTime,
//         elapsed: 0,
//         minTime: minTime ? (minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds) : 0,
//         maxTime: maxTime ? (maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds) : Infinity
//       }
//     }))
 
//     // Start the interval
//     timerRefs.current[taskId] = setInterval(() => {
//       setTaskTimers(prev => {
//         if (!prev[taskId]?.isRunning) return prev
       
//         const elapsedSeconds = Math.floor((Date.now() - prev[taskId].startTime) / 1000)
//         return {
//           ...prev,
//           [taskId]: {
//             ...prev[taskId],
//             elapsed: elapsedSeconds
//           }
//         }
//       })
//     }, 1000)
//   }
 
//   const stopTimer = (taskId) => {
//     const timer = taskTimers[taskId]
//     if (!timer) return
 
//     // Clear the interval
//     if (timerRefs.current[taskId]) {
//       clearInterval(timerRefs.current[taskId])
//       timerRefs.current[taskId] = null
//     }
 
//     // Calculate final elapsed time
//     const finalElapsed = timer.isRunning
//       ? Math.floor((Date.now() - timer.startTime) / 1000)
//       : timer.elapsed || 0
 
//     // Check if submission is early or late
//     let message = ''
//     let type = 'success'
   
//     if (timer.minTime && finalElapsed < timer.minTime) {
//       message = `You're submitting early! Minimum time is ${formatTime({
//         hours: Math.floor(timer.minTime / 3600),
//         minutes: Math.floor((timer.minTime % 3600) / 60),
//         seconds: timer.minTime % 60
//       })}`
//       type = 'warning'
//     } else if (timer.maxTime && finalElapsed > timer.maxTime) {
//       message = `You're submitting late! Maximum time is ${formatTime({
//         hours: Math.floor(timer.maxTime / 3600),
//         minutes: Math.floor((timer.maxTime % 3600) / 60),
//         seconds: timer.maxTime % 60
//       })}`
//       type = 'error'
//     } else {
//       message = 'Task submitted successfully!'
//       type = 'success'
//     }
 
//     setShowAlert({ visible: true, message, type })
//     setTimeout(() => setShowAlert({ visible: false, message: '', type: '' }), 5000)
 
//     setTaskTimers(prev => ({
//       ...prev,
//       [taskId]: {
//         ...prev[taskId],
//         isRunning: false,
//         elapsed: finalElapsed
//       }
//     }))
//   }
 
//   const renderTask = (task, level = 0, taskNumber = '1') => {
//     const timer = taskTimers[task.id] || {}
//     const isRunning = timer.isRunning || false
//     const elapsedTime = timer.elapsed || 0
 
//     return (
//       <div key={task.id} className={`border-2 ${level % 2 === 0 ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'} p-4 mb-3`}>
//         <div className="mb-2 flex justify-between items-center">
//           <span className="font-medium text-gray-900">
//             {taskNumber}. {task.title || 'Untitled Task'}
//           </span>
         
//           <div className="flex items-center gap-3">
//             {(isRunning || elapsedTime > 0) && (
//               <div className="text-sm font-mono bg-white px-2 py-1 rounded">
//                 {formatSecondsToTime(elapsedTime)}
//               </div>
//             )}
//             <button
//               onClick={() => isRunning ? stopTimer(task.id) : startTimer(task.id, task.minTime, task.maxTime)}
//               className={`px-4 py-1.5 rounded text-sm font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//             >
//               {isRunning ? 'Submit' : 'Start'}
//             </button>
//           </div>
//         </div>
 
//         <div className="space-y-3 ml-6">
//           {task.description && (
//             <div>
//               <div className="flex items-center gap-2 text-sm mb-1">
//                 <FileText className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Description:</span>
//               </div>
//               <p className="text-sm text-gray-700 ml-6">{task.description}</p>
//             </div>
//           )}
 
//           {(task.minTime || task.maxTime) && (
//             <div className="bg-white p-3 rounded-lg border">
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <Timer className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Duration:</span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
//                 {task.minTime && (
//                   <div>
//                     <span className="text-gray-600">Minimum: </span>
//                     <span className="font-medium">{formatTime(task.minTime)}</span>
//                   </div>
//                 )}
//                 {task.maxTime && (
//                   <div>
//                     <span className="text-gray-600">Maximum: </span>
//                     <span className="font-medium">{formatTime(task.maxTime)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
 
//           {task.attachedImages?.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <ImageIcon className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Attached Images:</span>
//               </div>
//               <div className="grid grid-cols-2 gap-3 ml-6">
//                 {task.attachedImages.map((image, idx) => (
//                   <div key={idx} className="border rounded-lg overflow-hidden bg-white">
//                     <Image
//                       src={image.url}
//                       alt={image.name || `Image ${idx + 1}`}
//                       width={200}
//                       height={120}
//                       className="w-full h-24 object-cover"
//                     />
//                     {image.name && (
//                       <div className="p-2">
//                         <p className="text-xs text-gray-600 truncate">{image.name}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }
 
//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8">
//       {/* Alert Notification */}
//       {showAlert.visible && (
//         <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${
//           showAlert.type === 'warning' ? 'bg-yellow-500' :
//           showAlert.type === 'error' ? 'bg-red-500' : 'bg-green-500'
//         }`}>
//           {showAlert.message}
//         </div>
//       )}
 
//       {/* Header Section */}
//       <div className="space-y-2">
//         <h2 className="text-3xl font-bold text-gray-900">{selectedSop.name}</h2>
//         <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
//           <span className="flex items-center">
//             <Calendar className="w-4 h-4 mr-1.5" />
//             Created: {formatDate(selectedSop.createdAt)}
//           </span>
//           <span className="flex items-center">
//             <Layers className="w-4 h-4 mr-1.5" />
//             {selectedSop.stages.length} Stages
//           </span>
//         </div>
//       </div>
 
//       {/* Description */}
//       {selectedSop.description && (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
//           <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
//         </div>
//       )}
 
//       {/* Stages and Tasks */}
//       <div className="space-y-6">
//         {selectedSop.stages.map((stage, stageIndex) => (
//           <div key={stage.id} className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
//               <div className="flex items-center">
//                 <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
//                   {stageIndex + 1}
//                 </span>
//                 <h3 className="font-semibold text-gray-800">{stage.name}</h3>
//                 <span className="ml-auto text-sm text-gray-500">
//                   {stage.tasks?.length || 0} tasks
//                 </span>
//               </div>
//               {stage.description && (
//                 <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
//               )}
//             </div>
 
//             <div className="divide-y divide-gray-100">
//               {stage.tasks?.length > 0 ? (
//                 stage.tasks.map((task, taskIndex) =>
//                   renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
//                 )
//               ) : (
//                 <div className="text-center py-8 text-gray-500 bg-gray-50">
//                   <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
//                   <p>No tasks in this stage</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
 
// export default ViewSopPage



// task-execution/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TaskExecutionPage = () => {
  const router = useRouter();
  // Dummy data for task executions
  const [tasks, setTasks] = useState([
    {
      _id: '1',
      generatedId: 'TE-001',
      equipment: {
        name: 'Microscope X200',
        barcode: 'MBX200-001',
      },
      prototypeData: {
        name: 'Cell Analysis',
        status: 'pending'
      },
      assignedTo: 'John Doe',
      deadline: '2023-12-31'
    },
    {
      _id: '2',
      generatedId: 'TE-002',
      equipment: {
        name: 'Centrifuge C100',
        barcode: 'CFC100-001',
      },
      prototypeData: {
        name: 'Sample Processing',
        status: 'in-progress'
      },
      assignedTo: 'Jane Smith',
      deadline: '2023-12-15'
    }
  ]);

  const handleExecuteTask = (taskId) => {
    // Hardcoded path to the execution page
    router.push('/dashboard/task-execution/execution/1'); // Always redirects to task ID 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
            Task Execution
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg">View and execute your assigned tasks</p>
        </div>

        {/* Tasks Card */}
        <div className="bg-white rounded-xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Equipment</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Prototype</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Generated ID</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Assigned To</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr 
                    key={task._id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{task.equipment.name}</span>
                        <span className="text-xs text-gray-500">{task.equipment.barcode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{task.prototypeData.name}</span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
                        {task.generatedId}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className="text-sm sm:text-base">{task.assignedTo}</span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        task.prototypeData.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border border-green-200' :
                          task.prototypeData.status === 'in-progress' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {task.prototypeData.status === 'completed' ? '✓ Completed' : 
                         task.prototypeData.status === 'in-progress' ? '⏳ In Progress' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExecuteTask(task._id)}
                          className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                        >
                          <span className="mr-1 sm:mr-2">▶</span>
                          <span className="hidden sm:inline">Execute</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskExecutionPage;