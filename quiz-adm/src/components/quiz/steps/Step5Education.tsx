'use client'
import { QuizData } from '@/lib/types'
import RevealCard from '@/components/quiz/RevealCard'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const ECOLES = [
  { id: 'ecole1', label: 'Mes enfants devraient assumer eux-mêmes leurs frais d\'études' },
  { id: 'ecole2', label: 'Je souhaite financer une partie, s\'ils contribuent aussi' },
  { id: 'ecole3', label: 'Le plus bel héritage est de financer la totalité de leurs études' },
]

export default function Step5Education({ data, onChange }: Props) {
  const aEnfants = data.enfants.length > 0

  const toggleEcole = (id: string) => {
    const updated = data.ecolesPensee.includes(id)
      ? data.ecolesPensee.filter(e => e !== id)
      : [...data.ecolesPensee, id]
    onChange({ ecolesPensee: updated })
  }

  return (
    <div className="space-y-6">
      <div className="section-title">Éducation des enfants</div>

      {/* Accroche : coût réel des études */}
      <RevealCard
        emoji="🎓"
        teaser="Combien coûte un parcours universitaire avec résidence aujourd'hui?"
        value={80000}
        prefix="+ de "
        caption="La bonne nouvelle : le REEE offre des subventions gouvernementales pouvant atteindre 30 % — de l'argent gratuit qui s'ajoute à votre épargne. Plus on commence tôt, plus l'effet est puissant."
      />

      {!aEnfants && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Aucun enfant n’a été indiqué. Si vous prévoyez en avoir (ou avez des petits-enfants),
          il existe des stratégies pour préparer leur avenir dès aujourd’hui.
        </div>
      )}

      <div>
        <p className="field-label">Quelle approche vous rejoint le plus pour {aEnfants ? 'vos enfants' : 'vos (futurs) enfants ou petits-enfants'}?</p>
        <div className="space-y-2 mt-2">
          {ECOLES.map((e, i) => (
            <label key={e.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              data.ecolesPensee.includes(e.id)
                ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              <input type="checkbox" className="sr-only" checked={data.ecolesPensee.includes(e.id)}
                onChange={() => toggleEcole(e.id)} />
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                data.ecolesPensee.includes(e.id) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              {e.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Avez-vous déjà une stratégie d’épargne-études en place?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="strategieEducation" value={v}
                checked={data.strategieEducation === v}
                onChange={() => onChange({ strategieEducation: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.strategieEducation === 'oui' && (
        <div>
          <p className="field-label">Êtes-vous certain de <strong>maximiser les subventions</strong> disponibles?</p>
          <div className="radio-group">
            {(['oui', 'non'] as const).map(v => (
              <label key={v} className="radio-label">
                <input type="radio" name="certainStrategieEducation" value={v}
                  checked={data.certainStrategieEducation === v}
                  onChange={() => onChange({ certainStrategieEducation: v })} />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="insight-box">
        Une stratégie REEE bien structurée permet non seulement d’atteindre l’objectif, mais aussi d’aller chercher
        le maximum des subventions gouvernementales auxquelles vous avez droit.
      </div>
    </div>
  )
}
