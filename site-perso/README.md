# anthonygoulet.ca

Site personnel d'Anthony Goulet, conseiller en sécurité financière. Une page d'atterrissage pensée pour le lien en bio Instagram : chaque section mène à la prise de rendez-vous Calendly.

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

**Leads → CRM.** Le formulaire de réservation envoie chaque demande à `netlify/functions/lead.mjs`, qui la transmet à un webhook GHL.

1. Dans GHL : *Automation → Workflows → Create workflow → Trigger « Inbound Webhook »*. Copier l'URL du webhook.
2. Dans Netlify : *Site configuration → Environment variables → Add* `GHL_WEBHOOK_URL` = l'URL copiée, puis redéployer.
3. Soumettre une fois le formulaire sur le site, puis dans le déclencheur GHL cliquer « Fetch sample request ».
4. Ajouter l'action *Create/Update Contact* et associer les champs : `first_name`, `last_name`, `email`, `phone`, `besoin`, `message`, `source`.
5. Ajouter tes suivis (tag selon `besoin`, texto de bienvenue, courriel, opportunité dans le pipeline…).

**Chat.** Dans GHL : *Sites → Chat Widget*, copier la valeur `data-widget-id` du code d'intégration et la coller dans `ghl.chatWidgetId` (`src/config.ts`).
