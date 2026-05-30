import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { PLANS, type PlanKey } from '@/lib/plans'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { plan } = await request.json() as { plan: PlanKey }
  if (!PLANS[plan]) return NextResponse.json({ error: 'Ongeldig plan' }, { status: 400 })

  let stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Stripe is nog niet geconfigureerd. Neem contact op via info@tiktomatch.be' }, { status: 503 })
  }

  const { data: brand } = await supabase.from('brands').select('id, bedrijfsnaam').eq('id', user.id).single()
  if (!brand) return NextResponse.json({ error: 'Brand profiel vereist' }, { status: 404 })

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: brand.bedrijfsnaam,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PLANS[plan].prijs_id, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/brand/instellingen?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/brand/instellingen`,
    metadata: { user_id: user.id, plan },
    subscription_data: {
      trial_period_days: 14,
      metadata: { user_id: user.id, plan },
    },
  })

  return NextResponse.json({ url: session.url })
}
