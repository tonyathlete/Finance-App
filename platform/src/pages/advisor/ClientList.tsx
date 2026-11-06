import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import type { Client } from '@/types';
import { Card, Button, Input, Badge, Modal, Field, EmptyState, PageHeader } from '@/components/ui';
import { money, uid, nowISO } from '@/lib/utils';
import { monthlyBalance, savingsRate } from '@/lib/finance';

export const ClientList: React.FC = () => {
  const { state, addClient, updateClient, removeClient } = useApp();
  const { navigate } = useRouter();
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);

  const matches = (c: Client) =>
    `${c.firstName} ${c.lastName} ${c.situation} ${c.email}`.toLowerCase().includes(q.toLowerCase());

  const active = state.clients.filter((c) => !c.archived && matches(c));
  const archived = state.clients.filter((c) => c.archived && matches(c));

  const archive = (c: Client) => updateClient(c.id, (cl) => ({ ...cl, archived: true }));
  const reactivate = (c: Client) => updateClient(c.id, (cl) => ({ ...cl, archived: false }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Espace conseiller"
        title="Clients"
        subtitle={`${active.length} client(s) actif(s)${archived.length ? ` · ${archived.length} archivé(s)` : ''}.`}
        icon="fa-users"
        action={<Button variant="gold" icon="fa-user-plus" onClick={() => setModal(true)}>Nouveau client</Button>}
      />

      <div className="relative">
        <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-forest-300" />
        <Input className="pl-9" placeholder="Rechercher un client…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {active.length ? (
        <div className="grid sm:grid-cols-2 gap-4 stagger">
          {active.map((c) => {
            const bal = monthlyBalance(c);
            const pending = c.followUps.filter((f) => f.status !== 'complete').length;
            return (
              <Card key={c.id} className="p-5 card-hover hover:shadow-lift relative">
                <button
                  onClick={(e) => { e.stopPropagation(); archive(c); }}
                  title="Archiver (client inactif)"
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg text-forest-300 hover:text-forest-700 hover:bg-paper-100 flex items-center justify-center"
                >
                  <i className="fas fa-box-archive" />
                </button>
                <button className="w-full text-left" onClick={() => navigate(`/conseiller/client/${c.id}`)}>
                  <div className="flex items-center gap-3 pr-8">
                    <span className="w-11 h-11 rounded-full bg-forest-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                      {c.firstName[0]}{c.lastName[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-forest-900">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-forest-400 truncate">{c.situation}</p>
                    </div>
                    {c.isSelfEmployed && <Badge tone="gold" className="ml-auto flex-shrink-0">Autonome</Badge>}
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
        <Card className="p-6"><EmptyState icon="fa-users" title={q ? 'Aucun client trouvé' : 'Aucun client actif'} /></Card>
      )}

      {/* Clients archivés */}
      {archived.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-forest-500 hover:text-forest-700"
          >
            <i className={`fas fa-chevron-${showArchived ? 'down' : 'right'}`} />
            Clients archivés ({archived.length})
          </button>
          {showArchived && (
            <div className="mt-3 space-y-2">
              {archived.map((c) => (
                <Card key={c.id} className="p-4 flex items-center justify-between gap-3 bg-paper-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-forest-200 text-forest-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {c.firstName[0]}{c.lastName[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-forest-700 truncate">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-forest-400 truncate">{c.situation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" icon="fa-rotate-left" onClick={() => reactivate(c)}>Réactiver</Button>
                    <Button size="sm" variant="danger" icon="fa-trash-can" onClick={() => setConfirmDelete(c)}>Supprimer</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <AddClientModal
        open={modal}
        onClose={() => setModal(false)}
        onAdd={(c) => { addClient(c); navigate(`/conseiller/client/${c.id}`); }}
      />

      {/* Confirmation de suppression définitive */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Supprimer définitivement ?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Annuler</Button>
            <Button variant="danger" icon="fa-trash-can" onClick={() => { if (confirmDelete) removeClient(confirmDelete.id); setConfirmDelete(null); }}>
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-forest-600">
          Toutes les données de <strong>{confirmDelete?.firstName} {confirmDelete?.lastName}</strong>
          {' '}(budget, objectifs, références, etc.) seront <strong>supprimées définitivement</strong>.
          Cette action est irréversible.
        </p>
      </Modal>
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
      id: (crypto.randomUUID?.() ?? uid('cl')),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      situation: situation.trim(),
      isSelfEmployed: selfEmp,
      createdAt: nowISO(),
      incomes: [], budget: [], goals: [], insurance: [], checkIns: [], followUps: [], advisorNotes: [],
      debts: [], assets: [], referrals: [],
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
