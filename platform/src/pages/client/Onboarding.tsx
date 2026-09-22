import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import type { Client, GoalType } from '@/types';
import { Button, Field, Input, Select } from '@/components/ui';
import { BrandLockup } from '@/components/Brand';
import { PrivacyNote } from '@/components/Compliance';
import { uid, nowISO } from '@/lib/utils';
import { goalTypeLabel } from '@/lib/labels';

const STEPS = ['Bienvenue', 'Consentement', 'Revenus', 'Dépenses', 'Objectif'] as const;

const GOAL_TYPES: GoalType[] = ['fonds_urgence', 'dette', 'voyage', 'retraite', 'achat', 'autre'];

export const Onboarding: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);

  // champs locaux
  const [income, setIncome] = useState('');
  const [incomeVar, setIncomeVar] = useState(false);
  const [exp, setExp] = useState({ Logement: '', Alimentation: '', Transport: '', Autres: '' });
  const [goalType, setGoalType] = useState<GoalType>('fonds_urgence');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');

  if (!currentClient) return null;
  const c = currentClient;
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const giveConsent = () => { mutate((cl) => ({ ...cl, consentGivenAt: nowISO() })); next(); };

  const saveIncome = () => {
    if (income) mutate((cl) => ({ ...cl, incomes: [...cl.incomes, { id: uid('in'), label: 'Revenu principal', amount: Number(income), variable: incomeVar }] }));
    next();
  };

  const saveExpenses = () => {
    const items = Object.entries(exp)
      .filter(([, v]) => v && Number(v) > 0)
      .map(([cat, v]) => ({
        id: uid('bd'),
        label: cat,
        category: cat === 'Autres' ? 'Autre' : cat,
        amount: Number(v),
        essential: cat !== 'Autres',
      }));
    if (items.length) mutate((cl) => ({ ...cl, budget: [...cl.budget, ...items] }));
    next();
  };

  const finish = () => {
    if (goalTitle && goalTarget) {
      mutate((cl) => ({
        ...cl,
        goals: [...cl.goals, {
          id: uid('go'), type: goalType, title: goalTitle.trim(),
          targetAmount: Number(goalTarget), currentAmount: 0, monthlyContribution: 0,
          targetDate: goalDate ? new Date(goalDate).toISOString() : new Date(Date.now() + 365 * 864e5).toISOString(),
          note: '', milestones: [], createdAt: nowISO(),
        }],
      }));
    }
    navigate('/client');
  };

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      <header className="bg-forest-800 text-paper-50">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <BrandLockup tone="light" sub="Démarrage" />
          <button onClick={() => navigate('/client')} className="text-sm text-forest-100/70 hover:text-white">
            Passer <i className="fas fa-forward ml-1" />
          </button>
        </div>
      </header>

      {/* progression */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-6">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? 'bg-forest-500' : 'bg-paper-200'}`} />
              <p className={`text-[11px] mt-1 ${i === step ? 'text-forest-700 font-semibold' : 'text-forest-400'}`}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-2xl border border-paper-200 shadow-card p-6 sm:p-8 animate-fadeIn">
          {step === 0 && (
            <Step icon="fa-hand-sparkles" title={`Bienvenue, ${c.firstName} !`} desc="En quelques minutes, on met en place votre portrait financier. Vous pourrez tout modifier ensuite.">
              <ul className="space-y-2 text-sm text-forest-600">
                {['Votre consentement', 'Vos revenus', 'Vos dépenses principales', 'Un premier objectif'].map((t, i) => (
                  <li key={t} className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-forest-50 text-forest-600 text-xs flex items-center justify-center">{i + 1}</span>{t}</li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end"><Button icon="fa-arrow-right" onClick={next}>Commencer</Button></div>
            </Step>
          )}

          {step === 1 && (
            <Step icon="fa-file-signature" title="Votre consentement" desc="Avant tout, votre accord pour la collecte de vos données (Loi 25).">
              <div className="bg-paper-50 rounded-xl p-4"><PrivacyNote /></div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={back}>Retour</Button>
                <Button icon="fa-check" onClick={giveConsent}>Je consens et je continue</Button>
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step icon="fa-sack-dollar" title="Vos revenus" desc="Votre revenu net mensuel (approximatif, c'est correct).">
              <Field label="Revenu net mensuel ($)"><Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0" autoFocus /></Field>
              <label className="flex items-center gap-2 text-sm text-forest-700 mt-3">
                <input type="checkbox" checked={incomeVar} onChange={(e) => setIncomeVar(e.target.checked)} />
                Mon revenu est variable (travailleur autonome, commissions…)
              </label>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={back}>Retour</Button>
                <Button icon="fa-arrow-right" onClick={saveIncome}>Continuer</Button>
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step icon="fa-receipt" title="Vos dépenses principales" desc="Les grands postes. On affinera plus tard dans le budget.">
              <div className="grid sm:grid-cols-2 gap-4">
                {(['Logement', 'Alimentation', 'Transport', 'Autres'] as const).map((k) => (
                  <Field key={k} label={`${k} ($/mois)`}>
                    <Input type="number" value={exp[k]} onChange={(e) => setExp({ ...exp, [k]: e.target.value })} placeholder="0" />
                  </Field>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={back}>Retour</Button>
                <Button icon="fa-arrow-right" onClick={saveExpenses}>Continuer</Button>
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step icon="fa-bullseye" title="Un premier objectif" desc="Qu'aimeriez-vous accomplir en premier ? (optionnel)">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <Select value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)}>
                    {GOAL_TYPES.map((t) => <option key={t} value={t}>{goalTypeLabel[t]}</option>)}
                  </Select>
                </Field>
                <Field label="Date cible"><Input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} /></Field>
              </div>
              <Field label="Titre"><Input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="Ex : Fonds d'urgence" /></Field>
              <Field label="Montant visé ($)"><Input type="number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder="0" /></Field>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={back}>Retour</Button>
                <Button variant="gold" icon="fa-flag-checkered" onClick={finish}>Terminer</Button>
              </div>
            </Step>
          )}
        </div>
      </main>
    </div>
  );
};

const Step: React.FC<{ icon: string; title: string; desc: string; children: React.ReactNode }> = ({ icon, title, desc, children }) => (
  <div>
    <div className="w-12 h-12 rounded-xl bg-forest-600 text-white flex items-center justify-center mb-4"><i className={`fas ${icon} text-lg`} /></div>
    <h1 className="font-display text-2xl font-semibold text-forest-900">{title}</h1>
    <p className="text-forest-500 mt-1 mb-6">{desc}</p>
    {children}
  </div>
);
