export interface Enfant {
  nom: string
  age: string
}

export interface Reference {
  nom: string
  telDom: string
  cell: string
  lien: string
  emploi: string
  nbreEnfants: string
  statut: 'proprietaire' | 'locataire' | ''
  statutCivil: string
}

export interface QuizData {
  // Étape 0 — Sentiment économique
  sentimentEconomieCanada: 'confiant' | 'neutre' | 'inquiet' | 'tres_inquiet' | ''
  stressAvenirFinancier: 'oui' | 'un_peu' | 'non' | ''
  inflationImpact: 'beaucoup' | 'un_peu' | 'pas_vraiment' | ''
  confianceMarcheBoursier: 'tres_confiant' | 'confiant' | 'incertain' | 'mefiant' | ''
  craintRecession: 'oui' | 'incertain' | 'non' | ''
  principalesInquietudes: string[]

  // Étape 0 — Connaissances générales
  connaissanceBourse: 'debutant' | 'intermediaire' | 'avance' | ''
  connaissancePlacements: 'debutant' | 'intermediaire' | 'avance' | ''
  produitsPlacements: string[]
  connaissanceAssurances: 'debutant' | 'intermediaire' | 'avance' | ''
  aAssuranceMaladieGrave: 'oui' | 'non' | ''
  aAssuranceInvalidite: 'oui' | 'non' | ''
  aAssuranceVie: 'oui' | 'non' | ''
  // Assurances — détails
  assuranceVieType: 'permanente' | 'temporaire' | ''
  assuranceInvaliditeType: 'collectif' | 'privee' | ''
  assuranceInvaliditeDuree: string
  assuranceInvaliditeMontant: string
  assuranceMaladieGraveType: 'temporaire' | 'remboursement' | 'les_deux' | ''
  assuranceMaladieGraveMontant: string

  // Étape 1 — Infos personnelles
  typeClient: 'salarie' | 'autonome' | 'entrepreneur' | ''
  prenom: string
  nom: string
  age: string
  telephone: string
  courriel: string
  adresse: string
  statutCivil: string
  conjointNom: string
  conjointAge: string
  conjointEmploi: string
  enfants: Enfant[]

  // Étape 2 — Autonomie financière
  significationAutonomie: string
  revenuConjointNecessaire: 'oui' | 'non' | ''
  evenementPerturbateur: string[]
  regimes: string[]
  autresRegimes: string

  // Étape 3 — Invalidité
  protectionInvalidite: 'oui' | 'non' | ''
  pourcentageSalaireConvert: string
  tempsPourAssumer: string
  calculCoutVie: 'oui' | 'non' | ''
  commentEtabli: string

  // Étape 4 — Épargne
  importantEpargner: 'oui' | 'non' | ''
  butEpargne: string[]
  pourquoiPasEpargne: string
  planifierRetraite: 'oui' | 'non' | ''
  ageRetraite: string
  strategieEnPlace: 'oui' | 'non' | ''
  certainStrategieRetraite: 'oui' | 'non' | ''
  commentEvalue: string
  // Calculateur retraite
  retraiteAgeActuel: string
  retraiteAgeVise: string
  retraiteEpargneActuelle: string
  retraiteEpargneMensuelle: string
  retraiteRevenuVise: string
  // Calculateur capital décès
  capitalRevenuAnnuel: string
  capitalAnneesCouvrir: string
  capitalDettes: string
  capitalCouvertureActuelle: string

  // Étape 5 — Éducation
  ecolesPensee: string[]
  strategieEducation: 'oui' | 'non' | ''
  certainStrategieEducation: 'oui' | 'non' | ''

  // Étape 6 — Protection des biens + habitation (fusionnées)
  assuranceAuto: 'oui' | 'non' | ''
  assuranceHabitation: 'oui' | 'non' | ''
  renouvellementAuto: string
  renouvellementHabitation: string
  frequenceMagasinage: string
  modeMagasinage: string
  coutLogementType: 'loyer' | 'hypotheque' | ''
  coutLogementMensuel: string

  // Impact perte de revenu (étape invalidité)
  revenuMensuel1: string
  revenuMensuel2: string
  depensesMensuelles: string
  // Dépenses détaillées
  depenseVoiture: string
  depenseLoyer: string
  depenseAssurance: string
  depenseEpicerie: string
  depenseAutres: string

  // Étape 7 — Lieu d'habitation
  statutHabitation: 'proprietaire' | 'locataire' | ''
  pretHypothecaire: 'oui' | 'non' | ''
  institutionFinanciere: string
  protectionDeces: 'oui' | 'non' | ''
  connaissanceAvantages: 'oui' | 'non' | ''
  connaissanceDiffAssurances: 'oui' | 'non' | ''
  projetAchat: 'oui' | 'non' | ''
  quandCommentAchat: string
  loyerCouvert: 'oui' | 'non' | ''

  // Étape 8 — Testament et mandat
  testamentMandat: 'oui' | 'non' | ''
  enregistreNotaire: 'oui' | 'non' | ''
  testamentProcuration: 'oui' | 'non' | ''
  connaissanceConsequences: 'oui' | 'non' | ''

  // Étape type-spécifique — Salarié
  reerCollectif: 'oui' | 'non' | ''
  employeurContribue: 'oui' | 'non' | ''
  assurancesCollectives: 'oui' | 'non' | ''
  aVehicule: 'oui' | 'non' | ''
  typeFinancementAuto: string
  utilisationAppEconomies: string

  // Étape type-spécifique — Travailleur autonome
  aComptable: 'oui' | 'non' | ''
  estIncorpore: 'oui' | 'non' | ''
  fondsUrgence: string
  defisActuels: string[]
  assuranceInvaliditePerso: 'oui' | 'non' | ''

  // Étape type-spécifique — Entrepreneur
  chiffreAffaires: string
  structureCorporative: 'oui' | 'non' | ''
  aAssocies: 'oui' | 'non' | ''
  conventionActionnaires: 'oui' | 'non' | ''
  assuranceCleHomme: 'oui' | 'non' | ''
  typeRemunerationEntrepreneur: string

  // Étape 9 — Références
  references: Reference[]

  // Notes libres du conseiller, une par étape (clé = label de l'étape)
  notes: Record<string, string>

  // Corrections manuelles apportées au rapport final (clé = label du champ)
  reportOverrides: Record<string, string>
}

export const defaultQuizData: QuizData = {
  sentimentEconomieCanada: '',
  stressAvenirFinancier: '',
  inflationImpact: '',
  confianceMarcheBoursier: '',
  craintRecession: '',
  principalesInquietudes: [],
  connaissanceBourse: '',
  connaissancePlacements: '',
  produitsPlacements: [],
  connaissanceAssurances: '',
  aAssuranceMaladieGrave: '',
  aAssuranceInvalidite: '',
  aAssuranceVie: '',
  assuranceVieType: '',
  assuranceInvaliditeType: '',
  assuranceInvaliditeDuree: '',
  assuranceInvaliditeMontant: '',
  assuranceMaladieGraveType: '',
  assuranceMaladieGraveMontant: '',
  typeClient: '',
  prenom: '',
  nom: '',
  age: '',
  telephone: '',
  courriel: '',
  adresse: '',
  statutCivil: '',
  conjointNom: '',
  conjointAge: '',
  conjointEmploi: '',
  enfants: [],
  significationAutonomie: '',
  revenuConjointNecessaire: '',
  evenementPerturbateur: [],
  regimes: [],
  autresRegimes: '',
  protectionInvalidite: '',
  pourcentageSalaireConvert: '',
  tempsPourAssumer: '',
  calculCoutVie: '',
  commentEtabli: '',
  importantEpargner: '',
  butEpargne: [],
  pourquoiPasEpargne: '',
  planifierRetraite: '',
  ageRetraite: '',
  strategieEnPlace: '',
  certainStrategieRetraite: '',
  commentEvalue: '',
  retraiteAgeActuel: '',
  retraiteAgeVise: '',
  retraiteEpargneActuelle: '',
  retraiteEpargneMensuelle: '',
  retraiteRevenuVise: '',
  capitalRevenuAnnuel: '',
  capitalAnneesCouvrir: '',
  capitalDettes: '',
  capitalCouvertureActuelle: '',
  ecolesPensee: [],
  strategieEducation: '',
  certainStrategieEducation: '',
  assuranceAuto: '',
  assuranceHabitation: '',
  renouvellementAuto: '',
  renouvellementHabitation: '',
  frequenceMagasinage: '',
  modeMagasinage: '',
  coutLogementType: '',
  coutLogementMensuel: '',
  revenuMensuel1: '',
  revenuMensuel2: '',
  depensesMensuelles: '',
  depenseVoiture: '',
  depenseLoyer: '',
  depenseAssurance: '',
  depenseEpicerie: '',
  depenseAutres: '',
  statutHabitation: '',
  pretHypothecaire: '',
  institutionFinanciere: '',
  protectionDeces: '',
  connaissanceAvantages: '',
  connaissanceDiffAssurances: '',
  projetAchat: '',
  quandCommentAchat: '',
  loyerCouvert: '',
  testamentMandat: '',
  enregistreNotaire: '',
  testamentProcuration: '',
  connaissanceConsequences: '',
  reerCollectif: '',
  employeurContribue: '',
  assurancesCollectives: '',
  aVehicule: '',
  typeFinancementAuto: '',
  utilisationAppEconomies: '',
  aComptable: '',
  estIncorpore: '',
  fondsUrgence: '',
  defisActuels: [],
  assuranceInvaliditePerso: '',
  chiffreAffaires: '',
  structureCorporative: '',
  aAssocies: '',
  conventionActionnaires: '',
  assuranceCleHomme: '',
  typeRemunerationEntrepreneur: '',
  references: Array(5).fill(null).map(() => ({
    nom: '', telDom: '', cell: '', lien: '', emploi: '',
    nbreEnfants: '', statut: '', statutCivil: '',
  })),
  notes: {},
  reportOverrides: {},
}

export interface Submission {
  id: string
  created_at: string
  data: QuizData
}
