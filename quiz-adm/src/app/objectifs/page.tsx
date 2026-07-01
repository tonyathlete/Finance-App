'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OBJECTIFS = [
  { key: 'Achat d\'une maison', emoji: '🏡' },
  { key: 'Faire 10 000 $ par mois', emoji: '💸' },
  { key: 'Me lancer à mon compte', emoji: '🚀' },
  { key: 'Achat d\'une voiture', emoji: '🚗' },
  { key: 'Préparer ma retraite', emoji: '🌴' },
  { key: 'Avoir 100 000 $ en placement', emoji: '📈' },
]

const ECHEANCES = ['1-2 ans', '3-4 ans', '5 ans +'] as const

const AUTRE = 'Autre'
const STORAGE_KEY = 'finance2026_objectifs'

export default function ObjectifsPage() {
  const router = useRouter()
  const [objectifs, setObjectifs] = useState<string[]>([])
  const [autre, setAutre] = useState('')
  const [echeance, setEcheance] = useState('')

  const toggle = (key: string) => {
    setObjectifs(prev => (prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]))
  }

  const maisonSelected = objectifs.includes('Achat d\'une maison')
  const autreSelected = objectifs.includes(AUTRE)
  const rien = objectifs.length === 0 && !autre.trim()

  const handleContinue = () => {
    const payload = {
      objectifs,
      objectifAutre: autreSelected ? autre.trim() : '',
      objectifMaisonEcheance: maisonSelected ? echeance : '',
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // sessionStorage indisponible — on continue quand même
    }
    router.push('/demarrer')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="w-9 h-9 flex items-center justify-center text-lg rounded-full bg-white/70 border border-encre/10 shadow-card hover:bg-white transition-colors">
            ←
          </a>
          <p className="text-encre/45 text-[11px] font-ledger tracking-wide">FINANCE 2026 — VOS OBJECTIFS</p>
          <span className="w-9" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-display font-bold text-encre mb-3 leading-tight">
              Quels sont vos objectifs?
            </h2>
            <p className="text-encre/60 font-body">
              Choisissez tout ce qui vous parle. Plusieurs choix sont possibles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OBJECTIFS.map(o => {
              const active = objectifs.includes(o.key)
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => toggle(o.key)}
                  className={`flex items-center gap-3 text-left p-4 rounded-2xl border-2 transition-all ${
                    active
                      ? 'border-brand-500 bg-brand-50 shadow-card'
                      : 'border-encre/10 bg-white/70 hover:border-brand-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{o.emoji}</span>
                  <span className={`text-sm font-semibold ${active ? 'text-brand-700' : 'text-encre/80'}`}>
                    {o.key}
                  </span>
                  <span className={`ml-auto w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs shrink-0 ${
                    active ? 'bg-brand-500 border-brand-500 text-white' : 'border-encre/20'
                  }`}>
                    {active && '✓'}
                  </span>
                </button>
              )
            })}

            {/* Autre — avec boîte de texte */}
            <button
              type="button"
              onClick={() => toggle(AUTRE)}
              className={`flex items-center gap-3 text-left p-4 rounded-2xl border-2 transition-all sm:col-span-2 ${
                autreSelected
                  ? 'border-brand-500 bg-brand-50 shadow-card'
                  : 'border-encre/10 bg-white/70 hover:border-brand-300'
              }`}
            >
              <span className="text-2xl shrink-0">✏️</span>
              <span className={`text-sm font-semibold ${autreSelected ? 'text-brand-700' : 'text-encre/80'}`}>
                Autre objectif
              </span>
              <span className={`ml-auto w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs shrink-0 ${
                autreSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-encre/20'
              }`}>
                {autreSelected && '✓'}
              </span>
            </button>
          </div>

          {autreSelected && (
            <div className="mt-3 animate-pop-in">
              <textarea
                className="input min-h-[70px]"
                placeholder="Décrivez votre objectif…"
                value={autre}
                onChange={e => setAutre(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Échéance pour l'achat d'une maison */}
          {maisonSelected && (
            <div className="mt-5 card animate-pop-in">
              <p className="field-label">🏡 Dans quel horizon souhaitez-vous acheter?</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {ECHEANCES.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEcheance(e)}
                    className={`rounded-full px-4 py-2 border-2 text-sm font-medium transition-all ${
                      echeance === e
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-encre/10 text-encre/70 hover:border-brand-300'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-6 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto card !p-4 flex justify-between items-center gap-4">
          <a href="/" className="btn-secondary">← Retour</a>
          <button className="btn-primary" onClick={handleContinue} disabled={rien}>
            Continuer →
          </button>
        </div>
      </footer>
    </div>
  )
}
