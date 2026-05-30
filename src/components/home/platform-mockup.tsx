"use client"

import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Users, ShoppingBag, Star, Zap } from "lucide-react"

const CREATORS = [
  {
    initials: "LV",
    name: "Laura V.",
    handle: "@laurabeauty_be",
    score: 94,
    followers: "45.2K",
    gmv: "€2.840",
    eng: "4.2%",
    niches: ["Beauty", "Fashion"],
    verified: true,
    color: "#fe2c55",
    scoreBar: 94,
  },
  {
    initials: "SK",
    name: "Sarah K.",
    handle: "@fitgirl_leuven",
    score: 87,
    followers: "67.8K",
    gmv: "€4.120",
    eng: "5.5%",
    niches: ["Fitness", "Health"],
    verified: true,
    color: "#00d4c8",
    scoreBar: 87,
  },
  {
    initials: "AM",
    name: "Alex M.",
    handle: "@techbob_brussels",
    score: 79,
    followers: "92.4K",
    gmv: "€5.640",
    eng: "3.8%",
    niches: ["Tech", "Gaming"],
    verified: false,
    color: "#7c3aed",
    scoreBar: 79,
  },
]

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10" fontWeight="800">
        {score}
      </text>
    </svg>
  )
}

export function PlatformMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Browser chrome */}
      <div className="bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)" }}>

        {/* Browser top bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-3 bg-[#2a2a2a] rounded-md px-3 py-1 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00d4c8] shrink-0" />
            <span className="text-white/40 text-xs font-mono">app.tiktomatch.be/matches</span>
          </div>
        </div>

        {/* App content */}
        <div className="p-4 bg-[#0d0d0d]">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-bold text-sm">Creator Matches</p>
              <p className="text-white/30 text-xs">AI-matching op basis van echte verkoopdata</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#fe2c55]/15 border border-[#fe2c55]/20 rounded-lg px-3 py-1.5">
                <Zap className="h-3 w-3 text-[#fe2c55]" />
                <span className="text-xs font-bold text-[#fe2c55]">3 nieuwe matches</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Users, v: "500+", l: "Belgische creators", c: "text-blue-400" },
              { icon: TrendingUp, v: "€24B+", l: "Marktpotentieel", c: "text-emerald-400" },
              { icon: ShoppingBag, v: "15 juni", l: "TikTok Shop BE", c: "text-[#fe2c55]" },
            ].map(({ icon: Icon, v, l, c }) => (
              <div key={l} className="bg-white/4 border border-white/6 rounded-xl p-3">
                <Icon className={`h-3.5 w-3.5 ${c} mb-1.5`} />
                <p className={`text-sm font-black ${c}`}>{v}</p>
                <p className="text-white/30 text-[9px]">{l}</p>
              </div>
            ))}
          </div>

          {/* Creator cards */}
          <div className="space-y-2">
            {CREATORS.map((c, i) => (
              <motion.div
                key={c.handle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-[#161616] border border-white/6 rounded-xl p-3 flex items-center gap-3 hover:border-white/12 transition-all cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c.color}99, ${c.color})` }}>
                  {c.initials}
                </div>

                {/* Name & handle */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-semibold text-xs truncate">{c.name}</p>
                    {c.verified && <ShieldCheck className="h-2.5 w-2.5 text-[#20d5ec] shrink-0" />}
                  </div>
                  <p className="text-white/30 text-[9px]">{c.handle}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[9px]">
                  <div className="text-center">
                    <p className="text-white font-bold">{c.followers}</p>
                    <p className="text-white/30">volgers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 font-bold">{c.gmv}</p>
                    <p className="text-white/30">GMV/mnd</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{c.eng}</p>
                    <p className="text-white/30">eng.</p>
                  </div>
                </div>

                {/* AI Score ring */}
                <ScoreRing score={c.score} color={c.color} />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {["#fe2c55", "#00d4c8", "#7c3aed"].map((c) => (
                  <div key={c} className="w-5 h-5 rounded-full border border-[#0d0d0d]"
                    style={{ background: `linear-gradient(135deg, ${c}80, ${c})` }} />
                ))}
              </div>
              <p className="text-white/30 text-[9px]">+497 creators beschikbaar</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
              <p className="text-white/50 text-[9px] font-bold">AI-match actief</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute -bottom-4 -left-4 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-black text-white">+340% ROI</p>
          <p className="text-[9px] text-white/40">gemiddeld via commissie-model</p>
        </div>
      </motion.div>

      {/* Floating match badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute -top-4 -right-4 bg-[#fe2c55] rounded-xl px-3 py-2 shadow-xl shadow-[#fe2c55]/30"
      >
        <p className="text-xs font-black text-white">#1 in België</p>
        <p className="text-[9px] text-white/80">Eerste TikTok Shop platform</p>
      </motion.div>
    </motion.div>
  )
}
