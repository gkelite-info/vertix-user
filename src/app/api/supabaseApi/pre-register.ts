import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

export const getAllPreRegisterClients = async (
  page: number = 1,
  pageSize: number = 25
) => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabaseCustomer
    .from("referrals")
    .select("*", { count: "exact" })
    .order("updatedAt", { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data, totalCount: count ?? 0 }
}

export const updateStatus = async (rowId: number, status: string) => {
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .update({ status })
    .eq("referId", rowId)

  if (error) throw error
  return data
}

export const updateFollowup = async (rowId: number, followup: string) => {
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .update({ followup })
    .eq("referId", rowId)

  if (error) throw error
  return data
}

export const saveComment = async (
  rowId: number,
  comment: string,
  updatedBy: string
) => {
  const timestamp = new Date().toLocaleString()
  const updatedComment = `${comment}\n\nUpdated by ${updatedBy} at ${timestamp}`
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .update({ comments: updatedComment })
    .eq("referId", rowId)

  if (error) throw error
  return data
}

export const getFollowupUsersData = async () => {
  const { data, error } = await supabase.from("vertixusers").select("name")
  if (error) throw error
  return data
}
