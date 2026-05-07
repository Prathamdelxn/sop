'use client';

import { useState, useCallback, useEffect } from 'react';
import * as batchService from '../services/batchService';

/**
 * Hook encapsulating batch state management.
 * Used by Production page.
 */
export function useBatches({ companyId, plantId, lineId }, masterDataId = null) {
  const [activeBatch, setActiveBatch] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchActiveBatch = useCallback(async (mdId) => {
    const targetMdId = mdId || masterDataId;
    if (!companyId || !targetMdId) return;
    try {
      const data = await batchService.fetchActiveBatch(companyId, targetMdId, plantId, lineId);
      if (data.success) {
        setActiveBatch(data.data);
      }
    } catch (err) {
      console.error('Fetch active batch error:', err);
    }
  }, [companyId, plantId, lineId, masterDataId]);

  // Real-time synchronization logic
  useEffect(() => {
    if (!companyId || !lineId || !masterDataId) return;

    // Use EventSource for real-time notifications
    const eventSource = new EventSource(`/api/elogbook/events?lineId=${lineId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'BATCH_UPDATED') {
          console.log('Real-time refresh triggered for batch');
          fetchActiveBatch(masterDataId);
        }
      } catch (err) {
        // Heartbeat or other non-JSON messages
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [companyId, lineId, masterDataId, fetchActiveBatch]);

  const handleStartBatch = async ({ masterDataId, startUser }) => {
    if (!masterDataId) return false;
    setActionLoading('batch');
    try {
      const data = await batchService.startBatch({
        companyId,
        masterDataId,
        startUser,
        plantId: plantId || null,
        lineId: lineId || null,
      });
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
