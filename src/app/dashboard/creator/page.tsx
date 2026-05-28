import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InviteList } from "@/components/creator/invite-list"
import type { InviteMatch } from "@/components/creator/invite-list"
import { formatEuro, formatNumber } from "@/lib/utils"
import { Gift, Megaphone, Wallet, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"
import { CopyLinkButton } from "@/components/creator/copy-link-button"

export const dynamic = "force-dynamic"

export default async function CreatorDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: creator } = await supabase.from("creators").select("*").eq("id", user.id).single()
  if (!creator) redirect("/auth/onboarding/creator")

  const isVolledig = creator.tiktok_handle && creator.niches?.length > 0

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [{ data: pendingMatchesData }, { data: activeCampagnesData }, { data: monthCampagnes }] = await Promise.all([
    supabase
      .from("matches")
      .select("*, brands(bedrijfsnaam, budget_min, budget_max, campagne_types)")
      .eq("creator_id", user.id)
      .eq("status", "pending")
      .order("ai_score", { ascending: false }),
    supabase
      .from("campagnes")
      .select("*, brands(bedrijfsnaam)")
      .eq("creator_id", user.id)
      .eq("status", "actief")
      .order("created_at", { ascending: false }),
    supabase
      .from("campagnes")
      .select("commissie_earned")
      .eq("creator_id", user.id)
      .gte("start_datum", startOfMonth),
  ])

  const pendingMatches = (pendingMatchesData ?? []) as InviteMatch[]
  const activeCampagnes = activeCampagnesData ?? []
  const verdiendDezeMaand = (monthCampagnes ?? []).reduce((s, c) => s + (c.commissie_earned ?? 0), 0)

  const stats = [
    { label: "Open uitnodigingen", value: pendingMatches.length, icon: Gift, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Actieve campagnes", value: activeCampagnes.length, icon: Megaphone, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Verdiend deze maand", value: formatEuro(verdiendDezeMaand), icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
    { label: "GMV 30 dagen", value: formatEuro(creator.gmv_30d ?? 0), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  ]

  return (
    <div className="space-y-6">
      {!isVolledig && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">Compleet je profiel om matches te ontvangen</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-amber-200 rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "40%" }} />
              </div>
              <span className="text-xs text-amber-600">40%</span>
            </div>
          </div>
          <Link href="/dashboard/creator/mijn-profiel">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Profiel invullen</Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hey @{creator.tiktok_handle}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {formatNumber(creator.follower_count ?? 0)} volgers · {creator.avg_engagement_rate ?? 0}% engagement
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Uitnodigingen */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Brand Uitnodigingen</h2>
          <Link href="/dashboard/creator/aanbiedingen">
            <Button variant="ghost" size="sm" className="text-[#ff0050]">
              Alles bekijken <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <InviteList invites={pendingMatches.slice(0, 3)} />
      </div>

      {/* Actieve Campagnes */}
      {activeCampagnes.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Actieve Campagnes</CardTitle>
            <Link href="/dashboard/creator/campagnes">
              <Button variant="ghost" size="sm" className="text-[#ff0050]">
                Alles bekijken <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Campagne", "Brand", "Type", "Affiliate link", "Clicks", "Commissie"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeCampagnes.map((c) => {
                    const brand = c.brands as { bedrijfsnaam: string } | null
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.naam}</td>
                        <td className="px-4 py-3 text-gray-600">{brand?.bedrijfsnaam ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{c.campagne_type ?? "—"}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {c.affiliate_link
                            ? <CopyLinkButton link={c.affiliate_link} />
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">{(c.clicks ?? 0).toLocaleString("nl-BE")}</td>
                        <td className="px-4 py-3 text-green-600 font-semibold">{formatEuro(c.commissie_earned ?? 0)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
