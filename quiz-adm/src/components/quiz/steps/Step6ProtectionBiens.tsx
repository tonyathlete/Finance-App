'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const FREQUENCES = ['Chaque année', 'Aux deux ans', 'Une fois par 3, 4 ou 5 ans', 'Moins d\'une fois par 5 ans', 'Jamais']
const MODES = ['En ligne (sur Internet)', 'Par téléphone', 'En personne (j\'ai besoin d\'assistance)']

export default function Step6ProtectionBiens({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Protection des biens</div>

      <div>
        <p className="field-label font-semibold">Détenez-vous une assurance :</p>
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm">Auto</span>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="assuranceAuto" value={v}
                    checked={data.assuranceAuto === v}
                    onChange={() => onChange({ assuranceAuto: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm">Habitation</span>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="assuranceHabitation" value={v}
                    checked={data.assuranceHabitation === v}
                    onChange={() => onChange({ assuranceHabitation: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="field-label">À quel mois devez-vous renouveler vos assurances?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="field-label">Auto</label>
            <input className="input" value={data.renouvellementAuto}
              onChange={e => onChange({ renouvellementAuto: e.target.value })}
              placeholder="Ex: Janvier" />
          </div>
          <div>
            <label className="field-label">Habitation</label>
            <input className="input" value={data.renouvellementHabitation}
              onChange={e => onChange({ renouvellementHabitation: e.target.value })}
              placeholder="Ex: Mars" />
          </div>
        </div>
      </div>

      <div>
        <p className="field-label">À quelle fréquence magasinez-vous vos assurances auto et habitation?</p>
        <div className="space-y-2 mt-2">
          {FREQUENCES.map(f => (
            <label key={f} className="radio-label">
              <input type="radio" name="frequenceMagasinage" value={f}
                checked={data.frequenceMagasinage === f}
                onChange={() => onChange({ frequenceMagasinage: f })} />
              {f}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Pour obtenir un premier prix pour votre assurance auto ou habitation, quel est votre mode de magasinage préféré?</p>
        <div className="space-y-2 mt-2">
          {MODES.map(m => (
            <label key={m} className="radio-label">
              <input type="radio" name="modeMagasinage" value={m}
                checked={data.modeMagasinage === m}
                onChange={() => onChange({ modeMagasinage: m })} />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div className="insight-box">
        Saviez-vous qu&apos;en regroupant non seulement vos assurances auto et habitation à la même place, mais aussi vos autres produits d&apos;épargne et de placement, vous pourriez faire d&apos;importantes économies?
      </div>
    </div>
  )
}
