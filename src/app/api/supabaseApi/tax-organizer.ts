/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseCustomer } from "@/api-requests/supabaseClient"

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

    // Filter by assigned admin
    if (role === "admin" && userName) {
      query = query.eq("assigned", userName)
    }
    if (assignedFilter) {
      query = query.eq("assigned", assignedFilter)
    }

    if (tab === "document-pending") {
      query = query.eq("status", "Documents Pending")
    } else if (tab === "registered-clients" || tab === undefined) {
      //query = query.or("status.is.null,status.eq.Documents Pending")
      query = query.in("status", [
        "Tax Org Pending",
        "Not Interested",
        "Already Filed",
      ])
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

export const updateStatus = async (rowId: number, status: string) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ status })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

// 🆕 Update sub-status
export const updateSubStatus = async (rowId: number, sub_status: string) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ sub_status })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

// 🆕 Update assigned user (followup)
export const updateAssignedUser = async (rowId: number, assigned: string) => {
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ assigned })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

// 🆕 Save comment for a row
export const saveComment = async (
  rowId: number,
  comment: string,
  updatedBy: string
) => {
  const timestamp = new Date().toLocaleString()
  const updatedComment = `${comment}\n\nUpdated by ${updatedBy} at ${timestamp}`
  const { data, error } = await supabaseCustomer
    .from("filing_year")
    .update({ comments: updatedComment })
    .eq("filingYearId", rowId)

  if (error) throw error
  return data
}

// Update the generateCustomerLoginLink function:
export const generateCustomerLoginLink = async (email: string) => {
  try {
    // Call API route instead of direct admin call
    const response = await fetch("/api/generate-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to generate link")
    }

    const { magicLink } = await response.json()
    return magicLink
  } catch (err: any) {
    console.error("Error generating magic link:", err.message)
    throw new Error("Failed to create temporary login link")
  }
}
