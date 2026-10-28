import React, { useState, useRef } from 'react';
import type { BudgetItem } from '@/types';
import { Modal, Button, Field, Input, Select } from './ui';
import { uid } from '@/lib/utils';

const CATEGORIES = [
  'Logement', 'Alimentation', 'Transport', 'Services', 'Famille', 'Santé',
  'Loisirs', 'Épargne', 'Dettes', 'Discrétionnaire', 'Autre',
];

// Numérisation de facture : capture photo (caméra mobile) ou fichier,
// puis saisie du montant pour créer une dépense.
// (La lecture automatique du montant — OCR — pourra être ajoutée plus tard.)
export const ScanInvoice: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (b: BudgetItem) => void;
}> = ({ open, onClose, onAdd }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [essential, setEssential] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setLabel(''); setAmount(''); setCategory(CATEGORIES[0]); setEssential(true);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(f));
    }
  };

  const submit = () => {
    if (!amount) return;
    onAdd({
      id: uid('bd'),
      label: label.trim() || 'Facture numérisée',
      category,
      amount: Number(amount),
      essential,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title="Numériser une facture"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
          <Button variant="gold" icon="fa-plus" onClick={submit} disabled={!amount}>Ajouter la dépense</Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Zone de capture */}
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-paper-300 hover:border-forest-400 transition p-6 text-center bg-paper-50"
        >
          {preview ? (
            <img src={preview} alt="Aperçu de la facture" className="max-h-56 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="text-forest-500">
              <i className="fas fa-camera text-2xl text-forest-400" />
              <p className="mt-2 font-medium text-forest-700">Prendre une photo de la facture</p>
              <p className="text-xs text-forest-400 mt-1">ou choisir une image</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        </div>
        {preview && (
          <button onClick={() => fileRef.current?.click()} className="text-sm text-forest-600 hover:text-forest-800">
            <i className="fas fa-rotate mr-1" /> Reprendre la photo
          </button>
        )}

        <p className="text-xs text-forest-400">
          <i className="fas fa-circle-info mr-1" /> Inscrivez le montant de la facture ci-dessous. La lecture
          automatique du montant pourra être ajoutée plus tard.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Montant ($)"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" autoFocus /></Field>
          <Field label="Catégorie">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Description (commerçant)"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : Épicerie Metro" /></Field>
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
