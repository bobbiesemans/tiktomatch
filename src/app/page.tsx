import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { LaunchBanner } from "@/components/home/launch-banner"
import WaitlistForm from "@/components/WaitlistForm"

import { FadeUp, FadeIn, ScaleIn, StaggerContainer, StaggerItem, HeroText, FloatingCard } from "@/components/home/animated-section"
import { CreatorShowcase } from "@/components/home/creator-showcase"
import { TikTokProfileCard } from "@/components/home/tiktok-profile-card"
import {
  ArrowRight, CheckCircle, Zap, Star, Building2, Video,
  Shield, Euro, Package, ShoppingBag, Users, Globe, BarChart2, Target,
  ChevronRight, Sparkles, CreditCard, Lock
} from "lucide-react"

export const metadata = {
  title: "TikToMatch — Belgische TikTok-creators voor jouw merk",
  description: "Het eerste commissie-gebaseerde TikTok creator platform voor België. Betaal enkel bij resultaat.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <LaunchBanner />
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[#ff0050]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[#00d4c8]/15 rounded-full blur-[100px]" />
          <div className="absolute top-3/4 left-1/3 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px]" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-24 lg:py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: text */}
          <div>
            <HeroText>
              <div className="inline-flex items-center gap-2 bg-[#ff0050] text-white text-xs font-black px-4 py-2 rounded-full mb-8 shadow-lg shadow-[#ff0050]/40 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                #1 TikTok Shop Platform België
              </div>
            </HeroText>

            <HeroText>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight mb-6">
                <span className="block text-white/60 text-3xl md:text-4xl font-bold mb-2">15 juni 2026.</span>
                <span className="block text-white">TikTok Shop</span>
                <span className="block bg-gradient-to-r from-[#ff0050] via-[#ff6b9d] to-[#ff0050] bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_3s_ease-in-out_infinite]">
                  lanceert in België.
                </span>
                <span className="block text-white mt-2">Jij bent er als eerste.</span>
              </h1>
            </HeroText>

            <HeroText>
              <p className="text-lg text-white/55 max-w-lg mb-6 leading-relaxed">
                <strong className="text-white">4,3 miljoen Belgische TikTok-gebruikers. €24 miljard aan e-commerce.</strong> Een markt die opengaat voor wie er nu bij is.
                TikToMatch is het eerste en enige Belgische platform dat jouw merk verbindt met bewezen TikTok-creators — op commissiebasis.
              </p>
            </HeroText>

            <HeroText>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 bg-[#ff0050] hover:bg-[#ff337a] text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-2xl shadow-[#ff0050]/30 hover:shadow-[#ff0050]/50 hover:scale-[1.02]">
                  Claim je plek nu
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 text-white font-bold px-7 py-4 rounded-xl text-base transition-all border border-white/15 hover:border-white/30">
                  <Video className="h-4 w-4 text-[#00d4c8]" />
                  Ik ben een creator
                </Link>
              </div>
            </HeroText>

            {/* Stats */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/8">
                {[
                  { n: "$112B", l: "TikTok Shop GMV wereldwijd" },
                  { n: "4,3M", l: "Belgische gebruikers" },
                  { n: "15 juni", l: "Lancering België" },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <div className="text-2xl font-black text-white">{n}</div>
                    <div className="text-xs text-white/35 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* RIGHT: levensechte TikTok profielen */}
          <div className="hidden lg:flex items-center justify-center relative h-[540px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0050]/8 to-[#00d4c8]/8 rounded-3xl blur-3xl" />

            {/* Laura - links boven */}
            <div className="absolute top-4 left-0 z-20">
              <TikTokProfileCard
                name="@laurabeauty_be"
                handle="laurabeauty_be"
                followers="45.2K"
                likes="892K"
                gmv="€2.840"
                niche="Fashion · Beauty"
                gradient="from-pink-500 to-rose-600"
                initials="LV"
                verified={true}
                delay={0.2}
                videoColors={["bg-rose-400", "bg-pink-300", "bg-fuchsia-400", "bg-rose-300", "bg-pink-500", "bg-fuchsia-300"]}
              />
            </div>

            {/* Alex - midden center */}
            <div className="relative z-30">
              <TikTokProfileCard
                name="@techbob_brussels"
                handle="techbob_brussels"
                followers="92.4K"
                likes="2.1M"
                gmv="€5.640"
                niche="Tech · Gaming"
                gradient="from-blue-600 to-violet-600"
                initials="AM"
                verified={false}
                delay={0}
                videoColors={["bg-blue-400", "bg-violet-500", "bg-indigo-400", "bg-blue-300", "bg-violet-400", "bg-indigo-500"]}
              />
            </div>

            {/* Sarah - rechts */}
            <div className="absolute top-4 right-0 z-20">
              <TikTokProfileCard
                name="@fitgirl_leuven"
                handle="fitgirl_leuven"
                followers="67.8K"
                likes="1.4M"
                gmv="€4.120"
                niche="Fitness · Health"
                gradient="from-emerald-500 to-teal-600"
                initials="SK"
                verified={true}
                delay={0.4}
                videoColors={["bg-emerald-400", "bg-teal-300", "bg-green-400", "bg-emerald-300", "bg-teal-400", "bg-green-300"]}
              />
            </div>

            {/* AI Match badge - onder */}
            <FloatingCard delay={0.8} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56">
              <div className="bg-[#1a0533]/90 backdrop-blur-xl border border-[#ff0050]/30 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff0050] rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">AI Match actief</p>
                  <p className="text-[10px] text-white/50">3 creators klaar voor jouw merk</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════
          TICKER
      ═══════════════════════════════════════ */}
      <section className="py-8 bg-[#0f0f0f] border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 items-center whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex gap-12 items-center shrink-0">
              {[
                { v: "$112B", l: "TikTok Shop GMV wereldwijd (2026)" },
                { v: "4,3M", l: "TikTok-gebruikers in België" },
                { v: "€24B+", l: "Belgische e-commerce markt" },
                { v: "15 juni", l: "TikTok Shop Belgium go-live" },
                { v: "10–15%", l: "Gemiddelde creator commissie" },
                { v: "15 dagen", l: "Uitbetaling na levering" },
                { v: "15M+", l: "Actieve verkopers op TikTok Shop" },
                { v: "53%", l: "Belgische TikTok-gebruikers vrouw" },
              ].map(({ v, l }) => (
                <div key={l} className="flex items-center gap-4">
                  <div>
                    <span className="text-xl font-black text-[#ff0050]">{v}</span>
                    <span className="text-sm text-white/30 ml-2">{l}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRE-LAUNCH TIJDLIJN
      ═══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-sm font-bold text-[#ff0050] tracking-[0.2em] uppercase mb-4">Roadmap</p>
            <h2 className="text-4xl font-black mb-4">
              Wat kan je <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">nu al doen?</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              TikToMatch is in pre-launch. Alles staat klaar om te gebruiken.
              De officiële TikTok Shopping lancering in België is op 15 juni.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fase 1 - NU */}
            <FadeUp delay={0.1}>
              <div className="relative bg-gradient-to-b from-[#ff0050]/15 to-transparent border border-[#ff0050]/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#ff0050] rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#ff0050] uppercase tracking-wider">Nu — Beschikbaar</p>
                    <p className="font-black text-white">Registreren & instellen</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Gratis account aanmaken (brand of creator)",
                    "TikTok-profiel en statistieken invullen",
                    "Commissiemodel instellen als brand",
                    "Creator database verkennen",
                    "Contacteer via tiktokshop.eu.markets@bytedance.com voor seller registratie bij TikTok",
                    "3 maanden gratis Pro reserveren als early adopter",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 text-[#ff0050] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Fase 2 - 15 juni */}
            <FadeUp delay={0.2}>
              <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                    15/6
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#00d4c8] uppercase tracking-wider">15 Juni 2026</p>
                    <p className="font-black text-white">Go-live</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "TikTok Shop Belgium officieel live (15 juni)",
                    "In-feed shopping & LIVE shopping actief",
                    "Eerste campagnes en affiliate-links beschikbaar",
                    "Shop Tab lancering (juli 2026)",
                    "Commissies beginnen lopen — uitbetaling D+15",
                    "Early adopter Pro-voordelen activeren",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/50">
                      <div className="w-3.5 h-3.5 border border-white/20 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Fase 3 - Zomer */}
            <FadeUp delay={0.3}>
              <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                    Q3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-wider">Zomer 2026</p>
                    <p className="font-black text-white">Opschalen</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Eerste commissie-uitbetalingen verwerkt",
                    "'Sell Across Europe' feature actief",
                    "Automatische EU-localised product listings",
                    "FR-markt creators onboarden",
                    "Agency-accounts activeren",
                    "Geavanceerde commissie-analytics",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/30">
                      <div className="w-3.5 h-3.5 border border-white/10 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          {/* CTA onder tijdlijn */}
          <FadeUp delay={0.4} className="text-center mt-12">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
              <div className="text-left">
                <p className="font-bold text-white">Wacht niet tot 15 juni.</p>
                <p className="text-sm text-white/40">Bouw nu al je profiel op en sta klaar op dag 1.</p>
              </div>
              <Link href="/auth/register"
                className="shrink-0 bg-[#ff0050] hover:bg-[#ff337a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#ff0050]/25 hover:scale-[1.02]">
                Nu registreren →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOE HET WERKT
      ═══════════════════════════════════════ */}
      <section id="hoe-het-werkt" className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-20">
            <p className="text-sm font-bold text-[#ff0050] tracking-[0.2em] uppercase mb-4">Het model</p>
            <h2 className="text-5xl font-black leading-tight mb-4">
              Simpel. Eerlijk. <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">Resultaatgericht.</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Geen vaste advertentiekosten. Creators verdienen enkel als ze verkopen. TikToMatch beheert alles daartussenin.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* For brands */}
            <ScaleIn delay={0.1}>
              <div className="bg-[#111] border border-white/8 rounded-3xl p-8 h-full">
                <div className="inline-flex items-center gap-2 bg-white/8 text-sm font-bold px-4 py-2 rounded-full mb-8">
                  <Building2 className="h-4 w-4 text-[#ff0050]" />
                  <span className="text-white">Voor merken</span>
                </div>
                <div className="space-y-6">
                  {[
                    { n: "01", t: "Abonneer & stel je commissie% in", d: "Marktstandaard: 10–15% open samenwerking, 18–30% exclusief. Dit is identiek aan hoe het werkt in de UK, VS en Duitsland. Geen vast advertentiebudget — enkel betalen bij resultaat." },
                    { n: "02", t: "Kies uit gescreende Belgische creators", d: "AI matcht op GMV (echte TikTok Shop-verkoopcijfers), engagement en niche. Bewezen model: platformen zoals Cruva (VS) en Collabstr (UK) werken exact zo." },
                    { n: "03", t: "Wij regelen alles daarna", d: "TikToMatch beheert contract, commissie-tracking en betalingen. Creators ontvangen hun commissie 15 dagen na levering — conform TikTok Shop-standaard wereldwijd." },
                  ].map(({ n, t, d }) => (
                    <div key={n} className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-xl bg-[#ff0050]/15 border border-[#ff0050]/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-[#ff0050]">{n}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">{t}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScaleIn>

            {/* For creators */}
            <ScaleIn delay={0.2}>
              <div className="bg-[#111] border border-white/8 rounded-3xl p-8 h-full">
                <div className="inline-flex items-center gap-2 bg-white/8 text-sm font-bold px-4 py-2 rounded-full mb-8">
                  <Video className="h-4 w-4 text-[#00d4c8]" />
                  <span className="text-white">Voor creators</span>
                </div>
                <div className="space-y-6">
                  {[
                    { n: "01", t: "Gratis profiel aanmaken", d: "Voeg je TikTok-profiel toe. Aanmelden is altijd gratis — net zoals bij vergelijkbare platformen in de VS (Collabstr) en UK. Je promoot via in-feed video's, LIVE-sessies of storefront." },
                    { n: "02", t: "Verdien 10–15% commissie per verkoop", d: "Dit is de wereldwijde standaard op TikTok Shop. In de UK en VS werken creators al zo. Vóór acceptatie zie je exact hoeveel je verdient per verkoop in jouw categorie." },
                    { n: "03", t: "Automatisch uitbetaald — 15 dagen na levering", d: "Wereldwijde TikTok Shop-standaard: uitbetaling 15 dagen na bevestigde levering. TikToMatch int bij het merk en betaalt door. Geen facturatie, geen gedoe." },
                  ].map(({ n, t, d }) => (
                    <div key={n} className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-xl bg-[#00d4c8]/10 border border-[#00d4c8]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-[#00d4c8]">{n}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">{t}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CREATOR SHOWCASE
      ═══════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-sm font-bold text-[#00d4c8] tracking-[0.2em] uppercase mb-4">Echte profielen</p>
            <h2 className="text-5xl font-black mb-4">
              Belgische TikTok-<span className="bg-gradient-to-r from-[#00d4c8] to-[#00a8a3] bg-clip-text text-transparent">creators</span>
            </h2>
            <p className="text-lg text-white/40 max-w-lg mx-auto">
              Geverifieerde GMV-data. Echte engagement. Bewezen creators op de Belgische markt.
            </p>
          </FadeUp>
          <CreatorShowcase />
          <FadeUp delay={0.4} className="text-center mt-12">
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors border border-white/15 hover:border-white/30 px-6 py-3 rounded-full">
              Bekijk alle 500+ creators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BEWEZEN MODEL UIT HET BUITENLAND
      ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-sm font-bold text-white/30 tracking-[0.2em] uppercase mb-3">Bewezen model</p>
            <h2 className="text-4xl font-black mb-3">
              Wat al werkt in de <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">VS, UK & EU</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">
              TikToMatch kopieert wat al bewezen werkt op buitenlandse platforms — commissiemodel, uitbetalingstermijnen en creator-matching. Niets uitgevonden, alles gevalideerd.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "$112B", label: "TikTok Shop GMV worldwide 2026", sub: "Forecast eMarketer" },
              { stat: "x2", label: "Groei per jaar", sub: "Van $33B (2024) → $64B (2025)" },
              { stat: "15M+", label: "Actieve verkopers wereldwijd", sub: "Op TikTok Shop 2026" },
              { stat: "20%", label: "Van heel social commerce", sub: "Aandeel TikTok Shop 2026" },
            ].map(({ stat, label, sub }) => (
              <StaggerItem key={label}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-white mb-1">{stat}</p>
                  <p className="text-xs font-semibold text-white/60 mb-1">{label}</p>
                  <p className="text-[10px] text-white/25">{sub}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                markt: "🇺🇸 Verenigde Staten",
                gmv: "$15,1 miljard GMV (2025)",
                detail: "Platform Cruva helpt merken creators te vinden op commissiebasis. Exact hetzelfde model als TikToMatch — maar wij zijn Belgisch en gespecialiseerd.",
                accent: "border-blue-500/20",
              },
              {
                markt: "🇬🇧 Verenigd Koninkrijk",
                gmv: "Lancering 2023 → 9% referral fee",
                detail: "Collabstr & vergelijkbare platforms verbinden merken en creators via commissie. Portland Leather Goods: $0 naar $1M GMV in 20 dagen via creator-affiliate.",
                accent: "border-[#ff0050]/20",
              },
              {
                markt: "🇩🇪🇫🇷 Duitsland & Frankrijk",
                gmv: "100K+ bedrijven actief sinds 2025",
                detail: "Triple-digit GMV-groei in 6 maanden. Carrefour, L'Oréal en MAC Cosmetics werken met creators op commissiebasis — exact het model dat TikToMatch biedt in België.",
                accent: "border-[#00d4c8]/20",
              },
            ].map(({ markt, gmv, detail, accent }) => (
              <StaggerItem key={markt}>
                <div className={`bg-[#111] border ${accent} rounded-2xl p-5`}>
                  <p className="font-black text-white text-sm mb-1">{markt}</p>
                  <p className="text-xs text-[#00d4c8] font-semibold mb-3">{gmv}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.3} className="mt-8 text-center">
            <p className="text-sm text-white/30">
              België is de <strong className="text-white/60">volgende markt</strong>. TikToMatch staat klaar op 15 juni — als enige Belgisch gespecialiseerd platform.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BETALINGSSTROOM
      ═══════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff0050]/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <FadeUp className="text-center mb-20">
            <p className="text-sm font-bold text-[#ff0050] tracking-[0.2em] uppercase mb-4">Betalingen</p>
            <h2 className="text-5xl font-black mb-4">
              Wij staan in het <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">midden</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Merken betalen nooit rechtstreeks aan creators. TikToMatch garandeert correcte uitbetaling aan beide kanten.
            </p>
          </FadeUp>

          {/* Flow */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-16">
              {[
                { icon: Building2, label: "Merk", sub: "Betaalt maandabonnement + commissie", color: "border-white/15 bg-white/5", accent: "text-white" },
                "arrow",
                { icon: Shield, label: "TikToMatch", sub: "Verwerkt & beschermt betalingen", color: "border-[#ff0050]/40 bg-[#ff0050]/10", accent: "text-[#ff0050]", featured: true },
                "arrow",
                { icon: Video, label: "Creator", sub: "Ontvangt commissie elke 2 weken", color: "border-[#00d4c8]/30 bg-[#00d4c8]/8", accent: "text-[#00d4c8]" },
              ].map((item, i) => {
                if (item === "arrow") return (
                  <div key={i} className="hidden md:flex items-center">
                    <ArrowRight className="h-6 w-6 text-white/20" />
                  </div>
                )
                if (typeof item === "string") return null
                const Icon = item.icon
                return (
                  <div key={item.label} className={`flex-1 border ${item.color} rounded-2xl p-6 text-center ${item.featured ? "scale-105 shadow-2xl shadow-[#ff0050]/10" : ""}`}>
                    <div className={`w-12 h-12 rounded-xl border ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`h-6 w-6 ${item.accent}`} />
                    </div>
                    <p className={`font-black text-lg ${item.accent}`}>{item.label}</p>
                    <p className="text-xs text-white/30 mt-1 leading-relaxed">{item.sub}</p>
                  </div>
                )
              })}
            </div>
          </FadeUp>

          {/* Calculation */}
          <FadeUp delay={0.3}>
            <div className="bg-[#111] border border-white/8 rounded-3xl p-8 max-w-xl mx-auto">
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Rekenvoorbeeld — Schoenen à €49,99</p>
              <div className="space-y-3">
                {[
                  { l: "Verkoopprijs product", v: "€ 49,99", c: "text-white" },
                  { l: "Commissie ingesteld door merk (10%)", v: "€ 5,00", c: "text-white" },
                  { l: "TikToMatch platformfee (20% van commissie)", v: "− € 1,00", c: "text-red-400" },
                  { l: "Creator ontvangt per verkoop", v: "€ 4,00", c: "text-[#00d4c8] text-lg font-black" },
                ].map(({ l, v, c }) => (
                  <div key={l} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white/50">{l}</span>
                    <span className={`text-sm font-bold ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                <p className="text-xs text-white/25">100 verkopen/mnd = <span className="text-white/50 font-bold">€400 voor de creator</span></p>
                <p className="text-xs text-white/20">Merken betalen ook een 9% TikTok Shop referral fee rechtstreeks aan TikTok (4% de eerste 60 dagen voor nieuwe verkopers).</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AI MATCHING
      ═══════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 text-sm font-bold px-4 py-2 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5 text-[#ff0050]" />
              <span>Powered by Claude AI</span>
            </div>
            <h2 className="text-5xl font-black mb-4">
              Matching op <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">verkoopdata</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Niet op bereik. Niet op esthetiek. Op wie effectief verkoopt via TikTok Shop — in-feed video, LIVE shopping of storefront.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, t: "Verkoopkracht", pts: "20pt", d: "GMV, TikTok Shop verkopen — hoeveel verkopen ze écht?", c: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
              { icon: Target, t: "Niche-match", pts: "30pt", d: "Sluiten de content-niches aan bij jouw productcategorie?", c: "from-[#ff0050]/20 to-rose-500/20", border: "border-[#ff0050]/20" },
              { icon: BarChart2, t: "Engagement kwaliteit", pts: "20pt", d: "Echte interactie vs gekochte likes — kwalitatief bereik.", c: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20" },
              { icon: Users, t: "Doelgroep-match", pts: "15pt", d: "Leeftijd, geslacht en regio van de volgers.", c: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20" },
              { icon: Euro, t: "Commissie vs ROI", pts: "10pt", d: "Is de gevraagde commissie realistisch voor dit product?", c: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20" },
              { icon: Globe, t: "Taal & regio", pts: "5pt", d: "NL, FR of tweetalig — specifiek voor de Belgische markt.", c: "from-[#00d4c8]/20 to-teal-500/20", border: "border-[#00d4c8]/20" },
            ].map(({ icon: Icon, t, pts, d, c, border }) => (
              <StaggerItem key={t}>
                <div className={`bg-gradient-to-br ${c} border ${border} rounded-2xl p-5 h-full hover:scale-[1.02] transition-transform cursor-default`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded-full">{pts}</span>
                  </div>
                  <p className="font-bold text-white text-sm mb-1.5">{t}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VOOR KLEINE ZELFSTANDIGEN
      ═══════════════════════════════════════ */}
      <section className="py-32 px-6 bg-white text-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <p className="text-sm font-bold text-[#ff0050] tracking-[0.2em] uppercase mb-6">Ook voor kleine merken</p>
            <h2 className="text-5xl font-black leading-tight text-gray-900 mb-6">
              Kleine zelfstandige?<br />
              <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">TikTok Shop</span><br />
              is jouw kans.
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Geen groot advertentiebudget nodig. Een goede TikTok-verkoper met de juiste niche
              verkoopt jouw producten beter dan elke reclame — en jij betaalt enkel als er verkocht wordt.
            </p>
            <div className="space-y-3">
              {[
                "Geen minimum advertentiebudget",
                "Creators leveren zelf de content",
                "Jij levert producten, zij verkopen",
                "Transparante commissie-afrekening",
                "Automatische uitbetaling elke 2 weken",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#ff0050] shrink-0" />
                  <span className="text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          <ScaleIn delay={0.2}>
            <div className="space-y-4">
              {[
                { icon: ShoppingBag, t: "Verkoopdata, niet bereik", d: "Wij selecteren op TikTok Shop GMV. Wie verkoopt het meest in jouw niche?" },
                { icon: Lock, t: "Platform-only communicatie", d: "Alle contacten en contracten via TikToMatch. Directe afspraken buiten het platform zijn verboden." },
                { icon: CreditCard, t: "Automatische uitbetalingen", d: "Elke 2 weken commissies verrekend. Geen handmatige overschrijvingen, geen discussies." },
                { icon: Package, t: "Producten bezorgen, wij doen de rest", d: "Bezorg samples/producten aan de creator. Wij regelen briefing, contract en betaling." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex gap-4 p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group border border-gray-100 hover:border-gray-200">
                  <div className="w-10 h-10 bg-[#ff0050]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#ff0050]/15 transition-colors">
                    <Icon className="h-5 w-5 text-[#ff0050]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">{t}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-5xl font-black mb-3">Wat ze zeggen</h2>
            <p className="text-white/40">Early adopters over TikToMatch</p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Via TikToMatch hadden we binnen 3 dagen 4 creators die onze schoenen promootten op commissiebasis. Op dag 1 van de TikTok Shop lancering stonden we al live.", n: "Sarah V.", r: "Zaakvoerder, schoenenzaak Antwerpen", stars: 5 },
              { q: "Ik verdien per product dat ik verkoop via mijn TikTok Shop-link. TikToMatch regelt de betaling automatisch — 15 dagen na levering staat het op mijn rekening.", n: "Thomas D.", r: "Creator @foodie_thomas, 28K volgers, Gent", stars: 5 },
              { q: "Als kleine zelfstandige kon ik nooit betalen voor influencer marketing. Met commissiemodel via TikToMatch betaal ik enkel als er effectief verkocht wordt.", n: "Julie M.", r: "Zelfstandige, beauty producten, Brussel", stars: 5 },
            ].map((t) => (
              <StaggerItem key={t.n}>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-6 h-full hover:border-white/15 transition-colors">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">&ldquo;{t.q}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff0050] to-[#ff6b9d] flex items-center justify-center text-white text-xs font-black">
                      {t.n.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t.n}</p>
                      <p className="text-xs text-white/30">{t.r}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VOOR MERKEN — AANVRAAG
      ═══════════════════════════════════════ */}
      <section id="prijzen" className="py-32 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-sm font-bold text-[#ff0050] tracking-[0.2em] uppercase mb-4">Voor merken</p>
            <h2 className="text-5xl font-black mb-4">
              Tarieven <span className="bg-gradient-to-r from-[#ff0050] to-[#ff6b9d] bg-clip-text text-transparent">op maat</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Maak gratis je profiel aan. Wij bekijken je aanvraag en nemen
              <strong className="text-white"> binnen 24 uur</strong> contact met je op om alles te bespreken.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Stappen */}
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                {[
                  { n: "1", t: "Registreer gratis & vul je profiel in", d: "Vertel ons over je merk, producten en het commissiepercentage dat je wil bieden. Duurt 5 minuten." },
                  { n: "2", t: "Wij bekijken je aanvraag", d: "Ons team controleert je profiel op geschiktheid — sector, producten, doelgroep. Geen automatische goedkeuring." },
                  { n: "3", t: "Wij nemen contact op binnen 24u", d: "Een TikToMatch-medewerker neemt persoonlijk contact op. We bespreken jouw situatie en wat we voor jou kunnen doen." },
                  { n: "4", t: "Je krijgt toegang & we starten", d: "Na akkoord krijg je toegang tot de creator database en starten we de eerste matches." },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex gap-4 items-start p-4 bg-white/4 hover:bg-white/6 border border-white/8 rounded-2xl transition-colors">
                    <div className="w-8 h-8 bg-[#ff0050] rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                      {n}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm mb-1">{t}</p>
                      <p className="text-xs text-white/40 leading-relaxed">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* CTA kaart */}
            <ScaleIn delay={0.2}>
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/12 rounded-3xl p-8">
                <div className="mb-6">
                  <p className="text-xs font-bold text-[#ff0050] uppercase tracking-widest mb-2">Tariefmodel</p>
                  <p className="font-black text-white text-2xl mb-1">Commissie-gebaseerd</p>
                  <p className="text-white/40 text-sm">Geen vast abonnement. Tarieven op maat van jouw volume en sector.</p>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: "✓", t: "Toegang tot gescreende Belgian creators" },
                    { icon: "✓", t: "AI-matching op GMV en niche" },
                    { icon: "✓", t: "Contracten en betalingsbeheer via platform" },
                    { icon: "✓", t: "Uitbetaling creators na 15 dagen (TikTok-standaard)" },
                    { icon: "✓", t: "Persoonlijke begeleiding bij opstarten" },
                    { icon: "✓", t: "Platform-only communicatie — geen directe contacten" },
                  ].map(({ icon, t }) => (
                    <div key={t} className="flex items-center gap-3 text-sm">
                      <span className="text-[#ff0050] font-black shrink-0">{icon}</span>
                      <span className="text-white/70">{t}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register"
                  className="block w-full text-center bg-[#ff0050] hover:bg-[#ff337a] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-[#ff0050]/25 hover:shadow-[#ff0050]/40 hover:scale-[1.02] mb-3">
                  Profiel aanmaken → wij nemen contact op
                </Link>
                <p className="text-center text-xs text-white/25">Geen automatische goedkeuring · Persoonlijk contact binnen 24u</p>
              </div>
            </ScaleIn>
          </div>

          {/* Creator info */}
          <FadeIn delay={0.3}>
            <div className="mt-10 flex items-start gap-3 p-5 bg-[#00d4c8]/8 border border-[#00d4c8]/20 rounded-2xl max-w-xl mx-auto">
              <CheckCircle className="h-5 w-5 text-[#00d4c8] shrink-0 mt-0.5" />
              <p className="text-sm text-white/60">
                <strong className="text-white">Creator?</strong> Aanmelden is altijd gratis.
                Je profiel wordt automatisch goedgekeurd na verificatie. TikToMatch houdt 20% in van je verdiende commissie — geen maandelijkse kosten.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA / WAITLIST
      ═══════════════════════════════════════ */}
      <section id="waitlist" className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff0050]/12 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 border border-[#ff0050]/30 text-[#ff0050] text-xs font-black px-4 py-2 rounded-full mb-8 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#ff0050] rounded-full animate-pulse" />
              Pre-launch — schrijf je nu in
            </div>
            <h2 className="text-5xl font-black mb-4 leading-tight">
              Wees er als<br />
              <span className="bg-gradient-to-r from-[#ff0050] via-[#ff6b9d] to-[#ff0050] bg-clip-text text-transparent">eerste bij.</span>
            </h2>
            <p className="text-white/50 mb-6 text-lg leading-relaxed">
              TikTok Shopping Belgium lanceert op <strong className="text-white">15 juni 2026</strong>.
              Registreer nu gratis en bouw alvast je profiel op.
            </p>

            {/* Benefits */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 text-sm">
              {[
                { icon: "🎁", text: "3 maanden gratis Pro" },
                { icon: "⚡", text: "Eerste matches op lanceringsdag" },
                { icon: "🔒", text: "Prijs voor altijd vastgezet" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                  <span>{icon}</span>
                  <span className="text-white/70 font-medium">{text}</span>
                </div>
              ))}
            </div>

            <WaitlistForm />
            <p className="text-xs text-white/20 mt-4">Geen kredietkaart vereist. Altijd gratis voor creators.</p>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-12 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#ff0050] rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-white text-lg">TikToMatch</span>
          </div>
          <div className="flex gap-8 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</Link>
            <a href="mailto:hello@tiktomatch.be" className="hover:text-white transition-colors">Contact</a>
          </div>
          <span className="text-sm text-white/20">© 2026 TikToMatch</span>
        </div>
      </footer>

      {/* Global CSS voor marquee + shimmer */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
