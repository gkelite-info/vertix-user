/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../supabaseAdmin"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_REDIRECT_URL ||
          `https://www.vertixtax.com/taxfiling`,
      },
    })

    if (error) throw error

    return NextResponse.json({
      magicLink: data?.properties?.action_link,
    })
  } catch (error: any) {
    console.error("Magic link generation error:", error)
    return NextResponse.json(
      { message: error.message || "Failed to generate magic link" },
      { status: 500 }
    )
  }
}
