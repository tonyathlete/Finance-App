'use client'
import { useState } from 'react'
import { QuizData, defaultQuizData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import Step1InfoPersonnelles from '@/components/quiz/steps/Step1InfoPersonnelles'
import Step2Autonomie from '@/components/quiz/steps/Step2Autonomie'
import Step3Invalidite from '@/components/quiz/steps/Step3Invalidite'
import Step4Epargne from '@/components/quiz/steps/Step4Epargne'
import Step5Education from '@/components/quiz/steps/Step5Education'
import Step6ProtectionBiens from '@/components/quiz/steps/Step6ProtectionBiens'
import Step7LieuHabitation from '@/components/quiz/steps/Step7LieuHabitation'
import Step8Testament from '@/components/quiz/steps/Step8Testament'
import Step9References from '@/components/quiz/steps/Step9References'

const STEPS = [
  { label: 'Informations personnelles', component: Step1InfoPersonnelles },
  { label: 'Autonomie financière', component: Step2Autonomie },
  { label: 'Invalidité', component: Step3Invalidite },
  { label: 'Épargne', component: Step4Epargne },
  { label: 'Éducation', component: Step5Education },
  { label: 'Protection des biens', component: Step6ProtectionBiens },
  { label: "Lieu d'habitation", component: Step7LieuHabitation },
  { label: 'Testament et mandat', component: Step8Testament },
  { label: 'Références', component: Step9References },
]

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<QuizData>(defaultQuizData)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-ia-blue mb-2">Merci!</h1>
          <p className="text-gray-600 mb-6">Le formulaire a été soumis avec succès.</p>
          <button className="btn-primary" onClick={() => { setData(defaultQuizData); setStep(0); setSubmitted(false) }}>
            Nouveau client
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-ia-blue text-white py-4 px-6 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Quiz ADM</h1>
            <p className="text-blue-200 text-xs">Analyse de marché</p>
          </div>
          <a href="/dashboard" className="text-blue-200 text-sm hover:text-white underline">
            Tableau de bord →
          </a>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{STEPS[step].label}</span>
            <span>{step + 1} / {STEPS.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-ia-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <button
                key={i}
                title={s.label}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-ia-blue' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CurrentStep data={data} onChange={onChange} />
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
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
