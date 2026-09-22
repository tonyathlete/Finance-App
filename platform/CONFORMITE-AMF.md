# Conformité — AMF & Loi 25 (aide-mémoire pour le brouillon)

> Ce document résume les mesures déjà intégrées et ce qui reste à valider. Il ne remplace
> pas un avis juridique ni la validation par le service de conformité de votre cabinet.
> À faire réviser avant toute mise en service réelle.

## Contexte
L'outil est offert par un **conseiller en sécurité financière** encadré par l'Autorité des
marchés financiers (AMF) au Québec, et vise à **soutenir le suivi budgétaire** — pas à
remplacer une analyse de besoins financiers ni à recommander un produit.

## Mesures déjà intégrées dans le brouillon

### 1. Nature de l'outil clairement affichée
- Avis de non-responsabilité (`Disclaimer`) présent sur les écrans clés : l'outil est
  **éducatif et de suivi budgétaire**, ne constitue pas un conseil personnalisé, une
  recommandation de produit, ni une analyse de besoins financiers.
- Mention explicite qu'**aucun rendement n'est garanti**.

### 2. Identification du conseiller (obligation AMF)
- Bloc « Votre conseiller » visible côté client : nom, titre, cabinet et **numéro de
  certificat AMF** (à compléter dans « Mon cabinet »).

### 3. Minimisation des données (Loi 25 — principe de nécessité)
- Le modèle de données **ne prévoit aucune donnée sensible** : pas de NAS, pas de numéro
  de police complet, pas de numéro de compte, pas de bénéficiaire nommé, pas de
  renseignement médical.
- Les assurances sont un **récapitulatif** (type, assureur, capital, prime, échéance).
- Rappels dans l'interface pour ne pas saisir de données sensibles.

### 4. Consentement (Loi 25)
- Écran de profil client avec **consentement horodaté**, possibilité de le **retirer**,
  et mention du droit de consultation / correction / suppression.

### 5. Séparation des espaces
- Espace **conseiller** distinct de l'espace **client**. Les notes du conseiller sont
  marquées « privées ».

## À valider / compléter avant la production réelle

- [ ] **Authentification réelle** et cloisonnement serveur des données par client
      (actuellement démo locale, non sécurisée).
- [ ] **Hébergement des données au Canada** et clauses contractuelles avec les
      fournisseurs (évaluation des facteurs relatifs à la vie privée si applicable).
- [ ] **Chiffrement** en transit et au repos; gestion des accès et **journalisation**.
- [ ] **Politique de confidentialité** et **modalités** accessibles dans l'app.
- [ ] **Registre des consentements** exportable et politique de conservation/destruction.
- [ ] **Responsable de la protection des renseignements personnels** désigné (Loi 25).
- [ ] Révision des textes marketing/incitatifs pour éviter toute **sollicitation** non
      conforme ou promesse de rendement.
- [ ] Validation que l'outil ne franchit pas la ligne du **conseil personnalisé** encadré
      (le contenu reste général et éducatif; le conseil se fait en rencontre).
- [ ] Procédure en cas d'**incident de confidentialité** (notification à la Commission
      d'accès à l'information et aux personnes concernées, le cas échéant).

## Rappel
La conformité dépend aussi de **comment** l'outil est présenté et utilisé. Faites valider
l'ensemble (textes, parcours, conservation des données) par votre cabinet / un conseiller
juridique avant diffusion à de vrais clients.
