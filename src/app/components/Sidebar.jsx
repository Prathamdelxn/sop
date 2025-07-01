'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'All Users', href: '/dashboard/users', icon: '👥' },
    { name: 'Supervisors', href: '/dashboard/supervisors', icon: '👨‍💼' },
    { name: 'Operators', href: '/dashboard/operators', icon: '⚙️' },
    { name: 'QA Staff', href: '/dashboard/qa', icon: '🔍' },
    { name: 'Managers', href: '/dashboard/managers', icon: '👔' },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${pathname === item.href
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
