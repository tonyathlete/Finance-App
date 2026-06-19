'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

interface Choix { value: string; label: string; emoji: string }

const SENTIMENT_ECONOMIE: Choix[] = [
  { value: 'confiant', label: 'Confiant(e)', emoji: '😄' },
  { value: 'neutre', label: 'Neutre', emoji: '😐' },
  { value: 'inquiet', label: 'Inquiet(ète)', emoji: '😟' },
  { value: 'tres_inquiet', label: 'Très inquiet(ète)', emoji: '😰' },
]

const STRESS_AVENIR: Choix[] = [
  { value: 'non', label: 'Non, je me sens en contrôle', emoji: '😌' },
  { value: 'un_peu', label: 'Un peu, par moments', emoji: '😕' },
  { value: 'oui', label: 'Oui, ça m\'habite souvent', emoji: '😖' },
]

const INFLATION_IMPACT: Choix[] = [
  { value: 'beaucoup', label: 'Beaucoup — je le sens chaque mois', emoji: '📈' },
  { value: 'un_peu', label: 'Un peu, mais gérable', emoji: '📊' },
  { value: 'pas_vraiment', label: 'Pas vraiment d\'impact senti', emoji: '✅' },
]

const CONFIANCE_BOURSE: Choix[] = [
  { value: 'tres_confiant', label: 'Très confiant(e)', emoji: '🚀' },
  { value: 'confiant', label: 'Plutôt confiant(e)', emoji: '🙂' },
  { value: 'incertain', label: 'Incertain(e)', emoji: '🤔' },
  { value: 'mefiant', label: 'Méfiant(e)', emoji: '😬' },
]

const CRAINT_RECESSION: Choix[] = [
  { value: 'oui', label: 'Oui, je m\'y attends', emoji: '⛈️' },
  { value: 'incertain', label: 'Je ne sais pas trop', emoji: '🌥️' },
  { value: 'non', label: 'Non, pas vraiment', emoji: '☀️' },
]

const INQUIETUDES = [
  'Taux d\'intérêt',
  'Inflation / coût de la vie',
  'Marché de l\'emploi',
  'Marché immobilier',
  'Ma retraite',
  'Mes placements actuels',
  'Rien en particulier',
]

function ChoixCards({ name, value, choix, onChange }: {
  name: string; value: string; choix: Choix[]; onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
      {choix.map(c => (
        <label
          key={c.value}
          className={`flex flex-col items-center text-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            value === c.value
              ? 'border-brand-500 bg-brand-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <input type="radio" name={name} value={c.value} checked={value === c.value}
            onChange={() => onChange(c.value)} className="sr-only" />
          <span className="text-xl">{c.emoji}</span>
          <span className={`text-xs font-semibold leading-tight ${value === c.value ? 'text-brand-700' : 'text-slate-600'}`}>
            {c.label}
          </span>
        </label>
      ))}
    </div>
  )
}

export default function SentimentEconomique({ data, onChange }: Props) {
  const toggleInquietude = (i: string) => {
    const updated = data.principalesInquietudes.includes(i)
      ? data.principalesInquietudes.filter(x => x !== i)
      : [...data.principalesInquietudes, i]
    onChange({ principalesInquietudes: updated })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-5">
        <p className="text-sm font-bold text-brand-900 flex items-center gap-2 mb-1">
          🗞️ Avant tout — parlons de l&apos;économie
        </p>
        <p className="text-xs text-slate-500">
          Comment vous voyez ça, vous, en ce moment? J&apos;veux juste votre vraie opinion.
        </p>
      </div>

      <div>
        <p className="field-label">Comment vous sentez-vous par rapport à la situation économique actuelle du Canada?</p>
        <ChoixCards name="sentimentEconomieCanada" value={data.sentimentEconomieCanada}
          choix={SENTIMENT_ECONOMIE} onChange={v => onChange({ sentimentEconomieCanada: v as QuizData['sentimentEconomieCanada'] })} />
      </div>

      <div>
        <p className="field-label">Êtes-vous stressé(e) par rapport à votre avenir financier?</p>
        <ChoixCards name="stressAvenirFinancier" value={data.stressAvenirFinancier}
          choix={STRESS_AVENIR} onChange={v => onChange({ stressAvenirFinancier: v as QuizData['stressAvenirFinancier'] })} />
      </div>

      <div>
        <p className="field-label">L&apos;inflation des dernières années a-t-elle affecté votre pouvoir d&apos;achat?</p>
        <ChoixCards name="inflationImpact" value={data.inflationImpact}
          choix={INFLATION_IMPACT} onChange={v => onChange({ inflationImpact: v as QuizData['inflationImpact'] })} />
      </div>

      <div>
        <p className="field-label">Quel est votre niveau de confiance envers le marché boursier actuellement?</p>
        <ChoixCards name="confianceMarcheBoursier" value={data.confianceMarcheBoursier}
          choix={CONFIANCE_BOURSE} onChange={v => onChange({ confianceMarcheBoursier: v as QuizData['confianceMarcheBoursier'] })} />
      </div>

      <div>
        <p className="field-label">Craignez-vous une récession au cours de la prochaine année?</p>
        <ChoixCards name="craintRecession" value={data.craintRecession}
          choix={CRAINT_RECESSION} onChange={v => onChange({ craintRecession: v as QuizData['craintRecession'] })} />
      </div>

      <div>
        <p className="field-label">Qu&apos;est-ce qui vous préoccupe le plus actuellement? <span className="text-slate-400 font-normal">(plusieurs choix)</span></p>
        <div className="flex flex-wrap gap-2 mt-2">
          {INQUIETUDES.map(i => (
            <label key={i} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 cursor-pointer transition-all text-xs font-medium ${
              data.principalesInquietudes.includes(i)
                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}>
              <input type="checkbox" className="sr-only" checked={data.principalesInquietudes.includes(i)}
                onChange={() => toggleInquietude(i)} />
              {data.principalesInquietudes.includes(i) && '✓ '}{i}
            </label>
          ))}
        </div>
      </div>

      {(data.stressAvenirFinancier === 'oui' || data.sentimentEconomieCanada === 'tres_inquiet') && (
        <div className="insight-box">
          Vous êtes loin d&apos;être seul(e) à ressentir ça. C&apos;est exactement pour ça qu&apos;on fait cet exercice aujourd&apos;hui.
        </div>
      )}
    </div>
  )
}
