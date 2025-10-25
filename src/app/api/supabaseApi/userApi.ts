/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

export const getAllCustomers = async (search?: string) => {
  try {
    // Base query
    const query = supabaseCustomer.from("vertixcustomers").select("*")

    // No search term → fetch all
    if (!search || !search.trim()) {
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return data || []
    }

    const searchTerm = search.trim().toLowerCase()
    const parts = searchTerm.split(" ").filter(Boolean)
    const [first, last] = parts

    // 🔹 CASE 1: Combined first + last name search (e.g. "shiva n" or "ramu g")
    if (first && last) {
      // Fetch possible first name matches
      const { data, error } = await supabaseCustomer
        .from("vertixcustomers")
        .select("*")
        .ilike("firstname", `%${first}%`)

      if (error) throw new Error(error.message)

      // Filter locally for exact combined matches
      const filtered =
        data?.filter(
          (row) =>
            row.firstname?.toLowerCase().includes(first) &&
            row.lastname?.toLowerCase().includes(last)
        ) || []

      return filtered
    }

    // 🔹 CASE 2: Single search term — match by first/last/email/phone
    // const { data, error } = await query.or(
    //   `customerId.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
    // )
    let data: any[] = []
    let error: any = null

    if (!isNaN(Number(searchTerm))) {
      // 🟩 Numeric input → search by customerId or phone
      const res = await query.or(
        `customerId.eq.${Number(searchTerm)},phone.ilike.%${searchTerm}%`
      )
      data = res.data || []
      error = res.error
    } else {
      // 🟩 Text input → search by name, email, phone
      const res = await query.or(
        `firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
      )
      data = res.data || []
      error = res.error
    }

    if (error) throw new Error(error.message)
    return data || []
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message)
    return []
  }
}

export const getUser = async () => {
  try {
    // 1️⃣ Get Supabase Auth User
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) throw new Error("Not authenticated")

    // 2️⃣ Get App User from your table (vertixusers)
    const { data: appUser, error } = await supabase
      .from("vertixusers")
      .select("*")
      .eq("email", user.email)
      .single()

    if (error) throw error
    return appUser
  } catch (error: any) {
    console.error("Error fetching customer:", error.message)
    throw error
  }
}
