import type { Debt } from '@/types';

export type PayoffStrategy = 'avalanche' | 'snowball';

export interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  timeline: number[];    // solde total restant, par mois (index 0 = aujourd'hui)
  order: string[];       // ordre de remboursement (ids de dettes)
  reachedCap: boolean;   // vrai si les paiements ne couvrent pas les intérêts
}

const CAP = 720; // 60 ans — garde-fou

// Ordonne les dettes selon la stratégie
const orderDebts = (debts: Debt[], strategy: PayoffStrategy): Debt[] => {
  const arr = [...debts];
  if (strategy === 'avalanche') arr.sort((a, b) => b.apr - a.apr); // taux le plus élevé d'abord
  else arr.sort((a, b) => a.balance - b.balance);                  // plus petit solde d'abord
  return arr;
};

// Simule le remboursement. extra = paiement mensuel supplémentaire (au-delà des minimums).
// rollover : rediriger les minimums libérés vers la dette cible (méthode boule de neige/avalanche).
export const simulatePayoff = (
  debts: Debt[],
  strategy: PayoffStrategy,
  extra: number,
  rollover = true
): PayoffResult => {
  // copie de travail
  let working = orderDebts(debts, strategy).map((d) => ({ ...d }));
  const order = working.map((d) => d.id);
  const timeline: number[] = [working.reduce((s, d) => s + d.balance, 0)];
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (working.some((d) => d.balance > 0.01) && months < CAP) {
    months++;
    // 1) intérêts du mois
    for (const d of working) {
      if (d.balance > 0) {
        const interest = (d.balance * (d.apr / 100)) / 12;
        d.balance += interest;
        totalInterest += interest;
      }
    }
    // 2) budget disponible = somme des minimums + extra
    const activeMins = working.filter((d) => d.balance > 0).reduce((s, d) => s + d.minPayment, 0);
    let pool = activeMins + extra;

    if (rollover) {
      // payer les minimums, puis tout le reste sur la première dette active (selon l'ordre)
      // on retire d'abord les minimums de chaque dette, puis on concentre le surplus
      for (const d of working) {
        if (d.balance <= 0) continue;
        const pay = Math.min(d.minPayment, d.balance);
        d.balance -= pay;
        pool -= pay;
        totalPaid += pay;
      }
      // surplus concentré sur la cible prioritaire encore active
      for (const d of working) {
        if (pool <= 0) break;
        if (d.balance <= 0) continue;
        const pay = Math.min(pool, d.balance);
        d.balance -= pay;
        pool -= pay;
        totalPaid += pay;
      }
    } else {
      // minimums seulement, sans redirection
      for (const d of working) {
        if (d.balance <= 0) continue;
        const pay = Math.min(d.minPayment, d.balance);
        d.balance -= pay;
        totalPaid += pay;
      }
    }

    timeline.push(Math.max(0, working.reduce((s, d) => s + Math.max(0, d.balance), 0)));
  }

  return {
    months,
    totalInterest,
    totalPaid,
    timeline,
    order,
    reachedCap: months >= CAP,
  };
};

export const totalDebtBalance = (debts: Debt[]): number =>
  debts.reduce((s, d) => s + (d.balance || 0), 0);

export const totalMinPayments = (debts: Debt[]): number =>
  debts.reduce((s, d) => s + (d.minPayment || 0), 0);
