'use client'
import { useEffect, useState } from 'react'
import { QuizData } from '@/lib/types'

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

interface DiagOption {
  label: string
  value: string
  extra?: Partial<QuizData>
  bad?: boolean
}

interface DiagQuestion {
  field: keyof QuizData
  emoji: string
  question: string
  options: DiagOption[]
  tip: string
  savings?: number // $/an potentiel, affiché dans le compteur
}

const QUESTIONS: Record<string, DiagQuestion[]> = {
  salarie: [
    {
      field: 'utilisationAppEconomies',
      emoji: '🛒',
      question: 'Utilisez-vous des apps pour économiser à l\'épicerie (Reebee, Flipp…)?',
      options: [
        { label: 'Oui', value: 'Oui' },
        { label: 'Non', value: 'Non', bad: true },
        { label: 'Je ne connaissais pas', value: 'Je ne connaissais pas', bad: true },
      ],
      tip: 'Reebee, Flipp et le cashback (Rakuten) réduisent l\'épicerie et les achats courants — sans changer vos habitudes.',
      savings: 500,
    },
    {
      field: 'reerCollectif',
      emoji: '💼',
      question: 'Votre employeur cotise-t-il à un REER collectif pour vous?',
      options: [
        { label: 'Oui, et j\'y participe', value: 'oui', extra: { employeurContribue: 'oui' } },
        { label: 'Oui, mais je ne participe pas', value: 'oui', extra: { employeurContribue: 'non' }, bad: true },
        { label: 'Non / je ne sais pas', value: 'non', bad: true },
      ],
      tip: 'Une cotisation égalée par l\'employeur, c\'est de l\'argent gratuit. Premier réflexe : vérifier votre relevé de paie ensemble.',
      savings: 1500,
    },
    {
      field: 'typeFinancementAuto',
      emoji: '🚗',
      question: 'Avez-vous un paiement d\'auto en ce moment?',
      options: [
        { label: 'Oui, financement', value: 'Financement', extra: { aVehicule: 'oui' }, bad: true },
        { label: 'Oui, location', value: 'Location', extra: { aVehicule: 'oui' }, bad: true },
        { label: 'Non / payée comptant', value: 'Aucun', extra: { aVehicule: 'non' } },
      ],
      tip: 'Taux de financement et assurance auto se magasinent. Au renouvellement, on compare — souvent 300 à 600 $ récupérés.',
      savings: 450,
    },
  ],
  autonome: [
    {
      field: 'aComptable',
      emoji: '🧾',
      question: 'Avez-vous un comptable qui vous fait économiser plus que ses honoraires?',
      options: [
        { label: 'Oui', value: 'oui' },
        { label: 'Non / je fais tout moi-même', value: 'non', bad: true },
      ],
      tip: 'Un comptable spécialisé en travailleurs autonomes trouve des déductions (bureau, km, cellulaire…) qui dépassent largement ses honoraires.',
      savings: 1500,
    },
    {
      field: 'fondsUrgence',
      emoji: '🛟',
      question: 'Avez-vous un fonds d\'urgence pour traverser les périodes creuses?',
      options: [
        { label: '3 à 6 mois ou plus', value: '3 à 6 mois' },
        { label: 'Moins de 3 mois', value: 'Moins de 3 mois', bad: true },
        { label: 'Non', value: 'Non', bad: true },
      ],
      tip: 'Avec un revenu variable, 3 à 6 mois de coussin évitent de piger dans le REER ou la carte de crédit quand ça ralentit.',
    },
    {
      field: 'assuranceInvaliditePerso',
      emoji: '🛡️',
      question: 'Si vous ne pouviez plus travailler demain matin, votre revenu continuerait-il?',
      options: [
        { label: 'Oui, je suis protégé', value: 'oui' },
        { label: 'Non', value: 'non', bad: true },
      ],
      tip: 'Sans employeur, personne ne protège votre revenu automatiquement. C\'est LA priorité no 1 du travailleur autonome — et ça se règle bien.',
    },
  ],
  entrepreneur: [
    {
      field: 'typeRemunerationEntrepreneur',
      emoji: '💰',
      question: 'Comment vous versez-vous votre rémunération?',
      options: [
        { label: 'Salaire', value: 'Salaire' },
        { label: 'Dividendes', value: 'Dividendes' },
        { label: 'Mix des deux', value: 'Mix salaire et dividendes' },
        { label: 'Je ne sais pas ce qui est optimal', value: 'Je ne sais pas ce qui est optimal', bad: true },
      ],
      tip: 'Le bon mix salaire/dividendes peut réduire votre facture fiscale de façon importante. Une analyse le confirme rapidement.',
      savings: 2000,
    },
    {
      field: 'structureCorporative',
      emoji: '🏗️',
      question: 'Avez-vous une société de gestion (holding)?',
      options: [
        { label: 'Oui', value: 'oui' },
        { label: 'Non / je ne sais pas si j\'en ai besoin', value: 'non', bad: true },
      ],
      tip: 'Une holding peut protéger vos actifs des créanciers et différer l\'impôt sur vos surplus. À valider selon votre situation.',
    },
    {
      field: 'assuranceCleHomme',
      emoji: '🔑',
      question: 'Votre entreprise survivrait-elle financièrement si vous étiez absent 6 mois?',
      options: [
        { label: 'Oui, c\'est prévu', value: 'oui' },
        { label: 'Non / jamais réfléchi', value: 'non', bad: true },
      ],
      tip: 'Si tout repose sur vous, une absence prolongée fragilise tout. Une protection clé-homme assure la continuité de l\'entreprise.',
    },
  ],
}

const PROFIL_LABELS: Record<string, string> = {
  salarie: 'Salarié',
  autonome: 'Travailleur autonome',
  entrepreneur: 'Entrepreneur',
}

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(target)
  const [from, setFrom] = useState(target)
  useEffect(() => {
    let raf: number
    const start = from
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(start + (target - start) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setFrom(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return val
}

// deux options peuvent partager la même value (ex: reerCollectif 'oui') —
// on les distingue alors par les champs additionnels qu'elles écrivent
function isOptionSelected(o: DiagOption, q: DiagQuestion, data: QuizData) {
  if (o.value !== data[q.field]) return false
  if (o.extra && 'employeurContribue' in o.extra) {
    return data.employeurContribue === o.extra.employeurContribue
  }
  return true
}

function findActive(q: DiagQuestion, data: QuizData) {
  return q.options.find(o => isOptionSelected(o, q, data))
}

export default function DiagnosticExpress({ data, onChange }: Props) {
  const questions = data.typeClient ? QUESTIONS[data.typeClient] : null

  const totalSavings = (questions ?? []).reduce((sum, q) => {
    const active = findActive(q, data)
    return active?.bad && q.savings ? sum + q.savings : sum
  }, 0)
  const animatedTotal = useCountUp(totalSavings)

  if (!questions) return null

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50/60 to-indigo-50/60 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-bold text-brand-900 flex items-center gap-2">
            ⚡ Diagnostic express — {PROFIL_LABELS[data.typeClient]}
          </p>
          <p className="text-xs text-slate-500">3 questions, 1 minute chrono — on va voir si ça paraît</p>
        </div>
        {totalSavings > 0 && (
          <div className="bg-green-100 border border-green-300 rounded-xl px-4 py-2 text-center animate-pop-in">
            <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Opportunités identifiées</p>
            <p className="text-lg font-extrabold text-green-700 tabular-nums">
              jusqu&apos;à {animatedTotal.toLocaleString('fr-CA')} $/an
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {questions.map(q => {
          const activeOption = findActive(q, data)

          return (
            <div key={q.field as string} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700 flex items-start gap-2">
                <span className="text-lg shrink-0">{q.emoji}</span>
                {q.question}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {q.options.map((o, i) => (
                  <label key={i} className={`px-3.5 py-2 rounded-lg border-2 cursor-pointer text-xs font-medium transition-all ${
                    isOptionSelected(o, q, data)
                      ? o.bad ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-green-400 bg-green-50 text-green-700'
                      : 'border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}>
                    <input type="radio" name={q.field as string} className="sr-only"
                      checked={isOptionSelected(o, q, data)}
                      onChange={() => onChange({ [q.field]: o.value, ...o.extra } as Partial<QuizData>)} />
                    {o.label}
                  </label>
                ))}
              </div>
              {activeOption?.bad && (
                <div className="mt-3 flex gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3 animate-pop-in">
                  <span className="shrink-0">💡</span>
                  <div>
                    <p className="text-xs text-amber-800 leading-relaxed">{q.tip}</p>
                    {q.savings && (
                      <p className="text-xs font-bold text-green-700 mt-1">
                        💰 Potentiel : ~{q.savings.toLocaleString('fr-CA')} $/an
                      </p>
                    )}
                  </div>
                </div>
              )}
              {activeOption && !activeOption.bad && (
                <p className="mt-2 text-xs font-medium text-green-600 animate-pop-in">✓ Déjà optimisé — bravo!</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
