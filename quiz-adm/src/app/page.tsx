'use client'
import { useRouter } from 'next/navigation'

const CLIENT_TYPES = [
  {
    key: 'salarie',
    code: '01',
    label: 'Salarié',
    subtitle: 'Employé à temps plein ou partiel',
    points: [
      'Économiser sur ses dépenses courantes (Reebee, Flipp)',
      'Magasiner son assurance auto et habitation',
      'Optimiser son paiement auto (financement vs location)',
      'Maximiser ses avantages sociaux employeur (REER collectif)',
    ],
  },
  {
    key: 'autonome',
    code: '02',
    label: 'Travailleur autonome',
    subtitle: 'Freelance, consultant, auto-entrepreneur',
    points: [
      'Avoir un bon comptable (économies d\'impôt significatives)',
      'Fonds d\'urgence (3-6 mois de revenus)',
      'Assurance invalidité (revenu non garanti = risque élevé)',
      'Défis : acquisition de clients, gestion financière',
    ],
  },
  {
    key: 'entrepreneur',
    code: '03',
    label: 'Entrepreneur',
    subtitle: 'Propriétaire d\'entreprise incorporée',
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
      <header className="py-6 px-6 relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-blue shadow-stamp-sm shrink-0" />
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-encre">Quiz ADM</h1>
              <p className="text-encre/45 text-xs font-ledger tracking-wide">RENCONTRE — CONSEILLER &amp; CLIENT</p>
            </div>
          </div>
          <a href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-14">
        <div className="max-w-4xl mx-auto">
          {/* Title block */}
          <div className="mb-12 max-w-2xl">
            <p className="font-ledger text-xs tracking-[0.2em] text-brand-500 font-bold mb-3">AVANT DE COMMENCER</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-encre mb-3 leading-tight">
              Quel type de client recevez-vous?
            </h2>
            <p className="text-encre/60 text-base font-body">
              Le profil choisi détermine quelles questions s&apos;ajoutent au dossier. Vous pourrez toujours revenir en arrière.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CLIENT_TYPES.map((ct) => (
              <button
                key={ct.key}
                onClick={() => startQuiz(ct.key)}
                className="group relative flex flex-col text-left card hover:shadow-glow hover:-translate-y-1 transition-all duration-200 focus:outline-none"
              >
                <span className="w-8 h-8 rounded-lg bg-gradient-blue text-white text-xs font-ledger font-bold flex items-center justify-center mb-4">{ct.code}</span>
                <h3 className="font-display font-bold text-lg text-encre mb-1">{ct.label}</h3>
                <p className="text-encre/50 text-xs mb-5">{ct.subtitle}</p>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {ct.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-encre/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
                  Démarrer le quiz
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-encre/45 text-sm mt-8 font-body italic">
            Le conseiller remplit ce formulaire en face du client. Les réponses sont sauvegardées dans le dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}
