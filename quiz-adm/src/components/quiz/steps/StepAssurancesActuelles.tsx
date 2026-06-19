'use client'
import { QuizData } from '@/lib/types'
import StatPairs from '@/components/quiz/StatPairs'
import CapitalDeces from '@/components/quiz/CapitalDeces'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

function OuiNon({ name, value, onSet }: { name: string; value: string; onSet: (v: 'oui' | 'non') => void }) {
  return (
    <div className="flex gap-2">
      {(['oui', 'non'] as const).map(v => (
        <label key={v} className={`flex items-center justify-center gap-1 px-5 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
          value === v
            ? v === 'oui' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}>
          <input type="radio" name={name} value={v} checked={value === v}
            onChange={() => onSet(v)} className="sr-only" />
          {v === 'oui' ? '✓ Oui' : '✗ Non'}
        </label>
      ))}
    </div>
  )
}

function RadioGroup<T extends string>({ name, value, options, onSet }: {
  name: string; value: string;
  options: { value: T; label: string }[];
  onSet: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map(o => (
        <label key={o.value} className={`px-4 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${
          value === o.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-300'
        }`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value}
            onChange={() => onSet(o.value)} className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  )
}

export default function StepAssurancesActuelles({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-brand-900">Vos assurances actuelles</h2>
        <p className="text-sm text-slate-500 mt-1">On regarde ce que vous avez déjà, et ce qui manque</p>
      </div>

      {/* Assurance vie */}
      <div className={`p-4 rounded-xl border-2 transition-all ${data.aAssuranceVie ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💙</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">Assurance vie</p>
              <p className="text-xs text-slate-500">S&apos;il vous arrive quelque chose, vos proches reçoivent un capital</p>
            </div>
          </div>
          <OuiNon name="aAssuranceVie" value={data.aAssuranceVie} onSet={v => onChange({ aAssuranceVie: v })} />
        </div>
        {data.aAssuranceVie === 'oui' && (
          <div className="mt-4 pt-4 border-t border-brand-100 space-y-3">
            <p className="text-xs font-semibold text-slate-600">De quel type?</p>
            <RadioGroup
              name="assuranceVieType"
              value={data.assuranceVieType}
              options={[
                { value: 'permanente', label: '🏛️ Permanente' },
                { value: 'temporaire', label: '⏱️ Temporaire' },
              ]}
              onSet={v => onChange({ assuranceVieType: v })}
            />
            {data.assuranceVieType === 'permanente' && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 leading-relaxed">
                Une assurance <strong>permanente</strong> ne prend jamais fin et accumule une valeur de rachat. Elle coûte plus cher mais garantit une prestation à vie.
              </div>
            )}
            {data.assuranceVieType === 'temporaire' && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 leading-relaxed">
                Une assurance <strong>temporaire</strong> couvre une période fixe (10, 20 ans…). Elle est abordable, idéale pour couvrir une hypothèque ou protéger la famille pendant les années actives.
              </div>
            )}
          </div>
        )}
      </div>

      <CapitalDeces data={data} onChange={onChange} />

      <StatPairs
        filled={4}
        tone="indigo"
        label="Canadiens recevront un diagnostic de cancer au cours de leur vie"
        caption="La maladie grave frappe sans prévenir. La question, c'est: seriez-vous prêt financièrement?"
      />

      {/* Assurance maladie grave */}
      <div className={`p-4 rounded-xl border-2 transition-all ${data.aAssuranceMaladieGrave ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">Assurance maladie grave</p>
              <p className="text-xs text-slate-500">Un chèque, cash, le jour du diagnostic (cancer, AVC…)</p>
            </div>
          </div>
          <OuiNon name="aAssuranceMaladieGrave" value={data.aAssuranceMaladieGrave} onSet={v => onChange({ aAssuranceMaladieGrave: v })} />
        </div>
        {data.aAssuranceMaladieGrave === 'oui' && (
          <div className="mt-4 pt-4 border-t border-brand-100 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-600">Type de contrat</p>
              <RadioGroup
                name="assuranceMaladieGraveType"
                value={data.assuranceMaladieGraveType}
                options={[
                  { value: 'temporaire', label: '⏱️ Temporaire' },
                  { value: 'remboursement', label: '💰 Avec remboursement de prime' },
                  { value: 'les_deux', label: '✨ Les deux' },
                ]}
                onSet={v => onChange({ assuranceMaladieGraveType: v })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Montant du capital assuré</label>
              <div className="relative mt-1 max-w-xs">
                <input type="number" inputMode="numeric" className="input pr-7"
                  placeholder="0" value={data.assuranceMaladieGraveMontant}
                  onChange={e => onChange({ assuranceMaladieGraveMontant: e.target.value })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              </div>
            </div>
          </div>
        )}

        {/* Explication différence invalidité vs maladie grave */}
        <div className="mt-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4 space-y-3 text-xs">
          <p className="font-bold text-slate-700 text-sm">Invalidité vs maladie grave: quelle différence?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <span className="text-xl shrink-0">🛡️</span>
              <div>
                <p className="font-bold text-slate-700 mb-1">Assurance invalidité</p>
                <ul className="text-slate-600 space-y-1">
                  <li>• Verse un <strong>revenu mensuel</strong></li>
                  <li>• Déclenché si vous ne pouvez <strong>plus travailler</strong></li>
                  <li>• Couvre longtemps (jusqu'à 65 ans)</li>
                  <li>• Ex: accident de voiture, dépression, blessure</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xl shrink-0">🏥</span>
              <div>
                <p className="font-bold text-slate-700 mb-1">Maladie grave</p>
                <ul className="text-slate-600 space-y-1">
                  <li>• Verse un <strong>capital forfaitaire</strong> (ex: 100 000 $)</li>
                  <li>• Déclenché au <strong>diagnostic</strong> (même si vous travaillez encore)</li>
                  <li>• Permet de payer traitements, remplacer revenu, voyager</li>
                  <li>• Ex: cancer, AVC, infarctus</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-slate-500 italic">💡 Les deux se complètent: l'une couvre le quotidien, l'autre donne la liberté de choix.</p>
        </div>
      </div>

      <div className="insight-box">
        Avoir une assurance ne veut pas dire qu&apos;elle est encore adaptée. On va vérifier ça ensemble pendant qu&apos;on y est.
      </div>
    </div>
  )
}
