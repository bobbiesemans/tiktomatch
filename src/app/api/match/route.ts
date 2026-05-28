import { createClient } from "@/lib/supabase/server"
import { berekenMatch } from "@/lib/anthropic"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })

  const body = await request.json()
  const { brand_id, creator_id } = body

  if (!brand_id || !creator_id) {
    return NextResponse.json({ error: "brand_id en creator_id zijn verplicht" }, { status: 400 })
  }

  if (brand_id !== user.id) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 })
  }

  const [{ data: brand }, { data: creator }] = await Promise.all([
    supabase.from("brands").select("*").eq("id", brand_id).single(),
    supabase.from("creators").select("*").eq("id", creator_id).single(),
  ])

  if (!brand) return NextResponse.json({ error: "Brand niet gevonden" }, { status: 404 })
  if (!creator) return NextResponse.json({ error: "Creator niet gevonden" }, { status: 404 })

  let analyse
  try {
    analyse = await berekenMatch(brand, creator)
  } catch {
    return NextResponse.json({ error: "AI analyse mislukt" }, { status: 500 })
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .upsert({
      brand_id,
      creator_id,
      ai_score: analyse.totaal_score,
      score_niche: analyse.scores.niche,
      score_engagement: analyse.scores.engagement,
      score_verkoop: analyse.scores.verkoop,
      score_demo: analyse.scores.demografie,
      score_budget: analyse.scores.budget,
      score_taal: analyse.scores.taal,
      sterke_punten: analyse.sterke_punten,
      risicos: analyse.risicos,
      aanbeveling: analyse.aanbeveling,
      campagne_type: analyse.campagne_type,
      status: "pending",
    }, { onConflict: "brand_id,creator_id" })
    .select()
    .single()

  if (matchError) return NextResponse.json({ error: "Fout bij opslaan match" }, { status: 500 })

  return NextResponse.json({ match_id: match.id, ...analyse })
}
