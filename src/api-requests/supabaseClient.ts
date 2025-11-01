/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseCustomerUrl = process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_URL!
const supabaseCustomerAnonKey =
  process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_ANON_KEY!

// ✅ Regular support portal client (uses localStorage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "sb-support-auth",
  },
})

// ✅ Isolated temp storage (so Supabase doesn’t share localStorage)
const tempStorage = {
  getItem: (key: string) => sessionStorage.getItem(`imp-${key}`),
  setItem: (key: string, value: string) =>
    sessionStorage.setItem(`imp-${key}`, value),
  removeItem: (key: string) => sessionStorage.removeItem(`imp-${key}`),
}

// ✅ Impersonation client (uses sessionStorage)
export const supabaseCustomer = createClient(
  supabaseCustomerUrl,
  supabaseCustomerAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "sb-customer-impersonation",
      storage: tempStorage, // 👈 critical line: isolates storage from main session
    },
  }
)

if (typeof window !== "undefined") {
  ;(async () => {
    try {
      const auth: any = (supabaseCustomer as any).auth
      await new Promise((r) => setTimeout(r, 50))

      // Disable BroadcastChannel sync completely
      if (auth._bc) auth._bc.close()
      auth._bc = {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      }

      console.log("✅ Customer impersonation client fully isolated.")
    } catch (e) {
      console.warn("⚠️ Isolation skipped:", e)
    }
  })()
}
