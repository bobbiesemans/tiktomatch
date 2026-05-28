import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card as TremorCard, Metric, Text, Flex, BadgeDelta } from "@tremor/react"
import { PipelineBoard } from "@/components/brand/pipeline-board"
import type { PipelineMatch } from "@/components/brand/pipeline-board"
import { formatEuro } from "@/lib/utils"
import { Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

const STATUS_CHIPS: { key: string; label: string; color: string }[] = [
  { key: "pending",   label: "Aanbevolen",  color: "bg-purple-100 text-purple-700" },
  { key: "accepted",  label: "Actief",      color: "bg-blue-100 text-blue-700" },
  { key: "completed", label: "Afgerond",    color: "bg-green-100 text-green-700" },
  { key: "rejected",  label: "Afgewezen",   color: "bg-gray-100 text-gray-600" },
]

export default async function BrandDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: brand } = await supabase.from("brands").select("*").eq("id", user.id).single()
  if (!brand) redirect("/auth/onboarding/brand")

  const [{ data: campagnes }, { data: allMatches }] = await Promise.all([
    supabase.from("campagnes").select("omzet, budget, status").eq("brand_id", user.id),
    supabase
      .from("matches")
      .select("*, creators(*)")
      .eq("brand_id", user.id)
      .order("ai_score", { ascending: false }),
  ])

  const camp = campagnes ?? []
  const matches = (allMatches ?? []) as PipelineMatch[]

  const totalGMV = camp.reduce((s, c) => s + (c.omzet ?? 0), 0)
  const activeCampagnes = camp.filter((c) => c.status === "actief").length
  const totalBudget = camp.reduce((s, c) => s + (c.budget ?? 0), 0)

  const statusCounts = STATUS_CHIPS.reduce<Record<string, number>>((acc, { key }) => {
    acc[key] = matches.filter((m) => m.status === key).length
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{brand.bedrijfsnaam}</p>
        </div>
        <Link href="/dashboard/brand/matches">
          <Button className="bg-[#ff0050] hover:bg-[#ff337a]">
            <Sparkles className="h-4 w-4 mr-2" />
            Nieuwe matches vinden
          </Button>
        </Link>
      </div>

      {/* Tremor metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TremorCard>
          <Text>Totale GMV</Text>
          <Flex alignItems="end" className="space-x-2">
            <Metric>{formatEuro(totalGMV)}</Metric>
            <BadgeDelta deltaType="increase">+0%</BadgeDelta>
          </Flex>
        </TremorCard>
        <TremorCard>
          <Text>Actieve Campagnes</Text>
          <Flex alignItems="end" className="space-x-2">
            <Metric>{activeCampagnes}</Metric>
            <BadgeDelta deltaType="unchanged">actief</BadgeDelta>
          </Flex>
        </TremorCard>
        <TremorCard>
          <Text>Budget Uitgegeven</Text>
          <Flex alignItems="end" className="space-x-2">
            <Metric>{formatEuro(totalBudget)}</Metric>
            <BadgeDelta deltaType="moderateDecrease">totaal</BadgeDelta>
          </Flex>
        </TremorCard>
      </div>

      {/* Pipeline status chips */}
      <div className="flex flex-wrap gap-3">
        {STATUS_CHIPS.map(({ key, label, color }) => (
          <div key={key} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${color}`}>
            <span>{label}</span>
            <span className="font-bold">{statusCounts[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Pipeline board */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Creator Pipeline</h2>
          <Link href="/dashboard/brand/matches" className="text-sm text-[#ff0050] hover:underline font-medium">
            Alles bekijken →
          </Link>
        </div>
        <PipelineBoard matches={matches} />
      </div>
    </div>
  )
}
