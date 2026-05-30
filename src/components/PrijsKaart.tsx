'use client'

import { useState } from 'react'
import type { PlanKey } from '@/lib/plans'

interface Props {
  naam: string
  prijs: number
  beschrijving: string
  features: string[]
  plan: PlanKey
  highlighted: boolean
}

export default function PrijsKaart({ naam, prijs, beschrijving, features, plan, highlighted }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else if (res.status === 401) {
      window.location.href = '/auth/register'
    } else {
      // Stripe not yet configured — stuur naar register
      window.location.href = '/auth/register'
    }
    setLoading(false)
  }

  return (
    <div className={`rounded-2xl p-6 border-2 relative ${
      highlighted
        ? 'border-[#ff0050] shadow-xl shadow-red-100'
        : 'border-gray-200'
    }`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff0050] text-white text-xs font-bold px-3 py-1 rounded-full">
          MEEST GEKOZEN
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-lg">{naam}</h3>
        <p className="text-gray-500 text-sm">{beschrijving}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-gray-900">€{prijs}</span>
        <span className="text-gray-500">/maand</span>
        <p className="text-xs text-green-600 mt-1">+ commissie % op sales (door jou te bepalen)</p>
      </div>

      <ul className="space-y-2 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500 font-bold">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full font-semibold py-3 rounded-xl transition disabled:opacity-50 ${
          highlighted
            ? 'bg-[#ff0050] hover:bg-[#ff337a] text-white shadow-lg shadow-red-200'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
      >
        {loading ? 'Doorsturen...' : 'Starten'}
      </button>
    </div>
  )
}
