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
        <p className="text-sm font-bold text-blue-800">
          {STEP_LABELS[idx] ?? 'Étape'}
        </p>
        <p className="text-xs text-blue-400 font-medium">{pct}% complété</p>
      </div>

      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
