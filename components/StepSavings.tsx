import React, { useState } from 'react';
import { SavingsQuizData, SavingsAnswer } from '../types';

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
    stat: 'Les Québécois qui magasinent économisent en moyenne 400 à 700$ par an sur leurs assurances.',
    savingMin: 400,
    savingMax: 700,
    unit: 'year',
  },
  {
    id: 'groceryApps',
    icon: '🛒',
    question: 'Utilisez-vous des apps comme Reebee, Flipp ou FoodHero pour planifier vos achats?',
    tip: 'Ces apps regroupent les circulaires de tous les épiciers. Planifier selon les spéciaux avant de partir = économies garanties.',
    stat: 'Les utilisateurs réguliers économisent en moyenne 80 à 150$ par mois sur leur épicerie.',
    savingMin: 80,
    savingMax: 150,
    unit: 'month',
  },
  {
    id: 'subscriptions',
    icon: '📱',
    question: 'Avez-vous fait le ménage de vos abonnements (Netflix, gym, apps…) au cours des 6 derniers mois?',
    tip: 'Les abonnements s\'accumulent silencieusement. Passer ses relevés bancaires 15 minutes révèle souvent 2 à 4 services oubliés.',
    stat: 'En moyenne, les Québécois ont 3 à 5 abonnements actifs qu\'ils n\'utilisent pas, soit 60 à 120$ par mois qui partent à la poubelle.',
    savingMin: 60,
    savingMax: 120,
    unit: 'month',
  },
  {
    id: 'cellPhone',
    icon: '📲',
    question: 'Avez-vous comparé votre forfait cellulaire au cours des 12 derniers mois?',
    tip: 'Fizz, Public Mobile, Koodo et Freedom offrent souvent les mêmes services pour beaucoup moins. Ça vaut le coup de comparer.',
    stat: 'Changer pour un forfait compétitif peut économiser 20 à 50$ par mois, sans changer de téléphone.',
    savingMin: 20,
    savingMax: 50,
    unit: 'month',
  },
  {
    id: 'genericBrands',
    icon: '🏷️',
    question: 'Utilisez-vous des marques génériques ou maison pour au moins une partie de votre épicerie?',
    tip: 'Pour la majorité des produits alimentaires de base, la qualité est identique. Farine, pâtes, conserves, produits ménagers, les génériques font la job.',
    stat: 'Remplacer 40 à 50% de son panier par des marques maison réduit la facture d\'épicerie de 15 à 25%.',
    savingMin: 40,
    savingMax: 80,
    unit: 'month',
  },
  {
    id: 'creditCard',
    icon: '💳',
    question: 'Utilisez-vous une carte de crédit avec cashback ou points pour vos achats du quotidien?',
    tip: 'Utiliser la bonne carte (payée au complet chaque mois) sur les dépenses courantes, c\'est de l\'argent gratuit. Cartes populaires : Scotia Momentum, Rogers, CIBC Dividend.',
    stat: 'Une utilisation optimisée d\'une carte rewards génère en moyenne 300 à 600$ de retour par an.',
    savingMin: 300,
    savingMax: 600,
    unit: 'year',
  },
  {
    id: 'ghostPayments',
    icon: '👻',
    question: 'Avez-vous vérifié vos relevés bancaires récemment pour des paiements automatiques oubliés?',
    tip: 'Essai gratuit converti en abonnement, service dupliqué, ancienne plateforme jamais annulée, ça arrive à tout le monde.',
    stat: 'On estime que la majorité des gens ont au moins 1 à 2 paiements "fantômes" actifs, totalisant 30 à 80$ par mois.',
    savingMin: 30,
    savingMax: 80,
    unit: 'month',
  },
  {
    id: 'hydro',
    icon: '⚡',
    question: 'Évitez-vous d\'utiliser vos gros appareils (laveuse, sécheuse, lave-vaisselle) durant les heures de pointe d\'Hydro-Québec?',
    tip: 'Les heures de pointe sont de 6h à 9h et de 16h à 21h. Décaler ces tâches en soirée tardive ou la nuit peut réduire significativement votre facture.',
    stat: 'Utiliser les appareils hors-pointe peut réduire la facture Hydro de 15 à 30% pour les ménages qui chauffent à l\'électricité.',
    savingMin: 15,
    savingMax: 40,
    unit: 'month',
  },
  {
    id: 'advisorStrategy',
    icon: '🍽️',
    question: 'Savais-tu que le Québécois moyen dépense plus de 300$/mois au restaurant et en livraison, sais-tu ce que TOI tu dépenses?',
    tip: 'La livraison (Uber Eats, DoorDash) coûte en moyenne 30 à 40% plus cher qu\'aller au resto directement, une fois les frais, le pourboire et les prix majorés comptés. Cuisiner 2 repas de plus par semaine à la maison fait une vraie différence.',
    stat: 'Réduire de 2 sorties ou livraisons par semaine représente une économie moyenne de 100 à 180$/mois, soit jusqu\'à 2 160$/an.',
    savingMin: 100,
    savingMax: 180,
    unit: 'month',
  },
  {
    id: 'autoSavings',
    icon: '🔄',
    question: 'As-tu mis en place des virements automatiques vers ton épargne dès la réception de ta paie?',
    tip: '"Payez-vous en premier", virer automatiquement un montant fixe le jour de la paie avant de dépenser quoi que ce soit. Ce que tu ne vois pas, tu ne le dépenses pas.',
    stat: 'Les personnes qui automatisent leur épargne mettent de côté en moyenne 3x plus que celles qui épargnent ce qui reste à la fin du mois.',
    savingMin: 100,
    savingMax: 300,
    unit: 'month',
  },
];

export const SAVINGS_ITEMS_COUNT = QUIZ_ITEMS.length;

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

/** Économies annuelles potentielles détectées (réponses "non" ou "je sais pas"). */
export function computePotential(data: SavingsQuizData): { monthly: number; yearly: number } {
  let yearly = 0;
  for (const item of QUIZ_ITEMS) {
    if (data[item.id] === 'no' || data[item.id] === 'unknown') {
      yearly += item.unit === 'month' ? item.savingMin * 12 : item.savingMin;
    }
  }
  return { monthly: Math.round(yearly / 12), yearly };
}

export default function StepSavings({ data, onChange, onNext, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const item = QUIZ_ITEMS[index];
  const answer = data[item.id];
  const showTip = answer === 'no' || answer === 'unknown';
  const { yearly } = computePotential(data);

  const set = (val: SavingsAnswer) => onChange({ ...data, [item.id]: val });

  const goNext = () => {
    if (index < QUIZ_ITEMS.length - 1) setIndex((i) => i + 1);
    else onNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (index > 0) setIndex((i) => i - 1);
    else onBack();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pct = Math.round(((index + 1) / QUIZ_ITEMS.length) * 100);

  return (
    <div className="animate-fadeIn max-w-xl mx-auto px-4 pt-12 pb-44">
      {/* Progress on royal field */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold text-white">Astuce {index + 1} sur {QUIZ_ITEMS.length}</p>
          <p className="text-xs text-royal-100 font-medium">{pct}%</p>
        </div>
        <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Slide card */}
      <div key={item.id} className="bg-white rounded-[1.75rem] p-6 card-elevated animate-scaleUp">
        <div className="w-16 h-16 rounded-full bg-royal-50 flex items-center justify-center text-3xl mb-4">
          {item.icon}
        </div>
        <p className="font-display text-lg font-bold text-royal-900 mb-5 leading-snug">
          {item.question}
        </p>

        <div className="flex gap-2 mb-4">
          {(['yes', 'no', 'unknown'] as SavingsAnswer[]).map((opt) => {
            const labels: Record<string, string> = { yes: 'Oui', no: 'Non', unknown: 'Je sais pas' };
            const active = answer === opt;
            const colors = opt === 'yes'
              ? active ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-700 border-green-200 hover:border-green-400'
              : opt === 'no'
              ? active ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-600 border-red-200 hover:border-red-400'
              : active ? 'bg-royal-400 text-white border-royal-400' : 'bg-white text-royal-500 border-royal-200 hover:border-royal-400';
            return (
              <button
                key={opt}
                type="button"
                onClick={() => set(active ? null : opt)}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-all ${colors}`}
              >
                {labels[opt as string]}
              </button>
            );
          })}
        </div>

        {showTip && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 animate-fadeIn">
            <p className="text-sm text-amber-800 mb-2">{item.tip}</p>
            <p className="text-sm font-bold text-green-700">💡 {item.stat}</p>
          </div>
        )}
        {answer === 'yes' && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 animate-fadeIn">
            <p className="text-sm text-green-700 font-medium">✅ Super, tu es déjà sur la bonne voie!</p>
          </div>
        )}
      </div>

      {/* Bottom bar with floating action button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[1.75rem] shadow-[0_-8px_30px_-10px_rgba(21,58,138,0.25)]">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <button onClick={goBack} className="w-11 h-11 rounded-full border border-royal-200 text-royal-600 font-bold hover:bg-royal-50 transition flex items-center justify-center shrink-0">
            ←
          </button>

          <div className="text-center leading-tight">
            <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Économies potentielles</p>
            <p className="text-xl font-black text-green-700 transition-all duration-500">
              {fmt(yearly)}<span className="text-xs font-semibold text-green-600"> /an</span>
            </p>
          </div>

          <button
            onClick={goNext}
            className="h-11 px-5 rounded-full bg-gradient-to-r from-royal-500 to-royal-700 text-white font-bold hover:opacity-95 transition text-sm fab shrink-0"
          >
            {index < QUIZ_ITEMS.length - 1 ? (answer ? 'Suivant →' : 'Passer →') : 'Voir →'}
          </button>
        </div>
      </div>
    </div>
  );
}
