'use client'
import { useState, useMemo } from 'react'

function calcGrowth(initial: number, monthly: number, ratePercent: number, years: number): number[] {
  const rate = ratePercent / 100 / 12
  const points: number[] = []
  let val = initial
  for (let y = 0; y <= years; y++) {
    points.push(val)
    // advance 12 months
    for (let m = 0; m < 12; m++) {
      val = val * (1 + rate) + monthly
    }
  }
  return points
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('fr-CA') + ' $'
}

export default function InvestmentGraph() {
  const [initial, setInitial] = useState(10000)
  const [monthly, setMonthly] = useState(200)
  const [rateCurrent, setRateCurrent] = useState(3)
  const [rateOptimized, setRateOptimized] = useState(10)
  const [years, setYears] = useState(20)

  const W = 600
  const H = 280
  const PAD = { top: 20, right: 20, bottom: 40, left: 70 }

  const currentPoints = useMemo(() => calcGrowth(initial, monthly, rateCurrent, years), [initial, monthly, rateCurrent, years])
  const optimizedPoints = useMemo(() => calcGrowth(initial, monthly, rateOptimized, years), [initial, monthly, rateOptimized, years])

  const maxVal = Math.max(...optimizedPoints)
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const toX = (i: number) => PAD.left + (i / years) * innerW
  const toY = (v: number) => PAD.top + innerH - (v / maxVal) * innerH

  const pathD = (pts: number[]) =>
    pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')

  // Y-axis ticks (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => (maxVal * (i + 1)) / 5)
  // X-axis ticks every 5 years
  const xTicks = Array.from({ length: Math.floor(years / 5) + 1 }, (_, i) => i * 5).filter(t => t <= years)

  const finalCurrent = currentPoints[currentPoints.length - 1]
  const finalOptimized = optimizedPoints[optimizedPoints.length - 1]
  const diff = finalOptimized - finalCurrent

  return (
    <div className="mt-8 p-5 bg-papier-card border border-encre/15">
      <h3 className="text-lg font-display font-semibold text-encre mb-1">Comparaison de placement</h3>
      <p className="text-xs text-encre/50 mb-5">Visualisez l&apos;impact d&apos;un taux de rendement optimisé sur votre épargne</p>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger flex justify-between">
            <span>Montant initial</span><span className="text-encre">{fmt(initial)}</span>
          </label>
          <input type="range" min={1000} max={100000} step={1000} value={initial}
            onChange={e => setInitial(+e.target.value)}
            className="w-full mt-1 accent-encre" />
        </div>
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger flex justify-between">
            <span>Contribution mensuelle</span><span className="text-encre">{fmt(monthly)}</span>
          </label>
          <input type="range" min={0} max={2000} step={50} value={monthly}
            onChange={e => setMonthly(+e.target.value)}
            className="w-full mt-1 accent-encre" />
        </div>
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger flex justify-between">
            <span>Taux actuel</span><span className="text-manille-dark">{rateCurrent}%</span>
          </label>
          <input type="range" min={1} max={5} step={0.5} value={rateCurrent}
            onChange={e => setRateCurrent(+e.target.value)}
            className="w-full mt-1 accent-manille-dark" />
        </div>
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger flex justify-between">
            <span>Taux optimisé</span><span className="text-sauge">{rateOptimized}%</span>
          </label>
          <input type="range" min={6} max={20} step={0.5} value={rateOptimized}
            onChange={e => setRateOptimized(+e.target.value)}
            className="w-full mt-1 accent-sauge" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-encre/70 font-ledger flex justify-between">
            <span>Nombre d&apos;années</span><span className="text-encre">{years} ans</span>
          </label>
          <input type="range" min={5} max={40} step={1} value={years}
            onChange={e => setYears(+e.target.value)}
            className="w-full mt-1 accent-encre" />
        </div>
      </div>

      {/* SVG Graph */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-full" style={{ minWidth: 300 }}>
          {/* Grid lines */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={toY(t)} y2={toY(t)}
                stroke="#1C2B3A" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 3" />
              <text x={PAD.left - 6} y={toY(t) + 4} textAnchor="end"
                className="fill-encre/40" style={{ fontSize: 10 }}>
                {Math.round(t / 1000)}k
              </text>
            </g>
          ))}

          {/* X axis ticks */}
          {xTicks.map(t => (
            <g key={t}>
              <line x1={toX(t)} x2={toX(t)} y1={PAD.top} y2={H - PAD.bottom + 4}
                stroke="#1C2B3A" strokeOpacity="0.1" strokeWidth="1" />
              <text x={toX(t)} y={H - PAD.bottom + 16} textAnchor="middle"
                className="fill-encre/40" style={{ fontSize: 10 }}>
                {t}
              </text>
            </g>
          ))}

          {/* X axis label */}
          <text x={W / 2} y={H - 2} textAnchor="middle"
            className="fill-encre/40" style={{ fontSize: 10 }}>
            Années
          </text>

          {/* Current rate curve */}
          <path d={pathD(currentPoints)} fill="none" stroke="#B7A877" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Optimized rate curve */}
          <path d={pathD(optimizedPoints)} fill="none" stroke="#46604E" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Filled area between curves */}
          <path
            d={`${pathD(optimizedPoints)} L${toX(years).toFixed(1)},${toY(finalCurrent).toFixed(1)} ${currentPoints.map((v, i) => `L${toX(years - i).toFixed(1)},${toY(currentPoints[years - i]).toFixed(1)}`).join(' ')} Z`}
            fill="#46604E" opacity="0.1" />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mb-4 text-xs font-ledger">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-manille-dark" />
          <span className="text-encre/60">Taux actuel ({rateCurrent}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-sauge" />
          <span className="text-encre/60">Taux optimisé ({rateOptimized}%)</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-px bg-encre/15 mt-2">
        <div className="text-center p-3 bg-papier-card">
          <p className="text-xs text-manille-dark font-semibold mb-1 font-ledger">Valeur finale ({rateCurrent}%)</p>
          <p className="text-sm font-bold text-encre font-ledger">{fmt(finalCurrent)}</p>
        </div>
        <div className="text-center p-3 bg-papier-card">
          <p className="text-xs text-sauge font-semibold mb-1 font-ledger">Valeur finale ({rateOptimized}%)</p>
          <p className="text-sm font-bold text-encre font-ledger">{fmt(finalOptimized)}</p>
        </div>
        <div className="text-center p-3 bg-papier-card">
          <p className="text-xs text-sceau font-semibold mb-1 font-ledger">Différence</p>
          <p className="text-sm font-bold text-sceau font-ledger">+ {fmt(diff)}</p>
        </div>
      </div>
    </div>
  )
}
