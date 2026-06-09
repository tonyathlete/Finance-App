'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const FREQUENCES = ['Chaque année', 'Aux deux ans', 'Une fois par 3, 4 ou 5 ans', 'Moins d\'une fois par 5 ans', 'Jamais']
const MODES = ['En ligne (sur Internet)', 'Par téléphone', 'En personne (j\'ai besoin d\'assistance)']

function OuiNon({ name, value, onSet }: { name: string; value: string; onSet: (v: 'oui' | 'non') => void }) {
  return (
    <div className="radio-group">
      {(['oui', 'non'] as const).map(v => (
        <label key={v} className="radio-label">
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onSet(v)} />
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </label>
      ))}
    </div>
  )
}

export default function StepHabitationBiens({ data, onChange }: Props) {
  const setStatut = (v: 'proprietaire' | 'locataire') =>
    onChange({ statutHabitation: v, coutLogementType: v === 'proprietaire' ? 'hypotheque' : 'loyer' })

  return (
    <div className="space-y-6">
      <div className="section-title">Habitation & protection des biens</div>

      {/* Statut + coût logement */}
      <div>
        <p className="field-label">Êtes-vous :</p>
        <div className="radio-group">
          {(['proprietaire', 'locataire'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="statutHabitation" value={v}
                checked={data.statutHabitation === v}
                onChange={() => setStatut(v)} />
              {v === 'proprietaire' ? 'Propriétaire' : 'Locataire'}
            </label>
          ))}
        </div>
      </div>

      {data.statutHabitation && (
        <div>
          <label className="field-label">
            Montant mensuel de votre {data.statutHabitation === 'proprietaire' ? 'hypothèque' : 'loyer'}
          </label>
          <div className="relative max-w-xs">
            <input type="number" inputMode="numeric" value={data.coutLogementMensuel}
              onChange={e => onChange({ coutLogementMensuel: e.target.value })}
              placeholder="0" className="input pr-7" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          </div>
        </div>
      )}

      {/* Propriétaire */}
      {data.statutHabitation === 'proprietaire' && (
        <div className="space-y-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-brand-700">Propriétaire</h3>

          <div>
            <p className="field-label">Avez-vous un prêt hypothécaire?</p>
            <OuiNon name="pretHypothecaire" value={data.pretHypothecaire} onSet={v => onChange({ pretHypothecaire: v })} />
          </div>

          {data.pretHypothecaire === 'oui' && (
            <>
              <div>
                <label className="field-label">Avec quelle institution financière?</label>
                <input className="input" value={data.institutionFinanciere}
                  onChange={e => onChange({ institutionFinanciere: e.target.value })} />
              </div>
              <div>
                <p className="field-label">Avez-vous souscrit des protections (décès/invalidité) auprès de votre institution?</p>
                <OuiNon name="protectionDeces" value={data.protectionDeces} onSet={v => onChange({ protectionDeces: v })} />
              </div>
              <div>
                <p className="field-label">Connaissez-vous la différence entre une <strong>assurance vie</strong> et une <strong>assurance hypothèque</strong>?</p>
                <OuiNon name="connaissanceDiffAssurances" value={data.connaissanceDiffAssurances} onSet={v => onChange({ connaissanceDiffAssurances: v })} />
                {data.connaissanceDiffAssurances === 'non' && (
                  <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex gap-3">
                      <span className="text-2xl shrink-0">🏦</span>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Assurance hypothèque (banque)</p>
                        <ul className="text-slate-600 space-y-1 text-xs">
                          <li>• Le bénéficiaire est <strong>la banque</strong>, pas votre famille</li>
                          <li>• La couverture <strong>diminue</strong> avec le solde</li>
                          <li>• La prime ne baisse pas pour autant</li>
                          <li>• Non transférable si vous changez d’institution</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-2xl shrink-0">🛡️</span>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Assurance vie (assureur privé)</p>
                        <ul className="text-slate-600 space-y-1 text-xs">
                          <li>• Le bénéficiaire est <strong>votre famille</strong></li>
                          <li>• Couverture <strong>fixe</strong> peu importe le solde</li>
                          <li>• Peut couvrir bien plus que l’hypothèque</li>
                          <li>• Transférable et indépendante de votre banque</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Locataire */}
      {data.statutHabitation === 'locataire' && (
        <div className="space-y-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-brand-700">Locataire</h3>
          <div>
            <p className="field-label">Projetez-vous d’acheter une propriété?</p>
            <OuiNon name="projetAchat" value={data.projetAchat} onSet={v => onChange({ projetAchat: v })} />
          </div>
          <div>
            <p className="field-label">Saviez-vous que votre loyer pourrait être couvert en cas de décès ou d’invalidité?</p>
            <OuiNon name="loyerCouvert" value={data.loyerCouvert} onSet={v => onChange({ loyerCouvert: v })} />
          </div>
        </div>
      )}

      {/* Protection des biens */}
      <div className="pt-2">
        <p className="field-label font-semibold">Détenez-vous une assurance :</p>
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm">Auto</span>
            <OuiNon name="assuranceAuto" value={data.assuranceAuto} onSet={v => onChange({ assuranceAuto: v })} />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm">Habitation</span>
            <OuiNon name="assuranceHabitation" value={data.assuranceHabitation} onSet={v => onChange({ assuranceHabitation: v })} />
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
        <p className="field-label">Mode de magasinage préféré pour obtenir un prix?</p>
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
        En regroupant vos assurances auto, habitation et vos placements au même endroit, des économies importantes
        sont souvent possibles — tout en simplifiant votre vie financière.
      </div>
    </div>
  )
}
