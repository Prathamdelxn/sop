// "use client"

// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus } from 'lucide-react';

// const ImageAttachmentModal = ({ onClose, onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [photos, setPhotos] = useState([]);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPhotos = files.map(file => ({
//       file,
//       name: file.name,
//       size: file.size,
//       url: URL.createObjectURL(file)
//     }));
//     setPhotos(prev => [...prev, ...newPhotos]);
//   };

//   const removePhoto = (index) => {
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     if (photos.length === 0) {
//       alert('Please add at least one photo');
//       return;
//     }
    
//     onSave({
//       title,
//       description,
//       photos
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-800">Attach Photos</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all"
//               placeholder="Enter a title for these photos"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all resize-none"
//               rows="3"
//               placeholder="Enter a description for these photos"
//               required
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-3">
//               <label className="block text-sm font-semibold text-gray-700">Photos</label>
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 text-sm"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Photos
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//               />
//             </div>

//             {photos.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {photos.map((photo, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={photo.url}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
//                       <button
//                         onClick={() => removePhoto(index)}
//                         className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <div className="mt-1 text-xs text-gray-600 truncate">
//                       {photo.name} ({(photo.size / 1024).toFixed(1)}KB)
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
//                 <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">No photos selected</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DurationModal = ({ onClose, onSave, initialMin = { hours: 0, minutes: 10, seconds: 0 }, initialMax = { hours: 0, minutes: 30, seconds: 0 } }) => {
//   const [minTime, setMinTime] = useState(initialMin);
//   const [maxTime, setMaxTime] = useState(initialMax);

//   const adjustTime = (type, field, increment) => {
//     const setter = type === 'min' ? setMinTime : setMaxTime;
//     const current = type === 'min' ? minTime : maxTime;

//     setter(prev => {
//       let newValue = prev[field] + increment;

//       if (field === 'minutes' || field === 'seconds') {
//         if (newValue >= 60) newValue = 0;
//         else if (newValue < 0) newValue = 59;
//       } else if (field === 'hours' && newValue < 0) {
//         newValue = 0;
//       }

//       return { ...prev, [field]: newValue };
//     });
//   };

//   const handleSave = () => {
//     // Convert to total minutes for easier display
//     const minTotalMinutes = minTime.hours * 60 + minTime.minutes + Math.round(minTime.seconds / 60);
//     const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes + Math.round(maxTime.seconds / 60);
    
//     onSave({
//       minDuration: minTotalMinutes,
//       maxDuration: maxTotalMinutes,
//       minTime, // Save the detailed time object
//       maxTime  // Save the detailed time object
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
//         {/* Header */}
//         <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl p-6 text-white">
//           <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <Clock className="w-5 h-5" />
//               </div>
//               <h2 className="text-xl font-bold">Set Task Duration</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur-sm"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-8">
//           {/* Minimum Duration */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
//               <h3 className="font-semibold text-gray-800">Minimum Duration</h3>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('min', field, 1)}
//                       className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>

//                     <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
//                       <span className="text-3xl font-bold text-gray-800 select-none">
//                         {String(minTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('min', field, -1)}
//                       className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
//                     {field}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Separator */}
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-white px-4 text-sm text-gray-500 font-medium">to</span>
//             </div>
//           </div>

//           {/* Maximum Duration */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
//               <h3 className="font-semibold text-gray-800">Maximum Duration</h3>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('max', field, 1)}
//                       className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>

//                     <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
//                       <span className="text-3xl font-bold text-gray-800 select-none">
//                         {String(maxTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('max', field, -1)}
//                       className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
//                     {field}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all active:scale-95"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TaskComponent = React.memo(({
//   task,
//   stageId,
//   level = 0,
//   parentPath = [],
//   onUpdateTask,
//   onAddSubtask,
//   onDeleteTask,
//   onToggleExpansion,
//   isExpanded
// }) => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showDurationModal, setShowDurationModal] = useState(false);

//   const depthStyles = useMemo(() => {
//     const colors = ['border-gray-400', 'border-blue-300', 'border-green-300', 'border-purple-300', 'border-red-300', 'border-yellow-300'];
//     const bgColors = ['bg-white', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-red-50', 'bg-yellow-50'];
//     return {
//       border: colors[level % colors.length],
//       bg: bgColors[level % bgColors.length],
//     };
//   }, [level]);

//   const handleChange = (field, value) => {
//     onUpdateTask(stageId, task.id, field, value, parentPath);
//   };

//   const handleImageSave = (imageData) => {
//     if (imageData.photos.length > 0) {
//       onUpdateTask(stageId, task.id, 'attachedImage', imageData.photos[0].url, parentPath);
//       onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
//       onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
//     }
//   };

//   const handleDurationSave = (duration) => {
//     onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
//     onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return 'Not set';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const formatDetailedDuration = (timeObj) => {
//     if (!timeObj) return '';
//     const parts = [];
//     if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
//     if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
//     if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
//     return parts.join(' ') || '0m';
//   };

//   return (
//     <div
//       className={`border rounded-lg p-4 ${depthStyles.border} ${depthStyles.bg} mb-3`}
//       style={{
//         marginLeft: level > 0 ? `${level * 16}px` : '0',
//         transition: 'all 0.2s ease'
//       }}
//     >
//       {showImageModal && (
//         <ImageAttachmentModal
//           onClose={() => setShowImageModal(false)}
//           onSave={handleImageSave}
//         />
//       )}

//       {showDurationModal && (
//         <DurationModal
//           onClose={() => setShowDurationModal(false)}
//           onSave={handleDurationSave}
//           initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
//           initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
//         />
//       )}

//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           {hasSubtasks && (
//             <button onClick={() => onToggleExpansion(task.id)} className="text-gray-500 hover:text-gray-700">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           <span className="font-medium text-gray-700">
//             {level === 0 ? 'Task' : `Subtask (Level ${level})`}
//           </span>
//         </div>
//         <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-700 p-1">
//           <Trash2 size={16} />
//         </button>
//       </div>

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//           <input
//             type="text"
//             value={task.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             value={task.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             rows={3}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task description"
//           />
//         </div>

//         {/* Duration display */}
//         {(task.minDuration || task.maxDuration) && (
//           <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <Clock className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Duration:</span>
//               <span>
//                 {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
//                 {' → '}
//                 {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onAddSubtask(stageId, task.id, parentPath)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
//           >
//             <Plus size={14} />
//             Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
//           </button>

//           <button
//             onClick={() => setShowDurationModal(true)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//           >
//             <Clock size={14} />
//             Set Duration
//           </button>

//           <button
//             onClick={() => setShowImageModal(true)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
//           >
//             <Image size={14} />
//             Attach Image
//           </button>
//         </div>

//         {task.attachedImage && (
//           <div className="mt-2">
//             <img
//               src={task.attachedImage}
//               alt="Attached"
//               className="max-w-xs max-h-32 object-cover rounded border"
//             />
//             {task.imageTitle && <p className="text-sm font-medium mt-1">{task.imageTitle}</p>}
//             {task.imageDescription && <p className="text-sm text-gray-600">{task.imageDescription}</p>}
//           </div>
//         )}
//       </div>

//       {hasSubtasks && isExpanded && (
//         <div className="mt-4 space-y-2">
//           {task.subtasks.map(subtask => (
//             <TaskComponent
//               key={subtask.id}
//               task={subtask}
//               stageId={stageId}
//               level={level + 1}
//               parentPath={[...parentPath, task.id]}
//               onUpdateTask={onUpdateTask}
//               onAddSubtask={onAddSubtask}
//               onDeleteTask={onDeleteTask}
//               onToggleExpansion={onToggleExpansion}
//               isExpanded={isExpanded}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.task === nextProps.task &&
//     prevProps.isExpanded === nextProps.isExpanded
//   );
// });

// TaskComponent.displayName = 'TaskComponent';

// const PrototypeManagementPage = () => {
//   const [prototypeName, setPrototypeName] = useState('');
//   const [stages, setStages] = useState([]);
//   const [expandedItems, setExpandedItems] = useState({});

//   const addStage = useCallback(() => {
//     const newStage = {
//       id: Date.now(),
//       name: `Stage ${stages.length + 1}`,
//       tasks: []
//     };
//     setStages(prev => [...prev, newStage]);
//   }, [stages.length]);

//   const updateStageName = useCallback((stageId, newName) => {
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, name: newName }
//         : stage
//     ));
//   }, []);

//   const addTask = useCallback((stageId) => {
//     const newTask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImage: null,
//       imageTitle: '',
//       imageDescription: '',
//       subtasks: []
//     };
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: [...stage.tasks, newTask] }
//         : stage
//     ));
//   }, []);

//   const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
//     const newSubtask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImage: null,
//       imageTitle: '',
//       imageDescription: '',
//       subtasks: []
//     };

//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, subtasks: [...task.subtasks, newSubtask] };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, subtasks: [...subtask.subtasks, newSubtask] }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const updateTaskField = useCallback((stageId, taskId, field, value, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, [field]: value };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId, field, value)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId, fieldToUpdate = field, newValue = value) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, [fieldToUpdate]: newValue }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId, fieldToUpdate, newValue)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteTask = useCallback((stageId, taskId, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       if (parentPath.length === 0) {
//         return tasks.filter(task => task.id !== taskId);
//       }

//       return tasks.map(task => {
//         if (task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.filter(subtask => subtask.id !== targetId);
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteStage = useCallback((stageId) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   }, []);

//   const toggleExpansion = useCallback((id) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Prototype Management</h1>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="w-full">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Prototype Name</label>

//             <div className="flex items-center justify-between gap-4">
//               <input
//                 type="text"
//                 value={prototypeName}
//                 onChange={(e) => setPrototypeName(e.target.value)}
//                 className="flex p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter prototype name"
//               />

//               <button
//                 onClick={() => {
//                   console.group("📝 Prototype Data Submitted");
//                   console.log("Prototype Name:", prototypeName);
//                   console.log("Stages:", JSON.parse(JSON.stringify(stages, (key, value) => {
//                     if (key === 'url' || key === 'attachedImage') {
//                       return value ? '[Image URL]' : null;
//                     }
//                     return value;
//                   })));
//                   console.groupEnd();
                  
//                   stages.forEach(stage => {
//                     stage.tasks.forEach(task => {
//                       if (task.attachedImage) {
//                         console.log(`Task ${task.id} image:`, task.attachedImage);
//                       }
//                     });
//                   });
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Stages</h2>
//             <button
//               onClick={addStage}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               <Plus size={20} />
//               Create Stage
//             </button>
//           </div>

//           <div className="space-y-6">
//             {stages.map((stage) => (
//               <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <input
//                     type="text"
//                     value={stage.name}
//                     onChange={(e) => updateStageName(stage.id, e.target.value)}
//                     className="text-lg font-medium p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Stage name"
//                   />
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => addTask(stage.id)}
//                       className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
//                     >
//                       <Plus size={16} />
//                       Add Task
//                     </button>
//                     <button
//                       onClick={() => deleteStage(stage.id)}
//                       className="text-red-500 hover:text-red-700 p-1"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {stage.tasks.map((task) => (
//                     <TaskComponent
//                       key={task.id}
//                       task={task}
//                       stageId={stage.id}
//                       level={0}
//                       parentPath={[]}
//                       onUpdateTask={updateTaskField}
//                       onAddSubtask={addSubtask}
//                       onDeleteTask={deleteTask}
//                       onToggleExpansion={toggleExpansion}
//                       isExpanded={expandedItems[task.id]}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {stages.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               <p>No stages created yet. Click "Create Stage" to get started.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrototypeManagementPage;

// "use client"

// import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus } from 'lucide-react';

// const ImageAttachmentModal = ({ 
//   onClose, 
//   onSave, 
//   initialTitle = '', 
//   initialDescription = '', 
//   initialPhotos = [] 
// }) => {
//   const [title, setTitle] = useState(initialTitle);
//   const [description, setDescription] = useState(initialDescription);
//   const [photos, setPhotos] = useState(initialPhotos);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPhotos = files.map(file => ({
//       file,
//       name: file.name,
//       size: file.size,
//       url: URL.createObjectURL(file)
//     }));
//     setPhotos(prev => [...prev, ...newPhotos]);
//   };

//   const removePhoto = (index) => {
//     const photoToRemove = photos[index];
//     if (photoToRemove.url.startsWith('blob:')) {
//       URL.revokeObjectURL(photoToRemove.url);
//     }
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     if (photos.length === 0) {
//       alert('Please add at least one photo');
//       return;
//     }
    
//     onSave({
//       title,
//       description,
//       photos
//     });
//     onClose();
//   };

//   // Clean up object URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       photos.forEach(photo => {
//         if (photo.url && photo.url.startsWith('blob:')) {
//           URL.revokeObjectURL(photo.url);
//         }
//       });
//     };
//   }, [photos]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-800">Attach Photos</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all"
//               placeholder="Enter a title for these photos"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all resize-none"
//               rows="3"
//               placeholder="Enter a description for these photos"
//               required
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-3">
//               <label className="block text-sm font-semibold text-gray-700">Photos</label>
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 text-sm"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Photos
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//               />
//             </div>

//             {photos.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {photos.map((photo, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={photo.url}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
//                       <button
//                         onClick={() => removePhoto(index)}
//                         className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <div className="mt-1 text-xs text-gray-600 truncate">
//                       {photo.name} ({(photo.size / 1024).toFixed(1)}KB)
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
//                 <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">No photos selected</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DurationModal = ({ onClose, onSave, initialMin = { hours: 0, minutes: 10, seconds: 0 }, initialMax = { hours: 0, minutes: 30, seconds: 0 } }) => {
//   const [minTime, setMinTime] = useState(initialMin);
//   const [maxTime, setMaxTime] = useState(initialMax);

//   const adjustTime = (type, field, increment) => {
//     const setter = type === 'min' ? setMinTime : setMaxTime;
//     const current = type === 'min' ? minTime : maxTime;

//     setter(prev => {
//       let newValue = prev[field] + increment;

//       if (field === 'minutes' || field === 'seconds') {
//         if (newValue >= 60) newValue = 0;
//         else if (newValue < 0) newValue = 59;
//       } else if (field === 'hours' && newValue < 0) {
//         newValue = 0;
//       }

//       return { ...prev, [field]: newValue };
//     });
//   };

//   const handleSave = () => {
//     const minTotalMinutes = minTime.hours * 60 + minTime.minutes + Math.round(minTime.seconds / 60);
//     const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes + Math.round(maxTime.seconds / 60);
    
//     onSave({
//       minDuration: minTotalMinutes,
//       maxDuration: maxTotalMinutes,
//       minTime,
//       maxTime
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
//         <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl p-6 text-white">
//           <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <Clock className="w-5 h-5" />
//               </div>
//               <h2 className="text-xl font-bold">Set Task Duration</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur-sm"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-8">
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
//               <h3 className="font-semibold text-gray-800">Minimum Duration</h3>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('min', field, 1)}
//                       className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>

//                     <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
//                       <span className="text-3xl font-bold text-gray-800 select-none">
//                         {String(minTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('min', field, -1)}
//                       className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
//                     {field}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-white px-4 text-sm text-gray-500 font-medium">to</span>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
//               <h3 className="font-semibold text-gray-800">Maximum Duration</h3>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('max', field, 1)}
//                       className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>

//                     <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
//                       <span className="text-3xl font-bold text-gray-800 select-none">
//                         {String(maxTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('max', field, -1)}
//                       className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
//                     {field}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all active:scale-95"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TaskComponent = React.memo(({
//   task,
//   stageId,
//   level = 0,
//   parentPath = [],
//   onUpdateTask,
//   onAddSubtask,
//   onDeleteTask,
//   onToggleExpansion,
//   isExpanded
// }) => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showDurationModal, setShowDurationModal] = useState(false);
//   const [modalKey, setModalKey] = useState(0);

//   const depthStyles = useMemo(() => {
//     const colors = ['border-gray-400', 'border-blue-300', 'border-green-300', 'border-purple-300', 'border-red-300', 'border-yellow-300'];
//     const bgColors = ['bg-white', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-red-50', 'bg-yellow-50'];
//     return {
//       border: colors[level % colors.length],
//       bg: bgColors[level % bgColors.length],
//     };
//   }, [level]);

//   const handleChange = (field, value) => {
//     onUpdateTask(stageId, task.id, field, value, parentPath);
//   };

//   const handleImageSave = (imageData) => {
//     if (imageData.photos.length > 0) {
//       onUpdateTask(stageId, task.id, 'attachedImage', imageData.photos[0].url, parentPath);
//       onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
//       onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
//     }
//   };

//   const handleDurationSave = (duration) => {
//     onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
//     onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return 'Not set';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const formatDetailedDuration = (timeObj) => {
//     if (!timeObj) return '';
//     const parts = [];
//     if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
//     if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
//     if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
//     return parts.join(' ') || '0m';
//   };

//   const handleOpenImageModal = () => {
//     setModalKey(prev => prev + 1);
//     setShowImageModal(true);
//   };

//   return (
//     <div
//       className={`border rounded-lg p-4 ${depthStyles.border} ${depthStyles.bg} mb-3`}
//       style={{
//         marginLeft: level > 0 ? `${level * 16}px` : '0',
//         transition: 'all 0.2s ease'
//       }}
//     >
//       {showImageModal && (
//         <ImageAttachmentModal
//           key={modalKey}
//           onClose={() => setShowImageModal(false)}
//           onSave={handleImageSave}
//           initialTitle={task.imageTitle || ''}
//           initialDescription={task.imageDescription || ''}
//           initialPhotos={task.attachedImage ? [{
//             url: task.attachedImage,
//             name: task.imageTitle || 'Uploaded image',
//             size: 0
//           }] : []}
//         />
//       )}

//       {showDurationModal && (
//         <DurationModal
//           onClose={() => setShowDurationModal(false)}
//           onSave={handleDurationSave}
//           initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
//           initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
//         />
//       )}

//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           {hasSubtasks && (
//             <button onClick={() => onToggleExpansion(task.id)} className="text-gray-500 hover:text-gray-700">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           <span className="font-medium text-gray-700">
//             {level === 0 ? 'Task' : `Subtask (Level ${level})`}
//           </span>
//         </div>
//         <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-700 p-1">
//           <Trash2 size={16} />
//         </button>
//       </div>

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//           <input
//             type="text"
//             value={task.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             value={task.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             rows={3}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task description"
//           />
//         </div>

//         {(task.minDuration || task.maxDuration) && (
//           <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <Clock className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Duration:</span>
//               <span>
//                 {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
//                 {' → '}
//                 {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onAddSubtask(stageId, task.id, parentPath)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
//           >
//             <Plus size={14} />
//             Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
//           </button>

//           <button
//             onClick={() => setShowDurationModal(true)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//           >
//             <Clock size={14} />
//             Set Duration
//           </button>

//           <button
//             onClick={handleOpenImageModal}
//             className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
//           >
//             <Image size={14} />
//             Attach Image
//           </button>
//         </div>

//         {task.attachedImage && (
//           <div className="mt-2">
//             <img
//               src={task.attachedImage}
//               alt="Attached"
//               className="max-w-xs max-h-32 object-cover rounded border"
//             />
//             {task.imageTitle && <p className="text-sm font-medium mt-1">{task.imageTitle}</p>}
//             {task.imageDescription && <p className="text-sm text-gray-600">{task.imageDescription}</p>}
//           </div>
//         )}
//       </div>

//       {hasSubtasks && isExpanded && (
//         <div className="mt-4 space-y-2">
//           {task.subtasks.map(subtask => (
//             <TaskComponent
//               key={subtask.id}
//               task={subtask}
//               stageId={stageId}
//               level={level + 1}
//               parentPath={[...parentPath, task.id]}
//               onUpdateTask={onUpdateTask}
//               onAddSubtask={onAddSubtask}
//               onDeleteTask={onDeleteTask}
//               onToggleExpansion={onToggleExpansion}
//               isExpanded={isExpanded}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.task === nextProps.task &&
//     prevProps.isExpanded === nextProps.isExpanded
//   );
// });

// TaskComponent.displayName = 'TaskComponent';

// const PrototypeManagementPage = () => {
//   const [prototypeName, setPrototypeName] = useState('');
//   const [stages, setStages] = useState([]);
//   const [expandedItems, setExpandedItems] = useState({});

//   const addStage = useCallback(() => {
//     const newStage = {
//       id: Date.now(),
//       name: `Stage ${stages.length + 1}`,
//       tasks: []
//     };
//     setStages(prev => [...prev, newStage]);
//   }, [stages.length]);

//   const updateStageName = useCallback((stageId, newName) => {
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, name: newName }
//         : stage
//     ));
//   }, []);

//   const addTask = useCallback((stageId) => {
//     const newTask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImage: null,
//       imageTitle: '',
//       imageDescription: '',
//       subtasks: []
//     };
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: [...stage.tasks, newTask] }
//         : stage
//     ));
//   }, []);

//   const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
//     const newSubtask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImage: null,
//       imageTitle: '',
//       imageDescription: '',
//       subtasks: []
//     };

//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, subtasks: [...task.subtasks, newSubtask] };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, subtasks: [...subtask.subtasks, newSubtask] }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const updateTaskField = useCallback((stageId, taskId, field, value, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, [field]: value };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId, field, value)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId, fieldToUpdate = field, newValue = value) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, [fieldToUpdate]: newValue }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId, fieldToUpdate, newValue)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteTask = useCallback((stageId, taskId, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       if (parentPath.length === 0) {
//         return tasks.filter(task => task.id !== taskId);
//       }

//       return tasks.map(task => {
//         if (task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.filter(subtask => subtask.id !== targetId);
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteStage = useCallback((stageId) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   }, []);

//   const toggleExpansion = useCallback((id) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Prototype Management</h1>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="w-full">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Prototype Name</label>

//             <div className="flex items-center justify-between gap-4">
//               <input
//                 type="text"
//                 value={prototypeName}
//                 onChange={(e) => setPrototypeName(e.target.value)}
//                 className="flex p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter prototype name"
//               />

//               <button
//                 onClick={() => {
//                   console.group("📝 Prototype Data Submitted");
//                   console.log("Prototype Name:", prototypeName);
//                   console.log("Stages:", JSON.parse(JSON.stringify(stages, (key, value) => {
//                     if (key === 'url' || key === 'attachedImage') {
//                       return value ? '[Image URL]' : null;
//                     }
//                     return value;
//                   })));
//                   console.groupEnd();
                  
//                   stages.forEach(stage => {
//                     stage.tasks.forEach(task => {
//                       if (task.attachedImage) {
//                         console.log(`Task ${task.id} image:`, task.attachedImage);
//                       }
//                     });
//                   });
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Stages</h2>
//             <button
//               onClick={addStage}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               <Plus size={20} />
//               Create Stage
//             </button>
//           </div>

//           <div className="space-y-6">
//             {stages.map((stage) => (
//               <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <input
//                     type="text"
//                     value={stage.name}
//                     onChange={(e) => updateStageName(stage.id, e.target.value)}
//                     className="text-lg font-medium p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Stage name"
//                   />
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => addTask(stage.id)}
//                       className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
//                     >
//                       <Plus size={16} />
//                       Add Task
//                     </button>
//                     <button
//                       onClick={() => deleteStage(stage.id)}
//                       className="text-red-500 hover:text-red-700 p-1"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {stage.tasks.map((task) => (
//                     <TaskComponent
//                       key={task.id}
//                       task={task}
//                       stageId={stage.id}
//                       level={0}
//                       parentPath={[]}
//                       onUpdateTask={updateTaskField}
//                       onAddSubtask={addSubtask}
//                       onDeleteTask={deleteTask}
//                       onToggleExpansion={toggleExpansion}
//                       isExpanded={expandedItems[task.id]}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {stages.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               <p>No stages created yet. Click "Create Stage" to get started.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrototypeManagementPage;


"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus } from 'lucide-react';

// Image Attachment Modal with Cloudinary Upload
// const ImageAttachmentModal = ({ 
//   onClose, 
//   onSave, 
//   initialTitle = '', 
//   initialDescription = '', 
//   initialPhotos = [] 
// }) => {
//   const [title, setTitle] = useState(initialTitle);
//   const [description, setDescription] = useState(initialDescription);
//   const [photos, setPhotos] = useState(initialPhotos);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const uploadImageToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });
      
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setIsUploading(true);
    
//     try {
//       const uploadPromises = files.map(async (file) => {
//         // Show temporary preview while uploading
//         const tempPhoto = {
//           file,
//           name: file.name,
//           size: file.size,
//           url: URL.createObjectURL(file),
//           public_id: null,
//           isUploading: true
//         };
        
//         setPhotos(prev => [...prev, tempPhoto]);
        
//         const cloudinaryResult = await uploadImageToCloudinary(file);
//         return {
//           file,
//           name: file.name,
//           size: file.size,
//           url: cloudinaryResult.url,
//           public_id: cloudinaryResult.public_id,
//           isUploading: false
//         };
//       });

//       const newPhotos = await Promise.all(uploadPromises);
//       setPhotos(prev => [
//         ...prev.filter(p => !p.isUploading),
//         ...newPhotos
//       ]);
//     } catch (error) {
//       alert('Error uploading images. Please try again.');
//       setPhotos(prev => prev.filter(p => !p.isUploading));
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removePhoto = (index) => {
//     const photoToRemove = photos[index];
//     if (photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
//       URL.revokeObjectURL(photoToRemove.url);
//     }
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     if (photos.length === 0) {
//       alert('Please add at least one photo');
//       return;
//     }
    
//     // Only include successfully uploaded photos
//     const uploadedPhotos = photos.filter(photo => photo.public_id);
    
//     onSave({
//       title,
//       description,
//       photos: uploadedPhotos
//     });
//     onClose();
//   };

//   // Clean up object URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       photos.forEach(photo => {
//         if (photo.url && photo.url.startsWith('blob:')) {
//           URL.revokeObjectURL(photo.url);
//         }
//       });
//     };
//   }, [photos]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-800">Attach Photos</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             disabled={isUploading}
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all"
//               placeholder="Enter a title for these photos"
//               required
//               disabled={isUploading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all resize-none"
//               rows="3"
//               placeholder="Enter a description for these photos"
//               required
//               disabled={isUploading}
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-3">
//               <label className="block text-sm font-semibold text-gray-700">Photos</label>
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50"
//                 disabled={isUploading}
//               >
//                 {isUploading ? (
//                   'Uploading...'
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4" />
//                     Add Photos
//                   </>
//                 )}
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//                 disabled={isUploading}
//               />
//             </div>

//             {photos.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {photos.map((photo, index) => (
//                   <div key={index} className="relative group">
//                     <div className="relative">
//                       <img
//                         src={photo.url}
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
//                       />
//                       {photo.isUploading && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
//                           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
//                       <button
//                         onClick={() => removePhoto(index)}
//                         className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
//                         disabled={isUploading}
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <div className="mt-1 text-xs text-gray-600 truncate">
//                       {photo.name} ({(photo.size / 1024).toFixed(1)}KB)
//                       {!photo.public_id && photo.isUploading && " (Uploading...)"}
//                       {!photo.public_id && !photo.isUploading && " (Failed)"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
//                 {isUploading ? (
//                   <div className="flex flex-col items-center">
//                     <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
//                     <p className="text-gray-500">Uploading images...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
//                     <p className="text-gray-500">No photos selected</p>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95 disabled:opacity-50"
//             disabled={isUploading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95 disabled:opacity-50"
//             disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const ImageAttachmentModal = ({ 
  onClose, 
  onSave, 
  initialTitle = '', 
  initialDescription = '', 
  initialPhotos = [] 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [photos, setPhotos] = useState(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Show temporary preview while uploading
        const tempPhoto = {
          file,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          public_id: null,
          isUploading: true
        };
        
        setPhotos(prev => [...prev, tempPhoto]);
        
        const cloudinaryResult = await uploadImageToCloudinary(file);
        return {
          file,
          name: file.name,
          size: file.size,
          url: cloudinaryResult.url,
          public_id: cloudinaryResult.public_id,
          isUploading: false
        };
      });

      const newPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [
        ...prev.filter(p => !p.isUploading),
        ...newPhotos
      ]);
    } catch (error) {
      alert('Error uploading images. Please try again.');
      setPhotos(prev => prev.filter(p => !p.isUploading));
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    const photoToRemove = photos[index];
    if (photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (photos.length === 0) {
      alert('Please add at least one photo');
      return;
    }
    
    // Only include successfully uploaded photos
    const uploadedPhotos = photos.filter(photo => photo.public_id);
    
    onSave({
      title,
      description,
      photos: uploadedPhotos
    });
    onClose();
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.url && photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, [photos]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Attach Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all"
              placeholder="Enter a title for these photos"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all resize-none"
              rows="3"
              placeholder="Enter a description for these photos"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700">Photos</label>
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Photos
                  </>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="relative">
                      <img
                        src={photo.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      {photo.isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => removePhoto(index)}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      {photo.name} ({(photo.size / 1024).toFixed(1)}KB)
                      {!photo.public_id && photo.isUploading && " (Uploading...)"}
                      {!photo.public_id && !photo.isUploading && " (Failed)"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-500">Uploading images...</p>
                  </div>
                ) : (
                  <>
                    <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No photos selected</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95 disabled:opacity-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95 disabled:opacity-50"
            disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Duration Modal (unchanged)
const DurationModal = ({ onClose, onSave, initialMin = { hours: 0, minutes: 10, seconds: 0 }, initialMax = { hours: 0, minutes: 30, seconds: 0 } }) => {
  const [minTime, setMinTime] = useState(initialMin);
  const [maxTime, setMaxTime] = useState(initialMax);

  const adjustTime = (type, field, increment) => {
    const setter = type === 'min' ? setMinTime : setMaxTime;
    const current = type === 'min' ? minTime : maxTime;

    setter(prev => {
      let newValue = prev[field] + increment;

      if (field === 'minutes' || field === 'seconds') {
        if (newValue >= 60) newValue = 0;
        else if (newValue < 0) newValue = 59;
      } else if (field === 'hours' && newValue < 0) {
        newValue = 0;
      }

      return { ...prev, [field]: newValue };
    });
  };

  const handleSave = () => {
    const minTotalMinutes = minTime.hours * 60 + minTime.minutes + Math.round(minTime.seconds / 60);
    const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes + Math.round(maxTime.seconds / 60);
    
    onSave({
      minDuration: minTotalMinutes,
      maxDuration: maxTotalMinutes,
      minTime,
      maxTime
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl p-6 text-white">
          <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Set Task Duration</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Minimum Duration</h3>
            </div>

            <div className="flex items-center justify-center gap-4">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      onClick={() => adjustTime('min', field, 1)}
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                      <span className="text-3xl font-bold text-gray-800 select-none">
                        {String(minTime[field]).padStart(2, '0')}
                      </span>
                    </div>

                    <button
                      onClick={() => adjustTime('min', field, -1)}
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
                    {field}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 font-medium">to</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Maximum Duration</h3>
            </div>

            <div className="flex items-center justify-center gap-4">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      onClick={() => adjustTime('max', field, 1)}
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                      <span className="text-3xl font-bold text-gray-800 select-none">
                        {String(maxTime[field]).padStart(2, '0')}
                      </span>
                    </div>

                    <button
                      onClick={() => adjustTime('max', field, -1)}
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-600 mt-4 uppercase tracking-wider">
                    {field}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Component with Cloudinary integration
// const TaskComponent = React.memo(({
//   task,
//   stageId,
//   level = 0,
//   parentPath = [],
//   onUpdateTask,
//   onAddSubtask,
//   onDeleteTask,
//   onToggleExpansion,
//   isExpanded
// }) => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showDurationModal, setShowDurationModal] = useState(false);
//   const [modalKey, setModalKey] = useState(0);

//   const depthStyles = useMemo(() => {
//     const colors = ['border-gray-400', 'border-blue-300', 'border-green-300', 'border-purple-300', 'border-red-300', 'border-yellow-300'];
//     const bgColors = ['bg-white', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-red-50', 'bg-yellow-50'];
//     return {
//       border: colors[level % colors.length],
//       bg: bgColors[level % bgColors.length],
//     };
//   }, [level]);

//   const handleChange = (field, value) => {
//     onUpdateTask(stageId, task.id, field, value, parentPath);
//   };

//   const handleImageSave = (imageData) => {
//     if (imageData.photos.length > 0) {
//       const photo = imageData.photos[0];
//       onUpdateTask(stageId, task.id, 'attachedImage', photo.url, parentPath);
//       onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
//       onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
//       onUpdateTask(stageId, task.id, 'imagePublicId', photo.public_id, parentPath);
//     }
//   };

//   const handleDurationSave = (duration) => {
//     onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
//     onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return 'Not set';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const formatDetailedDuration = (timeObj) => {
//     if (!timeObj) return '';
//     const parts = [];
//     if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
//     if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
//     if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
//     return parts.join(' ') || '0m';
//   };

//   const handleOpenImageModal = () => {
//     setModalKey(prev => prev + 1);
//     setShowImageModal(true);
//   };

//   return (
//     <div
//       className={`border rounded-lg p-4 ${depthStyles.border} ${depthStyles.bg} mb-3`}
//       style={{
//         marginLeft: level > 0 ? `${level * 16}px` : '0',
//         transition: 'all 0.2s ease'
//       }}
//     >
//       {showImageModal && (
//         <ImageAttachmentModal
//           key={modalKey}
//           onClose={() => setShowImageModal(false)}
//           onSave={handleImageSave}
//           initialTitle={task.imageTitle || ''}
//           initialDescription={task.imageDescription || ''}
//           initialPhotos={task.attachedImage ? [{
//             url: task.attachedImage,
//             name: task.imageTitle || 'Uploaded image',
//             size: 0,
//             public_id: task.imagePublicId || null
//           }] : []}
//         />
//       )}

//       {showDurationModal && (
//         <DurationModal
//           onClose={() => setShowDurationModal(false)}
//           onSave={handleDurationSave}
//           initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
//           initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
//         />
//       )}

//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           {hasSubtasks && (
//             <button onClick={() => onToggleExpansion(task.id)} className="text-gray-500 hover:text-gray-700">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           <span className="font-medium text-gray-700">
//             {level === 0 ? 'Task' : `Subtask (Level ${level})`}
//           </span>
//         </div>
//         <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-700 p-1">
//           <Trash2 size={16} />
//         </button>
//       </div>

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//           <input
//             type="text"
//             value={task.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             value={task.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             rows={3}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task description"
//           />
//         </div>

//         {(task.minDuration || task.maxDuration) && (
//           <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <Clock className="w-4 h-4 text-gray-500" />
//               <span className="font-medium">Duration:</span>
//               <span>
//                 {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
//                 {' → '}
//                 {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onAddSubtask(stageId, task.id, parentPath)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
//           >
//             <Plus size={14} />
//             Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
//           </button>

//           <button
//             onClick={() => setShowDurationModal(true)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//           >
//             <Clock size={14} />
//             Set Duration
//           </button>

//           <button
//             onClick={handleOpenImageModal}
//             className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
//           >
//             <Image size={14} />
//             Attach Image
//           </button>
//         </div>

//         {task.attachedImage && (
//           <div className="mt-2">
//             <img
//               src={task.attachedImage}
//               alt="Attached"
//               className="max-w-xs max-h-32 object-cover rounded border"
//             />
//             {task.imageTitle && <p className="text-sm font-medium mt-1">{task.imageTitle}</p>}
//             {task.imageDescription && <p className="text-sm text-gray-600">{task.imageDescription}</p>}
//           </div>
//         )}
//       </div>

//       {hasSubtasks && isExpanded && (
//         <div className="mt-4 space-y-2">
//           {task.subtasks.map(subtask => (
//             <TaskComponent
//               key={subtask.id}
//               task={subtask}
//               stageId={stageId}
//               level={level + 1}
//               parentPath={[...parentPath, task.id]}
//               onUpdateTask={onUpdateTask}
//               onAddSubtask={onAddSubtask}
//               onDeleteTask={onDeleteTask}
//               onToggleExpansion={onToggleExpansion}
//               isExpanded={isExpanded}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.task === nextProps.task &&
//     prevProps.isExpanded === nextProps.isExpanded
//   );
// });

// TaskComponent.displayName = 'TaskComponent';

const TaskComponent = React.memo(({
  task,
  stageId,
  level = 0,
  parentPath = [],
  onUpdateTask,
  onAddSubtask,
  onDeleteTask,
  onToggleExpansion,
  isExpanded
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const depthStyles = useMemo(() => {
    const colors = ['border-gray-400', 'border-blue-300', 'border-green-300', 'border-purple-300', 'border-red-300', 'border-yellow-300'];
    const bgColors = ['bg-white', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-red-50', 'bg-yellow-50'];
    return {
      border: colors[level % colors.length],
      bg: bgColors[level % bgColors.length],
    };
  }, [level]);

  const handleChange = (field, value) => {
    onUpdateTask(stageId, task.id, field, value, parentPath);
  };

  const handleImageSave = (imageData) => {
    onUpdateTask(stageId, task.id, 'attachedImages', imageData.photos, parentPath);
    onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
    onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
  };

  const handleDurationSave = (duration) => {
    onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
    onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
    onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
    onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDetailedDuration = (timeObj) => {
    if (!timeObj) return '';
    const parts = [];
    if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
    if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
    if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
    return parts.join(' ') || '0m';
  };

  const handleOpenImageModal = () => {
    setModalKey(prev => prev + 1);
    setShowImageModal(true);
  };

  return (
    <div
      className={`border rounded-lg p-4 ${depthStyles.border} ${depthStyles.bg} mb-3`}
      style={{
        marginLeft: level > 0 ? `${level * 16}px` : '0',
        transition: 'all 0.2s ease'
      }}
    >
      {showImageModal && (
        <ImageAttachmentModal
          key={modalKey}
          onClose={() => setShowImageModal(false)}
          onSave={handleImageSave}
          initialTitle={task.imageTitle || ''}
          initialDescription={task.imageDescription || ''}
          initialPhotos={task.attachedImages || []}
        />
      )}

      {showDurationModal && (
        <DurationModal
          onClose={() => setShowDurationModal(false)}
          onSave={handleDurationSave}
          initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
          initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasSubtasks && (
            <button onClick={() => onToggleExpansion(task.id)} className="text-gray-500 hover:text-gray-700">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span className="font-medium text-gray-700">
            {level === 0 ? 'Task' : `Subtask (Level ${level})`}
          </span>
        </div>
        <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-700 p-1">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>

        {(task.minDuration || task.maxDuration) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Duration:</span>
              <span>
                {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
                {' → '}
                {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onAddSubtask(stageId, task.id, parentPath)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            <Plus size={14} />
            Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
          </button>

          <button
            onClick={() => setShowDurationModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            <Clock size={14} />
            Set Duration
          </button>

          <button
            onClick={handleOpenImageModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
          >
            <Image size={14} />
            Attach Images
          </button>
        </div>

        {task.attachedImages && task.attachedImages.length > 0 && (
          <div className="mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {task.attachedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Attached ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  {image.name && <p className="text-sm font-medium mt-1">{image.name}</p>}
                  {image.description && <p className="text-sm text-gray-600">{image.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasSubtasks && isExpanded && (
        <div className="mt-4 space-y-2">
          {task.subtasks.map(subtask => (
            <TaskComponent
              key={subtask.id}
              task={subtask}
              stageId={stageId}
              level={level + 1}
              parentPath={[...parentPath, task.id]}
              onUpdateTask={onUpdateTask}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onToggleExpansion={onToggleExpansion}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task === nextProps.task &&
    prevProps.isExpanded === nextProps.isExpanded
  );
});

TaskComponent.displayName = 'TaskComponent';

// Prototype Management Page (unchanged except for save handler)
const PrototypeManagementPage = () => {
  const [prototypeName, setPrototypeName] = useState('');
  const [stages, setStages] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const addStage = useCallback(() => {
    const newStage = {
      id: Date.now(),
      name: `Stage ${stages.length + 1}`,
      tasks: []
    };
    setStages(prev => [...prev, newStage]);
  }, [stages.length]);

  const updateStageName = useCallback((stageId, newName) => {
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, name: newName }
        : stage
    ));
  }, []);

  const addTask = useCallback((stageId) => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      minDuration: '',
      maxDuration: '',
      minTime: { hours: 0, minutes: 10, seconds: 0 },
      maxTime: { hours: 0, minutes: 30, seconds: 0 },
      attachedImage: null,
      imageTitle: '',
      imageDescription: '',
      imagePublicId: null,
      subtasks: []
    };
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: [...stage.tasks, newTask] }
        : stage
    ));
  }, []);

  const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
    const newSubtask = {
      id: Date.now(),
      title: '',
      description: '',
      minDuration: '',
      maxDuration: '',
      minTime: { hours: 0, minutes: 10, seconds: 0 },
      maxTime: { hours: 0, minutes: 30, seconds: 0 },
      attachedImage: [],
      imageTitle: '',
      imageDescription: '',
      imagePublicId: null,
      subtasks: []
    };

    const updateTasks = (tasks) => {
      return tasks.map(task => {
        if (parentPath.length === 0 && task.id === taskId) {
          return { ...task, subtasks: [...task.subtasks, newSubtask] };
        }

        if (parentPath.length > 0 && task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId = taskId) => {
      if (remainingPath.length === 0) {
        return subtasks.map(subtask =>
          subtask.id === targetId
            ? { ...subtask, subtasks: [...subtask.subtasks, newSubtask] }
            : subtask
        );
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const updateTaskField = useCallback((stageId, taskId, field, value, parentPath = []) => {
    const updateTasks = (tasks) => {
      return tasks.map(task => {
        if (parentPath.length === 0 && task.id === taskId) {
          return { ...task, [field]: value };
        }

        if (parentPath.length > 0 && task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId, field, value)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId = taskId, fieldToUpdate = field, newValue = value) => {
      if (remainingPath.length === 0) {
        return subtasks.map(subtask =>
          subtask.id === targetId
            ? { ...subtask, [fieldToUpdate]: newValue }
            : subtask
        );
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId, fieldToUpdate, newValue)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const deleteTask = useCallback((stageId, taskId, parentPath = []) => {
    const updateTasks = (tasks) => {
      if (parentPath.length === 0) {
        return tasks.filter(task => task.id !== taskId);
      }

      return tasks.map(task => {
        if (task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId) => {
      if (remainingPath.length === 0) {
        return subtasks.filter(subtask => subtask.id !== targetId);
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtasks, remainingPath.slice(1), targetId)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const deleteStage = useCallback((stageId) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  }, []);

  const toggleExpansion = useCallback((id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const handleSavePrototype = () => {
    console.group("📝 Prototype Data Submitted");
    console.log("Prototype Name:", prototypeName);
    
    // Create a clean copy of stages without file objects
    const stagesToSave = JSON.parse(JSON.stringify(stages, (key, value) => {
      if (key === 'file') return undefined; // Remove file objects
      if (key === 'url' && value && value.startsWith('blob:')) return undefined; // Remove blob URLs
      return value;
    }));
    
    console.log("Stages:", stagesToSave);
    console.groupEnd();
    
    // Here you would typically send the data to your backend
    // fetch('/api/save-prototype', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: prototypeName,
    //     stages: stagesToSave
    //   })
    // });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Prototype Management</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prototype Name</label>

            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={prototypeName}
                onChange={(e) => setPrototypeName(e.target.value)}
                className="flex p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter prototype name"
              />

              <button
                onClick={handleSavePrototype}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Stages</h2>
            <button
              onClick={addStage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={20} />
              Create Stage
            </button>
          </div>

          <div className="space-y-6">
            {stages.map((stage) => (
              <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateStageName(stage.id, e.target.value)}
                    className="text-lg font-medium p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Stage name"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addTask(stage.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Plus size={16} />
                      Add Task
                    </button>
                    <button
                      onClick={() => deleteStage(stage.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {stage.tasks.map((task) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      stageId={stage.id}
                      level={0}
                      parentPath={[]}
                      onUpdateTask={updateTaskField}
                      onAddSubtask={addSubtask}
                      onDeleteTask={deleteTask}
                      onToggleExpansion={toggleExpansion}
                      isExpanded={expandedItems[task.id]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {stages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No stages created yet. Click "Create Stage" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeManagementPage;