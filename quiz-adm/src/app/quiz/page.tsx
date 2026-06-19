'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { QuizData, defaultQuizData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import Step0Connaissances from '@/components/quiz/steps/Step0Connaissances'
import Step1InfoPersonnelles from '@/components/quiz/steps/Step1InfoPersonnelles'
import Step2Autonomie from '@/components/quiz/steps/Step2Autonomie'
import Step3Invalidite from '@/components/quiz/steps/Step3Invalidite'
import Step4Epargne from '@/components/quiz/steps/Step4Epargne'
import Step5Education from '@/components/quiz/steps/Step5Education'
import StepHabitationBiens from '@/components/quiz/steps/StepHabitationBiens'
import StepAssurancesActuelles from '@/components/quiz/steps/StepAssurancesActuelles'
import Step8Testament from '@/components/quiz/steps/Step8Testament'
import Step9References from '@/components/quiz/steps/Step9References'
import Bilan from '@/components/quiz/Bilan'
import ScoreLive from '@/components/quiz/ScoreLive'

const STEPS = [
  { label: 'Connaissances financières', component: Step0Connaissances },
  { label: 'Autonomie financière', component: Step2Autonomie },
  { label: 'Invalidité', component: Step3Invalidite },
  { label: 'Épargne', component: Step4Epargne },
  { label: 'Informations personnelles', component: Step1InfoPersonnelles },
  { label: 'Références', component: Step9References },
  { label: 'Éducation', component: Step5Education },
  { label: 'Habitation & protection des biens', component: StepHabitationBiens },
  { label: 'Assurances actuelles', component: StepAssurancesActuelles },
  { label: 'Testament et mandat', component: Step8Testament },
  { label: 'Bilan & recommandations', component: Bilan },
]

function QuizContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<QuizData>(defaultQuizData)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'salarie' || type === 'autonome' || type === 'entrepreneur') {
      setData(prev => ({ ...prev, typeClient: type }))
    }
  }, [searchParams])

  const onChange = (updates: Partial<QuizData>) => setData(prev => ({ ...prev, ...updates }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('submissions').insert({ data })
    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setSubmitting(false)
    } else {
      setSubmitted(true)
    }
  }

  const CurrentStep = STEPS[step].component

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center animate-stamp-in">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-green shadow-stamp flex items-center justify-center text-2xl text-white font-display">
            ✓
          </div>
          <h1 className="text-2xl font-display font-bold text-encre mb-3">Dossier complété</h1>
          <p className="text-encre/60 mb-8">Les réponses ont été enregistrées avec succès.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary" onClick={() => { setData(defaultQuizData); setStep(0); setSubmitted(false) }}>
              + Nouveau client
            </button>
            <a href="/dashboard" className="btn-secondary">Voir dashboard</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-9 h-9 flex items-center justify-center text-lg rounded-full bg-white/70 border border-encre/10 shadow-card hover:bg-white transition-colors">
              ←
            </a>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-encre">Quiz ADM</h1>
              <p className="text-encre/45 text-[11px] font-ledger tracking-wide">DOSSIER EN COURS</p>
            </div>
          </div>
          <a href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Progress: a glassy card, like the mockup's status pills */}
      <div className="px-6 pb-4">
        <div className="max-w-2xl mx-auto card !p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-encre truncate">{STEPS[step].label}</span>
              <span className="text-xs font-ledger text-encre/50 shrink-0">
                {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
            </div>
            <ScoreLive data={data} />
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={i}
                title={s.label}
                onClick={() => setStep(i)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i === step ? 'bg-gradient-blue' : i < step ? 'bg-sauge' : 'bg-encre/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-4">
        <div className="max-w-2xl mx-auto card">
          {step === 0 && (
            <div className="insight-box mb-6">
              Pensez à 5 personnes qui seraient intéressées à participer au sondage. L&apos;objectif est de rencontrer minimum 10 personnes par semaine pour atteindre notre objectif annuel.
            </div>
          )}
          <CurrentStep data={data} onChange={onChange} />
          {STEPS[step].label !== 'Bilan & recommandations' && (
            <div className="mt-6 pt-4 border-t border-encre/10">
              <label className="field-label">Note pour cette section (optionnel)</label>
              <textarea
                className="input mt-1 min-h-[70px]"
                placeholder="Remarques personnelles sur cette section..."
                value={data.notes[STEPS[step].label] || ''}
                onChange={e => onChange({ notes: { ...data.notes, [STEPS[step].label]: e.target.value } })}
              />
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-6 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto card !p-4 flex justify-between items-center gap-4">
          <button
            className="btn-secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            ← Précédent
          </button>

          {error && <p className="text-sceau text-sm">{error}</p>}

          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
              Suivant →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Envoi...' : 'Soumettre'}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Chargement...</p></div>}>
      <QuizContent />
    </Suspense>
  )
}
