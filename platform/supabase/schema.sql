-- ============================================================================
-- Schéma Supabase — Plateforme Boussole (brouillon)
-- À exécuter dans : Supabase > SQL Editor > New query > Run
-- ============================================================================
-- Modèle : un « espace de travail » (workspace) par conseiller, stocké en JSONB.
-- Contient le profil du conseiller et tous ses clients (budget, objectifs, etc.).
-- La sécurité au niveau des lignes (RLS) garantit qu'un compte ne peut lire
-- ou modifier QUE son propre espace de travail.
-- ============================================================================

create table if not exists public.workspaces (
  owner_id   uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspaces is
  'Espace de travail d''un conseiller (profil + clients), stocké en JSONB. Aucune donnée sensible.';

-- Mise à jour automatique de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Sécurité au niveau des lignes (RLS)
-- ---------------------------------------------------------------------------
alter table public.workspaces enable row level security;

drop policy if exists "read own workspace"   on public.workspaces;
drop policy if exists "insert own workspace" on public.workspaces;
drop policy if exists "update own workspace" on public.workspaces;
drop policy if exists "delete own workspace" on public.workspaces;

create policy "read own workspace"
  on public.workspaces for select
  using (auth.uid() = owner_id);

create policy "insert own workspace"
  on public.workspaces for insert
  with check (auth.uid() = owner_id);

create policy "update own workspace"
  on public.workspaces for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "delete own workspace"
  on public.workspaces for delete
  using (auth.uid() = owner_id);

-- ============================================================================
-- Notes :
-- • Ce schéma couvre l'accès CONSEILLER (l'outil que vous utilisez d'abord).
-- • L'accès CLIENT autonome (chaque client se connecte et ne voit que ses
--   propres données) nécessitera un modèle relationnel par client + des
--   politiques RLS dédiées. À planifier en phase 2 du backend.
-- ============================================================================
