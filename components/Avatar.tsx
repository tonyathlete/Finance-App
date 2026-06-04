import React from 'react';
import { AvatarId } from '../types';

export const AVATARS: Record<AvatarId, { name: string; tagline: string; color: string; bg: string }> = {
  bear:   { name: 'Bruno l\'Épargnant', tagline: 'Décontracté & motivant',  color: 'border-amber-300',  bg: 'bg-amber-50'  },
  owl:    { name: 'Olivia la Sage',     tagline: 'Experte & bienveillante', color: 'border-purple-300', bg: 'bg-purple-50' },
  beaver: { name: 'Castor Bâtisseur',  tagline: 'Protecteur & solide',     color: 'border-green-300',  bg: 'bg-green-50'  },
};

// ─── Expression types ────────────────────────────────────────────────────────
type Mood = 'happy' | 'excited' | 'thinking' | 'proud' | 'neutral';

const KEY_TO_MOOD: Record<string, Mood> = {
  welcome:   'excited',
  revenue:   'happy',
  fixed:     'thinking',
  variable:  'thinking',
  placements:'proud',
  lead:      'excited',
  great:     'proud',
  good:      'happy',
  improve:   'neutral',
};

// ─── Shared face helpers ─────────────────────────────────────────────────────
function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'excited' || mood === 'proud') {
    // Star / crescent eyes
    return (
      <g>
        <text x="34" y="54" fontSize="13" textAnchor="middle">★</text>
        <text x="66" y="54" fontSize="13" textAnchor="middle">★</text>
      </g>
    );
  }
  if (mood === 'thinking') {
    return (
      <g>
        {/* Left eye normal */}
        <circle cx="36" cy="50" r="6" fill="white" />
        <circle cx="36" cy="51" r="3.5" fill="#1e3a5f" />
        <circle cx="37.5" cy="49.5" r="1.2" fill="white" />
        {/* Right eye looking up */}
        <circle cx="64" cy="50" r="6" fill="white" />
        <circle cx="64" cy="48" r="3.5" fill="#1e3a5f" />
        <circle cx="65.5" cy="47" r="1.2" fill="white" />
        {/* Raised eyebrow right */}
        <path d="M58 42 Q64 39 70 41" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  // happy / neutral — big shiny eyes
  return (
    <g>
      <circle cx="36" cy="50" r="7" fill="white" />
      <circle cx="64" cy="50" r="7" fill="white" />
      <circle cx="36" cy="51" r="4" fill="#1e3a5f" />
      <circle cx="64" cy="51" r="4" fill="#1e3a5f" />
      <circle cx="38" cy="49" r="1.5" fill="white" />
      <circle cx="66" cy="49" r="1.5" fill="white" />
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  if (mood === 'excited' || mood === 'proud') {
    return <path d="M36 66 Q50 78 64 66" stroke="#c0392b" strokeWidth="2.5" fill="#ff6b6b" strokeLinecap="round" />;
  }
  if (mood === 'thinking') {
    return <path d="M38 68 Q50 65 62 68" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
  // happy / neutral
  return <path d="M37 66 Q50 76 63 66" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
}

function Blush({ mood }: { mood: Mood }) {
  if (mood === 'thinking' || mood === 'neutral') return null;
  return (
    <g opacity="0.45">
      <ellipse cx="24" cy="62" rx="9" ry="5" fill="#ff9999" />
      <ellipse cx="76" cy="62" rx="9" ry="5" fill="#ff9999" />
    </g>
  );
}

// ─── Bear SVG ────────────────────────────────────────────────────────────────
function BearSvg({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ears */}
      <circle cx="22" cy="28" r="14" fill="#c8843a" />
      <circle cx="22" cy="28" r="9"  fill="#e8a86a" />
      <circle cx="78" cy="28" r="14" fill="#c8843a" />
      <circle cx="78" cy="28" r="9"  fill="#e8a86a" />
      {/* Head */}
      <circle cx="50" cy="58" r="38" fill="#d4924a" />
      {/* Snout */}
      <ellipse cx="50" cy="68" rx="14" ry="10" fill="#e8b87a" />
      <ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#b06030" />
      {/* Face */}
      <Eyes mood={mood} />
      <Blush mood={mood} />
      <Mouth mood={mood} />
      {/* Sparkles when excited */}
      {(mood === 'excited' || mood === 'proud') && (
        <g fill="#fbbf24" fontSize="10">
          <text x="6"  y="25">✦</text>
          <text x="84" y="22">✦</text>
          <text x="90" y="45">✦</text>
        </g>
      )}
    </svg>
  );
}

// ─── Owl SVG ─────────────────────────────────────────────────────────────────
function OwlSvg({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ear tufts */}
      <ellipse cx="32" cy="20" rx="8" ry="13" fill="#7c5cbf" transform="rotate(-15 32 20)" />
      <ellipse cx="68" cy="20" rx="8" ry="13" fill="#7c5cbf" transform="rotate(15 68 20)" />
      {/* Body / head */}
      <ellipse cx="50" cy="65" rx="36" ry="42" fill="#9b7fd4" />
      {/* Chest feathers */}
      <ellipse cx="50" cy="80" rx="22" ry="24" fill="#c4aee8" />
      {/* Wing marks */}
      <ellipse cx="18" cy="72" rx="9" ry="18" fill="#7c5cbf" transform="rotate(-10 18 72)" />
      <ellipse cx="82" cy="72" rx="9" ry="18" fill="#7c5cbf" transform="rotate(10 82 72)" />
      {/* Big eye rings */}
      <circle cx="35" cy="52" r="14" fill="white" />
      <circle cx="65" cy="52" r="14" fill="white" />
      <circle cx="35" cy="52" r="11" fill="#f5f0ff" />
      <circle cx="65" cy="52" r="11" fill="#f5f0ff" />
      {/* Pupils */}
      {mood === 'excited' || mood === 'proud' ? (
        <g>
          <text x="28" y="58" fontSize="14" textAnchor="middle">★</text>
          <text x="72" y="58" fontSize="14" textAnchor="middle">★</text>
        </g>
      ) : mood === 'thinking' ? (
        <g>
          <circle cx="35" cy="52" r="6" fill="#2d1b69" />
          <circle cx="65" cy="49" r="6" fill="#2d1b69" />
          <circle cx="37" cy="50" r="2" fill="white" />
          <circle cx="67" cy="47" r="2" fill="white" />
        </g>
      ) : (
        <g>
          <circle cx="35" cy="53" r="7" fill="#2d1b69" />
          <circle cx="65" cy="53" r="7" fill="#2d1b69" />
          <circle cx="37" cy="51" r="2.5" fill="white" />
          <circle cx="67" cy="51" r="2.5" fill="white" />
        </g>
      )}
      {/* Glasses */}
      <circle cx="35" cy="52" r="13" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx="65" cy="52" r="13" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="48" y1="52" x2="52" y2="52" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="22" y1="50" x2="15" y2="48" stroke="#f59e0b" strokeWidth="2" />
      <line x1="78" y1="50" x2="85" y2="48" stroke="#f59e0b" strokeWidth="2" />
      {/* Beak */}
      <polygon points="50,62 44,68 56,68" fill="#f59e0b" />
      {/* Blush */}
      {mood !== 'thinking' && mood !== 'neutral' && (
        <g opacity="0.4">
          <ellipse cx="22" cy="62" rx="7" ry="4" fill="#ff9999" />
          <ellipse cx="78" cy="62" rx="7" ry="4" fill="#ff9999" />
        </g>
      )}
      {/* Sparkles */}
      {(mood === 'excited' || mood === 'proud') && (
        <g fill="#fbbf24" fontSize="10">
          <text x="5"  y="30">✦</text>
          <text x="85" y="28">✦</text>
        </g>
      )}
    </svg>
  );
}

// ─── Beaver SVG ───────────────────────────────────────────────────────────────
function BeaverSvg({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ears */}
      <ellipse cx="21" cy="32" rx="11" ry="14" fill="#8B5E3C" />
      <ellipse cx="21" cy="32" rx="7"  ry="10" fill="#c49a7a" />
      <ellipse cx="79" cy="32" rx="11" ry="14" fill="#8B5E3C" />
      <ellipse cx="79" cy="32" rx="7"  ry="10" fill="#c49a7a" />
      {/* Head */}
      <ellipse cx="50" cy="60" rx="37" ry="36" fill="#a0714f" />
      {/* Snout / cheeks (wide) */}
      <ellipse cx="50" cy="72" rx="20" ry="13" fill="#c49a7a" />
      {/* Nose */}
      <ellipse cx="50" cy="65" rx="6" ry="4" fill="#6b3a2a" />
      {/* Buck teeth */}
      <rect x="43" y="74" width="6.5" height="9" rx="2" fill="white" stroke="#e2d5c8" strokeWidth="0.5" />
      <rect x="50.5" y="74" width="6.5" height="9" rx="2" fill="white" stroke="#e2d5c8" strokeWidth="0.5" />
      <rect x="43" y="74" width="13" height="3.5" rx="1" fill="#f0e8e0" />
      {/* Eyes */}
      {mood === 'excited' || mood === 'proud' ? (
        <g fill="#5a3010" fontSize="15">
          <text x="34" y="58" textAnchor="middle">★</text>
          <text x="66" y="58" textAnchor="middle">★</text>
        </g>
      ) : mood === 'thinking' ? (
        <g>
          <circle cx="36" cy="52" r="7" fill="white" />
          <circle cx="64" cy="52" r="7" fill="white" />
          <circle cx="36" cy="53" r="4" fill="#2d1505" />
          <circle cx="64" cy="50" r="4" fill="#2d1505" />
          <circle cx="37.5" cy="51.5" r="1.3" fill="white" />
          <circle cx="65.5" cy="48.5" r="1.3" fill="white" />
          <path d="M58 43 Q64 40 70 42" stroke="#6b3a2a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="36" cy="52" r="7.5" fill="white" />
          <circle cx="64" cy="52" r="7.5" fill="white" />
          <circle cx="36" cy="53" r="4.5" fill="#2d1505" />
          <circle cx="64" cy="53" r="4.5" fill="#2d1505" />
          <circle cx="38" cy="51" r="1.8" fill="white" />
          <circle cx="66" cy="51" r="1.8" fill="white" />
        </g>
      )}
      {/* Blush */}
      {mood !== 'thinking' && mood !== 'neutral' && (
        <g opacity="0.4">
          <ellipse cx="22" cy="65" rx="9" ry="5" fill="#ff9999" />
          <ellipse cx="78" cy="65" rx="9" ry="5" fill="#ff9999" />
        </g>
      )}
      {/* Flat tail at bottom */}
      <ellipse cx="50" cy="108" rx="28" ry="10" fill="#6b4226" />
      <ellipse cx="50" cy="108" rx="22" ry="7"  fill="#7d5030" />
      {/* Tail texture lines */}
      <line x1="30" y1="105" x2="70" y2="105" stroke="#6b4226" strokeWidth="1" opacity="0.5" />
      <line x1="28" y1="109" x2="72" y2="109" stroke="#6b4226" strokeWidth="1" opacity="0.5" />
      {/* Hard hat when proud */}
      {mood === 'proud' && (
        <g>
          <rect x="25" y="22" width="50" height="8" rx="2" fill="#f59e0b" />
          <rect x="30" y="10" width="40" height="14" rx="4" fill="#f59e0b" />
        </g>
      )}
      {/* Sparkles */}
      {(mood === 'excited' || mood === 'proud') && (
        <g fill="#fbbf24" fontSize="10">
          <text x="5"  y="28">✦</text>
          <text x="85" y="25">✦</text>
        </g>
      )}
    </svg>
  );
}

// ─── Main character renderer ──────────────────────────────────────────────────
function CharacterSvg({ id, mood, size }: { id: AvatarId; mood: Mood; size: number }) {
  return (
    <div style={{ width: size, height: size }}>
      {id === 'bear'   && <BearSvg   mood={mood} />}
      {id === 'owl'    && <OwlSvg    mood={mood} />}
      {id === 'beaver' && <BeaverSvg mood={mood} />}
    </div>
  );
}

// ─── Tiny face for header ─────────────────────────────────────────────────────
export function AvatarFace({ avatar }: { avatar: AvatarId }) {
  return <CharacterSvg id={avatar} mood="happy" size={36} />;
}

// ─── Picker card character (large, animated) ──────────────────────────────────
export function AvatarCard({
  id, selected, onClick,
}: { id: AvatarId; selected: boolean; onClick: () => void }) {
  const av = AVATARS[id];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? `${av.color} ${av.bg} shadow-lg scale-105`
          : 'border-blue-100 bg-white hover:border-blue-300 hover:scale-102'
      }`}
    >
      <div className={`rounded-full p-1 transition-transform duration-300 ${selected ? 'animate-bounce' : ''}`}
           style={{ width: 90, height: 90 }}>
        <CharacterSvg id={id} mood={selected ? 'excited' : 'happy'} size={88} />
      </div>
      <p className="text-xs font-black text-blue-900 leading-tight text-center">{av.name}</p>
      <p className="text-xs text-blue-500 leading-tight text-center">{av.tagline}</p>
      {selected && (
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold animate-scaleUp">
          ✓ Choisi!
        </span>
      )}
    </button>
  );
}

// ─── Speech bubble used in each step ─────────────────────────────────────────
const MESSAGES: Record<AvatarId, Record<string, string>> = {
  bear: {
    welcome:   "Hey! Moi c'est Bruno 🐻 On va regarder ton budget ensemble, ça va bien aller!",
    revenue:   "Ton revenu c'est le moteur de tout! Plus il est gros, plus on a de fun! 💰",
    fixed:     "Les dépenses fixes... on peut pas trop les bouger, mais on peut les surveiller! 👀",
    variable:  "Ahh les petits plaisirs! C'est souvent ici qu'on cache des surprises 🍕",
    placements:"Épargner c'est se payer en premier! Même 50$/semaine fait une grosse différence 🌱",
    lead:      "Presque là! Donne-moi ton nom pis je te montre tout! 🎉",
    great:     "Wow, t'es bon! Ton score est en feu! 🔥",
    good:      "Pas pire pantoute! Quelques ajustements et tu vas être au top 💪",
    improve:   "On a du travail, mais ensemble on va arranger ça! Je suis là pour toi 🤝",
  },
  owl: {
    welcome:   "Bonjour! Je suis Olivia 🦉 Analysons ensemble votre situation financière.",
    revenue:   "Excellent. Le revenu est la pierre angulaire d'une bonne planification 📊",
    fixed:     "Les charges fixes sont prévisibles. C'est une bonne chose à optimiser 🏠",
    variable:  "Les dépenses variables cachent souvent les meilleures opportunités d'épargne 🔍",
    placements:"Investir tôt, c'est la stratégie des gens qui réussissent financièrement 📈",
    lead:      "Parfait! Votre analyse personnalisée vous attend... 🎓",
    great:     "Impressionnant! Votre gestion financière est exemplaire 🌟",
    good:      "Bonne base. Avec quelques ajustements, vous atteindrez l'excellence 📐",
    improve:   "Ne vous découragez pas. Chaque grand voyage commence par un premier pas 🦉",
  },
  beaver: {
    welcome:   "Salut! Moi c'est Castor! Je construis des finances solides comme des barrages! 🦫",
    revenue:   "Bon revenu = bonnes fondations! C'est parti pour construire quelque chose de solide 🪨",
    fixed:     "Les dépenses fixes, c'est les poutres de ta maison financière. On les surveille! 🔩",
    variable:  "Ces dépenses-là, c'est là qu'on peut trouver du bois pour agrandir l'épargne! 🌲",
    placements:"Chaque dollar épargné est une brique de plus dans ta forteresse financière 🏰",
    lead:      "Dernière étape avant ton rapport complet! Tu mérites de savoir où tu en es 🦫",
    great:     "Solide comme un barrage! Ton budget est béton 🏗️",
    good:      "Bonne structure! On va renforcer quelques poutres ensemble 🔨",
    improve:   "On reconstruit ensemble! C'est correct de partir de zéro 💪",
  },
};

interface BubbleProps {
  avatar: AvatarId;
  messageKey: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarBubble({ avatar, messageKey, size = 'md' }: BubbleProps) {
  const { name, color, bg } = AVATARS[avatar];
  const mood = KEY_TO_MOOD[messageKey] ?? 'happy';
  const msg = MESSAGES[avatar][messageKey] ?? MESSAGES[avatar]['welcome'];
  const charSize = size === 'sm' ? 40 : size === 'lg' ? 72 : 56;

  return (
    <div className="flex items-end gap-3 animate-fadeIn">
      <div className={`rounded-full border-2 flex-shrink-0 overflow-hidden ${color} ${bg} shadow-sm`}
           style={{ width: charSize, height: charSize, padding: 3 }}>
        <CharacterSvg id={avatar} mood={mood} size={charSize - 6} />
      </div>
      <div className="relative bg-white border border-blue-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-xs">
        <p className="text-xs font-bold text-blue-400 mb-0.5">{name}</p>
        <p className="text-sm text-blue-800 leading-snug">{msg}</p>
      </div>
    </div>
  );
}
