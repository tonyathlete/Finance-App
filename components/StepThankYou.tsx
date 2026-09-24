import React from 'react';
import { LeadInfo } from '../types';
import Wave from './Wave';

interface Props {
  lead: LeadInfo;
  potentialYearly: number;
  onReset: () => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

export default function StepThankYou({ lead, potentialYearly, onReset }: Props) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      {/* Royal hero with wave + check */}
      <div className="relative h-64 shrink-0">
        <Wave />
        <div className="relative flex flex-col items-center justify-center h-full text-center px-6 animate-fadeIn">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-green-500 shadow-xl mb-4 animate-scaleUp">
            ✓
          </div>
          <h1 className="font-display text-3xl font-black text-white">
            Merci {lead.firstName}! 🎉
          </h1>
        </div>
      </div>

      {/* White sheet */}
      <div className="relative flex-1 bg-white rounded-t-[2rem] -mt-6 px-6 pt-7 pb-10 text-center animate-fadeIn">
        <p className="text-royal-700 text-lg leading-relaxed mb-6">
          Je te contacte personnellement dans les <strong>prochaines 24 heures</strong> au numéro que tu m'as
          laissé, pour une courte discussion de 10 minutes.
        </p>

        {potentialYearly > 0 && (
          <div className="bg-royal-50 border border-royal-100 rounded-2xl p-5 mb-6">
            <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-1">
              Ton potentiel d'économies déjà détecté
            </p>
            <p className="text-4xl font-black text-green-700">
              {fmt(potentialYearly)}<span className="text-lg font-semibold text-green-600"> /an</span>
            </p>
            <p className="text-royal-500 text-sm mt-2">
              Et on n'a même pas encore regardé ta situation au complet ensemble.
            </p>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-8 text-left">
          <p className="text-sm font-bold text-royal-800 mb-1">📅 Ce qui s'en vient</p>
          <p className="text-sm text-royal-600">
            Un appel sans pression, sans jargon. On regarde où tu peux garder plus d'argent dans tes poches,
            c'est tout.
          </p>
        </div>

        <button
          onClick={onReset}
          className="text-royal-500 text-sm font-medium hover:underline"
        >
          ↻ Recommencer
        </button>
      </div>
    </div>
  );
}
