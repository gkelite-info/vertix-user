import { supabaseCustomer } from "@/api-requests/supabaseClient";

export const getAllMessages = async (
  page: number = 1,
  pageSize: number = 25
) => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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
      .range(from, to);

    if (error) throw error;

    const formattedData =
      data?.map((item: any) => ({
        messageId: item.messageId,
        content: item.content,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        customer: Array.isArray(item.customer) ? item.customer[0] : item.customer,
        filing_year: Array.isArray(item.filing_year)
          ? item.filing_year[0]
          : item.filing_year,
      })) ?? [];

    return {
      data: formattedData,
      totalCount: count ?? 0,
    };
  } catch (err: any) {
    console.error("Error fetching messages:", err.message);
    return { data: [], totalCount: 0 };
  }
};
