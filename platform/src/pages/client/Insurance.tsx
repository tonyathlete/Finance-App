import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { InsurancePolicy, InsuranceType, Client } from '@/types';
import { Card, Button, SectionTitle, Modal, Field, Input, Select, Textarea, Badge, EmptyState, Stat } from '@/components/ui';
import { insuranceTypeIcon, insuranceTypeLabel } from '@/lib/labels';
import { money, uid, formatDate, daysUntil } from '@/lib/utils';

const TYPES: InsuranceType[] = ['vie', 'invalidite', 'maladies_graves', 'hypothecaire', 'auto', 'habitation', 'sante', 'autre'];

export const Insurance: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [modal, setModal] = useState(false);
  if (!currentClient) return null;
  const c = currentClient;
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const totalPremium = c.insurance.reduce((s, i) => s + (i.monthlyPremium || 0), 0);
  const totalCoverage = c.insurance
    .filter((i) => i.type === 'vie')
    .reduce((s, i) => s + (i.coverageAmount || 0), 0);

  const remove = (id: string) =>
    mutate((cl) => ({ ...cl, insurance: cl.insurance.filter((i) => i.id !== id) }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Mes assurances</h1>
          <p className="text-forest-500 mt-1">Un récapitulatif clair de vos protections.</p>
        </div>
        <Button icon="fa-plus" onClick={() => setModal(true)}>Ajouter</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Protections" value={String(c.insurance.length)} icon="fa-shield-halved" />
        <Stat label="Primes / mois" value={money(totalPremium)} icon="fa-money-bill-wave" tone="gold" />
        <Stat label="Capital vie total" value={money(totalCoverage)} icon="fa-heart-pulse" tone="emerald" />
      </div>

      {/* Note de confidentialité importante */}
      <Card className="p-4 bg-forest-50 border-forest-100">
        <p className="text-sm text-forest-700 leading-relaxed">
          <i className="fas fa-shield mr-1 text-forest-500" />
          Pour votre sécurité, on n'inscrit ici qu'un <strong>résumé</strong> : type de
          protection, assureur, capital et prime. Aucun numéro de police, bénéficiaire nommé
          ou renseignement médical n'est conservé.
        </p>
      </Card>

      {c.insurance.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {c.insurance.map((p) => {
            const days = p.renewalDate ? daysUntil(p.renewalDate) : Infinity;
            const soon = days <= 60;
            return (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-forest-600 text-white flex items-center justify-center">
                      <i className={`fas ${insuranceTypeIcon[p.type]}`} />
                    </span>
                    <div>
                      <p className="font-medium text-forest-900">{insuranceTypeLabel[p.type]}</p>
                      <p className="text-sm text-forest-400">{p.insurer}</p>
                    </div>
                  </div>
                  <button onClick={() => remove(p.id)} className="text-forest-300 hover:text-rose-500">
                    <i className="fas fa-trash-can" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  {typeof p.coverageAmount === 'number' && (
                    <div>
                      <p className="text-xs text-forest-400">Capital / prestation</p>
                      <p className="font-semibold text-forest-900">{money(p.coverageAmount)}</p>
                    </div>
                  )}
                  {typeof p.monthlyPremium === 'number' && (
                    <div>
                      <p className="text-xs text-forest-400">Prime mensuelle</p>
                      <p className="font-semibold text-forest-900">{money(p.monthlyPremium)}</p>
                    </div>
                  )}
                </div>
                {p.renewalDate && (
                  <div className="mt-3">
                    <Badge tone={soon ? 'amber' : 'gray'}>
                      <i className="fas fa-calendar-day" /> Renouvellement : {formatDate(p.renewalDate)}
                    </Badge>
                  </div>
                )}
                {p.note && <p className="mt-3 text-sm text-forest-500 italic">« {p.note} »</p>}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6">
          <EmptyState icon="fa-shield-halved" title="Aucune protection enregistrée" action={<Button icon="fa-plus" onClick={() => setModal(true)}>Ajouter</Button>} />
        </Card>
      )}

      <InsuranceModal open={modal} onClose={() => setModal(false)} onAdd={(p) => mutate((cl) => ({ ...cl, insurance: [...cl.insurance, p] }))} />
    </div>
  );
};

const InsuranceModal: React.FC<{ open: boolean; onClose: () => void; onAdd: (p: InsurancePolicy) => void }> = ({ open, onClose, onAdd }) => {
  const [type, setType] = useState<InsuranceType>('vie');
  const [insurer, setInsurer] = useState('');
  const [coverage, setCoverage] = useState('');
  const [premium, setPremium] = useState('');
  const [renewal, setRenewal] = useState('');
  const [note, setNote] = useState('');

  const submit = () => {
    if (!insurer.trim()) return;
    onAdd({
      id: uid('as'),
      type,
      insurer: insurer.trim(),
      coverageAmount: coverage ? Number(coverage) : undefined,
      monthlyPremium: premium ? Number(premium) : undefined,
      renewalDate: renewal ? new Date(renewal).toISOString() : undefined,
      note: note.trim(),
    });
    setType('vie'); setInsurer(''); setCoverage(''); setPremium(''); setRenewal(''); setNote('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter une protection"
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={submit}>Ajouter</Button></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as InsuranceType)}>
              {TYPES.map((t) => <option key={t} value={t}>{insuranceTypeLabel[t]}</option>)}
            </Select>
          </Field>
          <Field label="Assureur">
            <Input value={insurer} onChange={(e) => setInsurer(e.target.value)} placeholder="Nom de l'assureur" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capital / prestation ($)">
            <Input type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="Optionnel" />
          </Field>
          <Field label="Prime mensuelle ($)">
            <Input type="number" value={premium} onChange={(e) => setPremium(e.target.value)} placeholder="Optionnel" />
          </Field>
        </div>
        <Field label="Date de renouvellement">
          <Input type="date" value={renewal} onChange={(e) => setRenewal(e.target.value)} />
        </Field>
        <Field label="Note (optionnel)" hint="Ne pas inscrire de numéro de police ni de renseignement médical.">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
};
