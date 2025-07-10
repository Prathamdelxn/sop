'use client';

import React from 'react';
import { User, Mail, MapPin, Phone } from 'lucide-react';

export default function ProfilePage() {
  // Dummy user data (replace with real data later)
  const profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Mumbai, India',
    phone: '+91 9876543210',
    role: 'supervisor',
    department: 'supervisor',
    joinDate: 'January 2023'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-slate-600 text-lg">personal information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Cover Section */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* User Info Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{profile.name}</h2>
              <p className="text-indigo-600 font-semibold text-lg">{profile.role}</p>
              <p className="text-slate-600">{profile.department}</p>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-600 text-sm font-medium mb-1">Email Address</label>
                      <div className="text-slate-800 font-semibold">{profile.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-600 text-sm font-medium mb-1">Phone Number</label>
                      <div className="text-slate-800 font-semibold">{profile.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-600 text-sm font-medium mb-1">Location</label>
                      <div className="text-slate-800 font-semibold">{profile.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                  Work Information
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                    <label className="block text-slate-600 text-sm font-medium mb-2">Position</label>
                    <div className="text-slate-800 font-semibold">{profile.role}</div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                    <label className="block text-slate-600 text-sm font-medium mb-2">Join Date</label>
                    <div className="text-slate-800 font-semibold">{profile.joinDate}</div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}