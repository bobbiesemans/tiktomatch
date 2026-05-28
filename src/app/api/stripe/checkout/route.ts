import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { plan } = await request.json() as { plan: PlanKey }
  if (!PLANS[plan]) return NextResponse.json({ error: 'Ongeldig plan' }, { status: 400 })

  const { data: brand } = await supabase
    .from('brands')
    .select('id, bedrijfsnaam')
    .eq('user_id', user.id)
    .single()

  if (!brand) return NextResponse.json({ error: 'Brand profiel vereist' }, { status: 404 })

  // Haal of maak Stripe customer
  const { data: sub } = await supabase
    .from('brand_subscriptions')
    .select('stripe_customer_id')
    .eq('brand_id', brand.id)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: brand.bedrijfsnaam,
      metadata: { brand_id: brand.id, user_id: user.id },
    })
    customerId = customer.id

    await supabase.from('brand_subscriptions').upsert({
      brand_id: brand.id,
      stripe_customer_id: customerId,
      plan,
      status: 'trialing',
    }, { onConflict: 'brand_id' })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PLANS[plan].prijs_id, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success&plan=${plan}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prijzen`,
    metadata: { brand_id: brand.id, plan },
    subscription_data: {
      trial_period_days: 14,
      metadata: { brand_id: brand.id, plan },
    },
  })

  return NextResponse.json({ url: session.url })
}
