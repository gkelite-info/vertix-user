/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/generate-magic-link/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/api-requests/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate a magic link valid for 30 mins
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        expires_in: 1800, // 30 minutes in seconds
      } as any,
    })

    if (error) throw error

    return NextResponse.json({ link: data?.properties?.action_link })
  } catch (err: any) {
    console.error("Error generating magic link:", err.message)
    return NextResponse.json(
      { error: err?.message || "Failed to generate link" },
      { status: 500 }
    )
  }
}
