'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const ASSURANCES: { key: keyof QuizData; emoji: string; titre: string; desc: string }[] = [
  { key: 'aAssuranceVie', emoji: '💙', titre: 'Assurance vie', desc: 'Protège vos proches en cas de décès' },
  { key: 'aAssuranceInvalidite', emoji: '🛡️', titre: 'Assurance invalidité', desc: 'Remplace votre revenu si vous ne pouvez plus travailler' },
  { key: 'aAssuranceMaladieGrave', emoji: '🏥', titre: 'Assurance maladie grave', desc: 'Montant forfaitaire au diagnostic (cancer, AVC…)' },
]

export default function StepAssurancesActuelles({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-brand-900">Vos assurances actuelles</h2>
        <p className="text-sm text-slate-500 mt-1">Faisons le tour de ce que vous détenez déjà</p>
      </div>

      <div className="space-y-4">
        {ASSURANCES.map(a => {
          const val = data[a.key] as string
          return (
            <div key={a.key} className={`p-4 rounded-xl border-2 transition-all ${val ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{a.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{a.titre}</p>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['oui', 'non'] as const).map(v => (
                    <label key={v} className={`flex items-center justify-center gap-1 px-5 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
                      val === v
                        ? v === 'oui' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}>
                      <input type="radio" name={a.key} value={v}
                        checked={val === v}
                        onChange={() => onChange({ [a.key]: v } as Partial<QuizData>)}
                        className="sr-only" />
                      {v === 'oui' ? '✓ Oui' : '✗ Non'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="insight-box">
        Détenir une assurance, c’est bien. S’assurer qu’elle correspond toujours à votre situation actuelle, c’est encore mieux. Nous pourrons réviser vos protections ensemble.
      </div>
    </div>
  )
}
