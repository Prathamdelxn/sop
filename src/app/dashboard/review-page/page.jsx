

// // "use client"

// // import { useEffect, useState } from "react"
// // import {
// //   CheckCircle,
// //   Eye,
// //   ChevronDown,
// //   ChevronRight,
// //   Calendar,
// //   Timer,
// //   ImageIcon,
// //   Check,
// //   X,
// //   FileText,
// //   Layers,
// //   Search,
// //     Loader2 
// // } from "lucide-react"
// // import Image from "next/image"

// // const ReviewPage = () => {
// //   const [loading, setLoading] = useState(false)
// //   const [selectedSop, setSelectedSop] = useState(null)
// //   const [expandedTasks, setExpandedTasks] = useState({})
// //   const [showRejectModal, setShowRejectModal] = useState(false)
// //   const [rejectReason, setRejectReason] = useState("")
// //   const [showApprovalFeedback, setShowApprovalFeedback] = useState(false)
// //   const [approvalMessage, setApprovalMessage] = useState("")
// //   const [sopStatuses, setSopStatuses] = useState({})
// //   const [companyData, setCompanyData] = useState(null)
// //   const [data, setData] = useState([])
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [statusFilter, setStatusFilter] = useState('All Statuses')
// //     const [approvingSopId, setApprovingSopId] = useState(null) 

// //   useEffect(() => {
// //     const userData = localStorage.getItem('user')
// //     const data = JSON.parse(userData)
// //     console.log(data);
// //     setCompanyData(data)
// //   }, [])

// //   useEffect(() => {
// //     const fetchSops = async () => {
// //       try {
// //         setLoading(true)
// //         const res = await fetch("/api/checklistapi/fetch-for-review",{
// //             method:"POST",
// //              headers: {
// //         "Content-Type": "application/json",
// //       },
// //             body:JSON.stringify({
// //                 companyId:companyData?.companyId ,
// //                 reviewerId:companyData?.id
// //             })

// //         })
// //         const data = await res.json()
// //         setData(data)
// //         console.log("api data",data);
// //         setLoading(false)
// //       } catch (err) {
// //         console.error("Failed to fetch SOPs:", err)
// //         setLoading(false)
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
// // const getReviewStatus = (sop) => {

// //     const reviewerReview = sop.reviews.find(r => r.reviewerId === companyData?.id);
// //     console.log("asd",reviewerReview);
// //     return reviewerReview ? reviewerReview.status : 'Pending Review';
// //   }
// //   const handleApprove = async (sopId) => {
// //     try {
// //        setApprovingSopId(sopId);
// //       setLoading(true);
      
// //       const res = await fetch(`/api/checklistapi/update-review-status`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ 
// //             prototypeId:sopId,
// //             reviewerId:companyData?.id,
        
// //             status: "Approved" }),
// //       });

// //       if (!res.ok) {
// //         throw new Error("Failed to update status");
// //       }

// //       setSopStatuses(prev => ({
// //         ...prev,
// //         [sopId]: 'Approved'
// //       }));
      
// //       setApprovalMessage(`Checklist "${selectedSop.name}" has been approved successfully!`);
// //       setShowApprovalFeedback(true);
// //       setSelectedSop(null);
      
// //       setTimeout(() => {
// //         setShowApprovalFeedback(false);
// //       }, 3000);
// //     } catch (err) {
// //       console.error("Failed to approve checklist:", err);
// //       setApprovalMessage("Failed to approve checklist. Please try again.");
// //       setShowApprovalFeedback(true);
      
// //       setTimeout(() => {
// //         setShowApprovalFeedback(false);
// //       }, 3000);
// //     } finally {
// //       setLoading(false);
// //        setApprovingSopId(null);
// //     }
// //   }

// //   const handleRejectSubmit = async () => {
// //     if (!rejectReason.trim()) return;
// // console.log(rejectReason);
// //     try {
// //       setLoading(true);
      
// //       const res = await fetch(`/api/checklistapi/update-review-status`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ 
// //              prototypeId:selectedSop?._id,
// //             reviewerId:companyData?.id,
// //           status: "Rejected",
// //           comments: rejectReason 
// //         }),
// //       });

// //       if (!res.ok) {
// //         throw new Error("Failed to reject checklist");
// //       }

// //       setSopStatuses(prev => ({
// //         ...prev,
// //         [selectedSop._id]: 'Rejected'
// //       }));
      
// //       setApprovalMessage(`Checklist "${selectedSop.name}" has been rejected. Reason: ${rejectReason}`);
// //       setShowApprovalFeedback(true);
// //       setShowRejectModal(false);
// //       setSelectedSop(null);
// //       setRejectReason("");
      
// //       setTimeout(() => {
// //         setShowApprovalFeedback(false);
// //       }, 3000);
// //     } catch (err) {
// //       console.error("Failed to reject checklist:", err);
// //       setApprovalMessage("Failed to reject checklist. Please try again.");
// //       setShowApprovalFeedback(true);
      
// //       setTimeout(() => {
// //         setShowApprovalFeedback(false);
// //       }, 3000);
// //     } finally {
// //       setLoading(false);
// //     }
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
// //       case 'Approved':
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //             Approved
// //           </span>
// //         )
// //       case 'Rejected':
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
// //             Rejected
// //           </span>
// //         )
// //       default:
// //         return (
// //           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
// //            Pending Review
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
// //           {task.description && (
// //             <div>
// //               <div className="flex items-center gap-2 text-sm mb-1">
// //                 <FileText className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Description:</span>
// //               </div>
// //               <p className="text-sm text-gray-700 ml-6">{task.description}</p>
// //             </div>
// //           )}

// //           {/* {(task.minTime || task.maxTime) && (
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
// //           )} */}

// // {(task.minTime || task.maxTime) && (
// //   // Check if any of the time values are non-zero
// //   ((task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0)) || 
// //    (task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0))) && (
// //     <div className="bg-white p-3 rounded-lg border">
// //       <div className="flex items-center gap-2 text-sm mb-2">
// //         <Timer className="w-4 h-4 text-gray-500" />
// //         <span className="font-medium">Duration Information:</span>
// //       </div>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
// //         {task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0) && (
// //           <div>
// //             <span className="text-gray-600">Minimum Duration: </span>
// //             <span className="font-medium">
// //               {formatTimeObject(task.minTime)}
// //             </span>
// //           </div>
// //         )}
// //         {task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0) && (
// //           <div>
// //             <span className="text-gray-600">Maximum Duration: </span>
// //             <span className="font-medium">
// //               {formatTimeObject(task.maxTime)}
// //             </span>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // )}

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
// //                   ) : null
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

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

// //   const filteredData = data.filter(item => {
// //     const status = sopStatuses[item._id] || item.status
// //     const matchesSearch = 
// //       item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
// //     const matchesStatus = 
// //       statusFilter === 'All Statuses' || 
// //       status?.toLowerCase() === statusFilter.toLowerCase()
    
// //     return matchesSearch && matchesStatus
// //   })

// //   const showActionButtons = (sop) => {
// //     if (!selectedSop) return false
// //     const reviewerReview = sop.reviews?.find(r => r.reviewerId === companyData?.id);

// //     const status = sopStatuses[selectedSop._id] || reviewerReview.status
// //     console.log(status);
// //     return status === 'Pending Review'
// //   }

// //   // Skeleton loader component
// //   const SkeletonRow = () => (
// //     <tr className="animate-pulse">
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="flex items-center">
// //           <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
// //           <div className="ml-4 space-y-2">
// //             <div className="h-4 bg-gray-200 rounded w-32"></div>
// //             <div className="h-3 bg-gray-200 rounded w-48"></div>
// //           </div>
// //         </div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-8"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="h-4 bg-gray-200 rounded w-32"></div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-right">
// //         <div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto"></div>
// //       </td>
// //     </tr>
// //   )

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
// //         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //           <div className="flex items-center space-x-4">
// //             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
// //               <CheckCircle className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">Review Checklists</h1>
// //               <p className="text-gray-600 mt-2 text-md">Review and approve pending  checklists</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 py-8">
// //         {/* Search and Filter Section */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
// //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //             {/* Search Input */}
// //             <div className="relative flex-1 min-w-0">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search className="h-5 w-5 text-gray-400" />
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Search checklists..."
// //                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
            
// //             {/* Status Filter */}
// //             <div className="flex items-center gap-2 w-full sm:w-auto">
// //               <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
// //                 Filter by:
// //               </span>
// //               <div className="relative">
// //                 <select
// //                   className="appearance-none block pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[120px]"
// //                   value={statusFilter}
// //                   onChange={(e) => setStatusFilter(e.target.value)}
// //                 >
// //                   <option>All Statuses</option>
// //                   <option>Pending Review</option>
// //                   <option>Approved</option>
// //                   <option>Rejected</option>
// //                 </select>
// //                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
// //                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {loading ? (
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
// //                   {Array(5).fill(0).map((_, index) => (
// //                     <SkeletonRow key={`skeleton-${index}`} />
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ) : filteredData.length > 0 ? (
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
// //                   {filteredData.map((sop) => {
// //                     const status = sopStatuses[sop._id] || getReviewStatus(sop)
// //                     return (
// //                       <tr key={sop._id} className="hover:bg-gray-50">
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="flex items-center">
// //                             <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor || 'bg-blue-100'}`}>
// //                               <Layers className="w-5 h-5 text-blue-600" />
// //                             </div>
// //                             <div className="ml-4">
// //                               <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{sop.name}</div>
// //                               <div className="text-sm text-gray-500 line-clamp-1">{sop.description}</div>
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           {getStatusBadge(status)}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="text-sm text-gray-500">{formatDate(sop.createdAt)}</div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                           <div className="flex justify-end space-x-2">
// //                             <button
// //                               onClick={() => handleView(sop)}
// //                               className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
// //                               title={status === 'Pending Review' ? "Review" : "View"}
// //                             >
// //                               <Eye className="w-4 h-4" />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="text-center py-20">
// //             <div className="max-w-md mx-auto">
// //               <h3 className="text-2xl font-bold text-gray-900 mb-3">
// //                 {statusFilter === 'All Statuses' ? 'No checklists found' : 
// //                  `No ${statusFilter} checklists found`}
// //               </h3>
// //               <p className="text-gray-600 mb-8 text-lg">
// //                 {statusFilter === 'All Statuses' ? 'Try adjusting your search' : 
// //                  `No checklists match the ${statusFilter} status filter`}
// //               </p>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {selectedSop && (
// //         <div 
// //           onClick={closeModal}
// //           className="fixed pl-64 inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
// //         >
// //           <div 
// //             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <button
// //               onClick={closeModal}
// //               className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
// //             >
// //               <X className="w-5 h-5 text-gray-600" />
// //             </button>

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
// //                       Status: {getStatusBadge(sopStatuses[selectedSop._id] || selectedSop.status)}
// //                     </span>
// //                    {selectedSop.rejectionReason?<div className="font-semibold capitalize">reason: {selectedSop.rejectionReason}</div>:<></>} 
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="p-6 space-y-8">
// //               {selectedSop.description && (
// //                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
// //                   <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
// //                   <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
// //                 </div>
// //               )}

// //               <div className="space-y-6">
// //                 {selectedSop.stages?.map((stage, stageIndex) => (
// //                   <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
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

// //             {showActionButtons(selectedSop) && (
// //               <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
// //                 <button
// //                   onClick={() => setShowRejectModal(true)}
// //                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
// //                 >
// //                   <X className="w-5 h-5" />
// //                   Reject
// //                 </button>
// //                 <button
// //                   onClick={() => handleApprove(selectedSop._id)}
// //                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 min-w-[100px]"
// //                   disabled={loading} // Disable while loading
// //                 >
// //                   {approvingSopId === selectedSop._id ? (
// //                     <Loader2 className="w-5 h-5 animate-spin" />
// //                   ) : (
// //                     <>
// //                       <Check className="w-5 h-5" />
// //                       Approve
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {showRejectModal && (
// //         <div className="fixed inset-0 pl-64 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

// //       {showApprovalFeedback && (
// //         <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-green-200 z-50 flex items-center gap-3 animate-fade-in-up">
// //           <CheckCircle className="w-6 h-6 text-green-600" />
// //           <p className="text-gray-800">{approvalMessage}</p>
// //         </div>
// //       )}

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

// // export default ReviewPage;



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
//     Loader2 
// } from "lucide-react"
// import Image from "next/image"

// const ReviewPage = () => {
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
//     const [approvingSopId, setApprovingSopId] = useState(null) 

//   useEffect(() => {
//     const userData = localStorage.getItem('user')
//     const data = JSON.parse(userData)
//     console.log(data);
//     setCompanyData(data)
//   }, [])

//   // useEffect(() => {
//   //   const fetchSops = async () => {
//   //     try {
//   //       setLoading(true)
//   //       const res = await fetch("/api/checklistapi/fetch-for-review",{
//   //           method:"POST",
//   //            headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //           body:JSON.stringify({
//   //               companyId:companyData?.companyId ,
//   //               reviewerId:companyData?.id
//   //           })

//   //       })
//   //       const data = await res.json()
//   //       setData(data)
//   //       console.log("api data",data);
//   //       setLoading(false)
//   //     } catch (err) {
//   //       console.error("Failed to fetch SOPs:", err)
//   //       setLoading(false)
//   //     }
//   //   }
    
//   //   if (companyData) {
//   //     fetchSops()
//   //   }
//   // }, [companyData])

//   useEffect(() => {
//   const fetchSops = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/checklistapi/fetch-for-review", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           companyId: companyData?.companyId,
//           reviewerId: companyData?.id,
//         }),
//       });
//       const data = await res.json();
//       // Transform data to ensure nested structure
//       const transformedData = data.map((sop) => ({
//         ...sop,
//         stages: sop.stages.map((stage) => ({
//           ...stage,
//           tasks: stage.tasks.map((task) => ({
//             ...task,
//             minTime: task.minTime || { hours: 0, minutes: 0, seconds: 0 },
//             maxTime: task.maxTime || { hours: 0, minutes: 0, seconds: 0 },
//             images: task.images || [],  // Use 'images' to match saved data
//             galleryTitle: task.galleryTitle || '',  // Default metadata
//             galleryDescription: task.galleryDescription || '',
//           })),
//         })),
//       }));
//       setData(transformedData);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch SOPs:", err);
//       setLoading(false);
//     }
//   };

//   if (companyData) {
//     fetchSops();
//   }
// }, [companyData]);


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
// const getReviewStatus = (sop) => {

//     const reviewerReview = sop.reviews.find(r => r.reviewerId === companyData?.id);
//     console.log("asd",reviewerReview);
//     return reviewerReview ? reviewerReview.status : 'Pending Review';
//   }
//   const handleApprove = async (sopId) => {
//     try {
//        setApprovingSopId(sopId);
//       setLoading(true);
      
//       const res = await fetch(`/api/checklistapi/update-review-status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//             prototypeId:sopId,
//             reviewerId:companyData?.id,
//         reviewDate: Date.now(),
//             status: "Approved" }),
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
//        setApprovingSopId(null);
//     }
//   }

//   const handleRejectSubmit = async () => {
//     if (!rejectReason.trim()) return;
// console.log(rejectReason);
//     try {
//       setLoading(true);
      
//       const res = await fetch(`/api/checklistapi/update-review-status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//              prototypeId:selectedSop?._id,
//             reviewerId:companyData?.id,
//           status: "Rejected",
//           comments: rejectReason 
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

// const formatTimeObject = (timeObj) => {
//   if (!timeObj) return "Not set";
//   const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
//   return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
// }

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
//            Pending Review
//           </span>
//         )
//     }
//   }

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
// //           {task.description && (
// //             <div>
// //               <div className="flex items-center gap-2 text-sm mb-1">
// //                 <FileText className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Description:</span>
// //               </div>
// //               <p className="text-sm text-gray-700 ml-6">{task.description}</p>
// //             </div>
// //           )}

// //           {/* {(task.minTime || task.maxTime) && (
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
// //           )} */}

// // {(task.minTime || task.maxTime) && (
// //   // Check if any of the time values are non-zero
// //   ((task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0)) || 
// //    (task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0))) && (
// //     <div className="bg-white p-3 rounded-lg border">
// //       <div className="flex items-center gap-2 text-sm mb-2">
// //         <Timer className="w-4 h-4 text-gray-500" />
// //         <span className="font-medium">Duration Information:</span>
// //       </div>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
// //         {task.minTime && (task.minTime.hours > 0 || task.minTime.minutes > 0 || task.minTime.seconds > 0) && (
// //           <div>
// //             <span className="text-gray-600">Minimum Duration: </span>
// //             <span className="font-medium">
// //               {formatTimeObject(task.minTime)}
// //             </span>
// //           </div>
// //         )}
// //         {task.maxTime && (task.maxTime.hours > 0 || task.maxTime.minutes > 0 || task.maxTime.seconds > 0) && (
// //           <div>
// //             <span className="text-gray-600">Maximum Duration: </span>
// //             <span className="font-medium">
// //               {formatTimeObject(task.maxTime)}
// //             </span>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // )}

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
// //                   ) : null
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

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

// const renderTask = (task, level = 0, taskNumber = "1") => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;
//   const isExpanded = expandedTasks[task.id || task._id] || false;
//   const taskId = task.id || task._id;

//   const isZeroTime = (time) =>
//     time && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

//   const shouldShowDurationInfo =
//     (task.minTime && !isZeroTime(task.minTime)) ||
//     (task.maxTime && !isZeroTime(task.maxTime));

//   return (
//     <div
//       key={taskId}
//       className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50 rounded-xl m-2" : "border-purple-200 rounded-xl bg-purple-50"} p-4 mb-3`}
//     >
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           {hasSubtasks && (
//             <button onClick={() => toggleTaskExpansion(taskId)} className="text-gray-600 hover:text-gray-800">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           <span className="font-medium text-gray-900">
//             {taskNumber}. {task.title || "Untitled Task"}
//           </span>
//         </div>
//       </div>

//       <div className="space-y-3 ml-6">
//         {task.description && (
//           <div>
//             <div className="flex items-center gap-2 text-sm mb-1">
//               <FileText className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Description:</span>
//             </div>
//             <p className="text-sm text-gray-700 ml-6">{task.description}</p>
//           </div>
//         )}

//         {shouldShowDurationInfo && (
//           <div className="bg-white p-3 rounded-lg border">
//             <div className="flex items-center gap-2 text-sm mb-2">
//               <Timer className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Duration Information:</span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
//               {task.minTime && !isZeroTime(task.minTime) && (
//                 <div>
//                   <span className="text-gray-600">Minimum Duration: </span>
//                   <span className="font-medium">{task.minTime}</span>
//                 </div>
//               )}
//               {task.maxTime && !isZeroTime(task.maxTime) && (
//                 <div>
//                   <span className="text-gray-600">Maximum Duration: </span>
//                   <span className="font-medium">{task.maxTime}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {(task.galleryTitle || task.galleryDescription || task.images?.length > 0) && (
//           <div className="bg-slate-200 p-3 rounded-lg border">
//             <div className="flex items-center gap-2 text-sm mb-2">
//               <ImageIcon className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Image Metadata:</span>
//             </div>
//             <div className="space-y-1 text-sm ml-6">
//               {task.galleryTitle && (
//                 <div>
//                   <span className="text-gray-600">Title: </span>
//                   <span className="font-medium">{task.galleryTitle}</span>
//                 </div>
//               )}
//               {task.galleryDescription && (
//                 <div>
//                   <span className="text-gray-600">Description: </span>
//                   <span className="font-medium">{task.galleryDescription}</span>
//                 </div>
//               )}
//             </div>
//             {task.images?.length > 0 && (
//               <div>
//                 <div className="flex items-center gap-2 text-sm mb-2">
//                   <Layers className="w-4 h-4 text-gray-500" />
//                   <span className="font-base">Attached Images ({task.images.length}):</span>
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
//                   {task.images.map((image, idx) =>
//                     image?.url ? (
//                       <div key={idx} className="border rounded-lg overflow-hidden bg-white">
//                         <Image
//                           src={image.url || "/placeholder.svg"}
//                           alt={image.name || `Image ${idx + 1}`}
//                           width={200}
//                           height={120}
//                           className="w-full h-24 object-cover"
//                         />
//                         {image.name && (
//                           <div className="p-2">
//                             <p className="text-xs text-gray-600 truncate">{image.name}</p>
//                           </div>
//                         )}
//                       </div>
//                     ) : null,
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {hasSubtasks && isExpanded && (
//         <div className="mt-4 space-y-2">
//           <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//             <ChevronDown className="w-4 h-4" />
//             <span>Subtasks ({task.subtasks.length}):</span>
//           </div>
//           {task.subtasks.map((subtask, index) => renderTask(subtask, level + 1, `${taskNumber}.${index + 1}`))}
//         </div>
//       )}
//     </div>
//   );
// };

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

//   const showActionButtons = (sop) => {
//     if (!selectedSop) return false
//     const reviewerReview = sop.reviews?.find(r => r.reviewerId === companyData?.id);

//     const status = sopStatuses[selectedSop._id] || reviewerReview.status
//     console.log(status);
//     return status === 'Pending Review'
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
//               <h1 className="text-2xl font-bold text-gray-900">Review Checklists</h1>
//               <p className="text-gray-600 mt-2 text-md">Review and approve pending  checklists</p>
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
//                   <option>Pending Review</option>
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
//                     const status = sopStatuses[sop._id] || getReviewStatus(sop)
//                     return (
//                       <tr key={sop._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor || 'bg-blue-100'}`}>
//                               <Layers className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{sop.name}</div>
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
//                               title={status === 'Pending Review' ? "Review" : "View"}
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
//           className="fixed pl-64 inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
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

//             {showActionButtons(selectedSop) && (
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
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 min-w-[100px]"
//                   disabled={loading} // Disable while loading
//                 >
//                   {approvingSopId === selectedSop._id ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Approve
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {showRejectModal && (
//         <div className="fixed inset-0 pl-64 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

// export default ReviewPage;


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
  Loader2,
  Users,
  User
} from "lucide-react"
import Image from "next/image"

const ReviewPage = () => {
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
  const [approvingSopId, setApprovingSopId] = useState(null) 

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const data = JSON.parse(userData)
    console.log(data);
    setCompanyData(data)
  }, [])

  useEffect(() => {
  const fetchSops = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checklistapi/fetch-for-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: companyData?.companyId,
          reviewerId: companyData?.id,
        }),
      });
      const data = await res.json();
      // Transform data to ensure nested structure
      const transformedData = data.map((sop) => ({
        ...sop,
        stages: sop.stages.map((stage) => ({
          ...stage,
          tasks: stage.tasks.map((task) => ({
            ...task,
            minTime: task.minTime || { hours: 0, minutes: 0, seconds: 0 },
            maxTime: task.maxTime || { hours: 0, minutes: 0, seconds: 0 },
            images: task.images || [],  // Use 'images' to match saved data
            galleryTitle: task.galleryTitle || '',  // Default metadata
            galleryDescription: task.galleryDescription || '',
          })),
        })),
      }));
      setData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch SOPs:", err);
      setLoading(false);
    }
  };

  if (companyData) {
    fetchSops();
  }
}, [companyData]);


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

    const reviewerReview = sop.reviews.find(r => r.reviewerId === companyData?.id);
    console.log("asd",reviewerReview);
    return reviewerReview ? reviewerReview.status : 'Pending Review';
  }
  const handleApprove = async (sopId) => {
    try {
       setApprovingSopId(sopId);
      setLoading(true);
      
      const res = await fetch(`/api/checklistapi/update-review-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            prototypeId:sopId,
            reviewerId:companyData?.id,
        reviewDate: Date.now(),
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
       setApprovingSopId(null);
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
console.log(rejectReason);
    try {
      setLoading(true);
      
      const res = await fetch(`/api/checklistapi/update-review-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
             prototypeId:selectedSop?._id,
            reviewerId:companyData?.id,
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
  if (!timeObj) return "Not set";
  const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const isExpanded = expandedTasks[task.id || task._id] || false;
  const taskId = task.id || task._id;

  const isZeroTime = (time) =>
    time && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  const shouldShowDurationInfo =
    (task.minTime && !isZeroTime(task.minTime)) ||
    (task.maxTime && !isZeroTime(task.maxTime));

  return (
    <div
      key={taskId}
      className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50 rounded-xl m-2" : "border-purple-200 rounded-xl bg-purple-50"} p-4 mb-3`}
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

        {shouldShowDurationInfo && (
          <div className="bg-white p-3 rounded-lg border">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Duration Information:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
              {task.minTime && !isZeroTime(task.minTime) && (
                <div>
                  <span className="text-gray-600">Minimum Duration: </span>
                  <span className="font-medium">{task.minTime}</span>
                </div>
              )}
              {task.maxTime && !isZeroTime(task.maxTime) && (
                <div>
                  <span className="text-gray-600">Maximum Duration: </span>
                  <span className="font-medium">{task.maxTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(task.galleryTitle || task.galleryDescription || task.images?.length > 0) && (
          <div className="bg-slate-200 p-3 rounded-lg border">
            <div className="flex items-center gap-2 text-sm mb-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Image Metadata:</span>
            </div>
            <div className="space-y-1 text-sm ml-6">
              {task.galleryTitle && (
                <div>
                  <span className="text-gray-600">Title: </span>
                  <span className="font-medium">{task.galleryTitle}</span>
                </div>
              )}
              {task.galleryDescription && (
                <div>
                  <span className="text-gray-600">Description: </span>
                  <span className="font-medium">{task.galleryDescription}</span>
                </div>
              )}
            </div>
            {task.images?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span className="font-base">Attached Images ({task.images.length}):</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
                  {task.images.map((image, idx) =>
                    image?.url ? (
                      <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                        <Image
                          src={image.url || "/placeholder.svg"}
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
                    ) : null,
                  )}
                </div>
              </div>
            )}
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
  );
};

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
    const reviewerReview = sop.reviews?.find(r => r.reviewerId === companyData?.id);

    const status = sopStatuses[selectedSop._id] || reviewerReview.status
    console.log(status);
    return status === 'Pending Review'
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
 useEffect(() => {
    
      fetchUserById(selectedSop?.userId);
    
  }, [selectedSop]);
  const [name,setNAme]=useState();
const fetchUserById = async (id) => {
  const res = await fetch(`/api/users/fetch-by-id/${id}`);
  const data = await res.json();
  console.log("asdfasdf",data?.user?.name);
  setNAme(data?.user?.name);

};
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Checklists</h1>
              <p className="text-gray-600 mt-2 text-md">Review and approve pending  checklists</p>
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
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{sop.name}</div>
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
          className="fixed pl-64 inset-0 bg-gray-900/20 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
        >
          <div 
            className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[80vh] overflow-y-auto mx-4"
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

              {/* --- VISUAL REPRESENTATION SECTION --- */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Visual Representation
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check Point
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Production
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          QA
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedSop.visualRepresntation?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {/* Check Point Column */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 capitalize">
                                  {item.checkPoint?.title || 'No Title'}
                                </div>
                                {/* Images */}
                                {item.checkPoint?.images && item.checkPoint.images.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    {item.checkPoint.images.map((image, imgIndex) => (
                                      <img 
                                        key={imgIndex}
                                        src={image.url} 
                                        alt={`Checkpoint ${index + 1} - Image ${imgIndex + 1}`}
                                        className="h-8 w-8 rounded border border-gray-200 object-cover hover:scale-110 transition-transform cursor-pointer"
                                        onClick={() => window.open(image.url, '_blank')}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
                              {item.cleaningStatus || 'Visually Clean'}
                            </span>
                          </td>

                          {/* Production Column */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium `}>
                              {item.production || 'Not Set'}
                            </span>
                          </td>

                          {/* QA Column */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ">
                              {item.qa || 'Not Set'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Empty State */}
                  {(!selectedSop.visualRepresntation || selectedSop.visualRepresntation.length === 0) && (
                    <div className="text-center py-12 bg-gray-50">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">No Visual Data</h4>
                      <p className="text-gray-500 text-sm">
                        No visual representation data available for this SOP.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- CONTRIBUTORS SECTION --- */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Contributors
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Created By */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Created By</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {companyData.name?.charAt(0) || 'C'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {name}
                        </span>
                      </div>
                  </div>

                  {/* Reviewers */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Reviewers</h4>
                          <p className="text-sm text-gray-500">
                            {selectedSop.reviews?.length || 0} assigned
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedSop.reviews && selectedSop.reviews.length > 0 ? (
                        selectedSop.reviews.map((review, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-medium text-yellow-800">
                                {review.reviewerName?.charAt(0) || 'R'}
                              </div>
                              <span className="text-sm text-gray-700 truncate max-w-20">
                                {review.reviewerName || 'Unknown'}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              review.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : review.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {review.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-gray-500 text-sm">
                          No reviewers assigned
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approvers */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Approvers</h4>
                          <p className="text-sm text-gray-500">
                            {selectedSop.approvers?.length || 0} assigned
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedSop.approvers && selectedSop.approvers.length > 0 ? (
                        selectedSop.approvers.map((approver, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-800">
                                {approver.approverName?.charAt(0) || 'A'}
                              </div>
                              <span className="text-sm text-gray-700 truncate max-w-20">
                                {approver.approverName || 'Unknown'}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              approver.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : approver.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {approver.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-gray-500 text-sm">
                          No approvers assigned
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Tables (Collapsible) */}
                {(selectedSop.reviews && selectedSop.reviews.length > 0) ||
                  (selectedSop.approvers && selectedSop.approvers.length > 0) ? (
                  <div className="mt-6 space-y-4">
                    {/* Reviewers Table */}
                    {selectedSop.reviews && selectedSop.reviews.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-yellow-600" />
                            Reviewers Details
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reviewer
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Comments
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedSop.reviews.map((review, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-yellow-800">
                                          {review.reviewerName?.charAt(0) || 'R'}
                                        </span>
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {review.reviewerName || 'Unknown'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {review.reviewerRole || 'Not specified'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      review.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : review.status === 'Rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {review.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                      {review.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                      {review.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {review.reviewDate ? new Date(review.reviewDate).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }) : 'Not reviewed'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                    {review.comments || 'No comments'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Approvers Table */}
                    {selectedSop.approvers && selectedSop.approvers.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Approvers Details
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Approver
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Comments
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedSop.approvers.map((approver, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-green-800">
                                          {approver.approverName?.charAt(0) || 'A'}
                                        </span>
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {approver.approverName || 'Unknown'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {approver.approverRole || 'Not specified'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      approver.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : approver.status === 'Rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {approver.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                      {approver.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                      {approver.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {approver.approvalDate ? new Date(approver.approvalDate).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }) : 'Not approved'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                    {approver.comments || 'No comments'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-gray-200 mt-4">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-1">No Contributors Assigned</h4>
                    <p className="text-gray-500 text-sm">
                      This checklist hasn't been sent for review or approval yet.
                    </p>
                  </div>
                )}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 min-w-[100px]"
                  disabled={loading}
                >
                  {approvingSopId === selectedSop._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 pl-64 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

export default ReviewPage;