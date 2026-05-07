'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Loader2, Factory, GitBranch, Package,
  Users, Activity, Clock, CheckCircle2, Pause,
  RefreshCw, BarChart3, Zap, Eye,
} from 'lucide-react';
import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { usePlants } from '@/features/elogbook/hooks/usePlants';
import { formatTimeToMMSS } from '@/features/elogbook/utils/formatters';

export default function PlantMonitorPage() {
  const router = useRouter();
  const { userData } = useElogbookPermission('Plant Monitor');

  const { plants, refetch: fetchPlants } = usePlants(userData?.companyId);
  const [monitorData, setMonitorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (userData?.companyId) fetchPlants();
  }, [userData, fetchPlants]);

  // Fetch monitoring data for all plants
  const fetchMonitorData = useCallback(async () => {
    if (!userData?.companyId || plants.length === 0) return;
    setLoading(true);
    try {
      const plantDataPromises = plants.map(async (plant) => {
        // Fetch lines for this plant
        const linesRes = await fetch(
          `/api/elogbook/lines?companyId=${userData.companyId}&plantId=${plant._id}`
        );
        const linesData = await linesRes.json();
        const lines = linesData.success ? linesData.data : [];

        // Fetch active baskets for this plant
        const basketsRes = await fetch(
          `/api/elogbook/baskets?companyId=${userData.companyId}&plantId=${plant._id}&status=in-progress,stopped`
        );
        const basketsData = await basketsRes.json();
        const activeBaskets = basketsData.success ? basketsData.data : [];

        // Fetch today's assignments
        const assignRes = await fetch(
          `/api/elogbook/assignments?companyId=${userData.companyId}&plantId=${plant._id}`
        );
        const assignData = await assignRes.json();
        const assignments = assignData.success ? assignData.data : [];

        // Calculate statistics
        const inProgress = activeBaskets.filter((b) => b.status === 'in-progress');
        const stopped = activeBaskets.filter((b) => b.status === 'stopped');
        const activeWorkers = assignments.filter((a) => a.status === 'active');

        return {
          plant,
          lines,
          activeBaskets,
          inProgressCount: inProgress.length,
          stoppedCount: stopped.length,
          activeWorkerCount: activeWorkers.length,
          assignments: activeWorkers,
        };
      });

      const results = await Promise.all(plantDataPromises);
      setMonitorData(results);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Monitor fetch error:', err);
    }
    setLoading(false);
  }, [userData?.companyId, plants]);

  useEffect(() => {
    if (plants.length > 0) fetchMonitorData();
  }, [plants, fetchMonitorData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchMonitorData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMonitorData]);

  const totalInProgress = monitorData.reduce((s, d) => s + d.inProgressCount, 0);
  const totalStopped = monitorData.reduce((s, d) => s + d.stoppedCount, 0);
  const totalWorkers = monitorData.reduce((s, d) => s + d.activeWorkerCount, 0);
  const totalLines = monitorData.reduce((s, d) => s + d.lines.length, 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/elogbook')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-indigo-500" />
              Plant Monitor
            </h1>
            <p className="text-sm text-gray-500">
              Real-time view of all plant activity (read-only)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              autoRefresh
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            {autoRefresh ? '🟢 Auto-refresh ON' : '⚪ Auto-refresh OFF'}
          </button>
          <button
            onClick={fetchMonitorData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Factory className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{plants.length}</div>
              <div className="text-xs text-gray-500">Plants</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">{totalInProgress}</div>
              <div className="text-xs text-gray-500">Active Baskets</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Pause className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-600">{totalStopped}</div>
              <div className="text-xs text-gray-500">Paused</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-600">{totalWorkers}</div>
              <div className="text-xs text-gray-500">Active Workers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Cards */}
      {loading && monitorData.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {monitorData.map((data) => (
            <div
              key={data.plant._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Plant Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Factory className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {data.plant.name}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {data.plant.city || data.plant.code}
                      {' • '}
                      {data.lines.length} lines
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold">
                    {data.inProgressCount} Active
                  </span>
                  {data.stoppedCount > 0 && (
                    <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold">
                      {data.stoppedCount} Paused
                    </span>
                  )}
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-bold">
                    {data.activeWorkerCount} Workers
                  </span>
                </div>
              </div>

              {/* Active Baskets */}
              <div className="p-6">
                {data.activeBaskets.length === 0 ? (
                  <div className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                    No active baskets in this plant right now
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.activeBaskets.map((basket) => (
                      <div
                        key={basket._id}
                        className={`rounded-xl border p-4 transition-all ${
                          basket.status === 'in-progress'
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-amber-200 bg-amber-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm ${
                                basket.status === 'in-progress'
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                              }`}
                            >
                              {basket.basketNumber}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                Basket {basket.basketNumber}
                              </div>
                              <div className="text-xs text-gray-400">
                                {basket.masterDataId?.partName}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                              basket.status === 'in-progress'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {basket.status === 'in-progress' ? '▶ Running' : '⏸ Paused'}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Line</span>
                            <span className="font-medium text-gray-600">
                              {basket.lineId?.lineNumber
                                ? `Line ${basket.lineId.lineNumber}`
                                : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-400">Execution by</span>
                            <span className="font-bold text-indigo-600 text-right max-w-[120px]">
                              {basket.executors?.length > 0 
                                ? basket.executors.join(", ") 
                                : basket.startUser || '—'}
                            </span>
                          </div>
                          {basket.supporters?.length > 0 && (
                            <div className="flex justify-between items-start">
                              <span className="text-gray-400">Supported by</span>
                              <span className="font-medium text-gray-500 text-right max-w-[120px]">
                                {basket.supporters.join(", ")}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Started</span>
                            <span className="font-medium text-gray-600">
                              {basket.startTime
                                ? new Date(basket.startTime).toLocaleTimeString()
                                : '—'}
                            </span>
                          </div>
                          {basket.status === 'stopped' && (
                            <>
                              <div className="flex justify-between mt-2 pt-2 border-t border-amber-100">
                                <span className="text-amber-600 font-bold">Paused At</span>
                                <span className="font-bold text-amber-700">
                                  {basket.stoppages?.[basket.stoppages.length - 1]?.stopTime
                                    ? new Date(basket.stoppages[basket.stoppages.length - 1].stopTime).toLocaleTimeString()
                                    : '—'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-amber-600 font-bold">Paused By</span>
                                <span className="font-bold text-amber-700">
                                  {basket.stoppages?.[basket.stoppages.length - 1]?.stopUser || '—'}
                                </span>
                              </div>
                              <div className="flex flex-col mt-1">
                                <span className="text-[10px] text-amber-500 font-bold uppercase">Reason</span>
                                <span className="text-xs text-amber-800 italic">
                                  "{basket.stoppages?.[basket.stoppages.length - 1]?.reason || 'No reason provided'}"
                                </span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-400">Total Loss Time</span>
                            <span className={`font-bold ${basket.totalLostTime > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              {formatTimeToMMSS(basket.totalLostTime || 0)}
                            </span>
                          </div>
                          {basket.stoppages?.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Stoppage Count</span>
                              <span className="font-medium text-gray-600">
                                {basket.stoppages.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Worker Assignments */}
                {data.assignments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Today&apos;s Assigned Workers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.assignments.map((assign) => (
                        <div
                          key={assign._id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg text-xs"
                        >
                          <span className="font-semibold text-purple-700">
                            {assign.userId?.name || assign.userId?.username}
                          </span>
                          <span className="text-purple-400">→</span>
                          <span className="text-purple-600">
                            Line {assign.lineId?.lineNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
