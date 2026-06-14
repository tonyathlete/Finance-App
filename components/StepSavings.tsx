import React from 'react';
import { SavingsQuizData, SavingsAnswer } from '../types';
import ProgressBar from './ProgressBar';

interface Props {
  data: SavingsQuizData;
  onChange: (data: SavingsQuizData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface QuizItem {
  id: keyof SavingsQuizData;
  icon: string;
  question: string;
  tip: string;
  stat: string;
  savingMin: number;
  savingMax: number;
  unit: 'month' | 'year';
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'insurance',
    icon: '🛡️',
    question: 'Avez-vous magasiné votre assurance auto et habitation au cours des 2 dernières années?',
    tip: 'Les assureurs récompensent les nouveaux clients. Obtenir 3 soumissions prend 30 minutes et peut faire une vraie différence.',
    stat: 'Les Québécois qui magasinent économisent en moyenne 400–700$ par an sur leurs assurances.',
    savingMin: 400,
    savingMax: 700,
    unit: 'year',
  },
  {
    id: 'groceryApps',
    icon: '🛒',
    question: 'Utilisez-vous des apps comme Reebee, Flipp ou FoodHero pour planifier vos achats?',
    tip: 'Ces apps regroupent les circulaires de tous les épiciers. Planifier selon les spéciaux avant de partir = économies garanties.',
    stat: 'Les utilisateurs réguliers économisent en moyenne 80–150$ par mois sur leur épicerie.',
    savingMin: 80,
    savingMax: 150,
    unit: 'month',
  },
  {
    id: 'subscriptions',
    icon: '📱',
    question: 'Avez-vous fait le ménage de vos abonnements (Netflix, gym, apps…) au cours des 6 derniers mois?',
    tip: 'Les abonnements s\'accumulent silencieusement. Passer ses relevés bancaires 15 minutes révèle souvent 2–4 services oubliés.',
    stat: 'En moyenne, les Québécois ont 3–5 abonnements actifs qu\'ils n\'utilisent pas — soit 60–120$ par mois qui partent à la poubelle.',
    savingMin: 60,
    savingMax: 120,
    unit: 'month',
  },
  {
    id: 'cellPhone',
    icon: '📲',
    question: 'Avez-vous comparé votre forfait cellulaire au cours des 12 derniers mois?',
    tip: 'Fizz, Public Mobile, Koodo et Freedom offrent souvent les mêmes services pour beaucoup moins. Ça vaut le coup de comparer.',
    stat: 'Changer pour un forfait compétitif peut économiser 20–50$ par mois — sans changer de téléphone.',
    savingMin: 20,
    savingMax: 50,
    unit: 'month',
  },
  {
    id: 'genericBrands',
    icon: '🏷️',
    question: 'Utilisez-vous des marques génériques ou maison pour au moins une partie de votre épicerie?',
    tip: 'Pour la majorité des produits alimentaires de base, la qualité est identique. Farine, pâtes, conserves, produits ménagers — les génériques font la job.',
    stat: 'Remplacer 40–50% de son panier par des marques maison réduit la facture d\'épicerie de 15–25%.',
    savingMin: 40,
    savingMax: 80,
    unit: 'month',
  },
  {
    id: 'creditCard',
    icon: '💳',
    question: 'Utilisez-vous une carte de crédit avec cashback ou points pour vos achats du quotidien?',
    tip: 'Utiliser la bonne carte (payée au complet chaque mois) sur les dépenses courantes, c\'est de l\'argent gratuit. Cartes populaires : Scotia Momentum, Rogers, CIBC Dividend.',
    stat: 'Une utilisation optimisée d\'une carte rewards génère en moyenne 300–600$ de retour par an.',
    savingMin: 300,
    savingMax: 600,
    unit: 'year',
  },
  {
    id: 'ghostPayments',
    icon: '👻',
    question: 'Avez-vous vérifié vos relevés bancaires récemment pour des paiements automatiques oubliés?',
    tip: 'Essai gratuit converti en abonnement, service dupliqué, ancienne plateforme jamais annulée — ça arrive à tout le monde.',
    stat: 'On estime que la majorité des gens ont au moins 1–2 paiements "fantômes" actifs, totalisant 30–80$ par mois.',
    savingMin: 30,
    savingMax: 80,
    unit: 'month',
  },
  {
    id: 'hydro',
    icon: '⚡',
    question: 'Évitez-vous d\'utiliser vos gros appareils (laveuse, sécheuse, lave-vaisselle) durant les heures de pointe d\'Hydro-Québec?',
    tip: 'Les heures de pointe sont de 6h à 9h et de 16h à 21h. Décaler ces tâches en soirée tardive ou la nuit peut réduire significativement votre facture.',
    stat: 'Utiliser les appareils hors-pointe peut réduire la facture Hydro de 15–30% pour les ménages qui chauffent à l\'électricité.',
    savingMin: 15,
    savingMax: 40,
    unit: 'month',
  },
  {
    id: 'advisorStrategy',
    icon: '🍽️',
    question: 'Savais-tu que le Québécois moyen dépense plus de 300$/mois au restaurant et en livraison — sais-tu ce que TOI tu dépenses?',
    tip: 'La livraison (Uber Eats, DoorDash) coûte en moyenne 30–40% plus cher qu\'aller au resto directement, une fois les frais, le pourboire et les prix majorés comptés. Cuisiner 2 repas de plus par semaine à la maison fait une vraie différence.',
    stat: 'Réduire de 2 sorties ou livraisons par semaine représente une économie moyenne de 100–180$/mois, soit jusqu\'à 2 160$/an.',
    savingMin: 100,
    savingMax: 180,
    unit: 'month',
  },
  {
    id: 'autoSavings',
    icon: '🔄',
    question: 'As-tu mis en place des virements automatiques vers ton épargne dès la réception de ta paie?',
    tip: '"Payez-vous en premier" — virer automatiquement un montant fixe le jour de la paie avant de dépenser quoi que ce soit. Ce que tu ne vois pas, tu ne le dépenses pas.',
    stat: 'Les personnes qui automatisent leur épargne mettent de côté en moyenne 3x plus que celles qui épargnent ce qui reste à la fin du mois.',
    savingMin: 100,
    savingMax: 300,
    unit: 'month',
  },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

function calcPotential(data: SavingsQuizData): { monthly: number; yearly: number } {
  let monthly = 0;
  let yearly = 0;
  for (const item of QUIZ_ITEMS) {
    if (data[item.id] === 'no' || data[item.id] === 'unknown') {
      if (item.unit === 'month') yearly += item.savingMin * 12;
      else yearly += item.savingMin;
      if (item.unit === 'month') monthly += item.savingMin;
      else monthly += Math.round(item.savingMin / 12);
    }
  }
  return { monthly, yearly };
}

export default function StepSavings({ data, onChange, onNext, onBack }: Props) {
  const answered = Object.values(data).filter(v => v !== null).length;
  const { yearly } = calcPotential(data);

  const set = (id: keyof SavingsQuizData, val: SavingsAnswer) =>
    onChange({ ...data, [id]: val });

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 py-10 pb-32">
      <ProgressBar step={1} total={6} />

      <div className="mb-6">
        <p className="text-blue-400 text-sm font-medium mb-1">Avant de voir ton analyse</p>
        <h2 className="text-2xl font-black text-blue-900 mb-1">10 questions pour trouver des économies cachées</h2>
        <p className="text-blue-500 text-sm">Réponds honnêtement — on calcule ton potentiel d'économies en temps réel.</p>
      </div>

      <div className="space-y-4">
        {QUIZ_ITEMS.map((item) => {
          const answer = data[item.id];
          const showTip = answer === 'no' || answer === 'unknown';
          return (
            <div key={item.id} className="bg-white border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 mb-3">
                {item.icon} {item.question}
              </p>
              <div className="flex gap-2 mb-3">
                {(['yes', 'no', 'unknown'] as SavingsAnswer[]).map((opt) => {
                  const labels: Record<string, string> = { yes: 'Oui', no: 'Non', unknown: 'Je sais pas' };
                  const active = answer === opt;
                  const colors = opt === 'yes'
                    ? active ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-700 border-green-200 hover:border-green-400'
                    : opt === 'no'
                    ? active ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-600 border-red-200 hover:border-red-400'
                    : active ? 'bg-blue-400 text-white border-blue-400' : 'bg-white text-blue-500 border-blue-200 hover:border-blue-400';
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set(item.id, active ? null : opt)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${colors}`}
                    >
                      {labels[opt as string]}
                    </button>
                  );
                })}
              </div>
              {showTip && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 animate-fadeIn">
                  <p className="text-xs text-amber-800 mb-2">{item.tip}</p>
                  <p className="text-xs font-bold text-green-700">
                    💡 {item.stat}
                  </p>
                </div>
              )}
              {answer === 'yes' && (
                <p className="text-xs text-green-600 font-medium">✅ Super, tu es déjà sur la bonne voie!</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 shadow-lg">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Économies potentielles détectées</p>
              <p className="text-2xl font-black text-green-800 transition-all duration-500">
                {fmt(yearly)}<span className="text-sm font-semibold text-green-600"> /an</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={onBack} className="py-2 px-4 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition text-sm">
                ← Retour
              </button>
              <button onClick={onNext} className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-sm">
                {answered === 0 ? 'Passer →' : 'Continuer →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
