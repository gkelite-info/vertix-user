const env = process.env.NODE_ENV

export const origin =
  env === "development"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL
