import React from 'react';
import { BudgetData } from '../types';
import { calcNetFromGross } from '../services/taxCalculator';

interface Props {
  budget: BudgetData;
  step: number;
}

function calcLiveScore(budget: BudgetData): number | null {
  const salaryNet = budget.revenue.salaryNet > 0 ? calcNetFromGross(budget.revenue.salaryNet).netMonthly : 0;
  const income = salaryNet + budget.revenue.otherIncome;
  if (income === 0) return null;

  const expenses =
    budget.fixedExpenses.housing + budget.fixedExpenses.transport +
    budget.fixedExpenses.insurance + budget.fixedExpenses.debts +
    budget.variableExpenses.groceries + budget.variableExpenses.restaurants +
    budget.variableExpenses.leisure + budget.variableExpenses.clothing +
    budget.variableExpenses.health + budget.variableExpenses.other;

  const placements = Object.values(budget.placements).reduce((a, b) => a + b, 0);

  let score = 100;

  const ratios: [number, number][] = [
    [budget.fixedExpenses.housing,           30],
    [budget.fixedExpenses.transport,         15],
    [budget.fixedExpenses.debts,             20],
    [budget.variableExpenses.groceries,      15],
  ];
  for (const [amt, max] of ratios) {
    const pct = (amt / income) * 100;
    const over = pct - max;
    if (over > 0) score -= Math.min(over * 2, 15);
  }

  const surplusRatio = ((income - expenses - placements) / income) * 100;
  if (surplusRatio < 0) score -= 20;

  const savingsRatio = (placements / income) * 100;
  if (savingsRatio >= 10) score += 8;

  return Math.max(10, Math.min(100, Math.round(score)));
}

export default function LiveScore({ budget, step }: Props) {
  if (step < 3) return null;

  const score = calcLiveScore(budget);
  if (score === null) return null;

  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Bien' : 'À améliorer';

  return (
    <div className="flex items-center gap-2 animate-fadeIn">
      <div className="relative w-9 h-9">
        <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#fef3c7" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 94} 94`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-black leading-none" style={{ color }}>{label}</p>
        <p className="text-xs text-blue-500 leading-none">Score live</p>
      </div>
    </div>
  );
}
