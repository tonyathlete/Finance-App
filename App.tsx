import React, { useState } from 'react';
import { BudgetData, LeadInfo, BudgetAnalysis, Step } from './types';
import StepWelcome from './components/StepWelcome';
import StepRevenue from './components/StepRevenue';
import StepFixedExpenses from './components/StepFixedExpenses';
import StepVariableExpenses from './components/StepVariableExpenses';
import StepLeadCapture from './components/StepLeadCapture';
import StepResults from './components/StepResults';
import { analyzeBudget } from './services/budgetService';

const DEFAULT_BUDGET: BudgetData = {
  revenue: { salaryNet: 0, otherIncome: 0 },
  fixedExpenses: { housing: 0, transport: 0, insurance: 0, debts: 0 },
  variableExpenses: { groceries: 0, restaurants: 0, leisure: 0, clothing: 0, health: 0, other: 0 },
};

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [budget, setBudget] = useState<BudgetData>(DEFAULT_BUDGET);
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLeadSubmit = (info: LeadInfo) => {
    setSubmitting(true);
    setLead(info);
    const result = analyzeBudget(budget);
    setAnalysis(result);

    // Log lead to console (no backend configured)
    console.log('[BudgetApp] New lead:', { ...info, budget, analysis: result });
    try {
      const existing = JSON.parse(localStorage.getItem('budget_leads') ?? '[]');
      existing.push({ ...info, budget, timestamp: new Date().toISOString() });
      localStorage.setItem('budget_leads', JSON.stringify(existing));
    } catch (_) {}

    setTimeout(() => {
      setSubmitting(false);
      setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const reset = () => {
    setStep(1);
    setBudget(DEFAULT_BUDGET);
    setLead(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Header */}
      {step !== 1 && (
        <header className="bg-white border-b border-amber-100 py-4 px-4 sticky top-0 z-40 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow">
                <span className="text-lg">💰</span>
              </div>
              <span className="font-black text-amber-900 text-lg">MonBudget</span>
            </div>
            <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              🔒 Confidentiel
            </span>
          </div>
        </header>
      )}

      <main>
        {step === 1 && <StepWelcome onStart={() => setStep(2)} />}
        {step === 2 && (
          <StepRevenue
            data={budget.revenue}
            onChange={(r) => setBudget({ ...budget, revenue: r })}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepFixedExpenses
            data={budget.fixedExpenses}
            onChange={(f) => setBudget({ ...budget, fixedExpenses: f })}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <StepVariableExpenses
            data={budget.variableExpenses}
            onChange={(v) => setBudget({ ...budget, variableExpenses: v })}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <StepLeadCapture
            onSubmit={handleLeadSubmit}
            onBack={() => setStep(4)}
            loading={submitting}
          />
        )}
        {step === 6 && analysis && lead && (
          <StepResults analysis={analysis} lead={lead} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-amber-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center text-xs text-amber-500 space-y-2">
          <p>Cet outil est fourni à titre informatif uniquement. Il ne constitue pas un conseil financier professionnel.</p>
          <p className="font-semibold">© {new Date().getFullYear()} MonBudget • Outil de planification financière</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
