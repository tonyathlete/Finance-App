import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { BudgetData, LeadInfo, BudgetAnalysis, Step, SavingsQuizData } from './types';
import StepWelcome from './components/StepWelcome';
import StepRevenue from './components/StepRevenue';
import StepFixedExpenses from './components/StepFixedExpenses';
import StepVariableExpenses from './components/StepVariableExpenses';
import StepPlacements from './components/StepPlacements';
import StepSavings from './components/StepSavings';
import StepLeadCapture from './components/StepLeadCapture';
import StepResults from './components/StepResults';
import LiveScore from './components/LiveScore';
import { analyzeBudget, fmt } from './services/budgetService';

const EMAILJS_SERVICE_ID  = 'service_rqmclus';
const EMAILJS_TEMPLATE_ID = 'template_k28462n';
const EMAILJS_PUBLIC_KEY  = 'gBubsOj-Izk_yse9V';

const DEFAULT_BUDGET: BudgetData = {
  revenue: { salaryNet: 0, otherIncome: 0 },
  fixedExpenses: {
    housing: 0, housingSub: { rent: 0, mortgage: 0, condo: 0 },
    transport: 0, transportSub: { carPayment: 0, carInsurance: 0, gas: 0 },
    insurance: 0, insuranceSub: { life: 0, disability: 0, home: 0 },
    debts: 0, debtsSub: { creditCard1: 0, creditCard2: 0, personalLoan: 0, creditLine: 0 },
  },
  variableExpenses: {
    groceries: 0, groceriesSub: { food: 0, household: 0 },
    restaurants: 0, restaurantsSub: { restaurants: 0, cafes: 0, delivery: 0 },
    leisure: 0, leisureSub: { subscriptions: 0, sports: 0, outings: 0, hobbies: 0 },
    clothing: 0, clothingSub: { clothes: 0, shoes: 0, accessories: 0 },
    health: 0, healthSub: { medication: 0, dental: 0, vision: 0, personal: 0 },
    other: 0,
  },
  placements: {
    reer:    { contribution: 0, frequency: 'monthly', totalInvested: 0 },
    celi:    { contribution: 0, frequency: 'monthly', totalInvested: 0 },
    celiapp: { contribution: 0, frequency: 'monthly', totalInvested: 0 },
    reee:    { contribution: 0, frequency: 'monthly', totalInvested: 0 },
    other:   { contribution: 0, frequency: 'monthly', totalInvested: 0 },
  },
};

function fireFireworks() {
  const colors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'];
  confetti({ particleCount: 90, angle: 60, spread: 80, origin: { x: 0, y: 0.6 }, colors, startVelocity: 45 });
  setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 80, origin: { x: 1, y: 0.6 }, colors, startVelocity: 45 }), 200);
  setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors, startVelocity: 35 }), 400);
}

const App: React.FC = () => {
  const DEFAULT_SAVINGS: SavingsQuizData = {
    insurance: null, groceryApps: null, subscriptions: null, cellPhone: null,
    genericBrands: null, creditCard: null, ghostPayments: null, hydro: null,
    advisorStrategy: null, autoSavings: null,
  };

  const [step, setStep] = useState<Step>(1);
  const [budget, setBudget] = useState<BudgetData>(DEFAULT_BUDGET);
  const [savingsQuiz, setSavingsQuiz] = useState<SavingsQuizData>(DEFAULT_SAVINGS);
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goToStep = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadSubmit = async (info: LeadInfo) => {
    setSubmitting(true);
    setLead(info);
    const result = analyzeBudget(budget);
    setAnalysis(result);

    try {
      const existing = JSON.parse(localStorage.getItem('budget_leads') ?? '[]');
      existing.push({ ...info, budget, timestamp: new Date().toISOString() });
      localStorage.setItem('budget_leads', JSON.stringify(existing));
    } catch (_) {}

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          firstName:       info.firstName,
          lastName:        info.lastName,
          email:           info.email,
          phone:           info.phone,
          totalIncome:     fmt(result.totalIncome),
          totalExpenses:   fmt(result.totalExpenses),
          totalPlacements: fmt(result.totalPlacements),
          surplus:         fmt(result.surplus),
          healthScore:     result.healthScore,
        },
        EMAILJS_PUBLIC_KEY,
      );
    } catch (err) {
      console.error('[GoBudget.ca] EmailJS error:', err);
    }

    // Fireworks for final reveal
    fireFireworks();
    setSubmitting(false);
    setStep(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setStep(1);
    setBudget(DEFAULT_BUDGET);
    setSavingsQuiz(DEFAULT_SAVINGS);
    setLead(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 bg-mesh font-sans">
      {step !== 1 && step !== 8 && (
        <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 py-3 px-4 sticky top-0 z-40 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-blue-900">GoBudget<span className="text-blue-500">.ca</span></span>
            </div>
            <div className="flex items-center gap-3">
              <LiveScore budget={budget} step={step} />
              <span className="text-xs text-blue-600 font-medium bg-blue-50 border border-blue-200 px-3 py-1 rounded-full hidden sm:block">
                🔒 Confidentiel
              </span>
            </div>
          </div>
        </header>
      )}

      <main>
        {step === 1 && <StepWelcome onStart={() => goToStep(2)} />}
        {step === 2 && (
          <StepSavings
            data={savingsQuiz}
            onChange={setSavingsQuiz}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}
        {step === 3 && (
          <StepRevenue
            data={budget.revenue}
            onChange={(r) => setBudget({ ...budget, revenue: r })}
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )}
        {step === 4 && (
          <StepFixedExpenses
            data={budget.fixedExpenses}
            onChange={(f) => setBudget({ ...budget, fixedExpenses: f })}
            onNext={() => goToStep(5)}
            onBack={() => goToStep(3)}
            totalIncome={budget.revenue.salaryNet}
          />
        )}
        {step === 5 && (
          <StepVariableExpenses
            data={budget.variableExpenses}
            onChange={(v) => setBudget({ ...budget, variableExpenses: v })}
            onNext={() => goToStep(6)}
            onBack={() => goToStep(4)}
            totalIncome={budget.revenue.salaryNet}
          />
        )}
        {step === 6 && (
          <StepPlacements
            data={budget.placements}
            onChange={(p) => setBudget({ ...budget, placements: p })}
            onNext={() => goToStep(7)}
            onBack={() => goToStep(5)}
          />
        )}
        {step === 7 && (
          <StepLeadCapture
            onSubmit={handleLeadSubmit}
            onBack={() => goToStep(6)}
            loading={submitting}
          />
        )}
        {step === 8 && analysis && lead && (
          <StepResults analysis={analysis} lead={lead} onReset={reset}  />
        )}
      </main>

      <footer className="mt-16 border-t border-blue-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center text-xs text-blue-500 space-y-2">
          <p>Cet outil est fourni à titre informatif uniquement. Il ne constitue pas un conseil financier professionnel.</p>
          <p className="font-semibold">© {new Date().getFullYear()} GoBudget.ca • Outil de planification financière</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
