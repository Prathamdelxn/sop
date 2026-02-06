"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';

export default function SuperAdminLayout({ children }) {
    const router=useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const pathname = usePathname();
      const dropdownRef = useRef(null);


 useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };

        // Add event listener when dropdown is open
        if (profileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen]);

    useEffect(()=>{
        const userdata = localStorage.getItem('user');
        const data =JSON.parse(userdata);
        if(data){
             if(data.role!='super-manager'){
          router.replace('/login'); 
        }

        }
        else{
             router.replace('/login'); 
        }
       

    },[])
 const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login'); // You can also use replace instead of push
};
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 font-sans antialiased">
            {/* Backdrop blur for mobile */}
            {!sidebarOpen && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden" />
            )}

            {/* Enhanced Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-72' : 'w-20'
                    } bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl border-r border-white/10 relative overflow-hidden`}
            >
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-pink-600/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                                    SuperAdmin
                                </h1>
                                <p className="text-xs text-slate-400 font-medium">Control Center</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20 group"
                    >
                        <div className={`transform transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-slate-300 group-hover:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 relative">
                    <div className="mb-8">
                        <p className="text-slate-400 uppercase text-xs font-bold tracking-wider px-4">
                            {sidebarOpen ? 'Main Navigation' : '···'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <NavLink
                            href="/super-admin"
                            active={pathname === '/super-admin'}
                            sidebarOpen={sidebarOpen}
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            }
                          
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            href="/super-admin/clients"
                            active={pathname.includes('/super-admin/clients')}
                            sidebarOpen={sidebarOpen}
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                           
                        >
                            Client Management
                        </NavLink>

                       

                        <NavLink
                            href="/super-admin/profile"
                            active={pathname.includes('/super-admin/profile')}
                            sidebarOpen={sidebarOpen}
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        >
                            Profile
                        </NavLink>

                        

                        

                       
                    </div>
                </nav>

                
                
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-xl shadow-sm z-10 border-b border-slate-200/60">
                    <div className="flex items-center justify-between px-8 py-2">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 capitalize">
                                    {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Welcome back, manage your system efficiently
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                           

                            {/* Profile Dropdown */}
                           <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 focus:outline-none group bg-slate-50 rounded-xl px-4 py-2 hover:bg-slate-100 transition-all duration-200"
                >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        SA
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Super Admin</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <svg 
                        className={`h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-200">
                       
                      
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
                        </div>
                    </div>
                </header>

                {/* Enhanced Main Content */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                    
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/60 backdrop-blur-xl   overflow-hidden">
                                {children}
                            </div>
                        </div>
                 
                </div>
            </div>
        </div>
    );
}

// Enhanced NavLink Component
function NavLink({ href, active, icon, children, sidebarOpen, badge }) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-300 ${active
                    ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'hover:bg-white/10 text-slate-300 hover:text-white hover:shadow-md'
                }`}
        >
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm" />
            )}

            <span className={`relative z-10 transition-all duration-200 ${active ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-300'
                }`}>
                {icon}
            </span>

            {sidebarOpen && (
                <>
                    <span className={`relative z-10 ml-4 text-sm font-medium transition-all duration-200 ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                        {children}
                    </span>

                    {badge && (
                        <span className={`relative z-10 ml-auto text-xs px-2 py-0.5 rounded-full font-semibold transition-all duration-200 ${active
                                ? 'bg-indigo-400 text-white'
                                : 'bg-slate-600 text-slate-300 group-hover:bg-indigo-400 group-hover:text-white'
                            }`}>
                            {badge}
                        </span>
                    )}
                </>
            )}

            {active && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-l-full" />
            )}
        </Link>
    );
}