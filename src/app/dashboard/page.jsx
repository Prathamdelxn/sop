'use client';

import { motion, useScroll } from 'framer-motion';
import { Rocket,Plus ,Users ,BarChart3 ,Settings ,FileText ,MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function WelcomePage() {
  const [userData,setData]=useState();
   useEffect(() => {
      const userdata = localStorage.getItem('user');
      const data = JSON.parse(userdata);
      console.log(data);
      setData(data);
  
   },[])
  return (
    <div className="">
     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Welcome Message */}
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-indigo-600 capitalize">{userData?.role?.replace('-', ' ') || 'User'}</span> Dashboard
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {userData?.role === 'company-admin' ? (
              "You have full control over your company's system. Manage your staff, checklist configurations, and view comprehensive reports from this centralized panel."
            ) : userData?.role === 'super-manager' ? (
              "System Administrator mode. You can manage all companies, features, and platform-wide configurations from this high-level panel."
            ) : (
              `Access the operations and tasks assigned to you by your administrator. Use the sidebar to navigate your active features like ${userData?.features?.join(', ') || 'tasks'}.`
            )}
          </p>

          {/* Company ID Card for Admins */}
          {userData?.role === 'company-admin' && (
            <div className="max-w-md mx-auto mb-10">
              <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                   <Sparkles size={64} className="text-indigo-600" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Company Status</span>
                  <h3 className="text-sm text-gray-500 mb-4">Your unique Company ID</h3>
                  <div className="flex items-center gap-3 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 w-full justify-center">
                    <code className="text-2xl font-black text-indigo-700 tracking-wider">
                      {userData?.companyId || userData?.id}
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(userData?.companyId || userData?.id);
                        alert("Company ID copied to clipboard!");
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                      title="Copy ID"
                    >
                      <Plus className="rotate-45" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          
         
          
        </div>
        
      
       
      </div>
    </div>



    
    </div>
  );
}