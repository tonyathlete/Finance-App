import React from 'react';

/**
 * Deux-tons de bleu royal en vague, comme la maquette.
 * Se place en fond de la portion haute d'un écran (royal-600).
 */
export default function Wave({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 375 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="375" height="320" fill="#2560d6" />
      <path
        d="M375 0v210c-60 34-120 12-190-14C120 172 60 168 0 196V0h375Z"
        fill="#1e4ec0"
        opacity="0.55"
      />
      <path
        d="M375 0v150c-70 40-150 30-230 2C85 130 40 132 0 150V0h375Z"
        fill="#4a83f2"
        opacity="0.35"
      />
    </svg>
  );
}
