"use client";

import React, { useState } from 'react';
import { Bell, User, Settings, Upload, FileText, Wrench, List, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Equipment List');

  const menuItems = [
    { name: 'Equipment List', icon: List, active: true },
    { name: 'Equipment Maintenance', icon: Wrench, active: false },
    { name: 'Upload Logs & Certificates', icon: Upload, active: false },
    { name: 'SOP Mapping', icon: FileText, active: false },
  ];

  const handleMenuClick = (itemName) => {
    setActiveItem(itemName);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg border-b border-blue-800 flex-shrink-0 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse"></div>
        
        <div className="flex items-center justify-between px-4 py-3 relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                CleanTrack Pro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Welcome Message */}
            <div className="hidden sm:block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20 mr-130">
              <span className="text-sm text-white/90">
                Welcome, <span className="font-semibold text-white">Rajkumar Patel</span> 
                <span className="text-xs text-white/70 ml-1">(Equipment)</span>
              </span>
            </div>
            
            {/* Notification Bell */}
            <button className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 relative group">
              <Bell size={20} className="text-white group-hover:text-cyan-300 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              </span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
            </button>
            
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Logout Button */}
            <button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-red-400/50">
              <span className="flex items-center space-x-1">
                <span>Log out</span>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              </span>
            </button>
          </div>
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-50 to-white shadow-xl transition-transform duration-300 ease-in-out border-r border-gray-200 flex-shrink-0`}>
          <div className="p-4 pt-6 h-full">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeItem === item.name
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:scale-102'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${
                    activeItem === item.name
                      ? 'bg-white/20'
                      : 'group-hover:bg-blue-100'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                  {activeItem === item.name && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              ))}
            </nav>
            
            {/* Sidebar Footer */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-200/50">
                <p className="text-xs text-gray-600 font-medium">CleanTrack Pro</p>
                <p className="text-xs text-gray-500">Version 2.1.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {React.cloneElement(children, { activeItem })}
        </main>
      </div>
    </div>
  );
};

export default Layout;