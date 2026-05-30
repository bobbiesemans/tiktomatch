"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Props {
  name: string
  initials: string
  tier: string
  type: "brand" | "creator"
  avatarColor: string
}

const tierColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-500",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-purple-100 text-purple-700",
  agency: "bg-amber-100 text-amber-700",
}

const tierLabels: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
}

export function UserDropdown({ name, initials, tier, type, avatarColor }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const settingsHref = type === "brand" ? "/dashboard/brand/instellingen" : "/dashboard/creator/instellingen"
  const profileHref = type === "creator" ? "/dashboard/creator/mijn-profiel" : "/dashboard/brand/instellingen"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all group"
      >
        <div
          className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
        >
          {initials}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{name || "Gebruiker"}</p>
          <p className={`text-xs font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${tierColors[tier] ?? tierColors.free}`}>
            {tierLabels[tier] ?? "Free"}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{type} account</p>
          </div>

          <div className="py-1">
            <Link
              href={profileHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="h-4 w-4 text-gray-400" />
              Mijn profiel
            </Link>
            <Link
              href={settingsHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-400" />
              Instellingen
            </Link>
          </div>

          <div className="border-t border-gray-50 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Uitloggen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
