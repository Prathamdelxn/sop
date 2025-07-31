// "use client"

// import { useEffect, useState } from "react"
// import {
//   CheckCircle,
//   Activity,
//   AlertCircle,
//   Zap,
//   TrendingUp,
//   Target,
//   Layers,
//   Workflow,
//   Star,
//   Eye,
//   ChevronDown,
//   ChevronRight,
//   Calendar,
//   Timer,
//   ImageIcon,
//   Check,
//   X,
//   FileText,
//   Clock,
//   Users,
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
//   const [activeFilter, setActiveFilter] = useState('pending') // 'pending', 'approved', 'rejected'



// const [companyData, setCompanyData] = useState()
// const[data,setData]=useState([]);
//   useEffect(() => {
//     const userData = localStorage.getItem('user')
//     const data = JSON.parse(userData)
//     setCompanyData(data)
//   }, []);
// useEffect(() => {
//     const fetchSops = async () => {
//       try {
//         // setLoading(true)
//         // setFiltering(true)
//         const res = await fetch("/api/task/fetchAll")
//         const data = await res.json()
//         // Simulate filtering delay
//         setTimeout(() => {
//           const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
//           console.log("filter",filtered);
//           setData(filtered);
//         //   setSopData(filtered)
//         //   setFiltering(false)
//         //   setLoading(false)
//         }, 500) // Add slight delay to show filtering state
//       } catch (err) {
//         console.error("Failed to fetch SOPs:", err)
//         // setLoading(false)
//         // setFiltering(false)
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

//   const handleApprove = (sopId) => {
//     // Update the status to approved
//     setSopStatuses(prev => ({
//       ...prev,
//       [sopId]: 'approved'
//     }))
    
//     setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`)
//     setShowApprovalFeedback(true)
//     setSelectedSop(null)
    
//     // After 3 seconds, hide the approval feedback
//     setTimeout(() => {
//       setShowApprovalFeedback(false)
//     }, 3000)
//   }

//   const handleRejectSubmit = () => {
//     if (!rejectReason.trim()) {
//       return
//     }
    
//     // Update the status to rejected
//     setSopStatuses(prev => ({
//       ...prev,
//       [selectedSop._id]: 'rejected'
//     }))
    
//     setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`)
//     setShowApprovalFeedback(true)
//     setShowRejectModal(false)
//     setSelectedSop(null)
//     setRejectReason("")
    
//     // After 3 seconds, hide the approval feedback
//     setTimeout(() => {
//       setShowApprovalFeedback(false)
//     }, 3000)
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
//       case 'approved':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             Approved
//           </span>
//         )
//       case 'rejected':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//             Rejected
//           </span>
//         )
//       default:
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//             Pending
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
//           {/* Task Description */}
//           {task.description && (
//             <div>
//               <div className="flex items-center gap-2 text-sm mb-1">
//                 <FileText className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Description:</span>
//               </div>
//               <p className="text-sm text-gray-700 ml-6">{task.description}</p>
//             </div>
//           )}

//           {/* Duration Information */}
//           {(task.minTime || task.maxTime) && (
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
//           )}

//           {/* Attached Images */}
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
//                   ) : null,
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Subtasks */}
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



//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
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

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Status Filter Tabs */}
//         <div className="flex space-x-2 mb-6">
//           <button
//             onClick={() => setActiveFilter('pending')}
//             className={`px-4 py-2 rounded-lg ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => setActiveFilter('approved')}
//             className={`px-4 py-2 rounded-lg ${activeFilter === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//           >
//             Approved
//           </button>
//           <button
//             onClick={() => setActiveFilter('rejected')}
//             className={`px-4 py-2 rounded-lg ${activeFilter === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//           >
//             Rejected
//           </button>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading checklists...</p>
//         ) :data.length > 0 ? (
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
//                   {data.map((sop) => (
//                     <tr key={sop.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}>
//                             {sop.icon}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{sop.name}</div>
//                             <div className="text-sm text-gray-500 line-clamp-1">{sop.description}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(sop.status)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">{new Date(sop.createdAt).toLocaleString()}</div>
//                       </td>
                     
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           {sop.status === 'pending' ? (
//                             <button
//                               onClick={() => handleView(sop)}
//                               className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                               title="Review"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleView(sop)}
//                               className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
//                               title="View"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-20">
//             <div className="max-w-md mx-auto">
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                 {activeFilter === 'pending' ? 'No checklists pending approval' : 
//                  activeFilter === 'approved' ? 'No approved checklists' : 'No rejected checklists'}
//               </h3>
//               <p className="text-gray-600 mb-8 text-lg">
//                 {activeFilter === 'pending' ? 'All checklists have been reviewed.' : 
//                  activeFilter === 'approved' ? 'No checklists have been approved yet.' : 'No checklists have been rejected.'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Review Modal */}
//       {selectedSop && (
//         <div 
//           onClick={closeModal}
//           className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
//         >
//           <div 
//             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button (Top Right) */}
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>

//             {/* Modal Header */}
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
//                       Status: {getStatusBadge(sopStatuses[selectedSop._id] || 'pending')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-8">
//               {/* SOP Description */}
//               {selectedSop.description && (
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
//                 </div>
//               )}

//               {/* Stages */}
//               <div className="space-y-6">
//                 {selectedSop.stages?.map((stage, stageIndex) => (
//                   <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
//                     {/* Stage Header */}
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

//                     {/* Tasks */}
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

//             {/* Modal Footer with Approve/Reject Buttons - Only show if status is pending */}
//             {sopStatuses[selectedSop._id] === 'pending' && (
//               <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowRejectModal(true)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//                 >
//                   <X className="w-5 h-5" />
//                   Reject
//                 </button>
//                 <button
//                   onClick={() => handleApprove(selectedSop.id)}
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

//       {/* Custom Reject Reason Modal */}
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

//       {/* Custom Approval Feedback */}
//       {showApprovalFeedback && (
//         <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-green-200 z-50 flex items-center gap-3 animate-fade-in-up">
//           <CheckCircle className="w-6 h-6 text-green-600" />
//           <p className="text-gray-800">{approvalMessage}</p>
//         </div>
//       )}

//       {/* Add this to your global CSS or Tailwind config */}
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
} from "lucide-react"
import Image from "next/image"

const ApproveChecklistPage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedSop, setSelectedSop] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [showApprovalFeedback, setShowApprovalFeedback] = useState(false)
  const [approvalMessage, setApprovalMessage] = useState("")
  const [sopStatuses, setSopStatuses] = useState({})
  const [activeFilter, setActiveFilter] = useState('pending')
  const [companyData, setCompanyData] = useState(null)
  const [data, setData] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const data = JSON.parse(userData)
    setCompanyData(data)
  }, [])

  useEffect(() => {
    const fetchSops = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/task/fetchAll")
        const data = await res.json()
        const filtered = data.data.filter(item => item.companyId === companyData?.companyId)
        setData(filtered)
        console.log(filtered);
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

  const handleApprove = (sopId) => {
    setSopStatuses(prev => ({
      ...prev,
      [sopId]: 'approved'
    }))
    
    setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`)
    setShowApprovalFeedback(true)
    setSelectedSop(null)
    
    setTimeout(() => {
      setShowApprovalFeedback(false)
    }, 3000)
  }

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return
    
    setSopStatuses(prev => ({
      ...prev,
      [selectedSop._id]: 'rejected'
    }))
    
    setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`)
    setShowApprovalFeedback(true)
    setShowRejectModal(false)
    setSelectedSop(null)
    setRejectReason("")
    
    setTimeout(() => {
      setShowApprovalFeedback(false)
    }, 3000)
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
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
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

          {(task.minTime || task.maxTime) && (
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
    return status === activeFilter
  })

  const showActionButtons = () => {
    if (!selectedSop) return false
    const status = sopStatuses[selectedSop._id] || selectedSop.status
    return status === 'pending'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Approve Checklists</h1>
              <p className="text-gray-600 mt-2 text-md">Review and approve pending SOP checklists</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-lg ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-2 rounded-lg ${activeFilter === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${activeFilter === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Rejected
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading checklists...</p>
        ) : data.length > 0 ? (
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
                  {data.map((sop) => {
                    const status = sopStatuses[sop._id] || sop.status
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
                              title={status === 'pending' ? "Review" : "View"}
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
                {activeFilter === 'pending' ? 'No checklists pending approval' : 
                 activeFilter === 'approved' ? 'No approved checklists' : 'No rejected checklists'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {activeFilter === 'pending' ? 'All checklists have been reviewed.' : 
                 activeFilter === 'approved' ? 'No checklists have been approved yet.' : 'No checklists have been rejected.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedSop && (
        <div 
          onClick={closeModal}
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
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

            {showActionButtons() && (
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

export default ApproveChecklistPage