import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EarningsChart } from "@/components/creator/earnings-chart"
import { formatEuro } from "@/lib/utils"
import { Wallet, TrendingUp, Clock, ArrowDownToLine, Info } from "lucide-react"

export const dynamic = "force-dynamic"

interface Campagne {
  id: string
  naam: string
  start_datum: string | null
  eind_datum: string | null
  clicks: number | null
  conversies: number | null
  omzet: number | null
  commissie_percentage: number | null
  commissie_earned: number | null
  status: string
  affiliate_link: string | null
  brands: { bedrijfsnaam: string } | null
}

function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `W${String(weekNo).padStart(2, "0")} ${d.getUTCFullYear()}`
}

function getWeeklyData(campagnes: Campagne[]) {
  // Build last 8 week keys
  const weeks: string[] = []
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    weeks.push(getISOWeekKey(d))
  }

  const weekMap: Record<string, { verwacht: number; daadwerkelijk: number }> = {}
  weeks.forEach((w) => { weekMap[w] = { verwacht: 0, daadwerkelijk: 0 } })

  campagnes.forEach((c) => {
    if (!c.start_datum) return
    const key = getISOWeekKey(new Date(c.start_datum))
    if (weekMap[key]) {
      weekMap[key].daadwerkelijk += c.commissie_earned ?? 0
      const commissiePct = c.commissie_percentage ?? 15
      weekMap[key].verwacht += (c.omzet ?? 0) * (commissiePct / 100)
    }
  })

  return weeks.map((datum) => ({
    datum,
    verwacht: Math.round(weekMap[datum].verwacht),
    daadwerkelijk: Math.round(weekMap[datum].daadwerkelijk),
  }))
}

export default async function VerdiensteenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: campagnesData } = await supabase
    .from("campagnes")
    .select("*, brands(bedrijfsnaam)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })

  const all = (campagnesData ?? []) as Campagne[]

  const now = new Date()
  const thisMonth = all.filter((c) => {
    if (!c.start_datum) return false
    const d = new Date(c.start_datum)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const verdiendDezeMaand = thisMonth.reduce((s, c) => s + (c.commissie_earned ?? 0), 0)
  const totaalVerdiend = all.reduce((s, c) => s + (c.commissie_earned ?? 0), 0)
  const openstaandOmzet = all.filter((c) => c.status === "actief").reduce((s, c) => s + (c.omzet ?? 0), 0)
  const openstaandCommissie = openstaandOmzet * 0.85
  const kanUitbetalen = openstaandCommissie >= 50

  const weeklyData = getWeeklyData(all)

  const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
    actief: { label: "Actief", variant: "success" },
    concept: { label: "Concept", variant: "secondary" },
    gepauzeerd: { label: "Gepauzeerd", variant: "warning" },
    voltooid: { label: "Voltooid", variant: "secondary" },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Verdiensten</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Deze maand</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatEuro(verdiendDezeMaand)}</p>
            <p className="text-xs text-gray-400 mt-1">commissie verdiend</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Totaal verdiend</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatEuro(totaalVerdiend)}</p>
            <p className="text-xs text-gray-400 mt-1">over alle campagnes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Openstaand</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatEuro(openstaandCommissie)}</p>
            <p className="text-xs text-gray-400 mt-1">nog niet uitbetaald</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inkomsten per week (laatste 8 weken)</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsChart data={weeklyData} />
        </CardContent>
      </Card>

      {/* Uitbetaling aanvragen */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Uitbetaling aanvragen</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {kanUitbetalen
                  ? `${formatEuro(openstaandCommissie)} staat klaar voor uitbetaling`
                  : `Minimum ${formatEuro(50)} vereist · nog ${formatEuro(Math.max(0, 50 - openstaandCommissie))} te gaan`}
              </p>
            </div>
            <Button
              className="bg-[#ff0050] hover:bg-[#ff337a]"
              disabled={!kanUitbetalen}
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Uitbetalen ({formatEuro(openstaandCommissie)})
            </Button>
          </div>
          {!kanUitbetalen && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700">Uitbetalingen worden verwerkt via Stripe. Minimum drempel is €50.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campagne tabel */}
      <Card>
        <CardHeader>
          <CardTitle>Overzicht per campagne</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Campagne", "Brand", "Periode", "Clicks", "Conversies", "Omzet", "Commissie %", "Commissie €", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {all.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      Nog geen campagne-inkomsten
                    </td>
                  </tr>
                )}
                {all.map((c) => {
                  const brand = c.brands as { bedrijfsnaam: string } | null
                  const b = statusBadge[c.status] ?? { label: c.status, variant: "secondary" as const }
                  const periode = c.start_datum
                    ? `${c.start_datum}${c.eind_datum ? ` – ${c.eind_datum}` : ""}`
                    : "—"
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.naam}</td>
                      <td className="px-4 py-3 text-gray-600">{brand?.bedrijfsnaam ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{periode}</td>
                      <td className="px-4 py-3">{(c.clicks ?? 0).toLocaleString("nl-BE")}</td>
                      <td className="px-4 py-3">{(c.conversies ?? 0).toLocaleString("nl-BE")}</td>
                      <td className="px-4 py-3 font-medium">{formatEuro(c.omzet ?? 0)}</td>
                      <td className="px-4 py-3 text-gray-600">{c.commissie_percentage ?? 15}%</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formatEuro(c.commissie_earned ?? 0)}</td>
                      <td className="px-4 py-3"><Badge variant={b.variant}>{b.label}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
