'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'brand' | 'creator'>('brand')
  const [extra, setExtra] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        user_type: type,
        bedrijfsnaam: type === 'brand' ? extra : undefined,
        tiktok_handle: type === 'creator' ? extra : undefined,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      }),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Je staat op de lijst!</h3>
        <p className="text-gray-500 text-sm">We sturen je een e-mail zodra je vroege toegang kunt activeren.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setType('brand')}
          className={`p-3 rounded-xl border-2 font-semibold text-sm transition ${
            type === 'brand' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-200'
          }`}>
          🏢 Brand
        </button>
        <button type="button" onClick={() => setType('creator')}
          className={`p-3 rounded-xl border-2 font-semibold text-sm transition ${
            type === 'creator' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-200'
          }`}>
          🎬 Creator
        </button>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="jij@bedrijf.be"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
      />

      <input
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
        placeholder={type === 'brand' ? 'Bedrijfsnaam (optioneel)' : 'TikTok handle (optioneel)'}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
      />

      {status === 'error' && (
        <p className="text-red-600 text-sm">Er ging iets mis. Probeer opnieuw.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 text-lg"
      >
        {status === 'loading' ? 'Inschrijven...' : 'Vroege toegang aanvragen →'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Geen spam. Je kan je altijd uitschrijven.
      </p>
    </form>
  )
}
