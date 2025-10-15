// File: lib/supabase-browser.ts

import { createBrowserClient } from '@supabase/ssr'

// This function creates a new client for the browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}