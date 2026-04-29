/**
 * Plant API service — all plant-related fetch calls.
 */

/**
 * Fetch all plants for a company.
 */
export async function fetchPlants(companyId) {
  if (!companyId) return { success: false, data: [] };
  const res = await fetch(`/api/elogbook/plants?companyId=${companyId}`);
  return res.json();
}

/**
 * Create a new plant.
 */
export async function createPlant(payload) {
  const res = await fetch('/api/elogbook/plants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Update a plant.
 */
export async function updatePlant(id, payload) {
  const res = await fetch(`/api/elogbook/plants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Delete (soft-delete) a plant.
 */
export async function deletePlant(id) {
  const res = await fetch(`/api/elogbook/plants/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
