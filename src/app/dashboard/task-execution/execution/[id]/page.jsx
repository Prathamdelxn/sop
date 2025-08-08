"use client";
import { useState, useEffect, useRef } from 'react';
import { FileText, Play, Square, Clock, AlertTriangle, CheckCircle2, Timer, Target, Calendar, Microscope, ChevronRight } from 'lucide-react';

// Mock data - replace with your actual data
const selectedTask = {
  id: "1",
  name: 'Cell Analysis Procedure',
  description: 'Standard procedure for analyzing cell samples using the microscope',
  equipment: {
    name: 'Microscope X200',
    barcode: 'MBX200-001'
  },
  stages: [
    {
      id: 's1',
   
      tasks: [
        {
          id: 't1',
          title: 'Clean microscope slides',
          description: 'Thoroughly clean all slides to be used in the analysis',
          minTime: { hours: 0, minutes: 5, seconds: 0 },
          maxTime: { hours: 0, minutes: 10, seconds: 0 },
          subtasks: [
            {
              id: 'st1',
              title: 'Wipe with alcohol',
              description: 'Clean slides with 70% alcohol solution',
              minTime: { hours: 0, minutes: 2, seconds: 0 },
              maxTime: { hours: 0, minutes: 3, seconds: 0 }
            },
            {
              id: 'st2',
              title: 'Dry with lint-free cloth',
              description: 'Ensure no streaks or fibers remain',
              minTime: { hours: 0, minutes: 1, seconds: 0 },
              maxTime: { hours: 0, minutes: 2, seconds: 0 },
              hasImage: true,
              imageDescription: 'Proper technique for drying microscope slides'
            }
          ]
        },
        {
          id: 't2',
          title: 'Prepare samples',
          description: 'Prepare the cell samples for analysis',
          minTime: { hours: 0, minutes: 15, seconds: 0 },
          maxTime: { hours: 0, minutes: 30, seconds: 0 },
          hasImage: true,
          imageDescription: 'Sample preparation workstation setup'
        }
      ]
    },
    {
      id: 's2',
   
      tasks: [
        {
          id: 't3',
          title: 'Focus microscope',
          description: 'Adjust the microscope to get clear images',
          minTime: { hours: 0, minutes: 2, seconds: 0 },
          maxTime: { hours: 0, minutes: 5, seconds: 0 },
          subtasks: [
            {
              id: 'st3',
              title: 'Coarse focus',
              description: 'Adjust with the coarse focus knob',
              minTime: { hours: 0, minutes: 1, seconds: 0 },
              maxTime: { hours: 0, minutes: 2, seconds: 0 }
            },
            {
              id: 'st4',
              title: 'Fine focus',
              description: 'Adjust with the fine focus knob',
              minTime: { hours: 0, minutes: 1, seconds: 0 },
              maxTime: { hours: 0, minutes: 3, seconds: 0 }
            }
          ]
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

const TaskExecutionDetailPage = () => {
  const [taskTimers, setTaskTimers] = useState({});
  const [showAlert, setShowAlert] = useState({ 
    visible: false, 
    message: '', 
    type: '', 
    taskId: null,
    requiresReason: false 
  });
  const [reason, setReason] = useState('');
  const timerRefs = useRef({});

  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

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
        isSubmitted: false,
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

  const handleSubmitWithReason = () => {
    const { taskId } = showAlert;
    if (!taskId) return;

    const timer = taskTimers[taskId];
    if (!timer) return;

    if (timerRefs.current[taskId]) {
      clearInterval(timerRefs.current[taskId]);
      timerRefs.current[taskId] = null;
    }

    const finalElapsed = timer.isRunning
      ? Math.floor((Date.now() - timer.startTime) / 1000)
      : timer.elapsed || 0;

    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: false,
        isSubmitted: true,
        elapsed: finalElapsed,
        reason: reason
      }
    }));

    setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false });
    setReason('');

    setShowAlert({
      visible: true,
      message: 'Task submitted successfully!',
      type: 'success',
      taskId: null,
      requiresReason: false
    });
    setTimeout(() => setShowAlert(prev => ({ ...prev, visible: false })), 3000);
  };

  const stopTimer = (taskId) => {
    const timer = taskTimers[taskId];
    if (!timer) return;

    const finalElapsed = timer.isRunning
      ? Math.floor((Date.now() - timer.startTime) / 1000)
      : timer.elapsed || 0;

    let message = '';
    let type = 'success';
    let requiresReason = false;
   
    if (timer.minTime && finalElapsed < timer.minTime) {
      message = `You're submitting early! Please provide a reason. Minimum time is ${formatTime({
        hours: Math.floor(timer.minTime / 3600),
        minutes: Math.floor((timer.minTime % 3600) / 60),
        seconds: timer.minTime % 60
      })}`;
      type = 'warning';
      requiresReason = true;
    } else if (timer.maxTime && finalElapsed > timer.maxTime) {
      message = `You're submitting late! Please provide a reason. Maximum time is ${formatTime({
        hours: Math.floor(timer.maxTime / 3600),
        minutes: Math.floor((timer.maxTime % 3600) / 60),
        seconds: timer.maxTime % 60
      })}`;
      type = 'error';
      requiresReason = true;
    } else {
      message = 'Task submitted successfully!';
      type = 'success';
    }

    setShowAlert({ 
      visible: true, 
      message, 
      type, 
      taskId: requiresReason ? taskId : null,
      requiresReason 
    });

    if (!requiresReason) {
      if (timerRefs.current[taskId]) {
        clearInterval(timerRefs.current[taskId]);
        timerRefs.current[taskId] = null;
      }

      setTaskTimers(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          isRunning: false,
          isSubmitted: true,
          elapsed: finalElapsed
        }
      }));

      setTimeout(() => setShowAlert(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const getTimerProgress = (timer, task) => {
    if (!timer || !task.maxTime) return 0;
    const maxTimeSeconds = task.maxTime.hours * 3600 + task.maxTime.minutes * 60 + task.maxTime.seconds;
    return Math.min((timer.elapsed / maxTimeSeconds) * 100, 100);
  };

  const getTimerStatus = (timer, task) => {
    if (!timer || !timer.isRunning) return 'idle';
    if (task.minTime) {
      const minTimeSeconds = task.minTime.hours * 3600 + task.minTime.minutes * 60 + task.minTime.seconds;
      if (timer.elapsed < minTimeSeconds) return 'early';
    }
    if (task.maxTime) {
      const maxTimeSeconds = task.maxTime.hours * 3600 + task.maxTime.minutes * 60 + task.maxTime.seconds;
      if (timer.elapsed > maxTimeSeconds) return 'late';
    }
    return 'ontime';
  };

  const renderTask = (task, level = 0, taskNumber = '1') => {
    const timer = taskTimers[task.id] || {};
    const isRunning = timer.isRunning || false;
    const isSubmitted = timer.isSubmitted || false;
    const elapsedTime = timer.elapsed || 0;
    const progress = getTimerProgress(timer, task);
    const status = getTimerStatus(timer, task);

    const statusColors = {
      idle: 'from-gray-50 to-gray-100 border-gray-200',
      early: 'from-blue-50 to-blue-100 border-blue-200',
      ontime: 'from-green-50 to-green-100 border-green-200',
      late: 'from-red-50 to-red-100 border-red-200'
    };

    const buttonStyles = {
      start: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
      stop: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
      submitted: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-75'
    };

    return (
      <div 
        key={task.id} 
        className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md ${
          level === 0 
            ? `bg-gradient-to-br ${statusColors[status]} backdrop-blur-sm border-2 shadow-md` 
            : 'bg-white/70 backdrop-blur-sm border border-indigo-200 ml-6'
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  level === 0 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {level === 0 ? taskNumber.split('.')[1] : taskNumber.split('.').slice(-1)[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {level === 0 ? `Task ${taskNumber}` : `Subtask ${taskNumber}`}: {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 leading-relaxed">{task.description}</p>
                  )}
                </div>
              </div>

              {/* Time constraints */}
             <div className="flex flex-wrap gap-2 mb-3">
                 {task.minTime && (
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-sm">
                  <Target size={14} />
                  <span className="font-medium">Min: {formatTime(task.minTime)}</span>
             </div>
                )}
               {task.maxTime && (
               <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 text-sm">
                <AlertTriangle size={14} />
                   <span className="font-medium">Max: {formatTime(task.maxTime)}</span>
            </div>
                )}
             </div>
      
           {/* Progress bar */}
              {isRunning && task.maxTime && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        status === 'late' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        status === 'ontime' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timer and controls */}
            <div className="flex flex-col items-center gap-3">
              {(isRunning || elapsedTime > 0) && (
                <div className="text-center">
                  <div className={`text-xl font-mono font-bold px-4 py-2 rounded-xl ${
                    status === 'late' ? 'bg-red-100 text-red-700 border-2 border-red-200' :
                    status === 'ontime' ? 'bg-green-100 text-green-700 border-2 border-green-200' :
                    'bg-blue-100 text-blue-700 border-2 border-blue-200'
                  }`}>
                    {formatSecondsToTime(elapsedTime)}
                  </div>
                  
                </div>
              )}

             <button
  onClick={() =>
    isRunning ? stopTimer(task.id) : startTimer(task.id, task.minTime, task.maxTime)
  }
  disabled={isSubmitted}
  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
    isSubmitted ? buttonStyles.submitted :
    isRunning ? buttonStyles.stop : buttonStyles.start
  }`}
>
  {isSubmitted ? (
    <>
      <CheckCircle2 size={16} />
      Submitted
    </>
  ) : isRunning ? (
    <>
      <Square size={16} />
      Submit
    </>
  ) : (
    <>
      <Play size={16} />
      Start Task
    </>
  )}
</button>

            </div>
          </div>

          {/* Image section */}
          {task.hasImage && (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-300">
                <div className="text-center text-indigo-600">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Task Image</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={18} />
                  Image Description
                </h4>
                <p className="text-gray-600 leading-relaxed">{task.imageDescription}</p>
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 mb-3">
                <ChevronRight size={16} />
                <span>Subtasks ({task.subtasks.length})</span>
              </div>
              {task.subtasks.map((subtask, subtaskIndex) => 
                renderTask(subtask, level + 1, `${taskNumber}.${subtaskIndex + 1}`)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Alert Modal */}
        {showAlert.visible && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
            
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl shadow-2xl z-50 w-96 bg-white border-2 transition-all duration-300 scale-100 ${
              showAlert.type === 'warning' ? 'border-yellow-300' :
              showAlert.type === 'error' ? 'border-red-300' : 
              'border-green-300'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  showAlert.type === 'warning' ? 'bg-yellow-100' :
                  showAlert.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {showAlert.type === 'warning' ? (
                    <AlertTriangle className="text-yellow-600" size={32} />
                  ) : showAlert.type === 'error' ? (
                    <AlertTriangle className="text-red-600" size={32} />
                  ) : (
                    <CheckCircle2 className="text-green-600" size={32} />
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-4 ${
                  showAlert.type === 'warning' ? 'text-yellow-800' :
                  showAlert.type === 'error' ? 'text-red-800' : 'text-green-800'
                }`}>
                  {showAlert.message}
                </h3>
                
                {showAlert.requiresReason && (
                  <div className="mb-6 text-left">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Please provide a reason:
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter your reason here..."
                    />
                  </div>
                )}
                
                <div className="flex justify-center gap-4">
                  {showAlert.requiresReason ? (
                    <>
                      <button
                        onClick={() => {
                          setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false });
                          setReason('');
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitWithReason}
                        disabled={!reason.trim()}
                        className={`px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 ${
                          !reason.trim() ? 'bg-gray-400 cursor-not-allowed' :
                          showAlert.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
                          'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        }`}
                      >
                        Submit Anyway
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAlert({ visible: false, message: '', type: '', taskId: null, requiresReason: false })}
                      className={`px-8 py-3 text-white rounded-xl font-medium transition-all duration-200 ${
                        showAlert.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
                        showAlert.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                        'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      }`}
                    >
                      Got it!
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-4 px-6 border border-white/50 shadow-sm">
            <div className="flex items-center gap-4 ">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Microscope className="text-white" size={16} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedTask.name}
                </h1>
                <h2 className="text-md font-medium text-gray-600 flex items-center gap-2">
                  <span>{selectedTask.equipment.name}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-lg">{selectedTask.equipment.barcode}</span>
                </h2>
                
              </div>
            </div>
            {/* <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p> */}
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-8">
          {selectedTask.stages.map((stage, stageIndex) => (
            <div key={stage.id} className="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-sm">
              <div className="bg-gradient-to-r from-indigo-400  to-blue-400 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xl font-bold text-white">
                      Stage
                    </h3>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-md">{stageIndex + 1}</span>
                    </div>
                   
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Timer className="text-white" size={14} />
                  <span className="text-white text-sm font-medium">
                  {stage.tasks?.length || 0} tasks
                  </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {stage.tasks?.length > 0 ? (
                  <div className="space-y-4">
                    {stage.tasks.map((task, taskIndex) => (
                      renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-gray-400" size={32} />
                    </div>
                    <p className="text-lg font-medium">No tasks in this stage</p>
                    <p className="text-sm">Tasks will appear here when added</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskExecutionDetailPage;