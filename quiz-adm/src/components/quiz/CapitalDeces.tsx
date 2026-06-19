'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const FRAIS_FINAUX = 15000 // funérailles, succession, derniers frais

function fmt(n: number) {
  return Math.round(n).toLocaleString('fr-CA') + ' $'
}

function Champ({ label, value, onSet, placeholder = '0', suffix = '$', hint }: {
  label: string; value: string; onSet: (v: string) => void; placeholder?: string; suffix?: string; hint?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-encre/70 font-ledger">{label}</label>
      {hint && <p className="text-[10px] text-encre/40">{hint}</p>}
      <div className="relative mt-1">
        <input type="number" inputMode="numeric" value={value}
          onChange={e => onSet(e.target.value)}
          placeholder={placeholder} className="input pr-8" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-sm font-ledger">{suffix}</span>
      </div>
    </div>
  )
}

export default function CapitalDeces({ data, onChange }: Props) {
  const revenu = parseFloat(data.capitalRevenuAnnuel) || 0
  const annees = parseFloat(data.capitalAnneesCouvrir) || 0
  const dettes = parseFloat(data.capitalDettes) || 0
  const couverture = parseFloat(data.capitalCouvertureActuelle) || 0

  const remplacementRevenu = revenu * annees
  const besoinTotal = remplacementRevenu + dettes + FRAIS_FINAUX
  const manque = besoinTotal - couverture

  const aDonnees = revenu > 0 && annees > 0

  return (
    <div className="card">
      <h3 className="text-lg font-display font-semibold text-encre mb-1">De combien votre famille aurait besoin?</h3>
      <p className="text-xs text-encre/50 mb-5">
        Quelques chiffres et on sait exactement le montant
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Champ label="Votre revenu annuel"
          value={data.capitalRevenuAnnuel}
          onSet={v => onChange({ capitalRevenuAnnuel: v })} />
        <Champ label="Années à protéger" suffix="ans" placeholder="10"
          hint="ex. jusqu'à l'autonomie des enfants"
          value={data.capitalAnneesCouvrir}
          onSet={v => onChange({ capitalAnneesCouvrir: v })} />
        <Champ label="Dettes totales"
          hint="hypothèque, prêts, cartes…"
          value={data.capitalDettes}
          onSet={v => onChange({ capitalDettes: v })} />
        <Champ label="Couverture vie actuelle"
          hint="0 si aucune assurance vie"
          value={data.capitalCouvertureActuelle}
          onSet={v => onChange({ capitalCouvertureActuelle: v })} />
      </div>

      {aDonnees ? (
        <>
          {/* Décomposition */}
          <div className="rounded-xl bg-brand-50/50 border border-encre/8 p-4 space-y-2 text-sm font-ledger">
            <div className="flex justify-between">
              <span className="text-encre/60">Remplacement du revenu ({annees} ans)</span>
              <span className="font-semibold text-encre tabular-nums">{fmt(remplacementRevenu)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-encre/60">Remboursement des dettes</span>
              <span className="font-semibold text-encre tabular-nums">{fmt(dettes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-encre/60">Frais finaux (funérailles, succession…)</span>
              <span className="font-semibold text-encre tabular-nums">{fmt(FRAIS_FINAUX)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-encre/20 font-bold">
              <span className="text-encre">Besoin réel de votre famille</span>
              <span className="text-encre tabular-nums">{fmt(besoinTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-encre/60">Votre couverture actuelle</span>
              <span className={`font-semibold tabular-nums ${couverture > 0 ? 'text-encre' : 'text-sceau'}`}>
                − {fmt(couverture)}
              </span>
            </div>
          </div>

          {/* Verdict */}
          <div className={`mt-4 rounded-2xl border p-5 text-center ${manque > 0 ? 'bg-sceau-light border-sceau/30' : 'bg-sauge-light border-sauge/30'}`}>
            {manque > 0 ? (
              <>
                <p className="text-xs font-ledger tracking-wide text-sceau">PROTECTION MANQUANTE</p>
                <p className="text-3xl font-display font-semibold text-sceau mt-1">− {fmt(manque)}</p>
                <p className="text-xs text-sceau/80 mt-3">
                  C&apos;est le montant que votre famille devrait absorber sans vous.
                  La bonne nouvelle : combler cet écart coûte souvent juste <strong>quelques dollars par jour</strong>.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-ledger tracking-wide text-sauge">FAMILLE BIEN PROTÉGÉE</p>
                <p className="text-xs text-sauge/80 mt-2">
                  Prochaine étape : valider que les bénéficiaires sont à jour et que le type de contrat
                  (temporaire vs permanent) correspond toujours à votre situation.
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-encre/40 py-4">
          Entrez le revenu annuel et les années à protéger pour voir le calcul.
        </p>
      )}
    </div>
  )
}
