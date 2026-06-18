import React from 'react';

interface Props {
  onStart: () => void;
}

export default function StepWelcome({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto animate-fadeIn">

      <div className="mb-10">
        <p className="text-[#1B4332] font-semibold text-sm mb-3 uppercase tracking-widest">Outil gratuit</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#142420] leading-tight mb-5">
          Sais-tu vraiment<br />où va ton argent?
        </h1>
        <p className="text-[#142420]/70 text-lg leading-relaxed max-w-lg">
          La plupart des gens sont surpris quand ils voient les chiffres.
          Prends 3 minutes — on fait le tour ensemble.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 border border-[#D8DCD3] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-mono-data font-bold text-[#1B4332] text-sm">1</span>
          </div>
          <div>
            <p className="font-bold text-[#142420]">Tu remplis ton budget en 3 minutes</p>
            <p className="text-[#142420]/60 text-sm">Revenus, dépenses, épargne — juste les grandes lignes</p>
          </div>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 border border-[#D8DCD3] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-mono-data font-bold text-[#1B4332] text-sm">2</span>
          </div>
          <div>
            <p className="font-bold text-[#142420]">On analyse tout automatiquement</p>
            <p className="text-[#142420]/60 text-sm">Score, comparaison avec la moyenne québécoise, points à améliorer</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border border-[#D8DCD3] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-mono-data font-bold text-[#1B4332] text-sm">3</span>
          </div>
          <div>
            <p className="font-bold text-[#142420]">Tu reçois un plan d'action concret</p>
            <p className="text-[#142420]/60 text-sm">Avec un appel gratuit d'un conseiller si tu le veux</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-[#1B4332] hover:bg-[#142420] text-[#FBFBF9] font-bold text-lg px-8 py-4 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 self-start"
      >
        Commencer — c'est gratuit →
      </button>

      <p className="mt-5 text-sm text-[#142420]/50">
        Plus de 1 200 familles québécoises ont déjà fait l'exercice.
      </p>
    </div>
  );
}
