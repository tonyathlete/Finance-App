'use client'
import { QuizData, Enfant } from '@/lib/types'

interface Props {
  data: QuizData
  onChange: (updates: Partial<QuizData>) => void
}

export default function Step1InfoPersonnelles({ data, onChange }: Props) {
  const addEnfant = () => onChange({ enfants: [...data.enfants, { nom: '', age: '' }] })
  const removeEnfant = (i: number) =>
    onChange({ enfants: data.enfants.filter((_, idx) => idx !== i) })
  const updateEnfant = (i: number, field: keyof Enfant, val: string) => {
    const updated = data.enfants.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    onChange({ enfants: updated })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-accent-500 p-5 rounded-xl shadow-sm flex gap-3">
        <span className="text-2xl shrink-0">👥</span>
        <div>
          <p className="font-semibold text-amber-900 text-sm mb-1">Avant de commencer</p>
          <p className="text-amber-800 text-sm">
            Pensez à <strong>5 personnes</strong> de votre entourage (famille, amis, collègues) qui pourraient également bénéficier de cette analyse. Vous compléterez leurs informations à la dernière étape.
          </p>
        </div>
      </div>

      <div>
        <div className="section-title">Type de client</div>
        <div className="radio-group flex-wrap">
          {(['salarie', 'autonome', 'entrepreneur'] as const).map((t) => (
            <label key={t} className="radio-label">
              <input
                type="radio"
                name="typeClient"
                value={t}
                checked={data.typeClient === t}
                onChange={() => onChange({ typeClient: t })}
              />
              {t === 'salarie' ? 'Salarié' : t === 'autonome' ? 'Travailleur autonome' : 'Entrepreneur'}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Prénom</label>
          <input className="input" value={data.prenom} onChange={e => onChange({ prenom: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Nom</label>
          <input className="input" value={data.nom} onChange={e => onChange({ nom: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Âge</label>
          <input className="input" type="number" value={data.age} onChange={e => onChange({ age: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Téléphone</label>
          <input className="input" value={data.telephone} onChange={e => onChange({ telephone: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Courriel</label>
          <input className="input" type="email" value={data.courriel} onChange={e => onChange({ courriel: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Adresse</label>
          <input className="input" value={data.adresse} onChange={e => onChange({ adresse: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Statut civil</label>
          <select className="input" value={data.statutCivil} onChange={e => onChange({ statutCivil: e.target.value })}>
            <option value="">— Sélectionner —</option>
            <option>Célibataire</option>
            <option>Marié(e)</option>
            <option>Conjoint(e) de fait</option>
            <option>Divorcé(e)</option>
            <option>Veuf/Veuve</option>
          </select>
        </div>
      </div>

      <div>
        <div className="section-title">Conjoint(e)</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Nom du/de la conjoint(e)</label>
            <input className="input" value={data.conjointNom} onChange={e => onChange({ conjointNom: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Âge</label>
            <input className="input" type="number" value={data.conjointAge} onChange={e => onChange({ conjointAge: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Emploi</label>
            <input className="input" value={data.conjointEmploi} onChange={e => onChange({ conjointEmploi: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <div className="section-title">Enfants</div>
        {data.enfants.map((enfant, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 items-end">
            <div>
              <label className="field-label">Prénom</label>
              <input className="input" value={enfant.nom} onChange={e => updateEnfant(i, 'nom', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Âge</label>
              <input className="input" type="number" value={enfant.age} onChange={e => updateEnfant(i, 'age', e.target.value)} />
            </div>
            <div>
              <button type="button" onClick={() => removeEnfant(i)} className="text-red-500 text-sm hover:underline mb-2">
                Retirer
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addEnfant} className="text-ia-blue text-sm font-medium hover:underline mt-1">
          + Ajouter un enfant
        </button>
      </div>
    </div>
  )
}
