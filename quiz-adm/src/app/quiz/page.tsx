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
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-glow">
            ✓
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent mb-3">Merci!</h1>
          <p className="text-slate-600 mb-8">Le formulaire a été soumis avec succès.</p>
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
      <header className="bg-gradient-hero text-white py-6 px-6 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-2xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <a href="/" className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/20 hover:bg-white/25 transition-all">
              ←
            </a>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Quiz ADM</h1>
              <p className="text-blue-200 text-xs">Analyse de marché, conseiller financier</p>
            </div>
          </div>
          <a href="/dashboard" className="text-white/90 text-sm hover:text-white font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all border border-white/20">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/40 px-6 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-brand-900 truncate">{STEPS[step].label}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                {step + 1} / {STEPS.length}
              </span>
            </div>
            <ScoreLive data={data} />
          </div>
          <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-brand-700 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <button
                key={i}
                title={s.label}
                onClick={() => setStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === step ? 'bg-accent-500 scale-125 shadow-md' : i < step ? 'bg-brand-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto card">
          {step === 0 && (
            <div className="insight-box mb-6">
              💡 Pensez à 5 personnes qui seraient intéressées à participer au sondage. L&apos;objectif est de rencontrer minimum 10 personnes par semaine pour atteindre notre objectif annuel.
            </div>
          )}
          <CurrentStep data={data} onChange={onChange} />
          {STEPS[step].label !== 'Bilan & recommandations' && (
            <div className="mt-6 pt-4 border-t border-slate-100">
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
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/40 px-6 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
          <button
            className="btn-secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            ← Précédent
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
