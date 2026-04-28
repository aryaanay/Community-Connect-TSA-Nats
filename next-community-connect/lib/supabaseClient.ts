import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build, actual client at runtime
    return createClient('https://placeholder.supabase.co', 'placeholder')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Default export for backward compatibility
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

