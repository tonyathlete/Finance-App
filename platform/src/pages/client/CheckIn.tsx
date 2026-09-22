import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { CheckIn as CheckInType, CheckInMood, Client } from '@/types';
import { Card, Button, SectionTitle, Field, Input, Textarea, EmptyState, Badge, PageHeader } from '@/components/ui';
import { AdvisorIdentity } from '@/components/Compliance';
import { uid, nowISO, mondayOf, formatDate, money } from '@/lib/utils';
import { moodEmoji, moodLabel } from '@/lib/labels';

const MOODS: CheckInMood[] = ['excellent', 'bien', 'moyen', 'difficile'];

export const CheckIn: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  if (!currentClient) return null;
  const c = currentClient;

  const [mood, setMood] = useState<CheckInMood>('bien');
  const [income, setIncome] = useState('');
  const [saved, setSaved] = useState('');
  const [wins, setWins] = useState('');
  const [blockers, setBlockers] = useState('');
  const [focus, setFocus] = useState('');
  const [progress, setProgress] = useState('');

  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);
  const history = [...c.checkIns].sort((a, b) => b.weekOf.localeCompare(a.weekOf));

  const submit = () => {
    const entry: CheckInType = {
      id: uid('ci'),
      weekOf: mondayOf(),
      mood,
      incomeThisWeek: income ? Number(income) : undefined,
      savedThisWeek: saved ? Number(saved) : undefined,
      wins: wins.trim(),
      blockers: blockers.trim(),
      focusNextWeek: focus.trim(),
      goalProgressNote: progress.trim(),
      createdAt: nowISO(),
    };
    mutate((cl) => ({ ...cl, checkIns: [...cl.checkIns, entry] }));
    setMood('bien'); setIncome(''); setSaved(''); setWins(''); setBlockers(''); setFocus(''); setProgress('');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title="Check-in de la semaine"
        subtitle="Un petit bilan hebdomadaire. Votre conseiller le voit et vous accompagne."
        icon="fa-calendar-check"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulaire */}
        <Card className="p-6 lg:col-span-2">
          <SectionTitle icon="fa-pen-to-square" title="Comment s'est passée votre semaine ?" />

          <Field label="Humeur générale face à vos finances">
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-3 rounded-xl border text-center transition ${
                    mood === m ? 'border-forest-500 bg-forest-50' : 'border-paper-200 hover:border-forest-300'
                  }`}
                >
                  <span className="block text-2xl">{moodEmoji[m]}</span>
                  <span className="block text-xs mt-1 text-forest-600">{moodLabel[m]}</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Revenu de la semaine ($)" hint="Utile pour les travailleurs autonomes">
              <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0" />
            </Field>
            <Field label="Montant épargné cette semaine ($)">
              <Input type="number" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="0" />
            </Field>
          </div>

          <div className="space-y-4 mt-4">
            <Field label="Ce qui a bien été 🎉">
              <Textarea rows={2} value={wins} onChange={(e) => setWins(e.target.value)} placeholder="Vos réussites de la semaine…" />
            </Field>
            <Field label="Obstacles rencontrés">
              <Textarea rows={2} value={blockers} onChange={(e) => setBlockers(e.target.value)} placeholder="Ce qui a été plus difficile…" />
            </Field>
            <Field label="Progrès vers mes objectifs">
              <Textarea rows={2} value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="Ex : +200 $ au fonds d'urgence…" />
            </Field>
            <Field label="Ma priorité pour la semaine prochaine 🎯">
              <Input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Une seule priorité claire" />
            </Field>
          </div>

          <Button className="mt-6 w-full" icon="fa-check" onClick={submit}>
            Enregistrer mon check-in
          </Button>
        </Card>

        <div className="space-y-6">
          <AdvisorIdentity />
          <Card className="p-5 bg-forest-50 border-forest-100">
            <p className="text-sm font-semibold text-forest-800 mb-1">
              <i className="fas fa-lightbulb text-gold-500 mr-1" /> Pourquoi le check-in ?
            </p>
            <p className="text-sm text-forest-600 leading-relaxed">
              Un rendez-vous hebdomadaire court garde vos objectifs vivants. C'est là que
              votre conseiller ajuste le plan avec vous, semaine après semaine.
            </p>
          </Card>
        </div>
      </div>

      {/* Historique */}
      <div>
        <SectionTitle icon="fa-clock-rotate-left" title="Historique" />
        {history.length ? (
          <div className="space-y-3">
            {history.map((h) => (
              <Card key={h.id} className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodEmoji[h.mood]}</span>
                    <span className="font-medium text-forest-900">Semaine du {formatDate(h.weekOf)}</span>
                  </div>
                  <div className="flex gap-2">
                    {typeof h.savedThisWeek === 'number' && (
                      <Badge tone="green">Épargné {money(h.savedThisWeek)}</Badge>
                    )}
                    {typeof h.incomeThisWeek === 'number' && (
                      <Badge tone="gold">Revenu {money(h.incomeThisWeek)}</Badge>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
                  {h.wins && <Info label="Réussites" text={h.wins} />}
                  {h.blockers && <Info label="Obstacles" text={h.blockers} />}
                  {h.goalProgressNote && <Info label="Progrès objectifs" text={h.goalProgressNote} />}
                  {h.focusNextWeek && <Info label="Priorité suivante" text={h.focusNextWeek} />}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <EmptyState icon="fa-clock-rotate-left" title="Aucun check-in enregistré" />
          </Card>
        )}
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="bg-paper-50 rounded-xl p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{label}</p>
    <p className="text-forest-700 mt-0.5">{text}</p>
  </div>
);
