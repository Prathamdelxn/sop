/**
 * Report API service — fetches aggregated report data.
 */

/**
 * Fetch report data with optional filters.
 */
export async function fetchReportData({ companyId, startDate, endDate, masterDataId, customerName, plantId, lineId }) {
  if (!companyId) return { success: false };

  let url = `/api/elogbook/reports?companyId=${companyId}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  if (masterDataId) url += `&masterDataId=${masterDataId}`;
  if (customerName) url += `&customerName=${encodeURIComponent(customerName)}`;
  if (plantId) url += `&plantId=${plantId}`;
  if (lineId) url += `&lineId=${lineId}`;

  const res = await fetch(url);
  return res.json();
}

/**
 * Send report PDF via email using FormData (better for large files).
 */
export async function emailReport({ email, pdfBlob, filename, subject }) {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('pdf', pdfBlob, filename);
    formData.append('filename', filename);
    formData.append('subject', subject);

    const res = await fetch('/api/elogbook/reports/email', {
      method: 'POST',
      // Note: We don't set Content-Type header here; 
      // the browser will automatically set it to multipart/form-data with a boundary.
      body: formData,
    });
    return res.json();
  } catch (err) {
    console.error('Email report service error:', err);
    return { success: false, message: 'Network error occurred' };
  }
}
