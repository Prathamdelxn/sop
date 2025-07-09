'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ApproveEquipmentPage() {
  const tableData = [
    {
      equipment: 'Granulator #1',
      prototype: 'Tablet A - Batch 23',
      status: 'Completed',
      date: '09-07-2025',
      action: '',
    },
    {
      equipment: 'Blister Pack Machine',
      prototype: 'Capsule X - Trial 12',
      status: 'Pending',
      date: '08-07-2025',
      action: '',
    },
    {
      equipment: 'Autoclave Unit',
      prototype: 'Sterile Y - Phase 2',
      status: 'Rejected',
      date: '07-07-2025',
      action: '',
    },
  ];

    return (
        <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
            {/* === Header Label === */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">
                    Equipment Approval Dashboard
                </h1>
            </div>


      {/* === Section 1: Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={Clock} label="Pending" value={8} color="orange" />
        <Card icon={CheckCircle} label="Approved" value={21} color="green" />
        <Card icon={XCircle} label="Rejected" value={3} color="red" />
      </div>

      {/* === Section 2: Table === */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Equipment Approval Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6 text-left">Equipment Name</th>
                <th className="py-3 px-6 text-left">Prototype Name</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{item.equipment}</td>
                  <td className="py-3 px-6">{item.prototype}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">{item.date}</td>
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      <button className="w-16 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition">
                        Yes
                      </button>
                      <button className="w-16 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition">
                        No
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, color }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md bg-white flex items-center gap-4 border-t-4 border-${color}-500`}
    >
      <div className={`text-${color}-600 bg-${color}-100 p-3 rounded-full`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
