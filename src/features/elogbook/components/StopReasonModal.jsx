'use client';

import React from 'react';
import { Pause, X } from 'lucide-react';
import { STOP_REASONS } from '../utils/constants';

/**
 * StopReasonModal — Modal for logging a stoppage reason.
 */
export default function StopReasonModal({
  show,
  onClose,
  stopReason,
  setStopReason,
  onSubmit,
}) {
  const [isOther, setIsOther] = React.useState(false);

  // Reset local "Other" state when modal opens/closes
  React.useEffect(() => {
    if (!show) {
      setIsOther(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Log Stoppage Reason
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Reason for Stoppage
          </label>
          <select
            value={isOther ? 'Other' : stopReason}
            onChange={(e) => {
              if (e.target.value === 'Other') {
                setIsOther(true);
                setStopReason('');
              } else {
                setIsOther(false);
                setStopReason(e.target.value);
              }
            }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
          >
            <option value="">Select a reason...</option>
            {STOP_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          {isOther && (
            <input
              type="text"
              autoFocus
              value={stopReason}
              placeholder="Describe reason..."
              onChange={(e) => setStopReason(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
            />
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-200 hover:shadow-xl transition-all active:scale-95"
          >
            <Pause className="w-4 h-4" /> Log Stoppage
          </button>
        </div>
      </div>
    </div>
  );
}
