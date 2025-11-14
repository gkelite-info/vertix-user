import { supabaseCustomer } from "@/api-requests/supabaseClient"

type FilingYearRow = {
  customer?: {
    firstname?: string
    lastname?: string
    timezone?: string
    email?: string
  }
  [key: string]: unknown
}

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

    query = query.eq("status", "Preparation Pending")
    query = query.or(
      'sub_status.is.null,and(sub_status.neq."Not Interested",sub_status.neq."Already Filed")'
    )

    if (role === "admin" && userName) {
      query = query.eq("assigned", userName)
    }

    if (assignedFilter) {
      query = query.eq("assigned", assignedFilter)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("updatedAt", { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data:
        data?.map((row: any) => ({
          filingYearId: row.filingYearId,
          customerId: row.customerId,
          firstname: row.customer?.firstname ?? "",
          lastname: row.customer?.lastname ?? "",
          timezone: row.customer?.timezone ?? "",
          status: row.status ?? "",
          sub_status: row.sub_status ?? "",
          last_actor: row.last_actor ?? "",
          action: row.action ?? "",
          comments: row.comments ?? "",
          assigned: row.assigned ?? "",
          updatedAt: row.updatedAt ?? "",
        })) ?? [],
      totalCount: count ?? 0,
    }

  } catch (err: unknown) {
    console.error(
      "Supabase fetch error:",
      err instanceof Error ? err.message : err
    )
    return { data: [], totalCount: 0 }
  }
}
