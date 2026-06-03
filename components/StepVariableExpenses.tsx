import React from 'react';
import { VariableExpensesData } from '../types';
import ProgressBar from './ProgressBar';
import ExpandableExpense from './ExpandableExpense';

interface Props {
  data: VariableExpensesData;
  onChange: (data: VariableExpensesData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepVariableExpenses({ data, onChange, onNext, onBack }: Props) {
  const subSum = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={3} total={6} />

      <div className="text-center mb-8">
        <span className="text-4xl">🛒</span>
        <h2 className="text-2xl font-black text-blue-900 mt-3 mb-2">Dépenses variables mensuelles</h2>
        <p className="text-blue-700 text-sm">Estimez vos dépenses mensuelles moyennes. Cliquez sur <strong>Voir le détail</strong> pour ventiler par sous-catégorie.</p>
      </div>

      <div className="space-y-3">
        <ExpandableExpense
          icon="🛒" label="Épicerie / alimentation" hint="Courses alimentaires et produits ménagers"
          presets={[300, 400, 500, 700, 900]}
          total={data.groceries}
          onTotalChange={(v) => onChange({ ...data, groceries: v })}
          subItems={[
            { id: 'food', label: 'Épicerie alimentaire', value: data.groceriesSub.food },
            { id: 'household', label: 'Produits ménagers / hygiène', value: data.groceriesSub.household },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.groceriesSub, [id]: v };
            onChange({ ...data, groceriesSub: sub, groceries: subSum(sub) });
          }}
        />

        <ExpandableExpense
          icon="🍽️" label="Restaurants / sorties" hint="Repas au resto, cafés, livraison"
          presets={[100, 200, 300, 400]}
          total={data.restaurants}
          onTotalChange={(v) => onChange({ ...data, restaurants: v })}
          subItems={[
            { id: 'restaurants', label: 'Restaurants', value: data.restaurantsSub.restaurants },
            { id: 'cafes', label: 'Cafés', value: data.restaurantsSub.cafes },
            { id: 'delivery', label: 'Livraison (Uber Eats, etc.)', value: data.restaurantsSub.delivery },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.restaurantsSub, [id]: v };
            onChange({ ...data, restaurantsSub: sub, restaurants: subSum(sub) });
          }}
        />

        <ExpandableExpense
          icon="🎮" label="Loisirs / abonnements" hint="Netflix, sports, sorties, hobbies"
          presets={[100, 150, 200, 300]}
          total={data.leisure}
          onTotalChange={(v) => onChange({ ...data, leisure: v })}
          subItems={[
            { id: 'subscriptions', label: 'Abonnements (Netflix, Spotify…)', value: data.leisureSub.subscriptions },
            { id: 'sports', label: 'Sports / gym', value: data.leisureSub.sports },
            { id: 'outings', label: 'Sorties culturelles / loisirs', value: data.leisureSub.outings },
            { id: 'hobbies', label: 'Hobbies / passe-temps', value: data.leisureSub.hobbies },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.leisureSub, [id]: v };
            onChange({ ...data, leisureSub: sub, leisure: subSum(sub) });
          }}
        />

        <ExpandableExpense
          icon="👗" label="Vêtements / shopping" hint="Vêtements, chaussures, accessoires"
          presets={[50, 100, 150, 200]}
          total={data.clothing}
          onTotalChange={(v) => onChange({ ...data, clothing: v })}
          subItems={[
            { id: 'clothes', label: 'Vêtements', value: data.clothingSub.clothes },
            { id: 'shoes', label: 'Chaussures', value: data.clothingSub.shoes },
            { id: 'accessories', label: 'Accessoires / cadeaux', value: data.clothingSub.accessories },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.clothingSub, [id]: v };
            onChange({ ...data, clothingSub: sub, clothing: subSum(sub) });
          }}
        />

        <ExpandableExpense
          icon="💊" label="Santé / soins personnels" hint="Médicaments, dentiste, soins"
          presets={[50, 100, 150, 200]}
          total={data.health}
          onTotalChange={(v) => onChange({ ...data, health: v })}
          subItems={[
            { id: 'medication', label: 'Médicaments / pharmacie', value: data.healthSub.medication },
            { id: 'dental', label: 'Dentiste', value: data.healthSub.dental },
            { id: 'vision', label: 'Optique / lunettes', value: data.healthSub.vision },
            { id: 'personal', label: 'Coiffeur / soins personnels', value: data.healthSub.personal },
          ]}
          onSubItemChange={(id, v) => {
            const sub = { ...data.healthSub, [id]: v };
            onChange({ ...data, healthSub: sub, health: subSum(sub) });
          }}
        />

        <ExpandableExpense
          icon="📦" label="Autres dépenses" hint="Tout ce qui ne rentre pas ailleurs"
          presets={[50, 100, 200, 300]}
          total={data.other}
          onTotalChange={(v) => onChange({ ...data, other: v })}
          subItems={[]}
          onSubItemChange={() => {}}
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
