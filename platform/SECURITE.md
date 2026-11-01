# Sécurité de la plateforme — guide et checklist

Objectif : sécuriser au maximum une application financière (données de clients,
encadrement AMF / Loi 25). La sécurité se joue en **couches**. Voici chacune,
avec ce qui est **déjà en place** (✅) et ce qui **reste à activer** (⬜).

---

## 1. Hébergement / réseau (Netlify)
- ✅ **HTTPS** automatique (certificat géré par Netlify).
- ✅ **HSTS** (force HTTPS) + redirection.
- ✅ **En-têtes de sécurité** : `X-Frame-Options: DENY` (anti-clickjacking),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`. Voir `netlify.toml`.
- ✅ **Content-Security-Policy (CSP)** : limite d'où le code et les données
  peuvent provenir (soi-même + Supabase + Google Fonts + FontAwesome seulement).
- ✅ **Déploiement par Git** (pas de téléversement manuel) → traçable, reproductible.
- ⬜ **Protection par mot de passe / SSO du site** tant que c'est un brouillon
  (Netlify → Site configuration → Access control). Évite que n'importe qui tombe
  dessus pendant les tests.
- ⬜ **Variables d'environnement** (clés Supabase) uniquement dans Netlify →
  Environment variables, jamais dans le code/Git. (La clé **anon** est publique
  par design; ne JAMAIS mettre la clé **service_role** dans le frontend.)

## 2. Authentification (Supabase Auth)
- ✅ Connexion par **courriel + mot de passe** (quand Supabase est configuré).
- ⬜ **Confirmation du courriel** obligatoire (Supabase → Authentication →
  Providers → Email → *Confirm email*).
- ⬜ **Politique de mot de passe** forte + **protection contre les mots de passe
  compromis** (Supabase → Authentication → Policies : longueur min, HaveIBeenPwned).
- ⬜ **Double authentification (2FA/MFA TOTP)** pour le compte conseiller.
- ⬜ **Limitation du taux** (rate limiting) des tentatives de connexion (réglages
  Supabase Auth) pour contrer la force brute.
- ⬜ **Durée de session / expiration du jeton** raisonnable.
- ⬜ Désactiver l'**inscription publique** si seuls des comptes invités doivent
  exister (sinon n'importe qui peut créer un compte).

## 3. Données (Supabase / base de données)
- ✅ **RLS (Row Level Security)** activée : chaque compte ne lit/écrit que ses
  propres données (`supabase/schema.sql`).
- ✅ **Minimisation des données** : aucune donnée sensible stockée (NAS, no de
  police/compte, bénéficiaires, données médicales).
- ⬜ **Hébergement des données au Canada** (choisir la région à la création du
  projet Supabase) — recommandé sous Loi 25.
- ⬜ **Sauvegardes** + **récupération à un instant T** (Point-in-time recovery,
  plan payant Supabase) pour éviter la perte de données.
- ⬜ RLS sur **toute** nouvelle table (par défaut, tout refuser, puis autoriser).
- ⬜ Clé **service_role** gardée côté serveur uniquement (jamais dans l'app web).

## 4. Code de l'application
- ✅ **React échappe le HTML** par défaut (protection XSS); aucun
  `dangerouslySetInnerHTML` utilisé.
- ✅ **Images de factures non stockées** (capture utilisée en mémoire seulement).
- ⬜ `npm audit` régulier + **mises à jour des dépendances** (corrige les failles).
- ⬜ **Analyse de secrets** sur le dépôt (GitHub secret scanning) pour éviter une
  clé publiée par erreur.
- ⬜ **Validation des saisies** côté serveur quand la logique passera au backend
  (ne jamais faire confiance au client seul).

## 5. Comptes & accès (facteur humain — souvent le maillon faible)
- ⬜ **2FA activée** sur vos comptes **GitHub, Netlify et Supabase**.
- ⬜ **Mots de passe uniques** + gestionnaire de mots de passe.
- ⬜ **Principe du moindre privilège** : n'accorder que les accès nécessaires.
- ⬜ Révoquer les accès inutilisés (anciens jetons, collaborateurs).

## 6. Confidentialité & conformité (Loi 25 / AMF)
- ✅ **Consentement** horodaté et révocable (page profil).
- ✅ **Mentions légales** (non-conseil, responsabilité, Loi 25).
- ⬜ **Politique de confidentialité** publiée + **registre des consentements**.
- ⬜ **Responsable de la protection des renseignements personnels** désigné.
- ⬜ **Entente de traitement des données (DPA)** avec Supabase et Netlify.
- ⬜ **Plan de réponse aux incidents** (notifier la Commission d'accès à
  l'information et les personnes concernées en cas de fuite).
- ⬜ **Journal d'accès / audit** (qui a consulté quoi) lorsque les clients auront
  des comptes distincts.

---

## Priorités recommandées (par ordre)
1. **Activer les comptes réels Supabase** (voir `SETUP-SUPABASE.md`) avec
   confirmation courriel + politique de mot de passe forte + région Canada.
2. **2FA partout** (GitHub, Netlify, Supabase) et **protection par mot de passe**
   du site Netlify pendant les tests.
3. **Logins clients séparés + RLS par client** (phase 2 du backend) avant
   d'accueillir de vrais clients.
4. **DPA + politique de confidentialité + plan d'incident** avant la mise en
   service réelle.
5. **`npm audit` + secret scanning** en continu.

> ⚠️ Ce guide est un point de départ technique. Faites valider l'ensemble
> (sécurité + conformité AMF/Loi 25) par un professionnel avant d'accueillir de
> vrais clients et de vraies données.
