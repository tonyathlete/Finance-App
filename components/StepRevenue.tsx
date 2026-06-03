import React from 'react';
import { RevenueData } from '../types';
import CurrencyInput from './CurrencyInput';
import ProgressBar from './ProgressBar';

interface Props {
  data: RevenueData;
  onChange: (data: RevenueData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepRevenue({ data, onChange, onNext, onBack }: Props) {
  const totalIncome = data.salaryNet + data.otherIncome;
  const isValid = totalIncome > 0;

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={2} total={6} />

      <div className="text-center mb-8">
        <span className="text-4xl">💼</span>
        <h2 className="text-2xl font-black text-amber-900 mt-3 mb-2">Vos revenus mensuels</h2>
        <p className="text-amber-700 text-sm">Indiquez vos revenus nets (après impôts) par mois.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 space-y-5">
        <CurrencyInput
          id="salaryNet"
          label="Salaire net mensuel"
          hint="Votre salaire après déductions et impôts"
          value={data.salaryNet}
          presets={[2000, 3000, 4000, 5000, 6000, 8000]}
          onChange={(v) => onChange({ ...data, salaryNet: v })}
        />
        <CurrencyInput
          id="otherIncome"
          label="Autres revenus"
          hint="Freelance, allocations, revenus locatifs, etc."
          value={data.otherIncome}
          presets={[500, 1000, 1500, 2000]}
          onChange={(v) => onChange({ ...data, otherIncome: v })}
        />

        {totalIncome > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center animate-fadeIn">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Revenu total mensuel</p>
            <p className="text-2xl font-black text-amber-900">
              {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalIncome)}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-amber-300 text-amber-700 font-semibold hover:bg-amber-50 transition"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
