/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

export const getAllCustomers = async (
  search?: string,
  page: number = 1,
  pageSize: number = 25
) => {
  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const baseQuery = supabaseCustomer
      .from("vertixcustomers")
      .select("*", { count: "exact" })
      .order("updatedAt", { ascending: false }) // newest records first

    if (!search || !search.trim()) {
      const { data, error, count } = await baseQuery.range(from, to)
      if (error) throw new Error(error.message)
      return { data: data || [], count: count || 0 }
    }

    const searchTerm = search.trim().toLowerCase()
    const parts = searchTerm.split(" ").filter(Boolean)

    // MARKED CHANGE: Return no results if more than two words typed
    if (parts.length > 2) {
      return { data: [], count: 0 }
    }

    const first = parts[0] || ""
    const last = parts[1] || ""

    if (first && last) {
      // Combined first + last name search with pagination on first name
      const { data, error, count } = await supabaseCustomer
        .from("vertixcustomers")
        .select("*", { count: "exact" })
        .ilike("firstname", `%${first}%`)
        .range(from, to)
        .order("updatedAt", { ascending: false })

      if (error) throw new Error(error.message)

      // Local filter for combined first and last name match
      const filtered = data?.filter(
        (row) =>
          row.firstname?.toLowerCase().includes(first) &&
          row.lastname?.toLowerCase().includes(last)
      ) || []

      return { data: filtered, count: filtered.length }
    }

    // Single word search term (or only one word provided)
    const term = first

    const { data, error, count } = await baseQuery
      .or(
        `firstname.ilike.%${term}%,lastname.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
      )
      .range(from, to)

    if (error) throw new Error(error.message)

    return { data: data || [], count: count || 0 }
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message)
    return { data: [], count: 0 }
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
