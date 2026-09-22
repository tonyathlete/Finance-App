import type { RetirementProfile } from '@/types';

export interface RetirementProjection {
  years: number;
  futureValue: number;
  yearlyBalances: { age: number; value: number }[];
  sustainableMonthlyIncome: number; // règle du 4 % (retrait annuel / 12)
  desiredMonthlyIncome: number;
  gapMonthly: number;               // écart vs revenu souhaité (négatif = manque)
  onTrack: boolean;
}

// Valeur future : épargne actuelle capitalisée + cotisations mensuelles.
export const projectRetirement = (p: RetirementProfile): RetirementProjection => {
  const years = Math.max(0, p.retirementAge - p.currentAge);
  const rMonthly = p.expectedReturn / 100 / 12;
  const yearlyBalances: { age: number; value: number }[] = [];

  let balance = p.currentSavings;
  yearlyBalances.push({ age: p.currentAge, value: balance });

  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + rMonthly) + p.monthlyContribution;
    if (m % 12 === 0) {
      yearlyBalances.push({ age: p.currentAge + m / 12, value: balance });
    }
  }

  const futureValue = balance;
  // Règle du 4 % : retrait annuel soutenable ≈ 4 % du capital
  const sustainableMonthlyIncome = (futureValue * 0.04) / 12;
  const gapMonthly = sustainableMonthlyIncome - p.desiredMonthlyIncome;

  return {
    years,
    futureValue,
    yearlyBalances,
    sustainableMonthlyIncome,
    desiredMonthlyIncome: p.desiredMonthlyIncome,
    gapMonthly,
    onTrack: gapMonthly >= 0,
  };
};

// Capital requis pour soutenir le revenu souhaité (règle du 4 %)
export const requiredCapital = (desiredMonthlyIncome: number): number =>
  (desiredMonthlyIncome * 12) / 0.04;
