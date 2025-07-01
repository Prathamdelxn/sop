'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    supervisors: 0,
    operators: 0,
    qaStaff: 0,
    managers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalUsers: 156,
      supervisors: 12,
      operators: 89,
      qaStaff: 23,
      managers: 8,
      activeUsers: 142
    });
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage all user accounts and system operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-100"
        />
        <StatCard
          title="Supervisors"
          value={stats.supervisors}
          icon="👨‍💼"
          color="bg-green-100"
        />
        <StatCard
          title="Operators"
          value={stats.operators}
          icon="⚙️"
          color="bg-yellow-100"
        />
        <StatCard
          title="QA Staff"
          value={stats.qaStaff}
          icon="🔍"
          color="bg-purple-100"
        />
        <StatCard
          title="Managers"
          value={stats.managers}
          icon="👔"
          color="bg-red-100"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon="✅"
          color="bg-teal-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-blue-900">Create Supervisor</div>
            </div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-medium text-green-900">Create Operator</div>
            </div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-purple-900">Create QA</div>
            </div>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-medium text-red-900">Create Manager</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Created new supervisor account', user: 'John Doe', time: '2 hours ago' },
            { action: 'Updated operator permissions', user: 'Jane Smith', time: '4 hours ago' },
            { action: 'Added QA staff member', user: 'Mike Johnson', time: '6 hours ago' },
            { action: 'Promoted operator to manager', user: 'Sarah Wilson', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}