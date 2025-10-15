// File: lib/supabase-client.ts

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// This creates a single, shared client instance for the browser
export const supabase = createClientComponentClient()