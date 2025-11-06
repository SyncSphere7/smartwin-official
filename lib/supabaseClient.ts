import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Note: For server-side operations that require elevated privileges (e.g., setting user.paid=true)
// use SUPABASE_SERVICE_ROLE_KEY server-side only and never expose it to the client.
