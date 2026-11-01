-- ============================================================================
-- Schéma Supabase — PHASE 2 : comptes clients autonomes + RLS par client
-- À exécuter APRÈS schema.sql, dans Supabase > SQL Editor.
-- ============================================================================
-- Principe :
--  • profiles  : chaque utilisateur (conseiller OU client) a un profil + un rôle
--  • clients   : une ligne par client; appartient à un conseiller (advisor_id)
--                et peut être reliée au compte du client (client_user_id)
--  • invitations : le conseiller invite un client par courriel (jeton);
--                le client crée son compte puis « réclame » sa fiche
--  • RLS       : le conseiller voit SES clients; le client voit SEULEMENT sa fiche
-- ============================================================================

-- Extensions utiles
create extension if not exists "pgcrypto";

-- --- Rôles -----------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('advisor', 'client');
exception when duplicate_object then null; end $$;

-- --- profiles --------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null default 'client',
  full_name   text,
  advisor_id  uuid references auth.users (id),  -- pour un client : son conseiller
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "advisor reads client profiles" on public.profiles;
create policy "advisor reads client profiles" on public.profiles
  for select using (advisor_id = auth.uid());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --- clients ---------------------------------------------------------------
create table if not exists public.clients (
  id              uuid primary key default gen_random_uuid(),
  advisor_id      uuid not null references auth.users (id) on delete cascade,
  client_user_id  uuid references auth.users (id),      -- rempli quand le client réclame sa fiche
  first_name      text not null,
  last_name       text not null,
  email           text,
  phone           text,
  situation       text,
  data            jsonb not null default '{}'::jsonb,   -- budget, objectifs, dettes, etc.
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists clients_advisor_idx on public.clients (advisor_id);
create index if not exists clients_user_idx on public.clients (client_user_id);

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();  -- défini dans schema.sql

alter table public.clients enable row level security;

-- Le conseiller : accès complet à SES clients
drop policy if exists "advisor manages own clients" on public.clients;
create policy "advisor manages own clients" on public.clients
  for all using (advisor_id = auth.uid()) with check (advisor_id = auth.uid());

-- Le client : lecture/mise à jour de SA fiche uniquement
drop policy if exists "client reads own file" on public.clients;
create policy "client reads own file" on public.clients
  for select using (client_user_id = auth.uid());

drop policy if exists "client updates own file" on public.clients;
create policy "client updates own file" on public.clients
  for update using (client_user_id = auth.uid()) with check (client_user_id = auth.uid());

-- --- invitations -----------------------------------------------------------
create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  advisor_id  uuid not null references auth.users (id) on delete cascade,
  client_id   uuid not null references public.clients (id) on delete cascade,
  email       text not null,
  token       text not null unique default encode(gen_random_bytes(16), 'hex'),
  status      text not null default 'pending',  -- pending | accepted | expired
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '30 days')
);

alter table public.invitations enable row level security;

drop policy if exists "advisor manages own invitations" on public.invitations;
create policy "advisor manages own invitations" on public.invitations
  for all using (advisor_id = auth.uid()) with check (advisor_id = auth.uid());

-- Le client « réclame » sa fiche avec le jeton reçu par courriel.
-- SECURITY DEFINER : contourne RLS de façon contrôlée, en validant le jeton.
create or replace function public.claim_invitation(invite_token text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  inv public.invitations;
begin
  select * into inv from public.invitations
   where token = invite_token and status = 'pending' and expires_at > now();
  if inv.id is null then
    raise exception 'Invitation invalide ou expirée';
  end if;

  update public.clients
     set client_user_id = auth.uid()
   where id = inv.client_id;

  update public.invitations set status = 'accepted' where id = inv.id;
  update public.profiles set role = 'client', advisor_id = inv.advisor_id
   where id = auth.uid();

  return inv.client_id;
end; $$;

-- ============================================================================
-- Après exécution :
--  1) Le conseiller crée une fiche client (table clients) + une invitation.
--  2) L'app envoie le lien d'invitation (token) au client par courriel.
--  3) Le client crée son compte puis appelle claim_invitation(token) →
--     sa fiche lui est reliée; il ne voit que la sienne (RLS).
-- Le câblage de ces étapes dans l'app constitue l'implémentation front de la
-- phase 2 (à faire contre un projet Supabase actif pour tester chaque étape).
-- ============================================================================
