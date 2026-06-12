'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  filled: number          // sur 10
  label: string           // « ...seront invalides 90 jours ou plus avant 65 ans »
  caption?: string
  tone?: 'red' | 'amber' | 'indigo'
}

const TONES = {
  red: { active: 'text-red-500', big: 'text-red-600', bg: 'from-red-50 to-orange-50 border-red-100' },
  amber: { active: 'text-amber-500', big: 'text-amber-600', bg: 'from-amber-50 to-yellow-50 border-amber-100' },
  indigo: { active: 'text-indigo-500', big: 'text-indigo-600', bg: 'from-indigo-50 to-blue-50 border-indigo-100' },
}

export default function StatPairs({ filled, label, caption, tone = 'red' }: Props) {
  const t = TONES[tone]
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`bg-gradient-to-br ${t.bg} border rounded-2xl p-5`}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 text-2xl">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`${i < filled ? t.active : 'text-slate-300'} ${visible && i < filled ? 'animate-pop-in' : ''}`}
              style={visible && i < filled ? { animationDelay: `${i * 90}ms` } : { opacity: i < filled && !visible ? 0 : undefined }}
            >
              ●
            </span>
          ))}
        </div>
        <p className={`text-2xl font-extrabold ${t.big} shrink-0`}>
          {filled} sur 10
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-2">{label}</p>
      {caption && <p className="text-xs text-slate-500 mt-1 italic">{caption}</p>}
    </div>
  )
}
