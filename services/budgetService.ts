import { BudgetData, BudgetAnalysis, CategoryAnalysis } from '../types';

const BENCHMARKS: Record<string, { label: string; max: number; color: string }> = {
  housing:     { label: 'Logement',        max: 30, color: '#f59e0b' },
  transport:   { label: 'Transport',        max: 15, color: '#f97316' },
  insurance:   { label: 'Assurances',       max: 10, color: '#84cc16' },
  debts:       { label: 'Dettes',           max: 20, color: '#ef4444' },
  groceries:   { label: 'Épicerie',         max: 15, color: '#10b981' },
  restaurants: { label: 'Restaurants',      max: 5,  color: '#6366f1' },
  leisure:     { label: 'Loisirs',          max: 5,  color: '#8b5cf6' },
  clothing:    { label: 'Vêtements',        max: 5,  color: '#ec4899' },
  health:      { label: 'Santé',            max: 5,  color: '#14b8a6' },
  other:       { label: 'Autres dépenses',  max: 5,  color: '#94a3b8' },
};

export function analyzeBudget(data: BudgetData): BudgetAnalysis {
  const totalIncome = data.revenue.salaryNet + data.revenue.otherIncome;

  const allExpenses: Record<string, number> = {
    housing:     data.fixedExpenses.housing,
    transport:   data.fixedExpenses.transport,
    insurance:   data.fixedExpenses.insurance,
    debts:       data.fixedExpenses.debts,
    groceries:   data.variableExpenses.groceries,
    restaurants: data.variableExpenses.restaurants,
    leisure:     data.variableExpenses.leisure,
    clothing:    data.variableExpenses.clothing,
    health:      data.variableExpenses.health,
    other:       data.variableExpenses.other,
  };

  const totalExpenses = Object.values(allExpenses).reduce((s, v) => s + v, 0);
  const surplus = totalIncome - totalExpenses;

  const categories: CategoryAnalysis[] = Object.entries(allExpenses)
    .filter(([, amount]) => amount > 0)
    .map(([key, amount]) => {
      const meta = BENCHMARKS[key];
      const percent = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
      const over = percent - meta.max;
      const status: CategoryAnalysis['status'] =
        over <= 0 ? 'ok' : over <= 5 ? 'warning' : 'danger';
      return {
        name: meta.label,
        amount,
        percent,
        benchmark: meta.max,
        status,
        color: meta.color,
      };
    });

  // Health score: start at 100, deduct for each category over benchmark
  let score = 100;
  for (const cat of categories) {
    const over = cat.percent - cat.benchmark;
    if (over > 0) score -= Math.min(over * 2, 20);
  }
  // Bonus/penalty for surplus
  if (totalIncome > 0) {
    const surplusRatio = (surplus / totalIncome) * 100;
    if (surplusRatio >= 20) score += 10;
    else if (surplusRatio >= 10) score += 5;
    else if (surplusRatio < 0) score -= 20;
  }
  const healthScore = Math.max(0, Math.min(100, Math.round(score)));

  const insights: string[] = buildInsights(categories, surplus, totalIncome);

  return { totalIncome, totalExpenses, surplus, categories, healthScore, insights };
}

function buildInsights(
  categories: CategoryAnalysis[],
  surplus: number,
  totalIncome: number,
): string[] {
  const msgs: string[] = [];

  for (const cat of categories) {
    const over = cat.percent - cat.benchmark;
    if (cat.status === 'danger') {
      msgs.push(
        `Votre poste "${cat.name}" représente ${cat.percent.toFixed(0)}% de vos revenus, soit ${over.toFixed(0)}% au-dessus de la norme recommandée de ${cat.benchmark}%.`,
      );
    } else if (cat.status === 'warning') {
      msgs.push(
        `Votre poste "${cat.name}" est légèrement élevé à ${cat.percent.toFixed(0)}% (norme: ${cat.benchmark}%). Une petite optimisation serait bénéfique.`,
      );
    }
  }

  if (surplus < 0) {
    msgs.push(
      `Attention : vos dépenses dépassent vos revenus de ${fmt(Math.abs(surplus))} par mois. C'est une situation à adresser rapidement.`,
    );
  } else if (totalIncome > 0 && (surplus / totalIncome) * 100 >= 20) {
    msgs.push(
      `Excellent ! Vous épargnez ${((surplus / totalIncome) * 100).toFixed(0)}% de vos revenus. Vous êtes en très bonne position pour atteindre vos objectifs financiers.`,
    );
  } else if (totalIncome > 0 && (surplus / totalIncome) * 100 >= 10) {
    msgs.push(
      `Vous disposez d'un surplus mensuel de ${fmt(surplus)}. Envisagez d'en investir une partie pour maximiser votre patrimoine.`,
    );
  }

  if (msgs.length === 0) {
    msgs.push('Votre budget est bien équilibré. Un conseiller peut vous aider à optimiser votre épargne et vos placements.');
  }

  return msgs;
}

export function fmt(amount: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(amount);
}
