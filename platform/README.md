# Plateforme d'accompagnement financier — Brouillon

Plateforme pour accompagner les clients (budget, objectifs, suivis hebdomadaires) et
permettre au conseiller de faire des suivis et relances.

> ⚠️ **Version brouillon.** Base à faire évoluer ensemble. Les données sont pour le moment
> stockées **localement dans le navigateur** (localStorage) avec des clients de démonstration.
> Aucune donnée n'est envoyée sur un serveur. Voir « Prochaines étapes ».

## Ce que ça fait

### Espace client (ce que le client voit)
- **Accueil** : portrait financier du mois (revenus, dépenses, solde, taux d'épargne)
- **Budget** : revenus + dépenses par catégorie, essentiel vs discrétionnaire, graphique
- **Objectifs** : voyage, retraite, dette, fonds d'urgence… avec plan, jalons et projection
  (« es-tu sur la bonne voie ? »)
- **Check-in hebdomadaire** : bilan de la semaine (humeur, réussites, obstacles, priorité)
  — pensé pour les travailleurs autonomes et le remboursement de dettes
- **Assurances** : récapitulatif clair (sans données sensibles)
- **Profil** : coordonnées minimales + consentement Loi 25

### Espace conseiller (vous seulement)
- **Tableau de bord** : vue d'ensemble, relances à venir, check-ins récents
- **Clients** : liste, recherche, ajout de client
- **Fiche client** : aperçu, budget, objectifs, assurances, check-ins, suivis, notes privées,
  et bouton « Voir comme le client »
- **Suivis & relances** : toutes les relances au même endroit, avec statuts
- **Mon cabinet** : identité professionnelle (identification AMF)

## Palette
Forêt (verts), or, et neutres chauds « papier » — un style de vie, sobre et premium.

## Démarrer

```bash
cd platform
npm install
npm run dev
```

Puis ouvrir http://localhost:3100

## Conformité
Voir [`CONFORMITE-AMF.md`](./CONFORMITE-AMF.md) pour le détail des mesures (AMF + Loi 25)
et la liste de vérification avant une mise en production réelle.

## Prochaines étapes suggérées
1. **Backend + authentification réelle** (ex. Supabase, déjà utilisé dans `quiz-adm`) :
   comptes clients, mot de passe, séparation stricte des données par client.
2. **Rôles et permissions serveur** (le conseiller voit ses clients; un client ne voit que lui).
3. **Chiffrement au repos et en transit**, journal des accès (exigences Loi 25).
4. **Registre de consentement** horodaté et exportable.
5. **Rappels automatiques** de check-in et de renouvellement d'assurance (courriel).
6. **Export PDF** du portrait budgétaire pour les rencontres.
7. Validation du contenu par la conformité de votre cabinet avant diffusion.

## Structure

```
platform/src/
  components/   UI, graphiques, mise en page, conformité
  context/      état global + persistance localStorage
  data/         données de démonstration
  lib/          utilitaires, calculs financiers, routeur, libellés
  pages/
    client/     espace client
    advisor/    espace conseiller
```
