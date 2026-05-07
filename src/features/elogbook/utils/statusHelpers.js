/**
 * Basket status display helpers.
 * Single source of truth — used across Production and QC pages.
 */

/**
 * Returns Tailwind CSS classes for a basket status badge.
 * @param {string} status - Basket status string
 * @returns {string} CSS class string
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'in-progress':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'stopped':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'completed':
    case 'pending-qc':
    case 'qc-done':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

/**
 * Returns a human-readable label for a basket status.
 * @param {string} status - Basket status string
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'in-progress':
      return 'Running';
    case 'stopped':
      return 'Paused';
    case 'pending-qc':
      return 'Pending QC';
    case 'qc-done':
      return 'QC Done';
    case 'completed':
      return 'Completed';
    default:
      return 'Pending';
  }
};
