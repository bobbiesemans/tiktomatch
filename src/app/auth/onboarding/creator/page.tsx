"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NICHES, PROVINCIES, cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const STAPPEN = ["TikTok profiel", "Statistieken", "Niche & taal", "Voorkeuren"]

const stap1Schema = z.object({
  tiktok_handle: z.string().min(1, "Verplicht"),
  display_name: z.string().min(2, "Verplicht"),
  bio: z.string().optional(),
})
type Stap1 = z.infer<typeof stap1Schema>

const stap2Schema = z.object({
  follower_count: z.number().min(0),
  avg_engagement_rate: z.number().min(0).max(100),
  avg_views: z.number().min(0),
  gmv_30d: z.number().min(0),
})
type Stap2 = z.infer<typeof stap2Schema>

export default function CreatorOnboardingPage() {
  const [stap, setStap] = useState(0)
  const [niches, setNiches] = useState<string[]>([])
  const [taal, setTaal] = useState("nl")
  const [provincie, setProvincie] = useState("")
  const [campagneTypes, setCampagneTypes] = useState<string[]>([])
  const [minVergoeding, setMinVergoeding] = useState(0)
  const [verifiedSeller, setVerifiedSeller] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form1 = useForm<Stap1>({ resolver: zodResolver(stap1Schema) })
  const form2 = useForm<Stap2>({ resolver: zodResolver(stap2Schema) })

  function toggleNiche(n: string) {
    setNiches((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n])
  }
  function toggleCampagne(t: string) {
    setCampagneTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])
  }

  async function voltooi() {
    setLoading(true)
    const v1 = form1.getValues()
    const v2 = form2.getValues()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    await supabase.from("creators").upsert({
      id: user.id,
      tiktok_handle: v1.tiktok_handle.replace("@", ""),
      display_name: v1.display_name,
      bio: v1.bio || null,
      follower_count: v2.follower_count,
      avg_engagement_rate: v2.avg_engagement_rate,
      avg_views: v2.avg_views,
      gmv_30d: v2.gmv_30d,
      niches,
      taal,
      provincie: provincie || null,
      campagne_types: campagneTypes,
      min_vergoeding: minVergoeding,
      verified_seller: verifiedSeller,
    })
    router.push("/dashboard/creator")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Stap {stap + 1} van {STAPPEN.length}
          </p>
          <div className="flex gap-1.5 mb-4">
            {STAPPEN.map((_, i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= stap ? "bg-[#ff0050]" : "bg-gray-200")} />
            ))}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{STAPPEN[stap]}</h2>
        </div>

        {stap === 0 && (
          <form onSubmit={form1.handleSubmit(() => setStap(1))} className="space-y-4">
            <div>
              <Label>TikTok handle *</Label>
              <div className="flex mt-1">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 flex items-center text-gray-500 text-sm">@</span>
                <Input placeholder="jouwnaam" className="rounded-l-none" {...form1.register("tiktok_handle")} />
              </div>
              {form1.formState.errors.tiktok_handle && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.tiktok_handle.message}</p>}
            </div>
            <div>
              <Label>Display naam *</Label>
              <Input placeholder="Jan Janssen" className="mt-1" {...form1.register("display_name")} />
              {form1.formState.errors.display_name && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.display_name.message}</p>}
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea placeholder="Vertel iets over je content..." className="mt-1" {...form1.register("bio")} />
            </div>
            <Button type="submit" className="w-full bg-[#1a0533] hover:bg-[#2d0955]">Volgende</Button>
          </form>
        )}

        {stap === 1 && (
          <form onSubmit={form2.handleSubmit(() => setStap(2))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aantal volgers</Label>
                <Input type="number" placeholder="10000" className="mt-1" {...form2.register("follower_count", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Engagement % (gem.)</Label>
                <Input type="number" step="0.1" placeholder="4.5" className="mt-1" {...form2.register("avg_engagement_rate", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Gem. views/video</Label>
                <Input type="number" placeholder="5000" className="mt-1" {...form2.register("avg_views", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>GMV 30 dagen (€)</Label>
                <Input type="number" placeholder="0" className="mt-1" {...form2.register("gmv_30d", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button type="button" onClick={() => setVerifiedSeller(!verifiedSeller)}
                className={cn("w-11 h-6 rounded-full transition-colors", verifiedSeller ? "bg-[#ff0050]" : "bg-gray-300")}>
                <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5", verifiedSeller ? "translate-x-5" : "translate-x-0")} />
              </button>
              <span className="text-sm font-medium text-gray-700">TikTok Shop Verified Seller</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStap(0)} className="flex-1">Terug</Button>
              <Button type="submit" className="flex-1 bg-[#1a0533] hover:bg-[#2d0955]">Volgende</Button>
            </div>
          </form>
        )}

        {stap === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Niches *</Label>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <button key={n} type="button" onClick={() => toggleNiche(n)}
                    className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      niches.includes(n) ? "bg-[#ff0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Taal content</Label>
                <div className="flex gap-2">
                  {[{ v: "nl", l: "NL" }, { v: "fr", l: "FR" }, { v: "both", l: "Beide" }].map(({ v, l }) => (
                    <button key={v} type="button" onClick={() => setTaal(v)}
                      className={cn("flex-1 py-2 rounded-lg border-2 text-sm font-medium transition",
                        taal === v ? "border-[#ff0050] bg-red-50 text-[#ff0050]" : "border-gray-200 text-gray-600"
                      )}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Provincie</Label>
                <Select onValueChange={setProvincie}>
                  <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                  <SelectContent>
                    {PROVINCIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStap(1)} className="flex-1">Terug</Button>
              <Button className="flex-1 bg-[#1a0533] hover:bg-[#2d0955]" disabled={niches.length === 0} onClick={() => setStap(3)}>Volgende</Button>
            </div>
          </div>
        )}

        {stap === 3 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Campagne types die je wil doen</Label>
              <div className="space-y-2">
                {[
                  { v: "affiliate", l: "Affiliate", d: "Commissie per verkoop" },
                  { v: "gifting", l: "Gifting", d: "Gratis producten" },
                  { v: "paid", l: "Paid deal", d: "Vaste vergoeding" },
                ].map(({ v, l, d }) => (
                  <button key={v} type="button" onClick={() => toggleCampagne(v)}
                    className={cn("w-full p-3 rounded-xl border-2 text-left transition-all",
                      campagneTypes.includes(v) ? "border-[#ff0050] bg-red-50" : "border-gray-200 hover:border-gray-300"
                    )}>
                    <span className="font-semibold text-gray-900 text-sm">{l}</span>
                    <span className="text-gray-500 text-xs ml-2">— {d}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Min. vergoeding per campagne (€)</Label>
              <Input type="number" value={minVergoeding} onChange={(e) => setMinVergoeding(Number(e.target.value))} className="mt-1" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStap(2)} className="flex-1">Terug</Button>
              <Button className="flex-1 bg-[#ff0050] hover:bg-[#ff337a]" onClick={voltooi} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Opslaan...</> : "Dashboard openen"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
