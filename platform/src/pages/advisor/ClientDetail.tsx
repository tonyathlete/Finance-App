import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import type { Client, FollowUp, FollowUpStatus, AdvisorNote } from '@/types';
import {
  Card, Stat, Button, SectionTitle, Badge, Field, Input, Textarea, Select, EmptyState, ProgressBar,
} from '@/components/ui';
import { IncomeExpenseBar, DonutChart, ChartLegend } from '@/components/Charts';
import { money, uid, nowISO, formatDate, formatDateShort, daysUntil } from '@/lib/utils';
import {
  totalIncome, totalExpenses, monthlyBalance, savingsRate, expensesByCategory, goalProgress,
} from '@/lib/finance';
import { goalTypeIcon, goalTypeLabel, insuranceTypeLabel, moodEmoji, followUpStatusLabel } from '@/lib/labels';

type Tab = 'apercu' | 'budget' | 'objectifs' | 'assurances' | 'checkins' | 'suivis' | 'notes';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'apercu', label: 'Aperçu', icon: 'fa-gauge' },
  { id: 'budget', label: 'Budget', icon: 'fa-wallet' },
  { id: 'objectifs', label: 'Objectifs', icon: 'fa-bullseye' },
  { id: 'assurances', label: 'Assurances', icon: 'fa-shield-halved' },
  { id: 'checkins', label: 'Check-ins', icon: 'fa-calendar-check' },
  { id: 'suivis', label: 'Suivis', icon: 'fa-bell' },
  { id: 'notes', label: 'Notes', icon: 'fa-note-sticky' },
];

export const ClientDetail: React.FC<{ clientId: string }> = ({ clientId }) => {
  const { getClient, updateClient, loginAsClient } = useApp();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('apercu');

  const c = getClient(clientId);
  if (!c) {
    return (
      <Card className="p-6">
        <EmptyState icon="fa-user-slash" title="Client introuvable" action={<Button onClick={() => navigate('/conseiller/clients')}>Retour</Button>} />
      </Card>
    );
  }

  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/conseiller/clients')} className="text-sm text-forest-500 hover:text-forest-700">
        <i className="fas fa-arrow-left mr-1" /> Retour aux clients
      </button>

      {/* En-tête */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-forest-600 text-white flex items-center justify-center text-lg font-semibold">
              {c.firstName[0]}{c.lastName[0]}
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-forest-900">{c.firstName} {c.lastName}</h1>
              <p className="text-forest-500 text-sm">{c.situation}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {c.isSelfEmployed && <Badge tone="gold">Autonome</Badge>}
                {c.consentGivenAt ? <Badge tone="green">Consentement OK</Badge> : <Badge tone="amber">Consentement manquant</Badge>}
                <Badge tone="gray"><i className="fas fa-envelope" /> {c.email || '—'}</Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            icon="fa-eye"
            onClick={() => { loginAsClient(c.id); navigate('/client'); }}
          >
            Voir comme le client
          </Button>
        </div>
      </Card>

      {/* Onglets */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              tab === t.id ? 'bg-forest-600 text-white' : 'text-forest-600 hover:bg-forest-50'
            }`}
          >
            <i className={`fas ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'apercu' && <Overview client={c} />}
      {tab === 'budget' && <BudgetTab client={c} />}
      {tab === 'objectifs' && <GoalsTab client={c} />}
      {tab === 'assurances' && <InsuranceTab client={c} />}
      {tab === 'checkins' && <CheckInsTab client={c} />}
      {tab === 'suivis' && <FollowUpsTab client={c} mutate={mutate} />}
      {tab === 'notes' && <NotesTab client={c} mutate={mutate} />}
    </div>
  );
};

// --- Onglets ---------------------------------------------------------------

const Overview: React.FC<{ client: Client }> = ({ client: c }) => {
  const bal = monthlyBalance(c);
  const pending = c.followUps.filter((f) => f.status !== 'complete');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Revenus" value={money(totalIncome(c.incomes))} icon="fa-arrow-down" tone="emerald" />
        <Stat label="Dépenses" value={money(totalExpenses(c.budget))} icon="fa-arrow-up" tone="gold" />
        <Stat label="Solde" value={money(bal)} icon="fa-scale-balanced" tone={bal >= 0 ? 'forest' : 'rose'} />
        <Stat label="Épargne" value={`${Math.round(savingsRate(c))} %`} icon="fa-seedling" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle icon="fa-wallet" title="Flux mensuel" />
          <IncomeExpenseBar income={totalIncome(c.incomes)} expense={totalExpenses(c.budget)} />
        </Card>
        <Card className="p-6">
          <SectionTitle icon="fa-bell" title="Relances actives" />
          {pending.length ? (
            <ul className="space-y-2">
              {pending.map((f) => (
                <li key={f.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-paper-50">
                  <span className="text-forest-700">{f.title}</span>
                  <Badge tone="gold">{formatDateShort(f.dueDate)}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="fa-check" title="Aucune relance active" />
          )}
        </Card>
      </div>
    </div>
  );
};

const BudgetTab: React.FC<{ client: Client }> = ({ client: c }) => {
  const byCat = expensesByCategory(c.budget);
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <SectionTitle icon="fa-chart-pie" title="Dépenses par catégorie" />
        {byCat.length ? (
          <div className="flex flex-col items-center gap-6">
            <DonutChart data={byCat.map((x) => ({ label: x.category, value: x.amount }))}
              center={<div><p className="text-xs text-forest-400">Total</p><p className="font-bold text-forest-900">{money(totalExpenses(c.budget))}</p></div>} />
            <ChartLegend data={byCat.map((x) => ({ label: x.category, value: x.amount }))} />
          </div>
        ) : <EmptyState icon="fa-chart-pie" title="Aucune dépense" />}
      </Card>
      <Card className="p-6">
        <SectionTitle icon="fa-list" title="Détail" />
        <ul className="divide-y divide-paper-100 max-h-[28rem] overflow-y-auto">
          {c.budget.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
              <span><span className="font-medium text-forest-900">{b.label}</span> <Badge tone="gray" className="ml-1">{b.category}</Badge></span>
              <span className="font-semibold tabular-nums">{money(b.amount)}</span>
            </li>
          ))}
          {!c.budget.length && <EmptyState icon="fa-receipt" title="Aucune dépense" />}
        </ul>
        <p className="text-xs text-forest-400 mt-3">
          <i className="fas fa-circle-info mr-1" /> Pour modifier le budget, utilisez « Voir comme le client ».
        </p>
      </Card>
    </div>
  );
};

const GoalsTab: React.FC<{ client: Client }> = ({ client: c }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {c.goals.length ? c.goals.map((g) => {
      const p = goalProgress(g);
      return (
        <Card key={g.id} className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center"><i className={`fas ${goalTypeIcon[g.type]}`} /></span>
            <Badge tone="gold">{goalTypeLabel[g.type]}</Badge>
          </div>
          <p className="font-medium text-forest-900">{g.title}</p>
          <div className="mt-2 flex justify-between text-sm"><span>{money(g.currentAmount)}</span><span className="text-forest-400">{money(g.targetAmount)}</span></div>
          <ProgressBar value={p} tone="gold" className="mt-1" />
          <p className="text-xs text-forest-400 mt-2">{Math.round(p)} % · {money(g.monthlyContribution)}/mois · cible {formatDate(g.targetDate)}</p>
        </Card>
      );
    }) : <Card className="p-6 md:col-span-2"><EmptyState icon="fa-bullseye" title="Aucun objectif" /></Card>}
  </div>
);

const InsuranceTab: React.FC<{ client: Client }> = ({ client: c }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {c.insurance.length ? c.insurance.map((p) => (
      <Card key={p.id} className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-forest-900">{insuranceTypeLabel[p.type]}</p>
          <Badge tone="gray">{p.insurer}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          {typeof p.coverageAmount === 'number' && <div><p className="text-xs text-forest-400">Capital</p><p className="font-semibold">{money(p.coverageAmount)}</p></div>}
          {typeof p.monthlyPremium === 'number' && <div><p className="text-xs text-forest-400">Prime</p><p className="font-semibold">{money(p.monthlyPremium)}</p></div>}
        </div>
        {p.renewalDate && <p className="text-xs text-forest-400 mt-2">Renouvellement : {formatDate(p.renewalDate)}</p>}
      </Card>
    )) : <Card className="p-6 md:col-span-2"><EmptyState icon="fa-shield-halved" title="Aucune protection" /></Card>}
  </div>
);

const CheckInsTab: React.FC<{ client: Client }> = ({ client: c }) => {
  const history = [...c.checkIns].sort((a, b) => b.weekOf.localeCompare(a.weekOf));
  return (
    <div className="space-y-3">
      {history.length ? history.map((h) => (
        <Card key={h.id} className="p-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{moodEmoji[h.mood]}</span>
            <span className="font-medium text-forest-900">Semaine du {formatDate(h.weekOf)}</span>
            {typeof h.savedThisWeek === 'number' && <Badge tone="green" className="ml-auto">Épargné {money(h.savedThisWeek)}</Badge>}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
            {h.wins && <Field2 label="Réussites" text={h.wins} />}
            {h.blockers && <Field2 label="Obstacles" text={h.blockers} />}
            {h.goalProgressNote && <Field2 label="Progrès" text={h.goalProgressNote} />}
            {h.focusNextWeek && <Field2 label="Priorité suivante" text={h.focusNextWeek} />}
          </div>
        </Card>
      )) : <Card className="p-6"><EmptyState icon="fa-calendar-check" title="Aucun check-in" /></Card>}
    </div>
  );
};

const Field2: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="bg-paper-50 rounded-xl p-3"><p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{label}</p><p className="text-forest-700 mt-0.5">{text}</p></div>
);

const FollowUpsTab: React.FC<{ client: Client; mutate: (fn: (c: Client) => Client) => void }> = ({ client: c, mutate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const add = () => {
    if (!title.trim()) return;
    const f: FollowUp = {
      id: uid('fu'), title: title.trim(),
      dueDate: date ? new Date(date).toISOString() : new Date(Date.now() + 7 * 864e5).toISOString(),
      status: 'a_faire', note: note.trim(), createdAt: nowISO(),
    };
    mutate((cl) => ({ ...cl, followUps: [...cl.followUps, f] }));
    setTitle(''); setDate(''); setNote('');
  };
  const setStatus = (id: string, status: FollowUpStatus) =>
    mutate((cl) => ({ ...cl, followUps: cl.followUps.map((f) => (f.id === id ? { ...f, status } : f)) }));
  const remove = (id: string) => mutate((cl) => ({ ...cl, followUps: cl.followUps.filter((f) => f.id !== id) }));

  const sorted = [...c.followUps].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-2">
        <SectionTitle icon="fa-list-check" title="Suivis et relances" />
        {sorted.length ? (
          <ul className="space-y-2">
            {sorted.map((f) => {
              const overdue = f.status !== 'complete' && daysUntil(f.dueDate) < 0;
              return (
                <li key={f.id} className="flex items-start gap-3 p-3 rounded-xl border border-paper-200">
                  <button onClick={() => setStatus(f.id, f.status === 'complete' ? 'a_faire' : 'complete')} className="mt-0.5">
                    <i className={`fas ${f.status === 'complete' ? 'fa-circle-check text-forest-500' : 'fa-circle text-forest-300'} text-lg`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${f.status === 'complete' ? 'line-through text-forest-400' : 'text-forest-900'}`}>{f.title}</p>
                    {f.note && <p className="text-sm text-forest-500">{f.note}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge tone={overdue ? 'rose' : f.status === 'complete' ? 'green' : 'gold'}>
                        {overdue ? 'En retard' : followUpStatusLabel[f.status]}
                      </Badge>
                      <span className="text-xs text-forest-400">{formatDate(f.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.status !== 'planifie' && f.status !== 'complete' && (
                      <button onClick={() => setStatus(f.id, 'planifie')} className="text-xs text-forest-500 hover:text-forest-700">Planifier</button>
                    )}
                    <button onClick={() => remove(f.id)} className="text-forest-300 hover:text-rose-500"><i className="fas fa-trash-can" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : <EmptyState icon="fa-bell" title="Aucun suivi" />}
      </Card>

      <Card className="p-6">
        <SectionTitle icon="fa-plus" title="Ajouter un suivi" />
        <div className="space-y-3">
          <Field label="Titre"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Appel hebdomadaire" /></Field>
          <Field label="Échéance"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Note"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          <Button className="w-full" icon="fa-plus" onClick={add}>Ajouter</Button>
        </div>
      </Card>
    </div>
  );
};

const NotesTab: React.FC<{ client: Client; mutate: (fn: (c: Client) => Client) => void }> = ({ client: c, mutate }) => {
  const [text, setText] = useState('');
  const add = () => {
    if (!text.trim()) return;
    const n: AdvisorNote = { id: uid('an'), date: nowISO(), text: text.trim() };
    mutate((cl) => ({ ...cl, advisorNotes: [n, ...cl.advisorNotes] }));
    setText('');
  };
  const remove = (id: string) => mutate((cl) => ({ ...cl, advisorNotes: cl.advisorNotes.filter((n) => n.id !== id) }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle icon="fa-note-sticky" title="Notes privées (conseiller)" subtitle="Visibles par vous seulement" />
        <div className="flex gap-2">
          <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ajouter une note de suivi…" />
          <Button icon="fa-plus" onClick={add}>Noter</Button>
        </div>
      </Card>
      {c.advisorNotes.length ? (
        <div className="space-y-3">
          {c.advisorNotes.map((n) => (
            <Card key={n.id} className="p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm text-forest-700 flex-1">{n.text}</p>
                <button onClick={() => remove(n.id)} className="text-forest-300 hover:text-rose-500 ml-3"><i className="fas fa-trash-can" /></button>
              </div>
              <p className="text-xs text-forest-400 mt-2">{formatDate(n.date)}</p>
            </Card>
          ))}
        </div>
      ) : <Card className="p-6"><EmptyState icon="fa-note-sticky" title="Aucune note" /></Card>}
    </div>
  );
};
