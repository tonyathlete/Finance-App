'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const NIVEAUX = [
  { value: 'debutant', label: 'Débutant', desc: 'Je connais très peu ou pas du tout', emoji: '🌱' },
  { value: 'intermediaire', label: 'Intermédiaire', desc: 'J\'ai quelques notions de base', emoji: '📈' },
  { value: 'avance', label: 'Avancé', desc: 'Je m\'y connais bien', emoji: '🎯' },
]

const PRODUITS = ['CELI', 'CELIAPP', 'REER', 'REEE', 'Non-enregistré']

function NiveauSelector({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {NIVEAUX.map(n => (
        <label
          key={n.value}
          className={`flex flex-col items-center text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            value === n.value
              ? 'border-brand-500 bg-brand-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <input type="radio" name={name} value={n.value} checked={value === n.value}
            onChange={() => onChange(n.value)} className="sr-only" />
          <span className="text-2xl mb-2">{n.emoji}</span>
          <span className={`text-sm font-bold mb-1 ${value === n.value ? 'text-brand-700' : 'text-slate-700'}`}>{n.label}</span>
          <span className="text-xs text-slate-500 leading-tight">{n.desc}</span>
        </label>
      ))}
    </div>
  )
}

export default function Step0Connaissances({ data, onChange }: Props) {
  const toggleProduit = (p: string) => {
    const updated = data.produitsPlacements.includes(p)
      ? data.produitsPlacements.filter(x => x !== p)
      : [...data.produitsPlacements, p]
    onChange({ produitsPlacements: updated })
  }

  return (
    <div className="space-y-8">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-brand-900">Vos connaissances financières</h2>
        <p className="text-sm text-slate-500 mt-1">Aucune bonne ou mauvaise réponse — soyez honnête!</p>
      </div>

      {/* Marché boursier */}
      <div>
        <div className="section-title">Marché boursier</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du marché boursier?</p>
        <NiveauSelector
          name="connaissanceBourse"
          value={data.connaissanceBourse}
          onChange={v => onChange({ connaissanceBourse: v as QuizData['connaissanceBourse'] })}
        />
      </div>

      {/* Fonds de placements */}
      <div>
        <div className="section-title">Fonds de placements</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance des fonds de placements?</p>
        <NiveauSelector
          name="connaissancePlacements"
          value={data.connaissancePlacements}
          onChange={v => onChange({ connaissancePlacements: v as QuizData['connaissancePlacements'] })}
        />
        <div className="mt-5">
          <p className="field-label">Lesquels possédez-vous déjà? <span className="text-slate-400 font-normal">(cochez tout ce qui s&apos;applique)</span></p>
          <div className="flex flex-wrap gap-3 mt-2">
            {PRODUITS.map(p => (
              <label key={p} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                data.produitsPlacements.includes(p)
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
              }`}>
                <input type="checkbox" className="sr-only" checked={data.produitsPlacements.includes(p)}
                  onChange={() => toggleProduit(p)} />
                <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center text-xs shrink-0 ${
                  data.produitsPlacements.includes(p) ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'
                }`}>
                  {data.produitsPlacements.includes(p) && '✓'}
                </span>
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Assurances */}
      <div>
        <div className="section-title">Assurances</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du fonctionnement des assurances?</p>
        <NiveauSelector
          name="connaissanceAssurances"
          value={data.connaissanceAssurances}
          onChange={v => onChange({ connaissanceAssurances: v as QuizData['connaissanceAssurances'] })}
        />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border-2 transition-all ${data.aAssuranceMaladieGrave ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-sm font-semibold text-slate-700 mb-3">🏥 Assurance maladie grave</p>
            <p className="text-xs text-slate-500 mb-3">Possédez-vous une assurance maladie grave?</p>
            <div className="flex gap-3">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
                  data.aAssuranceMaladieGrave === v
                    ? v === 'oui' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                  <input type="radio" name="maladieGrave" value={v}
                    checked={data.aAssuranceMaladieGrave === v}
                    onChange={() => onChange({ aAssuranceMaladieGrave: v })}
                    className="sr-only" />
                  {v === 'oui' ? '✓ Oui' : '✗ Non'}
                </label>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 transition-all ${data.aAssuranceInvalidite ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-sm font-semibold text-slate-700 mb-3">🛡️ Assurance invalidité</p>
            <p className="text-xs text-slate-500 mb-3">Possédez-vous une assurance invalidité?</p>
            <div className="flex gap-3">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
                  data.aAssuranceInvalidite === v
                    ? v === 'oui' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                  <input type="radio" name="assuranceInvalidite" value={v}
                    checked={data.aAssuranceInvalidite === v}
                    onChange={() => onChange({ aAssuranceInvalidite: v })}
                    className="sr-only" />
                  {v === 'oui' ? '✓ Oui' : '✗ Non'}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
