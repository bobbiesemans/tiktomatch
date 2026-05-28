"use client"

import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { acceptMatch, rejectMatch } from "@/app/actions/matches"
import { formatEuro, scoreColor } from "@/lib/utils"
import { CheckCircle, Clock, Gift } from "lucide-react"

export type InviteMatch = {
  id: string
  ai_score: number
  status: string
  campagne_type: string | null
  aanbeveling: string | null
  sterke_punten: string[]
  created_at: string
  brands: {
    bedrijfsnaam: string
    budget_min: number | null
    budget_max: number | null
    campagne_types: string[] | null
  } | null
}

interface Props {
  invites: InviteMatch[]
}

function daysUntilDeadline(createdAt: string): number {
  const deadline = new Date(createdAt)
  deadline.setDate(deadline.getDate() + 7)
  const now = new Date()
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function InviteList({ invites }: Props) {
  const [isPending, startTransition] = useTransition()

  if (invites.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-xl">
        <Gift className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Geen openstaande uitnodigingen</p>
        <p className="text-gray-400 text-sm mt-1">Zorg dat je profiel volledig is ingevuld voor meer matches.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {invites.map((invite) => {
        const brand = invite.brands
        const scoreClr = scoreColor(invite.ai_score)
        const daysLeft = daysUntilDeadline(invite.created_at)
        const isUrgent = daysLeft < 3
        const initials = (brand?.bedrijfsnaam ?? "B").slice(0, 2).toUpperCase()

        return (
          <div key={invite.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              {/* Brand avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: "#1a0533" }}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                {/* Brand name + score */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{brand?.bedrijfsnaam ?? "Brand"}</p>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: scoreClr }}
                  >
                    {invite.ai_score}
                  </div>
                </div>

                {/* Campaign type + budget */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {invite.campagne_type && (
                    <Badge variant="secondary" className="text-xs">{invite.campagne_type}</Badge>
                  )}
                  {(brand?.budget_min != null || brand?.budget_max != null) && (
                    <span className="text-xs text-gray-500">
                      {formatEuro(brand?.budget_min ?? 0)} – {formatEuro(brand?.budget_max ?? 0)}
                    </span>
                  )}
                </div>

                {/* Aanbeveling */}
                {invite.aanbeveling && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{invite.aanbeveling}</p>
                )}

                {/* Sterke punten (first 2) */}
                {invite.sterke_punten.slice(0, 2).map((punt, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-green-700 mb-0.5">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {punt}
                  </div>
                ))}

                {/* Deadline + actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className={`flex items-center gap-1 text-xs ${isUrgent ? "text-red-600 font-semibold" : "text-gray-400"}`}>
                    <Clock className="h-3.5 w-3.5" />
                    {daysLeft > 0 ? `Nog ${daysLeft} dag${daysLeft !== 1 ? "en" : ""}` : "Verlopen"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-green-600 hover:bg-green-700"
                      disabled={isPending || daysLeft <= 0}
                      onClick={() => startTransition(() => acceptMatch(invite.id))}
                    >
                      Accepteren
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                      disabled={isPending}
                      onClick={() => startTransition(() => rejectMatch(invite.id))}
                    >
                      Weigeren
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
