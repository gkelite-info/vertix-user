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

const isClient = typeof window !== "undefined";

const tempStorage = isClient
  ? {
    getItem: (key: string) => sessionStorage.getItem(`imp-${key}`),
    setItem: (key: string, value: string) =>
      sessionStorage.setItem(`imp-${key}`, value),
    removeItem: (key: string) => sessionStorage.removeItem(`imp-${key}`),
  }
  : {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { }
  };

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

if (isClient) {
  (async () => {
    try {
      interface BroadcastChannelMock {
        postMessage: (msg?: unknown) => void;
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
        close: () => void;
      }

      interface InternalAuth {
        _bc?: BroadcastChannelMock | null;
      }

      const auth = supabaseCustomer.auth as unknown as InternalAuth;

      await new Promise((r) => setTimeout(r, 50));
      if (auth._bc) auth._bc.close();

      auth._bc = {
        postMessage: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        close: () => { },
      };
    } catch (e) {
      console.warn("Broadcast isolation skipped:", e);
    }
  })();
}

