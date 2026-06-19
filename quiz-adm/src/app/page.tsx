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
      <header className="bg-encre text-papier-card py-6 px-6 relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <span className="font-ledger text-xs tracking-[0.2em] text-manille border border-manille/40 px-2 py-1">
              DOSSIER
            </span>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight">Quiz ADM</h1>
              <p className="text-papier-card/60 text-xs font-ledger tracking-wide">RENCONTRE — CONSEILLER &amp; CLIENT</p>
            </div>
          </div>
          <a href="/dashboard" className="text-papier-card/80 text-sm hover:text-papier-card font-medium border border-papier-card/25 hover:border-papier-card/60 px-4 py-2 transition-colors">
            Dashboard →
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-14">
        <div className="max-w-4xl mx-auto">
          {/* Title block */}
          <div className="mb-12 max-w-2xl">
            <p className="font-ledger text-xs tracking-[0.2em] text-sceau mb-3">AVANT DE COMMENCER</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-encre mb-3 leading-tight">
              Quel type de client recevez-vous?
            </h2>
            <p className="text-encre/60 text-base font-body">
              Le profil choisi détermine quelles questions s&apos;ajoutent au dossier. Vous pourrez toujours revenir en arrière.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-encre/15 border border-encre/15">
            {CLIENT_TYPES.map((ct) => (
              <button
                key={ct.key}
                onClick={() => startQuiz(ct.key)}
                className="group relative flex flex-col text-left bg-papier-card p-6 transition-colors duration-150 hover:bg-encre focus:outline-none"
              >
                <span className="font-ledger text-xs text-sceau group-hover:text-manille mb-4 block">{ct.code}</span>
                <h3 className="font-display font-semibold text-lg text-encre group-hover:text-papier-card mb-1">{ct.label}</h3>
                <p className="text-encre/55 group-hover:text-papier-card/60 text-xs mb-5">{ct.subtitle}</p>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {ct.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-encre/75 group-hover:text-papier-card/85">
                      <span className="font-ledger text-[11px] mt-0.5 text-encre/40 group-hover:text-manille shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-semibold text-encre group-hover:text-papier-card">
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
