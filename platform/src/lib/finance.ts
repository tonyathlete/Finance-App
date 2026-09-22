// Calculs budgétaires et d'objectifs
import type { Client, Goal, IncomeItem, BudgetItem } from '@/types';
import { monthsUntil, clamp } from './utils';

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
