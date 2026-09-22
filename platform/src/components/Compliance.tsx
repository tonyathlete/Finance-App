import React from 'react';
import { Card } from './ui';
import { useApp } from '@/context/AppContext';

// Avis de non-responsabilité — obligations d'information (encadrement AMF).
// Cet outil est un soutien pédagogique/budgétaire, PAS un conseil personnalisé
// ni une recommandation de produit financier.
export const Disclaimer: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <p className="text-xs text-forest-400 leading-relaxed">
        <i className="fas fa-circle-info mr-1" />
        Outil budgétaire à titre informatif seulement. Ne constitue pas un conseil
        financier, fiscal ou juridique personnalisé.
      </p>
    );
  }
  return (
    <Card className="p-4 bg-paper-50 border-paper-300">
      <div className="flex gap-3">
        <i className="fas fa-scale-balanced text-gold-500 mt-0.5" />
        <div className="text-xs text-forest-500 leading-relaxed space-y-1">
          <p className="font-semibold text-forest-700">Avis important</p>
          <p>
            Cette plateforme est un outil éducatif et de suivi budgétaire. Les
            informations affichées ne constituent pas un conseil financier, une
            recommandation de produit, ni une analyse de besoins financiers au sens
            de la réglementation de l'Autorité des marchés financiers (AMF). Aucun
            rendement n'est garanti. Pour toute décision, une analyse personnalisée
            avec votre conseiller certifié est requise.
          </p>
        </div>
      </div>
    </Card>
  );
};

// Bandeau d'identification du conseiller (obligation d'identification AMF).
export const AdvisorIdentity: React.FC = () => {
  const { state } = useApp();
  const a = state.advisor;
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest-400 mb-2">
        Votre conseiller
      </p>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-forest-600 text-white flex items-center justify-center font-display font-semibold">
          {a.fullName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="text-sm">
          <p className="font-semibold text-forest-900">{a.fullName}</p>
          <p className="text-forest-500">{a.title}</p>
          <p className="text-forest-400 text-xs mt-0.5">
            {a.firm} · Certificat AMF&nbsp;: {a.amfNumber}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Note de confidentialité / minimisation des données (Loi 25).
export const PrivacyNote: React.FC = () => (
  <p className="text-xs text-forest-400 leading-relaxed">
    <i className="fas fa-lock mr-1 text-forest-400" />
    Confidentialité (Loi 25)&nbsp;: seules les données nécessaires à votre suivi
    budgétaire sont recueillies. Aucune donnée sensible (NAS, numéros de police ou
    de compte, renseignements médicaux) n'est demandée ni conservée. Vous pouvez
    demander la consultation ou la suppression de vos données en tout temps.
  </p>
);
