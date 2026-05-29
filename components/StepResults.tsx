import React from 'react';
import { BudgetAnalysis, LeadInfo } from '../types';
import DonutChart from './DonutChart';
import { fmt } from '../services/budgetService';

interface Props {
  analysis: BudgetAnalysis;
  lead: LeadInfo;
  onReset: () => void;
}

function HealthGauge({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellente santé' : score >= 50 ? 'À améliorer' : 'Attention requise';
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg"
        style={{ background: `conic-gradient(${color} ${score}%, #fef3c7 0%)` }}
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>{score}</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <p className="text-xs text-amber-600">Score financier / 100</p>
    </div>
  );
}

function CategoryRow({ cat }: { cat: BudgetAnalysis['categories'][0] }) {
  const barPct = Math.min((cat.percent / (cat.benchmark * 2)) * 100, 100);
  const statusIcon = cat.status === 'ok' ? '✅' : cat.status === 'warning' ? '⚠️' : '🚨';
  const statusColor = cat.status === 'ok' ? 'text-green-700' : cat.status === 'warning' ? 'text-amber-700' : 'text-red-700';
  return (
    <div className="py-3 border-b border-amber-50 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-amber-900">{statusIcon} {cat.name}</span>
        <span className={`text-sm font-bold ${statusColor}`}>{cat.percent.toFixed(0)}% <span className="text-xs text-amber-500 font-normal">/ {cat.benchmark}% recommandé</span></span>
      </div>
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${barPct}%`, backgroundColor: cat.color }}
        />
      </div>
      <p className="text-xs text-amber-600 mt-1">{fmt(cat.amount)} / mois</p>
    </div>
  );
}

export default function StepResults({ analysis, lead, onReset }: Props) {
  const { totalIncome, totalExpenses, surplus, categories, healthScore, insights } = analysis;
  const surplusPositive = surplus >= 0;

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-amber-900 mb-1">Votre portrait financier</h2>
        <p className="text-amber-700 text-sm">Bonjour {lead.firstName}, voici votre analyse personnalisée.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-amber-100 p-4 text-center shadow-sm">
          <p className="text-xs text-amber-600 font-medium mb-1">Revenus</p>
          <p className="text-lg font-black text-amber-900">{fmt(totalIncome)}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 text-center shadow-sm">
          <p className="text-xs text-amber-600 font-medium mb-1">Dépenses</p>
          <p className="text-lg font-black text-amber-900">{fmt(totalExpenses)}</p>
        </div>
        <div className={`rounded-xl border p-4 text-center shadow-sm ${surplusPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs font-medium mb-1 ${surplusPositive ? 'text-green-700' : 'text-red-600'}`}>{surplusPositive ? 'Surplus' : 'Déficit'}</p>
          <p className={`text-lg font-black ${surplusPositive ? 'text-green-800' : 'text-red-700'}`}>{fmt(Math.abs(surplus))}</p>
        </div>
      </div>

      {/* Score + Chart */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
          <HealthGauge score={healthScore} />
          <DonutChart categories={categories} totalIncome={totalIncome} />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 mb-6">
        <h3 className="font-black text-amber-900 mb-4">Analyse par catégorie</h3>
        {categories.map((cat, i) => <CategoryRow key={i} cat={cat} />)}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <h3 className="font-black text-amber-900 mb-3">💡 Observations personnalisées</h3>
          <ul className="space-y-3">
            {insights.map((msg, i) => (
              <li key={i} className="flex gap-3 text-sm text-amber-800 leading-relaxed">
                <span className="text-orange-400 flex-shrink-0">•</span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-orange-200">
        <p className="text-sm font-semibold opacity-80 mb-2">Prochaine étape</p>
        <h3 className="text-2xl font-black mb-3">Obtenez un plan personnalisé gratuit</h3>
        <p className="text-sm opacity-90 mb-6 max-w-sm mx-auto">
          Un de nos conseillers financiers analysera votre situation en détail et vous proposera un plan d'action concret — sans frais et sans engagement.
        </p>
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-amber-50 transition hover:scale-105 active:scale-95 text-lg"
        >
          📅 Parlez à un conseiller financier
        </a>
        <p className="text-xs opacity-70 mt-4">Consultation de 30 minutes • 100% gratuit • Sans obligation</p>
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full py-3 text-amber-600 text-sm font-medium hover:underline"
      >
        ← Recommencer l'analyse
      </button>
    </div>
  );
}
