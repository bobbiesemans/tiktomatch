import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!creator) return NextResponse.json({ error: 'Creator profiel vereist' }, { status: 404 })

  // Haal bestaand Stripe account op of maak nieuw
  const { data: payment } = await supabase
    .from('creator_payments')
    .select('stripe_account_id, onboarding_voltooid')
    .eq('creator_id', creator.id)
    .single()

  let accountId = payment?.stripe_account_id

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'BE',
      email: user.email,
      capabilities: { transfers: { requested: true } },
      business_profile: { mcc: '7372', url: process.env.NEXT_PUBLIC_APP_URL },
      metadata: { creator_id: creator.id, user_id: user.id },
    })
    accountId = account.id

    await supabase.from('creator_payments').upsert({
      creator_id: creator.id,
      stripe_account_id: accountId,
      onboarding_voltooid: false,
    }, { onConflict: 'creator_id' })
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator/onboarding?stap=3&refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator/onboarding?stap=3&stripe=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
