import React from 'react';
import { BudgetAnalysis, LeadInfo } from '../types';
import DonutChart from './DonutChart';
import { fmt } from '../services/budgetService';

interface Props {
  analysis: BudgetAnalysis;
  lead: LeadInfo;
  onReset: () => void;
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
  const color = score >= 75 ? '#1B4332' : score >= 50 ? '#C9A227' : '#C75D3D';
  const label = score >= 75 ? 'Excellente santé' : score >= 50 ? 'À améliorer' : 'Attention requise';
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center border border-[#D8DCD3]"
        style={{ background: `conic-gradient(${color} ${score}%, #EEF1EC 0%)` }}
      >
        <div className="w-16 h-16 bg-[#FBFBF9] rounded-full flex items-center justify-center">
          <span className="font-mono-data text-xl font-black" style={{ color }}>{score}</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <p className="text-xs text-[#142420]/60">Score financier / 100</p>
    </div>
  );
}

function CategoryRow({ cat }: { cat: BudgetAnalysis['categories'][0] }) {
  const barPct = Math.min((cat.percent / (cat.benchmark * 2)) * 100, 100);
  const statusIcon = cat.status === 'ok' ? '✅' : cat.status === 'warning' ? '⚠️' : '🚨';
  const statusColor = cat.status === 'ok' ? 'text-[#1B4332]' : cat.status === 'warning' ? 'text-[#C9A227]' : 'text-[#C75D3D]';
  return (
    <div className="py-3 border-b border-[#D8DCD3] last:border-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-[#142420]">{statusIcon} {cat.name}</span>
        <span className={`text-sm font-bold font-mono-data ${statusColor}`}>
          {cat.percent.toFixed(0)}% <span className="text-xs text-[#142420]/50 font-normal">/ {cat.benchmark}% recommandé</span>
        </span>
      </div>
      <div className="h-1.5 bg-[#D8DCD3] overflow-hidden">
        <div className="h-full transition-all duration-700" style={{ width: `${barPct}%`, backgroundColor: cat.color }} />
      </div>
      <p className="text-xs text-[#142420]/60 mt-1 font-mono-data">{fmt(cat.amount)} / mois</p>
    </div>
  );
}

export default function StepResults({ analysis, lead, onReset }: Props) {
  const { totalIncome, totalExpenses, totalPlacements, surplus, categories, placementCategories, healthScore, insights } = analysis;
  const surplusPositive = surplus >= 0;
  const challenges = buildChallenges(analysis);
  return (
    <div className="animate-fadeIn max-w-2xl mx-auto px-4 py-10">

      <div className="mb-6">
        <p className="text-[#142420]/50 text-sm font-medium mb-1">Ton portrait financier, {lead.firstName}</p>
        <h2 className="font-display text-3xl font-black text-[#142420] leading-tight">
          {healthScore >= 75 ? 'Tu gères bien ton argent.' : healthScore >= 50 ? 'Bonne base, quelques ajustements à faire.' : 'Il y a du travail — mais on a un plan.'}
        </h2>
      </div>

      {/* Summary — horizontal strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-4">
          <p className="text-xs text-[#142420]/50 mb-1">Revenus nets</p>
          <p className="font-mono-data text-lg font-black text-[#142420]">{fmt(totalIncome)}</p>
        </div>
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-4">
          <p className="text-xs text-[#142420]/50 mb-1">Dépenses</p>
          <p className="font-mono-data text-lg font-black text-[#142420]">{fmt(totalExpenses)}</p>
        </div>
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-4">
          <p className="text-xs text-[#142420]/50 mb-1">Épargne</p>
          <p className="font-mono-data text-lg font-black text-[#1B4332]">{fmt(totalPlacements)}</p>
        </div>
        <div className={`border p-4 ${surplusPositive ? 'bg-[#FBFBF9] border-[#1B4332]/30' : 'bg-[#FBFBF9] border-[#C75D3D]/40'}`}>
          <p className={`text-xs mb-1 ${surplusPositive ? 'text-[#1B4332]' : 'text-[#C75D3D]'}`}>{surplusPositive ? 'Surplus' : 'Déficit'}</p>
          <p className={`font-mono-data text-lg font-black ${surplusPositive ? 'text-[#1B4332]' : 'text-[#C75D3D]'}`}>{fmt(Math.abs(surplus))}</p>
        </div>
      </div>

      {/* Score + Chart */}
      <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
          <HealthGauge score={healthScore} />
          <DonutChart categories={categories} totalIncome={totalIncome} />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-6 mb-6">
        <h3 className="font-display font-black text-[#142420] mb-1">Tes dépenses en détail</h3>
        <p className="text-xs text-[#142420]/50 mb-4">Comparé aux moyennes québécoises recommandées</p>
        {categories.map((cat, i) => <CategoryRow key={i} cat={cat} />)}
      </div>

      {/* Placements section */}
      {placementCategories.length > 0 && (
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-6 mb-6">
          <h3 className="font-display font-black text-[#142420] mb-4">Épargne mensuelle</h3>
          <div className="space-y-3">
            {placementCategories.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#D8DCD3] last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-sm font-semibold text-[#142420]">{p.name}</span>
                </div>
                <span className="text-sm font-bold font-mono-data text-[#1B4332]">{fmt(p.amount)} / mois</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-black text-[#142420]">Total épargne</span>
              <span className="text-sm font-black font-mono-data text-[#1B4332]">{fmt(totalPlacements)} / mois</span>
            </div>
            {totalIncome > 0 && (
              <p className="text-xs text-[#142420]/60">
                Taux d'épargne : {((totalPlacements / totalIncome) * 100).toFixed(0)}% de vos revenus
                {(totalPlacements / totalIncome) >= 0.1 ? ' ✅' : ' — objectif recommandé : 10-20%'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-6 mb-6">
          <h3 className="font-display font-black text-[#142420] mb-4">Ce qu'on a remarqué</h3>
          <ul className="space-y-3">
            {insights.map((msg, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#142420]/80 leading-relaxed border-b border-[#D8DCD3] pb-3 last:border-0 last:pb-0">
                <span className="text-[#142420]/30 flex-shrink-0 font-black">—</span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personalized challenges */}
      {challenges.length > 0 && (
        <div className="bg-[#FBFBF9] border border-[#D8DCD3] p-6 mb-6">
          <h3 className="font-display font-black text-[#142420] mb-1">3 choses à faire cette semaine</h3>
          <p className="text-xs text-[#142420]/50 mb-5">Des actions simples avec un impact réel sur ton budget</p>
          <div className="space-y-4">
            {challenges.map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 border border-[#D8DCD3] text-[#1B4332] font-mono-data font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-black text-[#142420] text-sm mb-0.5">{c.title}</p>
                  <p className="text-xs text-[#142420]/50 mb-2">{c.desc}</p>
                  <span className="text-xs font-bold font-mono-data text-[#1B4332] bg-[#EEF1EC] border border-[#D8DCD3] px-2.5 py-1 rounded-sm">
                    {c.saving}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border border-[#D8DCD3] p-8 bg-[#FBFBF9]">
        <p className="text-xs font-semibold text-[#142420]/50 uppercase tracking-widest mb-2">Et maintenant ?</p>
        <h3 className="font-display text-xl font-black text-[#142420] mb-3">Un plan concret, sans jargon.</h3>
        <p className="text-sm text-[#142420]/70 mb-6 leading-relaxed">
          On regarde ton portrait ensemble — 30 minutes, sans frais, sans pression. Tu repars avec des actions claires adaptées à ta situation.
        </p>
        <a
          href="https://scheduler.zoom.us/anthony-goulet/appel-decouverte-30-minutes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#1B4332] text-[#FBFBF9] font-bold px-8 py-4 rounded-sm hover:bg-[#142420] transition text-sm w-full text-center"
        >
          Réserver une consultation gratuite
        </a>
        <p className="text-xs text-[#142420]/50 mt-3 text-center">30 min · gratuit · aucun engagement</p>
      </div>

      <button onClick={onReset} className="mt-8 w-full py-3 text-[#1B4332] text-sm font-medium hover:underline">
        ← Recommencer l'analyse
      </button>
    </div>
  );
}
