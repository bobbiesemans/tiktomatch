import Link from "next/link"
import { Navbar } from "@/components/navbar"
import WaitlistForm from "@/components/WaitlistForm"
import PrijsKaart from "@/components/PrijsKaart"
import {
  Target, BarChart2, ShoppingBag, Users, Wallet, Globe,
  CheckCircle, ArrowRight, Zap, Star, TrendingUp, Building2, Video
} from "lucide-react"

export const metadata = {
  title: "TikToMatch — TikTok creators voor Belgische brands",
  description: "Het eerste AI-powered TikTok creator platform voor België. Match jouw brand met de perfecte TikTok Shop creators op basis van engagement, verkoopdata en niche-alignment.",
  keywords: ["TikTok creators België", "TikTok Shop Belgium", "influencer marketing België", "TikTok creator platform"],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-[#1a0533] overflow-hidden">
        {/* Background gradient circles */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff0050]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-[#ff0050]/20">
              <Zap className="h-3.5 w-3.5" />
              Lancering 15 juni — TikTok Shopping Belgium
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6">
              De perfecte<br />
              <span className="text-[#ff0050]">TikTok creator</span><br />
              voor jouw brand
            </h1>

            <p className="text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
              AI-powered matching op basis van echte verkoopdata, engagement en niche-alignment.
              Specifiek voor de Belgische markt — NL en FR.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-[#ff0050] hover:bg-[#ff337a] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-2xl shadow-red-500/30">
                Ik ben een brand
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl text-lg transition border border-white/20">
                <Video className="h-5 w-5" />
                Ik ben een creator
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap gap-8">
              {[
                { getal: "500+", label: "Belgische creators" },
                { getal: "€2.4M", label: "GMV gematcht" },
                { getal: "94%", label: "Match satisfaction" },
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
          {["TikTok Shop BE", "Belgische e-commerce brands", "Influencer agencies", "D2C merken"].map((name) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Van signup tot live campagne</h2>
            <p className="text-gray-500 text-lg">Drie stappen — voor brands en creators</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Brands */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1a0533]/8 text-[#1a0533] text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Building2 className="h-4 w-4" />
                Voor brands
              </div>
              <div className="space-y-8">
                {[
                  { n: "01", titel: "Maak je brand profiel", tekst: "Vul je productcategorie, budget en doelgroep in. Duurt 3 minuten." },
                  { n: "02", titel: "Ontvang AI-matches", tekst: "Ons algoritme analyseert 500+ Belgische creators en geeft elke match een score van 0 tot 100." },
                  { n: "03", titel: "Start je campagne", tekst: "Kies je favoriete creators, verstuur een aanbieding en volg de resultaten live." },
                ].map(({ n, titel, tekst }) => (
                  <div key={n} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-[#1a0533] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{titel}</h3>
                      <p className="text-gray-500 mt-1">{tekst}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creators */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ff0050]/10 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Video className="h-4 w-4" />
                Voor creators
              </div>
              <div className="space-y-8">
                {[
                  { n: "01", titel: "Maak je creator profiel", tekst: "Voer je TikTok stats in: volgers, engagement, niches en TikTok Shop GMV." },
                  { n: "02", titel: "Ontvang brand aanbiedingen", tekst: "Brands matchen automatisch met jou. Zie de AI-score en uitleg voor elke match." },
                  { n: "03", titel: "Verdien commissies", tekst: "Accepteer deals, maak content en ontvang automatisch uitbetalingen via Stripe." },
                ].map(({ n, titel, tekst }) => (
                  <div key={n} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-[#ff0050] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {n}
                    </div>
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

      {/* AI MATCHING */}
      <section className="py-24 px-6 bg-[#1a0533]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#ff0050]/15 text-[#ff0050] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-[#ff0050]/20">
              <Zap className="h-3.5 w-3.5" />
              Powered by Claude AI
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Niet zomaar een score</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Elk matchscore is berekend door Claude — de meest geavanceerde AI.
              Zes criteria, gewogen op de Belgische markt.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Target, titel: "Niche-overlap", pts: "30pt", tekst: "Sluiten niches aan bij je producten?" },
              { icon: BarChart2, titel: "Engagement kwaliteit", pts: "20pt", tekst: "Echte interactie vs gekochte volgers" },
              { icon: ShoppingBag, titel: "Verkoopkapaciteit", pts: "20pt", tekst: "GMV, TikTok Shop verified seller" },
              { icon: Users, titel: "Demografische match", pts: "15pt", tekst: "Leeftijd, geslacht, regio" },
              { icon: Wallet, titel: "Budget vs ROI", pts: "10pt", tekst: "Realistische verwachtingen" },
              { icon: Globe, titel: "Taal en regio", pts: "5pt", tekst: "NL / FR / tweetalig match" },
            ].map(({ icon: Icon, titel, pts, tekst }) => (
              <div key={titel} className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-5 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-[#ff0050]/15 rounded-lg flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-[#ff0050]" />
                  </div>
                  <span className="text-xs font-bold text-[#ff0050] bg-[#ff0050]/10 px-2 py-0.5 rounded-full">{pts}</span>
                </div>
                <p className="font-semibold text-white text-sm mb-1">{titel}</p>
                <p className="text-white/50 text-xs">{tekst}</p>
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
                quote: "In 2 dagen hadden we 5 top creators geselecteerd voor onze productlancering. Het AI-systeem koos precies de juiste profielen.",
                naam: "Sarah V.",
                rol: "Marketing Manager, Belgische e-commerce brand",
                rating: 5,
              },
              {
                quote: "Als creator kreeg ik voor het eerst een aanbieding die echt bij mijn content paste. De match uitleg was super transparant.",
                naam: "Thomas D.",
                rol: "TikTok creator, 85K volgers, Gent",
                rating: 5,
              },
              {
                quote: "We lanceerden onze TikTok Shop strategie via TikToMatch. ROI was 340% hoger dan via klassieke influencer bureaus.",
                naam: "Julie M.",
                rol: "E-commerce Director, Brussel",
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante prijzen</h2>
            <p className="text-gray-500 text-lg">14 dagen gratis uitproberen — geen kredietkaart vereist</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrijsKaart
              naam="Starter"
              prijs={99}
              beschrijving="Voor kleine brands"
              features={["5 actieve campagnes", "50 AI-matches/mnd", "Basis analytics", "E-mail support"]}
              plan="starter"
              highlighted={false}
            />
            <PrijsKaart
              naam="Pro"
              prijs={249}
              beschrijving="Voor groeiende brands"
              features={["Onbeperkte campagnes", "Onbeperkte matches", "Priority matching", "Geavanceerde analytics", "Telefoon support"]}
              plan="pro"
              highlighted={true}
            />
            <PrijsKaart
              naam="Agency"
              prijs={499}
              beschrijving="Voor agencies en grote merken"
              features={["Alles in Pro", "Tot 10 merkaccounts", "White-label dashboard", "Dedicated account manager", "SLA garantie"]}
              plan="agency"
              highlighted={false}
            />
          </div>

          <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3 max-w-2xl mx-auto">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              <strong>Creator?</strong> TikToMatch is volledig gratis voor creators.
              We houden 15% commissie in op succesvolle deals. Geen maandelijkse kosten.
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
