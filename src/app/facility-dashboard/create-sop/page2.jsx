
"use client";

import { useState, useRef } from "react";
import { Plus, Minus, X, Trash2, Clock, Save, Camera, Check, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Photo Attachment Modal Component
function PhotoAttachmentModal({ 
    isOpen,
    onClose,
    onSave,
    initialTitle = "",
    initialDescription = "",
    initialPhotos = []
}) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [photos, setPhotos] = useState(initialPhotos);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPhotos = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPhotos.push({
                    url: event.target.result,
                    name: file.name,
                    size: file.size
                });

                if (newPhotos.length === files.length) {
                    setPhotos(prev => [...prev, ...newPhotos]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (photos.length === 0) {
            alert("Please add at least one photo");
            return;
        }
        onSave({ title, description, photos });
        onClose();
    };

    if (!isOpen) return null;

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
                                Add More Photos
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
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 mx-auto text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Select Photos
                                </button>
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
}

// Time Setting Modal Component
// function TimeSettingModal({ isOpen, onClose, onSave, initialMinTime, initialMaxTime }) {
//     const [minTime, setMinTime] = useState(initialMinTime || { hours: 0, minutes: 10, seconds: 0 });
//     const [maxTime, setMaxTime] = useState(initialMaxTime || { hours: 0, minutes: 30, seconds: 0 });

//     const adjustTime = (type, field, increment) => {
//         const setter = type === 'min' ? setMinTime : setMaxTime;
//         const current = type === 'min' ? minTime : maxTime;

//         setter(prev => {
//             let newValue = prev[field] + increment;

//             if (field === 'minutes' || field === 'seconds') {
//                 if (newValue >= 60) newValue = 0;
//                 else if (newValue < 0) newValue = 59;
//             } else if (field === 'hours' && newValue < 0) {
//                 newValue = 0;
//             }

//             return { ...prev, [field]: newValue };
//         });
//     };

//     const handleSave = () => {
//         onSave({ minTime, maxTime });
//         onClose();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//             <div className="bg-white rounded-xl p-6 w-[380px] shadow-2xl transform transition-all">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-gray-800">Set Task Duration</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>

//                 <div className="space-y-6">
//                     <div>
//                         <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
//                             <Clock className="w-4 h-4 text-green-600" />
//                             Minimum Duration
//                         </h3>
//                         <div className="flex gap-2 justify-center">
//                             {['hours', 'minutes', 'seconds'].map((field) => (
//                                 <div key={field} className="flex flex-col items-center">
//                                     <div className="flex items-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-2 shadow-sm">
//                                         <button
//                                             onClick={() => adjustTime('min', field, -1)}
//                                             className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
//                                         >
//                                             <Minus className="w-3 h-3" />
//                                         </button>
//                                         <span className="mx-2 text-md font-bold min-w-[40px] text-center text-gray-800">
//                                             {String(minTime[field]).padStart(2, '0')}
//                                         </span>
//                                         <button
//                                             onClick={() => adjustTime('min', field, 1)}
//                                             className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
//                                         >
//                                             <Plus className="w-3 h-3" />
//                                         </button>
//                                     </div>
//                                     <span className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
//                                         {field.charAt(0)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <h3 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
//                             <Clock className="w-4 h-4 text-blue-600" />
//                             Maximum Duration
//                         </h3>
//                         <div className="flex gap-2 justify-center">
//                             {['hours', 'minutes', 'seconds'].map((field) => (
//                                 <div key={field} className="flex flex-col items-center">
//                                     <div className="flex items-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-2 shadow-sm">
//                                         <button
//                                             onClick={() => adjustTime('max', field, -1)}
//                                             className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
//                                         >
//                                             <Minus className="w-3 h-3" />
//                                         </button>
//                                         <span className="mx-2 text-md font-bold min-w-[40px] text-center text-gray-800">
//                                             {String(maxTime[field]).padStart(2, '0')}
//                                         </span>
//                                         <button
//                                             onClick={() => adjustTime('max', field, 1)}
//                                             className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
//                                         >
//                                             <Plus className="w-3 h-3" />
//                                         </button>
//                                     </div>
//                                     <span className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
//                                         {field.charAt(0)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-all hover:border-gray-400 active:bg-gray-100 active:scale-95"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSave}
//                         className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-md active:scale-95"
//                     >
//                         Save
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
// Modern Time Setting Modal Component
function TimeSettingModal({ isOpen, onClose, onSave, initialMinTime, initialMaxTime }) {
    const [minTime, setMinTime] = useState(initialMinTime || { hours: 0, minutes: 10, seconds: 0 });
    const [maxTime, setMaxTime] = useState(initialMaxTime || { hours: 0, minutes: 30, seconds: 0 });

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
        onSave({ minTime, maxTime });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Header */}
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

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Minimum Duration */}
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

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-500 font-medium">to</span>
                        </div>
                    </div>

                    {/* Maximum Duration */}
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

                {/* Footer */}
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
}
function AttachPhotoButton({ onPhotoSelect, photos, photoTitle = "", photoDescription = "" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSavePhotos = ({ title, description, photos: newPhotos }) => {
        onPhotoSelect({
            photos: newPhotos.map(p => p.url),
            title,
            description
        });
    };

    const handleDeletePhoto = (index, e) => {
        e.stopPropagation();
        onPhotoSelect({
            photos: photos.filter((_, i) => i !== index),
            title: photoTitle,
            description: photoDescription
        });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 top-26"
            >
                <Camera className="w-4 h-4" />
                {photos.length > 0 ? `${photos.length} Photo(s)` : "Attach Photo"}
            </button>


            {isHovered && photos.length > 0 && (
                <div
                    className="absolute bottom-full mb-2 right-0 bg-white p-3 rounded-lg shadow-xl border border-gray-200 z-10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={photo}
                                    alt={`Attached ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    onClick={(e) => handleDeletePhoto(index, e)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <PhotoAttachmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSavePhotos}
                    initialTitle={photoTitle}
                    initialDescription={photoDescription}
                    initialPhotos={photos.map(photo => ({ url: photo }))}
                />
            )}
        </div>
    );
}

export default function SupervisorPage() {
    const [stages, setStages] = useState([]);
    const [tasks, setTasks] = useState({});
    const [selectedStage, setSelectedStage] = useState(null);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [sopName, setSopName] = useState("");
    const [sopNumber, setSopNumber] = useState("");
    const [editingTaskTitle, setEditingTaskTitle] = useState(null);
    const [editingSubtaskTitle, setEditingSubtaskTitle] = useState(null);
    const [editingDescription, setEditingDescription] = useState(null);
    const [taskCompletionStatus, setTaskCompletionStatus] = useState({});

    const toggleTaskCompletion = (taskId) => {
        setTaskCompletionStatus(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const calculateDurationInHours = (minTime, maxTime) => {
        const minHours = minTime.hours + (minTime.minutes / 60) + (minTime.seconds / 3600);
        const maxHours = maxTime.hours + (maxTime.minutes / 60) + (maxTime.seconds / 3600);
        return (minHours + maxHours) / 2;
    };

    const transformDataForBackend = () => {
        const transformedStages = stages.map(stage => {
            const stageTasks = tasks[stage.id] || [];

            const transformedTasks = stageTasks.map(task => {
                const transformedSubtasks = task.subtasks.map(subtask => ({
                    title: subtask.title,
                    description: subtask.description,
                    image: subtask.photos[0] || '',
                    duration: calculateDurationInHours(subtask.minTime, subtask.maxTime),
                    status: taskCompletionStatus[subtask.id] || false,
                    completed: taskCompletionStatus[subtask.id] || false
                }));

                return {
                    title: task.title,
                    description: task.description,
                    image: task.photos[0] || '',
                    duration: calculateDurationInHours(task.minTime, task.maxTime),
                    status: taskCompletionStatus[task.id] || false,
                    completed: taskCompletionStatus[task.id] || false,
                    subtasks: transformedSubtasks
                };
            });

            return {
                name: stage.name,
                tasks: transformedTasks
            };
        });

        return {
            title: sopName || "Untitled SOP",
            sopNumber: sopNumber || "",
            stages: transformedStages
        };
    };

    const handleSave = () => {
        if (stages.length === 0) {
            alert("Please add at least one stage before saving");
            return;
        }
        const dataToSave = transformDataForBackend();
        console.log("Data ready for backend:", dataToSave);
        alert("Check console for the data structure matching your Mongoose schema");
    };

    const addNewStage = () => {
        const newStageId = stages.length > 0 ? Math.max(...stages.map(s => s.id)) + 1 : 1;
        const newStage = { id: newStageId, name: `Stage ${newStageId}` };
        setStages([...stages, newStage]);
        setTasks(prev => ({ ...prev, [newStageId]: [] }));
        setSelectedStage(newStageId);
    };

    const deleteStage = (stageId) => {
        if (stages.length <= 1) return;
        setStages(stages.filter(stage => stage.id !== stageId));
        const newTasks = { ...tasks };
        delete newTasks[stageId];
        setTasks(newTasks);
        if (selectedStage === stageId) {
            setSelectedStage(stages.find(stage => stage.id !== stageId)?.id || null);
        }
    };

    const updateStageName = (stageId, newName) => {
        setStages(stages.map(stage => stage.id === stageId ? { ...stage, name: newName } : stage));
    };

    const addTask = (stageId) => {
        const stageTasks = tasks[stageId] || [];

        // Check if previous task is completed (if it exists)
        if (stageTasks.length > 0) {
            const lastTaskId = stageTasks[stageTasks.length - 1].id;
            if (!taskCompletionStatus[lastTaskId]) {
                alert("Please complete the previous task before adding a new one");
                return;
            }
        }

        const newTaskId = `${stageId}.${stageTasks.length + 1}`;
        const newTask = {
            id: newTaskId,
            title: `Task ${stageTasks.length + 1}`,
            description: "Describe the task details here...",
            minTime: { hours: 0, minutes: 10, seconds: 0 },
            maxTime: { hours: 0, minutes: 30, seconds: 0 },
            photos: [],
            photoTitle: "",
            photoDescription: "",
            subtasks: []
        };
        setTasks(prev => ({ ...prev, [stageId]: [...stageTasks, newTask] }));

    };

    const addSubTask = (stageId, taskId) => {
        setTasks(prev => {
            const stageTasks = prev[stageId];
            const updatedTasks = stageTasks.map(task => {
                if (task.id === taskId) {
                    // Check if previous subtask is completed (if it exists)
                    if (task.subtasks.length > 0) {
                        const lastSubtaskId = task.subtasks[task.subtasks.length - 1].id;
                        if (!taskCompletionStatus[lastSubtaskId]) {
                            alert("Please complete the previous subtask before adding a new one");
                            return task;
                        }
                    }

                    const newSubtask = {
                        id: `${taskId}.${task.subtasks.length + 1}`,
                        title: `${task.title} Part ${task.subtasks.length + 1}`,
                        description: task.description,
                        minTime: { hours: 0, minutes: 5, seconds: 0 },
                        maxTime: { hours: 0, minutes: 15, seconds: 0 },
                        photos: [],
                        photoTitle: "",
                        photoDescription: ""
                    };
                    return {
                        ...task,
                        subtasks: [...task.subtasks, newSubtask]
                    };
                }
                return task;
            });
            return { ...prev, [stageId]: updatedTasks };
        });
    };

    const updateTaskTitle = (stageId, taskId, newTitle) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            const stageTasks = updatedTasks[stageId];

            if (taskId.split('.').length > 2) {
                const parentTaskId = taskId.split('.').slice(0, 2).join('.');
                const updatedTasksWithSubtasks = stageTasks.map(task => {
                    if (task.id === parentTaskId) {
                        const updatedSubtasks = task.subtasks.map(subtask => {
                            if (subtask.id === taskId) {
                                return { ...subtask, title: newTitle };
                            }
                            return subtask;
                        });
                        return { ...task, subtasks: updatedSubtasks };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithSubtasks };
            } else {
                const updatedTasksWithTitle = stageTasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, title: newTitle };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithTitle };
            }
        });
        setEditingTaskTitle(null);
        setEditingSubtaskTitle(null);
    };

    const updateTaskDescription = (stageId, taskId, newDescription) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            const stageTasks = updatedTasks[stageId];

            if (taskId.split('.').length > 2) {
                const parentTaskId = taskId.split('.').slice(0, 2).join('.');
                const updatedTasksWithSubtasks = stageTasks.map(task => {
                    if (task.id === parentTaskId) {
                        const updatedSubtasks = task.subtasks.map(subtask => {
                            if (subtask.id === taskId) {
                                return { ...subtask, description: newDescription };
                            }
                            return subtask;
                        });
                        return { ...task, subtasks: updatedSubtasks };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithSubtasks };
            } else {
                const updatedTasksWithDescription = stageTasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, description: newDescription };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithDescription };
            }
        });
        setEditingDescription(null);
    };

    const handleSetTimeForTask = (taskId) => {
        setSelectedTaskId(taskId);
        setIsTimeModalOpen(true);
    };

    const handleSaveTime = (timeData) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            for (const stageId in updatedTasks) {
                const stageTasks = updatedTasks[stageId];
                const taskIndex = stageTasks.findIndex(task => task.id === selectedTaskId);
                if (taskIndex !== -1) {
                    updatedTasks[stageId][taskIndex] = {
                        ...updatedTasks[stageId][taskIndex],
                        minTime: timeData.minTime,
                        maxTime: timeData.maxTime
                    };
                    return updatedTasks;
                }
                for (let i = 0; i < stageTasks.length; i++) {
                    const subtaskIndex = stageTasks[i].subtasks.findIndex(subtask => subtask.id === selectedTaskId);
                    if (subtaskIndex !== -1) {
                        updatedTasks[stageId][i].subtasks[subtaskIndex] = {
                            ...updatedTasks[stageId][i].subtasks[subtaskIndex],
                            minTime: timeData.minTime,
                            maxTime: timeData.maxTime
                        };
                        return updatedTasks;
                    }
                }
            }
            return updatedTasks;
        });
        setIsTimeModalOpen(false);
    };

    const handlePhotoUpdate = (stageId, taskId, { photos, title, description }) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            const stageTasks = updatedTasks[stageId];

            if (taskId.split('.').length > 2) {
                const parentTaskId = taskId.split('.').slice(0, 2).join('.');
                const updatedTasksWithSubtasks = stageTasks.map(task => {
                    if (task.id === parentTaskId) {
                        const updatedSubtasks = task.subtasks.map(subtask => {
                            if (subtask.id === taskId) {
                                return {
                                    ...subtask,
                                    photos,
                                    photoTitle: title,
                                    photoDescription: description
                                };
                            }
                            return subtask;
                        });
                        return { ...task, subtasks: updatedSubtasks };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithSubtasks };
            } else {
                const updatedTasksWithPhotos = stageTasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            photos,
                            photoTitle: title,
                            photoDescription: description
                        };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasksWithPhotos };
            }
        });
    };

    const formatTimeDisplay = (time) => {
        if (!time) return "Not set";
        const { hours, minutes, seconds } = time;
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
    };

    const confirmDeleteTask = (stageId, taskId) => {
        setDeletingTaskId(taskId);
    };

    const cancelDeleteTask = () => {
        setDeletingTaskId(null);
    };

    const deleteTask = (stageId, taskId) => {
        setTasks(prev => {
            const stageTasks = prev[stageId];
            if (taskId.split('.').length > 2) {
                const parentTaskId = taskId.split('.').slice(0, 2).join('.');
                const updatedTasks = stageTasks.map(task => {
                    if (task.id === parentTaskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.filter(subtask => subtask.id !== taskId)
                        };
                    }
                    return task;
                });
                return { ...prev, [stageId]: updatedTasks };
            } else {
                return { ...prev, [stageId]: stageTasks.filter(task => task.id !== taskId) };
            }
        });
        setDeletingTaskId(null);
    };

    return (
        <>
            <div className="space-y-8">
                <Link href="/facility-dashboard" className="flex gap-2 h-6 items-center text-center">
                    <ArrowLeft /> <span className="font-medium text-xl">Back</span>
                </Link>
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-4">

                        <div className="flex gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">Prototype Name</label>
                                <input
                                    type="text"
                                    value={sopName}
                                    onChange={(e) => setSopName(e.target.value)}
                                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter Prototype Name"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                            <Trash2 className="w-5 h-5" />
                        </button> */}
                        <button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Save Prototype Created
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Left Panel - Stages */}
                    <div className="w-80 space-y-4">
                        {stages.map((stage) => (
                            <div
                                key={stage.id}
                                className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 ${selectedStage === stage.id ? 'border-blue-500' : 'border-blue-200'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                                onClick={() => setSelectedStage(stage.id)}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-blue-800 text-lg">Stage {stage.id}</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDeleteTask(stage.id, `stage-${stage.id}`);
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100 active:bg-red-200"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Stage Name</label>
                                    <input
                                        type="text"
                                        value={stage.name}
                                        onChange={(e) => updateStageName(stage.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full p-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-sm transition-all font-medium"
                                        placeholder="Enter stage name..."
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addNewStage}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-3 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
                        >
                            <Plus className="w-6 h-6" />
                            Add New Stage
                        </button>
                    </div>

                    {/* Right Panel - Tasks */}
                    <div className="flex-1 space-y-6">
                        {selectedStage ? (
                            tasks[selectedStage]?.length > 0 ? (
                                <>
                                    {tasks[selectedStage].map((task) => (
                                        <div key={task.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleTaskCompletion(task.id)}
                                                        className={`p-2 rounded-full transition-colors ${taskCompletionStatus[task.id] ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                                        title={taskCompletionStatus[task.id] ? "Task is complete" : "Task is incomplete"}
                                                    >
                                                        {taskCompletionStatus[task.id] ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Lock className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    {editingTaskTitle === task.id ? (
                                                        <input
                                                            type="text"
                                                            defaultValue={task.title}
                                                            onBlur={(e) => updateTaskTitle(selectedStage, task.id, e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && updateTaskTitle(selectedStage, task.id, e.target.value)}
                                                            autoFocus
                                                            className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 outline-none"
                                                        />
                                                    ) : (
                                                        <h3
                                                            className="text-xl font-bold text-gray-800 cursor-pointer hover:underline"
                                                            onClick={() => setEditingTaskTitle(task.id)}
                                                        >
                                                            Task {task.id}: {task.title}
                                                        </h3>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-3">
                                                     <button
    onClick={() => addTask(selectedStage)}
    disabled={
      tasks[selectedStage]?.length > 0 &&
      !taskCompletionStatus[tasks[selectedStage][tasks[selectedStage].length - 1].id]
    }
    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 ${
      tasks[selectedStage]?.length === 0 ||
      taskCompletionStatus[tasks[selectedStage][tasks[selectedStage].length - 1].id]
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
  >
    <Plus className="w-5 h-5" />
    Add New Task to Stage {selectedStage}
  </button>
                                                    <button
                                                        onClick={() => handleSetTimeForTask(task.id)}
                                                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
                                                    >
                                                        <Clock className="w-5 h-5" />
                                                        Set Duration
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDeleteTask(selectedStage, task.id)}
                                                        className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {deletingTaskId === task.id && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-700 mb-2">Delete this task and all its subtasks?</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => deleteTask(selectedStage, task.id)}
                                                            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700 active:scale-95"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={cancelDeleteTask}
                                                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 active:scale-95"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-4">
                                                {/* Description Textarea */}
                                                {editingDescription === task.id ? (
                                                    <textarea
                                                        defaultValue={task.description}
                                                        onBlur={(e) =>
                                                            updateTaskDescription(selectedStage, task.id, e.target.value)
                                                        }
                                                        onKeyPress={(e) =>
                                                            e.key === "Enter" &&
                                                            updateTaskDescription(selectedStage, task.id, e.target.value)
                                                        }
                                                        autoFocus
                                                        className="flex-1 p-4 border-2 border-blue-500 rounded-xl bg-white resize-none font-medium text-gray-700 shadow-sm"
                                                        rows="3"
                                                    />
                                                ) : (
                                                    <textarea
                                                        value={task.description}
                                                        onClick={() => setEditingDescription(task.id)}
                                                        readOnly
                                                        className="flex-1 p-4 border-2 border-gray-200 rounded-xl bg-gray-50 resize-none font-medium text-gray-700 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
                                                        rows="3"
                                                    />
                                                )}

                                                {/* Button + Time in one line */}
                                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                                    <AttachPhotoButton
                                                        onPhotoSelect={(data) =>
                                                            handlePhotoUpdate(selectedStage, task.id, data)
                                                        }
                                                        photos={task.photos}
                                                        photoTitle={task.photoTitle}
                                                        photoDescription={task.photoDescription}
                                                    />

                                                    <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                                        <span className="text-green-600">
                                                            Min: {formatTimeDisplay(task.minTime)}
                                                        </span>
                                                        <span className="mx-2">|</span>
                                                        <span className="text-blue-600">
                                                            Max: {formatTimeDisplay(task.maxTime)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Optional: Show photo title & description below */}
                                                {(task.photoTitle || task.photoDescription) && (
                                                    <div className="text-sm text-gray-600">
                                                        {task.photoTitle && (
                                                            <p className="font-medium">Photo Title: {task.photoTitle}</p>
                                                        )}
                                                        {task.photoDescription && (
                                                            <p className="text-gray-500">Description: {task.photoDescription}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>


                                            <div className="mb-6">
                                                <p className="text-sm font-semibold text-gray-700 mt-4 mb-4">Break Down Task into Sub-Tasks</p>
                                               <div className="flex gap-3 mb-6">
                                                    <button
                                                        onClick={() => addSubTask(selectedStage, task.id)}
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Create Sub-Task
                                                    </button>
                                                </div>
                                            </div>

                                            {task.subtasks.map((subtask) => (
                                                <div key={subtask.id} className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleTaskCompletion(subtask.id)}
                                                                className={`p-1 rounded-full transition-colors ${taskCompletionStatus[subtask.id] ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                                                title={taskCompletionStatus[subtask.id] ? "Subtask is complete" : "Subtask is incomplete"}
                                                            >
                                                                {taskCompletionStatus[subtask.id] ? (
                                                                    <Check className="w-3 h-3" />
                                                                ) : (
                                                                    <Lock className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                            {editingSubtaskTitle === subtask.id ? (
                                                                <input
                                                                    type="text"
                                                                    defaultValue={subtask.title}
                                                                    onBlur={(e) => updateTaskTitle(selectedStage, subtask.id, e.target.value)}
                                                                    onKeyPress={(e) => e.key === 'Enter' && updateTaskTitle(selectedStage, subtask.id, e.target.value)}
                                                                    autoFocus
                                                                    className="font-bold text-gray-800 border-b-2 border-blue-500 outline-none"
                                                                />
                                                            ) : (
                                                                <h4
                                                                    className="font-bold text-gray-800 text-lg cursor-pointer hover:underline"
                                                                    onClick={() => setEditingSubtaskTitle(subtask.id)}
                                                                >
                                                                    Task {subtask.id}: {subtask.title}
                                                                </h4>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleSetTimeForTask(subtask.id)}
                                                                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-md hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                                Time
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDeleteTask(selectedStage, subtask.id)}
                                                                className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {deletingTaskId === subtask.id && (
                                                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                            <p className="text-xs text-red-700 mb-2">Delete this subtask?</p>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => deleteTask(selectedStage, subtask.id)}
                                                                    className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 active:scale-95"
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    onClick={cancelDeleteTask}
                                                                    className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100 active:scale-95"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mb-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="block text-sm font-semibold text-gray-700">Task Description</label>
                                                            <div className="text-xs font-medium text-gray-600">
                                                                <span className="text-green-600">Min: {formatTimeDisplay(subtask.minTime)}</span>
                                                                <span className="mx-1">|</span>
                                                                <span className="text-blue-600">Max: {formatTimeDisplay(subtask.maxTime)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {editingDescription === subtask.id ? (
                                                                <textarea
                                                                    defaultValue={subtask.description}
                                                                    onBlur={(e) => updateTaskDescription(selectedStage, subtask.id, e.target.value)}
                                                                    onKeyPress={(e) => e.key === 'Enter' && updateTaskDescription(selectedStage, subtask.id, e.target.value)}
                                                                    autoFocus
                                                                    className="flex-1 p-3 border-2 border-blue-500 rounded-xl bg-white resize-none font-medium text-gray-700 shadow-sm text-sm"
                                                                    rows="2"
                                                                />
                                                            ) : (
                                                                <textarea
                                                                    value={subtask.description}
                                                                    onClick={() => setEditingDescription(subtask.id)}
                                                                    readOnly
                                                                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl bg-white resize-none font-medium text-gray-700 shadow-sm text-sm cursor-pointer hover:border-gray-300 transition-all"
                                                                    rows="2"
                                                                />
                                                            )}
                                                            <AttachPhotoButton
                                                                onPhotoSelect={(data) => handlePhotoUpdate(selectedStage, subtask.id, data)}
                                                                photos={subtask.photos}
                                                                photoTitle={subtask.photoTitle}
                                                                photoDescription={subtask.photoDescription}
                                                            />
                                                        </div>
                                                        {subtask.photoTitle && (
                                                            <div className="mt-2 text-xs text-gray-600">
                                                                <p className="font-medium">Photo Title: {subtask.photoTitle}</p>
                                                                {subtask.photoDescription && (
                                                                    <p className="text-gray-500">Description: {subtask.photoDescription}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                {  /*  <button
                                        onClick={() => addTask(selectedStage)}
                                        disabled={tasks[selectedStage]?.length > 0 && !taskCompletionStatus[tasks[selectedStage][tasks[selectedStage].length - 1].id]}
                                        className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 ${tasks[selectedStage]?.length === 0 || taskCompletionStatus[tasks[selectedStage][tasks[selectedStage].length - 1].id]
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <Plus className="w-6 h-6" />
                                        Add New Task to Stage {selectedStage}
                                        {tasks[selectedStage]?.length > 0 && !taskCompletionStatus[tasks[selectedStage][tasks[selectedStage].length - 1].id] && (
                                            <span className="ml-2 text-sm">(Complete previous task first)</span>
                                        )}
                                    </button>*/}
                                </>
                            ) : (
                                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center h-64">
                                    <p className="text-gray-500 mb-6">No tasks created for this stage yet</p>
                                    <button
                                        onClick={() => addTask(selectedStage)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Create First Task
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center h-64">
                                <p className="text-gray-500 mb-6">No stage selected. Please add a stage first.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isTimeModalOpen && (
                <TimeSettingModal
                    isOpen={isTimeModalOpen}
                    onClose={() => setIsTimeModalOpen(false)}
                    onSave={handleSaveTime}
                    initialMinTime={
                        selectedTaskId?.split('.').length > 2
                            ? tasks[selectedTaskId.split('.')[0]][parseInt(selectedTaskId.split('.')[1]) - 1]?.subtasks
                                .find(sub => sub.id === selectedTaskId)?.minTime
                            : tasks[selectedTaskId?.split('.')[0]]?.[parseInt(selectedTaskId?.split('.')[1]) - 1]?.minTime
                    }
                    initialMaxTime={
                        selectedTaskId?.split('.').length > 2
                            ? tasks[selectedTaskId.split('.')[0]][parseInt(selectedTaskId.split('.')[1]) - 1]?.subtasks
                                .find(sub => sub.id === selectedTaskId)?.maxTime
                            : tasks[selectedTaskId?.split('.')[0]]?.[parseInt(selectedTaskId?.split('.')[1]) - 1]?.maxTime
                    }
                />
            )}
        </>
    );
}
