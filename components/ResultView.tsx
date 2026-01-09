
import React from 'react';
import { AnalysisResult, Zone } from '../types';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const zoneConfig: Record<Zone, { color: string; label: string; icon: string; bg: string; border: string }> = {
    Green: { color: 'text-emerald-400', label: 'Zone Verte (Faible)', icon: 'fa-check-circle', bg: 'bg-emerald-950/30', border: 'border-emerald-500/30' },
    Yellow: { color: 'text-amber-400', label: 'Zone Jaune (Modérée)', icon: 'fa-exclamation-triangle', bg: 'bg-amber-950/30', border: 'border-amber-500/30' },
    Red: { color: 'text-rose-400', label: 'Zone Rouge (Élevée)', icon: 'fa-times-circle', bg: 'bg-rose-950/30', border: 'border-rose-500/30' },
  };

  const currentZone = zoneConfig[result.zone] || zoneConfig.Yellow;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-white">
      {/* Header Summary */}
      <div className={`p-8 rounded-3xl ${currentZone.bg} border-2 ${currentZone.border} shadow-2xl backdrop-blur-md`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Statut de Vulnérabilité</h2>
            <div className={`text-3xl font-black flex items-center gap-3 ${currentZone.color}`}>
              <i className={`fas ${currentZone.icon}`}></i>
              {currentZone.label}
            </div>
            <p className="mt-4 text-slate-200 max-w-lg leading-relaxed text-lg">
              {result.overallVulnerability}
            </p>
          </div>
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
              <span className={`text-4xl font-black ${currentZone.color}`}>{result.score}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Score / 100</span>
          </div>
        </div>
      </div>

      {/* Risks Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400">
            <i className="fas fa-shield-halved"></i>
            Risques principaux
          </h3>
          <ul className="space-y-4">
            {result.mainRisks.map((risk, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">{i + 1}</span>
                <span className="text-slate-300 leading-snug">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-2xl border border-slate-700 transform md:scale-105">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-400">
            <i className="fas fa-bullseye"></i>
            Risque Prioritaire
          </h3>
          <p className="text-white leading-relaxed text-xl italic font-semibold">
            "{result.priorityRisk}"
          </p>
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-sm text-slate-400">
            Ce point crucial mérite votre attention immédiate pour sécuriser votre avenir financier.
          </div>
        </div>
      </div>

      {/* Summary & Education */}
      <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
        <h3 className="text-lg font-bold mb-4 text-slate-100">Résumé Pédagogique & Retraite</h3>
        <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
          {result.summary}
        </div>
      </div>

      {/* Invitation - Updated for Team Follow-up */}
      <div className="bg-blue-600 text-white p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative border border-blue-400/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        <div className="max-w-xl text-center md:text-left relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-400/50">
            <i className="fas fa-calendar-check animate-pulse"></i>
            Prochaine étape confirmée
          </div>
          <h3 className="text-2xl font-black">Plan d'optimisation stratégique</h3>
          <p className="text-blue-50 text-lg font-medium leading-relaxed">
            {result.invitation}
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm border border-white/30">
            <i className="fas fa-user-tie text-2xl"></i>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Appel gratuit sans frais</span>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button onClick={onReset} className="text-slate-500 hover:text-slate-300 transition flex items-center gap-2 text-sm font-medium group">
          <i className="fas fa-redo group-hover:rotate-180 transition-transform duration-500"></i>
          Refaire une analyse
        </button>
      </div>
    </div>
  );
};

export default ResultView;
