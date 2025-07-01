"use client";
 
import { useState } from "react";
import { Bell, Users, ClipboardEdit, LogOut, ClipboardList, BarChart3, UserPlus } from "lucide-react";
 
export default function Layout({ children }) {
  const [activeItem, setActiveItem] = useState("Create Task");
 
  const sidebarItems = [
    {
      label: "Inbox",
      icon: <ClipboardEdit className="w-6 h-6 mb-2" />
    },
    {
      label: "Tasks",
      icon: <ClipboardList className="w-6 h-6 mb-2" />
    },
    {
      label: "Teams",
      icon: <Users className="w-6 h-6 mb-2" />
    },
    {
      label: "Report",
      icon: <BarChart3 className="w-6 h-6 mb-2" />
    }
  ];
 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-6 h-20 border-b border-gray-200 bg-white shadow-sm">
        {/* Left: Title + Welcome aligned horizontally */}
        <div className="flex items-center gap-6">
          <div className="text-blue-700 font-extrabold tracking-wide leading-tight">
            <div className="text-xl">Manufacturing</div>
            <div className="text-xl">Execution</div>
            <div className="text-xl">System</div>
          </div>
          <div className="text-sm text-gray-800 font-normal">
            Welcome, <strong>Lorem Ipsum</strong>{" "}
            <span className="text-gray-500">(Operator)</span>
          </div>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <Bell className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800" />
          <Users className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800" />
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </header>
 
      {/* Body: Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-28 bg-white border-r border-gray-200 py-8 flex flex-col items-center shadow-sm">
          <div className="flex flex-col gap-6">
            {sidebarItems.map(({ icon, label }) => {
              const isActive = activeItem === label;
              return (
                <div
                  key={label}
                  onClick={() => setActiveItem(label)}
                  className={`flex flex-col items-center text-center cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {icon}
                    <span className="text-xs font-medium leading-tight max-w-full break-words">
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
 
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
            {children || (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <ClipboardEdit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a menu item</h3>
                  <p>Choose an option from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}