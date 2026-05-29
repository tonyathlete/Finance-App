import React from 'react';

interface Props {
  step: number;
  total: number;
}

const LABELS = ['Revenus', 'Dépenses fixes', 'Dépenses variables', 'Vos coordonnées', 'Analyse'];

export default function ProgressBar({ step, total }: Props) {
  const pct = ((step - 1) / (total - 1)) * 100;
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex justify-between text-xs text-amber-700 font-semibold mb-2 px-1">
        <span>Étape {step} sur {total}</span>
        <span>{LABELS[step - 2] ?? ''}</span>
      </div>
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
