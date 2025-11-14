import { createClient, type SupabaseClient } from "@supabase/supabase-js"

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
    storageKey: "sb-support-auth",
  },
})

const tempStorage = {
  getItem: (key: string) => sessionStorage.getItem(`imp-${key}`),
  setItem: (key: string, value: string) =>
    sessionStorage.setItem(`imp-${key}`, value),
  removeItem: (key: string) => sessionStorage.removeItem(`imp-${key}`),
}

export const supabaseCustomer: SupabaseClient = createClient(
  supabaseCustomerUrl,
  supabaseCustomerAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "sb-customer-impersonation",
      storage: tempStorage,
    },
  }
)

if (typeof window !== "undefined") {
  ;(async () => {
    try {
      const auth = (supabaseCustomer as SupabaseClient).auth

      await new Promise((r) => setTimeout(r, 50))

      if ((auth as any)._bc) (auth as any)._bc.close()

      ;(auth as any)._bc = {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      }
    } catch (e) {
      console.warn("Isolation skipped:", e)
    }
  })()
}
