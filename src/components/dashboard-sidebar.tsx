"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Sparkles, Megaphone, BarChart2, Settings,
  Gift, Wallet, User, ChevronRight,
} from "lucide-react"

const brandLinks = [
  { href: "/dashboard/brand", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/brand/matches", label: "Matches", icon: Sparkles },
  { href: "/dashboard/brand/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/dashboard/brand/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/brand/instellingen", label: "Instellingen", icon: Settings },
]

const creatorLinks = [
  { href: "/dashboard/creator", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/creator/aanbiedingen", label: "Aanbiedingen", icon: Gift },
  { href: "/dashboard/creator/campagnes", label: "Mijn campagnes", icon: Megaphone },
  { href: "/dashboard/creator/verdiensten", label: "Verdiensten", icon: Wallet },
  { href: "/dashboard/creator/mijn-profiel", label: "Mijn profiel", icon: User },
  { href: "/dashboard/creator/instellingen", label: "Instellingen", icon: Settings },
]

interface SidebarProps {
  type: "brand" | "creator"
}

export function DashboardSidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const links = type === "brand" ? brandLinks : creatorLinks

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#1a0533] flex flex-col z-40">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-white">Tikto</span>
          <span className="text-xl font-extrabold text-[#ff0050]">Match</span>
        </Link>
        <p className="text-white/40 text-xs mt-1">{type === "brand" ? "Brand platform" : "Creator platform"}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== `/dashboard/${type}` && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-[#ff0050] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <form action="/auth/signout" method="post">
          <button className="w-full text-left text-xs text-white/40 hover:text-white/70 transition px-3 py-2">
            Uitloggen
          </button>
        </form>
      </div>
    </aside>
  )
}
