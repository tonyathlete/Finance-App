// ============================================================================
// Modèle de données de la plateforme (brouillon)
// Principe de minimisation des données (Loi 25 / AMF) : on ne stocke que le
// strict nécessaire à l'accompagnement budgétaire. AUCUNE donnée sensible
// (NAS, numéro de police complet, numéro de compte, dossier médical, etc.).
// ============================================================================

export type Role = 'client' | 'advisor';

export type GoalType = 'voyage' | 'retraite' | 'dette' | 'fonds_urgence' | 'achat' | 'autre';

export type CheckInMood = 'excellent' | 'bien' | 'moyen' | 'difficile';

export type BudgetFrequency = 'mensuel' | 'hebdomadaire' | 'annuel';

// --- Budget ----------------------------------------------------------------

export interface BudgetItem {
  id: string;
  label: string;
  category: string;          // ex: Logement, Transport, Épicerie, Loisirs...
  amount: number;            // montant mensuel (normalisé)
  essential: boolean;        // dépense essentielle vs discrétionnaire
}

export interface IncomeItem {
  id: string;
  label: string;
  amount: number;            // montant mensuel net
  variable: boolean;         // revenu variable (utile pour travailleurs autonomes)
}

// --- Objectifs -------------------------------------------------------------

export interface GoalMilestone {
  id: string;
  label: string;
  done: boolean;
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;        // ISO
  note: string;
  milestones: GoalMilestone[];
  createdAt: string;
}

// --- Assurance (récap seulement, pas de données sensibles) ------------------

export type InsuranceType =
  | 'vie'
  | 'invalidite'
  | 'maladies_graves'
  | 'hypothecaire'
  | 'auto'
  | 'habitation'
  | 'sante'
  | 'autre';

export interface InsurancePolicy {
  id: string;
  type: InsuranceType;
  insurer: string;           // nom de l'assureur seulement
  coverageAmount?: number;   // capital assuré (optionnel)
  monthlyPremium?: number;   // prime mensuelle
  renewalDate?: string;      // ISO — pour les rappels
  note: string;
  // NB: on ne stocke JAMAIS le numéro de police complet ni de bénéficiaires nommés.
}

// --- Check-in hebdomadaire -------------------------------------------------

export interface CheckIn {
  id: string;
  weekOf: string;            // ISO (lundi de la semaine)
  mood: CheckInMood;
  incomeThisWeek?: number;   // utile travailleurs autonomes
  savedThisWeek?: number;
  wins: string;              // ce qui a bien été
  blockers: string;          // obstacles
  focusNextWeek: string;     // priorité de la semaine suivante
  goalProgressNote: string;
  createdAt: string;
}

// --- Suivi / relance côté conseiller ---------------------------------------

export type FollowUpStatus = 'a_faire' | 'planifie' | 'complete';

export interface FollowUp {
  id: string;
  title: string;
  dueDate: string;           // ISO
  status: FollowUpStatus;
  note: string;
  createdAt: string;
}

export interface AdvisorNote {
  id: string;
  date: string;              // ISO
  text: string;
}

// --- Client ----------------------------------------------------------------

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Contexte léger (jamais de données sensibles)
  situation: string;         // ex: « Travailleur autonome, 2 enfants »
  isSelfEmployed: boolean;
  consentGivenAt?: string;   // consentement Loi 25 (collecte/usage)
  createdAt: string;

  incomes: IncomeItem[];
  budget: BudgetItem[];
  goals: Goal[];
  insurance: InsurancePolicy[];
  checkIns: CheckIn[];
  followUps: FollowUp[];
  advisorNotes: AdvisorNote[];
}

// --- Identité du conseiller (obligations AMF : identification) ---------------

export interface AdvisorProfile {
  fullName: string;
  title: string;             // ex: Conseiller en sécurité financière
  firm: string;
  amfNumber: string;         // no de certificat AMF
  email: string;
  phone: string;
}

export interface AppState {
  advisor: AdvisorProfile;
  clients: Client[];
  currentUserId: string | null; // id du client connecté (mode client)
  role: Role | null;
}
