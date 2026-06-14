import React from 'react';
import { FixedExpensesData } from '../types';
import ProgressBar from './ProgressBar';
import ExpandableExpense from './ExpandableExpense';
import { calcNetFromGross } from '../services/taxCalculator';

interface Props {
  data: FixedExpensesData;
  onChange: (data: FixedExpensesData) => void;
  onNext: () => void;
  onBack: () => void;
  totalIncome: number; // gross monthly, used for comparisons
}

// Quebec household averages as % of net income
const QC_AVG = { housing: 30, transport: 15, insurance: 6, debts: 10 };

function AvgBadge({ amount, income, avgPct, label }: { amount: number; income: number; avgPct: number; label: string }) {
  if (amount === 0 || income === 0) return null;
  const net = calcNetFromGross(income).netMonthly;
  if (net === 0) return null;
  const pct = Math.round((amount / net) * 100);
  const diff = pct - avgPct;
  const better = diff <= 0;
  return (
    <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${better ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
      <span>{better ? '✅' : '⚠️'}</span>
      <span>
        <strong>{label} : {pct}%</strong> de tes revenus —{' '}
        {better
          ? `${Math.abs(diff)}% sous la moyenne québécoise (${avgPct}%) 👏`
          : `${diff}% au-dessus de la moyenne québécoise (${avgPct}%)`}
      </span>
    </div>
  );
}

export default function StepFixedExpenses({ data, onChange, onNext, onBack, totalIncome }: Props) {
  const set = <K extends keyof FixedExpensesData>(key: K, value: FixedExpensesData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={2} total={6} />

      <div className="mb-6">
        <h2 className="text-2xl font-black text-blue-900 mb-1">Dépenses fixes</h2>
        <p className="text-blue-500 text-sm">Ce qui sort chaque mois, peu importe ce qui se passe. Mets le total ou clique <strong>Voir le détail</strong>.</p>
      </div>

      <div className="space-y-3">
        <div>
          <ExpandableExpense
            icon="🏠" label="Logement" hint="Loyer, hypothèque ou frais de condo"
            presets={[800, 1200, 1500, 2000, 2500]}
            total={data.housing}
            onTotalChange={(v) => set('housing', v)}
            subItems={[
              { id: 'rent', label: 'Loyer', value: data.housingSub.rent },
              { id: 'mortgage', label: 'Hypothèque', value: data.housingSub.mortgage },
              { id: 'condo', label: 'Frais de condo', value: data.housingSub.condo },
            ]}
            onSubItemChange={(id, v) => {
              const sub = { ...data.housingSub, [id]: v };
              onChange({ ...data, housingSub: sub, housing: Object.values(sub).reduce((a, b) => a + b, 0) });
            }}
          />
          <AvgBadge amount={data.housing} income={totalIncome} avgPct={QC_AVG.housing} label="Logement" />
        </div>

        <div>
          <ExpandableExpense
            icon="🚗" label="Transport" hint="Paiement auto, assurance et essence"
            presets={[200, 400, 600, 800, 1000]}
            total={data.transport}
            onTotalChange={(v) => set('transport', v)}
            subItems={[
              { id: 'carPayment', label: 'Paiement / leasing auto', value: data.transportSub.carPayment },
              { id: 'carInsurance', label: 'Assurance auto (par mois)', value: data.transportSub.carInsurance },
              { id: 'gas', label: 'Essence', value: data.transportSub.gas },
            ]}
            onSubItemChange={(id, v) => {
              const sub = { ...data.transportSub, [id]: v };
              onChange({ ...data, transportSub: sub, transport: Object.values(sub).reduce((a, b) => a + b, 0) });
            }}
          />
          <AvgBadge amount={data.transport} income={totalIncome} avgPct={QC_AVG.transport} label="Transport" />
        </div>

        <div>
          <ExpandableExpense
          icon="🛡️" label="Assurances" hint="Vie, invalidité, habitation — montants par mois"
          presets={[50, 100, 150, 200, 300]}
          total={data.insurance}
          onTotalChange={(v) => set('insurance', v)}
          subItems={[
            { id: 'life', label: 'Assurance vie (par mois)', value: data.insuranceSub.life },
            { id: 'disability', label: 'Assurance invalidité (par mois)', value: data.insuranceSub.disability },
            { id: 'home', label: 'Assurance habitation (par mois)', value: data.insuranceSub.home },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.insuranceSub, [id]: v };
            onChange({ ...data, insuranceSub: sub, insurance: Object.values(sub).reduce((a, b) => a + b, 0) });
          }}
          />
          <AvgBadge amount={data.insurance} income={totalIncome} avgPct={QC_AVG.insurance} label="Assurances" />
        </div>

        <div>
          <ExpandableExpense
            icon="💳" label="Dettes" hint="Cartes de crédit, prêts, marges de crédit"
            presets={[100, 200, 300, 500, 800]}
            total={data.debts}
            onTotalChange={(v) => set('debts', v)}
            subItems={[
              { id: 'creditCard1', label: 'Carte de crédit #1 (paiement min.)', value: data.debtsSub.creditCard1 },
              { id: 'creditCard2', label: 'Carte de crédit #2 (paiement min.)', value: data.debtsSub.creditCard2 },
              { id: 'personalLoan', label: 'Prêt personnel', value: data.debtsSub.personalLoan },
              { id: 'creditLine', label: 'Marge de crédit', value: data.debtsSub.creditLine },
            ]}
            onSubItemChange={(id, v) => {
              const sub = { ...data.debtsSub, [id]: v };
              onChange({ ...data, debtsSub: sub, debts: Object.values(sub).reduce((a, b) => a + b, 0) });
            }}
          />
          <AvgBadge amount={data.debts} income={totalIncome} avgPct={QC_AVG.debts} label="Dettes" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition">
          ← Retour
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition">
          Continuer →
        </button>
      </div>
    </div>
  );
}
