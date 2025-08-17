// "use client";
// import React, { useState, useEffect } from 'react';
// import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp, FiEye, FiCheck } from 'react-icons/fi';
// import { ClipboardList, ChevronRight, X } from 'lucide-react';



// const AssignmentsPage = () => {
//   // Dummy data for assignments
//   const dummyAssignments = [
//     {
//       _id: '1',
//       generatedId: 'EQ-001',
//       equipment: {
//         name: 'Microscope X200',
//         barcode: 'MBX200-001',
//         status: 'pending'
//       },
//       prototypeData: {
//         name: 'Cell Analysis',
//         stages: [
//           {
//             _id: 's1',
//             name: 'Preparation',
//             tasks: [
//               { _id: 't1', title: 'Clean slides', assignedWorker: null },
//               { _id: 't2', title: 'Prepare samples', assignedWorker: null }
//             ]
//           },
//           {
//             _id: 's2',
//             name: 'Analysis',
//             tasks: [
//               { _id: 't3', title: 'Focus microscope', assignedWorker: null },
//               { _id: 't4', title: 'Record observations', assignedWorker: null }
//             ]
//           }
//         ]
//       }
//     }
//   ];

//   // Dummy data for workers
//   const [dummyWorkers,SetWorkers] = useState( [

//   ]);

//   const [companyData, setCompanyData] = useState();
//   const [assignments, setAssignments] = useState(dummyAssignments);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [showTaskAssignmentPage, setShowTaskAssignmentPage] = useState(false);
//   const [viewAssignmentDetails, setViewAssignmentDetails] = useState(null);
// const[roles,setRole]=useState([]);
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const user = JSON.parse(userData);
//     setCompanyData(user);
//   }, []);

// const fetchWorker=async()=>{
//   const respon= await fetch(`/api/task-execution/${companyData?.companyId}`);
//   const dataresp= await respon.json();
//   console.log("worker data :",dataresp);
//   SetWorkers(dataresp.users);
//   setRole(dataresp.matchingRoles)

// }

//   useEffect(() => {
//     const fetchData = async () => {
//       if (companyData?.companyId) {
//         const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
//         const dd = await res.json();
//        const approvedAssignments = dd.filter(item => item.status === 'approved');
// console.log(approvedAssignments);
//       setAssignments(approvedAssignments);
//       }
//     };
//     fetchData();
//     fetchWorker();
//   }, [companyData]);

//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowTaskAssignmentPage(true);
//   };

//   const handleViewDetails = (assignment) => {
//     setViewAssignmentDetails(assignment);
//   };

//   const TaskAssignmentPageModal = () => {
//     const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, stageIndex) => ({
//       id: stage._id,
//       name: `Stage ${stageIndex + 1}: ${stage.name}`,
//       tasks: stage.tasks.map((task, taskIndex) => ({
//         id: task._id,
//         title: task.title,
//         number: `${stageIndex + 1}.${taskIndex + 1}`,
//         assignedWorker: task.assignedWorker,
//         selected: false
//       })),
//       expanded: true
//     })) || [];

//     const teamMembers = dummyWorkers.map(worker => ({
//       id: worker._id,
//       code: worker._id,
//       name: worker.name,
//       role: 'Operator',
//       selected: false
//     }));

//     const [stages, setStages] = useState(initialStages);
//     const [selectAll, setSelectAll] = useState(false);
//     const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [members, setMembers] = useState(teamMembers);
//     const [sendNotification, setSendNotification] = useState(true);
//     const [activeRoleFilter, setActiveRoleFilter] = useState('All');

//     const toggleStageExpansion = (stageId) => {
//       setStages(stages.map(stage => 
//         stage.id === stageId ? { ...stage, expanded: !stage.expanded } : stage
//       ));
//     };

//     const toggleSelectAll = () => {
//       const newSelectAll = !selectAll;
//       setSelectAll(newSelectAll);

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           selected: task.assignedWorker ? false : newSelectAll
//         }))
//       })));
//     };

//     const toggleStage = (stageId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           const allSelected = stage.tasks.every(task => task.selected || task.assignedWorker);
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => ({
//               ...task,
//               selected: task.assignedWorker ? false : !allSelected
//             }))
//           };
//         }
//         return stage;
//       }));
//     };

//     const toggleTaskSelection = (stageId, taskId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => 
//               task.id === taskId && !task.assignedWorker
//                 ? { ...task, selected: !task.selected }
//                 : task
//             )
//           };
//         }
//         return stage;
//       }));
//     };





//     const isStageSelected = (stage) => {
//       return stage.tasks.every(task => task.selected || task.assignedWorker);
//     };

//     const hasSelectedTasks = stages.some(stage => 
//       stage.tasks.some(task => task.selected && !task.assignedWorker)
//     );

//     const selectedTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.filter(task => task.selected && !task.assignedWorker).length, 0);

//     const assignedTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.filter(task => task.assignedWorker).length, 0);

//     const totalTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.length, 0);

//     const uniqueRoles = ['All', ...new Set(roles)];

//     const confirmAssignment = () => {
//       const selectedMembers = members.filter(member => member.selected);

//       if (selectedTasksCount === 0 || selectedMembers.length === 0) {
//         alert(selectedTasksCount === 0 ? 'No tasks selected for assignment' : 'No team members selected');
//         return;
//       }

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           assignedWorker: task.selected ? selectedMembers[0]?.name : task.assignedWorker,
//           selected: false
//         }))
//       })));

//       alert(`Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${selectedMembers[0]?.name || 'worker'}!`);

//       setSelectAll(false);
//       setMembers(teamMembers.map(m => ({ ...m, selected: false })));
//       setShowAssignmentPopup(false);
//     };

//     const finalizeAssignment = () => {
//       const allAssigned = stages.every(stage => 
//         stage.tasks.every(task => task.assignedWorker)
//       );

//       if (!allAssigned) {
//         alert('Please assign all tasks before completing');
//         return;
//       }

//       const updatedAssignments = assignments.map(assignment => 
//         assignment._id === selectedAssignment._id
//           ? { 
//               ...assignment, 
//               status: 'assigned',
//               prototypeData: {
//                 ...assignment.prototypeData,
//                 stages: stages.map(stage => ({
//                   ...stage,
//                   tasks: stage.tasks.map(task => ({
//                     ...task,
//                     assignedWorker: task.assignedWorker
//                   }))
//                 }))
//               }
//             }
//           : assignment
//       );

//       setAssignments(updatedAssignments);
//       alert('Assignment finalized successfully!');
//       setShowTaskAssignmentPage(false);
//     };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         {/* Main Modal Container */}
//         <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b flex items-center justify-between bg-gray-50">
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={() => setShowTaskAssignmentPage(false)}
//                 className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
//               >
//                 <FiArrowLeft className="mr-2" />
//                 Back
//               </button>
//               <div className="flex items-center">
//                 <ClipboardList className="h-6 w-6 text-indigo-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Assign Tasks for {selectedAssignment?.equipment?.name}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={toggleSelectAll}
//                   className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span className="ml-2 text-gray-700">Select All</span>
//               </label>
//               <button
//                 onClick={() => setShowAssignmentPopup(true)}
//                 disabled={!hasSelectedTasks}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   hasSelectedTasks
//                     ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Progress indicator */}
//             <div className="mb-6 bg-gray-100 p-3 rounded-lg">
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium text-gray-700">
//                   Assigned: {assignedTasksCount}/{totalTasksCount} tasks
//                 </span>
//                 <span className="text-sm font-medium text-gray-700">
//                   {Math.round((assignedTasksCount / totalTasksCount) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full" 
//                   style={{ width: `${(assignedTasksCount / totalTasksCount) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Stages List */}
//             <div className="divide-y divide-gray-200">
//               {stages.map((stage) => (
//                 <div key={stage.id} className={`p-4 hover:bg-gray-50 transition-colors rounded-xl ${
//                   isStageSelected(stage) ? 'bg-blue-50' : ''
//                 }`}>
//                   {/* Stage Header */}
//                   <div 
//                     className="flex items-center justify-between mb-3 cursor-pointer" 
//                     onClick={() => toggleStageExpansion(stage.id)}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={isStageSelected(stage)}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           toggleStage(stage.id);
//                         }}
//                         className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <h3 className={`ml-3 font-medium ${
//                         isStageSelected(stage) ? 'text-blue-800' : 'text-gray-800'
//                       }`}>
//                         {stage.name}
//                       </h3>
//                     </div>
//                     {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>

//                   {/* Tasks List */}
//                   {stage.expanded && (
//                     <div className="ml-7 space-y-3">
//                       {stage.tasks.map((task) => (
//                         <div 
//                           key={task.id} 
//                           className={`flex items-center justify-between p-3 rounded-lg transition-all ${
//                             task.assignedWorker ? 'bg-blue-50 border border-blue-200' : 
//                             task.selected ? 'bg-blue-50 border border-blue-100' : 
//                             'bg-gray-50 border border-gray-100 hover:bg-white'
//                           }`}
//                         >
//                           <label className="flex items-center flex-grow cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={task.selected || !!task.assignedWorker}
//                               onChange={() => toggleTaskSelection(stage.id, task.id)}
//                               className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                               disabled={!!task.assignedWorker}
//                             />
//                             <span className={`ml-3 ${
//                               task.assignedWorker ? 'text-blue-800' : 
//                               task.selected ? 'text-blue-800' : 'text-gray-700'
//                             }`}>
//                               <span className="font-medium">Task {task.number}:</span> {task.title}
//                             </span>
//                           </label>

//                           {task.assignedWorker ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               {task.assignedWorker}
//                             </span>
//                           ) : task.selected ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               Selected
//                             </span>
//                           ) : null}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer with action buttons */}
//           <div className="p-4 border-t bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 {assignedTasksCount} of {totalTasksCount} tasks assigned
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowTaskAssignmentPage(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={finalizeAssignment}
//                   disabled={assignedTasksCount !== totalTasksCount}
//                   className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition-colors ${
//                     assignedTasksCount === totalTasksCount
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Complete Assignment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Assignment Popup */}
//         {showAssignmentPopup && (
//           <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
//               {/* Popup Header */}
//               <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//                 <h2 className="text-lg font-semibold text-gray-800">Assign Tasks to Team Members</h2>
//                 <button 
//                   onClick={() => setShowAssignmentPopup(false)}
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               {/* Popup Content */}
//               <div className="p-4 overflow-y-auto flex-grow">
//                 {/* Role Filters */}
//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {uniqueRoles.map(role => (
//                       <button
//                         key={role}
//                         onClick={() => setActiveRoleFilter(role === 'All' ? 'All' : role)}
//                         className={`px-3 py-1 text-sm rounded-full transition-all ${
//                           activeRoleFilter === role || 
//                           (role !== 'All' && activeRoleFilter.includes(role))
//                             ? 'bg-indigo-600 text-white shadow-md'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         {role}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="relative mb-4">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search team members..."
//                     className="pl-10 w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>

//                 {/* Team Members List */}
//                 <div className="space-y-3">
//                   {dummyWorkers.length > 0 ? (
//                     <>
//                     <div className="space-y-2">
//                           {dummyWorkers.map((member,index) => (
//                             <div 
//                               key={index}
//                               className={`p-3 border rounded-xl cursor-pointer transition-all ${
//                                 member.selected 
//                                   ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
//                                   : 'border-gray-200 hover:bg-gray-50'
//                               }`}

//                             >
//                               <div className="flex justify-between items-center">
//                                 <div>
//                                   <p className="font-medium text-gray-800">{member.name}</p>
//                                   <p className="text-xs text-gray-500">{member.role} </p>
//                                 </div>
//                                 <input
//                                   type="checkbox"
//                                   checked={member.selected}

//                                   className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                                   onClick={(e) => e.stopPropagation()}
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                     </>
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">No team members found</p>
//                   )}
//                 </div>
//               </div>

//               {/* Popup Footer */}
//               <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="checkbox"
//                     id="send-notification"
//                     checked={sendNotification}
//                     onChange={() => setSendNotification(!sendNotification)}
//                     className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                   />
//                   <label htmlFor="send-notification" className="ml-2 text-sm text-gray-700">
//                     Send notification to selected members
//                   </label>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={() => setShowAssignmentPopup(false)}
//                     className="px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmAssignment}
//                     disabled={members.filter(m => m.selected).length === 0}
//                     className={`px-4 py-2 text-sm rounded-xl transition-all ${
//                       members.filter(m => m.selected).length === 0
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
//                     }`}
//                   >
//                     Assign Tasks
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

// const AssignmentDetailsModal = () => {
//   if (!viewAssignmentDetails) return null;

//   const stages = viewAssignmentDetails.prototypeData.stages || [];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
//           <button 
//             onClick={() => setViewAssignmentDetails(null)}
//             className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all group"
//           >
//             <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//             <span className="font-medium">Back</span>
//           </button>

//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <ClipboardList className="h-6 w-6 text-indigo-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Assignment Details
//             </h2>
//           </div>

//           <div className="w-24"></div> {/* Spacer */}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
//           {/* Equipment Info Card */}
//           <div className="bg-gradient-to-br from-white to-indigo-50 border border-gray-100 rounded-xl p-6 shadow-sm">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-indigo-600 mb-1">Equipment</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                   {viewAssignmentDetails.equipment.name}
//                 </h3>
//                 <div className="mt-4">
//                   <h4 className="font-semibold text-gray-700 mb-1">
//                     {viewAssignmentDetails.prototypeData.name}
//                   </h4>
//                   <p className="text-sm text-gray-500">Checklist</p>
//                 </div>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
//                 <img 
//                   src={viewAssignmentDetails.equipment.barcode} 
//                   alt="Barcode" 
//                   className="h-14 w-auto"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Stages Section */}
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-gray-800">Stages</h3>
//               <span className="text-sm font-medium text-gray-500">
//                 {stages.length} stages total
//               </span>
//             </div>

//             <div className="space-y-5">
//               {stages.map((stage, stageIndex) => (
//                 <div 
//                   key={stage._id} 
//                   className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
//                 >
//                   <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center">
//                     <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
//                       <span className="text-indigo-700 font-bold">{stageIndex + 1}</span>
//                     </div>
//                     <h4 className="text-lg font-semibold text-gray-800">
//                       {stage.name}
//                     </h4>
//                   </div>

//                   <ul className="divide-y divide-gray-100">
//                     {stage.tasks.map((task, taskIndex) => (
//                       <li key={task._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex items-start">
//                             <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mr-3 mt-0.5">
//                               {taskIndex + 1}
//                             </span>
//                             <div>
//                               <p className="text-sm font-medium text-gray-700">{task.title}</p>
//                               <p className="text-xs text-gray-500 mt-1">Task {stageIndex + 1}.{taskIndex + 1}</p>
//                             </div>
//                           </div>
//                           {task.assignedWorker && (
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
//                               {task.assignedWorker}
//                             </span>
//                           )}
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-5 border-t border-gray-100 bg-white">
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => setViewAssignmentDetails(null)}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => setViewAssignmentDetails(null)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Complete Assignment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


//   return (
//     <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${
//       showTaskAssignmentPage || viewAssignmentDetails ? 'overflow-hidden' : ''
//     }`}>
//       {/* Blur overlay */}
//       {(showTaskAssignmentPage || viewAssignmentDetails) && (
//         <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm z-40"></div>
//       )}

//       {/* Main content */}
//       <div className={`relative ${(showTaskAssignmentPage || viewAssignmentDetails) ? 'z-30' : 'z-0'}`}>
//         <div className="px-4 sm:px-6 py-8 md:py-12">
//           {/* Header */}
//           <div className="mb-6 md:mb-8">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
//               Equipment Assignments
//             </h1>
//             <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
//           </div>

//           {/* Assignments Card */}
//           <div className="bg-white rounded-xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
//                     <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Equipment</th>
//                     <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Prototype</th>
//                     <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Generated ID</th>
//                     <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//                     <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {assignments.map((assignment) => (
//                     <tr 
//                       key={assignment._id} 
//                       className="hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                         <div className="flex flex-col">
//                           <span className="font-semibold text-gray-900 text-sm sm:text-base">{assignment.equipment.name}</span>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                         <span className="font-medium text-gray-800 text-sm sm:text-base">{assignment.prototypeData.name}</span>
//                       </td>
//                       <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                         <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
//                           {assignment.generatedId}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                         <span className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
//                           assignment.status === 'completed' 
//                             ? 'bg-green-100 text-green-800 border border-green-200' :
//                             assignment.status === 'assigned' 
//                             ? 'bg-blue-100 text-blue-800 border border-blue-200' 
//                             : 'bg-amber-100 text-amber-800 border border-amber-200'
//                         }`}>
//                           {assignment.status === 'completed' ? '✓ Completed' : 
//                            assignment.status === 'approved' ? '⏳ Unassigned' : ' ✓ Assigned'}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleViewDetails(assignment)}
//                             className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm"
//                           >
//                             <FiEye className="mr-1 sm:mr-2" />
//                             <span className="hidden sm:inline">View</span>
//                           </button>
//                           {assignment.status !== 'completed' && (
//                             <button
//                               onClick={() => handleAssignClick(assignment)}
//                               className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
//                             >
//                               <span className="mr-1 sm:mr-2">👤</span>
//                               <span className="hidden sm:inline">Assign</span>
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
//         </div>
//       </div>

//       {/* Modals */}
//       {showTaskAssignmentPage && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <TaskAssignmentPageModal />
//         </div>
//       )}

//       {viewAssignmentDetails && (
//         <AssignmentDetailsModal />
//       )}
//     </div>
//   );
// };

// export default AssignmentsPage;



// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
// import { ClipboardList } from 'lucide-react';

// const AssignmentsPage = () => {
//   // State management
//   const [companyData, setCompanyData] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [showTaskAssignmentPage, setShowTaskAssignmentPage] = useState(false);
//   const [viewAssignmentDetails, setViewAssignmentDetails] = useState(null);
//   const [loading, setLoading] = useState({
//     assignments: true,
//     workers: true
//   });
//   const [error, setError] = useState({
//     assignments: null,
//     workers: null
//   });

//   // Fetch user data from localStorage
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         setCompanyData(user);
//       } catch (err) {
//         console.error("Failed to parse user data:", err);
//       }
//     }
//   }, []);

//   // Fetch workers data
//   const fetchWorkers = useCallback(async () => {
//     if (!companyData?.companyId) return;

//     setLoading(prev => ({ ...prev, workers: true }));
//     setError(prev => ({ ...prev, workers: null }));

//     try {
//       const response = await fetch(`/api/task-execution/${companyData.companyId}`);
//       if (!response.ok) throw new Error('Failed to fetch workers');

//       const data = await response.json();
//       setWorkers(data.users || []);
//       setRoles(data.matchingRoles || []);
//     } catch (err) {
//       console.error("Error fetching workers:", err);
//       setError(prev => ({ ...prev, workers: err.message }));
//     } finally {
//       setLoading(prev => ({ ...prev, workers: false }));
//     }
//   }, [companyData]);

//   // Fetch assignments data
//   const fetchAssignments = useCallback(async () => {
//     if (!companyData?.companyId) return;

//     setLoading(prev => ({ ...prev, assignments: true }));
//     setError(prev => ({ ...prev, assignments: null }));

//     try {
//       const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`);
//       if (!res.ok) throw new Error('Failed to fetch assignments');

//       const data = await res.json();
//       const approvedAssignments = data.filter(item => item.status === 'approved');
//       console.log("correctdata",approvedAssignments);
//       setAssignments(approvedAssignments);
//     } catch (err) {
//       console.error("Error fetching assignments:", err);
//       setError(prev => ({ ...prev, assignments: err.message }));
//     } finally {
//       setLoading(prev => ({ ...prev, assignments: false }));
//     }
//   }, [companyData]);

//   // Fetch data when companyId is available
//   useEffect(() => {
//     if (companyData?.companyId) {
//       fetchAssignments();
//       fetchWorkers();
//     }
//   }, [companyData, fetchAssignments, fetchWorkers]);

//   // Handlers
//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowTaskAssignmentPage(true);
//   };

//   const handleViewDetails = (assignment) => {
//     setViewAssignmentDetails(assignment);
//   };

//   // Task Assignment Modal Component
//   const TaskAssignmentPageModal = () => {
//     // Initialize stages data
//     const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, stageIndex) => ({
//       id: stage._id,
//       name: `Stage ${stageIndex + 1}: ${stage.name}`,
//       tasks: stage.tasks.map((task, taskIndex) => ({
//         id: task._id,
//         title: task.title,
//         number: `${stageIndex + 1}.${taskIndex + 1}`,
//         assignedWorker: task.assignedWorker,
//         selected: false
//       })),
//       expanded: true
//     })) || [];

//     // Initialize team members data
//     const teamMembers = workers.map(worker => ({
//       id: worker._id,
//       code: worker._id,
//       name: worker.name,
//       role: worker.role || 'Operator',
//       selected: false
//     }));

//     // State for modal
//     const [stages, setStages] = useState(initialStages);
//     const [selectAll, setSelectAll] = useState(false);
//     const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [members, setMembers] = useState(teamMembers);
//     const [sendNotification, setSendNotification] = useState(true);
//     const [activeRoleFilter, setActiveRoleFilter] = useState('All');

//     // Helper functions
//     const toggleStageExpansion = (stageId) => {
//       setStages(stages.map(stage => 
//         stage.id === stageId ? { ...stage, expanded: !stage.expanded } : stage
//       ));
//     };

//     const toggleSelectAll = () => {
//       const newSelectAll = !selectAll;
//       setSelectAll(newSelectAll);

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           selected: task.assignedWorker ? false : newSelectAll
//         }))
//       })));
//     };

//     const toggleStage = (stageId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           const allSelected = stage.tasks.every(task => task.selected || task.assignedWorker);
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => ({
//               ...task,
//               selected: task.assignedWorker ? false : !allSelected
//             }))
//           };
//         }
//         return stage;
//       }));
//     };

//     const toggleTaskSelection = (stageId, taskId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => 
//               task.id === taskId && !task.assignedWorker
//                 ? { ...task, selected: !task.selected }
//                 : task
//             )
//           };
//         }
//         return stage;
//       }));
//     };

//     const isStageSelected = (stage) => {
//       return stage.tasks.every(task => task.selected || task.assignedWorker);
//     };

//     const hasSelectedTasks = stages.some(stage => 
//       stage.tasks.some(task => task.selected && !task.assignedWorker)
//     );

//     const selectedTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.filter(task => task.selected && !task.assignedWorker).length, 0);

//     const assignedTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.filter(task => task.assignedWorker).length, 0);

//     const totalTasksCount = stages.reduce((count, stage) => 
//       count + stage.tasks.length, 0);

//     const uniqueRoles = ['All', ...new Set(roles)];

//     const filteredMembers = members.filter(member => {
//       const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = activeRoleFilter === 'All' || member.role === activeRoleFilter;
//       return matchesSearch && matchesRole;
//     });

//     // Assignment functions
//     const confirmAssignment = () => {
//       const selectedMembers = members.filter(member => member.selected);

//       if (selectedTasksCount === 0 || selectedMembers.length === 0) {
//         alert(selectedTasksCount === 0 ? 'No tasks selected for assignment' : 'No team members selected');
//         return;
//       }

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           assignedWorker: task.selected ? selectedMembers[0]?.name : task.assignedWorker,
//           selected: false
//         }))
//       })));

//       alert(`Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${selectedMembers[0]?.name || 'worker'}!`);

//       setSelectAll(false);
//       setMembers(teamMembers.map(m => ({ ...m, selected: false })));
//       setShowAssignmentPopup(false);
//     };

// const finalizeAssignment = async () => {
//   const allAssigned = stages.every(stage => 
//     stage.tasks.every(task => task.assignedWorker)
//   );

//   if (!allAssigned) {
//     alert('Please assign all tasks before completing');
//     return;
//   }

//   try {
//     const updatedAssignmentData = {
//       assignmentId: selectedAssignment._id,
//       status: 'assigned',
//       stages: stages.map(stage => ({
//         stageId: stage.id,
//         tasks: stage.tasks.map(task => ({
//           taskId: task.id,
//           assignedWorker: task.assignedWorker
//         }))
//       }))
//     };

//     const response = await fetch('/api/assignment/task-assign-update', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedAssignmentData)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to update assignment');
//     }

//     const result = await response.json();

//     const updatedAssignments = assignments.map(assignment => 
//       assignment._id === result.updatedAssignment._id
//         ? result.updatedAssignment
//         : assignment
//     );

//     setAssignments(updatedAssignments);
//     alert('Assignment updated successfully!');
//     setShowTaskAssignmentPage(false);
//   } catch (error) {
//     console.error('Error updating assignment:', error);
//     alert(`Failed to update assignment: ${error.message}`);
//   }
// };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         {/* Main Modal Container */}
//         <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b flex items-center justify-between bg-gray-50">
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={() => setShowTaskAssignmentPage(false)}
//                 className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
//               >
//                 <FiArrowLeft className="mr-2" />
//                 Back
//               </button>
//               <div className="flex items-center">
//                 <ClipboardList className="h-6 w-6 text-indigo-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Assign Tasks for {selectedAssignment?.equipment?.name}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={toggleSelectAll}
//                   className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span className="ml-2 text-gray-700">Select All</span>
//               </label>
//               <button
//                 onClick={() => setShowAssignmentPopup(true)}
//                 disabled={!hasSelectedTasks}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   hasSelectedTasks
//                     ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Progress indicator */}
//             <div className="mb-6 bg-gray-100 p-3 rounded-lg">
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium text-gray-700">
//                   Assigned: {assignedTasksCount}/{totalTasksCount} tasks
//                 </span>
//                 <span className="text-sm font-medium text-gray-700">
//                   {Math.round((assignedTasksCount / totalTasksCount) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full" 
//                   style={{ width: `${(assignedTasksCount / totalTasksCount) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Stages List */}
//             <div className="divide-y divide-gray-200">
//               {stages.map((stage) => (
//                 <div key={stage.id} className={`p-4 hover:bg-gray-50 transition-colors rounded-xl ${
//                   isStageSelected(stage) ? 'bg-blue-50' : ''
//                 }`}>
//                   {/* Stage Header */}
//                   <div 
//                     className="flex items-center justify-between mb-3 cursor-pointer" 
//                     onClick={() => toggleStageExpansion(stage.id)}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={isStageSelected(stage)}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           toggleStage(stage.id);
//                         }}
//                         className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <h3 className={`ml-3 font-medium ${
//                         isStageSelected(stage) ? 'text-blue-800' : 'text-gray-800'
//                       }`}>
//                         {stage.name}
//                       </h3>
//                     </div>
//                     {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>

//                   {/* Tasks List */}
//                   {stage.expanded && (
//                     <div className="ml-7 space-y-3">
//                       {stage.tasks.map((task) => (
//                         <div 
//                           key={task.id} 
//                           className={`flex items-center justify-between p-3 rounded-lg transition-all ${
//                             task.assignedWorker ? 'bg-blue-50 border border-blue-200' : 
//                             task.selected ? 'bg-blue-50 border border-blue-100' : 
//                             'bg-gray-50 border border-gray-100 hover:bg-white'
//                           }`}
//                         >
//                           <label className="flex items-center flex-grow cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={task.selected || !!task.assignedWorker}
//                               onChange={() => toggleTaskSelection(stage.id, task.id)}
//                               className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                               disabled={!!task.assignedWorker}
//                             />
//                             <span className={`ml-3 ${
//                               task.assignedWorker ? 'text-blue-800' : 
//                               task.selected ? 'text-blue-800' : 'text-gray-700'
//                             }`}>
//                               <span className="font-medium">Task {task.number}:</span> {task.title}
//                             </span>
//                           </label>

//                           {task.assignedWorker ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               {task.assignedWorker}
//                             </span>
//                           ) : task.selected ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               Selected
//                             </span>
//                           ) : null}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer with action buttons */}
//           <div className="p-4 border-t bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 {assignedTasksCount} of {totalTasksCount} tasks assigned
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowTaskAssignmentPage(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={finalizeAssignment}
//                   disabled={assignedTasksCount !== totalTasksCount}
//                   className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition-colors ${
//                     assignedTasksCount === totalTasksCount
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Complete Assignment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Assignment Popup */}
//         {showAssignmentPopup && (
//           <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
//               {/* Popup Header */}
//               <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//                 <h2 className="text-lg font-semibold text-gray-800">Assign Tasks to Team Members</h2>
//                 <button 
//                   onClick={() => setShowAssignmentPopup(false)}
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               {/* Popup Content */}
//               <div className="p-4 overflow-y-auto flex-grow">
//                 {/* Role Filters */}
//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {uniqueRoles.map(role => (
//                       <button
//                         key={role}
//                         onClick={() => setActiveRoleFilter(role)}
//                         className={`px-3 py-1 text-sm rounded-full transition-all ${
//                           activeRoleFilter === role
//                             ? 'bg-indigo-600 text-white shadow-md'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         {role}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="relative mb-4">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search team members..."
//                     className="pl-10 w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>

//                 {/* Team Members List */}
//                 <div className="space-y-3">
//                   {filteredMembers.length > 0 ? (
//                     <div className="space-y-2">
//                       {filteredMembers.map((member) => (
//                         <div 
//                           key={member.id}
//                           onClick={() => {
//                             setMembers(members.map(m => 
//                               m.id === member.id 
//                                 ? { ...m, selected: !m.selected } 
//                                 : { ...m, selected: false }
//                             ));
//                           }}
//                           className={`p-3 border rounded-xl cursor-pointer transition-all ${
//                             member.selected 
//                               ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
//                               : 'border-gray-200 hover:bg-gray-50'
//                           }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <p className="font-medium text-gray-800">{member.name}</p>
//                               <p className="text-xs text-gray-500">{member.role}</p>
//                             </div>
//                             <input
//                               type="checkbox"
//                               checked={member.selected}
//                               readOnly
//                               className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">No team members found</p>
//                   )}
//                 </div>
//               </div>

//               {/* Popup Footer */}
//               <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="checkbox"
//                     id="send-notification"
//                     checked={sendNotification}
//                     onChange={() => setSendNotification(!sendNotification)}
//                     className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                   />
//                   <label htmlFor="send-notification" className="ml-2 text-sm text-gray-700">
//                     Send notification to selected members
//                   </label>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={() => setShowAssignmentPopup(false)}
//                     className="px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmAssignment}
//                     disabled={members.filter(m => m.selected).length === 0}
//                     className={`px-4 py-2 text-sm rounded-xl transition-all ${
//                       members.filter(m => m.selected).length === 0
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
//                     }`}
//                   >
//                     Assign Tasks
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Assignment Details Modal Component
//   const AssignmentDetailsModal = () => {
//     if (!viewAssignmentDetails) return null;

//     const stages = viewAssignmentDetails.prototypeData.stages || [];

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
//         <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
//             <button 
//               onClick={() => setViewAssignmentDetails(null)}
//               className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all group"
//             >
//               <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//               <span className="font-medium">Back</span>
//             </button>

//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <ClipboardList className="h-6 w-6 text-indigo-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Assignment Details
//               </h2>
//             </div>

//             <div className="w-24"></div> {/* Spacer */}
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-8">
//             {/* Equipment Info Card */}
//             <div className="bg-gradient-to-br from-white to-indigo-50 border border-gray-100 rounded-xl p-6 shadow-sm">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-indigo-600 mb-1">Equipment</p>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                     {viewAssignmentDetails.equipment.name}
//                   </h3>
//                   <div className="mt-4">
//                     <h4 className="font-semibold text-gray-700 mb-1">
//                       {viewAssignmentDetails.prototypeData.name}
//                     </h4>
//                     <p className="text-sm text-gray-500">Checklist</p>
//                   </div>
//                 </div>
//                 <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
//                   <div className="h-14 w-auto flex items-center justify-center text-gray-500">
//                     Barcode: {viewAssignmentDetails.equipment.barcode}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stages Section */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold text-gray-800">Stages</h3>
//                 <span className="text-sm font-medium text-gray-500">
//                   {stages.length} stages total
//                 </span>
//               </div>

//               <div className="space-y-5">
//                 {stages.map((stage, stageIndex) => (
//                   <div 
//                     key={stage._id} 
//                     className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
//                   >
//                     <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center">
//                       <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
//                         <span className="text-indigo-700 font-bold">{stageIndex + 1}</span>
//                       </div>
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         {stage.name}
//                       </h4>
//                     </div>

//                     <ul className="divide-y divide-gray-100">
//                       {stage.tasks.map((task, taskIndex) => (
//                         <li key={task._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
//                           <div className="flex justify-between items-start">
//                             <div className="flex items-start">
//                               <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mr-3 mt-0.5">
//                                 {taskIndex + 1}
//                               </span>
//                               <div>
//                                 <p className="text-sm font-medium text-gray-700">{task.title}</p>
//                                 <p className="text-xs text-gray-500 mt-1">Task {stageIndex + 1}.{taskIndex + 1}</p>
//                               </div>
//                             </div>
//                             {task.assignedWorker && (
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
//                                 {task.assignedWorker}
//                               </span>
//                             )}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-5 border-t border-gray-100 bg-white">
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setViewAssignmentDetails(null)}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading and error states
//   if (loading.assignments || loading.workers) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
//           <p className="text-gray-700">Loading assignments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error.assignments || error.workers) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
//           <p className="text-gray-700 mb-4">
//             {error.assignments || error.workers}
//           </p>
//           <button 
//             onClick={() => {
//               if (error.assignments) fetchAssignments();
//               if (error.workers) fetchWorkers();
//             }}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${
//       showTaskAssignmentPage || viewAssignmentDetails ? 'overflow-hidden' : ''
//     }`}>
//       {/* Blur overlay */}
//       {(showTaskAssignmentPage || viewAssignmentDetails) && (
//         <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm z-40"></div>
//       )}

//       {/* Main content */}
//       <div className={`relative ${(showTaskAssignmentPage || viewAssignmentDetails) ? 'z-30' : 'z-0'}`}>
//         <div className="px-4 sm:px-6 py-8 md:py-12">
//           {/* Header */}
//           <div className="mb-6 md:mb-8">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
//               Equipment Assignments
//             </h1>
//             <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
//           </div>

//           {/* Assignments Card */}
//           <div className="bg-white rounded-xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
//             {assignments.length === 0 ? (
//               <div className="p-8 text-center">
//                 <p className="text-gray-500">No assignments available</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
//                       <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Equipment</th>
//                       <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Prototype</th>
//                       <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Generated ID</th>
//                       <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//                       <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {assignments.map((assignment) => (
//                       <tr 
//                         key={assignment._id} 
//                         className="hover:bg-gray-50 transition-colors duration-200"
//                       >
//                         <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                           <div className="flex flex-col">
//                             <span className="font-semibold text-gray-900 text-sm sm:text-base">{assignment.equipment.name}</span>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                           <span className="font-medium text-gray-800 text-sm sm:text-base">{assignment.prototypeData.name}</span>
//                         </td>
//                         <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                           <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
//                             {assignment.generatedId}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                           <span className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
//                             assignment.status === 'completed' 
//                               ? 'bg-green-100 text-green-800 border border-green-200' :
//                               assignment.status === 'assigned' 
//                               ? 'bg-blue-100 text-blue-800 border border-blue-200' 
//                               : 'bg-amber-100 text-amber-800 border border-amber-200'
//                           }`}>
//                             {assignment.status === 'completed' ? '✓ Completed' : 
//                              assignment.status === 'approved' ? '⏳ Unassigned' : ' ✓ Assigned'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewDetails(assignment)}
//                               className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm"
//                             >
//                               <FiEye className="mr-1 sm:mr-2" />
//                               <span className="hidden sm:inline">View</span>
//                             </button>
//                             {assignment.status !== 'completed' && (
//                               <button
//                                 onClick={() => handleAssignClick(assignment)}
//                                 className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
//                               >
//                                 <span className="mr-1 sm:mr-2">👤</span>
//                                 <span className="hidden sm:inline">Assign</span>
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showTaskAssignmentPage && <TaskAssignmentPageModal />}
//       {viewAssignmentDetails && <AssignmentDetailsModal />}
//     </div>
//   );
// };

// export default AssignmentsPage;



// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
// import { ClipboardList } from 'lucide-react';

// const AssignmentsPage = () => {
//   // State management
//   const [companyData, setCompanyData] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [showTaskAssignmentPage, setShowTaskAssignmentPage] = useState(false);
//   const [viewAssignmentDetails, setViewAssignmentDetails] = useState(null);
//   const [loading, setLoading] = useState({
//     assignments: true,
//     workers: true
//   });
//   const [error, setError] = useState({
//     assignments: null,
//     workers: null
//   });
//   const [notification, setNotification] = useState({
//     show: false,
//     type: '', // 'success', 'error', 'info'
//     message: '',
//     title: ''
//   });

//   // Fetch user data from localStorage
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         setCompanyData(user);
//       } catch (err) {
//         console.error("Failed to parse user data:", err);
//         showNotification('error', 'Error', 'Failed to load user data');
//       }
//     }
//   }, []);

//   // Show notification popup
//   const showNotification = (type, title, message) => {
//     setNotification({
//       show: true,
//       type,
//       title,
//       message
//     });

//     // Auto-hide after 5 seconds
//     setTimeout(() => {
//       setNotification(prev => ({ ...prev, show: false }));
//     }, 5000);
//   };

//   // Close notification
//   const closeNotification = () => {
//     setNotification(prev => ({ ...prev, show: false }));
//   };

//   // Fetch workers data
//   const fetchWorkers = useCallback(async () => {
//     if (!companyData?.companyId) return;

//     setLoading(prev => ({ ...prev, workers: true }));
//     setError(prev => ({ ...prev, workers: null }));

//     try {
//       const response = await fetch(`/api/task-execution/${companyData.companyId}`);
//       if (!response.ok) throw new Error('Failed to fetch workers');

//       const data = await response.json();
//       setWorkers(data.users || []);
//       setRoles(data.matchingRoles || []);
//     } catch (err) {
//       console.error("Error fetching workers:", err);
//       setError(prev => ({ ...prev, workers: err.message }));
//       showNotification('error', 'Error', 'Failed to load workers data');
//     } finally {
//       setLoading(prev => ({ ...prev, workers: false }));
//     }
//   }, [companyData]);

//   // Fetch assignments data
//   const fetchAssignments = useCallback(async () => {
//     if (!companyData?.companyId) return;

//     setLoading(prev => ({ ...prev, assignments: true }));
//     setError(prev => ({ ...prev, assignments: null }));

//     try {
//       const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`);
//       if (!res.ok) throw new Error('Failed to fetch assignments');

//       const data = await res.json();
//       const approvedAssignments = data.filter(item => item.status === 'Approved');
//       setAssignments(approvedAssignments);
//     } catch (err) {
//       console.error("Error fetching assignments:", err);
//       setError(prev => ({ ...prev, assignments: err.message }));
//       showNotification('error', 'Error', 'Failed to load assignments');
//     } finally {
//       setLoading(prev => ({ ...prev, assignments: false }));
//     }
//   }, [companyData]);

//   // Fetch data when companyId is available
//   useEffect(() => {
//     if (companyData?.companyId) {
//       fetchAssignments();
//       fetchWorkers();
//     }
//   }, [companyData, fetchAssignments, fetchWorkers]);

//   // Handlers
//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowTaskAssignmentPage(true);
//   };

//   const handleViewDetails = (assignment) => {
//     setViewAssignmentDetails(assignment);
//   };

//   // Notification Popup Component
//   const NotificationPopup = () => {
//     if (!notification.show) return null;

//     const bgColor = {
//       success: 'bg-green-50 border-green-100',
//       error: 'bg-red-50 border-red-100',
//       info: 'bg-blue-50 border-blue-100'
//     };

//     const textColor = {
//       success: 'text-green-800',
//       error: 'text-red-800',
//       info: 'text-blue-800'
//     };

//     const iconColor = {
//       success: 'text-green-500',
//       error: 'text-red-500',
//       info: 'text-blue-500'
//     };

//     return (
//       <div className="fixed top-4 right-4 z-50">
//         <div className={`p-4 rounded-lg border ${bgColor[notification.type]} shadow-lg max-w-sm`}>
//           <div className="flex items-start">
//             <div className={`flex-shrink-0 mt-0.5 ${iconColor[notification.type]}`}>
//               {notification.type === 'success' ? (
//                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : notification.type === 'error' ? (
//                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                 </svg>
//               )}
//             </div>
//             <div className="ml-3">
//               <h3 className={`text-sm font-medium ${textColor[notification.type]}`}>
//                 {notification.title}
//               </h3>
//               <div className={`mt-1 text-sm ${textColor[notification.type]}`}>
//                 <p>{notification.message}</p>
//               </div>
//             </div>
//             <div className="ml-auto pl-3">
//               <div className="-mx-1.5 -my-1.5">
//                 <button
//                   onClick={closeNotification}
//                   className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${notification.type === 'success' ? 'focus:ring-green-500 focus:ring-offset-green-50 hover:bg-green-100' :
//                       notification.type === 'error' ? 'focus:ring-red-500 focus:ring-offset-red-50 hover:bg-red-100' :
//                         'focus:ring-blue-500 focus:ring-offset-blue-50 hover:bg-blue-100'
//                     }`}
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Confirmation Modal Component
//   const ConfirmationModal = ({ show, onClose, onConfirm, title, message, confirmText, cancelText }) => {
//     if (!show) return null;

//     return (
//       <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//         <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>
//             <div className="mb-6">
//               <p className="text-gray-600">{message}</p>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 {cancelText || 'Cancel'}
//               </button>
//               <button
//                 onClick={onConfirm}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 {confirmText || 'Confirm'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Task Assignment Modal Component
//   const TaskAssignmentPageModal = () => {
//     // Initialize stages data
//     const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, stageIndex) => ({
//       id: stage._id,
//       name: `Stage ${stageIndex + 1}: ${stage.name}`,
//       tasks: stage.tasks.map((task, taskIndex) => ({
//         id: task._id,
//         title: task.title,
//         number: `${stageIndex + 1}.${taskIndex + 1}`,
//         assignedWorker: task.assignedWorker,
//         selected: false
//       })),
//       expanded: true
//     })) || [];

//     // Initialize team members data
//     const teamMembers = workers.map(worker => ({
//       id: worker._id,
//       code: worker._id,
//       name: worker.name,
//       role: worker.role || 'Operator',
//       selected: false
//     }));

//     // State for modal
//     const [stages, setStages] = useState(initialStages);
//     const [selectAll, setSelectAll] = useState(false);
//     const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [members, setMembers] = useState(teamMembers);
//     const [sendNotification, setSendNotification] = useState(true);
//     const [activeRoleFilter, setActiveRoleFilter] = useState('All');
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [confirmModalProps, setConfirmModalProps] = useState({});

//     // Helper functions
//     const toggleStageExpansion = (stageId) => {
//       setStages(stages.map(stage =>
//         stage.id === stageId ? { ...stage, expanded: !stage.expanded } : stage
//       ));
//     };

//     const toggleSelectAll = () => {
//       const newSelectAll = !selectAll;
//       setSelectAll(newSelectAll);

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           selected: task.assignedWorker ? false : newSelectAll
//         }))
//       })));
//     };

//     const toggleStage = (stageId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           const allSelected = stage.tasks.every(task => task.selected || task.assignedWorker);
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => ({
//               ...task,
//               selected: task.assignedWorker ? false : !allSelected
//             }))
//           };
//         }
//         return stage;
//       }));
//     };

//     const toggleTaskSelection = (stageId, taskId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task =>
//               task.id === taskId && !task.assignedWorker
//                 ? { ...task, selected: !task.selected }
//                 : task
//             )
//           };
//         }
//         return stage;
//       }));
//     };

//     const isStageSelected = (stage) => {
//       return stage.tasks.every(task => task.selected || task.assignedWorker);
//     };

//     const hasSelectedTasks = stages.some(stage =>
//       stage.tasks.some(task => task.selected && !task.assignedWorker)
//     );

//     const selectedTasksCount = stages.reduce((count, stage) =>
//       count + stage.tasks.filter(task => task.selected && !task.assignedWorker).length, 0);

//     const assignedTasksCount = stages.reduce((count, stage) =>
//       count + stage.tasks.filter(task => task.assignedWorker).length, 0);

//     const totalTasksCount = stages.reduce((count, stage) =>
//       count + stage.tasks.length, 0);

//     const uniqueRoles = ['All', ...new Set(roles)];

//     const filteredMembers = members.filter(member => {
//       const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = activeRoleFilter === 'All' || member.role === activeRoleFilter;
//       return matchesSearch && matchesRole;
//     });

//     // Assignment functions
//     const confirmAssignment = () => {
//       const selectedMembers = members.filter(member => member.selected);
//       console.log("selected member", selectedMembers);

//       if (selectedTasksCount === 0) {
//         setConfirmModalProps({
//           title: 'No Tasks Selected',
//           message: 'Please select at least one task to assign.',
//           show: true,
//           onClose: () => setConfirmModalProps({ show: false }),
//           confirmText: 'OK',
//           hideCancel: true
//         });
//         return;
//       }

//       if (selectedMembers.length === 0) {
//         setConfirmModalProps({
//           title: 'No Team Members Selected',
//           message: 'Please select at least one team member to assign tasks to.',
//           show: true,
//           onClose: () => setConfirmModalProps({ show: false }),
//           confirmText: 'OK',
//           hideCancel: true
//         });
//         return;
//       }

//       setStages(stages.map(stage => ({
//         ...stage,
//         tasks: stage.tasks.map(task => ({
//           ...task,
//           assignedWorker: task.selected ? selectedMembers[0].name : task.assignedWorker,
//           selected: false
//         }))
//       })));

//       console.log(selectedMembers);
//       console.log(stages);
//       showNotification(
//         'success',
//         'Tasks Assigned',
//         `Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${selectedMembers[0]?.name || 'worker'}!`
//       );

//       setSelectAll(false);
//       setMembers(teamMembers.map(m => ({ ...m, selected: false })));
//       setShowAssignmentPopup(false);
//     };

//     const finalizeAssignment = async () => {
//       const allAssigned = stages.every(stage =>
//         stage.tasks.every(task => task.assignedWorker)
//       );

//       if (!allAssigned) {
//         setConfirmModalProps({
//           title: 'Incomplete Assignment',
//           message: 'Please assign all tasks before completing.',
//           show: true,
//           onClose: () => setConfirmModalProps({ show: false }),
//           confirmText: 'OK',
//           hideCancel: true
//         });
//         return;
//       }

//       try {
//         const updatedAssignmentData = {
//           assignmentId: selectedAssignment._id,
//           status: 'assigned',
//           stages: stages.map(stage => ({
//             stageId: stage.id,
//             tasks: stage.tasks.map(task => ({
//               taskId: task.id,
//               assignedWorker: task.assignedWorker
//             }))
//           }))
//         };

//         const response = await fetch('/api/assignment/task-assign-update', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedAssignmentData)
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to update assignment');
//         }

//         const result = await response.json();

//         const updatedAssignments = assignments.map(assignment =>
//           assignment._id === result.updatedAssignment._id
//             ? result.updatedAssignment
//             : assignment
//         );

//         setAssignments(updatedAssignments);
//         showNotification('success', 'Success', 'Assignment updated successfully!');
//         setShowTaskAssignmentPage(false);
//       } catch (error) {
//         console.error('Error updating assignment:', error);
//         showNotification('error', 'Error', `Failed to update assignment: ${error.message}`);
//       }
//     };
//     console.log("d", stages)
//     return (
//       <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
//         {/* Confirmation Modal */}
//         <ConfirmationModal
//           show={confirmModalProps.show}
//           onClose={confirmModalProps.onClose || (() => setShowConfirmModal(false))}
//           onConfirm={confirmModalProps.onConfirm}
//           title={confirmModalProps.title}
//           message={confirmModalProps.message}
//           confirmText={confirmModalProps.confirmText}
//           cancelText={confirmModalProps.cancelText}
//         />

//         {/* Main Modal Container */}
//         <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b flex items-center justify-between bg-gray-50">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setShowTaskAssignmentPage(false)}
//                 className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
//               >
//                 <FiArrowLeft className="mr-2" />
//                 Back
//               </button>
//               <div className="flex items-center">
//                 <ClipboardList className="h-6 w-6 text-indigo-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Assign Tasks for {selectedAssignment?.equipment?.name}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={toggleSelectAll}
//                   className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span className="ml-2 text-gray-700">Select All</span>
//               </label>
//               <button
//                 onClick={() => setShowAssignmentPopup(true)}
//                 disabled={!hasSelectedTasks}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${hasSelectedTasks
//                     ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                   }`}
//               >
//                 Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Progress indicator */}
//             <div className="mb-6 bg-gray-100 p-3 rounded-lg">
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium text-gray-700">
//                   Assigned: {assignedTasksCount}/{totalTasksCount} tasks
//                 </span>
//                 <span className="text-sm font-medium text-gray-700">
//                   {Math.round((assignedTasksCount / totalTasksCount) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full"
//                   style={{ width: `${(assignedTasksCount / totalTasksCount) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Stages List */}
//             <div className="divide-y divide-gray-200">
//               {stages.map((stage) => (
//                 <div key={stage.id} className={`p-4 hover:bg-gray-50 transition-colors rounded-xl ${isStageSelected(stage) ? 'bg-blue-50' : ''
//                   }`}>
//                   {/* Stage Header */}
//                   <div
//                     className="flex items-center justify-between mb-3 cursor-pointer"
//                     onClick={() => toggleStageExpansion(stage.id)}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={isStageSelected(stage)}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           toggleStage(stage.id);
//                         }}
//                         className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <h3 className={`ml-3 font-medium ${isStageSelected(stage) ? 'text-blue-800' : 'text-gray-800'
//                         }`}>
//                         {stage.name}
//                       </h3>
//                     </div>
//                     {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>

//                   {/* Tasks List */}
//                   {stage.expanded && (
//                     <div className="ml-7 space-y-3">
//                       {stage.tasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`flex items-center justify-between p-3 rounded-lg transition-all ${task.assignedWorker ? 'bg-blue-50 border border-blue-200' :
//                               task.selected ? 'bg-blue-50 border border-blue-100' :
//                                 'bg-gray-50 border border-gray-100 hover:bg-white'
//                             }`}
//                         >
//                           <label className="flex items-center flex-grow cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={task.selected || !!task.assignedWorker}
//                               onChange={() => toggleTaskSelection(stage.id, task.id)}
//                               className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                               disabled={!!task.assignedWorker}
//                             />
//                             <span className={`ml-3 ${task.assignedWorker ? 'text-blue-800' :
//                                 task.selected ? 'text-blue-800' : 'text-gray-700'
//                               }`}>
//                               <span className="font-medium">Task {task.number}:</span> {task.title}
//                             </span>
//                           </label>

//                           {task.assignedWorker ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               {task.assignedWorker}
//                             </span>
//                           ) : task.selected ? (
//                             <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               Selected
//                             </span>
//                           ) : null}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer with action buttons */}
//           <div className="p-4 border-t bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 {assignedTasksCount} of {totalTasksCount} tasks assigned
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowTaskAssignmentPage(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={finalizeAssignment}
//                   disabled={assignedTasksCount !== totalTasksCount}
//                   className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition-colors ${assignedTasksCount === totalTasksCount
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-gray-400 cursor-not-allowed'
//                     }`}
//                 >
//                   Complete Assignment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Assignment Popup */}
//         {showAssignmentPopup && (
//           <div className="absolute inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
//               {/* Popup Header */}
//               <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//                 <h2 className="text-lg font-semibold text-gray-800">Assign Tasks to Team Members</h2>
//                 <button
//                   onClick={() => setShowAssignmentPopup(false)}
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               {/* Popup Content */}
//               <div className="p-4 overflow-y-auto flex-grow">
//                 {/* Role Filters */}
//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {uniqueRoles.map(role => (
//                       <button
//                         key={role}
//                         onClick={() => setActiveRoleFilter(role)}
//                         className={`px-3 py-1 text-sm rounded-full transition-all ${activeRoleFilter === role
//                             ? 'bg-indigo-600 text-white shadow-md'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                       >
//                         {role}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="relative mb-4">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search team members..."
//                     className="pl-10 w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>

//                 {/* Team Members List */}
//                 <div className="space-y-3">
//                   {filteredMembers.length > 0 ? (
//                     <div className="space-y-2">
//                       {filteredMembers.map((member) => (
//                         <div
//                           key={member.id}
//                           onClick={() => {
//                             setMembers(members.map(m =>
//                               m.id === member.id
//                                 ? { ...m, selected: !m.selected }
//                                 : { ...m, selected: false }
//                             ));
//                           }}
//                           className={`p-3 border rounded-xl cursor-pointer transition-all ${member.selected
//                               ? 'border-indigo-500 bg-indigo-50 shadow-sm'
//                               : 'border-gray-200 hover:bg-gray-50'
//                             }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <p className="font-medium text-gray-800">{member.name}</p>
//                               <p className="text-xs text-gray-500">{member.role}</p>
//                             </div>
//                             <input
//                               type="checkbox"
//                               checked={member.selected}
//                               readOnly
//                               className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">No team members found</p>
//                   )}
//                 </div>
//               </div>

//               {/* Popup Footer */}
//               <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="checkbox"
//                     id="send-notification"
//                     checked={sendNotification}
//                     onChange={() => setSendNotification(!sendNotification)}
//                     className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                   />
//                   <label htmlFor="send-notification" className="ml-2 text-sm text-gray-700">
//                     Send notification to selected members
//                   </label>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={() => setShowAssignmentPopup(false)}
//                     className="px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmAssignment}
//                     disabled={members.filter(m => m.selected).length === 0}
//                     className={`px-4 py-2 text-sm rounded-xl transition-all ${members.filter(m => m.selected).length === 0
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
//                       }`}
//                   >
//                     Assign Tasks
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Assignment Details Modal Component
//   const AssignmentDetailsModal = () => {
//     if (!viewAssignmentDetails) return null;

//     const stages = viewAssignmentDetails.prototypeData.stages || [];

//     return (
//       <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
//         <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
//             <button
//               onClick={() => setViewAssignmentDetails(null)}
//               className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all group"
//             >
//               <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//               <span className="font-medium">Back</span>
//             </button>

//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <ClipboardList className="h-6 w-6 text-indigo-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Assignment Details
//               </h2>
//             </div>

//             <div className="w-24"></div> {/* Spacer */}
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-8">
//             {/* Equipment Info Card */}
//             <div className="bg-gradient-to-br from-white to-indigo-50 border border-gray-100 rounded-xl p-6 shadow-sm">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-indigo-600 mb-1">Equipment</p>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                     {viewAssignmentDetails.equipment.name}
//                   </h3>
//                   <div className="mt-4">
//                     <h4 className="font-semibold text-gray-700 mb-1">
//                       {viewAssignmentDetails.prototypeData.name}
//                     </h4>
//                     <p className="text-sm text-gray-500">Checklist</p>
//                   </div>
//                 </div>
//                 <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
//                   <div className="h-14 w-auto flex items-center justify-center text-gray-500">
//                     Barcode: {viewAssignmentDetails.equipment.barcode}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stages Section */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold text-gray-800">Stages</h3>
//                 <span className="text-sm font-medium text-gray-500">
//                   {stages.length} stages total
//                 </span>
//               </div>

//               <div className="space-y-5">
//                 {stages.map((stage, stageIndex) => (
//                   <div
//                     key={stage._id}
//                     className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
//                   >
//                     <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center">
//                       <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
//                         <span className="text-indigo-700 font-bold">{stageIndex + 1}</span>
//                       </div>
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         {stage.name}
//                       </h4>
//                     </div>

//                     <ul className="divide-y divide-gray-100">
//                       {stage.tasks.map((task, taskIndex) => (
//                         <li key={task._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
//                           <div className="flex justify-between items-start">
//                             <div className="flex items-start">
//                               <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mr-3 mt-0.5">
//                                 {taskIndex + 1}
//                               </span>
//                               <div>
//                                 <p className="text-sm font-medium text-gray-700">{task.title}</p>
//                                 <p className="text-xs text-gray-500 mt-1">Task {stageIndex + 1}.{taskIndex + 1}</p>
//                               </div>
//                             </div>
//                             {/* {task.assignedWorker && (
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
//                                 {task.assignedWorker}
//                               </span>
//                             )} */}
//                             {task.assignedWorker && (
//                               (() => {
//                                 const assigned = workers.find(w => w._id === task.assignedWorker);
//                                 if (assigned) {
//                                   return (
//                                     <div className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                                       {assigned.name} ({assigned.role})
//                                     </div>
//                                   );
//                                 }
//                                 return null;
//                               })()
//                             )}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-5 border-t border-gray-100 bg-white">
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setViewAssignmentDetails(null)}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading and error states
//   if (loading.assignments || loading.workers) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
//           <p className="text-gray-700">Loading assignments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error.assignments || error.workers) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
//           <p className="text-gray-700 mb-4">
//             {error.assignments || error.workers}
//           </p>
//           <button
//             onClick={() => {
//               if (error.assignments) fetchAssignments();
//               if (error.workers) fetchWorkers();
//             }}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${showTaskAssignmentPage || viewAssignmentDetails ? 'overflow-hidden' : ''
//       }`}>
//       {/* Blur overlay */}
//       {(showTaskAssignmentPage || viewAssignmentDetails) && (
//         <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm z-40"></div>
//       )}

//       {/* Notification Popup */}
//       <NotificationPopup />

//       {/* Main content */}
//       <div className={`relative ${(showTaskAssignmentPage || viewAssignmentDetails) ? 'z-30' : 'z-0'}`}>
//         <div className="px-4 sm:px-6 py-8 md:py-12">
//           {/* Header */}
//           <div className="mb-6 md:mb-8">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
//               Equipment Assignments
//             </h1>
//             <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
//           </div>

//           {/* Assignments Card */}
//           <div className="bg-white rounded-xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
//             {assignments.length === 0 ? (
//               <div className="p-8 text-center">
//                 <p className="text-gray-500">No assignments available</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prototype</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {assignments.map((assignment) => (
//                       <tr
//                         key={assignment._id}
//                         className="hover:bg-gray-50 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                               <span className="text-indigo-600 font-medium">
//                                 {assignment.equipment.name.charAt(0)}
//                               </span>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900 capitalize">{assignment.equipment.name}</div>

//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{assignment.prototypeData.name}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                             {assignment.generatedId}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'completed'
//                               ? 'bg-green-100 text-green-800' :
//                               assignment.status === 'assigned'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-amber-100 text-amber-800'
//                             }`}>
//                             {assignment.status === 'completed' ? 'Completed' :
//                               assignment.status === 'Approved' ? 'Unassigned' : 'Assigned'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewDetails(assignment)}
//                               className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                               <FiEye className="-ml-0.5 mr-2 h-4 w-4" />
//                               View
//                             </button>
//                             {assignment.status !== 'completed' && (
//                               <button
//                                 onClick={() => handleAssignClick(assignment)}
//                                 className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                               >
//                                 Assign
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showTaskAssignmentPage && <TaskAssignmentPageModal />}
//       {viewAssignmentDetails && <AssignmentDetailsModal />}
//     </div>
//   );
// };

// export default AssignmentsPage;



"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import { ClipboardList } from 'lucide-react';

const AssignmentsPage = () => {
  // State management (unchanged from original)
  const [companyData, setCompanyData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showTaskAssignmentPage, setShowTaskAssignmentPage] = useState(false);
  const [viewAssignmentDetails, setViewAssignmentDetails] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState('');

  const [loading, setLoading] = useState({
    assignments: true,
    workers: true,
  });
  const [error, setError] = useState({
    assignments: null,
    workers: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
    title: '',
  });

  // Fetch user data from localStorage (unchanged)
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCompanyData(user);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        showNotification('error', 'Error', 'Failed to load user data');
      }
    }
  }, []);

  // Show notification popup (unchanged)
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Close notification (unchanged)
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Fetch workers data (unchanged)
  const fetchWorkers = useCallback(async () => {
    if (!companyData?.companyId) return;
    setLoading(prev => ({ ...prev, workers: true }));
    setError(prev => ({ ...prev, workers: null }));
    try {
      const response = await fetch(`/api/task-execution/${companyData.companyId}`);
      if (!response.ok) throw new Error('Failed to fetch workers');
      const data = await response.json();
      setWorkers(data.users || []);
      setRoles(data.matchingRoles || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
      setError(prev => ({ ...prev, workers: err.message }));
      showNotification('error', 'Error', 'Failed to load workers data');
    } finally {
      setLoading(prev => ({ ...prev, workers: false }));
    }
  }, [companyData]);

  // Fetch assignments data (unchanged)
  const fetchAssignments = useCallback(async () => {
    if (!companyData?.companyId) return;
    setLoading(prev => ({ ...prev, assignments: true }));
    setError(prev => ({ ...prev, assignments: null }));
    try {
      const res = await fetch(`/api/assignment/fetchbyid/${companyData.companyId}`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      console.log('Fetched assignments:', data);
      const approvedAssignments = data.filter(item => item.status === 'Approved' || item.status === 'assigned');
      setAssignments(approvedAssignments);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(prev => ({ ...prev, assignments: err.message }));
      showNotification('error', 'Error', 'Failed to load assignments');
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }));
    }
  }, [companyData]);

  // Fetch data when companyId is available (unchanged)
  useEffect(() => {
    if (companyData?.companyId) {
      fetchAssignments();
      fetchWorkers();
    }
  }, [companyData, fetchAssignments, fetchWorkers]);

  // Handlers (unchanged)
  const handleAssignClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowTaskAssignmentPage(true);
  };

  const handleViewDetails = (assignment) => {
    setViewAssignmentDetails(assignment);
  };

  // Update selectedAssignment when assignments change (unchanged)
  useEffect(() => {
    if (selectedAssignment && assignments.length > 0) {
      const updatedAssignment = assignments.find(a => a._id === selectedAssignment._id);
      if (updatedAssignment) {
        setSelectedAssignment(updatedAssignment);
      }
    }
  }, [assignments, selectedAssignment]);

  // Notification Popup Component (unchanged)
  const NotificationPopup = () => {
    if (!notification.show) return null;
    const bgColor = {
      success: 'bg-green-50 border-green-100',
      error: 'bg-red-50 border-red-100',
      info: 'bg-blue-50 border-blue-100',
    };
    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800',
    };
    const iconColor = {
      success: 'text-green-500',
      error: 'text-red-500',
      info: 'text-blue-500',
    };
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={`p-4 rounded-lg border ${bgColor[notification.type]} shadow-lg max-w-sm`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 mt-0.5 ${iconColor[notification.type]}`}>
              {notification.type === 'success' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : notification.type === 'error' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${textColor[notification.type]}`}>
                {notification.title}
              </h3>
              <div className={`mt-1 text-sm ${textColor[notification.type]}`}>
                <p>{notification.message}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={closeNotification}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  notification.type === 'success' ? 'focus:ring-green-500 focus:ring-offset-green-50 hover:bg-green-100' :
                  notification.type === 'error' ? 'focus:ring-red-500 focus:ring-offset-red-50 hover:bg-red-100' :
                  'focus:ring-blue-500 focus:ring-offset-blue-50 hover:bg-blue-100'
                }`}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Modal Component (unchanged)
  const ConfirmationModal = ({ show, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!show) return null;
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">{message}</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText || 'Cancel'}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Task Assignment Modal Component (updated)
  const TaskAssignmentPageModal = () => {
    // Initialize stages data
    const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, stageIndex) => ({
      id: stage._id,
      name: `Stage ${stageIndex + 1}: ${stage.name}`,
      tasks: stage.tasks.map((task, taskIndex) => ({
        id: task._id,
        title: task.title,
        number: `${stageIndex + 1}.${taskIndex + 1}`,
        assignedWorker: task.assignedWorker || null,
        selected: false,
      })),
      expanded: true,
    })) || [];

    // Initialize team members data
    const teamMembers = workers.map(worker => ({
      id: worker._id,
      code: worker._id,
      name: worker.name || `Worker ${worker._id.slice(-4)}`,
      role: worker.role || 'Operator',
      selected: false,
    }));

    // State for modal
    const [stages, setStages] = useState(initialStages);
    const [pendingAssignments, setPendingAssignments] = useState({}); // { taskId: { id, name, role } }
    const [selectAll, setSelectAll] = useState(false);
    const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState(teamMembers);
    const [sendNotification, setSendNotification] = useState(true);
    const [activeRoleFilter, setActiveRoleFilter] = useState('All');
    const [confirmModalProps, setConfirmModalProps] = useState({});

    // Log for debugging
    useEffect(() => {
      console.log('Stages:', stages);
      console.log('Pending assignments:', pendingAssignments);
    }, [stages, pendingAssignments]);

    // Reset states when modal opens
    useEffect(() => {
      setStages(initialStages);
      setPendingAssignments({});
      setSelectAll(false);
      setMembers(teamMembers);
      setShowAssignmentPopup(false);
      setSearchTerm('');
      setActiveRoleFilter('All');
      setSendNotification(true);
    }, [selectedAssignment]);

    // Helper functions
    const toggleStageExpansion = (stageId) => {
      setStages(stages.map(stage => 
        stage.id === stageId ? { ...stage, expanded: !stage.expanded } : stage
      ));
    };

    const toggleSelectAll = () => {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      setStages(stages.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(task => ({
          ...task,
          selected: task.assignedWorker || pendingAssignments[task.id] ? false : newSelectAll,
        })),
      })));
    };

    const toggleStage = (stageId) => {
      setStages(stages.map(stage => {
        if (stage.id === stageId) {
          const allSelected = stage.tasks.every(task => task.selected || task.assignedWorker || pendingAssignments[task.id]);
          return {
            ...stage,
            tasks: stage.tasks.map(task => ({
              ...task,
              selected: task.assignedWorker || pendingAssignments[task.id] ? false : !allSelected,
            })),
          };
        }
        return stage;
      }));
    };

    const toggleTaskSelection = (stageId, taskId) => {
      setStages(stages.map(stage => {
        if (stage.id === stageId) {
          return {
            ...stage,
            tasks: stage.tasks.map(task => 
              task.id === taskId && !task.assignedWorker && !pendingAssignments[task.id]
                ? { ...task, selected: !task.selected }
                : task
            ),
          };
        }
        return stage;
      }));
    };

    const isStageSelected = (stage) => {
      return stage.tasks.every(task => task.selected || task.assignedWorker || pendingAssignments[task.id]);
    };

    const hasSelectedTasks = stages.some(stage => 
      stage.tasks.some(task => task.selected && !task.assignedWorker && !pendingAssignments[task.id])
    );

    const selectedTasksCount = stages.reduce((count, stage) => 
      count + stage.tasks.filter(task => task.selected && !task.assignedWorker && !pendingAssignments[task.id]).length, 0);

    const assignedTasksCount = stages.reduce((count, stage) => 
      count + stage.tasks.filter(task => task.assignedWorker || pendingAssignments[task.id]).length, 0);

    const totalTasksCount = stages.reduce((count, stage) => 
      count + stage.tasks.length, 0);

    const uniqueRoles = ['All', ...new Set(roles)];

    const filteredMembers = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = activeRoleFilter === 'All' || member.role === activeRoleFilter;
      return matchesSearch && matchesRole;
    });

    // Assignment functions
    const confirmAssignment = () => {
      const selectedMembers = members.filter(member => member.selected);
      if (selectedTasksCount === 0) {
        setConfirmModalProps({
          title: 'No Tasks Selected',
          message: 'Please select at least one task to assign.',
          show: true,
          onClose: () => setConfirmModalProps({ show: false }),
          confirmText: 'OK',
          cancelText: null,
        });
        return;
      }
      if (selectedMembers.length === 0) {
        setConfirmModalProps({
          title: 'No Team Members Selected',
          message: 'Please select one team member to assign tasks to.',
          show: true,
          onClose: () => setConfirmModalProps({ show: false }),
          confirmText: 'OK',
          cancelText: null,
        });
        return;
      }
      const member = selectedMembers[0];
      const newPendingAssignments = { ...pendingAssignments };
      stages.forEach(stage => {
        stage.tasks.forEach(task => {
          if (task.selected && !task.assignedWorker && !pendingAssignments[task.id]) {
            newPendingAssignments[task.id] = {
              id: member.id,
              name: member.name,
              role: member.role,
            };
            setAssignedWorker(member.name);
          }
        });
      });
      setPendingAssignments(newPendingAssignments);
      showNotification(
        'success',
        'Tasks Assigned',
        `Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${member.name}!`
      );
      setSelectAll(false);
      setStages(stages.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(task => ({
          ...task,
          selected: false,
        })),
      })));
      setMembers(teamMembers.map(m => ({ ...m, selected: false })));
      setShowAssignmentPopup(false);
    };

    const finalizeAssignment = async () => {
      const allAssigned = stages.every(stage => 
        stage.tasks.every(task => task.assignedWorker || pendingAssignments[task.id])
      );
      if (!allAssigned) {
        setConfirmModalProps({
          title: 'Incomplete Assignment',
          message: 'Please assign all tasks before completing.',
          show: true,
          onClose: () => setConfirmModalProps({ show: false }),
          confirmText: 'OK',
          cancelText: null,
        });
        return;
      }
      const updatedStages = stages.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(task => ({
          ...task,
          assignedWorker: task.assignedWorker || pendingAssignments[task.id]?.id || null,
        })),
      }));
      try {
        const updatedAssignmentData = {
          assignmentId: selectedAssignment._id,
          status: 'assigned',
          stages: updatedStages.map(stage => ({
            stageId: stage.id,
            tasks: stage.tasks.map(task => ({
              taskId: task.id,
              assignedWorker: task.assignedWorker,
            })),
          })),
        };
        console.log('Saving assignment:', updatedAssignmentData);
        const response = await fetch('/api/assignment/task-assign-update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAssignmentData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update assignment');
        }
        const result = await response.json();
        console.log('Assignment update response:', result);
        setAssignments(prev => prev.map(assignment => 
          assignment._id === result.updatedAssignment._id
            ? result.updatedAssignment
            : assignment
        ));
        setSelectedAssignment(result.updatedAssignment);
        setStages(updatedStages);
        setPendingAssignments({});
        showNotification('success', 'Success', 'Assignment updated successfully!');
        setShowTaskAssignmentPage(false);
      } catch (error) {
        console.error('Error updating assignment:', error);
        showNotification('error', 'Error', `Failed to update assignment: ${error.message}`);
      }
    };

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <ConfirmationModal 
          show={confirmModalProps.show}
          onClose={confirmModalProps.onClose || (() => setConfirmModalProps({ show: false }))}
          onConfirm={confirmModalProps.onConfirm}
          title={confirmModalProps.title}
          message={confirmModalProps.message}
          confirmText={confirmModalProps.confirmText}
          cancelText={confirmModalProps.cancelText}
        />
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowTaskAssignmentPage(false)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <div className="flex items-center">
                <ClipboardList className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Assign Tasks for {selectedAssignment?.equipment?.name}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">Select All</span>
              </label>
              <button
                onClick={() => setShowAssignmentPopup(true)}
                disabled={!hasSelectedTasks}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  hasSelectedTasks
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 bg-gray-100 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Assigned: {assignedTasksCount}/{totalTasksCount} tasks
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((assignedTasksCount / totalTasksCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(assignedTasksCount / totalTasksCount) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {stages.map((stage) => (
                <div key={stage.id} className={`p-4 hover:bg-gray-50 transition-colors rounded-xl ${
                  isStageSelected(stage) ? 'bg-blue-50' : ''
                }`}>
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer" 
                    onClick={() => toggleStageExpansion(stage.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isStageSelected(stage)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleStage(stage.id);
                        }}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <h3 className={`ml-3 font-medium ${
                        isStageSelected(stage) ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        {stage.name}
                      </h3>
                    </div>
                    {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {stage.expanded && (
                    <div className="ml-7 space-y-3">
                      {stage.tasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            task.assignedWorker || pendingAssignments[task.id] ? 'bg-blue-50 border border-blue-200' : 
                            task.selected ? 'bg-blue-50 border border-blue-100' : 
                            'bg-gray-50 border border-gray-100 hover:bg-white'
                          }`}
                        >
                          <label className="flex items-center flex-grow cursor-pointer">
                            <input
                              type="checkbox"
                              checked={task.selected || !!task.assignedWorker || !!pendingAssignments[task.id]}
                              onChange={() => toggleTaskSelection(stage.id, task.id)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              disabled={!!task.assignedWorker || !!pendingAssignments[task.id]}
                            />
                            <span className={`ml-3 ${
                              task.assignedWorker || pendingAssignments[task.id] ? 'text-blue-800' : 
                              task.selected ? 'text-blue-800' : 'text-gray-700'
                            }`}>
                              <span className="font-medium">Task {task.number}:</span> {task.title}
                            </span>
                            <span className=''>{assignedWorker}</span>
                          </label>
                          {task.assignedWorker ? (
                            (() => {
                              const worker = workers.find(w => w._id === task.assignedWorker);
                              return worker ? (
                                <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium inline-flex items-center">
                                  {/* {worker.name} ({worker.role}) */}
                                  {assignedWorker}
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                                  Worker Not Found
                                </span>
                              );
                            })()
                          ) : pendingAssignments[task.id] ? (
                            <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium inline-flex items-center">
                              {pendingAssignments[task.id].name} ({pendingAssignments[task.id].role})
                            </span>
                          ) : task.selected ? (
                            <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                              Selected
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {assignedTasksCount} of {totalTasksCount} tasks assigned
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTaskAssignmentPage(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={finalizeAssignment}
                  disabled={assignedTasksCount !== totalTasksCount}
                  className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition-colors ${
                    assignedTasksCount === totalTasksCount
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
        {showAssignmentPopup && (
          <div className="absolute inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Assign Tasks to Team Members</h2>
                <button 
                  onClick={() => setShowAssignmentPopup(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => setActiveRoleFilter(role)}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                          activeRoleFilter === role
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="pl-10 w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  {filteredMembers.length > 0 ? (
                    <div className="space-y-2">
                      {filteredMembers.map((member) => (
                        <div 
                          key={member.id}
                          onClick={() => {
                            setMembers(members.map(m => 
                              m.id === member.id 
                                ? { ...m, selected: !m.selected } 
                                : { ...m, selected: false }
                            ));
                          }}
                          className={`p-3 border rounded-xl cursor-pointer transition-all ${
                            member.selected 
                              ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={member.selected}
                              readOnly
                              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No team members found.{' '}
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setActiveRoleFilter('All');
                        }}
                        className="text-indigo-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="send-notification"
                    checked={sendNotification}
                    onChange={() => setSendNotification(!sendNotification)}
                    className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="send-notification" className="ml-2 text-sm text-gray-700">
                    Send notification to selected members
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAssignmentPopup(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAssignment}
                    disabled={members.filter(m => m.selected).length === 0}
                    className={`px-4 py-2 text-sm rounded-xl transition-all ${
                      members.filter(m => m.selected).length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                  >
                    Assign Tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Assignment Details Modal Component
  const AssignmentDetailsModal = () => {
    if (!viewAssignmentDetails) return null;
    const stages = viewAssignmentDetails.prototypeData.stages || [];
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
            <button 
              onClick={() => setViewAssignmentDetails(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Assignment Details
              </h2>
            </div>
            <div className="w-24"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="bg-gradient-to-br from-white to-indigo-50 border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">Equipment</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {viewAssignmentDetails.equipment.name}
                  </h3>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-1">
                      {viewAssignmentDetails.prototypeData.name}
                    </h4>
                    <p className="text-sm text-gray-500">Checklist</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                  <div className="h-14 w-auto flex items-center justify-center text-gray-500">
                    Barcode: {viewAssignmentDetails.equipment.barcode}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Stages</h3>
                <span className="text-sm font-medium text-gray-500">
                  {stages.length} stages total
                </span>
              </div>
              <div className="space-y-5">
                {stages.map((stage, stageIndex) => (
                  <div 
                    key={stage._id} 
                    className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
                  >
                    <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-700 font-bold">{stageIndex + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {stage.name}
                      </h4>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {stage.tasks.map((task, taskIndex) => (
                        <li key={task._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mr-3 mt-0.5">
                                {taskIndex + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-700">{task.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Task {stageIndex + 1}.{taskIndex + 1}</p>
                              </div>
                            </div>
                            {task.assignedWorker && (() => {
                              const worker = workers.find(w => w._id === task.assignedWorker);
                              return worker ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                  {worker.name} ({worker.role})
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                  Worker Not Found
                                </span>
                              );
                            })()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setViewAssignmentDetails(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error states
  if (loading.assignments || loading.workers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error.assignments || error.workers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-700 mb-4">
            {error.assignments || error.workers}
          </p>
          <button 
            onClick={() => {
              if (error.assignments) fetchAssignments();
              if (error.workers) fetchWorkers();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${
      showTaskAssignmentPage || viewAssignmentDetails ? 'overflow-hidden' : ''
    }`}>
      {(showTaskAssignmentPage || viewAssignmentDetails) && (
        <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm z-40"></div>
      )}
      <NotificationPopup />
      <div className={`relative ${(showTaskAssignmentPage || viewAssignmentDetails) ? 'z-30' : 'z-0'}`}>
        <div className="px-4 sm:px-6 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
              Equipment Assignments
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
          </div>
          <div className="bg-white rounded-xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            {assignments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No assignments available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prototype</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr 
                        key={assignment._id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {assignment.equipment.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 capitalize">{assignment.equipment.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.prototypeData.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {assignment.generatedId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' :
                              assignment.status === 'assigned' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {assignment.status === 'completed' ? 'Completed' : 
                             assignment.status === 'Approved' ? 'Unassigned' : 'Assigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(assignment)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiEye className="-ml-0.5 mr-2 h-4 w-4" />
                              View
                            </button>
                            {assignment.status !== 'completed' && (
                              <button
                                onClick={() => handleAssignClick(assignment)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Assign
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
      </div>
      {showTaskAssignmentPage && <TaskAssignmentPageModal />}
      {viewAssignmentDetails && <AssignmentDetailsModal />}
    </div>
  );
};

export default AssignmentsPage;
