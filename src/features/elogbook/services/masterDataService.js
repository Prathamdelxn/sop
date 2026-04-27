/**
 * Master Data API service — all master-data-related fetch calls.
 */

/**
 * Fetch all master data records for a company.
 */
export async function fetchMasterData(companyId) {
  if (!companyId) return { success: false, data: [] };

  const res = await fetch(`/api/elogbook/master-data?companyId=${companyId}`);
  return res.json();
}

/**
 * Create a new master data record.
 */
export async function createMasterData(payload) {
  const res = await fetch('/api/elogbook/master-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Update an existing master data record.
 */
export async function updateMasterData(id, payload) {
  const res = await fetch(`/api/elogbook/master-data/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Delete a master data record.
 */
export async function deleteMasterData(id) {
  const res = await fetch(`/api/elogbook/master-data/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
