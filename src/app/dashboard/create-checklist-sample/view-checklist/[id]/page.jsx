"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus } from 'lucide-react';
import { ArrowLeft } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ImageAttachmentView = ({ photos, title, description }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Image className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-800">Attached Images</h3>
      </div>
      {title && <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>}
      {description && <p className="text-gray-600 mb-3">{description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`Attached ${index + 1}`}
              className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            {image.name && <p className="text-sm font-medium text-gray-800 mt-2 truncate">{image.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const DurationView = ({ minTime, maxTime, minDuration, maxDuration }) => {
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

  if (!minTime && !maxTime && !minDuration && !maxDuration) return null;

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
        <span className="font-semibold">Duration:</span>
        <span className="font-medium">
          {minTime ? formatDetailedDuration(minTime) : formatDuration(minDuration)}
          {' → '}
          {maxTime ? formatDetailedDuration(maxTime) : formatDuration(maxDuration)}
        </span>
      </div>
    </div>
  );
};

const TaskComponent = React.memo(({
  task,
  level = 0,
  taskNumber = '1.1'
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const [isExpanded, setIsExpanded] = useState(hasSubtasks);

  const depthStyles = React.useMemo(() => {
    const colors = ['border-indigo-200', 'border-blue-200', 'border-emerald-200', 'border-purple-200', 'border-rose-200', 'border-amber-200'];
    const bgColors = ['bg-white', 'bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50'];
    return {
      border: colors[level % colors.length],
      bg: bgColors[level % bgColors.length],
    };
  }, [level]);

  return (
    <div
      className={`border-2 ${depthStyles.border} ${depthStyles.bg} rounded-2xl p-4 sm:p-6 mb-4 shadow-md hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {hasSubtasks && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          <span className="font-semibold text-gray-900 text-base sm:text-lg tracking-tight">
            {taskNumber}. {level === 0 ? 'Task' : `Subtask`}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Title</h3>
          <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800">
            {task.title || 'No title provided'}
          </p>
        </div>

        {task.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Description</h3>
            <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-line">
              {task.description}
            </p>
          </div>
        )}

        <DurationView 
          minTime={task.minTime} 
          maxTime={task.maxTime} 
          minDuration={task.minDuration} 
          maxDuration={task.maxDuration} 
        />

        {task.attachedImages && task.attachedImages.length > 0 && (
          <ImageAttachmentView 
            photos={task.attachedImages} 
            title={task.imageTitle} 
            description={task.imageDescription} 
          />
        )}
      </div>

      {hasSubtasks && isExpanded && (
        <div className="mt-4 sm:mt-6 space-y-4">
          {task.subtasks.map((subtask, index) => (
            <TaskComponent
              key={subtask.id}
              task={subtask}
              level={level + 1}
              taskNumber={`${taskNumber}.${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TaskComponent.displayName = 'TaskComponent';

const ViewChecklistPage = ({ params }) => {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await fetch(`/api/task/fetch-by-id/6896cf93d06f24bca18c6769`);
        if (!response.ok) {
          throw new Error('Failed to fetch checklist');
        }
        const data = await response.json();
        setChecklist(data);
        if (data.stages && data.stages.length > 0) {
          setSelectedStage(data.stages[0]._id.toString());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mb-4"
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
          <p className="text-gray-700 font-medium">Loading Checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Checklist</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/create-checklist')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Checklists
          </button>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checklist Not Found</h2>
          <p className="text-gray-700 mb-6">The requested checklist could not be found.</p>
          <button
            onClick={() => router.push('/dashboard/create-checklist')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Checklists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:p-6 md:px-8">
      <div className="max-w-full mx-auto">
        <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
          <Link href="/dashboard/create-checklist" className="flex items-center gap-2 font-semibold text-gray-800 text-lg cursor-pointer">
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </Link>
        </button>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4 sm:mb-6 tracking-tight">
          Checklist: {checklist.name}
        </h1>

        {/* Checklist Metadata */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Department</h3>
              <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800">
                {checklist.departmentName || 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Document Number</h3>
              <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800">
                {checklist.documentNo || 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Effective Date</h3>
              <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800">
                {checklist.effectiveDate ? new Date(checklist.effectiveDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Version</h3>
              <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800">
                {checklist.version || 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Status</h3>
              <p className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 capitalize">
                {checklist.status?.toLowerCase() || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Stages Sidebar */}
          <div className="w-full md:w-1/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 h-fit">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-6">Stages</h2>

            <div className="space-y-2">
              {checklist.stages?.map((stage) => (
                <div
                  key={stage._id}
                  onClick={() => setSelectedStage(stage._id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedStage === stage._id ? 'bg-indigo-100 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{stage.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stage.tasks.length} task{stage.tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            {checklist.stages?.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No stages found</p>
              </div>
            )}
          </div>

          {/* Tasks Content */}
          <div className="w-full md:w-4/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {selectedStage ? (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-6">
                  {checklist.stages?.find(s => s._id === selectedStage)?.name || 'Tasks'}
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {checklist.stages?.find(s => s._id === selectedStage)?.tasks.map((task, index) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      level={0}
                      taskNumber={`${checklist.stages.findIndex(s => s._id === selectedStage) + 1}.${index + 1}`}
                    />
                  ))}
                </div>

                {checklist.stages?.find(s => s._id === selectedStage)?.tasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-base sm:text-lg font-medium">No tasks found for this stage.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base sm:text-lg font-medium">
                  {checklist.stages?.length > 0 ? 'Select a stage from the sidebar' : 'No stages found'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChecklistPage;