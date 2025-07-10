// "use client";

// import { useEffect, useState } from "react";
// import { Bell, Users, ClipboardEdit, LogOut, ClipboardList, BarChart3, UserPlus } from "lucide-react";
// import { useRouter } from "next/navigation";
// export default function Layout({ children }) {
//     const router=useRouter();
//   const [activeItem, setActiveItem] = useState("Create Prototype");
//     const handleLogout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   router.replace('/login'); // You can also use replace instead of push
// };
// const[userDetails,setUSer]=useState();
//   const sidebarItems = [
//     { 
//       label: "Create Prototype", 
//       route:"/facility-dashboard",
//       icon: <ClipboardEdit className="w-6 h-6 mb-2" />
//     },
//     { 
//       label: "Assign Task", 
//        route:"/facility-dashboard/assign-task",
//       icon: <UserPlus className="w-6 h-6 mb-2" />
//     },
//     { 
//       label: "Tasks", 
//        route:"/facility-dashboard/task",
//       icon: <ClipboardList className="w-6 h-6 mb-2" />
//     },
//     { 
//       label: "Teams", 
//        route:"/facility-dashboard/team",
//       icon: <Users className="w-6 h-6 mb-2" />
//     },
//     { 
//       label: "Report", 
//        route:"/facility-dashboard/report",
//       icon: <BarChart3 className="w-6 h-6 mb-2" />
//     }
//   ];
// const[userId,setId]=useState();
 
//   useEffect(()=>{
//     const data =localStorage.getItem('user');
//     console.log("Data",data)
//     const userData=JSON.parse(data);
//     if(userData?.role!="facility-admin"){
//         router.push("/login")
//     }
   
//     setUSer(userData);

//   },[])
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Top Navbar - Fixed */}
//       <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-8 h-20 border-b border-gray-200 bg-white shadow-lg backdrop-blur-sm">
//         <div className="flex items-center gap-8">
//           <div className="text-blue-700 font-extrabold tracking-wide leading-tight">
//             <div className="text-xl">Manufacturing
//            Execution System</div>
//           </div>
//           <div className="text-sm text-gray-800 font-medium">
//             Welcome, <strong className="text-blue-700">{userDetails?.name ||'Lorem Ipsum'}</strong>{" "}
//             <span className="text-gray-500 font-normal">(Facility Admin)</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-6">
//           <Bell className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
//           <button onClick={handleLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
//             <LogOut className="w-4 h-4" />
//             Log out
//           </button>
//         </div>
//       </header>

//       {/* Body: Sidebar + Main */}
//       <div className="flex flex-1 pt-20">
//         {/* Sidebar - Fixed */}
//         <aside className="fixed left-0 top-20 bottom-0 w-32 bg-white border-r border-gray-200 py-8 flex flex-col items-center shadow-lg z-30">
//           <div className="flex flex-col gap-4">
//             {sidebarItems.map(({ icon, label,route  }) => {
//               const isActive = activeItem === label;
//               return (
//                 <div
//                   key={label}
//                   onClick={() =>
//                     {
//                      router.push(route);
//                      setActiveItem(label)}}
//                   className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 px-4 py-3 rounded-xl transform hover:scale-105 ${
//                     isActive
//                       ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg"
//                       : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="flex flex-col items-center">
//                     {icon}
//                     <span className="text-xs font-semibold leading-tight max-w-full break-words">
//                       {label.split(' ').map((word, index) => (
//                         <div key={index}>{word}</div>
//                       ))}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </aside>

//         {/* Main Content - Scrollable */}
//         <main className="flex-1 ml-32 overflow-y-auto">
//           <div className="p-8">
//             <div className="bg-white rounded-2xl shadow-lg p-8 min-h-full">
//               {children || (
//                 <div className="flex items-center justify-center h-96 text-gray-500">
//                   <div className="text-center">
//                     <ClipboardEdit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                     <h3 className="text-lg font-medium mb-2">Select a menu item</h3>
//                     <p>Choose an option from the sidebar to get started</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Bell, Users, ClipboardEdit, LogOut, ClipboardList, BarChart3, UserPlus, ChevronDown, Settings2Icon, LucideSettings } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollText } from 'lucide-react';
import { User } from 'lucide-react';



export default function Layout({ children }) {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState("Create Prototype");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [userDetails, setUser] = useState();
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
    };

    const sidebarItems = [
        { 
            label: "Create Prototype", 
            route: "/facility-dashboard",
            icon: <ClipboardEdit className="w-6 h-6 mb-2" />
        },
        { 
            label: "Assign Equipment", 
            route: "/facility-dashboard/assign-equipment",
            icon: <LucideSettings className="w-6 h-6 mb-2" />
        },
        { 
            label: "Assign Task", 
            route: "/facility-dashboard/assign-task",
            icon: <UserPlus className="w-6 h-6 mb-2" />
        },
        { 
            label: "Teams", 
            route: "/facility-dashboard/team",
            icon: <Users className="w-6 h-6 mb-2" />
        },
        {
            label: "Profile", 
            route: "/facility-dashboard/profile",
            icon: <User className="w-6 h-6 mb-2" />
        },
    ];

    useEffect(() => {
        const data = localStorage.getItem('user');
        const userData = JSON.parse(data);
        if (userData?.role != "facility-admin") {
            router.push("/login");
        }
        setUser(userData);
    }, []);

    // Header scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 10);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
            {/* Top Navbar - Enhanced with animations */}
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
                isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-2xl"></div>
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 animate-pulse"></div>
                
                {/* Content */}
                <div className="relative flex justify-between items-center px-8 h-20">
                    {/* Left section */}
                    <div className="flex items-center gap-8">
                        {/* Logo with animation */}
                        <div className="group cursor-pointer">
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 font-extrabold tracking-wide leading-tight transform transition-all duration-300 group-hover:scale-105">
                                <div className="text-xl animate-gradient bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                                    Manufacturing Execution System
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                        
                        {/* Welcome message with enhanced styling */}
                        <div className="relative">
                            <div className="text-sm text-gray-700 font-medium bg-gradient-to-r from-white/60 to-white/80 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
                                <span className="text-gray-600">Welcome back,</span>{" "}
                                <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 animate-pulse">
                                    {userDetails?.name || 'Lorem Ipsum'}
                                </strong>
                                <div className="text-xs text-gray-500 font-normal mt-1 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Facility Administrator
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-6">
                        {/* Notification with badge */}
                        <div className="relative group">
                            <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/30 backdrop-blur-sm hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-110">
                                <Bell className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                                {notificationCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold animate-bounce">
                                            {notificationCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Hover effect ring */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                        </div>

                        {/* Profile dropdown */}
                       

                        {/* Quick logout button */}
                        <button 
                            onClick={handleLogout} 
                            className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-red-600 hover:to-red-700"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="relative flex items-center gap-2">
                                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                <span>Log out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Body: Sidebar + Main */}
            <div className="flex flex-1 pt-20">
                {/* Sidebar - Enhanced */}
                <aside className="fixed left-0 top-20 bottom-0 w-32 bg-white/70 backdrop-blur-xl border-r border-white/30 py-8 flex flex-col items-center shadow-2xl z-30">
                    <div className="flex flex-col gap-4">
                        {sidebarItems.map(({ icon, label, route }) => {
                            const isActive = activeItem === label;
                            return (
                                <div
                                    key={label}
                                    onClick={() => {
                                        router.push(route);
                                        setActiveItem(label);
                                    }}
                                    className={`group relative flex flex-col items-center text-center cursor-pointer transition-all duration-300 px-4 py-3 rounded-xl transform hover:scale-110 ${
                                        isActive
                                            ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-lg"
                                    }`}
                                >
                                    {/* Animated background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="relative flex flex-col items-center">
                                        <div className="transform transition-transform duration-300 group-hover:rotate-12">
                                            {icon}
                                        </div>
                                        <span className="text-xs font-semibold leading-tight max-w-full break-words">
                                            {label.split(' ').map((word, index) => (
                                                <div key={index}>{word}</div>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content - Enhanced */}
                <main className="flex-1 ml-32 overflow-y-auto">
                    <div className="p-8">
                        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 min-h-full border border-white/30">
                            {children || (
                                <div className="flex items-center justify-center h-96 text-gray-500">
                                    <div className="text-center">
                                        <div className="relative">
                                            <ClipboardEdit className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-pulse" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">Select a menu item</h3>
                                        <p className="text-gray-400">Choose an option from the sidebar to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Click outside to close dropdown */}
            {isProfileOpen && (
                <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                ></div>
            )}
        </div>
    );
}

// Add these custom animations to your global CSS
const styles = `
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
}

@keyframes slide-in-from-top-2 {
    from {
        transform: translateY(-8px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-in {
    animation-fill-mode: both;
}

.slide-in-from-top-2 {
    animation-name: slide-in-from-top-2;
}
`;