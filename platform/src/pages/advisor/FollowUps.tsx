import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/lib/router';
import type { Client, FollowUp, FollowUpStatus } from '@/types';
import { Card, Button, Badge, SectionTitle, EmptyState } from '@/components/ui';
import { formatDate, daysUntil } from '@/lib/utils';
import { followUpStatusLabel } from '@/lib/labels';

type Filter = 'actifs' | 'en_retard' | 'complete' | 'tous';

export const FollowUps: React.FC = () => {
  const { state, updateClient } = useApp();
  const { navigate } = useRouter();
  const [filter, setFilter] = useState<Filter>('actifs');

  const all: Array<FollowUp & { client: Client }> = state.clients
    .flatMap((c) => c.followUps.map((f) => ({ ...f, client: c })))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const filtered = all.filter((f) => {
    const overdue = f.status !== 'complete' && daysUntil(f.dueDate) < 0;
    if (filter === 'tous') return true;
    if (filter === 'complete') return f.status === 'complete';
    if (filter === 'en_retard') return overdue;
    return f.status !== 'complete'; // actifs
  });

  const setStatus = (client: Client, id: string, status: FollowUpStatus) =>
    updateClient(client.id, (cl) => ({
      ...cl,
      followUps: cl.followUps.map((f) => (f.id === id ? { ...f, status } : f)),
    }));

  const filters: { id: Filter; label: string }[] = [
    { id: 'actifs', label: 'Actifs' },
    { id: 'en_retard', label: 'En retard' },
    { id: 'complete', label: 'Complétés' },
    { id: 'tous', label: 'Tous' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Suivis & relances</h1>
        <p className="text-forest-500 mt-1">Toutes vos relances clients au même endroit.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f.id ? 'bg-forest-600 text-white' : 'bg-white border border-paper-200 text-forest-600 hover:bg-forest-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-2">
          {filtered.map((f) => {
            const overdue = f.status !== 'complete' && daysUntil(f.dueDate) < 0;
            return (
              <Card key={f.id} className="p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => setStatus(f.client, f.id, f.status === 'complete' ? 'a_faire' : 'complete')} className="mt-0.5">
                    <i className={`fas ${f.status === 'complete' ? 'fa-circle-check text-forest-500' : 'fa-circle text-forest-300'} text-lg`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${f.status === 'complete' ? 'line-through text-forest-400' : 'text-forest-900'}`}>{f.title}</p>
                    <button onClick={() => navigate(`/conseiller/client/${f.client.id}`)} className="text-sm text-forest-500 hover:text-forest-700">
                      {f.client.firstName} {f.client.lastName}
                    </button>
                    {f.note && <p className="text-sm text-forest-400 mt-0.5">{f.note}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge tone={overdue ? 'rose' : f.status === 'complete' ? 'green' : 'gold'}>
                      {overdue ? 'En retard' : followUpStatusLabel[f.status]}
                    </Badge>
                    <p className="text-xs text-forest-400 mt-1">{formatDate(f.dueDate)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6"><EmptyState icon="fa-mug-hot" title="Rien à afficher ici" hint="Aucune relance pour ce filtre." /></Card>
      )}
    </div>
  );
};
