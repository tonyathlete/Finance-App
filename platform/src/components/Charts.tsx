import React from 'react';
import { money } from '@/lib/utils';

// Palette qualitative validée (dataviz : accessible daltonisme, ordre fixe).
// L'identité de marque forêt/or reste sur l'interface ; les graphiques
// multi-catégories utilisent ces teintes distinctes + étiquettes directes.
export const CHART_COLORS = [
  '#2a78d6', // bleu
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // jaune/or
  '#e87ba4', // magenta
  '#008300', // vert
  '#4a3aa7', // violet
  '#e34948', // rouge
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

// Graphique aire + ligne pour une série temporelle (projection).
// Une seule série : pas de légende (le titre nomme la série). Survol crosshair.
export interface Point {
  x: number;      // valeur d'axe X (mois, année…)
  y: number;      // valeur
  label?: string; // libellé au survol
}

export const AreaLineChart: React.FC<{
  points: Point[];
  color?: string;
  height?: number;
  formatY?: (n: number) => string;
  formatX?: (n: number) => string;
}> = ({ points, color = '#2e5d45', height = 200, formatY = (n) => String(Math.round(n)), formatX = (n) => String(n) }) => {
  const [hover, setHover] = React.useState<number | null>(null);
  const w = 640;
  const h = height;
  const padL = 8;
  const padR = 8;
  const padT = 12;
  const padB = 22;
  if (points.length < 2) {
    return <div className="text-sm text-forest-400 py-8 text-center">Données insuffisantes pour tracer une projection.</div>;
  }
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys) * 1.08;
  const minY = 0;
  const sx = (x: number) => padL + ((x - minX) / (maxX - minX || 1)) * (w - padL - padR);
  const sy = (y: number) => padT + (1 - (y - minY) / (maxY - minY || 1)) * (h - padT - padB);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${sx(maxX).toFixed(1)},${sy(0).toFixed(1)} L${sx(minX).toFixed(1)},${sy(0).toFixed(1)} Z`;

  const gradId = React.useId();

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    // trouver le point le plus proche
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(sx(p.x) - px);
      if (d < bestD) { bestD = d; best = i; }
    });
    setHover(best);
  };

  const hp = hover !== null ? points[hover] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* lignes de repère horizontales */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={padL} x2={w - padR} y1={padT + f * (h - padT - padB)} y2={padT + f * (h - padT - padB)} stroke="#ece8dc" strokeWidth="1" />
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {/* étiquettes X (début / fin) */}
        <text x={sx(minX)} y={h - 6} fontSize="11" fill="#7a8a80">{formatX(minX)}</text>
        <text x={sx(maxX)} y={h - 6} fontSize="11" fill="#7a8a80" textAnchor="end">{formatX(maxX)}</text>
        {/* crosshair */}
        {hp && (
          <>
            <line x1={sx(hp.x)} x2={sx(hp.x)} y1={padT} y2={h - padB} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={sx(hp.x)} cy={sy(hp.y)} r="4.5" fill={color} stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {hp && (
        <div
          className="absolute -translate-x-1/2 -top-1 bg-forest-800 text-paper-50 text-xs rounded-lg px-2 py-1 pointer-events-none shadow-lift whitespace-nowrap"
          style={{ left: `${(sx(hp.x) / w) * 100}%` }}
        >
          <span className="font-semibold">{formatY(hp.y)}</span>
          <span className="opacity-70"> · {hp.label ?? formatX(hp.x)}</span>
        </div>
      )}
    </div>
  );
};
