'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

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
                <label className="field-label">Quand et comment prévoyez-vous réaliser ce projet?</label>
                <textarea className="input h-20 resize-none" value={data.quandCommentAchat}
                  onChange={e => onChange({ quandCommentAchat: e.target.value })} />
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
