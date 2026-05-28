import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function scoreColor(score: number): string {
  if (score >= 75) return "#22c55e"
  if (score >= 50) return "#f97316"
  return "#ef4444"
}

export function scoreLabel(score: number): string {
  if (score >= 75) return "Sterke match"
  if (score >= 50) return "Goede match"
  return "Matige match"
}

export const NICHES = [
  "Fashion", "Beauty", "Food & Drink", "Fitness", "Gaming",
  "Tech", "Home & Living", "Reizen", "Humor", "Lifestyle",
  "Moeder & Kind", "Finance", "Dieren", "Auto", "Sport", "Health", "Kids", "Pets", "Other",
] as const

export const PROVINCIES = [
  "Antwerpen", "Brussel", "Oost-Vlaanderen", "West-Vlaanderen",
  "Vlaams-Brabant", "Waals-Brabant", "Henegouwen", "Luik",
  "Namen", "Luxemburg", "Limburg",
] as const

export const CAMPAGNE_TYPES = ["affiliate", "gifting", "paid"] as const
export type CampagneType = typeof CAMPAGNE_TYPES[number]
