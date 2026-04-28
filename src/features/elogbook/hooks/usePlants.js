'use client';

import { useState, useCallback } from 'react';
import * as plantService from '../services/plantService';

/**
 * Hook encapsulating plant state management.
 * Used by Master Data and Production pages.
 */
export function usePlants(companyId) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await plantService.fetchPlants(companyId);
      if (data.success) setPlants(data.data);
    } catch (err) {
      console.error('Fetch plants error:', err);
    }
    setLoading(false);
  }, [companyId]);

  const handleCreate = async (payload) => {
    const data = await plantService.createPlant({ ...payload, companyId });
    if (data.success) await fetchData();
    return data;
  };

  const handleUpdate = async (id, payload) => {
    const data = await plantService.updatePlant(id, payload);
    if (data.success) await fetchData();
    return data;
  };

  const handleDelete = async (id) => {
    const data = await plantService.deletePlant(id);
    if (data.success) await fetchData();
    return data;
  };

  return {
    plants,
    loading,
    refetch: fetchData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
