
// // 'use client';
// // import { useState } from 'react';
// // import {
// //   DndContext,
// //   closestCenter,
// //   PointerSensor,
// //   TouchSensor,
// //   useSensor,
// //   useSensors,
// //   DragOverlay,
// // } from '@dnd-kit/core';
// // import { ArrowLeft } from 'react-feather';
// // import {
// //   SortableContext,
// //   useSortable,
// //   arrayMove,
// //   verticalListSortingStrategy,
// // } from '@dnd-kit/sortable';
// // import { CSS } from '@dnd-kit/utilities';
// // import { GiAlarmClock } from "react-icons/gi";
// // import Link from 'next/link';
// // /* ---------- ICONS ---------- */
// // const Plus = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //   </svg>
// // );
// // const Edit = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //   </svg>
// // );
// // const Trash = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //   </svg>
// // );
// // const GripVertical = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zM16 5v.01M16 12v.01M16 19v.01M16 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
// //   </svg>
// // );
// // const Clock = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //   </svg>
// // );
// // const ImageIcon = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //   </svg>
// // );
// // const Copy = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
// //   </svg>
// // );
// // /* ---------- SORTABLE ITEM ---------- */
// // const SortableItem = ({
// //   id,
// //   title,
// //   description,
// //   minTime,
// //   maxTime,
// //   level,
// //   onEdit,
// //   onAddSubtask,
// //   onDuplicate,
// //   numbering,
// //   showActionButtons,
// //   onClick,
// //   image,
// //   imageTitle,
// //   imageDescription,
// // }) => {
// //   const {
// //     attributes,
// //     listeners,
// //     setNodeRef,
// //     transform,
// //     transition,
// //     isDragging,
// //   } = useSortable({ id });
// //   const style = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     opacity: isDragging ? 0.5 : 1,
// //   };
// //   return (
// //     <div
// //       ref={setNodeRef}
// //       style={style}
// //       onClick={(e) => {
// //         e.stopPropagation();
// //         onClick?.(id);
// //       }}
// //       className={`group p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
// //     >
// //       <div className="flex items-start gap-3">
// //         {showActionButtons && (
// //           <div
// //             className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 cursor-grab"
// //             {...listeners}
// //             {...attributes}
// //           >
// //             <GripVertical className="w-4 h-4" />
// //           </div>
// //         )}
// //         <div className="flex-1 min-w-0">
// //           <div className="flex items-start justify-between">
// //             <div className="flex-1 min-w-0">
// //               <div className="flex items-center gap-2 mb-1">
// //                 {numbering && (
// //                   <span className="flex-shrink-0 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
// //                     {numbering}
// //                   </span>
// //                 )}
// //                 {/* 1. CHANGE: Added truncate class to prevent long text from overflowing */}
// //                 <h3 className="text-sm font-medium text-slate-900 leading-tight truncate w-[150px]">{title}</h3>
// //               </div>
            
// //               <div className="flex justify-between">
// //                  {(minTime || maxTime) && (
// //                 <div className="flex items-center gap-2 ">
// //                   <Clock className="w-3 h-3 text-slate-500" />
// //                   <span className="text-xs text-slate-500">
// //                     {minTime && maxTime ? `${minTime} - ${maxTime}` :
// //                       minTime ? `Min: ${minTime}` :
// //                         maxTime ? `Max: ${maxTime}` : ''}
// //                   </span>
// //                 </div>
// //               )}
// //               {(image || imageTitle || imageDescription) && (
// //                 <div className=" text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
// //                   Image Attached
// //                 </div>
// //               )}
// //               </div>
            
// //             </div>
// //             {showActionButtons && (
// //               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onEdit(id);
// //                   }}
// //                   className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
// //                   title="Edit"
// //                 >
// //                   <Edit className="w-3.5 h-3.5" />
// //                 </button>
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onDuplicate(id);
// //                   }}
// //                   className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
// //                   title="Duplicate"
// //                 >
// //                   <Copy className="w-3.5 h-3.5" />
// //                 </button>
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onAddSubtask(id);
// //                   }}
// //                   className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
// //                   title="Add Subtask"
// //                 >
// //                   <Plus className="w-3.5 h-3.5" />
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// // /* ---------- MAIN COMPONENT ---------- */
// // export default function NestedDragDrop() {
// //   /* ---- state ---- */
// //   const [stages, setStages] = useState([]);
// //   const [selectedStageId, setSelectedStageId] = useState(null);
// //   const [checklistData, setChecklistData] = useState({
// //     name: '',
// //     department: '',
// //     documentNumber: '',
// //     qms_number: '',
// //     version: '',
// //   });
// //   const [showStageForm, setShowStageForm] = useState(false);
// //   const [newStage, setNewStage] = useState({ title: '' });
// //   const [showTaskForms, setShowTaskForms] = useState({});
// //   const [newTasks, setNewTasks] = useState({});
// //   const [showSubtaskForms, setShowSubtaskForms] = useState({});
// //   const [newSubtasks, setNewSubtasks] = useState({});
// //   const [showSubtaskTimeFields, setShowSubtaskTimeFields] = useState({});
// //   const [editItemId, setEditItemId] = useState(null);
// //   const [editFormData, setEditFormData] = useState({
// //     title: '',
// //     description: '',
// //     minTime: { hours: '00', minutes: '00', seconds: '00' },
// //     maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //     image: null,
// //     imageTitle: '',
// //     imageDescription: '',
// //   });
// //   const [activeStageId, setActiveStageId] = useState(null);
// //   const [activeStageItem, setActiveStageItem] = useState(null);
// //   const [activeTaskId, setActiveTaskId] = useState(null);
// //   const [activeTaskItem, setActiveTaskItem] = useState(null);
// //   const [showTimeFields, setShowTimeFields] = useState({});
// //   const [showEditTimeFields, setShowEditTimeFields] = useState(true);
// //   const [showImageModal, setShowImageModal] = useState(false);
// //   const [showTaskImageModal, setShowTaskImageModal] = useState({});
// //   const [showSubtaskImageModal, setShowSubtaskImageModal] = useState({});
// //   /* ---- dnd ---- */
// //   const sensors = useSensors(
// //     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
// //     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
// //   );
// //   /* ---- helpers ---- */
// //   const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
// //   const findItemById = (items, id) => {
// //     for (const item of items) {
// //       if (item.id === id) return item;
// //       if (item.tasks) {
// //         const foundInTasks = findItemById(item.tasks, id);
// //         if (foundInTasks) return foundInTasks;
// //       }
// //       if (item.subtasks) {
// //         const foundInSubtasks = findItemById(item.subtasks, id);
// //         if (foundInSubtasks) return foundInSubtasks;
// //       }
// //     }
// //     return null;
// //   };
// //   const findContainer = (items, id) => {
// //     if (items.find((item) => item.id === id)) {
// //       return { container: items, index: items.findIndex((item) => item.id === id) };
// //     }
// //     for (const item of items) {
// //       if (item.tasks) {
// //         const taskResult = findContainer(item.tasks, id);
// //         if (taskResult) return taskResult;
// //       }
// //       if (item.subtasks) {
// //         const subtaskResult = findContainer(item.subtasks, id);
// //         if (subtaskResult) return subtaskResult;
// //       }
// //     }
// //     return null;
// //   };
// //   const findItem = (items, id) => {
// //     for (const item of items) {
// //       if (item.id === id) return item;
// //       if (item.tasks) {
// //         const foundInTasks = findItem(item.tasks, id);
// //         if (foundInTasks) return foundInTasks;
// //       }
// //       if (item.subtasks) {
// //         const foundInSubtasks = findItem(item.subtasks, id);
// //         if (foundInSubtasks) return foundInSubtasks;
// //       }
// //     }
// //     return null;
// //   };
// //   const updateItem = (items, id, updatedData) =>
// //     items.map((item) => {
// //       if (item.id === id) return { ...item, ...updatedData };
// //       if (item.tasks) return { ...item, tasks: updateItem(item.tasks, id, updatedData) };
// //       if (item.subtasks) return { ...item, subtasks: updateItem(item.subtasks, id, updatedData) };
// //       return item;
// //     });
// //   const deleteItem = (items, id) =>
// //     items
// //       .filter((item) => item.id !== id)
// //       .map((item) => ({
// //         ...item,
// //         tasks: item.tasks ? deleteItem(item.tasks, id) : undefined,
// //         subtasks: item.subtasks ? deleteItem(item.subtasks, id) : undefined,
// //       }));
// //   const cloneItem = (item) => ({
// //     ...item,
// //     id: generateId(item.id.split('-')[0]),
// //     tasks: item.tasks ? item.tasks.map(cloneItem) : undefined,
// //     subtasks: item.subtasks ? item.subtasks.map(cloneItem) : undefined,
// //   });
// //   const duplicateItemRecursive = (items, id) =>
// //     items.flatMap((item) => {
// //       if (item.id === id) {
// //         return [item, cloneItem(item)];
// //       }
// //       let newItem = { ...item };
// //       if (item.tasks) {
// //         newItem = { ...newItem, tasks: duplicateItemRecursive(item.tasks, id) };
// //       }
// //       if (item.subtasks) {
// //         newItem = { ...newItem, subtasks: duplicateItemRecursive(item.subtasks, id) };
// //       }
// //       return [newItem];
// //     });
// //   const generateNumbering = (items, id, parentNumbers = []) => {
// //     for (let i = 0; i < items.length; i++) {
// //       const currentNumbers = [...parentNumbers, i + 1];
// //       if (items[i].id === id) return currentNumbers.join('.');
// //       if (items[i].tasks?.length) {
// //         const result = generateNumbering(items[i].tasks, id, currentNumbers);
// //         if (result) return result;
// //       }
// //       if (items[i].subtasks?.length) {
// //         const result = generateNumbering(items[i].subtasks, id, currentNumbers);
// //         if (result) return result;
// //       }
// //     }
// //     return null;
// //   };
// //   const formatTime = (hours, minutes, seconds) => {
// //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// //   };
// //   const parseTime = (timeString) => {
// //     if (!timeString) return { hours: '00', minutes: '00', seconds: '00' };
// //     const [hours, minutes, seconds] = timeString.split(':').map(val => val.padStart(2, '0'));
// //     return { hours, minutes, seconds };
// //   };
// //   const timeToSeconds = (hours, minutes, seconds) => {
// //     return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
// //   };
// //   /* ---- header handlers ---- */
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setChecklistData((prev) => ({ ...prev, [name]: value }));
// //   };
// //   const handleSubmit = () => {
// //     if (!checklistData.name || !checklistData.department || !checklistData.qms_number || !checklistData.version) {
// //       alert('Please fill all required fields.');
// //       return;
// //     }
// //     console.log('Checklist Data:', checklistData, 'Stages:', stages);
// //     alert('Data logged to console. Check your browser developer tools.');
// //   };
// //   /* ---- stage handlers ---- */
// //   const handleStageInputChange = (e) => setNewStage({ title: e.target.value });
// //   const addStage = () => {
// //     if (!newStage.title.trim()) return alert('Stage title is required');
// //     const newStageItem = { id: generateId('stage'), title: newStage.title, tasks: [] };
// //     setStages((prev) => [...prev, newStageItem]);
// //     setNewStage({ title: '' });
// //     setShowStageForm(false);
// //     setSelectedStageId(newStageItem.id);
// //   };
// //   const handleStageDragStart = (event) => {
// //     const { active } = event;
// //     setActiveStageId(active.id);
// //     setActiveStageItem(stages.find((stage) => stage.id === active.id));
// //   };
// //   const handleStageDragEnd = (event) => {
// //     const { active, over } = event;
// //     if (!over || active.id === over.id) {
// //       setActiveStageId(null);
// //       setActiveStageItem(null);
// //       return;
// //     }
// //     setStages((prev) => {
// //       const oldIndex = prev.findIndex((s) => s.id === active.id);
// //       const newIndex = prev.findIndex((s) => s.id === over.id);
// //       return arrayMove(prev, oldIndex, newIndex);
// //     });
// //     setActiveStageId(null);
// //     setActiveStageItem(null);
// //   };
// //   /* ---- task / subtask handlers ---- */
// //   const toggleTaskForm = (stageId) => {
// //     setShowTaskForms((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
// //     if (!newTasks[stageId]) setNewTasks((prev) => ({
// //       ...prev,
// //       [stageId]: {
// //         title: '',
// //         description: '',
// //         minTime: { hours: '00', minutes: '00', seconds: '00' },
// //         maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         image: null,
// //         imageTitle: '',
// //         imageDescription: '',
// //       }
// //     }));
// //     setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
// //     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
// //   };
// //   const handleTaskInputChange = (stageId, e) => {
// //     const { name, value } = e.target;
// //     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
// //       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
// //       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
// //       const unitKey = unit.toLowerCase();
// //       let newValue = value.replace(/^0+/, '') || '0';
// //       let hours = parseInt(newTasks[stageId][timeField].hours) || 0;
// //       let minutes = parseInt(newTasks[stageId][timeField].minutes) || 0;
// //       let seconds = parseInt(newTasks[stageId][timeField].seconds) || 0;
// //       if (unitKey === 'hours') {
// //         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
// //       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
// //         newValue = parseInt(newValue) || 0;
// //         if (newValue > 59) {
// //           if (unitKey === 'seconds') {
// //             minutes += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           } else if (unitKey === 'minutes') {
// //             hours += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           }
// //           if (hours > 24) hours = 24;
// //         }
// //         newValue = Math.max(0, Math.min(59, newValue)).toString();
// //       }
// //       setNewTasks((prev) => ({
// //         ...prev,
// //         [stageId]: {
// //           ...prev[stageId],
// //           [timeField]: {
// //             ...prev[stageId][timeField],
// //             hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
// //             minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
// //             seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
// //           }
// //         }
// //       }));
// //     } else {
// //       setNewTasks((prev) => ({ ...prev, [stageId]: { ...prev[stageId], [name]: value } }));
// //     }
// //   };
// //   const handleTaskImageInputChange = (stageId, e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (!file.type.startsWith('image/')) {
// //         alert('Please select an image file.');
// //         return;
// //       }
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setNewTasks((prev) => ({
// //           ...prev,
// //           [stageId]: { ...prev[stageId], image: event.target.result }
// //         }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };
// //   const handleTaskSaveImage = (stageId) => {
// //     if (!newTasks[stageId]?.imageTitle.trim()) {
// //       alert('Image title is required');
// //       return;
// //     }
// //     if (!newTasks[stageId]?.image) {
// //       alert('Please select an image');
// //       return;
// //     }
// //     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
// //   };
// //   const addTask = (stageId) => {
// //     if (!newTasks[stageId]?.title.trim()) return alert('Task title is required');
// //     let minTime = '';
// //     let maxTime = '';
// //     if (showTimeFields[stageId]) {
// //       minTime = formatTime(
// //         newTasks[stageId].minTime.hours,
// //         newTasks[stageId].minTime.minutes,
// //         newTasks[stageId].minTime.seconds
// //       );
// //       maxTime = formatTime(
// //         newTasks[stageId].maxTime.hours,
// //         newTasks[stageId].maxTime.minutes,
// //         newTasks[stageId].maxTime.seconds
// //       );
// //       if (minTime !== '00:00:00' && maxTime !== '00:00:00') {
// //         const minSeconds = timeToSeconds(
// //           newTasks[stageId].minTime.hours,
// //           newTasks[stageId].minTime.minutes,
// //           newTasks[stageId].minTime.seconds
// //         );
// //         const maxSeconds = timeToSeconds(
// //           newTasks[stageId].maxTime.hours,
// //           newTasks[stageId].maxTime.minutes,
// //           newTasks[stageId].maxTime.seconds
// //         );
// //         if (minSeconds > maxSeconds) {
// //           return alert('Minimum time cannot be greater than maximum time');
// //         }
// //       }
// //     }
// //     setStages((prev) =>
// //       prev.map((stage) =>
// //         stage.id === stageId
// //           ? {
// //             ...stage,
// //             tasks: [
// //               ...stage.tasks,
// //               {
// //                 id: generateId('task'),
// //                 title: newTasks[stageId].title,
// //                 description: newTasks[stageId].description,
// //                 minTime: minTime,
// //                 maxTime: maxTime,
// //                 subtasks: [],
// //                 image: newTasks[stageId].image,
// //                 imageTitle: newTasks[stageId].imageTitle,
// //                 imageDescription: newTasks[stageId].imageDescription,
// //               }
// //             ]
// //           }
// //           : stage
// //       )
// //     );
// //     setNewTasks((prev) => ({
// //       ...prev,
// //       [stageId]: {
// //         title: '',
// //         description: '',
// //         minTime: { hours: '00', minutes: '00', seconds: '00' },
// //         maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         image: null,
// //         imageTitle: '',
// //         imageDescription: '',
// //       }
// //     }));
// //     setShowTaskForms((prev) => ({ ...prev, [stageId]: false }));
// //     setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
// //     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
// //   };
// //   const toggleSubtaskForm = (parentId) => {
// //     setShowSubtaskForms((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
// //     if (!newSubtasks[parentId]) {
// //       setNewSubtasks((prev) => ({
// //         ...prev,
// //         [parentId]: {
// //           title: '',
// //           description: '',
// //           minTime: { hours: '00', minutes: '00', seconds: '00' },
// //           maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //           image: null,
// //           imageTitle: '',
// //           imageDescription: '',
// //         }
// //       }));
// //       setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
// //       setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
// //     }
// //   };
// //   const handleSubtaskInputChange = (parentId, e) => {
// //     const { name, value } = e.target;
// //     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
// //       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
// //       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
// //       const unitKey = unit.toLowerCase();
// //       let newValue = value.replace(/^0+/, '') || '0';
// //       let hours = parseInt(newSubtasks[parentId][timeField].hours) || 0;
// //       let minutes = parseInt(newSubtasks[parentId][timeField].minutes) || 0;
// //       let seconds = parseInt(newSubtasks[parentId][timeField].seconds) || 0;
// //       if (unitKey === 'hours') {
// //         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
// //       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
// //         newValue = parseInt(newValue) || 0;
// //         if (newValue > 59) {
// //           if (unitKey === 'seconds') {
// //             minutes += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           } else if (unitKey === 'minutes') {
// //             hours += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           }
// //           if (hours > 24) hours = 24;
// //         }
// //         newValue = Math.max(0, Math.min(59, newValue)).toString();
// //       }
// //       setNewSubtasks((prev) => ({
// //         ...prev,
// //         [parentId]: {
// //           ...prev[parentId],
// //           [timeField]: {
// //             ...prev[parentId][timeField],
// //             hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
// //             minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
// //             seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
// //           }
// //         }
// //       }));
// //     } else {
// //       setNewSubtasks((prev) => ({ ...prev, [parentId]: { ...prev[parentId], [name]: value } }));
// //     }
// //   };
// //   const handleSubtaskImageInputChange = (parentId, e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (!file.type.startsWith('image/')) {
// //         alert('Please select an image file.');
// //         return;
// //       }
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setNewSubtasks((prev) => ({
// //           ...prev,
// //           [parentId]: { ...prev[parentId], image: event.target.result }
// //         }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };
// //   const handleSubtaskSaveImage = (parentId) => {
// //     if (!newSubtasks[parentId]?.imageTitle.trim()) {
// //       alert('Image title is required');
// //       return;
// //     }
// //     if (!newSubtasks[parentId]?.image) {
// //       alert('Please select an image');
// //       return;
// //     }
// //     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
// //   };
// //   const handleAddSubtask = (parentId) => {
// //     if (!newSubtasks[parentId]?.title.trim()) return alert('Subtask title is required');
// //     let minTime = '';
// //     let maxTime = '';
// //     if (showSubtaskTimeFields[parentId]) {
// //       minTime = formatTime(
// //         newSubtasks[parentId].minTime.hours,
// //         newSubtasks[parentId].minTime.minutes,
// //         newSubtasks[parentId].minTime.seconds
// //       );
// //       maxTime = formatTime(
// //         newSubtasks[parentId].maxTime.hours,
// //         newSubtasks[parentId].maxTime.minutes,
// //         newSubtasks[parentId].maxTime.seconds
// //       );
// //       if (minTime !== '00:00:00' && maxTime !== '00:00:00') {
// //         const minSeconds = timeToSeconds(
// //           newSubtasks[parentId].minTime.hours,
// //           newSubtasks[parentId].minTime.minutes,
// //           newSubtasks[parentId].minTime.seconds
// //         );
// //         const maxSeconds = timeToSeconds(
// //           newSubtasks[parentId].maxTime.hours,
// //           newSubtasks[parentId].maxTime.minutes,
// //           newSubtasks[parentId].maxTime.seconds
// //         );
// //         if (minSeconds > maxSeconds) {
// //           return alert('Minimum time cannot be greater than maximum time');
// //         }
// //       }
// //     }
// //     const newSubtaskItem = {
// //       id: generateId('subtask'),
// //       title: newSubtasks[parentId].title,
// //       description: newSubtasks[parentId].description,
// //       minTime: minTime,
// //       maxTime: maxTime,
// //       subtasks: [],
// //       image: newSubtasks[parentId].image,
// //       imageTitle: newSubtasks[parentId].imageTitle,
// //       imageDescription: newSubtasks[parentId].imageDescription,
// //     };
// //     setStages((prev) => addSubtask(prev, parentId, newSubtaskItem));
// //     setNewSubtasks((prev) => ({
// //       ...prev,
// //       [parentId]: {
// //         title: '',
// //         description: '',
// //         minTime: { hours: '00', minutes: '00', seconds: '00' },
// //         maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         image: null,
// //         imageTitle: '',
// //         imageDescription: '',
// //       }
// //     }));
// //     setShowSubtaskForms((prev) => ({ ...prev, [parentId]: false }));
// //     setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
// //     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
// //   };
// //   const addSubtask = (items, parentId, newSubtaskItem) =>
// //     items.map((item) => {
// //       if (item.id === parentId) return { ...item, subtasks: [...(item.subtasks || []), newSubtaskItem] };
// //       if (item.tasks) return { ...item, tasks: addSubtask(item.tasks, parentId, newSubtaskItem) };
// //       if (item.subtasks) return { ...item, subtasks: addSubtask(item.subtasks, parentId, newSubtaskItem) };
// //       return item;
// //     });
// //   const toggleSubtaskTimeFields = (parentId) => {
// //     setShowSubtaskTimeFields((prev) => ({
// //       ...prev,
// //       [parentId]: !prev[parentId],
// //     }));
// //     if (!showSubtaskTimeFields[parentId]) {
// //       setNewSubtasks((prev) => ({
// //         ...prev,
// //         [parentId]: {
// //           ...prev[parentId],
// //           minTime: { hours: '00', minutes: '00', seconds: '00' },
// //           maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         },
// //       }));
// //     } else {
// //       setNewSubtasks((prev) => ({
// //         ...prev,
// //         [parentId]: {
// //           ...prev[parentId],
// //           minTime: { hours: '00', minutes: '00', seconds: '00' },
// //           maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         },
// //       }));
// //     }
// //   };
// //   const handleEdit = (id) => {
// //     const item = findItemById(stages, id);
// //     if (item) {
// //       setEditItemId(id);
// //       setEditFormData({
// //         title: item.title || '',
// //         description: item.description || '',
// //         minTime: parseTime(item.minTime),
// //         maxTime: parseTime(item.maxTime),
// //         image: item.image || null,
// //         imageTitle: item.imageTitle || '',
// //         imageDescription: item.imageDescription || '',
// //       });
// //       setShowEditTimeFields(!!item.minTime || !!item.maxTime);
// //     }
// //   };
// //   const handleDuplicate = (id) => {
// //     setStages((prev) => duplicateItemRecursive(prev, id));
// //   };
// //   const handleEditInputChange = (e) => {
// //     const { name, value } = e.target;
// //     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
// //       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
// //       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
// //       const unitKey = unit.toLowerCase();
// //       let newValue = value.replace(/^0+/, '') || '0';
// //       let hours = parseInt(editFormData[timeField].hours) || 0;
// //       let minutes = parseInt(editFormData[timeField].minutes) || 0;
// //       let seconds = parseInt(editFormData[timeField].seconds) || 0;
// //       if (unitKey === 'hours') {
// //         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
// //       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
// //         newValue = parseInt(newValue) || 0;
// //         if (newValue > 59) {
// //           if (unitKey === 'seconds') {
// //             minutes += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           } else if (unitKey === 'minutes') {
// //             hours += Math.floor(newValue / 60);
// //             newValue = newValue % 60;
// //           }
// //           if (hours > 24) hours = 24;
// //         }
// //         newValue = Math.max(0, Math.min(59, newValue)).toString();
// //       }
// //       setEditFormData((prev) => ({
// //         ...prev,
// //         [timeField]: {
// //           ...prev[timeField],
// //           hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
// //           minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
// //           seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
// //         }
// //       }));
// //     } else {
// //       setEditFormData((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };
// //   const handleImageInputChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (!file.type.startsWith('image/')) {
// //         alert('Please select an image file.');
// //         return;
// //       }
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setEditFormData((prev) => ({ ...prev, image: event.target.result }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };
// //   const handleSaveEdit = () => {
// //     if (!editFormData.title.trim()) return alert('Title is required');
// //     const minTime = showEditTimeFields ? formatTime(
// //       editFormData.minTime.hours,
// //       editFormData.minTime.minutes,
// //       editFormData.minTime.seconds
// //     ) : '';
// //     const maxTime = showEditTimeFields ? formatTime(
// //       editFormData.maxTime.hours,
// //       editFormData.maxTime.minutes,
// //       editFormData.maxTime.seconds
// //     ) : '';
// //     if (showEditTimeFields && minTime !== '00:00:00' && maxTime !== '00:00:00') {
// //       const minSeconds = timeToSeconds(
// //         editFormData.minTime.hours,
// //         editFormData.minTime.minutes,
// //         editFormData.minTime.seconds
// //       );
// //       const maxSeconds = timeToSeconds(
// //         editFormData.maxTime.hours,
// //         editFormData.maxTime.minutes,
// //         editFormData.maxTime.seconds
// //       );
// //       if (minSeconds > maxSeconds) {
// //         return alert('Minimum time cannot be greater than maximum time');
// //       }
// //     }
// //     setStages((prev) => updateItem(prev, editItemId, {
// //       title: editFormData.title,
// //       description: editFormData.description,
// //       minTime: minTime,
// //       maxTime: maxTime,
// //       image: editFormData.image,
// //       imageTitle: editFormData.imageTitle,
// //       imageDescription: editFormData.imageDescription,
// //     }));
// //     setEditItemId(null);
// //     setEditFormData({
// //       title: '',
// //       description: '',
// //       minTime: { hours: '00', minutes: '00', seconds: '00' },
// //       maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //       image: null,
// //       imageTitle: '',
// //       imageDescription: '',
// //     });
// //     setShowEditTimeFields(true);
// //     setShowImageModal(false);
// //   };
// //   const handleDelete = (id) => {
// //     if (!confirm('Are you sure you want to delete this item?')) return;
// //     setStages((prev) => {
// //       const newStages = deleteItem(prev, id);
// //       if (!newStages.find((s) => s.id === selectedStageId)) setSelectedStageId(newStages[0]?.id || null);
// //       return newStages;
// //     });
// //     setEditItemId(null);
// //     setShowEditTimeFields(true);
// //     setShowImageModal(false);
// //   };
// //   const handleTaskDragStart = (event) => {
// //     const { active } = event;
// //     setActiveTaskId(active.id);
// //     setActiveTaskItem(findItem(stages, active.id));
// //   };
// //   const handleTaskDragEnd = (event) => {
// //     const { active, over } = event;
// //     if (!over) {
// //       setActiveTaskId(null);
// //       setActiveTaskItem(null);
// //       return;
// //     }
// //     if (active.id !== over.id) {
// //       setStages((prev) => {
// //         const newStages = JSON.parse(JSON.stringify(prev));
// //         const activeContainer = findContainer(newStages, active.id);
// //         const overContainer = findContainer(newStages, over.id);
// //         if (activeContainer && overContainer) {
// //           const [movedItem] = activeContainer.container.splice(activeContainer.index, 1);
// //           overContainer.container.splice(overContainer.index, 0, movedItem);
// //         }
// //         return newStages;
// //       });
// //     }
// //     setActiveTaskId(null);
// //     setActiveTaskItem(null);
// //   };
// //   const toggleTimeFields = (stageId) => {
// //     setShowTimeFields((prev) => ({
// //       ...prev,
// //       [stageId]: !prev[stageId],
// //     }));
// //     if (!showTimeFields[stageId]) {
// //       setNewTasks((prev) => ({
// //         ...prev,
// //         [stageId]: {
// //           ...prev[stageId],
// //           minTime: { hours: '00', minutes: '00', seconds: '00' },
// //           maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         },
// //       }));
// //     } else {
// //       setNewTasks((prev) => ({
// //         ...prev,
// //         [stageId]: {
// //           ...prev[stageId],
// //           minTime: { hours: '00', minutes: '00', seconds: '00' },
// //           maxTime: { hours: '00', minutes: '00', seconds: '00' },
// //         },
// //       }));
// //     }
// //   };
// //   const handleResetTime = () => {
// //     setShowEditTimeFields(false);
// //     setEditFormData((prev) => ({
// //       ...prev,
// //       minTime: { hours: '00', minutes: '00', seconds: '00' },
// //       maxTime: { hours: '00', minutes: '00', seconds: '00' }
// //     }));
// //   };
// //   const handleSetTime = () => {
// //     setShowEditTimeFields(true);
// //   };
// //   const handleOpenTaskImageModal = (stageId) => {
// //     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: true }));
// //   };
// //   const handleCloseTaskImageModal = (stageId) => {
// //     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
// //   };
// //   const handleOpenSubtaskImageModal = (parentId) => {
// //     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: true }));
// //   };
// //   const handleCloseSubtaskImageModal = (parentId) => {
// //     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
// //   };
// //   const handleOpenImageModal = () => {
// //     setShowImageModal(true);
// //   };
// //   const handleCloseImageModal = () => {
// //     setShowImageModal(false);
// //   };
// //   const handleSaveImage = () => {
// //     if (!editFormData.imageTitle.trim()) {
// //       alert('Image title is required');
// //       return;
// //     }
// //     if (!editFormData.image) {
// //       alert('Please select an image');
// //       return;
// //     }
// //     setStages((prev) => updateItem(prev, editItemId, {
// //       image: editFormData.image,
// //       imageTitle: editFormData.imageTitle,
// //       imageDescription: editFormData.imageDescription,
// //     }));
// //     setShowImageModal(false);
// //   };
// //   /* ---- render ---- */
// //   const renderItems = (items, level = 1, parentStageId = null) =>
// //     items.map((item) => {
// //       const numbering = generateNumbering(stages, item.id);
// //       return (
// //         <div key={item.id} className={`${level > 1 ? 'ml-6' : ''} mb-3`}>
// //           {editItemId === item.id ? (
// //             <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
// //               <h4 className="text-sm font-semibold text-slate-900 mb-3">Edit Item</h4>
// //               <div className="space-y-3">
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   placeholder="Title *"
// //                   value={editFormData.title}
// //                   onChange={handleEditInputChange}
// //                   className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   required
// //                 />
// //                 <textarea
// //                   name="description"
// //                   placeholder="Description"
// //                   value={editFormData.description}
// //                   onChange={handleEditInputChange}
// //                   className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   rows={2}
// //                 />
// //                 {showEditTimeFields && (
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                     <div>
// //                       <label className="block text-xs font-medium text-slate-700 mb-1">
// //                         Minimum Time
// //                       </label>
// //                       <div className="flex gap-2">
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                           <input
// //                             type="number"
// //                             name="minHours"
// //                             placeholder="HH"
// //                             value={editFormData.minTime.hours}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="24"
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                           <input
// //                             type="number"
// //                             name="minMinutes"
// //                             placeholder="MM"
// //                             value={editFormData.minTime.minutes}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="59"
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                           <input
// //                             type="number"
// //                             name="minSeconds"
// //                             placeholder="SS"
// //                             value={editFormData.minTime.seconds}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="59"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-slate-700 mb-1">
// //                         Maximum Time
// //                       </label>
// //                       <div className="flex gap-2">
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                           <input
// //                             type="number"
// //                             name="maxHours"
// //                             placeholder="HH"
// //                             value={editFormData.maxTime.hours}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="24"
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                           <input
// //                             type="number"
// //                             name="maxMinutes"
// //                             placeholder="MM"
// //                             value={editFormData.maxTime.minutes}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="59"
// //                           />
// //                         </div>
// //                         <div>
// //                           <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                           <input
// //                             type="number"
// //                             name="maxSeconds"
// //                             placeholder="SS"
// //                             value={editFormData.maxTime.seconds}
// //                             onChange={handleEditInputChange}
// //                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             min="0"
// //                             max="59"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //                 {/* 2. CHANGE: Conditionally render the image block only if an image exists */}
// //                 {editFormData.image && (
// //                   <div className="mt-4 flex flex-row gap-4 items-start">
// //                     <div className="w-1/3 max-w-xs">
// //                       <img
// //                         src={editFormData.image}
// //                         alt={editFormData.imageTitle || 'Task image'}
// //                         className="w-full h-auto max-h-40 object-contain rounded-lg border border-slate-200 shadow-sm bg-white p-1"
// //                       />
// //                     </div>
// //                     <div className="flex-1 space-y-2">
// //                       <p className="text-sm font-medium text-slate-900">
// //                         {editFormData.imageTitle || 'No title'}
// //                       </p>
// //                       <p className="text-xs text-slate-600">
// //                         {editFormData.imageDescription || 'No description'}
// //                       </p>
// //                       {showEditTimeFields && (
// //                         <div className="flex items-center gap-2">
// //                           <Clock className="w-3 h-3 text-slate-500" />
// //                           <span className="text-xs text-slate-500">
// //                             {editFormData.minTime.hours !== '00' || editFormData.minTime.minutes !== '00' || editFormData.minTime.seconds !== '00'
// //                               ? `${formatTime(editFormData.minTime.hours, editFormData.minTime.minutes, editFormData.minTime.seconds)}`
// //                               : 'No min time'}
// //                             {(editFormData.minTime.hours !== '00' || editFormData.minTime.minutes !== '00' || editFormData.minTime.seconds !== '00') &&
// //                               (editFormData.maxTime.hours !== '00' || editFormData.maxTime.minutes !== '00' || editFormData.maxTime.seconds !== '00') ? ' - ' : ''}
// //                             {editFormData.maxTime.hours !== '00' || editFormData.maxTime.minutes !== '00' || editFormData.maxTime.seconds !== '00'
// //                               ? `${formatTime(editFormData.maxTime.hours, editFormData.maxTime.minutes, editFormData.maxTime.seconds)}`
// //                               : 'No max time'}
// //                           </span>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}
// //                 {showImageModal && (
// //                   <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
// //                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //                       <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
// //                       <div className="space-y-3">
// //                         <input
// //                           type="text"
// //                           name="imageTitle"
// //                           placeholder="Image Title *"
// //                           value={editFormData.imageTitle}
// //                           onChange={handleEditInputChange}
// //                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                           required
// //                         />
// //                         <textarea
// //                           name="imageDescription"
// //                           placeholder="Image Description"
// //                           value={editFormData.imageDescription}
// //                           onChange={handleEditInputChange}
// //                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                           rows={3}
// //                         />
// //                         <input
// //                           type="file"
// //                           accept="image/*"
// //                           onChange={handleImageInputChange}
// //                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
// //                         />
// //                         {editFormData.image && (
// //                           <div className="mt-2">
// //                             <img
// //                               src={editFormData.image}
// //                               alt={editFormData.imageTitle || 'Preview'}
// //                               className="max-w-full h-auto rounded-lg"
// //                             />
// //                           </div>
// //                         )}
// //                         <div className="flex gap-2">
// //                           <button
// //                             onClick={handleSaveImage}
// //                             className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                           >
// //                             Save Image
// //                           </button>
// //                           <button
// //                             onClick={handleCloseImageModal}
// //                             className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                           >
// //                             Cancel
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //                 <div className="flex gap-2 flex-wrap">
// //                   <button
// //                     onClick={handleSaveEdit}
// //                     className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={() => {
// //                       setEditItemId(null);
// //                       setShowEditTimeFields(true);
// //                       setShowImageModal(false);
// //                     }}
// //                     className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                   >
// //                     Cancel
// //                   </button>
// //                   {showEditTimeFields ? (
// //                     <button
// //                       onClick={handleResetTime}
// //                       className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-lg flex items-center gap-1"
// //                     >
// //                       <Clock className="w-4 h-4" />
// //                       Reset Time
// //                     </button>
// //                   ) : (
// //                     <button
// //                       onClick={handleSetTime}
// //                       className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg flex items-center gap-1"
// //                     >
// //                       <Clock className="w-4 h-4" />
// //                       Set Time
// //                     </button>
// //                   )}
// //                   <button
// //                     onClick={handleOpenImageModal}
// //                     className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
// //                   >
// //                     <ImageIcon className="w-4 h-4" />
// //                     Attach Image
// //                   </button>
// //                   <button
// //                     onClick={() => handleDelete(item.id)}
// //                     className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-auto"
// //                   >
// //                     <Trash className="w-3.5 h-3.5" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             <>
// //               <SortableItem
// //                 id={item.id}
// //                 title={item.title}
// //                 description={item.description}
// //                 minTime={item.minTime}
// //                 maxTime={item.maxTime}
// //                 level={level}
// //                 onEdit={handleEdit}
// //                 onDuplicate={handleDuplicate}
// //                 onAddSubtask={toggleSubtaskForm}
// //                 numbering={numbering}
// //                 showActionButtons
// //                 image={item.image}
// //                 imageTitle={item.imageTitle}
// //                 imageDescription={item.imageDescription}
// //               />
// //               {showSubtaskForms[item.id] && (
// //                 <div className="ml-4 mt-3 p-4 bg-white rounded-lg border border-slate-200">
// //                   <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Subtask</h4>
// //                   <div className="space-y-3">
// //                     <input
// //                       type="text"
// //                       name="title"
// //                       placeholder="Subtask Title *"
// //                       value={newSubtasks[item.id]?.title || ''}
// //                       onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       required
// //                     />
// //                     <textarea
// //                       name="description"
// //                       placeholder="Subtask Description"
// //                       value={newSubtasks[item.id]?.description || ''}
// //                       onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       rows={2}
// //                     />
// //                     {showSubtaskTimeFields[item.id] && (
// //                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                         <div>
// //                           <label className="block text-xs font-medium text-slate-700 mb-1">
// //                             Minimum Time
// //                           </label>
// //                           <div className="flex gap-2">
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                               <input
// //                                 type="number"
// //                                 name="minHours"
// //                                 placeholder="HH"
// //                                 value={newSubtasks[item.id]?.minTime.hours || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="24"
// //                               />
// //                             </div>
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                               <input
// //                                 type="number"
// //                                 name="minMinutes"
// //                                 placeholder="MM"
// //                                 value={newSubtasks[item.id]?.minTime.minutes || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="59"
// //                               />
// //                             </div>
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                               <input
// //                                 type="number"
// //                                 name="minSeconds"
// //                                 placeholder="SS"
// //                                 value={newSubtasks[item.id]?.minTime.seconds || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="59"
// //                               />
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <label className="block text-xs font-medium text-slate-700 mb-1">
// //                             Maximum Time
// //                           </label>
// //                           <div className="flex gap-2">
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                               <input
// //                                 type="number"
// //                                 name="maxHours"
// //                                 placeholder="HH"
// //                                 value={newSubtasks[item.id]?.maxTime.hours || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="24"
// //                               />
// //                             </div>
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                               <input
// //                                 type="number"
// //                                 name="maxMinutes"
// //                                 placeholder="MM"
// //                                 value={newSubtasks[item.id]?.maxTime.minutes || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="59"
// //                               />
// //                             </div>
// //                             <div>
// //                               <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                               <input
// //                                 type="number"
// //                                 name="maxSeconds"
// //                                 placeholder="SS"
// //                                 value={newSubtasks[item.id]?.maxTime.seconds || '00'}
// //                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 min="0"
// //                                 max="59"
// //                               />
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )}
// //                     {showSubtaskImageModal[item.id] && (
// //                       <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
// //                         <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //                           <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
// //                           <div className="space-y-3">
// //                             <input
// //                               type="text"
// //                               name="imageTitle"
// //                               placeholder="Image Title *"
// //                               value={newSubtasks[item.id]?.imageTitle || ''}
// //                               onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                               required
// //                             />
// //                             <textarea
// //                               name="imageDescription"
// //                               placeholder="Image Description"
// //                               value={newSubtasks[item.id]?.imageDescription || ''}
// //                               onChange={(e) => handleSubtaskInputChange(item.id, e)}
// //                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                               rows={3}
// //                             />
// //                             <input
// //                               type="file"
// //                               accept="image/*"
// //                               onChange={(e) => handleSubtaskImageInputChange(item.id, e)}
// //                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
// //                             />
// //                             {newSubtasks[item.id]?.image && (
// //                               <div className="mt-2">
// //                                 <img
// //                                   src={newSubtasks[item.id].image}
// //                                   alt={newSubtasks[item.id].imageTitle || 'Preview'}
// //                                   className="max-w-full h-auto rounded-lg"
// //                                 />
// //                               </div>
// //                             )}
// //                             <div className="flex gap-2">
// //                               <button
// //                                 onClick={() => handleSubtaskSaveImage(item.id)}
// //                                 className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                               >
// //                                 Save Image
// //                               </button>
// //                               <button
// //                                 onClick={() => handleCloseSubtaskImageModal(item.id)}
// //                                 className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                               >
// //                                 Cancel
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )}
// //                     <div className="flex gap-2">
// //                       <button
// //                         onClick={() => handleAddSubtask(item.id)}
// //                         className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                       >
// //                         Add
// //                       </button>
// //                       <button
// //                         onClick={() => toggleSubtaskForm(item.id)}
// //                         className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                       >
// //                         Cancel
// //                       </button>
// //                       <button
// //                         onClick={() => toggleSubtaskTimeFields(item.id)}
// //                         className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${showSubtaskTimeFields[item.id]
// //                           ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
// //                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                           }`}
// //                       >
// //                         <GiAlarmClock size={17} />
// //                         {showSubtaskTimeFields[item.id] ? 'Cancel Time' : 'Add Time'}
// //                       </button>
// //                       <button
// //                         onClick={() => handleOpenSubtaskImageModal(item.id)}
// //                         className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
// //                       >
// //                         <ImageIcon className="w-4 h-4" />
// //                         Attach Image
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //           {item.subtasks?.length > 0 && (
// //             <div className="mt-3">
// //               <SortableContext items={item.subtasks.map((s) => s.id)} strategy={verticalListSortingStrategy}>
// //                 {renderItems(item.subtasks, level + 1, parentStageId)}
// //               </SortableContext>
// //             </div>
// //           )}
// //         </div>
// //       );
// //     });
// //   return (
// //     <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
// //       <div className="flex items-center gap-10 mb-4">
// //         <Link
// //           href="/dashboard"
// //           className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md font-semibold text-gray-800 text-lg cursor-pointer"
// //         >
// //           <ArrowLeft size={20} />
// //           <span>Go Back</span>
// //         </Link>
// //         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
// //           Checklist Creation
// //         </h1>
// //       </div>
// //       <div className='max-w-7xl mx-auto'>
// //         {/* ---- TaskFlow Block ---- */}
// //         <section className="bg-white rounded-xl shadow-md p-6 mb-8">
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-xs font-medium text-slate-700 mb-2">Checklist Name*</label>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 value={checklistData.name}
// //                 onChange={handleInputChange}
// //                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Enter checklist name"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-medium text-slate-700 mb-2">Department*</label>
// //               <input
// //                 type="text"
// //                 name="department"
// //                 value={checklistData.department}
// //                 onChange={handleInputChange}
// //                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Enter department"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-medium text-slate-700 mb-2">Document Number</label>
// //               <input
// //                 type="text"
// //                 name="documentNumber"
// //                 value={checklistData.documentNumber}
// //                 onChange={handleInputChange}
// //                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Enter document number"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-medium text-slate-700 mb-2">qms_number*</label>
// //               <input
// //                 type="text"
// //                 name="qms_number"
// //                 value={checklistData.qms_number}
// //                 onChange={handleInputChange}
// //                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Enter QMS Number"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-medium text-slate-700 mb-2">Version*</label>
// //               <input
// //                 type="text"
// //                 name="version"
// //                 value={checklistData.version}
// //                 onChange={handleInputChange}
// //                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="e.g., 1.0"
// //                 required
// //               />
// //             </div>
// //             <div className="flex items-end">
// //               <button
// //                 onClick={handleSubmit}
// //                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full"
// //               >
// //                 Save Checklist
// //               </button>
// //             </div>
// //           </div>
// //         </section>
// //         {/* ---- Stages and Tasks Container ---- */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* ---- Stages Block ---- */}
// //           <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-lg font-semibold text-slate-900">Stages</h2>
// //               <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
// //                 {stages.length}
// //               </span>
// //             </div>
// //             <button
// //               onClick={() => {
// //                 const nextIndex = stages.length + 1;
// //                 const newStageItem = {
// //                   id: generateId('stage'),
// //                   title: `Stage ${nextIndex}`,
// //                   tasks: [],
// //                 };
// //                 setStages((prev) => [...prev, newStageItem]);
// //                 setSelectedStageId(newStageItem.id);
// //               }}
// //               className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
// //             >
// //               <Plus className="w-4 h-4" /> New Stage
// //             </button>
// //             <DndContext
// //               sensors={sensors}
// //               collisionDetection={closestCenter}
// //               onDragStart={handleStageDragStart}
// //               onDragEnd={handleStageDragEnd}
// //             >
// //               <SortableContext
// //                 items={stages.map((s) => s.id)}
// //                 strategy={verticalListSortingStrategy}
// //               >
// //                 <div className="space-y-2">
// //                   {stages.map((stage, idx) => (
// //                     <SortableItem
// //                       key={stage.id}
// //                       id={stage.id}
// //                       title={stage.title}
// //                       description={`${stage.tasks?.length || 0} tasks`}
// //                       level={1}
// //                       onEdit={handleEdit}
// //                       onDuplicate={handleDuplicate}
// //                       onAddSubtask={() => { }}
// //                       numbering={idx + 1}
// //                       showActionButtons={false}
// //                       onClick={setSelectedStageId}
// //                     />
// //                   ))}
// //                 </div>
// //               </SortableContext>
// //               <DragOverlay className="z-50">
// //                 {activeStageItem ? (
// //                   <div className="p-3 bg-white rounded-lg shadow-xl border border-slate-200">
// //                     <div className="font-medium text-slate-900 text-sm">
// //                       {activeStageItem.title}
// //                     </div>
// //                   </div>
// //                 ) : null}
// //               </DragOverlay>
// //             </DndContext>
// //           </div>
// //           {/* ---- Tasks and Subtasks Block ---- */}
// //           <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
// //             {selectedStageId ? (
// //               <>
// //                 <div className="flex items-center justify-between mb-6">
// //                   <div>
// //                     <h1 className="text-xl font-semibold text-slate-900">
// //                       {stages.find((s) => s.id === selectedStageId)?.title}
// //                     </h1>
// //                     <p className="text-sm text-slate-600 mt-1">
// //                       {stages.find((s) => s.id === selectedStageId)?.tasks?.length || 0} tasks
// //                     </p>
// //                   </div>
// //                   <button
// //                     onClick={() => toggleTaskForm(selectedStageId)}
// //                     className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
// //                   >
// //                     <Plus className="w-4 h-4" /> Add Task
// //                   </button>
// //                 </div>
// //                 {showTaskForms[selectedStageId] && (
// //                   <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
// //                     <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Task</h4>
// //                     <div className="space-y-3">
// //                       <input
// //                         type="text"
// //                         name="title"
// //                         placeholder="Task title *"
// //                         value={newTasks[selectedStageId]?.title || ''}
// //                         onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                         required
// //                       />
// //                       <textarea
// //                         name="description"
// //                         placeholder="Task description"
// //                         value={newTasks[selectedStageId]?.description || ''}
// //                         onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                         rows={2}
// //                       />
// //                       {showTimeFields[selectedStageId] && (
// //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                           <div>
// //                             <label className="block text-xs font-medium text-slate-700 mb-1">
// //                               Minimum Time
// //                             </label>
// //                             <div className="flex gap-2">
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                                 <input
// //                                   type="number"
// //                                   name="minHours"
// //                                   placeholder="HH"
// //                                   value={newTasks[selectedStageId]?.minTime.hours || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="24"
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                                 <input
// //                                   type="number"
// //                                   name="minMinutes"
// //                                   placeholder="MM"
// //                                   value={newTasks[selectedStageId]?.minTime.minutes || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="59"
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                                 <input
// //                                   type="number"
// //                                   name="minSeconds"
// //                                   placeholder="SS"
// //                                   value={newTasks[selectedStageId]?.minTime.seconds || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="59"
// //                                 />
// //                               </div>
// //                             </div>
// //                           </div>
// //                           <div>
// //                             <label className="block text-xs font-medium text-slate-700 mb-1">
// //                               Maximum Time
// //                             </label>
// //                             <div className="flex gap-2">
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Hours</label>
// //                                 <input
// //                                   type="number"
// //                                   name="maxHours"
// //                                   placeholder="HH"
// //                                   value={newTasks[selectedStageId]?.maxTime.hours || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="24"
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Minutes</label>
// //                                 <input
// //                                   type="number"
// //                                   name="maxMinutes"
// //                                   placeholder="MM"
// //                                   value={newTasks[selectedStageId]?.maxTime.minutes || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="59"
// //                                 />
// //                               </div>
// //                               <div>
// //                                 <label className="block text-xs text-slate-600 mb-1">Seconds</label>
// //                                 <input
// //                                   type="number"
// //                                   name="maxSeconds"
// //                                   placeholder="SS"
// //                                   value={newTasks[selectedStageId]?.maxTime.seconds || '00'}
// //                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                   min="0"
// //                                   max="59"
// //                                 />
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       )}
// //                       {showTaskImageModal[selectedStageId] && (
// //                         <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
// //                           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //                             <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
// //                             <div className="space-y-3">
// //                               <input
// //                                 type="text"
// //                                 name="imageTitle"
// //                                 placeholder="Image Title *"
// //                                 value={newTasks[selectedStageId]?.imageTitle || ''}
// //                                 onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 required
// //                               />
// //                               <textarea
// //                                 name="imageDescription"
// //                                 placeholder="Image Description"
// //                                 value={newTasks[selectedStageId]?.imageDescription || ''}
// //                                 onChange={(e) => handleTaskInputChange(selectedStageId, e)}
// //                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                                 rows={3}
// //                               />
// //                               <input
// //                                 type="file"
// //                                 accept="image/*"
// //                                 onChange={(e) => handleTaskImageInputChange(selectedStageId, e)}
// //                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
// //                               />
// //                               {newTasks[selectedStageId]?.image && (
// //                                 <div className="mt-2">
// //                                   <img
// //                                     src={newTasks[selectedStageId].image}
// //                                     alt={newTasks[selectedStageId].imageTitle || 'Preview'}
// //                                     className="max-w-full h-auto rounded-lg"
// //                                   />
// //                                 </div>
// //                               )}
// //                               <div className="flex gap-2">
// //                                 <button
// //                                   onClick={() => handleTaskSaveImage(selectedStageId)}
// //                                   className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                                 >
// //                                   Save Image
// //                                 </button>
// //                                 <button
// //                                   onClick={() => handleCloseTaskImageModal(selectedStageId)}
// //                                   className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                                 >
// //                                   Cancel
// //                                 </button>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       )}
// //                       <div className="flex gap-2 flex-wrap">
// //                         <button
// //                           onClick={() => addTask(selectedStageId)}
// //                           className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
// //                         >
// //                           Add Task
// //                         </button>
// //                         <button
// //                           onClick={() => toggleTaskForm(selectedStageId)}
// //                           className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
// //                         >
// //                           Cancel
// //                         </button>
// //                         <button
// //                           onClick={() => toggleTimeFields(selectedStageId)}
// //                           className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${showTimeFields[selectedStageId]
// //                             ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                             }`}
// //                         >
// //                           <GiAlarmClock size={17} />
// //                           {showTimeFields[selectedStageId] ? 'Cancel Time' : 'Add Time'}
// //                         </button>
// //                         <button
// //                           onClick={() => handleOpenTaskImageModal(selectedStageId)}
// //                           className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
// //                         >
// //                           <ImageIcon className="w-4 h-4" />
// //                           Attach Image
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //                 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd}>
// //                   <div className="space-y-4">
// //                     <SortableContext
// //                       items={stages.find((s) => s.id === selectedStageId)?.tasks?.map((t) => t.id) || []}
// //                       strategy={verticalListSortingStrategy}
// //                     >
// //                       {renderItems(stages.find((s) => s.id === selectedStageId)?.tasks || [], 1, selectedStageId)}
// //                     </SortableContext>
// //                   </div>
// //                   <DragOverlay className="z-50">
// //                     {activeTaskItem ? (
// //                       <SortableItem
// //                         id={activeTaskItem.id}
// //                         title={activeTaskItem.title}
// //                         description={activeTaskItem.description}
// //                         minTime={activeTaskItem.minTime}
// //                         maxTime={activeTaskItem.maxTime}
// //                         numbering={generateNumbering(stages, activeTaskItem.id)}
// //                         showActionButtons={true}
// //                         image={activeTaskItem.image}
// //                         imageTitle={activeTaskItem.imageTitle}
// //                         imageDescription={activeTaskItem.imageDescription}
// //                       />
// //                     ) : null}
// //                   </DragOverlay>
// //                 </DndContext>
// //               </>
// //             ) : (
// //               <div className="flex items-center justify-center h-full">
// //                 <div className="text-center">
// //                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                     <Plus className="w-8 h-8 text-slate-400" />
// //                   </div>
// //                   <h3 className="text-lg font-medium text-slate-900 mb-2">No stage selected</h3>
// //                   <p className="text-slate-600 text-sm">Select a stage from the sidebar to view and manage its tasks</p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';
// import { useState } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
// } from '@dnd-kit/core';
// import { ArrowLeft } from 'react-feather';
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { GiAlarmClock } from "react-icons/gi";
// import Link from 'next/link';
// /* ---------- ICONS ---------- */
// const Plus = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//   </svg>
// );
// const Edit = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//   </svg>
// );
// const Trash = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//   </svg>
// );
// const GripVertical = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zM16 5v.01M16 12v.01M16 19v.01M16 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//   </svg>
// );
// const Clock = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );
// const ImageIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );
// const Copy = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//   </svg>
// );
// /* ---------- SORTABLE ITEM ---------- */
// const SortableItem = ({
//   id,
//   title,
//   description,
//   minTime,
//   maxTime,
//   level,
//   onEdit,
//   onAddSubtask,
//   onDuplicate,
//   numbering,
//   showActionButtons,
//   onClick,
//   image,
//   imageTitle,
//   imageDescription,
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick?.(id);
//       }}
//       className={`group p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
//     >
//       <div className="flex items-start gap-3">
//         {showActionButtons && (
//           <div
//             className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 cursor-grab"
//             {...listeners}
//             {...attributes}
//           >
//             <GripVertical className="w-4 h-4" />
//           </div>
//         )}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 {numbering && (
//                   <span className="flex-shrink-0 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
//                     {numbering}
//                   </span>
//                 )}
//                 <h3 className="text-sm font-medium text-slate-900 leading-tight truncate w-[150px]">{title}</h3>
//               </div>
            
//               <div className="flex justify-between">
//                  {(minTime || maxTime) && (
//                 <div className="flex items-center gap-2 ">
//                   <Clock className="w-3 h-3 text-slate-500" />
//                   <span className="text-xs text-slate-500">
//                     {minTime && maxTime ? `${minTime} - ${maxTime}` :
//                       minTime ? `Min: ${minTime}` :
//                         maxTime ? `Max: ${maxTime}` : ''}
//                   </span>
//                 </div>
//               )}
//               {(image || imageTitle || imageDescription) && (
//                 <div className=" text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
//                   Image Attached
//                 </div>
//               )}
//               </div>
            
//             </div>
//             {showActionButtons && (
//               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onEdit(id);
//                   }}
//                   className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                   title="Edit"
//                 >
//                   <Edit className="w-3.5 h-3.5" />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDuplicate(id);
//                   }}
//                   className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
//                   title="Duplicate"
//                 >
//                   <Copy className="w-3.5 h-3.5" />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onAddSubtask(id);
//                   }}
//                   className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                   title="Add Subtask"
//                 >
//                   <Plus className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// /* ---------- MAIN COMPONENT ---------- */
// export default function NestedDragDrop() {
//   /* ---- state ---- */
//   const [stages, setStages] = useState([]);
//   const [selectedStageId, setSelectedStageId] = useState(null);
//   const [checklistData, setChecklistData] = useState({
//     name: '',
//     department: '',
//     documentNumber: '',
//     qms_number: '',
//     version: '',
//   });
//   const [showStageForm, setShowStageForm] = useState(false);
//   const [newStage, setNewStage] = useState({ title: '' });
//   const [showTaskForms, setShowTaskForms] = useState({});
//   const [newTasks, setNewTasks] = useState({});
//   const [showSubtaskForms, setShowSubtaskForms] = useState({});
//   const [newSubtasks, setNewSubtasks] = useState({});
//   const [showSubtaskTimeFields, setShowSubtaskTimeFields] = useState({});
//   const [editItemId, setEditItemId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     title: '',
//     description: '',
//     minTime: { hours: '00', minutes: '00', seconds: '00' },
//     maxTime: { hours: '00', minutes: '00', seconds: '00' },
//     image: null,
//     imageTitle: '',
//     imageDescription: '',
//   });
//   const [activeStageId, setActiveStageId] = useState(null);
//   const [activeStageItem, setActiveStageItem] = useState(null);
//   const [activeTaskId, setActiveTaskId] = useState(null);
//   const [activeTaskItem, setActiveTaskItem] = useState(null);
//   const [showTimeFields, setShowTimeFields] = useState({});
//   const [showEditTimeFields, setShowEditTimeFields] = useState(true);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showTaskImageModal, setShowTaskImageModal] = useState({});
//   const [showSubtaskImageModal, setShowSubtaskImageModal] = useState({});
//   /* ---- dnd ---- */
//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//   );
//   /* ---- helpers ---- */
//   const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//   const findItemById = (items, id) => {
//     for (const item of items) {
//       if (item.id === id) return item;
//       if (item.tasks) {
//         const foundInTasks = findItemById(item.tasks, id);
//         if (foundInTasks) return foundInTasks;
//       }
//       if (item.subtasks) {
//         const foundInSubtasks = findItemById(item.subtasks, id);
//         if (foundInSubtasks) return foundInSubtasks;
//       }
//     }
//     return null;
//   };
//   const findContainer = (items, id) => {
//     if (items.find((item) => item.id === id)) {
//       return { container: items, index: items.findIndex((item) => item.id === id) };
//     }
//     for (const item of items) {
//       if (item.tasks) {
//         const taskResult = findContainer(item.tasks, id);
//         if (taskResult) return taskResult;
//       }
//       if (item.subtasks) {
//         const subtaskResult = findContainer(item.subtasks, id);
//         if (subtaskResult) return subtaskResult;
//       }
//     }
//     return null;
//   };
//   const findItem = (items, id) => {
//     for (const item of items) {
//       if (item.id === id) return item;
//       if (item.tasks) {
//         const foundInTasks = findItem(item.tasks, id);
//         if (foundInTasks) return foundInTasks;
//       }
//       if (item.subtasks) {
//         const foundInSubtasks = findItem(item.subtasks, id);
//         if (foundInSubtasks) return foundInSubtasks;
//       }
//     }
//     return null;
//   };
//   const updateItem = (items, id, updatedData) =>
//     items.map((item) => {
//       if (item.id === id) return { ...item, ...updatedData };
//       if (item.tasks) return { ...item, tasks: updateItem(item.tasks, id, updatedData) };
//       if (item.subtasks) return { ...item, subtasks: updateItem(item.subtasks, id, updatedData) };
//       return item;
//     });
//   const deleteItem = (items, id) =>
//     items
//       .filter((item) => item.id !== id)
//       .map((item) => ({
//         ...item,
//         tasks: item.tasks ? deleteItem(item.tasks, id) : undefined,
//         subtasks: item.subtasks ? deleteItem(item.subtasks, id) : undefined,
//       }));
//   const cloneItem = (item) => ({
//     ...item,
//     id: generateId(item.id.split('-')[0]),
//     tasks: item.tasks ? item.tasks.map(cloneItem) : undefined,
//     subtasks: item.subtasks ? item.subtasks.map(cloneItem) : undefined,
//   });
//   const duplicateItemRecursive = (items, id) =>
//     items.flatMap((item) => {
//       if (item.id === id) {
//         const clonedItem = cloneItem(item);
//         // Check for duplicate title at the same level
//         if (items.some((sibling) => sibling.title.toLowerCase() === clonedItem.title.toLowerCase() && sibling.id !== item.id)) {
//           alert(`A task or subtask with the title "${clonedItem.title}" already exists at this level. Please use a different title.`);
//           return [item];
//         }
//         return [item, clonedItem];
//       }
//       let newItem = { ...item };
//       if (item.tasks) {
//         newItem = { ...newItem, tasks: duplicateItemRecursive(item.tasks, id) };
//       }
//       if (item.subtasks) {
//         newItem = { ...newItem, subtasks: duplicateItemRecursive(item.subtasks, id) };
//       }
//       return [newItem];
//     });
//   const checkDuplicateTitle = (items, newTitle, excludeId = null) => {
//     return items.some((item) => 
//       item.title.toLowerCase() === newTitle.toLowerCase() && 
//       (!excludeId || item.id !== excludeId)
//     );
//   };
//   const generateNumbering = (items, id, parentNumbers = []) => {
//     for (let i = 0; i < items.length; i++) {
//       const currentNumbers = [...parentNumbers, i + 1];
//       if (items[i].id === id) return currentNumbers.join('.');
//       if (items[i].tasks?.length) {
//         const result = generateNumbering(items[i].tasks, id, currentNumbers);
//         if (result) return result;
//       }
//       if (items[i].subtasks?.length) {
//         const result = generateNumbering(items[i].subtasks, id, currentNumbers);
//         if (result) return result;
//       }
//     }
//     return null;
//   };
//   const formatTime = (hours, minutes, seconds) => {
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };
//   const parseTime = (timeString) => {
//     if (!timeString) return { hours: '00', minutes: '00', seconds: '00' };
//     const [hours, minutes, seconds] = timeString.split(':').map(val => val.padStart(2, '0'));
//     return { hours, minutes, seconds };
//   };
//   const timeToSeconds = (hours, minutes, seconds) => {
//     return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
//   };
//   /* ---- header handlers ---- */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setChecklistData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleSubmit = () => {
//     if (!checklistData.name || !checklistData.department || !checklistData.qms_number || !checklistData.version) {
//       alert('Please fill all required fields.');
//       return;
//     }
//     console.log('Checklist Data:', checklistData, 'Stages:', stages);
//     alert('Data logged to console. Check your browser developer tools.');
//   };
//   /* ---- stage handlers ---- */
//   const handleStageInputChange = (e) => setNewStage({ title: e.target.value });
//   const addStage = () => {
//     if (!newStage.title.trim()) return alert('Stage title is required');
//     if (checkDuplicateTitle(stages, newStage.title)) {
//       return alert(`A stage with the title "${newStage.title}" already exists. Please use a different title.`);
//     }
//     const newStageItem = { id: generateId('stage'), title: newStage.title, tasks: [] };
//     setStages((prev) => [...prev, newStageItem]);
//     setNewStage({ title: '' });
//     setShowStageForm(false);
//     setSelectedStageId(newStageItem.id);
//   };
//   const handleStageDragStart = (event) => {
//     const { active } = event;
//     setActiveStageId(active.id);
//     setActiveStageItem(stages.find((stage) => stage.id === active.id));
//   };
//   const handleStageDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) {
//       setActiveStageId(null);
//       setActiveStageItem(null);
//       return;
//     }
//     setStages((prev) => {
//       const oldIndex = prev.findIndex((s) => s.id === active.id);
//       const newIndex = prev.findIndex((s) => s.id === over.id);
//       return arrayMove(prev, oldIndex, newIndex);
//     });
//     setActiveStageId(null);
//     setActiveStageItem(null);
//   };
//   /* ---- task / subtask handlers ---- */
//   const toggleTaskForm = (stageId) => {
//     setShowTaskForms((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
//     if (!newTasks[stageId]) setNewTasks((prev) => ({
//       ...prev,
//       [stageId]: {
//         title: '',
//         description: '',
//         minTime: { hours: '00', minutes: '00', seconds: '00' },
//         maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         image: null,
//         imageTitle: '',
//         imageDescription: '',
//       }
//     }));
//     setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
//     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
//   };
//   const handleTaskInputChange = (stageId, e) => {
//     const { name, value } = e.target;
//     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
//       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
//       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
//       const unitKey = unit.toLowerCase();
//       let newValue = value.replace(/^0+/, '') || '0';
//       let hours = parseInt(newTasks[stageId][timeField].hours) || 0;
//       let minutes = parseInt(newTasks[stageId][timeField].minutes) || 0;
//       let seconds = parseInt(newTasks[stageId][timeField].seconds) || 0;
//       if (unitKey === 'hours') {
//         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
//       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
//         newValue = parseInt(newValue) || 0;
//         if (newValue > 59) {
//           if (unitKey === 'seconds') {
//             minutes += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           } else if (unitKey === 'minutes') {
//             hours += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           }
//           if (hours > 24) hours = 24;
//         }
//         newValue = Math.max(0, Math.min(59, newValue)).toString();
//       }
//       setNewTasks((prev) => ({
//         ...prev,
//         [stageId]: {
//           ...prev[stageId],
//           [timeField]: {
//             ...prev[stageId][timeField],
//             hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
//             minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
//             seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
//           }
//         }
//       }));
//     } else {
//       setNewTasks((prev) => ({ ...prev, [stageId]: { ...prev[stageId], [name]: value } }));
//     }
//   };
//   const handleTaskImageInputChange = (stageId, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file.');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setNewTasks((prev) => ({
//           ...prev,
//           [stageId]: { ...prev[stageId], image: event.target.result }
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleTaskSaveImage = (stageId) => {
//     if (!newTasks[stageId]?.imageTitle.trim()) {
//       alert('Image title is required');
//       return;
//     }
//     if (!newTasks[stageId]?.image) {
//       alert('Please select an image');
//       return;
//     }
//     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
//   };
//   const addTask = (stageId) => {
//     if (!newTasks[stageId]?.title.trim()) return alert('Task title is required');
//     const stage = stages.find((s) => s.id === stageId);
//     if (checkDuplicateTitle(stage.tasks, newTasks[stageId].title)) {
//       return alert(`A task with the title "${newTasks[stageId].title}" already exists in this stage. Please use a different title.`);
//     }
//     let minTime = '';
//     let maxTime = '';
//     if (showTimeFields[stageId]) {
//       minTime = formatTime(
//         newTasks[stageId].minTime.hours,
//         newTasks[stageId].minTime.minutes,
//         newTasks[stageId].minTime.seconds
//       );
//       maxTime = formatTime(
//         newTasks[stageId].maxTime.hours,
//         newTasks[stageId].maxTime.minutes,
//         newTasks[stageId].maxTime.seconds
//       );
//       if (minTime !== '00:00:00' && maxTime !== '00:00:00') {
//         const minSeconds = timeToSeconds(
//           newTasks[stageId].minTime.hours,
//           newTasks[stageId].minTime.minutes,
//           newTasks[stageId].minTime.seconds
//         );
//         const maxSeconds = timeToSeconds(
//           newTasks[stageId].maxTime.hours,
//           newTasks[stageId].maxTime.minutes,
//           newTasks[stageId].maxTime.seconds
//         );
//         if (minSeconds > maxSeconds) {
//           return alert('Minimum time cannot be greater than maximum time');
//         }
//       }
//     }
//     setStages((prev) =>
//       prev.map((stage) =>
//         stage.id === stageId
//           ? {
//             ...stage,
//             tasks: [
//               ...stage.tasks,
//               {
//                 id: generateId('task'),
//                 title: newTasks[stageId].title,
//                 description: newTasks[stageId].description,
//                 minTime: minTime,
//                 maxTime: maxTime,
//                 subtasks: [],
//                 image: newTasks[stageId].image,
//                 imageTitle: newTasks[stageId].imageTitle,
//                 imageDescription: newTasks[stageId].imageDescription,
//               }
//             ]
//           }
//           : stage
//       )
//     );
//     setNewTasks((prev) => ({
//       ...prev,
//       [stageId]: {
//         title: '',
//         description: '',
//         minTime: { hours: '00', minutes: '00', seconds: '00' },
//         maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         image: null,
//         imageTitle: '',
//         imageDescription: '',
//       }
//     }));
//     setShowTaskForms((prev) => ({ ...prev, [stageId]: false }));
//     setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
//     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
//   };
//   const toggleSubtaskForm = (parentId) => {
//     setShowSubtaskForms((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
//     if (!newSubtasks[parentId]) {
//       setNewSubtasks((prev) => ({
//         ...prev,
//         [parentId]: {
//           title: '',
//           description: '',
//           minTime: { hours: '00', minutes: '00', seconds: '00' },
//           maxTime: { hours: '00', minutes: '00', seconds: '00' },
//           image: null,
//           imageTitle: '',
//           imageDescription: '',
//         }
//       }));
//       setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
//       setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
//     }
//   };
//   const handleSubtaskInputChange = (parentId, e) => {
//     const { name, value } = e.target;
//     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
//       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
//       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
//       const unitKey = unit.toLowerCase();
//       let newValue = value.replace(/^0+/, '') || '0';
//       let hours = parseInt(newSubtasks[parentId][timeField].hours) || 0;
//       let minutes = parseInt(newSubtasks[parentId][timeField].minutes) || 0;
//       let seconds = parseInt(newSubtasks[parentId][timeField].seconds) || 0;
//       if (unitKey === 'hours') {
//         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
//       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
//         newValue = parseInt(newValue) || 0;
//         if (newValue > 59) {
//           if (unitKey === 'seconds') {
//             minutes += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           } else if (unitKey === 'minutes') {
//             hours += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           }
//           if (hours > 24) hours = 24;
//         }
//         newValue = Math.max(0, Math.min(59, newValue)).toString();
//       }
//       setNewSubtasks((prev) => ({
//         ...prev,
//         [parentId]: {
//           ...prev[parentId],
//           [timeField]: {
//             ...prev[parentId][timeField],
//             hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
//             minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
//             seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
//           }
//         }
//       }));
//     } else {
//       setNewSubtasks((prev) => ({ ...prev, [parentId]: { ...prev[parentId], [name]: value } }));
//     }
//   };
//   const handleSubtaskImageInputChange = (parentId, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file.');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setNewSubtasks((prev) => ({
//           ...prev,
//           [parentId]: { ...prev[parentId], image: event.target.result }
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleSubtaskSaveImage = (parentId) => {
//     if (!newSubtasks[parentId]?.imageTitle.trim()) {
//       alert('Image title is required');
//       return;
//     }
//     if (!newSubtasks[parentId]?.image) {
//       alert('Please select an image');
//       return;
//     }
//     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
//   };
//   const handleAddSubtask = (parentId) => {
//     if (!newSubtasks[parentId]?.title.trim()) return alert('Subtask title is required');
//     const parentItem = findItemById(stages, parentId);
//     const parentContainer = findContainer(stages, parentId);
//     const siblings = parentContainer ? parentContainer.container : parentItem.subtasks || [];
//     if (checkDuplicateTitle(siblings, newSubtasks[parentId].title)) {
//       return alert(`A subtask with the title "${newSubtasks[parentId].title}" already exists at this level. Please use a different title.`);
//     }
//     let minTime = '';
//     let maxTime = '';
//     if (showSubtaskTimeFields[parentId]) {
//       minTime = formatTime(
//         newSubtasks[parentId].minTime.hours,
//         newSubtasks[parentId].minTime.minutes,
//         newSubtasks[parentId].minTime.seconds
//       );
//       maxTime = formatTime(
//         newSubtasks[parentId].maxTime.hours,
//         newSubtasks[parentId].maxTime.minutes,
//         newSubtasks[parentId].maxTime.seconds
//       );
//       if (minTime !== '00:00:00' && maxTime !== '00:00:00') {
//         const minSeconds = timeToSeconds(
//           newSubtasks[parentId].minTime.hours,
//           newSubtasks[parentId].minTime.minutes,
//           newSubtasks[parentId].minTime.seconds
//         );
//         const maxSeconds = timeToSeconds(
//           newSubtasks[parentId].maxTime.hours,
//           newSubtasks[parentId].maxTime.minutes,
//           newSubtasks[parentId].maxTime.seconds
//         );
//         if (minSeconds > maxSeconds) {
//           return alert('Minimum time cannot be greater than maximum time');
//         }
//       }
//     }
//     const newSubtaskItem = {
//       id: generateId('subtask'),
//       title: newSubtasks[parentId].title,
//       description: newSubtasks[parentId].description,
//       minTime: minTime,
//       maxTime: maxTime,
//       subtasks: [],
//       image: newSubtasks[parentId].image,
//       imageTitle: newSubtasks[parentId].imageTitle,
//       imageDescription: newSubtasks[parentId].imageDescription,
//     };
//     setStages((prev) => addSubtask(prev, parentId, newSubtaskItem));
//     setNewSubtasks((prev) => ({
//       ...prev,
//       [parentId]: {
//         title: '',
//         description: '',
//         minTime: { hours: '00', minutes: '00', seconds: '00' },
//         maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         image: null,
//         imageTitle: '',
//         imageDescription: '',
//       }
//     }));
//     setShowSubtaskForms((prev) => ({ ...prev, [parentId]: false }));
//     setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
//     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
//   };
//   const addSubtask = (items, parentId, newSubtaskItem) =>
//     items.map((item) => {
//       if (item.id === parentId) return { ...item, subtasks: [...(item.subtasks || []), newSubtaskItem] };
//       if (item.tasks) return { ...item, tasks: addSubtask(item.tasks, parentId, newSubtaskItem) };
//       if (item.subtasks) return { ...item, subtasks: addSubtask(item.subtasks, parentId, newSubtaskItem) };
//       return item;
//     });
//   const toggleSubtaskTimeFields = (parentId) => {
//     setShowSubtaskTimeFields((prev) => ({
//       ...prev,
//       [parentId]: !prev[parentId],
//     }));
//     if (!showSubtaskTimeFields[parentId]) {
//       setNewSubtasks((prev) => ({
//         ...prev,
//         [parentId]: {
//           ...prev[parentId],
//           minTime: { hours: '00', minutes: '00', seconds: '00' },
//           maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         },
//       }));
//     } else {
//       setNewSubtasks((prev) => ({
//         ...prev,
//         [parentId]: {
//           ...prev[parentId],
//           minTime: { hours: '00', minutes: '00', seconds: '00' },
//           maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         },
//       }));
//     }
//   };
//   const handleEdit = (id) => {
//     const item = findItemById(stages, id);
//     if (item) {
//       setEditItemId(id);
//       setEditFormData({
//         title: item.title || '',
//         description: item.description || '',
//         minTime: parseTime(item.minTime),
//         maxTime: parseTime(item.maxTime),
//         image: item.image || null,
//         imageTitle: item.imageTitle || '',
//         imageDescription: item.imageDescription || '',
//       });
//       setShowEditTimeFields(!!item.minTime || !!item.maxTime);
//     }
//   };
//   const handleDuplicate = (id) => {
//     setStages((prev) => duplicateItemRecursive(prev, id));
//   };
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     if (['minHours', 'minMinutes', 'minSeconds', 'maxHours', 'maxMinutes', 'maxSeconds'].includes(name)) {
//       const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
//       const timeField = timeType === 'min' ? 'minTime' : 'maxTime';
//       const unitKey = unit.toLowerCase();
//       let newValue = value.replace(/^0+/, '') || '0';
//       let hours = parseInt(editFormData[timeField].hours) || 0;
//       let minutes = parseInt(editFormData[timeField].minutes) || 0;
//       let seconds = parseInt(editFormData[timeField].seconds) || 0;
//       if (unitKey === 'hours') {
//         newValue = Math.max(0, Math.min(24, parseInt(newValue) || 0)).toString();
//       } else if (unitKey === 'minutes' || unitKey === 'seconds') {
//         newValue = parseInt(newValue) || 0;
//         if (newValue > 59) {
//           if (unitKey === 'seconds') {
//             minutes += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           } else if (unitKey === 'minutes') {
//             hours += Math.floor(newValue / 60);
//             newValue = newValue % 60;
//           }
//           if (hours > 24) hours = 24;
//         }
//         newValue = Math.max(0, Math.min(59, newValue)).toString();
//       }
//       setEditFormData((prev) => ({
//         ...prev,
//         [timeField]: {
//           ...prev[timeField],
//           hours: unitKey === 'hours' ? newValue.padStart(2, '0') : hours.toString().padStart(2, '0'),
//           minutes: unitKey === 'minutes' ? newValue.padStart(2, '0') : minutes.toString().padStart(2, '0'),
//           seconds: unitKey === 'seconds' ? newValue.padStart(2, '0') : seconds.toString().padStart(2, '0'),
//         }
//       }));
//     } else {
//       setEditFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };
//   const handleImageInputChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file.');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setEditFormData((prev) => ({ ...prev, image: event.target.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleSaveEdit = () => {
//     if (!editFormData.title.trim()) return alert('Title is required');
//     const parentContainer = findContainer(stages, editItemId);
//     if (parentContainer && checkDuplicateTitle(parentContainer.container, editFormData.title, editItemId)) {
//       return alert(`A task or subtask with the title "${editFormData.title}" already exists at this level. Please use a different title.`);
//     }
//     const minTime = showEditTimeFields ? formatTime(
//       editFormData.minTime.hours,
//       editFormData.minTime.minutes,
//       editFormData.minTime.seconds
//     ) : '';
//     const maxTime = showEditTimeFields ? formatTime(
//       editFormData.maxTime.hours,
//       editFormData.maxTime.minutes,
//       editFormData.maxTime.seconds
//     ) : '';
//     if (showEditTimeFields && minTime !== '00:00:00' && maxTime !== '00:00:00') {
//       const minSeconds = timeToSeconds(
//         editFormData.minTime.hours,
//         editFormData.minTime.minutes,
//         editFormData.minTime.seconds
//       );
//       const maxSeconds = timeToSeconds(
//         editFormData.maxTime.hours,
//         editFormData.maxTime.minutes,
//         editFormData.maxTime.seconds
//       );
//       if (minSeconds > maxSeconds) {
//         return alert('Minimum time cannot be greater than maximum time');
//       }
//     }
//     setStages((prev) => updateItem(prev, editItemId, {
//       title: editFormData.title,
//       description: editFormData.description,
//       minTime: minTime,
//       maxTime: maxTime,
//       image: editFormData.image,
//       imageTitle: editFormData.imageTitle,
//       imageDescription: editFormData.imageDescription,
//     }));
//     setEditItemId(null);
//     setEditFormData({
//       title: '',
//       description: '',
//       minTime: { hours: '00', minutes: '00', seconds: '00' },
//       maxTime: { hours: '00', minutes: '00', seconds: '00' },
//       image: null,
//       imageTitle: '',
//       imageDescription: '',
//     });
//     setShowEditTimeFields(true);
//     setShowImageModal(false);
//   };
//   const handleDelete = (id) => {
//     if (!confirm('Are you sure you want to delete this item?')) return;
//     setStages((prev) => {
//       const newStages = deleteItem(prev, id);
//       if (!newStages.find((s) => s.id === selectedStageId)) setSelectedStageId(newStages[0]?.id || null);
//       return newStages;
//     });
//     setEditItemId(null);
//     setShowEditTimeFields(true);
//     setShowImageModal(false);
//   };
//   const handleTaskDragStart = (event) => {
//     const { active } = event;
//     setActiveTaskId(active.id);
//     setActiveTaskItem(findItem(stages, active.id));
//   };
//   const handleTaskDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over) {
//       setActiveTaskId(null);
//       setActiveTaskItem(null);
//       return;
//     }
//     if (active.id !== over.id) {
//       setStages((prev) => {
//         const newStages = JSON.parse(JSON.stringify(prev));
//         const activeContainer = findContainer(newStages, active.id);
//         const overContainer = findContainer(newStages, over.id);
//         if (activeContainer && overContainer) {
//           const [movedItem] = activeContainer.container.splice(activeContainer.index, 1);
//           overContainer.container.splice(overContainer.index, 0, movedItem);
//         }
//         return newStages;
//       });
//     }
//     setActiveTaskId(null);
//     setActiveTaskItem(null);
//   };
//   const toggleTimeFields = (stageId) => {
//     setShowTimeFields((prev) => ({
//       ...prev,
//       [stageId]: !prev[stageId],
//     }));
//     if (!showTimeFields[stageId]) {
//       setNewTasks((prev) => ({
//         ...prev,
//         [stageId]: {
//           ...prev[stageId],
//           minTime: { hours: '00', minutes: '00', seconds: '00' },
//           maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         },
//       }));
//     } else {
//       setNewTasks((prev) => ({
//         ...prev,
//         [stageId]: {
//           ...prev[stageId],
//           minTime: { hours: '00', minutes: '00', seconds: '00' },
//           maxTime: { hours: '00', minutes: '00', seconds: '00' },
//         },
//       }));
//     }
//   };
//   const handleResetTime = () => {
//     setShowEditTimeFields(false);
//     setEditFormData((prev) => ({
//       ...prev,
//       minTime: { hours: '00', minutes: '00', seconds: '00' },
//       maxTime: { hours: '00', minutes: '00', seconds: '00' }
//     }));
//   };
//   const handleSetTime = () => {
//     setShowEditTimeFields(true);
//   };
//   const handleOpenTaskImageModal = (stageId) => {
//     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: true }));
//   };
//   const handleCloseTaskImageModal = (stageId) => {
//     setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
//   };
//   const handleOpenSubtaskImageModal = (parentId) => {
//     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: true }));
//   };
//   const handleCloseSubtaskImageModal = (parentId) => {
//     setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
//   };
//   const handleOpenImageModal = () => {
//     setShowImageModal(true);
//   };
//   const handleCloseImageModal = () => {
//     setShowImageModal(false);
//   };
//   const handleSaveImage = () => {
//     if (!editFormData.imageTitle.trim()) {
//       alert('Image title is required');
//       return;
//     }
//     if (!editFormData.image) {
//       alert('Please select an image');
//       return;
//     }
//     setStages((prev) => updateItem(prev, editItemId, {
//       image: editFormData.image,
//       imageTitle: editFormData.imageTitle,
//       imageDescription: editFormData.imageDescription,
//     }));
//     setShowImageModal(false);
//   };
//   /* ---- render ---- */
//   const renderItems = (items, level = 1, parentStageId = null) =>
//     items.map((item) => {
//       const numbering = generateNumbering(stages, item.id);
//       return (
//         <div key={item.id} className={`${level > 1 ? 'ml-6' : ''} mb-3`}>
//           {editItemId === item.id ? (
//             <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//               <h4 className="text-sm font-semibold text-slate-900 mb-3">Edit Item</h4>
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Title *"
//                   value={editFormData.title}
//                   onChange={handleEditInputChange}
//                   className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//                 <textarea
//                   name="description"
//                   placeholder="Description"
//                   value={editFormData.description}
//                   onChange={handleEditInputChange}
//                   className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows={2}
//                 />
//                 {showEditTimeFields && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-xs font-medium text-slate-700 mb-1">
//                         Minimum Time
//                       </label>
//                       <div className="flex gap-2">
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                           <input
//                             type="number"
//                             name="minHours"
//                             placeholder="HH"
//                             value={editFormData.minTime.hours}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="24"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                           <input
//                             type="number"
//                             name="minMinutes"
//                             placeholder="MM"
//                             value={editFormData.minTime.minutes}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="59"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                           <input
//                             type="number"
//                             name="minSeconds"
//                             placeholder="SS"
//                             value={editFormData.minTime.seconds}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="59"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-slate-700 mb-1">
//                         Maximum Time
//                       </label>
//                       <div className="flex gap-2">
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                           <input
//                             type="number"
//                             name="maxHours"
//                             placeholder="HH"
//                             value={editFormData.maxTime.hours}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="24"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                           <input
//                             type="number"
//                             name="maxMinutes"
//                             placeholder="MM"
//                             value={editFormData.maxTime.minutes}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="59"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                           <input
//                             type="number"
//                             name="maxSeconds"
//                             placeholder="SS"
//                             value={editFormData.maxTime.seconds}
//                             onChange={handleEditInputChange}
//                             className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             min="0"
//                             max="59"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {editFormData.image && (
//                   <div className="mt-4 flex flex-row gap-4 items-start">
//                     <div className="w-1/3 max-w-xs">
//                       <img
//                         src={editFormData.image}
//                         alt={editFormData.imageTitle || 'Task image'}
//                         className="w-full h-auto max-h-40 object-contain rounded-lg border border-slate-200 shadow-sm bg-white p-1"
//                       />
//                     </div>
//                     <div className="flex-1 space-y-2">
//                       <p className="text-sm font-medium text-slate-900">
//                         {editFormData.imageTitle || 'No title'}
//                       </p>
//                       <p className="text-xs text-slate-600">
//                         {editFormData.imageDescription || 'No description'}
//                       </p>
//                       {showEditTimeFields && (
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-3 h-3 text-slate-500" />
//                           <span className="text-xs text-slate-500">
//                             {editFormData.minTime.hours !== '00' || editFormData.minTime.minutes !== '00' || editFormData.minTime.seconds !== '00'
//                               ? `${formatTime(editFormData.minTime.hours, editFormData.minTime.minutes, editFormData.minTime.seconds)}`
//                               : 'No min time'}
//                             {(editFormData.minTime.hours !== '00' || editFormData.minTime.minutes !== '00' || editFormData.minTime.seconds !== '00') &&
//                               (editFormData.maxTime.hours !== '00' || editFormData.maxTime.minutes !== '00' || editFormData.maxTime.seconds !== '00') ? ' - ' : ''}
//                             {editFormData.maxTime.hours !== '00' || editFormData.maxTime.minutes !== '00' || editFormData.maxTime.seconds !== '00'
//                               ? `${formatTime(editFormData.maxTime.hours, editFormData.maxTime.minutes, editFormData.maxTime.seconds)}`
//                               : 'No max time'}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {showImageModal && (
//                   <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                       <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
//                       <div className="space-y-3">
//                         <input
//                           type="text"
//                           name="imageTitle"
//                           placeholder="Image Title *"
//                           value={editFormData.imageTitle}
//                           onChange={handleEditInputChange}
//                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           required
//                         />
//                         <textarea
//                           name="imageDescription"
//                           placeholder="Image Description"
//                           value={editFormData.imageDescription}
//                           onChange={handleEditInputChange}
//                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           rows={3}
//                         />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageInputChange}
//                           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
//                         />
//                         {editFormData.image && (
//                           <div className="mt-2">
//                             <img
//                               src={editFormData.image}
//                               alt={editFormData.imageTitle || 'Preview'}
//                               className="max-w-full h-auto rounded-lg"
//                             />
//                           </div>
//                         )}
//                         <div className="flex gap-2">
//                           <button
//                             onClick={handleSaveImage}
//                             className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                           >
//                             Save Image
//                           </button>
//                           <button
//                             onClick={handleCloseImageModal}
//                             className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleSaveEdit}
//                     className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditItemId(null);
//                       setShowEditTimeFields(true);
//                       setShowImageModal(false);
//                     }}
//                     className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   {showEditTimeFields ? (
//                     <button
//                       onClick={handleResetTime}
//                       className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-lg flex items-center gap-1"
//                     >
//                       <Clock className="w-4 h-4" />
//                       Reset Time
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleSetTime}
//                       className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg flex items-center gap-1"
//                     >
//                       <Clock className="w-4 h-4" />
//                       Set Time
//                     </button>
//                   )}
//                   <button
//                     onClick={handleOpenImageModal}
//                     className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
//                   >
//                     <ImageIcon className="w-4 h-4" />
//                     Attach Image
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-auto"
//                   >
//                     <Trash className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               <SortableItem
//                 id={item.id}
//                 title={item.title}
//                 description={item.description}
//                 minTime={item.minTime}
//                 maxTime={item.maxTime}
//                 level={level}
//                 onEdit={handleEdit}
//                 onDuplicate={handleDuplicate}
//                 onAddSubtask={toggleSubtaskForm}
//                 numbering={numbering}
//                 showActionButtons
//                 image={item.image}
//                 imageTitle={item.imageTitle}
//                 imageDescription={item.imageDescription}
//               />
//               {showSubtaskForms[item.id] && (
//                 <div className="ml-4 mt-3 p-4 bg-white rounded-lg border border-slate-200">
//                   <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Subtask</h4>
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       name="title"
//                       placeholder="Subtask Title *"
//                       value={newSubtasks[item.id]?.title || ''}
//                       onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                     <textarea
//                       name="description"
//                       placeholder="Subtask Description"
//                       value={newSubtasks[item.id]?.description || ''}
//                       onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       rows={2}
//                     />
//                     {showSubtaskTimeFields[item.id] && (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                         <div>
//                           <label className="block text-xs font-medium text-slate-700 mb-1">
//                             Minimum Time
//                           </label>
//                           <div className="flex gap-2">
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                               <input
//                                 type="number"
//                                 name="minHours"
//                                 placeholder="HH"
//                                 value={newSubtasks[item.id]?.minTime.hours || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="24"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                               <input
//                                 type="number"
//                                 name="minMinutes"
//                                 placeholder="MM"
//                                 value={newSubtasks[item.id]?.minTime.minutes || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="59"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                               <input
//                                 type="number"
//                                 name="minSeconds"
//                                 placeholder="SS"
//                                 value={newSubtasks[item.id]?.minTime.seconds || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="59"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-slate-700 mb-1">
//                             Maximum Time
//                           </label>
//                           <div className="flex gap-2">
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                               <input
//                                 type="number"
//                                 name="maxHours"
//                                 placeholder="HH"
//                                 value={newSubtasks[item.id]?.maxTime.hours || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="24"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                               <input
//                                 type="number"
//                                 name="maxMinutes"
//                                 placeholder="MM"
//                                 value={newSubtasks[item.id]?.maxTime.minutes || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="59"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                               <input
//                                 type="number"
//                                 name="maxSeconds"
//                                 placeholder="SS"
//                                 value={newSubtasks[item.id]?.maxTime.seconds || '00'}
//                                 onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                                 className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 min="0"
//                                 max="59"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     {showSubtaskImageModal[item.id] && (
//                       <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                           <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
//                           <div className="space-y-3">
//                             <input
//                               type="text"
//                               name="imageTitle"
//                               placeholder="Image Title *"
//                               value={newSubtasks[item.id]?.imageTitle || ''}
//                               onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                               required
//                             />
//                             <textarea
//                               name="imageDescription"
//                               placeholder="Image Description"
//                               value={newSubtasks[item.id]?.imageDescription || ''}
//                               onChange={(e) => handleSubtaskInputChange(item.id, e)}
//                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                               rows={3}
//                             />
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => handleSubtaskImageInputChange(item.id, e)}
//                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
//                             />
//                             {newSubtasks[item.id]?.image && (
//                               <div className="mt-2">
//                                 <img
//                                   src={newSubtasks[item.id].image}
//                                   alt={newSubtasks[item.id].imageTitle || 'Preview'}
//                                   className="max-w-full h-auto rounded-lg"
//                                 />
//                               </div>
//                             )}
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handleSubtaskSaveImage(item.id)}
//                                 className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                               >
//                                 Save Image
//                               </button>
//                               <button
//                                 onClick={() => handleCloseSubtaskImageModal(item.id)}
//                                 className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleAddSubtask(item.id)}
//                         className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         Add
//                       </button>
//                       <button
//                         onClick={() => toggleSubtaskForm(item.id)}
//                         className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={() => toggleSubtaskTimeFields(item.id)}
//                         className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${showSubtaskTimeFields[item.id]
//                           ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                       >
//                         <GiAlarmClock size={17} />
//                         {showSubtaskTimeFields[item.id] ? 'Cancel Time' : 'Add Time'}
//                       </button>
//                       <button
//                         onClick={() => handleOpenSubtaskImageModal(item.id)}
//                         className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
//                       >
//                         <ImageIcon className="w-4 h-4" />
//                         Attach Image
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//           {item.subtasks?.length > 0 && (
//             <div className="mt-3">
//               <SortableContext items={item.subtasks.map((s) => s.id)} strategy={verticalListSortingStrategy}>
//                 {renderItems(item.subtasks, level + 1, parentStageId)}
//               </SortableContext>
//             </div>
//           )}
//         </div>
//       );
//     });
//   return (
//     <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center gap-10 mb-4">
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md font-semibold text-gray-800 text-lg cursor-pointer"
//         >
//           <ArrowLeft size={20} />
//           <span>Go Back</span>
//         </Link>
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
//           Checklist Creation
//         </h1>
//       </div>
//       <div className='max-w-7xl mx-auto'>
//         {/* ---- TaskFlow Block ---- */}
//         <section className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-700 mb-2">Checklist Name*</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={checklistData.name}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter checklist name"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-700 mb-2">Department*</label>
//               <input
//                 type="text"
//                 name="department"
//                 value={checklistData.department}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter department"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-700 mb-2">Document Number</label>
//               <input
//                 type="text"
//                 name="documentNumber"
//                 value={checklistData.documentNumber}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter document number"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-700 mb-2">qms_number*</label>
//               <input
//                 type="text"
//                 name="qms_number"
//                 value={checklistData.qms_number}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter QMS Number"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-700 mb-2">Version*</label>
//               <input
//                 type="text"
//                 name="version"
//                 value={checklistData.version}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., 1.0"
//                 required
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full"
//               >
//                 Save Checklist
//               </button>
//             </div>
//           </div>
//         </section>
//         {/* ---- Stages and Tasks Container ---- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* ---- Stages Block ---- */}
//           <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-semibold text-slate-900">Stages</h2>
//               <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                 {stages.length}
//               </span>
//             </div>
//             <button
//               onClick={() => {
//                 const nextIndex = stages.length + 1;
//                 const newStageItem = {
//                   id: generateId('stage'),
//                   title: `Stage ${nextIndex}`,
//                   tasks: [],
//                 };
//                 setStages((prev) => [...prev, newStageItem]);
//                 setSelectedStageId(newStageItem.id);
//               }}
//               className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
//             >
//               <Plus className="w-4 h-4" /> New Stage
//             </button>
//             <DndContext
//               sensors={sensors}
//               collisionDetection={closestCenter}
//               onDragStart={handleStageDragStart}
//               onDragEnd={handleStageDragEnd}
//             >
//               <SortableContext
//                 items={stages.map((s) => s.id)}
//                 strategy={verticalListSortingStrategy}
//               >
//                 <div className="space-y-2">
//                   {stages.map((stage, idx) => (
//                     <SortableItem
//                       key={stage.id}
//                       id={stage.id}
//                       title={stage.title}
//                       description={`${stage.tasks?.length || 0} tasks`}
//                       level={1}
//                       onEdit={handleEdit}
//                       onDuplicate={handleDuplicate}
//                       onAddSubtask={() => { }}
//                       numbering={idx + 1}
//                       showActionButtons={false}
//                       onClick={setSelectedStageId}
//                     />
//                   ))}
//                 </div>
//               </SortableContext>
//               <DragOverlay className="z-50">
//                 {activeStageItem ? (
//                   <div className="p-3 bg-white rounded-lg shadow-xl border border-slate-200">
//                     <div className="font-medium text-slate-900 text-sm">
//                       {activeStageItem.title}
//                     </div>
//                   </div>
//                 ) : null}
//               </DragOverlay>
//             </DndContext>
//           </div>
//           {/* ---- Tasks and Subtasks Block ---- */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
//             {selectedStageId ? (
//               <>
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h1 className="text-xl font-semibold text-slate-900">
//                       {stages.find((s) => s.id === selectedStageId)?.title}
//                     </h1>
//                     <p className="text-sm text-slate-600 mt-1">
//                       {stages.find((s) => s.id === selectedStageId)?.tasks?.length || 0} tasks
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => toggleTaskForm(selectedStageId)}
//                     className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" /> Add Task
//                   </button>
//                 </div>
//                 {showTaskForms[selectedStageId] && (
//                   <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
//                     <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Task</h4>
//                     <div className="space-y-3">
//                       <input
//                         type="text"
//                         name="title"
//                         placeholder="Task title *"
//                         value={newTasks[selectedStageId]?.title || ''}
//                         onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                       <textarea
//                         name="description"
//                         placeholder="Task description"
//                         value={newTasks[selectedStageId]?.description || ''}
//                         onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         rows={2}
//                       />
//                       {showTimeFields[selectedStageId] && (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-700 mb-1">
//                               Minimum Time
//                             </label>
//                             <div className="flex gap-2">
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                                 <input
//                                   type="number"
//                                   name="minHours"
//                                   placeholder="HH"
//                                   value={newTasks[selectedStageId]?.minTime.hours || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="24"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                                 <input
//                                   type="number"
//                                   name="minMinutes"
//                                   placeholder="MM"
//                                   value={newTasks[selectedStageId]?.minTime.minutes || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="59"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                                 <input
//                                   type="number"
//                                   name="minSeconds"
//                                   placeholder="SS"
//                                   value={newTasks[selectedStageId]?.minTime.seconds || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="59"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-slate-700 mb-1">
//                               Maximum Time
//                             </label>
//                             <div className="flex gap-2">
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Hours</label>
//                                 <input
//                                   type="number"
//                                   name="maxHours"
//                                   placeholder="HH"
//                                   value={newTasks[selectedStageId]?.maxTime.hours || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="24"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Minutes</label>
//                                 <input
//                                   type="number"
//                                   name="maxMinutes"
//                                   placeholder="MM"
//                                   value={newTasks[selectedStageId]?.maxTime.minutes || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="59"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs text-slate-600 mb-1">Seconds</label>
//                                 <input
//                                   type="number"
//                                   name="maxSeconds"
//                                   placeholder="SS"
//                                   value={newTasks[selectedStageId]?.maxTime.seconds || '00'}
//                                   onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                   className="w-16 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   min="0"
//                                   max="59"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {showTaskImageModal[selectedStageId] && (
//                         <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//                           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                             <h4 className="text-sm font-semibold text-slate-900 mb-3">Attach Image</h4>
//                             <div className="space-y-3">
//                               <input
//                                 type="text"
//                                 name="imageTitle"
//                                 placeholder="Image Title *"
//                                 value={newTasks[selectedStageId]?.imageTitle || ''}
//                                 onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                               />
//                               <textarea
//                                 name="imageDescription"
//                                 placeholder="Image Description"
//                                 value={newTasks[selectedStageId]?.imageDescription || ''}
//                                 onChange={(e) => handleTaskInputChange(selectedStageId, e)}
//                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 rows={3}
//                               />
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleTaskImageInputChange(selectedStageId, e)}
//                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
//                               />
//                               {newTasks[selectedStageId]?.image && (
//                                 <div className="mt-2">
//                                   <img
//                                     src={newTasks[selectedStageId].image}
//                                     alt={newTasks[selectedStageId].imageTitle || 'Preview'}
//                                     className="max-w-full h-auto rounded-lg"
//                                   />
//                                 </div>
//                               )}
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleTaskSaveImage(selectedStageId)}
//                                   className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                                 >
//                                   Save Image
//                                 </button>
//                                 <button
//                                   onClick={() => handleCloseTaskImageModal(selectedStageId)}
//                                   className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       <div className="flex gap-2 flex-wrap">
//                         <button
//                           onClick={() => addTask(selectedStageId)}
//                           className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                           Add Task
//                         </button>
//                         <button
//                           onClick={() => toggleTaskForm(selectedStageId)}
//                           className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => toggleTimeFields(selectedStageId)}
//                           className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${showTimeFields[selectedStageId]
//                             ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                         >
//                           <GiAlarmClock size={17} />
//                           {showTimeFields[selectedStageId] ? 'Cancel Time' : 'Add Time'}
//                         </button>
//                         <button
//                           onClick={() => handleOpenTaskImageModal(selectedStageId)}
//                           className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
//                         >
//                           <ImageIcon className="w-4 h-4" />
//                           Attach Image
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd}>
//                   <div className="space-y-4">
//                     <SortableContext
//                       items={stages.find((s) => s.id === selectedStageId)?.tasks?.map((t) => t.id) || []}
//                       strategy={verticalListSortingStrategy}
//                     >
//                       {renderItems(stages.find((s) => s.id === selectedStageId)?.tasks || [], 1, selectedStageId)}
//                     </SortableContext>
//                   </div>
//                   <DragOverlay className="z-50">
//                     {activeTaskItem ? (
//                       <SortableItem
//                         id={activeTaskItem.id}
//                         title={activeTaskItem.title}
//                         description={activeTaskItem.description}
//                         minTime={activeTaskItem.minTime}
//                         maxTime={activeTaskItem.maxTime}
//                         numbering={generateNumbering(stages, activeTaskItem.id)}
//                         showActionButtons={true}
//                         image={activeTaskItem.image}
//                         imageTitle={activeTaskItem.imageTitle}
//                         imageDescription={activeTaskItem.imageDescription}
//                       />
//                     ) : null}
//                   </DragOverlay>
//                 </DndContext>
//               </>
//             ) : (
//               <div className="flex items-center justify-center h-full">
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Plus className="w-8 h-8 text-slate-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-slate-900 mb-2">No stage selected</h3>
//                   <p className="text-slate-600 text-sm">Select a stage from the sidebar to view and manage its tasks</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { ArrowLeft, X } from "react-feather";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Clock,
  Image as ImageIcon,
  Plus,
  Edit,
  Copy,
  Trash,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

/* ---------- VALIDATION COMPONENT ---------- */
const ErrorMessage = ({ message }) =>
  message ? <p className="text-xs text-red-600 mt-1">{message}</p> : null;

const DuplicateWarning = ({ items, value, excludeId, itemType = "Item" }) => {
  const hasDuplicate = items.some(
    (item) =>
      item.title?.toLowerCase().trim() === value?.toLowerCase().trim() &&
      (!excludeId || item.id !== excludeId)
  );
  if (!hasDuplicate || !value) return null;
  return (
    <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
        <p className="text-xs text-yellow-800">
          {itemType} "{value}" already exists. Please use a unique title.
        </p>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  items = [],
  excludeId = null,
  itemType = "Item",
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors";
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-300"
    : "border-slate-300 focus:border-blue-500";
  const hasDuplicate =
    items.length > 0 &&
    value &&
    items.some(
      (item) =>
        item.title?.toLowerCase().trim() === value?.toLowerCase().trim() &&
        (!excludeId || item.id !== excludeId)
    );
  return (
    <div
      className={`space-y-1 ${
        hasDuplicate
          ? "border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded-lg"
          : ""
      }`}
    >
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={props.type || "text"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      <ErrorMessage message={error} />
      <DuplicateWarning
        items={items}
        value={value}
        excludeId={excludeId}
        itemType={itemType}
      />
    </div>
  );
};

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 2,
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors";
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-300"
    : "border-slate-300 focus:border-blue-500";
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      <ErrorMessage message={error} />
    </div>
  );
};

/* ---------- SORTABLE ITEM ---------- */
const SortableItem = ({
  id,
  title,
  description,
  minTime,
  maxTime,
  level,
  onEdit,
  onAddSubtask,
  onDuplicate,
  numbering,
  showActionButtons,
  onClick,
  images,
  galleryTitle,
  galleryDescription,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const hasImages = images && images.length > 0;
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      className={`group p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {showActionButtons && (
          <div
            className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 cursor-grab"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {numbering && (
                  <span className="flex-shrink-0 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {numbering}
                  </span>
                )}
                <h3 className="text-sm font-medium text-slate-900 leading-tight truncate w-[150px]">
                  {title}
                </h3>
              </div>
              {description && (
                <p className="text-xs text-slate-600 mb-1 truncate">
                  {description}
                </p>
              )}
              <div className="flex justify-between">
                {(minTime || maxTime) && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {minTime && maxTime
                        ? `${minTime} - ${maxTime}`
                        : minTime
                        ? `Min: ${minTime}`
                        : maxTime
                        ? `Max: ${maxTime}`
                        : ""}
                    </span>
                  </div>
                )}
                {hasImages && (
                  <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
                    {images.length} Image
                    {galleryTitle ? `s - ${galleryTitle}` : "s"} Attached
                  </div>
                )}
              </div>
            </div>
            {showActionButtons && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Add Subtask"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */
export default function NestedDragDrop() {
  /* ---- state ---- */
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [checklistData, setChecklistData] = useState({
    name: "",
    department: "",
    documentNumber: "",
    qms_number: "",
    version: "",
  });

  // Enhanced validation states
  const [errors, setErrors] = useState({
    checklist: {
      name: "",
      department: "",
      qms_number: "",
      version: "",
    },
    taskForms: {},
    subtaskForms: {},
    editForm: {
      title: "",
      description: "",
      galleryTitle: "",
      time: "",
    },
  });

  const [showStageForm, setShowStageForm] = useState(false);
  const [newStage, setNewStage] = useState({ title: "" });
  const [stageErrors, setStageErrors] = useState({ title: "" });
  const [showTaskForms, setShowTaskForms] = useState({});
  const [newTasks, setNewTasks] = useState({});
  const [showSubtaskForms, setShowSubtaskForms] = useState({});
  const [newSubtasks, setNewSubtasks] = useState({});
  const [showSubtaskTimeFields, setShowSubtaskTimeFields] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    minTime: { hours: "00", minutes: "00", seconds: "00" },
    maxTime: { hours: "00", minutes: "00", seconds: "00" },
    images: [],
    galleryTitle: "",
    galleryDescription: "",
    bulkDescription: "",
  });
  const [activeStageId, setActiveStageId] = useState(null);
  const [activeStageItem, setActiveStageItem] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeTaskItem, setActiveTaskItem] = useState(null);
  const [showTimeFields, setShowTimeFields] = useState({});
  const [showEditTimeFields, setShowEditTimeFields] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTaskImageModal, setShowTaskImageModal] = useState({});
  const [showSubtaskImageModal, setShowSubtaskImageModal] = useState({});

  /* ---- dnd ---- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  /* ---- validation helpers ---- */
  const validateChecklistData = () => {
    const newErrors = {
      name: !checklistData.name.trim() ? "Checklist name is required" : "",
      department: !checklistData.department.trim()
        ? "Department is required"
        : "",
      qms_number: !checklistData.qms_number.trim()
        ? "QMS number is required"
        : "",
      version: !checklistData.version.trim() ? "Version is required" : "",
    };
    setErrors((prev) => ({ ...prev, checklist: newErrors }));
    return Object.values(newErrors).every((error) => !error);
  };

  const validateStage = (title) => {
    const newErrors = {
      title: !title.trim() ? "Stage title is required" : "",
    };
    setStageErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Enhanced task validation
  const validateTask = (taskData, stageId) => {
    const newErrors = {
      title: !taskData.title.trim() ? "Task title is required" : "",
      description: !taskData.description.trim()
        ? "Task Description is required"
        : "",
      galleryTitle:
        taskData.images &&
        taskData.images.length > 0 &&
        !taskData.galleryTitle.trim()
          ? "Gallery title is required when images are attached"
          : "",
    };

    // Fixed time validation
    if (showTimeFields[stageId] && taskData.minTime && taskData.maxTime) {
      const minSeconds = timeToSeconds(
        taskData.minTime.hours,
        taskData.minTime.minutes,
        taskData.minTime.seconds
      );
      const maxSeconds = timeToSeconds(
        taskData.maxTime.hours,
        taskData.maxTime.minutes,
        taskData.maxTime.seconds
      );
      if (minSeconds > maxSeconds) {
        newErrors.time = "Minimum time cannot be greater than maximum time";
      }
    }

    setErrors((prev) => ({
      ...prev,
      taskForms: {
        ...prev.taskForms,
        [stageId]: newErrors,
      },
    }));
    return Object.values(newErrors).every((error) => !error);
  };

  // Enhanced subtask validation
  const validateSubtask = (subtaskData, parentId) => {
    const newErrors = {
      title: !subtaskData.title.trim() ? "Subtask title is required" : "",
      description: !subtaskData.description.trim()
        ? "Subtask Description is required"
        : "",
    };

    // Fixed time validation
    if (
      showSubtaskTimeFields[parentId] &&
      subtaskData.minTime &&
      subtaskData.maxTime
    ) {
      const minSeconds = timeToSeconds(
        subtaskData.minTime.hours,
        subtaskData.minTime.minutes,
        subtaskData.minTime.seconds
      );
      const maxSeconds = timeToSeconds(
        subtaskData.maxTime.hours,
        subtaskData.maxTime.minutes,
        subtaskData.maxTime.seconds
      );
      if (minSeconds > maxSeconds) {
        newErrors.time = "Minimum time cannot be greater than maximum time";
      }
    }

    setErrors((prev) => ({
      ...prev,
      subtaskForms: {
        ...prev.subtaskForms,
        [parentId]: newErrors,
      },
    }));
    return Object.values(newErrors).every((error) => !error);
  };

  // Enhanced edit form validation
  const validateEditForm = () => {
    const newErrors = {
      title: !editFormData.title.trim() ? "Title is required" : "",
      description: !editFormData.description.trim()
        ? "Description is required"
        : "",
      galleryTitle:
        editFormData.images &&
        editFormData.images.length > 0 &&
        !editFormData.galleryTitle.trim()
          ? "Gallery title is required when images are attached"
          : "",
    };

    // Fixed time validation
    if (showEditTimeFields && editFormData.minTime && editFormData.maxTime) {
      const minSeconds = timeToSeconds(
        editFormData.minTime.hours,
        editFormData.minTime.minutes,
        editFormData.minTime.seconds
      );
      const maxSeconds = timeToSeconds(
        editFormData.maxTime.hours,
        editFormData.maxTime.minutes,
        editFormData.maxTime.seconds
      );
      if (minSeconds > maxSeconds) {
        newErrors.time = "Minimum time cannot be greater than maximum time";
      }
    }

    setErrors((prev) => ({ ...prev, editForm: newErrors }));
    return Object.values(newErrors).every((error) => !error);
  };

  const clearTaskErrors = (stageId) => {
    setErrors((prev) => ({
      ...prev,
      taskForms: {
        ...prev.taskForms,
        [stageId]: { title: "", description: "", galleryTitle: "", time: "" },
      },
    }));
  };

  const clearSubtaskErrors = (parentId) => {
    setErrors((prev) => ({
      ...prev,
      subtaskForms: {
        ...prev.subtaskForms,
        [parentId]: { title: "", description: "", time: "" },
      },
    }));
  };

  const clearEditErrors = () => {
    setErrors((prev) => ({
      ...prev,
      editForm: { title: "", description: "", galleryTitle: "", time: "" },
    }));
  };

  /* ---- helpers ---- */
  const generateId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.tasks) {
        const foundInTasks = findItemById(item.tasks, id);
        if (foundInTasks) return foundInTasks;
      }
      if (item.subtasks) {
        const foundInSubtasks = findItemById(item.subtasks, id);
        if (foundInSubtasks) return foundInSubtasks;
      }
    }
    return null;
  };

  const findContainer = (items, id) => {
    if (items.find((item) => item.id === id)) {
      return {
        container: items,
        index: items.findIndex((item) => item.id === id),
      };
    }
    for (const item of items) {
      if (item.tasks) {
        const taskResult = findContainer(item.tasks, id);
        if (taskResult) return taskResult;
      }
      if (item.subtasks) {
        const subtaskResult = findContainer(item.subtasks, id);
        if (subtaskResult) return subtaskResult;
      }
    }
    return null;
  };

  const findItem = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.tasks) {
        const foundInTasks = findItem(item.tasks, id);
        if (foundInTasks) return foundInTasks;
      }
      if (item.subtasks) {
        const foundInSubtasks = findItem(item.subtasks, id);
        if (foundInSubtasks) return foundInSubtasks;
      }
    }
    return null;
  };

  const updateItem = (items, id, updatedData) =>
    items.map((item) => {
      if (item.id === id) return { ...item, ...updatedData };
      if (item.tasks)
        return { ...item, tasks: updateItem(item.tasks, id, updatedData) };
      if (item.subtasks)
        return {
          ...item,
          subtasks: updateItem(item.subtasks, id, updatedData),
        };
      return item;
    });

  const deleteItem = (items, id) =>
    items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        tasks: item.tasks ? deleteItem(item.tasks, id) : undefined,
        subtasks: item.subtasks ? deleteItem(item.subtasks, id) : undefined,
      }));

  const cloneItem = (item) => ({
    ...item,
    id: generateId(item.id.split("-")[0]),
    tasks: item.tasks ? item.tasks.map(cloneItem) : undefined,
    subtasks: item.subtasks ? item.subtasks.map(cloneItem) : undefined,
  });

  const duplicateItemRecursive = (items, id) =>
    items.flatMap((item) => {
      if (item.id === id) {
        const clonedItem = cloneItem(item);
        return [item, clonedItem];
      }
      let newItem = { ...item };
      if (item.tasks) {
        newItem = { ...newItem, tasks: duplicateItemRecursive(item.tasks, id) };
      }
      if (item.subtasks) {
        newItem = {
          ...newItem,
          subtasks: duplicateItemRecursive(item.subtasks, id),
        };
      }
      return [newItem];
    });

  // Enhanced duplicate title checking
  const checkDuplicateTitle = (
    items,
    newTitle,
    excludeId = null,
    itemType = "generic"
  ) => {
    if (!newTitle || !newTitle.trim()) return false;

    const typePrefix =
      itemType === "stage"
        ? "Stage"
        : itemType === "task"
        ? "Task"
        : itemType === "subtask"
        ? "Subtask"
        : "Item";

    const hasDuplicate = items.some(
      (item) =>
        item.title?.toLowerCase().trim() === newTitle?.toLowerCase().trim() &&
        (!excludeId || item.id !== excludeId)
    );

    if (hasDuplicate) {
      toast.error(
        `${typePrefix} with title "${newTitle.trim()}" already exists at this level. Please use a unique title.`
      );
      return true;
    }
    return false;
  };

  const generateNumbering = (items, id, parentNumbers = []) => {
    for (let i = 0; i < items.length; i++) {
      const currentNumbers = [...parentNumbers, i + 1];
      if (items[i].id === id) return currentNumbers.join(".");
      if (items[i].tasks?.length) {
        const result = generateNumbering(items[i].tasks, id, currentNumbers);
        if (result) return result;
      }
      if (items[i].subtasks?.length) {
        const result = generateNumbering(items[i].subtasks, id, currentNumbers);
        if (result) return result;
      }
    }
    return null;
  };

  const formatTime = (hours, minutes, seconds) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const parseTime = (timeString) => {
    if (!timeString) return { hours: "00", minutes: "00", seconds: "00" };
    const [hours, minutes, seconds] = timeString
      .split(":")
      .map((val) => val.padStart(2, "0"));
    return { hours, minutes, seconds };
  };

  const timeToSeconds = (hours, minutes, seconds) => {
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  /* ---- header handlers ---- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChecklistData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors.checklist[name]) {
      setErrors((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, [name]: "" },
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateChecklistData()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }
    if (
      !checklistData.name ||
      !checklistData.department ||
      !checklistData.qms_number ||
      !checklistData.version
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Validate stages
    if (stages.length === 0) {
      toast.error("Please add at least one stage.");
      return;
    }

    // Validate each stage has at least one task
    let stagesWithNoTasks = [];
    for (const stage of stages) {
      if (!stage.tasks || stage.tasks.length === 0) {
        stagesWithNoTasks.push(stage.title);
      }
    }
    if (stagesWithNoTasks.length > 0) {
      const errorMessage =
        stagesWithNoTasks.length === 1
          ? `Please add at least one task to "${stagesWithNoTasks[0]}" stage.`
          : `Please add at least one task to the following stages: ${stagesWithNoTasks.join(
              ", "
            )}.`;
      toast.error(errorMessage);
      return;
    }
 const data = checklistData.append(stages);

console.log("Checklist Datas:", data);
    toast.success(
      "Data logged to console. Check your browser developer tools."
    );
  };

  const getCompletionStatus = () => {
    const checklistComplete =
      checklistData.name &&
      checklistData.department &&
      checklistData.qms_number &&
      checklistData.version;
    const hasStages = stages.length > 0;
    const allStagesHaveTasks = stages.every(
      (stage) => stage.tasks && stage.tasks.length > 0
    );
    return {
      checklistComplete,
      hasStages,
      allStagesHaveTasks,
      totalTasks: stages.reduce(
        (total, stage) => total + (stage.tasks?.length || 0),
        0
      ),
    };
  };

  /* ---- stage handlers ---- */
  const handleStageInputChange = (e) => {
    const value = e.target.value;
    setNewStage({ title: value });
    // Clear error when user starts typing
    if (stageErrors.title) {
      setStageErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const addStage = () => {
    if (!validateStage(newStage.title)) return;

    // Enhanced duplicate check for stages
    if (checkDuplicateTitle(stages, newStage.title, null, "stage")) {
      setStageErrors((prev) => ({
        ...prev,
        title: `A stage with the title "${newStage.title}" already exists. Please use a different title.`,
      }));
      return;
    }

    const newStageItem = {
      id: generateId("stage"),
      title: newStage.title.trim(),
      tasks: [],
    };
    setStages((prev) => [...prev, newStageItem]);
    setNewStage({ title: "" });
    setShowStageForm(false);
    setSelectedStageId(newStageItem.id);
    setStageErrors({ title: "" });
    toast.success(`Stage "${newStage.title}" added successfully!`);
  };

  const handleDeleteStage = (stageId) => {
    const stageToDelete = stages.find((s) => s.id === stageId);
    if (!stageToDelete) return;

    // Check if stage has tasks
    if (stageToDelete.tasks && stageToDelete.tasks.length > 0) {
      toast.error(
        `Cannot delete stage "${stageToDelete.title}". It contains ${stageToDelete.tasks.length} task(s). Please delete the tasks first.`
      );
      return;
    }

    if (stages.length === 1) {
      toast.error(
        "Cannot delete the last stage. Please create another stage first."
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the stage "${stageToDelete.title}"? This action cannot be undone.`
      )
    ) {
      setStages((prev) => {
        const newStages = prev.filter((s) => s.id !== stageId);
        // If the deleted stage was selected, select the first available stage
        if (selectedStageId === stageId) {
          setSelectedStageId(newStages[0]?.id || null);
        }
        return newStages;
      });
      toast.success(`Stage "${stageToDelete.title}" deleted successfully.`);
    }
  };

  const handleStageDragStart = (event) => {
    const { active } = event;
    setActiveStageId(active.id);
    setActiveStageItem(stages.find((stage) => stage.id === active.id));
  };

  const handleStageDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveStageId(null);
      setActiveStageItem(null);
      return;
    }
    setStages((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setActiveStageId(null);
    setActiveStageItem(null);
  };

  /* ---- task / subtask handlers ---- */
  const toggleTaskForm = (stageId) => {
    setShowTaskForms((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    if (!newTasks[stageId]) {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          title: "",
          description: "",
          minTime: { hours: "00", minutes: "00", seconds: "00" },
          maxTime: { hours: "00", minutes: "00", seconds: "00" },
          images: [],
          galleryTitle: "",
          galleryDescription: "",
        },
      }));
    }
    setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
    setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
    clearTaskErrors(stageId);
  };

  // Enhanced task input handling
  const handleTaskInputChange = (stageId, e) => {
    const { name, value } = e.target;

    // Clear specific error when user starts typing in that field
    if (errors.taskForms[stageId]?.[name]) {
      setErrors((prev) => ({
        ...prev,
        taskForms: {
          ...prev.taskForms,
          [stageId]: { ...prev.taskForms[stageId], [name]: "" },
        },
      }));
    }

    if (
      [
        "minHours",
        "minMinutes",
        "minSeconds",
        "maxHours",
        "maxMinutes",
        "maxSeconds",
      ].includes(name)
    ) {
      const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
      const timeField = timeType === "min" ? "minTime" : "maxTime";
      const unitKey = unit.toLowerCase();
      let newValue = value.replace(/^0+/, "") || "0";
      let hours = parseInt(newTasks[stageId]?.[timeField]?.hours) || 0;
      let minutes = parseInt(newTasks[stageId]?.[timeField]?.minutes) || 0;
      let seconds = parseInt(newTasks[stageId]?.[timeField]?.seconds) || 0;

      if (unitKey === "hours") {
        newValue = Math.max(
          0,
          Math.min(24, parseInt(newValue) || 0)
        ).toString();
      } else if (unitKey === "minutes" || unitKey === "seconds") {
        newValue = parseInt(newValue) || 0;
        if (newValue > 59) {
          if (unitKey === "seconds") {
            minutes += Math.floor(newValue / 60);
            newValue = newValue % 60;
          } else if (unitKey === "minutes") {
            hours += Math.floor(newValue / 60);
            newValue = newValue % 60;
          }
          if (hours > 24) hours = 24;
        }
        newValue = Math.max(0, Math.min(59, newValue)).toString();
      }

      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          [timeField]: {
            ...prev[stageId]?.[timeField],
            hours:
              unitKey === "hours"
                ? newValue.padStart(2, "0")
                : hours.toString().padStart(2, "0"),
            minutes:
              unitKey === "minutes"
                ? newValue.padStart(2, "0")
                : minutes.toString().padStart(2, "0"),
            seconds:
              unitKey === "seconds"
                ? newValue.padStart(2, "0")
                : seconds.toString().padStart(2, "0"),
          },
        },
      }));
    } else {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: { ...prev[stageId], [name]: value },
      }));
    }
  };

  // Enhanced task image handling
  const handleTaskImageInputChange = (stageId, event) => {
    const files = Array.from(event.target.files);
    const maxImages = 10;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const currentImages = newTasks[stageId]?.images || [];
    const newFiles = files.filter((file) => file.size <= maxSize);

    if (currentImages.length + newFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Convert files to image objects with preview URLs
    const imagePromises = newFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file: file,
            url: e.target.result,
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            size: file.size / (1024 * 1024),
            titleError: "",
            descriptionError: "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((newImages) => {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          images: [...(prev[stageId]?.images || []), ...newImages],
          galleryTitle: prev[stageId]?.galleryTitle || "",
          galleryDescription: prev[stageId]?.galleryDescription || "",
        },
      }));
    });
  };

  const handleRemoveSingleImage = (stageId, index) => {
    setNewTasks((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        images: prev[stageId].images.filter((_, i) => i !== index),
      },
    }));
  };

  const handleClearAllImages = (stageId) => {
    if (window.confirm("Are you sure you want to remove all images?")) {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          images: [],
          galleryTitle: "",
          galleryDescription: "",
        },
      }));
    }
  };

  const handleEditImage = (stageId, index) => {
    const currentImage = newTasks[stageId].images[index];
    const title = prompt("Edit image title:", currentImage.title);
    if (title !== null && title !== currentImage.title) {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          images: prev[stageId].images.map((img, i) =>
            i === index ? { ...img, title, titleError: "" } : img
          ),
        },
      }));
    }
  };

  const handleTaskSaveImages = async (stageId) => {
    try {
      // Validate images
      const imagesWithErrors = newTasks[stageId].images.filter(
        (img) => !img.title.trim()
      );
      if (imagesWithErrors.length > 0) {
        toast.error("All images must have titles");
        return;
      }

      const imagesData = newTasks[stageId].images.map((img) => ({
        title: img.title,
        description: img.description,
        file: img.file,
      }));

      // Your API call to save multiple images
      // await uploadMultipleImages(imagesData, stageId);

      toast.success(`Successfully attached ${imagesData.length} images`);
      handleCloseTaskImageModal(stageId);
    } catch (error) {
      console.error("Error saving images:", error);
      toast.error("Failed to save images. Please try again.");
    }
  };

  const addTask = (stageId) => {
    if (!validateTask(newTasks[stageId], stageId)) {
      return;
    }

    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;

    // Enhanced duplicate check for tasks
    if (
      checkDuplicateTitle(
        stage.tasks || [],
        newTasks[stageId].title,
        null,
        "task"
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        taskForms: {
          ...prev.taskForms,
          [stageId]: {
            ...prev.taskForms[stageId],
            title: `A task with the title "${newTasks[stageId].title}" already exists in this stage. Please use a different title.`,
          },
        },
      }));
      return;
    }

    let minTime = "";
    let maxTime = "";
    if (showTimeFields[stageId]) {
      minTime = formatTime(
        newTasks[stageId].minTime.hours,
        newTasks[stageId].minTime.minutes,
        newTasks[stageId].minTime.seconds
      );
      maxTime = formatTime(
        newTasks[stageId].maxTime.hours,
        newTasks[stageId].maxTime.minutes,
        newTasks[stageId].maxTime.seconds
      );
    }

    const newTaskItem = {
      id: generateId("task"),
      title: newTasks[stageId].title.trim(),
      description: newTasks[stageId].description?.trim() || "",
      minTime: minTime,
      maxTime: maxTime,
      subtasks: [],
      images: newTasks[stageId].images || [],
      galleryTitle: newTasks[stageId].galleryTitle?.trim() || "",
      galleryDescription: newTasks[stageId].galleryDescription?.trim() || "",
    };

    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: [...(stage.tasks || []), newTaskItem],
            }
          : stage
      )
    );

    // Reset form
    setNewTasks((prev) => ({
      ...prev,
      [stageId]: {
        title: "",
        description: "",
        minTime: { hours: "00", minutes: "00", seconds: "00" },
        maxTime: { hours: "00", minutes: "00", seconds: "00" },
        images: [],
        galleryTitle: "",
        galleryDescription: "",
      },
    }));
    setShowTaskForms((prev) => ({ ...prev, [stageId]: false }));
    setShowTimeFields((prev) => ({ ...prev, [stageId]: false }));
    setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
    clearTaskErrors(stageId);
    toast.success(`Task "${newTasks[stageId].title}" added successfully!`);
  };

  // Enhanced subtask handlers (similar fixes applied)
  const toggleSubtaskForm = (parentId) => {
    setShowSubtaskForms((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
    if (!newSubtasks[parentId]) {
      setNewSubtasks((prev) => ({
        ...prev,
        [parentId]: {
          title: "",
          description: "",
          minTime: { hours: "00", minutes: "00", seconds: "00" },
          maxTime: { hours: "00", minutes: "00", seconds: "00" },
        },
      }));
      setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
      setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
    }
    clearSubtaskErrors(parentId);
  };

  const handleSubtaskInputChange = (parentId, e) => {
    const { name, value } = e.target;

    // Clear specific error when user starts typing in that field
    if (errors.subtaskForms[parentId]?.[name]) {
      setErrors((prev) => ({
        ...prev,
        subtaskForms: {
          ...prev.subtaskForms,
          [parentId]: { ...prev.subtaskForms[parentId], [name]: "" },
        },
      }));
    }

    if (
      [
        "minHours",
        "minMinutes",
        "minSeconds",
        "maxHours",
        "maxMinutes",
        "maxSeconds",
      ].includes(name)
    ) {
      const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
      const timeField = timeType === "min" ? "minTime" : "maxTime";
      const unitKey = unit.toLowerCase();
      let newValue = value.replace(/^0+/, "") || "0";
      let hours = parseInt(newSubtasks[parentId]?.[timeField]?.hours) || 0;
      let minutes = parseInt(newSubtasks[parentId]?.[timeField]?.minutes) || 0;
      let seconds = parseInt(newSubtasks[parentId]?.[timeField]?.seconds) || 0;

      if (unitKey === "hours") {
        newValue = Math.max(
          0,
          Math.min(24, parseInt(newValue) || 0)
        ).toString();
      } else if (unitKey === "minutes" || unitKey === "seconds") {
        newValue = parseInt(newValue) || 0;
        if (newValue > 59) {
          if (unitKey === "seconds") {
            minutes += Math.floor(newValue / 60);
            newValue = newValue % 60;
          } else if (unitKey === "minutes") {
            hours += Math.floor(newValue / 60);
            newValue = newValue % 60;
          }
          if (hours > 24) hours = 24;
        }
        newValue = Math.max(0, Math.min(59, newValue)).toString();
      }

      setNewSubtasks((prev) => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          [timeField]: {
            ...prev[parentId]?.[timeField],
            hours:
              unitKey === "hours"
                ? newValue.padStart(2, "0")
                : hours.toString().padStart(2, "0"),
            minutes:
              unitKey === "minutes"
                ? newValue.padStart(2, "0")
                : minutes.toString().padStart(2, "0"),
            seconds:
              unitKey === "seconds"
                ? newValue.padStart(2, "0")
                : seconds.toString().padStart(2, "0"),
          },
        },
      }));
    } else {
      setNewSubtasks((prev) => ({
        ...prev,
        [parentId]: { ...prev[parentId], [name]: value },
      }));
    }
  };

  const handleAddSubtask = (parentId) => {
    if (!validateSubtask(newSubtasks[parentId], parentId)) {
      return;
    }

    const parentItem = findItemById(stages, parentId);
    const parentContainer = findContainer(stages, parentId);
    const siblings = parentContainer
      ? parentContainer.container
      : parentItem?.subtasks || [];

    if (!parentItem) {
      toast.error("Parent item not found");
      return;
    }

    // Enhanced duplicate check for subtasks
    if (
      checkDuplicateTitle(
        siblings,
        newSubtasks[parentId].title,
        null,
        "subtask"
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        subtaskForms: {
          ...prev.subtaskForms,
          [parentId]: {
            ...prev.subtaskForms[parentId],
            title: `A subtask with the title "${newSubtasks[parentId].title}" already exists at this level. Please use a different title.`,
          },
        },
      }));
      return;
    }

    let minTime = "";
    let maxTime = "";
    if (showSubtaskTimeFields[parentId]) {
      minTime = formatTime(
        newSubtasks[parentId].minTime.hours,
        newSubtasks[parentId].minTime.minutes,
        newSubtasks[parentId].minTime.seconds
      );
      maxTime = formatTime(
        newSubtasks[parentId].maxTime.hours,
        newSubtasks[parentId].maxTime.minutes,
        newSubtasks[parentId].maxTime.seconds
      );
    }

    const newSubtaskItem = {
      id: generateId("subtask"),
      title: newSubtasks[parentId].title.trim(),
      description: newSubtasks[parentId].description?.trim() || "",
      minTime: minTime,
      maxTime: maxTime,
      subtasks: [],
      image: newSubtasks[parentId].image,
      imageTitle: newSubtasks[parentId].imageTitle?.trim() || "",
      imageDescription: newSubtasks[parentId].imageDescription?.trim() || "",
    };

    setStages((prev) => addSubtask(prev, parentId, newSubtaskItem));

    // Reset form
    setNewSubtasks((prev) => ({
      ...prev,
      [parentId]: {
        title: "",
        description: "",
        minTime: { hours: "00", minutes: "00", seconds: "00" },
        maxTime: { hours: "00", minutes: "00", seconds: "00" },
        image: null,
        imageTitle: "",
        imageDescription: "",
      },
    }));
    setShowSubtaskForms((prev) => ({ ...prev, [parentId]: false }));
    setShowSubtaskTimeFields((prev) => ({ ...prev, [parentId]: false }));
    setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
    clearSubtaskErrors(parentId);
    toast.success(
      `Subtask "${newSubtasks[parentId].title}" added successfully!`
    );
  };

  const addSubtask = (items, parentId, newSubtaskItem) =>
    items.map((item) => {
      if (item.id === parentId)
        return {
          ...item,
          subtasks: [...(item.subtasks || []), newSubtaskItem],
        };
      if (item.tasks)
        return {
          ...item,
          tasks: addSubtask(item.tasks, parentId, newSubtaskItem),
        };
      if (item.subtasks)
        return {
          ...item,
          subtasks: addSubtask(item.subtasks, parentId, newSubtaskItem),
        };
      return item;
    });

  const toggleSubtaskTimeFields = (parentId) => {
    setShowSubtaskTimeFields((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
    if (!showSubtaskTimeFields[parentId]) {
      setNewSubtasks((prev) => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          minTime: { hours: "00", minutes: "00", seconds: "00" },
          maxTime: { hours: "00", minutes: "00", seconds: "00" },
        },
      }));
    }
  };

  // Enhanced edit handlers
  const handleEdit = (id) => {
    const item = findItemById(stages, id);
    if (item) {
      setEditItemId(id);
      setEditFormData({
        title: item.title || "",
        description: item.description || "",
        minTime: parseTime(item.minTime),
        maxTime: parseTime(item.maxTime),
        images: item.images || [],
        galleryTitle: item.galleryTitle || "",
        galleryDescription: item.galleryDescription || "",
        bulkDescription: "",
      });
      setShowEditTimeFields(!!item.minTime || !!item.maxTime);
      clearEditErrors();
    }
  };

  const handleDuplicate = (id) => {
    setStages((prev) => duplicateItemRecursive(prev, id));
    toast.success("Item duplicated successfully!");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    // Clear specific error when user starts typing in that field
    if (errors.editForm[name]) {
      setErrors((prev) => ({
        ...prev,
        editForm: { ...prev.editForm, [name]: "" },
      }));
    }

    if (
      [
        "minHours",
        "minMinutes",
        "minSeconds",
        "maxHours",
        "maxMinutes",
        "maxSeconds",
      ].includes(name)
    ) {
      const [timeType, unit] = name.split(/(Hours|Minutes|Seconds)/);
      const timeField = timeType === "min" ? "minTime" : "maxTime";
      const unitKey = unit.toLowerCase();
      let newValue = value.replace(/^0+/, "") || "0";
      let hours = parseInt(editFormData[timeField].hours) || 0;
      let minutes = parseInt(editFormData[timeField].minutes) || 0;
      let seconds = parseInt(editFormData[timeField].seconds) || 0;

      if (unitKey === "hours") {
        newValue = Math.max(
          0,
          Math.min(24, parseInt(newValue) || 0)
        ).toString();
      } else if (unitKey === "minutes" || unitKey === "seconds") {
        newValue = parseInt(newValue) || 0;
        if (newValue > 59) {
          if (unitKey === "seconds") {
            minutes += Math.floor(newValue / 60);
            newValue = newValue % 60;
          } else if (unitKey === "minutes") {
            hours += Math.floor(newValue / 60);
            newValue = newValue % 60;
          }
          if (hours > 24) hours = 24;
        }
        newValue = Math.max(0, Math.min(59, newValue)).toString();
      }

      setEditFormData((prev) => ({
        ...prev,
        [timeField]: {
          ...prev[timeField],
          hours:
            unitKey === "hours"
              ? newValue.padStart(2, "0")
              : hours.toString().padStart(2, "0"),
          minutes:
            unitKey === "minutes"
              ? newValue.padStart(2, "0")
              : minutes.toString().padStart(2, "0"),
          seconds:
            unitKey === "seconds"
              ? newValue.padStart(2, "0")
              : seconds.toString().padStart(2, "0"),
        },
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = () => {
    if (!validateEditForm()) {
      return;
    }

    const parentContainer = findContainer(stages, editItemId);
    if (!parentContainer) {
      toast.error("Parent container not found");
      return;
    }

    const currentItem = findItemById(stages, editItemId);
    if (currentItem) {
      const itemType = currentItem.id.startsWith("task")
        ? "task"
        : currentItem.id.startsWith("subtask")
        ? "subtask"
        : "item";

      if (
        checkDuplicateTitle(
          parentContainer.container,
          editFormData.title,
          editItemId,
          itemType
        )
      ) {
        setErrors((prev) => ({
          ...prev,
          editForm: {
            ...prev.editForm,
            title: `An ${itemType} with the title "${editFormData.title}" already exists at this level. Please use a different title.`,
          },
        }));
        return;
      }
    }

    const minTime = showEditTimeFields
      ? formatTime(
          editFormData.minTime.hours,
          editFormData.minTime.minutes,
          editFormData.minTime.seconds
        )
      : "";
    const maxTime = showEditTimeFields
      ? formatTime(
          editFormData.maxTime.hours,
          editFormData.maxTime.minutes,
          editFormData.maxTime.seconds
        )
      : "";

    setStages((prev) =>
      updateItem(prev, editItemId, {
        title: editFormData.title.trim(),
        description: editFormData.description?.trim() || "",
        minTime: minTime,
        maxTime: maxTime,
        images: editFormData.images,
        galleryTitle: editFormData.galleryTitle?.trim() || "",
        galleryDescription: editFormData.galleryDescription?.trim() || "",
      })
    );

    setEditItemId(null);
    setEditFormData({
      title: "",
      description: "",
      minTime: { hours: "00", minutes: "00", seconds: "00" },
      maxTime: { hours: "00", minutes: "00", seconds: "00" },
      images: [],
      galleryTitle: "",
      galleryDescription: "",
      bulkDescription: "",
    });
    setShowEditTimeFields(true);
    setShowImageModal(false);
    clearEditErrors();
    toast.success(`"${editFormData.title}" updated successfully!`);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setStages((prev) => {
      const newStages = deleteItem(prev, id);
      if (!newStages.find((s) => s.id === selectedStageId))
        setSelectedStageId(newStages[0]?.id || null);
      return newStages;
    });
    setEditItemId(null);
    setShowEditTimeFields(true);
    setShowImageModal(false);
    toast.success("Item deleted successfully!");
  };

  const handleTaskDragStart = (event) => {
    const { active } = event;
    setActiveTaskId(active.id);
    setActiveTaskItem(findItem(stages, active.id));
  };

  const handleTaskDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveTaskId(null);
      setActiveTaskItem(null);
      return;
    }
    if (active.id !== over.id) {
      setStages((prev) => {
        const newStages = JSON.parse(JSON.stringify(prev));
        const activeContainer = findContainer(newStages, active.id);
        const overContainer = findContainer(newStages, over.id);
        if (activeContainer && overContainer) {
          const [movedItem] = activeContainer.container.splice(
            activeContainer.index,
            1
          );
          overContainer.container.splice(overContainer.index, 0, movedItem);
        }
        return newStages;
      });
    }
    setActiveTaskId(null);
    setActiveTaskItem(null);
  };

  const toggleTimeFields = (stageId) => {
    setShowTimeFields((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
    if (!showTimeFields[stageId]) {
      setNewTasks((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          minTime: { hours: "00", minutes: "00", seconds: "00" },
          maxTime: { hours: "00", minutes: "00", seconds: "00" },
        },
      }));
    }
  };

  const handleResetTime = () => {
    setShowEditTimeFields(false);
    setEditFormData((prev) => ({
      ...prev,
      minTime: { hours: "00", minutes: "00", seconds: "00" },
      maxTime: { hours: "00", minutes: "00", seconds: "00" },
    }));
  };

  const handleSetTime = () => {
    setShowEditTimeFields(true);
  };

  const handleOpenTaskImageModal = (stageId) => {
    setShowTaskImageModal((prev) => ({ ...prev, [stageId]: true }));
  };

  const handleCloseTaskImageModal = (stageId) => {
    setShowTaskImageModal((prev) => ({ ...prev, [stageId]: false }));
  };

  const handleOpenSubtaskImageModal = (parentId) => {
    setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: true }));
  };

  const handleCloseSubtaskImageModal = (parentId) => {
    setShowSubtaskImageModal((prev) => ({ ...prev, [parentId]: false }));
  };

  const handleOpenImageModal = () => {
    setShowImageModal(true);
  };

  /* ---- render ---- */
  const renderItems = (items, level = 1, parentStageId = null) =>
    items.map((item) => {
      const numbering = generateNumbering(stages, item.id);
      return (
        <div key={item.id} className={`${level > 1 ? "ml-6" : ""} mb-3`}>
          {editItemId === item.id ? (
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Edit Item
              </h4>
              <div className="space-y-3">
                <InputField
                  label="Title"
                  name="title"
                  placeholder="Title *"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  required
                  error={errors.editForm.title}
                  items={findContainer(stages, item.id)?.container || []}
                  excludeId={item.id}
                  itemType="Item"
                />
                <TextAreaField
                  label="Description"
                  name="description"
                  placeholder="Description *"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  required
                  error={errors.editForm.description}
                />
                {showEditTimeFields && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Minimum Time
                      </label>
                      <div className="flex gap-2">
                        <InputField
                          type="number"
                          name="minHours"
                          placeholder="HH"
                          value={editFormData.minTime.hours}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="24"
                        />
                        <InputField
                          type="number"
                          name="minMinutes"
                          placeholder="MM"
                          value={editFormData.minTime.minutes}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="59"
                        />
                        <InputField
                          type="number"
                          name="minSeconds"
                          placeholder="SS"
                          value={editFormData.minTime.seconds}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="59"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Maximum Time
                      </label>
                      <div className="flex gap-2">
                        <InputField
                          type="number"
                          name="maxHours"
                          placeholder="HH"
                          value={editFormData.maxTime.hours}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="24"
                        />
                        <InputField
                          type="number"
                          name="maxMinutes"
                          placeholder="MM"
                          value={editFormData.maxTime.minutes}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="59"
                        />
                        <InputField
                          type="number"
                          name="maxSeconds"
                          placeholder="SS"
                          value={editFormData.maxTime.seconds}
                          onChange={handleEditInputChange}
                          className="w-16"
                          min="0"
                          max="59"
                        />
                      </div>
                    </div>
                    <ErrorMessage message={errors.editForm.time} />
                  </div>
                )}
                {editFormData.images && editFormData.images.length > 0 && (
                  <div className="space-y-3">
                    <InputField
                      label="Gallery Title"
                      name="galleryTitle"
                      placeholder="Gallery Title *"
                      value={editFormData.galleryTitle}
                      onChange={handleEditInputChange}
                      required
                      error={errors.editForm.galleryTitle}
                    />
                    <TextAreaField
                      label="Gallery Description"
                      name="galleryDescription"
                      placeholder="Gallery Description"
                      value={editFormData.galleryDescription}
                      onChange={handleEditInputChange}
                      rows={3}
                    />
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditItemId(null);
                      setShowEditTimeFields(true);
                      setShowImageModal(false);
                      clearEditErrors();
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  {showEditTimeFields ? (
                    <button
                      onClick={handleResetTime}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-lg flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      Reset Time
                    </button>
                  ) : (
                    <button
                      onClick={handleSetTime}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm rounded-lg flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      Set Time
                    </button>
                  )}
                  <button
                    onClick={handleOpenImageModal}
                    className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {editFormData.images && editFormData.images.length > 0
                      ? `Edit ${editFormData.images.length} Image${
                          editFormData.images.length > 1 ? "s" : ""
                        }`
                      : "Attach Images"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-auto"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <SortableItem
                id={item.id}
                title={item.title}
                description={item.description}
                minTime={item.minTime}
                maxTime={item.maxTime}
                level={level}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onAddSubtask={toggleSubtaskForm}
                numbering={numbering}
                showActionButtons={level > 0}
                images={item.images}
                galleryTitle={item.galleryTitle}
                galleryDescription={item.galleryDescription}
              />
              {showSubtaskForms[item.id] && (
                <div className="ml-4 mt-3 p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Add Subtask
                  </h4>
                  <div className="space-y-3">
                    <InputField
                      label="Subtask Title"
                      name="title"
                      placeholder="Subtask Title *"
                      value={newSubtasks[item.id]?.title || ""}
                      onChange={(e) => handleSubtaskInputChange(item.id, e)}
                      required
                      error={errors.subtaskForms[item.id]?.title}
                      items={item.subtasks || []}
                      itemType="Subtask"
                    />
                    <TextAreaField
                      label="Subtask Description"
                      name="description"
                      placeholder="Subtask Description *"
                      value={newSubtasks[item.id]?.description || ""}
                      onChange={(e) => handleSubtaskInputChange(item.id, e)}
                      required
                      error={errors.subtaskForms[item.id]?.description}
                    />
                    {showSubtaskTimeFields[item.id] && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Minimum Time
                          </label>
                          <div className="flex gap-2">
                            <InputField
                              type="number"
                              name="minHours"
                              placeholder="HH"
                              value={
                                newSubtasks[item.id]?.minTime.hours || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="24"
                            />
                            <InputField
                              type="number"
                              name="minMinutes"
                              placeholder="MM"
                              value={
                                newSubtasks[item.id]?.minTime.minutes || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="59"
                            />
                            <InputField
                              type="number"
                              name="minSeconds"
                              placeholder="SS"
                              value={
                                newSubtasks[item.id]?.minTime.seconds || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="59"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Maximum Time
                          </label>
                          <div className="flex gap-2">
                            <InputField
                              type="number"
                              name="maxHours"
                              placeholder="HH"
                              value={
                                newSubtasks[item.id]?.maxTime.hours || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="24"
                            />
                            <InputField
                              type="number"
                              name="maxMinutes"
                              placeholder="MM"
                              value={
                                newSubtasks[item.id]?.maxTime.minutes || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="59"
                            />
                            <InputField
                              type="number"
                              name="maxSeconds"
                              placeholder="SS"
                              value={
                                newSubtasks[item.id]?.maxTime.seconds || "00"
                              }
                              onChange={(e) =>
                                handleSubtaskInputChange(item.id, e)
                              }
                              className="w-16"
                              min="0"
                              max="59"
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          message={errors.subtaskForms[item.id]?.time}
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddSubtask(item.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => toggleSubtaskForm(item.id)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => toggleSubtaskTimeFields(item.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                          showSubtaskTimeFields[item.id]
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Clock size={17} />
                        {showSubtaskTimeFields[item.id]
                          ? "Cancel Time"
                          : "Add Time"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {item.subtasks?.length > 0 && (
            <div className="mt-3">
              <SortableContext
                items={item.subtasks.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {renderItems(item.subtasks, level + 1, parentStageId)}
              </SortableContext>
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <Toaster />
      <div className="flex items-center gap-10 mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md font-semibold text-gray-800 text-lg cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Checklist Creation
        </h1>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* ---- TaskFlow Block ---- */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <InputField
                label="Checklist Name"
                name="name"
                value={checklistData.name}
                onChange={handleInputChange}
                placeholder="Enter checklist name"
                required
                error={errors.checklist.name}
              />
            </div>
            <div>
              <InputField
                label="Department"
                name="department"
                value={checklistData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
                required
                error={errors.checklist.department}
              />
            </div>
            <div>
              <InputField
                label="Document Number"
                name="documentNumber"
                value={checklistData.documentNumber}
                onChange={handleInputChange}
                placeholder="Enter document number"
                error={errors.checklist.documentNumber}
              />
            </div>
            <div>
              <InputField
                label="QMS Number"
                name="qms_number"
                value={checklistData.qms_number}
                onChange={handleInputChange}
                placeholder="Enter QMS Number"
                required
                error={errors.checklist.qms_number}
              />
            </div>
            <div>
              <InputField
                label="Version"
                name="version"
                value={checklistData.version}
                onChange={handleInputChange}
                placeholder="e.g., 1.0"
                required
                error={errors.checklist.version}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full"
              >
                Save Checklist
              </button>
            </div>
          </div>
        </section>

        {/* ---- Stages and Tasks Container ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---- Stages Block ---- */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Stages</h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {stages.length}
              </span>
            </div>
            <button
              onClick={() => {
                const nextIndex = stages.length + 1;
                const newStageItem = {
                  id: generateId("stage"),
                  title: `Stage ${nextIndex}`,
                  tasks: [],
                };
                setStages((prev) => [...prev, newStageItem]);
                setSelectedStageId(newStageItem.id);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" /> New Stage
            </button>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleStageDragStart}
              onDragEnd={handleStageDragEnd}
            >
              <SortableContext
                items={stages.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {stages.map((stage, idx) => (
                    <div key={stage.id} className="relative group/stage">
                      <SortableItem
                        id={stage.id}
                        title={stage.title}
                        description={`${stage.tasks?.length || 0} tasks`}
                        level={1}
                        onEdit={() => {}}
                        onDuplicate={() => {}}
                        onAddSubtask={() => {}}
                        numbering={idx + 1}
                        showActionButtons={false}
                        onClick={setSelectedStageId}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStage(stage.id);
                        }}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover/stage:opacity-100 z-10 shadow-lg"
                        title={`Delete stage "${stage.title}"`}
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </SortableContext>
              <DragOverlay className="z-50">
                {activeStageItem ? (
                  <div className="p-3 bg-white rounded-lg shadow-xl border border-slate-200">
                    <div className="font-medium text-slate-900 text-sm">
                      {activeStageItem.title}
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* ---- Tasks and Subtasks Block ---- */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            {selectedStageId ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                      {stages.find((s) => s.id === selectedStageId)?.title}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      {stages.find((s) => s.id === selectedStageId)?.tasks
                        ?.length || 0}{" "}
                      tasks
                    </p>
                  </div>
                  <button
                    onClick={() => toggleTaskForm(selectedStageId)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>

                {showTaskForms[selectedStageId] && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      Add Task
                    </h4>
                    <div className="space-y-3">
                      <InputField
                        label="Task Title"
                        name="title"
                        placeholder="Task title *"
                        value={newTasks[selectedStageId]?.title || ""}
                        onChange={(e) =>
                          handleTaskInputChange(selectedStageId, e)
                        }
                        required
                        error={errors.taskForms[selectedStageId]?.title}
                        items={
                          stages.find((s) => s.id === selectedStageId)?.tasks ||
                          []
                        }
                        itemType="Task"
                      />
                      <TextAreaField
                        label="Task Description"
                        name="description"
                        placeholder="Task description *"
                        value={newTasks[selectedStageId]?.description || ""}
                        onChange={(e) =>
                          handleTaskInputChange(selectedStageId, e)
                        }
                        required
                        error={errors.taskForms[selectedStageId]?.description}
                      />
                      {showTimeFields[selectedStageId] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Minimum Time
                            </label>
                            <div className="flex gap-2">
                              <InputField
                                type="number"
                                name="minHours"
                                placeholder="HH"
                                value={
                                  newTasks[selectedStageId]?.minTime.hours ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="24"
                              />
                              <InputField
                                type="number"
                                name="minMinutes"
                                placeholder="MM"
                                value={
                                  newTasks[selectedStageId]?.minTime.minutes ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="59"
                              />
                              <InputField
                                type="number"
                                name="minSeconds"
                                placeholder="SS"
                                value={
                                  newTasks[selectedStageId]?.minTime.seconds ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="59"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Maximum Time
                            </label>
                            <div className="flex gap-2">
                              <InputField
                                type="number"
                                name="maxHours"
                                placeholder="HH"
                                value={
                                  newTasks[selectedStageId]?.maxTime.hours ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="24"
                              />
                              <InputField
                                type="number"
                                name="maxMinutes"
                                placeholder="MM"
                                value={
                                  newTasks[selectedStageId]?.maxTime.minutes ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="59"
                              />
                              <InputField
                                type="number"
                                name="maxSeconds"
                                placeholder="SS"
                                value={
                                  newTasks[selectedStageId]?.maxTime.seconds ||
                                  "00"
                                }
                                onChange={(e) =>
                                  handleTaskInputChange(selectedStageId, e)
                                }
                                className="w-16"
                                min="0"
                                max="59"
                              />
                            </div>
                          </div>
                          <ErrorMessage
                            message={errors.taskForms[selectedStageId]?.time}
                          />
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => addTask(selectedStageId)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => toggleTaskForm(selectedStageId)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => toggleTimeFields(selectedStageId)}
                          className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                            showTimeFields[selectedStageId]
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <Clock size={17} />
                          {showTimeFields[selectedStageId]
                            ? "Cancel Time"
                            : "Add Time"}
                        </button>
                        <button
                          onClick={() =>
                            handleOpenTaskImageModal(selectedStageId)
                          }
                          className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm rounded-lg flex items-center gap-1"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {newTasks[selectedStageId]?.images &&
                          newTasks[selectedStageId].images.length > 0
                            ? `Edit ${
                                newTasks[selectedStageId].images.length
                              } Image${
                                newTasks[selectedStageId].images.length > 1
                                  ? "s"
                                  : ""
                              }`
                            : "Attach Images"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleTaskDragStart}
                  onDragEnd={handleTaskDragEnd}
                >
                  <div className="space-y-4">
                    <SortableContext
                      items={
                        stages
                          .find((s) => s.id === selectedStageId)
                          ?.tasks?.map((t) => t.id) || []
                      }
                      strategy={verticalListSortingStrategy}
                    >
                      {renderItems(
                        stages.find((s) => s.id === selectedStageId)?.tasks ||
                          [],
                        1,
                        selectedStageId
                      )}
                    </SortableContext>
                  </div>
                  <DragOverlay className="z-50">
                    {activeTaskItem ? (
                      <SortableItem
                        id={activeTaskItem.id}
                        title={activeTaskItem.title}
                        description={activeTaskItem.description}
                        minTime={activeTaskItem.minTime}
                        maxTime={activeTaskItem.maxTime}
                        numbering={generateNumbering(stages, activeTaskItem.id)}
                        showActionButtons={true}
                        images={activeTaskItem.images}
                        galleryTitle={activeTaskItem.galleryTitle}
                        galleryDescription={activeTaskItem.galleryDescription}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No stage selected
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Select a stage from the sidebar to view and manage its tasks
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Task Image Modal - Fixed positioning */}
          {showTaskImageModal[selectedStageId] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => handleCloseTaskImageModal(selectedStageId)}
              />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Attach Images</h4>
                        <p className="text-blue-100 text-sm">
                          Add multiple visual references for this task
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCloseTaskImageModal(selectedStageId)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Form Fields */}
                    <div className="space-y-4">
                      <InputField
                        label="Gallery Title"
                        name="galleryTitle"
                        placeholder="Enter a title for this image gallery (required)"
                        value={newTasks[selectedStageId]?.galleryTitle || ""}
                        onChange={(e) =>
                          handleTaskInputChange(selectedStageId, e)
                        }
                        required
                        error={errors.taskForms[selectedStageId]?.galleryTitle}
                      />
                      <TextAreaField
                        label="Gallery Description"
                        name="galleryDescription"
                        placeholder="Describe what these images show..."
                        value={
                          newTasks[selectedStageId]?.galleryDescription || ""
                        }
                        onChange={(e) =>
                          handleTaskInputChange(selectedStageId, e)
                        }
                        rows={3}
                      />
                    </div>

                    {/* Multiple Image Upload Section */}
                    <div className="space-y-4">
                      {!newTasks[selectedStageId]?.images ||
                      newTasks[selectedStageId].images.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50 hover:bg-blue-50/25">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-sm font-medium text-gray-900">
                                Upload images
                              </h5>
                              <p className="text-xs text-gray-500">
                                Select multiple images (PNG, JPG, GIF up to 10MB
                                each)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) =>
                                handleTaskImageInputChange(selectedStageId, e)
                              }
                              className="hidden"
                              id={`task-image-upload-${selectedStageId}`}
                            />
                            <label
                              htmlFor={`task-image-upload-${selectedStageId}`}
                              className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              Choose Images
                            </label>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {newTasks[selectedStageId].images.map(
                              (image, index) => (
                                <div
                                  key={`${selectedStageId}-${index}`}
                                  className="relative group"
                                >
                                  <div className="relative rounded-xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <img
                                      src={image.url}
                                      alt={image.title || `Image ${index + 1}`}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSingleImage(
                                          selectedStageId,
                                          index
                                        );
                                      }}
                                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer z-10 opacity-0 group-hover:opacity-100"
                                      title={`Remove ${
                                        image.title || `Image ${index + 1}`
                                      }`}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="mt-2">
                                    <InputField
                                      label={`Image ${index + 1} Title`}
                                      name={`imageTitle_${index}`}
                                      placeholder={`Image ${index + 1} Title`}
                                      value={image.title || ""}
                                      onChange={(e) => {
                                        // Handle individual image title change
                                        setNewTasks((prev) => ({
                                          ...prev,
                                          [selectedStageId]: {
                                            ...prev[selectedStageId],
                                            images: prev[
                                              selectedStageId
                                            ].images.map((img, i) =>
                                              i === index
                                                ? {
                                                    ...img,
                                                    title: e.target.value,
                                                    titleError: "",
                                                  }
                                                : img
                                            ),
                                          },
                                        }));
                                      }}
                                      className="text-xs"
                                      error={image.titleError}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                handleClearAllImages(selectedStageId)
                              }
                              className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                              Clear all images
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span>Maximum 10 images • Each file up to 10MB</span>
                    <span className="mx-2">•</span>
                    <span>Supported formats: JPG, PNG, GIF</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCloseTaskImageModal(selectedStageId)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleTaskSaveImages(selectedStageId)}
                      disabled={
                        !newTasks[selectedStageId]?.images ||
                        newTasks[selectedStageId].images.length === 0
                      }
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Attach {newTasks[selectedStageId]?.images?.length ||
                        0}{" "}
                      Image
                      {newTasks[selectedStageId]?.images?.length !== 1
                        ? "s"
                        : ""}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
