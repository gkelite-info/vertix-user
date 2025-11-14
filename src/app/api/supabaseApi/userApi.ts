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
      .order("updatedAt", { ascending: false })

    if (!search || !search.trim()) {
      const { data, error, count } = await baseQuery.range(from, to)
      if (error) throw new Error(error.message)
      return { data: data || [], count: count || 0 }
    }

    const searchTerm = search.trim().toLowerCase()
    const parts = searchTerm.split(" ").filter(Boolean)

    if (parts.length > 2) {
      return { data: [], count: 0 }
    }

    const first = parts[0] || ""
    const last = parts[1] || ""

    if (first && last) {
      const { data, error, count } = await supabaseCustomer
        .from("vertixcustomers")
        .select("*", { count: "exact" })
        .ilike("firstname", `%${first}%`)
        .range(from, to)
        .order("updatedAt", { ascending: false })

      if (error) throw new Error(error.message)

      const filtered =
        data?.filter(
          (row) =>
            row.firstname?.toLowerCase().includes(first) &&
            row.lastname?.toLowerCase().includes(last)
        ) || []

      return { data: filtered, count: filtered.length }
    }

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) throw new Error("Not authenticated")

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

export const insertUser = async (userData: {
  firstname: string
  lastname: string
  email: string
  phone: string
  role: string
  password: string
}) => {
  const res = await fetch("/api/createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to create user")
  return true
}

export const getAllUsers = async (
  page: number = 1,
  pageSize: number = 25,
) => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("vertixusers")
      .select("*", { count: "exact" })
      .eq("is_deleted", false)
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    const mapped = (data || []).map((u) => ({
      id: u.userId,
      email: u.email,
      full_name: `${u.firstname} ${u.lastname}`,
      phone: u.phone,
      created_at: u.createdAt,
    }));

    return { data: mapped, count: count || 0 };
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message);
    return { data: [], count: 0 };
  }
};
