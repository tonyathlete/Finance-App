import React from 'react';

interface Props {
  step: number;
  total: number;
}

const STEPS: { label: string; message: string; emoji: string }[] = [
  { label: 'Revenus',            message: 'Super départ ! Parlons de tes revenus 💼',          emoji: '💼' },
  { label: 'Dépenses fixes',     message: 'Parfait ! Maintenant les dépenses fixes 🏠',         emoji: '🏠' },
  { label: 'Dépenses variables', message: 'Tu y es presque ! Les dépenses du quotidien 🛒',     emoji: '🛒' },
  { label: 'Placements',         message: 'Excellent ! Voyons ton épargne 📈',                  emoji: '📈' },
  { label: 'Tes coordonnées',    message: 'Dernière étape ! Ton analyse est prête 🎉',           emoji: '🎉' },
];

export default function ProgressBar({ step, total }: Props) {
  const idx = step - 2; // steps 2-6 map to indices 0-4
  const info = STEPS[idx] ?? STEPS[0];
  const pct = ((step - 1) / (total - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      {/* Motivational message */}
      <div className="text-center mb-3 animate-fadeIn" key={step}>
        <p className="text-sm font-bold text-amber-700">{info.message}</p>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center mb-2 px-1">
        {STEPS.map((s, i) => {
          const stepNum = i + 2;
          const done = step > stepNum;
          const current = step === stepNum;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                done    ? 'bg-green-500 text-white scale-90' :
                current ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white scale-110 shadow-md shadow-orange-200' :
                          'bg-amber-100 text-amber-400'
              }`}>
                {done ? '✓' : s.emoji}
              </div>
              <span className={`text-xs hidden md:block font-medium transition-colors ${current ? 'text-amber-700' : 'text-amber-300'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar */}
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-center text-xs text-amber-500 mt-2 font-medium">
        Étape {step - 1} sur {total - 2}
      </p>
    </div>
  );
}
