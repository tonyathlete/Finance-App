import React from 'react';
import { AvatarId } from '../types';

export const AVATARS: Record<AvatarId, { emoji: string; name: string; tagline: string; color: string }> = {
  bear:   { emoji: '🐻', name: 'Bruno l\'Épargnant', tagline: 'Décontracté & motivant', color: 'bg-amber-100 border-amber-300' },
  owl:    { emoji: '🦉', name: 'Olivia la Sage',     tagline: 'Experte & bienveillante', color: 'bg-purple-100 border-purple-300' },
  beaver: { emoji: '🦫', name: 'Castor Bâtisseur',   tagline: 'Protecteur & solide',    color: 'bg-green-100 border-green-300' },
};

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
    welcome:   "Salut! Moi c'est Castor 🦫 Je construis des finances solides comme des barrages!",
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

export function getAvatarMessage(avatar: AvatarId, key: string): string {
  return MESSAGES[avatar][key] ?? MESSAGES[avatar]['welcome'];
}

interface BubbleProps {
  avatar: AvatarId;
  messageKey: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarBubble({ avatar, messageKey, size = 'md' }: BubbleProps) {
  const { emoji, name, color } = AVATARS[avatar];
  const msg = getAvatarMessage(avatar, messageKey);
  const emojiSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-3xl';

  return (
    <div className="flex items-start gap-3 animate-fadeIn">
      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 shadow-sm ${color}`}>
        <span className={emojiSize}>{emoji}</span>
      </div>
      <div className="relative bg-white border border-blue-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-xs">
        <p className="text-xs font-bold text-blue-500 mb-0.5">{name}</p>
        <p className="text-sm text-blue-800 leading-snug">{msg}</p>
        <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t border-blue-100 rotate-[-45deg]" />
      </div>
    </div>
  );
}
