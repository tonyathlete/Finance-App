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
  contributionPresets: number[];
  totalPresets: number[];
}[] = [
  {
    id: 'reer',
    label: 'REER',
    icon: '🏦',
    hint: 'Régime enregistré d\'épargne-retraite',
    badge: 'Déductible d\'impôt',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 25000, 50000],
  },
  {
    id: 'celi',
    label: 'CELI',
    icon: '💼',
    hint: 'Compte d\'épargne libre d\'impôt',
    badge: 'Croissance libre d\'impôt',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 25000, 50000],
  },
  {
    id: 'celiapp',
    label: 'CELIAPP',
    icon: '🏠',
    hint: 'Compte libre d\'impôt pour l\'achat d\'une première propriété',
    badge: 'Premier achat seulement',
    contributionPresets: [100, 200, 300, 500],
    totalPresets: [5000, 10000, 20000, 40000],
  },
  {
    id: 'reee',
    label: 'REEE',
    icon: '🎓',
    hint: 'Régime enregistré d\'épargne-études — pour les enfants',
    badge: 'Subvention gouvernementale',
    contributionPresets: [50, 100, 200, 300],
    totalPresets: [1000, 5000, 10000, 25000],
  },
  {
    id: 'other',
    label: 'Autres placements',
    icon: '📈',
    hint: 'Investissements non-enregistrés, actions, fonds, crypto, etc.',
    badge: null,
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
            className={`text-xs px-2.5 py-1 rounded-sm border font-semibold transition-all ${
              value === p
                ? 'bg-[#1B4332] text-[#FBFBF9] border-[#1B4332]'
                : 'bg-[#FBFBF9] text-[#1B4332] border-[#D8DCD3] hover:border-[#1B4332]'
            }`}
          >
            {p >= 1000 ? `${p / 1000}k` : p}$
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#142420]/50 font-bold font-mono-data">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            onChange(raw === '' ? 0 : parseInt(raw, 10));
          }}
          placeholder={placeholder ?? '0'}
          className="w-full pl-7 pr-4 py-2.5 rounded-sm border border-[#D8DCD3] bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] text-[#142420] font-mono-data font-medium placeholder-[#142420]/30 transition text-sm"
        />
      </div>
    </div>
  );
}

function FreqToggle({ value, onChange }: { value: PlacementFrequency; onChange: (f: PlacementFrequency) => void }) {
  return (
    <div className="inline-flex rounded-sm border border-[#D8DCD3] overflow-hidden text-xs font-semibold">
      {(['monthly', 'weekly'] as PlacementFrequency[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className={`px-3 py-1.5 transition ${
            value === f
              ? 'bg-[#1B4332] text-[#FBFBF9]'
              : 'bg-[#FBFBF9] text-[#1B4332] hover:bg-[#EEF1EC]'
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
      <ProgressBar step={5} total={6} />

      <div className="mb-6">
        <h2 className="font-display text-2xl font-black text-[#142420] mb-1">Épargne & placements</h2>
        <p className="text-[#142420]/60 text-sm">Ce que tu mets de côté chaque mois, et ce que tu as déjà accumulé. Laisse à 0 si ça ne s'applique pas.</p>
      </div>

      <div className="space-y-3">
        {ACCOUNTS.map(({ id, label, icon, hint, badge, contributionPresets, totalPresets }) => {
          const acc = data[id];
          const hasActivity = acc.contribution > 0 || acc.totalInvested > 0;
          return (
            <div key={id} className="bg-[#FBFBF9] border border-[#D8DCD3] rounded-md p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#142420]">{icon} {label}</span>
                {badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm border border-[#D8DCD3] bg-[#EEF1EC] text-[#1B4332]">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#142420]/60 mb-3">{hint}</p>

              {/* Contribution row */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#1B4332] uppercase tracking-wide">Cotisation régulière</label>
                  <FreqToggle value={acc.frequency} onChange={(f) => update(id, { frequency: f })} />
                </div>
                <NumInput
                  value={acc.contribution}
                  onChange={(v) => update(id, { contribution: v })}
                  presets={contributionPresets}
                  placeholder="0"
                />
                {acc.frequency === 'weekly' && acc.contribution > 0 && (
                  <p className="text-xs text-[#142420]/60 mt-1">
                    ≈ {fmt(monthlyEquiv(acc))} / mois
                  </p>
                )}
              </div>

              {/* Total invested row */}
              <div>
                <label className="text-xs font-semibold text-[#1B4332] uppercase tracking-wide block mb-2">Total déjà investi</label>
                <NumInput
                  value={acc.totalInvested}
                  onChange={(v) => update(id, { totalInvested: v })}
                  presets={totalPresets}
                  placeholder="0"
                />
              </div>

              {hasActivity && (
                <div className="mt-3 bg-[#EEF1EC] border border-[#D8DCD3] rounded-sm px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-[#142420]/60">Valeur du portefeuille</span>
                  <span className="font-mono-data font-bold text-[#142420]">{fmt(acc.totalInvested)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {(totalMonthly > 0 || totalInvested > 0) && (
        <div className="mt-4 bg-[#FBFBF9] border border-[#1B4332]/30 rounded-md p-4 animate-fadeIn">
          <p className="text-xs text-[#1B4332] font-semibold uppercase tracking-wide text-center mb-3">Sommaire de vos placements</p>
          <div className="grid grid-cols-2 gap-3">
            {totalMonthly > 0 && (
              <div className="bg-[#EEF1EC] rounded-sm p-3 text-center border border-[#D8DCD3]">
                <p className="text-xs text-[#142420]/60 mb-1">Cotisations / mois</p>
                <p className="font-mono-data text-lg font-bold text-[#1B4332]">{fmt(totalMonthly)}</p>
              </div>
            )}
            {totalInvested > 0 && (
              <div className="bg-[#EEF1EC] rounded-sm p-3 text-center border border-[#D8DCD3]">
                <p className="text-xs text-[#142420]/60 mb-1">Portefeuille total</p>
                <p className="font-mono-data text-lg font-bold text-[#1B4332]">{fmt(totalInvested)}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-[#142420]/60 text-center mt-3">Excellent ! Vous investissez dans votre avenir. 🌱</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-3 rounded-sm border border-[#D8DCD3] text-[#142420] font-semibold hover:bg-[#EEF1EC] transition">
          ← Retour
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-sm bg-[#1B4332] text-[#FBFBF9] font-bold hover:bg-[#142420] transition">
          {totalMonthly === 0 ? 'Passer →' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
}
