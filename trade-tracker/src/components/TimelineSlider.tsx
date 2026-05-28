import { useMemo } from 'react';

interface Props {
  dateFrom: string;  // YYYY-MM
  dateTo: string;    // YYYY-MM
  onChange: (from: string, to: string) => void;
}

const MIN_DATE = '1995-01';
const MAX_DATE = '2026-12';

function dateToMonths(d: string): number {
  const [y, m] = d.split('-').map(Number);
  return y * 12 + m;
}
function monthsToDate(n: number): string {
  const y = Math.floor(n / 12);
  const m = n % 12;
  return `${y}-${String(m).padStart(2, '0')}`;
}

const MIN_MONTHS = dateToMonths(MIN_DATE);
const MAX_MONTHS = dateToMonths(MAX_DATE);
const TOTAL = MAX_MONTHS - MIN_MONTHS;

export default function TimelineSlider({ dateFrom, dateTo, onChange }: Props) {
  const fromMonths = dateFrom ? dateToMonths(dateFrom) : MIN_MONTHS;
  const toMonths = dateTo ? dateToMonths(dateTo) : MAX_MONTHS;

  const fromPct = ((fromMonths - MIN_MONTHS) / TOTAL) * 100;
  const toPct = ((toMonths - MIN_MONTHS) / TOTAL) * 100;

  const yearMarks = useMemo(() => {
    const marks = [];
    for (let y = 1996; y <= 2026; y += 4) {
      const pct = ((y * 12 - MIN_MONTHS) / TOTAL) * 100;
      marks.push({ year: y, pct });
    }
    return marks;
  }, []);

  const active = dateFrom || dateTo;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">時間軸</span>

      <div className="flex-1 relative py-3">
        {/* track */}
        <div className="relative h-1 bg-slate-200 rounded-full mx-2">
          <div
            className="absolute h-1 bg-blue-400 rounded-full"
            style={{ left: `${fromPct}%`, right: `${100 - toPct}%` }}
          />
        </div>

        {/* FROM slider */}
        <input
          type="range"
          min={MIN_MONTHS}
          max={MAX_MONTHS}
          value={fromMonths}
          onChange={e => {
            const v = Number(e.target.value);
            if (v <= toMonths) onChange(monthsToDate(v), dateTo);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        {/* TO slider */}
        <input
          type="range"
          min={MIN_MONTHS}
          max={MAX_MONTHS}
          value={toMonths}
          onChange={e => {
            const v = Number(e.target.value);
            if (v >= fromMonths) onChange(dateFrom, monthsToDate(v));
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 3 }}
        />

        {/* year labels */}
        <div className="relative mt-2">
          {yearMarks.map(({ year, pct }) => (
            <span
              key={year}
              className="absolute text-xs text-slate-400 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
          {dateFrom || MIN_DATE}
        </span>
        <span>–</span>
        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
          {dateTo || MAX_DATE}
        </span>
        {active && (
          <button
            className="text-xs text-blue-500 hover:underline ml-1"
            onClick={() => onChange('', '')}
          >
            重置
          </button>
        )}
      </div>
    </div>
  );
}
