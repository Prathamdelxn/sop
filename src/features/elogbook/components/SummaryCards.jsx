'use client';

import {
  Package, CheckCircle, Clock, Timer, AlertCircle,
  BarChart3, TrendingUp,
} from 'lucide-react';
import { formatTimeToMMSS } from '../utils/formatters';

/**
 * SummaryCards — Displays the 4-card summary grid (Total, Completed, Avg Time, Lost Time).
 * Used by both Production and QC pages with slight label differences.
 */
export default function SummaryCards({ summary, variant = 'production', selectedMasterData }) {
  const cards = [
    {
      gradient: variant === 'production'
        ? 'from-blue-500 to-blue-600'
        : 'from-indigo-500 to-indigo-600',
      icon1: Package,
      icon2: BarChart3,
      value: summary.totalBaskets,
      label: variant === 'production' ? 'Total Baskets' : 'Total Pending Baskets',
      sub: variant === 'production'
        ? `${summary.completedBaskets} completed`
        : `${summary.inProgressBaskets} currently executing`,
    },
    {
      gradient: 'from-emerald-500 to-emerald-600',
      icon1: CheckCircle,
      icon2: TrendingUp,
      value: summary.completedBaskets,
      label: variant === 'production' ? 'Completed Baskets' : 'Ready for QC',
      sub: variant === 'production'
        ? `${summary.totalBaskets > 0 ? Math.round((summary.completedBaskets / summary.totalBaskets) * 100) : 0}% completion rate`
        : 'Baskets that have finished execution',
    },
    {
      gradient: 'from-amber-500 to-amber-600',
      icon1: Clock,
      icon2: Timer,
      value: formatTimeToMMSS(summary.avgCycleTime),
      label: variant === 'production' ? 'Avg Cycle Time' : 'Avg Execution Time',
      isText: true,
      sub: variant === 'production' && selectedMasterData?.standardCycleTime
        ? summary.avgCycleTime > selectedMasterData.standardCycleTime
          ? `+${formatTimeToMMSS(summary.avgCycleTime - selectedMasterData.standardCycleTime)} vs standard`
          : `-${formatTimeToMMSS(selectedMasterData.standardCycleTime - summary.avgCycleTime)} vs standard`
        : 'Average across finished baskets',
    },
    {
      gradient: 'from-red-500 to-red-600',
      icon1: AlertCircle,
      icon2: Timer,
      value: formatTimeToMMSS(summary.totalLostTime),
      label: 'Total Lost Time',
      isText: true,
      sub: `${summary.stoppedBaskets} paused baskets`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-4 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <card.icon1 className="w-6 h-6 opacity-80" />
            <card.icon2 className="w-5 h-5 opacity-80" />
          </div>
          <div className={card.isText ? 'text-xl font-bold' : 'text-2xl font-bold'}>
            {card.value}
          </div>
          <div className="text-xs opacity-90 mt-1">{card.label}</div>
          <div className="text-xs opacity-75 mt-2">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
