"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendMessage(matchId: string, content: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Niet ingelogd" }

  // Verifieer dat user onderdeel is van deze match
  const { data: match } = await supabase
    .from("matches")
    .select("brand_id, creator_id")
    .eq("id", matchId)
    .single()

  if (!match || (match.brand_id !== user.id && match.creator_id !== user.id)) {
    return { error: "Geen toegang tot deze conversatie" }
  }

  const { error } = await supabase.from("messages").insert({
    match_id: matchId,
    sender_id: user.id,
    content: content.trim(),
  })

  if (error) return { error: error.message }

  revalidatePath("/dashboard/brand/berichten")
  revalidatePath("/dashboard/creator/berichten")
  return { success: true }
}

export async function markMessagesRead(matchId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("messages")
    .update({ gelezen: true })
    .eq("match_id", matchId)
    .neq("sender_id", user.id)
}
