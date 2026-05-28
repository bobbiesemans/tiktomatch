"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MatchScore } from "@/components/match-score"
import { NICHES, PROVINCIES, formatNumber, cn } from "@/lib/utils"
import { Loader2, Users, TrendingUp, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({
  tiktok_handle: z.string().min(1, "Verplicht"),
  display_name: z.string().min(2, "Verplicht"),
  bio: z.string().optional(),
  follower_count: z.number().min(0),
  avg_engagement_rate: z.number().min(0).max(100),
  avg_views: z.number().min(0),
  gmv_30d: z.number().min(0),
  min_vergoeding: z.number().min(0),
})
type FormData = z.infer<typeof schema>

export default function MijnProfielPage() {
  const [niches, setNiches] = useState<string[]>([])
  const [taal, setTaal] = useState("nl")
  const [provincie, setProvincie] = useState("")
  const [verifiedSeller, setVerifiedSeller] = useState(false)
  const [beschikbaar, setBeschikbaar] = useState(true)
  const [campagneTypes, setCampagneTypes] = useState<string[]>([])

  const { register, handleSubmit, watch, reset, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { follower_count: 0, avg_engagement_rate: 0, avg_views: 0, gmv_30d: 0, min_vergoeding: 0 },
  })

  const watchedValues = watch()

  useEffect(() => {
    async function laad() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from("creators").select("*").eq("id", user.id).single()
      if (!data) return
      reset({
        tiktok_handle: data.tiktok_handle ?? "",
        display_name: data.display_name ?? "",
        bio: data.bio ?? "",
        follower_count: data.follower_count,
        avg_engagement_rate: data.avg_engagement_rate,
        avg_views: data.avg_views,
        gmv_30d: data.gmv_30d,
        min_vergoeding: data.min_vergoeding,
      })
      setNiches(data.niches ?? [])
      setTaal(data.taal ?? "nl")
      setProvincie(data.provincie ?? "")
      setVerifiedSeller(data.verified_seller)
      setBeschikbaar(data.is_beschikbaar)
      setCampagneTypes(data.campagne_types ?? [])
    }
    laad()
  }, [reset])

  function toggleNiche(n: string) { setNiches((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]) }
  function toggleCampagne(t: string) { setCampagneTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]) }

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("creators").upsert({
      id: user.id, ...data,
      niches, taal, provincie: provincie || null,
      verified_seller: verifiedSeller,
      is_beschikbaar: beschikbaar,
      campagne_types: campagneTypes,
    })
    if (error) toast.error("Opslaan mislukt")
    else toast.success("Profiel opgeslagen!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mijn profiel</h1>

        <Card>
          <CardHeader><CardTitle>TikTok info</CardTitle></CardHeader>
          <CardContent>
            <form id="profiel-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>TikTok handle</Label>
                  <div className="flex mt-1">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 flex items-center text-gray-500 text-sm">@</span>
                    <Input className="rounded-l-none" {...register("tiktok_handle")} />
                  </div>
                  {errors.tiktok_handle && <p className="text-red-500 text-xs mt-1">{errors.tiktok_handle.message}</p>}
                </div>
                <div>
                  <Label>Display naam</Label>
                  <Input className="mt-1" {...register("display_name")} />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea className="mt-1" rows={3} {...register("bio")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Volgers</Label><Input type="number" className="mt-1" {...register("follower_count", { valueAsNumber: true })} /></div>
                <div><Label>Engagement %</Label><Input type="number" step="0.1" className="mt-1" {...register("avg_engagement_rate", { valueAsNumber: true })} /></div>
                <div><Label>Gem. views</Label><Input type="number" className="mt-1" {...register("avg_views", { valueAsNumber: true })} /></div>
                <div><Label>GMV 30 dagen (€)</Label><Input type="number" className="mt-1" {...register("gmv_30d", { valueAsNumber: true })} /></div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Niche & taal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Niches</Label>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <button key={n} type="button" onClick={() => toggleNiche(n)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition",
                      niches.includes(n) ? "bg-[#ff0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Taal</Label>
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
                <Select value={provincie} onValueChange={setProvincie}>
                  <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                  <SelectContent>
                    {PROVINCIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Voorkeuren</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Min. vergoeding (€)</Label>
              <Input form="profiel-form" type="number" className="mt-1 max-w-xs" {...register("min_vergoeding", { valueAsNumber: true })} />
            </div>
            <div>
              <Label className="mb-2 block">Campagne types</Label>
              <div className="flex gap-3">
                {["affiliate", "gifting", "paid"].map((t) => (
                  <button key={t} type="button" onClick={() => toggleCampagne(t)}
                    className={cn("px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition",
                      campagneTypes.includes(t) ? "border-[#ff0050] bg-red-50 text-[#ff0050]" : "border-gray-200 text-gray-600"
                    )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setVerifiedSeller(!verifiedSeller)}
                  className={cn("w-11 h-6 rounded-full transition-colors", verifiedSeller ? "bg-[#ff0050]" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5", verifiedSeller ? "translate-x-5" : "")} />
                </button>
                <Label>TikTok Shop Verified Seller</Label>
              </div>
              <div className="flex items-center gap-3 ml-6">
                <button type="button" onClick={() => setBeschikbaar(!beschikbaar)}
                  className={cn("w-11 h-6 rounded-full transition-colors", beschikbaar ? "bg-green-500" : "bg-gray-300")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5", beschikbaar ? "translate-x-5" : "")} />
                </button>
                <Label>Beschikbaar voor campagnes</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button form="profiel-form" type="submit" className="bg-[#ff0050] hover:bg-[#ff337a]" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Opslaan...</> : "Profiel opslaan"}
        </Button>
      </div>

      {/* Preview kaart */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Zo ziet een brand jou</p>
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#1a0533] flex items-center justify-center text-white font-bold text-sm">
                    {(watchedValues.display_name || watchedValues.tiktok_handle || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{watchedValues.display_name || "Display naam"}</p>
                    <p className="text-xs text-gray-500">@{watchedValues.tiktok_handle || "handle"}</p>
                  </div>
                </div>
                <MatchScore score={82} size="sm" />
              </div>
              <div className="flex gap-3 text-xs text-gray-600 mb-3">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(watchedValues.follower_count || 0)}</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{watchedValues.avg_engagement_rate || 0}%</span>
                <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />€{watchedValues.gmv_30d || 0}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {niches.slice(0, 3).map((n) => <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>)}
                {verifiedSeller && <Badge variant="success" className="text-xs">Verified</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
