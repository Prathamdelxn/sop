'use client';

import React, { useState } from 'react';
import { Plus, Package, Users, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AssignEquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipment, setEquipment] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleAssign = () => {
    console.log('Assigned:', { equipment, assignee });
    setIsModalOpen(false);
    setEquipment('');
    setAssignee('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Equipment Management
            </h1>
            <p className="text-slate-600 text-lg">Assign and track your equipment efficiently</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3"
          >
            <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span>Create SOP</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wider mb-2">Total Equipment</p>
                <p className="text-4xl font-bold text-slate-800">120</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wider mb-2">Assigned</p>
                <p className="text-4xl font-bold text-slate-800">80</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wider mb-2">un assigned</p>
                <p className="text-4xl font-bold text-slate-800">40</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Assigned</h2>
          <div className="space-y-4">
            {[
              { equipment: 'MacBook Pro 16"', assignee: 'Sarah Chen', time: '2 hours ago', status: 'assigned' },
              { equipment: 'Monitor Dell 27"', assignee: 'Mike Johnson', time: '4 hours ago', status: 'assigned' },
              { equipment: 'Wireless Mouse', assignee: 'Alex Rodriguez', time: '1 day ago', status: 'unassigned' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-3 rounded-xl">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.equipment}</p>
                    <p className="text-slate-600 text-sm">Assigned to {item.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">{item.time}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800"> Assign Equipment to SOP</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Equipment Selection */}
                <div className="space-y-3">
                  <label className="block text-slate-700 font-medium">Select Equipment</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <option value="">Choose equipment to assign</option>
                      <option value="MacBook Pro 16">MacBook Pro 16"</option>
                      <option value="Monitor Dell 27">Monitor Dell 27"</option>
                      <option value="Wireless Mouse">Wireless Mouse</option>
                      <option value="Keyboard Mechanical">Keyboard Mechanical</option>
                      <option value="Webcam HD">Webcam HD</option>
                    </select>
                  </div>
                </div>

                {/* Assignee Selection */}
                <div className="space-y-3">
                  <label className="block text-slate-700 font-medium">Assign To</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <option value="">Choose team member</option>
                      <option value="Sarah Chen">Sarah Chen - Design Team</option>
                      <option value="Mike Johnson">Mike Johnson - Development</option>
                      <option value="Alex Rodriguez">Alex Rodriguez - Marketing</option>
                      <option value="Emily Davis">Emily Davis - Product</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!equipment || !assignee}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Assigned
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}