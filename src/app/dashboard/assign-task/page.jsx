// // "use client";
// // import React, { useState,useEffect } from 'react';

// // const AssignmentsPage = () => {
// //   // Dummy data for assignments
// //   const dummyAssignments = [
// //     {
// //       _id: '1',
// //       generatedId: 'EQ-001',
// //       equipment: {
// //         name: 'Microscope X200',
// //         barcode: 'MBX200-001',
// //         status: 'pending' // 'pending', 'assigned'
// //       },
// //       prototypeData: {
// //         name: 'Cell Analysis',
// //         stages: [
// //           {
// //             _id: 's1',
// //             name: 'Preparation',
// //             assignedWorker: null,
// //             tasks: [
// //               { _id: 't1', title: 'Clean slides' },
// //               { _id: 't2', title: 'Prepare samples' }
// //             ]
// //           },
// //           {
// //             _id: 's2',
// //             name: 'Analysis',
// //             assignedWorker: null,
// //             tasks: [
// //               { _id: 't3', title: 'Focus microscope' },
// //               { _id: 't4', title: 'Record observations' }
// //             ]
// //           }
// //         ]
// //       }
// //     }
// //   ];

// //   // Dummy data for workers
// //   const dummyWorkers = [
// //     { _id: 'w1', name: 'John Doe', email: 'john@example.com' },
// //     { _id: 'w2', name: 'Jane Smith', email: 'jane@example.com' },
// //     { _id: 'w3', name: 'Mike Johnson', email: 'mike@example.com' }
// //   ];
// // const [companyData,setCompanyData]=useState();
// //   // State management
// //   const [assignments, setAssignments] = useState(dummyAssignments);
// //   const [showAssignmentModal, setShowAssignmentModal] = useState(false);
// //   const [selectedAssignment, setSelectedAssignment] = useState(null);
// //   const [stageAssignments, setStageAssignments] = useState([]);
// //   const [currentStageIndex, setCurrentStageIndex] = useState(0);
// //   const [selectedWorker, setSelectedWorker] = useState('');
// // useEffect(()=>{
// //     const userData=localStorage.getItem('user');
// //     const user=JSON.parse(userData);
// //     setCompanyData(user);
// //     console.log("Asd",user);

// // },[])
// // useEffect(()=>{
// // const fetchData=async()=>{
// //   const res= await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
// //   const dd=await res.json();
// //   console.log("ddddd",dd);
// //   setAssignments(dd);
// // }
// // fetchData();
// // },[companyData])
// //   // Handle assign button click
// //   const handleAssignClick = (assignment) => {
// //     setSelectedAssignment(assignment);
// //     // Initialize stage assignments with empty worker selections
// //     const initialStageAssignments = assignment.prototypeData.stages.map(stage => ({
// //       stageId: stage._id,
// //       stageName: stage.name,
// //       workerId: null,
// //       workerName: null
// //     }));
// //     setStageAssignments(initialStageAssignments);
// //     setShowAssignmentModal(true);
// //     setCurrentStageIndex(0);
// //     setSelectedWorker('');
// //   };

// //   // Handle worker selection for current stage
// //   const handleWorkerSelect = (workerId) => {
// //     const worker = dummyWorkers.find(w => w._id === workerId);
// //     const updatedStageAssignments = [...stageAssignments];
// //     updatedStageAssignments[currentStageIndex] = {
// //       ...updatedStageAssignments[currentStageIndex],
// //       workerId: worker._id,
// //       workerName: worker.name
// //     };
// //     setStageAssignments(updatedStageAssignments);
// //     setSelectedWorker(workerId);
// //   };

// //   // Move to next stage or submit if all stages are assigned
// //   const handleNextOrSubmit = () => {
// //     if (currentStageIndex < stageAssignments.length - 1) {
// //       // Move to next stage
// //       setCurrentStageIndex(currentStageIndex + 1);
// //       setSelectedWorker(stageAssignments[currentStageIndex + 1]?.workerId || '');
// //     } else {
// //       // Submit all assignments
// //       submitAssignments();
// //     }
// //   };

// //   // Move to previous stage
// //   const handlePrevious = () => {
// //     if (currentStageIndex > 0) {
// //       setCurrentStageIndex(currentStageIndex - 1);
// //       setSelectedWorker(stageAssignments[currentStageIndex - 1]?.workerId || '');
// //     }
// //   };

// //   // Submit all stage assignments
// //   const submitAssignments = () => {
// //     const updatedAssignments = assignments.map(assignment => {
// //       if (assignment._id === selectedAssignment._id) {
// //         const updatedStages = assignment.prototypeData.stages.map(stage => {
// //           const stageAssignment = stageAssignments.find(sa => sa.stageId === stage._id);
// //           return {
// //             ...stage,
// //             assignedWorker: stageAssignment ? {
// //               _id: stageAssignment.workerId,
// //               name: stageAssignment.workerName
// //             } : null
// //           };
// //         });

// //         return {
// //           ...assignment,
// //           status: 'assigned'
// //           ,
// //           prototypeData: {
// //             ...assignment.prototypeData,
// //             stages: updatedStages
// //           }
// //         };
// //       }
// //       return assignment;
// //     });
// // console.log(updatedAssignments);
// //     setAssignments(updatedAssignments);
// //     setShowAssignmentModal(false);
// //     alert('All stages have been assigned successfully!');
// //   };

// //   // Get current stage being assigned
// //   const getCurrentStage = () => {
// //     return selectedAssignment?.prototypeData?.stages[currentStageIndex];
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold mb-6">Equipment Assignments</h1>
      
// //       {/* Assignments Table */}
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full bg-white">
// //           <thead>
// //             <tr className="bg-gray-100">
// //               <th className="py-2 px-4 border">Equipment</th>
// //               <th className="py-2 px-4 border">Prototype</th>
// //               <th className="py-2 px-4 border">Generated Id</th>
// //               <th className="py-2 px-4 border">Status</th>
// //               <th className="py-2 px-4 border">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {assignments.map((assignment) => (
// //               <tr key={assignment._id} className="hover:bg-gray-50">
// //                 <td className="py-2 px-4 border">{assignment.equipment.name}</td>
// //                 <td className="py-2 px-4 border">{assignment.prototypeData.name}</td>
// //                 <td className="py-2 px-4 border">{assignment.generatedId}</td>
// //                 <td className="py-2 px-4 border">
// //                   <span className={`px-2 py-1 rounded-full text-xs ${
// //                     assignment.status === 'assigned' 
// //                       ? 'bg-green-100 text-green-800' 
// //                       : 'bg-yellow-100 text-yellow-800'
// //                   }`}>
// //                     {assignment.status}
// //                   </span>
// //                 </td>
// //                 <td className="py-2 px-4 border">
// //                   {assignment.status === 'pending' && (
// //                     <button
// //                       onClick={() => handleAssignClick(assignment)}
// //                       className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
// //                     >
// //                       Assign
// //                     </button>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
      
// //       {/* Assignment Modal */}
// //       {showAssignmentModal && selectedAssignment && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
// //           <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-xl font-bold">
// //                 Assigning Workers for {selectedAssignment.prototypeData.name}
// //               </h2>
// //               <button 
// //                 onClick={() => setShowAssignmentModal(false)} 
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 &times;
// //               </button>
// //             </div>
            
// //             {/* Progress indicator */}
// //             <div className="mb-6">
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-sm font-medium">
// //                   Stage {currentStageIndex + 1} of {stageAssignments.length}
// //                 </span>
// //                 <span className="text-sm font-medium">
// //                   {((currentStageIndex + 1) / stageAssignments.length * 100).toFixed(0)}% Complete
// //                 </span>
// //               </div>
// //               <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                 <div 
// //                   className="bg-blue-600 h-2.5 rounded-full" 
// //                   style={{ width: `${((currentStageIndex + 1) / stageAssignments.length) * 100}%` }}
// //                 ></div>
// //               </div>
// //             </div>
            
// //             {/* Current stage info */}
// //             <div className="mb-6 p-4 border rounded-lg bg-gray-50">
// //               <h3 className="text-lg font-medium mb-2">
// //                 {getCurrentStage()?.name}
// //               </h3>
// //               <div className="mb-4">
// //                 <h4 className="font-medium mb-1">Tasks:</h4>
// //                 <ul className="list-disc pl-5">
// //                   {getCurrentStage()?.tasks.map(task => (
// //                     <li key={task._id} className="text-sm text-gray-600">
// //                       {task.title}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
              
// //               {/* Worker selection */}
// //               <div className="mb-4">
// //                 <label className="block text-gray-700 mb-2">
// //                   Select Worker for this stage:
// //                 </label>
// //                 <select
// //                   value={selectedWorker}
// //                   onChange={(e) => handleWorkerSelect(e.target.value)}
// //                   className="w-full border rounded py-2 px-3"
// //                 >
// //                   <option value="">-- Select a worker --</option>
// //                   {dummyWorkers.map((worker) => (
// //                     <option key={worker._id} value={worker._id}>
// //                       {worker.name} ({worker.email})
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
              
// //               {/* Navigation buttons */}
// //               <div className="flex justify-between">
// //                 <button
// //                   onClick={handlePrevious}
// //                   disabled={currentStageIndex === 0}
// //                   className={`py-2 px-4 rounded ${
// //                     currentStageIndex === 0
// //                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                       : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
// //                   }`}
// //                 >
// //                   Previous
// //                 </button>
                
// //                 <button
// //                   onClick={handleNextOrSubmit}
// //                   disabled={!selectedWorker}
// //                   className={`py-2 px-4 rounded ${
// //                     !selectedWorker
// //                       ? 'bg-blue-300 text-white cursor-not-allowed'
// //                       : 'bg-blue-500 hover:bg-blue-700 text-white'
// //                   }`}
// //                 >
// //                   {currentStageIndex < stageAssignments.length - 1 ? 'Next Stage' : 'Submit All Assignments'}
// //                 </button>
// //               </div>
// //             </div>
            
// //             {/* Assignment summary */}
// //             <div className="mt-6">
// //               <h3 className="font-medium mb-2">Assignment Summary:</h3>
// //               <div className="border rounded-lg overflow-hidden">
// //                 <table className="min-w-full">
// //                   <thead className="bg-gray-100">
// //                     <tr>
// //                       <th className="py-2 px-4 text-left">Stage</th>
// //                       <th className="py-2 px-4 text-left">Assigned Worker</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {stageAssignments.map((assignment, index) => (
// //                       <tr 
// //                         key={assignment.stageId} 
// //                         className={`${index === currentStageIndex ? 'bg-blue-50' : 'bg-white'} border-t`}
// //                       >
// //                         <td className="py-2 px-4">{assignment.stageName}</td>
// //                         <td className="py-2 px-4">
// //                           {assignment.workerName || 'Not assigned yet'}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AssignmentsPage;


// "use client";
// import React, { useState, useEffect } from 'react';

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
//             assignedWorker: null,
//             tasks: [
//               { _id: 't1', title: 'Clean slides' },
//               { _id: 't2', title: 'Prepare samples' }
//             ]
//           },
//           {
//             _id: 's2',
//             name: 'Analysis',
//             assignedWorker: null,
//             tasks: [
//               { _id: 't3', title: 'Focus microscope' },
//               { _id: 't4', title: 'Record observations' }
//             ]
//           }
//         ]
//       }
//     }
//   ];

//   // Dummy data for workers
//   const dummyWorkers = [
//     { _id: 'w1', name: 'John Doe', email: 'john@example.com' },
//     { _id: 'w2', name: 'Jane Smith', email: 'jane@example.com' },
//     { _id: 'w3', name: 'Mike Johnson', email: 'mike@example.com' }
//   ];

//   const [companyData, setCompanyData] = useState();
//   const [assignments, setAssignments] = useState(dummyAssignments);
//   const [showAssignmentModal, setShowAssignmentModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [stageAssignments, setStageAssignments] = useState([]);
//   const [currentStageIndex, setCurrentStageIndex] = useState(0);
//   const [selectedWorker, setSelectedWorker] = useState('');

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const user = JSON.parse(userData);
//     setCompanyData(user);
//     console.log("Asd", user);
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
//       const dd = await res.json();
//       console.log("ddddd", dd);
//       setAssignments(dd);
//     }
//     fetchData();
//   }, [companyData])

//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     const initialStageAssignments = assignment.prototypeData.stages.map(stage => ({
//       stageId: stage._id,
//       stageName: stage.name,
//       workerId: null,
//       workerName: null
//     }));
//     setStageAssignments(initialStageAssignments);
//     setShowAssignmentModal(true);
//     setCurrentStageIndex(0);
//     setSelectedWorker('');
//   };

//   const handleWorkerSelect = (workerId) => {
//     const worker = dummyWorkers.find(w => w._id === workerId);
//     const updatedStageAssignments = [...stageAssignments];
//     updatedStageAssignments[currentStageIndex] = {
//       ...updatedStageAssignments[currentStageIndex],
//       workerId: worker._id,
//       workerName: worker.name
//     };
//     setStageAssignments(updatedStageAssignments);
//     setSelectedWorker(workerId);
//   };

//   const handleNextOrSubmit = () => {
//     if (currentStageIndex < stageAssignments.length - 1) {
//       setCurrentStageIndex(currentStageIndex + 1);
//       setSelectedWorker(stageAssignments[currentStageIndex + 1]?.workerId || '');
//     } else {
//       submitAssignments();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStageIndex > 0) {
//       setCurrentStageIndex(currentStageIndex - 1);
//       setSelectedWorker(stageAssignments[currentStageIndex - 1]?.workerId || '');
//     }
//   };

//   const submitAssignments = () => {
//     const updatedAssignments = assignments.map(assignment => {
//       if (assignment._id === selectedAssignment._id) {
//         const updatedStages = assignment.prototypeData.stages.map(stage => {
//           const stageAssignment = stageAssignments.find(sa => sa.stageId === stage._id);
//           return {
//             ...stage,
//             assignedWorker: stageAssignment ? {
//               _id: stageAssignment.workerId,
//               name: stageAssignment.workerName
//             } : null
//           };
//         });

//         return {
//           ...assignment,
//           status: 'assigned',
//           prototypeData: {
//             ...assignment.prototypeData,
//             stages: updatedStages
//           }
//         };
//       }
//       return assignment;
//     });

//     console.log(updatedAssignments);
//     setAssignments(updatedAssignments);
//     setShowAssignmentModal(false);
//     alert('All stages have been assigned successfully!');
//   };

//   const getCurrentStage = () => {
//     return selectedAssignment?.prototypeData?.stages[currentStageIndex];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto px-6 py-12">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
//             Equipment Assignments
//           </h1>
//           <p className="text-slate-600 text-lg">Manage and assign equipment to workers efficiently</p>
//         </div>

//         {/* Assignments Card */}
//         <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
//                   <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Equipment</th>
//                   <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Prototype</th>
//                   <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Generated ID</th>
//                   <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
//                   <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {assignments.map((assignment, index) => (
//                   <tr 
//                     key={assignment._id} 
//                     className="hover:bg-white/80 transition-colors duration-200"
//                   >
//                     <td className="py-6 px-8">
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-900">{assignment.equipment.name}</span>
                        
//                       </div>
//                     </td>
//                     <td className="py-6 px-8">
//                       <span className="font-medium text-slate-800">{assignment.prototypeData.name}</span>
//                     </td>
//                     <td className="py-6 px-8">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
//                         {assignment.generatedId}
//                       </span>
//                     </td>
//                     <td className="py-6 px-8">
//                       <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
//                         assignment.status === 'assigned' 
//                           ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
//                           : 'bg-amber-100 text-amber-800 border border-amber-200'
//                       }`}>
//                         {assignment.status === 'assigned' ? '✓ Assigned' : '⏳ Pending'}
//                       </span>
//                     </td>
//                     <td className="py-6 px-8">
//                       {assignment.status === 'pending' && (
//                         <button
//                           onClick={() => handleAssignClick(assignment)}
//                           className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                         >
//                           <span className="mr-2">👤</span>
//                           Assign Workers
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Assignment Modal */}
//         {showAssignmentModal && selectedAssignment && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Backdrop with blur */}
//             <div 
//               className="absolute inset-0 backdrop-blur-md bg-white/30"
//               onClick={() => setShowAssignmentModal(false)}
//             ></div>
            
//             {/* Modal */}
//             <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-2xl font-bold mb-1">
//                       Worker Assignment
//                     </h2>
//                     <p className="text-slate-300">
//                       {selectedAssignment.prototypeData.name} • {selectedAssignment.equipment.name}
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => setShowAssignmentModal(false)} 
//                     className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl font-bold transition-colors duration-200"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
//                 {/* Progress Section */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-lg font-semibold text-slate-800">
//                       Stage {currentStageIndex + 1} of {stageAssignments.length}
//                     </span>
//                     <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
//                       {((currentStageIndex + 1) / stageAssignments.length * 100).toFixed(0)}% Complete
//                     </span>
//                   </div>
//                   <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
//                     <div 
//                       className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300" 
//                       style={{ width: `${((currentStageIndex + 1) / stageAssignments.length) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Current Stage Card */}
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
//                   <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
//                     <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
//                       {currentStageIndex + 1}
//                     </span>
//                     {getCurrentStage()?.name}
//                   </h3>
                  
//                   <div className="mb-6">
//                     <h4 className="font-semibold text-slate-700 mb-3">Tasks to be completed:</h4>
//                     <div className="grid gap-2">
//                       {getCurrentStage()?.tasks.map(task => (
//                         <div key={task._id} className="flex items-center bg-white/80 rounded-lg p-3 border border-blue-100">
//                           <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
//                             ✓
//                           </span>
//                           <span className="text-slate-700">{task.title}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Worker Selection */}
//                   <div className="mb-6">
//                     <label className="block text-slate-800 font-semibold mb-3">
//                       Select Worker for this stage:
//                     </label>
//                     <select
//                       value={selectedWorker}
//                       onChange={(e) => handleWorkerSelect(e.target.value)}
//                       className="w-full border-2 border-slate-200 rounded-xl py-4 px-4 text-slate-800 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors duration-200"
//                     >
//                       <option value="">-- Select a worker --</option>
//                       {dummyWorkers.map((worker) => (
//                         <option key={worker._id} value={worker._id}>
//                           {worker.name} ({worker.email})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Navigation Buttons */}
//                   <div className="flex justify-between">
//                     <button
//                       onClick={handlePrevious}
//                       disabled={currentStageIndex === 0}
//                       className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                         currentStageIndex === 0
//                           ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                           : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-md'
//                       }`}
//                     >
//                       ← Previous Stage
//                     </button>
                    
//                     <button
//                       onClick={handleNextOrSubmit}
//                       disabled={!selectedWorker}
//                       className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                         !selectedWorker
//                           ? 'bg-blue-300 text-white cursor-not-allowed'
//                           : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
//                       }`}
//                     >
//                       {currentStageIndex < stageAssignments.length - 1 ? 'Next Stage →' : '✓ Complete Assignment'}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Assignment Summary */}
//                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
//                   <h3 className="font-bold text-slate-800 mb-4 text-lg">Assignment Summary</h3>
//                   <div className="overflow-hidden rounded-xl border border-slate-200">
//                     <table className="min-w-full bg-white">
//                       <thead className="bg-slate-100">
//                         <tr>
//                           <th className="py-4 px-6 text-left font-semibold text-slate-700">Stage</th>
//                           <th className="py-4 px-6 text-left font-semibold text-slate-700">Assigned Worker</th>
//                           <th className="py-4 px-6 text-left font-semibold text-slate-700">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {stageAssignments.map((assignment, index) => (
//                           <tr 
//                             key={assignment.stageId} 
//                             className={`${index === currentStageIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`}
//                           >
//                             <td className="py-4 px-6 font-medium text-slate-800">
//                               {assignment.stageName}
//                             </td>
//                             <td className="py-4 px-6 text-slate-600">
//                               {assignment.workerName || (
//                                 <span className="text-slate-400 italic">Not assigned yet</span>
//                               )}
//                             </td>
//                             <td className="py-4 px-6">
//                               {index === currentStageIndex ? (
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
//                                   In Progress
//                                 </span>
//                               ) : assignment.workerName ? (
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
//                                   ✓ Assigned
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
//                                   Pending
//                                 </span>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignmentsPage;


"use client";
import React, { useState, useEffect } from 'react';

const AssignmentsPage = () => {
  // Dummy data for assignments
  const dummyAssignments = [
    {
      _id: '1',
      generatedId: 'EQ-001',
      equipment: {
        name: 'Microscope X200',
        barcode: 'MBX200-001',
        status: 'pending'
      },
      prototypeData: {
        name: 'Cell Analysis',
        stages: [
          {
            _id: 's1',
            name: 'Preparation',
            assignedWorker: null,
            tasks: [
              { _id: 't1', title: 'Clean slides' },
              { _id: 't2', title: 'Prepare samples' }
            ]
          },
          {
            _id: 's2',
            name: 'Analysis',
            assignedWorker: null,
            tasks: [
              { _id: 't3', title: 'Focus microscope' },
              { _id: 't4', title: 'Record observations' }
            ]
          }
        ]
      }
    }
  ];

  // Dummy data for workers
  const dummyWorkers = [
    { _id: 'w1', name: 'John Doe', email: 'john@example.com' },
    { _id: 'w2', name: 'Jane Smith', email: 'jane@example.com' },
    { _id: 'w3', name: 'Mike Johnson', email: 'mike@example.com' }
  ];

  const [companyData, setCompanyData] = useState();
  const [assignments, setAssignments] = useState(dummyAssignments);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [stageAssignments, setStageAssignments] = useState([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    setCompanyData(user);
    console.log("Asd", user);
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
      const dd = await res.json();
      console.log("ddddd", dd);
      setAssignments(dd);
    }
    fetchData();
  }, [companyData])

  const handleAssignClick = (assignment) => {
    setSelectedAssignment(assignment);
    const initialStageAssignments = assignment.prototypeData.stages.map(stage => ({
      stageId: stage._id,
      stageName: stage.name,
      workerId: null,
      workerName: null
    }));
    setStageAssignments(initialStageAssignments);
    setShowAssignmentModal(true);
    setCurrentStageIndex(0);
    setSelectedWorker('');
  };

  const handleWorkerSelect = (workerId) => {
    const worker = dummyWorkers.find(w => w._id === workerId);
    const updatedStageAssignments = [...stageAssignments];
    updatedStageAssignments[currentStageIndex] = {
      ...updatedStageAssignments[currentStageIndex],
      workerId: worker._id,
      workerName: worker.name
    };
    setStageAssignments(updatedStageAssignments);
    setSelectedWorker(workerId);
  };

  const handleNextOrSubmit = () => {
    if (currentStageIndex < stageAssignments.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setSelectedWorker(stageAssignments[currentStageIndex + 1]?.workerId || '');
    } else {
      submitAssignments();
    }
  };

  const handlePrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
      setSelectedWorker(stageAssignments[currentStageIndex - 1]?.workerId || '');
    }
  };

  const submitAssignments = () => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment._id === selectedAssignment._id) {
        const updatedStages = assignment.prototypeData.stages.map(stage => {
          const stageAssignment = stageAssignments.find(sa => sa.stageId === stage._id);
          return {
            ...stage,
            assignedWorker: stageAssignment ? {
              _id: stageAssignment.workerId,
              name: stageAssignment.workerName
            } : null
          };
        });

        return {
          ...assignment,
          status: 'assigned',
          prototypeData: {
            ...assignment.prototypeData,
            stages: updatedStages
          }
        };
      }
      return assignment;
    });

    console.log(updatedAssignments);
    setAssignments(updatedAssignments);
    setShowAssignmentModal(false);
    alert('All stages have been assigned successfully!');
  };

  const getCurrentStage = () => {
    return selectedAssignment?.prototypeData?.stages[currentStageIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Equipment Assignments
          </h1>
          <p className="text-slate-600 text-lg">Manage and assign equipment to workers efficiently</p>
        </div>

        {/* Assignments Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                  <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Equipment</th>
                  <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Prototype</th>
                  <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Generated ID</th>
                  <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="py-6 px-8 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((assignment, index) => (
                  <tr 
                    key={assignment._id} 
                    className="hover:bg-white/80 transition-colors duration-200"
                  >
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{assignment.equipment.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="font-medium text-slate-800">{assignment.prototypeData.name}</span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                        {assignment.generatedId}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        assignment.status === 'assigned' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {assignment.status === 'assigned' ? '✓ Assigned' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => handleAssignClick(assignment)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <span className="mr-2">👤</span>
                          Assign Workers
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
              className="absolute inset-0 backdrop-blur-md bg-white/30"
              onClick={() => setShowAssignmentModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      Worker Assignment
                    </h2>
                    <p className="text-slate-300 text-sm">
                      {selectedAssignment.prototypeData.name} • {selectedAssignment.equipment.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowAssignmentModal(false)} 
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-lg font-bold transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-slate-800">
                      Stage {currentStageIndex + 1} of {stageAssignments.length}
                    </span>
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {((currentStageIndex + 1) / stageAssignments.length * 100).toFixed(0)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${((currentStageIndex + 1) / stageAssignments.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Stage Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                    <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {currentStageIndex + 1}
                    </span>
                    {getCurrentStage()?.name}
                  </h3>
                  
                  <div className="mb-5">
                    <h4 className="font-semibold text-slate-700 mb-2">Tasks to be completed:</h4>
                    <div className="grid gap-2">
                      {getCurrentStage()?.tasks.map(task => (
                        <div key={task._id} className="flex items-center bg-white/80 rounded-lg p-2.5 border border-blue-100">
                          <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                            ✓
                          </span>
                          <span className="text-slate-700 text-sm">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Worker Selection */}
                  <div className="mb-5">
                    <label className="block text-slate-800 font-semibold mb-2">
                      Select Worker for this stage:
                    </label>
                    <select
                      value={selectedWorker}
                      onChange={(e) => handleWorkerSelect(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl py-3 px-4 text-slate-800 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors duration-200"
                    >
                      <option value="">-- Select a worker --</option>
                      {dummyWorkers.map((worker) => (
                        <option key={worker._id} value={worker._id}>
                          {worker.name} ({worker.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStageIndex === 0}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm ${
                        currentStageIndex === 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-md'
                      }`}
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={handleNextOrSubmit}
                      disabled={!selectedWorker}
                      className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm ${
                        !selectedWorker
                          ? 'bg-blue-300 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {currentStageIndex < stageAssignments.length - 1 ? 'Next →' : '✓ Complete'}
                    </button>
                  </div>
                </div>

                {/* Assignment Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-3 text-base">Assignment Summary</h3>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="min-w-full bg-white text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Stage</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Worker</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {stageAssignments.map((assignment, index) => (
                          <tr 
                            key={assignment.stageId} 
                            className={`${index === currentStageIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`}
                          >
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {assignment.stageName}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {assignment.workerName || (
                                <span className="text-slate-400 italic">Not assigned</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {index === currentStageIndex ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                  In Progress
                                </span>
                              ) : assignment.workerName ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  ✓ Assigned
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;