/**
 * Time formatting utilities for E-Logbook feature.
 * Single source of truth — used across Production, QC, Reports pages.
 */

/**
 * Format minutes to "Xm Xs" display string.
 * @param {number} minutes - Time in minutes (can be fractional)
 * @returns {string} Formatted string like "7m 30s"
 */
export const formatTimeToMMSS = (minutes) => {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}m ${secs}s`;
};

/**
 * Format seconds to "HH:MM:SS" display string (for live timers).
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted string like "01:23:45"
 */
export const formatSecondsToHMS = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

/**
 * Format minutes to "Xh Xm Xs" display string (for reports).
 * @param {number} minutes - Time in minutes (can be fractional)
 * @returns {string} Formatted string like "1h 23m 45s"
 */
export const formatMinutesToTime = (minutes) => {
  if (!minutes && minutes !== 0) return '0m 0s';
  const totalSeconds = minutes * 60;
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Format seconds to "Xh Xm Xs" display string (for report tooltips).
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted string like "1h 23m 45s"
 */
export const formatSecondsToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};
