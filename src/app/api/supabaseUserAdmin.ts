import { createClient } from "@supabase/supabase-js"

// ✅ Server-only client for Admin APIs
if (typeof window !== "undefined") {
  throw new Error("supabaseAdmin can only be used on the server")
}

export const supabaseUserAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
