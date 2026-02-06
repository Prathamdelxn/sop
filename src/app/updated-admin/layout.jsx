

'use client';
import { useState, useEffect, useRef } from 'react';
import {Disc} from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function RootLayout({ children }) {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [activeItemId, setActiveItemId] = useState('dashboard');
  const [companyData, setCompanyData] = useState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [Id, setId] = useState();
  
  // Use sidebar context
  const { 
    dynamicSidebarItems, 
    isLoadingItems, 
    updateSidebarItems,
    setIsLoadingItems ,
    getRandomIcon
  } = useSidebar();

  const staticDashboardItem = { 
    id: 'dashboard', 
    title: 'Dashboard', 
    icon: '📊', 
    path: '/updated-admin', 
    active: true 
  };

  useEffect(() => {
    const data = localStorage.getItem('user');
    const userdata = JSON.parse(data);
    if(userdata){
             if(userdata.role!='company-admin'){
          router.replace('/login'); 
        }

        }
        else{
             router.replace('/login'); 
        }
    console.log("asdf", userdata)
    setId(userdata?.id);
  }, [])
  
  const getDynamicRoutePath = (title) => {
    // Convert title to lowercase and replace spaces with hyphens
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    return `/updated-admin/${slug}`;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
      const newdata = await res.json();
      console.log(newdata.superAdmin);
      if(newdata.superAdmin?.status=="Inactive"){
        router.push('/deactivate')
      }
      setCompanyData(newdata.superAdmin);
      console.log(newdata.superAdmin?.workerRole);
      const dd = newdata.superAdmin?.workerRole;
      
      // Add random icons to dynamic items
      const itemsWithIcons = dd?.map((item, index) => ({
        ...item,
        icon: getRandomIcon(index)
      })) || [];
      
      updateSidebarItems(itemsWithIcons);
      console.log(dd?.length);
      setIsLoadingItems(false);
    }
    if (Id) {
      fetchData();
    }
  }, [Id])

  const setActiveItem = (id) => {
    setActiveItemId(id);
  };
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  // Add event listener when dropdown is shown
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderEmptyState = () => {
    if (isLoadingItems) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="absolute inset-0 animate-ping w-8 h-8 border border-blue-300 rounded-full opacity-20"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Loading roles...</p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (dynamicSidebarItems?.length === 0) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl opacity-50 animate-pulse">📋</div>
            {!isSidebarCollapsed && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">No additional roles</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  New menu items will appear here when roles are configured
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced Decorative Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-200 to-cyan-200 opacity-25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Enhanced Sidebar */}
        <div className={`
          bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50
          transition-all duration-500 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-80'}
          flex flex-col relative
        `}>
        
         

          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {companyData?.logo ? (
                  <img src={companyData.logo} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  'J'
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="transition-all duration-300">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">{companyData?.name || 'Company'}</h1>
                  
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Static Dashboard Item with Enhanced Styling */}
            <div className="group relative">
              <Link
                href={staticDashboardItem.path}
                onClick={() => setActiveItem(staticDashboardItem.id)}
                className={`
                  flex items-center px-4 py-4 rounded-2xl text-sm font-semibold
                  transition-all duration-300 overflow-hidden relative
                  ${activeItemId === staticDashboardItem.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:scale-102'}
                  group-hover:shadow-md
                `}
              >
                <div className="flex items-center space-x-4 w-full">
                  <span className={`text-2xl transition-all duration-300 ${activeItemId === staticDashboardItem.id ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                    {staticDashboardItem.icon} 
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 font-semibold">{staticDashboardItem.title}</span>
                      {activeItemId === staticDashboardItem.id && (
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      )}
                    </>
                  )}
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>
              {/* Tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                  {staticDashboardItem.title}
                </div>
              )}
            </div>

            {/* Enhanced Divider */}
            {dynamicSidebarItems?.length > 0 && (
              <div className="px-4 py-3">
                <div className="border-t border-gradient-to-r from-transparent via-gray-300 to-transparent relative">
                  {!isSidebarCollapsed && (
                    <span className="absolute -top-2 left-1/2  -translate-x-1/2 bg-white px-3 text-xs text-gray-500 font-medium">
                      Roles
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Dynamic Sidebar Items */}
            {dynamicSidebarItems?.map((item, index) => (
              <div key={item._id || index} className="group relative">
                <Link
                href={getDynamicRoutePath(item.title)}
                  onClick={() => setActiveItem(item._id)}
                  className={`
                    flex items-center px-4 py-4 rounded-2xl text-sm font-semibold
                    transition-all duration-300 overflow-hidden relative
                    ${activeItemId === item._id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:scale-102'}
                    group-hover:shadow-md
                  `}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <span className={`text-2xl transition-all duration-300 ${activeItemId === item._id ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                      {item.icon}
                      {/* <Disc /> */}
                    </span>
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 font-semibold capitalize">{item.title}</span>
                        {activeItemId === item._id && (
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 capitalize">
                    {item.title}
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced Empty State */}
            {renderEmptyState()}
          </nav>

          {/* Enhanced User Section */}
         
        </div>

        {/* Main Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Top Navigation Bar */}
          <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 relative z-20">
            <div className="flex items-center justify-between h-20 px-8">
              <div className="flex items-center space-x-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Admin Dashboard
                </h2>
               
              </div>
              <div className="flex items-center space-x-6">
                {/* Enhanced Action buttons */}
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  
                  
                  {/* Profile */}
                  <div className="relative" ref={dropdownRef}>
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2 pr-4 hover:scale-105 text-gray-900 transition-all duration-300 hover:shadow-lg border border-gray-200"
  >
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
      👤
    </div>
    <div className="hidden lg:block text-left">
      <p className="text-sm font-bold">{companyData?.username || 'Admin'}</p>
      <p className="text-xs text-gray-500">Online</p>
    </div>
    <svg className="w-4 h-4 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown menu */}
  {showDropdown && (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
      <ul className="py-2 text-sm text-gray-700">
        <li>
          <button
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </li>
      </ul>
    </div>
  )}
</div>

                </div>
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 overflow-auto relative z-10">
            <div className="min-h-full bg-white/50 backdrop-blur-sm p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}