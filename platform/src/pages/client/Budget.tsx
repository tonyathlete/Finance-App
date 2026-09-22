import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { BudgetItem, IncomeItem, Client } from '@/types';
import {
  Card,
  Stat,
  Button,
  SectionTitle,
  Modal,
  Field,
  Input,
  Select,
  EmptyState,
  Badge,
} from '@/components/ui';
import { DonutChart, ChartLegend } from '@/components/Charts';
import { Disclaimer } from '@/components/Compliance';
import { money, uid } from '@/lib/utils';
import {
  totalIncome,
  totalExpenses,
  monthlyBalance,
  essentialExpenses,
  discretionaryExpenses,
  expensesByCategory,
} from '@/lib/finance';

const CATEGORIES = [
  'Logement',
  'Alimentation',
  'Transport',
  'Services',
  'Famille',
  'Santé',
  'Loisirs',
  'Épargne',
  'Dettes',
  'Discrétionnaire',
  'Autre',
];

export const Budget: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [incomeModal, setIncomeModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  if (!currentClient) return null;
  const c = currentClient;

  const income = totalIncome(c.incomes);
  const expense = totalExpenses(c.budget);
  const balance = monthlyBalance(c);
  const byCat = expensesByCategory(c.budget);

  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const removeIncome = (id: string) =>
    mutate((cl) => ({ ...cl, incomes: cl.incomes.filter((i) => i.id !== id) }));
  const removeExpense = (id: string) =>
    mutate((cl) => ({ ...cl, budget: cl.budget.filter((b) => b.id !== id) }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Mon budget</h1>
          <p className="text-forest-500 mt-1">
            Voyez où va votre argent chaque mois et ajustez au besoin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Revenus" value={money(income)} icon="fa-arrow-down" tone="emerald" />
        <Stat label="Dépenses" value={money(expense)} icon="fa-arrow-up" tone="gold" />
        <Stat
          label="Solde"
          value={money(balance)}
          icon="fa-scale-balanced"
          tone={balance >= 0 ? 'forest' : 'rose'}
        />
        <Stat
          label="Essentiel / discrétionnaire"
          value={`${money(essentialExpenses(c.budget))}`}
          hint={`Discrétionnaire : ${money(discretionaryExpenses(c.budget))}`}
          icon="fa-layer-group"
        />
      </div>

      {/* Répartition */}
      <Card className="p-6">
        <SectionTitle icon="fa-chart-pie" title="Répartition des dépenses" />
        {byCat.length ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <DonutChart
              data={byCat.map((x) => ({ label: x.category, value: x.amount }))}
              center={
                <div>
                  <p className="text-xs text-forest-400">Total</p>
                  <p className="font-display font-bold text-forest-900">{money(expense)}</p>
                </div>
              }
            />
            <div className="flex-1 w-full">
              <ChartLegend data={byCat.map((x) => ({ label: x.category, value: x.amount }))} />
            </div>
          </div>
        ) : (
          <EmptyState icon="fa-chart-pie" title="Aucune dépense enregistrée" />
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenus */}
        <Card className="p-6">
          <SectionTitle
            icon="fa-sack-dollar"
            title="Revenus"
            action={<Button size="sm" icon="fa-plus" onClick={() => setIncomeModal(true)}>Ajouter</Button>}
          />
          <ul className="divide-y divide-paper-100">
            {c.incomes.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-forest-900">{i.label}</p>
                  {i.variable && <Badge tone="amber" className="mt-1">Variable</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-forest-900 tabular-nums">{money(i.amount)}</span>
                  <button onClick={() => removeIncome(i.id)} className="text-forest-300 hover:text-rose-500">
                    <i className="fas fa-trash-can" />
                  </button>
                </div>
              </li>
            ))}
            {!c.incomes.length && <EmptyState icon="fa-sack-dollar" title="Aucun revenu" />}
          </ul>
        </Card>

        {/* Dépenses */}
        <Card className="p-6">
          <SectionTitle
            icon="fa-receipt"
            title="Dépenses"
            action={<Button size="sm" variant="gold" icon="fa-plus" onClick={() => setExpenseModal(true)}>Ajouter</Button>}
          />
          <ul className="divide-y divide-paper-100 max-h-96 overflow-y-auto">
            {c.budget.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="font-medium text-forest-900 truncate">{b.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone="gray">{b.category}</Badge>
                    {b.essential ? (
                      <Badge tone="forest">Essentiel</Badge>
                    ) : (
                      <Badge tone="amber">Discrétionnaire</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-semibold text-forest-900 tabular-nums">{money(b.amount)}</span>
                  <button onClick={() => removeExpense(b.id)} className="text-forest-300 hover:text-rose-500">
                    <i className="fas fa-trash-can" />
                  </button>
                </div>
              </li>
            ))}
            {!c.budget.length && <EmptyState icon="fa-receipt" title="Aucune dépense" />}
          </ul>
        </Card>
      </div>

      <Disclaimer />

      <IncomeModal
        open={incomeModal}
        onClose={() => setIncomeModal(false)}
        onAdd={(item) => mutate((cl) => ({ ...cl, incomes: [...cl.incomes, item] }))}
      />
      <ExpenseModal
        open={expenseModal}
        onClose={() => setExpenseModal(false)}
        onAdd={(item) => mutate((cl) => ({ ...cl, budget: [...cl.budget, item] }))}
      />
    </div>
  );
};

// --- Modales ---------------------------------------------------------------

const IncomeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (i: IncomeItem) => void;
}> = ({ open, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [variable, setVariable] = useState(false);

  const submit = () => {
    if (!label.trim() || !amount) return;
    onAdd({ id: uid('in'), label: label.trim(), amount: Number(amount), variable });
    setLabel(''); setAmount(''); setVariable(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter un revenu"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Ajouter</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Source du revenu">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Salaire, contrats…" />
        </Field>
        <Field label="Montant net mensuel ($)">
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-forest-700">
          <input type="checkbox" checked={variable} onChange={(e) => setVariable(e.target.checked)} />
          Revenu variable (travailleur autonome, commissions…)
        </label>
      </div>
    </Modal>
  );
};

const ExpenseModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (b: BudgetItem) => void;
}> = ({ open, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [essential, setEssential] = useState(true);

  const submit = () => {
    if (!label.trim() || !amount) return;
    onAdd({ id: uid('bd'), label: label.trim(), amount: Number(amount), category, essential });
    setLabel(''); setAmount(''); setCategory(CATEGORIES[0]); setEssential(true);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter une dépense"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="gold" onClick={submit}>Ajouter</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Description">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Loyer, épicerie…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Montant mensuel ($)">
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </Field>
          <Field label="Catégorie">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Type de dépense">
          <div className="flex gap-2">
            <button
              onClick={() => setEssential(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                essential ? 'bg-forest-600 text-white border-forest-600' : 'border-paper-300 text-forest-600'
              }`}
            >
              Essentielle
            </button>
            <button
              onClick={() => setEssential(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                !essential ? 'bg-gold-400 text-forest-900 border-gold-400' : 'border-paper-300 text-forest-600'
              }`}
            >
              Discrétionnaire
            </button>
          </div>
        </Field>
      </div>
    </Modal>
  );
};
