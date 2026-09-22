import React from 'react';

// Logo maison : une feuille stylisée (forêt) avec une nervure or.
// Symbolise la croissance / le « style de vie », aux couleurs de la marque.
export const BrandMark: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="13" fill="#1b3a2b" />
    {/* feuille */}
    <path
      d="M24 10c-8 3.5-13 9.5-13 17 0 4.6 2.6 8.3 6.4 10.2C18 30 21 24 27 20c-4.4 4.2-7 10-7.4 16.4 1.4.4 2.9.6 4.4.6 8.3 0 13-6 13-14.5C37 15.8 31.5 12 24 10Z"
      fill="#d4af37"
    />
    {/* nervure */}
    <path d="M24 11c-2.5 8-3 17-6.2 25.6" stroke="#1b3a2b" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
  </svg>
);

export const BrandLockup: React.FC<{ tone?: 'light' | 'dark'; sub?: string }> = ({ tone = 'dark', sub = 'Accompagnement financier' }) => {
  const nameColor = tone === 'light' ? 'text-white' : 'text-forest-900';
  const subColor = tone === 'light' ? 'text-forest-100/70' : 'text-forest-500';
  return (
    <div className="flex items-center gap-3">
      <BrandMark size={40} />
      <div className="leading-tight">
        <p className={`font-display font-semibold text-lg ${nameColor}`}>
          Boussole<span className="text-gold-400">·</span>
        </p>
        {sub && <p className={`text-xs ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
};
