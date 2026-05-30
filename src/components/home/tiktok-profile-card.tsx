"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Heart, Play, ShoppingBag } from "lucide-react"

interface TikTokProfileCardProps {
  name: string
  handle: string
  followers: string
  likes: string
  gmv: string
  niche: string
  gradient: string
  initials: string
  verified?: boolean
  delay?: number
  className?: string
  videoColors?: string[]
}

export function TikTokProfileCard({
  name, handle, followers, likes, gmv, niche,
  gradient, initials, verified = false, delay = 0, className = "",
  videoColors = ["bg-rose-400", "bg-purple-500", "bg-amber-400", "bg-teal-400", "bg-blue-500", "bg-pink-400"]
}: TikTokProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 },
      }}
      className={`relative ${className}`}
    >
      {/* Phone frame */}
      <div className="w-44 bg-[#121212] rounded-[22px] overflow-hidden shadow-2xl border border-white/10" style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)" }}>
        {/* TikTok-style header */}
        <div className={`h-28 bg-gradient-to-br ${gradient} relative`}>
          {/* Video thumbnails overlay */}
          <div className="absolute inset-0 opacity-30 grid grid-cols-3 gap-px">
            {videoColors.map((c, i) => <div key={i} className={`${c}`} />)}
          </div>
          {/* Profile pic */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} border-2 border-[#121212] flex items-center justify-center text-white font-black text-base shadow-lg`}>
              {initials}
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="pt-9 px-3 pb-3">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <p className="text-white font-bold text-xs text-center">{name}</p>
            {verified && <ShieldCheck className="h-3 w-3 text-[#20d5ec] shrink-0" />}
          </div>
          <p className="text-white/40 text-[10px] text-center mb-3">@{handle}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-1 mb-3">
            {[
              { v: followers, l: "Volgers" },
              { v: likes, l: "Likes" },
              { v: gmv, l: "GMV" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-white text-[10px] font-bold leading-tight">{v}</p>
                <p className="text-white/30 text-[8px]">{l}</p>
              </div>
            ))}
          </div>

          {/* TikTok Shop badge */}
          <div className="flex items-center justify-center gap-1 bg-[#fe2c55]/15 border border-[#fe2c55]/20 rounded-full px-2 py-1 mb-3">
            <ShoppingBag className="h-2.5 w-2.5 text-[#fe2c55]" />
            <span className="text-[9px] font-bold text-[#fe2c55]">TikTok Shop</span>
          </div>

          {/* Niche tag */}
          <div className="text-center">
            <span className="text-[9px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{niche}</span>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-3 gap-0.5 mt-3">
            {videoColors.slice(0, 6).map((c, i) => (
              <div key={i} className={`aspect-[9/16] ${c} rounded-sm opacity-70 relative flex items-center justify-center`}>
                {i === 0 && <Play className="h-2.5 w-2.5 text-white/80 fill-white/80" />}
                {i === 2 && <Heart className="h-2.5 w-2.5 text-white/80 fill-white/80" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
