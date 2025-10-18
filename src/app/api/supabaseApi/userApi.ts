import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

// export const getAllCustomers = async (search?: string) => {
//   try {
//     let query = supabaseCustomer.from("vertixcustomers").select("*")

//     if (search && search.trim()) {
//       const searchTerm = search.trim()

//       // Split name if user types "John Doe"
//       const [first, last] = searchTerm.split(" ")

//       if (last) {
//         // full name search: first + last
//         query = query.or(
//           `firstname.ilike.%${first}%,lastname.ilike.%${last}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
//         )
//       } else {
//         // single field search
//         query = query.or(
//           `firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
//         )
//       }
//     }

//     const { data, error } = await query

//     if (error) throw new Error(error.message)

//     return data || []
//   } catch (err: any) {
//     console.error("Supabase fetch error:", err.message)
//     return []
//   }
// }

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
    const { data, error } = await query.or(
      `firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
    )

    if (error) throw new Error(error.message)
    return data || []
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message)
    return []
  }
}
export const getUser = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Not authenticated")
    const customerId = user.id
    const { data, error } = await supabaseCustomer
      .from("vertixusers")
      .select("*")
      .eq("auth_id", customerId)
      .single()
    if (error) throw error
    return data
  } catch (error: any) {
    console.error("Error fetching customer:", error.message)
    throw error
  }
}
