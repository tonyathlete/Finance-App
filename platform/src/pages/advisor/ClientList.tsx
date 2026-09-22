import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import type { Client } from '@/types';
import { Card, Button, Input, Badge, Modal, Field, EmptyState } from '@/components/ui';
import { money, uid, nowISO } from '@/lib/utils';
import { monthlyBalance, savingsRate } from '@/lib/finance';

export const ClientList: React.FC = () => {
  const { state, addClient } = useApp();
  const { navigate } = useRouter();
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);

  const filtered = state.clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.situation} ${c.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Clients</h1>
          <p className="text-forest-500 mt-1">{state.clients.length} client(s) au total.</p>
        </div>
        <Button icon="fa-user-plus" onClick={() => setModal(true)}>Nouveau client</Button>
      </div>

      <div className="relative">
        <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-forest-300" />
        <Input className="pl-9" placeholder="Rechercher un client…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {filtered.length ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const bal = monthlyBalance(c);
            const pending = c.followUps.filter((f) => f.status !== 'complete').length;
            return (
              <Card key={c.id} className="p-5 hover:shadow-lift transition">
                <button className="w-full text-left" onClick={() => navigate(`/conseiller/client/${c.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-full bg-forest-600 text-white flex items-center justify-center font-semibold">
                        {c.firstName[0]}{c.lastName[0]}
                      </span>
                      <div>
                        <p className="font-medium text-forest-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-forest-400">{c.situation}</p>
                      </div>
                    </div>
                    {c.isSelfEmployed && <Badge tone="gold">Autonome</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    <Metric label="Solde" value={money(bal)} tone={bal >= 0 ? 'text-forest-700' : 'text-rose-600'} />
                    <Metric label="Épargne" value={`${Math.round(savingsRate(c))} %`} />
                    <Metric label="Objectifs" value={String(c.goals.length)} />
                  </div>
                  {pending > 0 && (
                    <div className="mt-3">
                      <Badge tone="amber"><i className="fas fa-bell" /> {pending} relance(s)</Badge>
                    </div>
                  )}
                </button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6"><EmptyState icon="fa-users" title="Aucun client trouvé" /></Card>
      )}

      <AddClientModal
        open={modal}
        onClose={() => setModal(false)}
        onAdd={(c) => { addClient(c); navigate(`/conseiller/client/${c.id}`); }}
      />
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; tone?: string }> = ({ label, value, tone = 'text-forest-700' }) => (
  <div>
    <p className="text-xs text-forest-400">{label}</p>
    <p className={`font-semibold ${tone}`}>{value}</p>
  </div>
);

const AddClientModal: React.FC<{ open: boolean; onClose: () => void; onAdd: (c: Client) => void }> = ({ open, onClose, onAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [situation, setSituation] = useState('');
  const [selfEmp, setSelfEmp] = useState(false);

  const submit = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    onAdd({
      id: uid('cl'),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      situation: situation.trim(),
      isSelfEmployed: selfEmp,
      createdAt: nowISO(),
      incomes: [], budget: [], goals: [], insurance: [], checkIns: [], followUps: [], advisorNotes: [],
    });
    setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setSituation(''); setSelfEmp(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouveau client"
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={submit}>Créer</Button></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
          <Field label="Nom"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
        </div>
        <Field label="Courriel"><Input value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Téléphone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="Situation (contexte général)" hint="Aucune donnée sensible.">
          <Input value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="Ex : Salarié, couple, 1 enfant" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-forest-700">
          <input type="checkbox" checked={selfEmp} onChange={(e) => setSelfEmp(e.target.checked)} />
          Travailleur autonome
        </label>
      </div>
    </Modal>
  );
};
