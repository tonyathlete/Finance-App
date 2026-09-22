import React from 'react';
import { money } from '@/lib/utils';

// Palette qualitative cohérente (forêt + or + neutres chauds)
export const CHART_COLORS = [
  '#2e5d45',
  '#c8a24b',
  '#548b6c',
  '#a9832f',
  '#7fae91',
  '#856527',
  '#adccb9',
  '#634b22',
];

export interface Slice {
  label: string;
  value: number;
}

// Donut en SVG pur
export const DonutChart: React.FC<{ data: Slice[]; size?: number; center?: React.ReactNode }> = ({
  data,
  size = 180,
  center,
}) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2;
  const stroke = size * 0.16;
  const r = radius - stroke / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={radius} cy={radius} r={r} fill="none" stroke="#ece8dc" strokeWidth={stroke} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const len = frac * circ;
          const el = (
            <circle
              key={i}
              cx={radius}
              cy={radius}
              r={r}
              fill="none"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {center}
        </div>
      )}
    </div>
  );
};

export const ChartLegend: React.FC<{ data: Slice[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <ul className="space-y-2 w-full">
      {data.map((d, i) => (
        <li key={i} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="truncate text-forest-700">{d.label}</span>
          </span>
          <span className="text-forest-500 tabular-nums ml-2">
            {money(d.value)} · {Math.round((d.value / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
};

// Barre revenus vs dépenses
export const IncomeExpenseBar: React.FC<{ income: number; expense: number }> = ({
  income,
  expense,
}) => {
  const max = Math.max(income, expense, 1);
  const row = (label: string, value: number, color: string) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-forest-600 font-medium">{label}</span>
        <span className="text-forest-900 font-semibold tabular-nums">{money(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-paper-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
  return (
    <div className="space-y-3">
      {row('Revenus', income, '#2e5d45')}
      {row('Dépenses', expense, '#c8a24b')}
    </div>
  );
};
