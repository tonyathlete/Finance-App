// Calculs budgétaires et d'objectifs
import type { Client, Goal, IncomeItem, BudgetItem } from '@/types';
import { monthsUntil, clamp, daysUntil } from './utils';

export const totalIncome = (incomes: IncomeItem[]): number =>
  incomes.reduce((s, i) => s + (i.amount || 0), 0);

export const totalExpenses = (budget: BudgetItem[]): number =>
  budget.reduce((s, b) => s + (b.amount || 0), 0);

export const essentialExpenses = (budget: BudgetItem[]): number =>
  budget.filter((b) => b.essential).reduce((s, b) => s + (b.amount || 0), 0);

export const discretionaryExpenses = (budget: BudgetItem[]): number =>
  budget.filter((b) => !b.essential).reduce((s, b) => s + (b.amount || 0), 0);

export const monthlyBalance = (client: Client): number =>
  totalIncome(client.incomes) - totalExpenses(client.budget);

export const savingsRate = (client: Client): number => {
  const inc = totalIncome(client.incomes);
  if (inc <= 0) return 0;
  return clamp((monthlyBalance(client) / inc) * 100, -100, 100);
};

// Dépenses regroupées par catégorie (pour graphique)
export interface CategoryTotal {
  category: string;
  amount: number;
  essential: boolean;
}

export const expensesByCategory = (budget: BudgetItem[]): CategoryTotal[] => {
  const map = new Map<string, CategoryTotal>();
  for (const b of budget) {
    const cur = map.get(b.category) || {
      category: b.category,
      amount: 0,
      essential: b.essential,
    };
    cur.amount += b.amount || 0;
    map.set(b.category, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
};

// Progression d'un objectif (0-100)
export const goalProgress = (g: Goal): number => {
  if (g.targetAmount <= 0) return 0;
  return clamp((g.currentAmount / g.targetAmount) * 100);
};

// Estimation : est-on sur la bonne voie pour atteindre l'objectif à temps ?
export interface GoalProjection {
  monthsLeft: number;
  needed: number;             // montant restant
  requiredMonthly: number;    // contribution mensuelle requise pour y arriver
  onTrack: boolean;
  projectedShortfall: number; // manque projeté à la date cible
}

export const projectGoal = (g: Goal): GoalProjection => {
  const monthsLeft = Math.max(1, monthsUntil(g.targetDate));
  const needed = Math.max(0, g.targetAmount - g.currentAmount);
  const requiredMonthly = needed / monthsLeft;
  const projectedSavings = g.currentAmount + g.monthlyContribution * monthsLeft;
  const projectedShortfall = Math.max(0, g.targetAmount - projectedSavings);
  return {
    monthsLeft,
    needed,
    requiredMonthly,
    onTrack: g.monthlyContribution >= requiredMonthly - 0.5,
    projectedShortfall,
  };
};

// Fonds d'urgence recommandé (3 à 6 mois de dépenses essentielles)
export const emergencyFundTarget = (client: Client): { low: number; high: number } => {
  const ess = essentialExpenses(client.budget);
  return { low: ess * 3, high: ess * 6 };
};

// --- Règle 50/30/20 --------------------------------------------------------
// Besoins (essentiel) 50 % · Envies (discrétionnaire) 30 % · Épargne/dettes 20 %
export interface Rule503020 {
  income: number;
  needs: number;
  wants: number;
  savings: number; // capacité d'épargne = solde restant
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
}

export const fiftyThirtyTwenty = (client: Client): Rule503020 => {
  const income = totalIncome(client.incomes) || 0;
  const needs = essentialExpenses(client.budget);
  const wants = discretionaryExpenses(client.budget);
  const savings = Math.max(0, income - needs - wants);
  const p = (n: number) => (income > 0 ? (n / income) * 100 : 0);
  return {
    income,
    needs,
    wants,
    savings,
    needsPct: p(needs),
    wantsPct: p(wants),
    savingsPct: p(savings),
  };
};

// --- Alertes intelligentes -------------------------------------------------
export type AlertTone = 'rose' | 'amber' | 'forest';
export interface Alert {
  id: string;
  tone: AlertTone;
  icon: string;
  title: string;
  detail: string;
}

export const getAlerts = (client: Client): Alert[] => {
  const alerts: Alert[] = [];
  const bal = monthlyBalance(client);
  const rate = savingsRate(client);

  if (bal < 0) {
    alerts.push({
      id: 'deficit',
      tone: 'rose',
      icon: 'fa-triangle-exclamation',
      title: 'Budget déficitaire',
      detail: `Les dépenses dépassent les revenus de ${Math.abs(Math.round(bal))} $ par mois.`,
    });
  } else if (rate < 10 && totalIncome(client.incomes) > 0) {
    alerts.push({
      id: 'lowsavings',
      tone: 'amber',
      icon: 'fa-piggy-bank',
      title: "Taux d'épargne faible",
      detail: `Taux actuel : ${Math.round(rate)} %. Cible générale : 10 % et plus.`,
    });
  }

  // Renouvellements d'assurance dans les 60 jours
  for (const p of client.insurance) {
    if (!p.renewalDate) continue;
    const d = daysUntil(p.renewalDate);
    if (d >= 0 && d <= 60) {
      alerts.push({
        id: `renew_${p.id}`,
        tone: 'amber',
        icon: 'fa-calendar-day',
        title: 'Renouvellement à venir',
        detail: `Une protection (${p.insurer}) se renouvelle dans ${d} jour(s).`,
      });
    }
  }

  // Objectifs hors trajectoire
  const offTrack = client.goals.filter((g) => !projectGoal(g).onTrack && g.targetAmount > 0);
  if (offTrack.length) {
    alerts.push({
      id: 'goals_offtrack',
      tone: 'amber',
      icon: 'fa-bullseye',
      title: `${offTrack.length} objectif(s) à ajuster`,
      detail: 'Le rythme d’épargne actuel ne permet pas d’atteindre la cible à temps.',
    });
  }

  return alerts;
};
