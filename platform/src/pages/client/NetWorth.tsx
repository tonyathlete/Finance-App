import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { AssetItem, AssetKind, Client } from '@/types';
import {
  Card, Stat, Button, SectionTitle, Modal, Field, Input, Select, EmptyState, Badge, PageHeader,
} from '@/components/ui';
import { Disclaimer } from '@/components/Compliance';
import { money, uid } from '@/lib/utils';
import { totalAssets, totalLiabilities, netWorth } from '@/lib/finance';

const KIND_LABEL: Record<AssetKind, string> = {
  liquide: 'Liquidités',
  placement: 'Placements',
  immobilier: 'Immobilier',
  autre: 'Autre',
};
const KIND_ICON: Record<AssetKind, string> = {
  liquide: 'fa-money-bill-wave',
  placement: 'fa-chart-line',
  immobilier: 'fa-house',
  autre: 'fa-box',
};
const KINDS: AssetKind[] = ['liquide', 'placement', 'immobilier', 'autre'];

export const NetWorth: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AssetItem | null>(null);

  if (!currentClient) return null;
  const c = currentClient;
  const assets = c.assets ?? [];
  const debts = c.debts ?? [];
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const aTotal = totalAssets(c);
  const lTotal = totalLiabilities(c);
  const nw = netWorth(c);
  const ratio = aTotal + lTotal > 0 ? (aTotal / (aTotal + lTotal)) * 100 : 50;

  const save = (a: AssetItem) =>
    mutate((cl) => ({
      ...cl,
      assets: (cl.assets ?? []).some((x) => x.id === a.id)
        ? (cl.assets ?? []).map((x) => (x.id === a.id ? a : x))
        : [...(cl.assets ?? []), a],
    }));
  const remove = (id: string) =>
    mutate((cl) => ({ ...cl, assets: (cl.assets ?? []).filter((a) => a.id !== id) }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title="Ma valeur nette"
        subtitle="Ce que vous possédez, moins ce que vous devez. Le vrai portrait de votre situation."
        icon="fa-scale-balanced"
        action={<Button variant="gold" icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Ajouter un actif</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger">
        <Stat label="Actifs" value={money(aTotal)} icon="fa-arrow-trend-up" tone="emerald" />
        <Stat label="Passifs (dettes)" value={money(lTotal)} icon="fa-arrow-trend-down" tone="rose" />
        <Stat label="Valeur nette" value={money(nw)} icon="fa-gem" tone={nw >= 0 ? 'forest' : 'rose'} />
      </div>

      {/* Barre actifs vs passifs */}
      <Card className="p-6">
        <SectionTitle icon="fa-balance-scale" title="Équilibre actifs / passifs" />
        <div className="h-8 rounded-xl overflow-hidden flex bg-paper-200">
          <div className="h-full bg-forest-500 flex items-center justify-start px-3" style={{ width: `${ratio}%` }}>
            {ratio > 20 && <span className="text-xs font-semibold text-white">Actifs</span>}
          </div>
          <div className="h-full bg-rose-400 flex items-center justify-end px-3" style={{ width: `${100 - ratio}%` }}>
            {100 - ratio > 20 && <span className="text-xs font-semibold text-white">Passifs</span>}
          </div>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-forest-600">{money(aTotal)}</span>
          <span className="text-rose-500">{money(lTotal)}</span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Actifs */}
        <Card className="p-6">
          <SectionTitle icon="fa-sack-dollar" title="Actifs" action={<Button size="sm" icon="fa-plus" onClick={() => { setEditing(null); setModal(true); }}>Ajouter</Button>} />
          <ul className="divide-y divide-paper-100">
            {assets.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 group">
                <button className="flex items-center gap-3 text-left flex-1" onClick={() => { setEditing(a); setModal(true); }}>
                  <span className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center"><i className={`fas ${KIND_ICON[a.kind]}`} /></span>
                  <span>
                    <span className="block font-medium text-forest-900 group-hover:text-forest-600">{a.label}</span>
                    <Badge tone="gray">{KIND_LABEL[a.kind]}</Badge>
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-forest-900 tabular-nums">{money(a.amount)}</span>
                  <button onClick={() => remove(a.id)} className="text-forest-300 hover:text-rose-500"><i className="fas fa-trash-can" /></button>
                </div>
              </li>
            ))}
            {!assets.length && <EmptyState icon="fa-sack-dollar" title="Aucun actif" />}
          </ul>
        </Card>

        {/* Passifs (dettes, lecture seule ici) */}
        <Card className="p-6">
          <SectionTitle icon="fa-file-invoice-dollar" title="Passifs (dettes)" />
          <ul className="divide-y divide-paper-100">
            {debts.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-forest-900">{d.label}</p>
                  <Badge tone={d.apr >= 15 ? 'rose' : 'gray'}>{d.apr}% TAP</Badge>
                </div>
                <span className="font-semibold text-rose-600 tabular-nums">{money(d.balance)}</span>
              </li>
            ))}
            {!debts.length && <EmptyState icon="fa-face-smile" title="Aucune dette" hint="Excellent !" />}
          </ul>
          <p className="text-xs text-forest-400 mt-3"><i className="fas fa-circle-info mr-1" /> Gérez vos dettes dans « Plan de remboursement ».</p>
        </Card>
      </div>

      <Disclaimer />

      <AssetModal open={modal} onClose={() => setModal(false)} initial={editing} onSave={save} />
    </div>
  );
};

const AssetModal: React.FC<{ open: boolean; onClose: () => void; initial: AssetItem | null; onSave: (a: AssetItem) => void }> = ({ open, onClose, initial, onSave }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [kind, setKind] = useState<AssetKind>('liquide');

  React.useEffect(() => {
    if (open) {
      setLabel(initial?.label ?? '');
      setAmount(initial ? String(initial.amount) : '');
      setKind(initial?.kind ?? 'liquide');
    }
  }, [open, initial]);

  const submit = () => {
    if (!label.trim() || !amount) return;
    onSave({ id: initial?.id ?? uid('ac'), label: label.trim(), amount: Number(amount), kind });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier l'actif" : 'Ajouter un actif'}
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={submit}>{initial ? 'Enregistrer' : 'Ajouter'}</Button></>}
    >
      <div className="space-y-4">
        <Field label="Description"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Compte épargne, CELI, maison…" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Valeur ($)"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></Field>
          <Field label="Type">
            <Select value={kind} onChange={(e) => setKind(e.target.value as AssetKind)}>
              {KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
            </Select>
          </Field>
        </div>
      </div>
    </Modal>
  );
};
