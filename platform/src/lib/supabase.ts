import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Configuration lue depuis les variables d'environnement Vite.
// En l'absence de configuration, l'app fonctionne en mode démo (localStorage).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
