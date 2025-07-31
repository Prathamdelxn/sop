// // "use client"
// // import { useEffect, useState } from "react"
// // import {
// //   Plus,
// //   Sparkles,
// //   Trash2,
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
// //   Heart,
// //   Bookmark,
// //   FileText,
// //   Clock,
// //   Users,
// //   Edit,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   Hash,
// //   Calendar,
// //   Timer,
// //   ImageIcon,
// // } from "lucide-react"
// // import { useRouter } from "next/navigation"
// // import Image from "next/image"

// // const SOPDashboard = () => {
// //   const router = useRouter()
// //   const [sopData, setSopData] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [selectedSop, setSelectedSop] = useState(null)
// //   const [expandedTasks, setExpandedTasks] = useState({})

// //   const icons = [
// //     CheckCircle,
// //     Activity,
// //     AlertCircle,
// //     Zap,
// //     TrendingUp,
// //     Target,
// //     Layers,
// //     Workflow,
// //     Star,
// //     Eye,
// //     Heart,
// //     Bookmark,
// //     FileText,
// //     Clock,
// //     Users,
// //   ]

// //   const colors = [
// //     { bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600" },
// //     { bg: "bg-blue-50", gradient: "from-blue-500 to-purple-500", text: "text-blue-600" },
// //     { bg: "bg-orange-50", gradient: "from-orange-500 to-red-500", text: "text-orange-600" },
// //     { bg: "bg-purple-50", gradient: "from-purple-500 to-indigo-500", text: "text-purple-600" },
// //     { bg: "bg-pink-50", gradient: "from-pink-500 to-rose-500", text: "text-pink-600" },
// //     { bg: "bg-amber-50", gradient: "from-amber-500 to-yellow-500", text: "text-amber-600" },
// //   ]

// //   const handleCreate = () => {
// //     router.push("/dashboard/create-checklist/create-sop")
// //   }

  

// //   const handleDelete = async (id) => {
// //     if (confirm("Are you sure you want to delete this checklist?")) {
// //       try {
// //         await fetch(`/api/task/delete/${id}`, {
// //           method: "DELETE",
// //         })
// //         setSopData(sopData.filter((item) => item._id !== id))
// //       } catch (err) {
// //         console.error("Failed to delete SOP:", err)
// //       }
// //     }
// //   }

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

// //   const formatDuration = (minutes) => {
// //     if (!minutes) return "Not set"
// //     const hours = Math.floor(minutes / 60)
// //     const mins = minutes % 60
// //     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
// //   }

// //   const formatTimeObject = (timeObj) => {
// //     if (!timeObj) return "Not set"
// //     const { hours = 0, minutes = 0, seconds = 0 } = timeObj
// //     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
// //     if (minutes > 0) return `${minutes}m ${seconds}s`
// //     return `${seconds}s`
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

// //           {/* Task Metadata */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
// //             {/* Created At */}
// //             {task.createdAt && (
// //               <div className="flex items-center gap-2">
// //                 <Calendar className="w-4 h-4 text-gray-500" />
// //                 <span>Created:</span>
// //                 <span className="font-medium">{formatDate(task.createdAt)}</span>
// //               </div>
// //             )}
// //           </div>

// //           {/* Duration Information */}
// //           {(task.minDuration || task.maxDuration || task.minTime || task.maxTime) && (
// //             <div className="bg-white p-3 rounded-lg border">
// //               <div className="flex items-center gap-2 text-sm mb-2">
// //                 <Timer className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Duration Information:</span>
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
// //                 {(task.minDuration || task.maxDuration) && (
// //                   <div>
// //                     <span className="text-gray-600">Minimum Duration: </span>
// //                     <span className="font-medium">
// //                       {task.maxTime.hours}h {task.maxTime.minutes}m {task.maxTime.seconds}sec
                      
// //                     </span>
// //                   </div>
// //                 )}
// //                  {(task.minDuration || task.maxDuration) && (
// //                   <div>
// //                     <span className="text-gray-600">Maximum Duration: </span>
// //                     <span className="font-medium">
// //                      {task.maxTime.hours}h {task.maxTime.minutes}m {task.maxTime.seconds}sec
                    
// //                     </span>
// //                   </div>
// //                 )}
                
// //               </div>
// //             </div>
// //           )}

// //           {/* Image Information */}
// //           {(task.imageTitle || task.imageDescription || task.imagePublicId) && (
// //             <div className="bg-white p-3 rounded-lg border">
// //               <div className="flex items-center gap-2 text-sm mb-2">
// //                 <ImageIcon className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Image Metadata:</span>
// //               </div>
// //               <div className="space-y-1 text-sm ml-6">
// //                 {task.imageTitle && (
// //                   <div>
// //                     <span className="text-gray-600">Title: </span>
// //                     <span className="font-medium">{task.imageTitle}</span>
// //                   </div>
// //                 )}
// //                 {task.imageDescription && (
// //                   <div>
// //                     <span className="text-gray-600">Description: </span>
// //                     <span className="font-medium">{task.imageDescription}</span>
// //                   </div>
// //                 )}
               
// //               </div>
// //             </div>
// //           )}

// //           {/* Attached Images */}
// //           {task.attachedImages?.length > 0 && (
// //             <div>
// //               <div className="flex items-center gap-2 text-sm mb-2">
// //                 <Layers className="w-4 h-4 text-gray-500" />
// //                 <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
// //               </div>
// //               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
// //                 {task.attachedImages.map((image, idx) =>
// //                   image?.url ? (
// //                     <div key={idx} className="border rounded-lg overflow-hidden bg-white">
// //                       <Image
// //                         src={image.url || "/placeholder.svg"}
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
// // const[companyData,setCompanyData]=useState();
// //   useEffect(()=>{
// //     const userData=localStorage.getItem('user');
// //     const data=JSON.parse(userData);
// //     console.log("asdfddd",data)
// //     setCompanyData(data);
// //   },[])
// // useEffect(() => {
// //   const fetchSops = async () => {
// //     try {
// //       const res = await fetch("/api/task/fetchAll");
// //       const data = await res.json();
// //       const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
// //       setSopData(filtered); // ✅ only set the matched records
// //       console.log("All SOPs:", data.data); // shows all 9
// //       console.log("Filtered SOPs:", filtered); // shows only the matching 1
// //     } catch (err) {
// //       console.error("Failed to fetch SOPs:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   fetchSops();
// // }, [companyData]); // ✅ Also ensure to rerun when companyData is ready

// // //   useEffect(() => {
// // //     const fetchSops = async () => {
// // //       try {
// // //         const res = await fetch("/api/task/fetchAll")
// // //         const data = await res.json();
// // //          const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
// // //         setSopData(data.data)
// // //         console.log("dd",data.data)
// // //         console.log(filtered)
// // //       } catch (err) {
// // //         console.error("Failed to fetch SOPs:", err)
// // //       } finally {
// // //         setLoading(false)
// // //       }
// // //     }
// // //     fetchSops()
// // //   }, [])

// //   const enhancedSopData = sopData.map((item, index) => {
// //     const Icon = icons[index % icons.length]
// //     const color = colors[index % colors.length]
// //     return {
// //       ...item,
// //       id: item._id,
// //       icon: <Icon className={`w-5 h-5 ${color.text}`} />,
// //       bgColor: color.bg,
// //       gradient: color.gradient,
// //       formattedDate: formatDate(item.createdAt),
// //     }
// //   })

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-200 shadow-sm">
// //         <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //           <div className="flex items-center space-x-4">
// //             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
// //               <Sparkles className="w-8 h-8 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-4xl font-bold text-gray-900">Checklist Workspace</h1>
// //               <p className="text-gray-600 mt-2 text-lg">Manage and track your development processes</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={handleCreate}
// //             className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-3 shadow hover:shadow-md"
// //           >
// //             <Plus className="w-5 h-5" />
// //             <span>Create New</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-6 py-8">
// //         {loading ? (
// //           <p className="text-center text-gray-600">Loading checklists...</p>
// //         ) : enhancedSopData.length > 0 ? (
// //           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th
// //                       scope="col"
// //                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
// //                     >
// //                       Checklist
// //                     </th>
// //                     <th
// //                       scope="col"
// //                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
// //                     >
// //                       Stages
// //                     </th>
// //                     <th
// //                       scope="col"
// //                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
// //                     >
// //                       Created At
// //                     </th>
// //                     <th
// //                       scope="col"
// //                       className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
// //                     >
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {enhancedSopData.map((sop) => (
// //                     <tr key={sop.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="flex items-center">
// //                           <div
// //                             className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}
// //                           >
// //                             {sop.icon}
// //                           </div>
// //                           <div className="ml-4">
// //                             <div className="text-sm font-medium text-gray-900">{sop.name}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-500">{sop.formattedDate}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                         <div className="flex justify-end space-x-2">
// //                           <button
// //                             onClick={() => handleView(sop)}
// //                             className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
// //                             title="View"
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(sop.id)}
// //                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
// //                             title="Delete"
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </button>
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
// //               <h3 className="text-2xl font-bold text-gray-900 mb-3">No checklist found</h3>
// //               <p className="text-gray-600 mb-8 text-lg">Click below to create a new checklist.</p>
// //               <button
// //                 onClick={handleCreate}
// //                 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow hover:shadow-md"
// //               >
// //                 Create New Checklist
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* View Modal */}
// //        {selectedSop && (
// //   <div 
// //     onClick={closeModal}
// //     className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200"
// //   >
// //     <div 
// //       className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
// //       onClick={(e) => e.stopPropagation()}
// //     >
// //       {/* Close Button (Top Right) */}
// //       <button
// //         onClick={closeModal}
// //         className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
// //       >
// //         <X className="w-5 h-5 text-gray-600" />
// //       </button>

// //       {/* Modal Header */}
// //       <div className="sticky top-0 bg-white p-6 pb-4 border-b">
// //         <div className="flex items-start justify-between gap-4">
// //           <div>
// //             <h2 className="text-2xl font-bold text-gray-900">{selectedSop.name}</h2>
// //             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
// //               {selectedSop.createdAt && (
// //                 <span className="flex items-center">
// //                   <Calendar className="w-4 h-4 mr-1.5" />
// //                   Created: {formatDate(selectedSop.createdAt)}
// //                 </span>
// //               )}
// //               {selectedSop.stages && (
// //                 <span className="flex items-center">
// //                   <Layers className="w-4 h-4 mr-1.5" />
// //                   {selectedSop.stages.length} Stages
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal Content */}
// //       <div className="p-6 space-y-8">
// //         {/* SOP Description */}
// //         {selectedSop.description && (
// //           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
// //             <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
// //             <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
// //           </div>
// //         )}

// //         {/* Stages */}
// //         <div className="space-y-6">
// //           {selectedSop.stages?.map((stage, stageIndex) => (
// //             <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
// //               {/* Stage Header */}
// //               <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
// //                 <div className="flex items-center">
// //                   <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
// //                     {stageIndex + 1}
// //                   </span>
// //                   <h3 className="font-semibold text-gray-800">{stage.name}</h3>
// //                   <span className="ml-auto text-sm text-gray-500">
// //                     {stage.tasks?.length || 0} tasks
// //                   </span>
// //                 </div>
// //                 {stage.description && (
// //                   <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
// //                 )}
// //               </div>

// //               {/* Tasks */}
// //               <div className="divide-y divide-gray-100">
// //                 {stage.tasks?.length > 0 ? (
// //                   stage.tasks.map((task, taskIndex) =>
// //                     renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
// //                   )
// //                 ) : (
// //                   <div className="text-center py-8 text-gray-500 bg-gray-50">
// //                     <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
// //                     <p>No tasks in this stage</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   )
// // }

// // export default SOPDashboard


// "use client"

// import { useEffect, useState } from "react"
// import {
//   Plus,
//   Sparkles,
//   Trash2,
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
//   Heart,
//   Bookmark,
//   FileText,
//   Clock,
//   Users,
//   Edit,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Hash,
//   Calendar,
//   Timer,
//   ImageIcon,
//   Check,
//   Circle,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"

// const SOPDashboard = () => {
//   const router = useRouter()
//   const [sopData, setSopData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filtering, setFiltering] = useState(true) // New state for filtering
//   const [selectedSop, setSelectedSop] = useState(null)
//   const [expandedTasks, setExpandedTasks] = useState({})
//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [editingSop, setEditingSop] = useState({
//     name: '',
//     description: '',
//     stages: [],
//     createdAt: new Date(),
//     status: 'pending'
//   })

//   const icons = [
//     CheckCircle,
//     Activity,
//     AlertCircle,
//     Zap,
//     TrendingUp,
//     Target,
//     Layers,
//     Workflow,
//     Star,
//     Eye,
//     Heart,
//     Bookmark,
//     FileText,
//     Clock,
//     Users,
//   ]

//   const colors = [
//     { bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600" },
//     { bg: "bg-blue-50", gradient: "from-blue-500 to-purple-500", text: "text-blue-600" },
//     { bg: "bg-orange-50", gradient: "from-orange-500 to-red-500", text: "text-orange-600" },
//     { bg: "bg-purple-50", gradient: "from-purple-500 to-indigo-500", text: "text-purple-600" },
//     { bg: "bg-pink-50", gradient: "from-pink-500 to-rose-500", text: "text-pink-600" },
//     { bg: "bg-amber-50", gradient: "from-amber-500 to-yellow-500", text: "text-amber-600" },
//   ]

//   // Skeleton Loading Components
//   const SkeletonTableRow = () => (
//     <tr className="animate-pulse">
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
//           <div className="ml-4">
//             <div className="h-4 bg-gray-200 rounded w-32"></div>
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-8"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-6 bg-gray-200 rounded-full w-16"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-center">
//         <div className="h-8 bg-gray-200 rounded-full w-16 mx-auto"></div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-right">
//         <div className="flex justify-end space-x-2">
//           <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
//           <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
//           <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
//         </div>
//       </td>
//     </tr>
//   )

//   const SkeletonHeader = () => (
//     <div className="bg-white border-b border-gray-200 shadow-sm animate-pulse">
//       <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//         <div className="flex items-center space-x-4">
//           <div className="p-4 bg-gray-200 rounded-3xl shadow w-16 h-16"></div>
//           <div className="space-y-3">
//             <div className="h-8 bg-gray-200 rounded w-64"></div>
//             <div className="h-4 bg-gray-200 rounded w-80"></div>
//           </div>
//         </div>
//         <div className="bg-gray-200 text-white font-bold py-4 px-8 rounded-2xl h-12 w-40"></div>
//       </div>
//     </div>
//   )

//   const SkeletonEmptyState = () => (
//     <div className="text-center py-20 animate-pulse">
//       <div className="max-w-md mx-auto space-y-4">
//         <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
//         <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
//         <div className="h-10 bg-gray-200 rounded-2xl w-40 mx-auto"></div>
//       </div>
//     </div>
//   )

//   const handleCreate = () => {
//     router.push("/dashboard/create-checklist/create-sop")
//   }

//   const handleApprove = async (id) => {
//     if (confirm("Are you sure you want to approve this checklist?")) {
//       try {
//         const res = await fetch(`/api/task/approve/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: "approved" }),
//         })
        
//         if (res.ok) {
//           setSopData(sopData.map(item => 
//             item._id === id ? { ...item, status: "approved" } : item
//           ))
//         }
//       } catch (err) {
//         console.error("Failed to approve SOP:", err)
//       }
//     }
//   }

//   const handleEdit = (sop) => {
//     setEditingSop({
//       ...sop,
//       stages: sop.stages?.map(stage => ({
//         ...stage,
//         tasks: stage.tasks?.map(task => ({
//           ...task,
//           minTime: task.minTime || { hours: 0, minutes: 0, seconds: 0 },
//           maxTime: task.maxTime || { hours: 0, minutes: 0, seconds: 0 },
//           attachedImages: task.attachedImages || [],
//           subtasks: task.subtasks?.map(subtask => ({
//             ...subtask,
//             minTime: subtask.minTime || { hours: 0, minutes: 0, seconds: 0 },
//             maxTime: subtask.maxTime || { hours: 0, minutes: 0, seconds: 0 }
//           })) || []
//         })) || []
//       })) || []
//     })
//     setEditModalOpen(true)
//   }

//   const handleSaveEdit = async () => {
//     try {
//       const res = await fetch(`/api/task/update/${editingSop._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editingSop),
//       })
      
//       if (res.ok) {
//         setSopData(sopData.map(item => 
//           item._id === editingSop._id ? editingSop : item
//         ))
//         setEditModalOpen(false)
//       }
//     } catch (err) {
//       console.error("Failed to update SOP:", err)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this checklist?")) {
//       try {
//         await fetch(`/api/task/delete/${id}`, {
//           method: "DELETE",
//         })
//         setSopData(sopData.filter((item) => item._id !== id))
//       } catch (err) {
//         console.error("Failed to delete SOP:", err)
//       }
//     }
//   }

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

//   const formatDuration = (minutes) => {
//     if (!minutes) return "Not set"
//     const hours = Math.floor(minutes / 60)
//     const mins = minutes % 60
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
//   }

//   const formatTimeObject = (timeObj) => {
//     if (!timeObj) return "Not set"
//     const { hours = 0, minutes = 0, seconds = 0 } = timeObj
//     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
//     if (minutes > 0) return `${minutes}m ${seconds}s`
//     return `${seconds}s`
//   }

//   const handleFormChange = (path, value) => {
//     if (path === 'stages') {
//       setEditingSop(prev => ({ ...prev, stages: value }))
//     } else {
//       const pathParts = path.split('.')
//       setEditingSop(prev => {
//         const newValue = { ...prev }
//         let current = newValue
        
//         for (let i = 0; i < pathParts.length - 1; i++) {
//           const part = pathParts[i]
//           if (!current[part]) current[part] = {}
//           current = current[part]
//         }
        
//         current[pathParts[pathParts.length - 1]] = value
//         return newValue
//       })
//     }
//   }

//   const handleTaskTimeChange = (stageIndex, taskIndex, timeType, field, value) => {
//     setEditingSop(prev => {
//       const newStages = [...prev.stages]
//       const newTime = { 
//         ...newStages[stageIndex].tasks[taskIndex][timeType],
//         [field]: parseInt(value) || 0
//       }
      
//       newStages[stageIndex].tasks[taskIndex][timeType] = newTime
//       return { ...prev, stages: newStages }
//     })
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

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//             {task.createdAt && (
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-gray-500" />
//                 <span>Created:</span>
//                 <span className="font-medium">{formatDate(task.createdAt)}</span>
//               </div>
//             )}
//           </div>

//           {(task.minDuration || task.maxDuration || task.minTime || task.maxTime) && (
//             <div className="bg-white p-3 rounded-lg border">
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <Timer className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Duration Information:</span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
//                 {(task.minDuration || task.maxDuration) && (
//                   <div>
//                     <span className="text-gray-600">Minimum Duration: </span>
//                     <span className="font-medium">
//                       {task.minTime ? formatTimeObject(task.minTime) : formatDuration(task.minDuration)}
//                     </span>
//                   </div>
//                 )}
//                 {(task.minDuration || task.maxDuration) && (
//                   <div>
//                     <span className="text-gray-600">Maximum Duration: </span>
//                     <span className="font-medium">
//                       {task.maxTime ? formatTimeObject(task.maxTime) : formatDuration(task.maxDuration)}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {(task.imageTitle || task.imageDescription || task.imagePublicId) && (
//             <div className="bg-white p-3 rounded-lg border">
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <ImageIcon className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Image Metadata:</span>
//               </div>
//               <div className="space-y-1 text-sm ml-6">
//                 {task.imageTitle && (
//                   <div>
//                     <span className="text-gray-600">Title: </span>
//                     <span className="font-medium">{task.imageTitle}</span>
//                   </div>
//                 )}
//                 {task.imageDescription && (
//                   <div>
//                     <span className="text-gray-600">Description: </span>
//                     <span className="font-medium">{task.imageDescription}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {task.attachedImages?.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 text-sm mb-2">
//                 <Layers className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
//                 {task.attachedImages.map((image, idx) =>
//                   image?.url ? (
//                     <div key={idx} className="border rounded-lg overflow-hidden bg-white">
//                       <Image
//                         src={image.url || "/placeholder.svg"}
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

//   const [companyData, setCompanyData] = useState()

//   useEffect(() => {
//     const userData = localStorage.getItem('user')
//     const data = JSON.parse(userData)
//     setCompanyData(data)
//   }, [])

//   useEffect(() => {
//     const fetchSops = async () => {
//       try {
//         setLoading(true)
//         setFiltering(true)
//         const res = await fetch("/api/task/fetchAll")
//         const data = await res.json()
//         // Simulate filtering delay
//         setTimeout(() => {
//           const filtered = data.data.filter(item => item.companyId === companyData?.companyId)
//           setSopData(filtered)
//           setFiltering(false)
//           setLoading(false)
//         }, 500) // Add slight delay to show filtering state
//       } catch (err) {
//         console.error("Failed to fetch SOPs:", err)
//         setLoading(false)
//         setFiltering(false)
//       }
//     }
    
//     if (companyData) {
//       fetchSops()
//     }
//   }, [companyData])

//   const enhancedSopData = sopData.map((item, index) => {
//     const Icon = icons[index % icons.length]
//     const color = colors[index % colors.length]
//     return {
//       ...item,
//       id: item._id,
//       icon: <Icon className={`w-5 h-5 ${color.text}`} />,
//       bgColor: color.bg,
//       gradient: color.gradient,
//       formattedDate: formatDate(item.createdAt),
//       status: item.status || "pending",
//     }
//   })

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       approved: {
//         color: "bg-green-100 text-green-800",
//         icon: <Check className="w-3 h-3" />,
//         text: "Approved"
//       },
//       pending: {
//         color: "bg-yellow-100 text-yellow-800",
//         icon: <Circle className="w-3 h-3" />,
//         text: "Pending"
//       },
//       rejected: {
//         color: "bg-red-100 text-red-800",
//         icon: <X className="w-3 h-3" />,
//         text: "Rejected"
//       }
//     }
    
//     const statusConfig = statusMap[status] || statusMap.pending
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//         {statusConfig.icon}
//         <span className="ml-1">{statusConfig.text}</span>
//       </span>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Show skeleton header while loading or filtering */}
//       {loading || filtering ? (
//         <SkeletonHeader />
//       ) : (
//         <div className="bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
//                 <Sparkles className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900">Checklist Workspace</h1>
//                 <p className="text-gray-600 mt-2 text-lg">Manage and track your development processes</p>
//               </div>
//             </div>
//             <button
//               onClick={handleCreate}
//               className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-3 shadow hover:shadow-md"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Create New</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {loading || filtering ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Checklist
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stages
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created At
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Approve
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {[...Array(3)].map((_, i) => (
//                     <SkeletonTableRow key={i} />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : enhancedSopData.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Checklist
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stages
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created At
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Approve
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {enhancedSopData.map((sop) => (
//                     <tr key={sop.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}>
//                             {sop.icon}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{sop.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(sop.status)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">{sop.formattedDate}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         {sop.status !== "approved" && (
//                           <button
//                             onClick={() => handleApprove(sop.id)}
//                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                             title="Approve"
//                           >
//                             <Check className="w-4 h-4 mr-1" />
//                             Approve
//                           </button>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <button
//                             onClick={() => handleEdit(sop)}
//                             className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleView(sop)}
//                             className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                             title="View"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(sop.id)}
//                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <SkeletonEmptyState />
//         )}
//       </div>

//       {/* View Modal */}
//       {selectedSop && (
//         <div 
//           onClick={closeModal}
//           className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200"
//         >
//           <div 
//             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
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
//                       {getStatusBadge(selectedSop.status)}
//                     </span>
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
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <div 
//           onClick={() => setEditModalOpen(false)}
//           className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200"
//         >
//           <div 
//             className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setEditModalOpen(false)}
//               className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>

//             <div className="sticky top-0 bg-white p-6 pb-4 border-b">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Edit {editingSop.name}</h2>
//                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
//                     {editingSop.createdAt && (
//                       <span className="flex items-center">
//                         <Calendar className="w-4 h-4 mr-1.5" />
//                         Created: {formatDate(editingSop.createdAt)}
//                       </span>
//                     )}
//                     {editingSop.stages && (
//                       <span className="flex items-center">
//                         <Layers className="w-4 h-4 mr-1.5" />
//                         {editingSop.stages.length} Stages
//                       </span>
//                     )}
//                     <span className="flex items-center">
//                       {getStatusBadge(editingSop.status)}
//                     </span>
//                   </div>
//                 </div>
                
//               </div>
//             </div>

//             <div className="p-6 space-y-8">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Name</label>
//                 <input
//                   type="text"
//                   value={editingSop.name}
//                   onChange={(e) => handleFormChange('name', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   value={editingSop.description || ''}
//                   onChange={(e) => handleFormChange('description', e.target.value)}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="space-y-6">
//                 {editingSop.stages?.map((stage, stageIndex) => (
//                   <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
//                       <div className="flex items-center flex-1">
//                         <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
//                           {stageIndex + 1}
//                         </span>
//                         <input
//                           type="text"
//                           value={stage.name || ""}
//                           onChange={(e) => handleFormChange(`stages.${stageIndex}.name`, e.target.value)}
//                           className="font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
//                         />
//                         <span className="ml-3 text-sm text-gray-500">
//                           {stage.tasks?.length || 0} tasks
//                         </span>
//                       </div>
//                       <div className="flex gap-2 ml-4">
//                         <button
//                           onClick={() => {
//                             const newTask = {
//                               _id: `task-${Date.now()}`,
//                               title: `New Task ${stage.tasks.length + 1}`,
//                               description: '',
//                               minTime: { hours: 0, minutes: 0, seconds: 0 },
//                               maxTime: { hours: 0, minutes: 0, seconds: 0 },
//                               attachedImages: [],
//                               subtasks: []
//                             }
//                             const updatedStages = [...editingSop.stages]
//                             updatedStages[stageIndex].tasks = [...updatedStages[stageIndex].tasks, newTask]
//                             handleFormChange('stages', updatedStages)
//                           }}
//                           className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
//                         >
//                           <Plus className="w-3 h-3" />
//                           <span>Add Task</span>
//                         </button>
//                        <Trash2 
//   className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" 
//   onClick={() => {
//     if (editingSop.stages.length > 1) {
//       const updatedStages = editingSop.stages.filter((_, i) => i !== stageIndex)
//       handleFormChange('stages', updatedStages)
//     } else {
//       alert("You must have at least one stage")
//     }
//   }}
// />
//                       </div>
//                     </div>
                    
//                     {stage.description && (
//                       <div className="p-3 bg-gray-50 border-b">
//                         <textarea
//                           value={stage.description || ""}
//                           onChange={(e) => handleFormChange(`stages.${stageIndex}.description`, e.target.value)}
//                           className="mt-2 text-sm text-gray-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                           rows={2}
//                           placeholder="Stage description..."
//                         />
//                       </div>
//                     )}

//                     <div className="divide-y divide-gray-100">
//                       {stage.tasks?.length > 0 ? (
//                         stage.tasks.map((task, taskIndex) => (
//                           <div key={task._id} className="p-4 relative group border rounded-lg mb-3">
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center gap-2">
//                                 <span className="font-medium text-gray-900">
//                                   {stageIndex + 1}.{taskIndex + 1}.
//                                 </span>
//                                 <input
//                                   type="text"
//                                   value={task.title || ""}
//                                   onChange={(e) => handleFormChange(`stages.${stageIndex}.tasks.${taskIndex}.title`, e.target.value)}
//                                   className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
//                                 />
//                               </div>
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => {
//                                     const newSubtask = {
//                                       _id: `subtask-${Date.now()}`,
//                                       title: `New Subtask ${(task.subtasks?.length || 0) + 1}`,
//                                       description: '',
//                                       minTime: { hours: 0, minutes: 0, seconds: 0 },
//                                       maxTime: { hours: 0, minutes: 0, seconds: 0 },
//                                       subtasks: []
//                                     }
//                                     const updatedStages = [...editingSop.stages]
//                                     updatedStages[stageIndex].tasks[taskIndex].subtasks = [
//                                       ...(updatedStages[stageIndex].tasks[taskIndex].subtasks || []),
//                                       newSubtask
//                                     ]
//                                     handleFormChange('stages', updatedStages)
//                                   }}
//                                   className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                   <span>Add Subtask</span>
//                                 </button>
//                               <Trash2 
//   className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" 
//   onClick={() => {
//     const updatedStages = [...editingSop.stages]
//     updatedStages[stageIndex].tasks = updatedStages[stageIndex].tasks.filter((_, i) => i !== taskIndex)
//     handleFormChange('stages', updatedStages)
//   }}
// />
//                               </div>
//                             </div>

//                             <div className="space-y-3 ml-6">
//                               <div>
//                                 <label className="flex items-center gap-2 text-sm mb-1">
//                                   <FileText className="w-4 h-4 text-gray-500" />
//                                   <span className="font-medium">Description:</span>
//                                 </label>
//                                 <textarea
//                                   value={task.description || ""}
//                                   onChange={(e) => handleFormChange(`stages.${stageIndex}.tasks.${taskIndex}.description`, e.target.value)}
//                                   className="w-full text-sm text-gray-700 ml-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                   rows={3}
//                                   placeholder="Task description..."
//                                 />
//                               </div>

//                               <div className="bg-white p-3 rounded-lg border">
//                                 <div className="flex items-center gap-2 text-sm mb-2">
//                                   <Timer className="w-4 h-4 text-gray-500" />
//                                   <span className="font-medium">Duration Information:</span>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ml-6">
//                                   <div className="space-y-2">
//                                     <label className="text-gray-600">Minimum Time</label>
//                                     <div className="flex gap-2">
//                                       <div>
//                                         <label className="text-xs text-gray-500">Hours</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           value={task.minTime?.hours || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'hours', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                       <div>
//                                         <label className="text-xs text-gray-500">Minutes</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           max="59"
//                                           value={task.minTime?.minutes || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'minutes', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                       <div>
//                                         <label className="text-xs text-gray-500">Seconds</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           max="59"
//                                           value={task.minTime?.seconds || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'seconds', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="space-y-2">
//                                     <label className="text-gray-600">Maximum Time</label>
//                                     <div className="flex gap-2">
//                                       <div>
//                                         <label className="text-xs text-gray-500">Hours</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           value={task.maxTime?.hours || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'hours', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                       <div>
//                                         <label className="text-xs text-gray-500">Minutes</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           max="59"
//                                           value={task.maxTime?.minutes || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'minutes', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                       <div>
//                                         <label className="text-xs text-gray-500">Seconds</label>
//                                         <input
//                                           type="number"
//                                           min="0"
//                                           max="59"
//                                           value={task.maxTime?.seconds || 0}
//                                           onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'seconds', e.target.value)}
//                                           className="w-full p-1 border border-gray-300 rounded"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Subtasks section */}
//                               {task.subtasks?.length > 0 && (
//                                 <div className="mt-4 border-t pt-4">
//                                   <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                                     <ChevronDown className="w-4 h-4" />
//                                     Subtasks ({task.subtasks.length})
//                                   </h4>
//                                   <div className="space-y-3 ml-6">
//                                     {task.subtasks.map((subtask, subtaskIndex) => (
//                                       <div key={subtask._id} className="p-3 bg-gray-50 rounded-lg border relative">
//                                         <div className="flex items-center justify-between mb-2">
//                                           <div className="flex items-center gap-2">
//                                             <span className="text-sm font-medium">
//                                               {stageIndex + 1}.{taskIndex + 1}.{subtaskIndex + 1}.
//                                             </span>
//                                             <input
//                                               type="text"
//                                               value={subtask.title || ""}
//                                               onChange={(e) => {
//                                                 const path = `stages.${stageIndex}.tasks.${taskIndex}.subtasks.${subtaskIndex}.title`
//                                                 handleFormChange(path, e.target.value)
//                                               }}
//                                               className="text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
//                                             />
//                                           </div>
//                                           <button
//                                             onClick={() => {
//                                               const updatedStages = [...editingSop.stages]
//                                               updatedStages[stageIndex].tasks[taskIndex].subtasks = 
//                                                 updatedStages[stageIndex].tasks[taskIndex].subtasks.filter((_, i) => i !== subtaskIndex)
//                                               handleFormChange('stages', updatedStages)
//                                             }}
//                                             className="text-red-500 hover:text-red-700 p-1"
//                                           >
//                                             <Trash2 className="w-4 h-4" />
//                                           </button>
//                                         </div>

//                                         <div className="space-y-2 ml-4">
//                                           <div>
//                                             <label className="flex items-center gap-2 text-xs mb-1">
//                                               <FileText className="w-3 h-3 text-gray-500" />
//                                               <span className="font-medium">Description:</span>
//                                             </label>
//                                             <textarea
//                                               value={subtask.description || ""}
//                                               onChange={(e) => {
//                                                 const path = `stages.${stageIndex}.tasks.${taskIndex}.subtasks.${subtaskIndex}.description`
//                                                 handleFormChange(path, e.target.value)
//                                               }}
//                                               className="w-full text-xs text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                               rows={2}
//                                               placeholder="Subtask description..."
//                                             />
//                                           </div>

//                                           <div className="bg-white p-2 rounded border">
//                                             <div className="flex items-center gap-2 text-xs mb-1">
//                                               <Timer className="w-3 h-3 text-gray-500" />
//                                               <span className="font-medium">Duration:</span>
//                                             </div>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ml-4">
//                                               <div className="space-y-1">
//                                                 <label className="text-gray-600">Min Time</label>
//                                                 <div className="flex gap-1">
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       value={subtask.minTime?.hours || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
//                                                           hours: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">h</span>
//                                                   </div>
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       max="59"
//                                                       value={subtask.minTime?.minutes || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
//                                                           minutes: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">m</span>
//                                                   </div>
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       max="59"
//                                                       value={subtask.minTime?.seconds || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
//                                                           seconds: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">s</span>
//                                                   </div>
//                                                 </div>
//                                               </div>
//                                               <div className="space-y-1">
//                                                 <label className="text-gray-600">Max Time</label>
//                                                 <div className="flex gap-1">
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       value={subtask.maxTime?.hours || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
//                                                           hours: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">h</span>
//                                                   </div>
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       max="59"
//                                                       value={subtask.maxTime?.minutes || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
//                                                           minutes: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">m</span>
//                                                   </div>
//                                                   <div>
//                                                     <input
//                                                       type="number"
//                                                       min="0"
//                                                       max="59"
//                                                       value={subtask.maxTime?.seconds || 0}
//                                                       onChange={(e) => {
//                                                         const updatedStages = [...editingSop.stages]
//                                                         updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
//                                                           ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
//                                                           seconds: parseInt(e.target.value) || 0
//                                                         }
//                                                         handleFormChange('stages', updatedStages)
//                                                       }}
//                                                       className="w-full p-1 border border-gray-300 rounded text-xs"
//                                                     />
//                                                     <span className="text-xs text-gray-500">s</span>
//                                                   </div>
//                                                 </div>
//                                               </div>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-8 text-gray-500 bg-gray-50">
//                           <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
//                           <p>No tasks in this stage</p>
//                           <button
//                             onClick={() => {
//                               const newTask = {
//                                 _id: `task-${Date.now()}`,
//                                 title: 'First Task',
//                                 description: '',
//                                 minTime: { hours: 0, minutes: 0, seconds: 0 },
//                                 maxTime: { hours: 0, minutes: 0, seconds: 0 },
//                                 subtasks: []
//                               }
//                               const updatedStages = [...editingSop.stages]
//                               updatedStages[stageIndex].tasks = [newTask]
//                               handleFormChange('stages', updatedStages)
//                             }}
//                             className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
//                           >
//                             Add First Task
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-between pt-4 border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     const newStage = {
//                       _id: `stage-${Date.now()}`,
//                       name: `New Stage ${editingSop.stages.length + 1}`,
//                       description: '',
//                       tasks: []
//                     }
//                     handleFormChange('stages', [...editingSop.stages, newStage])
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add Another Stage</span>
//                 </button>
                
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setEditModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEdit}
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SOPDashboard



"use client"
import { useEffect, useState } from "react"
import {
  Plus,
  Sparkles,
  Trash2,
  CheckCircle,
  Activity,
  AlertCircle,
  Zap,
  TrendingUp,
  Target,
  Layers,
  Workflow,
  Star,
  Eye,
  Heart,
  Bookmark,
  FileText,
  Clock,
  Users,
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Hash,
  Calendar,
  Timer,
  ImageIcon,
  Check,
  Circle,
} from "lucide-react"
import { SendHorizontal } from 'lucide-react'; 
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sen } from "next/font/google"

const SOPDashboard = () => {
  const router = useRouter()
  const [sopData, setSopData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(true) // New state for filtering
  const [selectedSop, setSelectedSop] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingSop, setEditingSop] = useState({
    name: '',
    description: '',
    stages: [],
    createdAt: new Date(),
    status: 'pending'
  })

  const icons = [
    CheckCircle,
    Activity,
    AlertCircle,
    Zap,
    TrendingUp,
    Target,
    Layers,
    Workflow,
    Star,
    Eye,
    Heart,
    Bookmark,
    FileText,
    Clock,
    Users,
    Edit,
    X,
    SendHorizontal, 
  ]

  const colors = [
    { bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600" },
    { bg: "bg-blue-50", gradient: "from-blue-500 to-purple-500", text: "text-blue-600" },
    { bg: "bg-orange-50", gradient: "from-orange-500 to-red-500", text: "text-orange-600" },
    { bg: "bg-purple-50", gradient: "from-purple-500 to-indigo-500", text: "text-purple-600" },
    { bg: "bg-pink-50", gradient: "from-pink-500 to-rose-500", text: "text-pink-600" },
    { bg: "bg-amber-50", gradient: "from-amber-500 to-yellow-500", text: "text-amber-600" },
  ]

  // Skeleton Loading Components
  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="h-8 bg-gray-200 rounded-full w-16 mx-auto"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </td>
    </tr>
  )

  const SkeletonHeader = () => (
    <div className="bg-white border-b border-gray-200 shadow-sm animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gray-200 rounded-3xl shadow w-16 h-16"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-80"></div>
          </div>
        </div>
        <div className="bg-gray-200 text-white font-bold py-4 px-8 rounded-2xl h-12 w-40"></div>
      </div>
    </div>
  )

  const SkeletonEmptyState = () => (
    <div className="text-center py-20 animate-pulse">
      <div className="max-w-md mx-auto space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        <div className="h-10 bg-gray-200 rounded-2xl w-40 mx-auto"></div>
      </div>
    </div>
  )

  const handleCreate = () => {
    router.push("/dashboard/create-checklist/create-sop")
  }

  const handleApprove = async (id) => {
    if (confirm("Are you sure you want to approve this checklist?")) {
      try {
        const res = await fetch(`/api/task/approve/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }),
        })
        
        if (res.ok) {
          setSopData(sopData.map(item => 
            item._id === id ? { ...item, status: "approved" } : item
          ))
        }
      } catch (err) {
        console.error("Failed to approve SOP:", err)
      }
    }
  }

  const handleEdit = (sop) => {
    setEditingSop({
      ...sop,
      stages: sop.stages?.map(stage => ({
        ...stage,
        tasks: stage.tasks?.map(task => ({
          ...task,
          minTime: task.minTime || { hours: 0, minutes: 0, seconds: 0 },
          maxTime: task.maxTime || { hours: 0, minutes: 0, seconds: 0 },
          attachedImages: task.attachedImages || [],
          subtasks: task.subtasks?.map(subtask => ({
            ...subtask,
            minTime: subtask.minTime || { hours: 0, minutes: 0, seconds: 0 },
            maxTime: subtask.maxTime || { hours: 0, minutes: 0, seconds: 0 }
          })) || []
        })) || []
      })) || []
    })
    setEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/task/update/${editingSop._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSop),
      })
      
      if (res.ok) {
        setSopData(sopData.map(item => 
          item._id === editingSop._id ? editingSop : item
        ))
        setEditModalOpen(false)
      }
    } catch (err) {
      console.error("Failed to update SOP:", err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this checklist?")) {
      try {
        await fetch(`/api/task/delete/${id}`, {
          method: "DELETE",
        })
        setSopData(sopData.filter((item) => item._id !== id))
      } catch (err) {
        console.error("Failed to delete SOP:", err)
      }
    }
  }

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

  const formatDuration = (minutes) => {
    if (!minutes) return "Not set"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimeObject = (timeObj) => {
    if (!timeObj) return "Not set"
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  const handleFormChange = (path, value) => {
    if (path === 'stages') {
      setEditingSop(prev => ({ ...prev, stages: value }))
    } else {
      const pathParts = path.split('.')
      setEditingSop(prev => {
        const newValue = { ...prev }
        let current = newValue
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          if (!current[part]) current[part] = {}
          current = current[part]
        }
        
        current[pathParts[pathParts.length - 1]] = value
        return newValue
      })
    }
  }

  const handleTaskTimeChange = (stageIndex, taskIndex, timeType, field, value) => {
    setEditingSop(prev => {
      const newStages = [...prev.stages]
      const newTime = { 
        ...newStages[stageIndex].tasks[taskIndex][timeType],
        [field]: parseInt(value) || 0
      }
      
      newStages[stageIndex].tasks[taskIndex][timeType] = newTime
      return { ...prev, stages: newStages }
    })
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {task.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Created:</span>
                <span className="font-medium">{formatDate(task.createdAt)}</span>
              </div>
            )}
          </div>

          {(task.minDuration || task.maxDuration || task.minTime || task.maxTime) && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Duration Information:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
                {(task.minDuration || task.maxDuration) && (
                  <div>
                    <span className="text-gray-600">Minimum Duration: </span>
                    <span className="font-medium">
                      {task.minTime ? formatTimeObject(task.minTime) : formatDuration(task.minDuration)}
                    </span>
                  </div>
                )}
                {(task.minDuration || task.maxDuration) && (
                  <div>
                    <span className="text-gray-600">Maximum Duration: </span>
                    <span className="font-medium">
                      {task.maxTime ? formatTimeObject(task.maxTime) : formatDuration(task.maxDuration)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(task.imageTitle || task.imageDescription || task.imagePublicId) && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm mb-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Image Metadata:</span>
              </div>
              <div className="space-y-1 text-sm ml-6">
                {task.imageTitle && (
                  <div>
                    <span className="text-gray-600">Title: </span>
                    <span className="font-medium">{task.imageTitle}</span>
                  </div>
                )}
                {task.imageDescription && (
                  <div>
                    <span className="text-gray-600">Description: </span>
                    <span className="font-medium">{task.imageDescription}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {task.attachedImages?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Layers className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Attached Images ({task.attachedImages.length}):</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
                {task.attachedImages.map((image, idx) =>
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

  const [companyData, setCompanyData] = useState()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const data = JSON.parse(userData)
    setCompanyData(data)
  }, [])

  useEffect(() => {
    const fetchSops = async () => {
      try {
        setLoading(true)
        setFiltering(true)
        const res = await fetch("/api/task/fetchAll")
        const data = await res.json()
        // Simulate filtering delay
        setTimeout(() => {
          const filtered = data.data.filter(item => item.companyId === companyData?.companyId)
          setSopData(filtered)
          setFiltering(false)
          setLoading(false)
        }, 500) // Add slight delay to show filtering state
      } catch (err) {
        console.error("Failed to fetch SOPs:", err)
        setLoading(false)
        setFiltering(false)
      }
    }
    
    if (companyData) {
      fetchSops()
    }
  }, [companyData])

  const enhancedSopData = sopData.map((item, index) => {
    const Icon = icons[index % icons.length]
    const color = colors[index % colors.length]
    return {
      ...item,
      id: item._id,
      icon: <Icon className={`w-5 h-5 ${color.text}`} />,
      bgColor: color.bg,
      gradient: color.gradient,
      formattedDate: formatDate(item.createdAt),
      status: item.status || "pending",
    }
  })

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: {
        color: "bg-green-100 text-green-800",
        icon: <Check className="w-3 h-3" />,
        text: "Approved"
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Circle className="w-3 h-3" />,
        text: "Pending"
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
        text: "Rejected"
      }
    }
    
    const statusConfig = statusMap[status] || statusMap.pending
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        <span className="ml-1">{statusConfig.text}</span>
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show skeleton header while loading or filtering */}
      {loading || filtering ? (
        <SkeletonHeader />
      ) : (
        <div className="bg-white border-b border-gray-200 rounded-xl mx-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checklist Workspace</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and track your development processes</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-3 shadow hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create New</span>
            </button>
          </div>
        </div>
      )}

    {/* Main Content */}
<div className="max-w-7xl mx-auto px-6 py-8">
  {/* Search and Filter Bar */}
  <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search checklists..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          // Add onChange handler for search functionality
          // onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Filter by:
        </label>
        <select
          id="status-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          // Add onChange handler for filter functionality
          // onChange={(e) => handleStatusFilter(e.target.value)}
          defaultValue="all"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  </div>
      
  {loading || filtering ? (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Checklist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stages
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approve
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(3)].map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : enhancedSopData.length > 0 ? (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Checklist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stages
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approve
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enhancedSopData.map((sop) => (
              <tr key={sop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}>
                      {sop.icon}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{sop.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(sop.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{sop.formattedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {sop.status !== "approved" ? (
                    sop.approvalSent ? (
                      <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Approval Request Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(sop.id)}
                        className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#54b6cf] hover:bg-[#2791b8] "
                        title="Send for Approval"
                      >
                        Send for Approval
                      </button>
                    )
                  ) : (
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(sop)}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleView(sop)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sop.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <SkeletonEmptyState />
  )}
</div>
      {/* View Modal */}
      {selectedSop && (
        <div 
          onClick={closeModal}
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200"
        >
          <div 
            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
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
                      {getStatusBadge(selectedSop.status)}
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
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div 
          onClick={() => setEditModalOpen(false)}
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200"
        >
          <div 
            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="sticky top-0 bg-white p-6 pb-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit {editingSop.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    {editingSop.createdAt && (
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Created: {formatDate(editingSop.createdAt)}
                      </span>
                    )}
                    {editingSop.stages && (
                      <span className="flex items-center">
                        <Layers className="w-4 h-4 mr-1.5" />
                        {editingSop.stages.length} Stages
                      </span>
                    )}
                    <span className="flex items-center">
                      {getStatusBadge(editingSop.status)}
                    </span>
                  </div>
                </div>
                
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Name</label>
                <input
                  type="text"
                  value={editingSop.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingSop.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-6">
                {editingSop.stages?.map((stage, stageIndex) => (
                  <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                          {stageIndex + 1}
                        </span>
                        <input
                          type="text"
                          value={stage.name || ""}
                          onChange={(e) => handleFormChange(`stages.${stageIndex}.name`, e.target.value)}
                          className="font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                        />
                        <span className="ml-3 text-sm text-gray-500">
                          {stage.tasks?.length || 0} tasks
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            const newTask = {
                              _id: `task-${Date.now()}`,
                              title: `New Task ${stage.tasks.length + 1}`,
                              description: '',
                              minTime: { hours: 0, minutes: 0, seconds: 0 },
                              maxTime: { hours: 0, minutes: 0, seconds: 0 },
                              attachedImages: [],
                              subtasks: []
                            }
                            const updatedStages = [...editingSop.stages]
                            updatedStages[stageIndex].tasks = [...updatedStages[stageIndex].tasks, newTask]
                            handleFormChange('stages', updatedStages)
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Task</span>
                        </button>
                       <Trash2 
  className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" 
  onClick={() => {
    if (editingSop.stages.length > 1) {
      const updatedStages = editingSop.stages.filter((_, i) => i !== stageIndex)
      handleFormChange('stages', updatedStages)
    } else {
      alert("You must have at least one stage")
    }
  }}
/>
                      </div>
                    </div>
                    
                    {stage.description && (
                      <div className="p-3 bg-gray-50 border-b">
                        <textarea
                          value={stage.description || ""}
                          onChange={(e) => handleFormChange(`stages.${stageIndex}.description`, e.target.value)}
                          className="mt-2 text-sm text-gray-600 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows={2}
                          placeholder="Stage description..."
                        />
                      </div>
                    )}

                    <div className="divide-y divide-gray-100">
                      {stage.tasks?.length > 0 ? (
                        stage.tasks.map((task, taskIndex) => (
                          <div key={task._id} className="p-4 relative group border rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {stageIndex + 1}.{taskIndex + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={task.title || ""}
                                  onChange={(e) => handleFormChange(`stages.${stageIndex}.tasks.${taskIndex}.title`, e.target.value)}
                                  className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const newSubtask = {
                                      _id: `subtask-${Date.now()}`,
                                      title: `New Subtask ${(task.subtasks?.length || 0) + 1}`,
                                      description: '',
                                      minTime: { hours: 0, minutes: 0, seconds: 0 },
                                      maxTime: { hours: 0, minutes: 0, seconds: 0 },
                                      subtasks: []
                                    }
                                    const updatedStages = [...editingSop.stages]
                                    updatedStages[stageIndex].tasks[taskIndex].subtasks = [
                                      ...(updatedStages[stageIndex].tasks[taskIndex].subtasks || []),
                                      newSubtask
                                    ]
                                    handleFormChange('stages', updatedStages)
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Subtask</span>
                                </button>
                              <Trash2 
  className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" 
  onClick={() => {
    const updatedStages = [...editingSop.stages]
    updatedStages[stageIndex].tasks = updatedStages[stageIndex].tasks.filter((_, i) => i !== taskIndex)
    handleFormChange('stages', updatedStages)
  }}
/>
                              </div>
                            </div>

                            <div className="space-y-3 ml-6">
                              <div>
                                <label className="flex items-center gap-2 text-sm mb-1">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">Description:</span>
                                </label>
                                <textarea
                                  value={task.description || ""}
                                  onChange={(e) => handleFormChange(`stages.${stageIndex}.tasks.${taskIndex}.description`, e.target.value)}
                                  className="w-full text-sm text-gray-700 ml-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  rows={3}
                                  placeholder="Task description..."
                                />
                              </div>

                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <Timer className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">Duration Information:</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ml-6">
                                  <div className="space-y-2">
                                    <label className="text-gray-600">Minimum Time</label>
                                    <div className="flex gap-2">
                                      <div>
                                        <label className="text-xs text-gray-500">Hours</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={task.minTime?.hours || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'hours', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500">Minutes</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="59"
                                          value={task.minTime?.minutes || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'minutes', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500">Seconds</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="59"
                                          value={task.minTime?.seconds || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'minTime', 'seconds', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-gray-600">Maximum Time</label>
                                    <div className="flex gap-2">
                                      <div>
                                        <label className="text-xs text-gray-500">Hours</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={task.maxTime?.hours || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'hours', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500">Minutes</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="59"
                                          value={task.maxTime?.minutes || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'minutes', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-500">Seconds</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="59"
                                          value={task.maxTime?.seconds || 0}
                                          onChange={(e) => handleTaskTimeChange(stageIndex, taskIndex, 'maxTime', 'seconds', e.target.value)}
                                          className="w-full p-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Subtasks section */}
                              {task.subtasks?.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <ChevronDown className="w-4 h-4" />
                                    Subtasks ({task.subtasks.length})
                                  </h4>
                                  <div className="space-y-3 ml-6">
                                    {task.subtasks.map((subtask, subtaskIndex) => (
                                      <div key={subtask._id} className="p-3 bg-gray-50 rounded-lg border relative">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                              {stageIndex + 1}.{taskIndex + 1}.{subtaskIndex + 1}.
                                            </span>
                                            <input
                                              type="text"
                                              value={subtask.title || ""}
                                              onChange={(e) => {
                                                const path = `stages.${stageIndex}.tasks.${taskIndex}.subtasks.${subtaskIndex}.title`
                                                handleFormChange(path, e.target.value)
                                              }}
                                              className="text-sm font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                            />
                                          </div>
                                          <button
                                            onClick={() => {
                                              const updatedStages = [...editingSop.stages]
                                              updatedStages[stageIndex].tasks[taskIndex].subtasks = 
                                                updatedStages[stageIndex].tasks[taskIndex].subtasks.filter((_, i) => i !== subtaskIndex)
                                              handleFormChange('stages', updatedStages)
                                            }}
                                            className="text-red-500 hover:text-red-700 p-1"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>

                                        <div className="space-y-2 ml-4">
                                          <div>
                                            <label className="flex items-center gap-2 text-xs mb-1">
                                              <FileText className="w-3 h-3 text-gray-500" />
                                              <span className="font-medium">Description:</span>
                                            </label>
                                            <textarea
                                              value={subtask.description || ""}
                                              onChange={(e) => {
                                                const path = `stages.${stageIndex}.tasks.${taskIndex}.subtasks.${subtaskIndex}.description`
                                                handleFormChange(path, e.target.value)
                                              }}
                                              className="w-full text-xs text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              rows={2}
                                              placeholder="Subtask description..."
                                            />
                                          </div>

                                          <div className="bg-white p-2 rounded border">
                                            <div className="flex items-center gap-2 text-xs mb-1">
                                              <Timer className="w-3 h-3 text-gray-500" />
                                              <span className="font-medium">Duration:</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ml-4">
                                              <div className="space-y-1">
                                                <label className="text-gray-600">Min Time</label>
                                                <div className="flex gap-1">
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      value={subtask.minTime?.hours || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
                                                          hours: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">h</span>
                                                  </div>
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="59"
                                                      value={subtask.minTime?.minutes || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
                                                          minutes: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">m</span>
                                                  </div>
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="59"
                                                      value={subtask.minTime?.seconds || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].minTime,
                                                          seconds: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">s</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-gray-600">Max Time</label>
                                                <div className="flex gap-1">
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      value={subtask.maxTime?.hours || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
                                                          hours: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">h</span>
                                                  </div>
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="59"
                                                      value={subtask.maxTime?.minutes || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
                                                          minutes: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">m</span>
                                                  </div>
                                                  <div>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="59"
                                                      value={subtask.maxTime?.seconds || 0}
                                                      onChange={(e) => {
                                                        const updatedStages = [...editingSop.stages]
                                                        updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime = {
                                                          ...updatedStages[stageIndex].tasks[taskIndex].subtasks[subtaskIndex].maxTime,
                                                          seconds: parseInt(e.target.value) || 0
                                                        }
                                                        handleFormChange('stages', updatedStages)
                                                      }}
                                                      className="w-full p-1 border border-gray-300 rounded text-xs"
                                                    />
                                                    <span className="text-xs text-gray-500">s</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No tasks in this stage</p>
                          <button
                            onClick={() => {
                              const newTask = {
                                _id: `task-${Date.now()}`,
                                title: 'First Task',
                                description: '',
                                minTime: { hours: 0, minutes: 0, seconds: 0 },
                                maxTime: { hours: 0, minutes: 0, seconds: 0 },
                                subtasks: []
                              }
                              const updatedStages = [...editingSop.stages]
                              updatedStages[stageIndex].tasks = [newTask]
                              handleFormChange('stages', updatedStages)
                            }}
                            className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Add First Task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const newStage = {
                      _id: `stage-${Date.now()}`,
                      name: `New Stage ${editingSop.stages.length + 1}`,
                      description: '',
                      tasks: []
                    }
                    handleFormChange('stages', [...editingSop.stages, newStage])
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Stage</span>
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SOPDashboard