-- ============================================================================
-- Schéma Supabase — PHASE 2 (suite) : liaison client par courriel
-- À exécuter APRÈS schema.sql et schema-v2.sql, dans Supabase > SQL Editor.
-- ============================================================================
-- claim_by_email() : à la 1re connexion d'un client invité, relie
-- automatiquement SA fiche (celle dont le courriel correspond, non encore
-- reliée) à son compte, et marque son profil comme « client ».
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire (contourne la
-- RLS de façon contrôlée), mais ne relie que la fiche au courriel EXACT du
-- compte connecté.
-- ============================================================================

create or replace function public.claim_by_email()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  em  text;
begin
  em := lower(coalesce(auth.jwt() ->> 'email', ''));
  if em = '' then
    return null;
  end if;

  select id into cid
    from public.clients
   where client_user_id is null
     and lower(email) = em
   order by created_at
   limit 1;

  if cid is null then
    return null;
  end if;

  update public.clients set client_user_id = auth.uid() where id = cid;

  insert into public.profiles (id, role)
  values (auth.uid(), 'client')
  on conflict (id) do update set role = 'client';

  return cid;
end;
$$;

-- Autoriser les utilisateurs connectés à appeler la fonction
grant execute on function public.claim_by_email() to authenticated;

-- ============================================================================
-- RAPPELS DE CONFIGURATION (dans le tableau de bord Supabase) :
--  1) Authentication → Sign In / Providers → Email :
--       • DÉSACTIVER « Allow new users to sign up » (inscriptions publiques)
--         → personne ne peut créer un compte sans invitation.
--       • Garder « Confirm email » activé en production.
--  2) Pour donner accès à un client :
--       • Créer la fiche du client dans l'app (avec SON courriel).
--       • Authentication → Users → « Invite user » → entrer le même courriel.
--         Supabase envoie un courriel « Choisissez votre mot de passe ».
--       • À sa 1re connexion, claim_by_email() relie sa fiche automatiquement.
--  3) Variable Netlify VITE_ADVISOR_EMAILS = ton courriel (toi = conseiller).
-- ============================================================================
