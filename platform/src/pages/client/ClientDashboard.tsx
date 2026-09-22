import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import { Card, Stat, Button, ProgressBar, Badge, SectionTitle, EmptyState, PageHeader } from '@/components/ui';
import { IncomeExpenseBar } from '@/components/Charts';
import { AlertsPanel } from '@/components/Insights';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AdvisorIdentity, Disclaimer } from '@/components/Compliance';
import { goalTypeIcon, goalTypeLabel, moodEmoji } from '@/lib/labels';
import { money, monthsUntil, formatDateShort, mondayOf } from '@/lib/utils';
import {
  totalIncome,
  totalExpenses,
  monthlyBalance,
  savingsRate,
  goalProgress,
} from '@/lib/finance';

export const ClientDashboard: React.FC = () => {
  const { currentClient } = useApp();
  const { navigate } = useRouter();
  if (!currentClient) return null;
  const c = currentClient;

  const income = totalIncome(c.incomes);
  const expense = totalExpenses(c.budget);
  const balance = monthlyBalance(c);
  const rate = savingsRate(c);
  const lastCheckIn = [...c.checkIns].sort((a, b) => b.weekOf.localeCompare(a.weekOf))[0];
  const topGoals = [...c.goals].sort((a, b) => goalProgress(b) - goalProgress(a)).slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace client"
        title={`Bonjour, ${c.firstName} 👋`}
        subtitle="Voici votre portrait financier du mois."
        icon="fa-hand-holding-heart"
        action={
          <div className="flex gap-2 no-print">
            <Button variant="outline" icon="fa-file-arrow-down" onClick={() => window.print()} className="!bg-white/10 !border-white/20 !text-paper-50 hover:!bg-white/20">
              PDF
            </Button>
            <Button variant="gold" icon="fa-calendar-check" onClick={() => navigate('/client/checkin')}>
              Check-in
            </Button>
          </div>
        }
      />

      {/* Rappel de check-in */}
      {(!lastCheckIn || lastCheckIn.weekOf !== mondayOf()) && (
        <Card className="p-4 bg-gold-50 border-gold-200 no-print">
          <div className="flex items-center gap-3 flex-wrap">
            <i className="fas fa-bell text-gold-500" />
            <p className="text-sm text-forest-800 flex-1">
              <span className="font-semibold">C'est le moment de votre check-in hebdomadaire.</span>{' '}
              Un petit bilan de 2 minutes garde vos objectifs sur la bonne voie.
            </p>
            <Button size="sm" variant="gold" onClick={() => navigate('/client/checkin')}>Faire mon check-in</Button>
          </div>
        </Card>
      )}

      {/* Alertes */}
      <AlertsPanel client={c} />

      {/* Stats clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Stat label="Revenus / mois" value={<AnimatedNumber value={income} format={money} />} icon="fa-arrow-down" tone="emerald" />
        <Stat label="Dépenses / mois" value={<AnimatedNumber value={expense} format={money} />} icon="fa-arrow-up" tone="gold" />
        <Stat
          label="Solde mensuel"
          value={<AnimatedNumber value={balance} format={money} />}
          icon={balance >= 0 ? 'fa-piggy-bank' : 'fa-triangle-exclamation'}
          tone={balance >= 0 ? 'forest' : 'rose'}
          hint={balance >= 0 ? 'Disponible pour vos objectifs' : 'Dépenses supérieures aux revenus'}
        />
        <Stat
          label="Taux d'épargne"
          value={<AnimatedNumber value={rate} format={(n) => `${Math.round(n)} %`} />}
          icon="fa-seedling"
          tone={rate >= 10 ? 'forest' : 'rose'}
          hint="Cible générale : 10 % et +"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Flux mensuel */}
        <Card className="p-6">
          <SectionTitle
            icon="fa-wallet"
            title="Flux mensuel"
            action={<Button size="sm" variant="ghost" icon="fa-pen" onClick={() => navigate('/client/budget')}>Modifier</Button>}
          />
          <IncomeExpenseBar income={income} expense={expense} />
          <div className="mt-4 pt-4 border-t border-paper-100 flex items-center justify-between text-sm">
            <span className="text-forest-500">Ce qu'il vous reste chaque mois</span>
            <span className={`font-bold text-lg ${balance >= 0 ? 'text-forest-700' : 'text-rose-600'}`}>
              {money(balance)}
            </span>
          </div>
        </Card>

        {/* Check-in */}
        <Card className="p-6">
          <SectionTitle
            icon="fa-calendar-check"
            title="Check-in hebdomadaire"
            action={<Button size="sm" variant="gold" icon="fa-plus" onClick={() => navigate('/client/checkin')}>Nouveau</Button>}
          />
          {lastCheckIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodEmoji[lastCheckIn.mood]}</span>
                <div>
                  <p className="text-sm font-medium text-forest-900">
                    Semaine du {formatDateShort(lastCheckIn.weekOf)}
                  </p>
                  <p className="text-xs text-forest-400">Dernier suivi enregistré</p>
                </div>
              </div>
              {lastCheckIn.focusNextWeek && (
                <div className="bg-forest-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1">
                    Priorité de la semaine
                  </p>
                  <p className="text-sm text-forest-800">{lastCheckIn.focusNextWeek}</p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon="fa-calendar-plus"
              title="Aucun check-in encore"
              hint="Faites votre premier bilan de la semaine avec votre conseiller."
            />
          )}
        </Card>
      </div>

      {/* Objectifs */}
      <div>
        <SectionTitle
          icon="fa-bullseye"
          title="Vos objectifs"
          action={<Button size="sm" variant="ghost" icon="fa-arrow-right" onClick={() => navigate('/client/objectifs')}>Tout voir</Button>}
        />
        {topGoals.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {topGoals.map((g) => {
              const p = goalProgress(g);
              return (
                <Card key={g.id} className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center">
                      <i className={`fas ${goalTypeIcon[g.type]}`} />
                    </span>
                    <Badge tone="gold">{goalTypeLabel[g.type]}</Badge>
                  </div>
                  <p className="font-medium text-forest-900 line-clamp-2 min-h-[2.5rem]">{g.title}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-forest-500">{money(g.currentAmount)}</span>
                      <span className="text-forest-400">{money(g.targetAmount)}</span>
                    </div>
                    <ProgressBar value={p} tone="gold" />
                    <p className="text-xs text-forest-400 mt-2">
                      {Math.round(p)} % · {monthsUntil(g.targetDate)} mois restants
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <EmptyState
              icon="fa-bullseye"
              title="Pas encore d'objectif"
              hint="Fixez un premier objectif : voyage, fonds d'urgence, retraite…"
              action={<Button icon="fa-plus" onClick={() => navigate('/client/objectifs')}>Créer un objectif</Button>}
            />
          </Card>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Disclaimer />
        </div>
        <AdvisorIdentity />
      </div>
    </div>
  );
};
