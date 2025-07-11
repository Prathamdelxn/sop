'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Package, Users, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AssignEquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const [equipment, setEquipment] = useState(null); // instead of ''
const [assignee, setAssignee] = useState(null);

  const [equipmentList, setEquipmentList] = useState([]);
const [prototypeList, setPrototypeList] = useState([]);


 const handleAssign = async () => {
  const generatedId = `A-${Date.now()}`;

  const payload = {
    generatedId,
    equipment: equipment,
    prototype: assignee,
  };
console.log(payload);
  try {
    const res = await fetch('/api/assignment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to assign equipment');
    }

    console.log('Assigned and saved:', result.data);

    // Optional: Show a toast or success message here
    setIsModalOpen(false);
    setEquipment(null);
    setAssignee(null);
  } catch (error) {
    console.error('Error while assigning equipment:', error);
    // Optional: Show an error message here
  }
};


  useEffect(() => {
  const fetchEquipment = async () => {
    const res = await fetch('/api/equipment/fetchAll');
    const data = await res.json();

    const approvedEquipments = data.data.filter(e => e.status === 'approved');
    setEquipmentList(approvedEquipments);
  };

  fetchEquipment();
}, []);

useEffect(() => {
  const fetchPrototypes = async () => {
    const res = await fetch('/api/task/fetchAll');
    const data = await res.json();

    // Optional: Filter only relevant prototypes if needed
    setPrototypeList(data.data);
  };

  fetchPrototypes();
}, []);
const [assigndata,setassignData]=useState([]);
useEffect(() => {
  const fetchAssignment = async () => {
    const res = await fetch('/api/assignment/fetchAll');
    const data = await res.json();

    // Optional: Filter only relevant prototypes if needed
    console.log(data.data);
    setassignData(data.data);
  };

  fetchAssignment();
}, []);
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
            <span>Assign Equip to SOP</span>
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
            {assigndata.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-3 rounded-xl">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.equipment.name}</p>
                    <p className="text-slate-600 text-sm">Assigned to {item.prototypeData.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-800 font-semibold">{item.generatedId}</p>
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
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 overflow-hidden">
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Equipment</h2>
            <p className="text-gray-500 text-sm mt-1">Link equipment to a prototype workflow</p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Equipment Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={equipment?._id || ''}
              onChange={(e) => setEquipment(equipmentList.find(eq => eq._id === e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              disabled={isLoading}
            >
              <option value="">Select equipment</option>
              {equipmentList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.type || 'No type'})
                </option>
              ))}
            </select>
          </div>
          {equipment && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="flex items-center">
                <span className="font-medium text-gray-700 w-20 inline-block">Type:</span>
                <span>{equipment.type || 'Not specified'}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium text-gray-700 w-20 inline-block">Status:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  equipment.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {equipment.status || 'Unknown'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Prototype Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prototype</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={assignee?._id || ''}
              onChange={(e) => setAssignee(prototypeList.find(proto => proto._id === e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              disabled={isLoading}
            >
              <option value="">Select prototype</option>
              {prototypeList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name || item.title || `Prototype ${item._id.slice(-4)}`}
                </option>
              ))}
            </select>
          </div>
          {assignee && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="flex items-center">
                <span className="font-medium text-gray-700 w-20 inline-block">Created:</span>
                <span>{new Date(assignee.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium text-gray-700 w-20 inline-block">Stages:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {assignee.stages?.length || 0}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes Field */}
     
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          disabled={!equipment || !assignee || isLoading}
          className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${
            !equipment || !assignee || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
          } flex items-center justify-center min-w-[120px]`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Assigning...
            </>
          ) : (
            'Assign Equipment'
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}