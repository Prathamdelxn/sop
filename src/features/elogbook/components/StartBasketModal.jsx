import React, { useState, useEffect } from 'react';
import { X, Loader2, Play, Plus, Trash2 } from 'lucide-react';

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
  selectedCustomer,
  masterDataList = [],
  onStart,
  loading,
}) {
  const [basketItems, setBasketItems] = useState([]);

  useEffect(() => {
    if (show) {
      if (selectedMasterData) {
        setBasketItems([{
          masterDataId: selectedMasterData._id,
          partName: selectedMasterData.partName,
          quantity: selectedMasterData.partsPerBasket || 0
        }]);
      } else {
        // Start with one empty slot if no part is selected on the dashboard
        setBasketItems([{ masterDataId: '', partName: '', quantity: 0 }]);
      }
    }
  }, [show, selectedMasterData]);

  const handleAddItem = () => {
    setBasketItems([...basketItems, { masterDataId: '', partName: '', quantity: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setBasketItems(basketItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...basketItems];
    if (field === 'masterDataId') {
      const part = masterDataList.find(m => m._id === value);
      updated[index] = {
        ...updated[index],
        masterDataId: value,
        partName: part ? part.partName : '',
        quantity: part ? part.partsPerBasket : 0
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setBasketItems(updated);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Start New Basket</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
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
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Main Operator
              </label>
              <input
                type="text"
                value={userData?.name || userData?.username || ''}
                disabled
                className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Parts in Basket
              </label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-colors uppercase tracking-widest"
              >
                <Plus className="w-3 h-3" /> Add Part
              </button>
            </div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {basketItems.map((item, idx) => (
                <div key={idx} className="flex items-end gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tight">Select Part</label>
                    <select
                      value={item.masterDataId}
                      onChange={(e) => handleItemChange(idx, 'masterDataId', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">-- Choose Part --</option>
                      {masterDataList
                        .filter(m => m.customerName === selectedCustomer || m.customerName === selectedMasterData?.customerName)
                        .filter(m => !basketItems.some((bi, bidx) => bidx !== idx && bi.masterDataId === m._id))
                        .map(m => (
                          <option key={m._id} value={m._id}>{m.partName}</option>
                        ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tight">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  {basketItems.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {basketItems.length === 0 && (
                <div className="text-center py-4 text-xs text-gray-400 italic">No parts added. Add at least one part.</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
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
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onStart(basketItems)}
            disabled={loading || basketItems.length === 0 || basketItems.some(it => !it.masterDataId)}
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
