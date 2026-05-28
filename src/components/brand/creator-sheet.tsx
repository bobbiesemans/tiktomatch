"use client"

import { useTransition } from "react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { acceptMatch } from "@/app/actions/matches"
import { formatNumber, formatEuro, scoreColor } from "@/lib/utils"
import { CheckCircle, AlertTriangle, ShieldCheck, MapPin, Users, TrendingUp } from "lucide-react"
import type { PipelineMatch } from "@/components/brand/pipeline-board"

interface Props {
  match: PipelineMatch | null
  onClose: () => void
}

const CRITERIA = [
  { key: "score_niche",       label: "Niche-overlap",  max: 30 },
  { key: "score_engagement",  label: "Engagement",     max: 20 },
  { key: "score_verkoop",     label: "Verkoopkracht",  max: 20 },
  { key: "score_demo",        label: "Demografie",     max: 15 },
  { key: "score_budget",      label: "Budget fit",     max: 10 },
  { key: "score_taal",        label: "Taal & regio",   max: 5  },
] as const

export function CreatorSheet({ match, onClose }: Props) {
  const [isPending, startTransition] = useTransition()

  const c = match?.creators ?? null

  function handleAccept() {
    if (!match) return
    startTransition(async () => {
      await acceptMatch(match.id)
      onClose()
    })
  }

  if (!match || !c) {
    return (
      <Sheet open={false} onOpenChange={() => onClose()}>
        <SheetContent />
      </Sheet>
    )
  }

  const initials = (c.display_name ?? c.tiktok_handle).slice(0, 2).toUpperCase()
  const score = match.ai_score
  const scoreClr = scoreColor(score)

  // SVG circle params
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <Sheet open={!!match} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <SheetHeader className="pr-10">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                style={{ backgroundColor: "#1a0533" }}
              >
                {initials}
              </div>
              <div>
                <SheetTitle className="text-xl">{c.display_name ?? c.tiktok_handle}</SheetTitle>
                <SheetDescription className="text-sm">@{c.tiktok_handle}</SheetDescription>
                {c.verified_seller && (
                  <Badge className="mt-1 bg-green-100 text-green-700 border-0 text-xs">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Seller
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{formatNumber(c.follower_count)}</p>
                <p className="text-xs text-gray-500">Volgers</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <TrendingUp className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{c.avg_engagement_rate}%</p>
                <p className="text-xs text-gray-500">Engagement</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <TrendingUp className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{formatEuro(c.gmv_30d)}</p>
                <p className="text-xs text-gray-500">GMV 30d</p>
              </div>
            </div>
            {c.provincie && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {c.provincie}
              </div>
            )}

            {/* AI Score */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                {/* SVG donut */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                    <circle cx="44" cy="44" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="44" cy="44" r={radius}
                      fill="none"
                      stroke={scoreClr}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900" style={{ color: scoreClr }}>{score}</span>
                    <span className="text-xs text-gray-500">/100</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">AI Match Score</p>
                  {match.campagne_type && (
                    <Badge variant="secondary" className="mt-1 text-xs">{match.campagne_type}</Badge>
                  )}
                </div>
              </div>

              {/* Criteria bars */}
              <div className="space-y-2">
                {CRITERIA.map(({ key, label, max }) => {
                  const val = (match[key] as number | null) ?? 0
                  const pct = Math.round((val / max) * 100)
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-gray-800">{val} / {max}pt</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: scoreClr }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sterke punten */}
            {match.sterke_punten.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Sterke punten</h3>
                <ul className="space-y-1.5">
                  {match.sterke_punten.map((punt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {punt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risico's */}
            {match.risicos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Aandachtspunten</h3>
                <ul className="space-y-1.5">
                  {match.risicos.map((risico, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                      {risico}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Aanbeveling */}
            {match.aanbeveling && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">AI Aanbeveling</p>
                <p className="text-sm text-blue-900">{match.aanbeveling}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <SheetFooter>
            {match.status === "pending" && (
              <Button
                className="bg-green-600 hover:bg-green-700 flex-1"
                disabled={isPending}
                onClick={handleAccept}
              >
                {isPending ? "Uitnodigen..." : "Uitnodigen"}
              </Button>
            )}
            <SheetClose asChild>
              <Button variant="outline" onClick={onClose}>Sluiten</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
