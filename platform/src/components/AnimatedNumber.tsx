import React from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Compteur animé : fait défiler la valeur de 0 (ou de la valeur précédente) jusqu'à la cible.
export const AnimatedNumber: React.FC<{
  value: number;
  format?: (n: number) => string;
  duration?: number;
}> = ({ value, format = (n) => String(Math.round(n)), duration = 900 }) => {
  const [display, setDisplay] = React.useState(prefersReduced() ? value : 0);
  const fromRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (prefersReduced()) { setDisplay(value); return; }
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (value - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{format(display)}</>;
};
