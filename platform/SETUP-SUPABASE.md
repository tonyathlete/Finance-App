# Activer le backend Supabase (comptes réels + synchronisation)

Sans configuration, l'app tourne en **mode démo** (données dans le navigateur).
Pour avoir de vrais comptes conseiller et une sauvegarde infonuagique, suivez ces
étapes (~10 minutes, gratuit).

## 1. Créer un projet Supabase
1. Aller sur https://supabase.com → **New project** (choisir une région, ex. *Canada Central* si disponible pour garder les données au Canada).
2. Noter le mot de passe de la base (pour votre référence).

## 2. Créer les tables
1. Dans Supabase : **SQL Editor** → **New query**.
2. Copier-coller tout le contenu de [`supabase/schema.sql`](./supabase/schema.sql).
3. Cliquer **Run**. (Crée la table `workspaces` + la sécurité RLS.)

## 3. Récupérer les clés
1. **Project Settings** → **API**.
2. Copier **Project URL** et la clé **anon public**.

## 4. Configurer l'application
1. Dans le dossier `platform/`, copier `.env.example` vers `.env.local`.
2. Y coller vos valeurs :
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Relancer `npm run dev` (ou redéployer). L'app basculera automatiquement en mode
   Supabase : un écran de **connexion** apparaîtra.

### En production (Netlify)
Ajoutez les deux mêmes variables dans **Netlify → Site settings → Environment variables**,
puis redéployez.

## 5. Créer votre compte conseiller
- Sur l'écran de connexion, cliquez **Créer un compte** avec votre courriel + mot de passe.
- Selon vos réglages Supabase (**Authentication → Providers → Email**), une confirmation
  par courriel peut être exigée. Pour un test rapide, vous pouvez désactiver « Confirm email »
  dans Supabase.
- Une fois connecté, votre espace de travail (vide) est créé et synchronisé.

## Ce que couvre cette étape
- ✅ Connexion sécurisée du **conseiller** (courriel + mot de passe)
- ✅ Vos clients et leurs données **sauvegardés dans Supabase** (accessibles de tout appareil)
- ✅ **RLS** : personne d'autre ne peut lire votre espace

## À venir (phase 2 du backend)
- Connexion **autonome pour chaque client** (le client voit seulement ses données) —
  nécessite un modèle relationnel par client + politiques RLS dédiées.
- Rappels automatiques par courriel (check-in, renouvellements).

> ⚠️ Avant une mise en service auprès de vrais clients : faites valider la conformité
> (AMF, Loi 25), activez la confirmation courriel, et vérifiez l'hébergement des données.
