import { createClient } from "@/lib/supabase/server"
import { berekenMatch } from "@/lib/anthropic"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })

  const body = await request.json()
  const { brand_id, max_results = 20 } = body

  if (!brand_id) return NextResponse.json({ error: "brand_id is verplicht" }, { status: 400 })
  if (brand_id !== user.id) return NextResponse.json({ error: "Geen toegang" }, { status: 403 })

  const { data: brand } = await supabase.from("brands").select("*").eq("id", brand_id).single()
  if (!brand) return NextResponse.json({ error: "Brand niet gevonden" }, { status: 404 })

  const { data: bestaandeMatches } = await supabase
    .from("matches")
    .select("creator_id")
    .eq("brand_id", brand_id)

  const gematcht = bestaandeMatches?.map((m) => m.creator_id) ?? []

  let query = supabase.from("creators").select("*").eq("is_beschikbaar", true)
  if (gematcht.length > 0) {
    query = query.not("id", "in", `(${gematcht.join(",")})`)
  }
  const { data: creators } = await query

  if (!creators || creators.length === 0) {
    return NextResponse.json({ resultaten: [], bericht: "Geen nieuwe creators te scoren" })
  }

  const BATCH_SIZE = 10
  const resultaten: Array<{
    creator_id: string
    tiktok_handle: string
    score: number
    match_id: string
    campagne_type: string
    aanbeveling: string
  }> = []

  for (let i = 0; i < creators.length; i += BATCH_SIZE) {
    const batch = creators.slice(i, i + BATCH_SIZE)

    const batchResults = await Promise.allSettled(
      batch.map(async (creator) => {
        const analyse = await berekenMatch(brand, creator)

        const { data: match } = await supabase
          .from("matches")
          .upsert({
            brand_id,
            creator_id: creator.id,
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
          .select("id")
          .single()

        return {
          creator_id: creator.id,
          tiktok_handle: creator.tiktok_handle,
          score: analyse.totaal_score,
          match_id: match?.id ?? "",
          campagne_type: analyse.campagne_type,
          aanbeveling: analyse.aanbeveling,
        }
      })
    )

    batchResults.forEach((r) => {
      if (r.status === "fulfilled") resultaten.push(r.value)
    })
  }

  const gesorteerd = resultaten
    .sort((a, b) => b.score - a.score)
    .slice(0, max_results)

  return NextResponse.json({
    brand: brand.bedrijfsnaam,
    totaal_gescored: resultaten.length,
    resultaten: gesorteerd,
  })
}
