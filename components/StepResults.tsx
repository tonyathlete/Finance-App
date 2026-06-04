import React from 'react';
import { BudgetAnalysis, LeadInfo, AvatarId } from '../types';
import DonutChart from './DonutChart';
import { AvatarBubble, AVATARS } from './Avatar';
import { fmt } from '../services/budgetService';

interface Props {
  analysis: BudgetAnalysis;
  lead: LeadInfo;
  onReset: () => void;
  avatar: AvatarId;
}

function buildChallenges(analysis: BudgetAnalysis): { emoji: string; title: string; desc: string; saving: string }[] {
  const challenges: { emoji: string; title: string; desc: string; saving: string }[] = [];
  const { categories, totalIncome, totalPlacements, surplus } = analysis;

  // Find worst over-budget category
  const worst = [...categories].sort((a, b) => (b.percent - b.benchmark) - (a.percent - a.benchmark))[0];
  if (worst && worst.percent > worst.benchmark) {
    const reduction = Math.round(worst.amount * 0.1);
    challenges.push({
      emoji: '🎯',
      title: `Réduire ${worst.name} de 10%`,
      desc: `Tu es au-dessus de la moyenne québécoise. Réduire de ${fmt(reduction)}/mois, c'est réaliste!`,
      saving: `= ${fmt(reduction * 12)}/an d'économisé`,
    });
  }

  // Placements challenge
  if (totalIncome > 0 && totalPlacements / totalIncome < 0.1) {
    const target = Math.round(totalIncome * 0.1);
    const diff = Math.max(target - totalPlacements, 50);
    challenges.push({
      emoji: '📈',
      title: `Épargner ${fmt(diff)} de plus par mois`,
      desc: `L'objectif recommandé est 10% des revenus. Même un petit effort régulier fait une grosse différence!`,
      saving: `= ${fmt(diff * 12)}/an de plus en épargne`,
    });
  }

  // Surplus challenge
  if (surplus > 0) {
    challenges.push({
      emoji: '🚀',
      title: `Investir ton surplus de ${fmt(surplus)}/mois`,
      desc: `Ton budget génère un surplus — le placer dans un CELI ou REER multiplierait ta richesse!`,
      saving: `= ${fmt(surplus * 12)}/an investi automatiquement`,
    });
  } else if (surplus < 0) {
    challenges.push({
      emoji: '🛡️',
      title: 'Éliminer le déficit mensuel',
      desc: `Ton budget est en déficit de ${fmt(Math.abs(surplus))}/mois. Trouver 2-3 postes à couper est prioritaire.`,
      saving: `= retrouver ${fmt(Math.abs(surplus) * 12)}/an de marge`,
    });
  }

  return challenges.slice(0, 3);
}

function HealthGauge({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellente santé' : score >= 50 ? 'À améliorer' : 'Attention requise';
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: `conic-gradient(${color} ${score}%, #fef3c7 0%)` }}
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>{score}</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <p className="text-xs text-blue-600">Score financier / 100</p>
    </div>
  );
}

function CategoryRow({ cat }: { cat: BudgetAnalysis['categories'][0] }) {
  const barPct = Math.min((cat.percent / (cat.benchmark * 2)) * 100, 100);
  const statusIcon = cat.status === 'ok' ? '✅' : cat.status === 'warning' ? '⚠️' : '🚨';
  const statusColor = cat.status === 'ok' ? 'text-green-700' : cat.status === 'warning' ? 'text-blue-700' : 'text-red-700';
  return (
    <div className="py-3 border-b border-blue-50 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-blue-900">{statusIcon} {cat.name}</span>
        <span className={`text-sm font-bold ${statusColor}`}>
          {cat.percent.toFixed(0)}% <span className="text-xs text-blue-500 font-normal">/ {cat.benchmark}% recommandé</span>
        </span>
      </div>
      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barPct}%`, backgroundColor: cat.color }} />
      </div>
      <p className="text-xs text-blue-600 mt-1">{fmt(cat.amount)} / mois</p>
    </div>
  );
}

export default function StepResults({ analysis, lead, onReset, avatar }: Props) {
  const { totalIncome, totalExpenses, totalPlacements, surplus, categories, placementCategories, healthScore, insights } = analysis;
  const surplusPositive = surplus >= 0;
  const challenges = buildChallenges(analysis);
  const scoreKey = healthScore >= 75 ? 'great' : healthScore >= 50 ? 'good' : 'improve';

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto px-4 py-10">

      <div className="mb-6">
        <p className="text-blue-400 text-sm font-medium mb-1">Ton portrait financier, {lead.firstName}</p>
        <h2 className="text-3xl font-black text-blue-900 leading-tight">
          {healthScore >= 75 ? 'Tu gères bien ton argent.' : healthScore >= 50 ? 'Bonne base, quelques ajustements à faire.' : 'Il y a du travail — mais on a un plan.'}
        </h2>
      </div>

      <div className="mb-8">
        <AvatarBubble avatar={avatar} messageKey={scoreKey} size="lg" />
      </div>

      {/* Summary — horizontal strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
          <p className="text-xs text-blue-400 mb-1">Revenus nets</p>
          <p className="text-lg font-black text-blue-900">{fmt(totalIncome)}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
          <p className="text-xs text-blue-400 mb-1">Dépenses</p>
          <p className="text-lg font-black text-blue-900">{fmt(totalExpenses)}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
          <p className="text-xs text-blue-400 mb-1">Épargne</p>
          <p className="text-lg font-black text-blue-800">{fmt(totalPlacements)}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${surplusPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs mb-1 ${surplusPositive ? 'text-green-600' : 'text-red-500'}`}>{surplusPositive ? 'Surplus' : 'Déficit'}</p>
          <p className={`text-lg font-black ${surplusPositive ? 'text-green-800' : 'text-red-700'}`}>{fmt(Math.abs(surplus))}</p>
        </div>
      </div>

      {/* Score + Chart */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
          <HealthGauge score={healthScore} />
          <DonutChart categories={categories} totalIncome={totalIncome} />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
        <h3 className="font-black text-blue-900 mb-1">Tes dépenses en détail</h3>
        <p className="text-xs text-blue-400 mb-4">Comparé aux moyennes québécoises recommandées</p>
        {categories.map((cat, i) => <CategoryRow key={i} cat={cat} />)}
      </div>

      {/* Placements section */}
      {placementCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h3 className="font-black text-blue-900 mb-4">Épargne mensuelle</h3>
          <div className="space-y-3">
            {placementCategories.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-sm font-semibold text-blue-900">{p.name}</span>
                </div>
                <span className="text-sm font-bold text-blue-800">{fmt(p.amount)} / mois</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-black text-blue-900">Total épargne</span>
              <span className="text-sm font-black text-blue-800">{fmt(totalPlacements)} / mois</span>
            </div>
            {totalIncome > 0 && (
              <p className="text-xs text-blue-600">
                Taux d'épargne : {((totalPlacements / totalIncome) * 100).toFixed(0)}% de vos revenus
                {(totalPlacements / totalIncome) >= 0.1 ? ' ✅' : ' — objectif recommandé : 10-20%'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h3 className="font-black text-blue-900 mb-4">Ce qu'on a remarqué</h3>
          <ul className="space-y-3">
            {insights.map((msg, i) => (
              <li key={i} className="flex gap-3 text-sm text-blue-700 leading-relaxed border-b border-blue-50 pb-3 last:border-0 last:pb-0">
                <span className="text-blue-300 flex-shrink-0 font-black">—</span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personalized challenges */}
      {challenges.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h3 className="font-black text-blue-900 mb-1">3 choses à faire cette semaine</h3>
          <p className="text-xs text-blue-400 mb-5">Des actions simples avec un impact réel sur ton budget</p>
          <div className="space-y-4">
            {challenges.map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-black text-blue-900 text-sm mb-0.5">{c.title}</p>
                  <p className="text-xs text-blue-500 mb-2">{c.desc}</p>
                  <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                    {c.saving}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border border-blue-200 rounded-2xl p-8 bg-white">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Et maintenant ?</p>
        <h3 className="text-xl font-black text-blue-900 mb-3">Un plan concret, sans jargon.</h3>
        <p className="text-sm text-blue-600 mb-6 leading-relaxed">
          On regarde ton portrait ensemble — 30 minutes, sans frais, sans pression. Tu repars avec des actions claires adaptées à ta situation.
        </p>
        <a
          href="https://calendly.com/tommycolombo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition text-sm w-full text-center"
        >
          Réserver une consultation gratuite
        </a>
        <p className="text-xs text-blue-400 mt-3 text-center">30 min · gratuit · aucun engagement</p>
      </div>

      <button onClick={onReset} className="mt-8 w-full py-3 text-blue-600 text-sm font-medium hover:underline">
        ← Recommencer l'analyse
      </button>
    </div>
  );
}
