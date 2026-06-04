import React from 'react';
import { AvatarId } from '../types';

export const AVATARS: Record<AvatarId, { name: string; tagline: string; color: string; bg: string; gradient: string }> = {
  bear:   { name: "Bruno l'Épargnant", tagline: 'Décontracté & motivant',  color: 'border-amber-300',  bg: 'bg-amber-50',  gradient: 'from-amber-200 to-amber-300'  },
  owl:    { name: 'Olivia la Sage',    tagline: 'Experte & bienveillante', color: 'border-purple-300', bg: 'bg-purple-50', gradient: 'from-purple-200 to-purple-300' },
  beaver: { name: 'Castor Bâtisseur', tagline: 'Protecteur & solide',     color: 'border-green-300',  bg: 'bg-green-50',  gradient: 'from-green-200 to-green-300'  },
};

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

// Each mood = different emoji expression per character
const MOOD_EMOJI: Record<AvatarId, Record<Mood, string>> = {
  bear: {
    excited: '🐻',
    happy:   '🐻',
    proud:   '🐻',
    thinking:'🐻',
    neutral: '🐻',
  },
  owl: {
    excited: '🦉',
    happy:   '🦉',
    proud:   '🦉',
    thinking:'🦉',
    neutral: '🦉',
  },
  beaver: {
    excited: '🦫',
    happy:   '🦫',
    proud:   '🦫',
    thinking:'🦫',
    neutral: '🦫',
  },
};

// Mood overlay accessories shown as extra emoji
const MOOD_ACCESSORY: Record<Mood, string> = {
  excited: '🎉',
  happy:   '😊',
  proud:   '🏆',
  thinking:'💭',
  neutral: '',
};

// ─── Avatar display with mood ring ───────────────────────────────────────────
function AvatarEmoji({ avatar, mood, size }: { avatar: AvatarId; mood: Mood; size: 'sm' | 'md' | 'lg' | 'xl' }) {
  const { gradient, color } = AVATARS[avatar];
  const emoji = MOOD_EMOJI[avatar][mood];
  const accessory = MOOD_ACCESSORY[mood];

  const dims: Record<string, { outer: string; fontSize: string; acc: string }> = {
    sm: { outer: 'w-10 h-10', fontSize: 'text-2xl',  acc: 'text-xs -top-1 -right-1' },
    md: { outer: 'w-14 h-14', fontSize: 'text-3xl',  acc: 'text-sm -top-1 -right-1' },
    lg: { outer: 'w-20 h-20', fontSize: 'text-5xl',  acc: 'text-base -top-1 -right-2' },
    xl: { outer: 'w-24 h-24', fontSize: 'text-6xl',  acc: 'text-lg -top-2 -right-2' },
  };
  const d = dims[size];

  return (
    <div className={`relative flex-shrink-0 ${d.outer}`}>
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} border-2 ${color} flex items-center justify-center shadow-md`}>
        <span className={d.fontSize} style={{ lineHeight: 1 }}>{emoji}</span>
      </div>
      {accessory && (
        <span className={`absolute ${d.acc} ${d.acc.includes('text-xs') ? 'w-5 h-5' : 'w-6 h-6'} bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100`}
              style={{ fontSize: size === 'sm' ? 10 : size === 'md' ? 12 : 14 }}>
          {accessory}
        </span>
      )}
    </div>
  );
}

// ─── Header face ─────────────────────────────────────────────────────────────
export function AvatarFace({ avatar }: { avatar: AvatarId }) {
  return <AvatarEmoji avatar={avatar} mood="happy" size="sm" />;
}

// ─── Picker card ─────────────────────────────────────────────────────────────
export function AvatarCard({ id, selected, onClick }: { id: AvatarId; selected: boolean; onClick: () => void }) {
  const av = AVATARS[id];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? `${av.color} ${av.bg} shadow-xl scale-105`
          : 'border-blue-100 bg-white hover:border-blue-300 hover:scale-105 hover:shadow-md'
      }`}
    >
      <AvatarEmoji avatar={id} mood={selected ? 'excited' : 'happy'} size="xl" />
      <p className="text-sm font-black text-blue-900 leading-tight text-center">{av.name}</p>
      <p className="text-xs text-blue-500 leading-tight text-center">{av.tagline}</p>
      {selected && (
        <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-bold animate-scaleUp shadow-sm">
          ✓ Choisi!
        </span>
      )}
    </button>
  );
}

// ─── Speech bubble ────────────────────────────────────────────────────────────
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
  const { name } = AVATARS[avatar];
  const mood = KEY_TO_MOOD[messageKey] ?? 'happy';
  const msg = MESSAGES[avatar][messageKey] ?? MESSAGES[avatar]['welcome'];
  const bubbleSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md';

  return (
    <div className="flex items-end gap-3 animate-fadeIn">
      <AvatarEmoji avatar={avatar} mood={mood} size={bubbleSize} />
      <div className="relative bg-white border border-blue-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-xs">
        <p className="text-xs font-bold text-blue-400 mb-0.5">{name}</p>
        <p className="text-sm text-blue-800 leading-snug">{msg}</p>
      </div>
    </div>
  );
}
