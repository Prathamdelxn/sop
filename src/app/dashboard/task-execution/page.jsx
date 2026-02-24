"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Play, Eye, Clock, User, Package, Hash, Zap, Sparkles } from 'lucide-react';

const TaskExecutionPage = () => {
  const router = useRouter();
  // Dummy data for task executions
  const [tasks, setTasks] = useState([
    // {
    //   _id: '1',
    //   generatedId: 'TE-001',
    //   equipment: {
    //     name: 'Microscope X200',
    //     barcode: 'MBX200-001',
    //   },
    //   prototypeData: {
    //     name: 'Cell Analysis',
    //     status: 'pending'
    //   },
    //   assignedTo: 'John Doe',
    //   deadline: '2023-12-31'
    // },
    // {
    //   _id: '2',
    //   generatedId: 'TE-002',
    //   equipment: {
    //     name: 'Centrifuge C100',
    //     barcode: 'CFC100-001',
    //   },
    //   prototypeData: {
    //     name: 'Sample Processing',
    //     status: 'in-progress'
    //   },
    //   assignedTo: 'Jane Smith',
    //   deadline: '2023-12-15'
    // },
    // {
    //   _id: '3',
    //   generatedId: 'TE-003',
    //   equipment: {
    //     name: 'Spectrometer S500',
    //     barcode: 'SPS500-001',
    //   },
    //   prototypeData: {
    //     name: 'Chemical Analysis',
    //     status: 'completed'
    //   },
    //   assignedTo: 'Mike Johnson',
    //   deadline: '2023-12-10'
    // }
  ]);

  const handleExecuteTask = (taskId) => {
    console.log('Executing task:', taskId);
    // router.push('/dashboard/task-execution/demo');
    router.push(`/dashboard/task-execution/execution/${taskId}`);
    // Router navigation would go here
  };
  const [userData, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setUser(data);

      setLoading(true);

      // ✅ call fetch here after setting
      fetch(`/api/assignment/execution/${data.companyId}/${data.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Assignments:", data);
          setTasks(data);
        })
        .catch((err) => console.error("Error:", err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);


  //  const fetchAssignment = async () => {
  //   try {
  //     const res = await fetch(`/api/assignments/${userData?.companyId}/${userData?.id}`);
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch assignments");
  //     }
  //     const data = await res.json();
  //     console.log("Assignments:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  //   useEffect(()=>{
  //     fetchAssignment();
  //   },[userData])



  const handleViewTask = (taskId) => {
    console.log('Viewing task:', taskId);
    // Router navigation would go here
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: '✅',
          label: 'Completed'
        };
      case 'Under Execution':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: '🔄',
          label: 'In Progress'
        };
      default:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-200',
          icon: '⏳',
          label: 'Pending'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-2 py-2">
        <div className="bg-white border-b border-gray-200 rounded-xl  mt-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Execution Workspace</h1>
                <p className="text-gray-600 mt-2 text-md">Manage and Execute your assigned task </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Card Container */}
        <div className="bg-white mt-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Active Tasks</h2>
              </div>
              <div className="text-sm text-gray-500">
                {!loading && `${tasks.length} tasks total`}
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Loader vs Table vs Empty State */}
          <div className="overflow-x-auto">
            {loading ? (
              /* --- LOADER STATE --- */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Fetching your tasks...</p>
              </div>
            ) : tasks.length > 0 ? (
              /* --- TABLE STATE --- */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Equipment
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Prototype
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => {
                    const statusConfig = getStatusConfig(task.status);
                    return (
                      <tr
                        key={task._id}
                        className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                          }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {task.equipment.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-gray-900">
                            {task.prototypeData.name}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {task.generatedId}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-medium  ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExecuteTask(task._id)}
                              disabled={task.prototypeData.status === 'completed'}
                              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow ${task.prototypeData.status === 'completed'
                                  ? 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
                                  : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent'
                                }`}
                            >
                              <Play className="h-4 w-4" />
                              {task.prototypeData.status === 'completed' ? 'Complete' : 'Execute'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* --- EMPTY STATE --- */
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">There are no tasks assigned to you at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskExecutionPage;