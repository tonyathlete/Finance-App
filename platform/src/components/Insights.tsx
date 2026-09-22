import React from 'react';
import type { Client } from '@/types';
import { Card, SectionTitle } from './ui';
import { getAlerts, fiftyThirtyTwenty, type Rule503020 } from '@/lib/finance';
import { money } from '@/lib/utils';

// Panneau d'alertes intelligentes
export const AlertsPanel: React.FC<{ client: Client; title?: string }> = ({ client, title }) => {
  const alerts = getAlerts(client);
  if (!alerts.length) {
    return (
      <Card className="p-4 bg-emerald-50 border-emerald-100">
        <p className="text-sm text-emerald-800 flex items-center gap-2">
          <i className="fas fa-circle-check" /> Tout va bien — aucune alerte pour l'instant.
        </p>
      </Card>
    );
  }
  const tones = {
    rose: 'bg-rose-50 border-rose-100 text-rose-800',
    amber: 'bg-amber-50 border-amber-100 text-amber-900',
    forest: 'bg-forest-50 border-forest-100 text-forest-800',
  } as const;
  return (
    <div className="space-y-2">
      {title && <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{title}</p>}
      {alerts.map((a) => (
        <div key={a.id} className={`rounded-xl border p-3 flex gap-3 ${tones[a.tone]}`}>
          <i className={`fas ${a.icon} mt-0.5`} />
          <div>
            <p className="text-sm font-semibold">{a.title}</p>
            <p className="text-sm opacity-90">{a.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Règle 50/30/20
const RuleRow: React.FC<{
  label: string;
  value: number;
  pct: number;
  target: number;
  color: string;
  hint: string;
}> = ({ label, value, pct, target, color, hint }) => {
  const over = pct > target + 2;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-forest-800">{label}</span>
        <span className="text-sm tabular-nums text-forest-500">
          {money(value)} · <span className={over ? 'text-rose-600 font-semibold' : 'text-forest-700 font-semibold'}>{Math.round(pct)} %</span>
          <span className="text-forest-300"> / {target} %</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-paper-200 overflow-hidden relative">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
        {/* repère de la cible */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-forest-900/30" style={{ left: `${Math.min(100, target)}%` }} />
      </div>
      <p className="text-xs text-forest-400 mt-1">{hint}</p>
    </div>
  );
};

export const RulePanel: React.FC<{ client: Client }> = ({ client }) => {
  const r: Rule503020 = fiftyThirtyTwenty(client);
  return (
    <Card className="p-6">
      <SectionTitle
        icon="fa-scale-balanced"
        title="Règle 50 / 30 / 20"
        subtitle="Un cadre simple pour équilibrer votre budget"
      />
      {r.income > 0 ? (
        <div className="space-y-4">
          <RuleRow label="Besoins (essentiel)" value={r.needs} pct={r.needsPct} target={50} color="#2e5d45" hint="Logement, épicerie, transport, services…" />
          <RuleRow label="Envies (discrétionnaire)" value={r.wants} pct={r.wantsPct} target={30} color="#c8a24b" hint="Loisirs, sorties, magasinage…" />
          <RuleRow label="Épargne / dettes" value={r.savings} pct={r.savingsPct} target={20} color="#548b6c" hint="Ce qu'il reste pour vos objectifs et remboursements." />
          <p className="text-xs text-forest-400 pt-2 border-t border-paper-100">
            <i className="fas fa-circle-info mr-1" /> Le trait vertical indique la cible. Un cadre indicatif — à adapter à votre réalité.
          </p>
        </div>
      ) : (
        <p className="text-sm text-forest-400">Ajoutez vos revenus pour voir la répartition.</p>
      )}
    </Card>
  );
};
