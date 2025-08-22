"use client"
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus, ArrowBigLeftDash, ArrowBigLeft } from 'lucide-react';
import { ArrowLeft } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

    const uploadedPhotos = photos.filter(photo => photo.public_id);

    onSave({
      title,
      description,
      photos: uploadedPhotos
    });
    onClose();
  };

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Attach Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {

                setTitle(e.target.value);
              }}

              // onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Photo title"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Photo description"
              disabled={isUploading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                disabled={isUploading}
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
                disabled={isUploading}
              />
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={photo.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">No photos selected</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const DurationModal = ({
  onClose,
  onSave,
    initialMin = { hours: 0, minutes: 0, seconds: 0 },
 initialMax = { hours: 0, minutes: 0, seconds: 0 }

}) => {
 const [minTime, setMinTime] = useState(initialMin);
  const [maxTime, setMaxTime] = useState(initialMax);
  const [activeInput, setActiveInput] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [hasUserModified, setHasUserModified] = useState(false);

  // useEffect(() => {
  //   setMinTime({ hours: 0, minutes: 0, seconds: 0 });
  //   setMaxTime({ hours: 0, minutes: 0, seconds: 0 });
  // }, []);

  const validateAndSetTime = (type, field, value) => {
    setHasUserModified(true);
    const digitsOnly = value.replace(/\D/g, '').slice(0, 2);
    let numValue = parseInt(digitsOnly, 10) || 0;

    if (field === 'minutes' || field === 'seconds') {
      numValue = Math.min(59, numValue);
    }

    const setter = type === 'min' ? setMinTime : setMaxTime;
    const otherTime = type === 'min' ? maxTime : minTime;

    setter(prev => {
      const newTime = { ...prev, [field]: numValue };
      const newTotal = newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds;
      const otherTotal = otherTime.hours * 3600 + otherTime.minutes * 60 + otherTime.seconds;

      if (type === 'min' && newTotal > otherTotal) {
        setMaxTime(newTime);
      }

      return newTime;
    });
  };

  const adjustTime = (type, field, increment) => {
    setHasUserModified(true);
    const current = type === 'min' ? minTime : maxTime;
    const newValue = Math.max(0, current[field] + increment);
    validateAndSetTime(type, field, newValue.toString());
  };

  const handleInputChange = (type, field, e) => {
    validateAndSetTime(type, field, e.target.value);
  };

  const handleFocus = (type, field, e) => {
    setActiveInput(`${type}-${field}`);
    e.target.select();
  };

  const formatDisplayValue = (value) => {
    return String(value).padStart(2, '0');
  };

  const handleSave = () => {
    const minTotal = minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds;
    const maxTotal = maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds;

    if (maxTotal < minTotal) {
      setAlertMessage('Maximum duration must be ≥ minimum duration');
      setShowAlert(true);
      return;
    }

    const minTotalMinutes = minTime.hours * 60 + minTime.minutes;
    const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes;

    onSave({
      minDuration: minTotalMinutes,
      maxDuration: maxTotalMinutes,
      minTime,
      maxTime,
      wasModified: hasUserModified
    });
    onClose();
  };

  const renderTimeField = (type, field) => {
    const currentTime = type === 'min' ? minTime : maxTime;
    const isActive = activeInput === `${type}-${field}`;
    const colorClass = type === 'min' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600';
    const ringColor = type === 'min' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500';

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <button
            onClick={() => adjustTime(type, field, 1)}
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
          >
            <Plus className="w-2.5 h-2.5" />
          </button>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={isActive ? currentTime[field] : formatDisplayValue(currentTime[field])}
            onChange={(e) => handleInputChange(type, field, e)}
            onFocus={(e) => handleFocus(type, field, e)}
            onBlur={() => setActiveInput(null)}
            className={`w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg text-center text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 ${ringColor}`}
          />

          <button
            onClick={() => adjustTime(type, field, -1)}
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
        </div>
        <span className="text-xs mt-4 font-medium text-gray-500 mt-1 uppercase">
          {field.slice(0, 3)}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Set Duration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {showAlert && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {alertMessage}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Minimum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={`min-${field}`}>
                  {renderTimeField('min', field)}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-gray-500">to</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Maximum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={`max-${field}`}>
                  {renderTimeField('max', field)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
  expandedItems,
  taskNumber = '1.1'
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  useEffect(() => {
    if (hasSubtasks && expandedItems[task.id] === undefined) {
      onToggleExpansion(task.id);
    }
  }, [hasSubtasks, task.id, expandedItems, onToggleExpansion]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const depthStyles = useMemo(() => {
    const colors = ['border-indigo-200', 'border-blue-200', 'border-emerald-200', 'border-purple-200', 'border-rose-200', 'border-amber-200'];
    const bgColors = ['bg-white', 'bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50'];
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

  const isExpanded = expandedItems[task.id] || false;

  return (
    <div
      className={`border-2 ${depthStyles.border} ${depthStyles.bg} rounded-2xl p-4 sm:p-6 mb-4 shadow-md hover:shadow-lg transition-all duration-300`}
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
          initialMin={task.minTime || { hours: 0, minutes: 0, seconds: 0 }}
          initialMax={task.maxTime || { hours: 0, minutes: 0, seconds: 0 }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {hasSubtasks && (
            <button onClick={() => onToggleExpansion(task.id)} className="text-gray-600 hover:text-gray-800 transition-colors">
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          <span className="font-semibold text-gray-900 text-base sm:text-lg tracking-tight">
            {taskNumber}. {level === 0 ? 'Task' : `Subtask`}
          </span>
        </div>
        <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => {
              const input = e.target.value;
              // const onlyLetters = input.replace(/[^a-zA-Z\s]/g, ''); // removes numbers and special chars
              handleChange('title', input);
            }}
            // onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter task description"
          />
        </div>

        {/* {(task.minDuration || task.maxDuration) && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
              <span className="font-semibold">Duration:</span>
              <span className="font-medium">
                {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)}
                {' → '}
                {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
              </span>
            </div>
          </div>
        )} */}

        {(task.minDuration || task.maxDuration) && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col justify-center gap-3 text-sm text-gray-700">
                    
                      <div className="font-semibold flex items-center">   <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" /> Duration:</div>
                      
                      <div className="font-medium flex gap-4">
                        <span> Minimun Duration :  {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)}</span>
                         <span> Maximum Duration :    {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}</span>
                     
                       
                        
                      </div>
                    </div>
                  </div>
                )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onAddSubtask(stageId, task.id, parentPath)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Plus size={14} />
            Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
          </button>

          <button
            onClick={() => setShowDurationModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Clock size={14} />
            Set Duration
          </button>

          <button
            onClick={handleOpenImageModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Image size={14} />
            Attach Images
          </button>
        </div>

        {task.attachedImages && task.attachedImages.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {task.attachedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Attached ${index + 1}`}
                    className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  {image.name && <p className="text-sm font-medium text-gray-800 mt-2 truncate">{image.name}</p>}
                  {image.description && <p className="text-xs sm:text-sm text-gray-600">{image.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {hasSubtasks && isExpanded && (
        <div className="mt-4 sm:mt-6 space-y-4">
          {task.subtasks.map((subtask, index) => (
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
              expandedItems={expandedItems}
              taskNumber={`${taskNumber}.${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task === nextProps.task &&
    prevProps.expandedItems === nextProps.expandedItems &&
    prevProps.taskNumber === nextProps.taskNumber
  );
});

TaskComponent.displayName = 'TaskComponent';

const PrototypeManagementPage = () => {
  const [prototypeName, setPrototypeName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
const [documentNo, setDocumentNo] = useState('');
const [effectiveDate, setEffectiveDate] = useState('');
const [version, setVersion] = useState('1.0');
  const [error, setError] = useState('');
  const [stages, setStages] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedStage, setSelectedStage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const addStage = useCallback(() => {
    const newStage = {
      id: Date.now(),
      name: `Stage ${stages.length + 1}`,
      tasks: []
    };
    setStages(prev => [...prev, newStage]);
    if (stages.length === 0) {
      setSelectedStage(newStage.id);
    }
  }, [stages.length]);
  const showToastMessage = () => {
    toast.error("Checklist Name Already Exists", {
      position: "top-center"
    });
  };
  const showToastStageMessage = () => {
    toast.error("Please create at least one stage", {
      position: "top-center"
    });
  };
  const updateStageName = useCallback((stageId, newName) => {
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, name: newName }
        : stage
    ));
  }, []);
  const checkIfChecklistExists = async (name) => {
    try {
      const res = await fetch(`/api/checklist/exist/${name}`);
      const data = await res.json();
      return data.exists; // true or false
    } catch (err) {
      console.error('Error checking checklist name:', err);
      return false; // fallback to allow
    }
  };

  const addTask = useCallback((stageId) => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      minDuration: '',
      maxDuration: '',
      minTime: { hours: 0, minutes: 0, seconds: 0 },
      maxTime: { hours: 0, minutes: 0, seconds: 0 },
      attachedImages: [],
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
      minTime: { hours: 0, minutes: 0, seconds: 0 },
      maxTime: { hours: 0, minutes: 0, seconds: 0 },
      attachedImages: [],
      imageTitle: '',
      imageDescription: '',
      imagePublicId: null,
      subtasks: []
    };
    setExpandedItems(prev => ({
      ...prev,
      [taskId]: true
    }));
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
    if (selectedStage === stageId) {
      setSelectedStage(stages.length > 1 ? stages[0].id : null);
    }
  }, [selectedStage, stages]);

  const toggleExpansion = useCallback((id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const validatePrototype = () => {
    if (!prototypeName.trim()) {
      setError('Checklist name is required');
      // alert('Please enter a Checklist name');
      return false;
    }

    if (stages.length === 0) {
      showToastStageMessage()
      // alert('Please create at least one stage');
      return false;
    }

    for (const stage of stages) {
      if (stage.tasks.length === 0) {
        alert(`Stage "${stage.name}" has no tasks. Please add at least one task.`);
        return false;
      }

      for (const task of stage.tasks) {
        if (!task.title.trim()) {
          alert(`Please enter a title for all tasks`);
          return false;
        }
      }
    }

    return true;
  };


  const handleSavePrototype = async () => {
     
    setIsSaving(true);
    if (!validatePrototype()) {
      return;
    }
    const exists = await checkIfChecklistExists(prototypeName);
    if (exists) {
      showToastMessage();
      
      return;
    }
   
    try {
      const userData = JSON.parse(localStorage.getItem('user'));

      const stagesToSave = JSON.parse(JSON.stringify(stages, (key, value) => {
        if (key === 'file') return undefined;
        if (key === 'url' && value && value.startsWith('blob:')) return undefined;
        return value;
      }));

     
      const requestData = {
  name: prototypeName,
  departmentName,
  documentNo,
  effectiveDate,
  version,
  stages: stagesToSave,
  companyId: userData.companyId,
  status: "InProgress",
  userId: userData.id
};
       console.log(requestData);

      const response = await fetch('/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      router.push('/dashboard/create-checklist');
    } catch (error) {
      console.error("Error saving Checklist:", error);
      alert('Failed to save Checklist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:p-6 md:px-8 relative">
    {isSaving && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-xl">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-700 font-medium">Saving Checklist...</p>
          </div>
        </div>
      )}
      <div className="max-w-full mx-auto">

        <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
          <Link href="/dashboard/create-checklist" className="flex items-center gap-2 font-semibold text-gray-800 text-lg cursor-pointer">
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </Link>
        </button>


        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4 sm:mb-6 tracking-tight">Checklist Creation</h1>

       
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-6 mb-6 sm:mb-8 transition-all duration-300 ">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Checklist Name */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Checklist Name*</label>
      <input
        type="text"
        required
        value={prototypeName}
        onChange={(e) => {
          const input = e.target.value;
          const onlyLetters = input.replace(/[^a-zA-Z\s]/g, '');
          setPrototypeName(onlyLetters);
          if (error) setError('');
        }}
        className={`w-full p-3 border rounded-xl focus:outline-none transition-all duration-200 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500 hover:border-indigo-300'}`}
        placeholder="Enter Checklist name"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>

    {/* Department Name */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Department Name*</label>
      <input
        type="text"
        required
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
        placeholder="Enter department name"
      />
    </div>

    {/* Document Number */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Document Number</label>
      <input
        type="text"
        value={documentNo}
        onChange={(e) => setDocumentNo(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
        placeholder="Enter document number"
      />
    </div>

    {/* Effective Date */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Effective Date*</label>
      <input
        type="date"
        required
        value={effectiveDate}
        onChange={(e) => setEffectiveDate(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
      />
    </div>

    {/* Version */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Version*</label>
      <input
        type="text"
        required
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
        placeholder="e.g., 1.0"
      />
    </div>

    {/* Save Button - spans full width */}
    <div className="md:col-span-2 flex justify-end">
      {/* <button
        onClick={handleSavePrototype}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Checklist'}
      </button> */}
      <button
  onClick={handleSavePrototype}
  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
  disabled={isSaving}
>
  {isSaving ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Saving...
    </>
  ) : (
    'Save Checklist'
  )}
</button>
    </div>
  </div>
</div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Stages Sidebar - 20% width */}
          <div className="w-full md:w-1/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 h-fit">
            <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Stages</h2>
              <button
                onClick={addStage}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto md:w-full justify-center"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Create Stage</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedStage === stage.id ? 'bg-indigo-100 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{stage.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStage(stage.id);
                        if (selectedStage === stage.id) {
                          setSelectedStage(stages.length > 1 ? stages[0].id : null);
                        }
                      }}
                      className="text-gray-500 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stage.tasks.length} task{stage.tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            {stages.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No stages created yet</p>
              </div>
            )}
          </div>

          {/* Tasks Content - 80% width */}
          <div className="w-full md:w-4/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {selectedStage ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                    {stages.find(s => s.id === selectedStage)?.name || 'Tasks'}
                  </h2>
                  <button
                    onClick={() => addTask(selectedStage)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto justify-center"
                  >
                    <Plus size={20} />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {stages.find(s => s.id === selectedStage)?.tasks.map((task, index) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      stageId={selectedStage}
                      level={0}
                      parentPath={[]}
                      onUpdateTask={updateTaskField}
                      onAddSubtask={addSubtask}
                      onDeleteTask={deleteTask}
                      onToggleExpansion={toggleExpansion}
                      expandedItems={expandedItems}
                      taskNumber={`${stages.findIndex(s => s.id === selectedStage) + 1}.${index + 1}`} // StageNumber.TaskNumber
                    />
                  ))}
                </div>

                {stages.find(s => s.id === selectedStage)?.tasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-base sm:text-lg font-medium">No tasks created yet for this stage.</p>
                    <button
                      onClick={() => addTask(selectedStage)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      Create First Task
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base sm:text-lg font-medium">
                  {stages.length > 0 ? 'Select a stage from the sidebar' : 'Create your first stage to get started'}
                </p>
              </div>
            )}

          </div>
        </div>
        <ToastContainer className='mt-16 ml-16' />
      </div>

    </div>
  );
};

export default PrototypeManagementPage;


