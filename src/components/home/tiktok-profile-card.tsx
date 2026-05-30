"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Heart, MessageCircle, ShoppingBag } from "lucide-react"

interface Video {
  bg: string
  views: string
  likes: string
}

interface TikTokProfileCardProps {
  handle: string
  followers: string
  following: string
  likes: string
  gmv: string
  bio: string
  avatarGradient: string
  initials: string
  verified?: boolean
  delay?: number
  className?: string
  videos: Video[]
  accentColor: string
}

export function TikTokProfileCard({
  handle, followers, following, likes, gmv, bio,
  avatarGradient, initials, verified = false,
  delay = 0, className = "", videos, accentColor
}: TikTokProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.7 },
      }}
      className={className}
    >
      {/* Phone shell */}
      <div className="w-[170px] bg-black rounded-[28px] overflow-hidden shadow-2xl"
        style={{
          boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1)`
        }}>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-white text-[8px] font-bold">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-1.5 border border-white/60 rounded-sm relative">
              <div className="absolute inset-0.5 right-0.5 bg-white rounded-sm" style={{right: '30%'}} />
            </div>
          </div>
        </div>

        {/* TikTok header */}
        <div className="flex items-center justify-center px-3 pb-2">
          <span className="text-white text-xs font-bold">Profiel</span>
        </div>

        {/* Cover gradient */}
        <div className={`h-20 bg-gradient-to-br ${avatarGradient} relative`}>
          {/* Subtle photo-like overlay */}
          <div className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(0,0,0,0.3) 0%, transparent 50%)" }} />
        </div>

        {/* Profile section */}
        <div className="bg-black px-3 pb-2">
          {/* Avatar */}
          <div className="flex justify-center -mt-7 mb-2">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGradient} border-2 border-black flex items-center justify-center text-white font-black text-base shadow-lg`}>
              {initials}
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="text-white font-black text-xs">@{handle}</span>
            {verified && <ShieldCheck className="h-3 w-3 shrink-0" style={{ color: '#20d5ec' }} />}
          </div>

          {/* Bio */}
          <p className="text-white/50 text-[9px] text-center leading-tight mb-2 line-clamp-1">{bio}</p>

          {/* Follow button */}
          <button className="w-full py-1.5 rounded-md text-[10px] font-bold text-white mb-3"
            style={{ background: accentColor }}>
            Volgen
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 mb-3 text-center">
            <div>
              <p className="text-white font-black text-xs">{following}</p>
              <p className="text-white/40 text-[8px]">Volgend</p>
            </div>
            <div>
              <p className="text-white font-black text-xs">{followers}</p>
              <p className="text-white/40 text-[8px]">Volgers</p>
            </div>
            <div>
              <p className="text-white font-black text-xs">{likes}</p>
              <p className="text-white/40 text-[8px]">Likes</p>
            </div>
          </div>

          {/* TikTok Shop badge */}
          <div className="flex items-center justify-center gap-1.5 bg-white/8 border border-white/10 rounded-lg py-1.5 mb-3">
            <ShoppingBag className="h-3 w-3" style={{ color: accentColor }} />
            <span className="text-[9px] font-bold text-white">TikTok Shop</span>
            <span className="text-[9px] text-white/50">·</span>
            <span className="text-[9px] font-bold" style={{ color: '#4ade80' }}>{gmv}/mnd</span>
          </div>

          {/* Divider */}
          <div className="flex border-b border-white/10 mb-2">
            <div className="flex-1 text-center py-1 border-b-2" style={{ borderColor: accentColor }}>
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 grid grid-cols-2 gap-px opacity-80">
                  <div className="bg-white rounded-sm" /><div className="bg-white rounded-sm" />
                  <div className="bg-white rounded-sm" /><div className="bg-white rounded-sm" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center py-1">
              <Heart className="h-3 w-3 text-white/30 mx-auto" />
            </div>
            <div className="flex-1 text-center py-1">
              <MessageCircle className="h-3 w-3 text-white/30 mx-auto" />
            </div>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-3 gap-0.5">
            {videos.map((v, i) => (
              <div key={i} className={`aspect-[9/16] ${v.bg} rounded-sm relative overflow-hidden`}>
                {/* Photo-like shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* View count */}
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5">
                  <div className="w-1.5 h-1.5 border border-white/60 rounded-sm relative">
                    <div className="absolute inset-0 border-l-2 border-white/80 rounded-l" style={{borderTop: '1px solid rgba(255,255,255,0.8)', borderRight: 'none', borderBottom: 'none'}} />
                  </div>
                  <span className="text-white text-[6px] font-bold">{v.views}</span>
                </div>
                {/* Like count */}
                <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
                  <Heart className="h-1.5 w-1.5 text-white fill-white" />
                  <span className="text-white text-[6px] font-bold">{v.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
