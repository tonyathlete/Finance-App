'use client'
import { QuizData } from '@/lib/types'
import InvestmentGraph from '@/components/quiz/InvestmentGraph'
import RevealCard from '@/components/quiz/RevealCard'
import CalculRetraite from '@/components/quiz/CalculRetraite'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const BUT_EPARGNE_OPTIONS = [
  'Retraite',
  'Achat immobilier',
  'Fonds d\'urgence',
  'Études des enfants',
  'Voyages / projets',
  'Autre',
]

const POURQUOI_PAS_OPTIONS = [
  'Manque de revenus',
  'Dettes à rembourser en priorité',
  'Je ne sais pas par où commencer',
  'Autre',
]

const AGE_RETRAITE_OPTIONS = [
  'Avant 55 ans',
  'Entre 55 et 60 ans',
  'Entre 60 et 65 ans',
  '65 ans et plus',
]

const COMMENT_EVALUE_OPTIONS = [
  'Avec un conseiller financier',
  'Par moi-même (calculs personnels)',
  'Je ne l\'ai pas évalué formellement',
]

export default function Step4Epargne({ data, onChange }: Props) {
  const toggleButEpargne = (opt: string) => {
    const current = data.butEpargne
    const updated = current.includes(opt)
      ? current.filter(x => x !== opt)
      : [...current, opt]
    onChange({ butEpargne: updated })
  }

  return (
    <div className="space-y-6">
      <div className="section-title">Épargne</div>

      <RevealCard
        emoji="🤯"
        teaser="200 $ par mois investis à 7 % pendant 30 ans… ça donne combien?"
        value={244000}
        prefix="≈ "
        caption="Vous en mettez seulement 72 000 $ de votre poche. Le reste, 172 000 $, c'est les intérêts composés."
      />

      <div>
        <p className="field-label">Est-ce important pour vous d&apos;épargner systématiquement une partie de votre revenu annuel?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="importantEpargner" value={v}
                checked={data.importantEpargner === v}
                onChange={() => onChange({ importantEpargner: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.importantEpargner === 'oui' && (
        <div>
          <label className="field-label">Dans quel but? (Plusieurs choix possibles)</label>
          <div className="space-y-2 mt-2">
            {BUT_EPARGNE_OPTIONS.map((opt, i) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                data.butEpargne.includes(opt)
                  ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
              }`}>
                <input type="checkbox" className="sr-only" value={opt}
                  checked={data.butEpargne.includes(opt)}
                  onChange={() => toggleButEpargne(opt)} />
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  data.butEpargne.includes(opt) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      {data.importantEpargner === 'non' && (
        <div>
          <label className="field-label">Pourquoi?</label>
          <div className="space-y-2 mt-2">
            {POURQUOI_PAS_OPTIONS.map((opt, i) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                data.pourquoiPasEpargne === opt
                  ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
              }`}>
                <input type="radio" className="sr-only" name="pourquoiPasEpargne" value={opt}
                  checked={data.pourquoiPasEpargne === opt}
                  onChange={() => onChange({ pourquoiPasEpargne: opt })} />
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  data.pourquoiPasEpargne === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="field-label">Pensez-vous pouvoir planifier votre retraite adéquatement, sans aide?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="planifierRetraite" value={v}
                checked={data.planifierRetraite === v}
                onChange={() => onChange({ planifierRetraite: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="field-label">À quel âge prévoyez-vous prendre votre retraite?</label>
        <div className="space-y-2 mt-2">
          {AGE_RETRAITE_OPTIONS.map((opt, i) => (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              data.ageRetraite === opt
                ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              <input type="radio" className="sr-only" name="ageRetraite" value={opt}
                checked={data.ageRetraite === opt}
                onChange={() => onChange({ ageRetraite: opt })} />
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                data.ageRetraite === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Jusqu&apos;à maintenant, avez-vous mis en place une stratégie?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="strategieEnPlace" value={v}
                checked={data.strategieEnPlace === v}
                onChange={() => onChange({ strategieEnPlace: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.strategieEnPlace === 'oui' && (
        <>
          <div>
            <p className="field-label">Êtes-vous certain à <strong>100%</strong> que les stratégies mises en place vous permettront d&apos;y parvenir?</p>
            <div className="radio-group">
              {(['oui', 'non'] as const).map(v => (
                <label key={v} className="radio-label">
                  <input type="radio" name="certainStrategieRetraite" value={v}
                    checked={data.certainStrategieRetraite === v}
                    onChange={() => onChange({ certainStrategieRetraite: v })} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">De quelle façon l&apos;avez-vous évalué? Et à quand remonte cette évaluation?</label>
            <div className="space-y-2 mt-2">
              {COMMENT_EVALUE_OPTIONS.map((opt, i) => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                  data.commentEvalue === opt
                    ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                }`}>
                  <input type="radio" className="sr-only" name="commentEvalue" value={opt}
                    checked={data.commentEvalue === opt}
                    onChange={() => onChange({ commentEvalue: opt })} />
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    data.commentEvalue === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <CalculRetraite data={data} onChange={onChange} />

      <div className="insight-box">
        Il existe des façons d&apos;épargner qui passent par des produits d&apos;assurance, avec des avantages fiscaux que les comptes de placement classiques n&apos;offrent pas. On peut regarder ça ensemble.
      </div>

      <InvestmentGraph />
    </div>
  )
}
