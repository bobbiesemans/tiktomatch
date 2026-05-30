"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { acceptMatch, rejectMatch, completeMatch } from "@/app/actions/matches"
import { CreatorSheet } from "@/components/brand/creator-sheet"
import { formatNumber, formatEuro, scoreColor } from "@/lib/utils"
import { Search, CheckCircle2, ShieldCheck, MessageSquare, Lock } from "lucide-react"
import Link from "next/link"

export type PipelineMatch = {
  id: string
  ai_score: number
  status: string
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
  created_at: string
  creators: {
    id: string
    tiktok_handle: string
    display_name: string | null
    follower_count: number
    avg_engagement_rate: number
    gmv_30d: number
    niches: string[]
    verified_seller: boolean
    provincie: string | null
  } | null
}

type ColumnStatus = "pending" | "accepted" | "completed" | "rejected"

const COLUMNS: { status: ColumnStatus; label: string; color: string; bg: string }[] = [
  { status: "pending",   label: "AI Matches",  color: "text-purple-700", bg: "bg-purple-50" },
  { status: "accepted",  label: "Actief",       color: "text-blue-700",   bg: "bg-blue-50" },
  { status: "completed", label: "Afgerond",     color: "text-green-700",  bg: "bg-green-50" },
  { status: "rejected",  label: "Afgewezen",    color: "text-gray-600",   bg: "bg-gray-100" },
]

const FREE_LIMIT = 5

interface Props {
  matches: PipelineMatch[]
  subscriptionTier?: string
}

export function PipelineBoard({ matches, subscriptionTier = "free" }: Props) {
  const isFree = subscriptionTier === "free"
  const [selectedMatch, setSelectedMatch] = useState<PipelineMatch | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ColumnStatus>("all")
  const [isPending, startTransition] = useTransition()
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({})

  const getStatus = (m: PipelineMatch) => optimisticStatuses[m.id] ?? m.status

  const filtered = matches.filter((m) => {
    const c = m.creators
    if (!c) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const name = (c.display_name ?? "").toLowerCase()
      const handle = c.tiktok_handle.toLowerCase()
      if (!name.includes(q) && !handle.includes(q)) return false
    }
    if (statusFilter !== "all" && getStatus(m) !== statusFilter) return false
    return true
  })

  function handleAction(matchId: string, action: "accept" | "reject" | "complete") {
    const newStatus = action === "accept" ? "accepted" : action === "reject" ? "rejected" : "completed"
    setOptimisticStatuses((prev) => ({ ...prev, [matchId]: newStatus }))
    startTransition(async () => {
      try {
        if (action === "accept") await acceptMatch(matchId)
        else if (action === "reject") await rejectMatch(matchId)
        else await completeMatch(matchId)
      } catch {
        // Revert optimistic update on error
        setOptimisticStatuses((prev) => {
          const next = { ...prev }
          delete next[matchId]
          return next
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Zoek creator..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "accepted", "completed", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#1a0533] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "Alle" : s === "pending" ? "AI Matches" : s === "accepted" ? "Actief" : s === "completed" ? "Afgerond" : "Afgewezen"}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colMatches = filtered.filter((m) => getStatus(m) === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${col.bg}`}>
                <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${col.color}`}>
                  {colMatches.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 mt-2 min-h-24">
                {colMatches.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    Geen creators
                  </div>
                )}
                {colMatches.map((match, idx) => {
                  const c = match.creators
                  if (!c) return null
                  const initials = (c.display_name ?? c.tiktok_handle).slice(0, 2).toUpperCase()
                  const score = match.ai_score
                  const scoreClr = scoreColor(score)
                  const isLocked = isFree && col.status === "pending" && idx >= FREE_LIMIT

                  return (
                    <div
                      key={match.id}
                      className={`bg-white border border-gray-200 rounded-xl p-3 shadow-sm transition-shadow relative ${isLocked ? "opacity-60" : "hover:shadow-md cursor-pointer"}`}
                      onClick={() => !isLocked && setSelectedMatch(match)}
                    >
                    {/* Locked overlay voor free tier */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 p-4">
                        <Lock className="h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-xs font-semibold text-gray-700 text-center mb-2">Upgrade voor meer matches</p>
                        <Link href="/dashboard/brand/instellingen">
                          <Button size="sm" className="h-7 text-xs bg-[#ff0050] hover:bg-[#ff337a]">Upgraden</Button>
                        </Link>
                      </div>
                    )}
                      {/* Avatar + name */}
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: "#1a0533" }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {c.display_name ?? c.tiktok_handle}
                          </p>
                          <p className="text-xs text-gray-500 truncate">@{c.tiktok_handle}</p>
                        </div>
                        {/* AI score circle */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: scoreClr }}
                        >
                          {score}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{formatNumber(c.follower_count)}</p>
                          <p>volgers</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.avg_engagement_rate}%</p>
                          <p>engagement</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{formatEuro(c.gmv_30d)}</p>
                          <p>GMV</p>
                        </div>
                      </div>

                      {/* Niches */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {c.niches.slice(0, 2).map((n) => (
                          <Badge key={n} variant="secondary" className="text-xs py-0 px-1.5">{n}</Badge>
                        ))}
                        {c.verified_seller && (
                          <Badge className="text-xs py-0 px-1.5 bg-green-100 text-green-700 border-0">
                            <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {col.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                              disabled={isPending}
                              onClick={() => handleAction(match.id, "accept")}
                            >
                              Uitnodigen
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              disabled={isPending}
                              onClick={() => handleAction(match.id, "reject")}
                            >
                              Weigeren
                            </Button>
                          </>
                        )}
                        {col.status === "accepted" && (
                          <>
                            <Link href={`/dashboard/brand/berichten?match=${match.id}`} onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                <MessageSquare className="h-3 w-3" />Chat
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700"
                              disabled={isPending}
                              onClick={() => handleAction(match.id, "complete")}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Afronden
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setSelectedMatch(match)}
                            >
                              Details
                            </Button>
                          </>
                        )}
                        {(col.status === "completed" || col.status === "rejected") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs w-full"
                            onClick={() => setSelectedMatch(match)}
                          >
                            Details
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <CreatorSheet match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  )
}
