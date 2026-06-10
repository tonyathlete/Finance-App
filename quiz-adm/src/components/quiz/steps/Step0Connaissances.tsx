'use client'
import { QuizData } from '@/lib/types'

const TIPS: Record<string, { emoji: string; titre: string; points: string[] }[]> = {
  salarie: [
    {
      emoji: '🏷️',
      titre: 'Économiser au quotidien',
      points: [
        'Apps comme Reebee & Flipp pour comparer les circulaires épicerie',
        'Programme de loyauté PC Optimum, AIR MILES, Scène+',
        'Cashback via Rakuten pour vos achats en ligne',
      ],
    },
    {
      emoji: '🚗',
      titre: 'Paiement d\'auto',
      points: [
        'Financer vs louer — connaissez-vous la vraie différence?',
        'Magasiner son assurance auto chaque année peut économiser 200–500 $/an',
        'Un bon taux de financement commence par un excellent dossier de crédit',
      ],
    },
    {
      emoji: '💼',
      titre: 'Avantages employeur',
      points: [
        'REER collectif avec contribution employeur = argent gratuit',
        'Assurances collectives — connaissez-vous l\'étendue de votre couverture?',
        'PAE (Programme d\'aide aux employés) souvent sous-utilisé',
      ],
    },
  ],
  autonome: [
    {
      emoji: '📊',
      titre: 'Optimisation fiscale',
      points: [
        'Un bon comptable spécialisé génère souvent plus qu\'il ne coûte',
        'Déductions : bureau à domicile, voiture, téléphone, formation…',
        'Incorporation : avantages fiscaux si revenus nets > 50 000 $/an',
      ],
    },
    {
      emoji: '🏦',
      titre: 'Gestion de trésorerie',
      points: [
        'Fonds d\'urgence : 3 à 6 mois de dépenses recommandés',
        'Séparer compte perso et compte d\'affaires dès le départ',
        'Mettre de côté ~30 % pour les impôts chaque paie',
      ],
    },
    {
      emoji: '🔒',
      titre: 'Protection du revenu',
      points: [
        'Pas d\'employeur = pas de protection automatique',
        'Assurance invalidité personnelle : votre filet de sécurité',
        'REER : déduction et report d\'impôt, essentiel sans régime collectif',
      ],
    },
  ],
  entrepreneur: [
    {
      emoji: '🏗️',
      titre: 'Structure d\'entreprise',
      points: [
        'Société de gestion (holding) : protection d\'actifs et report fiscal',
        'Fractionnement de revenu avec conjoint/famille selon la structure',
        'Surplus accumulés dans la compagnie à moindre taux d\'imposition',
      ],
    },
    {
      emoji: '🤝',
      titre: 'Protection de l\'entreprise',
      points: [
        'Convention entre actionnaires : incontournable avec associés',
        'Assurance clé-homme : que se passe-t-il si vous disparaissez?',
        'Assurance vie d\'entreprise : outil de planification successorale',
      ],
    },
    {
      emoji: '💰',
      titre: 'Rémunération optimale',
      points: [
        'Salaire vs dividendes : le bon mix selon votre situation fiscale',
        'REER : cotiser via salaire pour maximiser les déductions',
        'CELI dans la compagnie : non disponible — planifier la sortie de fonds',
      ],
    },
  ],
}

interface Props { data: QuizData; onChange: (u: Partial<QuizData>) => void }

const NIVEAUX = [
  { value: 'debutant', label: 'Débutant', desc: 'Je connais très peu ou pas du tout', emoji: '🌱' },
  { value: 'intermediaire', label: 'Intermédiaire', desc: 'J\'ai quelques notions de base', emoji: '📈' },
  { value: 'avance', label: 'Avancé', desc: 'Je m\'y connais bien', emoji: '🎯' },
]

const PRODUITS = ['CELI', 'CELIAPP', 'REER', 'REEE', 'Non-enregistré']

function NiveauSelector({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {NIVEAUX.map(n => (
        <label
          key={n.value}
          className={`flex flex-col items-center text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            value === n.value
              ? 'border-brand-500 bg-brand-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <input type="radio" name={name} value={n.value} checked={value === n.value}
            onChange={() => onChange(n.value)} className="sr-only" />
          <span className="text-2xl mb-2">{n.emoji}</span>
          <span className={`text-sm font-bold mb-1 ${value === n.value ? 'text-brand-700' : 'text-slate-700'}`}>{n.label}</span>
          <span className="text-xs text-slate-500 leading-tight">{n.desc}</span>
        </label>
      ))}
    </div>
  )
}

export default function Step0Connaissances({ data, onChange }: Props) {
  const toggleProduit = (p: string) => {
    const updated = data.produitsPlacements.includes(p)
      ? data.produitsPlacements.filter(x => x !== p)
      : [...data.produitsPlacements, p]
    onChange({ produitsPlacements: updated })
  }

  const tips = data.typeClient ? TIPS[data.typeClient] : null

  return (
    <div className="space-y-8">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-brand-900">Vos connaissances financières</h2>
        <p className="text-sm text-slate-500 mt-1">Aucune bonne ou mauvaise réponse — soyez honnête!</p>
      </div>

      {/* Trucs et conseils selon le profil */}
      {tips && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
            💡 Opportunités pour votre profil
          </p>
          <div className="grid gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tip.emoji}</span>
                  <p className="text-sm font-bold text-brand-800">{tip.titre}</p>
                </div>
                <ul className="space-y-1">
                  {tip.points.map((pt, j) => (
                    <li key={j} className="text-xs text-slate-600 flex gap-2">
                      <span className="text-brand-400 shrink-0">→</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marché boursier */}
      <div>
        <div className="section-title">Marché boursier</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du marché boursier?</p>
        <NiveauSelector
          name="connaissanceBourse"
          value={data.connaissanceBourse}
          onChange={v => onChange({ connaissanceBourse: v as QuizData['connaissanceBourse'] })}
        />
      </div>

      {/* Fonds de placements */}
      <div>
        <div className="section-title">Fonds de placements</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance des fonds de placements?</p>
        <NiveauSelector
          name="connaissancePlacements"
          value={data.connaissancePlacements}
          onChange={v => onChange({ connaissancePlacements: v as QuizData['connaissancePlacements'] })}
        />
        <div className="mt-5">
          <p className="field-label">Lesquels possédez-vous déjà? <span className="text-slate-400 font-normal">(cochez tout ce qui s&apos;applique)</span></p>
          <div className="flex flex-wrap gap-3 mt-2">
            {PRODUITS.map(p => (
              <label key={p} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                data.produitsPlacements.includes(p)
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
              }`}>
                <input type="checkbox" className="sr-only" checked={data.produitsPlacements.includes(p)}
                  onChange={() => toggleProduit(p)} />
                <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center text-xs shrink-0 ${
                  data.produitsPlacements.includes(p) ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'
                }`}>
                  {data.produitsPlacements.includes(p) && '✓'}
                </span>
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Assurances — niveau de connaissance seulement */}
      <div>
        <div className="section-title">Assurances</div>
        <p className="text-sm text-slate-600 mb-1">Quel est votre niveau de connaissance du fonctionnement des assurances?</p>
        <NiveauSelector
          name="connaissanceAssurances"
          value={data.connaissanceAssurances}
          onChange={v => onChange({ connaissanceAssurances: v as QuizData['connaissanceAssurances'] })}
        />
      </div>
    </div>
  )
}
