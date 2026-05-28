"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-sm border-b border-gray-100" : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff0050] rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className={cn("text-lg font-bold transition-colors", scrolled ? "text-[#1a0533]" : "text-white")}>
            TikToMatch
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {[
            { href: "#hoe-het-werkt", label: "Hoe het werkt" },
            { href: "#prijzen", label: "Prijzen" },
            { href: "#waitlist", label: "Vroege toegang" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className={cn("font-medium transition-colors hover:text-[#ff0050]", scrolled ? "text-gray-600" : "text-white/80")}>
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login"
            className={cn("text-sm font-medium px-4 py-2 rounded-lg transition-colors", scrolled ? "text-gray-700 hover:text-[#1a0533]" : "text-white/80 hover:text-white")}>
            Inloggen
          </Link>
          <Link href="/auth/register"
            className="bg-[#ff0050] hover:bg-[#ff337a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-500/25">
            Gratis starten
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen
            ? <X className={cn("h-5 w-5", scrolled ? "text-gray-700" : "text-white")} />
            : <Menu className={cn("h-5 w-5", scrolled ? "text-gray-700" : "text-white")} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <a href="#hoe-het-werkt" className="block text-sm text-gray-700 py-2">Hoe het werkt</a>
          <a href="#prijzen" className="block text-sm text-gray-700 py-2">Prijzen</a>
          <a href="#waitlist" className="block text-sm text-gray-700 py-2">Vroege toegang</a>
          <div className="pt-2 flex gap-3">
            <Link href="/auth/login" className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">Inloggen</Link>
            <Link href="/auth/register" className="flex-1 text-center py-2 bg-[#ff0050] rounded-lg text-sm font-semibold text-white">Starten</Link>
          </div>
        </div>
      )}
    </motion.nav>
  )
}
