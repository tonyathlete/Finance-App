'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { QuizData } from '@/lib/types'
import { genererBilan } from '@/lib/recommendations'

export default function ScoreLive({ data }: { data: QuizData }) {
  const score = useMemo(() => genererBilan(data).score, [data])
  const prev = useRef(score)
  const [delta, setDelta] = useState<number | null>(null)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (score !== prev.current) {
      setDelta(score - prev.current)
      setBump(true)
      prev.current = score
      const t = setTimeout(() => { setDelta(null); setBump(false) }, 1400)
      return () => clearTimeout(t)
    }
  }, [score])

  const tone = score >= 75
    ? { txt: 'text-sauge', bar: 'bg-gradient-green' }
    : score >= 50
    ? { txt: 'text-manille-dark', bar: 'bg-gradient-blue' }
    : { txt: 'text-sceau', bar: 'bg-gradient-red' }

  return (
    <div className="relative flex items-center gap-2.5 bg-white/70 border border-encre/10 rounded-full px-3.5 py-1.5 shadow-card select-none">
      {delta !== null && (
        <span
          key={prev.current}
          className={`absolute -top-4 right-2 text-xs font-ledger font-bold animate-float-delta ${delta > 0 ? 'text-sauge' : 'text-sceau'}`}
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
      )}
      <div className="min-w-[88px]">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-ledger text-encre/45 uppercase tracking-wide">Santé fin.</span>
          <span className={`text-sm font-ledger font-bold tabular-nums ${tone.txt} ${bump ? 'animate-score-bump' : ''}`}>
            {score}
          </span>
        </div>
        <div className="w-full bg-encre/10 h-1.5 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${tone.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
