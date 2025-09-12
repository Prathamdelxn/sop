
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DurationModal from './DurationModal'
import ImageAttachmentModal from './ImageModal';
// Modern Icons
const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Edit = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Trash = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const GripVertical = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v.01M16 12v.01M16 19v.01M16 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

// Sortable Item Component
const SortableItem = ({ id, title, description, level, minTime, maxTime, onEdit, onAddSubtask, numbering, onAddDuration, onAddImage, showActionButtons, onClick }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      className={`group p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${isDragging ? 'rotate-2' : ''} ${onClick ? 'cursor-pointer' : ''}`}
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {numbering && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {numbering}
                  </span>
                )}
                <h3 className="text-sm font-medium text-slate-900 leading-tight">
                  {title}
                </h3>
              </div>
              {description && (
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {description}
                </p>
              )}
              {(minTime || maxTime) && (
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-600">
                    {minTime && maxTime ? `${minTime}-${maxTime} min` : 
                     minTime ? `${minTime} min` : 
                     maxTime ? `${maxTime} min` : ''}
                  </span>
                </div>
              )}
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
                    onAddDuration(id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Add Duration"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddImage(id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                  title="Add Image"
                >
                  <Camera className="w-3.5 h-3.5" />
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



export default function NestedDragDrop() {
  // State
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [checklistData, setChecklistData] = useState({
    name: '',
    department: '',
    documentNumber: '',
    effectiveDate: '',
    version: '',
  });
  const [showStageForm, setShowStageForm] = useState(false);
  const [newStage, setNewStage] = useState({ title: '' });
  const [showTaskForms, setShowTaskForms] = useState({});
  const [newTasks, setNewTasks] = useState({});
  const [showSubtaskForms, setShowSubtaskForms] = useState({});
  const [newSubtasks, setNewSubtasks] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', minTime: '', maxTime: '' });
  const [durationModalItemId, setDurationModalItemId] = useState(null);
  const [imageModalItemId, setImageModalItemId] = useState(null);
  const [activeStageId, setActiveStageId] = useState(null);
  const [activeStageItem, setActiveStageItem] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeTaskItem, setActiveTaskItem] = useState(null);

  // DnD Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // Utility Functions
  const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

  const updateItem = (items, id, updatedData) => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      if (item.tasks) {
        return { ...item, tasks: updateItem(item.tasks, id, updatedData) };
      }
      if (item.subtasks) {
        return { ...item, subtasks: updateItem(item.subtasks, id, updatedData) };
      }
      return item;
    });
  };

  const deleteItem = (items, id) => {
    return items.filter((item) => {
      if (item.id === id) return false;
      if (item.tasks) {
        item.tasks = deleteItem(item.tasks, id);
      }
      if (item.subtasks) {
        item.subtasks = deleteItem(item.subtasks, id);
      }
      return true;
    });
  };

  const generateNumbering = (items, id, parentNumbers = []) => {
    for (let i = 0; i < items.length; i++) {
      const currentNumbers = [...parentNumbers, i + 1];
      if (items[i].id === id) {
        return currentNumbers.join('.');
      }
      if (items[i].tasks?.length > 0) {
        const result = generateNumbering(items[i].tasks, id, currentNumbers);
        if (result) return result;
      }
      if (items[i].subtasks?.length > 0) {
        const result = generateNumbering(items[i].subtasks, id, currentNumbers);
        if (result) return result;
      }
    }
    return null;
  };

  // Header Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChecklistData({ ...checklistData, [name]: value });
  };

  const handleSubmit = () => {
    if (!checklistData.name || !checklistData.department || !checklistData.effectiveDate || !checklistData.version) {
      alert('Please fill all required fields.');
      return;
    }
    console.log('Checklist Data:', checklistData, 'Stages:', stages);
    alert('Data logged to console. Check your browser developer tools.');
  };

  // Stage Handlers
  const handleStageInputChange = (e) => {
    setNewStage({ title: e.target.value });
  };

  const addStage = () => {
    if (!newStage.title.trim()) {
      alert('Stage title is required');
      return;
    }
    const newStageItem = { id: generateId('stage'), title: newStage.title, tasks: [] };
    setStages((prev) => [...prev, newStageItem]);
    setNewStage({ title: '' });
    setShowStageForm(false);
    setSelectedStageId(newStageItem.id);
  };

  const handleStageDragStart = (event) => {
    const { active } = event;
    setActiveStageId(active.id);
    setActiveStageItem(stages.find((stage) => stage.id === active.id));
  };

  const handleStageDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveStageId(null);
      setActiveStageItem(null);
      return;
    }
    if (active.id !== over.id) {
      setStages((prev) => {
        const oldIndex = prev.findIndex((stage) => stage.id === active.id);
        const newIndex = prev.findIndex((stage) => stage.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
    setActiveStageId(null);
    setActiveStageItem(null);
  };

  // Task/Subtask Handlers
  const toggleTaskForm = (stageId) => {
    setShowTaskForms({ ...showTaskForms, [stageId]: !showTaskForms[stageId] });
    if (!newTasks[stageId]) {
      setNewTasks({ ...newTasks, [stageId]: { title: '', description: '' } });
    }
  };

  const handleTaskInputChange = (stageId, e) => {
    const { name, value } = e.target;
    setNewTasks({ ...newTasks, [stageId]: { ...newTasks[stageId], [name]: value } });
  };

  const addTask = (stageId) => {
    if (!newTasks[stageId]?.title.trim()) {
      alert('Task title is required');
      return;
    }
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, tasks: [...stage.tasks, { id: generateId('task'), title: newTasks[stageId].title, description: newTasks[stageId].description, subtasks: [] }] }
          : stage
      )
    );
    setNewTasks({ ...newTasks, [stageId]: { title: '', description: '' } });
    setShowTaskForms({ ...showTaskForms, [stageId]: false });
  };

  const toggleSubtaskForm = (parentId) => {
    setShowSubtaskForms({ ...showSubtaskForms, [parentId]: !showSubtaskForms[parentId] });
    if (!newSubtasks[parentId]) {
      setNewSubtasks({ ...newSubtasks, [parentId]: { title: '', description: '' } });
    }
  };

  const handleSubtaskInputChange = (parentId, e) => {
    const { name, value } = e.target;
    setNewSubtasks({ ...newSubtasks, [parentId]: { ...newSubtasks[parentId], [name]: value } });
  };

  const handleAddSubtask = (parentId) => {
    if (!newSubtasks[parentId]?.title.trim()) {
      alert('Subtask title is required');
      return;
    }
    const newSubtaskItem = { id: generateId('subtask'), title: newSubtasks[parentId].title, description: newSubtasks[parentId].description, subtasks: [] };
    setStages((prev) => addSubtask(prev, parentId, newSubtaskItem));
    setNewSubtasks({ ...newSubtasks, [parentId]: { title: '', description: '' } });
    setShowSubtaskForms({ ...showSubtaskForms, [parentId]: false });
  };

  const addSubtask = (items, parentId, newSubtaskItem) => {
    return items.map((item) => {
      if (item.id === parentId) {
        return { ...item, subtasks: [...(item.subtasks || []), newSubtaskItem] };
      }
      if (item.tasks) {
        return { ...item, tasks: addSubtask(item.tasks, parentId, newSubtaskItem) };
      }
      if (item.subtasks) {
        return { ...item, subtasks: addSubtask(item.subtasks, parentId, newSubtaskItem) };
      }
      return item;
    });
  };

  const handleEdit = (id) => {
    const item = findItemById(stages, id);
    if (item) {
      setEditItemId(id);
      setEditFormData({
        title: item.title || '',
        description: item.description || '',
        minTime: item.minTime || '',
        maxTime: item.maxTime || '',
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = () => {
    if (!editFormData.title.trim()) {
      alert('Title is required');
      return;
    }
    setStages((prev) => updateItem(prev, editItemId, editFormData));
    setEditItemId(null);
    setEditFormData({ title: '', description: '', minTime: '', maxTime: '' });
  };

  const handleAddDuration = (id) => {
    setDurationModalItemId(id);
  };

  const handleSaveDuration = (durationData) => {
    if (durationModalItemId) {
      setStages((prev) => updateItem(prev, durationModalItemId, { minTime: durationData.minDuration, maxTime: durationData.maxDuration }));
      setDurationModalItemId(null);
    }
  };

  const handleAddImage = (id) => {
    setImageModalItemId(id);
  };

  const handleSaveImage = (imageData) => {
    if (imageModalItemId) {
      console.log('Image data to save:', imageData);
      setImageModalItemId(null);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setStages((prev) => {
        const newStages = deleteItem(prev, id);
        if (!newStages.find((stage) => stage.id === selectedStageId)) {
          setSelectedStageId(newStages[0]?.id || null);
        }
        return newStages;
      });
      setEditItemId(null);
    }
  };

  const handleTaskDragStart = (event) => {
    const { active } = event;
    setActiveTaskId(active.id);
    const item = findItem(stages, active.id);
    setActiveTaskItem(item);
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
          const [movedItem] = activeContainer.container.splice(activeContainer.index, 1);
          overContainer.container.splice(overContainer.index, 0, movedItem);
        }
        return newStages;
      });
    }
    setActiveTaskId(null);
    setActiveTaskItem(null);
  };

  const renderItems = (items, level = 1, parentStageId = null) => {
    return items.map((item) => {
      const numbering = generateNumbering(stages, item.id);
      return (
        <div key={item.id} className={`${level > 1 ? 'ml-6' : ''} mb-3`}>
          {editItemId === item.id ? (
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Edit Item</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Title *"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
                {(editFormData.minTime || editFormData.maxTime) && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minTime"
                      placeholder="Min (minutes)"
                      value={editFormData.minTime}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                    <input
                      type="number"
                      name="maxTime"
                      placeholder="Max (minutes)"
                      value={editFormData.maxTime}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditItemId(null)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDuration(item.id);
                    }}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    title="Add Duration"
                  >
                    <Clock className="w-3.5 h-3.5" />
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
                level={level}
                minTime={item.minTime}
                maxTime={item.maxTime}
                onEdit={handleEdit}
                onAddSubtask={toggleSubtaskForm}
                numbering={numbering}
                onAddDuration={handleAddDuration}
                onAddImage={handleAddImage}
                showActionButtons
              />
              {showSubtaskForms[item.id] && (
                <div className="ml-4 mt-3 p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Subtask</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      placeholder="Subtask Title *"
                      value={newSubtasks[item.id]?.title || ''}
                      onChange={(e) => handleSubtaskInputChange(item.id, e)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Subtask Description"
                      value={newSubtasks[item.id]?.description || ''}
                      onChange={(e) => handleSubtaskInputChange(item.id, e)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
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
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {item.subtasks?.length > 0 && (
            <div className="mt-3">
              <SortableContext items={item.subtasks.map((subtask) => subtask.id)} strategy={verticalListSortingStrategy}>
                {renderItems(item.subtasks, level + 1, parentStageId)}
              </SortableContext>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-visible">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">TaskFlow</h1>
            <p className="text-sm text-slate-600 mt-1">Create and manage structured checklists</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Checklist Name*</label>
              <input
                type="text"
                name="name"
                value={checklistData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter checklist name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Department*</label>
              <input
                type="text"
                name="department"
                value={checklistData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter department"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Document Number</label>
              <input
                type="text"
                name="documentNumber"
                value={checklistData.documentNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter document number"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Effective Date*</label>
              <input
                type="date"
                name="effectiveDate"
                value={checklistData.effectiveDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Version*</label>
              <input
                type="text"
                name="version"
                value={checklistData.version}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1.0"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Stage Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-slate-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Stages</h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {stages.length}
              </span>
            </div>
            
            {showStageForm ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Add Stage</h3>
                <input
                  type="text"
                  value={newStage.title}
                  onChange={handleStageInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  placeholder="Stage title *"
                  required
                />
                <div className="flex gap-2">
                  <button
                    onClick={addStage}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowStageForm(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowStageForm(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="w-4 h-4" /> New Stage
              </button>
            )}
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleStageDragStart} onDragEnd={handleStageDragEnd}>
              <SortableContext items={stages.map((stage) => stage.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {stages.map((stage, index) => (
                    <SortableItem
                      key={stage.id}
                      id={stage.id}
                      title={stage.title}
                      description={`${stage.tasks?.length || 0} tasks`}
                      level={1}
                      onEdit={handleEdit}
                      onAddSubtask={() => {}}
                      numbering={index + 1}
                      onAddDuration={() => {}}
                      onAddImage={() => {}}
                      showActionButtons={false}
                      onClick={setSelectedStageId}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay className="z-50">
                {activeStageItem ? (
                  <div className="p-3 bg-white rounded-lg shadow-xl border border-slate-200">
                    <div className="font-medium text-slate-900 text-sm">{activeStageItem.title}</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Task Area */}
        <div className="flex-1 p-6">
          {selectedStageId ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {stages.find((stage) => stage.id === selectedStageId)?.title}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {stages.find((stage) => stage.id === selectedStageId)?.tasks?.length || 0} tasks
                  </p>
                </div>
                <button
                  onClick={() => toggleTaskForm(selectedStageId)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
              
              {showTaskForms[selectedStageId] && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Task</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      placeholder="Task title *"
                      value={newTasks[selectedStageId]?.title || ''}
                      onChange={(e) => handleTaskInputChange(selectedStageId, e)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Task description"
                      value={newTasks[selectedStageId]?.description || ''}
                      onChange={(e) => handleTaskInputChange(selectedStageId, e)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                </div>
              )}
              
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd}>
                <div className="space-y-4">
                  <SortableContext
                    items={stages.find((stage) => stage.id === selectedStageId)?.tasks?.map((task) => task.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {renderItems(stages.find((stage) => stage.id === selectedStageId)?.tasks || [], 1, selectedStageId)}
                  </SortableContext>
                </div>
                <DragOverlay className="z-50">
                  {activeTaskItem ? (
                    <div className="p-4 bg-white rounded-lg shadow-xl border border-slate-200">
                      <div className="font-medium text-slate-900 text-sm">{activeTaskItem.title}</div>
                      {activeTaskItem.description && <div className="text-xs text-slate-600 mt-1">{activeTaskItem.description}</div>}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No stage selected</h3>
                <p className="text-slate-600 text-sm">Select a stage from the sidebar to view and manage its tasks</p>
              </div>
            </div>
          )}
          
          {durationModalItemId && (
            <DurationModal
              onClose={() => setDurationModalItemId(null)}
              onSave={handleSaveDuration}
              initialMin={
                findItemById(stages, durationModalItemId)?.minTime
                  ? {
                      hours: Math.floor(findItemById(stages, durationModalItemId).minTime / 60),
                      minutes: findItemById(stages, durationModalItemId).minTime % 60,
                      seconds: 0,
                    }
                  : { hours: 0, minutes: 0, seconds: 0 }
              }
              initialMax={
                findItemById(stages, durationModalItemId)?.maxTime
                  ? {
                      hours: Math.floor(findItemById(stages, durationModalItemId).maxTime / 60),
                      minutes: findItemById(stages, durationModalItemId).maxTime % 60,
                      seconds: 0,
                    }
                  : { hours: 0, minutes: 0, seconds: 0 }
              }
            />
          )}
          {imageModalItemId && <ImageAttachmentModal onClose={() => setImageModalItemId(null)} onSave={handleSaveImage} />}
        </div>
      </div>
    </div>
  );
}