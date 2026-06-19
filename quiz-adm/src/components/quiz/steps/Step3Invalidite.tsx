'use client'
import { QuizData } from '@/lib/types'
import ImpactRevenu from '@/components/quiz/ImpactRevenu'
import StatPairs from '@/components/quiz/StatPairs'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const POURCENTAGE_OPTIONS = [
  'Moins de 50%',
  'Entre 50% et 70%',
  'Plus de 70%',
  'Je ne sais pas',
]

const TEMPS_OPTIONS = [
  'Moins de 1 mois',
  '1 à 3 mois',
  '3 à 6 mois',
  '6 mois à 1 an',
  'Plus de 1 an',
]

const COMMENT_ETABLI_OPTIONS = [
  'Avec un conseiller financier',
  'Par moi-même (calculs personnels)',
  'Outil en ligne',
  'Je ne l\'ai pas évalué',
]

export default function Step3Invalidite({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="section-title">Invalidité</div>

      <StatPairs
        filled={3}
        tone="red"
        label="travailleurs vivront une invalidité de 90 jours ou plus avant l'âge de 65 ans"
        caption="La plupart n'ont rien prévu pour ça. Vous, où est-ce que vous vous situez?"
      />

      <ImpactRevenu data={data} onChange={onChange} />

      <div>
        <p className="field-label">Détenez-vous des protections en cas d&apos;invalidité?</p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="protectionInvalidite" value={v}
                checked={data.protectionInvalidite === v}
                onChange={() => onChange({ protectionInvalidite: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.protectionInvalidite === 'oui' && (
        <div>
          <label className="field-label">
            Selon vos protections actuelles, quel pourcentage de votre salaire est couvert?
          </label>
          <div className="space-y-2 mt-2">
            {POURCENTAGE_OPTIONS.map((opt, i) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                data.pourcentageSalaireConvert === opt
                  ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
              }`}>
                <input type="radio" className="sr-only" name="pourcentageSalaireConvert" value={opt}
                  checked={data.pourcentageSalaireConvert === opt}
                  onChange={() => onChange({ pourcentageSalaireConvert: opt })} />
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  data.pourcentageSalaireConvert === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="field-label">
          À la suite d&apos;une invalidité plus ou moins longue, pendant combien de temps seriez-vous en mesure d&apos;assumer vos obligations financières actuelles?
        </label>
        <div className="space-y-2 mt-2">
          {TEMPS_OPTIONS.map((opt, i) => (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              data.tempsPourAssumer === opt
                ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              <input type="radio" className="sr-only" name="tempsPourAssumer" value={opt}
                checked={data.tempsPourAssumer === opt}
                onChange={() => onChange({ tempsPourAssumer: opt })} />
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                data.tempsPourAssumer === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">
          Avez-vous déjà fait l&apos;exercice de déterminer quel serait votre coût de vie mensuel advenant une invalidité?
        </p>
        <div className="radio-group">
          {(['oui', 'non'] as const).map(v => (
            <label key={v} className="radio-label">
              <input type="radio" name="calculCoutVie" value={v}
                checked={data.calculCoutVie === v}
                onChange={() => onChange({ calculCoutVie: v })} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {data.calculCoutVie === 'oui' && (
        <div>
          <label className="field-label">De quelle façon l&apos;avez-vous établi? Et quand?</label>
          <div className="space-y-2 mt-2">
            {COMMENT_ETABLI_OPTIONS.map((opt, i) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                data.commentEtabli === opt
                  ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
              }`}>
                <input type="radio" className="sr-only" name="commentEtabli" value={opt}
                  checked={data.commentEtabli === opt}
                  onChange={() => onChange({ commentEtabli: opt })} />
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  data.commentEtabli === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="insight-box">
        On peut chiffrer exactement ce qui se passerait dans votre cas — pas une estimation vague, le vrai scénario.
      </div>
    </div>
  )
}
