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
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const SOPDashboard = () => {
  const router = useRouter()
  const [sopData, setSopData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSop, setSelectedSop] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})

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
  ]

  const colors = [
    { bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600" },
    { bg: "bg-blue-50", gradient: "from-blue-500 to-purple-500", text: "text-blue-600" },
    { bg: "bg-orange-50", gradient: "from-orange-500 to-red-500", text: "text-orange-600" },
    { bg: "bg-purple-50", gradient: "from-purple-500 to-indigo-500", text: "text-purple-600" },
    { bg: "bg-pink-50", gradient: "from-pink-500 to-rose-500", text: "text-pink-600" },
    { bg: "bg-amber-50", gradient: "from-amber-500 to-yellow-500", text: "text-amber-600" },
  ]

  const handleCreate = () => {
    router.push("/dashboard/create-checklist/create-sop")
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
          {/* Task Description */}
          {task.description && (
            <div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Description:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{task.description}</p>
            </div>
          )}

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Created At */}
            {task.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Created:</span>
                <span className="font-medium">{formatDate(task.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Duration Information */}
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
                      {task.maxTime.hours}h {task.maxTime.minutes}m {task.maxTime.seconds}sec
                      
                    </span>
                  </div>
                )}
                 {(task.minDuration || task.maxDuration) && (
                  <div>
                    <span className="text-gray-600">Maximum Duration: </span>
                    <span className="font-medium">
                     {task.maxTime.hours}h {task.maxTime.minutes}m {task.maxTime.seconds}sec
                    
                    </span>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* Image Information */}
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

          {/* Attached Images */}
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

        {/* Subtasks */}
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
const[companyData,setCompanyData]=useState();
  useEffect(()=>{
    const userData=localStorage.getItem('user');
    const data=JSON.parse(userData);
    console.log("asdfddd",data)
    setCompanyData(data);
  },[])
useEffect(() => {
  const fetchSops = async () => {
    try {
      const res = await fetch("/api/task/fetchAll");
      const data = await res.json();
      const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
      setSopData(filtered); // ✅ only set the matched records
      console.log("All SOPs:", data.data); // shows all 9
      console.log("Filtered SOPs:", filtered); // shows only the matching 1
    } catch (err) {
      console.error("Failed to fetch SOPs:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchSops();
}, [companyData]); // ✅ Also ensure to rerun when companyData is ready

//   useEffect(() => {
//     const fetchSops = async () => {
//       try {
//         const res = await fetch("/api/task/fetchAll")
//         const data = await res.json();
//          const filtered = data.data.filter(item => item.companyId === companyData?.companyId);
//         setSopData(data.data)
//         console.log("dd",data.data)
//         console.log(filtered)
//       } catch (err) {
//         console.error("Failed to fetch SOPs:", err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchSops()
//   }, [])

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
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Checklist Workspace</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and track your development processes</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-3 shadow hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading checklists...</p>
        ) : enhancedSopData.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Checklist
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enhancedSopData.map((sop) => (
                    <tr key={sop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}
                          >
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
                        <div className="text-sm text-gray-500">{sop.formattedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
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
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No checklist found</h3>
              <p className="text-gray-600 mb-8 text-lg">Click below to create a new checklist.</p>
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow hover:shadow-md"
              >
                Create New Checklist
              </button>
            </div>
          </div>
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
      {/* Close Button (Top Right) */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      {/* Modal Header */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-8">
        {/* SOP Description */}
        {selectedSop.description && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
            <p className="text-gray-700 whitespace-pre-line">{selectedSop.description}</p>
          </div>
        )}

        {/* Stages */}
        <div className="space-y-6">
          {selectedSop.stages?.map((stage, stageIndex) => (
            <div key={stage._id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Stage Header */}
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

              {/* Tasks */}
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
    </div>
  )
}

export default SOPDashboard