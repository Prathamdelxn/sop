'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Book, Database, PlayCircle, ClipboardCheck, BarChart3,
  ArrowRight, Activity, Package, AlertTriangle, CheckCircle2,
  Timer, Zap
} from 'lucide-react';
import { migrateLegacyPermissions } from '@/utils/featurePermissions';

export default function ElogBookPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) {
      const parsedUser = JSON.parse(userdata);
      setUserData(parsedUser);
      
      // Migrate permissions if necessary
      const tasks = migrateLegacyPermissions(parsedUser.task || []);
      setUserTasks(tasks);
    }
  }, []);

  const allModules = [
    {
      id: 'master-data',
      title: 'Master Data',
      permission: 'Master Data Management',
      description: 'Configure customers, parts, coating standards, and basket capacity for your production line.',
      icon: Database,
      href: '/dashboard/elogbook/master-data',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/10',
      stats: [
        { label: 'Parts & Standards', icon: Package },
        { label: 'Capacity Config', icon: Zap },
      ],
    },
    {
      id: 'production',
      title: 'Production Cycle',
      permission: 'Bucket Execution',
      description: 'Track basket lifecycle with barcode scanning — from loading to completion with real-time timers.',
      icon: PlayCircle,
      href: '/dashboard/elogbook/production',
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      stats: [
        { label: 'Barcode Scan', icon: Activity },
        { label: 'Live Timer', icon: Timer },
      ],
    },
    {
      id: 'qc',
      title: 'Quality Control',
      permission: 'Quality Check',
      description: 'Inspect coated parts for defects, manage rework flow, and track final quantities for invoicing.',
      icon: ClipboardCheck,
      href: '/dashboard/elogbook/qc',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10',
      stats: [
        { label: 'Defect Types', icon: AlertTriangle },
        { label: 'Rework Flow', icon: CheckCircle2 },
      ],
    },
    {
      id: 'reports',
      title: 'Reports & Dashboard',
      permission: 'Graphical Representation',
      description: 'View cycle time analysis, quantity breakdowns, defect trends, and export PDF reports.',
      icon: BarChart3,
      href: '/dashboard/elogbook/reports',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/10',
      stats: [
        { label: 'Charts & Graphs', icon: BarChart3 },
        { label: 'PDF Export', icon: Book },
      ],
    },
  ];

  useEffect(() => {
    if (!userData) return;

    if (userData.role === 'company-admin' || userData.role === 'super-manager') {
      setFilteredModules(allModules);
    } else {
      const filtered = allModules.filter(mod => userTasks.includes(mod.permission));
      setFilteredModules(filtered);
    }
  }, [userData, userTasks]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Book className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              ELogBook
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Industrial Coating Logbook & Cycle Time Analysis
            </p>
          </div>
        </div>
        <p className="text-gray-600 mt-3 max-w-2xl text-sm leading-relaxed">
          Digital barcode-driven system for real-time production data capture, quality metrics, and operational loss tracking.
        </p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredModules.map((mod, index) => (
          <button
            key={mod.id}
            onClick={() => router.push(mod.href)}
            className="group relative bg-white rounded-2xl border border-gray-100 p-6 text-left transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 hover:-translate-y-1 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 ${mod.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-10 -mt-10`} />

            <div className="relative z-10">
              {/* Icon and Title Row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${mod.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <mod.icon className="text-white w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-all duration-300 group-hover:translate-x-1" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                {mod.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {mod.description}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2">
                {mod.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 group-hover:bg-gray-100 transition-colors">
                    <stat.icon className="w-3.5 h-3.5" />
                    {stat.label}
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
          Coating Process Management System
        </p>
      </div>
    </div>
  );
}
