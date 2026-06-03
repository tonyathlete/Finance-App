import React from 'react';
import { FixedExpensesData } from '../types';
import ProgressBar from './ProgressBar';
import ExpandableExpense from './ExpandableExpense';

interface Props {
  data: FixedExpensesData;
  onChange: (data: FixedExpensesData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFixedExpenses({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof FixedExpensesData>(key: K, value: FixedExpensesData[K]) =>
    onChange({ ...data, [key]: value });

  const setSubItem = (
    subKey: keyof FixedExpensesData,
    id: string,
    value: number,
  ) => {
    const current = data[subKey] as Record<string, number>;
    onChange({ ...data, [subKey]: { ...current, [id]: value } });
  };

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={2} total={6} />

      <div className="text-center mb-8">
        <span className="text-4xl">🏠</span>
        <h2 className="text-2xl font-black text-blue-900 mt-3 mb-2">Dépenses fixes mensuelles</h2>
        <p className="text-blue-700 text-sm">Ces dépenses reviennent chaque mois. Entrez le total ou cliquez sur <strong>Voir le détail</strong> pour ventiler.</p>
      </div>

      <div className="space-y-3">
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
