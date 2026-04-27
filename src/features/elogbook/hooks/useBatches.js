'use client';

import { useState, useCallback } from 'react';
import * as batchService from '../services/batchService';

/**
 * Hook encapsulating batch state management.
 * Used by Production page.
 */
export function useBatches({ companyId }) {
  const [activeBatch, setActiveBatch] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchActiveBatch = useCallback(async (masterDataId) => {
    if (!companyId || !masterDataId) return;
    try {
      const data = await batchService.fetchActiveBatch(companyId, masterDataId);
      if (data.success) {
        setActiveBatch(data.data);
      }
    } catch (err) {
      console.error('Fetch active batch error:', err);
    }
  }, [companyId]);

  const handleStartBatch = async ({ masterDataId, startUser }) => {
    if (!masterDataId) return false;
    setActionLoading('batch');
    try {
      const data = await batchService.startBatch({ companyId, masterDataId, startUser });
      if (data.success) {
        setActiveBatch(data.data);
        setActionLoading(null);
        return true;
      } else {
        alert(data.message || 'Failed to start batch');
      }
    } catch (err) {
      console.error('Start batch error:', err);
    }
    setActionLoading(null);
    return false;
  };

  const handleEndBatch = async (endUser, hasActiveBaskets) => {
    if (!activeBatch) return false;
    if (hasActiveBaskets) {
      alert('Please end all active baskets before ending the batch.');
      return false;
    }
    setActionLoading('batch');
    try {
      const data = await batchService.endBatch(activeBatch._id, endUser);
      if (data.success) {
        setActiveBatch(null);
        setActionLoading(null);
        return true;
      }
    } catch (err) {
      console.error('End batch error:', err);
    }
    setActionLoading(null);
    return false;
  };

  return {
    activeBatch,
    setActiveBatch,
    batchActionLoading: actionLoading,
    fetchActiveBatch,
    handleStartBatch,
    handleEndBatch,
  };
}
