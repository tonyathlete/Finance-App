import { createClient } from '@supabase/supabase-js'

// Fallbacks empêchent le build de planter si les variables ne sont pas
// présentes au moment du build (les vraies valeurs sont injectées par Netlify).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
