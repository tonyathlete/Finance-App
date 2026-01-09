
export type Zone = 'Green' | 'Yellow' | 'Red';

export interface AnalysisResult {
  overallVulnerability: string;
  score: number;
  zone: Zone;
  mainRisks: string[];
  priorityRisk: string;
  summary: string;
  invitation: string;
}

export interface LeadInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface SurveyData {
  age: string;
  incomeRange: string;
  employmentStatus: string;
  emergencyFund: string;
  debtLevel: string;
  housingCost: string;
  dependents: string;
  insuranceCoverage: string;
  additionalContext: string;
  // Nouveaux champs Retraite
  retirementSavings: string;
  retirementAgeGoal: string;
  retirementContribution: string;
  leadInfo?: LeadInfo;
}
