'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const REGIMES = ['CELI', 'CELIAPP', 'REER', 'REEE']

export default function Step2Autonomie({ data, onChange }: Props) {
  const toggleRegime = (r: string) => {
    const updated = data.regimes.includes(r)
      ? data.regimes.filter(x => x !== r)
      : [...data.regimes, r]
    onChange({ regimes: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">Autonomie financière</div>
        <p className="text-sm text-gray-600 mb-2">
          Que signifie être <strong>financièrement autonome</strong> pour vous?
        </p>
        <textarea
          className="input h-24 resize-none"
          value={data.significationAutonomie}
          onChange={e => onChange({ significationAutonomie: e.target.value })}
        />
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
          Quel événement de vie pourrait perturber votre autonomie financière?
        </p>
        <textarea
          className="input h-20 resize-none"
          value={data.evenementPerturbateur}
          onChange={e => onChange({ evenementPerturbateur: e.target.value })}
        />
      </div>

      <div>
        <p className="text-sm text-gray-700 font-medium mb-2">
          Est-ce que vous cotisez déjà à ces régimes? (Cochez tous ceux qui s&apos;appliquent)
        </p>
        <div className="flex flex-wrap gap-4">
          {REGIMES.map(r => (
            <label key={r} className="radio-label">
              <input type="checkbox" checked={data.regimes.includes(r)}
                onChange={() => toggleRegime(r)} />
              {r}
            </label>
          ))}
        </div>
        <div className="mt-3">
          <label className="field-label">Autres régimes</label>
          <input className="input" value={data.autresRegimes}
            onChange={e => onChange({ autresRegimes: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
