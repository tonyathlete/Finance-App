import React from 'react';
import { LeadInfo } from '../types';

interface Props {
  lead: LeadInfo;
  potentialYearly: number;
  onReset: () => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

export default function StepThankYou({ lead, potentialYearly, onReset }: Props) {
  return (
    <div className="animate-fadeIn min-h-screen flex flex-col justify-center max-w-xl mx-auto px-6 py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-green-200 animate-scaleUp">
        ✓
      </div>

      <h1 className="font-display text-3xl font-black text-blue-900 mb-3">
        Merci {lead.firstName}! C'est noté. 🎉
      </h1>
      <p className="text-blue-600 text-lg leading-relaxed mb-6">
        Je te contacte personnellement dans les <strong>prochaines 24 heures</strong> au numéro que tu m'as
        laissé, pour une courte discussion de 10 minutes.
      </p>

      {potentialYearly > 0 && (
        <div className="bg-white border border-green-100 rounded-2xl p-5 card-elevated mb-6">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-1">
            Ton potentiel d'économies déjà détecté
          </p>
          <p className="text-4xl font-black text-green-800">
            {fmt(potentialYearly)}<span className="text-lg font-semibold text-green-600"> /an</span>
          </p>
          <p className="text-blue-500 text-sm mt-2">
            Et on n'a même pas encore regardé ta situation au complet ensemble.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-8 text-left">
        <p className="text-sm font-bold text-blue-800 mb-1">📅 Ce qui s'en vient</p>
        <p className="text-sm text-blue-600">
          Un appel sans pression, sans jargon. On regarde où tu peux garder plus d'argent dans tes poches —
          c'est tout.
        </p>
      </div>

      <button
        onClick={onReset}
        className="text-blue-500 text-sm font-medium hover:underline"
      >
        ↻ Recommencer
      </button>
    </div>
  );
}
