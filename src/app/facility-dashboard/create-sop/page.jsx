// "use client"

// import React, { useState, useCallback, useMemo } from 'react';
// import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight } from 'lucide-react';

// // Moved TaskComponent outside the parent component to prevent recreation
// const TaskComponent = React.memo(({ 
//   task, 
//   stageId, 
//   level = 0, 
//   parentPath = [], 
//   onUpdateTask, 
//   onAddSubtask, 
//   onDeleteTask, 
//   onToggleExpansion, 
//   onImageAttachment,
//   isExpanded
// }) => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;

//   // Memoized depth styles calculation
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

//   return (
//     <div 
//       className={`border rounded-lg p-4 ${depthStyles.border} ${depthStyles.bg} mb-3`} 
//       style={{ 
//         marginLeft: level > 0 ? `${level * 16}px` : '0',
//         transition: 'all 0.2s ease'
//       }}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           {hasSubtasks && (
//             <button
//               onClick={() => onToggleExpansion(task.id)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           <span className="font-medium text-gray-700">
//             {level === 0 ? 'Task' : `Subtask (Level ${level})`}
//           </span>
//         </div>
//         <button
//           onClick={() => onDeleteTask(stageId, task.id, parentPath)}
//           className="text-red-500 hover:text-red-700 p-1"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Title
//           </label>
//           <input
//             type="text"
//             value={task.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             value={task.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             rows={3}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter task description"
//           />
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onAddSubtask(stageId, task.id, parentPath)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
//           >
//             <Plus size={14} />
//             Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
//           </button>

//           <div className="flex items-center gap-2">
//             <button
//               className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//             >
//               <Clock size={14} />
//               Set Duration
//             </button>
//             <input
//               type="number"
//               value={task.minDuration}
//               onChange={(e) => handleChange('minDuration', e.target.value)}
//               placeholder="Min"
//               className="w-16 p-1 border border-gray-300 rounded text-xs"
//             />
//             <input
//               type="number"
//               value={task.maxDuration}
//               onChange={(e) => handleChange('maxDuration', e.target.value)}
//               placeholder="Max"
//               className="w-16 p-1 border border-gray-300 rounded text-xs"
//             />
//           </div>

//           <button
//             onClick={() => onImageAttachment(stageId, task.id, parentPath)}
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
//               onImageAttachment={onImageAttachment}
//               isExpanded={isExpanded}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   // Only re-render if these specific props change
//   return (
//    prevProps.task === nextProps.task &&
//     prevProps.isExpanded === nextProps.isExpanded
//   );
// });

// TaskComponent.displayName = 'TaskComponent';

// const PrototypeManagementPage = () => {
//   const [prototypeName, setPrototypeName] = useState('');
//   const [stages, setStages] = useState([]);
//   const [expandedItems, setExpandedItems] = useState({});

//   // Add a new stage
//   const addStage = useCallback(() => {
//     const newStage = {
//       id: Date.now(),
//       name: `Stage ${stages.length + 1}`,
//       tasks: []
//     };
//     setStages(prev => [...prev, newStage]);
//   }, [stages.length]);

//   // Add a new task to a stage
//   const addTask = useCallback((stageId) => {
//     const newTask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       attachedImage: null,
//       subtasks: []
//     };
    
//     setStages(prev => prev.map(stage => 
//       stage.id === stageId 
//         ? { ...stage, tasks: [...stage.tasks, newTask] }
//         : stage
//     ));
//   }, []);

//   // Add a subtask to a task (supports unlimited nesting)
//   const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
//     const newSubtask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       attachedImage: null,
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

//   // Update task or subtask field (supports unlimited nesting)
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

//   // Delete task or subtask (supports unlimited nesting)
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

//   // Delete stage
//   const deleteStage = useCallback((stageId) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   }, []);

//   // Toggle expansion
//   const toggleExpansion = useCallback((id) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   }, []);

//   // Handle image attachment (supports unlimited nesting)
//   const handleImageAttachment = useCallback((stageId, taskId, parentPath = []) => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           updateTaskField(stageId, taskId, 'attachedImage', event.target.result, parentPath);
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   }, [updateTaskField]);

//   // Update stage name
//   const updateStageName = useCallback((stageId, name) => {
//     setStages(prev => prev.map(s => 
//       s.id === stageId ? { ...s, name } : s
//     ));
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Prototype Management</h1>
        
//         {/* Prototype Name Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Prototype Name
//             </label>
//             <input
//               type="text"
//               value={prototypeName}
//               onChange={(e) => setPrototypeName(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter prototype name"
//             />
//           </div>
//         </div>

//         {/* Stages Section */}
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
//                       onImageAttachment={handleImageAttachment}
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

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera } from 'lucide-react';

const ImageAttachmentModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (photos.length === 0) {
      alert('Please add at least one photo');
      return;
    }
    
    console.log("Image data being saved:", {
      title,
      description,
      photos: photos.map(photo => ({
        name: photo.name,
        size: photo.size,
        type: photo.file.type
      }))
    });

    onSave({
      title,
      description,
      photos
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Attach Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
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
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700">Photos</label>
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Photos
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => removePhoto(index)}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      {photo.name} ({(photo.size / 1024).toFixed(1)}KB)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No photos selected</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const DurationModal = ({ onClose, onSave, initialMin = '', initialMax = '' }) => {
  const [minDuration, setMinDuration] = useState(initialMin);
  const [maxDuration, setMaxDuration] = useState(initialMax);

  const handleSave = () => {
    onSave({
      minDuration,
      maxDuration
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Set Duration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Duration</label>
            <input
              type="number"
              value={minDuration}
              onChange={(e) => setMinDuration(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter minimum duration"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Duration</label>
            <input
              type="number"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter maximum duration"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

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
    if (imageData.photos.length > 0) {
      onUpdateTask(stageId, task.id, 'attachedImage', imageData.photos[0].url, parentPath);
      onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
      onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
    }
  };

  const handleDurationSave = (duration) => {
    onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
    onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
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
          onClose={() => setShowImageModal(false)}
          onSave={handleImageSave}
        />
      )}

      {showDurationModal && (
        <DurationModal
          onClose={() => setShowDurationModal(false)}
          onSave={handleDurationSave}
          initialMin={task.minDuration}
          initialMax={task.maxDuration}
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
            onClick={() => setShowImageModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
          >
            <Image size={14} />
            Attach Image
          </button>
        </div>

        {task.attachedImage && (
          <div className="mt-2">
            <img
              src={task.attachedImage}
              alt="Attached"
              className="max-w-xs max-h-32 object-cover rounded border"
            />
            {task.imageTitle && <p className="text-sm font-medium mt-1">{task.imageTitle}</p>}
            {task.imageDescription && <p className="text-sm text-gray-600">{task.imageDescription}</p>}
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
      attachedImage: null,
      imageTitle: '',
      imageDescription: '',
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
      attachedImage: null,
      imageTitle: '',
      imageDescription: '',
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

  const deleteStage = useCallback((stageId) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  }, []);

  const toggleExpansion = useCallback((id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

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
                onClick={() => {
                  console.group("📝 Prototype Data Submitted");
                  console.log("Prototype Name:", prototypeName);
                  console.log("Stages:", JSON.parse(JSON.stringify(stages, (key, value) => {
                    if (key === 'url' || key === 'attachedImage') {
                      return value ? '[Image URL]' : null;
                    }
                    return value;
                  })));
                  console.groupEnd();
                  
                  stages.forEach(stage => {
                    stage.tasks.forEach(task => {
                      if (task.attachedImage) {
                        console.log(`Task ${task.id} image:`, task.attachedImage);
                      }
                    });
                  });
                }}
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