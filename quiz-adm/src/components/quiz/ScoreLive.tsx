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
    ? { txt: 'text-green-600', bar: 'bg-green-500', emoji: '💪' }
    : score >= 50
    ? { txt: 'text-amber-600', bar: 'bg-amber-500', emoji: '⚠️' }
    : { txt: 'text-red-600', bar: 'bg-red-500', emoji: '🚨' }

  return (
    <div className="relative flex items-center gap-2.5 bg-white/90 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm select-none">
      {delta !== null && (
        <span
          key={prev.current}
          className={`absolute -top-4 right-2 text-xs font-bold animate-float-delta ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
      )}
      <span className="text-base leading-none">{tone.emoji}</span>
      <div className="min-w-[88px]">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Santé fin.</span>
          <span className={`text-sm font-extrabold tabular-nums ${tone.txt} ${bump ? 'animate-score-bump' : ''}`}>
            {score}
          </span>
        </div>
        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden mt-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${tone.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
