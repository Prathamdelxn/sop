/**
 * E-Logbook shared constants.
 * Single source of truth for defect types, stop reasons, chart colors, etc.
 */

/** QC defect type definitions */
export const DEFECT_TYPES = [
  { key: 'watermark1', label: 'Watermark 1', color: 'blue' },
  { key: 'watermark2', label: 'Watermark 2', color: 'cyan' },
  { key: 'maskingProblem', label: 'Masking Problem', color: 'amber' },
  { key: 'scratchMark', label: 'Scratch Mark', color: 'red' },
  { key: 'pvcPeelOff', label: 'PVC Peel Off', color: 'purple' },
];

/** Predefined stoppage reasons for production */
export const STOP_REASONS = [
  'Temperature drop below 40°C',
  'Power failure',
  'Equipment malfunction',
  'Material shortage',
  'Quality issue detected',
  'Operator break',
  'Other',
];

/** Chart color palette for reports */
export const CHART_COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#6366f1',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

/** Pie chart color sequence */
export const PIE_COLORS = [
  '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6',
  '#10b981', '#ec489a', '#06b6d4',
];

/** Empty QC form state factory */
export const createEmptyQCForm = () => ({
  inspectedQuantity: '',
  goodQuantity: '',
  defects: {
    watermark1: 0,
    watermark2: 0,
    maskingProblem: 0,
    scratchMark: 0,
    pvcPeelOff: 0,
  },
});

/** Empty master data form state */
export const EMPTY_MASTER_DATA_FORM = {
  customerName: '',
  country: 'India',
  state: '',
  city: '',
  subCompany: '',
  partName: '',
  coatingRequirements: '',
  standardCycleTime: '',
  standardVoltage: '',
  standardTemperature: '',
  maxCurrent: '',
  surfaceAreaPerBasket: '',
  partsPerBasket: '',
  basketCount: '3',
};
