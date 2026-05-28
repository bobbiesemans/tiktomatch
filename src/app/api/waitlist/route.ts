import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.json()
  const { email, user_type, bedrijfsnaam, tiktok_handle } = body

  if (!email || !user_type) {
    return NextResponse.json({ error: "E-mail en type zijn verplicht" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from("waitlist").upsert({
    email: email.toLowerCase().trim(),
    user_type,
    bedrijfsnaam: bedrijfsnaam?.trim() || null,
    tiktok_handle: tiktok_handle?.replace("@", "").trim() || null,
  }, { onConflict: "email" })

  if (error) {
    return NextResponse.json({ error: "Inschrijving mislukt" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
