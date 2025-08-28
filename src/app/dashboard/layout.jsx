// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { 
//   Home, 
//   Wrench, 
//   HardHat, 
//   Bell,
//   Menu,
//   X,
//   Search,
//   ChevronRight,
//   LogOut,
//   ClipboardList,
//   PlayCircle,
//   Link,
//   CheckCircle2,
//   UserCheck
// } from 'lucide-react';

// const allNavigationItems = [
//   { name: 'Dashboard', href: '/dashboard/', icon: Home, current: true },
//   { name: 'Create Checklist', href: '/dashboard/create-checklist', icon: Wrench, current: false },
//   { name: 'Create Equipment', href: '/dashboard/create-equipment', icon: HardHat, current: false },
//   { name: 'Assign Task', href: '/dashboard/assign-task', icon: ClipboardList, current: false },
//   { name: 'Task Execution', href: '/dashboard/task-execution', icon: PlayCircle, current: false },
//   { name: 'Assign Checklist to Equipment', href: '/dashboard/assign-checklist-to-equipment', icon: Link, current: false },
//   { name: 'Approve Equipment', href: '/dashboard/approve-equipment', icon: CheckCircle2, current: false },
//   { name: 'Approve Task', href: '/dashboard/approve-task', icon: UserCheck, current: false },
// ];

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname(); // Get current pathname
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [navigation, setNavigation] = useState([allNavigationItems[0]]);
//   const [searchFocused, setSearchFocused] = useState(false);
// const[companyData,setCompanyData]=useState();
//   useEffect(() => {
//     const userdata = localStorage.getItem('user');
//     const data = JSON.parse(userdata);
//     console.log(data);
//     setUserData(data);
    
//     const datafetch=async()=>{
//       const res= await fetch(`/api/superAdmin/fetchById/${data.companyId}`);
//       const da=await res.json();
//       console.log("asdf",da.superAdmin);
//       setCompanyData(da.superAdmin)
//     }
//     datafetch();
//   }, []);

 
//   // Helper function to check if a route is active
//   const isActiveRoute = (itemHref, currentPath) => {
//     // Handle Dashboard route specifically
//     if (itemHref === '/dashboard/') {
//       return currentPath === '/dashboard' || currentPath === '/dashboard/';
//     }
//     return itemHref === currentPath;
//   };

//   const fetchUser = async () => {
//     if (!userData?.id) return;
    
//     try {
//       const res = await fetch(`/api/superAdmin/users/fetch-by-id/${userData?.id}`);
//       const details = await res.json();
      
//       // Create base navigation with Dashboard always first
//       const filteredNavigation = [{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }];

//       // Add other items if they exist in user's tasks
//       if (details.user?.task?.length) {
//         const userTasks = details.user.task;
//         allNavigationItems.forEach(item => {
//           if (item.name !== 'Dashboard' && userTasks.includes(item.name)) {
//             filteredNavigation.push({
//               ...item,
//               current: isActiveRoute(item.href, pathname)
//             });
//           }
//         });
//       }

//       setNavigation(filteredNavigation);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // Fallback to just Dashboard if API fails
//       setNavigation([{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }]);
//     }
//   };

//   useEffect(() => {
//     if (userData?.id) {
//       fetchUser();
//     }
//   }, [userData, pathname]); // Add pathname as dependency

//   // Update navigation when pathname changes
//   useEffect(() => {
//     console.log('Current pathname:', pathname); // Debug log
//     setNavigation(prevNav => 
//       prevNav.map(item => {
//         const isActive = isActiveRoute(item.href, pathname);
//         console.log(`${item.name}: ${item.href} vs ${pathname} = ${isActive}`); // Debug log
//         return {
//           ...item,
//           current: isActive
//         };
//       })
//     );
//   }, [pathname]);

//   const handleNavigation = (href) => {
//     setSidebarOpen(false); // Close mobile sidebar
//     router.push(href); // Use router.push for client-side navigation
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.replace('/new-login');
//   };
//  console.log("user data ",userData);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-pulse"></div>
//         <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-bounce"></div>
//         <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
//       </div>

//       {/* Mobile sidebar */}
//       <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
//         <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//                 <div className="w-4 h-4 bg-white rounded-md"></div>
//               </div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{userData?.role}</h1>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl p-2 hover:bg-white/50 hover:shadow-md"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           <nav className="mt-8 px-4 flex-1">
//             {navigation.map((item, index) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNavigation(item.href)}
//                 className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium mb-2 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                   item.current
//                     ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-md border border-indigo-100'
//                     : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                 }`}
//                 style={{animationDelay: `${index * 50}ms`}}
//               >
//                 <div className="flex items-center">
//                   <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                   {item.name}
//                 </div>
//                 {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//               </button>
//             ))}
//           </nav>
          
//           <div className="px-4 pb-4 mt-auto">
//             <div className="border-t border-gray-200/50 pt-4">
//               <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-xl transition-all duration-300">
//                 <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
//         <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-white/20 px-6 pb-4 shadow-xl">
//           <div className="flex h-16 shrink-0 items-center space-x-3">
//             <div className="w-10 h-10  overflow-hidden to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//              <img src={companyData?.logo} alt="" className='h-full w-full '/>
//             </div>
//             <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{companyData?.name}</h1>
//           </div>
//           <nav className="flex flex-1 flex-col mt-2">
//             <ul className="flex flex-1 flex-col gap-y-1">
//               {navigation.map((item, index) => (
//                 <li key={item.name} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
//                   <button
//                     onClick={() => handleNavigation(item.href)}
//                     className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium leading-6 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                       item.current
//                         ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-lg border border-indigo-100/50'
//                         : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <item.icon className={`h-5 w-5 shrink-0 mr-3 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                       {item.name}
//                     </div>
//                     {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//                   </button>
//                 </li>
//               ))}
//             </ul>
            
//             <div className="mt-6 border-t border-gray-200/50 pt-4">
//               <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-xl transition-all duration-300">
//                 <LogOut className="h-4 w-4 shrink-0 mr-3" />
//                 Logout
//               </button>
//             </div>
//           </nav>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         {/* Top bar */}
//         <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
//           <button
//             type="button"
//             className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden transition-all duration-200 rounded-xl hover:bg-white/50 hover:shadow-md"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </button>

//           <div className="flex flex-1 gap-x-4 self-stretch justify-between items-center">
//             <div className="relative flex flex-1 items-center max-w-2xl">
//                          <h1 className="text-lg font-black bg-gradient-to-r font-semibold capitalize from-gray-800 to-gray-600 bg-clip-text text-transparent">{userData?.role} Dashboard</h1>

              
//             </div>
            
//             <div className="flex items-center justify-between gap-x-3">
//               <button className="relative rounded-xl p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-all duration-300 hover:shadow-md hover:scale-105">
//                 <Bell className="h-5 w-5" />
//                 <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-xs text-white flex items-center justify-center font-bold shadow-lg animate-bounce">
//                   3
//                 </span>
//               </button>

//               <div className="relative">
//                 <button className="flex items-center gap-x-3 hover:bg-white/50 rounded-xl p-2 pr-4 transition-all duration-300 hover:shadow-md hover:scale-105">
//                   <div className="relative">
//                     <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center text-white justify-center shadow-lg">
//                       {userData?.username?.charAt(0)?.toUpperCase() || "U"}
//                     </div>
//                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
//                   </div>
//                  <div className="flex flex-col items-start">
//                      <span className="text-sm font-semibold text-gray-700 hidden md:inline">{userData?.name}{userData?.username}</span>
//                   <span className="text-[10px] font-medium text-gray-500 hidden md:inline capitalize">{userData?.role}</span>
//                  </div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Page content */}
//         <main className="py-8 relative z-10">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }



// 'use client';
 
// import { useEffect, useState, useRef} from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import {
//   Home,
//   Wrench,
//   HardHat,
//   Bell,
//   Menu,
//   X,
//   Search,
//   ChevronRight,
//   LogOut,
//   ClipboardList,
//   PlayCircle,
//   Link,
//   CheckCircle2,
//   UserCheck
// } from 'lucide-react';
 
// const allNavigationItems = [
//   { name: 'Dashboard', href: '/dashboard/', icon: Home, current: true },
//   { name: 'Create Checklist', href: '/dashboard/create-checklist', icon: Wrench, current: false },
//   { name: 'Create Equipment', href: '/dashboard/create-equipment', icon: HardHat, current: false },
//   { name: 'Assign Task', href: '/dashboard/assign-task', icon: ClipboardList, current: false },
//   { name: 'Task Execution', href: '/dashboard/task-execution', icon: PlayCircle, current: false },
//   { name: 'Assign Checklist to Equipment', href: '/dashboard/assign-checklist-to-equipment', icon: Link, current: false },
//   { name: 'Approve Equipment', href: '/dashboard/approve-equipment', icon: CheckCircle2, current: false },
//   { name: 'Approve Task', href: '/dashboard/approve-task', icon: UserCheck, current: false },
//    { name: 'Approve Checklist', href: '/dashboard/approve-checklist', icon: PlayCircle, current: false },
//     { name: 'Approve Tagged Chechlist with Equipment', href: '/dashboard/approve-assign-checklist-to-equipment', icon: PlayCircle, current: false },
// ];
 
// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname(); // Get current pathname
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [navigation, setNavigation] = useState([allNavigationItems[0]]);
//   const [searchFocused, setSearchFocused] = useState(false);
// const[companyData,setCompanyData]=useState();
//   useEffect(() => {
//     const userdata = localStorage.getItem('user');
//     const data = JSON.parse(userdata);
//     console.log(data);
//     setUserData(data);
   
//     const datafetch=async()=>{
//       const res= await fetch(`/api/superAdmin/fetchById/${data.companyId}`);
//       const da=await res.json();
//       console.log("asdf",da.superAdmin);
//       setCompanyData(da.superAdmin)
//     }
//     datafetch();
//   }, []);
//     // State for dropdown visibility
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
 
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsProfileDropdownOpen(false);
//       }
//     };
 
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
 
 
//   // Helper function to check if a route is active
//   const isActiveRoute = (itemHref, currentPath) => {
//     // Handle Dashboard route specifically
//     if (itemHref === '/dashboard/') {
//       return currentPath === '/dashboard' || currentPath === '/dashboard/';
//     }
//     return itemHref === currentPath;
//   };
 
//   const fetchUser = async () => {
//     if (!userData?.id) return;
   
//     try {
//       const res = await fetch(`/api/superAdmin/users/fetch-by-id/${userData?.id}`);
//       const details = await res.json();
     
//       // Create base navigation with Dashboard always first
//       const filteredNavigation = [{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }];
 
//       // Add other items if they exist in user's tasks
//       if (details.user?.task?.length) {
//         const userTasks = details.user.task;
//         allNavigationItems.forEach(item => {
//           if (item.name !== 'Dashboard' && userTasks.includes(item.name)) {
//             filteredNavigation.push({
//               ...item,
//               current: isActiveRoute(item.href, pathname)
//             });
//           }
//         });
//       }
 
//       setNavigation(filteredNavigation);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // Fallback to just Dashboard if API fails
//       setNavigation([{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }]);
//     }
//   };
 
//   useEffect(() => {
//     if (userData?.id) {
//       fetchUser();
//     }
//   }, [userData, pathname]); // Add pathname as dependency
 
//   // Update navigation when pathname changes
//   useEffect(() => {
//     console.log('Current pathname:', pathname); // Debug log
//     setNavigation(prevNav =>
//       prevNav.map(item => {
//         const isActive = isActiveRoute(item.href, pathname);
//         console.log(`${item.name}: ${item.href} vs ${pathname} = ${isActive}`); // Debug log
//         return {
//           ...item,
//           current: isActive
//         };
//       })
//     );
//   }, [pathname]);
 
//   const handleNavigation = (href) => {
//     setSidebarOpen(false); // Close mobile sidebar
//     router.push(href); // Use router.push for client-side navigation
//   };
 
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.replace('/new-login');
//   };
//  console.log("user data ",userData);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-pulse"></div>
//         <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-bounce"></div>
//         <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
//       </div>
 
//       {/* Mobile sidebar */}
//       <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
//         <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//                 <div className="w-4 h-4 bg-white rounded-md"></div>
//               </div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{userData?.role}</h1>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl p-2 hover:bg-white/50 hover:shadow-md"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           <nav className="mt-8 px-4 flex-1">
//             {navigation.map((item, index) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNavigation(item.href)}
//                 className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium mb-2 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                   item.current
//                     ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-md border border-indigo-100'
//                     : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                 }`}
//                 style={{animationDelay: `${index * 50}ms`}}
//               >
//                 <div className="flex items-center">
//                   <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                   {item.name}
//                 </div>
//                 {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//               </button>
//             ))}
//           </nav>
         
//           <div className="px-4 pb-4 mt-auto">
//             <div className="border-t border-gray-200/50 pt-4">
//               <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-xl transition-all duration-300">
//                 <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
 
//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
//         <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-white/20 px-6 pb-4 shadow-xl">
//           <div className="flex h-16 shrink-0 items-center space-x-3">
//             <div className="w-10 h-10  overflow-hidden to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//              <img src={companyData?.logo} alt="" className='h-full w-full '/>
//             </div>
//             <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{companyData?.name}</h1>
//           </div>
//           <nav className="flex flex-1 flex-col mt-2">
//             <ul className="flex flex-1 flex-col gap-y-1">
//               {navigation.map((item, index) => (
//                 <li key={item.name} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
//                   <button
//                     onClick={() => handleNavigation(item.href)}
//                     className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium leading-6 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                       item.current
//                         ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-lg border border-indigo-100/50'
//                         : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <item.icon className={`h-5 w-5 shrink-0 mr-3 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                       {item.name}
//                     </div>
//                     {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//                   </button>
//                 </li>
//               ))}
//             </ul>
           
          
//           </nav>
//         </div>
//       </div>
 
//       {/* Main content */}
//       <div className="lg:pl-72">
//         {/* Top bar */}
//        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
//   <button
//     type="button"
//     className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden transition-all duration-200 rounded-xl hover:bg-white/50 hover:shadow-md"
//     onClick={() => setSidebarOpen(true)}
//   >
//     <Menu className="h-5 w-5" />
//   </button>
 
//   <div className="flex flex-1 gap-x-4 self-stretch justify-between items-center">
//     <div className="relative flex flex-1 items-center max-w-2xl">
//       <h1 className="text-lg font-black bg-gradient-to-r font-semibold capitalize from-gray-800 to-gray-600 bg-clip-text text-transparent">
//         {userData?.role} Dashboard
//       </h1>
//     </div>
   
//     <div className="flex items-center justify-between gap-x-3">
//       <button className="relative rounded-xl p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-all duration-300 hover:shadow-md hover:scale-105">
//         <Bell className="h-5 w-5" />
//         <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-xs text-white flex items-center justify-center font-bold shadow-lg animate-bounce">
//           3
//         </span>
//       </button>
 
//       <div className="relative">
//         <div className="relative group">
//           <button
//             className="flex items-center gap-x-3 hover:bg-white/50 rounded-xl p-2 pr-4 transition-all duration-300 shadow-md hover:scale-105"
//             onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
//           >
//             <div className="relative">
//               <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center text-white justify-center shadow-lg">
//                 {userData?.username?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
//             </div>
//             <div className="flex flex-col items-start">
//              <span className="text-sm font-semibold text-gray-700 hidden md:inline">
//   {(() => {
//     const fullName = userData?.name || userData?.username || '';
//     const nameParts = fullName.trim().split(' ');
//     if (nameParts.length === 1) return nameParts[0];
//     return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
//   })()}
// </span>

//               <span className="text-[10px] font-medium text-gray-500 hidden md:inline capitalize">
//                 {userData?.role}
//               </span>
//             </div>
//           </button>
         
//           {/* Dropdown menu */}
//           {isProfileDropdownOpen && (
//   <div 
//     ref={dropdownRef}  // Make sure this is here
//     className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
//   >
//     {/* Dropdown content */}
//     <button
//       onClick={handleLogout}
//       className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
//     >
//       <LogOut className="mr-2 h-4 w-4" />
//       Sign out
//     </button>
//   </div>
// )}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
 
//         {/* Page content */}
//         <main className="py-8 relative z-10">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>
 
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
       
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import {
//   Home,
//   Wrench,
//   HardHat,
//   Bell,
//   Menu,
//   X,
//   Search,
//   ChevronRight,
//   LogOut,
//   ClipboardList,
//   PlayCircle,
//   Link,
//   CheckCircle2,
//   UserCheck
// } from 'lucide-react';

// const allNavigationItems = [
//   { name: 'Dashboard', href: '/dashboard/', icon: Home, current: true },
//   { name: 'Create Checklist', href: '/dashboard/create-checklist', icon: Wrench, current: false },
//   { name: 'Create Equipment', href: '/dashboard/create-equipment', icon: HardHat, current: false },
//   { name: 'Assign Task', href: '/dashboard/assign-task', icon: ClipboardList, current: false },
//   { name: 'Task Execution', href: '/dashboard/task-execution', icon: PlayCircle, current: false },
//   { name: 'Assign Checklist to Equipment', href: '/dashboard/assign-checklist-to-equipment', icon: Link, current: false },
//   { name: 'Approve Equipment', href: '/dashboard/approve-equipment', icon: CheckCircle2, current: false },
//   { name: 'Approve Task', href: '/dashboard/approve-task', icon: UserCheck, current: false },
//   { name: 'Approve Checklist', href: '/dashboard/approve-checklist', icon: PlayCircle, current: false },
//     { name: 'Review Access', href: '/dashboard/review-page', icon: PlayCircle, current: false },
//   { name: 'Approve Tagged Chechlist with Equipment', href: '/dashboard/approve-assign-checklist-to-equipment', icon: PlayCircle, current: false },
// ];

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [navigation, setNavigation] = useState([allNavigationItems[0]]);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [companyData, setCompanyData] = useState();
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const userdata = localStorage.getItem('user');
//     const data = JSON.parse(userdata);
//     setUserData(data);
   
//     const datafetch = async () => {
//       const res = await fetch(`/api/superAdmin/fetchById/${data.companyId}`);
//       const da = await res.json();
//       setCompanyData(da.superAdmin);
//     };
//     datafetch();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsProfileDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const isActiveRoute = (itemHref, currentPath) => {
//     if (itemHref === '/dashboard/') {
//       return currentPath === '/dashboard' || currentPath === '/dashboard/';
//     }
//     return itemHref === currentPath;
//   };

//   const fetchUser = async () => {
//     if (!userData?.id) return;
   
//     try {
//       const res = await fetch(`/api/superAdmin/users/fetch-by-id/${userData?.id}`);
//       const details = await res.json();
     
//       const filteredNavigation = [{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }];

//       if (details.user?.task?.length) {
//         const userTasks = details.user.task;
//         allNavigationItems.forEach(item => {
//           if (item.name !== 'Dashboard' && userTasks.includes(item.name)) {
//             filteredNavigation.push({
//               ...item,
//               current: isActiveRoute(item.href, pathname)
//             });
//           }
//         });
//       }

//       setNavigation(filteredNavigation);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setNavigation([{
//         ...allNavigationItems[0],
//         current: isActiveRoute(allNavigationItems[0].href, pathname)
//       }]);
//     }
//   };

//   useEffect(() => {
//     if (userData?.id) {
//       fetchUser();
//     }
//   }, [userData, pathname]);

//   useEffect(() => {
//     setNavigation(prevNav =>
//       prevNav.map(item => ({
//         ...item,
//         current: isActiveRoute(item.href, pathname)
//       }))
//     );
//   }, [pathname]);

//   const handleNavigation = (href) => {
//     setSidebarOpen(false);
//     router.push(href);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.replace('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-pulse"></div>
//         <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-bounce"></div>
//         <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
//       </div>

//       {/* Mobile sidebar */}
//       <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
//         <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//                 <div className="w-4 h-4 bg-white rounded-md"></div>
//               </div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{userData?.role}</h1>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl p-2 hover:bg-white/50 hover:shadow-md"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           <nav className="mt-8 px-4 flex-1">
//             {navigation.map((item, index) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNavigation(item.href)}
//                 className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium mb-2 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                   item.current
//                     ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-md border border-indigo-100'
//                     : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                 }`}
//                 style={{animationDelay: `${index * 50}ms`}}
//               >
//                 <div className="flex items-center">
//                   <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                   {item.name}
//                 </div>
//                 {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//               </button>
//             ))}
//           </nav>
         
//           <div className="px-4 pb-4 mt-auto">
//             <div className="border-t border-gray-200/50 pt-4">
//               <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-xl transition-all duration-300">
//                 <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
//         <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-white/20 px-6 pb-4 shadow-xl">
//           <div className="flex h-16 shrink-0 items-center space-x-3">
//             <div className="w-10 h-10 overflow-hidden to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
//               <img src={companyData?.logo} alt="" className='h-full w-full'/>
//             </div>
//             <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{companyData?.name}</h1>
//           </div>
//           <nav className="flex flex-1 flex-col mt-2">
//             <ul className="flex flex-1 flex-col gap-y-1">
//               {navigation.map((item, index) => (
//                 <li key={item.name} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
//                   <button
//                     onClick={() => handleNavigation(item.href)}
//                     className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium leading-6 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
//                       item.current
//                         ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-lg border border-indigo-100/50'
//                         : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <item.icon className={`h-5 w-5 shrink-0 mr-3 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
//                       {item.name}
//                     </div>
//                     {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72 relative z-10">
//         {/* Top bar */}
//         <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
//           <button
//             type="button"
//             className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden transition-all duration-200 rounded-xl hover:bg-white/50 hover:shadow-md"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </button>
        
//           <div className="flex flex-1 gap-x-4 self-stretch justify-between items-center">
//             <div className="relative flex flex-1 items-center max-w-2xl">
//               <h1 className="text-lg font-black bg-gradient-to-r font-semibold capitalize from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                 {userData?.role} Dashboard
//               </h1>
//             </div>
          
//             <div className="flex items-center justify-between gap-x-3">
//               <button className="relative rounded-xl p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-all duration-300 hover:shadow-md hover:scale-105">
//                 <Bell className="h-5 w-5" />
//                 <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-xs text-white flex items-center justify-center font-bold shadow-lg animate-bounce">
//                   3
//                 </span>
//               </button>

//               <div className="relative">
//                 <div className="relative group">
//                   <button
//                     className="flex items-center gap-x-3 hover:bg-white/50 rounded-xl p-2 pr-4 transition-all duration-300 shadow-md hover:scale-105"
//                     onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
//                   >
//                     <div className="relative">
//                       <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center text-white justify-center shadow-lg">
//                         {userData?.username?.charAt(0)?.toUpperCase() || "U"}
//                       </div>
//                       <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
//                     </div>
//                     <div className="flex flex-col items-start">
//                       <span className="text-sm font-semibold text-gray-700 hidden md:inline">
//                         {(() => {
//                           const fullName = userData?.name || userData?.username || '';
//                           const nameParts = fullName.trim().split(' ');
//                           if (nameParts.length === 1) return nameParts[0];
//                           return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
//                         })()}
//                       </span>
//                       <span className="text-[10px] font-medium text-gray-500 hidden md:inline capitalize">
//                         {userData?.role}
//                       </span>
//                     </div>
//                   </button>
                
//                   {/* Dropdown menu */}
//                   {isProfileDropdownOpen && (
//                     <div 
//                       ref={dropdownRef}
//                       className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
//                     >
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
//                       >
//                         <LogOut className="mr-2 h-4 w-4" />
//                         Sign out
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
      
//         {/* Page content */}
//         <main className="py-8 relative z-0">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
      
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Wrench,
  HardHat,
  Bell,
  Menu,
  X,
  Search,
  ChevronRight,
  LogOut,
  ClipboardList,
  PlayCircle,
  Link,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

const allNavigationItems = [
  { name: 'Dashboard', href: '/dashboard/', icon: Home, current: true },
  { name: 'Create Checklist', href: '/dashboard/create-checklist', icon: Wrench, current: false },
  { name: 'Create Equipment', href: '/dashboard/create-equipment', icon: HardHat, current: false },
  { name: 'Assign Task', href: '/dashboard/assign-task', icon: ClipboardList, current: false },
  { name: 'Task Execution', href: '/dashboard/task-execution', icon: PlayCircle, current: false },
  { name: 'Assign Checklist to Equipment', href: '/dashboard/assign-checklist-to-equipment', icon: Link, current: false },
  { name: 'Approve Equipment', href: '/dashboard/approve-equipment', icon: CheckCircle2, current: false },
  { name: 'Approve Task', href: '/dashboard/approve-task', icon: UserCheck, current: false },
  { name: 'Approve Checklist', href: '/dashboard/approve-checklist', icon: PlayCircle, current: false },
    { name: 'Review Access', href: '/dashboard/review-page', icon: PlayCircle, current: false },
  { name: 'Approve Tagged Chechlist with Equipment', href: '/dashboard/approve-assign-checklist-to-equipment', icon: PlayCircle, current: false },
];

// Loading skeleton component for sidebar items
const SidebarSkeleton = ({ isMobile = false }) => {
  return (
    <div className={`${isMobile ? 'px-4' : ''}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center rounded-xl px-4 py-3.5 mb-2 animate-pulse bg-gray-200/50"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-5 h-5 rounded-md bg-gray-300 mr-3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [navigation, setNavigation] = useState([allNavigationItems[0]]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [companyData, setCompanyData] = useState();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    const data = JSON.parse(userdata);
    setUserData(data);
   
    const datafetch = async () => {
      const res = await fetch(`/api/superAdmin/fetchById/${data.companyId}`);
      const da = await res.json();
      setCompanyData(da.superAdmin);
    };
    datafetch();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveRoute = (itemHref, currentPath) => {
    if (itemHref === '/dashboard/') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return itemHref === currentPath;
  };

  const fetchUser = async () => {
    if (!userData?.id) return;
   
    try {
      setIsLoading(true); // Start loading
      const res = await fetch(`/api/superAdmin/users/fetch-by-id/${userData?.id}`);
      const details = await res.json();
     
      const filteredNavigation = [{
        ...allNavigationItems[0],
        current: isActiveRoute(allNavigationItems[0].href, pathname)
      }];

      if (details.user?.task?.length) {
        const userTasks = details.user.task;
        allNavigationItems.forEach(item => {
          if (item.name !== 'Dashboard' && userTasks.includes(item.name)) {
            filteredNavigation.push({
              ...item,
              current: isActiveRoute(item.href, pathname)
            });
          }
        });
      }

      setNavigation(filteredNavigation);
      setIsLoading(false); // End loading
    } catch (error) {
      console.error('Error fetching user data:', error);
      setNavigation([{
        ...allNavigationItems[0],
        current: isActiveRoute(allNavigationItems[0].href, pathname)
      }]);
      setIsLoading(false); // End loading even on error
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchUser();
    } else {
      // If no user data, still show the dashboard item
      setNavigation([{
        ...allNavigationItems[0],
        current: isActiveRoute(allNavigationItems[0].href, pathname)
      }]);
      setIsLoading(false);
    }
  }, [userData, pathname]);

  useEffect(() => {
    setNavigation(prevNav =>
      prevNav.map(item => ({
        ...item,
        current: isActiveRoute(item.href, pathname)
      }))
    );
  }, [pathname]);

  const handleNavigation = (href) => {
    setSidebarOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-bounce"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-4 h-4 bg-white rounded-md"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{userData?.role}</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl p-2 hover:bg-white/50 hover:shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 px-4 flex-1">
            {isLoading ? (
              <SidebarSkeleton isMobile={true} />
            ) : (
              navigation.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium mb-2 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
                    item.current
                      ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-md border border-indigo-100'
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                  }`}
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex items-center">
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    {item.name}
                  </div>
                  {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
                </button>
              ))
            )}
          </nav>
         
          <div className="px-4 pb-4 mt-auto">
            <div className="border-t border-gray-200/50 pt-4">
              <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-xl transition-all duration-300">
                <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-white/20 px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center space-x-3">
            <div className="w-10 h-10 overflow-hidden to-pink-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
              {companyData?.logo ? (
                <img src={companyData.logo} alt="" className='h-full w-full'/>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-md"></div>
                </div>
              )}
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {companyData?.name || "Company Name"}
            </h1>
          </div>
          <nav className="flex flex-1 flex-col mt-2">
            <ul className="flex flex-1 flex-col gap-y-1">
              {isLoading ? (
                <SidebarSkeleton />
              ) : (
                navigation.map((item, index) => (
                  <li key={item.name} className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium leading-6 transition-all duration-300 hover:scale-[1.02] w-full text-left ${
                        item.current
                          ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 text-indigo-700 shadow-lg border border-indigo-100/50'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 shrink-0 mr-3 transition-transform duration-300 group-hover:scale-110 ${item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        {item.name}
                      </div>
                      {item.current && <ChevronRight className="h-4 w-4 opacity-60 animate-pulse" />}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 relative z-10">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden transition-all duration-200 rounded-xl hover:bg-white/50 hover:shadow-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        
          <div className="flex flex-1 gap-x-4 self-stretch justify-between items-center">
            <div className="relative flex flex-1 items-center max-w-2xl">
              <h1 className="text-lg font-black bg-gradient-to-r font-semibold capitalize from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {userData?.role || "User"} Dashboard
              </h1>
            </div>
          
            <div className="flex items-center justify-between gap-x-3">
              <button className="relative rounded-xl p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-all duration-300 hover:shadow-md hover:scale-105">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-xs text-white flex items-center justify-center font-bold shadow-lg animate-bounce">
                  3
                </span>
              </button>

              <div className="relative">
                <div className="relative group">
                  <button
                    className="flex items-center gap-x-3 hover:bg-white/50 rounded-xl p-2 pr-4 transition-all duration-300 shadow-md hover:scale-105"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center text-white justify-center shadow-lg">
                        {userData?.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                        {(() => {
                          const fullName = userData?.name || userData?.username || '';
                          const nameParts = fullName.trim().split(' ');
                          if (nameParts.length === 1) return nameParts[0];
                          return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
                        })()}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500 hidden md:inline capitalize">
                        {userData?.role || "user"}
                      </span>
                    </div>
                  </button>
                
                  {/* Dropdown menu */}
                  {isProfileDropdownOpen && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    >
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Page content */}
        {/* <main className="py-2 relative z-0"> */}
          <div className="mx-auto max-w-7xl px-2 h-full lg:px-2">
            {children}
          </div>
        {/* </main> */}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}