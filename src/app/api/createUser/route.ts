import { NextResponse } from "next/server"
import { supabaseUserAdmin } from "../supabaseUserAdmin"

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    const { data: authUser, error: authError } =
      await supabaseUserAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      })
    if (authError) throw authError

    const now = new Date()

    const { error } = await supabaseUserAdmin.from("vertixusers").insert([
      {
        auth_id: authUser.user.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        name: `${userData.firstname} ${userData.lastname}`,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        password: userData.password,
        dateOfJoining: now,
        createdAt: now,
        updatedAt: now,
      },
    ])
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error creating user:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
