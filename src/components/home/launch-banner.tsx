"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Rocket } from "lucide-react"

export function LaunchBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="relative z-[60] bg-gradient-to-r from-[#ff0050] via-[#ff337a] to-[#ff0050] bg-[length:200%] animate-[shimmer_4s_ease-in-out_infinite]">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-white text-sm font-medium">
        <Rocket className="h-4 w-4 shrink-0 animate-bounce" />
        <span className="text-center leading-tight">
          <strong>Pre-launch fase</strong>
          <span className="mx-2 opacity-60">·</span>
          TikTok Shopping Belgium lanceert officieel op
          <strong> 15 juni 2026</strong>
          <span className="mx-2 opacity-60">·</span>
          <Link href="/auth/register" className="underline underline-offset-2 hover:no-underline font-bold">
            Registreer nu gratis →
          </Link>
        </span>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 p-1 rounded-lg hover:bg-white/20 transition shrink-0"
          aria-label="Sluit banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
