import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Service role client — omzeilt RLS voor webhook verwerking
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
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
      const sub = event.data.object as Stripe.Subscription & {
        current_period_start: number
        current_period_end: number
      }
      const plan = sub.metadata.plan as string
      const brandId = sub.metadata.brand_id

      await supabaseAdmin
        .from('brand_subscriptions')
        .update({
          stripe_subscription_id: sub.id,
          plan,
          status: mapStripeStatus(sub.status),
          huidige_periode_start: new Date(sub.current_period_start * 1000).toISOString(),
          huidige_periode_einde: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq('brand_id', brandId)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from('brand_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
      if (invoice.subscription) {
        await supabaseAdmin
          .from('brand_subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription)
      }
      break
    }

    case 'account.updated': {
      // Creator Connect onboarding voltooid
      const account = event.data.object as Stripe.Account
      if (account.details_submitted) {
        await supabaseAdmin
          .from('creator_payments')
          .update({ onboarding_voltooid: true })
          .eq('stripe_account_id', account.id)
      }
      break
    }

    // Maandelijkse reset van match tellers (via Stripe invoice)
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string; billing_reason?: string }
      if (invoice.billing_reason === 'subscription_cycle' && invoice.subscription) {
        await supabaseAdmin
          .from('brand_subscriptions')
          .update({ matches_deze_maand: 0, actieve_campagnes: 0 })
          .eq('stripe_subscription_id', invoice.subscription)
      }
      break
    }
  }

  return NextResponse.json({ ontvangen: true })
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  const map: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'cancelled',
    unpaid: 'past_due',
  }
  return map[status] ?? 'active'
}
