"use client";
 
import { useState, useEffect } from "react";
import { Clock, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Camera, Plus, Play, Square } from "lucide-react";
 
export default function MachineCleaningDashboard() {
  const [activeStage, setActiveStage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(1.1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskTimes, setTaskTimes] = useState({});
  const [expandedStages, setExpandedStages] = useState([1, 2, 3]);
  const [runningTask, setRunningTask] = useState(null);
 
  // Sample data for the cleaning process
  const cleaningProcess = {
    modelNo: "MACH001234",
    stages: [
      {
        id: 1,
        name: "Machine Disassembly",
        tasks: [
          { id: 1.1, name: "Disassemble Part 1", description: "Wipe each part with lint-free cloth to remove loose debris. Use mild detergent and brushes to clean surfaces and corners.", duration: 10 },
          { id: 1.2, name: "Disassemble Part 2", description: "Carefully remove fasteners and store them in labeled containers. Document each step for reassembly.", duration: 5 },
          { id: 1.3, name: "Disassemble Part 3", description: "Inspect components for wear and tear. Note any parts that need replacement.", duration: 10 }
        ]
      },
      {
        id: 2,
        name: "Machine Cleaning",
        tasks: [
          { id: 2.1, name: "Clean Part 1", description: "Use approved cleaning solvents for different materials. Avoid moisture on electrical components.", duration: 15 },
          { id: 2.2, name: "Clean Part 2", description: "Remove all grease and oil buildup. Check for residual contaminants.", duration: 5 },
          { id: 2.3, name: "Clean Part 3", description: "Clean hard-to-reach areas with specialized tools.", duration: 10 }
        ]
      },
      {
        id: 3,
        name: "Machine Assembly",
        tasks: [
          { id: 3.1, name: "Assemble Part 1", description: "Follow reverse order of disassembly. Refer to documentation.", duration: 10 },
          { id: 3.2, name: "Assemble Part 2", description: "Apply lubricants where specified. Torque fasteners to specifications.", duration: 5 },
          { id: 3.3, name: "Assemble Part 3", description: "Perform functional tests after each assembly step.", duration: 10 }
        ]
      }
    ]
  };
 
  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:00`;
  };
 
  const formatDateTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
 
  const toggleStage = (stageId) => {
    if (expandedStages.includes(stageId)) {
      setExpandedStages(expandedStages.filter(id => id !== stageId));
    } else {
      setExpandedStages([...expandedStages, stageId]);
    }
  };
 
  const selectTask = (taskId) => {
    setSelectedTask(taskId);
  };
 
  const startTask = (taskId) => {
    const task = cleaningProcess.stages.flatMap(s => s.tasks).find(t => t.id === taskId);
    const now = new Date();
 
    setTaskTimes({
      ...taskTimes,
      [taskId]: {
        ...taskTimes[taskId],
        startTime: now
      }
    });
 
    setTimeLeft(task.duration * 60); // Convert minutes to seconds
    setIsRunning(true);
    setRunningTask(taskId);
  };
 
  const endTask = (taskId) => {
    const now = new Date();
    setTaskTimes({
      ...taskTimes,
      [taskId]: {
        ...taskTimes[taskId],
        endTime: now
      }
    });
    setCompletedTasks([...completedTasks, taskId]);
    setIsRunning(false);
    setRunningTask(null);
  };
 
  const getTaskStatus = (taskId) => {
    if (completedTasks.includes(taskId)) return 'completed';
    if (runningTask === taskId) return 'running';
    return 'pending';
  };
 
  const getSelectedTask = () => {
    return cleaningProcess.stages.flatMap(s => s.tasks).find(t => t.id === selectedTask);
  };
 
  const getTaskTimeInfo = (taskId) => {
    const taskTime = taskTimes[taskId];
    if (!taskTime) return { startTime: null, endTime: null };
    return taskTime;
  };
 
  const renderTaskTimes = (taskId) => {
    const timeInfo = getTaskTimeInfo(taskId);
    const status = getTaskStatus(taskId);
 
    if (status === 'pending') {
      return (
        <div className="text-sm text-gray-400">
          <div>Task start at : --:-- --</div>
          <div>Task end at : --:-- --</div>
        </div>
      );
    }
 
    if (status === 'running' && timeInfo.startTime) {
      return (
        <div className="text-sm text-gray-500">
          <div>Task start at : {formatDateTime(timeInfo.startTime)}</div>
          <div>Task end at : --:-- --</div>
        </div>
      );
    }
 
    if (status === 'completed' && timeInfo.startTime && timeInfo.endTime) {
      return (
        <div className="text-sm text-gray-500">
          <div>Task start at : {formatDateTime(timeInfo.startTime)}</div>
          <div>Task end at : {formatDateTime(timeInfo.endTime)}</div>
        </div>
      );
    }
 
    return (
      <div className="text-sm text-gray-400">
        <div>Task start at : --:-- --</div>
        <div>Task end at : --:-- --</div>
      </div>
    );
  };
 
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Stages</h2>
        </div>
 
        <div className="p-2">
          {cleaningProcess.stages.map(stage => (
            <div key={stage.id} className="mb-2">
              <button
                onClick={() => toggleStage(stage.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700">
                  Stage {stage.id}: {stage.name}
                </span>
                {expandedStages.includes(stage.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
 
              {expandedStages.includes(stage.id) && (
                <div className="ml-4 mt-2 space-y-1">
                  {stage.tasks.map(task => {
                    const status = getTaskStatus(task.id);
                    return (
                      <button
                        key={task.id}
                        onClick={() => selectTask(task.id)}
                        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors ${selectedTask === task.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-green-500' :
                              status === 'running' ? 'bg-blue-500' : 'border-2 border-gray-300'
                            }`}>
                            {status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                            {status === 'running' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className={`text-sm ${status === 'completed' ? 'text-green-600' : 'text-gray-700'
                            }`}>
                            {task.id} {task.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
 
          {/* <button className="w-full flex items-center justify-center p-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Stage
          </button> */}
        </div>
      </div>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">
                Machine Cleaning : Model No. {cleaningProcess.modelNo}
              </h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Ongoing
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">01:00:00</span>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Submit For Review</span>
              </button>
            </div>
          </div>
        </div>
 
        {/* Task Detail */}
        <div className="flex-1 p-6">
          {getSelectedTask() && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Task {getSelectedTask().id} : {getSelectedTask().name}
                    </h2>
                    {renderTaskTimes(selectedTask)}
                  </div>
                  {/* <div className="flex space-x-2">
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div> */}
                </div>
              </div>
 
              <div className="p-6">
                <h3 className="font-medium text-gray-700 mb-3">Task Description</h3>
                <p className="text-gray-600 mb-6">{getSelectedTask().description}</p>
 
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTaskStatus(selectedTask) === 'pending' && (
                      <button
                        onClick={() => startTask(selectedTask)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Task</span>
                      </button>
                    )}
 
                    {getTaskStatus(selectedTask) === 'running' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="font-mono text-lg text-blue-600">
                            {formatTime(timeLeft)}
                          </span>
                        </div>
                        <button
                          onClick={() => endTask(selectedTask)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                        >
                          <Square className="w-4 h-4" />
                          <span>End Task</span>
                        </button>
                      </>
                    )}
 
                    {getTaskStatus(selectedTask) === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Task Completed</span>
                      </div>
                    )}
                  </div>
 
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>
 
                {/* Time warning */}
                {getTaskStatus(selectedTask) === 'running' && timeLeft <= 300 && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>You have only 5 min left to complete your assigned task</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}