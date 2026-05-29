import React from 'react';

interface Props {
  onStart: () => void;
}

export default function StepWelcome({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center animate-fadeIn">
      {/* Illustration area */}
      <div className="mb-8 relative">
        <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center mx-auto shadow-lg">
          <span className="text-5xl">💰</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">✓</div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-amber-900 leading-tight mb-4 max-w-2xl">
        Découvrez où va votre argent chaque mois
      </h1>
      <p className="text-lg text-amber-700 max-w-xl mb-10 leading-relaxed">
        Répondez à quelques questions simples et obtenez une <strong>analyse gratuite</strong> de votre budget avec des recommandations personnalisées.
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-amber-800">
        <span className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <span>⏱️</span> 3 minutes
        </span>
        <span className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <span>🔒</span> 100% confidentiel
        </span>
        <span className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <span>🎯</span> Analyse personnalisée
        </span>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Commencer mon analyse gratuite →
      </button>

      <p className="mt-6 text-sm text-amber-600">
        Déjà plus de <strong>1 200 familles canadiennes</strong> ont découvert leur portrait financier
      </p>
    </div>
  );
}
