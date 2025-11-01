/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseCustomerUrl = process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_URL!
const supabaseCustomerAnonKey =
  process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "sb-support-auth", // 👈 unique key for Support
  },
})
export const supabaseCustomer = createClient(
  supabaseCustomerUrl,
  supabaseCustomerAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "sb-customer-impersonation", // ✅ unique key to prevent logout conflicts
    },
  }
)
if (typeof window !== "undefined") {
  ;(async () => {
    try {
      const auth: any = (supabaseCustomer as any).auth
      await new Promise((r) => setTimeout(r, 50))
      if (auth._bc) auth._bc.close()
      auth._bc = {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      }
      console.log(
        "✅ Support portal Supabase client isolated from customer portal"
      )
    } catch (e) {
      console.warn("Failed to isolate support Supabase client", e)
    }
  })()
}
