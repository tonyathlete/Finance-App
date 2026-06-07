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
  // Étape 0 — Connaissances générales
  connaissanceBourse: 'debutant' | 'intermediaire' | 'avance' | ''
  connaissancePlacements: 'debutant' | 'intermediaire' | 'avance' | ''
  produitsPlacements: string[]
  connaissanceAssurances: 'debutant' | 'intermediaire' | 'avance' | ''
  aAssuranceMaladieGrave: 'oui' | 'non' | ''
  aAssuranceInvalidite: 'oui' | 'non' | ''
  aAssuranceVie: 'oui' | 'non' | ''

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
  evenementPerturbateur: string
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
  butEpargne: string
  pourquoiPasEpargne: string
  planifierRetraite: 'oui' | 'non' | ''
  ageRetraite: string
  strategieEnPlace: 'oui' | 'non' | ''
  certainStrategieRetraite: 'oui' | 'non' | ''
  commentEvalue: string

  // Étape 5 — Éducation
  ecolesPensee: string[]
  strategieEducation: 'oui' | 'non' | ''
  certainStrategieEducation: 'oui' | 'non' | ''

  // Étape 6 — Protection des biens
  assuranceAuto: 'oui' | 'non' | ''
  assuranceHabitation: 'oui' | 'non' | ''
  renouvellementAuto: string
  renouvellementHabitation: string
  frequenceMagasinage: string
  modeMagasinage: string

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

  // Étape 9 — Références
  references: Reference[]
}

export const defaultQuizData: QuizData = {
  connaissanceBourse: '',
  connaissancePlacements: '',
  produitsPlacements: [],
  connaissanceAssurances: '',
  aAssuranceMaladieGrave: '',
  aAssuranceInvalidite: '',
  aAssuranceVie: '',
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
  evenementPerturbateur: '',
  regimes: [],
  autresRegimes: '',
  protectionInvalidite: '',
  pourcentageSalaireConvert: '',
  tempsPourAssumer: '',
  calculCoutVie: '',
  commentEtabli: '',
  importantEpargner: '',
  butEpargne: '',
  pourquoiPasEpargne: '',
  planifierRetraite: '',
  ageRetraite: '',
  strategieEnPlace: '',
  certainStrategieRetraite: '',
  commentEvalue: '',
  ecolesPensee: [],
  strategieEducation: '',
  certainStrategieEducation: '',
  assuranceAuto: '',
  assuranceHabitation: '',
  renouvellementAuto: '',
  renouvellementHabitation: '',
  frequenceMagasinage: '',
  modeMagasinage: '',
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
  references: Array(5).fill(null).map(() => ({
    nom: '', telDom: '', cell: '', lien: '', emploi: '',
    nbreEnfants: '', statut: '', statutCivil: '',
  })),
}

export interface Submission {
  id: string
  created_at: string
  data: QuizData
}
