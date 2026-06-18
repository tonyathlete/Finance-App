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
        <h2 className="font-display text-2xl font-black text-[#142420] mb-1">Tes revenus</h2>
        <p className="text-[#142420]/60 text-sm">Entre ton salaire brut — on calcule le net automatiquement.</p>
      </div>

      <div className="bg-[#FBFBF9] rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#D8DCD3] p-6 space-y-5">
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
          <div className="rounded-md border border-[#D8DCD3] overflow-hidden animate-fadeIn">
            <div className="bg-[#EEF1EC] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#142420]/60 font-medium uppercase tracking-wide">Revenu net estimé (Québec 2025)</p>
                <p className="font-mono-data text-xl font-bold text-[#142420]">{fmt(tax.netMonthly)}<span className="text-sm font-semibold text-[#142420]/50"> /mois</span></p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-[#FBFBF9] text-[#1B4332] text-xs font-bold px-2.5 py-1 rounded-sm border border-[#D8DCD3] font-mono-data">
                  {tax.effectiveRate}% de déductions
                </span>
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="block ml-auto mt-1 text-xs text-[#1B4332] hover:text-[#142420] underline"
                >
                  {showBreakdown ? 'Masquer' : 'Voir le détail'}
                </button>
              </div>
            </div>

            {showBreakdown && (
              <div className="bg-[#FBFBF9] px-4 py-3 border-t border-[#D8DCD3] text-xs space-y-1.5 animate-fadeIn">
                {[
                  ['QPP (Régime de rentes)', tax.qpp],
                  ['Assurance-emploi (AE)', tax.ei],
                  ['RQAP', tax.rqap],
                  ['Impôt fédéral', tax.federalTax],
                  ['Impôt provincial (QC)', tax.provincialTax],
                ].map(([label, amount]) => (
                  <div key={label as string} className="flex justify-between text-[#142420]/70">
                    <span>{label as string}</span>
                    <span className="font-mono-data font-semibold text-[#C75D3D]">− {fmt(amount as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-[#142420] border-t border-[#D8DCD3] pt-2 mt-1">
                  <span>Total des déductions</span>
                  <span className="font-mono-data text-[#C75D3D]">− {fmt(tax.totalDeductions)}</span>
                </div>
                <p className="text-[#142420]/40 italic pt-1">* Estimation basée sur les taux 2025. Peut varier selon votre situation.</p>
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

        {data.otherIncome === 0 && (
          <div className="bg-[#EEF1EC] border border-[#D8DCD3] rounded-md p-4 animate-fadeIn">
            <p className="text-sm font-semibold text-[#142420] mb-1">Tu aimerais augmenter tes revenus?</p>
            <p className="text-xs text-[#142420]/60 mb-3">Freelance, revenus locatifs, dividendes... il existe des stratégies concrètes selon ta situation.</p>
            <a
              href="https://scheduler.zoom.us/anthony-goulet/appel-decouverte-30-minutes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-[#FBFBF9] bg-[#1B4332] hover:bg-[#142420] px-4 py-2 rounded-sm transition"
            >
              Oui, j'aimerais ça! →
            </a>
          </div>
        )}

        {tax && (
          <div className="bg-[#EEF1EC] rounded-md p-4 border border-[#D8DCD3] text-center animate-fadeIn">
            <p className="text-xs text-[#142420]/60 font-medium uppercase tracking-wide">Revenu net total mensuel</p>
            <p className="font-mono-data text-2xl font-bold text-[#142420]">{fmt(totalIncome)}</p>
            <p className="text-xs text-[#142420]/50 mt-0.5">utilisé pour l'analyse de votre budget</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-sm border border-[#D8DCD3] text-[#142420] font-semibold hover:bg-[#EEF1EC] transition"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 rounded-sm bg-[#1B4332] text-[#FBFBF9] font-bold hover:bg-[#142420] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
