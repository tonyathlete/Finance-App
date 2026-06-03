import React from 'react';
import { PlaementsData, PlacementAccount, PlacementFrequency } from '../types';
import ProgressBar from './ProgressBar';

interface Props {
  data: PlaementsData;
  onChange: (data: PlaementsData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCOUNTS: {
  id: keyof PlaementsData;
  label: string;
  icon: string;
  hint: string;
  badge: string | null;
  badgeColor: string;
  contributionPresets: number[];
  totalPresets: number[];
}[] = [
  {
    id: 'reer',
    label: 'REER',
    icon: '🏦',
    hint: 'Régime enregistré d\'épargne-retraite',
    badge: 'Déductible d\'impôt',
    badgeColor: 'bg-green-100 text-green-700',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 25000, 50000],
  },
  {
    id: 'celi',
    label: 'CELI',
    icon: '💼',
    hint: 'Compte d\'épargne libre d\'impôt',
    badge: 'Croissance libre d\'impôt',
    badgeColor: 'bg-blue-100 text-blue-700',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 25000, 50000],
  },
  {
    id: 'celiapp',
    label: 'CELIAPP',
    icon: '🏠',
    hint: 'Compte libre d\'impôt pour l\'achat d\'une première propriété',
    badge: 'Premier achat seulement',
    badgeColor: 'bg-purple-100 text-purple-700',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 20000, 40000],
  },
  {
    id: 'reee',
    label: 'REEE',
    icon: '🎓',
    hint: 'Régime enregistré d\'épargne-études — pour les enfants',
    badge: 'Subvention gouvernementale',
    badgeColor: 'bg-blue-100 text-blue-700',
    contributionPresets: [50, 100, 200, 300],
    totalPresets: [1000, 5000, 10000, 25000],
  },
  {
    id: 'other',
    label: 'Autres placements',
    icon: '📈',
    hint: 'Investissements non-enregistrés, actions, fonds, crypto, etc.',
    badge: null,
    badgeColor: '',
    contributionPresets: [100, 200, 500, 1000],
    totalPresets: [5000, 10000, 25000, 50000],
  },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

function monthlyEquiv(acc: PlacementAccount) {
  return acc.frequency === 'weekly' ? Math.round(acc.contribution * 52 / 12) : acc.contribution;
}

function NumInput({
  value, onChange, presets, placeholder,
}: { value: number; onChange: (v: number) => void; presets: number[]; placeholder?: string }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
              value === p
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {p >= 1000 ? `${p / 1000}k` : p}$
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-bold">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            onChange(raw === '' ? 0 : parseInt(raw, 10));
          }}
          placeholder={placeholder ?? '0'}
          className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-medium placeholder-blue-300 transition text-sm"
        />
      </div>
    </div>
  );
}

function FreqToggle({ value, onChange }: { value: PlacementFrequency; onChange: (f: PlacementFrequency) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-blue-200 overflow-hidden text-xs font-semibold">
      {(['monthly', 'weekly'] as PlacementFrequency[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className={`px-3 py-1.5 transition ${
            value === f
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          {f === 'monthly' ? 'Mensuel' : 'Hebdo'}
        </button>
      ))}
    </div>
  );
}

export default function StepPlacements({ data, onChange, onNext, onBack }: Props) {
  const totalMonthly = (Object.keys(data) as (keyof PlaementsData)[]).reduce(
    (s, k) => s + monthlyEquiv(data[k]), 0,
  );
  const totalInvested = (Object.keys(data) as (keyof PlaementsData)[]).reduce(
    (s, k) => s + data[k].totalInvested, 0,
  );

  const update = (id: keyof PlaementsData, patch: Partial<PlacementAccount>) =>
    onChange({ ...data, [id]: { ...data[id], ...patch } });

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10">
      <ProgressBar step={4} total={6} />

      <div className="text-center mb-8">
        <span className="text-4xl">📈</span>
        <h2 className="text-2xl font-black text-blue-900 mt-3 mb-2">Épargne & placements</h2>
        <p className="text-blue-700 text-sm">Indiquez vos cotisations régulières et le total déjà accumulé dans chaque compte.</p>
      </div>

      <div className="space-y-3">
        {ACCOUNTS.map(({ id, label, icon, hint, badge, badgeColor, contributionPresets, totalPresets }) => {
          const acc = data[id];
          const hasActivity = acc.contribution > 0 || acc.totalInvested > 0;
          return (
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

              {/* Contribution row */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Cotisation régulière</label>
                  <FreqToggle value={acc.frequency} onChange={(f) => update(id, { frequency: f })} />
                </div>
                <NumInput
                  value={acc.contribution}
                  onChange={(v) => update(id, { contribution: v })}
                  presets={contributionPresets}
                  placeholder="0"
                />
                {acc.frequency === 'weekly' && acc.contribution > 0 && (
                  <p className="text-xs text-blue-500 mt-1">
                    ≈ {fmt(monthlyEquiv(acc))} / mois
                  </p>
                )}
              </div>

              {/* Total invested row */}
              <div>
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-2">Total déjà investi</label>
                <NumInput
                  value={acc.totalInvested}
                  onChange={(v) => update(id, { totalInvested: v })}
                  presets={totalPresets}
                  placeholder="0"
                />
              </div>

              {hasActivity && (
                <div className="mt-3 bg-blue-50 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-blue-600">Valeur du portefeuille</span>
                  <span className="font-black text-blue-900">{fmt(acc.totalInvested)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {(totalMonthly > 0 || totalInvested > 0) && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
          <p className="text-xs text-green-700 font-medium uppercase tracking-wide text-center mb-3">Sommaire de vos placements</p>
          <div className="grid grid-cols-2 gap-3">
            {totalMonthly > 0 && (
              <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                <p className="text-xs text-green-600 mb-1">Cotisations / mois</p>
                <p className="text-lg font-black text-green-800">{fmt(totalMonthly)}</p>
              </div>
            )}
            {totalInvested > 0 && (
              <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                <p className="text-xs text-green-600 mb-1">Portefeuille total</p>
                <p className="text-lg font-black text-green-800">{fmt(totalInvested)}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-green-600 text-center mt-3">Excellent ! Vous investissez dans votre avenir. 🌱</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition">
          ← Retour
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition">
          {totalMonthly === 0 ? 'Passer →' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
}
