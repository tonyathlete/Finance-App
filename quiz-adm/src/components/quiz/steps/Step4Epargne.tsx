'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

export default function Step4Epargne({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Épargne</div>

      <div>
        <p className="field-label">Est-ce important pour vous d&apos;épargner systématiquement une partie de votre revenu annuel?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="importantEpargner" value={v}
                checked={data.importantEpargner === v}
                onChange={() => onChange({ importantEpargner: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.importantEpargner === 'oui' && (
        <div>
          <label className="field-label">Dans quel but?</label>
          <input className="input" value={data.butEpargne}
            onChange={e => onChange({ butEpargne: e.target.value })} />
        </div>
      )}
      {data.importantEpargner === 'non' && (
        <div>
          <label className="field-label">Pourquoi?</label>
          <input className="input" value={data.pourquoiPasEpargne}
            onChange={e => onChange({ pourquoiPasEpargne: e.target.value })} />
        </div>
      )}

      <div>
        <p className="field-label">Pensez-vous pouvoir planifier votre retraite adéquatement, sans aide?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="planifierRetraite" value={v}
                checked={data.planifierRetraite === v}
                onChange={() => onChange({ planifierRetraite: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="field-label">À quel âge prévoyez-vous prendre votre retraite?</label>
        <input className="input w-32" type="number" value={data.ageRetraite}
          onChange={e => onChange({ ageRetraite: e.target.value })} />
      </div>

      <div>
        <p className="field-label">Jusqu&apos;à maintenant, avez-vous mis en place une stratégie?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="strategieEnPlace" value={v}
                checked={data.strategieEnPlace === v}
                onChange={() => onChange({ strategieEnPlace: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.strategieEnPlace === 'oui' && (
        <>
          <div>
            <p className="field-label">Êtes-vous certain à <strong>100%</strong> que les stratégies mises en place vous permettront d&apos;y parvenir?</p>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="certainStrategieRetraite" value={v}
                    checked={data.certainStrategieRetraite === v}
                    onChange={() => onChange({ certainStrategieRetraite: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">De quelle façon l&apos;avez-vous évalué? Et à quand remonte cette évaluation?</label>
            <textarea className="input h-20 resize-none" value={data.commentEvalue}
              onChange={e => onChange({ commentEvalue: e.target.value })} />
          </div>
        </>
      )}

      <div className="insight-box">
        C&apos;est intéressant! Saviez-vous qu&apos;il y a des stratégies qui permettent aux gens d&apos;atteindre leurs objectifs d&apos;épargne tout en bénéficiant d&apos;avantages qui sont uniques aux compagnies d&apos;assurance?
      </div>
    </div>
  )
}
