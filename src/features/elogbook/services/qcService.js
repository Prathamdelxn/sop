/**
 * QC API service — all quality-control-related fetch calls.
 */

/**
 * Fetch QC records for a company.
 */
export async function fetchQCRecords(companyId) {
  if (!companyId) return { success: false, data: [] };

  const res = await fetch(`/api/elogbook/qc?companyId=${companyId}`);
  return res.json();
}

/**
 * Submit a QC inspection (create or increment).
 */
export async function submitQCInspection({
  basketId, companyId, inspectorName, inspectedQuantity, goodQuantity, defects,
}) {
  const res = await fetch('/api/elogbook/qc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      basketId,
      companyId,
      inspectorName,
      inspectedQuantity: Number(inspectedQuantity),
      goodQuantity: Number(goodQuantity) || 0,
      defects,
    }),
  });
  return res.json();
}

/**
 * Update rework result for a QC record.
 */
export async function updateRework(qcId, { reworkPassedQuantity, permanentRejections }) {
  const res = await fetch(`/api/elogbook/qc/${qcId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reworkPassedQuantity: Number(reworkPassedQuantity) || 0,
      permanentRejections: Number(permanentRejections) || 0,
    }),
  });
  return res.json();
}
