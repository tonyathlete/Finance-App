'use client'
import { useMemo } from 'react'
import { QuizData } from '@/lib/types'
import { genererBilan, Priorite } from '@/lib/recommendations'

const PRIORITE_STYLES: Record<Priorite, { bg: string; border: string; badge: string; label: string; icon: string }> = {
  haute: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    label: 'Priorité haute',
    icon: '🔴',
  },
  moyenne: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    label: 'À considérer',
    icon: '🟠',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    label: 'Bon à savoir',
    icon: '💡',
  },
}

function scoreColor(score: number) {
  if (score >= 75) return { ring: '#22c55e', text: 'text-green-600', label: 'Excellente situation' }
  if (score >= 50) return { ring: '#f59e0b', text: 'text-amber-600', label: 'Situation à renforcer' }
  return { ring: '#ef4444', text: 'text-red-600', label: 'Plusieurs lacunes importantes' }
}

export default function Bilan({ data }: { data: QuizData; onChange?: (u: Partial<QuizData>) => void }) {
  const bilan = useMemo(() => genererBilan(data), [data])
  const sc = scoreColor(bilan.score)

  // cercle de score
  const R = 52
  const C = 2 * Math.PI * R
  const offset = C - (bilan.score / 100) * C

  const prenom = data.prenom || 'le client'

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-900">Bilan & recommandations</h2>
        <p className="text-sm text-slate-500 mt-1">Synthèse personnalisée pour {prenom}</p>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={sc.ring} strokeWidth="12"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${sc.text}`}>{bilan.score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
        <p className={`mt-3 font-semibold ${sc.text}`}>{sc.label}</p>
        <p className="text-xs text-slate-500 mt-1">
          {bilan.okChecks} points en place sur {bilan.totalChecks} évalués
        </p>
      </div>

      {/* Barres par catégorie */}
      <div className="space-y-3">
        {Object.entries(bilan.parCategorie).map(([cat, { total, ok }]) => {
          const pct = total === 0 ? 100 : Math.round((ok / total) * 100)
          return (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{cat}</span>
                <span className="text-slate-400">{ok}/{total}</span>
              </div>
              <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommandations */}
      <div>
        <h3 className="font-bold text-brand-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent-500 rounded-full" />
          Recommandations ({bilan.recommandations.length})
        </h3>

        {bilan.recommandations.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center text-green-700 font-medium">
            🎉 Félicitations! Aucune lacune majeure détectée. Votre situation est bien protégée.
          </div>
        ) : (
          <div className="space-y-3">
            {bilan.recommandations.map((rec, i) => {
              const st = PRIORITE_STYLES[rec.priorite]
              return (
                <div key={rec.id} className={`rounded-xl border ${st.border} ${st.bg} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm font-bold text-slate-500 shrink-0 border border-slate-200">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${st.badge}`}>
                          {st.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.categorie}</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">{rec.titre}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="insight-box">
        Ces recommandations sont un point de départ pour notre discussion. Prochaine étape : une rencontre approfondie pour bâtir votre plan personnalisé.
      </div>
    </div>
  )
}
