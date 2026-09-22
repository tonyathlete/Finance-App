import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Goal, GoalType, Client } from '@/types';
import {
  Card,
  Button,
  SectionTitle,
  Modal,
  Field,
  Input,
  Select,
  Textarea,
  ProgressBar,
  Badge,
  EmptyState,
  PageHeader,
} from '@/components/ui';
import { Disclaimer } from '@/components/Compliance';
import { money, uid, nowISO, formatDate } from '@/lib/utils';
import { goalProgress, projectGoal } from '@/lib/finance';
import { goalTypeIcon, goalTypeLabel } from '@/lib/labels';

const GOAL_TYPES: GoalType[] = ['fonds_urgence', 'voyage', 'retraite', 'dette', 'achat', 'autre'];

export const Goals: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  if (!currentClient) return null;
  const c = currentClient;
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const saveGoal = (g: Goal) =>
    mutate((cl) => ({
      ...cl,
      goals: cl.goals.some((x) => x.id === g.id)
        ? cl.goals.map((x) => (x.id === g.id ? g : x))
        : [...cl.goals, g],
    }));

  const addContribution = (goalId: string, amount: number) =>
    mutate((cl) => ({
      ...cl,
      goals: cl.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      ),
    }));

  const toggleMilestone = (goalId: string, msId: string) =>
    mutate((cl) => ({
      ...cl,
      goals: cl.goals.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.map((m) => (m.id === msId ? { ...m, done: !m.done } : m)) }
          : g
      ),
    }));

  const removeGoal = (goalId: string) =>
    mutate((cl) => ({ ...cl, goals: cl.goals.filter((g) => g.id !== goalId) }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title="Mes objectifs"
        subtitle="Chaque objectif a un plan et un montant à mettre de côté chaque mois."
        icon="fa-bullseye"
        action={<Button variant="gold" icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Nouvel objectif</Button>}
      />

      {c.goals.length ? (
        <div className="grid md:grid-cols-2 gap-6">
          {c.goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onContribute={(amt) => addContribution(g.id, amt)}
              onToggleMs={(msId) => toggleMilestone(g.id, msId)}
              onRemove={() => removeGoal(g.id)}
              onEdit={() => { setEditing(g); setModal(true); }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <EmptyState
            icon="fa-bullseye"
            title="Aucun objectif pour l'instant"
            hint="Un premier objectif clair (ex. un fonds d'urgence) change tout."
            action={<Button icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Créer un objectif</Button>}
          />
        </Card>
      )}

      <Disclaimer />

      <GoalModal
        open={modal}
        onClose={() => setModal(false)}
        initial={editing}
        onSave={saveGoal}
      />
    </div>
  );
};

const GoalCard: React.FC<{
  goal: Goal;
  onContribute: (amt: number) => void;
  onToggleMs: (id: string) => void;
  onRemove: () => void;
  onEdit: () => void;
}> = ({ goal, onContribute, onToggleMs, onRemove, onEdit }) => {
  const [contrib, setContrib] = useState('');
  const p = goalProgress(goal);
  const proj = projectGoal(goal);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-forest-600 text-white flex items-center justify-center">
            <i className={`fas ${goalTypeIcon[goal.type]}`} />
          </span>
          <div>
            <Badge tone="gold">{goalTypeLabel[goal.type]}</Badge>
            <p className="font-medium text-forest-900 mt-1">{goal.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="text-forest-300 hover:text-forest-600" title="Modifier">
            <i className="fas fa-pen" />
          </button>
          <button onClick={onRemove} className="text-forest-300 hover:text-rose-500" title="Supprimer">
            <i className="fas fa-trash-can" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-1">
          <span className="font-display text-2xl font-bold text-forest-900">{money(goal.currentAmount)}</span>
          <span className="text-sm text-forest-400">sur {money(goal.targetAmount)}</span>
        </div>
        <ProgressBar value={p} tone="gold" />
        <p className="text-xs text-forest-400 mt-1">{Math.round(p)} % atteint</p>
      </div>

      {/* Projection */}
      <div
        className={`mt-4 rounded-xl p-3 text-sm ${
          proj.onTrack ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
        }`}
      >
        <p className="font-semibold flex items-center gap-2">
          <i className={`fas ${proj.onTrack ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} />
          {proj.onTrack ? 'Sur la bonne voie' : 'Ajustement suggéré'}
        </p>
        <p className="mt-1 leading-relaxed">
          Cible le {formatDate(goal.targetDate)} ({proj.monthsLeft} mois). Vous mettez{' '}
          {money(goal.monthlyContribution)}/mois. Rythme requis :{' '}
          <strong>{money(proj.requiredMonthly)}/mois</strong>.
          {!proj.onTrack && proj.projectedShortfall > 0 && (
            <> Manque projeté : {money(proj.projectedShortfall)}.</>
          )}
        </p>
      </div>

      {/* Jalons */}
      {goal.milestones.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400 mb-2">Étapes</p>
          <ul className="space-y-1.5">
            {goal.milestones.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onToggleMs(m.id)}
                  className="flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900"
                >
                  <i className={`fas ${m.done ? 'fa-square-check text-forest-500' : 'fa-square text-forest-300'}`} />
                  <span className={m.done ? 'line-through text-forest-400' : ''}>{m.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {goal.note && <p className="mt-3 text-sm text-forest-500 italic">« {goal.note} »</p>}

      {/* Ajout de contribution */}
      <div className="mt-4 pt-4 border-t border-paper-100 flex gap-2">
        <Input
          type="number"
          value={contrib}
          onChange={(e) => setContrib(e.target.value)}
          placeholder="Ajouter un montant $"
        />
        <Button
          variant="gold"
          onClick={() => {
            if (contrib) {
              onContribute(Number(contrib));
              setContrib('');
            }
          }}
        >
          + Épargne
        </Button>
      </div>
    </Card>
  );
};

const toDateInput = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const GoalModal: React.FC<{ open: boolean; onClose: () => void; initial: Goal | null; onSave: (g: Goal) => void }> = ({
  open,
  onClose,
  initial,
  onSave,
}) => {
  const [type, setType] = useState<GoalType>('fonds_urgence');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [monthly, setMonthly] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  React.useEffect(() => {
    if (open) {
      setType(initial?.type ?? 'fonds_urgence');
      setTitle(initial?.title ?? '');
      setTarget(initial ? String(initial.targetAmount) : '');
      setCurrent(initial ? String(initial.currentAmount) : '');
      setMonthly(initial ? String(initial.monthlyContribution) : '');
      setDate(initial ? toDateInput(initial.targetDate) : '');
      setNote(initial?.note ?? '');
    }
  }, [open, initial]);

  const submit = () => {
    if (!title.trim() || !target) return;
    onSave({
      id: initial?.id ?? uid('go'),
      type,
      title: title.trim(),
      targetAmount: Number(target),
      currentAmount: Number(current) || 0,
      monthlyContribution: Number(monthly) || 0,
      targetDate: date ? new Date(date).toISOString() : new Date(Date.now() + 365 * 864e5).toISOString(),
      note: note.trim(),
      milestones: initial?.milestones ?? [],
      createdAt: initial?.createdAt ?? nowISO(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier l'objectif" : 'Nouvel objectif'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>{initial ? 'Enregistrer' : 'Créer'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as GoalType)}>
              {GOAL_TYPES.map((t) => (
                <option key={t} value={t}>{goalTypeLabel[t]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Date cible">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Titre de l'objectif">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Voyage en Italie" />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Montant visé ($)">
            <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" />
          </Field>
          <Field label="Déjà épargné ($)">
            <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" />
          </Field>
          <Field label="Par mois ($)">
            <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="0" />
          </Field>
        </div>
        <Field label="Note (optionnel)">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Pourquoi cet objectif compte…" />
        </Field>
      </div>
    </Modal>
  );
};
