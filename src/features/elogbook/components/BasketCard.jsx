'use client';

import {
  Pause, RotateCcw, CheckCircle2, Loader2, ClipboardCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import LiveTimer from './LiveTimer';
import { formatTimeToMMSS } from '../utils/formatters';
import { getStatusColor, getStatusLabel } from '../utils/statusHelpers';

/**
 * BasketCard — Renders a single basket card in the production grid.
 * Extracted from the 939-line production/page.jsx.
 */
export default function BasketCard({
  basket,
  currentUser,
  actionLoading,
  canDoQC,
  onStop,
  onRestart,
  onEnd,
}) {
  const router = useRouter();
  const standard = basket.masterDataId?.standardCycleTime || 0;
  const isOver =
    basket.actualCycleTime > standard &&
    basket.status !== 'in-progress' &&
    basket.status !== 'stopped';
  const isActive = basket.status === 'in-progress' || basket.status === 'stopped';

  // Exclusive control logic
  const isOperator = !basket.currentOperator || currentUser === basket.currentOperator;
  const showLock = basket.status === 'in-progress' && !isOperator;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
        basket.status === 'in-progress'
          ? 'border-emerald-200 shadow-md shadow-emerald-50'
          : basket.status === 'stopped'
            ? 'border-amber-200 shadow-md shadow-amber-50'
            : isOver
              ? 'border-red-200'
              : 'border-gray-100'
      }`}
    >
      {showLock && (
        <div className="absolute top-0 right-0 p-1.5 bg-amber-500 text-white rounded-bl-xl shadow-sm z-10 animate-in fade-in slide-in-from-top-2 duration-500">
          <Pause className="w-3 h-3" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
              basket.status === 'in-progress'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                : basket.status === 'stopped'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}
          >
            {basket.basketNumber}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Basket {basket.basketNumber}
            </h3>
            <p className="text-xs text-gray-400">
              {basket.masterDataId?.customerName} -{' '}
              {basket.masterDataId?.partName}
            </p>
            {basket.batchId?.batchNumber && (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold mt-0.5">
                #{basket.batchId.batchNumber}
              </span>
            )}
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
            basket.status
          )}`}
        >
          {getStatusLabel(basket.status)}
        </span>
      </div>

      {/* Timer for active baskets */}
      {isActive && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500 mb-1 font-medium">
            Effective Cycle Time
          </div>
          <LiveTimer
            startTime={basket.startTime}
            stoppages={basket.stoppages}
            isPaused={basket.status === 'stopped'}
          />
        </div>
      )}

      {/* Completed stats */}
      {!isActive && basket.actualCycleTime > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">Actual Time</div>
              <div
                className={`text-lg font-bold ${
                  isOver ? 'text-red-600' : 'text-emerald-600'
                }`}
              >
                {formatTimeToMMSS(basket.actualCycleTime)}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                ({basket.actualCycleTime.toFixed(2)} min)
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Standard</div>
              <div className="text-lg font-bold text-blue-600">
                {formatTimeToMMSS(standard)}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                ({standard.toFixed(2)} min)
              </div>
            </div>
            {basket.totalLostTime > 0 && (
              <div className="col-span-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">Total Lost Time</div>
                  <div className="text-sm font-bold text-red-500">
                    {formatTimeToMMSS(basket.totalLostTime)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {basket.stoppages?.length || 0} stoppage
                  {basket.stoppages?.length !== 1 ? 's' : ''}
                </div>
                {basket.stoppages?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {basket.stoppages.map((s, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-500 flex justify-between items-center"
                      >
                        <span>• {s.reason || 'No reason'}</span>
                        <span className="font-medium text-red-500">
                          {s.lostMinutes
                            ? formatTimeToMMSS(s.lostMinutes)
                            : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {basket.executionReason && (
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Variance Reason</div>
                <div className="px-2.5 py-1.5 bg-indigo-50/50 rounded-lg border border-indigo-100/50 text-xs text-indigo-700 font-medium italic">
                  "{basket.executionReason}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps & Roles */}
      <div className="space-y-1.5 mb-4 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Started</span>
          <span className="font-medium text-gray-600">
            {basket.startTime
              ? new Date(basket.startTime).toLocaleString()
              : '—'}
          </span>
        </div>
        
        {/* Execution Roles */}
        <div className="pt-1 mt-1 border-t border-gray-50">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Execution by</span>
              <span className="font-bold text-indigo-600 text-right max-w-[150px]">
                {basket.executors?.length > 0 
                  ? basket.executors.join(", ") 
                  : basket.startUser || '—'}
              </span>
            </div>
            {basket.supporters?.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Supported by</span>
                <span className="font-medium text-gray-500 text-right max-w-[150px]">
                  {basket.supporters.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {basket.endTime && (
          <div className="flex justify-between pt-1">
            <span className="text-gray-400">Ended</span>
            <span className="font-medium text-gray-600">
              {new Date(basket.endTime).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isActive && (
        <div className="flex gap-2">
          {basket.status === 'in-progress' ? (
            <>
              <button
                onClick={() => onStop(basket._id)}
                disabled={actionLoading === basket._id || !isOperator}
                title={!isOperator ? `Only ${basket.currentOperator} can pause` : ''}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === basket._id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
                Pause
              </button>
              <button
                onClick={() => onEnd(basket._id)}
                disabled={actionLoading === basket._id || !isOperator}
                title={!isOperator ? `Only ${basket.currentOperator} can end` : ''}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === basket._id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                End
              </button>
            </>
          ) : (
            <button
              onClick={() => onRestart(basket._id)}
              disabled={actionLoading === basket._id}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-all active:scale-95"
            >
              {actionLoading === basket._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Restart
            </button>
          )}
        </div>
      )}

      {['pending-qc', 'in-progress'].includes(basket.status) && canDoQC && (
        <button
          onClick={() =>
            router.push(`/dashboard/elogbook/qc?basketId=${basket._id}`)
          }
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
        >
          <ClipboardCheck className="w-3.5 h-3.5" /> Perform Quality Check
        </button>
      )}
    </div>
  );
}
