import { supabase, supabaseCustomer } from "@/api-requests/supabaseClient"

//get all pre-registered clients
// export const getAllPreRegisterClients = async () => {
//   const { data, error } = await supabaseCustomer.from("referrals").select("*")
//   if (error) throw error
//   return data
// }

export const getAllPreRegisterClients = async () => {
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .select("*")
    .order("updatedAt", { ascending: false }) // 🆕 latest first

  if (error) throw error
  return data
}

// Update status for a row
export const updateStatus = async (rowId: number, status: string) => {
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .update({ status })
    .eq("referId", rowId)

  if (error) throw error
  return data
}

// Update followup for a row
export const updateFollowup = async (rowId: number, followup: string) => {
  const { data, error } = await supabaseCustomer
    .from("referrals")
    .update({ followup })
    .eq("referId", rowId)

  if (error) throw error
  return data
}

// Save comment for a row
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

//get followup users data
export const getFollowupUsersData = async () => {
  const { data, error } = await supabase.from("vertixusers").select("name")
  if (error) throw error
  return data
}
