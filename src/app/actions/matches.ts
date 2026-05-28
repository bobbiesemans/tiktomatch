"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type MatchStatus = "pending" | "accepted" | "rejected" | "completed"

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Verify user owns this match (brand_id = user.id OR creator_id = user.id)
  const { data: match, error: fetchError } = await supabase
    .from("matches")
    .select("id, brand_id, creator_id")
    .eq("id", matchId)
    .single()

  if (fetchError || !match) {
    throw new Error("Match niet gevonden")
  }

  if (match.brand_id !== user.id && match.creator_id !== user.id) {
    throw new Error("Geen toegang tot deze match")
  }

  const { error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", matchId)

  if (error) {
    throw new Error("Fout bij bijwerken van status: " + error.message)
  }

  revalidatePath("/dashboard/brand")
  revalidatePath("/dashboard/brand/matches")
  revalidatePath("/dashboard/creator")
  revalidatePath("/dashboard/creator/aanbiedingen")
}

export async function acceptMatch(matchId: string) {
  return updateMatchStatus(matchId, "accepted")
}

export async function rejectMatch(matchId: string) {
  return updateMatchStatus(matchId, "rejected")
}

export async function completeMatch(matchId: string) {
  return updateMatchStatus(matchId, "completed")
}
