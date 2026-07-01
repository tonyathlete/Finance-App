import { createClient } from '@supabase/supabase-js'

// Fallbacks empêchent le build de planter si les variables ne sont pas
// présentes au moment du build (les vraies valeurs sont injectées par Netlify).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Vrai seulement si les deux variables d'environnement sont réellement définies
// (et pas les valeurs placeholder du build). Sert à afficher un message clair
// quand la connexion à la base n'est pas configurée.
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
