import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatEuro, scoreColor } from "@/lib/utils"
import {
  ArrowLeft, Users, TrendingUp, ShoppingBag, MapPin, Globe,
  CheckCircle, AlertTriangle, MessageSquare, Sparkles, ShieldCheck,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CreatorProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Haal creator op
  const { data: creator } = await supabase
    .from("creators")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!creator) notFound()

  // Haal bestaande match op (als die er is)
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("brand_id", user.id)
    .eq("creator_id", params.id)
    .maybeSingle()

  const score = match?.ai_score ?? null
  const scoreClr = score ? scoreColor(score) : "#6b7280"
  const initials = (creator.display_name || creator.tiktok_handle).slice(0, 2).toUpperCase()

  const criteria = match ? [
    { label: "Niche match", score: match.score_niche ?? 0, max: 30 },
    { label: "Engagement", score: match.score_engagement ?? 0, max: 20 },
    { label: "Verkoopkracht", score: match.score_verkoop ?? 0, max: 20 },
    { label: "Doelgroep", score: match.score_demo ?? 0, max: 15 },
    { label: "Budget fit", score: match.score_budget ?? 0, max: 10 },
    { label: "Taal", score: match.score_taal ?? 0, max: 5 },
  ] : []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/dashboard/brand/matches" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
        <ArrowLeft className="h-4 w-4" /> Terug naar matches
      </Link>

      {/* Hero card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
              style={{ backgroundColor: "#1a0533" }}
            >
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {creator.display_name || `@${creator.tiktok_handle}`}
                  </h1>
                  <p className="text-gray-500">@{creator.tiktok_handle}</p>
                  {creator.verified_seller && (
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-medium">Verified TikTok Seller</span>
                    </div>
                  )}
                </div>

                {/* AI Score */}
                {score && (
                  <div
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: scoreClr }}
                  >
                    <span className="text-xl font-bold leading-none">{score}</span>
                    <span className="text-xs opacity-80">score</span>
                  </div>
                )}
              </div>

              {/* Stats rij */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-gray-400" />
                  <strong>{formatNumber(creator.follower_count)}</strong> volgers
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <strong>{creator.avg_engagement_rate}%</strong> engagement
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <ShoppingBag className="h-4 w-4 text-gray-400" />
                  <strong>{formatEuro(creator.gmv_30d)}</strong> GMV/30d
                </div>
                {creator.provincie && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {creator.provincie}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Globe className="h-4 w-4 text-gray-400" />
                  {creator.taal === "nl" ? "Nederlands" : creator.taal === "fr" ? "Frans" : "NL + FR"}
                </div>
              </div>

              {/* Niches */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(creator.niches ?? []).map((n: string) => (
                  <Badge key={n} variant="secondary">{n}</Badge>
                ))}
                {(creator.campagne_types ?? []).map((t: string) => (
                  <Badge key={t} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 capitalize">{t}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{creator.bio}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            {match ? (
              <Link href={`/dashboard/brand/berichten?match=${match.id}`}>
                <Button className="bg-[#1a0533] hover:bg-[#2d0955] gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Berichtigen via platform
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/brand/matches">
                <Button className="bg-[#ff0050] hover:bg-[#ff337a] gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI match aanmaken
                </Button>
              </Link>
            )}
            {creator.tiktok_profiel_url && (
              <a href={creator.tiktok_profiel_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  TikTok profiel bekijken
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI match details */}
      {match && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score criteria */}
          <Card>
            <CardHeader><CardTitle className="text-base">AI Score breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {criteria.map(({ label, score: s, max }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-xs font-semibold text-gray-900">{s}/{max}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(s / max) * 100}%`, backgroundColor: scoreColor(Math.round((s / max) * 100)) }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sterke punten & risico's */}
          <div className="space-y-4">
            {(match.sterke_punten?.length ?? 0) > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base text-green-700">Sterke punten</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {match.sterke_punten.map((p: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {p}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(match.risicos?.length ?? 0) > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base text-amber-700">Aandachtspunten</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {match.risicos.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      {r}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* AI aanbeveling */}
      {match?.aanbeveling && (
        <Card className="border-purple-100 bg-purple-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-800 mb-1">AI Aanbeveling</p>
                <p className="text-sm text-purple-700 leading-relaxed">{match.aanbeveling}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anti-bypass notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Platform-only communicatie.</strong> Alle contacten verlopen uitsluitend via TikToMatch.
          Directe contactgegevens zijn niet zichtbaar ter bescherming van beide partijen en de integriteit van het platform.
        </p>
      </div>
    </div>
  )
}
