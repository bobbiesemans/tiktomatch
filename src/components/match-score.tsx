"use client"
import { scoreColor } from "@/lib/utils"

interface MatchScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

const sizes = {
  sm: { px: 32, stroke: 3, text: "text-xs font-bold" },
  md: { px: 48, stroke: 4, text: "text-sm font-bold" },
  lg: { px: 72, stroke: 5, text: "text-base font-bold" },
}

export function MatchScore({ score, size = "md", onClick }: MatchScoreProps) {
  const { px, stroke, text } = sizes[size]
  const r = (px - stroke * 2) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
      style={{ width: px, height: px }}
      title={`Match score: ${score}/100`}
    >
      <svg width={px} height={px} className="-rotate-90">
        <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className={`absolute ${text}`} style={{ color }}>
        {score}
      </span>
    </button>
  )
}
