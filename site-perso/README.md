# anthonygoulet.ca

Site personnel d'Anthony Goulet, conseiller en sécurité financière. Une page d'atterrissage pensée pour le lien en bio Instagram : chaque section mène à la prise de rendez-vous (calendrier GoHighLevel).

## Modifier le contenu

- **Textes, liens, sections** : `src/config.ts` (un seul fichier)
- **Couleurs et polices** : haut de `src/styles/global.css`
- **Blog** : un fichier `.md` par article dans `src/content/blog/`
- **Photo / vidéo** : déposer le fichier dans `public/images/` puis indiquer le chemin dans `hero.photo` / `hero.videoUrl`

## Commandes

```
npm install
npm run dev     # aperçu local sur http://localhost:4321
npm run build   # génère le site dans dist/
```

## Mise en ligne (Netlify)

Nouveau site Netlify relié à ce repo, avec **Base directory = `site-perso`**. Domaine principal : anthonygoulet.ca ; anthonygoulet.com redirige vers le .ca (voir `netlify.toml`).

## GoHighLevel

**Leads → CRM (sans frais).** Le formulaire de réservation envoie chaque demande à `netlify/functions/lead.mjs`, qui crée ou met à jour le contact par l'API GoHighLevel, ajoute les tags `site-web` et `besoin-…`, et met le besoin et le message dans une note.

1. Dans GHL : *Settings → Private Integrations → Create new integration*. Permissions : **View/Edit Contacts** (contacts.readonly, contacts.write). Copier la clé (commence par `pit-`).
2. Dans GHL : *Settings → Business Profile* : copier le **Location ID**.
3. Dans Netlify : *Site configuration → Environment variables* : ajouter `GHL_TOKEN` (la clé) et `GHL_LOCATION_ID`, puis redéployer.
4. Références partenaires : la section « Mon réseau » permet de cocher des partenaires. Tags créés : `demande-reference` + `partenaire-…` (ex. `partenaire-courtier-hypothecaire`, `partenaire-cartes-de-credit-milesopedia`). La liste vient de `partners` dans `src/config.ts`.
5. Workflows gratuits : déclencheur **Contact Tag** (tag `site-web`, ou `besoin-proteger-mon-revenu-assurance`, etc.) → texto, courriel, opportunité dans le pipeline.

**Chat.** Dans GHL : *Sites → Chat Widget*, copier la valeur `data-widget-id` du code d'intégration et la coller dans `ghl.chatWidgetId` (`src/config.ts`).
