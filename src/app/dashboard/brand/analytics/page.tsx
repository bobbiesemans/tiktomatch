import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatEuro, formatNumber } from "@/lib/utils"
import { TrendingUp, Users, MousePointerClick, ShoppingCart, BarChart2, ArrowUpRight } from "lucide-react"

export default async function BrandAnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: campagnes } = await supabase
    .from("campagnes")
    .select("*, creators(tiktok_handle, display_name, follower_count)")
    .eq("brand_id", user.id)
    .order("omzet", { ascending: false })

  const all = campagnes ?? []

  const totaalClicks = all.reduce((s, c) => s + (c.clicks ?? 0), 0)
  const totaalConversies = all.reduce((s, c) => s + (c.conversies ?? 0), 0)
  const totaalOmzet = all.reduce((s, c) => s + (c.omzet ?? 0), 0)
  const totaalCommissie = all.reduce((s, c) => s + (c.commissie_earned ?? 0), 0)
  const convRate = totaalClicks > 0 ? ((totaalConversies / totaalClicks) * 100).toFixed(1) : "0"
  const roi = totaalCommissie > 0 ? ((totaalOmzet / totaalCommissie) * 100 - 100).toFixed(0) : "0"

  const actiefCampagnes = all.filter((c) => c.status === "actief")
  const topCreators = all
    .filter((c) => c.omzet > 0)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <Badge variant="secondary" className="text-xs">{actiefCampagnes.length} actieve campagnes</Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Totaal clicks", value: formatNumber(totaalClicks), icon: MousePointerClick, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Conversies", value: formatNumber(totaalConversies), icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Totale omzet", value: formatEuro(totaalOmzet), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Commissie betaald", value: formatEuro(totaalCommissie), icon: BarChart2, color: "text-pink-600", bg: "bg-pink-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Extra metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Conversieratio</p>
              <p className="text-3xl font-bold text-gray-900">{convRate}%</p>
              <p className="text-xs text-gray-400 mt-1">clicks → verkopen</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">ROI</p>
              <p className="text-3xl font-bold text-gray-900">{roi}%</p>
              <p className="text-xs text-gray-400 mt-1">omzet vs commissie</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top creators */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Top creators</CardTitle></CardHeader>
          <CardContent>
            {topCreators.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Nog geen campagne-data</p>
            ) : (
              <div className="space-y-4">
                {topCreators.map((c, i) => {
                  const creator = c.creators as { tiktok_handle: string; display_name: string | null; follower_count: number } | null
                  const maxOmzet = topCreators[0]?.omzet ?? 1
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                      <div className="w-8 h-8 rounded-lg bg-[#1a0533] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(creator?.display_name || creator?.tiktok_handle || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {creator?.display_name || `@${creator?.tiktok_handle}`}
                          </p>
                          <p className="text-sm font-semibold text-green-600 shrink-0">{formatEuro(c.omzet)}</p>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#ff0050] rounded-full" style={{ width: `${(c.omzet / maxOmzet) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campagne overzicht */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5" />Campagne prestaties</CardTitle></CardHeader>
          <CardContent>
            {all.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Nog geen campagnes</p>
            ) : (
              <div className="space-y-3">
                {all.slice(0, 5).map((c) => {
                  const creator = c.creators as { tiktok_handle: string } | null
                  const statusColors: Record<string, string> = {
                    actief: "bg-green-500",
                    concept: "bg-gray-300",
                    gepauzeerd: "bg-yellow-400",
                    voltooid: "bg-blue-400",
                  }
                  return (
                    <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[c.status] ?? "bg-gray-300"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.naam}</p>
                        <p className="text-xs text-gray-400">@{creator?.tiktok_handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatEuro(c.omzet ?? 0)}</p>
                        <p className="text-xs text-gray-400">{(c.clicks ?? 0).toLocaleString("nl-BE")} clicks</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
