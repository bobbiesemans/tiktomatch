"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function markAllNotificationsRead() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("notifications").update({ gelezen: true }).eq("user_id", user.id)
  revalidatePath("/dashboard/brand")
  revalidatePath("/dashboard/creator")
}

export async function getUnreadCount(): Promise<number> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("gelezen", false)

  return count ?? 0
}
