'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

export default function Step3Invalidite({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Invalidité</div>

      <div>
        <p className="field-label">Détenez-vous des protections en cas d&apos;invalidité?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="protectionInvalidite" value={v}
                checked={data.protectionInvalidite === v}
                onChange={() => onChange({ protectionInvalidite: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.protectionInvalidite === 'oui' && (
        <div>
          <label className="field-label">
            Selon vos protections actuelles, quel pourcentage de votre salaire est couvert?
          </label>
          <input className="input" value={data.pourcentageSalaireConvert}
            onChange={e => onChange({ pourcentageSalaireConvert: e.target.value })}
            placeholder="Ex: 70%" />
        </div>
      )}

      <div>
        <label className="field-label">
          À la suite d&apos;une invalidité plus ou moins longue, pendant combien de temps seriez-vous en mesure d&apos;assumer vos obligations financières actuelles?
        </label>
        <input className="input" value={data.tempsPourAssumer}
          onChange={e => onChange({ tempsPourAssumer: e.target.value })}
          placeholder="Ex: 3 mois, 6 mois, 1 an..." />
      </div>

      <div>
        <p className="field-label">
          Avez-vous déjà fait l&apos;exercice de déterminer quel serait votre coût de vie mensuel advenant une invalidité?
        </p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="calculCoutVie" value={v}
                checked={data.calculCoutVie === v}
                onChange={() => onChange({ calculCoutVie: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.calculCoutVie === 'oui' && (
        <div>
          <label className="field-label">De quelle façon l&apos;avez-vous établi? Et quand?</label>
          <textarea className="input h-20 resize-none" value={data.commentEtabli}
            onChange={e => onChange({ commentEtabli: e.target.value })} />
        </div>
      )}

      <div className="insight-box">
        À l&apos;aide d&apos;un outil, il est possible d&apos;établir clairement quel serait le scénario pour vous dans une telle situation.
      </div>
    </div>
  )
}
