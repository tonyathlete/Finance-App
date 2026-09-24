import React from 'react';
import Wave from './Wave';

interface Props {
  onStart: () => void;
}

export default function StepSplash({ onStart }: Props) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col">
      {/* Wave background */}
      <div className="absolute inset-0">
        <Wave />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-4xl mb-6 animate-floatSlow">
          💸
        </div>
        <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-3">
          GoBudget<span className="text-royal-200">.ca</span>
        </h1>
        <p className="text-royal-100 text-lg max-w-xs leading-relaxed">
          Découvre où va ton argent et combien tu pourrais garder dans tes poches.
        </p>
      </div>

      {/* CTA */}
      <div className="relative px-8 pb-14">
        <button
          onClick={onStart}
          className="w-full bg-white text-royal-700 font-black text-lg py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          Commencer 🚀
        </button>
        <p className="text-center text-royal-100 text-sm mt-4">
          Gratuit · 3 minutes · sans engagement
        </p>
      </div>
    </div>
  );
}
