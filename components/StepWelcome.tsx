import React, { useState } from 'react';
import { AvatarId } from '../types';
import { AVATARS, AvatarCard, AvatarBubble } from './Avatar';

interface Props {
  onStart: (avatar: AvatarId) => void;
}

export default function StepWelcome({ onStart }: Props) {
  const [selected, setSelected] = useState<AvatarId | null>(null);
  const [phase, setPhase] = useState<'hero' | 'pick'>('hero');

  const avatarEntries = Object.entries(AVATARS) as [AvatarId, typeof AVATARS[AvatarId]][];

  if (phase === 'pick') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center animate-fadeIn">
        <h2 className="text-2xl font-black text-blue-900 mb-1">Choisis ton coach</h2>
        <p className="text-blue-500 text-sm mb-8">Il va t'accompagner pendant toute l'analyse</p>

        <div className="grid grid-cols-3 gap-4 max-w-lg w-full mb-8">
          {avatarEntries.map(([id]) => (
            <AvatarCard key={id} id={id} selected={selected === id} onClick={() => setSelected(id)} />
          ))}
        </div>

        {selected && (
          <div className="animate-scaleUp flex flex-col items-center gap-5">
            <AvatarBubble avatar={selected} messageKey="welcome" size="lg" />
            <button
              onClick={() => onStart(selected)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Allons-y →
            </button>
          </div>
        )}

        <button onClick={() => setPhase('hero')} className="mt-6 text-sm text-blue-400 hover:underline">
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto animate-fadeIn">

      <div className="mb-10">
        <p className="text-blue-500 font-semibold text-sm mb-3 uppercase tracking-widest">Outil gratuit</p>
        <h1 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight mb-5">
          Sais-tu vraiment<br />où va ton argent?
        </h1>
        <p className="text-blue-700 text-lg leading-relaxed max-w-lg">
          La plupart des gens sont surpris quand ils voient les chiffres.
          Prends 3 minutes — on fait le tour ensemble.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-black text-blue-600 text-sm">1</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">Tu remplis ton budget en 3 minutes</p>
            <p className="text-blue-500 text-sm">Revenus, dépenses, épargne — juste les grandes lignes</p>
          </div>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-black text-blue-600 text-sm">2</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">On analyse tout automatiquement</p>
            <p className="text-blue-500 text-sm">Score, comparaison avec la moyenne québécoise, points à améliorer</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-black text-blue-600 text-sm">3</span>
          </div>
          <div>
            <p className="font-bold text-blue-900">Tu reçois un plan d'action concret</p>
            <p className="text-blue-500 text-sm">Avec un appel gratuit d'un conseiller si tu le veux</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setPhase('pick')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 self-start"
      >
        Commencer — c'est gratuit →
      </button>

      <p className="mt-5 text-sm text-blue-400">
        Plus de 1 200 familles québécoises ont déjà fait l'exercice.
      </p>
    </div>
  );
}
