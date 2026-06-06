# Quiz ADM — Guide de démarrage

## 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New project**
2. Choisir un nom (ex: `quiz-adm`) et un mot de passe
3. Une fois créé, aller dans **SQL Editor** et coller le contenu de `supabase-schema.sql` → **Run**
4. Aller dans **Project Settings → API** et copier :
   - `Project URL`
   - `anon / public key`

## 2. Configurer les variables d'environnement

Créer un fichier `.env.local` dans ce dossier :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
```

## 3. Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 4. Déployer sur Netlify

1. Pousser ce dossier sur GitHub
2. Aller sur [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Choisir le repo, définir le **Base directory** : `quiz-adm`
4. Ajouter les variables d'environnement dans **Site settings → Environment variables** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Cliquer **Deploy**

## Pages

| URL | Description |
|-----|-------------|
| `/` | Quiz (9 étapes) |
| `/dashboard` | Liste de tous les clients |
| `/dashboard/[id]` | Détail d'un client |
