import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseCustomerUrl = process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_URL!
const supabaseCustomerAnonKey =
  process.env.NEXT_PUBLIC_CUSTOMER_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseCustomer = createClient(
  supabaseCustomerUrl,
  supabaseCustomerAnonKey
)
