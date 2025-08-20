import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern - only ONE client instance for the entire app
let browserClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    console.log('[Supabase] Creating singleton client instance')
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}

// Export a single instance
export const supabase = getSupabaseClient()