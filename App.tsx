import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { BudgetData, LeadInfo, BudgetAnalysis, Step, AvatarId } from './types';
import StepWelcome from './components/StepWelcome';
import StepRevenue from './components/StepRevenue';
import StepFixedExpenses from './components/StepFixedExpenses';
import StepVariableExpenses from './components/StepVariableExpenses';
import StepPlacements from './components/StepPlacements';
import StepLeadCapture from './components/StepLeadCapture';
import StepResults from './components/StepResults';
import LiveScore from './components/LiveScore';
import { AVATARS, AvatarFace } from './components/Avatar';
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

function fireStepConfetti(nextStep: Step) {
  switch (nextStep) {
    case 2: // Welcome → Revenue: gold rain
      confetti({ particleCount: 60, angle: 90, spread: 55, origin: { y: 0.7 }, colors: ['#fbbf24', '#f59e0b', '#fde68a'] });
      break;
    case 3: // Revenue → Fixed: stars burst
      confetti({ particleCount: 80, spread: 100, startVelocity: 30, shapes: ['star'], colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#fff'] });
      break;
    case 4: // Fixed → Variable: confetti cannon left+right
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#34d399', '#6ee7b7'] });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#34d399', '#6ee7b7'] });
      break;
    case 5: // Variable → Placements: money shower
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.3 }, colors: ['#22c55e', '#16a34a', '#86efac', '#fbbf24'] });
      break;
    case 6: // Placements → Lead: purple celebration
      confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 }, colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#f0abfc'] });
      break;
    case 7: // Lead → Results: rainbow finale
      confetti({ particleCount: 80, angle: 60, spread: 80, origin: { x: 0, y: 0.6 }, colors: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'] });
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 80, origin: { x: 1, y: 0.6 }, colors: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'] }), 200);
      break;
    default:
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [avatar, setAvatar] = useState<AvatarId>('bear');
  const [budget, setBudget] = useState<BudgetData>(DEFAULT_BUDGET);
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goToStep = (next: Step) => {
    if (next > step && next > 1) fireStepConfetti(next);
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
      console.error('[MonBudget] EmailJS error:', err);
    }

    // Big confetti for final reveal
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#f59e0b', '#f97316', '#10b981', '#6366f1', '#fff'] });
    setSubmitting(false);
    setStep(7);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setStep(1);
    setBudget(DEFAULT_BUDGET);
    setLead(null);
    setAnalysis(null);
    setAvatar('bear');
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {step !== 1 && step !== 7 && (
        <header className="bg-white border-b border-blue-100 py-3 px-4 sticky top-0 z-40 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full border-2 overflow-hidden flex-shrink-0 shadow-sm p-0.5 ${AVATARS[avatar].color} ${AVATARS[avatar].bg}`}>
                <AvatarFace avatar={avatar} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-blue-900 leading-none">{AVATARS[avatar].name}</p>
                <p className="text-xs text-blue-400 leading-none">Ton coach budget</p>
              </div>
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
        {step === 1 && <StepWelcome onStart={(av) => { setAvatar(av); goToStep(2); }} />}
        {step === 2 && (
          <StepRevenue
            data={budget.revenue}
            onChange={(r) => setBudget({ ...budget, revenue: r })}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
            avatar={avatar}
          />
        )}
        {step === 3 && (
          <StepFixedExpenses
            data={budget.fixedExpenses}
            onChange={(f) => setBudget({ ...budget, fixedExpenses: f })}
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
            avatar={avatar}
            totalIncome={budget.revenue.salaryNet}
          />
        )}
        {step === 4 && (
          <StepVariableExpenses
            data={budget.variableExpenses}
            onChange={(v) => setBudget({ ...budget, variableExpenses: v })}
            onNext={() => goToStep(5)}
            onBack={() => goToStep(3)}
            avatar={avatar}
            totalIncome={budget.revenue.salaryNet}
          />
        )}
        {step === 5 && (
          <StepPlacements
            data={budget.placements}
            onChange={(p) => setBudget({ ...budget, placements: p })}
            onNext={() => goToStep(6)}
            onBack={() => goToStep(4)}
            avatar={avatar}
          />
        )}
        {step === 6 && (
          <StepLeadCapture
            onSubmit={handleLeadSubmit}
            onBack={() => goToStep(5)}
            loading={submitting}
            avatar={avatar}
          />
        )}
        {step === 7 && analysis && lead && (
          <StepResults analysis={analysis} lead={lead} onReset={reset} avatar={avatar} />
        )}
      </main>

      <footer className="mt-16 border-t border-blue-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center text-xs text-blue-500 space-y-2">
          <p>Cet outil est fourni à titre informatif uniquement. Il ne constitue pas un conseil financier professionnel.</p>
          <p className="font-semibold">© {new Date().getFullYear()} MonBudget • Outil de planification financière</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
