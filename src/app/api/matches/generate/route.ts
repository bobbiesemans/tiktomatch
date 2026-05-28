import { createClient } from '@/lib/supabase/server'
import { berekenAIScore } from '@/lib/ai/matching'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  // Haal brand op van ingelogde user
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    return NextResponse.json({ error: 'Brand profiel niet gevonden' }, { status: 404 })
  }

  // Haal alle creators op
  const { data: creators, error: creatorsError } = await supabase
    .from('creators')
    .select('*')

  if (creatorsError || !creators) {
    return NextResponse.json({ error: 'Geen creators gevonden' }, { status: 404 })
  }

  const resultaten = []

  for (const creator of creators) {
    // Skip als match al bestaat
    const { data: bestaand } = await supabase
      .from('matches')
      .select('id')
      .eq('brand_id', brand.id)
      .eq('creator_id', creator.id)
      .single()

    if (bestaand) continue

    const match = await berekenAIScore(creator, brand)

    const { data: nieuwMatch } = await supabase
      .from('matches')
      .insert({
        brand_id: brand.id,
        creator_id: creator.id,
        ai_score: match.score,
        ai_uitleg: JSON.stringify({
          uitleg: match.uitleg,
          sterke_punten: match.sterke_punten,
          aandachtspunten: match.aandachtspunten,
        }),
        status: 'pending',
      })
      .select()
      .single()

    resultaten.push(nieuwMatch)
  }

  return NextResponse.json({ matches: resultaten, aangemaakt: resultaten.length })
}
