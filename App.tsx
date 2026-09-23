import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { LeadInfo, SavingsQuizData } from './types';
import StepWelcome from './components/StepWelcome';
import StepSavings, { computePotential } from './components/StepSavings';
import StepLeadCapture from './components/StepLeadCapture';
import StepThankYou from './components/StepThankYou';

const EMAILJS_SERVICE_ID = 'service_rqmclus';
const EMAILJS_TEMPLATE_ID = 'template_k28462n';
const EMAILJS_PUBLIC_KEY = 'gBubsOj-Izk_yse9V';

type Step = 1 | 2 | 3 | 4;

const DEFAULT_SAVINGS: SavingsQuizData = {
 insurance: null, groceryApps: null, subscriptions: null, cellPhone: null,
 genericBrands: null, creditCard: null, ghostPayments: null, hydro: null,
 advisorStrategy: null, autoSavings: null,
};

const GOAL_LABELS: Record<string, string> = {
 maison: 'Acheter une maison',
 budget: 'Améliorer mon budget',
 retraite: 'Préparer ma retraite',
 assurances: 'Vérifier mes assurances',
 placements: 'Optimiser mes placements',
};

function fireFireworks() {
 const colors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'];
 confetti({ particleCount: 90, angle: 60, spread: 80, origin: { x: 0, y: 0.6 }, colors, startVelocity: 45 });
 setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 80, origin: { x: 1, y: 0.6 }, colors, startVelocity: 45 }), 200);
 setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors, startVelocity: 35 }), 400);
}

const App: React.FC = () => {
 const [step, setStep] = useState<Step>(1);
 const [goals, setGoals] = useState<string[]>([]);
 const [savingsQuiz, setSavingsQuiz] = useState<SavingsQuizData>(DEFAULT_SAVINGS);
 const [lead, setLead] = useState<LeadInfo | null>(null);
 const [submitting, setSubmitting] = useState(false);

 const potentialYearly = computePotential(savingsQuiz).yearly;

 const toggleGoal = (goal: string) =>
 setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));

 const goToStep = (next: Step) => {
 setStep(next);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleLeadSubmit = async (info: LeadInfo) => {
 setSubmitting(true);
 setLead(info);

 const goalsText = goals.map((g) => GOAL_LABELS[g] ?? g).join(', ') || 'Aucun objectif sélectionné';

 try {
 const existing = JSON.parse(localStorage.getItem('budget_leads') ?? '[]');
 existing.push({ ...info, goals, savingsQuiz, potentialYearly, timestamp: new Date().toISOString() });
 localStorage.setItem('budget_leads', JSON.stringify(existing));
 } catch (_) {}

 try {
 await emailjs.send(
 EMAILJS_SERVICE_ID,
 EMAILJS_TEMPLATE_ID,
 {
 firstName: info.firstName,
 lastName: info.lastName,
 email: info.email,
 phone: info.phone,
 goals: goalsText,
 potentialSavings: `${potentialYearly} $/an`,
 },
 EMAILJS_PUBLIC_KEY,
 );
 } catch (err) {
 console.error('[GoBudget.ca] EmailJS error:', err);
 }

 fireFireworks();
 setSubmitting(false);
 goToStep(4);
 };

 const reset = () => {
 setGoals([]);
 setSavingsQuiz(DEFAULT_SAVINGS);
 setLead(null);
 goToStep(1);
 };

 return (
 <div className="min-h-screen bg-blue-50 bg-mesh font-sans">
 {(step === 2 || step === 3) && (
 <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 py-3 px-4 sticky top-0 z-40 shadow-sm">
 <div className="max-w-2xl mx-auto flex items-center justify-between">
 <span className="font-display text-sm font-bold text-blue-900">GoBudget<span className="text-blue-500">.ca</span></span>
 <span className="text-xs text-blue-600 font-medium bg-blue-50 border border-blue-200 px-3 py-1 rounded-full hidden sm:block">
 🔒 Confidentiel
 </span>
 </div>
 </header>
 )}

 <main>
 {step === 1 && <StepWelcome onStart={() => goToStep(2)} goals={goals} onToggleGoal={toggleGoal} />}
 {step === 2 && (
 <StepSavings
 data={savingsQuiz}
 onChange={setSavingsQuiz}
 onNext={() => goToStep(3)}
 onBack={() => goToStep(1)}
 />
 )}
 {step === 3 && (
 <StepLeadCapture
 onSubmit={handleLeadSubmit}
 onBack={() => goToStep(2)}
 loading={submitting}
 potentialYearly={potentialYearly}
 />
 )}
 {step === 4 && lead && (
 <StepThankYou lead={lead} potentialYearly={potentialYearly} onReset={reset} />
 )}
 </main>
 </div>
 );
};

export default App;
