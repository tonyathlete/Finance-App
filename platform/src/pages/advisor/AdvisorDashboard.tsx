import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { Card, Stat, SectionTitle, Badge, Button, EmptyState, PageHeader } from '@/components/ui';
import { money, formatDate, formatDateShort, daysUntil } from '@/lib/utils';
import { monthlyBalance, savingsRate } from '@/lib/finance';
import { moodEmoji, followUpStatusLabel } from '@/lib/labels';
import type { FollowUp, Client } from '@/types';

export const AdvisorDashboard: React.FC = () => {
  const { state } = useApp();
  const { navigate } = useRouter();
  const clients = state.clients;

  // Agrégats
  const totalClients = clients.length;
  const totalGoals = clients.reduce((s, c) => s + c.goals.length, 0);
  const atRisk = clients.filter((c) => monthlyBalance(c) < 0).length;

  // Relances à venir (toutes clients)
  const upcoming: Array<FollowUp & { client: Client }> = clients
    .flatMap((c) => c.followUps.map((f) => ({ ...f, client: c })))
    .filter((f) => f.status !== 'complete')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // Check-ins récents
  const recentCheckIns = clients
    .flatMap((c) => c.checkIns.map((ci) => ({ ...ci, client: c })))
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace conseiller"
        title={`Bonjour, ${state.advisor.fullName.split(' ')[0]}`}
        subtitle="Vue d'ensemble de vos clients et de vos suivis."
        icon="fa-chart-line"
        action={<Button variant="gold" icon="fa-user-plus" onClick={() => navigate('/conseiller/clients')}>Gérer les clients</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Clients actifs" value={String(totalClients)} icon="fa-users" />
        <Stat label="Objectifs en cours" value={String(totalGoals)} icon="fa-bullseye" tone="gold" />
        <Stat label="Relances à faire" value={String(upcoming.length)} icon="fa-bell" tone="gold" />
        <Stat label="Budgets déficitaires" value={String(atRisk)} icon="fa-triangle-exclamation" tone={atRisk ? 'rose' : 'forest'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Relances à venir */}
        <Card className="p-6">
          <SectionTitle
            icon="fa-bell"
            title="Prochaines relances"
            action={<Button size="sm" variant="ghost" icon="fa-arrow-right" onClick={() => navigate('/conseiller/suivis')}>Tout voir</Button>}
          />
          {upcoming.length ? (
            <ul className="space-y-2">
              {upcoming.slice(0, 5).map((f) => {
                const d = daysUntil(f.dueDate);
                const overdue = d < 0;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => navigate(`/conseiller/client/${f.client.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-paper-200 hover:border-forest-300 hover:bg-forest-50 transition text-left"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${overdue ? 'bg-rose-500' : 'bg-gold-400'}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-forest-900 truncate">{f.title}</span>
                        <span className="block text-xs text-forest-400">
                          {f.client.firstName} {f.client.lastName} · {formatDateShort(f.dueDate)}
                        </span>
                      </span>
                      <Badge tone={overdue ? 'rose' : 'gold'}>
                        {overdue ? 'En retard' : followUpStatusLabel[f.status]}
                      </Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon="fa-mug-hot" title="Aucune relance en attente" hint="Tout est à jour." />
          )}
        </Card>

        {/* Check-ins récents */}
        <Card className="p-6">
          <SectionTitle icon="fa-calendar-check" title="Check-ins récents" />
          {recentCheckIns.length ? (
            <ul className="space-y-2">
              {recentCheckIns.map((ci) => (
                <li key={ci.id}>
                  <button
                    onClick={() => navigate(`/conseiller/client/${ci.client.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-paper-200 hover:border-forest-300 hover:bg-forest-50 transition text-left"
                  >
                    <span className="text-xl">{moodEmoji[ci.mood]}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-forest-900 truncate">
                        {ci.client.firstName} {ci.client.lastName}
                      </span>
                      <span className="block text-xs text-forest-400 truncate">
                        {ci.focusNextWeek || ci.goalProgressNote || `Semaine du ${formatDate(ci.weekOf)}`}
                      </span>
                    </span>
                    <span className="text-xs text-forest-400">{formatDateShort(ci.weekOf)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="fa-calendar-check" title="Aucun check-in récent" />
          )}
        </Card>
      </div>

      {/* Aperçu clients */}
      <div>
        <SectionTitle
          icon="fa-users"
          title="Vos clients"
          action={<Button size="sm" variant="ghost" icon="fa-arrow-right" onClick={() => navigate('/conseiller/clients')}>Gérer</Button>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => {
            const bal = monthlyBalance(c);
            return (
              <Card key={c.id} className="p-5 cursor-pointer hover:shadow-lift transition" as="div">
                <button className="text-left w-full" onClick={() => navigate(`/conseiller/client/${c.id}`)}>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-semibold">
                      {c.firstName[0]}{c.lastName[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-forest-900 truncate">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-forest-400 truncate">{c.situation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div>
                      <p className="text-xs text-forest-400">Solde / mois</p>
                      <p className={`font-semibold ${bal >= 0 ? 'text-forest-700' : 'text-rose-600'}`}>{money(bal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-forest-400">Taux d'épargne</p>
                      <p className="font-semibold text-forest-700">{Math.round(savingsRate(c))} %</p>
                    </div>
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
