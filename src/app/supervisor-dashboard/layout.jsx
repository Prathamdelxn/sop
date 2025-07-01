"use client";

import { useEffect, useState } from "react";
import { Bell, Users, ClipboardEdit, LogOut, ClipboardList, BarChart3, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Layout({ children }) {
    const router=useRouter();
  const [activeItem, setActiveItem] = useState("Create Task");
    const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.replace('/login'); // You can also use replace instead of push
};
const[userDetails,setUSer]=useState();
  const sidebarItems = [
    { 
      label: "Create Task", 
      icon: <ClipboardEdit className="w-6 h-6 mb-2" />
    },
    { 
      label: "Assign Task", 
      icon: <UserPlus className="w-6 h-6 mb-2" />
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
const[userId,setId]=useState();
 const fetchUser = async () => {
  const data = localStorage.getItem('user');
  if (!data) {
    router.push("/login");
    return;
  }

  const userData = JSON.parse(data);
  setId(userData.id); // still useful if you need to use it elsewhere

  if (userData.role !== "supervisor") {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`/api/supervisor/fetch-by-id/${userData.id}`);
    const newdata = await res.json();
    console.log("Fetched Supervisor Data:", newdata);
    setUSer(newdata.supervisor)
  } catch (error) {
    console.error("Failed to fetch supervisor:", error);
  }
};

  useEffect(()=>{
fetchUser();
  },[])
  useEffect(()=>{
    const data =localStorage.getItem('user');
    console.log("Data",data)
    const userData=JSON.parse(data);
    if(userData.role!="supervisor"){
        router.push("/login")
    }

  },[])
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-8 h-20 border-b border-gray-200 bg-white shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="text-blue-700 font-extrabold tracking-wide leading-tight">
            <div className="text-xl">Manufacturing</div>
            <div className="text-xl">Execution</div>
            {/* <div className="text-xl">System</div> */}
          </div>
          <div className="text-sm text-gray-800 font-medium">
            Welcome, <strong className="text-blue-700">{userDetails?.name ||'Lorem Ipsum'}</strong>{" "}
            <span className="text-gray-500 font-normal">(Supervisor)</span>
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
        <aside className="fixed left-0 top-20 bottom-0 w-32 bg-white border-r border-gray-200 py-8 flex flex-col items-center shadow-lg z-30">
          <div className="flex flex-col gap-4">
            {sidebarItems.map(({ icon, label }) => {
              const isActive = activeItem === label;
              return (
                <div
                  key={label}
                  onClick={() => setActiveItem(label)}
                  className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 px-4 py-3 rounded-xl transform hover:scale-105 ${
                    isActive
                      ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {icon}
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

        {/* Main Content - Scrollable */}
        <main className="flex-1 ml-32 overflow-y-auto">
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-full">
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
          </div>
        </main>
      </div>
    </div>
  );
}