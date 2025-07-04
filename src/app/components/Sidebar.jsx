'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpingHand } from 'lucide-react';
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Facility Admin', href: '/admin/facility-admin', icon: '📊', color: 'from-blue-500 to-blue-600' },
    // { name: 'All Users', href: '/dashboard/users', icon: '👥', color: 'from-green-500 to-green-600' },
    { name: 'Supervisors', href: '/admin/supervisor', icon: '👨‍💼', color: 'from-purple-500 to-purple-600' },
    { name: 'Operators', href: '/admin/operators', icon: '⚙️', color: 'from-orange-500 to-orange-600' },
    { name: 'QA Staff', href: '/admin/qaStaff', icon: '🔍', color: 'from-teal-500 to-teal-600' },
    { name: 'Managers', href: '/admin/managers', icon: '👔', color: 'from-indigo-500 to-indigo-600' },

  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out border-r border-gray-200/50
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur-3xl"></div>
          <div className="relative z-10 flex items-center space-x-3">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 lg:hidden transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg shadow-blue-500/20 border border-blue-200/50'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                  )}
                  
                  <div className={`
                    mr-4 text-lg p-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    {item.icon}
                  </div>
                  
                  <span className="flex-1">{item.name}</span>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Stats Cards */}
        

        {/* Bottom section - User Profile */}
        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200/50 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">System Administrator</p>
                <div className="flex items-center mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}