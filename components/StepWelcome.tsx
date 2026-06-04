import React, { useState } from 'react';
import { AvatarId } from '../types';
import { AVATARS } from './Avatar';

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
          {avatarEntries.map(([id, av]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                selected === id
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                  : 'border-blue-100 bg-white hover:border-blue-300'
              }`}
            >
              <span className="text-5xl">{av.emoji}</span>
              <p className="text-xs font-black text-blue-900 leading-tight">{av.name}</p>
              <p className="text-xs text-blue-500 leading-tight">{av.tagline}</p>
              {selected === id && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold animate-scaleUp">
                  ✓ Choisi!
                </span>
              )}
            </button>
          ))}
        </div>

        {selected && (
          <div className="animate-scaleUp">
            <div className={`flex items-start gap-3 mb-6 max-w-sm text-left ${AVATARS[selected].color} border rounded-2xl p-4`}>
              <span className="text-3xl">{AVATARS[selected].emoji}</span>
              <div>
                <p className="text-xs font-bold text-blue-600 mb-1">{AVATARS[selected].name}</p>
                <p className="text-sm text-blue-800">
                  {selected === 'bear' && "Hey! Moi c'est Bruno 🐻 On va regarder ton budget ensemble, ça va bien aller!"}
                  {selected === 'owl' && "Bonjour! Je suis Olivia 🦉 Analysons ensemble votre situation financière avec rigueur."}
                  {selected === 'beaver' && "Salut! Moi c'est Castor 🦫 Je construis des finances solides comme des barrages!"}
                </p>
              </div>
            </div>

            <button
              onClick={() => onStart(selected)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              C'est parti avec {AVATARS[selected].emoji} →
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
