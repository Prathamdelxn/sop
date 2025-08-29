// 'use client'
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Clock, Image, CheckCircle, XCircle } from "lucide-react";

// const TaskPage = () => {
//   const [expandedStages, setExpandedStages] = useState({});
//   const [sidebarExpanded, setSidebarExpanded] = useState(true);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [prototypeData, setPrototypeData] = useState(null);

//   // Generate dummy data based on your schema
//   useEffect(() => {
//     const dummyData = {
//       _id: "prototype_123",
//       name: "Paracetamol Production",
//       companyId: "company_456",
//       departmentName: "Pharmaceutical Manufacturing",
//       documentNo: "DOC-789",
//       effectiveDate: "2023-10-15",
//       version: "1.2",
//       userId: "user_101",
//       status: "Ongoing",
//       rejectionReason: null,
//       reviews: [
//         {
//           reviewerId: "reviewer_201",
//           reviewerName: "Dr. Smith",
//           reviewerRole: "Quality Assurance",
//           status: "Approved",
//           comments: "All procedures look correct",
//           reviewDate: "2023-10-10"
//         }
//       ],
//       approvers: [
//         {
//           approverId: "approver_301",
//           approverName: "Jane Doe",
//           approverRole: "Production Manager",
//           status: "Pending",
//           comments: "",
//           approvalDate: ""
//         }
//       ],
//       stages: [
//         {
//           _id: "stage_1",
//           name: "Preparation",
//           order: 1,
//           tasks: [
//             {
//               _id: "task_1_1",
//               title: "Gather Materials",
//               description: "Collect all raw materials needed for paracetamol production",
//               minDuration: 30,
//               maxDuration: 45,
//               minTime: { hours: 0, minutes: 30, seconds: 0 },
//               maxTime: { hours: 0, minutes: 45, seconds: 0 },
//               attachedImages: [
//                 {
//                   name: "material_list",
//                   description: "List of required materials",
//                   url: "/images/material_list.jpg",
//                   public_id: "img_1",
//                   size: 1024,
//                   isUploading: false
//                 }
//               ],
//               imageTitle: "Materials Setup",
//               imageDescription: "Proper arrangement of materials",
//               imagePublicId: "main_img_1",
//               subtasks: [
//                 {
//                   _id: "subtask_1_1_1",
//                   title: "Check inventory",
//                   description: "Verify all materials are in stock",
//                   minDuration: 10,
//                   maxDuration: 15,
//                   minTime: { hours: 0, minutes: 10, seconds: 0 },
//                   maxTime: { hours: 0, minutes: 15, seconds: 0 },
//                   attachedImages: [],
//                   level: 1,
//                   order: 1
//                 },
//                 {
//                   _id: "subtask_1_1_2",
//                   title: "Quality check",
//                   description: "Inspect material quality",
//                   minDuration: 20,
//                   maxDuration: 30,
//                   minTime: { hours: 0, minutes: 20, seconds: 0 },
//                   maxTime: { hours: 0, minutes: 30, seconds: 0 },
//                   attachedImages: [],
//                   level: 1,
//                   order: 2
//                 }
//               ],
//               level: 0,
//               order: 1
//             },
//             {
//               _id: "task_1_2",
//               title: "Setup Equipment",
//               description: "Prepare and calibrate all manufacturing equipment",
//               minDuration: 45,
//               maxDuration: 60,
//               minTime: { hours: 0, minutes: 45, seconds: 0 },
//               maxTime: { hours: 1, minutes: 0, seconds: 0 },
//               attachedImages: [],
//               subtasks: [],
//               level: 0,
//               order: 2
//             }
//           ]
//         },
//         {
//           _id: "stage_2",
//           name: "Mixing",
//           order: 2,
//           tasks: [
//             {
//               _id: "task_2_1",
//               title: "Measure Ingredients",
//               description: "Precisely measure all chemical components",
//               minDuration: 20,
//               maxDuration: 30,
//               minTime: { hours: 0, minutes: 20, seconds: 0 },
//               maxTime: { hours: 0, minutes: 30, seconds: 0 },
//               attachedImages: [],
//               subtasks: [],
//               level: 0,
//               order: 1
//             }
//           ]
//         },
//         {
//           _id: "stage_3",
//           name: "Processing",
//           order: 3,
//           tasks: [
//             {
//               _id: "task_3_1",
//               title: "Heating Process",
//               description: "Apply controlled heat to mixture",
//               minDuration: 120,
//               maxDuration: 150,
//               minTime: { hours: 2, minutes: 0, seconds: 0 },
//               maxTime: { hours: 2, minutes: 30, seconds: 0 },
//               attachedImages: [],
//               subtasks: [],
//               level: 0,
//               order: 1
//             }
//           ]
//         },
//         {
//           _id: "stage_4",
//           name: "Packaging",
//           order: 4,
//           tasks: [
//             {
//               _id: "task_4_1",
//               title: "Primary Packaging",
//               description: "Package product into primary containers",
//               minDuration: 60,
//               maxDuration: 90,
//               minTime: { hours: 1, minutes: 0, seconds: 0 },
//               maxTime: { hours: 1, minutes: 30, seconds: 0 },
//               attachedImages: [],
//               subtasks: [],
//               level: 0,
//               order: 1
//             }
//           ]
//         }
//       ]
//     };
    
//     setPrototypeData(dummyData);
//     // Expand first stage by default
//     setExpandedStages({ [dummyData.stages[0]._id]: true });
//   }, []);

//   const toggleStage = (stageId) => {
//     setExpandedStages(prev => ({
//       ...prev,
//       [stageId]: !prev[stageId]
//     }));
//   };

//   const toggleSidebar = () => {
//     setSidebarExpanded(!sidebarExpanded);
//   };

//   const handleTaskClick = (stage, task) => {
//     setSelectedTask({ ...task, stageName: stage.name });
//   };

//   const formatDuration = (duration) => {
//     if (!duration) return "N/A";
    
//     const { hours, minutes, seconds } = duration;
//     let parts = [];
    
//     if (hours > 0) parts.push(`${hours}h`);
//     if (minutes > 0) parts.push(`${minutes}m`);
//     if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
//     return parts.join(" ");
//   };

//   if (!prototypeData) {
//     return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="w-full h-full p-2">
//       <div className="h-full w-full rounded-b-2xl border border-gray-300 overflow-hidden relative">
//         {/* Header */}
//         <div className="h-[7%] w-full flex items-center border-b border-gray-300 justify-between px-4">
//           {/* Title + Status */}
//           <div className="gap-4 flex items-center">
//             <h1 className="text-lg font-semibold">{prototypeData.name}</h1>
//             <span className="py-1 px-2 bg-blue-400 text-white flex items-center justify-center text-sm capitalize rounded-2xl">
//               {prototypeData.status}
//             </span>
//           </div>

//           {/* Language Dropdown */}
//           <div className="flex items-center gap-2">
//             <label htmlFor="language" className="text-sm font-medium">
//               Language:
//             </label>
//             <select
//               id="language"
//               className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="en">English</option>
//               <option value="hi">Hindi</option>
//               <option value="mr">Marathi</option>
//               <option value="fr">French</option>
//               <option value="es">Spanish</option>
//             </select>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="h-[93%] w-full flex">
//           {/* Left Sidebar - Stages and Tasks */}
//           <div className={`h-full ${sidebarExpanded ? 'w-1/4' : 'w-16'} border-r border-gray-300 transition-all duration-300 overflow-hidden relative`}>
//             <div className="p-4 h-full overflow-y-auto">
//               {sidebarExpanded ? (
//                 <>
//                   <h2 className="font-bold text-lg mb-4">Production Stages</h2>
//                   <div className="space-y-2">
//                     {prototypeData.stages.map(stage => (
//                       <div key={stage._id} className="rounded-md overflow-hidden">
//                         <div 
//                           className="flex gap-4 items-center p-3 bg-gray-100 cursor-pointer"
//                           onClick={() => toggleStage(stage._id)}
//                         >
//                           {expandedStages[stage._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//                           <span className="font-medium">{stage.name}</span>
//                         </div>
//                         {expandedStages[stage._id] && (
//                           <div className="bg-white p-2">
//                             {stage.tasks.map((task, taskIndex) => {
//                               const taskId = `${stage.order}.${taskIndex + 1}`;
//                               return (
//                                 <div 
//                                   key={task._id} 
//                                   className={`p-2 text-sm border-b last:border-b-0 hover:bg-blue-50 cursor-pointer ${selectedTask?._id === task._id ? 'bg-blue-100' : ''}`}
//                                   onClick={() => handleTaskClick(stage, task)}
//                                 >
//                                   {taskId}: {task.title}
//                                 </div>
//                               )
//                             })}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center pt-4">
//                   {prototypeData.stages.map(stage => (
//                     <div key={stage._id} className="mb-4 flex flex-col items-center">
//                       <div 
//                         className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1 cursor-pointer"
//                         onClick={() => toggleStage(stage._id)}
//                         title={stage.name}
//                       >
//                         {stage.order}
//                       </div>
//                       {expandedStages[stage._id] && (
//                         <div className="mt-2 bg-white rounded-md p-2 shadow-md">
//                           {stage.tasks.map((task, taskIndex) => {
//                             const taskId = `${stage.order}.${taskIndex + 1}`;
//                             return (
//                               <div 
//                                 key={task._id} 
//                                 className="p-1 text-xs text-center hover:bg-blue-50 cursor-pointer mb-1 last:mb-0"
//                                 onClick={() => handleTaskClick(stage, task)}
//                               >
//                                 {taskId}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div 
//               className="absolute bottom-4 left-4 bg-gray-200 p-1 rounded-md cursor-pointer"
//               onClick={toggleSidebar}
//             >
//               {sidebarExpanded ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="h-full w-3/4 flex flex-col">
//             <div className="h-11/12 w-full bg-gray-50 p-4 overflow-y-auto">
//               {selectedTask ? (
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-800">{prototypeData.stages.findIndex(s => s.name === selectedTask.stageName) + 1}.{selectedTask.order} {selectedTask.title}</h2>
//                       <p className="text-gray-600 mt-1">{selectedTask.stageName}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                        Start Execution
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="mb-6">
//                     <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
//                     <p className="text-gray-700">{selectedTask.description}</p>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4 mb-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
//                         <Clock size={16} /> Minimum Duration
//                       </h4>
//                       <p className="text-lg font-semibold">{formatDuration(selectedTask.minTime)}</p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
//                         <Clock size={16} /> Maximum Duration
//                       </h4>
//                       <p className="text-lg font-semibold">{formatDuration(selectedTask.maxTime)}</p>
//                     </div>
//                   </div>
                  
//                   {selectedTask.attachedImages && selectedTask.attachedImages.length > 0 && (
//                     <div className="mb-6">
//                       <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
//                         <Image size={20} /> Attached Images
//                       </h3>
//                       <div className="grid grid-cols-3 gap-4">
//                         {selectedTask.attachedImages.map((image, index) => (
//                           <div key={index} className="border rounded-lg overflow-hidden">
//                             <div className="h-32 bg-gray-200 flex items-center justify-center">
//                               <Image size={32} className="text-gray-400" />
//                             </div>
//                             <div className="p-3">
//                               <p className="text-sm font-medium truncate">{image.name}</p>
//                               <p className="text-xs text-gray-500 truncate">{image.description}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-800 mb-3">Subtasks</h3>
//                       <div className="space-y-3">
//                         {selectedTask.subtasks.map((subtask, index) => (
//                           <div key={subtask._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
//                             <h4 className="font-medium">{subtask.title}</h4>
//                             <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
//                             <div className="flex gap-4 mt-2">
//                               <div className="text-xs">
//                                 <span className="text-gray-500">Min: </span>
//                                 {formatDuration(subtask.minTime)}
//                               </div>
//                               <div className="text-xs">
//                                 <span className="text-gray-500">Max: </span>
//                                 {formatDuration(subtask.maxTime)}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
//                   <div className="text-center">
//                     <Image size={48} className="mx-auto mb-4" />
//                     <h3 className="text-lg font-medium mb-2">No Task Selected</h3>
//                     <p>Select a task from the sidebar to view its details</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="h-1/12 w-full border-t border-gray-300 flex justify-between items-center px-4">
//               <span className='h-full w-24 border-r border-gray-300 flex items-center justify-center text-gray-800 cursor-pointer'>
//                 <ArrowLeft className="text-gray-500" />
//               </span>
//               <span className="text-sm font-medium">Complete task</span>
//               <span className='h-full w-24 border-l border-gray-300 flex items-center justify-center text-gray-800 cursor-pointer'>
//                 <ArrowRight className="text-gray-500" />
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskPage;

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

  const handleStartTimer = () => {
    setTaskTimer({
      isRunning: true,
      startTime: Date.now() - (taskTimer.elapsedTime * 1000),
      elapsedTime: taskTimer.elapsedTime
    });
  };

  const handleStopTimer = () => {
    setTaskTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const handleSubmitTask = () => {
    // Here you would typically submit the task completion along with the time taken
    alert(`Task completed in ${formatSeconds(taskTimer.elapsedTime)}`);
    setTaskTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0
    });
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
                        taskTimer.elapsedTime === 0 ? (
                          <button 
                            onClick={handleStartTimer}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Start
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={handleStartTimer}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                            >
                              Resume
                            </button>
                            <button 
                              onClick={handleSubmitTask}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Submit
                            </button>
                          </div>
                        )
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
      </div>
    </div>
  );
};

export default TaskPage;