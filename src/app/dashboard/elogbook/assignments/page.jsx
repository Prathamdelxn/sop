'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Users, UserPlus, UserMinus, Loader2,
  Factory, GitBranch, Calendar, CheckCircle2,
  AlertCircle, Search, UserCheck, Clock,
} from 'lucide-react';
import { useElogbookPermission } from '@/features/elogbook/hooks/useElogbookPermission';
import { usePlants } from '@/features/elogbook/hooks/usePlants';
import { useLines } from '@/features/elogbook/hooks/useLines';

export default function WorkerAssignmentPage() {
  const router = useRouter();
  const { userData } = useElogbookPermission('Worker Assignment');

  // Use hex _id for plant/line queries (plants/lines are stored with hex _id as companyId)
  // Use companyId slug for user-related queries (users are stored with the slug)
  const adminId = userData?.id;
  const companySlug = userData?.companyId || userData?.id;

  // --- Plant & Line Selection ---
  const { plants, refetch: fetchPlants } = usePlants(companySlug);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const { lines, refetch: fetchLines } = useLines(companySlug, selectedPlantId || undefined);

  // --- State ---
  const [assignments, setAssignments] = useState([]);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedLineId, setSelectedLineId] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Plant locking for non-admin users
  const isPlantLocked = userData && userData.plantId && userData.role !== 'company-admin' && userData.role !== 'super-manager';

  useEffect(() => {
    if (companySlug) fetchPlants();
  }, [companySlug, fetchPlants]);

  useEffect(() => {
    if (isPlantLocked && userData.plantId && !selectedPlantId) {
      setSelectedPlantId(userData.plantId);
    }
  }, [isPlantLocked, userData, selectedPlantId]);

  useEffect(() => {
    if (selectedPlantId) {
      fetchLines();
    }
  }, [selectedPlantId, fetchLines]);

  // Fetch assignments and available workers
  const fetchAssignments = useCallback(async () => {
    if (!companySlug) return;
    setLoading(true);
    try {
      const urls = [
        fetch(`/api/elogbook/assignments?companyId=${companySlug}${selectedPlantId ? `&plantId=${selectedPlantId}` : ''}`),
        fetch(`/api/elogbook/assignments?companyId=${companySlug}&available=true`),
      ];
      
      const [assignRes, workerRes] = await Promise.all(urls);
      const assignData = await assignRes.json();
      const workerData = await workerRes.json();

      if (assignData.success) setAssignments(assignData.data);
      if (workerData.success) setAvailableWorkers(workerData.data);
    } catch (err) {
      console.error('Fetch assignments error:', err);
    }
    setLoading(false);
  }, [companySlug, selectedPlantId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Assign worker to line
  const handleAssign = async () => {
    if (!selectedLineId || !selectedWorkerId) {
      alert('Please select both a line and a worker');
      return;
    }
    setActionLoading('assign');
    try {
      const res = await fetch('/api/elogbook/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companySlug,
          plantId: selectedPlantId,
          lineId: selectedLineId,
          userId: selectedWorkerId,
          assignedBy: userData.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedWorkerId('');
        setSelectedLineId('');
        await fetchAssignments();
      } else {
        alert(data.message || 'Failed to assign worker');
      }
    } catch (err) {
      console.error('Assign error:', err);
      alert('Failed to assign worker');
    }
    setActionLoading(null);
  };

  // Release worker from assignment
  const handleRelease = async (assignmentId) => {
    if (!confirm('Release this worker from their assignment?')) return;
    setActionLoading(assignmentId);
    try {
      const res = await fetch('/api/elogbook/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, action: 'release' }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssignments();
      } else {
        alert(data.message || 'Failed to release worker');
      }
    } catch (err) {
      console.error('Release error:', err);
    }
    setActionLoading(null);
  };

  // Group assignments by line
  const assignmentsByLine = {};
  lines.forEach((line) => {
    assignmentsByLine[line._id] = {
      line,
      workers: assignments.filter(
        (a) => a.lineId?._id === line._id && a.status === 'active'
      ),
    };
  });

  // Filter available workers by search
  const filteredWorkers = availableWorkers.filter((w) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.name?.toLowerCase().includes(term) ||
      w.username?.toLowerCase().includes(term) ||
      w.role?.toLowerCase().includes(term)
    );
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Worker Assignment
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </p>
          </div>
        </div>
      </div>

      {/* Plant Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
              <Factory className="w-3.5 h-3.5" /> Plant / Location
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              disabled={isPlantLocked}
              className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 ${isPlantLocked ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
            >
              <option value="">-- Select Plant --</option>
              {plants.map((plant) => (
                <option key={plant._id} value={plant._id}>
                  {plant.name} ({plant.code})
                  {plant.city ? ` — ${plant.city}` : ''}
                </option>
              ))}
            </select>
            {isPlantLocked && (
              <p className="text-[10px] text-amber-600 mt-1">🔒 Plant locked to your assigned location</p>
            )}
          </div>
        </div>
      </div>

      {!selectedPlantId ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Factory className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">Select a Plant</h3>
          <p className="text-sm text-gray-400">
            Choose a plant to manage worker assignments for today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Assignment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-20">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                <UserPlus className="w-4 h-4 text-indigo-500" />
                Assign Worker
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5" /> Select Line
                  </label>
                  <select
                    value={selectedLineId}
                    onChange={(e) => setSelectedLineId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option value="">-- Select Line --</option>
                    {lines.map((line) => (
                      <option key={String(line._id)} value={String(line._id)}>
                        Line {line.lineNumber}{line.name ? ` — ${line.name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Select Worker
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search workers..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    size={5}
                    className="w-full border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    {filteredWorkers.map((worker) => (
                      <option
                        key={String(worker._id)}
                        value={String(worker._id)}
                        className="px-3 py-2"
                      >
                        {worker.name} {worker.username ? `(@${worker.username})` : ''}
                        {' '}({worker.role})
                        {worker.isBusy ? ' — 🔴 Busy' : ''}
                        {worker.isAssigned ? ' — 📌 Assigned' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAssign}
                  disabled={actionLoading === 'assign' || !selectedLineId || !selectedWorkerId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'assign' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  Assign Worker to Line
                </button>
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Assigned to a line
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Busy (active basket)
                </div>
              </div>
            </div>
          </div>

          {/* Right: Line Assignments Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-indigo-500" />
              Line Assignments — Today
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {lines.map((line) => {
                  const lineAssign = assignmentsByLine[line._id];
                  const workers = lineAssign?.workers || [];

                  return (
                    <div
                      key={line._id}
                      className={`bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                        workers.length > 0
                          ? 'border-indigo-200 shadow-sm'
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                              workers.length > 0
                                ? 'bg-gradient-to-br from-indigo-500 to-blue-500'
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                            }`}
                          >
                            {line.lineNumber}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              Line {line.lineNumber}
                              {line.name ? ` — ${line.name}` : ''}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {workers.length} worker{workers.length !== 1 ? 's' : ''} assigned
                            </p>
                          </div>
                        </div>
                        {workers.length > 0 && (
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                            Active
                          </span>
                        )}
                      </div>

                      {workers.length === 0 ? (
                        <div className="text-sm text-gray-400 bg-gray-50 rounded-xl p-3 text-center">
                          No workers assigned to this line today
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {workers.map((assignment) => (
                            <div
                              key={assignment._id}
                              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                  {assignment.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {assignment.userId?.name} {assignment.userId?.username ? `(@${assignment.userId?.username})` : ''}
                                  </div>
                                  <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <span className="capitalize">{assignment.userId?.role}</span>
                                    {assignment.assignedBy && (
                                      <>
                                        <span>•</span>
                                        <span>By: {assignment.assignedBy.name} {assignment.assignedBy.username ? `(@${assignment.assignedBy.username})` : ''}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRelease(assignment._id)}
                                disabled={actionLoading === assignment._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
                              >
                                {actionLoading === assignment._id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <UserMinus className="w-3 h-3" />
                                )}
                                Release
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
