/**
 * Production Line API service — all line-related fetch calls.
 */

/**
 * Fetch lines for a plant (or all lines for a company).
 */
export async function fetchLines(companyId, plantId) {
  if (!companyId) return { success: false, data: [] };
  let url = `/api/elogbook/lines?companyId=${companyId}`;
  if (plantId) url += `&plantId=${plantId}`;
  const res = await fetch(url);
  return res.json();
}

/**
 * Create a new production line.
 */
export async function createLine(payload) {
  const res = await fetch('/api/elogbook/lines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Update a production line.
 */
export async function updateLine(id, payload) {
  const res = await fetch(`/api/elogbook/lines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Delete (soft-delete) a production line.
 */
export async function deleteLine(id) {
  const res = await fetch(`/api/elogbook/lines/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
