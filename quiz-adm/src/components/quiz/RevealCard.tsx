'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  emoji: string
  teaser: string
  value: number
  prefix?: string
  suffix?: string
  caption: string
}

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return val
}

export default function RevealCard({ emoji, teaser, value, prefix = '', suffix = ' $', caption }: Props) {
  const [revealed, setRevealed] = useState(false)
  const count = useCountUp(value, revealed)
  const cardRef = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => setRevealed(true)}
      disabled={revealed}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
        revealed
          ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 cursor-default'
          : 'border-brand-300 bg-white hover:border-brand-500 hover:-translate-y-0.5 cursor-pointer animate-pulse-glow'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl shrink-0">{emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">{teaser}</p>
          {!revealed && (
            <p className="text-xs text-brand-600 font-semibold mt-1">
              👆 Touchez pour révéler la réponse
            </p>
          )}
        </div>
      </div>

      {revealed && (
        <div className="mt-4 text-center animate-pop-in">
          <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tabular-nums">
            {prefix}{count.toLocaleString('fr-CA')}{suffix}
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{caption}</p>
        </div>
      )}
    </button>
  )
}
