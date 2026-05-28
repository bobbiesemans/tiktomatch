import { createClient } from '@supabase/supabase-js'
import { PLATFORM_COMMISSIE } from '@/lib/stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function aanmaakUitbetaling(
  creatorId: string,
  matchId: string,
  brutoBedrag: number
) {
  const commissie = brutoBedrag * PLATFORM_COMMISSIE
  const netto = brutoBedrag - commissie

  return supabaseAdmin.from('uitbetalingen').insert({
    creator_id: creatorId,
    match_id: matchId,
    bruto_bedrag: brutoBedrag,
    platform_commissie: commissie,
    netto_bedrag: netto,
    status: 'pending',
  })
}
