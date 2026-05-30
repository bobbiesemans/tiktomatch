// Plan definities — geen Stripe import, veilig voor client-side gebruik
export const PLANS = {
  starter: {
    naam: "Starter",
    prijs: 49,
    prijs_id: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    tier: "starter" as const,
    campagnes: 5,
    matches_per_maand: 50,
    features: ["5 actieve campagnes", "50 AI-matches/mnd", "Basis analytics", "E-mail support"],
  },
  pro: {
    naam: "Pro",
    prijs: 99,
    prijs_id: process.env.STRIPE_PRO_PRICE_ID ?? "",
    tier: "pro" as const,
    campagnes: Infinity,
    matches_per_maand: Infinity,
    features: ["Onbeperkte campagnes", "Onbeperkte matches", "Priority matching", "Geavanceerde analytics", "Telefoon support"],
  },
  agency: {
    naam: "Agency",
    prijs: 249,
    prijs_id: process.env.STRIPE_AGENCY_PRICE_ID ?? "",
    tier: "agency" as const,
    campagnes: Infinity,
    matches_per_maand: Infinity,
    features: ["Alles in Pro", "Tot 10 merkaccounts", "White-label dashboard", "Dedicated manager", "SLA garantie"],
  },
} as const

export type PlanKey = keyof typeof PLANS
export const PLATFORM_COMMISSIE = 0.15
