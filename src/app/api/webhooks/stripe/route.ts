import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  let stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Stripe niet geconfigureerd' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verificatie mislukt' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata.user_id
      const plan = sub.metadata.plan ?? 'starter'
      const tierMap: Record<string, string> = { starter: 'starter', pro: 'pro', agency: 'agency' }
      const tier = tierMap[plan] ?? 'starter'

      if (userId) {
        await supabaseAdmin.from('profiles').update({ subscription_tier: tier }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata.user_id
      if (userId) {
        await supabaseAdmin.from('profiles').update({ subscription_tier: 'free' }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      // Optioneel: stuur email notificatie
      break
    }
  }

  return NextResponse.json({ ontvangen: true })
}
