'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

function fmt(n: number) {
  return Math.round(n).toLocaleString('fr-CA') + ' $'
}

export default function ImpactRevenu({ data, onChange }: Props) {
  const r1 = parseFloat(data.revenuMensuel1) || 0
  const r2 = parseFloat(data.revenuMensuel2) || 0
  const dep = parseFloat(data.depensesMensuelles) || 0

  const revenuTotal = r1 + r2
  // Scénario : on perd le revenu principal (le plus élevé des deux)
  const revenuPerdu = Math.max(r1, r2)
  const revenuRestant = revenuTotal - revenuPerdu
  const manqueParMois = Math.max(0, dep - revenuRestant)

  const maxBar = Math.max(revenuTotal, dep, 1)
  const pct = (v: number) => `${Math.min(100, (v / maxBar) * 100)}%`

  const aDonnees = revenuTotal > 0 && dep > 0

  return (
    <div className="mt-8 p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
      <h3 className="text-lg font-bold text-brand-900 mb-1">Que se passe-t-il si un revenu disparaît?</h3>
      <p className="text-xs text-slate-500 mb-5">Entrez vos chiffres pour visualiser l’impact d’une invalidité sur votre ménage</p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-600">Revenu mensuel — vous</label>
          <div className="relative mt-1">
            <input type="number" inputMode="numeric" value={data.revenuMensuel1}
              onChange={e => onChange({ revenuMensuel1: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Revenu mensuel — conjoint(e)</label>
          <div className="relative mt-1">
            <input type="number" inputMode="numeric" value={data.revenuMensuel2}
              onChange={e => onChange({ revenuMensuel2: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Dépenses mensuelles</label>
          <div className="relative mt-1">
            <input type="number" inputMode="numeric" value={data.depensesMensuelles}
              onChange={e => onChange({ depensesMensuelles: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          </div>
        </div>
      </div>

      {aDonnees ? (
        <>
          {/* Bar chart */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Revenu actuel du ménage</span>
                <span className="font-bold text-green-600">{fmt(revenuTotal)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2" style={{ width: pct(revenuTotal) }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Revenu si invalidité (1 revenu perdu)</span>
                <span className="font-bold text-red-600">{fmt(revenuRestant)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: pct(revenuRestant) }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Vos dépenses mensuelles</span>
                <span className="font-bold text-slate-700">{fmt(dep)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: pct(dep) }} />
              </div>
            </div>
          </div>

          {/* Résultat */}
          <div className={`mt-6 rounded-xl p-5 text-center ${manqueParMois > 0 ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}>
            {manqueParMois > 0 ? (
              <>
                <p className="text-sm text-red-700 font-medium">Manque à gagner chaque mois</p>
                <p className="text-3xl font-bold text-red-700 mt-1">− {fmt(manqueParMois)}</p>
                <p className="text-xs text-red-600 mt-2">
                  C’est le montant qu’il vous manquerait <strong>chaque mois</strong> pour maintenir votre niveau de vie.
                  Une assurance invalidité comble exactement ce vide.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-green-700 font-medium">Vos dépenses seraient couvertes</p>
                <p className="text-xs text-green-600 mt-2">
                  Le revenu restant couvre vos dépenses — mais sans marge pour l’épargne, les imprévus ou la dette.
                  Une protection sécurise tout de même votre niveau de vie.
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-slate-400 py-6">
          Entrez les revenus et dépenses ci-dessus pour voir l’impact en temps réel.
        </p>
      )}
    </div>
  )
}
