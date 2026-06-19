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

export default function RevealCard({ teaser, value, prefix = '', suffix = ' $', caption }: Props) {
  const [revealed, setRevealed] = useState(false)
  const count = useCountUp(value, revealed)
  const cardRef = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => setRevealed(true)}
      disabled={revealed}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
        revealed
          ? 'border-encre/10 bg-white/60 cursor-default'
          : 'border-sceau/30 bg-white/80 backdrop-blur-sm shadow-card hover:border-sceau cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-encre">{teaser}</p>
          {!revealed && (
            <p className="text-xs text-sceau font-semibold mt-1 font-ledger">
              Touchez pour révéler la réponse
            </p>
          )}
        </div>
      </div>

      {revealed && (
        <div className="mt-4 text-center animate-pop-in">
          <p className="text-4xl font-display font-semibold text-encre tabular-nums font-ledger">
            {prefix}{count.toLocaleString('fr-CA')}{suffix}
          </p>
          <p className="text-xs text-encre/60 mt-2 leading-relaxed">{caption}</p>
        </div>
      )}
    </button>
  )
}
