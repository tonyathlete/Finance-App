// ============================================================================
// Estimation d'impôts et cotisations — travailleur autonome, Québec
// ----------------------------------------------------------------------------
// ⚠️ Paramètres de l'année indiquée ci-dessous. À VÉRIFIER / METTRE À JOUR
// chaque année auprès de Revenu Québec, l'ARC, Retraite Québec et le RQAP.
// Estimation simplifiée à but pédagogique — ne remplace pas un comptable.
// ============================================================================

export const TAX_YEAR = 2025;

interface Bracket {
  upTo: number; // plafond de la tranche (Infinity pour la dernière)
  rate: number; // taux marginal
}

// --- Impôt fédéral (2025) ---------------------------------------------------
const FEDERAL_BRACKETS: Bracket[] = [
  { upTo: 57375, rate: 0.15 },
  { upTo: 114750, rate: 0.205 },
  { upTo: 177882, rate: 0.26 },
  { upTo: 253414, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 },
];
const FEDERAL_BPA = 16129;          // montant personnel de base (2025)
const QUEBEC_ABATEMENT = 0.165;     // abattement du Québec sur l'impôt fédéral

// --- Impôt du Québec (2025) -------------------------------------------------
const QUEBEC_BRACKETS: Bracket[] = [
  { upTo: 53255, rate: 0.14 },
  { upTo: 106495, rate: 0.19 },
  { upTo: 129590, rate: 0.24 },
  { upTo: Infinity, rate: 0.2575 },
];
const QUEBEC_BPA = 18571;           // montant personnel de base (2025)

// --- RRQ / Régime de rentes du Québec (2025) --------------------------------
const QPP = {
  exemption: 3500,       // exemption générale
  ceiling1: 71300,       // maximum des gains admissibles (MGA)
  ceiling2: 81200,       // maximum supplémentaire (MSGA) — 2e plafond
  rateSE: 0.128,         // travailleur autonome : base + 1re addition (10,8 % + 2 %)
  rate2SE: 0.08,         // 2e cotisation supplémentaire (travailleur autonome)
};

// --- RQAP / Régime québécois d'assurance parentale (2025) -------------------
const QPIP = {
  maxInsurable: 98000,   // revenu maximal assurable
  rateSE: 0.00878,       // taux travailleur autonome (0,878 %)
};

const progressiveTax = (income: number, brackets: Bracket[]): number => {
  let tax = 0;
  let lower = 0;
  for (const b of brackets) {
    if (income <= lower) break;
    const taxable = Math.min(income, b.upTo) - lower;
    tax += taxable * b.rate;
    lower = b.upTo;
  }
  return tax;
};

export interface TaxEstimate {
  netIncome: number;
  federalTax: number;
  quebecTax: number;
  qpp: number;
  qpip: number;
  totalDue: number;
  afterTax: number;
  effectiveRate: number;   // % du revenu net
  setAsideMonthly: number;
  setAsideWeekly: number;
  setAsidePct: number;     // % à mettre de côté
}

export const estimateTax = (netIncome: number): TaxEstimate => {
  const inc = Math.max(0, netIncome);

  // Impôt fédéral (crédit de base, puis abattement du Québec 16,5 %)
  const fedGross = Math.max(0, progressiveTax(inc, FEDERAL_BRACKETS) - FEDERAL_BPA * 0.15);
  const federalTax = fedGross * (1 - QUEBEC_ABATEMENT);

  // Impôt du Québec (crédit de base)
  const quebecTax = Math.max(0, progressiveTax(inc, QUEBEC_BRACKETS) - QUEBEC_BPA * 0.14);

  // RRQ (deux plafonds)
  const qppBase = Math.max(0, Math.min(inc, QPP.ceiling1) - QPP.exemption) * QPP.rateSE;
  const qppAdd = Math.max(0, Math.min(inc, QPP.ceiling2) - QPP.ceiling1) * QPP.rate2SE;
  const qpp = qppBase + qppAdd;

  // RQAP
  const qpip = Math.min(inc, QPIP.maxInsurable) * QPIP.rateSE;

  const totalDue = federalTax + quebecTax + qpp + qpip;
  const afterTax = inc - totalDue;

  return {
    netIncome: inc,
    federalTax,
    quebecTax,
    qpp,
    qpip,
    totalDue,
    afterTax,
    effectiveRate: inc > 0 ? (totalDue / inc) * 100 : 0,
    setAsideMonthly: totalDue / 12,
    setAsideWeekly: totalDue / 52,
    setAsidePct: inc > 0 ? (totalDue / inc) * 100 : 0,
  };
};

// Paramètres exposés pour l'affichage « hypothèses »
export const TAX_PARAMS = { FEDERAL_BRACKETS, FEDERAL_BPA, QUEBEC_ABATEMENT, QUEBEC_BRACKETS, QUEBEC_BPA, QPP, QPIP };
