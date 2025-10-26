import { createClient } from "@supabase/supabase-js"

// Add server-only check
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin can only be used on the server side')
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_URL!,
  process.env.SUPABASE_CUSTOMER_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)