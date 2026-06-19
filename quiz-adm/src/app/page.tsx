'use client'
import { useRouter } from 'next/navigation'

const CLIENT_TYPES = [
  {
    key: 'salarie',
    label: 'Salarié',
    icon: '👔',
    subtitle: 'Employé à temps plein ou partiel',
    gradient: 'from-blue-500 to-brand-700',
    bgGradient: 'from-blue-50 to-indigo-100',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    badgeBg: 'bg-blue-100 text-blue-700',
    points: [
      'Économiser sur ses dépenses courantes (Reebee, Flipp)',
      'Magasiner son assurance auto et habitation',
      'Optimiser son paiement auto (financement vs location)',
      'Maximiser ses avantages sociaux employeur (REER collectif)',
    ],
  },
  {
    key: 'autonome',
    label: 'Travailleur autonome',
    icon: '💼',
    subtitle: 'Freelance, consultant, auto-entrepreneur',
    gradient: 'from-violet-500 to-purple-700',
    bgGradient: 'from-violet-50 to-purple-100',
    borderColor: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400',
    badgeBg: 'bg-violet-100 text-violet-700',
    points: [
      'Avoir un bon comptable (économies d\'impôt significatives)',
      'Fonds d\'urgence (3-6 mois de revenus)',
      'Assurance invalidité (revenu non garanti = risque élevé)',
      'Défis : acquisition de clients, gestion financière',
    ],
  },
  {
    key: 'entrepreneur',
    label: 'Entrepreneur',
    icon: '🏢',
    subtitle: 'Propriétaire d\'entreprise incorporée',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-100',
    borderColor: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-700',
    points: [
      'Connaître ses chiffres d\'affaires et marges',
      'Structure corporative optimisée (holding, dividendes)',
      'Assurance clé-homme (protéger l\'entreprise)',
      'Planification successorale / rachat d\'associé',
    ],
  },
]

export default function HomePage() {
  const router = useRouter()

  const startQuiz = (type: string) => {
    router.push(`/quiz?type=${type}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-hero text-white py-8 px-6 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/20">
              📋
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quiz ADM</h1>
              <p className="text-blue-200 text-sm">Analyse de marché, conseiller financier</p>
            </div>
          </div>
          <a href="/dashboard" className="text-white/90 text-sm hover:text-white font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all border border-white/20">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title block */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-900 mb-3">
              Quel type de client êtes-vous?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Sélectionnez le profil qui correspond le mieux à votre situation. Le quiz s&apos;adaptera pour vous offrir la meilleure expérience.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_TYPES.map((ct) => (
              <button
                key={ct.key}
                onClick={() => startQuiz(ct.key)}
                className={`group relative flex flex-col text-left rounded-2xl border-2 ${ct.borderColor} ${ct.hoverBorder} bg-gradient-to-br ${ct.bgGradient} p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-200/40 focus:outline-none focus:ring-4 focus:ring-brand-300`}
              >
                {/* Icon + gradient header */}
                <div className={`w-full -mx-0 -mt-0 mb-5 bg-gradient-to-br ${ct.gradient} rounded-xl py-6 flex flex-col items-center text-white shadow-lg`}>
                  <span className="text-5xl mb-2">{ct.icon}</span>
                  <span className="font-bold text-xl tracking-tight">{ct.label}</span>
                  <span className="text-white/75 text-xs mt-1">{ct.subtitle}</span>
                </div>

                {/* Points */}
                <ul className="space-y-2.5 flex-1">
                  {ct.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ct.badgeBg}`}>
                        {i + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`mt-6 w-full text-center py-3 rounded-xl bg-gradient-to-r ${ct.gradient} text-white font-semibold text-sm shadow group-hover:shadow-lg transition-all`}>
                  Démarrer le quiz →
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-400 text-sm mt-8">
            Le conseiller remplit ce formulaire en face du client. Les réponses sont sauvegardées dans le dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}
