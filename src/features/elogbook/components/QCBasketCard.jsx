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
  basket, qcRecords, saving, activeQCForm, directBasketId, isLocked,
  onToggleForm, onUpdateForm, onUpdateDefect, onSubmitQC, getFormForBasket
}) {
  const items = (basket.items && basket.items.length > 0) 
    ? basket.items 
    : [{ masterDataId: basket.masterDataId, quantity: basket.masterDataId?.partsPerBasket || 0 }];

  const existingQC = qcRecords.find(r => r.basketId?._id === basket._id);
  
  const standard = basket.masterDataId?.standardCycleTime || 0;
  const isActive = basket.status === 'in-progress' || basket.status === 'stopped';
  const isOver = basket.actualCycleTime > standard && !isActive;

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
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs text-gray-400">
                  {items.length === 1 ? items[0].masterDataId?.partName : `${items.length} Part Types`}
                </p>
                {basket.batchId?.batchNumber && (
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                    #{basket.batchId.batchNumber}
                  </span>
                )}
              </div>
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
      <div className="flex-1 p-5 flex flex-col gap-4">
        {isLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">QC Interlock Active</p>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Please complete Quality Check for <strong>Basket {basket.basketNumber - 1}</strong> first.
              </p>
            </div>
          </div>
        )}

        {!isLocked && items.map((item, idx) => {
          const mId = item.masterDataId?._id || item.masterDataId;
          const formKey = `${basket._id}_${mId}`;
          const isFormOpen = activeQCForm === formKey;
          const form = getFormForBasket(basket._id, mId);
          
          const existingItem = existingQC?.items?.find(it => (it.masterDataId?._id || it.masterDataId).toString() === mId.toString());
          const checkedSoFar = existingItem ? (existingItem.goodQuantity + existingItem.reworkQuantity) : 0;
          const inspectedQty = item.quantity || 0;
          const remaining = inspectedQty - checkedSoFar;
          
          const incomingGood = Number(form.goodQuantity) || 0;
          const incomingDefects = Object.values(form.defects).reduce((sum, v) => sum + v, 0);
          const incomingTotal = incomingGood + incomingDefects;
          const isDone = checkedSoFar >= inspectedQty;

          return (
            <div key={`${mId}_${idx}`} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => !isDone && onToggleForm(formKey)}
                className={`w-full p-3 flex items-center justify-between transition-colors ${isDone ? 'bg-emerald-50/50 cursor-default' : 'hover:bg-gray-100'}`}
              >
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-800">{item.masterDataId?.partName || 'Part Type'}</div>
                  <div className="text-[10px] text-gray-400">Qty: {inspectedQty} | Checked: {checkedSoFar}</div>
                </div>
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-indigo-600">{Math.round((checkedSoFar/inspectedQty)*100)}%</span>
                       {isFormOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ClipboardCheck className="w-4 h-4 text-indigo-500" />}
                    </div>
                  )}
                </div>
              </button>

              {isFormOpen && (
                <div className="p-3 bg-white border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Good
                      </label>
                      <input type="number" value={form.goodQuantity} placeholder="0"
                        onChange={e => onUpdateForm(basket._id, mId, 'goodQuantity', e.target.value)}
                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-100 rounded text-xs focus:ring-1 focus:ring-emerald-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" /> Defects
                      </label>
                      <div className="px-2 py-1.5 bg-gray-100 border border-gray-100 rounded text-xs font-bold text-gray-500">{incomingDefects}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {DEFECT_TYPES.map(defect => (
                      <div key={defect.key} className="flex items-center justify-between gap-1 bg-gray-50 p-1.5 rounded border border-gray-100">
                        <label className="text-[8px] font-bold text-gray-400 uppercase truncate">{defect.label}</label>
                        <input type="number" min="0" value={form.defects[defect.key]}
                          onChange={e => onUpdateDefect(basket._id, mId, defect.key, e.target.value)}
                          className="w-10 px-1 py-0.5 border border-gray-200 bg-white rounded text-[10px] text-center font-bold" />
                      </div>
                    ))}
                  </div>

                  <button onClick={() => onSubmitQC(basket, mId)}
                    disabled={saving === formKey || incomingTotal === 0}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {saving === formKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {checkedSoFar + incomingTotal >= inspectedQty ? 'Finalize Part QC' : 'Save Progress'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
