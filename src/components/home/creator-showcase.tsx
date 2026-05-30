"use client"

import { motion } from "framer-motion"
import { ShieldCheck, ShoppingBag, Heart } from "lucide-react"

const CREATORS = [
  {
    name: "Laura V.",
    handle: "@laurabeauty_be",
    initials: "LA",
    gradient: "from-pink-500 to-rose-600",
    niches: ["Fashion", "Beauty"],
    followers: "45.2K",
    engagement: "4.2%",
    gmv: "€2.840",
    verified: true,
    score: 87,
  },
  {
    name: "Sarah K.",
    handle: "@fitgirl_leuven",
    initials: "SK",
    gradient: "from-emerald-500 to-teal-600",
    niches: ["Fitness", "Health"],
    followers: "67.8K",
    engagement: "5.5%",
    gmv: "€4.120",
    verified: true,
    score: 83,
  },
  {
    name: "Alex M.",
    handle: "@techbob_brussels",
    initials: "AM",
    gradient: "from-blue-600 to-violet-600",
    niches: ["Tech", "Gaming"],
    followers: "92.4K",
    engagement: "3.8%",
    gmv: "€5.640",
    verified: false,
    score: 72,
  },
]

export function CreatorShowcase() {
  return (
    <div className="flex gap-5 justify-center flex-wrap lg:flex-nowrap">
      {CREATORS.map((c, i) => (
        <motion.div
          key={c.handle}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="w-64 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
        >
          {/* Gradient banner */}
          <div className={`h-20 bg-gradient-to-br ${c.gradient} relative`}>
            <div className="absolute -bottom-px left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
            {c.verified && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" /> Verified
              </div>
            )}
            {/* AI Score */}
            <div className="absolute top-2 left-2 bg-white/95 rounded-full px-2.5 py-1 flex items-center gap-1">
              <span className="text-xs font-black text-gray-900">{c.score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>

          <div className="px-4 pb-4 -mt-1">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.gradient} border-3 border-white flex items-center justify-center text-white font-black text-xl shadow-lg mb-2`}>
              {c.initials}
            </div>

            <div className="mb-3">
              <p className="font-bold text-gray-900 text-sm">{c.name}</p>
              <p className="text-xs text-gray-400">{c.handle}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1.5 mb-3 p-2.5 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">{c.followers}</p>
                <p className="text-[10px] text-gray-400">volgers</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-xs font-bold text-gray-900">{c.engagement}</p>
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5">
                  <Heart className="h-2 w-2 fill-current text-rose-400" /> eng.
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-green-600">{c.gmv}</p>
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5">
                  <ShoppingBag className="h-2 w-2" /> GMV
                </p>
              </div>
            </div>

            {/* Niches */}
            <div className="flex gap-1 flex-wrap">
              {c.niches.map((n) => (
                <span key={n} className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{n}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
