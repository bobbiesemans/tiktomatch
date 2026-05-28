"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MatchScore } from "@/components/match-score"
import { ScoreModal } from "@/components/score-modal"
import { formatNumber, formatEuro } from "@/lib/utils"
import { Users, TrendingUp, ShoppingBag } from "lucide-react"
import type { MatchAnalysis } from "@/lib/anthropic"

interface Creator {
  id: string
  tiktok_handle: string
  display_name: string | null
  follower_count: number
  avg_engagement_rate: number
  gmv_30d: number
  niches: string[]
  taal: string
  provincie: string | null
  verified_seller: boolean
  is_beschikbaar: boolean
}

interface CreatorCardProps {
  creator: Creator
  matchScore?: number
  matchData?: MatchAnalysis
  onStuurAanbieding?: (creator: Creator) => void
}

export function CreatorCard({ creator, matchScore, matchData, onStuurAanbieding }: CreatorCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const initials = (creator.display_name || creator.tiktok_handle)
    .slice(0, 2).toUpperCase()

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#1a0533] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                  {creator.display_name || creator.tiktok_handle}
                </p>
                <p className="text-xs text-gray-500">@{creator.tiktok_handle}</p>
              </div>
            </div>
            {matchScore !== undefined && (
              <MatchScore
                score={matchScore}
                size="md"
                onClick={matchData ? () => setModalOpen(true) : undefined}
              />
            )}
          </div>

          <div className="flex gap-3 mb-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(creator.follower_count)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {creator.avg_engagement_rate}%
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              {formatEuro(creator.gmv_30d)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {creator.niches.slice(0, 3).map((n) => (
              <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>
            ))}
            {creator.verified_seller && (
              <Badge variant="success" className="text-xs">Verified</Badge>
            )}
            {creator.is_beschikbaar && (
              <Badge variant="success" className="text-xs">Beschikbaar</Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
              <a href={`/dashboard/brand/creator/${creator.id}`}>Profiel</a>
            </Button>
            <Button
              variant="accent"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onStuurAanbieding?.(creator)}
            >
              Aanbieding
            </Button>
          </div>
        </CardContent>
      </Card>

      {matchData && (
        <ScoreModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          score={matchScore!}
          scores={matchData.scores}
          sterke_punten={matchData.sterke_punten}
          risicos={matchData.risicos}
          aanbeveling={matchData.aanbeveling}
          campagne_type={matchData.campagne_type}
          onStuurAanbieding={() => {
            setModalOpen(false)
            onStuurAanbieding?.(creator)
          }}
        />
      )}
    </>
  )
}
