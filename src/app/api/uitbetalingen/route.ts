import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Wordt aangeroepen via cron job elke 2 weken
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  const { data: openUitbetalingen } = await supabaseAdmin
    .from('uitbetalingen')
    .select('*, creator_payments!inner(stripe_account_id, onboarding_voltooid)')
    .eq('status', 'pending')
    .eq('creator_payments.onboarding_voltooid', true)

  if (!openUitbetalingen || openUitbetalingen.length === 0) {
    return NextResponse.json({ bericht: 'Geen openstaande uitbetalingen', verwerkt: 0 })
  }

  let verwerkt = 0
  const fouten: string[] = []

  let stripe
  try { stripe = getStripe() } catch {
    return NextResponse.json({ error: 'Stripe niet geconfigureerd' }, { status: 503 })
  }

  for (const uitbetaling of openUitbetalingen) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(uitbetaling.netto_bedrag * 100),
        currency: 'eur',
        destination: uitbetaling.creator_payments.stripe_account_id,
        metadata: { uitbetaling_id: uitbetaling.id, creator_id: uitbetaling.creator_id },
      })

      await supabaseAdmin
        .from('uitbetalingen')
        .update({
          status: 'paid',
          stripe_transfer_id: transfer.id,
          uitbetaald_op: new Date().toISOString(),
        })
        .eq('id', uitbetaling.id)

      verwerkt++
    } catch (err) {
      fouten.push(`${uitbetaling.id}: ${err instanceof Error ? err.message : 'Onbekende fout'}`)
      await supabaseAdmin
        .from('uitbetalingen')
        .update({ status: 'failed' })
        .eq('id', uitbetaling.id)
    }
  }

  return NextResponse.json({ verwerkt, fouten })
}
