/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseCustomer } from "@/api-requests/supabaseClient"

export const getAllRegisteredClientsPreparations = async (
  role?: string,
  userName?: string,
  page: number = 1,
  pageSize: number = 25,
  assignedFilter?: string
) => {
  try {
    let query = supabaseCustomer.from("filing_year").select(
      `*,
        customer:customerId (
          firstname,
          lastname,
          timezone,
          email
        )
      `,
      { count: "exact" }
    )
    query = query.in("status", ["Preparation Pending", "Rework Needed"])
    // Filter by assigned admin
    if (role === "admin" && userName) {
      query = query.eq("assigned", userName)
    }
    if (assignedFilter) {
      query = query.eq("assigned", assignedFilter)
    }

    // 🧩 Pagination (server-side)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("updatedAt", { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data:
        data?.map((row: any) => ({
          ...row,
          firstname: row.customer?.firstname ?? "",
          lastname: row.customer?.lastname ?? "",
          timezone: row.customer?.timezone ?? "",
          email: row.customer?.email ?? "",
        })) ?? [],
      totalCount: count ?? 0,
    }
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message)
    return { data: [], totalCount: 0 }
  }
}
