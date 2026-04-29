'use client';

import { useState, useCallback } from 'react';
import * as lineService from '../services/lineService';

/**
 * Hook encapsulating production line state management.
 * Used by Master Data and Production pages.
 */
export function useLines(companyId, plantId) {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await lineService.fetchLines(companyId, plantId);
      if (data.success) setLines(data.data);
    } catch (err) {
      console.error('Fetch lines error:', err);
    }
    setLoading(false);
  }, [companyId, plantId]);

  const handleCreate = async (payload) => {
    const data = await lineService.createLine({ ...payload, companyId });
    if (data.success) await fetchData();
    return data;
  };

  const handleUpdate = async (id, payload) => {
    const data = await lineService.updateLine(id, payload);
    if (data.success) await fetchData();
    return data;
  };

  const handleDelete = async (id) => {
    const data = await lineService.deleteLine(id);
    if (data.success) await fetchData();
    return data;
  };

  return {
    lines,
    loading,
    refetch: fetchData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
