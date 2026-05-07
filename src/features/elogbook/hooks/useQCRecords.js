'use client';

import { useState, useCallback } from 'react';
import * as qcService from '../services/qcService';
import { createEmptyQCForm } from '../utils/constants';

/**
 * Hook encapsulating QC records state management and form handling.
 * Used by QC page.
 */
export function useQCRecords(companyId, plantId, lineId) {
  const [qcRecords, setQCRecords] = useState([]);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(null);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    try {
      const data = await qcService.fetchQCRecords(companyId, plantId, lineId);
      if (data.success) setQCRecords(data.data);
    } catch (err) {
      console.error('Fetch QC records error:', err);
    }
  }, [companyId, plantId, lineId]);

  // --- Form helpers ---

  const getFormKey = (basketId, masterDataId) => `${basketId}_${masterDataId}`;

  const getFormForBasket = (basketId, masterDataId) => {
    const key = getFormKey(basketId, masterDataId);
    return formData[key] || createEmptyQCForm();
  };

  const updateForm = (basketId, masterDataId, field, value) => {
    const key = getFormKey(basketId, masterDataId);
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...getFormForBasket(basketId, masterDataId),
        [field]: value,
      },
    }));
  };

  const updateDefect = (basketId, masterDataId, defectKey, value) => {
    const key = getFormKey(basketId, masterDataId);
    const current = getFormForBasket(basketId, masterDataId);
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...current,
        defects: { ...current.defects, [defectKey]: Number(value) || 0 },
      },
    }));
  };

  const clearForm = (basketId, masterDataId) => {
    const key = getFormKey(basketId, masterDataId);
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // --- Actions ---

  const handleSubmitQC = async (basket, masterDataId, inspectorName) => {
    const basketId = basket._id;
    const form = getFormForBasket(basketId, masterDataId);
    
    // Find item quantity in basket
    const item = basket.items?.find(it => (it.masterDataId?._id || it.masterDataId).toString() === masterDataId.toString());
    const inspectedQty = item ? item.quantity : (basket.masterDataId?.partsPerBasket || 0);

    if (!inspectedQty) {
      alert('Inspected quantity is missing for this part');
      return false;
    }

    const totalNew =
      Number(form.goodQuantity || 0) +
      Object.values(form.defects).reduce((s, v) => s + (Number(v) || 0), 0);

    if (totalNew <= 0) {
      alert('Please enter at least one Good or Defective part.');
      return false;
    }

    // Check capacity for this specific item in this basket
    const existingQC = qcRecords.find((r) => r.basketId?._id === basketId);
    const existingItem = existingQC?.items?.find(it => (it.masterDataId?._id || it.masterDataId).toString() === masterDataId.toString());
    const checkedSoFar = existingItem ? existingItem.goodQuantity + existingItem.reworkQuantity : 0;
    
    if (checkedSoFar + totalNew > inspectedQty) {
      alert(
        `Cannot save: Entering ${totalNew} parts would exceed item capacity (${inspectedQty}). Only ${inspectedQty - checkedSoFar} parts remaining.`
      );
      return false;
    }

    setSaving(`${basketId}_${masterDataId}`);
    try {
      const data = await qcService.submitQCInspection({
        basketId,
        companyId,
        inspectorName,
        masterDataId,
        inspectedQuantity: inspectedQty, // Total for item in basket
        goodQuantity: Number(form.goodQuantity) || 0,
        defects: form.defects,
      });

      if (data.success) {
        clearForm(basketId, masterDataId);
        setSaving(null);
        return true;
      } else {
        alert(data.message || 'Failed to save QC data');
      }
    } catch (err) {
      console.error('Submit QC error:', err);
    }
    setSaving(null);
    return false;
  };

  const handleReworkUpdate = async (qcId, reworkPassedQty, permanentRej) => {
    setSaving(qcId);
    try {
      const data = await qcService.updateRework(qcId, {
        reworkPassedQuantity: reworkPassedQty,
        permanentRejections: permanentRej,
      });
      if (data.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Rework update error:', err);
    }
    setSaving(null);
  };

  // --- Derived data ---
  const reworkRecords = qcRecords.filter((qc) => qc.reworkStatus === 'pending');
  const completedRecords = qcRecords.filter((qc) => qc.reworkStatus !== 'pending');

  return {
    qcRecords,
    reworkRecords,
    completedRecords,
    formData,
    saving,
    refetch: fetchData,
    getFormForBasket,
    updateForm,
    updateDefect,
    handleSubmitQC,
    handleReworkUpdate,
  };
}
