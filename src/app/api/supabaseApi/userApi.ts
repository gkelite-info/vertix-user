import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

type Customer = {
  customerId: string
  firstname: string
  lastname: string
  email: string
  phone: string
  dob: string
  timezone: string
  occupation: string
  country: string
}

type VertixCustomer = {
  customerId?: string
  customerid?: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  dob?: string
  date_of_birth?: string
  occupation?: string
  job?: string
  country?: string
  timezone?: string
  residence_country?: string
  updatedAt?: string
  [key: string]: unknown
}

type VertixUser = {
  userId: string
  firstname: string
  lastname: string
  password: string
  email: string
  phone: string
  createdAt: string
  [key: string]: unknown
}

const CUSTOMER_ID_MAX_DIGITS = 9

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
      .order("customerId", { ascending: false })

    const process = (rows: VertixCustomer[]): Customer[] =>
      rows.map((row) => ({
        customerId: row.customerId ?? row.customerid ?? "",
        firstname: row.firstname ?? "",
        lastname: row.lastname ?? "",
        email: row.email ?? "",
        phone: row.phone ?? "",
        dob: row.dob ?? row.date_of_birth ?? "",
        occupation: row.occupation ?? row.job ?? "",
        timezone: row.timezone ?? row.timezone ?? "",
        country: row.country ?? row.residence_country ?? "",
      }))

    if (!search || !search.trim()) {
      const { data, error, count } = await baseQuery.range(from, to)
      if (error) throw new Error(error.message)
      return {
        data: process((data as VertixCustomer[]) || []),
        count: count || 0,
      }
    }

    const searchTerm = search.trim().toLowerCase()
    const parts = searchTerm.split(" ").filter(Boolean)

    const isNumericSearch = /^\d+$/.test(searchTerm)

    if (isNumericSearch) {
      const digitLength = searchTerm.length
      const numericValue = Number(searchTerm)

      if (digitLength <= CUSTOMER_ID_MAX_DIGITS) {
        const { data, error, count } = await baseQuery
          .or(
            `phone.ilike.%${searchTerm}%,customerId.eq.${numericValue},customerId.eq.${numericValue}`
          )
          .range(from, to)

        if (error) throw new Error(error.message)

        return {
          data: process((data as VertixCustomer[]) || []),
          count: count || 0,
        }
      }

      const { data, error, count } = await baseQuery
        .ilike("phone", `%${searchTerm}%`)
        .range(from, to)

      if (error) throw new Error(error.message)

      return {
        data: process((data as VertixCustomer[]) || []),
        count: count || 0,
      }
    }



    if (parts.length > 2) return { data: [], count: 0 }

    const first = parts[0] || ""
    const last = parts[1] || ""

    if (first && last) {
      const { data, error } = await supabaseCustomer
        .from("vertixcustomers")
        .select("*", { count: "exact" })
        .ilike("firstname", `%${first}%`)
        .order("updatedAt", { ascending: false })
        .range(from, to)

      if (error) throw new Error(error.message)

      const filtered =
        (data as VertixCustomer[])?.filter(
          (row) =>
            row.firstname?.toLowerCase().includes(first) &&
            row.lastname?.toLowerCase().includes(last)
        ) || []

      return { data: process(filtered), count: filtered.length }
    }

    const term = first

    const { data, error, count } = await baseQuery
      .or(
        `firstname.ilike.%${term}%,lastname.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
      )
      .range(from, to)

    if (error) throw new Error(error.message)

    return {
      data: process((data as VertixCustomer[]) || []),
      count: count || 0,
    }
  } catch (err: unknown) {
    console.error(
      "Supabase fetch error:",
      err instanceof Error ? err.message : err
    )
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
  } catch (err: unknown) {
    console.error(
      "Error fetching customer:",
      err instanceof Error ? err.message : err
    )
    throw err
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

  const data = (await res.json()) as { error?: string }

  if (!res.ok) throw new Error(data.error || "Failed to create user")

  return true
}

export const getAllUsers = async (
  page: number = 1,
  pageSize: number = 25
) => {
  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from("vertixusers")
      .select("*", { count: "exact" })
      .eq("is_deleted", false)
      .order("updatedAt", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const mapped = (data as VertixUser[]).map((u) => ({
      id: u.userId,
      email: u.email,
      full_name: `${u.firstname} ${u.lastname}`,
      phone: u.phone,
      password: u.password,
      created_at: u.createdAt,
    }))

    return { data: mapped, count: count || 0 }
  } catch (err: unknown) {
    console.error(
      "Supabase fetch error:",
      err instanceof Error ? err.message : err
    )
    return { data: [], count: 0 }
  }
}
