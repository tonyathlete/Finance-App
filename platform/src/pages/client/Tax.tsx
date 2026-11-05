import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Stat, SectionTitle, Field, Input, PageHeader, Badge } from '@/components/ui';
import { Disclaimer } from '@/components/Compliance';
import { money } from '@/lib/utils';
import { totalIncome } from '@/lib/finance';
import { estimateTax, TAX_YEAR, TAX_PARAMS } from '@/lib/tax';

export const Tax: React.FC = () => {
  const { currentClient } = useApp();
  // Revenu net annuel estimé de départ (revenus mensuels × 12)
  const defaultNet = currentClient ? Math.round(totalIncome(currentClient.incomes) * 12) : 60000;
  const [income, setIncome] = useState<string>(String(defaultNet || 60000));
  const [open, setOpen] = useState<string | null>(null);

  const net = Number(income) || 0;
  const est = estimateTax(net);

  const parts = [
    { label: 'Impôt fédéral', value: est.federalTax, color: '#2a78d6' },
    { label: 'Impôt du Québec', value: est.quebecTax, color: '#1baf7a' },
    { label: 'RRQ', value: est.qpp, color: '#c4a052' },
    { label: 'RQAP', value: est.qpip, color: '#eb6834' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Travailleur autonome"
        title="Mes impôts & cotisations"
        subtitle="Estime ce que tu devras payer selon ton revenu, et combien mettre de côté."
        icon="fa-file-invoice-dollar"
      />

      {/* Entrée du revenu */}
      <Card className="p-6">
        <SectionTitle icon="fa-sliders" title="Ton revenu net estimé" subtitle="Revenu d'entreprise après tes dépenses, pour l'année" />
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
          <Field label="Revenu net annuel ($)">
            <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
          </Field>
          <div className="flex gap-2 pb-1">
            {[40000, 60000, 80000, 100000].map((v) => (
              <button key={v} onClick={() => setIncome(String(v))} className="px-3 py-2 rounded-xl text-sm border border-paper-300 text-forest-600 hover:bg-forest-50">
                {money(v)}
              </button>
            ))}
          </div>
        </div>
        <input
          type="range" min={0} max={200000} step={1000} value={Math.min(200000, net)}
          onChange={(e) => setIncome(e.target.value)}
          className="w-full accent-forest-600 mt-4"
        />
      </Card>

      {/* Résultat principal : à mettre de côté */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 text-paper-50 p-6 sm:p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">À prévoir au total</p>
              <p className="font-sans text-4xl font-bold mt-1 tabular-nums">{money(est.totalDue)}</p>
              <p className="text-forest-100/80 mt-1">Taux effectif : {Math.round(est.effectiveRate)} % de ton revenu</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">À mettre de côté</p>
              <p className="font-sans text-3xl font-bold mt-1 tabular-nums text-gold-300">{Math.round(est.setAsidePct)} %</p>
              <p className="text-forest-100/80 mt-1">de chaque paiement reçu</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Épargne suggérée</p>
              <p className="font-sans text-2xl font-bold mt-1 tabular-nums">{money(est.setAsideMonthly)}<span className="text-base font-normal text-forest-100/70"> /mois</span></p>
              <p className="text-forest-100/80 mt-1">≈ {money(est.setAsideWeekly)} / semaine</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Détail */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Stat label="Impôt fédéral" value={money(est.federalTax)} icon="fa-landmark" tone="forest" hint="après abattement QC 16,5 %" />
        <Stat label="Impôt du Québec" value={money(est.quebecTax)} icon="fa-fleur-de-lis" tone="emerald" />
        <Stat label="RRQ" value={money(est.qpp)} icon="fa-umbrella" tone="gold" hint="régime de rentes" />
        <Stat label="RQAP" value={money(est.qpip)} icon="fa-baby" tone="rose" hint="assurance parentale" />
      </div>

      {/* Composition */}
      <Card className="p-6">
        <SectionTitle icon="fa-chart-simple" title="Composition de ce que tu paies" />
        <div className="h-5 w-full rounded-full overflow-hidden flex bg-paper-200">
          {parts.map((p) => est.totalDue > 0 && (
            <div key={p.label} style={{ width: `${(p.value / est.totalDue) * 100}%`, background: p.color }} title={`${p.label} : ${money(p.value)}`} />
          ))}
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 mt-4">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: p.color }} />{p.label}</span>
              <span className="tabular-nums text-forest-600">{money(p.value)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-paper-100 flex items-center justify-between">
          <span className="text-sm text-forest-500">Revenu net après impôts et cotisations</span>
          <span className="font-bold text-lg text-forest-800 tabular-nums">{money(est.afterTax)}</span>
        </div>
      </Card>

      {/* Comprendre */}
      <Card className="p-6">
        <SectionTitle icon="fa-circle-question" title="Comprendre ce que tu paies" />
        <div className="divide-y divide-paper-100">
          {EXPLAINERS.map((e) => (
            <div key={e.title}>
              <button onClick={() => setOpen(open === e.title ? null : e.title)} className="w-full flex items-center justify-between py-3 text-left">
                <span className="font-medium text-forest-900"><i className={`fas ${e.icon} text-forest-500 mr-2`} />{e.title}</span>
                <i className={`fas fa-chevron-${open === e.title ? 'up' : 'down'} text-forest-300`} />
              </button>
              {open === e.title && <p className="pb-4 text-sm text-forest-600 leading-relaxed">{e.body}</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* Acomptes provisionnels */}
      <Card className="p-5 bg-forest-50 border-forest-100">
        <p className="text-sm text-forest-700 leading-relaxed">
          <i className="fas fa-triangle-exclamation text-gold-600 mr-1" />
          <strong>Acomptes provisionnels :</strong> comme travailleur autonome, aucun impôt n'est retenu à la source.
          Si ton impôt net à payer dépasse environ 1 800 $ (fédéral et Québec), tu dois généralement verser des
          <strong> acomptes trimestriels</strong> (mars, juin, septembre, décembre). Mettre de côté le montant
          ci-dessus à chaque revenu t'évite une mauvaise surprise.
        </p>
      </Card>

      {/* Hypothèses + avertissement */}
      <Card className="p-4 bg-paper-50 border-paper-300">
        <p className="text-xs text-forest-500 leading-relaxed">
          <i className="fas fa-circle-info text-gold-500 mr-1" />
          <strong>Paramètres {TAX_YEAR} (à vérifier chaque année) :</strong> RRQ — exemption {money(TAX_PARAMS.QPP.exemption)},
          plafonds {money(TAX_PARAMS.QPP.ceiling1)} / {money(TAX_PARAMS.QPP.ceiling2)}, taux travailleur autonome
          {' '}{(TAX_PARAMS.QPP.rateSE * 100).toFixed(1)} % et {(TAX_PARAMS.QPP.rate2SE * 100).toFixed(0)} %. RQAP — max
          {' '}{money(TAX_PARAMS.QPIP.maxInsurable)} à {(TAX_PARAMS.QPIP.rateSE * 100).toFixed(3)} %. Abattement du Québec
          {' '}{(TAX_PARAMS.QUEBEC_ABATEMENT * 100).toFixed(1)} %. Estimation simplifiée (crédits de base seulement;
          ne tient pas compte des autres crédits, déductions, revenus de conjoint, etc.).
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
};

const EXPLAINERS = [
  {
    title: 'Impôt sur le revenu (fédéral + Québec)',
    icon: 'fa-landmark',
    body: "Au Québec tu paies deux impôts sur ton revenu : un à l'Agence du revenu du Canada (fédéral) et un à Revenu Québec (provincial). Les deux sont « progressifs » : plus ton revenu monte, plus le taux sur la tranche supérieure est élevé. Comme résident du Québec, tu bénéficies aussi d'un abattement de 16,5 % sur l'impôt fédéral. Un « montant personnel de base » rend une première tranche de revenu non imposable.",
  },
  {
    title: 'RRQ — Régime de rentes du Québec',
    icon: 'fa-umbrella',
    body: "La RRQ te bâtit une rente de retraite (et des protections en cas d'invalidité ou de décès). Un salarié partage la cotisation avec son employeur; comme travailleur autonome, tu paies les DEUX parts. Elle s'applique sur ton revenu entre l'exemption de base et les plafonds annuels. C'est une forme d'épargne-retraite obligatoire, pas seulement une taxe.",
  },
  {
    title: 'RQAP — Régime québécois d\'assurance parentale',
    icon: 'fa-baby',
    body: "Le RQAP finance les congés de maternité, paternité, parentaux et d'adoption. Même sans enfant prévu, la cotisation est obligatoire sur ton revenu (jusqu'à un maximum assurable). En retour, si tu as un enfant, tu as droit à des prestations même comme travailleur autonome.",
  },
  {
    title: 'Pourquoi mettre de l\'argent de côté ?',
    icon: 'fa-piggy-bank',
    body: "Personne ne retient d'impôt sur tes revenus de travailleur autonome : tu es responsable de le payer toi-même. En réservant le pourcentage suggéré à chaque paiement reçu (dans un compte séparé idéalement), tu auras l'argent prêt pour tes acomptes et ta déclaration — sans stress.",
  },
];
