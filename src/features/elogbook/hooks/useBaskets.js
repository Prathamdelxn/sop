'use client';

import { useState, useEffect, useCallback } from 'react';
import * as basketService from '../services/basketService';

/**
 * Hook encapsulating basket state management and API interactions.
 * Used by Production page.
 */
export function useBaskets({ companyId, plantId, lineId, masterDataId, batchId }) {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [summary, setSummary] = useState({
    totalBaskets: 0,
    completedBaskets: 0,
    inProgressBaskets: 0,
    stoppedBaskets: 0,
    avgCycleTime: 0,
    totalLostTime: 0,
  });

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!companyId) return;
    if (!isRefresh) setLoading(true);
    try {
      const data = await basketService.fetchBaskets({
        companyId,
        masterDataId: masterDataId?._id || masterDataId,
        batchId: batchId?._id || batchId,
        plantId,
        lineId,
      });
      if (data.success) setBaskets(data.data);
    } catch (err) {
      console.error('Fetch baskets error:', err);
    }
    if (!isRefresh) setLoading(false);
  }, [companyId, plantId, lineId, masterDataId, batchId]);

  // Calculate summary statistics when baskets change
  useEffect(() => {
    const completed = baskets.filter(
      (b) => b.status === 'completed' || b.status === 'qc-done' || b.status === 'pending-qc'
    );
    const inProgress = baskets.filter((b) => b.status === 'in-progress');
    const stopped = baskets.filter((b) => b.status === 'stopped');

    const totalCycleTime = completed.reduce((sum, b) => sum + (b.actualCycleTime || 0), 0);
    const avgTime = completed.length > 0 ? totalCycleTime / completed.length : 0;
    const totalLost = baskets.reduce((sum, b) => sum + (b.totalLostTime || 0), 0);

    setSummary({
      totalBaskets: baskets.length,
      completedBaskets: completed.length,
      inProgressBaskets: inProgress.length,
      stoppedBaskets: stopped.length,
      avgCycleTime: avgTime,
      totalLostTime: totalLost,
    });
  }, [baskets]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartBasket = async ({ startBasketNumber, barcode, startUser, additionalUsers }) => {
    if (!masterDataId || !startBasketNumber) return false;
    setActionLoading('start');
    try {
      const mdId = masterDataId?._id || masterDataId;
      const bId = batchId?._id || batchId;
      const data = await basketService.startBasket({
        companyId,
        masterDataId: mdId,
        batchId: bId,
        plantId,
        lineId,
        basketNumber: Number(startBasketNumber),
        barcode,
        startUser,
        additionalUsers,
      });
      if (data.success) {
        await fetchData(true);
        setActionLoading(null);
        return true;
      }
    } catch (err) {
      console.error('Start basket error:', err);
    }
    setActionLoading(null);
    return false;
  };

  const handleStopBasket = async (basketId, reason) => {
    setActionLoading(basketId);
    try {
      await basketService.stopBasket(basketId, reason);
      await fetchData(true);
    } catch (err) {
      console.error('Stop error:', err);
    }
    setActionLoading(null);
  };

  const handleRestartBasket = async (basketId) => {
    setActionLoading(basketId);
    try {
      await basketService.restartBasket(basketId);
      await fetchData(true);
    } catch (err) {
      console.error('Restart error:', err);
    }
    setActionLoading(null);
  };

  const handleEndBasket = async (basketId, endUser) => {
    setActionLoading(basketId);
    try {
      const result = await basketService.endBasket(basketId, endUser);
      if (result.calculation) {
        console.log('Calculation details:', result.calculation);
      }
      await fetchData(true);
    } catch (err) {
      console.error('End error:', err);
    }
    setActionLoading(null);
  };

  return {
    baskets,
    loading,
    actionLoading,
    summary,
    refetch: fetchData,
    handleStartBasket,
    handleStopBasket,
    handleRestartBasket,
    handleEndBasket,
  };
}
