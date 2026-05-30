"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MatchScore } from "@/components/match-score"
import { formatEuro, cn } from "@/lib/utils"
import { CheckCircle, XCircle, MessageSquare, Clock, Gift, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

type MatchWithBrand = {
  id: string
  brand_id: string
  ai_score: number
  score_niche: number | null
  score_engagement: number | null
  score_verkoop: number | null
  score_demo: number | null
  score_budget: number | null
  score_taal: number | null
  sterke_punten: string[]
  risicos: string[]
  aanbeveling: string | null
  campagne_type: string | null
  status: string
  created_at: string
  brands: {
    bedrijfsnaam: string
    beschrijving: string | null
    budget_min: number
    budget_max: number
    campagne_types: string[]
    product_categorieen: string[]
  } | null
}

const TABS = [
  { key: "pending", label: "Nieuw" },
  { key: "accepted", label: "Geaccepteerd" },
  { key: "rejected", label: "Afgewezen" },
  { key: "expired", label: "Verlopen" },
]

function daysLeft(createdAt: string): number {
  const deadline = new Date(createdAt)
  deadline.setDate(deadline.getDate() + 7)
  return Math.ceil((deadline.getTime() - Date.now()) / 86400000)
}

export default function AanbiedingenPage() {
  const [matches, setMatches] = useState<MatchWithBrand[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("pending")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function laad() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("matches")
        .select("*, brands(bedrijfsnaam, beschrijving, budget_min, budget_max, campagne_types, product_categorieen)")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
      setMatches((data as MatchWithBrand[]) ?? [])
      setLoading(false)
    }
    laad()
  }, [])

  async function updateStatus(id: string, status: "accepted" | "rejected") {
    setUpdating(id)
    const supabase = createClient()
    const { error } = await supabase.from("matches").update({ status }).eq("id", id)
    if (error) {
      toast.error("Actie mislukt")
    } else {
      setMatches((prev) => prev.map((m) => m.id === id ? { ...m, status } : m))
      toast.success(status === "accepted" ? "Aanbieding geaccepteerd!" : "Aanbieding afgewezen")
    }
    setUpdating(null)
  }

  const counts = {
    pending: matches.filter((m) => m.status === "pending").length,
    accepted: matches.filter((m) => m.status === "accepted").length,
    rejected: matches.filter((m) => m.status === "rejected").length,
    expired: matches.filter((m) => m.status === "expired").length,
  }

  const filtered = matches.filter((m) => m.status === tab)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Aanbiedingen</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2",
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {label}
            {counts[key as keyof typeof counts] > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                key === "pending" ? "bg-[#ff0050] text-white" : "bg-gray-200 text-gray-600"
              )}>
                {counts[key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Gift className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium">Geen aanbiedingen in deze categorie</p>
          {tab === "pending" && (
            <p className="text-sm mt-2">Compleet je profiel voor meer matches van brands</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((match) => {
            const brand = match.brands
            const days = daysLeft(match.created_at)
            const isUrgent = days <= 3 && tab === "pending"

            return (
              <Card key={match.id} className={cn("overflow-hidden", isUrgent && "border-red-200")}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-5 flex items-start gap-4">
                    {/* Brand avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#1a0533] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(brand?.bedrijfsnaam || "B").slice(0, 2).toUpperCase()}
                    </div>

                    {/* Brand info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{brand?.bedrijfsnaam || "Brand"}</p>
                          {brand?.beschrijving && (
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{brand.beschrijving}</p>
                          )}
                        </div>
                        <MatchScore score={match.ai_score} size="sm" />
                      </div>

                      {/* Tags row */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {match.campagne_type && (
                          <Badge variant="secondary" className="text-xs capitalize">{match.campagne_type}</Badge>
                        )}
                        {brand && (
                          <span className="text-xs text-gray-500">{formatEuro(brand.budget_min)} – {formatEuro(brand.budget_max)}</span>
                        )}
                        {brand?.product_categorieen.slice(0, 2).map((p) => (
                          <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI uitleg */}
                  {match.aanbeveling && (
                    <div className="mx-5 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-700">{match.aanbeveling}</p>
                    </div>
                  )}

                  {/* Sterke punten / risicos */}
                  {(match.sterke_punten?.length > 0 || match.risicos?.length > 0) && (
                    <div className="mx-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {match.sterke_punten?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-1">Sterke punten</p>
                          {match.sterke_punten.slice(0, 2).map((p, i) => (
                            <p key={i} className="text-xs text-gray-600 flex gap-1.5">
                              <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />{p}
                            </p>
                          ))}
                        </div>
                      )}
                      {match.risicos?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-orange-700 mb-1">Aandachtspunten</p>
                          {match.risicos.slice(0, 2).map((r, i) => (
                            <p key={i} className="text-xs text-gray-600 flex gap-1.5">
                              <AlertTriangle className="h-3 w-3 text-orange-400 shrink-0 mt-0.5" />{r}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className={cn(
                    "px-5 py-3 border-t flex items-center justify-between",
                    isUrgent ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
                  )}>
                    <div className={cn("flex items-center gap-1.5 text-xs", isUrgent ? "text-red-600 font-medium" : "text-gray-400")}>
                      <Clock className="h-3 w-3" />
                      {tab === "pending"
                        ? days <= 0 ? "Verlopen" : `${days} dag${days === 1 ? "" : "en"} om te reageren`
                        : new Date(match.created_at).toLocaleDateString("nl-BE")}
                    </div>

                    {tab === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs text-gray-500 flex-1 sm:flex-none"
                          asChild
                        >
                          <a href={`/dashboard/creator/berichten?match=${match.id}`}>
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            Vragen
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                          disabled={updating === match.id}
                          onClick={() => updateStatus(match.id, "rejected")}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Afwijzen
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 text-xs bg-[#ff0050] hover:bg-[#ff337a] flex-1 sm:flex-none shadow-lg shadow-red-200"
                          disabled={updating === match.id}
                          onClick={() => updateStatus(match.id, "accepted")}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Accepteren
                        </Button>
                      </div>
                    )}

                    {tab === "accepted" && (
                      <Badge variant="success" className="text-xs">Geaccepteerd</Badge>
                    )}
                    {tab === "rejected" && (
                      <Badge variant="secondary" className="text-xs">Afgewezen</Badge>
                    )}
                    {tab === "expired" && (
                      <Badge variant="warning" className="text-xs">Verlopen</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
