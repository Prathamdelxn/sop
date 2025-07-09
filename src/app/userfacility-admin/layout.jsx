"use client";

import { useState } from "react";
import { Bell, Users, LogOut, User, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState("Profile");

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
    };

    const sidebarItems = [
        {
            label: "Create Equipment",
            icon: <Package className="w-7 h-7 mb-3" />
        },
        {
            label: "Profile",
            icon: <User className="w-7 h-7 mb-3" />
        }
        
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Top Navbar - Fixed */}
            <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-8 h-20 border-b border-gray-200 bg-white shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-8">
                    <div className="text-blue-700 font-extrabold tracking-wide leading-tight">
                        <div className="text-xl">Manufacturing Execution System</div>
                    </div>
                    <div className="text-sm text-gray-800 font-medium">
                        Welcome, <strong className="text-blue-700">Abhijeet</strong>{" "}
                        <span className="text-gray-500 font-normal">(User Facility Admin)</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <Bell className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
                    <Users className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </header>

            {/* Body: Sidebar + Main */}
            <div className="flex flex-1 pt-20">
                {/* Sidebar - Fixed */}
                <aside className="fixed left-0 top-20 bottom-0 w-36 bg-white border-r border-gray-200 py-8 flex flex-col items-center shadow-lg z-30">
                    <div className="flex flex-col gap-6">
                        {sidebarItems.map(({ icon, label }) => {
                            const isActive = activeItem === label;
                            return (
                                <div
                                    key={label}
                                    onClick={() => {
                                        setActiveItem(label);
                                    }}
                                    className={`flex flex-col items-center text-center cursor-pointer transition-all duration-300 px-4 py-4 rounded-xl transform hover:scale-105 min-w-[100px]
                                        ${isActive
                                        ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex flex-col items-center">
                                        {icon}
                                        <span className="text-xs font-semibold leading-tight text-center">
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

                {/* Main Content - Scrollable */}
                <main className="flex-1 ml-36 overflow-y-auto">
                    <div className="p-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-full">
                            {children || (
                                <div className="flex items-center justify-center h-96 text-gray-500">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 text-gray-300 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">Select a menu item</h3>
                                        <p>Choose an option from the sidebar to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}