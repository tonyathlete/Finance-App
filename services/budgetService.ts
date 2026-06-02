import { BudgetData, BudgetAnalysis, CategoryAnalysis, PlaementsData } from '../types';

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

const PLACEMENT_META: Record<keyof PlaementsData, { label: string; color: string }> = {
  reer:   { label: 'REER',             color: '#0ea5e9' },
  celi:   { label: 'CELI',             color: '#22d3ee' },
  celiapp:{ label: 'CELIAPP',          color: '#a78bfa' },
  reee:   { label: 'REEE',             color: '#fb923c' },
  other:  { label: 'Autres placements', color: '#34d399' },
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
  const totalPlacements = Object.values(data.placements).reduce((s, v) => s + v, 0);
  const surplus = totalIncome - totalExpenses - totalPlacements;

  const categories: CategoryAnalysis[] = Object.entries(allExpenses)
    .filter(([, amount]) => amount > 0)
    .map(([key, amount]) => {
      const meta = BENCHMARKS[key];
      const percent = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
      const over = percent - meta.max;
      const status: CategoryAnalysis['status'] =
        over <= 0 ? 'ok' : over <= 5 ? 'warning' : 'danger';
      return { name: meta.label, amount, percent, benchmark: meta.max, status, color: meta.color };
    });

  const placementCategories = (Object.entries(data.placements) as [keyof PlaementsData, number][])
    .filter(([, v]) => v > 0)
    .map(([key, amount]) => ({ name: PLACEMENT_META[key].label, amount, color: PLACEMENT_META[key].color }));

  // Health score
  let score = 100;
  for (const cat of categories) {
    const over = cat.percent - cat.benchmark;
    if (over > 0) score -= Math.min(over * 2, 20);
  }
  if (totalIncome > 0) {
    const savingsRatio = (totalPlacements / totalIncome) * 100;
    if (savingsRatio >= 20) score += 15;
    else if (savingsRatio >= 10) score += 8;
    else if (savingsRatio >= 5) score += 4;
    const surplusRatio = (surplus / totalIncome) * 100;
    if (surplusRatio < 0) score -= 20;
  }
  const healthScore = Math.max(0, Math.min(100, Math.round(score)));

  const insights = buildInsights(categories, surplus, totalIncome, totalPlacements, data.placements);

  return { totalIncome, totalExpenses, totalPlacements, surplus, categories, placementCategories, healthScore, insights };
}

function buildInsights(
  categories: CategoryAnalysis[],
  surplus: number,
  totalIncome: number,
  totalPlacements: number,
  placements: PlaementsData,
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

  if (totalIncome > 0) {
    const savingsRatio = (totalPlacements / totalIncome) * 100;
    if (totalPlacements === 0) {
      msgs.push('Vous n\'avez pas indiqué de cotisation à des comptes d\'épargne. Un conseiller peut vous aider à mettre en place un plan d\'épargne adapté à vos objectifs.');
    } else if (savingsRatio >= 20) {
      msgs.push(`Excellent ! Vous épargnez ${savingsRatio.toFixed(0)}% de vos revenus. Vous êtes en excellente position pour atteindre vos objectifs financiers.`);
    } else if (savingsRatio < 10) {
      msgs.push(`Vous épargnez ${savingsRatio.toFixed(0)}% de vos revenus. L'objectif recommandé est de 10-20%. Il y a peut-être des opportunités d'optimiser votre épargne.`);
    }

    if (placements.reer === 0 && totalIncome >= 50000 / 12) {
      msgs.push('Vous ne cotisez pas au REER. Selon votre tranche d\'imposition, cela pourrait représenter des économies d\'impôt significatives.');
    }
    if (placements.celi === 0) {
      msgs.push('Le CELI est un outil puissant — toute croissance à l\'intérieur est libre d\'impôt. Un conseiller peut vous aider à maximiser vos cotisations.');
    }
  }

  if (surplus < 0) {
    msgs.push(`Attention : vos dépenses et placements dépassent vos revenus de ${fmt(Math.abs(surplus))} par mois. C'est une situation à adresser rapidement.`);
  } else if (surplus > 0 && totalIncome > 0) {
    msgs.push(`Vous avez un surplus mensuel de ${fmt(surplus)} après dépenses et épargne. Un conseiller peut vous aider à l'optimiser.`);
  }

  if (msgs.length === 0) {
    msgs.push('Votre budget est bien équilibré. Un conseiller peut vous aider à optimiser davantage votre situation.');
  }

  return msgs;
}

export function fmt(amount: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(amount);
}
