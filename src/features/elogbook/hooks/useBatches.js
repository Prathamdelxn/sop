'use client';

import { useState, useCallback, useEffect } from 'react';
import * as batchService from '../services/batchService';
import { io } from 'socket.io-client';

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
    if (!companyId || !lineId) return;

    // Use Custom WebSocket for real-time notifications
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (!wsUrl) return;

    const socket = io(wsUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('join-line', lineId);
    });

    socket.on('refresh', (data) => {
      if (data.type === 'BATCH_UPDATED') {
        console.log('Real-time refresh triggered for batch via WebSocket');
        fetchActiveBatch(masterDataId);
      }
    });

    return () => {
      socket.disconnect();
    };
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
