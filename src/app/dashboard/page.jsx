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
            Welcome to <span className="text-indigo-600 capitalize">{ userData?.role|| 'Super Admin'}</span> Dashboard
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            You have full control over the system. Manage clients, settings, and configurations from this centralized panel.
          </p>
          
          
         
          
        </div>
        
      
       
      </div>
    </div>



    
    </div>
  );
}