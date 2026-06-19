'use client'
import { useMemo } from 'react'
import { QuizData } from '@/lib/types'
import { genererBilan, Priorite } from '@/lib/recommendations'

const PRIORITE_STYLES: Record<Priorite, { dot: string; text: string; label: string }> = {
  haute: { dot: 'bg-gradient-red', text: 'text-sceau', label: 'PRIORITÉ HAUTE' },
  moyenne: { dot: 'bg-gradient-blue', text: 'text-manille-dark', label: 'À CONSIDÉRER' },
  info: { dot: 'bg-encre/30', text: 'text-encre/50', label: 'BON À SAVOIR' },
}

function scoreStamp(score: number) {
  if (score >= 75) return { ring: '#10B981', text: 'text-sauge', label: 'Excellente situation', stamp: 'EXCELLENT' }
  if (score >= 50) return { ring: '#5B5FEF', text: 'text-brand-600', label: 'Situation à renforcer', stamp: 'À REVOIR' }
  return { ring: '#EF4444', text: 'text-sceau', label: 'Plusieurs lacunes importantes', stamp: 'URGENT' }
}

export default function Bilan({ data }: { data: QuizData; onChange?: (u: Partial<QuizData>) => void }) {
  const bilan = useMemo(() => genererBilan(data), [data])
  const sc = scoreStamp(bilan.score)

  // cercle de score
  const R = 52
  const C = 2 * Math.PI * R
  const offset = C - (bilan.score / 100) * C

  const prenom = data.prenom || 'le client'

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ledger text-xs tracking-[0.2em] text-sceau mb-1">DOSSIER — SYNTHÈSE</p>
        <h2 className="text-2xl font-display font-semibold text-encre">Bilan &amp; recommandations</h2>
        <p className="text-sm text-encre/55 mt-1">Portrait personnalisé pour {prenom}</p>
      </div>

      {/* Score, rendu comme un anneau lumineux flottant sur une carte de verre */}
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#1E1B4B" strokeOpacity="0.08" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={sc.ring} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 4px 10px ${sc.ring}66)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-display font-bold ${sc.text}`}>{bilan.score}</span>
            <span className="text-[10px] font-ledger text-encre/40">/ 100</span>
            <span className={`text-[10px] font-ledger font-bold tracking-[0.1em] mt-1 ${sc.text}`}>{sc.stamp}</span>
          </div>
        </div>
        <p className={`mt-3 font-semibold font-body ${sc.text}`}>{sc.label}</p>
      </div>

      {/* Quatre tuiles de stats en dégradé, comme le tableau de bord du mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-gradient-blue text-white p-4 shadow-stamp-sm">
          <p className="text-2xl font-display font-bold font-ledger">{Object.keys(bilan.parCategorie).length}</p>
          <p className="text-xs text-white/80 mt-0.5">Catégories</p>
        </div>
        <div className="rounded-2xl bg-gradient-green text-white p-4 shadow-stamp-sm">
          <p className="text-2xl font-display font-bold font-ledger">{bilan.okChecks}</p>
          <p className="text-xs text-white/80 mt-0.5">En place</p>
        </div>
        <div className="rounded-2xl bg-gradient-red text-white p-4 shadow-stamp-sm">
          <p className="text-2xl font-display font-bold font-ledger">{bilan.totalChecks - bilan.okChecks}</p>
          <p className="text-xs text-white/80 mt-0.5">À prioriser</p>
        </div>
        <div className="rounded-2xl bg-gradient-magenta text-white p-4 shadow-stamp-sm">
          <p className="text-2xl font-display font-bold font-ledger">{bilan.recommandations.length}</p>
          <p className="text-xs text-white/80 mt-0.5">Recommandations</p>
        </div>
      </div>

      {/* Barres par catégorie */}
      <div className="space-y-3">
        {Object.entries(bilan.parCategorie).map(([cat, { total, ok }]) => {
          const pct = total === 0 ? 100 : Math.round((ok / total) * 100)
          return (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/80">{cat}</span>
                <span className="text-encre/40 font-ledger">{ok}/{total}</span>
              </div>
              <div className="w-full bg-encre/8 h-1.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-green transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommandations */}
      <div>
        <h3 className="font-display font-bold text-encre mb-3">
          Recommandations ({bilan.recommandations.length})
        </h3>

        {bilan.recommandations.length === 0 ? (
          <div className="rounded-2xl border border-sauge/30 bg-sauge-light p-5 text-center text-sauge font-medium">
            Solide. Rien de majeur qui manque en ce moment.
          </div>
        ) : (
          <div className="space-y-3">
            {bilan.recommandations.map((rec, i) => {
              const st = PRIORITE_STYLES[rec.priorite]
              return (
                <div key={rec.id} className="card !p-4 flex gap-3">
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-ledger font-bold text-white ${st.dot}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-ledger font-bold tracking-wide ${st.text}`}>
                        {st.label}
                      </span>
                      <span className="text-[10px] text-encre/35">· {rec.categorie}</span>
                    </div>
                    <p className="font-semibold text-encre text-sm">{rec.titre}</p>
                    <p className="text-xs text-encre/60 mt-1 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="insight-box">
        C&apos;est le portrait d&apos;aujourd&apos;hui. On se reprend une rencontre pour regarder ça point par point et mettre un plan en place.
      </div>
    </div>
  )
}
