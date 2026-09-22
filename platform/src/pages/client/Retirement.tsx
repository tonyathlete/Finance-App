import React from 'react';
import { useApp } from '@/context/AppContext';
import type { RetirementProfile, Client } from '@/types';
import { Card, Stat, SectionTitle, Field, Input, EmptyState, PageHeader } from '@/components/ui';
import { AreaLineChart, type Point } from '@/components/Charts';
import { Disclaimer } from '@/components/Compliance';
import { money } from '@/lib/utils';
import { projectRetirement, requiredCapital } from '@/lib/retirement';

const DEFAULT_PROFILE: RetirementProfile = {
  currentAge: 35,
  retirementAge: 65,
  currentSavings: 10000,
  monthlyContribution: 300,
  expectedReturn: 5,
  desiredMonthlyIncome: 3000,
};

export const Retirement: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  if (!currentClient) return null;
  const c = currentClient;
  const profile = c.retirement ?? DEFAULT_PROFILE;
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const set = (patch: Partial<RetirementProfile>) =>
    mutate((cl) => ({ ...cl, retirement: { ...(cl.retirement ?? DEFAULT_PROFILE), ...patch } }));

  const proj = projectRetirement(profile);
  const needed = requiredCapital(profile.desiredMonthlyIncome);
  const progress = needed > 0 ? Math.min(100, (proj.futureValue / needed) * 100) : 0;

  const points: Point[] = proj.yearlyBalances.map((b) => ({
    x: b.age,
    y: b.value,
    label: `${Math.round(b.age)} ans`,
  }));

  const num = (v: string) => (v === '' ? 0 : Number(v));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title="Ma retraite"
        subtitle="Estimez où vous mènera votre épargne — et ajustez pour atteindre votre objectif."
        icon="fa-umbrella-beach"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Capital à la retraite" value={money(proj.futureValue)} icon="fa-piggy-bank" tone="forest" hint={`dans ${proj.years} ans`} />
        <Stat label="Revenu mensuel estimé" value={money(proj.sustainableMonthlyIncome)} icon="fa-money-bill-trend-up" tone="gold" hint="Règle du 4 %" />
        <Stat label="Revenu souhaité" value={money(profile.desiredMonthlyIncome)} icon="fa-bullseye" />
        <Stat
          label={proj.onTrack ? 'Sur la bonne voie' : 'Écart mensuel'}
          value={proj.onTrack ? '✓' : money(Math.abs(proj.gapMonthly))}
          icon={proj.onTrack ? 'fa-circle-check' : 'fa-triangle-exclamation'}
          tone={proj.onTrack ? 'emerald' : 'rose'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Paramètres */}
        <Card className="p-6">
          <SectionTitle icon="fa-sliders" title="Vos paramètres" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Âge actuel"><Input type="number" value={profile.currentAge} onChange={(e) => set({ currentAge: num(e.target.value) })} /></Field>
              <Field label="Âge de retraite"><Input type="number" value={profile.retirementAge} onChange={(e) => set({ retirementAge: num(e.target.value) })} /></Field>
            </div>
            <Field label="Épargne actuelle ($)"><Input type="number" value={profile.currentSavings} onChange={(e) => set({ currentSavings: num(e.target.value) })} /></Field>
            <Field label="Cotisation mensuelle ($)"><Input type="number" value={profile.monthlyContribution} onChange={(e) => set({ monthlyContribution: num(e.target.value) })} /></Field>
            <Field label={`Rendement annuel attendu : ${profile.expectedReturn} %`} hint="Prudent : 4-5 %. Historique variable.">
              <input type="range" min={1} max={9} step={0.5} value={profile.expectedReturn} onChange={(e) => set({ expectedReturn: num(e.target.value) })} className="w-full accent-forest-600" />
            </Field>
            <Field label="Revenu mensuel souhaité à la retraite ($)"><Input type="number" value={profile.desiredMonthlyIncome} onChange={(e) => set({ desiredMonthlyIncome: num(e.target.value) })} /></Field>
          </div>
        </Card>

        {/* Projection */}
        <Card className="p-6 lg:col-span-2">
          <SectionTitle icon="fa-chart-area" title="Croissance de votre épargne" subtitle={`De ${profile.currentAge} à ${profile.retirementAge} ans`} />
          {points.length > 1 ? (
            <AreaLineChart points={points} color="#2e5d45" height={240} formatY={(n) => money(n)} formatX={(n) => `${Math.round(n)} ans`} />
          ) : (
            <EmptyState icon="fa-chart-area" title="Ajustez les âges pour voir la projection" />
          )}

          <div className="mt-6 pt-4 border-t border-paper-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-forest-600 font-medium">Progression vers le capital requis</span>
              <span className="text-forest-500">{money(proj.futureValue)} / {money(needed)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-200 overflow-hidden">
              <div className={`h-full rounded-full ${proj.onTrack ? 'bg-emerald-500' : 'bg-gold-400'}`} style={{ width: `${progress}%` }} />
            </div>
            <p className={`text-sm mt-3 ${proj.onTrack ? 'text-emerald-700' : 'text-amber-800'}`}>
              <i className={`fas ${proj.onTrack ? 'fa-circle-check' : 'fa-lightbulb'} mr-1`} />
              {proj.onTrack
                ? 'Votre plan actuel permet d’atteindre le revenu souhaité. Continuez ainsi !'
                : `Pour combler l’écart, augmentez la cotisation ou repoussez légèrement l’âge de retraite. Écart estimé : ${money(Math.abs(proj.gapMonthly))}/mois.`}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-paper-50 border-paper-300">
        <p className="text-xs text-forest-500 leading-relaxed">
          <i className="fas fa-circle-info mr-1 text-gold-500" />
          Estimation simplifiée à des fins pédagogiques (capitalisation mensuelle, règle du 4 %).
          Elle ne tient pas compte de l'inflation, des impôts, des rendements réels ni des
          régimes publics (RRQ, PSV). Une projection personnalisée avec votre conseiller est requise.
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
};
