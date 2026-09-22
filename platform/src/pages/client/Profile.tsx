import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Client } from '@/types';
import { Card, Button, SectionTitle, Field, Input, Badge } from '@/components/ui';
import { PrivacyNote, AdvisorIdentity } from '@/components/Compliance';
import { formatDate, nowISO } from '@/lib/utils';

export const Profile: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  if (!currentClient) return null;
  const c = currentClient;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    situation: c.situation,
  });

  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const save = () => {
    mutate((cl) => ({ ...cl, ...form }));
    setEdit(false);
  };

  const giveConsent = () => mutate((cl) => ({ ...cl, consentGivenAt: nowISO() }));
  const revokeConsent = () => mutate((cl) => ({ ...cl, consentGivenAt: undefined }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Mon profil</h1>
        <p className="text-forest-500 mt-1">Vos informations de base — le minimum nécessaire.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <SectionTitle
            icon="fa-user"
            title="Coordonnées"
            action={
              edit ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEdit(false)}>Annuler</Button>
                  <Button size="sm" onClick={save}>Enregistrer</Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" icon="fa-pen" onClick={() => setEdit(true)}>Modifier</Button>
              )
            }
          />
          {edit ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Prénom"><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field label="Nom"><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
              </div>
              <Field label="Courriel"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Téléphone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
              <Field label="Situation (contexte général)" hint="Ex : Travailleur autonome, 2 enfants. Pas de données sensibles.">
                <Input value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })} />
              </Field>
            </div>
          ) : (
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <Row label="Nom complet" value={`${c.firstName} ${c.lastName}`} />
              <Row label="Courriel" value={c.email} />
              <Row label="Téléphone" value={c.phone} />
              <Row label="Situation" value={c.situation} />
              <Row label="Client depuis" value={formatDate(c.createdAt)} />
            </dl>
          )}
        </Card>

        <AdvisorIdentity />
      </div>

      {/* Consentement Loi 25 */}
      <Card className="p-6">
        <SectionTitle icon="fa-file-signature" title="Consentement et confidentialité" />
        <div className="space-y-4">
          <PrivacyNote />
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-paper-50 border border-paper-200">
            <div>
              <p className="text-sm font-medium text-forest-800">Consentement à la collecte de données</p>
              {c.consentGivenAt ? (
                <Badge tone="green" className="mt-1">
                  <i className="fas fa-circle-check" /> Accordé le {formatDate(c.consentGivenAt)}
                </Badge>
              ) : (
                <Badge tone="amber" className="mt-1">
                  <i className="fas fa-triangle-exclamation" /> Non accordé
                </Badge>
              )}
            </div>
            {c.consentGivenAt ? (
              <Button variant="danger" size="sm" onClick={revokeConsent}>Retirer mon consentement</Button>
            ) : (
              <Button size="sm" onClick={giveConsent}>Je consens</Button>
            )}
          </div>
          <p className="text-xs text-forest-400">
            Conformément à la Loi 25, vous pouvez consulter, corriger ou demander la suppression
            de vos données en tout temps. Le retrait du consentement met fin à la collecte.
          </p>
        </div>
      </Card>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-xs text-forest-400 uppercase tracking-wide">{label}</dt>
    <dd className="text-forest-900 mt-0.5">{value}</dd>
  </div>
);
