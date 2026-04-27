/**
 * Report API service — fetch report data for charts and export.
 */

/**
 * Fetch aggregated report data.
 */
export async function fetchReportData({ companyId, startDate, endDate, masterDataId }) {
  if (!companyId) return { success: false, data: null };

  let url = `/api/elogbook/reports?companyId=${companyId}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  if (masterDataId) url += `&masterDataId=${masterDataId}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
