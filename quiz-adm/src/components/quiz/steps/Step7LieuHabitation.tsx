'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const QUAND_ACHAT_OPTIONS = [
  'Dans moins de 2 ans',
  'Dans 2 à 5 ans',
  'Dans plus de 5 ans',
  'Je ne sais pas encore',
]

export default function Step7LieuHabitation({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Lieu d&apos;habitation</div>

      <div>
        <p className="field-label">Êtes-vous :</p>
        <div className="radio-group">
          {(['proprietaire', 'locataire'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="statutHabitation" value={v}
                checked={data.statutHabitation === v}
                onChange={() => onChange({ statutHabitation: v })} />
              {v === 'proprietaire' ? 'Propriétaire' : 'Locataire'}
            </label>
          ))}
        </div>
      </div>

      {data.statutHabitation === 'proprietaire' && (
        <div className="space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-ia-blue">Propriétaire</h3>

          <div>
            <p className="field-label">Avez-vous un prêt hypothécaire?</p>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="pretHypothecaire" value={v}
                    checked={data.pretHypothecaire === v}
                    onChange={() => onChange({ pretHypothecaire: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {data.pretHypothecaire === 'oui' && (
            <>
              <div>
                <label className="field-label">Avec quelle institution financière?</label>
                <input className="input" value={data.institutionFinanciere}
                  onChange={e => onChange({ institutionFinanciere: e.target.value })} />
              </div>
              <div>
                <p className="field-label">Avez-vous souscrit des protections en cas de décès ou d&apos;invalidité auprès de votre institution?</p>
                <div className="radio-group">
                  {(['oui', 'non'] as const).map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name="protectionDeces" value={v}
                        checked={data.protectionDeces === v}
                        onChange={() => onChange({ protectionDeces: v })} />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="field-label">Connaissez-vous les avantages qu&apos;il y a à souscrire ces protections auprès d&apos;un assureur privé plutôt qu&apos;auprès d&apos;un prêteur hypothécaire?</p>
                <div className="radio-group">
                  {(['oui', 'non'] as const).map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name="connaissanceAvantages" value={v}
                        checked={data.connaissanceAvantages === v}
                        onChange={() => onChange({ connaissanceAvantages: v })} />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="field-label">Connaissez-vous la différence entre une <strong>assurance vie</strong> et une <strong>assurance hypothèque</strong>?</p>
                <div className="radio-group">
                  {(['oui', 'non'] as const).map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name="connaissanceDiffAssurances" value={v}
                        checked={data.connaissanceDiffAssurances === v}
                        onChange={() => onChange({ connaissanceDiffAssurances: v })} />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
                {data.connaissanceDiffAssurances === 'non' && (
                  <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex gap-3">
                      <span className="text-2xl shrink-0">🏦</span>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Assurance hypothèque (banque)</p>
                        <ul className="text-slate-600 space-y-1 text-xs">
                          <li>• Le bénéficiaire est <strong>la banque</strong>, pas votre famille</li>
                          <li>• La couverture <strong>diminue</strong> avec le solde hypothécaire</li>
                          <li>• La prime reste la même même si la couverture baisse</li>
                          <li>• Non transférable si vous changez d&apos;institution</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-2xl shrink-0">🛡️</span>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Assurance vie (assureur privé)</p>
                        <ul className="text-slate-600 space-y-1 text-xs">
                          <li>• Le bénéficiaire est <strong>votre famille</strong></li>
                          <li>• La couverture reste <strong>fixe</strong> peu importe le solde</li>
                          <li>• Peut couvrir bien plus que l&apos;hypothèque</li>
                          <li>• Transférable et indépendante de votre banque</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="insight-box">
                Croyez-vous que les gens qui détiennent des prêts hypothécaires devraient être informés de ces avantages afin de prendre de meilleures décisions?
              </div>
            </>
          )}
        </div>
      )}

      {data.statutHabitation === 'locataire' && (
        <div className="space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-ia-blue">Locataire</h3>

          <div>
            <p className="field-label">Projetez-vous d&apos;acheter une propriété?</p>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="projetAchat" value={v}
                    checked={data.projetAchat === v}
                    onChange={() => onChange({ projetAchat: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {data.projetAchat === 'oui' && (
            <>
              <div>
                <label className="field-label">Quand prévoyez-vous réaliser ce projet?</label>
                <div className="space-y-2 mt-2">
                  {QUAND_ACHAT_OPTIONS.map((opt, i) => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                      data.quandCommentAchat === opt
                        ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                    }`}>
                      <input type="radio" className="sr-only" name="quandCommentAchat" value={opt}
                        checked={data.quandCommentAchat === opt}
                        onChange={() => onChange({ quandCommentAchat: opt })} />
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        data.quandCommentAchat === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="insight-box">
                C&apos;est intéressant. Saviez-vous qu&apos;il existe un moyen qui permet de capitaliser votre mise de fonds initiale afin de réaliser votre projet?
              </div>
            </>
          )}

          <div>
            <p className="field-label">Saviez-vous que, en tant que locataire, le coût mensuel de votre loyer pourrait être couvert en cas de décès et d&apos;invalidité?</p>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="loyerCouvert" value={v}
                    checked={data.loyerCouvert === v}
                    onChange={() => onChange({ loyerCouvert: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
