import { QuizData } from './types'

export type Priorite = 'haute' | 'moyenne' | 'info'
export type Categorie =
  | 'Protection'
  | 'Épargne & Retraite'
  | 'Protection des biens'
  | 'Succession'
  | 'Optimisation du profil'

export interface Recommandation {
  id: string
  categorie: Categorie
  priorite: Priorite
  titre: string
  description: string
}

interface Check {
  id: string
  categorie: Categorie
  priorite: Priorite
  titre: string
  description: string
  // retourne true si une LACUNE existe (donc une recommandation est générée)
  lacune: (d: QuizData) => boolean
  // si false, le check ne s'applique pas à ce client (exclu du score)
  applicable?: (d: QuizData) => boolean
}

const CHECKS: Check[] = [
  // ---------- PROTECTION ----------
  {
    id: 'invalidite',
    categorie: 'Protection',
    priorite: 'haute',
    titre: 'Protéger votre revenu en cas d’invalidité',
    description:
      'Vous n’avez pas (ou peu) de protection en cas d’invalidité. Votre revenu est votre actif le plus important : une assurance invalidité le protège si vous ne pouvez plus travailler.',
    lacune: d => d.aAssuranceInvalidite === 'non' || d.protectionInvalidite === 'non',
  },
  {
    id: 'vie',
    categorie: 'Protection',
    priorite: 'haute',
    titre: 'Assurance vie pour protéger vos proches',
    description:
      'Avec un(e) conjoint(e) ou des enfants à charge, une assurance vie assure que votre famille puisse maintenir son niveau de vie en cas de décès.',
    lacune: d => d.aAssuranceVie === 'non',
    applicable: d => !!d.conjointNom || d.enfants.length > 0,
  },
  {
    id: 'maladie_grave',
    categorie: 'Protection',
    priorite: 'moyenne',
    titre: 'Considérer une assurance maladie grave',
    description:
      'Une assurance maladie grave verse un montant forfaitaire au diagnostic (cancer, infarctus, AVC…), vous permettant de vous concentrer sur votre rétablissement sans stress financier.',
    lacune: d => d.aAssuranceMaladieGrave === 'non',
  },
  {
    id: 'cout_vie_invalidite',
    categorie: 'Protection',
    priorite: 'info',
    titre: 'Établir votre coût de vie en cas d’invalidité',
    description:
      'Vous n’avez pas encore évalué combien de temps vous pourriez tenir financièrement. Un simple exercice permet de clarifier votre besoin réel.',
    lacune: d => d.calculCoutVie === 'non',
  },

  // ---------- ÉPARGNE & RETRAITE ----------
  {
    id: 'epargne_systematique',
    categorie: 'Épargne & Retraite',
    priorite: 'haute',
    titre: 'Mettre en place une épargne systématique',
    description:
      'Épargner automatiquement une partie de vos revenus, même modeste, est la base de l’indépendance financière. On peut commencer dès maintenant.',
    lacune: d => d.importantEpargner === 'non' || d.regimes.length === 0,
  },
  {
    id: 'optimisation_rendement',
    categorie: 'Épargne & Retraite',
    priorite: 'haute',
    titre: 'Optimiser le rendement de vos placements',
    description:
      'Un écart de quelques pourcents de rendement représente des dizaines de milliers de dollars sur le long terme. Voyons ensemble le potentiel de vos placements actuels.',
    lacune: d => d.connaissancePlacements === 'debutant' || d.regimes.length <= 1,
  },
  {
    id: 'strategie_retraite',
    categorie: 'Épargne & Retraite',
    priorite: 'moyenne',
    titre: 'Valider votre stratégie de retraite',
    description:
      'Vous n’êtes pas certain à 100 % que votre stratégie actuelle vous mènera à vos objectifs. Une projection claire permet de le confirmer ou d’ajuster le tir.',
    lacune: d =>
      d.strategieEnPlace === 'non' ||
      d.certainStrategieRetraite === 'non' ||
      d.planifierRetraite === 'non',
  },
  {
    id: 'reee_education',
    categorie: 'Épargne & Retraite',
    priorite: 'moyenne',
    titre: 'Profiter des subventions REEE pour les études',
    description:
      'Avec des enfants, le REEE offre des subventions gouvernementales (jusqu’à 30 %). Une stratégie d’épargne-études maximise ce que vos enfants recevront.',
    lacune: d => d.strategieEducation === 'non' || !d.regimes.includes('REEE'),
    applicable: d => d.enfants.length > 0,
  },

  // ---------- PROTECTION DES BIENS ----------
  {
    id: 'magasinage_assurance',
    categorie: 'Protection des biens',
    priorite: 'moyenne',
    titre: 'Magasiner vos assurances auto et habitation',
    description:
      'Vous magasinez rarement vos assurances. En regroupant et comparant, des économies importantes sont souvent possibles sans réduire votre protection.',
    lacune: d =>
      d.frequenceMagasinage === 'Une fois par 3, 4 ou 5 ans' ||
      d.frequenceMagasinage === 'Moins d\'une fois par 5 ans' ||
      d.frequenceMagasinage === 'Jamais',
  },

  // ---------- SUCCESSION ----------
  {
    id: 'testament',
    categorie: 'Succession',
    priorite: 'haute',
    titre: 'Rédiger un testament et un mandat de protection',
    description:
      'Sans testament, c’est la loi qui décide de la répartition de vos biens. Un testament et un mandat en cas d’inaptitude protègent vos volontés et vos proches.',
    lacune: d => d.testamentMandat === 'non' && d.testamentProcuration === 'non',
  },

  // ---------- OPTIMISATION DU PROFIL ----------
  // Salarié
  {
    id: 'reer_collectif',
    categorie: 'Optimisation du profil',
    priorite: 'moyenne',
    titre: 'Maximiser votre REER collectif',
    description:
      'Si votre employeur offre un REER collectif avec contribution, ne pas y cotiser au maximum revient à laisser de l’argent sur la table.',
    lacune: d => d.reerCollectif === 'non' || d.employeurContribue === 'non',
    applicable: d => d.typeClient === 'salarie',
  },
  {
    id: 'apps_economies',
    categorie: 'Optimisation du profil',
    priorite: 'info',
    titre: 'Utiliser des apps pour économiser au quotidien',
    description:
      'Des applications comme Reebee ou Flipp permettent de comparer les prix et circulaires pour réduire vos dépenses courantes.',
    lacune: d =>
      d.utilisationAppEconomies === 'Non' ||
      d.utilisationAppEconomies === 'Je ne connaissais pas',
    applicable: d => d.typeClient === 'salarie',
  },
  // Travailleur autonome
  {
    id: 'comptable',
    categorie: 'Optimisation du profil',
    priorite: 'haute',
    titre: 'S’entourer d’un bon comptable',
    description:
      'Un comptable spécialisé pour travailleurs autonomes génère souvent des économies d’impôt qui dépassent largement ses honoraires.',
    lacune: d => d.aComptable === 'non',
    applicable: d => d.typeClient === 'autonome',
  },
  {
    id: 'fonds_urgence',
    categorie: 'Optimisation du profil',
    priorite: 'haute',
    titre: 'Bâtir un fonds d’urgence de 3 à 6 mois',
    description:
      'Avec un revenu variable, un coussin de 3 à 6 mois de dépenses est essentiel pour traverser les périodes creuses sereinement.',
    lacune: d => d.fondsUrgence === 'Moins de 3 mois' || d.fondsUrgence === 'Non',
    applicable: d => d.typeClient === 'autonome',
  },
  {
    id: 'invalidite_perso',
    categorie: 'Optimisation du profil',
    priorite: 'haute',
    titre: 'Souscrire une assurance invalidité personnelle',
    description:
      'Sans employeur, aucune protection de revenu n’est automatique. Une assurance invalidité personnelle est cruciale pour un travailleur autonome.',
    lacune: d => d.assuranceInvaliditePerso === 'non',
    applicable: d => d.typeClient === 'autonome',
  },
  // Entrepreneur
  {
    id: 'structure_corpo',
    categorie: 'Optimisation du profil',
    priorite: 'moyenne',
    titre: 'Optimiser votre structure corporative',
    description:
      'Une structure avec société de gestion (holding) peut offrir des avantages fiscaux et de protection d’actifs importants selon votre situation.',
    lacune: d => d.structureCorporative === 'non',
    applicable: d => d.typeClient === 'entrepreneur',
  },
  {
    id: 'convention_actionnaires',
    categorie: 'Optimisation du profil',
    priorite: 'haute',
    titre: 'Mettre en place une convention entre actionnaires',
    description:
      'Avec des associés, une convention (souvent financée par assurance vie) protège l’entreprise et les familles en cas de décès ou de départ d’un actionnaire.',
    lacune: d => d.conventionActionnaires === 'non',
    applicable: d => d.typeClient === 'entrepreneur' && d.aAssocies === 'oui',
  },
  {
    id: 'cle_homme',
    categorie: 'Optimisation du profil',
    priorite: 'moyenne',
    titre: 'Protéger l’entreprise avec une assurance clé-homme',
    description:
      'Si la perte d’une personne clé mettrait l’entreprise en péril, une assurance clé-homme assure sa continuité financière.',
    lacune: d => d.assuranceCleHomme === 'non',
    applicable: d => d.typeClient === 'entrepreneur',
  },
  {
    id: 'remuneration',
    categorie: 'Optimisation du profil',
    priorite: 'moyenne',
    titre: 'Optimiser votre mix salaire / dividendes',
    description:
      'Le bon équilibre entre salaire et dividendes dépend de votre situation. Une analyse peut réduire votre facture fiscale globale.',
    lacune: d => d.typeRemunerationEntrepreneur === 'Je ne sais pas ce qui est optimal',
    applicable: d => d.typeClient === 'entrepreneur',
  },
]

export interface Bilan {
  score: number
  recommandations: Recommandation[]
  parCategorie: Record<string, { total: number; ok: number }>
  totalChecks: number
  okChecks: number
}

export function genererBilan(d: QuizData): Bilan {
  const applicables = CHECKS.filter(c => !c.applicable || c.applicable(d))
  const recommandations: Recommandation[] = []
  const parCategorie: Record<string, { total: number; ok: number }> = {}

  for (const c of applicables) {
    if (!parCategorie[c.categorie]) parCategorie[c.categorie] = { total: 0, ok: 0 }
    parCategorie[c.categorie].total++
    if (c.lacune(d)) {
      recommandations.push({
        id: c.id,
        categorie: c.categorie,
        priorite: c.priorite,
        titre: c.titre,
        description: c.description,
      })
    } else {
      parCategorie[c.categorie].ok++
    }
  }

  const totalChecks = applicables.length
  const okChecks = totalChecks - recommandations.length
  const score = totalChecks === 0 ? 100 : Math.round((okChecks / totalChecks) * 100)

  // tri : haute > moyenne > info
  const ordre: Record<Priorite, number> = { haute: 0, moyenne: 1, info: 2 }
  recommandations.sort((a, b) => ordre[a.priorite] - ordre[b.priorite])

  return { score, recommandations, parCategorie, totalChecks, okChecks }
}
