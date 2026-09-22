import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import type { Debt, Client } from '@/types';
import {
  Card, Stat, Button, SectionTitle, Modal, Field, Input, EmptyState, Badge, PageHeader, ProgressBar,
} from '@/components/ui';
import { AreaLineChart, type Point } from '@/components/Charts';
import { Disclaimer } from '@/components/Compliance';
import { money, uid, nowISO } from '@/lib/utils';
import {
  simulatePayoff, totalDebtBalance, totalMinPayments, type PayoffStrategy,
} from '@/lib/debt';

export const Debts: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [strategy, setStrategy] = useState<PayoffStrategy>('avalanche');
  const [extra, setExtra] = useState(200);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Debt | null>(null);

  if (!currentClient) return null;
  const c = currentClient;
  const debts = c.debts ?? [];
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const totalBal = totalDebtBalance(debts);
  const minTotal = totalMinPayments(debts);

  const plan = useMemo(() => simulatePayoff(debts, strategy, extra, true), [debts, strategy, extra]);
  const baseline = useMemo(() => simulatePayoff(debts, strategy, 0, false), [debts, strategy]);
  const interestSaved = Math.max(0, baseline.totalInterest - plan.totalInterest);
  const monthsSaved = Math.max(0, baseline.months - plan.months);

  const orderedDebts = plan.order
    .map((id) => debts.find((d) => d.id === id))
    .filter((d): d is Debt => !!d);

  const chartPoints: Point[] = plan.timeline.map((v, i) => ({
    x: i,
    y: v,
    label: `Mois ${i}`,
  }));

  const save = (d: Debt) =>
    mutate((cl) => ({
      ...cl,
      debts: (cl.debts ?? []).some((x) => x.id === d.id)
        ? (cl.debts ?? []).map((x) => (x.id === d.id ? d : x))
        : [...(cl.debts ?? []), d],
    }));
  const remove = (id: string) =>
    mutate((cl) => ({ ...cl, debts: (cl.debts ?? []).filter((d) => d.id !== id) }));

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + plan.months);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title="Plan de remboursement"
        subtitle="Un plan clair pour devenir libre de dettes, plus vite et à moindre coût."
        icon="fa-hand-holding-dollar"
        action={<Button variant="gold" icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Ajouter une dette</Button>}
      />

      {debts.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon="fa-face-smile"
            title="Aucune dette enregistrée"
            hint="Ajoutez vos dettes (carte, marge, prêt…) pour bâtir un plan de remboursement."
            action={<Button icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Ajouter une dette</Button>}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Dette totale" value={money(totalBal)} icon="fa-file-invoice-dollar" tone="rose" />
            <Stat label="Paiements min. / mois" value={money(minTotal)} icon="fa-calendar" />
            <Stat label="Libre de dettes dans" value={`${plan.months} mois`} icon="fa-flag-checkered" tone="forest" hint={payoffDate.toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })} />
            <Stat label="Intérêts économisés" value={money(interestSaved)} icon="fa-piggy-bank" tone="emerald" hint={monthsSaved > 0 ? `${monthsSaved} mois plus tôt` : undefined} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stratégie + extra */}
            <Card className="p-6 lg:col-span-1">
              <SectionTitle icon="fa-sliders" title="Votre stratégie" />
              <div className="space-y-2">
                <StrategyOption
                  active={strategy === 'avalanche'}
                  onClick={() => setStrategy('avalanche')}
                  title="Avalanche"
                  desc="On attaque le taux d'intérêt le plus élevé d'abord. Le plus économique."
                  icon="fa-bolt"
                />
                <StrategyOption
                  active={strategy === 'snowball'}
                  onClick={() => setStrategy('snowball')}
                  title="Boule de neige"
                  desc="On élimine le plus petit solde d'abord. Le plus motivant."
                  icon="fa-snowflake"
                />
              </div>
              <div className="mt-5">
                <Field label={`Paiement supplémentaire : ${money(extra)}/mois`} hint="En plus des paiements minimums.">
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={25}
                    value={extra}
                    onChange={(e) => setExtra(Number(e.target.value))}
                    className="w-full accent-forest-600"
                  />
                </Field>
              </div>
            </Card>

            {/* Graphique */}
            <Card className="p-6 lg:col-span-2">
              <SectionTitle icon="fa-chart-area" title="Évolution de votre dette" subtitle="Solde total restant, mois après mois" />
              <AreaLineChart
                points={chartPoints}
                color="#2e5d45"
                height={220}
                formatY={(n) => money(n)}
                formatX={(n) => `Mois ${n}`}
              />
              {plan.reachedCap && (
                <p className="text-sm text-rose-600 mt-2">
                  <i className="fas fa-triangle-exclamation mr-1" />
                  Avec ces montants, les paiements ne couvrent pas les intérêts. Augmentez le paiement supplémentaire.
                </p>
              )}
            </Card>
          </div>

          {/* Ordre de remboursement */}
          <Card className="p-6">
            <SectionTitle icon="fa-list-ol" title="Ordre de remboursement suggéré" subtitle={strategy === 'avalanche' ? "Du taux le plus élevé au plus bas" : "Du plus petit solde au plus grand"} />
            <ul className="space-y-2">
              {orderedDebts.map((d, i) => (
                <li key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-paper-200">
                  <span className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">{i + 1}</span>
                  <button className="text-left flex-1 min-w-0" onClick={() => { setEditing(d); setModal(true); }}>
                    <p className="font-medium text-forest-900">{d.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge tone={d.apr >= 15 ? 'rose' : 'gray'}>{d.apr}% TAP</Badge>
                      <span className="text-xs text-forest-400">min. {money(d.minPayment)}/mois</span>
                    </div>
                  </button>
                  <div className="text-right flex-shrink-0">
                    <span className="font-semibold text-forest-900 tabular-nums">{money(d.balance)}</span>
                    <button onClick={() => remove(d.id)} className="ml-3 text-forest-300 hover:text-rose-500"><i className="fas fa-trash-can" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-forest-400 mt-3"><i className="fas fa-circle-info mr-1" /> Cliquez une dette pour la modifier.</p>
          </Card>

          {/* Comparatif */}
          <Card className="p-6 bg-forest-50 border-forest-100">
            <SectionTitle icon="fa-scale-balanced" title="Ce que votre plan change" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-forest-400">Paiements minimums seulement</p>
                <p className="font-display text-xl font-bold text-forest-900 mt-1">{baseline.months} mois</p>
                <p className="text-sm text-rose-600">{money(baseline.totalInterest)} d'intérêts</p>
              </div>
              <div className="bg-white rounded-xl p-4 ring-2 ring-forest-500">
                <p className="text-xs uppercase tracking-wide text-forest-500">Votre plan ({strategy === 'avalanche' ? 'avalanche' : 'boule de neige'} + {money(extra)}/mois)</p>
                <p className="font-display text-xl font-bold text-forest-900 mt-1">{plan.months} mois</p>
                <p className="text-sm text-emerald-600">{money(plan.totalInterest)} d'intérêts</p>
              </div>
            </div>
          </Card>
        </>
      )}

      <Disclaimer />

      <DebtModal open={modal} onClose={() => setModal(false)} initial={editing} onSave={save} />
    </div>
  );
};

const StrategyOption: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string; icon: string }> = ({ active, onClick, title, desc, icon }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-xl border transition ${active ? 'border-forest-500 bg-forest-50' : 'border-paper-200 hover:border-forest-300'}`}
  >
    <div className="flex items-center gap-2">
      <i className={`fas ${icon} ${active ? 'text-forest-600' : 'text-forest-300'}`} />
      <span className="font-semibold text-forest-900">{title}</span>
      {active && <i className="fas fa-circle-check text-forest-500 ml-auto" />}
    </div>
    <p className="text-sm text-forest-500 mt-1">{desc}</p>
  </button>
);

const DebtModal: React.FC<{ open: boolean; onClose: () => void; initial: Debt | null; onSave: (d: Debt) => void }> = ({ open, onClose, initial, onSave }) => {
  const [label, setLabel] = useState('');
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [minPayment, setMinPayment] = useState('');

  React.useEffect(() => {
    if (open) {
      setLabel(initial?.label ?? '');
      setBalance(initial ? String(initial.balance) : '');
      setApr(initial ? String(initial.apr) : '');
      setMinPayment(initial ? String(initial.minPayment) : '');
    }
  }, [open, initial]);

  const submit = () => {
    if (!label.trim() || !balance) return;
    onSave({
      id: initial?.id ?? uid('de'),
      label: label.trim(),
      balance: Number(balance),
      apr: Number(apr) || 0,
      minPayment: Number(minPayment) || 0,
      createdAt: initial?.createdAt ?? nowISO(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la dette' : 'Ajouter une dette'}
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={submit}>{initial ? 'Enregistrer' : 'Ajouter'}</Button></>}
    >
      <div className="space-y-4">
        <Field label="Description"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Carte de crédit, prêt auto…" /></Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Solde ($)"><Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" /></Field>
          <Field label="Taux (%)"><Input type="number" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="0" /></Field>
          <Field label="Min. / mois ($)"><Input type="number" value={minPayment} onChange={(e) => setMinPayment(e.target.value)} placeholder="0" /></Field>
        </div>
      </div>
    </Modal>
  );
};
