// "use client";
// import React, { useState, useEffect } from 'react';
// import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { ClipboardList, User, ChevronRight, X } from 'lucide-react';
 
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
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false);
 
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const user = JSON.parse(userData);
//     setCompanyData(user);
//   }, []);
 
//   useEffect(() => {
//     const fetchData = async () => {
//       if (companyData?.companyId) {
//         const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
//         const dd = await res.json();
//         setAssignments(dd);
//       }
//     };
//     fetchData();
//   }, [companyData]);
 
//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//     setShowTaskAssignmentModal(true);
//   };
 
//   const TaskAssignmentModal = () => {
//     const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, index) => ({
//       id: `stage${index + 1}`,
//       name: `Stage ${index + 1}: ${stage.name}`,
//       tasks: stage.tasks.map((task, taskIndex) => ({
//         id: `task${index + 1}-${taskIndex + 1}`,
//         title: task.title,
//         selected: false,
//         assigned: !!stage.assignedWorker
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
//           selected: task.assigned ? false : newSelectAll
//         }))
//       })));
//     };
 
//     const toggleStage = (stageId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           const allSelected = stage.tasks.every(task => task.selected || task.assigned);
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task => ({
//               ...task,
//               selected: task.assigned ? false : !allSelected
//             }))
//           };
//         }
//         return stage;
//       }));
//     };
 
//     const toggleTask = (stageId, taskId) => {
//       setStages(stages.map(stage => {
//         if (stage.id === stageId) {
//           return {
//             ...stage,
//             tasks: stage.tasks.map(task =>
//               task.id === taskId && !task.assigned
//                 ? { ...task, selected: !task.selected }
//                 : task
//             )
//           };
//         }
//         return stage;
//       }));
//     };
 
//     const toggleMemberSelection = (memberId) => {
//       setMembers(members.map(member =>
//         member.id === memberId ? { ...member, selected: !member.selected } : member
//       ));
//     };
 
//     const filteredMembers = members.filter(member => {
//       const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           member.id.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = activeRoleFilter === 'All' || member.role.includes(activeRoleFilter);
//       return matchesSearch && matchesRole;
//     });
 
//     const groupedMembers = filteredMembers.reduce((acc, member) => {
//       if (!acc[member.role]) {
//         acc[member.role] = [];
//       }
//       acc[member.role].push(member);
//       return acc;
//     }, {});
 
//     const isStageSelected = (stage) => {
//       return stage.tasks.every(task => task.selected || task.assigned);
//     };
 
//     const hasSelectedTasks = stages.some(stage =>
//       stage.tasks.some(task => task.selected && !task.assigned)
//     );
 
//     const selectedTasksCount = stages.reduce((count, stage) =>
//       count + stage.tasks.filter(task => task.selected && !task.assigned).length, 0);
 
//     const uniqueRoles = ['All', ...new Set(teamMembers.map(member => {
//       if (member.role.includes('Operator')) return 'Operator';
//       if (member.role.includes('Supervisor')) return 'Supervisor';
//       if (member.role.includes('QA')) return 'QA';
//       return member.role;
//     }))];
 
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
//           assigned: task.selected ? true : task.assigned,
//           selected: false
//         }))
//       })));
 
//       alert(`Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${selectedMembers.length} team member${selectedMembers.length !== 1 ? 's' : ''}!`);
     
//       setSelectAll(false);
//       setMembers(teamMembers.map(m => ({ ...m, selected: false })));
//       setShowTaskAssignmentModal(false);
//     };
 
//     return (
//       <div className=" bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-xl w-full  max-h-[90vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setShowTaskAssignmentModal(false)}
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
//                 onClick={confirmAssignment}
//                 disabled={!hasSelectedTasks}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   hasSelectedTasks
//                     ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
//               </button>
//             </div>
//           </div>
 
//           {/* Main Content */}
//           <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
//             {/* Tasks Panel */}
//             <div className="w-full md:w-1/2 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200">
//               <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                 <User className="h-5 w-5 mr-2 text-indigo-500" />
//                 Tasks to Assign
//               </h3>
//               <div className="space-y-4">
//                 {stages.map((stage) => (
//                   <div key={stage.id} className={`rounded-lg border ${isStageSelected(stage) ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'}`}>
//                     <div
//                       className="p-4 flex items-center justify-between cursor-pointer"
//                       onClick={() => toggleStageExpansion(stage.id)}
//                     >
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={isStageSelected(stage)}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             toggleStage(stage.id);
//                           }}
//                           className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                         />
//                         <h3 className={`ml-3 font-medium ${isStageSelected(stage) ? 'text-indigo-800' : 'text-gray-800'}`}>
//                           {stage.name}
//                         </h3>
//                       </div>
//                       {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
//                     </div>
                   
//                     {stage.expanded && (
//                       <div className="px-4 pb-4 space-y-2">
//                         {stage.tasks.map((task) => {
//                           const taskNumber = task.id.replace('task', '').replace('-', '.');
//                           return (
//                             <div
//                               key={task.id}
//                               className={`p-3 rounded-md flex items-center justify-between ${
//                                 task.assigned ? 'bg-green-50 border border-green-100' :
//                                 task.selected ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
//                               }`}
//                             >
//                               <label className="flex items-center flex-grow cursor-pointer">
//                                 <input
//                                   type="checkbox"
//                                   checked={task.selected || task.assigned}
//                                   onChange={() => toggleTask(stage.id, task.id)}
//                                   className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//                                   disabled={task.assigned}
//                                 />
//                                 <span className={`ml-3 ${
//                                   task.assigned ? 'text-green-800' :
//                                   task.selected ? 'text-blue-800' : 'text-gray-700'
//                                 }`}>
//                                   <span className="font-medium">Task {taskNumber}:</span> {task.title}
//                                 </span>
//                               </label>
                             
//                               {task.assigned ? (
//                                 <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
//                                   Assigned
//                                 </span>
//                               ) : task.selected ? (
//                                 <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//                                   Selected
//                                 </span>
//                               ) : null}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
 
//             {/* Team Members Panel */}
         
//           </div>
//         </div>
//       </div>
//     );
//   };
 
//   return (
//     <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="  px-4 sm:px-6 py-8 md:py-12">
//         {/* Header - Responsive */}
//         <div className="mb-6 md:mb-8">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
//             Equipment Assignments
//           </h1>
//           <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
//         </div>
 
//         {/* Assignments Card - Responsive */}
//         <div className="bg-white/70 backdrop-blur-xl rounded-xl md:rounded-3xl shadow-sm border border-white/20 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
//                   <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Equipment</th>
//                   <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Prototype</th>
//                   <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Generated ID</th>
//                   <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//                   <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {assignments.map((assignment) => (
//                   <tr
//                     key={assignment._id}
//                     className="hover:bg-white/80 transition-colors duration-200"
//                   >
//                     <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-900 text-sm sm:text-base">{assignment.equipment.name}</span>
                       
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                       <span className="font-medium text-slate-800 text-sm sm:text-base">{assignment.prototypeData.name}</span>
//                     </td>
//                     <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                       <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-slate-100 text-slate-800">
//                         {assignment.generatedId}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                       <span className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
//                         assignment.status === 'assigned'
//                           ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
//                           : 'bg-amber-100 text-amber-800 border border-amber-200'
//                       }`}>
//                         {assignment.status === 'assigned' ? '✓ Assigned' : '⏳ Pending'}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
//                       {assignment.status === 'pending' && (
//                         <button
//                           onClick={() => handleAssignClick(assignment)}
//                           className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
//                         >
//                           <span className="mr-1 sm:mr-2">👤</span>
//                           <span className="hidden sm:inline">Assign Workers</span>
//                           <span className="sm:hidden">Assign</span>
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
           
//         </div>
// {showTaskAssignmentModal && <TaskAssignmentModal />}
//         {/* Task Assignment Modal */}
     
       
//       </div>
//     </div>
//   );
// };
 
// export default AssignmentsPage;


"use client";
import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { ClipboardList, User, ChevronRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    setCompanyData(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (companyData?.companyId) {
        const res = await fetch(`/api/assignment/fetchbyid/${companyData?.companyId}`);
        const dd = await res.json();
        setAssignments(dd);
      }
    };
    fetchData();
  }, [companyData]);

  const handleAssignClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowTaskAssignmentModal(true);
  };

  const TaskAssignmentModal = () => {
    const initialStages = selectedAssignment?.prototypeData?.stages?.map((stage, index) => ({
      id: `stage${index + 1}`,
      name: `Stage ${index + 1}: ${stage.name}`,
      tasks: stage.tasks.map((task, taskIndex) => ({
        id: `task${index + 1}-${taskIndex + 1}`,
        title: task.title,
        selected: false,
        assigned: !!stage.assignedWorker
      })),
      expanded: true
    })) || [];

    const teamMembers = dummyWorkers.map(worker => ({
      id: worker._id,
      code: worker._id,
      name: worker.name,
      role: 'Operator',
      selected: false
    }));

    const [stages, setStages] = useState(initialStages);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState(teamMembers);
    const [sendNotification, setSendNotification] = useState(true);
    const [activeRoleFilter, setActiveRoleFilter] = useState('All');

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
          selected: task.assigned ? false : newSelectAll
        }))
      })));
    };

    const toggleStage = (stageId) => {
      setStages(stages.map(stage => {
        if (stage.id === stageId) {
          const allSelected = stage.tasks.every(task => task.selected || task.assigned);
          return {
            ...stage,
            tasks: stage.tasks.map(task => ({
              ...task,
              selected: task.assigned ? false : !allSelected
            }))
          };
        }
        return stage;
      }));
    };

    const toggleTask = (stageId, taskId) => {
      setStages(stages.map(stage => {
        if (stage.id === stageId) {
          return {
            ...stage,
            tasks: stage.tasks.map(task =>
              task.id === taskId && !task.assigned
                ? { ...task, selected: !task.selected }
                : task
            )
          };
        }
        return stage;
      }));
    };

    const toggleMemberSelection = (memberId) => {
      setMembers(members.map(member =>
        member.id === memberId ? { ...member, selected: !member.selected } : member
      ));
    };

    const filteredMembers = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = activeRoleFilter === 'All' || member.role.includes(activeRoleFilter);
      return matchesSearch && matchesRole;
    });

    const groupedMembers = filteredMembers.reduce((acc, member) => {
      if (!acc[member.role]) {
        acc[member.role] = [];
      }
      acc[member.role].push(member);
      return acc;
    }, {});

    const isStageSelected = (stage) => {
      return stage.tasks.every(task => task.selected || task.assigned);
    };

    const hasSelectedTasks = stages.some(stage =>
      stage.tasks.some(task => task.selected && !task.assigned)
    );

    const selectedTasksCount = stages.reduce((count, stage) =>
      count + stage.tasks.filter(task => task.selected && !task.assigned).length, 0);

    const uniqueRoles = ['All', ...new Set(teamMembers.map(member => {
      if (member.role.includes('Operator')) return 'Operator';
      if (member.role.includes('Supervisor')) return 'Supervisor';
      if (member.role.includes('QA')) return 'QA';
      return member.role;
    }))];

  const confirmAssignment = () => {
  const selectedMembers = members.filter(member => member.selected);
  
  if (selectedTasksCount === 0 || selectedMembers.length === 0) {
    alert(selectedTasksCount === 0 ? 'No tasks selected for assignment' : 'No team members selected');
    return;
  }

  // Create a mapping of stages to their assigned members
  const updatedStages = stages.map(stage => {
    const assignedTasks = stage.tasks.filter(task => task.selected);
    
    if (assignedTasks.length > 0) {
      return {
        ...stage,
        assignedWorker: selectedMembers[0].name, // Assign the first selected member
        tasks: stage.tasks.map(task => ({
          ...task,
          assigned: task.selected ? true : task.assigned,
          selected: false
        }))
      };
    }
    return stage;
  });

  // Log all stages with their assigned members
  console.log("Assignment Details:");
  updatedStages.forEach(stage => {
    if (stage.assignedWorker) {
      console.log(`Stage: ${stage.name}`);
      console.log(`Assigned Worker: ${stage.assignedWorker}`);
      console.log("Tasks:");
      stage.tasks.forEach(task => {
        if (task.assigned) {
          console.log(`- ${task.title} (Assigned)`);
        } else {
          console.log(`- ${task.title} (Not Assigned)`);
        }
      });
      console.log("-------------------");
    }
  });

  // Update the state
  setStages(updatedStages);
  
  alert(`Assigned ${selectedTasksCount} task${selectedTasksCount !== 1 ? 's' : ''} to ${selectedMembers.length} team member${selectedMembers.length !== 1 ? 's' : ''}!`);
  
  setSelectAll(false);
  setMembers(teamMembers.map(m => ({ ...m, selected: false })));
  setShowTaskAssignmentModal(false);
};

    return (
      <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTaskAssignmentModal(false)}
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
                onClick={confirmAssignment}
                disabled={!hasSelectedTasks}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  hasSelectedTasks
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Assign {selectedTasksCount > 0 && `(${selectedTasksCount})`}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Tasks Panel */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                Tasks to Assign
              </h3>
              <div className="space-y-4">
                {stages.map((stage) => (
                  <div key={stage.id} className={`rounded-lg border ${isStageSelected(stage) ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'}`}>
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer"
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
                          className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <h3 className={`ml-3 font-medium ${isStageSelected(stage) ? 'text-indigo-800' : 'text-gray-800'}`}>
                          {stage.name}
                        </h3>
                      </div>
                      {stage.expanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                   
                    {stage.expanded && (
                      <div className="px-4 pb-4 space-y-2">
                        {stage.tasks.map((task) => {
                          const taskNumber = task.id.replace('task', '').replace('-', '.');
                          return (
                            <div
                              key={task.id}
                              className={`p-3 rounded-md flex items-center justify-between ${
                                task.assigned ? 'bg-green-50 border border-green-100' :
                                task.selected ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                              }`}
                            >
                              <label className="flex items-center flex-grow cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={task.selected || task.assigned}
                                  onChange={() => toggleTask(stage.id, task.id)}
                                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                  disabled={task.assigned}
                                />
                                <span className={`ml-3 ${
                                  task.assigned ? 'text-green-800' :
                                  task.selected ? 'text-blue-800' : 'text-gray-700'
                                }`}>
                                  <span className="font-medium">Task {taskNumber}:</span> {task.title}
                                </span>
                              </label>
                             
                              {task.assigned ? (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Assigned
                                </span>
                              ) : task.selected ? (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  Selected
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members Panel */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                Assign to Team Members
              </h3>
              
              {/* Search and Filter */}
              <div className="mb-6 space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {uniqueRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setActiveRoleFilter(role)}
                      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                        activeRoleFilter === role
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {Object.entries(groupedMembers).map(([role, roleMembers]) => (
                  <div key={role}>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{role} ({roleMembers.length})</h4>
                    <div className="space-y-2">
                      {roleMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => toggleMemberSelection(member.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center ${
                            member.selected
                              ? 'bg-indigo-50 border border-indigo-200'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.code}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={member.selected}
                            onChange={() => toggleMemberSelection(member.id)}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            
            <button
              onClick={confirmAssignment}
              disabled={!hasSelectedTasks}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                hasSelectedTasks
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 sm:px-6 py-8 md:py-12">
        {/* Header - Responsive */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 md:mb-2">
            Equipment Assignments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg">Manage and assign equipment to workers efficiently</p>
        </div>

        {/* Assignments Card - Responsive */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl md:rounded-3xl shadow-sm border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Equipment</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Prototype</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Generated ID</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 text-left font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((assignment) => (
                  <tr
                    key={assignment._id}
                    className="hover:bg-white/80 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">{assignment.equipment.name}</span>
                        {/* <span className="text-xs text-slate-500">{assignment.equipment.barcode}</span> */}
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className="font-medium text-slate-800 text-sm sm:text-base">{assignment.prototypeData.name}</span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-slate-100 text-slate-800">
                        {assignment.generatedId}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      <span className={`inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        assignment.status === 'assigned'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {assignment.status === 'assigned' ? '✓ Assigned' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => handleAssignClick(assignment)}
                          className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
                        >
                          <span className="mr-1 sm:mr-2">👤</span>
                          <span className="hidden sm:inline">Assign Workers</span>
                          <span className="sm:hidden">Assign</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render modal using portal */}
      {isMounted && showTaskAssignmentModal && createPortal(
        <TaskAssignmentModal />,
        document.body
      )}
    </div>
  );
};

export default AssignmentsPage;