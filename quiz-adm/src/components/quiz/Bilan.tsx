'use client'
import { useMemo } from 'react'
import { QuizData } from '@/lib/types'
import { genererBilan, Priorite } from '@/lib/recommendations'

const PRIORITE_STYLES: Record<Priorite, { rule: string; label: string }> = {
  haute: { rule: 'border-sceau', label: 'PRIORITÉ HAUTE' },
  moyenne: { rule: 'border-manille-dark', label: 'À CONSIDÉRER' },
  info: { rule: 'border-encre/25', label: 'BON À SAVOIR' },
}

function scoreStamp(score: number) {
  if (score >= 75) return { ring: '#46604E', text: 'text-sauge', label: 'Excellente situation', stamp: 'APPROUVÉ' }
  if (score >= 50) return { ring: '#B7A877', text: 'text-manille-dark', label: 'Situation à renforcer', stamp: 'À REVOIR' }
  return { ring: '#8C3324', text: 'text-sceau', label: 'Plusieurs lacunes importantes', stamp: 'URGENT' }
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

      {/* Score, rendu comme un sceau officiel plutôt qu'un anneau lumineux */}
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36 -rotate-2">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#1C2B3A" strokeOpacity="0.1" strokeWidth="2" />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={sc.ring} strokeWidth="2"
              strokeDasharray={C} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-3 rounded-full border-2 flex flex-col items-center justify-center" style={{ borderColor: sc.ring }}>
            <span className={`text-3xl font-display font-semibold ${sc.text}`}>{bilan.score}</span>
            <span className="text-[10px] font-ledger text-encre/40">/ 100</span>
            <span className={`text-[10px] font-ledger tracking-[0.15em] mt-1 ${sc.text}`}>{sc.stamp}</span>
          </div>
        </div>
        <p className={`mt-3 font-semibold font-body ${sc.text}`}>{sc.label}</p>
        <p className="text-xs text-encre/50 mt-1 font-ledger">
          {bilan.okChecks} / {bilan.totalChecks} points évalués sont en place
        </p>
      </div>

      {/* Barres par catégorie, dans le même registre que la règle de progression du quiz */}
      <div className="space-y-3">
        {Object.entries(bilan.parCategorie).map(([cat, { total, ok }]) => {
          const pct = total === 0 ? 100 : Math.round((ok / total) * 100)
          return (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/80">{cat}</span>
                <span className="text-encre/40 font-ledger">{ok}/{total}</span>
              </div>
              <div className="flex gap-0.5 h-1.5">
                {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
                  <div key={i} className={`flex-1 ${i < ok ? 'bg-sauge' : 'bg-encre/12'}`} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommandations */}
      <div>
        <h3 className="font-display font-semibold text-encre mb-3">
          Recommandations ({bilan.recommandations.length})
        </h3>

        {bilan.recommandations.length === 0 ? (
          <div className="border border-sauge/40 bg-sauge-light p-5 text-center text-sauge font-medium">
            Solide. Rien de majeur qui manque en ce moment.
          </div>
        ) : (
          <div className="space-y-3">
            {bilan.recommandations.map((rec, i) => {
              const st = PRIORITE_STYLES[rec.priorite]
              return (
                <div key={rec.id} className={`border-l-2 ${st.rule} bg-papier-card pl-4 py-2`}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-ledger text-[10px] text-encre/40">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] font-ledger tracking-wide text-encre/60">
                      {st.label}
                    </span>
                    <span className="text-[10px] text-encre/35">· {rec.categorie}</span>
                  </div>
                  <p className="font-semibold text-encre text-sm">{rec.titre}</p>
                  <p className="text-xs text-encre/60 mt-1 leading-relaxed">{rec.description}</p>
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
