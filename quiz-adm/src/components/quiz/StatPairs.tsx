'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  filled: number          // sur 10
  label: string           // « ...seront invalides 90 jours ou plus avant 65 ans »
  caption?: string
  tone?: 'red' | 'amber' | 'indigo'
}

const TONES = {
  red: { active: 'bg-gradient-red', big: 'text-sceau' },
  amber: { active: 'bg-gradient-blue', big: 'text-manille-dark' },
  indigo: { active: 'bg-gradient-blue', big: 'text-brand-600' },
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
    <div ref={ref} className="card">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1.5 h-8 items-end">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-8 rounded-full ${i < filled ? t.active : 'bg-encre/10'} ${visible && i < filled ? 'animate-pop-in' : ''}`}
              style={visible && i < filled ? { animationDelay: `${i * 70}ms` } : { opacity: i < filled && !visible ? 0 : undefined }}
            />
          ))}
        </div>
        <p className={`text-2xl font-display font-bold ${t.big} shrink-0`}>
          {filled} sur 10
        </p>
      </div>
      <p className="text-sm font-semibold text-encre/80 mt-3">{label}</p>
      {caption && <p className="text-xs text-encre/50 mt-1 italic">{caption}</p>}
    </div>
  )
}
