"use client";
import { useState, useEffect, useRef } from 'react';
import { Calendar, Layers, FileText, Timer, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

const TaskExecutionDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  
  // Dummy data - in a real app you would fetch this based on the ID
  const selectedTask = {
    id: id,
    name: 'Cell Analysis Procedure',
    description: 'Standard procedure for analyzing cell samples using the microscope',
    equipment: {
      name: 'Microscope X200',
      barcode: 'MBX200-001'
    },
    stages: [
      {
        id: 's1',
        name: 'Preparation',
        description: 'Prepare the microscope and samples for analysis',
        tasks: [
          {
            id: 't1',
            title: 'Clean microscope slides',
            description: 'Thoroughly clean all slides to be used in the analysis',
            minTime: { hours: 0, minutes: 5, seconds: 0 },
            maxTime: { hours: 0, minutes: 10, seconds: 0 },
            attachedImages: []
          },
          {
            id: 't2',
            title: 'Prepare samples',
            description: 'Prepare the cell samples for analysis',
            minTime: { hours: 0, minutes: 15, seconds: 0 },
            maxTime: { hours: 0, minutes: 30, seconds: 0 }
          }
        ]
      },
      {
        id: 's2',
        name: 'Analysis',
        tasks: [
          {
            id: 't3',
            title: 'Focus microscope',
            description: 'Adjust the microscope to get clear images',
            minTime: { hours: 0, minutes: 2, seconds: 0 },
            maxTime: { hours: 0, minutes: 5, seconds: 0 }
          },
          {
            id: 't4',
            title: 'Record observations',
            description: 'Record all observations from the analysis',
            minTime: { hours: 0, minutes: 10, seconds: 0 },
            maxTime: { hours: 0, minutes: 20, seconds: 0 }
          }
        ]
      }
    ]
  };

  const [expandedTasks, setExpandedTasks] = useState({});
  const [taskTimers, setTaskTimers] = useState({});
  const [showAlert, setShowAlert] = useState({ visible: false, message: '', type: '' });
  const timerRefs = useRef({});

  useEffect(() => {
    return () => {
      // Cleanup all intervals on unmount
      Object.values(timerRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const formatTime = (timeObj) => {
    if (!timeObj) return 'Not set';
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const formatSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (taskId, minTime, maxTime) => {
    if (timerRefs.current[taskId]) {
      clearInterval(timerRefs.current[taskId]);
    }

    const startTime = Date.now();
   
    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: true,
        startTime,
        elapsed: 0,
        minTime: minTime ? (minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds) : 0,
        maxTime: maxTime ? (maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds) : Infinity
      }
    }));

    timerRefs.current[taskId] = setInterval(() => {
      setTaskTimers(prev => {
        if (!prev[taskId]?.isRunning) return prev;
       
        const elapsedSeconds = Math.floor((Date.now() - prev[taskId].startTime) / 1000);
        return {
          ...prev,
          [taskId]: {
            ...prev[taskId],
            elapsed: elapsedSeconds
          }
        };
      });
    }, 1000);
  };

  const stopTimer = (taskId) => {
    const timer = taskTimers[taskId];
    if (!timer) return;

    if (timerRefs.current[taskId]) {
      clearInterval(timerRefs.current[taskId]);
      timerRefs.current[taskId] = null;
    }

    const finalElapsed = timer.isRunning
      ? Math.floor((Date.now() - timer.startTime) / 1000)
      : timer.elapsed || 0;

    let message = '';
    let type = 'success';
   
    if (timer.minTime && finalElapsed < timer.minTime) {
      message = `You're submitting early! Minimum time is ${formatTime({
        hours: Math.floor(timer.minTime / 3600),
        minutes: Math.floor((timer.minTime % 3600) / 60),
        seconds: timer.minTime % 60
      })}`;
      type = 'warning';
    } else if (timer.maxTime && finalElapsed > timer.maxTime) {
      message = `You're submitting late! Maximum time is ${formatTime({
        hours: Math.floor(timer.maxTime / 3600),
        minutes: Math.floor((timer.maxTime % 3600) / 60),
        seconds: timer.maxTime % 60
      })}`;
      type = 'error';
    } else {
      message = 'Task submitted successfully!';
      type = 'success';
    }

    setShowAlert({ visible: true, message, type });
    setTimeout(() => setShowAlert({ visible: false, message: '', type: '' }), 5000);

    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: false,
        elapsed: finalElapsed
      }
    }));
  };

  const renderTask = (task, level = 0, taskNumber = '1') => {
    const timer = taskTimers[task.id] || {};
    const isRunning = timer.isRunning || false;
    const elapsedTime = timer.elapsed || 0;

    return (
      <div key={task.id} className="mb-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 mt-1 flex-shrink-0">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex-1">
            <div className="mb-2 flex justify-between items-start">
              <div>
                <span className="font-medium text-gray-900">
                  {taskNumber}. {task.title || 'Untitled Task'}
                </span>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
             
              <div className="flex items-center gap-3">
                {(isRunning || elapsedTime > 0) && (
                  <div className="text-sm font-mono bg-white px-2 py-1 rounded">
                    {formatSecondsToTime(elapsedTime)}
                  </div>
                )}
                <button
                  onClick={() => isRunning ? stopTimer(task.id) : startTimer(task.id, task.minTime, task.maxTime)}
                  className={`px-4 py-1.5 rounded text-sm font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {isRunning ? 'Submit' : 'Start'}
                </button>
              </div>
            </div>

            {(task.minTime || task.maxTime) && (
              <div className="flex gap-4 text-sm text-gray-600 mb-2">
                {task.minTime && (
                  <div>
                    <span className="font-medium">Min: </span>
                    <span>{formatTime(task.minTime)}</span>
                  </div>
                )}
                {task.maxTime && (
                  <div>
                    <span className="font-medium">Max: </span>
                    <span>{formatTime(task.maxTime)}</span>
                  </div>
                )}
              </div>
            )}

            {task.attachedImages?.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Attached Images:</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {task.attachedImages.map((image, idx) => (
                    <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                      <Image
                        src={image.url}
                        alt={image.name || `Image ${idx + 1}`}
                        width={200}
                        height={120}
                        className="w-full h-24 object-cover"
                      />
                      {image.name && (
                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate">{image.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Alert Notification */}
      {showAlert.visible && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${
          showAlert.type === 'warning' ? 'bg-yellow-500' :
          showAlert.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {showAlert.message}
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard/task-execution')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Tasks
          </button>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{selectedTask.name}</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
            <span className="flex items-center">
              <span className="font-medium">Stages:</span>
              <span className="ml-1">{selectedTask.stages.length}</span>
            </span>
            <span className="flex items-center">
              <span className="font-medium">Equipment:</span>
              <span className="ml-1">{selectedTask.equipment.name} ({selectedTask.equipment.barcode})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {selectedTask.description && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
          <p className="text-gray-700 whitespace-pre-line">{selectedTask.description}</p>
        </div>
      )}

      {/* Stages and Tasks */}
      <div className="space-y-6">
        {selectedTask.stages.map((stage, stageIndex) => (
          <div key={stage.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  {stageIndex + 1}
                </span>
                <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                <span className="ml-auto text-sm text-gray-500">
                  {stage.tasks?.length || 0} tasks
                </span>
              </div>
              {stage.description && (
                <p className="mt-2 text-sm text-gray-600 ml-9">{stage.description}</p>
              )}
            </div>

            <div className="p-4 divide-y divide-gray-100">
              {stage.tasks?.length > 0 ? (
                stage.tasks.map((task, taskIndex) =>
                  renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
                )
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No tasks in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskExecutionDetailPage;