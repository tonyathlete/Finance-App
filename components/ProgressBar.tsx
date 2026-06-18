import React from 'react';

interface Props {
  step: number;
  total: number;
}

const STEP_LABELS = ['Revenus', 'Dépenses fixes', 'Variables', 'Placements', 'Infos'];

export default function ProgressBar({ step, total }: Props) {
  const idx = step - 2;
  const pct = Math.round(((step - 1) / (total - 1)) * 100);

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold text-[#1B4332] uppercase tracking-wide">
          {STEP_LABELS[idx] ?? 'Étape'}
        </p>
        <p className="text-xs text-[#142420]/50 font-mono-data">{pct}% complété</p>
      </div>

      <div className="h-1.5 bg-[#D8DCD3] overflow-hidden">
        <div
          className="h-full bg-[#1B4332] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
