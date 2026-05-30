import Stripe from "stripe"

// Lazy initialisatie — crasht niet als key ontbreekt/placeholder is
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key || key.startsWith("sk_test_placeholder") || key === "") {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
  }
  return _stripe
}

// Herexporteer PLANS & PLATFORM_COMMISSIE vanuit plans.ts voor backwards compat
export { PLANS, PLATFORM_COMMISSIE, type PlanKey } from "@/lib/plans"
