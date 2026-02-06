
// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Sparkles, Eye, Edit, MoreVertical, X, ChevronDown, ChevronRight, User, Check, Search, Filter, Users } from 'lucide-react'

// export default function AssignWorkerPage() {
//     const [assignments, setAssignments] = useState([])
//     const [searchTerm, setSearchTerm] = useState('')
//     const [statusFilter, setStatusFilter] = useState('all')
//     const [companyData, setCompanyData] = useState()
//     const [selectedAssignment, setSelectedAssignment] = useState(null)
//     const [expandedStages, setExpandedStages] = useState({})
//     const [expandedTasks, setExpandedTasks] = useState({})
//     const [selectedItems, setSelectedItems] = useState({})
//     const [showWorkerList, setShowWorkerList] = useState(false)
//     const [workers, setWorkers] = useState([])
//     const [assignedWorkers, setAssignedWorkers] = useState({})
//     const [workerSearchTerm, setWorkerSearchTerm] = useState('')
//     const [viewMode, setViewMode] = useState(false)
//     const [selectedWorkers, setSelectedWorkers] = useState([])

//     useEffect(() => {
//         const userData = localStorage.getItem('user')
//         const user = JSON.parse(userData)
//         setCompanyData(user)
//     }, [])

//     const fetchWorker = async () => {
//         if (companyData?.companyId) {
//             try {
//                 const respon = await fetch(`/api/task-execution/${companyData.companyId}`)
//                 const dataresp = await respon.json()
//                 console.log("worker data:", dataresp)
//             } catch (error) {
//                 console.error('Error fetching workers:', error)
//             }
//         }
//     }

//     useEffect(() => {
//         const fetchData = async () => {
//             if (companyData?.companyId) {
//                 try {
//                     const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`)
//                     const data = await res.json()
//                     const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status === "Assigned")
//                     setAssignments(approvedAssignments)
//                 } catch (error) {
//                     console.error('Error fetching assignments:', error)
//                 }
//             }
//         }

//         fetchData()
//         fetchWorker()
//     }, [companyData])

//     useEffect(() => {
//         const fetchWorkers = async () => {
//             if (companyData?.companyId) {
//                 try {
//                     const res = await fetch(`/api/task-execution/${companyData.companyId}`)
//                     const data = await res.json()
//                     setWorkers(data?.users || [])
//                 } catch (error) {
//                     console.error('Error fetching workers:', error)
//                 }
//             }
//         }

//         if (selectedAssignment) {
//             fetchWorkers()
//         }
//     }, [selectedAssignment, companyData])

//     const toggleStage = (stageIndex) => {
//         setExpandedStages(prev => ({
//             ...prev,
//             [stageIndex]: !prev[stageIndex]
//         }))
//     }

//     const toggleTask = (stageIndex, taskIndex) => {
//         const key = `${stageIndex}-${taskIndex}`
//         setExpandedTasks(prev => ({
//             ...prev,
//             [key]: !prev[key]
//         }))
//     }

//     const toggleSelection = (type, stageIndex, taskIndex = null) => {
//         const key = type === 'stage' ? `stage-${stageIndex}` : `stage-${stageIndex}-task-${taskIndex}`
//         setSelectedItems(prev => ({
//             ...prev,
//             [key]: !prev[key]
//         }))
//     }

//     const toggleWorkerSelection = (workerId) => {
//         setSelectedWorkers(prev =>
//             prev.includes(workerId)
//                 ? prev.filter(id => id !== workerId)
//                 : [...prev, workerId]
//         )
//     }

//     const assignWorker = () => {
//         const newAssignedWorkers = { ...assignedWorkers }
//         const currentSelectedItems = { ...selectedItems }
//         const newSelectedItems = { ...selectedItems }

//         Object.keys(currentSelectedItems).forEach(key => {
//             if (currentSelectedItems[key]) {
//                 newAssignedWorkers[key] = newAssignedWorkers[key] || []
//                 selectedWorkers.forEach(workerId => {
//                     const worker = workers.find(w => w._id === workerId)
//                     if (worker && !newAssignedWorkers[key].some(w => w.id === workerId)) {
//                         newAssignedWorkers[key].push({ id: workerId, name: worker.name })
//                     }
//                 })
//                 // Uncheck the item after assignment
//                 newSelectedItems[key] = false
//             }
//         })

//         setAssignedWorkers(newAssignedWorkers)
//         setSelectedItems(newSelectedItems)
//         setSelectedWorkers([])
//         setShowWorkerList(false)
//     }

//     const removeWorker = (key, workerId) => {
//         setAssignedWorkers(prev => ({
//             ...prev,
//             [key]: prev[key].filter(worker => worker.id !== workerId)
//         }))
//     }

//     const resetModal = () => {
//         setSelectedAssignment(null)
//         setExpandedStages({})
//         setExpandedTasks({})
//         setSelectedItems({})
//         setShowWorkerList(false)
//         setAssignedWorkers({})
//         setWorkerSearchTerm('')
//         setSelectedWorkers([])
//         setViewMode(false)
//     }
// const isAllItemsAssigned = () => {
//   if (!selectedAssignment || !selectedAssignment.prototypeData?.stages) return false
  
//   const stages = selectedAssignment.prototypeData.stages
  
//   // Check all stages and tasks
//   return stages.every((stage, stageIndex) => {
//     const stageKey = `stage-${stageIndex}`
//     const stageWorkers = assignedWorkers[stageKey]
    
//     // If stage has workers assigned, it's considered assigned
//     if (stageWorkers && stageWorkers.length > 0) return true
    
//     // Check if all tasks in the stage are assigned
//     if (stage.tasks && stage.tasks.length > 0) {
//       return stage.tasks.every((task, taskIndex) => {
//         const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//         const taskWorkers = assignedWorkers[taskKey]
//         return taskWorkers && taskWorkers.length > 0
//       })
//     }
    
//     return false
//   })
// }
//     const handleViewWorkers = (assignment) => {
//         setSelectedAssignment(assignment)
//         setViewMode(true)

//         const workersMap = {}
//         const stages = assignment.stages || (assignment.prototypeData ? assignment.prototypeData.stages : [])

//         if (stages && stages.length > 0) {
//             stages.forEach((stage, stageIndex) => {
//                 const stageKey = `stage-${stageIndex}`
//                 if (stage.assignedWorker) {
//                     workersMap[stageKey] = Array.isArray(stage.assignedWorker) 
//                         ? stage.assignedWorker 
//                         : [stage.assignedWorker]
//                 }

//                 if (stage.tasks) {
//                     stage.tasks.forEach((task, taskIndex) => {
//                         const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//                         if (task.assignedWorker) {
//                             workersMap[taskKey] = Array.isArray(task.assignedWorker) 
//                                 ? task.assignedWorker 
//                                 : [task.assignedWorker]
//                         }
//                     })
//                 }
//             })
//         }

//         if (assignment.assignedWorkers) {
//             Object.keys(assignment.assignedWorkers).forEach(key => {
//                 workersMap[key] = Array.isArray(assignment.assignedWorkers[key])
//                     ? assignment.assignedWorkers[key]
//                     : [assignment.assignedWorkers[key]]
//             })
//         }

//         setAssignedWorkers(workersMap)
//     }

//     const filteredAssignments = assignments.filter(assignment => {
//         const matchesSearch = assignment.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             assignment.prototypeData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             assignment.generatedId?.toLowerCase().includes(searchTerm.toLowerCase())
//         const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
//         return matchesSearch && matchesStatus
//     })

//     const filteredWorkers = workers.filter(worker =>
//         worker.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
//         worker.role.toLowerCase().includes(workerSearchTerm.toLowerCase())
//     )

//     const isStageFullyAssigned = (stageIndex) => {
//         const stage = selectedAssignment.prototypeData.stages[stageIndex]
//         if (!stage.tasks || stage.tasks.length === 0) return false

//         return stage.tasks.every((task, taskIndex) => {
//             const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//             return assignedWorkers[taskKey]?.length > 0
//         })
//     }

//     const prepareAssignmentData = () => {
//         if (!selectedAssignment) return null
//         const result = {
//             companyId: companyData?.companyId,
//             assignedBy: companyData?.userId || companyData?.id,
//             assignedDate: new Date().toISOString(),
//             status: "Assigned",
//             stages: selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
//                 const stageKey = `stage-${stageIndex}`
//                 const stageWorkers = assignedWorkers[stageKey] || []
//                 return {
//                     ...stage,
//                     stageId: stage._id || `stage-${stageIndex}`,
//                     assignedWorker: stageWorkers,
//                     status: stageWorkers.length > 0 ? "Assigned" : "Unassigned",
//                     tasks: stage.tasks?.map((task, taskIndex) => {
//                         const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//                         const taskWorkers = assignedWorkers[taskKey] || []
//                         return {
//                             ...task,
//                             taskId: task._id || `task-${stageIndex}-${taskIndex}`,
//                             assignedWorker: taskWorkers,
//                             status: taskWorkers.length > 0 ? "Assigned" : "Unassigned",
//                             subtasks: task.subtasks?.map((subtask, subtaskIndex) => {
//                                 const subtaskKey = `stage-${stageIndex}-task-${taskIndex}-subtask-${subtaskIndex}`
//                                 const subtaskWorkers = assignedWorkers[subtaskKey] || taskWorkers
//                                 return {
//                                     ...subtask,
//                                     subtaskId: subtask._id || `subtask-${stageIndex}-${taskIndex}-${subtaskIndex}`,
//                                     assignedWorker: subtaskWorkers,
//                                     status: subtaskWorkers.length > 0 ? "Assigned" : "Unassigned",
//                                 }
//                             }) || [],
//                         }
//                     }) || [],
//                 }
//             }) || [],
//         }
//         return result
//     }
// const getAssignmentProgress = () => {
//   if (!selectedAssignment || !selectedAssignment.prototypeData?.stages) {
//     return { assignedCount: 0, totalCount: 0 }
//   }
  
//   const stages = selectedAssignment.prototypeData.stages
//   let assignedCount = 0
//   let totalCount = 0
  
//   stages.forEach((stage, stageIndex) => {
//     const stageKey = `stage-${stageIndex}`
//     totalCount++ // Count stage as an item
    
//     if (assignedWorkers[stageKey]?.length > 0) {
//       assignedCount++ // Stage is assigned
//     } else if (stage.tasks) {
//       // If stage not directly assigned, check tasks
//       stage.tasks.forEach((task, taskIndex) => {
//         const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//         totalCount++ // Count task as an item
        
//         if (assignedWorkers[taskKey]?.length > 0) {
//           assignedCount++ // Task is assigned
//         }
//       })
//     }
//   })
  
//   return { assignedCount, totalCount }
// }
//     const handleUpdateAssignment = async () => {


//          if (!isAllItemsAssigned()) {
//     alert("Please assign workers to all tasks and stages before saving.")
//     return
//   }
//         const updatedData = prepareAssignmentData()
//         const res = await fetch(`/api/assignment/update-assignment-for-assign/${selectedAssignment._id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 stages: updatedData.stages,
//                 status: updatedData.status,
//             }),
//         })
//         const data = await res.json()
//         console.log("Updated Assignment:", data)

//         if (companyData?.companyId) {
//             try {
//                 const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`)
//                 const data = await res.json()
//                 const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status === "Assigned")
//                 setAssignments(approvedAssignments)
//             } catch (error) {
//                 console.error('Error fetching assignments:', error)
//             }
//         }

//         resetModal()
//     }

//     const isStagePartiallyAssigned = (stageIndex) => {
//         const stage = selectedAssignment.prototypeData.stages[stageIndex]
//         if (!stage.tasks || stage.tasks.length === 0) return false

//         const assignedCount = stage.tasks.filter((task, taskIndex) => {
//             const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//             return assignedWorkers[taskKey]?.length > 0
//         }).length

//         return assignedCount > 0 && assignedCount < stage.tasks.length
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
//             <div className="bg-white border-b border-gray-200 rounded-xl m-4 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                     <div className="flex items-center space-x-4">
//                         <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
//                             <Sparkles className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Assign Resources</h1>
//                             <p className="text-gray-600 mt-2 text-md">Manage and assign resources for task execution processes</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="mx-4 mt-2">
//                 <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="relative flex-1">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Search className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search assignments..."
//                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>

//                         <div className="flex items-center space-x-2">
//                             <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                                 Filter by:
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                                     <Filter className="h-4 w-4 text-gray-400" />
//                                 </div>
//                                 <select
//                                     id="status-filter"
//                                     className="block w-full pl-9 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
//                                     value={statusFilter}
//                                     onChange={(e) => setStatusFilter(e.target.value)}
//                                 >
//                                     <option value="all">All Statuses</option>
//                                     <option value="Approved">Approved</option>
//                                     <option value="Assigned">Assigned</option>
//                                     <option value="Pending">Pending</option>
//                                     <option value="Rejected">Rejected</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Assignments</h2>

//                     {assignments.length === 0 ? (
//                         <p className="text-gray-500 text-center py-8">No approved assignments found.</p>
//                     ) : (
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Equipment Name
//                                         </th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Checklist Name
//                                         </th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Generated ID
//                                         </th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Status
//                                         </th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {filteredAssignments.map((assignment) => (
//                                         <tr key={assignment._id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {assignment.equipment?.name || 'N/A'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {assignment.equipment?.assetTag || 'No asset tag'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">
//                                                     {assignment.prototypeData?.name || 'N/A'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     Version: {assignment.prototypeData?.version || 'N/A'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {assignment.generatedId}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                                     assignment.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                                                     assignment.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
//                                                     assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                                                     'bg-red-100 text-red-800'
//                                                 }`}>
//                                                     {assignment.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 <div className="flex items-center space-x-2">
//                                                     {assignment.status === 'Approved' ? (
//                                                         <button
//                                                             className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
//                                                             onClick={() => {
//                                                                 setSelectedAssignment(assignment)
//                                                                 setSelectedItems({})
//                                                                 setAssignedWorkers({})
//                                                                 setExpandedStages({})
//                                                                 setExpandedTasks({})
//                                                                 setViewMode(false)
//                                                             }}
//                                                         >
//                                                             <User className="w-4 h-4" />
//                                                             Assign Resources
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
//                                                             onClick={() => handleViewWorkers(assignment)}
//                                                         >
//                                                             <Users className="w-4 h-4" />
//                                                             View Resources
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {selectedAssignment && (
//                 <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//                     <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-900">
//                                     {selectedAssignment.prototypeData?.name} - {viewMode ? 'View Assigned Resources' : 'Assign Resources'}
//                                 </h3>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Equipment: {selectedAssignment.equipment?.name} | ID: {selectedAssignment.generatedId}
//                                 </p>
//                             </div>
//                             <button
//                                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                                 onClick={resetModal}
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="flex-1 overflow-y-auto p-6">
                         

// {!viewMode && (
//   <div className="mb-6 flex justify-between items-center">
//     <div>
//       <p className="text-sm text-gray-600">Select stages or tasks to assign resources</p>
//       <p className="text-xs text-gray-500 mt-1">
//         {getAssignmentProgress().assignedCount} of {getAssignmentProgress().totalCount} items assigned
//       </p>
//       {!isAllItemsAssigned() && (
//         <p className="text-xs text-red-500 mt-1">
//           All items must be assigned before saving
//         </p>
//       )}
//     </div>
//     <button
//       className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
//         Object.values(selectedItems).some(item => item)
//           ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
//           : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//       }`}
//       disabled={!Object.values(selectedItems).some(item => item)}
//       onClick={() => setShowWorkerList(true)}
//     >
//       <User className="w-4 h-4" />
//       Assign resources
//     </button>
//   </div>
// )}
//                             <div className="space-y-6">
//                                 {selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
//                                     const stageKey = `stage-${stageIndex}`
//                                     const isStageSelected = selectedItems[stageKey] || isStageFullyAssigned(stageIndex)
//                                     const stageWorkers = assignedWorkers[stageKey] || []
//                                     const isExpanded = expandedStages[stageIndex]

//                                     return (
//                                         <div key={stage._id || stageIndex} className="border border-gray-200 rounded-xl shadow-sm">
//                                             <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between rounded-t-xl">
//                                                 <div className="flex items-center gap-4">
//                                                     {!viewMode && (
//                                                         <div className="relative">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={isStageSelected || false}
//                                                                 onChange={() => toggleSelection('stage', stageIndex)}
//                                                                 disabled={stageWorkers.length > 0}
//                                                                 className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
//                                                             />
//                                                             {isStagePartiallyAssigned(stageIndex) && !isStageSelected && (
//                                                                 <div className="absolute inset-0 flex items-center justify-center">
//                                                                     <div className="w-3 h-0.5 bg-blue-600"></div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                     <div>
//                                                         <h5 className="font-semibold text-gray-900 text-lg">
//                                                             Stage {stageIndex + 1}: {stage.name}
//                                                         </h5>
//                                                         <p className="text-sm text-gray-600 mt-1">
//                                                             {stage.tasks?.length || 0} task(s)
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center gap-3">
//                                                     {stageWorkers.length > 0 && (
//                                                         <div className="flex flex-wrap gap-2">
//                                                             {stageWorkers.map(worker => (
//                                                                 <span
//                                                                     key={worker.id}
//                                                                     className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-2"
//                                                                 >
//                                                                     {worker.name || 'Unknown'}
//                                                                     {!viewMode && (
//                                                                         <button
//                                                                             onClick={() => removeWorker(stageKey, worker.id)}
//                                                                             className="text-blue-600 hover:text-blue-800"
//                                                                         >
//                                                                             <X className="w-4 h-4" />
//                                                                         </button>
//                                                                     )}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                     <button
//                                                         className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                                                         onClick={() => toggleStage(stageIndex)}
//                                                     >
//                                                         {isExpanded ? (
//                                                             <ChevronDown className="w-5 h-5" />
//                                                         ) : (
//                                                             <ChevronRight className="w-5 h-5" />
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             {isExpanded && (
//                                                 <div className="border-t border-gray-200">
//                                                     <div className="p-4 space-y-4 bg-white">
//                                                         {stage.tasks && stage.tasks.length > 0 ? (
//                                                             stage.tasks.map((task, taskIndex) => {
//                                                                 const taskKey = `stage-${stageIndex}-task-${taskIndex}`
//                                                                 const isTaskSelected = selectedItems[taskKey] || (assignedWorkers[taskKey]?.length > 0)
//                                                                 const taskWorkers = assignedWorkers[taskKey] || []
//                                                                 const isTaskExpanded = expandedTasks[`${stageIndex}-${taskIndex}`]

//                                                                 return (
//                                                                     <div key={task._id || taskIndex} className="border border-gray-200 rounded-lg overflow-hidden">
//                                                                         <div className="p-3 bg-gray-50 flex items-center justify-between">
//                                                                             <div className="flex items-center gap-3">
//                                                                                 {!viewMode && (
//                                                                                     <div className="relative">
//                                                                                         <input
//                                                                                             type="checkbox"
//                                                                                             checked={isTaskSelected || false}
//                                                                                             onChange={() => toggleSelection('task', stageIndex, taskIndex)}
//                                                                                             className="h-4 w-4 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
//                                                                                         />
//                                                                                         {taskWorkers.length > 0 && (
//                                                                                             <Check className="absolute top-0 left-0 w-4 h-4 text-white bg-blue-600 rounded pointer-events-none" />
//                                                                                         )}
//                                                                                     </div>
//                                                                                 )}
//                                                                                 <div>
//                                                                                     <h6 className="font-medium text-gray-900">
//                                                                                         Task {stageIndex + 1}.{taskIndex + 1}: {task.title}
//                                                                                     </h6>
//                                                                                     {task.description && (
//                                                                                         <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//                                                                                     )}
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="flex items-center gap-3">
//                                                                                 {taskWorkers.length > 0 && (
//                                                                                     <div className="flex flex-wrap gap-2">
//                                                                                         {taskWorkers.map(worker => (
//                                                                                             <span
//                                                                                                 key={worker.id}
//                                                                                                 className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium border border-green-200 flex items-center gap-2"
//                                                                                             >
//                                                                                                 {worker.name || 'Unknown'}
//                                                                                                 {!viewMode && (
//                                                                                                     <button
//                                                                                                         onClick={() => removeWorker(taskKey, worker.id)}
//                                                                                                         className="text-green-600 hover:text-green-800"
//                                                                                                     >
//                                                                                                         <X className="w-3 h-3" />
//                                                                                                     </button>
//                                                                                                 )}
//                                                                                             </span>
//                                                                                         ))}
//                                                                                     </div>
//                                                                                 )}
//                                                                                 {task.subtasks && task.subtasks.length > 0 && (
//                                                                                     <button
//                                                                                         className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
//                                                                                         onClick={() => toggleTask(stageIndex, taskIndex)}
//                                                                                     >
//                                                                                         {isTaskExpanded ? (
//                                                                                             <ChevronDown className="w-4 h-4" />
//                                                                                         ) : (
//                                                                                             <ChevronRight className="w-4 h-4" />
//                                                                                         )}
//                                                                                     </button>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>

//                                                                         {isTaskExpanded && task.subtasks && task.subtasks.length > 0 && (
//                                                                             <div className="p-4 bg-white border-t border-gray-200">
//                                                                                 <h6 className="font-medium text-gray-800 text-sm mb-3 flex items-center gap-2">
//                                                                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                                                                     Subtasks ({task.subtasks.length})
//                                                                                 </h6>
//                                                                                 <div className="space-y-3">
//                                                                                     {task.subtasks.map((subtask, subtaskIndex) => (
//                                                                                         <div key={subtask._id || subtaskIndex} className="ml-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                                                                             <div className="flex items-start gap-3">
//                                                                                                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
//                                                                                                 <div>
//                                                                                                     <h6 className="font-medium text-gray-900 text-sm">
//                                                                                                         {subtaskIndex + 1}. {subtask.title}
//                                                                                                     </h6>
//                                                                                                     {subtask.description && (
//                                                                                                         <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
//                                                                                                     )}
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     ))}
//                                                                                 </div>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 )
//                                                             })
//                                                         ) : (
//                                                             <p className="text-gray-500 text-center py-4 italic">No tasks defined for this stage</p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )
//                                 })}
//                             </div>
//                         </div>

                     
                               
//                                 {!viewMode && (
//   <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
//     <button
//       className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//       onClick={resetModal}
//     >
//       Cancel
//     </button>
//     <button
//       className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-md ${
//         isAllItemsAssigned()
//           ? 'bg-blue-600 text-white hover:bg-blue-700'
//           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//       }`}
//       disabled={!isAllItemsAssigned()}
//       onClick={handleUpdateAssignment}
//     >
//       Save Assignments
//     </button>
//   </div>
// )}
                         
//                         {viewMode && (
//                             <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
//                                 <button
//                                     className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                                     onClick={resetModal}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {showWorkerList && (
//                 <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//                             <h3 className="text-xl font-semibold text-gray-900">Select Workers</h3>
//                             <button
//                                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                                 onClick={() => {
//                                     setShowWorkerList(false)
//                                     setSelectedWorkers([])
//                                 }}
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="p-4 border-b border-gray-200">
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Search className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Search workers..."
//                                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     value={workerSearchTerm}
//                                     onChange={(e) => setWorkerSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                         </div>

//                         <div className="p-6 max-h-96 overflow-y-auto">
//                             <div className="space-y-3">
//                                 {filteredWorkers.map(worker => (
//                                     <div
//                                         key={worker._id}
//                                         className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedWorkers.includes(worker._id)}
//                                                     onChange={() => toggleWorkerSelection(worker._id)}
//                                                     className="h-4 w-4 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
//                                                 />
//                                                 <div>
//                                                     <h4 className="font-medium text-gray-900 group-hover:text-blue-900">{worker.name}</h4>
//                                                     <p className="text-sm text-gray-500 group-hover:text-blue-700">{worker.role}</p>
//                                                 </div>
//                                             </div>
//                                             <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             {filteredWorkers.length === 0 && (
//                                 <p className="text-gray-500 text-center py-8">No workers available</p>
//                             )}
//                         </div>

//                         <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
//                             <button
//                                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                                 onClick={() => {
//                                     setShowWorkerList(false)
//                                     setSelectedWorkers([])
//                                 }}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
//                                     selectedWorkers.length > 0
//                                         ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
//                                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                 }`}
//                                 disabled={selectedWorkers.length === 0}
//                                 onClick={assignWorker}
//                             >
//                                 <Check className="w-4 h-4" />
//                                 Confirm Selection
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }


'use client'
import React, { useEffect, useState } from 'react'
import { Sparkles, Eye, Edit, MoreVertical, X, ChevronDown, ChevronRight, User, Check, Search, Filter, Users, Pencil } from 'lucide-react'

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
    const [selectedWorkers, setSelectedWorkers] = useState([])
    const [editMode, setEditMode] = useState(false) // New state for edit mode

    useEffect(() => {
        const userData = localStorage.getItem('user')
        const user = JSON.parse(userData)
        setCompanyData(user)
    }, [])

    const fetchWorker = async () => {
        if (companyData?.companyId) {
            try {
                const respon = await fetch(`/api/task-execution/${companyData.companyId}`)
                const dataresp = await respon.json()
                console.log("worker data:", dataresp)
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

        fetchData()
        fetchWorker()
    }, [companyData])

    useEffect(() => {
        const fetchWorkers = async () => {
            if (companyData?.companyId) {
                try {
                    const res = await fetch(`/api/task-execution/${companyData.companyId}`)
                    const data = await res.json()
                    setWorkers(data?.users || [])
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
        const key = type === 'stage' ? `stage-${stageIndex}` : `stage-${stageIndex}-task-${taskIndex}`
        setSelectedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const toggleWorkerSelection = (workerId) => {
        setSelectedWorkers(prev =>
            prev.includes(workerId)
                ? prev.filter(id => id !== workerId)
                : [...prev, workerId]
        )
    }

    const assignWorker = () => {
        const newAssignedWorkers = { ...assignedWorkers }
        const currentSelectedItems = { ...selectedItems }
        const newSelectedItems = { ...selectedItems }

        Object.keys(currentSelectedItems).forEach(key => {
            if (currentSelectedItems[key]) {
                newAssignedWorkers[key] = newAssignedWorkers[key] || []
                selectedWorkers.forEach(workerId => {
                    const worker = workers.find(w => w._id === workerId)
                    if (worker && !newAssignedWorkers[key].some(w => w.id === workerId)) {
                        newAssignedWorkers[key].push({ id: workerId, name: worker.name })
                    }
                })
                // Uncheck the item after assignment
                newSelectedItems[key] = false
            }
        })

        setAssignedWorkers(newAssignedWorkers)
        setSelectedItems(newSelectedItems)
        setSelectedWorkers([])
        setShowWorkerList(false)
    }

    const removeWorker = (key, workerId) => {
        setAssignedWorkers(prev => ({
            ...prev,
            [key]: prev[key].filter(worker => worker.id !== workerId)
        }))
    }

    const resetModal = () => {
        setSelectedAssignment(null)
        setExpandedStages({})
        setExpandedTasks({})
        setSelectedItems({})
        setShowWorkerList(false)
        setAssignedWorkers({})
        setWorkerSearchTerm('')
        setSelectedWorkers([])
        setViewMode(false)
        setEditMode(false) // Reset edit mode
    }

    const isAllItemsAssigned = () => {
        if (!selectedAssignment || !selectedAssignment.prototypeData?.stages) return false
        
        const stages = selectedAssignment.prototypeData.stages
        
        return stages.every((stage, stageIndex) => {
            const stageKey = `stage-${stageIndex}`
            const stageWorkers = assignedWorkers[stageKey]
            
            if (stageWorkers && stageWorkers.length > 0) return true
            
            if (stage.tasks && stage.tasks.length > 0) {
                return stage.tasks.every((task, taskIndex) => {
                    const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                    const taskWorkers = assignedWorkers[taskKey]
                    return taskWorkers && taskWorkers.length > 0
                })
            }
            
            return false
        })
    }

    const handleViewWorkers = (assignment) => {
        setSelectedAssignment(assignment)
        setViewMode(true)
        setEditMode(false)

        const workersMap = {}
        const stages = assignment.stages || (assignment.prototypeData ? assignment.prototypeData.stages : [])

        if (stages && stages.length > 0) {
            stages.forEach((stage, stageIndex) => {
                const stageKey = `stage-${stageIndex}`
                if (stage.assignedWorker) {
                    workersMap[stageKey] = Array.isArray(stage.assignedWorker) 
                        ? stage.assignedWorker 
                        : [stage.assignedWorker]
                }

                if (stage.tasks) {
                    stage.tasks.forEach((task, taskIndex) => {
                        const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                        if (task.assignedWorker) {
                            workersMap[taskKey] = Array.isArray(task.assignedWorker) 
                                ? task.assignedWorker 
                                : [task.assignedWorker]
                        }
                    })
                }
            })
        }

        if (assignment.assignedWorkers) {
            Object.keys(assignment.assignedWorkers).forEach(key => {
                workersMap[key] = Array.isArray(assignment.assignedWorkers[key])
                    ? assignment.assignedWorkers[key]
                    : [assignment.assignedWorkers[key]]
            })
        }

        setAssignedWorkers(workersMap)
    }

    // New function to handle edit mode
    const handleEditAssignment = (assignment) => {
        setSelectedAssignment(assignment)
        setViewMode(false)
        setEditMode(true)

        const workersMap = {}
        const stages = assignment.stages || (assignment.prototypeData ? assignment.prototypeData.stages : [])

        if (stages && stages.length > 0) {
            stages.forEach((stage, stageIndex) => {
                const stageKey = `stage-${stageIndex}`
                if (stage.assignedWorker) {
                    workersMap[stageKey] = Array.isArray(stage.assignedWorker) 
                        ? stage.assignedWorker 
                        : [stage.assignedWorker]
                }

                if (stage.tasks) {
                    stage.tasks.forEach((task, taskIndex) => {
                        const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                        if (task.assignedWorker) {
                            workersMap[taskKey] = Array.isArray(task.assignedWorker) 
                                ? task.assignedWorker 
                                : [task.assignedWorker]
                        }
                    })
                }
            })
        }

        if (assignment.assignedWorkers) {
            Object.keys(assignment.assignedWorkers).forEach(key => {
                workersMap[key] = Array.isArray(assignment.assignedWorkers[key])
                    ? assignment.assignedWorkers[key]
                    : [assignment.assignedWorkers[key]]
            })
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

    const isStageFullyAssigned = (stageIndex) => {
        const stage = selectedAssignment.prototypeData.stages[stageIndex]
        if (!stage.tasks || stage.tasks.length === 0) return false

        return stage.tasks.every((task, taskIndex) => {
            const taskKey = `stage-${stageIndex}-task-${taskIndex}`
            return assignedWorkers[taskKey]?.length > 0
        })
    }

    const prepareAssignmentData = () => {
        if (!selectedAssignment) return null
        const result = {
            companyId: companyData?.companyId,
            assignedBy: companyData?.userId || companyData?.id,
            assignedDate: new Date().toISOString(),
            status: "Assigned",
            stages: selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
                const stageKey = `stage-${stageIndex}`
                const stageWorkers = assignedWorkers[stageKey] || []
                return {
                    ...stage,
                    stageId: stage._id || `stage-${stageIndex}`,
                    assignedWorker: stageWorkers,
                    status: stageWorkers.length > 0 ? "Assigned" : "Unassigned",
                    tasks: stage.tasks?.map((task, taskIndex) => {
                        const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                        const taskWorkers = assignedWorkers[taskKey] || []
                        return {
                            ...task,
                            taskId: task._id || `task-${stageIndex}-${taskIndex}`,
                            assignedWorker: taskWorkers,
                            status: taskWorkers.length > 0 ? "Assigned" : "Unassigned",
                            subtasks: task.subtasks?.map((subtask, subtaskIndex) => {
                                const subtaskKey = `stage-${stageIndex}-task-${taskIndex}-subtask-${subtaskIndex}`
                                const subtaskWorkers = assignedWorkers[subtaskKey] || taskWorkers
                                return {
                                    ...subtask,
                                    subtaskId: subtask._id || `subtask-${stageIndex}-${taskIndex}-${subtaskIndex}`,
                                    assignedWorker: subtaskWorkers,
                                    status: subtaskWorkers.length > 0 ? "Assigned" : "Unassigned",
                                }
                            }) || [],
                        }
                    }) || [],
                }
            }) || [],
        }
        return result
    }

    const getAssignmentProgress = () => {
        if (!selectedAssignment || !selectedAssignment.prototypeData?.stages) {
            return { assignedCount: 0, totalCount: 0 }
        }
        
        const stages = selectedAssignment.prototypeData.stages
        let assignedCount = 0
        let totalCount = 0
        
        stages.forEach((stage, stageIndex) => {
            const stageKey = `stage-${stageIndex}`
            totalCount++
            
            if (assignedWorkers[stageKey]?.length > 0) {
                assignedCount++
            } else if (stage.tasks) {
                stage.tasks.forEach((task, taskIndex) => {
                    const taskKey = `stage-${stageIndex}-task-${taskIndex}`
                    totalCount++
                    
                    if (assignedWorkers[taskKey]?.length > 0) {
                        assignedCount++
                    }
                })
            }
        })
        
        return { assignedCount, totalCount }
    }

    const handleUpdateAssignment = async () => {
        if (!isAllItemsAssigned()) {
            alert("Please assign workers to all tasks and stages before saving.")
            return
        }
        
        const updatedData = prepareAssignmentData()
        const res = await fetch(`/api/assignment/update-assignment-for-assign/${selectedAssignment._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                stages: updatedData.stages,
                status: updatedData.status,
            }),
        })
        const data = await res.json()
        console.log("Updated Assignment:", data)

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

        resetModal()
    }

    const isStagePartiallyAssigned = (stageIndex) => {
        const stage = selectedAssignment.prototypeData.stages[stageIndex]
        if (!stage.tasks || stage.tasks.length === 0) return false

        const assignedCount = stage.tasks.filter((task, taskIndex) => {
            const taskKey = `stage-${stageIndex}-task-${taskIndex}`
            return assignedWorkers[taskKey]?.length > 0
        }).length

        return assignedCount > 0 && assignedCount < stage.tasks.length
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
            <div className="bg-white border-b border-gray-200 rounded-xl m-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center justify-center space-x-2 gap-2">
                                                    {assignment.status === 'Approved' ? (
                                                        <>
                                                            <button
                                                                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
                                                                onClick={() => {
                                                                    setSelectedAssignment(assignment)
                                                                    setSelectedItems({})
                                                                    setAssignedWorkers({})
                                                                    setExpandedStages({})
                                                                    setExpandedTasks({})
                                                                    setViewMode(false)
                                                                    setEditMode(false)
                                                                }}
                                                            >
                                                                <User className="w-4 h-4" />
                                                                Assign Resources
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
                                                                onClick={() => handleViewWorkers(assignment)}
                                                            >
                                                                <Users className="w-4 h-4" />
                                                                View Resources
                                                            </button>
                                                            <button
                                                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                                                onClick={() => handleEditAssignment(assignment)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                              
                                                            </button>
                                                        </>
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

            {selectedAssignment && (
                <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {selectedAssignment.prototypeData?.name} - {viewMode ? 'View Assigned Resources' : editMode ? 'Edit Assigned Resources' : 'Assign Resources'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Equipment: {selectedAssignment.equipment?.name} | ID: {selectedAssignment.generatedId}
                                </p>
                                {!viewMode && (
                                    <p className="text-sm text-blue-600 mt-1 font-medium">
                                        {getAssignmentProgress().assignedCount} of {getAssignmentProgress().totalCount} items assigned
                                    </p>
                                )}
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={resetModal}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {!viewMode && (
                                <div className="mb-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {editMode ? 'Modify assigned resources' : 'Select stages or tasks to assign resources'}
                                        </p>
                                        {!isAllItemsAssigned() && !viewMode && (
                                            <p className="text-xs text-red-500 mt-1">
                                                All items must be assigned before saving
                                            </p>
                                        )}
                                    </div>
                                    {!viewMode && (
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
                                            {editMode ? 'Modify resources' : 'Assign resources'}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="space-y-6">
                                {selectedAssignment.prototypeData?.stages?.map((stage, stageIndex) => {
                                    const stageKey = `stage-${stageIndex}`
                                    const isStageSelected = selectedItems[stageKey] || isStageFullyAssigned(stageIndex)
                                    const stageWorkers = assignedWorkers[stageKey] || []
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
                                                                disabled={stageWorkers.length > 0 && !editMode}
                                                                className={`h-5 w-5 rounded border-2 focus:ring-blue-500 ${
                                                                    stageWorkers.length > 0 && !editMode
                                                                        ? 'border-gray-300 bg-gray-100 text-gray-400'
                                                                        : 'border-gray-300 text-blue-600'
                                                                }`}
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
                                                    {stageWorkers.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {stageWorkers.map(worker => (
                                                                <span
                                                                    key={worker.id}
                                                                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-2"
                                                                >
                                                                    {worker.name || 'Unknown'}
                                                                    {!viewMode && (
                                                                        <button
                                                                            onClick={() => removeWorker(stageKey, worker.id)}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
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
                                                                const isTaskSelected = selectedItems[taskKey] || (assignedWorkers[taskKey]?.length > 0)
                                                                const taskWorkers = assignedWorkers[taskKey] || []
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
                                                                                            className={`h-4 w-4 rounded border-2 focus:ring-blue-500 ${
                                                                                                taskWorkers.length > 0 && !editMode
                                                                                                    ? 'border-gray-300 bg-gray-100 text-gray-400'
                                                                                                    : 'border-gray-300 text-blue-600'
                                                                                            }`}
                                                                                        />
                                                                                        {taskWorkers.length > 0 && (
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
                                                                                {taskWorkers.length > 0 && (
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        {taskWorkers.map(worker => (
                                                                                            <span
                                                                                                key={worker.id}
                                                                                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium border border-green-200 flex items-center gap-2"
                                                                                            >
                                                                                                {worker.name || 'Unknown'}
                                                                                                {!viewMode && (
                                                                                                    <button
                                                                                                        onClick={() => removeWorker(taskKey, worker.id)}
                                                                                                        className="text-green-600 hover:text-green-800"
                                                                                                    >
                                                                                                        <X className="w-3 h-3" />
                                                                                                    </button>
                                                                                                )}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
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

                        {!viewMode && (
                            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
                                <button
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    onClick={resetModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-md ${
                                        isAllItemsAssigned()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={!isAllItemsAssigned()}
                                    onClick={handleUpdateAssignment}
                                >
                                    {editMode ? 'Update Assignments' : 'Save Assignments'}
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

            {showWorkerList && (
                <div className="absolute inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                            <h3 className="text-xl font-semibold text-gray-900">Select Workers</h3>
                            <button
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                    setShowWorkerList(false)
                                    setSelectedWorkers([])
                                }}
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
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedWorkers.includes(worker._id)}
                                                    onChange={() => toggleWorkerSelection(worker._id)}
                                                    className="h-4 w-4 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 group-hover:text-blue-900">{worker.name}</h4>
                                                    <p className="text-sm text-gray-500 group-hover:text-blue-700">{worker.role}</p>
                                                </div>
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

                        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 gap-3">
                            <button
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                onClick={() => {
                                    setShowWorkerList(false)
                                    setSelectedWorkers([])
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    selectedWorkers.length > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={selectedWorkers.length === 0}
                                onClick={assignWorker}
                            >
                                <Check className="w-4 h-4" />
                                Confirm Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}