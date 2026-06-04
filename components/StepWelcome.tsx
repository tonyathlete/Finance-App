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
        <p className="text-4xl mb-3">🎮</p>
        <h2 className="text-2xl font-black text-blue-900 mb-2">Choisis ton coach budget!</h2>
        <p className="text-blue-600 text-sm mb-8">Il t'accompagnera tout au long de l'analyse 🏆</p>

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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              C'est parti avec {AVATARS[selected].name.split(' ')[0]} →
            </button>
          </div>
        )}

        <button
          onClick={() => setPhase('hero')}
          className="mt-6 text-sm text-blue-500 hover:underline"
        >
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center animate-fadeIn">
      <div className="mb-8 relative">
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mx-auto shadow-lg">
          <span className="text-5xl">💰</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">✓</div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-blue-900 leading-tight mb-4 max-w-2xl">
        Découvrez où va votre argent chaque mois
      </h1>
      <p className="text-lg text-blue-700 max-w-xl mb-10 leading-relaxed">
        Répondez à quelques questions simples et obtenez une <strong>analyse gratuite</strong> de votre budget avec des recommandations personnalisées.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-blue-800">
        <span className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
          <span>⏱️</span> 3 minutes
        </span>
        <span className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
          <span>🔒</span> 100% confidentiel
        </span>
        <span className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
          <span>🎮</span> Avec un coach personnel
        </span>
      </div>

      <button
        onClick={() => setPhase('pick')}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Choisir mon coach & commencer →
      </button>

      <p className="mt-6 text-sm text-blue-600">
        Déjà plus de <strong>1 200 familles québécoises</strong> ont découvert leur portrait financier
      </p>
    </div>
  );
}
