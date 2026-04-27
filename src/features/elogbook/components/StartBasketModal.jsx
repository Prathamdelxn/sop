'use client';

import { X, Loader2, Play } from 'lucide-react';

/**
 * StartBasketModal — Modal for starting a new basket in production.
 */
export default function StartBasketModal({
  show,
  onClose,
  basketNumber,
  setBasketNumber,
  additionalUsers,
  setAdditionalUsers,
  userData,
  selectedMasterData,
  onStart,
  loading,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Start New Basket</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Basket Number *
            </label>
            <input
              type="number"
              value={basketNumber}
              onChange={(e) => setBasketNumber(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Operator
            </label>
            <input
              type="text"
              value={userData?.name || userData?.username || ''}
              disabled
              className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Additional Operators (comma-separated)
            </label>
            <input
              type="text"
              value={additionalUsers}
              onChange={(e) => setAdditionalUsers(e.target.value)}
              placeholder="e.g., Ravi, Amit, Priya"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div className="pt-2 p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Selected Configuration:</div>
            <div className="text-sm font-semibold text-gray-800">
              {selectedMasterData?.customerName} — {selectedMasterData?.partName}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Start Time:{' '}
              <span className="font-semibold text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Start Cycle
          </button>
        </div>
      </div>
    </div>
  );
}
