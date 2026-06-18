import React from 'react';
import { CategoryAnalysis } from '../types';

interface Props {
  categories: CategoryAnalysis[];
  totalIncome: number;
}

export default function DonutChart({ categories, totalIncome }: Props) {
  const R = 80;
  const r = 52;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * R;

  // Sort by amount desc so largest slice comes first
  const sorted = [...categories].sort((a, b) => b.amount - a.amount);

  // Add savings slice if surplus exists
  const totalExpenses = categories.reduce((s, c) => s + c.amount, 0);
  const surplusAmt = totalIncome - totalExpenses;
  const allSlices: Array<{ name: string; percent: number; color: string }> = sorted.map((c) => ({
    name: c.name,
    percent: c.percent,
    color: c.color,
  }));
  if (surplusAmt > 0 && totalIncome > 0) {
    allSlices.push({ name: 'Surplus / Épargne', percent: (surplusAmt / totalIncome) * 100, color: '#C9A227' });
  }

  let cumulative = 0;
  const slices = allSlices.map((s) => {
    const startAngle = (cumulative / 100) * 360 - 90;
    const endAngle = ((cumulative + s.percent) / 100) * 360 - 90;
    cumulative += s.percent;

    const start = polarToCartesian(cx, cy, R, startAngle);
    const end = polarToCartesian(cx, cy, R, endAngle);
    const innerStart = polarToCartesian(cx, cy, r, startAngle);
    const innerEnd = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = s.percent > 50 ? 1 : 0;

    const d = [
      `M ${start.x} ${start.y}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ');

    return { ...s, d };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} className="transition-all duration-300" />
        ))}
        <circle cx={cx} cy={cy} r={r - 4} fill="#FBFBF9" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#142420" fontSize="8" fontWeight="600">Dépenses</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#142420" fontSize="8">{allSlices.length} catégories</text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        {allSlices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[#142420]/80 truncate">{s.name} (<span className="font-mono-data">{s.percent.toFixed(0)}%</span>)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
