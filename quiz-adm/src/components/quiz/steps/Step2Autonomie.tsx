'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const SIGNIFICATION_OPTIONS = [
  'Vivre sans dépendre d\'un salaire ou d\'une aide extérieure',
  'Avoir assez d\'épargne pour ma retraite',
  'Couvrir mes dépenses sans travailler',
  'Je ne sais pas encore',
]

const EVENEMENT_OPTIONS = [
  'Perte d\'emploi / mise à pied',
  'Maladie grave ou invalidité',
  'Décès du/de la conjoint(e)',
  'Divorce / séparation',
  'Retraite anticipée',
  'Autre',
]

export default function Step2Autonomie({ data, onChange }: Props) {
  const toggleEvenement = (opt: string) => {
    const current = data.evenementPerturbateur
    const updated = current.includes(opt)
      ? current.filter(x => x !== opt)
      : [...current, opt]
    onChange({ evenementPerturbateur: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">Autonomie financière</div>
        <p className="text-sm text-gray-600 mb-2">
          Que signifie être <strong>financièrement autonome</strong> pour vous?
        </p>
        <div className="space-y-2 mt-2">
          {SIGNIFICATION_OPTIONS.map((opt, i) => (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              data.significationAutonomie === opt
                ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              <input type="radio" className="sr-only" name="significationAutonomie" value={opt}
                checked={data.significationAutonomie === opt}
                onChange={() => onChange({ significationAutonomie: opt })} />
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                data.significationAutonomie === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-700 font-medium mb-2">
          Est-ce que votre revenu et celui de votre conjoint(e) sont nécessaires pour couvrir vos dépenses et obligations mensuelles?
        </p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="revenuConjoint" value={v}
                checked={data.revenuConjointNecessaire === v}
                onChange={() => onChange({ revenuConjointNecessaire: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-700 font-medium mb-2">
          Quel événement de vie pourrait perturber votre autonomie financière? (Plusieurs choix possibles)
        </p>
        <div className="space-y-2 mt-2">
          {EVENEMENT_OPTIONS.map((opt, i) => (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              data.evenementPerturbateur.includes(opt)
                ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              <input type="checkbox" className="sr-only" value={opt}
                checked={data.evenementPerturbateur.includes(opt)}
                onChange={() => toggleEvenement(opt)} />
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                data.evenementPerturbateur.includes(opt) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </label>
          ))}
        </div>
      </div>

    </div>
  )
}
