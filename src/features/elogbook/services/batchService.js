/**
 * Batch API service — all batch-related fetch calls.
 */

/**
 * Fetch active batch for a given company and master data,
 * optionally scoped by plant and line.
 */
export async function fetchActiveBatch(companyId, masterDataId, plantId, lineId) {
  if (!companyId || !masterDataId) return { success: false, data: null };

  let url = `/api/elogbook/batches?companyId=${companyId}&masterDataId=${masterDataId}`;
  if (plantId) url += `&plantId=${plantId}`;
  if (lineId) url += `&lineId=${lineId}`;

  const res = await fetch(url);
  return res.json();
}

/**
 * Start a new production batch.
 */
export async function startBatch({ companyId, masterDataId, startUser, plantId, lineId }) {
  const res = await fetch('/api/elogbook/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId, masterDataId, startUser, plantId, lineId }),
  });
  return res.json();
}

/**
 * End a production batch.
 */
export async function endBatch(batchId, endUser) {
  const res = await fetch(`/api/elogbook/batches/${batchId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'end', endUser }),
  });
  return res.json();
}
