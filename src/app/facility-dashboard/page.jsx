'use client';
 import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
const SOPDashboard = () => {
  const router=useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(true);
const handleCreate=()=>{
  router.push("/facility-dashboard/create-sop")
}
  const sopData = [
    {
      id: 'SOP-CLN-001',
      name: 'Machine Cleaning : Model No. MACH001234',
      assignedTo: null,
      status: 'Drafting',
      dateCreated: '01-07-2025',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'SOP-CLN-002',
      name: 'Machine Cleaning : Model No. MACH001432',
      assignedTo: null,
      status: 'Under Internal Review',
      dateCreated: '03-07-2025',
      statusColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'SOP-CLN-003',
      name: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: null,
      status: 'Approved',
      dateCreated: '30-06-2025',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'SOP-CLN-004',
      name: 'Machine Cleaning : Model No. MACH001342',
      assignedTo: ['PM', 'BN', 'DR'],
      status: 'Activation/Distribution',
      dateCreated: '01-07-2025',
      statusColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const filteredSOPs = sopData.filter(sop =>
    sop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AssignedUsers = ({ users }) => {
    if (!users || users.length === 0) {
      return <span className="text-gray-500">—</span>;
    }

    const colors = ['bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
    
    return (
      <div className="flex space-x-1">
        {users.map((user, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-medium`}
          >
            {user}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Quick search any SOP by it's name..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create New SOP Button */}
          <button onClick={handleCreate} className="w-150 ml-45 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Create New SOP</span>
          </button>
        </div>

        {/* Created SOPs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div
            className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(!expandedSection)}
          >
            <h2 className="text-lg font-semibold text-gray-900">Created SOP's</h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection ? 'rotate-180' : ''
              }`}
            />
          </div>

          {expandedSection && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SOP No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SOP Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSOPs.map((sop) => (
                    <tr key={sop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sop.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {sop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AssignedUsers users={sop.assignedTo} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sop.statusColor}`}
                        >
                          {sop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sop.dateCreated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredSOPs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <p>No SOPs found matching your search criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOPDashboard;