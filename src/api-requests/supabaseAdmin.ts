import { createClient } from "@supabase/supabase-js"

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_URL!,
  process.env.SUPABASE_CUSTOMER_SERVICE_ROLE_KEY!
)
