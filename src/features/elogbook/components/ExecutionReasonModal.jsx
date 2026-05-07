'use client';

import React from 'react';
import { CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { EXECUTION_REASONS } from '../utils/constants';

/**
 * ExecutionReasonModal — Modal for logging a reason when a basket ends 
 * before or after the standard time.
 */
export default function ExecutionReasonModal({
  show,
  onClose,
  reason,
  setReason,
  onSubmit,
  actualTime,
  standardTime,
}) {
  const [isOther, setIsOther] = React.useState(false);

  // Reset local "Other" state when modal opens/closes
  React.useEffect(() => {
    if (!show) {
      setIsOther(false);
    }
  }, [show]);

  if (!show) return null;

  const diff = actualTime - standardTime;
  const isEarly = diff < 0;
  const absDiff = Math.abs(diff).toFixed(2);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${isEarly ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isEarly ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Execution Variance
            </h2>
            <p className="text-sm text-gray-500">
              Cycle ended {isEarly ? 'early' : 'late'} by {absDiff} min
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actual Time</p>
              <p className={`text-lg font-bold ${isEarly ? 'text-emerald-600' : 'text-amber-600'}`}>{actualTime.toFixed(2)} min</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Standard Time</p>
              <p className="text-lg font-bold text-blue-600">{standardTime.toFixed(2)} min</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Reason for Variance
            </label>
            <select
              value={isOther ? 'Other' : reason}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setIsOther(true);
                  setReason('');
                } else {
                  setIsOther(false);
                  setReason(e.target.value);
                }
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
            >
              <option value="">Select a reason...</option>
              {EXECUTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            
            {isOther && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea
                  autoFocus
                  value={reason}
                  placeholder="Please provide a detailed reason..."
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[100px] resize-none transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!reason.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            <CheckCircle2 className="w-4 h-4" /> Save & End
          </button>
        </div>
      </div>
    </div>
  );
}
