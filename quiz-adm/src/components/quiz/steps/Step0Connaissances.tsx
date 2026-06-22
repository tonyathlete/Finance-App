'use client'
import { QuizData } from '@/lib/types'
import DiagnosticExpress from '@/components/quiz/DiagnosticExpress'
import SentimentEconomique from '@/components/quiz/steps/SentimentEconomique'
import InvestmentGraph from '@/components/quiz/InvestmentGraph'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

interface Niveau { value: string; label: string; emoji: string; desc: string; exemples: string[] }

const NIVEAUX_BOURSE: Niveau[] = [
  {
    value: 'debutant', label: 'Débutant', emoji: '🌱',
    desc: 'Peu ou pas de connaissance',
    exemples: ['Je ne sais pas ce qu\'est une action', 'J\'entends parler de la bourse mais ça m\'est étranger'],
  },
  {
    value: 'intermediaire', label: 'Intermédiaire', emoji: '📈',
    desc: 'Quelques notions de base',
    exemples: ['Je sais ce que sont les actions et obligations', 'J\'ai déjà vu des graphiques boursiers'],
  },
  {
    value: 'avance', label: 'Avancé', emoji: '🎯',
    desc: 'Bonne maîtrise du sujet',
    exemples: ['Je comprends les indices (S&P 500, TSX)', 'Je suis l\'actualité financière régulièrement'],
  },
]

const NIVEAUX_PLACEMENTS: Niveau[] = [
  {
    value: 'debutant', label: 'Débutant', emoji: '🌱',
    desc: 'Peu ou pas de connaissance',
    exemples: ['Je ne sais pas la différence entre un CELI et un REER', 'Je ne sais pas comment cotiser'],
  },
  {
    value: 'intermediaire', label: 'Intermédiaire', emoji: '📈',
    desc: 'Quelques notions de base',
    exemples: ['Je connais les noms (CELI, REER…) sans maîtriser les règles', 'J\'ai un compte mais quelqu\'un d\'autre gère'],
  },
  {
    value: 'avance', label: 'Avancé', emoji: '🎯',
    desc: 'Bonne maîtrise du sujet',
    exemples: ['Je comprends les plafonds, les avantages fiscaux de chaque régime', 'Je gère moi-même mes placements'],
  },
]

const NIVEAUX_ASSURANCES: Niveau[] = [
  {
    value: 'debutant', label: 'Débutant', emoji: '🌱',
    desc: 'Peu ou pas de connaissance',
    exemples: ['Je ne connais pas la différence entre invalidité et maladie grave', 'J\'ai ce que l\'on m\'a donné sans vraiment comprendre'],
  },
  {
    value: 'intermediaire', label: 'Intermédiaire', emoji: '📈',
    desc: 'Quelques notions de base',
    exemples: ['Je sais qu\'il existe assurance vie, invalidité, maladie grave', 'J\'ai une idée générale mais pas les détails'],
  },
  {
    value: 'avance', label: 'Avancé', emoji: '🎯',
    desc: 'Bonne maîtrise du sujet',
    exemples: ['Je comprends les différences permanente/temporaire, collectif/privé', 'Je sais ce que je paie et ce que ça couvre exactement'],
  },
]

const PRODUITS = ['CELI', 'CELIAPP', 'REER', 'REEE', 'Non-enregistré']

function NiveauSelector({ name, value, niveaux, onChange }: {
  name: string; value: string; niveaux: Niveau[]; onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {niveaux.map(n => (
        <label
          key={n.value}
          className={`flex flex-col items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            value === n.value
              ? 'border-brand-500 bg-brand-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <input type="radio" name={name} value={n.value} checked={value === n.value}
            onChange={() => onChange(n.value)} className="sr-only" />
          <span className="text-2xl mb-2">{n.emoji}</span>
          <span className={`text-sm font-bold mb-1 ${value === n.value ? 'text-brand-700' : 'text-slate-700'}`}>{n.label}</span>
          <span className="text-xs text-slate-500 leading-tight mb-2">{n.desc}</span>
          <ul className="space-y-1">
            {n.exemples.map((ex, i) => (
              <li key={i} className="text-[10px] text-slate-400 leading-tight flex gap-1">
                <span className="shrink-0">•</span>{ex}
              </li>
            ))}
          </ul>
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
        <h2 className="text-xl font-bold text-brand-900">Votre situation économique</h2>
        <p className="text-sm text-slate-500 mt-1">Dites-moi ce que vous pensez vraiment, on n'est pas à l'examen.</p>
      </div>

      {/* Sentiment économique — leur avis sur la situation actuelle */}
      <SentimentEconomique data={data} onChange={onChange} />

      <div className="section-title">Vos connaissances financières</div>

      {/* Diagnostic express interactif selon le profil */}
      <DiagnosticExpress data={data} onChange={onChange} />

      {/* Marché boursier */}
      <div>
        <div className="section-title">Marché boursier</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du marché boursier?</p>
        <NiveauSelector
          name="connaissanceBourse"
          value={data.connaissanceBourse}
          niveaux={NIVEAUX_BOURSE}
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
          niveaux={NIVEAUX_PLACEMENTS}
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

        <div className="mt-5">
          <InvestmentGraph />
        </div>
      </div>

      {/* Assurances — niveau de connaissance seulement */}
      <div>
        <div className="section-title">Assurances</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du fonctionnement des assurances?</p>
        <NiveauSelector
          name="connaissanceAssurances"
          value={data.connaissanceAssurances}
          niveaux={NIVEAUX_ASSURANCES}
          onChange={v => onChange({ connaissanceAssurances: v as QuizData['connaissanceAssurances'] })}
        />
      </div>
    </div>
  )
}
