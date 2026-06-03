import React from 'react';
import { PlaementsData } from '../types';
import CurrencyInput from './CurrencyInput';
import ProgressBar from './ProgressBar';

interface Props {
  data: PlaementsData;
  onChange: (data: PlaementsData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCOUNTS = [
  {
    id: 'reer',
    label: 'REER',
    icon: '🏦',
    hint: 'Régime enregistré d\'épargne-retraite — cotisation mensuelle',
    badge: 'Déductible d\'impôt',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'celi',
    label: 'CELI',
    icon: '💼',
    hint: 'Compte d\'épargne libre d\'impôt — cotisation mensuelle',
    badge: 'Croissance libre d\'impôt',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'celiapp',
    label: 'CELIAPP',
    icon: '🏠',
    hint: 'Compte d\'épargne libre d\'impôt pour l\'achat d\'une première propriété',
    badge: 'Premier achat seulement',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'reee',
    label: 'REEE',
    icon: '🎓',
    hint: 'Régime enregistré d\'épargne-études — pour les enfants',
    badge: 'Subvention gouvernementale',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'other',
    label: 'Autres placements',
    icon: '📈',
    hint: 'Investissements non-enregistrés, actions, fonds, crypto, etc.',
    badge: null,
    badgeColor: '',
  },
] as const;

export default function StepPlacements({ data, onChange, onNext, onBack }: Props) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={4} total={6} />

      <div className="text-center mb-8">
        <span className="text-4xl">📈</span>
        <h2 className="text-2xl font-black text-blue-900 mt-3 mb-2">Épargne & placements mensuels</h2>
        <p className="text-blue-700 text-sm">Combien cotisez-vous chaque mois à vos comptes d'épargne et de placement ? Laissez à 0 si non applicable.</p>
      </div>

      <div className="space-y-3">
        {ACCOUNTS.map(({ id, label, icon, hint, badge, badgeColor }) => (
          <div key={id} className="bg-white border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-blue-900">{icon} {label}</span>
              {badge && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-blue-500 mb-3">{hint}</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-bold">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={data[id as keyof PlaementsData] === 0 ? '' : data[id as keyof PlaementsData].toString()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  onChange({ ...data, [id]: raw === '' ? 0 : parseInt(raw, 10) });
                }}
                placeholder="0"
                className="w-full pl-7 pr-4 py-3 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-medium placeholder-blue-300 transition"
              />
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-fadeIn">
          <p className="text-xs text-green-700 font-medium uppercase tracking-wide mb-1">Total épargne mensuelle</p>
          <p className="text-2xl font-black text-green-800">
            {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(total)}
          </p>
          <p className="text-xs text-green-600 mt-1">Excellent ! Vous investissez dans votre avenir. 🌱</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition">
          ← Retour
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition">
          {total === 0 ? 'Passer →' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
}
