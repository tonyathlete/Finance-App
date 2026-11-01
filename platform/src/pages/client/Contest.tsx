import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Referral, Client } from '@/types';
import { Card, Button, SectionTitle, Field, Input, EmptyState, Badge, PageHeader, ProgressBar } from '@/components/ui';
import { uid, nowISO, formatDate } from '@/lib/utils';
import {
  CONTEST, drawDate, countdownTo, contestOdds, currentTier, nextTier,
} from '@/lib/contest';

export const Contest: React.FC = () => {
  const { currentClient, updateClient } = useApp();
  const [now, setNow] = useState(() => new Date());
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [justAdded, setJustAdded] = useState(false);

  // Décompte en direct
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!currentClient) return null;
  const c = currentClient;
  const referrals = c.referrals ?? [];
  const mutate = (fn: (c: Client) => Client) => updateClient(c.id, fn);

  const target = drawDate(now);
  const cd = countdownTo(target, now);
  const odds = contestOdds(referrals);
  const tier = currentTier(odds.entries);
  const next = nextTier(odds.entries);

  const canSubmit = form.firstName.trim() && form.lastName.trim() && (form.email.trim() || form.phone.trim());

  const addReferral = () => {
    if (!canSubmit) return;
    const r: Referral = {
      id: uid('re'),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      createdAt: nowISO(),
    };
    mutate((cl) => ({ ...cl, referrals: [r, ...(cl.referrals ?? [])] }));
    setForm({ firstName: '', lastName: '', email: '', phone: '' });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const removeReferral = (id: string) =>
    mutate((cl) => ({ ...cl, referrals: (cl.referrals ?? []).filter((r) => r.id !== id) }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Concours exclusif"
        title="Référez, courez la chance de gagner"
        subtitle={`Chaque référence = 1 participation au tirage de ${CONTEST.prizeLabel}.`}
        icon="fa-gift"
      />

      {/* Prix + décompte */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 text-paper-50 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gold-400/15 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Grand prix</p>
              <p className="font-display text-5xl font-semibold mt-1 text-gold-300">2 000 $</p>
              <p className="text-forest-100/80 mt-1">en cartes-cadeaux · tirage annuel</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300 mb-2">Tirage dans</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['Jours', cd.days], ['Hres', cd.hours], ['Min', cd.minutes], ['Sec', cd.seconds]].map(([l, v]) => (
                  <div key={l as string} className="bg-white/10 rounded-xl py-3">
                    <p className="font-sans text-2xl font-bold tabular-nums">{String(v).padStart(2, '0')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-forest-100/70">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-forest-100/70 mt-2">Tirage le {formatDate(target.toISOString())}.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Vos chances */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 card-hover">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Vos participations</p>
          <p className="mt-1 text-4xl font-bold text-forest-900 tabular-nums">{odds.entries}</p>
          <p className="text-sm text-forest-500 mt-1">1 référence = 1 participation</p>
        </Card>

        <Card className="p-5 card-hover">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Vos chances</p>
          {odds.entries === 0 ? (
            <p className="mt-2 text-sm text-forest-600">Ajoutez une première référence pour entrer dans le tirage !</p>
          ) : odds.percentMore >= 0 ? (
            <>
              <p className="mt-1 text-4xl font-bold text-gold-600 tabular-nums">{odds.multiplier.toFixed(1)}×</p>
              <p className="text-sm text-forest-600 mt-1">
                <span className="font-semibold text-gold-700">+{odds.percentMore} %</span> de chances vs la moyenne
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-forest-600">
              La moyenne est de {CONTEST.avgReferrals} références. Encore un effort pour dépasser la moyenne !
            </p>
          )}
        </Card>

        <Card className="p-5 card-hover">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Votre statut</p>
          {tier ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                <i className={`fas ${tier.icon} text-lg`} />
              </span>
              <p className="font-display text-xl font-semibold text-forest-900">{tier.label}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-forest-600">Pas encore participant</p>
          )}
          {next && (
            <p className="text-xs text-forest-400 mt-2">
              Encore {next.threshold - odds.entries} pour « {next.label} »
            </p>
          )}
        </Card>
      </div>

      {/* Progression vers palier suivant */}
      {next && (
        <Card className="p-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-forest-600 font-medium">
              Prochain palier : <span className="text-gold-700">{next.label}</span>
            </span>
            <span className="text-forest-500">{odds.entries} / {next.threshold} références</span>
          </div>
          <ProgressBar value={(odds.entries / next.threshold) * 100} tone="gold" />
          <p className="text-sm text-forest-500 mt-3">
            <i className="fas fa-bolt text-gold-500 mr-1" />
            La plupart des gens donnent {CONTEST.avgReferrals} références. En atteignant {CONTEST.superReferrerAt},
            vous multipliez vos chances par {(CONTEST.superReferrerAt / CONTEST.avgReferrals).toFixed(0)} !
          </p>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <Card className="p-6">
          <SectionTitle icon="fa-user-plus" title="Référer quelqu'un" subtitle="Un proche qui gagnerait à être bien accompagné ?" />
          {justAdded && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl p-3 animate-fadeIn">
              <i className="fas fa-circle-check mr-1" /> Merci ! Votre participation est enregistrée. 🎉
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom"><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
              <Field label="Nom"><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            </div>
            <Field label="Courriel"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="optionnel si téléphone fourni" /></Field>
            <Field label="Téléphone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="optionnel si courriel fourni" /></Field>
            <Button variant="gold" icon="fa-gift" className="w-full" onClick={addReferral} disabled={!canSubmit}>
              Ajouter ma référence (+1 participation)
            </Button>
            <p className="text-xs text-forest-400">
              En soumettant, vous confirmez avoir obtenu l'accord de la personne à être contactée.
            </p>
          </div>
        </Card>

        {/* Références données */}
        <Card className="p-6">
          <SectionTitle icon="fa-list" title="Vos références jusqu'à présent" subtitle={`${referrals.length} au total`} />
          {referrals.length ? (
            <ul className="divide-y divide-paper-100 max-h-80 overflow-y-auto">
              {referrals.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-forest-900">{r.firstName} {r.lastName}</p>
                    <p className="text-xs text-forest-400 truncate">{r.email || r.phone} · {formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge tone="gold"><i className="fas fa-ticket" /> 1 part.</Badge>
                    <button onClick={() => removeReferral(r.id)} className="text-forest-300 hover:text-rose-500"><i className="fas fa-trash-can" /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="fa-ticket" title="Aucune référence encore" hint="Votre première référence vous inscrit au tirage." />
          )}
        </Card>
      </div>

      {/* Règlements / conformité */}
      <Card className="p-4 bg-paper-50 border-paper-300">
        <p className="text-xs text-forest-500 leading-relaxed">
          <i className="fas fa-scale-balanced text-gold-500 mr-1" />
          <strong>Règlements du concours :</strong> aucun achat requis. 1 référence valide = 1 participation.
          Tirage le {formatDate(target.toISOString())}. Le prix ({CONTEST.prizeLabel}) n'est lié à aucune
          souscription de produit financier. Les personnes référées ne sont contactées qu'avec leur accord
          (Loi 25). Les règlements complets et les modalités d'admissibilité seront fournis par votre conseiller.
        </p>
      </Card>
    </div>
  );
};
