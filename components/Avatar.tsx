import React from 'react';
import { AvatarId } from '../types';

export const AVATARS: Record<AvatarId, { name: string; tagline: string; color: string; bg: string; seed: string; bgColor: string }> = {
  bear:   { name: "Bruno l'Épargnant", tagline: 'Décontracté & motivant',  color: 'border-amber-300',  bg: 'bg-amber-50',  seed: 'Bruno',  bgColor: 'fde68a' },
  owl:    { name: 'Olivia la Sage',    tagline: 'Experte & bienveillante', color: 'border-purple-300', bg: 'bg-purple-50', seed: 'Olivia', bgColor: 'ddd6fe' },
  beaver: { name: 'Castor Bâtisseur', tagline: 'Protecteur & solide',     color: 'border-green-300',  bg: 'bg-green-50',  seed: 'Castor', bgColor: 'bbf7d0' },
};

// ─── Expression types ─────────────────────────────────────────────────────────
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

// DiceBear adventurer: vary mouth & eyes per mood
const MOOD_PARAMS: Record<Mood, string> = {
  excited: 'mouth=laughing&eyes=variant26&eyebrows=variant10',
  happy:   'mouth=smile&eyes=variant04&eyebrows=variant03',
  proud:   'mouth=smile&eyes=variant24&eyebrows=variant12',
  thinking:'mouth=variant04&eyes=variant21&eyebrows=variant07',
  neutral: 'mouth=variant02&eyes=variant01&eyebrows=variant01',
};

function dicebearUrl(seed: string, bgColor: string, mood: Mood, size: number) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&${MOOD_PARAMS[mood]}&backgroundColor=${bgColor}&backgroundType=solid&radius=50&size=${size}`;
}

// ─── Tiny face for header ─────────────────────────────────────────────────────
export function AvatarFace({ avatar }: { avatar: AvatarId }) {
  const { seed, bgColor, color, bg } = AVATARS[avatar];
  return (
    <img
      src={dicebearUrl(seed, bgColor, 'happy', 80)}
      alt={AVATARS[avatar].name}
      className={`w-full h-full rounded-full object-cover border-2 ${color}`}
    />
  );
}

// ─── Picker card ──────────────────────────────────────────────────────────────
export function AvatarCard({ id, selected, onClick }: { id: AvatarId; selected: boolean; onClick: () => void }) {
  const av = AVATARS[id];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? `${av.color} ${av.bg} shadow-lg scale-105`
          : 'border-blue-100 bg-white hover:border-blue-300 hover:scale-105'
      }`}
    >
      <img
        src={dicebearUrl(av.seed, av.bgColor, selected ? 'excited' : 'happy', 180)}
        alt={av.name}
        className={`w-24 h-24 rounded-full shadow-md transition-transform duration-300 ${selected ? 'scale-110' : ''}`}
      />
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
  const { name, seed, bgColor, color } = AVATARS[avatar];
  const mood = KEY_TO_MOOD[messageKey] ?? 'happy';
  const msg = MESSAGES[avatar][messageKey] ?? MESSAGES[avatar]['welcome'];
  const imgPx = size === 'sm' ? 40 : size === 'lg' ? 72 : 56;

  return (
    <div className="flex items-end gap-3 animate-fadeIn">
      <img
        src={dicebearUrl(seed, bgColor, mood, imgPx * 2)}
        alt={name}
        className={`rounded-full border-2 flex-shrink-0 shadow-sm ${color}`}
        style={{ width: imgPx, height: imgPx }}
      />
      <div className="relative bg-white border border-blue-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-xs">
        <p className="text-xs font-bold text-blue-400 mb-0.5">{name}</p>
        <p className="text-sm text-blue-800 leading-snug">{msg}</p>
      </div>
    </div>
  );
}
