'use client';

import { useState, useEffect } from 'react';
import { formatSecondsToHMS } from '../utils/formatters';

/**
 * LiveTimer — Displays a real-time elapsed timer for active baskets.
 * Accounts for stoppages/lost time.
 *
 * Previously duplicated in both production/page.jsx and qc/page.jsx.
 */
export default function LiveTimer({ startTime, stoppages, isPaused }) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lostSeconds, setLostSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      let totalLostMs = 0;

      (stoppages || []).forEach((s) => {
        if (s.restartTime) {
          totalLostMs += new Date(s.restartTime) - new Date(s.stopTime);
        } else {
          // Currently stopped
          totalLostMs += now - new Date(s.stopTime);
        }
      });

      const lostSecs = Math.floor(totalLostMs / 1000);
      const totalElapsedSecs = Math.floor((now - start) / 1000);
      const effectiveSecs = Math.max(0, totalElapsedSecs - lostSecs);

      setLostSeconds(lostSecs);
      setElapsedSeconds(effectiveSecs);
      setElapsed(formatSecondsToHMS(effectiveSecs));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, stoppages]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div
          className={`font-mono text-2xl font-black ${
            isPaused ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {elapsed}
        </div>
        {lostSeconds > 0 && (
          <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-md">
            -{Math.floor(lostSeconds / 60)}m {lostSeconds % 60}s lost
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400">
        Running: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
        {lostSeconds > 0 &&
          ` • Stopped: ${Math.floor(lostSeconds / 60)}m ${lostSeconds % 60}s`}
      </div>
    </div>
  );
}
