'use client';

import { motion } from 'framer-motion';
import { Rocket,Plus ,Users ,BarChart3 ,Settings ,FileText ,MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-8 border border-gray-200/50 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-blue-600 bg-blue-100/50 px-3 py-1 rounded-full">
                New features available
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">John</span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Your dashboard has been upgraded with new analytics tools and performance metrics. 
              We've also improved the navigation to help you find what you need faster.
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200">
              Explore new features
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden md:block relative">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-2xl border border-gray-200/50 flex items-center justify-center">
              <Rocket className="h-16 w-16 text-blue-600" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100/80 rounded-xl border border-yellow-200/50 flex items-center justify-center shadow-sm">
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </motion.div>



    
    </div>
  );
}