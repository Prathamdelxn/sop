'use client';

import { formatMinutesToTime, formatSecondsToTime } from '../../utils/formatters';

/** Custom tooltip for cycle time / regular charts */
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const rawData = payload[0].payload;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {
            entry.dataKey === 'actual' || entry.dataKey === 'standard' || entry.dataKey === 'lost'
              ? formatSecondsToTime(entry.value * 60)
              : typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value
          }
        </p>
      ))}
      {rawData.totalParts !== undefined && (
        <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between gap-4">
          <span className="font-bold text-gray-500">Total Parts:</span>
          <span className="font-extrabold text-gray-900">{rawData.totalParts}</span>
        </div>
      )}
    </div>
  );
};

/** Custom tooltip for pie chart */
export const CustomPieTooltip = ({ active, payload, totalDefects }) => {
  if (!active || !payload?.length) return null;
  const { name, value, buckets } = payload[0].payload;
  const percentage = ((value / totalDefects) * 100).toFixed(1);

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-100 text-sm min-w-[200px]">
      <p className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">{name}</p>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600">Total Count:</span>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500 text-xs">Share:</span>
        <span className="text-indigo-600 font-semibold text-xs">{percentage}%</span>
      </div>

      {buckets && buckets.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Basket-wise Breakdown</p>
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {buckets.map((b, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs bg-gray-50/50 px-2 py-1.5 rounded-lg border border-gray-100/50">
                <span className="text-gray-500">Basket {b.basketNumber}</span>
                <span className="font-bold text-gray-900">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/** Custom label for time values on bars */
export const CustomTimeLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value && value !== 0) return null;
  return (
    <text x={x + width / 2} y={y - 8} fill="#475569" textAnchor="middle" fontSize={11} fontWeight="600">{formatMinutesToTime(value)}</text>
  );
};

/** Custom legend for pie chart */
export const CustomPieLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-sm text-gray-700">{entry.value} <span className="text-gray-400">({entry.payload.value})</span></span>
      </div>
    ))}
  </div>
);
