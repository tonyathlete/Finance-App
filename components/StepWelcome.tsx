import React from 'react';

interface Props {
  onStart: () => void;
}

export default function StepWelcome({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto animate-fadeIn relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-floatSlow" />
      <div className="absolute top-1/3 -left-24 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }} />

      <div className="mb-10 relative">
        <span className="inline-block text-blue-600 font-bold text-xs mb-4 uppercase tracking-widest bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-200">
          Outil gratuit
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-blue-900 leading-[1.1] mb-5 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Sais-tu vraiment<br />où va ton argent?
        </h1>
        <p className="text-blue-700 text-lg leading-relaxed max-w-lg">
          La plupart des gens sont surpris quand ils voient les chiffres.
          Prends 3 minutes — on fait le tour ensemble.
        </p>
      </div>

      <div className="mb-10 relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-blue-500/30">
            <span className="font-black text-white text-sm">1</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">Tu remplis ton budget en 3 minutes</p>
            <p className="text-blue-500 text-sm">Revenus, dépenses, épargne — juste les grandes lignes</p>
          </div>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-blue-500/30">
            <span className="font-black text-white text-sm">2</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">On analyse tout automatiquement</p>
            <p className="text-blue-500 text-sm">Score, comparaison avec la moyenne québécoise, points à améliorer</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-blue-500/30">
            <span className="font-black text-white text-sm">3</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">Tu reçois un plan d'action concret</p>
            <p className="text-blue-500 text-sm">Avec un appel gratuit d'un conseiller si tu le veux</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95 self-start"
      >
        Commencer — c'est gratuit →
      </button>

      <p className="mt-5 text-sm text-blue-400 relative">
        Plus de 1 200 familles québécoises ont déjà fait l'exercice.
      </p>
    </div>
  );
}
