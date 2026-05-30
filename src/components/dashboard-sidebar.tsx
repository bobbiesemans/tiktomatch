"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Sparkles, Megaphone, BarChart2, Settings,
  Gift, Wallet, User, ChevronRight, MessageSquare, FileText,
  Menu, X,
} from "lucide-react"

const brandLinks = [
  { href: "/dashboard/brand", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/brand/matches", label: "Matches", icon: Sparkles },
  { href: "/dashboard/brand/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/dashboard/brand/berichten", label: "Berichten", icon: MessageSquare },
  { href: "/dashboard/brand/facturen", label: "Facturen", icon: FileText },
  { href: "/dashboard/brand/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/brand/instellingen", label: "Instellingen", icon: Settings },
]

const creatorLinks = [
  { href: "/dashboard/creator", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/creator/aanbiedingen", label: "Aanbiedingen", icon: Gift },
  { href: "/dashboard/creator/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/dashboard/creator/berichten", label: "Berichten", icon: MessageSquare },
  { href: "/dashboard/creator/verdiensten", label: "Verdiensten", icon: Wallet },
  { href: "/dashboard/creator/mijn-profiel", label: "Mijn profiel", icon: User },
  { href: "/dashboard/creator/instellingen", label: "Instellingen", icon: Settings },
]

// Subset voor mobile bottom nav (max 5)
const creatorBottomLinks = [
  { href: "/dashboard/creator", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/creator/aanbiedingen", label: "Deals", icon: Gift },
  { href: "/dashboard/creator/berichten", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/creator/verdiensten", label: "Geld", icon: Wallet },
  { href: "/dashboard/creator/mijn-profiel", label: "Profiel", icon: User },
]

const brandBottomLinks = [
  { href: "/dashboard/brand", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/brand/matches", label: "Matches", icon: Sparkles },
  { href: "/dashboard/brand/berichten", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/brand/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/dashboard/brand/instellingen", label: "Meer", icon: Settings },
]

interface SidebarProps {
  type: "brand" | "creator"
}

export function DashboardSidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = type === "brand" ? brandLinks : creatorLinks
  const bottomLinks = type === "brand" ? brandBottomLinks : creatorBottomLinks

  function isActive(href: string) {
    return pathname === href || (href !== `/dashboard/${type}` && pathname.startsWith(href))
  }

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-[#1a0533] flex-col z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#ff0050] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">TM</span>
            </div>
            <span className="text-lg font-extrabold text-white">TikTo<span className="text-[#ff0050]">Match</span></span>
          </Link>
          <p className="text-white/30 text-xs mt-1">{type === "brand" ? "Brand platform" : "Creator platform"}</p>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  active
                    ? "bg-[#ff0050] text-white shadow-lg shadow-[#ff0050]/20"
                    : "text-white/50 hover:text-white hover:bg-white/8"
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
            <button className="w-full text-left text-xs text-white/30 hover:text-white/60 transition px-3 py-2 rounded-lg hover:bg-white/5">
              Uitloggen
            </button>
          </form>
        </div>
      </aside>

      {/* ─── Mobile hamburger button (in header area) ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1a0533] rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* ─── Mobile drawer overlay ─── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[#1a0533] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#ff0050] rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">TM</span>
                </div>
                <span className="text-lg font-extrabold text-white">TikTo<span className="text-[#ff0050]">Match</span></span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-[#ff0050] text-white"
                        : "text-white/50 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <form action="/auth/signout" method="post">
                <button className="w-full text-left text-sm text-white/40 hover:text-white/70 transition px-4 py-2.5">
                  Uitloggen
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile bottom navigation ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a0533]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-0",
                  active ? "text-[#ff0050]" : "text-white/40"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active && "scale-110")} />
                <span className="text-[10px] font-semibold truncate">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
