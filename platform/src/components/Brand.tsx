import React from 'react';

// Monogramme « AG » en serif doré (marque Anthony Goulet).
export const BrandMark: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <span
    className={`font-display font-semibold text-gold-400 leading-none select-none ${className}`}
    style={{ fontSize: size, letterSpacing: '-0.02em' }}
    aria-hidden="true"
  >
    AG
  </span>
);

// Logo complet : « AG » + « ANTHONY GOULET » en capitales espacées.
export const BrandLockup: React.FC<{ tone?: 'light' | 'dark'; sub?: string }> = ({ tone = 'dark', sub }) => {
  const nameColor = tone === 'light' ? 'text-paper-50' : 'text-forest-900';
  const subColor = tone === 'light' ? 'text-forest-100/70' : 'text-forest-500';
  return (
    <div className="flex items-center gap-3">
      <span className="font-display font-semibold text-gold-400 text-3xl leading-none" style={{ letterSpacing: '-0.02em' }}>
        AG
      </span>
      <span className="h-7 w-px bg-gold-400/40" />
      <div className="leading-tight">
        <p className={`font-display uppercase tracking-[0.18em] text-base sm:text-lg ${nameColor}`}>
          Anthony Goulet
        </p>
        {sub && <p className={`text-[11px] uppercase tracking-[0.15em] ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
};
