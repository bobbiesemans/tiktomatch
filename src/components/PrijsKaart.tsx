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
    if (data.url) window.location.href = data.url
    else window.location.href = '/auth/register'
    setLoading(false)
  }

  return (
    <div className={`rounded-2xl p-6 border relative flex flex-col ${
      highlighted
        ? 'bg-white border-[#ff0050] shadow-2xl shadow-[#ff0050]/20 scale-[1.03]'
        : 'bg-[#1a1a1a] border-white/10'
    }`}>
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff0050] text-white text-xs font-black px-4 py-1.5 rounded-full tracking-wide">
          MEEST GEKOZEN
        </div>
      )}

      <div className="mb-4">
        <h3 className={`font-black text-xl mb-1 ${highlighted ? 'text-gray-900' : 'text-white'}`}>{naam}</h3>
        <p className={`text-sm ${highlighted ? 'text-gray-500' : 'text-white/40'}`}>{beschrijving}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className={`text-5xl font-black ${highlighted ? 'text-gray-900' : 'text-white'}`}>€{prijs}</span>
          <span className={`mb-1.5 text-sm ${highlighted ? 'text-gray-400' : 'text-white/30'}`}>/maand</span>
        </div>
        <p className={`text-xs mt-1.5 ${highlighted ? 'text-green-600' : 'text-[#00d4c8]'}`}>
          + commissie % op sales (door jou bepaald)
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${highlighted ? 'bg-[#ff0050] text-white' : 'bg-white/10 text-white'}`}>✓</span>
            <span className={`text-sm ${highlighted ? 'text-gray-600' : 'text-white/60'}`}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 ${
          highlighted
            ? 'bg-[#ff0050] hover:bg-[#ff337a] text-white shadow-lg shadow-[#ff0050]/30 hover:shadow-[#ff0050]/50'
            : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30'
        }`}
      >
        {loading ? 'Doorsturen...' : 'Starten →'}
      </button>
    </div>
  )
}
