import React, { useState } from 'react';
import type { BudgetItem, IncomeItem } from '@/types';
import { Modal, Button, Field, Input, Select } from './ui';
import { uid } from '@/lib/utils';

export const BUDGET_CATEGORIES = [
  'Logement', 'Alimentation', 'Transport', 'Services', 'Famille', 'Santé',
  'Loisirs', 'Épargne', 'Dettes', 'Discrétionnaire', 'Autre',
];

export const IncomeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initial: IncomeItem | null;
  onSave: (i: IncomeItem) => void;
}> = ({ open, onClose, initial, onSave }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [variable, setVariable] = useState(false);

  React.useEffect(() => {
    if (open) {
      setLabel(initial?.label ?? '');
      setAmount(initial ? String(initial.amount) : '');
      setVariable(initial?.variable ?? false);
    }
  }, [open, initial]);

  const submit = () => {
    if (!label.trim() || !amount) return;
    onSave({ id: initial?.id ?? uid('in'), label: label.trim(), amount: Number(amount), variable });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier le revenu' : 'Ajouter un revenu'}
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={submit}>{initial ? 'Enregistrer' : 'Ajouter'}</Button></>}
    >
      <div className="space-y-4">
        <Field label="Source du revenu"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Salaire, contrats…" autoFocus /></Field>
        <Field label="Montant net mensuel ($)"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></Field>
        <label className="flex items-center gap-2 text-sm text-forest-700">
          <input type="checkbox" checked={variable} onChange={(e) => setVariable(e.target.checked)} />
          Revenu variable (travailleur autonome, commissions…)
        </label>
      </div>
    </Modal>
  );
};

export const ExpenseModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initial: BudgetItem | null;
  onSave: (b: BudgetItem) => void;
  categories?: string[];
}> = ({ open, onClose, initial, onSave, categories = BUDGET_CATEGORIES }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [essential, setEssential] = useState(true);

  React.useEffect(() => {
    if (open) {
      setLabel(initial?.label ?? '');
      setAmount(initial ? String(initial.amount) : '');
      setCategory(initial?.category ?? categories[0]);
      setEssential(initial?.essential ?? true);
    }
  }, [open, initial, categories]);

  const submit = () => {
    if (!label.trim() || !amount) return;
    onSave({ id: initial?.id ?? uid('bd'), label: label.trim(), amount: Number(amount), category, essential });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la dépense' : 'Ajouter une dépense'}
      footer={<><Button variant="outline" onClick={onClose}>Annuler</Button><Button variant="gold" onClick={submit}>{initial ? 'Enregistrer' : 'Ajouter'}</Button></>}
    >
      <div className="space-y-4">
        <Field label="Description"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Loyer, épicerie…" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Montant mensuel ($)"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></Field>
          <Field label="Catégorie">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Type de dépense">
          <div className="flex gap-2">
            <button onClick={() => setEssential(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${essential ? 'bg-forest-600 text-white border-forest-600' : 'border-paper-300 text-forest-600'}`}>Essentielle</button>
            <button onClick={() => setEssential(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${!essential ? 'bg-gold-400 text-forest-900 border-gold-400' : 'border-paper-300 text-forest-600'}`}>Discrétionnaire</button>
          </div>
        </Field>
      </div>
    </Modal>
  );
};
