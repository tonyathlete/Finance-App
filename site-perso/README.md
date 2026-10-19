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
