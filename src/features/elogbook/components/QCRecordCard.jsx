'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';
import { DEFECT_TYPES } from '../utils/constants';

export default function QCRecordCard({ qc, saving, onReworkUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const basketInfo = qc.basketId;
  const needsRework = qc.reworkStatus === 'pending';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${needsRework ? 'border-amber-200' : 'border-gray-100'}`}>
      <button onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${needsRework ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}>
            {basketInfo?.basketNumber || '?'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Basket {basketInfo?.basketNumber}
              {needsRework && <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Rework Pending</span>}
            </h3>
            <p className="text-xs text-gray-500">
              Part: {basketInfo?.masterDataId?.partName} | Inspector: {qc.inspectorName} | {new Date(qc.inspectionDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-emerald-600">{qc.finalGoodQuantity} good</div>
            <div className="text-xs text-gray-400">of {qc.inspectedQuantity} inspected</div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl"><div className="text-xs text-blue-600 font-medium">Inspected</div><div className="text-lg font-bold text-blue-800">{qc.inspectedQuantity}</div></div>
            <div className="p-3 bg-emerald-50 rounded-xl"><div className="text-xs text-emerald-600 font-medium">Initial Good</div><div className="text-lg font-bold text-emerald-800">{qc.goodQuantity}</div></div>
            <div className="p-3 bg-amber-50 rounded-xl"><div className="text-xs text-amber-600 font-medium">Rework</div><div className="text-lg font-bold text-amber-800">{qc.reworkQuantity}</div></div>
            <div className="p-3 bg-purple-50 rounded-xl"><div className="text-xs text-purple-600 font-medium">Final Good (Invoice)</div><div className="text-lg font-bold text-purple-800">{qc.finalGoodQuantity}</div></div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Defects</h4>
            <div className="flex flex-wrap gap-2">
              {DEFECT_TYPES.map(d => (
                <div key={d.key} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
                  <span className="text-gray-500">{d.label}: </span>
                  <span className="font-bold text-gray-800">{qc.defects?.[d.key] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {needsRework && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Rework Result</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">Passed after rework (Max {qc.reworkQuantity})</label>
                  <input type="number" id={`rework-passed-${qc._id}`} defaultValue={0} min="0" max={qc.reworkQuantity}
                    onChange={(e) => {
                      let passed = parseInt(e.target.value) || 0;
                      if (passed > qc.reworkQuantity) { passed = qc.reworkQuantity; e.target.value = passed; }
                      else if (passed < 0) { passed = 0; e.target.value = passed; }
                      const rejectedEl = document.getElementById(`rework-rejected-${qc._id}`);
                      if (rejectedEl) rejectedEl.value = qc.reworkQuantity - passed;
                    }}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">Permanent Rejections</label>
                  <input type="number" id={`rework-rejected-${qc._id}`} defaultValue={qc.reworkQuantity} readOnly
                    className="w-full px-3 py-2 border border-amber-200 bg-amber-100/50 rounded-lg text-sm font-bold text-amber-900 cursor-not-allowed focus:outline-none" />
                </div>
              </div>
              <button
                onClick={() => {
                  const passed = parseInt(document.getElementById(`rework-passed-${qc._id}`)?.value) || 0;
                  const rejected = parseInt(document.getElementById(`rework-rejected-${qc._id}`)?.value) || 0;
                  if (passed < 0 || rejected < 0) { alert("Quantities cannot be negative."); return; }
                  if (passed + rejected !== qc.reworkQuantity) {
                    alert(`Invalid Rework Quantities!\n\nPassed (${passed}) + Rejected (${rejected}) = ${passed + rejected}\nMust equal total rework quantity: ${qc.reworkQuantity}`);
                    return;
                  }
                  onReworkUpdate(qc._id, passed, rejected);
                }}
                disabled={saving === qc._id}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-all active:scale-95 disabled:opacity-50">
                {saving === qc._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Complete Rework
              </button>
            </div>
          )}

          {qc.reworkStatus === 'completed' && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Rework Completed</h4>
              <div className="flex gap-4 text-sm">
                <span className="text-emerald-700">Passed: <strong>{qc.reworkPassedQuantity}</strong></span>
                <span className="text-red-600">Rejected: <strong>{qc.permanentRejections}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
