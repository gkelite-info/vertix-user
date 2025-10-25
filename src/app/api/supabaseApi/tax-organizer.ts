/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/api-requests/supabaseAdmin"
import { supabaseCustomer } from "@/api-requests/supabaseClient"

// export const getAllRegisteredClients = async (
//   role?: string,
//   userName?: string,
//   tab?: string
// ) => {
//   try {
//     let query = supabaseCustomer.from("filing_year").select(`
//         *,
//         customer:customerId (
//           firstname,
//           lastname,
//           timezone
//         )
//       `)

//     // If the user is admin, fetch only assigned clients
//     if (role === "admin" && userName) {
//       query = query.eq("assigned", userName)
//     }

//     // 🆕 CHANGE: Add conditional filter based on tab value
//     if (tab === "document-pending") {
//       // Only Tax Org Pending
//       query = query.eq("status", "Tax Org Pending")
//     } else if (tab === "registered-clients" || "undefined") {
//       // Exclude Tax Org Pending
//       //query = query.neq("status", "Tax Org Pending")
//       query = query.or("status.is.null,status.neq.Tax Org Pending")
//     }

//     const { data, error } = await query.order("updatedAt", { ascending: false })

//     if (error) throw new Error(error.message)
//     const formattedData = (data || []).map((row: any) => ({
//       ...row,
//       firstname: row.customer?.firstname || "",
//       lastname: row.customer?.lastname || "",
//       timezone: row.customer?.timezone || "",
//     }))

//     return formattedData
//   } catch (err: any) {
//     console.error("Supabase fetch error:", err.message)
//     return []
//   }
// }

// 🆕 Update status

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

    // Tab filter
    if (tab === "document-pending") {
      query = query.eq("status", "Tax Org Pending")
    } else if (tab === "registered-clients" || tab === undefined) {
      query = query.or("status.is.null,status.neq.Tax Org Pending")
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

// export const generateCustomerLoginLink = async (email: string) => {
//   try {
//     const { data, error } = await supabaseAdmin.auth.admin.generateLink({
//       type: "magiclink",
//       email,
//     })

//     if (error) throw error
//     return data?.properties?.action_link
//   } catch (err: any) {
//     console.error("Error generating magic link:", err.message)
//     throw new Error("Failed to create temporary login link")
//   }
// }
