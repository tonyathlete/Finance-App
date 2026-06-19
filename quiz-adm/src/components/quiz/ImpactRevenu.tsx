'use client'
import { useState } from 'react'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

function fmt(n: number) {
  return Math.round(n).toLocaleString('fr-CA') + ' $'
}

const DEPENSES = [
  { key: 'depenseLoyer' as const, label: 'Loyer / Hypothèque' },
  { key: 'depenseVoiture' as const, label: 'Voiture(s)' },
  { key: 'depenseAssurance' as const, label: 'Assurances' },
  { key: 'depenseEpicerie' as const, label: 'Épicerie' },
  { key: 'depenseAutres' as const, label: 'Autres dépenses' },
]

export default function ImpactRevenu({ data, onChange }: Props) {
  const [modeDetail, setModeDetail] = useState(false)

  const r1 = parseFloat(data.revenuMensuel1) || 0
  const r2 = parseFloat(data.revenuMensuel2) || 0

  // Compute total depenses from detail or global
  const detailTotal = DEPENSES.reduce((sum, d) => sum + (parseFloat(data[d.key]) || 0), 0)
  const dep = modeDetail
    ? detailTotal
    : (parseFloat(data.depensesMensuelles) || 0)

  // Sync detail total to depensesMensuelles when in detail mode
  const handleDetailChange = (key: keyof QuizData, val: string) => {
    const updates: Partial<QuizData> = { [key]: val }
    const newDetail = DEPENSES.reduce((sum, d) => {
      const v = d.key === key ? parseFloat(val) || 0 : parseFloat(data[d.key]) || 0
      return sum + v
    }, 0)
    updates.depensesMensuelles = String(newDetail)
    onChange(updates)
  }

  const revenuTotal = r1 + r2
  const revenuPerdu = Math.max(r1, r2)
  const revenuRestant = revenuTotal - revenuPerdu
  const manqueParMois = Math.max(0, dep - revenuRestant)

  const maxBar = Math.max(revenuTotal, dep, 1)
  const pct = (v: number) => `${Math.min(100, (v / maxBar) * 100)}%`

  const aDonnees = revenuTotal > 0 && dep > 0

  return (
    <div className="mt-8 card">
      <h3 className="text-lg font-display font-semibold text-encre mb-1">Que se passe-t-il si un revenu disparaît?</h3>
      <p className="text-xs text-encre/50 mb-5">On fait le calcul avec vos vrais chiffres</p>

      {/* Revenus */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger">Revenu mensuel (vous)</label>
          <div className="relative mt-1">
            <input type="number" inputMode="numeric" value={data.revenuMensuel1}
              onChange={e => onChange({ revenuMensuel1: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-sm font-ledger">$</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-encre/70 font-ledger">Revenu mensuel (conjoint(e))</label>
          <div className="relative mt-1">
            <input type="number" inputMode="numeric" value={data.revenuMensuel2}
              onChange={e => onChange({ revenuMensuel2: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-sm font-ledger">$</span>
          </div>
        </div>
      </div>

      {/* Dépenses — toggle simple / détaillé */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-encre/70 font-ledger">Dépenses mensuelles</label>
          <button
            type="button"
            onClick={() => setModeDetail(v => !v)}
            className="text-xs text-encre/60 hover:text-sceau underline font-ledger"
          >
            {modeDetail ? 'Vue simplifiée' : 'Détailler les dépenses'}
          </button>
        </div>

        {modeDetail ? (
          <div className="space-y-2 rounded-xl bg-brand-50/50 p-3 border border-encre/8">
            {DEPENSES.map(d => (
              <div key={d.key} className="flex items-center gap-3">
                <span className="text-xs text-encre/60 w-36 shrink-0">{d.label}</span>
                <div className="relative flex-1">
                  <input type="number" inputMode="numeric"
                    value={data[d.key]}
                    onChange={e => handleDetailChange(d.key, e.target.value)}
                    placeholder="0" className="input pr-7 py-1.5 text-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-xs font-ledger">$</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-encre/15 text-xs font-semibold text-encre/80 font-ledger">
              <span>Total</span>
              <span>{fmt(detailTotal)}</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input type="number" inputMode="numeric" value={data.depensesMensuelles}
              onChange={e => onChange({ depensesMensuelles: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-sm font-ledger">$</span>
          </div>
        )}
      </div>

      {aDonnees ? (
        <>
          {/* Bar chart */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/60">Revenu actuel du ménage</span>
                <span className="font-bold text-sauge font-ledger">{fmt(revenuTotal)}</span>
              </div>
              <div className="w-full bg-encre/10 h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-green" style={{ width: pct(revenuTotal) }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/60">Revenu si invalidité (1 revenu perdu)</span>
                <span className="font-bold text-sceau font-ledger">{fmt(revenuRestant)}</span>
              </div>
              <div className="w-full bg-encre/10 h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-red" style={{ width: pct(revenuRestant) }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/60">Vos dépenses mensuelles</span>
                <span className="font-bold text-encre/80 font-ledger">{fmt(dep)}</span>
              </div>
              <div className="w-full bg-encre/10 h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-blue" style={{ width: pct(dep) }} />
              </div>
            </div>
          </div>

          {/* Résultat */}
          <div className={`mt-6 rounded-2xl border p-5 text-center ${manqueParMois > 0 ? 'bg-sceau-light border-sceau/30' : 'bg-sauge-light border-sauge/30'}`}>
            {manqueParMois > 0 ? (
              <>
                <p className="text-xs font-ledger tracking-wide text-sceau">MANQUE À GAGNER CHAQUE MOIS</p>
                <p className="text-3xl font-display font-semibold text-sceau mt-1">− {fmt(manqueParMois)}</p>
                <p className="text-xs text-sceau/80 mt-2">
                  C&apos;est le montant qu&apos;il vous manquerait <strong>chaque mois</strong> pour maintenir votre niveau de vie.
                  Une assurance invalidité comble exactement ce vide.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-ledger tracking-wide text-sauge">DÉPENSES COUVERTES</p>
                <p className="text-xs text-sauge/80 mt-2">
                  Le revenu restant couvre vos dépenses, mais sans marge pour l&apos;épargne, les imprévus ou la dette.
                  Une protection sécurise tout de même votre niveau de vie.
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-encre/40 py-6">
          Entrez les revenus et dépenses ci-dessus pour voir l&apos;impact en temps réel.
        </p>
      )}
    </div>
  )
}
