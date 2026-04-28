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

  const getFormForBasket = (basketId) => {
    return formData[basketId] || createEmptyQCForm();
  };

  const updateForm = (basketId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [basketId]: {
        ...getFormForBasket(basketId),
        [field]: value,
      },
    }));
  };

  const updateDefect = (basketId, defectKey, value) => {
    const current = getFormForBasket(basketId);
    setFormData((prev) => ({
      ...prev,
      [basketId]: {
        ...current,
        defects: { ...current.defects, [defectKey]: Number(value) || 0 },
      },
    }));
  };

  const clearForm = (basketId) => {
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy[basketId];
      return copy;
    });
  };

  // --- Actions ---

  const handleSubmitQC = async (basket, inspectorName) => {
    const basketId = basket._id;
    const form = getFormForBasket(basketId);
    const inspectedQty = basket.masterDataId?.partsPerBasket;

    if (!inspectedQty) {
      alert('Inspected quantity is missing from master data');
      return false;
    }

    const totalNew =
      Number(form.goodQuantity || 0) +
      Object.values(form.defects).reduce((s, v) => s + (Number(v) || 0), 0);

    if (totalNew <= 0) {
      alert('Please enter at least one Good or Defective part.');
      return false;
    }

    // Check capacity
    const existing = qcRecords.find((r) => r.basketId?._id === basketId);
    const checkedSoFar = existing ? existing.goodQuantity + existing.reworkQuantity : 0;
    if (checkedSoFar + totalNew > inspectedQty) {
      alert(
        `Cannot save: Entering ${totalNew} parts would exceed basket capacity (${inspectedQty}). Only ${inspectedQty - checkedSoFar} parts remaining.`
      );
      return false;
    }

    setSaving(basketId);
    try {
      const data = await qcService.submitQCInspection({
        basketId,
        companyId,
        inspectorName,
        inspectedQuantity: inspectedQty,
        goodQuantity: Number(form.goodQuantity) || 0,
        defects: form.defects,
      });

      if (data.success) {
        clearForm(basketId);
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
