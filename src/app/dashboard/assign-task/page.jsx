
// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Sparkles, Eye, Edit, MoreVertical, X, ChevronDown, ChevronRight, User, Check, Search, Filter } from 'lucide-react'

// export default function AssignWorkerPage() {
//   const [assignments, setAssignments] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [companyData, setCompanyData] = useState()
//   const [selectedAssignment, setSelectedAssignment] = useState(null)
//   const [expandedStages, setExpandedStages] = useState({})
//   const [expandedTasks, setExpandedTasks] = useState({})
//   const [selectedItems, setSelectedItems] = useState({})
//   const [showWorkerList, setShowWorkerList] = useState(false)
//   const [workers, setWorkers] = useState([])
//   const [assignedWorkers, setAssignedWorkers] = useState({})
//   const [workerSearchTerm, setWorkerSearchTerm] = useState('')

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const user = JSON.parse(userData);
//     setCompanyData(user);
//     console.log("Asd", user);
//   }, [])
// const fetchWorker=async()=>{
//   const respon= await fetch(`/api/task-execution/${companyData?.companyId}`);
//   const dataresp= await respon.json();
//   console.log(companyData?.companyId)
//   console.log("worker data :",dataresp);


// }
//   useEffect(() => {
//     const fetchData = async () => {
//       if (companyData?.companyId) {
//         try {
//           const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`)
//           const data = await res.json()
//           console.log("asdf", data)
//           const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status ==="Assigned")
//           console.log(approvedAssignments)
//           setAssignments(approvedAssignments)
//         } catch (error) {
//           console.error('Error fetching assignments:', error)
//         }
//       }
//     }
    
//     fetchData();
//     fetchWorker();
//   }, [companyData])

//   useEffect(() => {
//     // Fetch workers from your API
//     const fetchWorkers = async () => {
//       if (companyData?.companyId) {
//         try {
//            const res = await fetch(`/api/task-execution/${companyData?.companyId}`)
//           const data = await res.json()
//           console.log("worker data :", data.users)
//           // Mock data for demonstration
//           // setWorkers([
//           //   { _id: '1', name: 'John Doe', role: 'Technician' },
//           //   { _id: '2', name: 'Jane Smith', role: 'Engineer' },
//           //   { _id: '3', name: 'Mike Johnson', role: 'Operator' },
//           //   { _id: '4', name: 'Sarah Wilson', role: 'Technician' },
//           // ])
//           setWorkers(data?.users);
//         } catch (error) {
//           console.error('Error fetching workers:', error)
//         }
//       }
//     }
    
//     if (selectedAssignment) {
//       fetchWorkers()
//     }
//   }, [selectedAssignment, companyData])

//   const toggleStage = (stageIndex) => {
//     setExpandedStages(prev => ({
//       ...prev,
//       [stageIndex]: !prev[stageIndex]
//     }))
//   }

//   const toggleTask = (stageIndex, taskIndex) => {
//     const key = `${stageIndex}-${taskIndex}`
//     setExpandedTasks(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }))
//   }

// const toggleSelection = (type, stageIndex, taskIndex = null) => {
//    const key = type === 'stage' ? `stage-${stageIndex}` : `stage-${stageIndex}-task-${taskIndex}`;
  
//   if (assignedWorkers[key]) {
//     return; // Skip if already assigned
//   }
//   if (type === 'stage') {
//     const stageKey = `stage-${stageIndex}`
//     const isCurrentlySelected = !selectedItems[stageKey]
//     const newSelectedItems = { ...selectedItems }
//     const newAssignedWorkers = { ...assignedWorkers }
    
//     // Toggle the stage selection
//     newSelectedItems[stageKey] = isCurrentlySelected
    
//     // Toggle all tasks in this stage and remove assigned workers if unselecting
//     const stage = selectedAssignment.prototypeData.stages[stageIndex]
//     if (stage.tasks) {
//       stage.tasks.forEach((task, taskIndex) => {
//         const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//         newSelectedItems[taskKey] = isCurrentlySelected
        
//         // Remove assigned worker if unselecting
//         if (!isCurrentlySelected && newAssignedWorkers[taskKey]) {
//           delete newAssignedWorkers[taskKey]
//         }
//       })
//     }
    
//     // Remove stage assigned worker if unselecting
//     if (!isCurrentlySelected && newAssignedWorkers[stageKey]) {
//       delete newAssignedWorkers[stageKey]
//     }
    
//     setSelectedItems(newSelectedItems)
//     setAssignedWorkers(newAssignedWorkers)
//   } else if (type === 'task') {
//     const key = `stage-${stageIndex}-task-${taskIndex}`
//     const isCurrentlySelected = !selectedItems[key]
//     const newSelectedItems = { ...selectedItems }
//     const newAssignedWorkers = { ...assignedWorkers }
    
//     newSelectedItems[key] = isCurrentlySelected
    
//     // Remove assigned worker if unselecting
//     if (!isCurrentlySelected && newAssignedWorkers[key]) {
//       delete newAssignedWorkers[key]
//     }
    
//     setSelectedItems(newSelectedItems)
//     setAssignedWorkers(newAssignedWorkers)
//   }
// }

// const assignWorker = (workerId, workerName) => {
//   const newAssignedWorkers = { ...assignedWorkers };
//   const currentSelectedItems = { ...selectedItems }; // Copy current selection
  
//   // Assign worker only to currently selected items
//   Object.keys(currentSelectedItems).forEach(key => {
//     if (currentSelectedItems[key]) {
//       newAssignedWorkers[key] = { id: workerId, name: workerName };
      
//       // If a stage is assigned, assign all tasks in that stage to the same worker
//       if (key.startsWith('stage-') && !key.includes('task')) {
//         const stageIndex = parseInt(key.split('-')[1]);
//         const stage = selectedAssignment.prototypeData.stages[stageIndex];
        
//         if (stage.tasks) {
//           stage.tasks.forEach((task, taskIndex) => {
//             const taskKey = `stage-${stageIndex}-task-${taskIndex}`;
//             newAssignedWorkers[taskKey] = { id: workerId, name: workerName };
//           });
//         }
//       }
//     }
//   });
  
//   setAssignedWorkers(newAssignedWorkers);
//   setSelectedItems({}); // Clear selection after assignment
//   setShowWorkerList(false);
  
//   console.log('Assigned worker:', workerId, 'to items:', Object.keys(currentSelectedItems).filter(key => currentSelectedItems[key]));
// };

//   const resetModal = () => {
//     setSelectedAssignment(null)
//     setExpandedStages({})
//     setExpandedTasks({})
//     setSelectedItems({})
//     setShowWorkerList(false)
//     setAssignedWorkers({})
//     setWorkerSearchTerm('')
//   }

//   const filteredAssignments = assignments.filter(assignment => {
//     const matchesSearch = assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    
//     return matchesSearch && matchesStatus
//   })

//   const filteredWorkers = workers.filter(worker => 
//     worker.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
//     worker.role.toLowerCase().includes(workerSearchTerm.toLowerCase())
//   )

//   // Check if a stage has all tasks assigned
//   const isStageFullyAssigned = (stageIndex) => {
//     const stage = selectedAssignment.prototypeData.stages[stageIndex]
//     if (!stage.tasks || stage.tasks.length === 0) return false
    
//     return stage.tasks.every((task, taskIndex) => {
//       const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//       return assignedWorkers[taskKey]
//     })
//   }
// const prepareAssignmentData = () => {
//   if (!selectedAssignment) return null;

//   const result = {
  
//     companyId: companyData?.companyId,
//     assignedBy: companyData?.userId || companyData?.id,
//     assignedDate: new Date().toISOString(),
//     status: "Assigned",
//     stages: selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
//       const stageKey = `stage-${stageIndex}`;
//       const stageWorker = assignedWorkers[stageKey] || null;

//       return {
//         // Preserve all original stage fields
//         ...stage,
//         stageId: stage._id || `stage-${stageIndex}`,
//         assignedWorker: stageWorker,
//         status: stageWorker ? "Assigned" : "Unassigned",
//         tasks: stage.tasks?.map((task, taskIndex) => {
//           const taskKey = `stage-${stageIndex}-task-${taskIndex}`;
//           const taskWorker = assignedWorkers[taskKey] || null;

//           return {
//             // Preserve all original task fields
//             ...task,
//             taskId: task._id || `task-${stageIndex}-${taskIndex}`,
//             assignedWorker: taskWorker,
//             status: taskWorker ? "Assigned" : "Unassigned",
//             subtasks: task.subtasks?.map((subtask, subtaskIndex) => {
//               const subtaskKey = `stage-${stageIndex}-task-${taskIndex}-subtask-${subtaskIndex}`;
//               const subtaskWorker = assignedWorkers[subtaskKey] || taskWorker || null;
              
//               return {
//                 // Preserve all original subtask fields
//                 ...subtask,
//                 subtaskId: subtask._id || `subtask-${stageIndex}-${taskIndex}-${subtaskIndex}`,
//                 assignedWorker: subtaskWorker,
//                 status: subtaskWorker ? "Assigned" : "Unassigned",
//               };
//             }) || [],
//           };
//         }) || [],
//       };
//     }) || [],
//   };

//   return result;
// };

// const handleUpdateAssignment = async () => {
//   const updatedData = prepareAssignmentData();

//   const res = await fetch(`/api/assignment/update-assignment-for-assign/${selectedAssignment._id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       stages: updatedData.stages, 
//       status: updatedData.status,
//     }),
//   });

//   const data = await res.json();
//   console.log("Updated Assignment:", data);
// };

//   // Check if a stage has some tasks assigned
//   const isStagePartiallyAssigned = (stageIndex) => {
//     const stage = selectedAssignment.prototypeData.stages[stageIndex]
//     if (!stage.tasks || stage.tasks.length === 0) return false
    
//     const assignedCount = stage.tasks.filter((task, taskIndex) => {
//       const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//       return assignedWorkers[taskKey]
//     }).length
    
//     return assignedCount > 0 && assignedCount < stage.tasks.length
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 relative">
//       <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Assign Worker</h1>
//               <p className="text-gray-600 mt-2 text-md">Manage and assign worker for task execution processes</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="mx-6 mt-6">
//         <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             {/* Search Bar */}
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search assignments..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             {/* Status Filter */}
//             <div className="flex items-center space-x-2">
//               <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                 Filter by:
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                   <Filter className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <select
//                   id="status-filter"
//                   className="block w-full pl-9 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Rejected">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Assignments Table */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Assignments</h2>
          
//           {assignments.length === 0 ? (
//             <p className="text-gray-500 text-center py-8">No approved assignments found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Equipment Name
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Checklist Name
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Generated ID
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAssignments.map((assignment) => (
//                     <tr key={assignment._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {assignment.equipment?.name || 'N/A'}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {assignment.equipment?.assetTag || 'No asset tag'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {assignment.prototypeData?.name || 'N/A'}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Version: {assignment.prototypeData?.version || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {assignment.generatedId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           assignment.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                           assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {assignment.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
//                             onClick={() => {
//                               setSelectedAssignment(assignment)
//                               setSelectedItems({})
//                               setAssignedWorkers({})
//                               setExpandedStages({})
//                               setExpandedTasks({})
//                             }}
//                           >
//                             <Eye className="w-5 h-5" />
//                           </button>
                         
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Assignment Modal */}
//       {selectedAssignment && (
//         <div className="absolute inset-0 backdrop-blur  bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//           <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {selectedAssignment.prototypeData?.name} - Assign Workers
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Equipment: {selectedAssignment.equipment?.name} | ID: {selectedAssignment.generatedId}
//                 </p>
//               </div>
//               <button 
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                 onClick={resetModal}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             {/* Modal Body */}
//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="mb-6 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-600">Select stages or tasks to assign workers</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {Object.values(selectedItems).filter(item => item).length} item(s) selected
//                   </p>
//                 </div>
//                 <button
//                   className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
//                     Object.values(selectedItems).some(item => item) 
//                       ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
//                       : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                   }`}
//                   disabled={!Object.values(selectedItems).some(item => item)}
//                   onClick={() => setShowWorkerList(true)}
//                 >
//                   <User className="w-4 h-4" />
//                   Assign Worker
//                 </button>
//               </div>
              
//               {/* Stages and Tasks */}
//               <div className="space-y-6">
//                 {selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
//                   const stageKey = `stage-${stageIndex}`
//                   const isStageSelected = selectedItems[stageKey] || isStageFullyAssigned(stageIndex)
//                   const stageWorker = assignedWorkers[stageKey]
//                   const isExpanded = expandedStages[stageIndex]
                  
//                   return (
//                     <div key={stage._id || stageIndex} className="border border-gray-200 rounded-xl shadow-sm">
//                       <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between rounded-t-xl">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                            <input
//   type="checkbox"
//   checked={isStageSelected || false}
//   onChange={() => toggleSelection('stage', stageIndex)}
//   disabled={!!assignedWorkers[stageKey]} // Disable if already assigned
//   className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
// />
//                             {isStagePartiallyAssigned(stageIndex) && !isStageSelected && (
//                               <div className="absolute inset-0 flex items-center justify-center">
//                                 <div className="w-3 h-0.5 bg-blue-600"></div>
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <h5 className="font-semibold text-gray-900 text-lg">
//                               Stage {stageIndex + 1}: {stage.name}
//                             </h5>
//                             <p className="text-sm text-gray-600 mt-1">
//                               {stage.tasks?.length || 0} task(s)
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                          {assignedWorkers[stageKey] && (
//   <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">
//     Assigned: {assignedWorkers[stageKey].name}
//   </span>
// )}
//                           <button 
//                             className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                             onClick={() => toggleStage(stageIndex)}
//                           >
//                             {isExpanded ? (
//                               <ChevronDown className="w-5 h-5" />
//                             ) : (
//                               <ChevronRight className="w-5 h-5" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
                      
//                       {isExpanded && (
//                         <div className="border-t border-gray-200">
//                           <div className="p-4 space-y-4 bg-white">
//                             {stage.tasks && stage.tasks.length > 0 ? (
//                               stage.tasks.map((task, taskIndex) => {
//                                 const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//                                 const isTaskSelected = selectedItems[taskKey] || !!assignedWorkers[taskKey]
//                                 const taskWorker = assignedWorkers[taskKey]
//                                 const isTaskExpanded = expandedTasks[`${stageIndex}-${taskIndex}`]
                                
//                                 return (
//                                   <div key={task._id || taskIndex} className="border border-gray-200 rounded-lg overflow-hidden">
//                                     <div className="p-3 bg-gray-50 flex items-center justify-between">
//                                       <div className="flex items-center gap-3">
//                                         <div className="relative">
//                                           <input
//                                             type="checkbox"
//                                             checked={isTaskSelected || false}
//                                             onChange={() => toggleSelection('task', stageIndex, taskIndex)}
//                                             className="h-4 w-4 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
//                                           />
//                                           {!!assignedWorkers[taskKey] && (
//                                             <Check className="absolute top-0 left-0 w-4 h-4 text-white bg-blue-600 rounded pointer-events-none" />
//                                           )}
//                                         </div>
//                                         <div>
//                                           <h6 className="font-medium text-gray-900">
//                                             Task {stageIndex + 1}.{taskIndex + 1}: {task.title}
//                                           </h6>
//                                           {task.description && (
//                                             <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         {taskWorker && (
//                                           <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium border border-green-200">
//                                             {taskWorker.name}
//                                           </span>
//                                         )}
//                                         {task.subtasks && task.subtasks.length > 0 && (
//                                           <button 
//                                             className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
//                                             onClick={() => toggleTask(stageIndex, taskIndex)}
//                                           >
//                                             {isTaskExpanded ? (
//                                               <ChevronDown className="w-4 h-4" />
//                                             ) : (
//                                               <ChevronRight className="w-4 h-4" />
//                                             )}
//                                           </button>
//                                         )}
//                                       </div>
//                                     </div>
                                    
//                                     {isTaskExpanded && task.subtasks && task.subtasks.length > 0 && (
//                                       <div className="p-4 bg-white border-t border-gray-200">
//                                         <h6 className="font-medium text-gray-800 text-sm mb-3 flex items-center gap-2">
//                                           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                           Subtasks ({task.subtasks.length})
//                                         </h6>
//                                         <div className="space-y-3">
//                                           {task.subtasks.map((subtask, subtaskIndex) => (
//                                             <div key={subtask._id || subtaskIndex} className="ml-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                               <div className="flex items-start gap-3">
//                                                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
//                                                 <div>
//                                                   <h6 className="font-medium text-gray-900 text-sm">
//                                                     {subtaskIndex + 1}. {subtask.title}
//                                                   </h6>
//                                                   {subtask.description && (
//                                                     <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 )
//                               })
//                             ) : (
//                               <p className="text-gray-500 text-center py-4 italic">No tasks defined for this stage</p>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
            
//             {/* Modal Footer */}
//             <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
//               <button 
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 onClick={resetModal}
//               >
//                 Cancel
//               </button>
//               <button 
//     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
//     onClick={handleUpdateAssignment}
//   >
//     Save Assignments
//   </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Worker List Modal */}
//       {showWorkerList && (
//         <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//               <h3 className="text-xl font-semibold text-gray-900">Select Worker</h3>
//               <button 
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                 onClick={() => setShowWorkerList(false)}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             <div className="p-4 border-b border-gray-200">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search workers..."
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={workerSearchTerm}
//                   onChange={(e) => setWorkerSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <div className="space-y-3">
//                 {filteredWorkers.map(worker => (
//                   <div 
//                     key={worker._id} 
//                     className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 group"
//                     onClick={() => assignWorker(worker._id, worker.name)}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium text-gray-900 group-hover:text-blue-900">{worker.name}</h4>
//                         <p className="text-sm text-gray-500 group-hover:text-blue-700">{worker.role}</p>
//                       </div>
//                       <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {filteredWorkers.length === 0 && (
//                 <p className="text-gray-500 text-center py-8">No workers available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'
import React, { useEffect, useState } from 'react'
import { Sparkles, Eye, Edit, MoreVertical, X, ChevronDown, ChevronRight, User, Check, Search, Filter, Users } from 'lucide-react'

export default function AssignWorkerPage() {
  const [assignments, setAssignments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [companyData, setCompanyData] = useState()
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [expandedStages, setExpandedStages] = useState({})
  const [expandedTasks, setExpandedTasks] = useState({})
  const [selectedItems, setSelectedItems] = useState({})
  const [showWorkerList, setShowWorkerList] = useState(false)
  const [workers, setWorkers] = useState([])
  const [assignedWorkers, setAssignedWorkers] = useState({})
  const [workerSearchTerm, setWorkerSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    setCompanyData(user);
  }, [])

  const fetchWorker = async () => {
    if (companyData?.companyId) {
      try {
        const respon = await fetch(`/api/task-execution/${companyData.companyId}`);
        const dataresp = await respon.json();
        console.log("worker data:", dataresp);
      } catch (error) {
        console.error('Error fetching workers:', error)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (companyData?.companyId) {
        try {
          const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`)
          const data = await res.json()
          const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status === "Assigned")
          setAssignments(approvedAssignments)
        } catch (error) {
          console.error('Error fetching assignments:', error)
        }
      }
    }
    
    fetchData();
    fetchWorker();
  }, [companyData])

  useEffect(() => {
    const fetchWorkers = async () => {
      if (companyData?.companyId) {
        try {
          const res = await fetch(`/api/task-execution/${companyData.companyId}`)
          const data = await res.json()
          setWorkers(data?.users || []);
        } catch (error) {
          console.error('Error fetching workers:', error)
        }
      }
    }
    
    if (selectedAssignment) {
      fetchWorkers()
    }
  }, [selectedAssignment, companyData])

  const toggleStage = (stageIndex) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageIndex]: !prev[stageIndex]
    }))
  }

  const toggleTask = (stageIndex, taskIndex) => {
    const key = `${stageIndex}-${taskIndex}`
    setExpandedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleSelection = (type, stageIndex, taskIndex = null) => {
    const key = type === 'stage' ? `stage-${stageIndex}` : `stage-${stageIndex}-task-${taskIndex}`;
  
    if (assignedWorkers[key]) {
      return; // Skip if already assigned
    }
    if (type === 'stage') {
      const stageKey = `stage-${stageIndex}`
      const isCurrentlySelected = !selectedItems[stageKey]
      const newSelectedItems = { ...selectedItems }
      const newAssignedWorkers = { ...assignedWorkers }
      
      // Toggle the stage selection
      newSelectedItems[stageKey] = isCurrentlySelected
      
      // Toggle all tasks in this stage and remove assigned workers if unselecting
      const stage = selectedAssignment.prototypeData.stages[stageIndex]
      if (stage.tasks) {
        stage.tasks.forEach((task, taskIndex) => {
          const taskKey = `stage-${stageIndex}-task-${taskIndex}`
          newSelectedItems[taskKey] = isCurrentlySelected
          
          // Remove assigned worker if unselecting
          if (!isCurrentlySelected && newAssignedWorkers[taskKey]) {
            delete newAssignedWorkers[taskKey]
          }
        })
      }
      
      // Remove stage assigned worker if unselecting
      if (!isCurrentlySelected && newAssignedWorkers[stageKey]) {
        delete newAssignedWorkers[stageKey]
      }
      
      setSelectedItems(newSelectedItems)
      setAssignedWorkers(newAssignedWorkers)
    } else if (type === 'task') {
      const key = `stage-${stageIndex}-task-${taskIndex}`
      const isCurrentlySelected = !selectedItems[key]
      const newSelectedItems = { ...selectedItems }
      const newAssignedWorkers = { ...assignedWorkers }
      
      newSelectedItems[key] = isCurrentlySelected
      
      // Remove assigned worker if unselecting
      if (!isCurrentlySelected && newAssignedWorkers[key]) {
        delete newAssignedWorkers[key]
      }
      
      setSelectedItems(newSelectedItems)
      setAssignedWorkers(newAssignedWorkers)
    }
  }

  const assignWorker = (workerId, workerName) => {
    const newAssignedWorkers = { ...assignedWorkers };
    const currentSelectedItems = { ...selectedItems };
    
    // Assign worker only to currently selected items
    Object.keys(currentSelectedItems).forEach(key => {
      if (currentSelectedItems[key]) {
        newAssignedWorkers[key] = { id: workerId, name: workerName };
        
        // If a stage is assigned, assign all tasks in that stage to the same worker
        if (key.startsWith('stage-') && !key.includes('task')) {
          const stageIndex = parseInt(key.split('-')[1]);
          const stage = selectedAssignment.prototypeData.stages[stageIndex];
          
          if (stage.tasks) {
            stage.tasks.forEach((task, taskIndex) => {
              const taskKey = `stage-${stageIndex}-task-${taskIndex}`;
              newAssignedWorkers[taskKey] = { id: workerId, name: workerName };
            });
          }
        }
      }
    });
    
    setAssignedWorkers(newAssignedWorkers);
    setSelectedItems({});
    setShowWorkerList(false);
  };

  const resetModal = () => {
    setSelectedAssignment(null)
    setExpandedStages({})
    setExpandedTasks({})
    setSelectedItems({})
    setShowWorkerList(false)
    setAssignedWorkers({})
    setWorkerSearchTerm('')
    setViewMode(false)
  }

  const handleViewWorkers = (assignment) => {
    setSelectedAssignment(assignment)
    setViewMode(true)
    
    // Pre-populate assigned workers from the assignment data
    const workersMap = {}
    
    // Check both possible locations for assigned workers
    const stages = assignment.stages || (assignment.prototypeData ? assignment.prototypeData.stages : [])
    
    if (stages && stages.length > 0) {
      stages.forEach((stage, stageIndex) => {
        const stageKey = `stage-${stageIndex}`
        
        // Check for assigned worker in stage
        if (stage.assignedWorker) {
          workersMap[stageKey] = stage.assignedWorker
        }
        
        // Check for assigned workers in tasks
        if (stage.tasks) {
          stage.tasks.forEach((task, taskIndex) => {
            const taskKey = `stage-${stageIndex}-task-${taskIndex}`
            if (task.assignedWorker) {
              workersMap[taskKey] = task.assignedWorker
            }
          })
        }
      })
    }
    
    // Also check if workers are stored at the assignment level
    if (assignment.assignedWorkers) {
      Object.assign(workersMap, assignment.assignedWorkers)
    }
    
    setAssignedWorkers(workersMap)
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(workerSearchTerm.toLowerCase())
  )

  // Check if a stage has all tasks assigned
  const isStageFullyAssigned = (stageIndex) => {
    const stage = selectedAssignment.prototypeData.stages[stageIndex]
    if (!stage.tasks || stage.tasks.length === 0) return false
    
    return stage.tasks.every((task, taskIndex) => {
      const taskKey = `stage-${stageIndex}-task-${taskIndex}`
      return assignedWorkers[taskKey]
    })
  }

  const prepareAssignmentData = () => {
    if (!selectedAssignment) return null;

    const result = {
      companyId: companyData?.companyId,
      assignedBy: companyData?.userId || companyData?.id,
      assignedDate: new Date().toISOString(),
      status: "Assigned",
      stages: selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
        const stageKey = `stage-${stageIndex}`;
        const stageWorker = assignedWorkers[stageKey] || null;

        return {
          // Preserve all original stage fields
          ...stage,
          stageId: stage._id || `stage-${stageIndex}`,
          assignedWorker: stageWorker,
          status: stageWorker ? "Assigned" : "Unassigned",
          tasks: stage.tasks?.map((task, taskIndex) => {
            const taskKey = `stage-${stageIndex}-task-${taskIndex}`;
            const taskWorker = assignedWorkers[taskKey] || null;

            return {
              // Preserve all original task fields
              ...task,
              taskId: task._id || `task-${stageIndex}-${taskIndex}`,
              assignedWorker: taskWorker,
              status: taskWorker ? "Assigned" : "Unassigned",
              subtasks: task.subtasks?.map((subtask, subtaskIndex) => {
                const subtaskKey = `stage-${stageIndex}-task-${taskIndex}-subtask-${subtaskIndex}`;
                const subtaskWorker = assignedWorkers[subtaskKey] || taskWorker || null;
                
                return {
                  // Preserve all original subtask fields
                  ...subtask,
                  subtaskId: subtask._id || `subtask-${stageIndex}-${taskIndex}-${subtaskIndex}`,
                  assignedWorker: subtaskWorker,
                  status: subtaskWorker ? "Assigned" : "Unassigned",
                };
              }) || [],
            };
          }) || [],
        };
      }) || [],
    };

    return result;
  };

  const handleUpdateAssignment = async () => {
    const updatedData = prepareAssignmentData();

    const res = await fetch(`/api/assignment/update-assignment-for-assign/${selectedAssignment._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stages: updatedData.stages, 
        status: updatedData.status,
      }),
    });

    const data = await res.json();
    console.log("Updated Assignment:", data);
    
    // Refresh the assignments list
    if (companyData?.companyId) {
      try {
        const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`)
        const data = await res.json()
        const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status === "Assigned")
        setAssignments(approvedAssignments)
      } catch (error) {
        console.error('Error fetching assignments:', error)
      }
    }
    
    resetModal();
  };

  // Check if a stage has some tasks assigned
  const isStagePartiallyAssigned = (stageIndex) => {
    const stage = selectedAssignment.prototypeData.stages[stageIndex]
    if (!stage.tasks || stage.tasks.length === 0) return false
    
    const assignedCount = stage.tasks.filter((task, taskIndex) => {
      const taskKey = `stage-${stageIndex}-task-${taskIndex}`
      return assignedWorkers[taskKey]
    }).length
    
    return assignedCount > 0 && assignedCount < stage.tasks.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <div className="bg-white border-b border-gray-200 rounded-xl m-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6  py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assign Resources</h1>
              <p className="text-gray-600 mt-2 text-md">Manage and assign resources for task execution processes</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mx-4 mt-2">
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assignments..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="status-filter"
                  className="block w-full pl-9 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Assignments</h2>
          
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No approved assignments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.equipment?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.equipment?.assetTag || 'No asset tag'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {assignment.prototypeData?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Version: {assignment.prototypeData?.version || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.generatedId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                          assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {assignment.status === 'Approved' ? (
                            <button 
                              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              onClick={() => {
                                setSelectedAssignment(assignment)
                                setSelectedItems({})
                                setAssignedWorkers({})
                                setExpandedStages({})
                                setExpandedTasks({})
                                setViewMode(false)
                              }}
                            >
                              <User className="w-4 h-4" />
                              Assign
                            </button>
                          ) : (
                            <button 
                              className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              onClick={() => handleViewWorkers(assignment)}
                            >
                              <Users className="w-4 h-4" />
                              View Workers
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Main Assignment Modal */}
      {selectedAssignment && (
        <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedAssignment.prototypeData?.name} - {viewMode ? 'View Assigned Resources' : 'Assign Resources'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Equipment: {selectedAssignment.equipment?.name} | ID: {selectedAssignment.generatedId}
                </p>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={resetModal}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {!viewMode && (
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Select stages or tasks to assign resources</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.values(selectedItems).filter(item => item).length} item(s) selected
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      Object.values(selectedItems).some(item => item) 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!Object.values(selectedItems).some(item => item)}
                    onClick={() => setShowWorkerList(true)}
                  >
                    <User className="w-4 h-4" />
                    Assign resources
                  </button>
                </div>
              )}
              
              {/* Stages and Tasks */}
              <div className="space-y-6">
                {selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
                  const stageKey = `stage-${stageIndex}`
                  const isStageSelected = selectedItems[stageKey] || isStageFullyAssigned(stageIndex)
                  const stageWorker = assignedWorkers[stageKey]
                  const isExpanded = expandedStages[stageIndex]
                  
                  return (
                    <div key={stage._id || stageIndex} className="border border-gray-200 rounded-xl shadow-sm">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between rounded-t-xl">
                        <div className="flex items-center gap-4">
                          {!viewMode && (
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isStageSelected || false}
                                onChange={() => toggleSelection('stage', stageIndex)}
                                disabled={!!assignedWorkers[stageKey]}
                                className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
                              />
                              {isStagePartiallyAssigned(stageIndex) && !isStageSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-3 h-0.5 bg-blue-600"></div>
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg">
                              Stage {stageIndex + 1}: {stage.name}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {stage.tasks?.length || 0} task(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {assignedWorkers[stageKey] && (
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">
                              Assigned: {assignedWorkers[stageKey].name || 'Unknown'}
                            </span>
                          )}
                          <button 
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => toggleStage(stageIndex)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200">
                          <div className="p-4 space-y-4 bg-white">
                            {stage.tasks && stage.tasks.length > 0 ? (
                              stage.tasks.map((task, taskIndex) => {
                                const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                                const isTaskSelected = selectedItems[taskKey] || !!assignedWorkers[taskKey]
                                const taskWorker = assignedWorkers[taskKey]
                                const isTaskExpanded = expandedTasks[`${stageIndex}-${taskIndex}`]
                                
                                return (
                                  <div key={task._id || taskIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="p-3 bg-gray-50 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {!viewMode && (
                                          <div className="relative">
                                            <input
                                              type="checkbox"
                                              checked={isTaskSelected || false}
                                              onChange={() => toggleSelection('task', stageIndex, taskIndex)}
                                              className="h-4 w-4 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
                                            />
                                            {!!assignedWorkers[taskKey] && (
                                              <Check className="absolute top-0 left-0 w-4 h-4 text-white bg-blue-600 rounded pointer-events-none" />
                                            )}
                                          </div>
                                        )}
                                        <div>
                                          <h6 className="font-medium text-gray-900">
                                            Task {stageIndex + 1}.{taskIndex + 1}: {task.title}
                                          </h6>
                                          {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {taskWorker && (
                                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium border border-green-200">
                                            {taskWorker.name || 'Unknown'}
                                          </span>
                                        )}
                                        {task.subtasks && task.subtasks.length > 0 && (
                                          <button 
                                            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                                            onClick={() => toggleTask(stageIndex, taskIndex)}
                                          >
                                            {isTaskExpanded ? (
                                              <ChevronDown className="w-4 h-4" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {isTaskExpanded && task.subtasks && task.subtasks.length > 0 && (
                                      <div className="p-4 bg-white border-t border-gray-200">
                                        <h6 className="font-medium text-gray-800 text-sm mb-3 flex items-center gap-2">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          Subtasks ({task.subtasks.length})
                                        </h6>
                                        <div className="space-y-3">
                                          {task.subtasks.map((subtask, subtaskIndex) => (
                                            <div key={subtask._id || subtaskIndex} className="ml-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                              <div className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <div>
                                                  <h6 className="font-medium text-gray-900 text-sm">
                                                    {subtaskIndex + 1}. {subtask.title}
                                                  </h6>
                                                  {subtask.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-gray-500 text-center py-4 italic">No tasks defined for this stage</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Modal Footer */}
            {!viewMode && (
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={resetModal}
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                  onClick={handleUpdateAssignment}
                >
                  Save Assignments
                </button>
              </div>
            )}
            {viewMode && (
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={resetModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Worker List Modal */}
      {showWorkerList && (
        <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-900">Select Worker</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => setShowWorkerList(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search workers..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={workerSearchTerm}
                  onChange={(e) => setWorkerSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {filteredWorkers.map(worker => (
                  <div 
                    key={worker._id} 
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 group"
                    onClick={() => assignWorker(worker._id, worker.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-900">{worker.name}</h4>
                        <p className="text-sm text-gray-500 group-hover:text-blue-700">{worker.role}</p>
                      </div>
                      <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
              {filteredWorkers.length === 0 && (
                <p className="text-gray-500 text-center py-8">No workers available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}