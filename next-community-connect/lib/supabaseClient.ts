import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fbcqspgmrfmraxbghdpe.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3FzcGdtcmZtcmF4YmdoZHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMzAyMjEsImV4cCI6MjA5MjkwNjIyMX0.PrLAaYAoAOf0A8wSGdi08QpJq-vSZt5gnCcrZj4lMU8'

// Lazy initialization to avoid build-time errors
export function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Default export for backward compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

