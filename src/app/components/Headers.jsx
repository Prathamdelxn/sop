'use client';
import { useRouter } from "next/navigation";
export default function Header({ setSidebarOpen }) {
    const router=useRouter();

    const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.replace('/login'); // You can also use replace instead of push
};

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 lg:hidden transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block ml-6">
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-80 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div> */}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105">
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5V12a7 7 0 00-14 0v5l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Settings */}
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105">
            <span className="sr-only">Settings</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Logout Button */}
          <button 
            className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 border border-red-200/50 hover:border-red-300"
            onClick={handleLogout}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>

          {/* User menu */}
          
        </div>
      </div>
    </header>
  );
}