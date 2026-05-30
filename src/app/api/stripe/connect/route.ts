import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  let stripe
  try { stripe = getStripe() } catch {
    return NextResponse.json({ error: 'Stripe niet geconfigureerd' }, { status: 503 })
  }

  const { data: creator } = await supabase.from('creators').select('id').eq('id', user.id).single()
  if (!creator) return NextResponse.json({ error: 'Creator profiel vereist' }, { status: 404 })

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
  let accountId = profile?.stripe_customer_id

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'BE',
      email: user.email,
      capabilities: { transfers: { requested: true } },
      metadata: { user_id: user.id },
    })
    accountId = account.id
    await supabase.from('profiles').update({ stripe_customer_id: accountId }).eq('id', user.id)
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator/instellingen`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator/instellingen?stripe=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
