-- Créer la table submissions dans Supabase
-- Copiez et exécutez ce SQL dans l'éditeur SQL de Supabase

create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  data jsonb not null
);

-- Permettre les lectures et insertions anonymes (pas de login requis)
alter table submissions enable row level security;

create policy "Allow anonymous insert"
  on submissions for insert
  with check (true);

create policy "Allow anonymous select"
  on submissions for select
  using (true);
