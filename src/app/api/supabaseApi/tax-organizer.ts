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

export const getAllRegisteredClients = async (
  role?: string,
  userName?: string,
  tab?: string,
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

    if (role === "admin" && userName) {
      query = query.eq("assigned", userName)
    }

    if (assignedFilter) {
      query = query.eq("assigned", assignedFilter)
    }

    if (tab === "documents-pending") {
      query = query
        .eq("status", "Documents Pending")
        .or(
          'sub_status.is.null,and(sub_status.neq."Not Interested",sub_status.neq."Already Filed")'
        )
    } else if (tab === "registered-clients" || tab === undefined) {
      query = query
        .eq("status", "Tax Org Pending")
        .or(
          'sub_status.is.null,and(sub_status.neq."Not Interested",sub_status.neq."Already Filed")'
        )
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("updatedAt", { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data:
        data?.map((row) => ({
          filingYearId: row.filingYearId,
          customerId: row.customerId,
          firstname: row.customer?.firstname ?? "",
          lastname: row.customer?.lastname ?? "",
          timezone: row.customer?.timezone ?? "",
          email: row.customer?.email ?? "",
          status: row.status ?? "",
          sub_status: row.sub_status ?? "",
          last_actor: row.last_actor ?? null,
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

export const updateStatus = async (rowId: number, status: string | null) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ status })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

export const updateSubStatus = async (
  rowId: number,
  sub_status: string | null
) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ sub_status })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

export const updateAssignedUser = async (
  rowId: number,
  assigned: string | null
) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ assigned })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

export const updateLastActor = async (
  rowId: number,
  last_actor: string | null
) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ last_actor })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

export const saveComment = async (
  rowId: number,
  comment: string,
  updatedBy?: string
) => {
  if (!comment || comment.trim() === "") {
    const { data, error } = await supabaseCustomer
      .from("filing_year")
      .update({ comments: "" })
      .eq("filingYearId", rowId)

    if (error) throw error
    return data
  }

  const timestamp = new Date().toLocaleString()
  const updatedComment = `${comment}\n\nUpdated by ${updatedBy} at ${timestamp}`

  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ comments: updatedComment })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

export const generateCustomerLoginLink = async (email: string) => {
  try {
    const response = await fetch("/api/generate-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorJson = await response.json()
      throw new Error(
        (errorJson as { message?: string }).message ||
        "Failed to generate link"
      )
    }

    const parsed = (await response.json()) as { magicLink?: string }
    return parsed.magicLink
  } catch (err: unknown) {
    console.error(
      "Error generating magic link:",
      err instanceof Error ? err.message : err
    )
    throw new Error("Failed to create temporary login link")
  }
}


