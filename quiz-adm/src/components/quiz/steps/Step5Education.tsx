'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const ECOLES = [
  { id: 'ecole1', label: 'En premier, ceux qui croient que leurs enfants (ou petits-enfants) devraient assumer l\'entière responsabilité de leurs frais d\'études' },
  { id: 'ecole2', label: 'En deuxième, ceux qui souhaitent défrayer en partie le financement des études de leurs enfants (ou petits-enfants), pour autant qu\'ils y contribuent également' },
  { id: 'ecole3', label: 'En troisième, ceux qui croient que le plus bel héritage qu\'ils peuvent léguer à leurs enfants (ou petits-enfants) est de financer la totalité de leurs études' },
]

export default function Step5Education({ data, onChange }: Props) {
  const toggleEcole = (id: string) => {
    const updated = data.ecolesPensee.includes(id)
      ? data.ecolesPensee.filter(e => e !== id)
      : [...data.ecolesPensee, id]
    onChange({ ecolesPensee: updated })
  }

  return (
    <div className="space-y-6">
      <div className="section-title">Éducation</div>

      <p className="text-sm text-gray-600">
        Concernant les études des enfants, on trouve généralement trois écoles de pensée chez les parents (ou grands-parents) comme vous. Laquelle vous rejoint le plus dans votre façon de voir les choses pour vos enfants (ou petits-enfants)?
      </p>

      <div className="space-y-3">
        {ECOLES.map(e => (
          <label key={e.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-md border border-gray-200 hover:border-ia-blue hover:bg-ia-lightblue transition-colors">
            <input type="checkbox" className="mt-0.5" checked={data.ecolesPensee.includes(e.id)}
              onChange={() => toggleEcole(e.id)} />
            <span className="text-sm">{e.label}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="field-label">Avez-vous mis en place une stratégie jusqu&apos;à maintenant pour vos enfants (ou petits-enfants)?</p>
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
          <p className="field-label">Êtes-vous certain à <strong>100%</strong> que la stratégie que vous mettez en place aujourd&apos;hui vous permettra de réaliser votre objectif?</p>
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
        Vous savez qu&apos;il existe des programmes qui permettent non seulement d&apos;atteindre cet objectif, mais aussi de s&apos;assurer que vous profiterez au maximum des subventions gouvernementales?
      </div>
    </div>
  )
}
