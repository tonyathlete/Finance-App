// Quebec 2025 gross-to-net monthly estimator
// Includes QPP, EI, RQAP, federal tax, and Quebec provincial tax

function applyBrackets(income: number, brackets: [number, number][]): number {
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of brackets) {
    if (income <= prev) break;
    tax += (Math.min(income, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

export interface TaxBreakdown {
  grossMonthly: number;
  netMonthly: number;
  qpp: number;
  ei: number;
  rqap: number;
  federalTax: number;
  provincialTax: number;
  totalDeductions: number;
  effectiveRate: number;
}

export function calcNetFromGross(grossMonthly: number): TaxBreakdown {
  const grossAnnual = grossMonthly * 12;

  // --- QPP (Régime de rentes du Québec) 2025 ---
  const QPP_RATE = 0.064;
  const QPP_EXEMPTION = 3500;
  const QPP_MAX_EARNINGS = 71300;
  const qppAnnual = Math.min(Math.max(grossAnnual - QPP_EXEMPTION, 0), QPP_MAX_EARNINGS - QPP_EXEMPTION) * QPP_RATE;

  // --- EI (Assurance-emploi) — Quebec rate lower due to RQAP ---
  const EI_RATE = 0.0166;
  const EI_MAX_INSURABLE = 65700;
  const eiAnnual = Math.min(grossAnnual, EI_MAX_INSURABLE) * EI_RATE;

  // --- RQAP (Régime québécois d'assurance parentale) 2025 ---
  const RQAP_RATE = 0.00494;
  const RQAP_MAX_INSURABLE = 98000;
  const rqapAnnual = Math.min(grossAnnual, RQAP_MAX_INSURABLE) * RQAP_RATE;

  // --- Federal income tax 2025 ---
  const FED_BASIC_PERSONAL = 16129;
  const fedBrackets: [number, number][] = [
    [57375,   0.15],
    [114750,  0.205],
    [158519,  0.26],
    [220000,  0.29],
    [Infinity, 0.33],
  ];
  const fedTaxableIncome = Math.max(grossAnnual - qppAnnual - eiAnnual - rqapAnnual, 0);
  const fedTaxBeforeCredit = applyBrackets(fedTaxableIncome, fedBrackets);
  const fedBasicCredit = FED_BASIC_PERSONAL * 0.15;
  const federalTaxAnnual = Math.max(fedTaxBeforeCredit - fedBasicCredit, 0);

  // --- Quebec provincial tax 2025 ---
  const QC_BASIC_PERSONAL = 17183;
  const qcBrackets: [number, number][] = [
    [51780,   0.14],
    [103545,  0.19],
    [126000,  0.24],
    [Infinity, 0.2575],
  ];
  // Quebec deductions: QPP, EI, RQAP are deductible
  const qcTaxableIncome = Math.max(grossAnnual - qppAnnual - eiAnnual - rqapAnnual, 0);
  const qcTaxBeforeCredit = applyBrackets(qcTaxableIncome, qcBrackets);
  const qcBasicCredit = QC_BASIC_PERSONAL * 0.14;
  const provincialTaxAnnual = Math.max(qcTaxBeforeCredit - qcBasicCredit, 0);

  // --- Monthly figures ---
  const toMonthly = (v: number) => Math.round(v / 12);
  const qpp = toMonthly(qppAnnual);
  const ei = toMonthly(eiAnnual);
  const rqap = toMonthly(rqapAnnual);
  const federalTax = toMonthly(federalTaxAnnual);
  const provincialTax = toMonthly(provincialTaxAnnual);
  const totalDeductions = qpp + ei + rqap + federalTax + provincialTax;
  const netMonthly = Math.max(grossMonthly - totalDeductions, 0);

  return {
    grossMonthly,
    netMonthly,
    qpp,
    ei,
    rqap,
    federalTax,
    provincialTax,
    totalDeductions,
    effectiveRate: grossMonthly > 0 ? Math.round((totalDeductions / grossMonthly) * 100) : 0,
  };
}
