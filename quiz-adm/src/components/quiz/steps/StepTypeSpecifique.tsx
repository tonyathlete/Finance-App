'use client'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

function OuiNon({ name, value, onChange }: { name: string; value: string; onChange: (v: 'oui' | 'non') => void }) {
  return (
    <div className="radio-group mt-2">
      {(['oui', 'non'] as const).map(v => (
        <label key={v} className="radio-label">
          <input type="radio" name={name} value={v}
            checked={value === v}
            onChange={() => onChange(v)} />
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </label>
      ))}
    </div>
  )
}

function OptionCards({ options, value, name, onChange }: {
  options: string[]
  value: string
  name: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2 mt-2">
      {options.map((opt, i) => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
          value === opt
            ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
        }`}>
          <input type="radio" className="sr-only" name={name} value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)} />
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
            value === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}>{String.fromCharCode(65 + i)}</span>
          {opt}
        </label>
      ))}
    </div>
  )
}

function CheckboxCards({ options, values, onChange }: {
  options: string[]
  values: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    const updated = values.includes(opt) ? values.filter(x => x !== opt) : [...values, opt]
    onChange(updated)
  }
  return (
    <div className="space-y-2 mt-2">
      {options.map((opt, i) => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
          values.includes(opt)
            ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
        }`}>
          <input type="checkbox" className="sr-only" value={opt}
            checked={values.includes(opt)}
            onChange={() => toggle(opt)} />
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
            values.includes(opt) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}>{String.fromCharCode(65 + i)}</span>
          {opt}
        </label>
      ))}
    </div>
  )
}

function StepSalarie({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="insight-box">
        Ces questions nous aident à identifier les opportunités propres à votre situation d&apos;employé.
      </div>

      <div>
        <p className="field-label">Avez-vous un REER collectif via votre employeur?</p>
        <OuiNon name="reerCollectif" value={data.reerCollectif}
          onChange={v => onChange({ reerCollectif: v })} />
      </div>

      <div>
        <p className="field-label">Votre employeur contribue-t-il à votre régime?</p>
        <OuiNon name="employeurContribue" value={data.employeurContribue}
          onChange={v => onChange({ employeurContribue: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous des assurances collectives (santé/dentaire)?</p>
        <OuiNon name="assurancesCollectives" value={data.assurancesCollectives}
          onChange={v => onChange({ assurancesCollectives: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous un véhicule?</p>
        <OuiNon name="aVehicule" value={data.aVehicule}
          onChange={v => onChange({ aVehicule: v })} />
      </div>

      {data.aVehicule === 'oui' && (
        <div>
          <p className="field-label">Comment financez-vous votre véhicule?</p>
          <OptionCards
            options={['Financement', 'Location', 'Comptant']}
            value={data.typeFinancementAuto}
            name="typeFinancementAuto"
            onChange={v => onChange({ typeFinancementAuto: v })} />
        </div>
      )}

      <div>
        <p className="field-label">Utilisez-vous des applications pour économiser sur vos achats? (ex: Reebee, Flipp)</p>
        <OptionCards
          options={['Oui, régulièrement', 'Parfois', 'Non', 'Je ne connaissais pas']}
          value={data.utilisationAppEconomies}
          name="utilisationAppEconomies"
          onChange={v => onChange({ utilisationAppEconomies: v })} />
      </div>
    </div>
  )
}

function StepAutonome({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="insight-box">
        En tant que travailleur autonome, votre situation financière comporte des défis et opportunités uniques.
      </div>

      <div>
        <p className="field-label">Avez-vous un comptable?</p>
        <OuiNon name="aComptable" value={data.aComptable}
          onChange={v => onChange({ aComptable: v })} />
      </div>

      <div>
        <p className="field-label">Êtes-vous incorporé?</p>
        <OuiNon name="estIncorpore" value={data.estIncorpore}
          onChange={v => onChange({ estIncorpore: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous un fonds d&apos;urgence de 3-6 mois?</p>
        <OptionCards
          options={['Oui, plus de 6 mois', 'Oui, 3-6 mois', 'Moins de 3 mois', 'Non']}
          value={data.fondsUrgence}
          name="fondsUrgence"
          onChange={v => onChange({ fondsUrgence: v })} />
      </div>

      <div>
        <p className="field-label">Quel est votre plus grand défi en ce moment? <span className="text-slate-400 font-normal">(plusieurs choix possibles)</span></p>
        <CheckboxCards
          options={['Acquisition de clients', 'Gestion financière', 'Suivi des clients', 'Fiscalité', 'Croissance', 'Autre']}
          values={data.defisActuels}
          onChange={v => onChange({ defisActuels: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous une assurance invalidité personnelle (non via employeur)?</p>
        <OuiNon name="assuranceInvaliditePerso" value={data.assuranceInvaliditePerso}
          onChange={v => onChange({ assuranceInvaliditePerso: v })} />
      </div>
    </div>
  )
}

function StepEntrepreneur({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="insight-box">
        Comprendre votre structure d&apos;entreprise nous permet d&apos;optimiser votre stratégie financière globale.
      </div>

      <div>
        <p className="field-label">Quel est votre chiffre d&apos;affaires annuel approximatif?</p>
        <OptionCards
          options={['Moins de 100 000$', '100 000$ à 500 000$', '500 000$ à 1M$', 'Plus de 1M$']}
          value={data.chiffreAffaires}
          name="chiffreAffaires"
          onChange={v => onChange({ chiffreAffaires: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous une structure corporative (holding)?</p>
        <OuiNon name="structureCorporative" value={data.structureCorporative}
          onChange={v => onChange({ structureCorporative: v })} />
      </div>

      <div>
        <p className="field-label">Avez-vous des associés?</p>
        <OuiNon name="aAssocies" value={data.aAssocies}
          onChange={v => onChange({ aAssocies: v })} />
      </div>

      {data.aAssocies === 'oui' && (
        <div>
          <p className="field-label">Avez-vous une convention entre actionnaires?</p>
          <OuiNon name="conventionActionnaires" value={data.conventionActionnaires}
            onChange={v => onChange({ conventionActionnaires: v })} />
        </div>
      )}

      <div>
        <p className="field-label">Avez-vous une assurance clé-homme?</p>
        <OuiNon name="assuranceCleHomme" value={data.assuranceCleHomme}
          onChange={v => onChange({ assuranceCleHomme: v })} />
      </div>

      <div>
        <p className="field-label">Comment vous rémunérez-vous?</p>
        <OptionCards
          options={['Salaire uniquement', 'Dividendes uniquement', 'Combinaison des deux', "Je ne sais pas ce qui est optimal"]}
          value={data.typeRemunerationEntrepreneur}
          name="typeRemunerationEntrepreneur"
          onChange={v => onChange({ typeRemunerationEntrepreneur: v })} />
      </div>
    </div>
  )
}

export default function StepTypeSpecifique({ data, onChange }: Props) {
  const typeLabels: Record<string, string> = {
    salarie: 'Salarié',
    autonome: 'Travailleur autonome',
    entrepreneur: 'Entrepreneur',
  }

  return (
    <div className="space-y-6">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-brand-900">
          Questions spécifiques — {typeLabels[data.typeClient] || 'Type de client'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Adapté à votre profil pour mieux vous accompagner</p>
      </div>

      {data.typeClient === 'salarie' && <StepSalarie data={data} onChange={onChange} />}
      {data.typeClient === 'autonome' && <StepAutonome data={data} onChange={onChange} />}
      {data.typeClient === 'entrepreneur' && <StepEntrepreneur data={data} onChange={onChange} />}

      {!data.typeClient && (
        <div className="text-center py-8 text-slate-400">
          <p>Veuillez sélectionner un type de client à l&apos;étape précédente.</p>
        </div>
      )}
    </div>
  )
}
