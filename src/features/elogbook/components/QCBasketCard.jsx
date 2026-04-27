'use client';

import { CheckCircle2, AlertTriangle, Save, Loader2, Info, ClipboardCheck, ChevronUp } from 'lucide-react';
import LiveTimer from './LiveTimer';
import { formatTimeToMMSS } from '../utils/formatters';
import { getStatusColor, getStatusLabel } from '../utils/statusHelpers';
import { DEFECT_TYPES } from '../utils/constants';

/**
 * QCBasketCard — A basket card in the QC pending view with inline inspection form.
 */
export default function QCBasketCard({
  basket, form, qcRecords, saving, activeQCForm, directBasketId,
  onToggleForm, onUpdateForm, onUpdateDefect, onSubmitQC,
}) {
  const existingQC = qcRecords.find(r => r.basketId?._id === basket._id);
  const checkedSoFar = existingQC ? (existingQC.goodQuantity + existingQC.reworkQuantity) : 0;
  const inspectedQty = basket.masterDataId?.partsPerBasket || 0;
  const remaining = inspectedQty - checkedSoFar;

  const incomingGood = Number(form.goodQuantity) || 0;
  const incomingDefects = Object.values(form.defects).reduce((sum, v) => sum + v, 0);
  const incomingTotal = incomingGood + incomingDefects;

  const standard = basket.masterDataId?.standardCycleTime || 0;
  const isActive = basket.status === 'in-progress' || basket.status === 'stopped';
  const isOver = basket.actualCycleTime > standard && !isActive;
  const isFormOpen = activeQCForm === basket._id;

  return (
    <div
      id={`basket-${basket._id}`}
      className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col ${
        directBasketId === basket._id ? 'ring-2 ring-indigo-500 border-transparent shadow-lg scale-[1.01]' :
        basket.status === 'in-progress' ? 'border-emerald-200 shadow-md shadow-emerald-50' :
        basket.status === 'stopped' ? 'border-amber-200 shadow-md shadow-amber-50' :
        isOver ? 'border-red-200' : 'border-gray-100'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
              basket.status === 'in-progress' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
              basket.status === 'stopped' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
              'bg-gradient-to-br from-indigo-500 to-blue-500'
            }`}>{basket.basketNumber}</div>
            <div>
              <h3 className="font-bold text-gray-900">Basket {basket.basketNumber}</h3>
              <p className="text-xs text-gray-400">{basket.masterDataId?.partName}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(basket.status)}`}>
            {getStatusLabel(basket.status)}
          </span>
        </div>

        {/* Timer / Cycle Info */}
        {isActive ? (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Live Cycle Time</div>
            <LiveTimer startTime={basket.startTime} stoppages={basket.stoppages} isPaused={basket.status === 'stopped'} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Actual</div>
              <div className={`text-sm font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>{formatTimeToMMSS(basket.actualCycleTime)}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Standard</div>
              <div className="text-sm font-bold text-blue-600">{formatTimeToMMSS(standard)}</div>
            </div>
          </div>
        )}

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-gray-400">Started</span>
            <span className="font-medium text-gray-600">{basket.startTime ? new Date(basket.startTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Operator</span>
            <span className="font-medium text-gray-600">{basket.startUser || '—'}</span>
          </div>
        </div>
      </div>

      {/* QC Action Area */}
      <div className="flex-1 p-5 flex flex-col">
        <button
          onClick={() => onToggleForm(basket._id)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-sm mb-4 ${
            isFormOpen ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
          {isFormOpen ? 'Hide Inspection Form' : 'Perform QC'}
        </button>

        {isFormOpen && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {checkedSoFar > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="text-[9px] text-indigo-600 font-bold uppercase mb-0.5">Checked</div>
                  <div className="text-sm font-bold text-indigo-700">{checkedSoFar}/{inspectedQty}</div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="text-[9px] text-emerald-600 font-bold uppercase mb-0.5">Remaining</div>
                  <div className="text-sm font-bold text-emerald-700">{remaining}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Good Qty
                </label>
                <input type="number" value={form.goodQuantity} placeholder="0"
                  onChange={e => onUpdateForm(basket._id, 'goodQuantity', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> Defect Qty
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-500">{incomingDefects}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEFECT_TYPES.map(defect => (
                <div key={defect.key} className="bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-between gap-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase truncate">{defect.label}</label>
                  <input type="number" min="0" value={form.defects[defect.key]}
                    onChange={e => onUpdateDefect(basket._id, defect.key, e.target.value)}
                    className="w-12 px-1 py-1 border border-gray-100 bg-gray-50 rounded text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10" />
                </div>
              ))}
            </div>

            <button onClick={() => onSubmitQC(basket)}
              disabled={saving === basket._id || incomingTotal === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50">
              {saving === basket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {checkedSoFar + incomingTotal >= inspectedQty ? 'Finalize QC' : 'Save Progress'}
            </button>
          </div>
        )}

        {!isFormOpen && (
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-gray-400">
              <Info className="w-3 h-3" />
              <span>Total parts to inspect: <strong>{inspectedQty}</strong></span>
            </div>
            {checkedSoFar > 0 && (
              <div className="text-indigo-600 font-bold">{Math.round((checkedSoFar / inspectedQty) * 100)}% Checked</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
