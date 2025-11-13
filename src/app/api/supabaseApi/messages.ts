import { supabaseCustomer } from "@/api-requests/supabaseClient"

export type Message = {
  messageId: number
  content: string
  status: string
  createdAt: string
  updatedAt: string
  customer?: {
    firstname: string
    lastname: string
    email: string
  }
  filing_year?: {
    filingYearId: number
    year: string
  }
}

export const getAllMessages = async (
  page: number = 1,
  pageSize: number = 25
): Promise<{ data: Message[]; totalCount: number }> => {
  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabaseCustomer
      .from("messages")
      .select(
        `
        messageId,
        content,
        status,
        createdAt,
        updatedAt,
        customer:customerId (
          firstname,
          lastname,
          email
        ),
        filing_year:filingYearId (
          filingYearId,
          year
        )
      `,
        { count: "exact" }
      )
      .order("createdAt", { ascending: false })
      .range(from, to)

    if (error) throw error

    const formattedData: Message[] =
      data?.map((item) => ({
        messageId: item.messageId,
        content: item.content,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        customer: Array.isArray(item.customer)
          ? item.customer[0]
          : (item.customer as Message["customer"]),
        filing_year: Array.isArray(item.filing_year)
          ? item.filing_year[0]
          : (item.filing_year as Message["filing_year"]),
      })) ?? []

    return {
      data: formattedData,
      totalCount: count ?? 0,
    }
  } catch (err) {
    console.error(
      "Error fetching messages:",
      err instanceof Error ? err.message : err
    )
    return { data: [], totalCount: 0 }
  }
}
