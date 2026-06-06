'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

export default function Step8Testament({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Testament et mandat</div>

      <div>
        <p className="field-label">Avez-vous, vous et votre conjoint(e), rédigé un testament ainsi qu&apos;un mandat en cas d&apos;inaptitude (Québec)?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="testamentMandat" value={v}
                checked={data.testamentMandat === v}
                onChange={() => onChange({ testamentMandat: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.testamentMandat === 'oui' && (
        <div>
          <p className="field-label">Sont-ils enregistrés auprès d&apos;un notaire ou d&apos;un avocat (Québec)?</p>
          <div className="radio-group">
            {(['oui', 'non'] as const).map(v => (
              <label key={v} className="radio-label">
                <input type="radio" name="enregistreNotaire" value={v}
                  checked={data.enregistreNotaire === v}
                  onChange={() => onChange({ enregistreNotaire: v })} />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="field-label">Avez-vous, vous et votre conjoint(e), rédigé un testament ainsi qu&apos;une procuration (hors Québec)?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="testamentProcuration" value={v}
                checked={data.testamentProcuration === v}
                onChange={() => onChange({ testamentProcuration: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="section-title">Sans testament</div>
      <div>
        <p className="field-label">Connaissez-vous les conséquences d&apos;un décès sans testament?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="connaissanceConsequences" value={v}
                checked={data.connaissanceConsequences === v}
                onChange={() => onChange({ connaissanceConsequences: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
