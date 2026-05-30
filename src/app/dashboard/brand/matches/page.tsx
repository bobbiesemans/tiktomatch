import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PipelineBoard } from "@/components/brand/pipeline-board"
import type { PipelineMatch } from "@/components/brand/pipeline-board"

export const dynamic = "force-dynamic"

export default async function BrandMatchesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: brand } = await supabase.from("brands").select("id").eq("id", user.id).single()
  if (!brand) redirect("/auth/onboarding/brand")

  const [{ data: matchesData }, { data: profile }] = await Promise.all([
    supabase.from("matches").select("*, creators(*)").eq("brand_id", user.id).order("ai_score", { ascending: false }),
    supabase.from("profiles").select("subscription_tier").eq("id", user.id).single(),
  ])

  const matches = (matchesData ?? []) as PipelineMatch[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Creator Matches</h1>
        <p className="text-gray-500 text-sm mt-1">
          {matches.length} creator{matches.length !== 1 ? "s" : ""} in de pipeline
        </p>
      </div>

      <PipelineBoard matches={matches} subscriptionTier={profile?.subscription_tier ?? "free"} />
    </div>
  )
}
