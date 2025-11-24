import { supabaseCustomer } from "@/api-requests/supabaseClient";

export async function getAllContactInformation(page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabaseCustomer
        .from("contacts")
        .select("*", { count: "exact" })
        .order("createdAt", { ascending: false })
        .range(start, end);

    if (error) {
        console.error("Error fetching contact Information:", error.message);
        return { data: [], totalCount: 0 };
    }

    return {
        data: data ?? [],
        totalCount: count ?? 0,
    };
}
