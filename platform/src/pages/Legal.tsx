import React from 'react';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/Brand';
import { Card } from '@/components/ui';

// Page publique : mentions légales, conditions d'utilisation, avis AMF/Loi 25.
// ⚠️ Texte à faire valider par la conformité du cabinet et/ou un conseiller juridique.
export const Legal: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { state } = useApp();
  const a = state.advisor;

  return (
    <div className="min-h-screen bg-paper-50">
      <header className="bg-forest-800 text-paper-50">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <BrandLockup tone="light" sub="Mentions légales" />
          {onBack && (
            <button onClick={onBack} className="text-sm text-forest-100/80 hover:text-white">
              <i className="fas fa-arrow-left mr-1" /> Retour
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">
            Conditions d'utilisation & avis importants
          </h1>
          <p className="text-forest-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="p-6 space-y-6 text-sm text-forest-700 leading-relaxed">
          <Section n="1" title="Nature de l'outil — aucun conseil financier">
            <p>
              Cette plateforme est un <strong>outil éducatif et de suivi budgétaire</strong>. Elle
              vise à vous aider à visualiser vos finances, fixer des objectifs et suivre votre
              progression. Les renseignements, calculs, projections, graphiques et suggestions
              qui y figurent sont fournis <strong>à titre informatif et pédagogique uniquement</strong>.
            </p>
            <p>
              Ils ne constituent <strong>pas</strong> un conseil financier, fiscal, comptable, juridique,
              d'assurance ou de placement personnalisé, <strong>ni une recommandation de produit</strong>,
              ni une analyse de besoins financiers, ni une planification financière au sens de la
              réglementation applicable, notamment celle de l'<strong>Autorité des marchés financiers
              (AMF)</strong> du Québec.
            </p>
          </Section>

          <Section n="2" title="Projections et absence de garantie">
            <p>
              Les projections (retraite, remboursement de dettes, objectifs, etc.) reposent sur des
              <strong> hypothèses simplifiées</strong> que vous saisissez ou qui sont préétablies. Elles
              ne tiennent pas nécessairement compte de l'inflation, des impôts, des frais, des
              rendements réels des marchés, ni des régimes publics. Les résultats réels
              <strong> varieront</strong>. <strong>Aucun rendement, résultat ou économie n'est garanti.</strong>
            </p>
          </Section>

          <Section n="3" title="Décisions et responsabilité de l'utilisateur">
            <p>
              Vous demeurez seul responsable de vos décisions financières. Avant de prendre une
              décision (placement, assurance, remboursement, retrait, etc.), vous devez obtenir un
              <strong> conseil personnalisé</strong> auprès d'un professionnel dûment certifié et tenir
              compte de votre situation complète. L'utilisation de l'outil ne crée pas, à elle seule,
              de relation de conseil.
            </p>
          </Section>

          <Section n="4" title="Exclusion de responsabilité">
            <p>
              Dans les limites permises par la loi, {a.fullName || 'le conseiller'} et son cabinet
              déclinent toute responsabilité quant aux pertes ou dommages, directs ou indirects,
              découlant de l'utilisation de la plateforme ou de la confiance accordée à son contenu.
              L'outil est fourni « tel quel », sans garantie d'exactitude, d'exhaustivité ou
              d'adéquation à un usage particulier.
            </p>
          </Section>

          <Section n="5" title="Renseignements personnels (Loi 25)">
            <p>
              Nous appliquons le principe de <strong>minimisation des données</strong> : seuls les
              renseignements nécessaires au suivi budgétaire sont recueillis. <strong>Aucun
              renseignement sensible</strong> n'est demandé ni conservé (numéro d'assurance sociale,
              numéros de police ou de compte, bénéficiaires nommés, renseignements médicaux).
            </p>
            <p>
              Vous pouvez, en tout temps, consulter, faire corriger ou demander la suppression de vos
              renseignements, et retirer votre consentement. Pour toute question relative à la
              protection des renseignements personnels, communiquez avec votre conseiller.
            </p>
          </Section>

          <Section n="6" title="Identification du conseiller">
            <p>
              {a.fullName || '—'}, {a.title || 'conseiller'}{a.firm ? `, ${a.firm}` : ''}.
              Certificat AMF : {a.amfNumber || 'à compléter'}. Courriel : {a.email || '—'}.
            </p>
          </Section>

          <Section n="7" title="Propriété et usage">
            <p>
              Le contenu et la présentation de la plateforme sont protégés. L'accès est réservé aux
              personnes autorisées et l'usage doit demeurer conforme aux présentes conditions.
            </p>
          </Section>
        </Card>

        <Card className="p-4 bg-gold-50 border-gold-200">
          <p className="text-xs text-forest-600 leading-relaxed">
            <i className="fas fa-triangle-exclamation text-gold-600 mr-1" />
            <strong>Note interne (à retirer avant diffusion) :</strong> ce texte est un modèle de
            départ. Faites-le réviser et adapter par la conformité de votre cabinet et/ou un
            conseiller juridique avant toute mise en service auprès de vrais clients.
          </p>
        </Card>
      </main>
    </div>
  );
};

const Section: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <section className="space-y-2">
    <h2 className="font-display text-lg font-semibold text-forest-900 flex items-center gap-2">
      <span className="w-6 h-6 rounded-lg bg-forest-600 text-white text-xs flex items-center justify-center">{n}</span>
      {title}
    </h2>
    <div className="space-y-2 pl-8">{children}</div>
  </section>
);
