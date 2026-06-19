'use client'
import { useState } from 'react'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

function fmt(n: number) {
  return Math.round(n).toLocaleString('fr-CA') + ' $'
}

function ChampMontant({ label, value, onSet, placeholder = '0', suffix = '$' }: {
  label: string; value: string; onSet: (v: string) => void; placeholder?: string; suffix?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-encre/70 font-ledger">{label}</label>
      <div className="relative mt-1">
        <input type="number" inputMode="numeric" value={value}
          onChange={e => onSet(e.target.value)}
          placeholder={placeholder} className="input pr-8" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-encre/40 text-sm font-ledger">{suffix}</span>
      </div>
    </div>
  )
}

export default function CalculRetraite({ data, onChange }: Props) {
  const [rendement, setRendement] = useState(6)

  const age = parseFloat(data.retraiteAgeActuel || data.age) || 0
  const ageVise = parseFloat(data.retraiteAgeVise) || 0
  const epargne = parseFloat(data.retraiteEpargneActuelle) || 0
  const mensuelle = parseFloat(data.retraiteEpargneMensuelle) || 0
  const revenuVise = parseFloat(data.retraiteRevenuVise) || 0

  const annees = Math.max(0, ageVise - age)
  const mois = annees * 12
  const r = rendement / 100
  const rm = r / 12

  // Capital nécessaire — règle du 4 % (25 × le revenu annuel souhaité)
  const capitalNecessaire = revenuVise * 25

  // Projection du chemin actuel
  const fvEpargne = epargne * Math.pow(1 + r, annees)
  const fvMensuelle = mois > 0 && rm > 0 ? mensuelle * ((Math.pow(1 + rm, mois) - 1) / rm) : mensuelle * mois
  const capitalProjete = fvEpargne + fvMensuelle

  const ecart = capitalNecessaire - capitalProjete

  // Mensuelle requise pour combler
  const manqueCapital = Math.max(0, capitalNecessaire - fvEpargne)
  const mensuelleRequise = mois > 0 && rm > 0
    ? manqueCapital * rm / (Math.pow(1 + rm, mois) - 1)
    : 0

  const aDonnees = age > 0 && ageVise > age && revenuVise > 0
  const maxBar = Math.max(capitalNecessaire, capitalProjete, 1)
  const pct = (v: number) => `${Math.min(100, (v / maxBar) * 100)}%`

  return (
    <div className="p-5 bg-papier-card border border-encre/15">
      <h3 className="text-lg font-display font-semibold text-encre mb-1">Êtes-vous sur la bonne trajectoire pour votre retraite?</h3>
      <p className="text-xs text-encre/50 mb-5">Quelques chiffres suffisent pour le savoir en direct</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <ChampMontant label="Votre âge" suffix="ans"
          value={data.retraiteAgeActuel || data.age}
          onSet={v => onChange({ retraiteAgeActuel: v })} />
        <ChampMontant label="Retraite visée à" suffix="ans" placeholder="65"
          value={data.retraiteAgeVise}
          onSet={v => onChange({ retraiteAgeVise: v })} />
        <ChampMontant label="Épargne accumulée"
          value={data.retraiteEpargneActuelle}
          onSet={v => onChange({ retraiteEpargneActuelle: v })} />
        <ChampMontant label="Épargne mensuelle actuelle"
          value={data.retraiteEpargneMensuelle}
          onSet={v => onChange({ retraiteEpargneMensuelle: v })} />
        <ChampMontant label="Revenu annuel souhaité à la retraite"
          value={data.retraiteRevenuVise}
          onSet={v => onChange({ retraiteRevenuVise: v })} />
      </div>

      {/* Rendement ajustable */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold text-encre/70 font-ledger">Rendement annuel moyen</span>
          <span className="font-bold text-encre font-ledger">{rendement} %</span>
        </div>
        <input type="range" min={2} max={10} step={0.5} value={rendement}
          onChange={e => setRendement(parseFloat(e.target.value))}
          className="w-full accent-sceau" />
        <div className="flex justify-between text-[10px] text-encre/40 font-ledger">
          <span>2 % (CPG)</span><span>6 % (équilibré)</span><span>10 % (croissance)</span>
        </div>
      </div>

      {aDonnees ? (
        <>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/60">Capital nécessaire ({fmt(revenuVise)}/an de revenu)</span>
                <span className="font-bold text-encre/80 font-ledger">{fmt(capitalNecessaire)}</span>
              </div>
              <div className="w-full bg-encre/10 h-2 overflow-hidden">
                <div className="h-full bg-manille-dark transition-all duration-500" style={{ width: pct(capitalNecessaire) }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-encre/60">Votre trajectoire actuelle à {ageVise} ans</span>
                <span className={`font-bold font-ledger ${ecart > 0 ? 'text-sceau' : 'text-sauge'}`}>{fmt(capitalProjete)}</span>
              </div>
              <div className="w-full bg-encre/10 h-2 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${ecart > 0 ? 'bg-sceau' : 'bg-sauge'}`}
                  style={{ width: pct(capitalProjete) }} />
              </div>
            </div>
          </div>

          <div className={`mt-5 border p-5 text-center ${ecart > 0 ? 'bg-sceau-light border-sceau/40' : 'bg-sauge-light border-sauge/40'}`}>
            {ecart > 0 ? (
              <>
                <p className="text-xs font-ledger tracking-wide text-sceau">ÉCART PROJETÉ À LA RETRAITE</p>
                <p className="text-3xl font-display font-semibold text-sceau mt-1">− {fmt(ecart)}</p>
                <p className="text-xs text-sceau/80 mt-3">
                  Pour combler l&apos;écart, il faudrait épargner{' '}
                  <strong>{fmt(mensuelleRequise)}/mois</strong>
                  {mensuelle > 0 && <> (vous épargnez actuellement {fmt(mensuelle)}/mois)</>}.
                  Une stratégie adaptée peut réduire ce chiffre. C&apos;est ça qu&apos;on bâtit ensemble.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-ledger tracking-wide text-sauge">BONNE TRAJECTOIRE</p>
                <p className="text-xs text-sauge/80 mt-2">
                  Prochaine étape : valider que cette projection tient compte de l&apos;inflation, de la fiscalité
                  et du bon ordre de décaissement (REER, CELI, non-enregistré).
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-encre/40 py-4">
          Remplissez l&apos;âge, l&apos;âge de retraite visé et le revenu souhaité pour voir la projection.
        </p>
      )}
    </div>
  )
}
