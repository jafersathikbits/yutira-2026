'use client';

import { useEffect, useState } from 'react';

const DAY = 1000 * 60 * 60 * 24;

function diffParts(targetMs) {
  let diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / DAY);
  diff -= days * DAY;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  diff -= minutes * 60_000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds, done: targetMs - Date.now() <= 0 };
}

// Defaults to 27 March 2026 09:00 AM IST.
export default function Countdown({ targetISO = '2026-03-27T09:00:00+05:30' }) {
  const targetMs = new Date(targetISO).getTime();
  // null until mounted: the server can't know the visitor's clock, so we render a same-size placeholder.
  const [t, setT] = useState(null);

  useEffect(() => {
    const tick = () => {
      const next = diffParts(targetMs);
      setT(next);
      return next.done;
    };
    if (tick()) return undefined;
    const id = setInterval(() => {
      if (tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (t?.done) {
    return <div className="text-lg md:text-2xl font-semibold text-gold">YUTIRA 2026 is Live!</div>;
  }

  const parts = [
    ['Days', t?.days],
    ['Hours', t?.hours],
    ['Minutes', t?.minutes],
    ['Seconds', t?.seconds]
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="eyebrow">Countdown to Day 1</div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center" role="timer" aria-live="off">
        {parts.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 px-2 sm:px-5 py-3 min-w-[64px] sm:min-w-[96px]"
          >
            <div className="text-2xl sm:text-4xl font-bold tabular-nums text-white">
              {value === undefined ? '--' : String(value).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
