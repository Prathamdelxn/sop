'use client'

import React, { useState } from 'react';
import { Search, Users, UserCheck, Phone, Mail, MapPin, Filter } from 'lucide-react';

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Sample data - replace with your actual data
  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      role: 'supervisor',
      department: 'Production',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@company.com',
      location: 'Building A - Floor 2',
      shift: 'Day Shift',
      experience: '8 years'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'operator',
      department: 'Production',
      phone: '+1 (555) 234-5678',
      email: 'sarah.johnson@company.com',
      location: 'Building A - Floor 1',
      shift: 'Day Shift',
      experience: '3 years'
    },
    {
      id: 3,
      name: 'Michael Davis',
      role: 'supervisor',
      department: 'Quality Control',
      phone: '+1 (555) 345-6789',
      email: 'michael.davis@company.com',
      location: 'Building B - Floor 1',
      shift: 'Night Shift',
      experience: '12 years'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      role: 'operator',
      department: 'Assembly',
      phone: '+1 (555) 456-7890',
      email: 'emily.wilson@company.com',
      location: 'Building A - Floor 3',
      shift: 'Evening Shift',
      experience: '5 years'
    },
    {
      id: 5,
      name: 'David Brown',
      role: 'operator',
      department: 'Packaging',
      phone: '+1 (555) 567-8901',
      email: 'david.brown@company.com',
      location: 'Building C - Floor 1',
      shift: 'Day Shift',
      experience: '2 years'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      role: 'supervisor',
      department: 'Assembly',
      phone: '+1 (555) 678-9012',
      email: 'lisa.anderson@company.com',
      location: 'Building A - Floor 3',
      shift: 'Day Shift',
      experience: '15 years'
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const supervisors = filteredMembers.filter(member => member.role === 'supervisor');
  const operators = filteredMembers.filter(member => member.role === 'operator');

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className={`h-2 ${member.role === 'supervisor' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.role === 'supervisor' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
              {member.role === 'supervisor' ? <UserCheck size={24} /> : <Users size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${member.role === 'supervisor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-semibold text-gray-800">{member.experience}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users size={16} />
            <span className="text-sm">{member.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{member.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone size={16} />
            <span className="text-sm">{member.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail size={16} />
            <span className="text-sm">{member.email}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Shift</span>
            <span className="text-sm font-medium text-gray-800">{member.shift}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Teams Directory
          </h1>
          <p className="text-xl text-gray-600">
            Operators & Supervisors
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, department, or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="supervisor">Supervisors</option>
              <option value="operator">Operators</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-800">{filteredMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Supervisors</p>
                <p className="text-2xl font-bold text-purple-600">{supervisors.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Operators</p>
                <p className="text-2xl font-bold text-blue-600">{operators.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Supervisors Section */}
        {(filterRole === 'all' || filterRole === 'supervisor') && supervisors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <UserCheck className="mr-2 text-purple-600" size={28} />
              Supervisors ({supervisors.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {supervisors.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Operators Section */}
        {(filterRole === 'all' || filterRole === 'operator') && operators.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="mr-2 text-blue-600" size={28} />
              Operators ({operators.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {operators.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No team members found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;