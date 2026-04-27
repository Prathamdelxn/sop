/**
 * Basket API service — all basket-related fetch calls.
 * Used by useBaskets hook and production/QC pages.
 */

/**
 * Fetch baskets with optional filters.
 */
export async function fetchBaskets({ companyId, masterDataId, batchId, status }) {
  if (!companyId) return { success: false, data: [] };

  let url = `/api/elogbook/baskets?companyId=${companyId}`;
  if (masterDataId) url += `&masterDataId=${masterDataId}`;
  if (batchId) url += `&batchId=${batchId}`;
  if (status) url += `&status=${status}`;

  const res = await fetch(url);
  return res.json();
}

/**
 * Start (create) a new basket.
 */
export async function startBasket({
  companyId, masterDataId, basketNumber, barcode, startUser, additionalUsers,
}) {
  const res = await fetch('/api/elogbook/baskets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyId,
      masterDataId,
      basketNumber: Number(basketNumber),
      barcode: barcode || `BASKET-${basketNumber}`,
      startUser,
      additionalUsers: additionalUsers
        ? additionalUsers.split(',').map((u) => u.trim())
        : [],
    }),
  });
  return res.json();
}

/**
 * Update a basket (stop, restart, end).
 */
export async function updateBasket(basketId, payload) {
  const res = await fetch(`/api/elogbook/baskets/${basketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Stop a basket with a reason.
 */
export async function stopBasket(basketId, reason) {
  return updateBasket(basketId, { action: 'stop', reason });
}

/**
 * Restart a stopped basket.
 */
export async function restartBasket(basketId) {
  return updateBasket(basketId, { action: 'restart' });
}

/**
 * End a basket cycle.
 */
export async function endBasket(basketId, endUser) {
  return updateBasket(basketId, { action: 'end', endUser });
}
