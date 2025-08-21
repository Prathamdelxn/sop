// // "use client"

// // import { useEffect, useState } from "react"
// // import {
// //   CheckCircle,
// //   Activity,
// //   AlertCircle,
// //   Zap,
// //   TrendingUp,
// //   Target,
// //   Layers,
// //   Workflow,
// //   Star,
// //   Eye,
// //   ChevronDown,
// //   ChevronRight,
// //   Calendar,
// //   Timer,
// //   ImageIcon,
// //   Check,
// //   X,
// //   FileText,
// //   Clock,
// //   Users,
// // } from "lucide-react"
// // import Image from "next/image"

// // const ApproveChecklistPage = () => {
// //   const [loading, setLoading] = useState(false)
// //   const [selectedSop, setSelectedSop] = useState(null)
// //   const [expandedTasks, setExpandedTasks] = useState({})
// //   const [showRejectModal, setShowRejectModal] = useState(false)
// //   const [rejectReason, setRejectReason] = useState("")
// //   const [showApprovalFeedback, setShowApprovalFeedback] = useState(false)
// //   const [approvalMessage, setApprovalMessage] = useState("")
// //   const [sopStatuses, setSopStatuses] = useState({})
// //   const [activeFilter, setActiveFilter] = useState('pending') // 'pending', 'approved', 'rejected'



// // const [companyData, setCompanyData] = useState()
// // const[data,setData]=useState([]);
// //   useEffect(() => {
// //     const userData = localStorage.getItem('user')
// //     const data = JSON.parse(userData)
// //     setCompanyData(data)
// //   }, []);
// // useEffect(() => {
// //     const fetchSops = async () => {
// //       try {
// //         // setLoading(true)
// //         // setFiltering(true)
// //         const res = await fetch("/api/task/fetchAll")
// //         const data = await res.json()
// //         // Simulate filtering delay
// //         setTimeout(() => {
// //           const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
// //           console.log("filter",filtered);
// //           setData(filtered);
// //         //   setSopData(filtered)
// //         //   setFiltering(false)
// //         //   setLoading(false)
// //         }, 500) // Add slight delay to show filtering state
// //       } catch (err) {
// //         console.error("Failed to fetch SOPs:", err)
// //         // setLoading(false)
// //         // setFiltering(false)
// //       }
// //     }
    
// //     if (companyData) {
// //       fetchSops()
// //     }
// //   }, [companyData])



// //   const handleView = (sop) => {
// //     setSelectedSop(sop)
// //   }

// //   const closeModal = () => {
// //     setSelectedSop(null)
// //   }

// //   const toggleTaskExpansion = (taskId) => {
// //     setExpandedTasks((prev) => ({
// //       ...prev,
// //       [taskId]: !prev[taskId],
// //     }))
// //   }

// //   const handleApprove = (sopId) => {
// //     // Update the status to approved
// //     setSopStatuses(prev => ({
// //       ...prev,
// //       [sopId]: 'approved'
// //     }))
    
// //     setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`)
// //     setShowApprovalFeedback(true)
// //     setSelectedSop(null)
    
// //     // After 3 seconds, hide the approval feedback
// //     setTimeout(() => {
// //       setShowApprovalFeedback(false)
// //     }, 3000)
// //   }

// //   const handleRejectSubmit = () => {
// //     if (!rejectReason.trim()) {
// //       return
// //     }
    
// //     // Update the status to rejected
// //     setSopStatuses(prev => ({
// //       ...prev,
// //       [selectedSop._id]: 'rejected'
// //     }))
    
// //     setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`)
// //     setShowApprovalFeedback(true)
// //     setShowRejectModal(false)
// //     setSelectedSop(null)
// //     setRejectReason("")
    
// //     // After 3 seconds, hide the approval feedback
// //     setTimeout(() => {
// //       setShowApprovalFeedback(false)
// //     }, 3000)
// //   }

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "Not set"
// //     return new Date(dateString).toLocaleString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //       hour12: true,
// //     })
// //   }

// //   const formatTimeObject = (timeObj) => {
// //     if (!timeObj) return "Not set"
// //     const { hours = 0, minutes = 0, seconds = 0 } = timeObj
// //     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
// //     if (minutes > 0) return `${minutes}m ${seconds}s`
// //     return `${seconds}s`
// //   }

// //   const getStatusBadge = (status) => {
// //     switch (status) {
// //       case 'approved':
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //             Approved
// //           </span>
// //         )
// //       case 'rejected':
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
// //             Rejected
// //           </span>
// //         )
// //       default:
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
// //             Pending
// //           </span>
// //         )
// //     }
// //   }

// //   const renderTask = (task, level = 0, taskNumber = "1") => {
// //     const hasSubtasks = task.subtasks && task.subtasks.length > 0
// //     const isExpanded = expandedTasks[task.id || task._id] || false
// //     const taskId = task.id || task._id

// //     return (
// //       <div
// //         key={taskId}
// //         className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50" : "border-purple-200 bg-purple-50"} p-4 mb-3`}
// //       >
// //         <div className="flex items-center justify-between mb-2">
// //           <div className="flex items-center gap-2">
// //             {hasSubtasks && (
// //               <button onClick={() => toggleTaskExpansion(taskId)} className="text-gray-600 hover:text-gray-800">
// //                 {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
// //               </button>
// //             )}
// //             <span className="font-medium text-gray-900">
// //               {taskNumber}. {task.title || "Untitled Task"}                
// //             </span>
// //           </div>
// //         </div>

// //         <div className="space-y-3 ml-6">
// //           {/* Task Description */}
// //           {task.description && (
// //             <div>
// //               <div className="flex items-center gap-2 text-sm mb-1">
// //                 <FileText className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Description:</span>
// //               </div>
// //               <p className="text-sm text-gray-700 ml-6">{task.description}</p>
// //             </div>
// //           )}

// //           {/* Duration Information */}
// //           {(task.minTime || task.maxTime) && (
// //             <div className="bg-white p-3 rounded-lg border">
// //               <div className="flex items-center gap-2 text-sm mb-2">
// //                 <Timer className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Duration Information:</span>
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
// //                 <div>
// //                   <span className="text-gray-600">Minimum Duration: </span>
// //                   <span className="font-medium">
// //                     {formatTimeObject(task.minTime)}
// //                   </span>
// //                 </div>
// //                 <div>
// //                   <span className="text-gray-600">Maximum Duration: </span>
// //                   <span className="font-medium">
// //                     {formatTimeObject(task.maxTime)}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Attached Images */}
// //           {task.attachedImages?.length > 0 && (
// //             <div>
// //               <div className="flex items-center gap-2 text-sm mb-2">
// //                 <ImageIcon className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
// //               </div>
// //               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
// //                 {task.attachedImages.map((image, idx) =>
// //                   image?.url ? (
// //                     <div key={idx} className="border rounded-lg overflow-hidden bg-white">
// //                       <Image
// //                         src={image.url}
// //                         alt={image.name || `Image ${idx + 1}`}
// //                         width={200}
// //                         height={120}
// //                         className="w-full h-24 object-cover"
// //                       />
// //                       {image.name && (
// //                         <div className="p-2">
// //                           <p className="text-xs text-gray-600 truncate">{image.name}</p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   ) : null,
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Subtasks */}
// //         {hasSubtasks && isExpanded && (
// //           <div className="mt-4 space-y-2">
// //             <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
// //               <ChevronDown className="w-4 h-4" />
// //               <span>Subtasks ({task.subtasks.length}):</span>
// //             </div>
// //             {task.subtasks.map((subtask, index) => renderTask(subtask, level + 1, `${taskNumber}.${index + 1}`))}
// //           </div>
// //         )}
// //       </div>
// //     )
// //   }



// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-200 shadow-sm">
// //         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //           <div className="flex items-center space-x-4">
// //             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
// //               <CheckCircle className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">Approve Checklists</h1>
// //               <p className="text-gray-600 mt-2 text-md">Review and approve pending SOP checklists</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-6 py-8">
// //         {/* Status Filter Tabs */}
// //         <div className="flex space-x-2 mb-6">
// //           <button
// //             onClick={() => setActiveFilter('pending')}
// //             className={`px-4 py-2 rounded-lg ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// //           >
// //             Pending
// //           </button>
// //           <button
// //             onClick={() => setActiveFilter('approved')}
// //             className={`px-4 py-2 rounded-lg ${activeFilter === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// //           >
// //             Approved
// //           </button>
// //           <button
// //             onClick={() => setActiveFilter('rejected')}
// //             className={`px-4 py-2 rounded-lg ${activeFilter === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// //           >
// //             Rejected
// //           </button>
// //         </div>

// //         {loading ? (
// //           <p className="text-center text-gray-600">Loading checklists...</p>
// //         ) :data.length > 0 ? (
// //           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Checklist
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Status
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Stages
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Created At
// //                     </th>
                   
// //                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {data.map((sop) => (
// //                     <tr key={sop.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="flex items-center">
// //                           <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}>
// //                             {sop.icon}
// //                           </div>
// //                           <div className="ml-4">
// //                             <div className="text-sm font-medium text-gray-900">{sop.name}</div>
// //                             <div className="text-sm text-gray-500 line-clamp-1">{sop.description}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         {getStatusBadge(sop.status)}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-500">{new Date(sop.createdAt).toLocaleString()}</div>
// //                       </td>
                     
// //                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                         <div className="flex justify-end space-x-2">
// //                           {sop.status === 'pending' ? (
// //                             <button
// //                               onClick={() => handleView(sop)}
// //                               className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
// //                               title="Review"
// //                             >
// //                               <Eye className="w-4 h-4" />
// //                             </button>
// //                           ) : (
// //                             <button
// //                               onClick={() => handleView(sop)}
// //                               className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
// //                               title="View"
// //                             >
// //                               <Eye className="w-4 h-4" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="text-center py-20">
// //             <div className="max-w-md mx-auto">
// //               <h3 className="text-2xl font-bold text-gray-900 mb-3">
// //                 {activeFilter === 'pending' ? 'No checklists pending approval' : 
// //                  activeFilter === 'approved' ? 'No approved checklists' : 'No rejected checklists'}
// //               </h3>
// //               <p className="text-gray-600 mb-8 text-lg">
// //                 {activeFilter === 'pending' ? 'All checklists have been reviewed.' : 
// //                  activeFilter === 'approved' ? 'No checklists have been approved yet.' : 'No checklists have been rejected.'}
// //               </p>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Review Modal */}
// //       {selectedSop && (
// //         <div 
// //           onClick={closeModal}
// //           className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
// //         >
// //           <div 
// //             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* Close Button (Top Right) */}
// //             <button
// //               onClick={closeModal}
// //               className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
// //             >
// //               <X className="w-5 h-5 text-gray-600" />
// //             </button>

// //             {/* Modal Header */}
// //             <div className="sticky top-0 bg-white p-6 pb-4 border-b">
// //               <div className="flex items-start justify-between gap-4">
// //                 <div>
// //                   <h2 className="text-2xl font-bold text-gray-900">{selectedSop.name}</h2>
// //                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
// //                     {selectedSop.createdAt && (
// //                       <span className="flex items-center">
// //                         <Calendar className="w-4 h-4 mr-1.5" />
// //                         Created: {formatDate(selectedSop.createdAt)}
// //                       </span>
// //                     )}
// //                     {selectedSop.stages && (
// //                       <span className="flex items-center">
// //                         <Layers className="w-4 h-4 mr-1.5" />
// //                         {selectedSop.stages.length} Stages
// //                       </span>
// //                     )}

// //                     <span className="flex items-center">
// //                       <FileText className="w-4 h-4 mr-1.5" />
// //                       Status: {getStatusBadge(sopStatuses[selectedSop._id] || 'pending')}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Modal Content */}
// //             <div className="p-6 space-y-8">
// //               {/* SOP Description */}
// //               {selectedSop.description && (
// //                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
// //                   <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
// //                   <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
// //                 </div>
// //               )}

// //               {/* Stages */}
// //               <div className="space-y-6">
// //                 {selectedSop.stages?.map((stage, stageIndex) => (
// //                   <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
// //                     {/* Stage Header */}
// //                     <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
// //                       <div className="flex items-center">
// //                         <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
// //                           {stageIndex + 1}
// //                         </span>
// //                         <h3 className="font-semibold text-gray-800">{stage.name}</h3>
// //                         <span className="ml-auto text-sm text-gray-500">
// //                           {stage.tasks?.length || 0} tasks
// //                         </span>
// //                       </div>
// //                       {stage.description && (
// //                         <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
// //                       )}
// //                     </div>

// //                     {/* Tasks */}
// //                     <div className="divide-y divide-gray-100">
// //                       {stage.tasks?.length > 0 ? (
// //                         stage.tasks.map((task, taskIndex) =>
// //                           renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
// //                         )
// //                       ) : (
// //                         <div className="text-center py-8 text-gray-500 bg-gray-50">
// //                           <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
// //                           <p>No tasks in this stage</p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Modal Footer with Approve/Reject Buttons - Only show if status is pending */}
// //             {sopStatuses[selectedSop._id] === 'pending' && (
// //               <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
// //                 <button
// //                   onClick={() => setShowRejectModal(true)}
// //                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
// //                 >
// //                   <X className="w-5 h-5" />
// //                   Reject
// //                 </button>
// //                 <button
// //                   onClick={() => handleApprove(selectedSop.id)}
// //                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
// //                 >
// //                   <Check className="w-5 h-5" />
// //                   Approve
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* Custom Reject Reason Modal */}
// //       {showRejectModal && (
// //         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
// //             <h3 className="text-xl font-bold text-gray-900 mb-4">Reason for Rejection</h3>
// //             <p className="text-gray-600 mb-4">Please provide a reason for rejecting this checklist:</p>
            
// //             <textarea
// //               value={rejectReason}
// //               onChange={(e) => setRejectReason(e.target.value)}
// //               className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[120px]"
// //               placeholder="Enter rejection reason..."
// //             />
            
// //             <div className="flex justify-end gap-3">
// //               <button
// //                 onClick={() => {
// //                   setShowRejectModal(false)
// //                   setRejectReason("")
// //                 }}
// //                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleRejectSubmit}
// //                 className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${!rejectReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                 disabled={!rejectReason.trim()}
// //               >
// //                 Submit Rejection
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Custom Approval Feedback */}
// //       {showApprovalFeedback && (
// //         <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-green-200 z-50 flex items-center gap-3 animate-fade-in-up">
// //           <CheckCircle className="w-6 h-6 text-green-600" />
// //           <p className="text-gray-800">{approvalMessage}</p>
// //         </div>
// //       )}

// //       {/* Add this to your global CSS or Tailwind config */}
// //       <style jsx global>{`
// //         @keyframes fadeInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-fade-in-up {
// //           animation: fadeInUp 0.3s ease-out forwards;
// //         }
// //       `}</style>
// //     </div>
// //   )
// // }

// // export default ApproveChecklistPage


// "use client"

// import { useEffect, useState } from "react"
// import {
//   CheckCircle,
//   Eye,
//   ChevronDown,
//   ChevronRight,
//   Calendar,
//   Timer,
//   ImageIcon,
//   Check,
//   X,
//   FileText,
//   Layers,
//   Search,
// } from "lucide-react"
// import Image from "next/image"

// const ApproveChecklistPage = () => {
//   const [loading, setLoading] = useState(false)
//   const [selectedSop, setSelectedSop] = useState(null)
//   const [expandedTasks, setExpandedTasks] = useState({})
//   const [showRejectModal, setShowRejectModal] = useState(false)
//   const [rejectReason, setRejectReason] = useState("")
//   const [showApprovalFeedback, setShowApprovalFeedback] = useState(false)
//   const [approvalMessage, setApprovalMessage] = useState("")
//   const [sopStatuses, setSopStatuses] = useState({})
//   const [companyData, setCompanyData] = useState(null)
//   const [data, setData] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('All Statuses')

//   useEffect(() => {
//     const userData = localStorage.getItem('user')
//     const data = JSON.parse(userData)
//     setCompanyData(data)
//   }, [])

//   useEffect(() => {
//     const fetchSops = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch("/api/task/fetchAll")
//         const data = await res.json()
//         const filtered = data.data.filter(item => item.companyId === companyData?.companyId && item.status !== "InProgress")
//         setData(filtered)
//         setLoading(false)
//       } catch (err) {
//         console.error("Failed to fetch SOPs:", err)
//         setLoading(false)
//       }
//     }
    
//     if (companyData) {
//       fetchSops()
//     }
//   }, [companyData])

//   const handleView = (sop) => {
//     setSelectedSop(sop)
//   }

//   const closeModal = () => {
//     setSelectedSop(null)
//   }

//   const toggleTaskExpansion = (taskId) => {
//     setExpandedTasks((prev) => ({
//       ...prev,
//       [taskId]: !prev[taskId],
//     }))
//   }

//   const handleApprove = async (sopId) => {
//     try {
//       setLoading(true);
      
//       const res = await fetch(`/api/task/update-status/${sopId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: "Approved" }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to update status");
//       }

//       setSopStatuses(prev => ({
//         ...prev,
//         [sopId]: 'Approved'
//       }));
      
//       setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`);
//       setShowApprovalFeedback(true);
//       setSelectedSop(null);
      
//       setTimeout(() => {
//         setShowApprovalFeedback(false);
//       }, 3000);
//     } catch (err) {
//       console.error("Failed to approve checklist:", err);
//       setApprovalMessage("Failed to approve checklist. Please try again.");
//       setShowApprovalFeedback(true);
      
//       setTimeout(() => {
//         setShowApprovalFeedback(false);
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleRejectSubmit = async () => {
//     if (!rejectReason.trim()) return;
// console.log(rejectReason);
//     try {
//       setLoading(true);
      
//       const res = await fetch(`/api/task/update-status/${selectedSop._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           status: "Rejected",
//           rejectionReason: rejectReason 
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to reject checklist");
//       }

//       setSopStatuses(prev => ({
//         ...prev,
//         [selectedSop._id]: 'Rejected'
//       }));
      
//       setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`);
//       setShowApprovalFeedback(true);
//       setShowRejectModal(false);
//       setSelectedSop(null);
//       setRejectReason("");
      
//       setTimeout(() => {
//         setShowApprovalFeedback(false);
//       }, 3000);
//     } catch (err) {
//       console.error("Failed to reject checklist:", err);
//       setApprovalMessage("Failed to reject checklist. Please try again.");
//       setShowApprovalFeedback(true);
      
//       setTimeout(() => {
//         setShowApprovalFeedback(false);
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set"
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//   }

//   const formatTimeObject = (timeObj) => {
//     if (!timeObj) return "Not set"
//     const { hours = 0, minutes = 0, seconds = 0 } = timeObj
//     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
//     if (minutes > 0) return `${minutes}m ${seconds}s`
//     return `${seconds}s`
//   }

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'Approved':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             Approved
//           </span>
//         )
//       case 'Rejected':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//             Rejected
//           </span>
//         )
//       default:
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//             Pending Approval
//           </span>
//         )
//     }
//   }

//   const renderTask = (task, level = 0, taskNumber = "1") => {
//     const hasSubtasks = task.subtasks && task.subtasks.length > 0
//     const isExpanded = expandedTasks[task.id || task._id] || false
//     const taskId = task.id || task._id

//     return (
//       <div
//         key={taskId}
//         className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50" : "border-purple-200 bg-purple-50"} p-4 mb-3`}
//       >
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             {hasSubtasks && (
//               <button onClick={() => toggleTaskExpansion(taskId)} className="text-gray-600 hover:text-gray-800">
//                 {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//               </button>
//             )}
//             <span className="font-medium text-gray-900">
//               {taskNumber}. {task.title || "Untitled Task"}                
//             </span>
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

//           {/* {(task.minTime || task.maxTime) && (
//             <div className="bg-white p-3 rounded-lg border">
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <Timer className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Duration Information:</span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
//                 <div>
//                   <span className="text-gray-600">Minimum Duration: </span>
//                   <span className="font-medium">
//                     {formatTimeObject(task.minTime)}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Maximum Duration: </span>
//                   <span className="font-medium">
//                     {formatTimeObject(task.maxTime)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )} */}

// {(task.minTime || task.maxTime) && (
//   // Check if any of the time values are non-zero
//   ((task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0)) || 
//    (task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0))) && (
//     <div className="bg-white p-3 rounded-lg border">
//       <div className="flex items-center gap-2 text-sm mb-2">
//         <Timer className="w-4 h-4 text-gray-500" />
//         <span className="font-medium">Duration Information:</span>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
//         {task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0) && (
//           <div>
//             <span className="text-gray-600">Minimum Duration: </span>
//             <span className="font-medium">
//               {formatTimeObject(task.minTime)}
//             </span>
//           </div>
//         )}
//         {task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0) && (
//           <div>
//             <span className="text-gray-600">Maximum Duration: </span>
//             <span className="font-medium">
//               {formatTimeObject(task.maxTime)}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// )}

//           {task.attachedImages?.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <ImageIcon className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
//                 {task.attachedImages.map((image, idx) =>
//                   image?.url ? (
//                     <div key={idx} className="border rounded-lg overflow-hidden bg-white">
//                       <Image
//                         src={image.url}
//                         alt={image.name || `Image ${idx + 1}`}
//                         width={200}
//                         height={120}
//                         className="w-full h-24 object-cover"
//                       />
//                       {image.name && (
//                         <div className="p-2">
//                           <p className="text-xs text-gray-600 truncate">{image.name}</p>
//                         </div>
//                       )}
//                     </div>
//                   ) : null
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {hasSubtasks && isExpanded && (
//           <div className="mt-4 space-y-2">
//             <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//               <ChevronDown className="w-4 h-4" />
//               <span>Subtasks ({task.subtasks.length}):</span>
//             </div>
//             {task.subtasks.map((subtask, index) => renderTask(subtask, level + 1, `${taskNumber}.${index + 1}`))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   const filteredData = data.filter(item => {
//     const status = sopStatuses[item._id] || item.status
//     const matchesSearch = 
//       item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesStatus = 
//       statusFilter === 'All Statuses' || 
//       status?.toLowerCase() === statusFilter.toLowerCase()
    
//     return matchesSearch && matchesStatus
//   })

//   const showActionButtons = () => {
//     if (!selectedSop) return false
//     const status = sopStatuses[selectedSop._id] || selectedSop.status
//     return status === 'Pending Approval'
//   }

//   // Skeleton loader component
//   const SkeletonRow = () => (
//     <tr className="animate-pulse">
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
//           <div className="ml-4 space-y-2">
//             <div className="h-4 bg-gray-200 rounded w-32"></div>
//             <div className="h-3 bg-gray-200 rounded w-48"></div>
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-8"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-32"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-right">
//         <div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto"></div>
//       </td>
//     </tr>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
//               <CheckCircle className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Approve Checklists</h1>
//               <p className="text-gray-600 mt-2 text-md">Review and approve pending SOP checklists</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             {/* Search Input */}
//             <div className="relative flex-1 min-w-0">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search checklists..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             {/* Status Filter */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                 Filter by:
//               </span>
//               <div className="relative">
//                 <select
//                   className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option>All Statuses</option>
//                   <option>Pending Approval</option>
//                   <option>Approved</option>
//                   <option>Rejected</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Checklist
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stages
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created At
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Array(5).fill(0).map((_, index) => (
//                     <SkeletonRow key={`skeleton-${index}`} />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : filteredData.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Checklist
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stages
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created At
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredData.map((sop) => {
//                     const status = sopStatuses[sop._id] || sop.status
//                     return (
//                       <tr key={sop._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor || 'bg-blue-100'}`}>
//                               <Layers className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{sop.name}</div>
//                               <div className="text-sm text-gray-500 line-clamp-1">{sop.description}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {getStatusBadge(status)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{formatDate(sop.createdAt)}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={() => handleView(sop)}
//                               className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                               title={status === 'Pending Approval' ? "Review" : "View"}
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-20">
//             <div className="max-w-md mx-auto">
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                 {statusFilter === 'All Statuses' ? 'No checklists found' : 
//                  `No ${statusFilter} checklists found`}
//               </h3>
//               <p className="text-gray-600 mb-8 text-lg">
//                 {statusFilter === 'All Statuses' ? 'Try adjusting your search' : 
//                  `No checklists match the ${statusFilter} status filter`}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedSop && (
//         <div 
//           onClick={closeModal}
//           className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
//         >
//           <div 
//             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>

//             <div className="sticky top-0 bg-white p-6 pb-4 border-b">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">{selectedSop.name}</h2>
//                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
//                     {selectedSop.createdAt && (
//                       <span className="flex items-center">
//                         <Calendar className="w-4 h-4 mr-1.5" />
//                         Created: {formatDate(selectedSop.createdAt)}
//                       </span>
//                     )}
//                     {selectedSop.stages && (
//                       <span className="flex items-center">
//                         <Layers className="w-4 h-4 mr-1.5" />
//                         {selectedSop.stages.length} Stages
//                       </span>
//                     )}
//                     <span className="flex items-center">
//                       <FileText className="w-4 h-4 mr-1.5" />
//                       Status: {getStatusBadge(sopStatuses[selectedSop._id] || selectedSop.status)}
//                     </span>
//                    {selectedSop.rejectionReason?<div className="font-semibold capitalize">reason: {selectedSop.rejectionReason}</div>:<></>} 
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 space-y-8">
//               {selectedSop.description && (
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {selectedSop.stages?.map((stage, stageIndex) => (
//                   <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
//                       <div className="flex items-center">
//                         <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
//                           {stageIndex + 1}
//                         </span>
//                         <h3 className="font-semibold text-gray-800">{stage.name}</h3>
//                         <span className="ml-auto text-sm text-gray-500">
//                           {stage.tasks?.length || 0} tasks
//                         </span>
//                       </div>
//                       {stage.description && (
//                         <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
//                       )}
//                     </div>

//                     <div className="divide-y divide-gray-100">
//                       {stage.tasks?.length > 0 ? (
//                         stage.tasks.map((task, taskIndex) =>
//                           renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
//                         )
//                       ) : (
//                         <div className="text-center py-8 text-gray-500 bg-gray-50">
//                           <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
//                           <p>No tasks in this stage</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {showActionButtons() && (
//               <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowRejectModal(true)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//                 >
//                   <X className="w-5 h-5" />
//                   Reject
//                 </button>
//                 <button
//                   onClick={() => handleApprove(selectedSop._id)}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//                 >
//                   <Check className="w-5 h-5" />
//                   Approve
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Reason for Rejection</h3>
//             <p className="text-gray-600 mb-4">Please provide a reason for rejecting this checklist:</p>
            
//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[120px]"
//               placeholder="Enter rejection reason..."
//             />
            
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false)
//                   setRejectReason("")
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRejectSubmit}
//                 className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${!rejectReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={!rejectReason.trim()}
//               >
//                 Submit Rejection
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showApprovalFeedback && (
//         <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-green-200 z-50 flex items-center gap-3 animate-fade-in-up">
//           <CheckCircle className="w-6 h-6 text-green-600" />
//           <p className="text-gray-800">{approvalMessage}</p>
//         </div>
//       )}

//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default ApproveChecklistPage




"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  Calendar,
  Timer,
  ImageIcon,
  Check,
  X,
  FileText,
  Layers,
  Search,
} from "lucide-react"
import Image from "next/image"

const ApprovePage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedSop, setSelectedSop] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [showApprovalFeedback, setShowApprovalFeedback] = useState(false)
  const [approvalMessage, setApprovalMessage] = useState("")
  const [sopStatuses, setSopStatuses] = useState({})
  const [companyData, setCompanyData] = useState(null)
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const data = JSON.parse(userData)
    console.log(data);
    setCompanyData(data)
  }, [])

  useEffect(() => {
    const fetchSops = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/task/fetch-for-approve",{
            method:"POST",
             headers: {
        "Content-Type": "application/json",
      },
            body:JSON.stringify({
                companyId:companyData?.companyId ,
                approverId:companyData?.id
            })

        })
        const data = await res.json()
        setData(data)
        console.log("api data",data);
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch SOPs:", err)
        setLoading(false)
      }
    }
    
    if (companyData) {
      fetchSops()
    }
  }, [companyData])

  const handleView = (sop) => {
    setSelectedSop(sop)
  }

  const closeModal = () => {
    setSelectedSop(null)
  }

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }
const getReviewStatus = (sop) => {

    const reviewerReview = sop.approvers.find(r => r.approverId === companyData?.id);
    console.log("asd",reviewerReview);
    return reviewerReview ? reviewerReview.status : 'Pending Approval';
  }
  const handleApprove = async (sopId) => {
    try {
      setLoading(true);
      
      const res = await fetch(`/api/task/update-approve-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            prototypeId:sopId,
            approverId:companyData?.id,
        
            status: "Approved" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setSopStatuses(prev => ({
        ...prev,
        [sopId]: 'Approved'
      }));
      
      setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`);
      setShowApprovalFeedback(true);
      setSelectedSop(null);
      
      setTimeout(() => {
        setShowApprovalFeedback(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to approve checklist:", err);
      setApprovalMessage("Failed to approve checklist. Please try again.");
      setShowApprovalFeedback(true);
      
      setTimeout(() => {
        setShowApprovalFeedback(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
console.log(rejectReason);
    try {
      setLoading(true);
      
      const res = await fetch(`/api/task/update-approve-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
             prototypeId:selectedSop?._id,
            approverId:companyData?.id,
          status: "Rejected",
          comments: rejectReason 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject checklist");
      }

      setSopStatuses(prev => ({
        ...prev,
        [selectedSop._id]: 'Rejected'
      }));
      
      setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`);
      setShowApprovalFeedback(true);
      setShowRejectModal(false);
      setSelectedSop(null);
      setRejectReason("");
      
      setTimeout(() => {
        setShowApprovalFeedback(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to reject checklist:", err);
      setApprovalMessage("Failed to reject checklist. Please try again.");
      setShowApprovalFeedback(true);
      
      setTimeout(() => {
        setShowApprovalFeedback(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatTimeObject = (timeObj) => {
    if (!timeObj) return "Not set"
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        )
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
           Pending Review
          </span>
        )
    }
  }

  const renderTask = (task, level = 0, taskNumber = "1") => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks[task.id || task._id] || false
    const taskId = task.id || task._id

    return (
      <div
        key={taskId}
        className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50" : "border-purple-200 bg-purple-50"} p-4 mb-3`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hasSubtasks && (
              <button onClick={() => toggleTaskExpansion(taskId)} className="text-gray-600 hover:text-gray-800">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="font-medium text-gray-900">
              {taskNumber}. {task.title || "Untitled Task"}                
            </span>
          </div>
        </div>

        <div className="space-y-3 ml-6">
          {task.description && (
            <div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Description:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{task.description}</p>
            </div>
          )}

          {/* {(task.minTime || task.maxTime) && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Duration Information:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
                <div>
                  <span className="text-gray-600">Minimum Duration: </span>
                  <span className="font-medium">
                    {formatTimeObject(task.minTime)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Maximum Duration: </span>
                  <span className="font-medium">
                    {formatTimeObject(task.maxTime)}
                  </span>
                </div>
              </div>
            </div>
          )} */}

{(task.minTime || task.maxTime) && (
  // Check if any of the time values are non-zero
  ((task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0)) || 
   (task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0))) && (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-center gap-2 text-sm mb-2">
        <Timer className="w-4 h-4 text-gray-500" />
        <span className="font-medium">Duration Information:</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
        {task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0) && (
          <div>
            <span className="text-gray-600">Minimum Duration: </span>
            <span className="font-medium">
              {formatTimeObject(task.minTime)}
            </span>
          </div>
        )}
        {task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0) && (
          <div>
            <span className="text-gray-600">Maximum Duration: </span>
            <span className="font-medium">
              {formatTimeObject(task.maxTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
)}

          {task.attachedImages?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
                {task.attachedImages.map((image, idx) =>
                  image?.url ? (
                    <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                      <Image
                        src={image.url}
                        alt={image.name || `Image ${idx + 1}`}
                        width={200}
                        height={120}
                        className="w-full h-24 object-cover"
                      />
                      {image.name && (
                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate">{image.name}</p>
                        </div>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        {hasSubtasks && isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ChevronDown className="w-4 h-4" />
              <span>Subtasks ({task.subtasks.length}):</span>
            </div>
            {task.subtasks.map((subtask, index) => renderTask(subtask, level + 1, `${taskNumber}.${index + 1}`))}
          </div>
        )}
      </div>
    )
  }

  const filteredData = data.filter(item => {
    const status = sopStatuses[item._id] || item.status
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'All Statuses' || 
      status?.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const showActionButtons = (sop) => {
    if (!selectedSop) return false
    const reviewerReview = sop.approvers?.find(r => r.approverId === companyData?.id);

    const status = sopStatuses[selectedSop._id] || reviewerReview.status
    console.log(status);
    return status === 'Pending Approval'
  }

  // Skeleton loader component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto"></div>
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Approve Checklists</h1>
              <p className="text-gray-600 mt-2 text-md"> Approve  pending  checklists</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search checklists..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by:
              </span>
              <div className="relative">
                <select
                  className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Pending Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array(5).fill(0).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((sop) => {
                    const status = sopStatuses[sop._id] || getReviewStatus(sop)
                    return (
                      <tr key={sop._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor || 'bg-blue-100'}`}>
                              <Layers className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{sop.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{sop.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                         
                          {getStatusBadge(status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(sop.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(sop)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              title={status === 'Pending Review' ? "Review" : "View"}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {statusFilter === 'All Statuses' ? 'No checklists found' : 
                 `No ${statusFilter} checklists found`}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {statusFilter === 'All Statuses' ? 'Try adjusting your search' : 
                 `No checklists match the ${statusFilter} status filter`}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedSop && (
        <div 
          onClick={closeModal}
          className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
        >
          <div 
            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="sticky top-0 bg-white p-6 pb-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSop.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    {selectedSop.createdAt && (
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Created: {formatDate(selectedSop.createdAt)}
                      </span>
                    )}
                    {selectedSop.stages && (
                      <span className="flex items-center">
                        <Layers className="w-4 h-4 mr-1.5" />
                        {selectedSop.stages.length} Stages
                      </span>
                    )}
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Status: {getStatusBadge(sopStatuses[selectedSop._id] || selectedSop.status)}
                    </span>
                   {selectedSop.rejectionReason?<div className="font-semibold capitalize">reason: {selectedSop.rejectionReason}</div>:<></>} 
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {selectedSop.description && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
                </div>
              )}

              <div className="space-y-6">
                {selectedSop.stages?.map((stage, stageIndex) => (
                  <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                          {stageIndex + 1}
                        </span>
                        <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                        <span className="ml-auto text-sm text-gray-500">
                          {stage.tasks?.length || 0} tasks
                        </span>
                      </div>
                      {stage.description && (
                        <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
                      )}
                    </div>

                    <div className="divide-y divide-gray-100">
                      {stage.tasks?.length > 0 ? (
                        stage.tasks.map((task, taskIndex) =>
                          renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
                        )
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No tasks in this stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showActionButtons(selectedSop) && (
              <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedSop._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reason for Rejection</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this checklist:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[120px]"
              placeholder="Enter rejection reason..."
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason("")
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${!rejectReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!rejectReason.trim()}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalFeedback && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-green-200 z-50 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-gray-800">{approvalMessage}</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ApprovePage;