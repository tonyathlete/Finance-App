import React, { useState } from 'react';
import { RevenueData } from '../types';
import CurrencyInput from './CurrencyInput';
import ProgressBar from './ProgressBar';
import { calcNetFromGross } from '../services/taxCalculator';

interface Props {
  data: RevenueData;
  onChange: (data: RevenueData) => void;
  onNext: () => void;
  onBack: () => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

export default function StepRevenue({ data, onChange, onNext, onBack }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const tax = data.salaryNet > 0 ? calcNetFromGross(data.salaryNet) : null;
  const totalIncome = (tax?.netMonthly ?? 0) + data.otherIncome;
  const isValid = totalIncome > 0 || data.salaryNet > 0;

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={2} total={6} />

      <div className="mb-6">
        <h2 className="text-2xl font-black text-blue-900 mb-1">Tes revenus</h2>
        <p className="text-blue-500 text-sm">Entre ton salaire brut — on calcule le net automatiquement.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 space-y-5">
        <CurrencyInput
          id="salaryNet"
          label="Revenu brut mensuel"
          hint="Votre salaire avant déductions et impôts"
          value={data.salaryNet}
          presets={[2000, 3000, 4000, 5000, 6000, 8000]}
          onChange={(v) => onChange({ ...data, salaryNet: v })}
        />

        {/* Net estimate panel */}
        {tax && (
          <div className="rounded-xl border border-blue-200 overflow-hidden animate-fadeIn">
            <div className="bg-blue-50 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Revenu net estimé (Québec 2025)</p>
                <p className="text-xl font-black text-blue-900">{fmt(tax.netMonthly)}<span className="text-sm font-semibold text-blue-500"> /mois</span></p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                  {tax.effectiveRate}% de déductions
                </span>
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="block ml-auto mt-1 text-xs text-blue-500 hover:text-blue-700 underline"
                >
                  {showBreakdown ? 'Masquer' : 'Voir le détail'}
                </button>
              </div>
            </div>

            {showBreakdown && (
              <div className="bg-white px-4 py-3 border-t border-blue-100 text-xs space-y-1.5 animate-fadeIn">
                {[
                  ['QPP (Régime de rentes)', tax.qpp],
                  ['Assurance-emploi (AE)', tax.ei],
                  ['RQAP', tax.rqap],
                  ['Impôt fédéral', tax.federalTax],
                  ['Impôt provincial (QC)', tax.provincialTax],
                ].map(([label, amount]) => (
                  <div key={label as string} className="flex justify-between text-blue-700">
                    <span>{label as string}</span>
                    <span className="font-semibold text-red-500">− {fmt(amount as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-blue-900 border-t border-blue-100 pt-2 mt-1">
                  <span>Total des déductions</span>
                  <span className="text-red-600">− {fmt(tax.totalDeductions)}</span>
                </div>
                <p className="text-blue-400 italic pt-1">* Estimation basée sur les taux 2025. Peut varier selon votre situation.</p>
              </div>
            )}
          </div>
        )}

        <CurrencyInput
          id="otherIncome"
          label="Autres revenus (net)"
          hint="Freelance, allocations, revenus locatifs, etc. — entrez le montant déjà net"
          value={data.otherIncome}
          presets={[500, 1000, 1500, 2000]}
          onChange={(v) => onChange({ ...data, otherIncome: v })}
        />

        {tax && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center animate-fadeIn">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Revenu net total mensuel</p>
            <p className="text-2xl font-black text-blue-900">{fmt(totalIncome)}</p>
            <p className="text-xs text-blue-500 mt-0.5">utilisé pour l'analyse de votre budget</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
