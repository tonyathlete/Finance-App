import type { GoalType, InsuranceType, CheckInMood, FollowUpStatus } from '@/types';

export const goalTypeLabel: Record<GoalType, string> = {
  voyage: 'Voyage',
  retraite: 'Retraite',
  dette: 'Remboursement de dette',
  fonds_urgence: "Fonds d'urgence",
  achat: 'Achat important',
  autre: 'Autre',
};

export const goalTypeIcon: Record<GoalType, string> = {
  voyage: 'fa-plane',
  retraite: 'fa-umbrella-beach',
  dette: 'fa-hand-holding-dollar',
  fonds_urgence: 'fa-shield-heart',
  achat: 'fa-tag',
  autre: 'fa-bullseye',
};

export const insuranceTypeLabel: Record<InsuranceType, string> = {
  vie: 'Assurance vie',
  invalidite: 'Assurance invalidité',
  maladies_graves: 'Maladies graves',
  hypothecaire: 'Assurance hypothécaire',
  auto: 'Assurance auto',
  habitation: 'Assurance habitation',
  sante: 'Assurance santé',
  autre: 'Autre',
};

export const insuranceTypeIcon: Record<InsuranceType, string> = {
  vie: 'fa-heart-pulse',
  invalidite: 'fa-wheelchair',
  maladies_graves: 'fa-notes-medical',
  hypothecaire: 'fa-house-chimney',
  auto: 'fa-car',
  habitation: 'fa-house',
  sante: 'fa-briefcase-medical',
  autre: 'fa-file-shield',
};

export const moodLabel: Record<CheckInMood, string> = {
  excellent: 'Excellente',
  bien: 'Bonne',
  moyen: 'Moyenne',
  difficile: 'Difficile',
};

export const moodEmoji: Record<CheckInMood, string> = {
  excellent: '🌟',
  bien: '🙂',
  moyen: '😐',
  difficile: '😓',
};

export const followUpStatusLabel: Record<FollowUpStatus, string> = {
  a_faire: 'À faire',
  planifie: 'Planifié',
  complete: 'Complété',
};
