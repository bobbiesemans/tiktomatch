"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { scoreColor } from "@/lib/utils"

interface ScoreBreakdown {
  niche: number
  engagement: number
  verkoop: number
  demografie: number
  budget: number
  taal: number
}

interface ScoreModalProps {
  open: boolean
  onClose: () => void
  score: number
  scores: ScoreBreakdown
  sterke_punten: string[]
  risicos: string[]
  aanbeveling: string
  campagne_type: string
  onStuurAanbieding?: () => void
}

const criteria = [
  { key: "niche", label: "Niche-overlap", max: 30 },
  { key: "engagement", label: "Engagement kwaliteit", max: 20 },
  { key: "verkoop", label: "Verkoopkapaciteit", max: 20 },
  { key: "demografie", label: "Demografische match", max: 15 },
  { key: "budget", label: "Budget fit", max: 10 },
  { key: "taal", label: "Taal & regio", max: 5 },
] as const

export function ScoreModal({
  open, onClose, score, scores, sterke_punten, risicos, aanbeveling, campagne_type, onStuurAanbieding,
}: ScoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color: scoreColor(score) }}>{score}/100</span>
            <span className="text-gray-700">AI Match Score</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          {criteria.map((c) => {
            const val = scores[c.key]
            const pct = (val / c.max) * 100
            return (
              <div key={c.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{c.label}</span>
                  <span className="font-medium text-gray-900">{val}/{c.max}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: scoreColor(pct) }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {sterke_punten.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1.5">Sterke punten</p>
            <ul className="space-y-1">
              {sterke_punten.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {risicos.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1.5">Aandachtspunten</p>
            <ul className="space-y-1">
              {risicos.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 mb-4">
          <TrendingUp className="h-4 w-4 text-primary-900 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-700">{aanbeveling}</p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">Aanbevolen: {campagne_type}</Badge>
          {onStuurAanbieding && (
            <Button variant="accent" size="sm" onClick={onStuurAanbieding}>
              Stuur aanbieding
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
