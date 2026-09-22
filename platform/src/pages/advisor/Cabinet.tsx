import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, SectionTitle, Field, Input } from '@/components/ui';
import { Disclaimer } from '@/components/Compliance';

export const Cabinet: React.FC = () => {
  const { state, updateAdvisor, resetDemo } = useApp();
  const a = state.advisor;
  const [form, setForm] = useState(a);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateAdvisor(() => form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Mon cabinet</h1>
        <p className="text-forest-500 mt-1">
          Vos informations professionnelles — affichées aux clients (identification AMF).
        </p>
      </div>

      <Card className="p-6">
        <SectionTitle icon="fa-id-card" title="Identité professionnelle" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom complet"><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Titre"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Cabinet"><Input value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} /></Field>
          <Field label="Numéro de certificat AMF" hint="Obligatoire pour l'identification du conseiller.">
            <Input value={form.amfNumber} onChange={(e) => setForm({ ...form, amfNumber: e.target.value })} />
          </Field>
          <Field label="Courriel"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Téléphone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button icon="fa-floppy-disk" onClick={save}>Enregistrer</Button>
          {saved && <span className="text-sm text-forest-500"><i className="fas fa-check mr-1" />Enregistré</span>}
        </div>
      </Card>

      <Disclaimer />

      <Card className="p-6 border-rose-200">
        <SectionTitle icon="fa-triangle-exclamation" title="Zone de réinitialisation" />
        <p className="text-sm text-forest-500 mb-4">
          Réinitialise toutes les données locales (clients de démo compris) à leur état initial.
          Utile pour repartir à neuf pendant qu'on construit la plateforme.
        </p>
        <Button
          variant="danger"
          icon="fa-rotate-left"
          onClick={() => {
            if (confirm('Réinitialiser toutes les données de démonstration ?')) resetDemo();
          }}
        >
          Réinitialiser la démo
        </Button>
      </Card>
    </div>
  );
};
