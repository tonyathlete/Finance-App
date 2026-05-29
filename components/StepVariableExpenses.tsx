import React from 'react';
import { VariableExpensesData } from '../types';
import CurrencyInput from './CurrencyInput';
import ProgressBar from './ProgressBar';

interface Props {
  data: VariableExpensesData;
  onChange: (data: VariableExpensesData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepVariableExpenses({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={4} total={5} />

      <div className="text-center mb-8">
        <span className="text-4xl">🛒</span>
        <h2 className="text-2xl font-black text-amber-900 mt-3 mb-2">Dépenses variables mensuelles</h2>
        <p className="text-amber-700 text-sm">Estimez vos dépenses mensuelles moyennes dans chaque catégorie.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 space-y-5">
        <CurrencyInput
          id="groceries"
          label="🛒 Épicerie / alimentation"
          hint="Courses alimentaires pour toute la famille"
          value={data.groceries}
          onChange={(v) => onChange({ ...data, groceries: v })}
        />
        <CurrencyInput
          id="restaurants"
          label="🍽️ Restaurants / sorties"
          hint="Repas au resto, cafés, livraison"
          value={data.restaurants}
          onChange={(v) => onChange({ ...data, restaurants: v })}
        />
        <CurrencyInput
          id="leisure"
          label="🎮 Loisirs / abonnements"
          hint="Netflix, sports, hobbies, sorties culturelles"
          value={data.leisure}
          onChange={(v) => onChange({ ...data, leisure: v })}
        />
        <CurrencyInput
          id="clothing"
          label="👗 Vêtements / shopping"
          hint="Achats de vêtements, accessoires, cadeaux"
          value={data.clothing}
          onChange={(v) => onChange({ ...data, clothing: v })}
        />
        <CurrencyInput
          id="health"
          label="💊 Santé / soins personnels"
          hint="Médicaments, coiffeur, gym, soins"
          value={data.health}
          onChange={(v) => onChange({ ...data, health: v })}
        />
        <CurrencyInput
          id="other"
          label="📦 Autres dépenses"
          hint="Tout ce qui ne rentre pas dans les catégories ci-dessus"
          value={data.other}
          onChange={(v) => onChange({ ...data, other: v })}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-amber-300 text-amber-700 font-semibold hover:bg-amber-50 transition">
          ← Retour
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition">
          Voir mon analyse →
        </button>
      </div>
    </div>
  );
}
