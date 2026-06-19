'use client'
import { QuizData, Reference } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

export default function Step9References({ data, onChange }: Props) {
  const updateRef = (i: number, field: keyof Reference, val: string) => {
    const updated = data.references.map((r, idx) =>
      idx === i ? { ...r, [field]: val } : r
    )
    onChange({ references: updated })
  }

  return (
    <div className="space-y-6">
      <div className="section-title">Références</div>
      <p className="text-sm text-gray-600">
        Pensez à 5 personnes qui seraient intéressées à participer au sondage. L&apos;objectif est de rencontrer minimum 10 personnes par semaine pour atteindre notre objectif annuel.
      </p>

      <div className="space-y-6">
        {data.references.map((ref, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-ia-blue text-sm">Référence #{i + 1}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="field-label">Nom</label>
                <input className="input" value={ref.nom}
                  onChange={e => updateRef(i, 'nom', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Tél. domicile</label>
                <input className="input" value={ref.telDom}
                  onChange={e => updateRef(i, 'telDom', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Cellulaire</label>
                <input className="input" value={ref.cell}
                  onChange={e => updateRef(i, 'cell', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Lien (ami, famille...)</label>
                <input className="input" value={ref.lien}
                  onChange={e => updateRef(i, 'lien', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Emploi</label>
                <input className="input" value={ref.emploi}
                  onChange={e => updateRef(i, 'emploi', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Nbre d&apos;enfant(s)</label>
                <input className="input w-24" type="number" value={ref.nbreEnfants}
                  onChange={e => updateRef(i, 'nbreEnfants', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Statut civil</label>
                <input className="input" value={ref.statutCivil}
                  onChange={e => updateRef(i, 'statutCivil', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Statut d&apos;habitation</label>
                <div className="radio-group">
                  {(['proprietaire', 'locataire'] as const).map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name={`statut-${i}`} value={v}
                        checked={ref.statut === v}
                        onChange={() => updateRef(i, 'statut', v)} />
                      {v === 'proprietaire' ? 'Propriétaire' : 'Locataire'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
