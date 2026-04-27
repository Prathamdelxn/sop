/**
 * Batch API service — all batch-related fetch calls.
 */

/**
 * Fetch active batch for a given company and master data.
 */
export async function fetchActiveBatch(companyId, masterDataId) {
  if (!companyId || !masterDataId) return { success: false, data: null };

  const res = await fetch(
    `/api/elogbook/batches?companyId=${companyId}&masterDataId=${masterDataId}`
  );
  return res.json();
}

/**
 * Start a new production batch.
 */
export async function startBatch({ companyId, masterDataId, startUser }) {
  const res = await fetch('/api/elogbook/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId, masterDataId, startUser }),
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
