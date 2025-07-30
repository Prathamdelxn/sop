"use client";
import React, { useState } from 'react';
import { Bell, User, Eye, Clock, Download, FileText, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ✅ App Router

const Layout = ({ children, onNavigate }) => {
  const router = useRouter();
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user] = useState({
    name: "Prajapati Maulikumar Madhavlal",
    role: "Quality Assurance"
  });
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.replace('/new-login'); // You can also use replace instead of push
};
  const navigationItems = [
    {
      id: 'Inbox',
      label: 'Inbox',
      icon: Eye,
      isSingle: true,
      route: '/quality-assurance', // ✅
    },
    {
      id: 'Approve Equipment',
      label: 'Approve Equipment',
      icon: Clock,
      isSingle: false,
      route: '/quality-assurance/approve_equipment', 
    },
    {
      id: 'Approve Task',
      label: 'Approve Task',
      icon: Download,
      isSingle: false,
      route: '/quality-assurance/approve_task', 
    },
    {
      id: 'Profile',
      label: 'Profile',
      icon: FileText,
      isSingle: true,
      route: '/quality-assurance/profile', 
    }
  ];

  const handleNavigation = (view) => {
    setActiveView(view);
    if (onNavigate) onNavigate(view);

    const selectedItem = navigationItems.find(item => item.id === view);
    if (selectedItem?.route) {
      router.push(selectedItem.route);
    }

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const Navbar = () => (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm relative z-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="text-xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          CleanTrack Pro
        </h1>
        <span className="hidden md:block text-gray-600 text-sm lg:text-base">
          Welcome, <span className="font-medium">{user.name}</span> 
          <span className="text-xs lg:text-sm text-gray-500 ml-1">({user.role})</span>
        </span>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            3 new notifications
          </div>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <User className="w-5 h-5 text-gray-600" />
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Profile Settings
          </div>
        </button>
        <button onClick={handleLogout} className="px-3 py-2 lg:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-sm lg:text-base">
          Log out
        </button>
      </div>
    </div>
  );

  const Sidebar = () => (
    <>
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed lg:relative top-0 left-0 z-30 lg:z-0
        w-64 bg-gradient-to-b from-gray-50 to-gray-100 
        border-r border-gray-200 h-full flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isSidebarOpen && 'lg:w-16'}
      `}>
        <div className="p-4 space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-xl w-full text-left 
                  transition-all duration-200 transform hover:scale-105 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-md border border-blue-200' 
                    : 'hover:bg-white hover:shadow-sm'}
                `}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-200 group-hover:bg-gray-300'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                {(isSidebarOpen || !window.matchMedia('(min-width: 1024px)').matches) && (
                  <div className="flex-1">
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </div>
                )}
                {isActive && (
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 text-center">
            CleanTrack Pro v2.1
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-blue-600 z-10"
        >
          {isSidebarOpen ? '<' : '>'}
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${!isSidebarOpen ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
