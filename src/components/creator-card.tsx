"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatNumber, formatEuro } from "@/lib/utils"
import { ScoreModal } from "@/components/score-modal"
import type { MatchAnalysis } from "@/lib/anthropic"
import {
  Users, ShoppingBag, MapPin, Globe,
  ShieldCheck, Sparkles, MessageSquare, Play, Heart, Eye
} from "lucide-react"

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
  bio?: string | null
  avg_views?: number
}

interface CreatorCardProps {
  creator: Creator
  matchScore?: number
  matchData?: MatchAnalysis
  onStuurAanbieding?: (creator: Creator) => void
}

// Niche → gradient kleur
const NICHE_GRADIENTS: Record<string, string> = {
  "Fashion":        "from-pink-500 to-rose-600",
  "Beauty":         "from-purple-500 to-pink-500",
  "Food & Drink":   "from-orange-400 to-red-500",
  "Fitness":        "from-emerald-500 to-teal-600",
  "Gaming":         "from-blue-600 to-violet-600",
  "Tech":           "from-cyan-500 to-blue-600",
  "Home & Living":  "from-amber-400 to-orange-500",
  "Reizen":         "from-sky-400 to-blue-500",
  "Humor":          "from-yellow-400 to-orange-400",
  "Lifestyle":      "from-fuchsia-500 to-purple-600",
  "Finance":        "from-green-500 to-emerald-600",
  "Health":         "from-teal-400 to-cyan-500",
}

function getGradient(niches: string[]): string {
  for (const n of niches) {
    if (NICHE_GRADIENTS[n]) return NICHE_GRADIENTS[n]
  }
  return "from-[#1a0533] to-[#ff0050]"
}

export function CreatorCard({ creator, matchScore, matchData, onStuurAanbieding }: CreatorCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const gradient = getGradient(creator.niches)
  const initials = (creator.display_name || creator.tiktok_handle).slice(0, 2).toUpperCase()
  const estimatedEarnings = Math.round(creator.gmv_30d * 0.1)

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

        {/* Hero gradient banner */}
        <div className={`relative h-28 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {/* Decoratieve cirkels */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />

          {/* Match score rechtsboven */}
          {matchScore !== undefined && (
            <button
              onClick={matchData ? () => setModalOpen(true) : undefined}
              className="absolute top-3 right-3 z-10"
            >
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-[#ff0050]" />
                <span className="text-sm font-extrabold text-gray-900">{matchScore}</span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </button>
          )}

          {/* TikTok badge */}
          {creator.verified_seller && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </div>
            </div>
          )}

          {/* Availability badge */}
          {creator.is_beschikbaar && !creator.verified_seller && (
            <div className="absolute top-3 left-3">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
            </div>
          )}
        </div>

        {/* Avatar — overlapt banner */}
        <div className="relative px-5">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} border-4 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-2xl`}>
              {initials}
            </div>
            {/* Engagement indicator */}
            <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
              <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
              <span className="font-semibold text-gray-700">{creator.avg_engagement_rate}%</span>
            </div>
          </div>

          {/* Name + handle */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base truncate">
                {creator.display_name || `@${creator.tiktok_handle}`}
              </h3>
            </div>
            <p className="text-sm text-gray-400 font-medium">@{creator.tiktok_handle}</p>
            {creator.bio && (
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{creator.bio}</p>
            )}
          </div>

          {/* Stats rij */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <Users className="h-3 w-3" />
              </div>
              <p className="text-sm font-bold text-gray-900">{formatNumber(creator.follower_count)}</p>
              <p className="text-xs text-gray-400">volgers</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <Eye className="h-3 w-3" />
              </div>
              <p className="text-sm font-bold text-gray-900">{formatNumber(creator.avg_views ?? 0)}</p>
              <p className="text-xs text-gray-400">views/video</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <ShoppingBag className="h-3 w-3" />
              </div>
              <p className="text-sm font-bold text-green-600">{formatEuro(creator.gmv_30d)}</p>
              <p className="text-xs text-gray-400">GMV/30d</p>
            </div>
          </div>

          {/* Geschatte commissie */}
          {estimatedEarnings > 0 && (
            <div className="mb-4 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700 font-medium">Geschatte commissie (10%)</span>
                <span className="text-sm font-bold text-green-700">{formatEuro(estimatedEarnings)}/mnd</span>
              </div>
            </div>
          )}

          {/* Niches */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {creator.niches.slice(0, 3).map((n) => (
              <span key={n} className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                {n}
              </span>
            ))}
            {creator.niches.length > 3 && (
              <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
                +{creator.niches.length - 3}
              </span>
            )}
          </div>

          {/* Location + taal */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            {creator.provincie && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {creator.provincie}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {creator.taal === "nl" ? "NL" : creator.taal === "fr" ? "FR" : "NL + FR"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-gray-200 hover:border-[#1a0533] hover:text-[#1a0533] font-semibold"
              asChild
            >
              <Link href={`/dashboard/brand/creator/${creator.id}`}>
                <Play className="h-3.5 w-3.5 mr-1" />
                Profiel
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs bg-[#ff0050] hover:bg-[#ff337a] font-semibold shadow-lg shadow-red-200"
              onClick={() => onStuurAanbieding?.(creator)}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Aanbieding
            </Button>
          </div>
        </div>
      </div>

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
