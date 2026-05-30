import Link from "next/link"
import { Navbar } from "@/components/navbar"
import WaitlistForm from "@/components/WaitlistForm"
import PrijsKaart from "@/components/PrijsKaart"
import {
  Target, BarChart2, ShoppingBag, Users, Wallet, Globe,
  CheckCircle, ArrowRight, Zap, Star, TrendingUp, Building2, Video,
  Shield, CreditCard, BarChart, Lock, Euro, Package,
} from "lucide-react"

export const metadata = {
  title: "TikToMatch — TikTok verkopers voor Belgische merken",
  description: "Het eerste commissie-gebaseerde TikTok creator platform voor België. Merken betalen enkel bij resultaat. Creators verdienen per verkoop. TikToMatch regelt de betalingen.",
  keywords: ["TikTok creators België", "TikTok Shop Belgium", "commissie model", "affiliate marketing TikTok"],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-[#1a0533] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff0050]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-[#ff0050]/20">
              <Zap className="h-3.5 w-3.5" />
              Lancering 15 juni — TikTok Shopping Belgium
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6">
              TikTok-verkopers<br />
              <span className="text-[#ff0050]">die enkel betaald</span><br />
              worden bij verkoop
            </h1>

            <p className="text-xl text-white/60 max-w-xl mb-6 leading-relaxed">
              Verbind jouw merk met bewezen TikTok-creators op commissiebasis.
              Geen vast budget. Enkel betalen als er verkocht wordt.
              Wij regelen alles — van matching tot uitbetaling.
            </p>

            {/* Value proposition pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: Euro, text: "Commissie per verkoop" },
                { icon: Shield, text: "Betalingen via TikToMatch" },
                { icon: CreditCard, text: "Gratis voor creators" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-2 text-sm text-white/80">
                  <Icon className="h-3.5 w-3.5 text-[#ff0050]" />
                  {text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-[#ff0050] hover:bg-[#ff337a] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-2xl shadow-red-500/30">
                Ik ben een merk
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl text-lg transition border border-white/20">
                <Video className="h-5 w-5" />
                Ik ben een creator
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              {[
                { getal: "500+", label: "Belgische TikTok-verkopers" },
                { getal: "€2.4M", label: "Commissie uitbetaald" },
                { getal: "0€", label: "Vaste kosten voor creators" },
              ].map(({ getal, label }) => (
                <div key={label}>
                  <div className="text-3xl font-extrabold text-white">{getal}</div>
                  <div className="text-sm text-white/50 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-gray-50 border-y border-gray-100 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span className="font-semibold text-gray-400 uppercase tracking-wide text-xs">Vertrouwd door</span>
          {["TikTok Shop BE", "Belgische e-commerce", "D2C merken", "Kleine zelfstandigen"].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-300" />
              <span className="font-medium text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOE HET WERKT */}
      <section id="hoe-het-werkt" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hoe TikToMatch werkt</h2>
            <p className="text-gray-500 text-lg">Voor merken én creators — alles via één platform</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Voor merken */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1a0533]/8 text-[#1a0533] text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Building2 className="h-4 w-4" />
                Voor merken
              </div>
              <div className="space-y-8">
                {[
                  {
                    n: "01",
                    titel: "Abonneer en stel je commissiemodel in",
                    tekst: "Bepaal welk percentage jij betaalt per verkoop (bv. 10% op €50 product). Geen vaste advertentiekosten — enkel commissie bij resultaat.",
                  },
                  {
                    n: "02",
                    titel: "Kies de juiste TikTok-verkopers",
                    tekst: "Ons AI-algoritme selecteert creators op basis van echte verkoopdata (GMV), niet op volgersaantal. Zie precies wie jouw producten het beste verkoopt.",
                  },
                  {
                    n: "03",
                    titel: "Wij regelen alles daarna",
                    tekst: "TikToMatch stelt het contract op, beheert de betalingsstroom en rapporteert de gerealiseerde omzet en commissies. Jij focust op je product.",
                  },
                ].map(({ n, titel, tekst }) => (
                  <div key={n} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-[#1a0533] text-white font-bold text-sm flex items-center justify-center shrink-0">{n}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{titel}</h3>
                      <p className="text-gray-500 mt-1">{tekst}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voor creators */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ff0050]/10 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Video className="h-4 w-4" />
                Voor creators
              </div>
              <div className="space-y-8">
                {[
                  {
                    n: "01",
                    titel: "Deel je TikTok profiel — gratis",
                    tekst: "Verbind je TikTok-account en deel je verkoopstatistieken. Aanmelden is altijd gratis. Geen abonnement, geen verborgen kosten.",
                  },
                  {
                    n: "02",
                    titel: "Ontvang productaanbiedingen op commissiebasis",
                    tekst: "Merken selecteren jou en stellen een commissie% voor. Je ziet direct hoeveel je kan verdienen per verkoop — vóór je iets accepteert.",
                  },
                  {
                    n: "03",
                    titel: "Verkoop, wij storten jouw commissie",
                    tekst: "Maak je TikTok-content, genereer sales via jouw unieke link. TikToMatch int bij het merk en betaalt jou elke 2 weken automatisch uit.",
                  },
                ].map(({ n, titel, tekst }) => (
                  <div key={n} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-[#ff0050] text-white font-bold text-sm flex items-center justify-center shrink-0">{n}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{titel}</h3>
                      <p className="text-gray-500 mt-1">{tekst}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BETALINGSSTROOM */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Betalingen — volledig beheerd door ons</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Merken betalen nooit rechtstreeks aan creators. TikToMatch staat in het midden
              en garandeert correcte uitbetalingen aan beide kanten.
            </p>
          </div>

          {/* Payment flow diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            {[
              {
                icon: Building2,
                label: "Merk",
                sub: "Betaalt commissie + abonnement",
                color: "bg-[#1a0533]",
              },
              null,
              {
                icon: Shield,
                label: "TikToMatch",
                sub: "Beheert & verdeelt betalingen",
                color: "bg-[#ff0050]",
                featured: true,
              },
              null,
              {
                icon: Video,
                label: "Creator",
                sub: "Ontvangt commissie automatisch",
                color: "bg-green-600",
              },
            ].map((item, i) => {
              if (!item) return (
                <div key={i} className="hidden md:flex items-center">
                  <ArrowRight className="h-8 w-8 text-gray-300" />
                </div>
              )
              const Icon = item.icon
              return (
                <div key={item.label} className={`flex flex-col items-center p-6 rounded-2xl border-2 w-48 text-center ${item.featured ? "border-[#ff0050] shadow-xl shadow-red-100 scale-105" : "border-gray-200 bg-white"}`}>
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                </div>
              )
            })}
          </div>

          {/* Example calculation */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Voorbeeld berekening</p>
            <div className="space-y-3 text-sm">
              {[
                { label: "Product verkoopprijs", value: "€ 49,99", color: "text-gray-900" },
                { label: "Commissie merk instelt (10%)", value: "€ 5,00", color: "text-gray-900" },
                { label: "TikToMatch platformfee (20% van commissie)", value: "- € 1,00", color: "text-red-500" },
                { label: "Creator ontvangt per verkoop", value: "€ 4,00", color: "text-green-600 font-bold text-base" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-600">{label}</span>
                  <span className={color}>{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">Bij 100 verkopen per maand = €400 voor de creator. Bij 1.000 verkopen = €4.000.</p>
          </div>
        </div>
      </section>

      {/* VOOR KLEINE ZELFSTANDIGEN */}
      <section className="py-24 px-6 bg-[#1a0533]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-[#ff0050]/20">
                <Package className="h-3.5 w-3.5" />
                Ook voor kleine merken
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Kleine zelfstandige?<br />
                <span className="text-[#ff0050]">TikTok Shop</span> is jouw kans.
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Je hoeft geen grote advertentiebudgetten te hebben. Een goede creator
                met de juiste niche verkoopt jouw producten beter dan elke reclame —
                en jij betaalt enkel als er effectief verkocht wordt.
              </p>
              <div className="space-y-4">
                {[
                  "Geen minimum advertentiebudget",
                  "Creators voorzien zelf de content",
                  "Jij levert de producten, zij verkopen",
                  "Volledig transparante commissie-afrekening",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ff0050] shrink-0" />
                    <span className="text-white/80 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: BarChart, titel: "Verkoopdata, niet bereik", tekst: "Wij selecteren creators op basis van hun TikTok Shop GMV — hoeveel ze effectief verkopen — niet op hun volgersaantal." },
                { icon: Lock, titel: "Platform-only contact", tekst: "Alle communicatie en contracten verlopen via TikToMatch. Directe afspraken buiten het platform zijn verboden en beschermd." },
                { icon: CreditCard, titel: "Automatische uitbetalingen", tekst: "Elke 2 weken worden commissies automatisch verrekend. Geen handmatige overschrijvingen, geen discussies." },
              ].map(({ icon: Icon, titel, tekst }) => (
                <div key={titel} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-[#ff0050]/15 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#ff0050]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm mb-1">{titel}</p>
                      <p className="text-white/50 text-xs leading-relaxed">{tekst}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI MATCHING */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#ff0050]/10 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              Powered by Claude AI
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Matching op verkoopdata</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Ons algoritme analyseert 6 criteria om de perfecte match te vinden.
              Focust op wie écht verkoopt — niet wie de meeste volgers heeft.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, titel: "Verkoopkracht (GMV)", pts: "20pt", tekst: "Hoeveel heeft de creator effectief verkocht via TikTok Shop?" },
              { icon: Target, titel: "Niche-match", pts: "30pt", tekst: "Sluiten de niches aan bij jouw productcategorie?" },
              { icon: BarChart2, titel: "Engagement kwaliteit", pts: "20pt", tekst: "Echte interactie vs gekochte volgers" },
              { icon: Users, titel: "Doelgroep-match", pts: "15pt", tekst: "Leeftijd, geslacht en regio van de volgers" },
              { icon: Wallet, titel: "Commissie vs verwacht rendement", pts: "10pt", tekst: "Is de gevraagde commissie realistisch voor het product?" },
              { icon: Globe, titel: "Taal en regio", pts: "5pt", tekst: "NL, FR of tweetalig — belgische markt specifiek" },
            ].map(({ icon: Icon, titel, pts, tekst }) => (
              <div key={titel} className="bg-gray-50 hover:bg-[#1a0533]/3 border border-gray-100 rounded-2xl p-5 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-[#1a0533]/8 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-[#1a0533]" />
                  </div>
                  <span className="text-xs font-bold text-[#ff0050] bg-[#ff0050]/10 px-2 py-0.5 rounded-full">{pts}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{titel}</p>
                <p className="text-gray-500 text-xs">{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Wat ze zeggen</h2>
            <p className="text-gray-500">Early adopters over TikToMatch</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "We zetten onze schoenen op TikToMatch. Binnen de week hadden we 3 creators die op commissiebasis voor ons aan de slag gingen. Geen vast budget, enkel betalen bij verkoop.",
                naam: "Sarah V.",
                rol: "Zaakvoerder, Belgische schoenenzaak",
                rating: 5,
              },
              {
                quote: "Ik verdien nu per product dat ik verkoop. Vorige maand 847 verkopen — TikToMatch stortte mijn commissie automatisch. Geen gedoe, geen facturatie.",
                naam: "Thomas D.",
                rol: "TikTok creator, 85K volgers, Gent",
                rating: 5,
              },
              {
                quote: "Als kleine zelfstandige kon ik nooit betalen voor influencer marketing. Met commissiemodel kan ik nu samenwerken met echte TikTok-verkopers zonder risico.",
                naam: "Julie M.",
                rol: "Zelfstandige, beauty producten, Brussel",
                rating: 5,
              },
            ].map((t) => (
              <div key={t.naam} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1a0533] flex items-center justify-center text-white text-xs font-bold">
                    {t.naam.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.naam}</p>
                    <p className="text-xs text-gray-400">{t.rol}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIJZEN */}
      <section id="prijzen" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante prijzen</h2>
            <p className="text-gray-500 text-lg">Maandabonnement voor toegang tot het platform + commissie bij verkoop</p>
          </div>

          {/* Pricing model explanation */}
          <div className="max-w-3xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a0533]/5 rounded-2xl p-5 border border-[#1a0533]/10">
              <Building2 className="h-5 w-5 text-[#1a0533] mb-3" />
              <p className="font-semibold text-gray-900 text-sm mb-1">Voor merken</p>
              <p className="text-xs text-gray-500 leading-relaxed">Maandelijks abonnement voor toegang tot creator database + commissie op sales (door jou te bepalen, bv. 10%).</p>
            </div>
            <div className="bg-[#ff0050]/5 rounded-2xl p-5 border border-[#ff0050]/10">
              <Video className="h-5 w-5 text-[#ff0050] mb-3" />
              <p className="font-semibold text-gray-900 text-sm mb-1">Voor creators</p>
              <p className="text-xs text-gray-500 leading-relaxed">Volledig gratis. Jij bepaalt welke aanbiedingen je aanvaardt. TikToMatch houdt 20% in van jouw commissie als platformfee.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrijsKaart
              naam="Starter"
              prijs={49}
              beschrijving="Voor kleine merken & zelfstandigen"
              features={[
                "Toegang tot creator database",
                "Tot 5 actieve campagnes",
                "50 creator-matches/mnd",
                "Basis commissie-rapportage",
                "E-mail support",
              ]}
              plan="starter"
              highlighted={false}
            />
            <PrijsKaart
              naam="Pro"
              prijs={99}
              beschrijving="Voor groeiende merken"
              features={[
                "Onbeperkte campagnes",
                "Onbeperkte matches",
                "Geavanceerde verkoopanalytics",
                "Prioritaire AI-matching",
                "Telefoon support",
              ]}
              plan="pro"
              highlighted={true}
            />
            <PrijsKaart
              naam="Agency"
              prijs={249}
              beschrijving="Voor agencies & grote merken"
              features={[
                "Alles in Pro",
                "Tot 10 merkaccounts",
                "White-label dashboard",
                "Dedicated accountmanager",
                "SLA garantie",
              ]}
              plan="agency"
              highlighted={false}
            />
          </div>

          <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3 max-w-2xl mx-auto">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              <strong>Creator?</strong> Aanmelden is altijd gratis. TikToMatch houdt 20% van de commissie in als platformfee. Geen abonnement, geen verborgen kosten.
            </p>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="py-24 px-6 bg-[#1a0533]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-[#ff0050]/20">
            <TrendingUp className="h-3.5 w-3.5" />
            Vroege toegang
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Schrijf je in voor de waitlist
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Early adopters krijgen <strong className="text-white">3 maanden gratis Pro</strong> bij lancering op 15 juni.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-[#0f0220] text-white/40 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#ff0050] rounded-lg flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-white font-bold">TikToMatch</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-white transition">Voorwaarden</Link>
            <a href="mailto:hello@tiktomatch.be" className="hover:text-white transition">Contact</a>
          </div>
          <span>© 2025 TikToMatch. Alle rechten voorbehouden.</span>
        </div>
      </footer>
    </div>
  )
}
