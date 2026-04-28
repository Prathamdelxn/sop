/**
 * Report API service — fetches aggregated report data.
 */

/**
 * Fetch report data with optional filters.
 */
export async function fetchReportData({ companyId, startDate, endDate, masterDataId, plantId, lineId }) {
  if (!companyId) return { success: false };

  let url = `/api/elogbook/reports?companyId=${companyId}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  if (masterDataId) url += `&masterDataId=${masterDataId}`;
  if (plantId) url += `&plantId=${plantId}`;
  if (lineId) url += `&lineId=${lineId}`;

  const res = await fetch(url);
  return res.json();
}
