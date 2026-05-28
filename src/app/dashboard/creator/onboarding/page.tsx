'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'

const NICHES = [
  'Fashion', 'Beauty', 'Food & Drink', 'Fitness', 'Gaming',
  'Tech', 'Home & Living', 'Reizen', 'Humor', 'Lifestyle',
  'Moeder & Kind', 'Finance', 'Dieren', 'Auto', 'Sport',
]

const CAMPAGNE_TYPES = [
  { value: 'affiliate', label: 'Affiliate', beschrijving: 'Commissie per verkoop via TikTok Shop' },
  { value: 'gifting', label: 'Gifting', beschrijving: 'Gratis producten in ruil voor content' },
  { value: 'paid', label: 'Paid deal', beschrijving: 'Vaste vergoeding per video/post' },
]

export default function OnboardingPage() {
  const params = useSearchParams()
  const [stap, setStap] = useState(Number(params.get('stap') ?? 1))
  const router = useRouter()
  const supabaseRef = useRef<SupabaseClient | null>(null)

  function sb() {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  // Stap 1
  const [handle, setHandle] = useState('')
  const [followerCount, setFollowerCount] = useState('')
  const [avgEngagement, setAvgEngagement] = useState('')
  const [avgViews, setAvgViews] = useState('')
  const [taal, setTaal] = useState<'nl' | 'fr' | 'both'>('nl')
  const [provincie, setProvincie] = useState('')
  const [bio, setBio] = useState('')

  // Stap 2
  const [niches, setNiches] = useState<string[]>([])
  const [verifiedSeller, setVerifiedSeller] = useState(false)
  const [gmv30d, setGmv30d] = useState('')
  const [minVergoeding, setMinVergoeding] = useState('')
  const [campagneTypes, setCampagneTypes] = useState<string[]>([])

  // Stap 3
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeSuccess] = useState(params.get('stripe') === 'success')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (stripeSuccess) setStap(3)
  }, [stripeSuccess])

  function toggleNiche(niche: string) {
    setNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  function toggleCampagne(type: string) {
    setCampagneTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  async function slaStap1Op() {
    if (!handle || !followerCount || !provincie) {
      setError('Vul alle verplichte velden in')
      return
    }
    setLoading(true)
    setError(null)

    const { data: { user } } = await sb().auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await sb().from('creators').upsert({
      user_id: user.id,
      tiktok_handle: handle.replace('@', ''),
      follower_count: parseInt(followerCount),
      avg_engagement_rate: parseFloat(avgEngagement) || 0,
      avg_views: parseInt(avgViews) || 0,
      taal,
      provincie,
      bio,
      niches: [],
      gmv_30d: 0,
      verified_seller: false,
    }, { onConflict: 'user_id' })

    setLoading(false)
    if (error) { setError(error.message); return }
    setStap(2)
  }

  async function slaStap2Op() {
    if (niches.length === 0) { setError('Kies minstens 1 niche'); return }
    setLoading(true)
    setError(null)

    const { data: { user } } = await sb().auth.getUser()
    if (!user) return

    const { error } = await sb().from('creators').update({
      niches,
      verified_seller: verifiedSeller,
      gmv_30d: parseFloat(gmv30d) || 0,
    }).eq('user_id', user.id)

    setLoading(false)
    if (error) { setError(error.message); return }
    setStap(3)
  }

  async function koppelStripe() {
    setStripeLoading(true)
    const res = await fetch('/api/stripe/connect', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setStripeLoading(false)
  }

  async function slaOnboardingOp() {
    const { data: { user } } = await sb().auth.getUser()
    if (!user) return
    await sb().from('profiles').update({ onboarding_voltooid: true }).eq('id', user.id)
    router.push('/dashboard/creator')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Stappen indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s < stap ? 'bg-purple-600 text-white' :
                s === stap ? 'bg-purple-600 text-white ring-4 ring-purple-200' :
                'bg-gray-200 text-gray-500'
              }`}>{s < stap ? '✓' : s}</div>
              {s < 3 && <div className={`flex-1 h-1 rounded ${s < stap ? 'bg-purple-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* STAP 1: TikTok profiel */}
        {stap === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Jouw TikTok profiel</h2>
            <p className="text-gray-500 text-sm mb-6">Voer je statistieken in — je kan dit later aanpassen</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok handle *</label>
                <div className="flex">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 flex items-center text-gray-500">@</span>
                  <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="jouwnaam"
                    className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aantal volgers *</label>
                  <input type="number" value={followerCount} onChange={(e) => setFollowerCount(e.target.value)}
                    placeholder="10000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gem. views per video</label>
                  <input type="number" value={avgViews} onChange={(e) => setAvgViews(e.target.value)}
                    placeholder="5000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engagement rate (%)</label>
                <input type="number" step="0.1" value={avgEngagement} onChange={(e) => setAvgEngagement(e.target.value)}
                  placeholder="4.5" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provincie *</label>
                  <select value={provincie} onChange={(e) => setProvincie(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                    <option value="">Kies provincie</option>
                    {['Antwerpen','Oost-Vlaanderen','West-Vlaanderen','Vlaams-Brabant','Limburg',
                      'Brussel','Henegouwen','Luik','Namen','Luxemburg','Waals-Brabant'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taal content</label>
                  <select value={taal} onChange={(e) => setTaal(e.target.value as 'nl'|'fr'|'both')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                    <option value="nl">Nederlands</option>
                    <option value="fr">Frans</option>
                    <option value="both">Tweetalig</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optioneel)</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                  placeholder="Vertel iets over jezelf..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mt-4">{error}</div>}

            <button onClick={slaStap1Op} disabled={loading}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
              {loading ? 'Opslaan...' : 'Volgende stap →'}
            </button>
          </div>
        )}

        {/* STAP 2: Niche & voorkeuren */}
        {stap === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Jouw niche & voorkeuren</h2>
            <p className="text-gray-500 text-sm mb-6">Dit bepaalt welke brands bij jou matchen</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Niches * (kies er minstens 1)</label>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map((n) => (
                    <button key={n} type="button" onClick={() => toggleNiche(n)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        niches.includes(n)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Campagne types</label>
                <div className="space-y-2">
                  {CAMPAGNE_TYPES.map((ct) => (
                    <button key={ct.value} type="button" onClick={() => toggleCampagne(ct.value)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition ${
                        campagneTypes.includes(ct.value)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}>
                      <span className="font-semibold text-gray-900">{ct.label}</span>
                      <span className="text-gray-500 text-sm ml-2">— {ct.beschrijving}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. vergoeding (€)</label>
                  <input type="number" value={minVergoeding} onChange={(e) => setMinVergoeding(e.target.value)}
                    placeholder="100" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GMV laatste 30 dagen (€)</label>
                  <input type="number" value={gmv30d} onChange={(e) => setGmv30d(e.target.value)}
                    placeholder="0" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setVerifiedSeller(!verifiedSeller)}
                  className={`w-12 h-6 rounded-full transition-colors ${verifiedSeller ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${verifiedSeller ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <div>
                  <span className="font-medium text-gray-900 text-sm">TikTok Shop Verified Seller</span>
                  <p className="text-xs text-gray-500">Hogere match score bij affiliate campagnes</p>
                </div>
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mt-4">{error}</div>}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStap(1)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
                ← Terug
              </button>
              <button onClick={slaStap2Op} disabled={loading}
                className="flex-2 flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                {loading ? 'Opslaan...' : 'Volgende stap →'}
              </button>
            </div>
          </div>
        )}

        {/* STAP 3: Bankgegevens via Stripe Connect */}
        {stap === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">{stripeSuccess ? '✅' : '💳'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {stripeSuccess ? 'Stripe gekoppeld!' : 'Koppel je bankrekening'}
            </h2>
            <p className="text-gray-500 mb-8">
              {stripeSuccess
                ? 'Je bankrekening is succesvol gekoppeld. Je ontvangt automatisch uitbetalingen elke 2 weken.'
                : 'Via Stripe Connect ontvang je veilig je commissies en uitbetalingen. TikToMatch houdt 15% platformcommissie in.'}
            </p>

            {!stripeSuccess && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Hoe het werkt:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Veilig via Stripe (Europese regelgeving)</li>
                  <li>✓ Uitbetaling elke 2 weken op jouw rekening</li>
                  <li>✓ Jij ontvangt 85%, platform houdt 15%</li>
                  <li>✓ Volledig transparant overzicht in je dashboard</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {!stripeSuccess && (
                <button onClick={koppelStripe} disabled={stripeLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                  {stripeLoading ? 'Doorsturen naar Stripe...' : '🔗 Koppel Stripe Connect'}
                </button>
              )}
              <button onClick={slaOnboardingOp}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
                {stripeSuccess ? 'Naar mijn dashboard →' : 'Later instellen, ga verder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
