'use client';

import { useState, useCallback } from 'react';
import * as masterDataService from '../services/masterDataService';

/**
 * Hook encapsulating master data state management.
 * Used by Production and Master Data pages.
 */
export function useMasterData(companyId) {
  const [masterDataList, setMasterDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await masterDataService.fetchMasterData(companyId);
      if (data.success) setMasterDataList(data.data);
    } catch (err) {
      console.error('Fetch master data error:', err);
    }
    setLoading(false);
  }, [companyId]);

  const handleCreate = async (payload) => {
    const data = await masterDataService.createMasterData({
      ...payload,
      companyId,
    });
    if (data.success) await fetchData();
    return data;
  };

  const handleUpdate = async (id, payload) => {
    const data = await masterDataService.updateMasterData(id, {
      ...payload,
      companyId,
    });
    if (data.success) await fetchData();
    return data;
  };

  const handleDelete = async (id) => {
    const data = await masterDataService.deleteMasterData(id);
    if (data.success) await fetchData();
    return data;
  };

  // Extract unique customers from master data
  const customers = [...new Map(
    masterDataList.map((md) => [
      md.customerName,
      { customerName: md.customerName, subCompany: md.subCompany },
    ])
  ).values()];

  return {
    masterDataList,
    customers,
    loading,
    refetch: fetchData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
