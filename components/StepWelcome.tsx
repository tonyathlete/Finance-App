import React from 'react';
import Wave from './Wave';

interface Props {
  onStart: () => void;
  goals: string[];
  onToggleGoal: (goal: string) => void;
}

const GOALS = [
  { value: 'maison', emoji: '🏡', label: 'Acheter une maison' },
  { value: 'budget', emoji: '📊', label: 'Améliorer mon budget' },
  { value: 'retraite', emoji: '🏖️', label: 'Préparer ma retraite' },
  { value: 'assurances', emoji: '🛡️', label: 'Vérifier mes assurances' },
  { value: 'placements', emoji: '📈', label: 'Optimiser mes placements' },
];

export default function StepWelcome({ onStart, goals, onToggleGoal }: Props) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      {/* Royal hero with wave */}
      <div className="relative h-52 shrink-0">
        <Wave />
        <div className="relative px-6 pt-14 text-white">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/15 border border-white/25 px-3 py-1.5 rounded-full mb-3">
            Outil gratuit
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            Quel est ton objectif?
          </h1>
        </div>
      </div>

      {/* White sheet */}
      <div className="relative flex-1 bg-white rounded-t-[2rem] -mt-6 px-6 pt-7 pb-8 shadow-[0_-10px_30px_-12px_rgba(21,58,138,0.25)] animate-fadeIn">
        <p className="text-royal-500 text-sm mb-5">
          Choisis ce qui te parle. On en tiendra compte pour toi. <span className="text-slate-400">(optionnel)</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => {
            const active = goals.includes(g.value);
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => onToggleGoal(g.value)}
                className={`relative flex flex-col items-center text-center gap-2 px-3 py-4 rounded-2xl border-2 transition-all ${
                  active
                    ? 'border-royal-500 bg-royal-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-royal-200'
                }`}
              >
                {active && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-royal-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                )}
                <span className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${active ? 'bg-royal-100' : 'bg-royal-50'}`}>
                  {g.emoji}
                </span>
                <span className={`text-xs font-semibold leading-tight ${active ? 'text-royal-700' : 'text-slate-600'}`}>
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onStart}
          className="w-full mt-7 bg-gradient-to-r from-royal-500 to-royal-700 text-white font-black text-lg py-4 rounded-2xl fab transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          Continuer →
        </button>
        <p className="text-center text-slate-400 text-xs mt-4">
          🔒 Confidentiel · aucun spam · tu peux dire non à tout moment
        </p>
      </div>
    </div>
  );
}
